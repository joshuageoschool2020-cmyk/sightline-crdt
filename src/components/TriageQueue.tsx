import React, { useState } from 'react';
import { VisualObject, ObjectStatus } from '../types/sightline';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  X, 
  Edit2, 
  ArrowRight, 
  Keyboard, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface TriageQueueProps {
  objects: VisualObject[];
  onApplyPatch: (
    id: string,
    updates: Partial<VisualObject['current']>,
    author?: 'human' | 'ai',
    status?: ObjectStatus
  ) => void;
  onDeleteObject: (id: string) => void;
  onSelectObject: (id: string) => void;
  onSwitchToCanvas: () => void;
}

export const TriageQueue: React.FC<TriageQueueProps> = ({
  objects,
  onApplyPatch,
  onDeleteObject,
  onSelectObject,
  onSwitchToCanvas,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Triage items: uncertain first, then sorted by confidence ascending
  const triageItems = objects.filter((o) => o.status === 'uncertain');
  const verifiedItems = objects.filter((o) => o.status === 'verified' || o.status === 'corrected');

  const handleVerify = (id: string) => {
    onApplyPatch(id, { confidence: 1.0 }, 'human', 'verified');
  };

  const handleStartEdit = (obj: VisualObject) => {
    setEditingId(obj.id);
    setEditingText(obj.current.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editingText.trim()) {
      onApplyPatch(id, { name: editingText.trim() }, 'human', 'corrected');
    }
    setEditingId(null);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header & Stats Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Stage 3 Commercial Engine: Uncertainty Triage Queue</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Model Uncertainty & Human Correction Triage
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              High-throughput queue prioritizing AI detections with confidence &lt; 85%. Operators rapidly verify or relabel objects using keyboard shortcuts or 1-click patches, unlocking enterprise clean dataset packaging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center min-w-[100px]">
              <span className="block text-[10px] text-slate-500 uppercase">Pending Triage</span>
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {triageItems.length}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center min-w-[100px]">
              <span className="block text-[10px] text-slate-500 uppercase">Verified / Corrected</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {verifiedItems.length}
              </span>
            </div>
          </div>
        </div>

        {/* Keyboard Helper Banner */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-xs text-slate-300">
          <Keyboard className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-white mr-1 border border-slate-700">V</kbd>
              Verify Object with 100% confidence
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-white mr-1 border border-slate-700">E</kbd>
              Edit Classification Label
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-white mr-1 border border-slate-700">Del</kbd>
              Discard False Positive
            </span>
          </div>
        </div>

        {/* Pending Uncertainty Items */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Human Verification ({triageItems.length})
          </h2>

          {triageItems.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">All Detections Cleared & Verified</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Zero uncertain bounding boxes remain in the current scene. You are ready to export the certified dataset or switch to another scene.
              </p>
              <button
                onClick={onSwitchToCanvas}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <span>Return to Canvas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {triageItems.map((obj) => (
                <div
                  key={obj.id}
                  className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      {editingId === obj.id ? (
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            autoFocus
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(obj.id)}
                            className="bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-xs text-white"
                          />
                          <button
                            onClick={() => handleSaveEdit(obj.id)}
                            className="px-2 py-1 bg-indigo-600 text-white rounded text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-white">{obj.current.name}</h3>
                          <button
                            onClick={() => handleStartEdit(obj)}
                            className="text-slate-400 hover:text-white p-1"
                            title="Edit label"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Confidence: <strong className="text-amber-400 font-mono tabular-nums">{Math.round(obj.current.confidence * 100)}%</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Coords: [{obj.current.coordinates.join(', ')}]</span>
                        <span aria-hidden="true">·</span>
                        <button
                          onClick={() => {
                            onSelectObject(obj.id);
                            onSwitchToCanvas();
                          }}
                          className="text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          View in Canvas
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleVerify(obj.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify (1.0)</span>
                    </button>

                    <button
                      onClick={() => handleStartEdit(obj)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      <span>Correct Label</span>
                    </button>

                    <button
                      onClick={() => onDeleteObject(obj.id)}
                      title="Discard False Positive"
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certified Items Summary */}
        <div className="space-y-3 pt-6 border-t border-slate-900">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Certified / Human-Corrected Baseline ({verifiedItems.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {verifiedItems.map((obj) => (
              <div
                key={obj.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${
                    obj.status === 'corrected' ? 'bg-indigo-400' : 'bg-emerald-400'
                  }`} />
                  <div>
                    <h4 className="text-xs font-medium text-white">{obj.current.name}</h4>
                    <span className="text-[11px] text-slate-500">
                      {obj.status === 'corrected' ? 'Human Corrected' : 'Model Verified'} · {Math.round(obj.current.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectObject(obj.id);
                    onSwitchToCanvas();
                  }}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
