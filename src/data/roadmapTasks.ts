import { ArchitectTask } from '../types/sightline';

export const INB_ROADMAP_TASKS: ArchitectTask[] = [
  {
    id: 'task-1',
    taskNumber: 1,
    title: 'Atomic Speech-to-Patch Pipeline (Zero-Cost Web Speech API to Yjs)',
    stage: 'Stage 1: Core Loop Stabilization',
    objective:
      'Integrate browser-native Web Speech API with an intent parser that converts human verbal corrections (e.g., "Correct box 2 to industrial forklift", "Verify crane", "Confidence 100%") directly into atomic, immutable Yjs patches without any paid STT APIs.',
    technicalDetails: {
      yjsImpact:
        'Target object is read from doc.getMap("visualObjects").get(id). A cloned object is formed with updated fields. No in-place mutations. Applied via doc.transact(() => map.set(id, updatedObject)).',
      immutableState:
        'Clones current object: { ...existing, current: { ...existing.current, name: parsedName, confidence: 1.0 }, history: [...existing.history, patchEntry], status: "corrected" }.',
      historyLogic:
        'Calculates diff between existing.current and new values. Records only fields that actually changed (e.g. name, confidence) under author: "human" with ISO timestamp.',
      observerRendering:
        'WebRTC observer triggers single component render. Voice processing UI provides instant visual badge feedback and speech waveform state without re-triggering map listeners.',
    },
    workerInstruction: `[HAND-OFF TO CONTINUE.DEV / QODER]
Target File: src/services/speechCorrection.ts & src/components/SpeechController.tsx
Context: INB Sightline CRDT Engine.
Rules to Enforce:
1. Initialize window.webkitSpeechRecognition / SpeechRecognition with continuous: false and interimResults: false.
2. When parsing text, extract object selector (by name or index) and target attribute (name, status, coordinates).
3. DO NOT mutate the object directly (e.g., obj.current.name = text is strictly prohibited).
4. Fetch existing object via crdtEngine.getAllObjects() or direct id lookup.
5. Call crdtEngine.applyPatch(objectId, { name: newLabel, confidence: 1.0 }, 'human', 'corrected').
6. Ensure any unverified fields are left untouched in the history diff.`,
    status: 'completed',
    targetWorker: 'Continue.dev',
  },
  {
    id: 'task-2',
    taskNumber: 2,
    title: 'Precision Bounding Box Drag & Resize with Immutable Coordinate Normalization',
    stage: 'Stage 1: Core Loop Stabilization',
    objective:
      'Build interactive SVG/HTML5 canvas handles on detected visual bounding boxes, allowing human annotators to resize or translate bounding boxes with real-time visual drag feedback, committing to Yjs ONLY upon pointer-up (drag-end) to prevent network/CRDT broadcast flooding.',
    technicalDetails: {
      yjsImpact:
        'During active pointer drag: local transient React ref state updates canvas overlay at 60fps. On onPointerUp / onDragEnd: single crdtEngine.applyPatch() call commits final normalized [x1, y1, x2, y2].',
      immutableState:
        'Coordinates are clamped to [0, 100]% viewport boundary and rounded to 2 decimal places to avoid floating point jitter. Coordinates array is cloned as [...newCoords].',
      historyLogic:
        'Diff checks oldCoords vs newCoords. Only appends to history if delta > 0.5% threshold. Logs field: "coordinates" with { oldValue, newValue } under author: "human".',
      observerRendering:
        'UI observer receives WebRTC update and syncs remote peer boxes without disrupting any locally active drag handles (locks active pointer target from remote override).',
    },
    workerInstruction: `[HAND-OFF TO CONTINUE.DEV / QODER]
Target File: src/components/BoundingBoxOverlay.tsx
Context: Real-time visual object canvas with WebRTC multi-user sync.
Rules to Enforce:
1. Maintain local transient coordinates in React state during mouse/touch drag. Do NOT call Yjs map.set on every mousemove event.
2. On mouseup/pointerup, check if coordinates actually changed compared to the Yjs store.
3. If changed, invoke crdtEngine.applyPatch(obj.id, { coordinates: [x1, y1, x2, y2] }, 'human').
4. The history entry must record oldValue as the original coordinates array and newValue as the new coordinates array.
5. Prevent duplicate observer triggers by checking if current user is actively dragging that specific box ID.`,
    status: 'completed',
    targetWorker: 'Qoder',
  },
  {
    id: 'task-3',
    taskNumber: 3,
    title: 'Dual-Column Verification & CRDT Conflict Audit Replay Viewer',
    stage: 'Stage 2: Public Interactive Demo & Build-in-Public',
    objective:
      'Construct a comprehensive audit and history timeline inspector displaying the complete cryptographic sequence of changes (AI inference baseline → human hover patch → voice patch → verification), allowing 1-click step-back inspection and diff comparison.',
    technicalDetails: {
      yjsImpact:
        'Reads val.history array from doc.getMap("visualObjects"). Enables time-travel preview mode (visualizing object state at history[index]) without mutating the live Yjs head state unless user clicks "Revert to this snapshot".',
      immutableState:
        'When rolling back: produces a new history entry with author: "human" and changes: { revertedFrom: ..., restoredState: ... } rather than truncating the history array (preserving append-only CRDT invariant).',
      historyLogic:
        'Never overwrite or pop history elements. Each record retains timestamp, author ("ai" | "human"), and deep diff object.',
      observerRendering:
        'Inspector subscribes to Yjs map updates. Selection of an object highlights its bounding box with an ambient pulse ring and opens its audit card in the side panel.',
    },
    workerInstruction: `[HAND-OFF TO CONTINUE.DEV / QODER]
Target File: src/components/AuditHistoryInspector.tsx
Context: INB Sightline History & Verification Log.
Rules to Enforce:
1. Render history list chronologically. Display author pill (Human vs AI) with distinct clean typographic separation.
2. Render granular key-value change diffs (e.g. name: "pallet" -> "forklift", confidence: 0.64 -> 1.0).
3. If providing a "Rollback" action: DO NOT truncate history array. Create a new patch that restores previous values and appends a new history item.
4. Ensure no stale state reads by obtaining fresh copy from crdtEngine.getAllObjects().`,
    status: 'completed',
    targetWorker: 'Continue.dev',
  },
  {
    id: 'task-4',
    taskNumber: 4,
    title: 'Zero-Cost Multi-Peer Room Synchronization & Presence Signaling',
    stage: 'Stage 2: Public Interactive Demo & Build-in-Public',
    objective:
      'Provide zero-cost decentralized peer-to-peer room collaboration using free public WebRTC signaling servers. Enable users to share a room link or toggle between simulated multi-peer windows to demonstrate instantaneous sub-50ms CRDT convergence.',
    technicalDetails: {
      yjsImpact:
        'WebrtcProvider connects Y.Doc across browser clients. Awareness protocol syncs peer cursor positions, active selection IDs, and active human editor avatars.',
      immutableState:
        'Peer presence states are managed via provider.awareness.setLocalStateField("user", { name, color, selectedId }). Stored outside doc.getMap to prevent polluting visual object history.',
      historyLogic:
        'Visual object history remains strictly dedicated to visual semantic edits. Transient presence/cursor movements do not write to visualObjects map.',
      observerRendering:
        'Awareness changes trigger a dedicated presence hook without re-rendering the full bounding box geometry trees unnecessarily.',
    },
    workerInstruction: `[HAND-OFF TO CONTINUE.DEV / QODER]
Target File: src/services/webrtcSync.ts & src/components/CollaborationBar.tsx
Context: WebRTC Signaling & Room Sharing.
Rules to Enforce:
1. Use y-webrtc with fallback public signaling servers (wss://signaling.yjs.dev, etc.).
2. Handle offline/sandboxed environments gracefully without throwing uncaught exceptions.
3. Show connected peer count, current room ID, and a "Copy Collaboration Link" button.
4. Separate awareness (cursors, user presence) from the persistent visualObjects map so that cursor movements do not generate Yjs history logs.`,
    status: 'completed',
    targetWorker: 'Qoder',
  },
  {
    id: 'task-5',
    taskNumber: 5,
    title: 'Model Uncertainty Heuristic & Human Correction Triage Queue',
    stage: 'Stage 3: Inbound Monetization & Data Cleaning Route',
    objective:
      'Implement an automated triage queue that surfaces low-confidence AI detections (< 0.85 confidence or ambiguous overlapping boxes) into a fast-key workflow ("1" to verify, "2" to re-label, "3" to discard), optimizing human-in-the-loop throughput by 10x.',
    technicalDetails: {
      yjsImpact:
        'Queue operates as a prioritized projection over visualObjectsMap. Objects with status === "uncertain" are sorted by confidence ascending.',
      immutableState:
        'Keyboard shortcuts invoke crdtEngine.applyPatch(id, updates, "human"). State transition from "uncertain" -> "verified" or "corrected" happens atomically.',
      historyLogic:
        'Quick-verification records field "status": { oldValue: "uncertain", newValue: "verified" } and field "confidence": { oldValue: X, newValue: 1.0 }.',
      observerRendering:
        'Triage queue updates dynamically as peer workers verify items, automatically scrolling to the next pending item with zero latency.',
    },
    workerInstruction: `[HAND-OFF TO CONTINUE.DEV / QODER]
Target File: src/components/TriageQueue.tsx
Context: High-speed verification queue for commercial data cleaning.
Rules to Enforce:
1. Filter objects from crdtEngine by status === 'uncertain'. Sort by confidence ascending.
2. Bind keyboard shortcuts: 'V' or 'Enter' = Verify with 100% confidence, 'E' = Open label edit, 'Backspace'/'Delete' = Flag as invalid.
3. Every shortcut action must execute through crdtEngine.applyPatch to ensure atomic Yjs updates and clean history diffs.
4. Do not mutate object in place! Always dispatch immutable patches.`,
    status: 'completed',
    targetWorker: 'Continue.dev',
  },
  {
    id: 'task-6',
    taskNumber: 6,
    title: 'Commercial Data Export Engine (COCO, Pascal VOC & Verified JSON-LD)',
    stage: 'Stage 3: Inbound Monetization (Route B Data-Cleaning)',
    objective:
      'Allow enterprise clients to export verified, human-corrected ground truth datasets directly into standard machine learning training formats (COCO JSON, Pascal VOC XML, and Verified Sightline Audit JSON), unlocking our initial $100 to $1,000 packaging contracts.',
    technicalDetails: {
      yjsImpact:
        'Read-only serialization of visualObjectsMap. Validates that exported datasets contain verified/corrected objects with verifiable audit trails.',
      immutableState:
        'Converts normalized [x1, y1, x2, y2] into standard pixel bounding box representations [x, y, width, height] based on image intrinsic dimensions.',
      historyLogic:
        'Includes metadata on human verification ratio (e.g., "78% AI baseline + 22% Human Corrections") and cryptographic change count.',
      observerRendering:
        'Export modal generates download blob client-side with 0 server compute cost.',
    },
    workerInstruction: `[HAND-OFF TO CONTINUE.DEV / QODER]
Target File: src/services/datasetExport.ts & src/components/ExportModal.tsx
Context: Commercial dataset packaging.
Rules to Enforce:
1. Extract current visualObjects from crdtEngine.
2. Build COCO format: images[], annotations[] with category_id, bbox [x, y, w, h], and segmentation.
3. Include Sightline Provenance block: timestamps, verification author, and audit chain.
4. Generate file download using URL.createObjectURL(new Blob([data], { type: 'application/json' })). No external server dependencies.`,
    status: 'completed',
    targetWorker: 'Qoder',
  },
  {
    id: 'task-7',
    taskNumber: 7,
    title: 'Scale & Monetization Telemetry Funnel ($0 to $1M+ PLG Engine)',
    stage: 'Stage 4: Product-Led Growth & Commercial Scaling',
    objective:
      'Embed our zero-cost commercial flywheel dashboard directly into the Lead Architect console: showing conversion economics, per-object human correction speed, verified dataset value multiplier, and programmatic API webhook endpoints for paid enterprise batches.',
    technicalDetails: {
      yjsImpact:
        'Maintains calculation metrics derived from the live CRDT doc: total objects, verified ratio, human correction time per object, and estimated dataset bounty valuation.',
      immutableState:
        'State stored in memory / client analytics without external tracking cookies, adhering strictly to privacy and zero-cost constraints.',
      historyLogic:
        'Aggregates velocity data across history entries: computes average seconds between AI creation and human patch.',
      observerRendering:
        'Real-time metrics update smoothly as human operators correct or verify bounding boxes.',
    },
    workerInstruction: `[HAND-OFF TO CONTINUE.DEV / QODER]
Target File: src/components/CommercialFlywheel.tsx
Context: Commercial scaling metrics & revenue progression tracking.
Rules to Enforce:
1. Calculate live metrics: Total Objects, Corrected Count, Verified Count, Time-to-Correct (ms).
2. Render the 4-stage organic growth ladder: $0->$100, $1K, $10K, $100K, $1M+ with live conversion milestones.
3. Include interactive tier simulator for Route A (Volume processing API) and Route B (Specialized clean dataset packaging).
4. Keep interface ultra-clean, adhering to anti-slop guidelines (no fake server tickers, authentic metrics derived directly from CRDT state).`,
    status: 'completed',
    targetWorker: 'Continue.dev',
  },
];
