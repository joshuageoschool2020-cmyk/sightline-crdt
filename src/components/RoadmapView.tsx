import React, { useState } from 'react';
import { INB_ROADMAP_TASKS } from '../data/roadmapTasks';
import { ArchitectTask } from '../types/sightline';
import { 
  Workflow, 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  ShieldAlert, 
  Layers, 
  Code2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  const stages = [
    { id: 'all', label: 'All Tasks (1–7)' },
    { id: 'Stage 1', label: 'Stage 1: Core Loop' },
    { id: 'Stage 2', label: 'Stage 2: Public Demo' },
    { id: 'Stage 3', label: 'Stage 3: Monetization' },
    { id: 'Stage 4', label: 'Stage 4: $1M+ Scaling' },
  ];

  const filteredTasks = INB_ROADMAP_TASKS.filter((task) => {
    if (selectedStage === 'all') return true;
    return task.stage.toLowerCase().includes(selectedStage.toLowerCase());
  });

  const handleCopyPrompt = (task: ArchitectTask) => {
    navigator.clipboard.writeText(task.workerInstruction);
    setCopiedTaskId(task.id);
    setTimeout(() => setCopiedTaskId(null), 2500);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Architect Header Banner */}
        <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Workflow className="w-4 h-4" />
              <span>INB Sightline Primary Lead Architect</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Master Engineering Roadmap & Worker Hand-Off Blueprints
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Strictly sequenced tasks enforcing zero direct nested mutations, immutable history array appends, accurate status calculations, and deduplicated observers.
            </p>
          </div>

          {/* Operational Engine Status */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs min-w-[280px]">
            <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
              Verification Engine Mesh
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Yjs State Vector Sync</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active (Zero-Collision)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">WebRTC Signaling Mesh</span>
              <span className="text-slate-400 text-[11px]">Peer Mesh Standby</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Deterministic LWW Engine</span>
              <span className="text-indigo-400 text-[11px] font-mono">Enforced (Monotonic)</span>
            </div>
          </div>
        </div>

        {/* Anti-Patterns Shield Reminder */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/20 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-indigo-300">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            <span>Audited Anti-Patterns & Enforced Invariants (Mandatory Hand-Off Checklist)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400 pt-1 text-[11px]">
            <div>
              <strong className="text-slate-200">1. No Direct Nested Yjs Mutation:</strong> Always dispatch <code className="text-indigo-300">ymap.set(id, updatedObject)</code> using spread clones. Never write to <code className="text-rose-400">obj.current.x = ...</code>.
            </div>
            <div>
              <strong className="text-slate-200">2. No Stale History Overwrites:</strong> Diffs must append to a fresh history array. Never log unchanged fields.
            </div>
            <div>
              <strong className="text-slate-200">3. Status Realignment:</strong> Human edit elevates to <code className="text-indigo-300">"corrected"</code>; human verify sets <code className="text-emerald-300">"verified"</code> with confidence 1.0.
            </div>
            <div>
              <strong className="text-slate-200">4. No Duplicate Observers:</strong> Always clean up <code className="text-indigo-300">ymap.unobserve()</code> in effect returns.
            </div>
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-900">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedStage === stage.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Task Cards */}
        <div className="space-y-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-5"
            >
              {/* Task Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs border border-indigo-500/30">
                    T{task.taskNumber}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                      {task.stage}
                    </span>
                    <h2 className="text-base font-semibold text-white">{task.title}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 text-indigo-300 border border-slate-800">
                    Assigned: {task.targetWorker}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Production Ready
                  </span>
                </div>
              </div>

              {/* 1. Objective */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  1. Objective / What We Are Building Next
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/60">
                  {task.objective}
                </p>
              </div>

              {/* 2. Technical Details Grid */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  2. Technical Details & CRDT Invariants
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <span className="block text-[11px] font-mono text-indigo-400 mb-1">
                      Yjs Map Impact
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {task.technicalDetails.yjsImpact}
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <span className="block text-[11px] font-mono text-emerald-400 mb-1">
                      Immutable State Handling
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {task.technicalDetails.immutableState}
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <span className="block text-[11px] font-mono text-amber-400 mb-1">
                      History Append Logic
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {task.technicalDetails.historyLogic}
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <span className="block text-[11px] font-mono text-sky-400 mb-1">
                      UI Observer Rendering
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {task.technicalDetails.observerRendering}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Worker Instruction Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>3. Worker Instruction (Hand-Off Prompt for {task.targetWorker})</span>
                  </h3>

                  <button
                    onClick={() => handleCopyPrompt(task)}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition-colors"
                  >
                    {copiedTaskId === task.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-indigo-900 selection:text-white">
                  {task.workerInstruction}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
