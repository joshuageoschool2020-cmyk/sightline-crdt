import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  VisualObject, 
  ScenePreset, 
  ObjectStatus 
} from '../types/sightline';
import { 
  Check, 
  Edit3, 
  Mic, 
  Trash2, 
  Plus, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Sparkles,
  Maximize2,
  Crown,
  Zap
} from 'lucide-react';

interface VisualCanvasProps {
  scene: ScenePreset;
  objects: VisualObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onApplyPatch: (id: string, updates: Partial<VisualObject['current']>, author?: 'human' | 'ai', status?: ObjectStatus) => void;
  onDeleteObject: (id: string) => void;
  onAddObject: (newObj: VisualObject) => void;
  onResetScene: () => void;
  onOpenVoiceModal: (targetObjId: string) => void;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  scene,
  objects,
  selectedObjectId,
  onSelectObject,
  onApplyPatch,
  onDeleteObject,
  onAddObject,
  onResetScene,
  onOpenVoiceModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);
  const [isDrawingNewBox, setIsDrawingNewBox] = useState(false);
  const [newBoxDraft, setNewBoxDraft] = useState<[number, number, number, number] | null>(null);
  const [dragState, setDragState] = useState<{
    objectId: string;
    mode: 'move' | 'nw' | 'ne' | 'se' | 'sw';
    startX: number;
    startY: number;
    initialCoords: [number, number, number, number];
    currentCoords: [number, number, number, number];
  } | null>(null);

  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickEditText, setQuickEditText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  const handleRunAiAutoDetect = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanNotification('Initializing Rolls-Royce Multi-Scale Vision Inference...');

    setTimeout(() => {
      // 1. Resolve or verify uncertain objects
      const uncertain = objects.filter((o) => o.status === 'uncertain');
      uncertain.forEach((u) => {
        onApplyPatch(
          u.id, 
          { confidence: 0.98, name: u.current.name.replace(' (Uncertain)', '') }, 
          'ai', 
          'verified'
        );
      });

      // 2. Synthesize a pristine micro-target object detection
      const newObjectId = `rr-detected-${Date.now()}`;
      const detectedName = scene.id.includes('logistics') 
        ? 'High-Bandwidth Barcode Scanner' 
        : scene.id.includes('autonomous') 
        ? 'LiDAR Reflectance Calibration Mark' 
        : scene.id.includes('surgical') 
        ? 'Micro-Vascular Hemostatic Boundary' 
        : scene.id.includes('retail') 
        ? 'Shelf Depth Telemetry Marker' 
        : 'Sub-Pixel Neural Target';

      const newCoordinates: [number, number, number, number] = [
        Math.floor(25 + Math.random() * 20),
        Math.floor(15 + Math.random() * 25),
        Math.floor(55 + Math.random() * 20),
        Math.floor(55 + Math.random() * 25)
      ];

      const newObj: VisualObject = {
        id: newObjectId,
        current: {
          name: detectedName,
          confidence: 0.99,
          coordinates: newCoordinates,
        },
        history: [
          {
            timestamp: new Date().toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: detectedName },
              confidence: { oldValue: null, newValue: 0.99 },
              coordinates: { oldValue: null, newValue: newCoordinates },
            },
          },
        ],
        status: 'verified',
      };

      onAddObject(newObj);
      onSelectObject(newObjectId);
      setIsScanning(false);
      setScanNotification('✨ Rolls-Royce AI Engine: Auto-detected & synced sub-pixel target into CRDT room!');

      setTimeout(() => {
        setScanNotification(null);
      }, 4500);
    }, 1100);
  };

  // Handle pointer down for resizing / moving existing boxes
  const handlePointerDown = (
    e: React.PointerEvent,
    objectId: string,
    mode: 'move' | 'nw' | 'ne' | 'se' | 'sw',
    coords: [number, number, number, number]
  ) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    onSelectObject(objectId);
    setDragState({
      objectId,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      initialCoords: [...coords],
      currentCoords: [...coords],
    });
  };

  // Drag movement (throttled to frame, updates local React state only, NO Yjs writes here)
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDrawingNewBox && newBoxDraft && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const currentY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setNewBoxDraft([
        Math.min(newBoxDraft[0], currentX),
        Math.min(newBoxDraft[1], currentY),
        Math.max(newBoxDraft[0], currentX),
        Math.max(newBoxDraft[1], currentY),
      ]);
      return;
    }

    if (!dragState || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - dragState.startX) / rect.width) * 100;
    const deltaYPercent = ((e.clientY - dragState.startY) / rect.height) * 100;

    const [x1, y1, x2, y2] = dragState.initialCoords;
    let next: [number, number, number, number] = [x1, y1, x2, y2];

    if (dragState.mode === 'move') {
      const width = x2 - x1;
      const height = y2 - y1;
      let nx1 = Math.max(0, Math.min(100 - width, x1 + deltaXPercent));
      let ny1 = Math.max(0, Math.min(100 - height, y1 + deltaYPercent));
      next = [
        Math.round(nx1 * 10) / 10,
        Math.round(ny1 * 10) / 10,
        Math.round((nx1 + width) * 10) / 10,
        Math.round((ny1 + height) * 10) / 10,
      ];
    } else if (dragState.mode === 'se') {
      next = [
        x1,
        y1,
        Math.max(x1 + 4, Math.min(100, Math.round((x2 + deltaXPercent) * 10) / 10)),
        Math.max(y1 + 4, Math.min(100, Math.round((y2 + deltaYPercent) * 10) / 10)),
      ];
    } else if (dragState.mode === 'nw') {
      next = [
        Math.min(x2 - 4, Math.max(0, Math.round((x1 + deltaXPercent) * 10) / 10)),
        Math.min(y2 - 4, Math.max(0, Math.round((y1 + deltaYPercent) * 10) / 10)),
        x2,
        y2,
      ];
    } else if (dragState.mode === 'ne') {
      next = [
        x1,
        Math.min(y2 - 4, Math.max(0, Math.round((y1 + deltaYPercent) * 10) / 10)),
        Math.max(x1 + 4, Math.min(100, Math.round((x2 + deltaXPercent) * 10) / 10)),
        y2,
      ];
    } else if (dragState.mode === 'sw') {
      next = [
        Math.min(x2 - 4, Math.max(0, Math.round((x1 + deltaXPercent) * 10) / 10)),
        y1,
        x2,
        Math.max(y1 + 4, Math.min(100, Math.round((y2 + deltaYPercent) * 10) / 10)),
      ];
    }

    setDragState((prev) => (prev ? { ...prev, currentCoords: next } : null));
  }, [dragState, isDrawingNewBox, newBoxDraft]);

  // Pointer Up: The ONLY place we commit coordinate changes to Yjs CRDT map!
  const handlePointerUp = useCallback(() => {
    if (isDrawingNewBox && newBoxDraft) {
      const width = newBoxDraft[2] - newBoxDraft[0];
      const height = newBoxDraft[3] - newBoxDraft[1];
      if (width > 4 && height > 4) {
        const newId = `obj-custom-${Date.now()}`;
        const newObject: VisualObject = {
          id: newId,
          current: {
            name: 'Annotated Region',
            confidence: 1.0,
            coordinates: [
              Math.round(newBoxDraft[0] * 10) / 10,
              Math.round(newBoxDraft[1] * 10) / 10,
              Math.round(newBoxDraft[2] * 10) / 10,
              Math.round(newBoxDraft[3] * 10) / 10,
            ],
          },
          history: [
            {
              timestamp: new Date().toISOString(),
              author: 'human',
              changes: {
                created: { oldValue: null, newValue: 'Annotated Region' },
              },
            },
          ],
          status: 'verified',
        };
        onAddObject(newObject);
        onSelectObject(newId);
      }
      setIsDrawingNewBox(false);
      setNewBoxDraft(null);
      return;
    }

    if (!dragState) return;

    // Check if coordinates genuinely changed
    const [ox1, oy1, ox2, oy2] = dragState.initialCoords;
    const [cx1, cy1, cx2, cy2] = dragState.currentCoords;
    const hasMoved = ox1 !== cx1 || oy1 !== cy1 || ox2 !== cx2 || oy2 !== cy2;

    if (hasMoved) {
      // Commit cleanly to Yjs CRDT map
      onApplyPatch(dragState.objectId, {
        coordinates: dragState.currentCoords,
      }, 'human');
    }

    setDragState(null);
  }, [dragState, isDrawingNewBox, newBoxDraft, onAddObject, onApplyPatch, onSelectObject]);

  // Container pointer down for drawing new bounding box
  const handleContainerPointerDown = (e: React.PointerEvent) => {
    if (!isDrawingNewBox || !containerRef.current) {
      onSelectObject(null);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const startX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const startY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setNewBoxDraft([startX, startY, startX, startY]);
  };

  // Keyboard shortcut listener for active selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedObjectId) return;
      // If typing in input, ignore
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'v' || e.key === 'V') {
        // Quick verify
        onApplyPatch(selectedObjectId, { confidence: 1.0 }, 'human', 'verified');
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        onDeleteObject(selectedObjectId);
        onSelectObject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjectId, onApplyPatch, onDeleteObject, onSelectObject]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none">
      {/* Control bar above canvas */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="text-slate-400">Scene:</span>
            <span>{scene.title}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{scene.category}</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Uncertain
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Human Corrected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiAutoDetect}
            disabled={isScanning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-md ${
              isScanning
                ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
            }`}
            title="Neural Vision Superpower: Run zero-shot multimodal neural inference and auto-resolve edge cases"
          >
            <Crown className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isScanning ? 'Neural Engine Scanning...' : 'AI Vision Auto-Detect'}</span>
          </button>

          <button
            onClick={() => setIsDrawingNewBox(!isDrawingNewBox)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isDrawingNewBox
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isDrawingNewBox ? 'Click & Drag to Draw Box' : 'Add Bounding Box'}</span>
          </button>

          <button
            onClick={onResetScene}
            title="Reset to baseline AI detections"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scene</span>
          </button>
        </div>
      </div>

      {/* Rolls-Royce HUD Floating Banner */}
      {scanNotification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gradient-to-r from-slate-900 via-amber-950/90 to-slate-900 border border-amber-500/50 rounded-xl shadow-2xl flex items-center gap-2 text-xs text-amber-300 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="font-semibold">{scanNotification}</span>
        </div>
      )}

      {/* Main Canvas Area */}
      <div 
        className="relative flex-1 flex items-center justify-center p-6 overflow-hidden bg-slate-950"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          ref={containerRef}
          onPointerDown={handleContainerPointerDown}
          className={`relative max-w-full max-h-[70vh] aspect-[16/10] w-full rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group ${
            isDrawingNewBox ? 'cursor-crosshair' : 'cursor-default'
          }`}
        >
          {/* Base Photographic Scene */}
          <img
            src={scene.imageUrl}
            alt={scene.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover pointer-events-none select-none"
          />

          {/* Dark scrim overlay for high-contrast annotation */}
          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

          {/* Rolls-Royce Neural Scan Laser Overlay */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500 shadow-[0_0_25px_#f59e0b] animate-bounce" />
              <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-[1px]" />
              <div className="absolute top-4 left-4 px-2.5 py-1 bg-slate-950/90 border border-amber-500/50 rounded text-[11px] font-mono text-amber-300">
                AI SCANNING: MULTI-SCALE FEATURE PYRAMID ACTIVE
              </div>
            </div>
          )}

          {/* Render Bounding Boxes */}
          {objects.map((obj) => {
            const isSelected = selectedObjectId === obj.id;
            const isHovered = hoveredObjectId === obj.id;
            const isDraggingThis = dragState?.objectId === obj.id;

            // Use live transient coordinates during dragging, or authoritative Yjs coords
            const [x1, y1, x2, y2] = isDraggingThis ? dragState.currentCoords : obj.current.coordinates;
            const width = Math.max(2, x2 - x1);
            const height = Math.max(2, y2 - y1);

            // Color scheme based on status
            let borderColor = 'border-amber-400';
            let bgColor = 'bg-amber-500/15';
            let badgeBg = 'bg-amber-500 text-slate-950';

            if (obj.status === 'verified') {
              borderColor = 'border-emerald-500';
              bgColor = 'bg-emerald-500/10';
              badgeBg = 'bg-emerald-500 text-white';
            } else if (obj.status === 'corrected') {
              borderColor = 'border-indigo-400';
              bgColor = 'bg-indigo-500/15';
              badgeBg = 'bg-indigo-500 text-white';
            }

            return (
              <div
                key={obj.id}
                style={{
                  left: `${x1}%`,
                  top: `${y1}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
                onMouseEnter={() => setHoveredObjectId(obj.id)}
                onMouseLeave={() => setHoveredObjectId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectObject(obj.id);
                }}
                className={`absolute border-2 transition-shadow cursor-move ${borderColor} ${bgColor} ${
                  isSelected ? 'ring-2 ring-white shadow-xl z-30' : 'z-10'
                } ${isDraggingThis ? 'opacity-90 z-40' : ''}`}
                onPointerDown={(e) => handlePointerDown(e, obj.id, 'move', [x1, y1, x2, y2])}
              >
                {/* Header label badge */}
                <div
                  className={`absolute -top-7 left-0 px-2 py-0.5 rounded text-[11px] font-medium tracking-tight whitespace-nowrap flex items-center gap-1.5 shadow-md ${badgeBg} pointer-events-auto`}
                >
                  <span>{obj.current.name}</span>
                  <span className="text-[9px] opacity-80 tabular-nums">
                    {Math.round(obj.current.confidence * 100)}%
                  </span>
                  {obj.status === 'uncertain' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping ml-0.5" />
                  )}
                </div>

                {/* Quick Action Bar on Hover/Selection */}
                {(isHovered || isSelected) && !isDraggingThis && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -bottom-9 left-0 flex items-center gap-1 bg-slate-900/95 backdrop-blur-md px-1.5 py-1 rounded-md border border-slate-700 shadow-xl z-40"
                  >
                    {obj.status !== 'verified' && (
                      <button
                        title="Verify (1.0 confidence)"
                        onClick={() => onApplyPatch(obj.id, { confidence: 1.0 }, 'human', 'verified')}
                        className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-medium transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Verify</span>
                      </button>
                    )}

                    <button
                      title="Speak Correction (Speech-to-Patch)"
                      onClick={() => onOpenVoiceModal(obj.id)}
                      className="p-1 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 rounded transition-colors"
                    >
                      <Mic className="w-3 h-3" />
                    </button>

                    <button
                      title="Quick Edit Label"
                      onClick={() => {
                        setQuickEditId(obj.id);
                        setQuickEditText(obj.current.name);
                      }}
                      className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>

                    <button
                      title="Delete Object"
                      onClick={() => onDeleteObject(obj.id)}
                      className="p-1 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Resize Handles (Corner Anchors) */}
                {isSelected && (
                  <>
                    {/* NW Handle */}
                    <div
                      onPointerDown={(e) => handlePointerDown(e, obj.id, 'nw', [x1, y1, x2, y2])}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-slate-900 rounded-xs cursor-nwse-resize shadow-xs"
                    />
                    {/* NE Handle */}
                    <div
                      onPointerDown={(e) => handlePointerDown(e, obj.id, 'ne', [x1, y1, x2, y2])}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-slate-900 rounded-xs cursor-nesw-resize shadow-xs"
                    />
                    {/* SE Handle */}
                    <div
                      onPointerDown={(e) => handlePointerDown(e, obj.id, 'se', [x1, y1, x2, y2])}
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-slate-900 rounded-xs cursor-nwse-resize shadow-xs"
                    />
                    {/* SW Handle */}
                    <div
                      onPointerDown={(e) => handlePointerDown(e, obj.id, 'sw', [x1, y1, x2, y2])}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-slate-900 rounded-xs cursor-nesw-resize shadow-xs"
                    />
                  </>
                )}
              </div>
            );
          })}

          {/* Draft Box being drawn */}
          {newBoxDraft && (
            <div
              style={{
                left: `${newBoxDraft[0]}%`,
                top: `${newBoxDraft[1]}%`,
                width: `${newBoxDraft[2] - newBoxDraft[0]}%`,
                height: `${newBoxDraft[3] - newBoxDraft[1]}%`,
              }}
              className="absolute border-2 border-dashed border-amber-400 bg-amber-500/20 pointer-events-none z-50"
            >
              <span className="absolute -top-6 left-0 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-semibold rounded">
                Drafting Box
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Edit Modal */}
      {quickEditId && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-sm w-full shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">Edit Object Label</h3>
            <p className="text-xs text-slate-400 mb-4">
              Apply immutable patch to Yjs store. Will update status to <span className="text-indigo-400 font-mono">corrected</span>.
            </p>
            <input
              type="text"
              autoFocus
              value={quickEditText}
              onChange={(e) => setQuickEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onApplyPatch(quickEditId, { name: quickEditText }, 'human', 'corrected');
                  setQuickEditId(null);
                } else if (e.key === 'Escape') {
                  setQuickEditId(null);
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setQuickEditId(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApplyPatch(quickEditId, { name: quickEditText }, 'human', 'corrected');
                  setQuickEditId(null);
                }}
                className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                Apply Immutable Patch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
