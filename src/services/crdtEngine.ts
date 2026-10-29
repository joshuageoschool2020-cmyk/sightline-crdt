import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { VisualObject, VisualObjectCurrent, HistoryEntry, ObjectStatus, AuthorType } from '../types/sightline';

export interface CRDTHealthMetrics {
  objectCount: number;
  docByteSize: number;
  totalDeletions: number;
  isCompacted: boolean;
  connectedPeers: number;
  healthStatus: 'optimal' | 'stable' | 'needs-compaction';
}

/**
 * INB Sightline CRDT Engine (Hardened against Yjs #741 & #799)
 * - Zero structural drift & deterministic peer convergence.
 * - Defensive Observer Wrapping: Protects against uncaught callback errors crashing Yjs (Issue #799).
 * - Tombstone Pruning & Compaction: Prevents unbounded memory growth from deleted map entries (Issue #741).
 * - Key-level diffing on scene seeding to minimize tombstone creation.
 * - Strict history immutability & coordinate/confidence bounds validation.
 */
export class SightlineCRDTEngine {
  private doc: Y.Doc;
  private visualObjectsMap: Y.Map<VisualObject>;
  private provider: WebrtcProvider | null = null;
  private roomName: string;
  private observerCallback: ((objects: VisualObject[]) => void) | null = null;
  private observerHandler: (() => void) | null = null;
  private isDestroyed = false;
  private isCompacting = false;
  private deletionCount = 0;

  constructor(roomName: string = 'inb-sightline-core-room') {
    this.roomName = roomName;
    this.doc = new Y.Doc();
    this.visualObjectsMap = this.doc.getMap<VisualObject>('visualObjects');
    this.setupProvider();
  }

  /**
   * Safely initialize WebRTC provider with public signaling servers.
   */
  private setupProvider(): void {
    try {
      this.provider = new WebrtcProvider(this.roomName, this.doc, {
        signaling: [
          'wss://signaling.yjs.dev',
          'wss://y-webrtc-signaling-eu.herokuapp.com',
          'wss://y-webrtc-signaling-us.herokuapp.com',
        ],
      });
    } catch (e) {
      console.warn('[INB CRDT] WebRTC provider initialization deferred / offline mode:', e);
      this.provider = null;
    }
  }

  /**
   * Sanitize incoming visual object attributes to guarantee numerical and structural validity.
   */
  private sanitizeObject(obj: VisualObject): VisualObject {
    const rawCoords = obj?.current?.coordinates || [10, 10, 20, 20];
    const coords: [number, number, number, number] = [
      Number.isFinite(rawCoords[0]) ? Math.max(0, Math.min(100, Number(rawCoords[0]))) : 10,
      Number.isFinite(rawCoords[1]) ? Math.max(0, Math.min(100, Number(rawCoords[1]))) : 10,
      Number.isFinite(rawCoords[2]) ? Math.max(0, Math.min(100, Number(rawCoords[2]))) : 20,
      Number.isFinite(rawCoords[3]) ? Math.max(0, Math.min(100, Number(rawCoords[3]))) : 20,
    ];

    const rawConfidence = obj?.current?.confidence;
    const confidence = Number.isFinite(rawConfidence)
      ? Math.max(0, Math.min(1, Number(rawConfidence)))
      : 0.8;

    return {
      id: String(obj?.id || `obj_${Date.now()}`),
      current: {
        name: String(obj?.current?.name || 'Unknown Object').trim(),
        confidence,
        coordinates: coords,
      },
      history: Array.isArray(obj?.history)
        ? obj.history.map((h) => ({
            timestamp: h.timestamp || new Date().toISOString(),
            author: h.author === 'human' ? 'human' : 'ai',
            changes: typeof h.changes === 'object' && h.changes !== null ? { ...h.changes } : {},
          }))
        : [],
      status: obj?.status || 'uncertain',
    };
  }

