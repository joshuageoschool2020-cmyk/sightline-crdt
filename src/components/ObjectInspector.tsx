import React, { useState, useEffect } from 'react';
import { VisualObject, ObjectStatus } from '../types/sightline';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Mic, 
  History, 
  Check, 
  Clock, 
  User, 
  Bot,
  ExternalLink
} from 'lucide-react';

interface ObjectInspectorProps {
  selectedObject: VisualObject | null;
  allObjects: VisualObject[];
  onApplyPatch: (
    id: string, 
    updates: Partial<VisualObject['current']>, 
    author?: 'human' | 'ai', 
    status?: ObjectStatus
  ) => void;
  onOpenVoiceModal: (id: string) => void;
  onSelectObject: (id: string | null) => void;
}

export const ObjectInspector: React.FC<ObjectInspectorProps> = ({
  selectedObject,
  allObjects,
  onApplyPatch,
  onOpenVoiceModal,
  onSelectObject,
}) => {
  const [draftName, setDraftName] = useState('');
  const [draftConfidence, setDraftConfidence] = useState(0.85);

  useEffect(() => {
    if (selectedObject) {
      setDraftName(selectedObject.current.name);
      setDraftConfidence(selectedObject.current.confidence);
    }
  }, [selectedObject]);

  if (!selectedObject) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full text-slate-300 select-none">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Object Inspector & History
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Click any bounding box on the canvas to inspect its CRDT lineage and apply corrections.
          </p>
        </div>

        {/* Global Object List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-medium text-slate-400 mb-2 flex items-center justify-between">
            <span>Detected Scene Entities</span>
            <span className="text-[10px] text-slate-500 tabular-nums">{allObjects.length} objects</span>
          </div>

          {allObjects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => onSelectObject(obj.id)}
              className="w-full text-left p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/60 transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white group-hover:text-indigo-300 transition-colors">
                  {obj.current.name}
                </span>
                <span className={`text-[10px] font-mono tabular-nums ${
                  obj.status === 'verified' ? 'text-emerald-400' :
                  obj.status === 'corrected' ? 'text-indigo-400' : 'text-amber-400'
                }`}>
                  {Math.round(obj.current.confidence * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="capitalize">{obj.status}</span>
                <span className="tabular-nums font-mono">{obj.history.length} revision{obj.history.length === 1 ? '' : 's'}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>
    );
  }

  const handleSaveLabel = () => {
    if (draftName !== selectedObject.current.name) {
      onApplyPatch(selectedObject.id, { name: draftName }, 'human', 'corrected');
    }
  };

  const handleVerify = () => {
    onApplyPatch(selectedObject.id, { confidence: 1.0 }, 'human', 'verified');
  };

  const handleRevertToSnapshot = (historyIndex: number) => {
    const targetHistory = selectedObject.history[historyIndex];
    if (!targetHistory) return;

    // Gather old values to form a clean restore patch
    const patchUpdates: Partial<VisualObject['current']> = {};
    Object.entries(targetHistory.changes).forEach(([field, diff]) => {
      if (field === 'name' && diff.oldValue) patchUpdates.name = String(diff.oldValue);
      if (field === 'confidence' && diff.oldValue !== null) patchUpdates.confidence = Number(diff.oldValue);
      if (field === 'coordinates' && Array.isArray(diff.oldValue)) {
        patchUpdates.coordinates = diff.oldValue as [number, number, number, number];
      }
    });

    if (Object.keys(patchUpdates).length > 0) {
      onApplyPatch(selectedObject.id, patchUpdates, 'human', 'corrected');
    }
  };

  return (
    <aside className="w-88 bg-slate-900 border-l border-slate-800 flex flex-col h-full text-slate-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Entity ID: {selectedObject.id}
          </span>
          <h2 className="text-sm font-semibold text-white">Object Lineage & State</h2>
        </div>
        <button
          onClick={() => onSelectObject(null)}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
        >
          Deselect
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Status Pill Card */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Current Status</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${
              selectedObject.status === 'verified' ? 'bg-emerald-500/20 text-emerald-300' :
              selectedObject.status === 'corrected' ? 'bg-indigo-500/20 text-indigo-300' :
              'bg-amber-500/20 text-amber-300'
            }`}>
              {selectedObject.status}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Confidence Score</span>
            <span className="font-mono tabular-nums text-white">
              {(selectedObject.current.confidence * 100).toFixed(1)}%
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-900 flex items-center gap-2">
            {selectedObject.status !== 'verified' && (
              <button
                onClick={handleVerify}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Verify (1.0)</span>
              </button>
            )}

            <button
              onClick={() => onOpenVoiceModal(selectedObject.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium rounded-lg transition-colors border border-indigo-500/30"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-400" />
              <span>Voice Patch</span>
            </button>
          </div>
        </div>

        {/* Mutable Attribute Form (Dispatches Immutable Patch) */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Object Label / Classification
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={handleSaveLabel}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveLabel()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {draftName !== selectedObject.current.name && (
                <button
                  onClick={handleSaveLabel}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                >
                  Patch
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-1">
              <span>Confidence Calibration</span>
              <span className="font-mono tabular-nums text-slate-300">
                {Math.round(draftConfidence * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={draftConfidence}
              onChange={(e) => setDraftConfidence(parseFloat(e.target.value))}
              onChangeCapture={() => {
                onApplyPatch(selectedObject.id, { confidence: draftConfidence }, 'human');
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-400 mb-1">
              Coordinates Normalized [x1, y1, x2, y2]
            </span>
            <div className="grid grid-cols-4 gap-1 font-mono text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <div>
                <span className="text-slate-600 block text-[9px]">X1</span>
                {selectedObject.current.coordinates[0]}%
              </div>
              <div>
                <span className="text-slate-600 block text-[9px]">Y1</span>
                {selectedObject.current.coordinates[1]}%
              </div>
              <div>
                <span className="text-slate-600 block text-[9px]">X2</span>
                {selectedObject.current.coordinates[2]}%
              </div>
              <div>
                <span className="text-slate-600 block text-[9px]">Y2</span>
                {selectedObject.current.coordinates[3]}%
              </div>
            </div>
          </div>
        </div>

        {/* Immutable Audit Lineage & History */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>CRDT Immutable History</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono tabular-nums">
              {selectedObject.history.length} events
            </span>
          </div>

          <div className="space-y-3 relative pl-4 border-l border-slate-800">
            {selectedObject.history.map((entry, idx) => {
              const dateStr = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div key={idx} className="relative group text-xs">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                      entry.author === 'human' ? 'bg-indigo-400' : 'bg-slate-500'
                    }`}
                  />

                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1 font-medium">
                        {entry.author === 'human' ? (
                          <>
                            <User className="w-3 h-3 text-indigo-400" />
                            <span className="text-indigo-300">Human Operator</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-3 h-3 text-slate-400" />
                            <span>AI Detector</span>
                          </>
                        )}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{dateStr}</span>
                    </div>

                    {/* Diff changes */}
                    <div className="space-y-1 font-mono text-[11px]">
                      {Object.entries(entry.changes).map(([field, diff]) => (
                        <div key={field} className="text-slate-300">
                          <span className="text-slate-500">{field}: </span>
                          {diff.oldValue !== null && (
                            <span className="text-rose-400 line-through mr-1">
                              {typeof diff.oldValue === 'object' ? JSON.stringify(diff.oldValue) : String(diff.oldValue)}
                            </span>
                          )}
                          <span className="text-emerald-400">
                            {typeof diff.newValue === 'object' ? JSON.stringify(diff.newValue) : String(diff.newValue)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {idx < selectedObject.history.length - 1 && (
                      <button
                        onClick={() => handleRevertToSnapshot(idx)}
                        className="mt-2 text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Rollback to this state</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
