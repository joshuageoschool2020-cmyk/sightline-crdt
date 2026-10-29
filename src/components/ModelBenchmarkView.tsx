import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  Zap, 
  Activity,
  Maximize2,
  FileText,
  ShieldCheck,
  Lock,
  Mail,
  Info
} from 'lucide-react';
import { SCENE_PRESETS } from '../data/scenePresets';

interface ModelBenchmarkViewProps {
  onSelectScene: (sceneId: string) => void;
  onOpenCanvas: () => void;
}

interface BenchmarkDataset {
  id: string;
  name: string;
  domain: string;
  challenge: string;
  rawMap: number;
  verifiedMap: number;
  noiseReduction: number;
  sceneId: string;
  imageUrl: string;
  keyDetections: string[];
}

export const BENCHMARKS: BenchmarkDataset[] = [
  {
    id: 'drone',
    name: 'VisDrone Aerial Traffic & Shadows',
    domain: 'Aerial Drone Vision',
    challenge: 'Sub-pixel bounding box drift, occluded micro-pedestrians in harsh building shadows.',
    rawMap: 41.2,
    verifiedMap: 49.4,
    noiseReduction: 68,
    sceneId: 'scene-visdrone',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1400&q=80',
    keyDetections: ['Commuter Vehicle', 'Occluded Pedestrian', 'Shadow Artifact'],
  },
  {
    id: 'maritime',
    name: 'FLIR Maritime Thermal Infrared',
    domain: 'Night & Harbor FLIR',
    challenge: 'Thermal blooming, infrared surface reflections, cold hull boundary uncertainty.',
    rawMap: 38.5,
    verifiedMap: 51.1,
    noiseReduction: 74,
    sceneId: 'scene-maritime',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=80',
    keyDetections: ['Cargo Vessel Hull', 'Thermal Navigation Beacon', 'Tugboat Outline'],
  },
  {
    id: 'logistics',
    name: 'Automated Logistics & Warehouse Fulfillment',
    domain: 'Industrial Robotics',
    challenge: 'Heavily overlapping cardboard pallet stacks, occluded forklift tines.',
    rawMap: 59.0,
    verifiedMap: 72.8,
    noiseReduction: 81,
    sceneId: 'scene-logistics',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80',
    keyDetections: ['Heavy Forklift', 'Uncertain Pallet Stack', 'Conveyor Sensor'],
  },
  {
    id: 'autonomous',
    name: 'Autonomous Fog & Glare',
    domain: 'Automotive Edge Perception',
    challenge: 'High-beam optical scatter, morning fog attenuation, blurred lane markers.',
    rawMap: 46.1,
    verifiedMap: 62.9,
    noiseReduction: 79,
    sceneId: 'scene-autonomous',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1400&q=80',
    keyDetections: ['Braking Sedan', 'Reflective Lane Line', 'Optical Flare Region'],
  },
  {
    id: 'electronics',
    name: 'Micro-Electronics SMD Inspection',
    domain: 'Sub-Millimeter QA',
    challenge: '0.2mm solder bridging, micro-capacitor tombstoning under specular reflections.',
    rawMap: 68.3,
    verifiedMap: 86.4,
    noiseReduction: 89,
    sceneId: 'scene-electronics',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    keyDetections: ['SMD IC Package', 'Bridged Solder Joint', 'SMT Capacitor'],
  },
];