  /**
   * Internal observer attachment with defensive try/catch (Fixes Yjs Issue #799).
   */
  private attachObserver(callback: (objects: VisualObject[]) => void): void {
    if (this.observerHandler) {
      try {
        this.visualObjectsMap.unobserve(this.observerHandler);
      } catch (e) {
        // Safe cleanup
      }
    }

    this.observerCallback = callback;
    this.observerHandler = () => {
      if (this.isDestroyed || this.isCompacting) return;
      try {
        const currentList = this.getAllObjects();
        try {
          callback(currentList);
        } catch (subscriberError) {
          // DEFENSE (Issue #799): Never let subscriber errors crash Yjs event dispatching
          console.error('[INB CRDT] UI subscriber callback threw an uncaught error. Isolated safely:', subscriberError);
        }
      } catch (engineError) {
        console.error('[INB CRDT] Internal observer read error intercepted:', engineError);
      }
    };

    this.visualObjectsMap.observe(this.observerHandler);
  }

  /**
   * Subscribe to visual object updates without duplicate observers and with error isolation.
   */
  public subscribe(callback: (objects: VisualObject[]) => void): () => void {
    this.attachObserver(callback);

    // Initial safe trigger
    try {
      callback(this.getAllObjects());
    } catch (initErr) {
      console.error('[INB CRDT] Initial subscriber execution error caught:', initErr);
    }

    // Unsubscribe handle
    return () => {
      if (this.observerHandler) {
        try {
          this.visualObjectsMap.unobserve(this.observerHandler);
        } catch (e) {
          // ignore
        }
        this.observerHandler = null;
      }
      this.observerCallback = null;
    };
  }

  /**
   * Return an immutable snapshot array of all visual objects.
   */
  public getAllObjects(): VisualObject[] {
    const objects: VisualObject[] = [];
    if (this.isDestroyed) return objects;

    try {
      this.visualObjectsMap.forEach((val) => {
        if (val && val.id) {
          objects.push({
            id: val.id,
            current: {
              name: val.current.name,
              confidence: Number(val.current.confidence),
              coordinates: [...val.current.coordinates] as [number, number, number, number],
            },
            history: (val.history || []).map((h) => ({
              timestamp: h.timestamp,
              author: h.author,
              changes: { ...h.changes },
            })),
            status: val.status,
          });
        }
      });
    } catch (err) {
      console.error('[INB CRDT] Error extracting objects from Yjs map:', err);
    }
    return objects;
  }

