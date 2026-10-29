import React from 'react';
import { VisualObject } from '../types/sightline';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Users, 
  Cpu, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CommercialFlywheelProps {
  objects: VisualObject[];
  onSwitchToCanvas: () => void;
  onOpenExport: () => void;
}

export const CommercialFlywheel: React.FC<CommercialFlywheelProps> = ({
  objects,
  onSwitchToCanvas,
  onOpenExport,
}) => {
  const totalObjects = objects.length;
  const verifiedCount = objects.filter((o) => o.status === 'verified').length;
  const correctedCount = objects.filter((o) => o.status === 'corrected').length;
  const uncertainCount = objects.filter((o) => o.status === 'uncertain').length;

  const totalRevisions = objects.reduce((sum, o) => sum + (o.history?.length || 0), 0);
  const humanInterventions = objects.reduce(
    (sum, o) => sum + (o.history?.filter((h) => h.author === 'human').length || 0),
    0
  );

  const verificationRatio = totalObjects > 0 ? Math.round(((verifiedCount + correctedCount) / totalObjects) * 100) : 0;
  const estimatedBountyValue = (verifiedCount * 1.5 + correctedCount * 3.5).toFixed(2);

  const ladderStages = [
    {
      stage: 'Stage 1',
      title: 'Zero-Cost Core Loop Stabilization',
      targetRevenue: '$0',
      status: 'Completed',
      description:
        'Yjs CRDT + WebRTC zero-cost decentralized signaling + Web Speech API atomic patches. Zero server bills.',
      bullet: 'Core visual correction loop verified with locked schema and zero nested mutations.',
      color: 'text-emerald-400',
      badge: 'Completed',
    },
    {
      stage: 'Stage 2',
      title: 'Public Interactive Demo & Build-in-Public',
      targetRevenue: '$0 → $100',
      status: 'Active Now',
      description:
        'Raw correction loop showcased publicly. Video clips of voice correction and sub-50ms peer CRDT convergence shared on X/LinkedIn/GitHub.',
      bullet: 'Capturing first 50 early computer-vision teams and domain annotators.',
      color: 'text-indigo-400',
      badge: 'Active Phase',
    },
    {
      stage: 'Stage 3',
      title: 'Inbound Monetization (Routes A & B)',
      targetRevenue: '$100 → $10,000',
      status: 'Queued',
      description:
        'Route A: Free basic analysis + $0.005/object enterprise volume batch API. Route B: Packaging certified clean datasets ($500–$2,500/package).',
      bullet: 'Closing high-value pilot data-cleaning contracts with industrial robotics and robotics labs.',
      color: 'text-amber-400',
      badge: 'Next Milestone',
    },
    {
      stage: 'Stage 4',
      title: 'Product-Led Growth (PLG) Scale',
      targetRevenue: '$10,000 → $1,000,000+',
      status: 'Queued',
      description:
        'Self-serve enterprise workspaces, multi-annotator fleet consensus scoring, and automated model re-training webhooks.',
      bullet: 'Achieving $83.3k MRR ($1M ARR) purely organic via developer word-of-mouth.',
      color: 'text-sky-400',
      badge: 'Scale Horizon',
    },
  ];

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-8 overflow-y-auto select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Zero-Cost Commercial Scaling Engine</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              INB Sightline Commercial Scaling Ladder ($0 to $1M+)
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Zero paid marketing, zero ad spend, zero outbound cold messaging. Growing purely through product-led visual correction utility and high-fidelity dataset monetization.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-right min-w-[200px]">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Certified Session Value
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              ${estimatedBountyValue}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Based on industrial annotation rates
            </span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Total Visual Objects</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalObjects}
            </span>
            <span className="block text-[10px] text-slate-500 mt-1">In CRDT Map</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Verification Accuracy</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {verificationRatio}%
            </span>
            <span className="block text-[10px] text-slate-500 mt-1">
              {verifiedCount + correctedCount} verified entities
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Human Interventions</span>
            <span className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
              {humanInterventions}
            </span>
            <span className="block text-[10px] text-slate-500 mt-1">Patches & Speech Edits</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">Infrastructure Cost</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              $0.00
            </span>
            <span className="block text-[10px] text-emerald-400 mt-1">
              Pure P2P CRDT WebRTC
            </span>
          </div>
        </div>

        {/* Two Monetization Routes Comparison */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Stage 3 Inbound Monetization Routes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  Route A: High-Volume Processing API
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Usage-Based
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">
                Free Basic Analysis vs. Paid High-Volume API
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Free tier gives 100 objects/day for individual annotators. Enterprise teams subscribe at $99/mo for automated batch uploads, webhook dispatch, and sub-10ms CRDT room peering.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Unit Economics:</span>
                <span className="font-mono text-white">94% Gross Margin ($0 hosting)</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  Route B: Packaged Clean Data Capabilities
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  High-Ticket B2B
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">
                Domain-Specific Verified Datasets & Audits
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clean and certify messy autonomous driving or industrial manufacturing imagery. Package 1,000 verified scenes with immutable audit logs as certified training datasets ($1,500–$5,000 each).
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>First Milestone Target:</span>
                <span className="font-mono text-white">5 Customers = $10,000 ARR</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Bootstrap Ladder */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Organic Bootstrapping Growth Ladder
          </h2>

          <div className="space-y-3">
            {ladderStages.map((stageItem, index) => (
              <div
                key={stageItem.stage}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 shrink-0 mt-0.5">
                    0{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{stageItem.title}</h3>
                      <span className="text-xs text-slate-500">·</span>
                      <span className={`text-xs font-mono font-semibold ${stageItem.color}`}>
                        {stageItem.targetRevenue}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{stageItem.description}</p>
                    <span className="text-[11px] text-slate-500 block">
                      Target: {stageItem.bullet}
                    </span>
                  </div>
                </div>

                <div className="self-end md:self-center shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      stageItem.badge === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : stageItem.badge === 'Active Phase'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {stageItem.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Callout */}
        <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Ready to Package Verified Training Data?</h3>
            <p className="text-xs text-indigo-200 mt-1">
              Export currently verified objects into COCO JSON or Pascal VOC format with full CRDT cryptographic lineage.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToCanvas}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Inspect Canvas
            </button>
            <button
              onClick={onOpenExport}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Export COCO / VOC Dataset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