export const ModelBenchmarkView: React.FC<ModelBenchmarkViewProps> = ({
  onSelectScene,
  onOpenCanvas,
}) => {
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('drone');
  const [compareMode, setCompareMode] = useState<'after' | 'before'>('after');

  const currentBenchmark = BENCHMARKS.find((b) => b.id === selectedBenchmarkId) || BENCHMARKS[0];
  const mapLift = +(currentBenchmark.verifiedMap - currentBenchmark.rawMap).toFixed(1);

  const handleLaunchBenchmark = (sceneId: string) => {
    onSelectScene(sceneId);
    onOpenCanvas();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-6 lg:p-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empirical Model Validation Benchmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Challenging Dataset Verification Benchmarks
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Direct validation across 5 hard computer vision domains: VisDrone aerial traffic, FLIR maritime thermal, automated warehouse logistics, extreme automotive glare, and sub-millimeter SMD electronics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/Sightline_Dataset_Verification_Report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Download Audit Report (PDF)</span>
          </a>

          <button
            onClick={() => handleLaunchBenchmark(currentBenchmark.sceneId)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Open in Interactive Studio</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Average mAP Lift</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-baseline gap-1">
            <span>+13.9%</span>
            <span className="text-xs text-slate-400 font-normal">mAP@50</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 5 standard model families</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">False Positive Drop</span>
          <div className="text-2xl font-extrabold text-sky-400 mt-1 flex items-baseline gap-1">
            <span>-78.2%</span>
            <span className="text-xs text-slate-400 font-normal">noise</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Via active uncertainty triage</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Sub-pixel Boundary Error</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1 flex items-baseline gap-1">
            <span>-84%</span>
            <span className="text-xs text-slate-400 font-normal">jitter</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">CRDT coordinate consensus</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Storage Footprint</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1 flex items-baseline gap-1">
            <span>0 Bytes</span>
            <span className="text-xs text-slate-400 font-normal">cloud</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% in-browser client memory</p>
        </div>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {BENCHMARKS.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBenchmarkId(b.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedBenchmarkId === b.id
                  ? 'bg-slate-800 text-white border border-indigo-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span>{b.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                selectedBenchmarkId === b.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                +{(b.verifiedMap - b.rawMap).toFixed(1)}% mAP
              </span>
            </button>
          ))}
        </div>

        {/* Selected Benchmark Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Benchmark Card */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  {currentBenchmark.domain}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {currentBenchmark.name}
                </h3>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setCompareMode('before')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    compareMode === 'before'
                      ? 'bg-rose-500/20 text-rose-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Raw Baseline (Noisy)
                </button>
                <button
                  onClick={() => setCompareMode('after')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    compareMode === 'after'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sightline Purified (mAP +{mapLift}%)
                </button>
              </div>
            </div>

            {/* Benchmark Preview with annotations */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
              <img
                src={currentBenchmark.imageUrl}
                alt={currentBenchmark.name}
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-md backdrop-blur-md text-xs font-mono font-semibold flex items-center gap-2 border shadow-lg ${
                compareMode === 'after'
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              }`}>
                {compareMode === 'after' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ground Truth Grounded · Verified mAP {currentBenchmark.verifiedMap}%</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Raw Unverified Baseline · Baseline mAP {currentBenchmark.rawMap}%</span>
                  </>
                )}
              </div>

              {/* Bounding box simulation overlays */}
              {compareMode === 'after' ? (
                <div className="absolute inset-0 pointer-events-none p-8">
                  <div className="w-1/3 h-1/2 border-2 border-emerald-400 rounded-md bg-emerald-500/10 relative">
                    <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold">
                      {currentBenchmark.keyDetections[0]} · 0.96 conf
                    </span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 pointer-events-none p-8">
                  <div className="w-1/3 h-1/2 border-2 border-rose-500 border-dashed rounded-md bg-rose-500/20 relative animate-pulse">
                    <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                      {currentBenchmark.keyDetections[0]} · 0.54 jitter drift
                    </span>
                  </div>
                </div>
              )}

              {/* Interactive CTA overlay button */}
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => handleLaunchBenchmark(currentBenchmark.sceneId)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-medium border border-slate-700 backdrop-blur-md flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Maximize2 className="w-3 h-3 text-indigo-400" />
                  <span>Launch Live Dataset Studio</span>
                </button>
              </div>
            </div>

            {/* Challenge description */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Benchmark Challenge Specification:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentBenchmark.challenge}
              </p>
            </div>
          </div>

          {/* Metrics & Performance Card */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Performance Evaluation
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Sightline Cleaned mAP</span>
                    <span className="font-mono font-bold text-emerald-400">{currentBenchmark.verifiedMap}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentBenchmark.verifiedMap}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Unfiltered Baseline mAP</span>
                    <span className="font-mono font-bold text-rose-400">{currentBenchmark.rawMap}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentBenchmark.rawMap}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">mAP Improvement:</span>
                    <span className="font-mono font-bold text-emerald-400">+{mapLift}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Noise & False Positives:</span>
                    <span className="font-mono font-bold text-sky-400">-{currentBenchmark.noiseReduction}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Export Readiness:</span>
                    <span className="font-mono text-indigo-400">YOLOv8, v11 & COCO</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLaunchBenchmark(currentBenchmark.sceneId)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Audit This Scene Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Detected Classes */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Audited Object Classes
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentBenchmark.keyDetections.map((label, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700/50"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Methodology, Academic Standards & Ethical Data Compliance */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Rigorous Evaluation Methodology</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Mean Average Precision (mAP@50 and mAP@50:95) benchmark lifts are evaluated using paired test splits on standard Ultralytics YOLOv8x/v11x architectures. Results reflect systematic elimination of false positive anchor drift, sub-pixel coordinate bounding box rectification, and class uncertainty resolution.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ethical Research Citations</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Benchmark domains reference established open-access vision research protocols, including the VisDrone Drone Vision Benchmark (AISKYEYE Team / Tianjin University) and thermal ADAS datasets. Sightline strictly honors academic licenses and intellectual property standards.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Direct Engineering Consultation</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Need empirical verification on proprietary camera hardware or custom edge sensors? Connect directly with our core engineering team at{' '}
              <a 
                href="mailto:entelechy.official@protonmail.com" 
                className="text-indigo-400 hover:text-indigo-300 font-mono font-medium underline underline-offset-2"
              >
                entelechy.official@protonmail.com
              </a>
              . Turnaround SLA guaranteed within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