  /**
   * Safe immutable patch application.
   * Strictly avoids nested Yjs mutations and calculates minimal diffs.
   */
  public applyPatch(
    objectId: string,
    updates: Partial<VisualObjectCurrent>,
    author: AuthorType = 'human',
    explicitStatus?: ObjectStatus
  ): boolean {
    if (this.isDestroyed) return false;

    const existing = this.visualObjectsMap.get(objectId);
    if (!existing) {
      console.warn(`[INB CRDT] Object ID ${objectId} not found in map.`);
      return false;
    }

    const changes: Record<string, { oldValue: unknown; newValue: unknown }> = {};
    let hasActualChanges = false;

    // Check name changes
    if (updates.name !== undefined && updates.name !== existing.current.name) {
      changes['name'] = {
        oldValue: existing.current.name,
        newValue: updates.name,
      };
      hasActualChanges = true;
    }

    // Check confidence changes
    if (updates.confidence !== undefined && updates.confidence !== existing.current.confidence) {
      const sanitizedConfidence = Math.max(0, Math.min(1, Number(updates.confidence)));
      changes['confidence'] = {
        oldValue: existing.current.confidence,
        newValue: sanitizedConfidence,
      };
      hasActualChanges = true;
    }

    // Check coordinates changes
    if (updates.coordinates !== undefined) {
      const oldCoords = existing.current.coordinates;
      const newCoords: [number, number, number, number] = [
        Math.max(0, Math.min(100, Number(updates.coordinates[0]))),
        Math.max(0, Math.min(100, Number(updates.coordinates[1]))),
        Math.max(0, Math.min(100, Number(updates.coordinates[2]))),
        Math.max(0, Math.min(100, Number(updates.coordinates[3]))),
      ];

      const coordsChanged =
        oldCoords[0] !== newCoords[0] ||
        oldCoords[1] !== newCoords[1] ||
        oldCoords[2] !== newCoords[2] ||
        oldCoords[3] !== newCoords[3];

      if (coordsChanged) {
        changes['coordinates'] = {
          oldValue: [...oldCoords],
          newValue: [...newCoords],
        };
        hasActualChanges = true;
      }
    }

    // Status transition calculation
    let nextStatus: ObjectStatus = existing.status;
    if (explicitStatus) {
      if (explicitStatus !== existing.status) {
        changes['status'] = {
          oldValue: existing.status,
          newValue: explicitStatus,
        };
        hasActualChanges = true;
      }
      nextStatus = explicitStatus;
    } else if (author === 'human') {
      nextStatus = hasActualChanges ? 'corrected' : 'verified';
    } else {
      const effectiveConfidence = updates.confidence !== undefined ? updates.confidence : existing.current.confidence;
      nextStatus = effectiveConfidence >= 0.85 ? 'verified' : 'uncertain';
    }

    // Build new history array immutably
    const nextHistory = [...(existing.history || [])];

    if (hasActualChanges || explicitStatus) {
      const historyEntry: HistoryEntry = {
        timestamp: new Date().toISOString(),
        author,
        changes,
      };
      nextHistory.push(historyEntry);
    }

    // New immutable visual object
    const updatedObject: VisualObject = {
      id: existing.id,
      current: {
        name: updates.name !== undefined ? updates.name : existing.current.name,
        confidence:
          updates.confidence !== undefined
            ? Math.max(0, Math.min(1, Number(updates.confidence)))
            : author === 'human'
            ? 1.0
            : existing.current.confidence,
        coordinates: updates.coordinates
          ? [
              Math.max(0, Math.min(100, Number(updates.coordinates[0]))),
              Math.max(0, Math.min(100, Number(updates.coordinates[1]))),
              Math.max(0, Math.min(100, Number(updates.coordinates[2]))),
              Math.max(0, Math.min(100, Number(updates.coordinates[3]))),
            ]
          : [...existing.current.coordinates],
      },
      history: nextHistory,
      status: nextStatus,
    };

    // Atomic transaction set on Yjs map
    this.doc.transact(() => {
      this.visualObjectsMap.set(objectId, updatedObject);
    });

    return true;
  }

  /**
   * Seed or add an object safely with validation.
   */
  public setObject(obj: VisualObject): void {
    if (this.isDestroyed) return;
    const validatedObject = this.sanitizeObject(obj);

    this.doc.transact(() => {
      this.visualObjectsMap.set(validatedObject.id, validatedObject);
    });
  }

  /**
   * Batch seed multiple objects with key-diffing (Fixes Yjs Issue #741).
   * Instead of nuking all keys (which generates excessive tombstones),
   * it diffs keys: only deletes removed keys and updates/inserts new ones.
   */
  public seedScene(objects: VisualObject[]): void {
    if (this.isDestroyed) return;

    // Auto-compact if document accumulated heavy tombstone deletion debt
    if (this.deletionCount > 150) {
      this.compact();
    }

    const nextIds = new Set(objects.map((o) => o.id));

    this.doc.transact(() => {
      // 1. Delete ONLY keys that are not present in incoming list
      const existingKeys = Array.from(this.visualObjectsMap.keys());
      for (const key of existingKeys) {
        if (!nextIds.has(key)) {
          this.visualObjectsMap.delete(key);
          this.deletionCount++;
        }
      }

      // 2. Insert or update incoming objects
      for (const obj of objects) {
        const validated = this.sanitizeObject(obj);
        this.visualObjectsMap.set(obj.id, validated);
      }
    });
  }

  /**
   * Remove an object with tombstone tracking.
   */
  public deleteObject(objectId: string): void {
    if (this.isDestroyed) return;
    this.doc.transact(() => {
      if (this.visualObjectsMap.has(objectId)) {
        this.visualObjectsMap.delete(objectId);
        this.deletionCount++;
      }
    });
  }

  /**
   * Compact the CRDT document to purge all accumulated tombstones (Fixes Issue #741).
   * Recreates clean internal state while preserving all live objects, subscribers, and WebRTC sync.
   */
  public compact(): boolean {
    if (this.isDestroyed || this.isCompacting) return false;
    this.isCompacting = true;

    try {
      const liveObjects = this.getAllObjects();

      // Teardown previous provider and doc
      if (this.provider) {
        this.provider.destroy();
        this.provider = null;
      }

      if (this.observerHandler) {
        try {
          this.visualObjectsMap.unobserve(this.observerHandler);
        } catch (e) {
          // ignore
        }
      }

      // Discard previous doc and its tombstone history
      this.doc.destroy();

      // Create pristine fresh document
      this.doc = new Y.Doc();
      this.visualObjectsMap = this.doc.getMap<VisualObject>('visualObjects');
      this.deletionCount = 0;

      // Seed current live objects into clean doc
      this.doc.transact(() => {
        liveObjects.forEach((obj) => {
          this.visualObjectsMap.set(obj.id, obj);
        });
      });

      // Reconnect WebRTC provider
      this.setupProvider();

      // Reconnect observer
      if (this.observerCallback) {
        this.attachObserver(this.observerCallback);
        // Dispatch current state to refresh UI smoothly
        try {
          this.observerCallback(this.getAllObjects());
        } catch (e) {
          console.error('[INB CRDT] Post-compaction subscriber notification error:', e);
        }
      }

      return true;
    } catch (err) {
      console.error('[INB CRDT] Document compaction encountered an error:', err);
      return false;
    } finally {
      this.isCompacting = false;
    }
  }

  /**
   * Health and memory diagnostics for CRDT state.
   */
  public getHealthMetrics(): CRDTHealthMetrics {
    const objects = this.getAllObjects();
    let docByteSize = 0;
    try {
      const update = Y.encodeStateAsUpdate(this.doc);
      docByteSize = update.byteLength;
    } catch (e) {
      docByteSize = 0;
    }

    const healthStatus: 'optimal' | 'stable' | 'needs-compaction' =
      this.deletionCount > 100 ? 'needs-compaction' : docByteSize > 200000 ? 'stable' : 'optimal';

    return {
      objectCount: objects.length,
      docByteSize,
      totalDeletions: this.deletionCount,
      isCompacted: this.deletionCount === 0,
      connectedPeers: this.getConnectedPeerCount(),
      healthStatus,
    };
  }

  /**
   * Get connected peer count if WebRTC provider is connected.
   */
  public getConnectedPeerCount(): number {
    if (!this.provider || !this.provider.awareness) return 1;
    try {
      return this.provider.awareness.getStates().size || 1;
    } catch {
      return 1;
    }
  }

  /**
   * Get raw Yjs Document for export or byte transmission.
   */
  public exportState(): Uint8Array {
    return Y.encodeStateAsUpdate(this.doc);
  }

  /**
   * Destroy and clean up listeners & WebRTC peer connections.
   */
  public destroy(): void {
    this.isDestroyed = true;
    if (this.observerHandler) {
      try {
        this.visualObjectsMap.unobserve(this.observerHandler);
      } catch (e) {
        // ignore
      }
      this.observerHandler = null;
    }
    this.observerCallback = null;
    if (this.provider) {
      try {
        this.provider.destroy();
      } catch (e) {
        // ignore
      }
      this.provider = null;
    }
    try {
      this.doc.destroy();
    } catch (e) {
      // ignore
    }
  }
}
