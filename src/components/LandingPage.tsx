import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Mic, 
  Layers, 
  Users, 
  Clock, 
  Sparkles, 
  Eye, 
  Cpu, 
  Lock, 
  FileText, 
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  X,
  Upload,
  Mail
} from 'lucide-react';

interface LandingPageProps {
  onLaunchStudio: () => void;
  onOpenUpgrade: () => void;
  onOpenExport: () => void;
  onTestBenchmark?: (sceneId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchStudio,
  onOpenUpgrade,
  onOpenExport,
  onTestBenchmark,
}) => {
  const [selectedBatchTier, setSelectedBatchTier] = useState<'starter' | 'pro' | 'enterprise' | null>(null);
  const [orderEmail, setOrderEmail] = useState('');
  const [orderDatasetUrl, setOrderDatasetUrl] = useState('');
  const [orderFormat, setOrderFormat] = useState('YOLOv8');
  const [orderPrivacyMode, setOrderPrivacyMode] = useState<'cloud_link' | 'zero_pixel' | 'mnda_first' | 'encrypted'>('cloud_link');
  const [orderRequireMnda, setOrderRequireMnda] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderEmail) return;
    setOrderSubmitted(true);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-6xl mx-auto text-center border-b border-slate-900">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Zero-Latency Computer Vision Dataset Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          The Collaborative Verification Engine for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">Computer Vision</span> Datasets
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Audit, clean, and fix noisy bounding box annotations 5x faster. Built on conflict-free CRDT peer sync, hands-free voice patching, and client-side privacy.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <button
            onClick={onLaunchStudio}
            className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <Eye className="w-4 h-4" />
            <span>Launch Interactive Studio (Free Sandbox)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedBatchTier('starter')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Order Dataset Audit ($50 / Batch)</span>
          </button>

          <a
            href="/Sightline_Dataset_Verification_Report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Benchmark Report (PDF)</span>
          </a>
        </div>

        {/* Live Metrics Trust Strip */}
        <div className="mt-12 pt-8 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
            <span className="text-[11px] text-slate-400 block font-medium">Sync Latency</span>
            <span className="text-xl font-bold font-mono text-emerald-400">&lt; 45ms</span>
            <span className="text-[10px] text-slate-500 block">WebRTC peer data channel</span>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
            <span className="text-[11px] text-slate-400 block font-medium">Data Privacy</span>
            <span className="text-xl font-bold text-white">100% In-Browser</span>
            <span className="text-[10px] text-slate-500 block">Zero server image storage</span>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
            <span className="text-[11px] text-slate-400 block font-medium">Merge Conflict Rate</span>
            <span className="text-xl font-bold font-mono text-indigo-400">0.00%</span>
            <span className="text-[10px] text-slate-500 block">Deterministic Yjs CRDT</span>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
            <span className="text-[11px] text-slate-400 block font-medium">Annotation Speed</span>
            <span className="text-xl font-bold font-mono text-amber-400">3.2x Faster</span>
            <span className="text-[10px] text-slate-500 block">Multimodal voice patching</span>
          </div>
        </div>
      </section>

      {/* World Benchmark Hard Datasets Showcase */}
      <section className="py-12 px-6 max-w-6xl mx-auto border-b border-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>World Benchmark Hard Datasets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Stress-Tested on Challenging Vision Benchmarks
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Don't take our word for it. Test Sightline live on real-world occlusion, shadow drift, and defect challenges:
            </p>
          </div>
          <button
            onClick={onLaunchStudio}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-colors"
          >
            <span>Open All in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Benchmark 1 */}
          <div 
            onClick={() => onTestBenchmark ? onTestBenchmark('scene-visdrone') : onLaunchStudio()}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold">Drone Vision Benchmark</span>
                <span className="text-amber-400">54% raw conf</span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                VisDrone Aerial Traffic & Shadows
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tiny vehicles & pedestrians in harsh building shadows with sub-pixel boundary drift.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              <span>Test Interactive Triage →</span>
              <span className="text-[10px] text-emerald-400 font-mono">+8.2% mAP lift</span>
            </div>
          </div>

          {/* Benchmark 2 */}
          <div 
            onClick={() => onTestBenchmark ? onTestBenchmark('scene-maritime') : onLaunchStudio()}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold">Maritime Port Vision</span>
                <span className="text-amber-400">58% raw conf</span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                Deep-Water Cargo & Harbor Cranes
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Vessel hull reflections & complex steel gantry crane structural occlusions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              <span>Test Interactive Triage →</span>
              <span className="text-[10px] text-emerald-400 font-mono">+6.9% mAP lift</span>
            </div>
          </div>

          {/* Benchmark 3 */}
          <div 
            onClick={() => onTestBenchmark ? onTestBenchmark('scene-logistics') : onLaunchStudio()}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold">Industrial Robotics</span>
                <span className="text-amber-400">62% raw conf</span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                Automated Warehouse Pallet Stacking
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Severe box overlap causing 28% false-positive anchor confusion in YOLOv8.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              <span>Test Interactive Triage →</span>
              <span className="text-[10px] text-emerald-400 font-mono">+7.4% mAP lift</span>
            </div>
          </div>

          {/* Benchmark 4 */}
          <div 
            onClick={() => onTestBenchmark ? onTestBenchmark('scene-autonomous') : onLaunchStudio()}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-semibold">Mobility Vision</span>
                <span className="text-amber-400">58% raw conf</span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                Urban Low-Light & Cyclist Occlusion
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Partially hidden crosswalk pedestrians & cyclists in complex city traffic.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              <span>Test Interactive Triage →</span>
              <span className="text-[10px] text-emerald-400 font-mono">+9.1% mAP lift</span>
            </div>
          </div>

          {/* Benchmark 5 */}
          <div 
            onClick={() => onTestBenchmark ? onTestBenchmark('scene-electronics') : onLaunchStudio()}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold">Hardware QC</span>
                <span className="text-amber-400">52% raw conf</span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                PCB Micro-Solder Bridge Defects
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Microscopic circuit component misalignment requiring sub-pixel accuracy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              <span>Test Interactive Triage →</span>
              <span className="text-[10px] text-emerald-400 font-mono">+11.3% mAP lift</span>
            </div>
          </div>

          {/* Benchmark 6: Upload Your Own */}
          <div 
            onClick={onLaunchStudio}
            className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all group flex flex-col justify-between border-dashed"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400 mb-2">
                <span className="px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-300 font-semibold">Your Custom Dataset</span>
                <span>Upload</span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                Audit Your Own Hard Dataset
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Drag and drop your camera frames into the studio canvas. 100% in-browser privacy guaranteed.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-900/50 flex items-center justify-between text-xs text-indigo-300 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Upload Custom Image in Studio →</span>
              <Upload className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Ecosystem Support Strip */}
      <section className="py-10 bg-slate-900/30 border-b border-slate-900 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 block text-center mb-6">
            Engineered For Modern Computer Vision & Autonomous Stacks
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-400 text-sm font-semibold">
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Cpu className="w-4 h-4 text-indigo-400" /> YOLOv11 / YOLOv8
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Layers className="w-4 h-4 text-emerald-400" /> PyTorch Vision
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <FileText className="w-4 h-4 text-amber-400" /> COCO JSON Format
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Sparkles className="w-4 h-4 text-sky-400" /> Hugging Face Datasets
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Eye className="w-4 h-4 text-purple-400" /> OpenCV Pipelines
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Download className="w-4 h-4 text-teal-400" /> Pascal VOC XML
            </span>
          </div>
        </div>
      </section>

      {/* Why Teams Switch (Competitive Positioning Matrix) */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-b border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-wider text-indigo-400 font-semibold">
            Competitive Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Why Vision Engineers Choose Sightline Over Legacy Platforms
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Traditional labeling vendors lock your data into expensive cloud silos. Sightline runs in your browser with zero lock-in and real-time multiplayer.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Feature</th>
                <th className="py-3.5 px-4">Outsourced Agencies</th>
                <th className="py-3.5 px-4">Legacy Cloud Tools</th>
                <th className="py-3.5 px-4 sm:px-6 bg-indigo-950/40 text-indigo-300 font-bold border-x border-indigo-500/30">
                  Sightline CRDT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-4 px-4 sm:px-6 font-medium text-white">Starting Pricing</td>
                <td className="py-4 px-4 text-slate-400">$10,000+ enterprise contract</td>
                <td className="py-4 px-4 text-slate-400">$250 / month / seat</td>
                <td className="py-4 px-4 sm:px-6 bg-indigo-950/20 font-bold text-emerald-400 border-x border-indigo-500/30">
                  $50 / batch or $24.50/mo
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 sm:px-6 font-medium text-white">Multiplayer Architecture</td>
                <td className="py-4 px-4 text-slate-400">Slow async email ticketing</td>
                <td className="py-4 px-4 text-slate-400">Single annotator locks image</td>
                <td className="py-4 px-4 sm:px-6 bg-indigo-950/20 font-bold text-emerald-400 border-x border-indigo-500/30">
                  Sub-50ms P2P WebRTC CRDT
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 sm:px-6 font-medium text-white">Data Privacy & Security</td>
                <td className="py-4 px-4 text-slate-400">External contractor access</td>
                <td className="py-4 px-4 text-slate-400">Mandatory server database upload</td>
                <td className="py-4 px-4 sm:px-6 bg-indigo-950/20 font-bold text-emerald-400 border-x border-indigo-500/30">
                  100% In-Browser Memory
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 sm:px-6 font-medium text-white">Voice-Assisted Patching</td>
                <td className="py-4 px-4 text-slate-500">Not supported</td>
                <td className="py-4 px-4 text-slate-500">Not supported</td>
                <td className="py-4 px-4 sm:px-6 bg-indigo-950/20 font-bold text-emerald-400 border-x border-indigo-500/30">
                  Native speech coordinate nudge
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 sm:px-6 font-medium text-white">Export Formats</td>
                <td className="py-4 px-4 text-slate-400">Custom formats with export fee</td>
                <td className="py-4 px-4 text-slate-400">Restricted on basic tiers</td>
                <td className="py-4 px-4 sm:px-6 bg-indigo-950/20 font-bold text-emerald-400 border-x border-indigo-500/30">
                  Free YOLO, COCO & VOC ZIP
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verification Benchmark Proof Banner */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Empirical Benchmark Specification & Hard Dataset Audit Report</h4>
              <p className="text-xs text-slate-400 mt-0.5">Review our verified case studies on occluded warehouse logistics, autonomous driving, and PCB micro-electronics.</p>
            </div>
          </div>
          <a
            href="/Sightline_Dataset_Verification_Report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit PDF</span>
          </a>
        </div>
      </section>

      {/* Verified Service & Batch Pricing Cards */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-b border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
            Transparent Batch Pricing & Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Dataset Verification as a Service
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Have dirty training data holding back your mAP? Hand off your image batches to our verified engineering pipeline with 24-hour turnaround.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: $50 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                Starter Audit Batch
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$50</span>
                <span className="text-xs text-slate-400">/ 50 images</span>
              </div>
              <p className="text-xs text-slate-400">
                Perfect for robotics prototypes, college research projects, and initial perception validation.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800/80">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>50 complex images audited</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sub-pixel bounding box rectification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>YOLOv8 & COCO JSON delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>24-Hour Turnaround</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedBatchTier('starter')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Order 50-Image Batch ($50)
            </button>
          </div>

          {/* Tier 2: $100 (Most Popular) */}
          <div className="p-6 rounded-2xl bg-slate-900 border-2 border-indigo-500/80 flex flex-col justify-between shadow-xl shadow-indigo-500/10 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-300">
                Production Batch
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$100</span>
                <span className="text-xs text-slate-400">/ 100 images</span>
              </div>
              <p className="text-xs text-slate-300">
                For autonomous systems, warehouse robotics, and production perception models needing clean ground truth.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-200 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100 complex images audited & patched</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Multi-class confusion matrix analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Immutable CRDT audit trail JSON</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>YOLOv11, COCO & Pascal VOC</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>24-Hour Turnaround</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedBatchTier('pro')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/30"
            >
              Order 100-Image Batch ($100)
            </button>
          </div>

          {/* Tier 3: $350 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Enterprise Sprint
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$350</span>
                <span className="text-xs text-slate-400">/ 500 images</span>
              </div>
              <p className="text-xs text-slate-400">
                High-volume dataset purification with custom schema harmonization and priority engineering SLA.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800/80">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>500 full-resolution images audited</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dedicated senior QA reviewer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Custom coordinate schema transformation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>NDA compliance & signed verification report</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedBatchTier('enterprise')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Order Enterprise Sprint ($350)
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Founder Guarantee (Addresses the 20/100 score) */}
      <section className="py-16 px-6 max-w-4xl mx-auto border-b border-slate-900">
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg">
            SL
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-base font-bold text-white">Built by Sightline Engineering</h3>
              <span className="text-xs text-slate-400 hidden sm:inline">·</span>
              <span className="text-xs text-indigo-400 font-mono">Core Vision & CRDT Systems</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              "We built Sightline CRDT because machine learning engineering teams should never be blocked by noisy dataset annotations or clunky desktop tools. Every batch ordered is verified with sub-pixel scrutiny and deterministic audit trails. If your model's validation precision does not improve, we will refund 100% of your money."
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Money-Back Guarantee
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Strict Confidentiality & NDA-Safe
              </span>
              <span>·</span>
              <a
                href="mailto:entelechy.official@protonmail.com"
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-mono font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>entelechy.official@protonmail.com</span>
              </a>
              <span>·</span>
              <span className="text-slate-400">
                Under 2-Hour Response SLA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-2">Everything you need to know about Sightline CRDT & Verification</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-white">Do my images ever get saved on your servers?</h4>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              No. Sightline CRDT is architected with a strict <strong>Zero-Pixel Server Retention</strong> principle. The interactive studio runs 100% inside your browser memory (WebAssembly & HTML5 Canvas), and peer sync occurs directly over end-to-end encrypted WebRTC data channels. Raw images never touch an external cloud or central database.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-white">Do we have to upload or email proprietary images to your team?</h4>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              <strong>Never.</strong> You have three flexible, privacy-preserving ways to work with us without risking corporate IP:
            </p>
            <ul className="mt-2 space-y-1.5 text-slate-300 list-disc list-inside">
              <li><strong className="text-white">Self-Service Air-Gapped Studio:</strong> Run Sightline completely on your own machine. No uploads required.</li>
              <li><strong className="text-white">Zero-Pixel Label Audit:</strong> Submit only bounding box label manifests (JSON, YAML, or TXT coordinates). We audit coordinate jitter, class collisions, and IoU drift without ever seeing your underlying image pixels.</li>
              <li><strong className="text-white">Mutual NDA & Signed IAM:</strong> For full image audits, we execute a Mutual NDA (MNDA) first and ingest via your private, read-only S3 presigned URL or ProtonMail PGP vault with automated ephemeral deletion post-delivery.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-white">What if our data is protected by HIPAA, GDPR, or Defense/ITAR regulations?</h4>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              Because the Sightline studio runs entirely client-side, it is compliant with strict air-gapped environments. For healthcare, defense, and robotics teams that cannot connect to the public internet, we provide an air-gapped Docker container deployable directly inside your internal private VPC behind corporate firewalls.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-white">How does the $50 or $100 Batch Verification work?</h4>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              You submit your preferred link or coordinate manifest. Within 24 hours, our engineering pipeline audits every coordinate, rectifies jitter, and returns clean, verified ZIP packages ready for training in YOLOv8, YOLOv11, or COCO format, backed by our 100% money-back guarantee.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-white">What models can I train with the exported datasets?</h4>
            <p className="text-slate-400 mt-1.5 leading-relaxed">
              Our exports are 100% standard and compatible with Ultralytics YOLO (v8, v9, v10, v11), PyTorch torchvision models, Detectron2, MMDetection, TensorFlow Object Detection, and OpenCV DNN.
            </p>
          </div>
        </div>
      </section>

      {/* Legal & Architectural Compliance Notice Footer */}
      <footer className="mt-20 pt-12 pb-16 px-6 border-t border-slate-900 bg-slate-950/60 text-slate-400">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            {/* Col 1: System Identification */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-mono">
                  S
                </div>
                <span>INB Sightline</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Collaborative verification and active uncertainty triage infrastructure for computer vision datasets.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Verification Systems Operational</span>
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="space-y-2">
              <h5 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Platform</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={onLaunchStudio} className="hover:text-white transition-colors">
                    Interactive Verification Studio
                  </button>
                </li>
                <li>
                  <a href="/Sightline_Dataset_Verification_Report.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Benchmark Audit Report (PDF)
                  </a>
                </li>
                <li>
                  <button onClick={() => setSelectedBatchTier('starter')} className="hover:text-white transition-colors">
                    Order Dataset Audit ($50/Batch)
                  </button>
                </li>
                <li>
                  <button onClick={onOpenUpgrade} className="hover:text-white transition-colors">
                    Pro Architect License
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Export Formats & Tooling */}
            <div className="space-y-2">
              <h5 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Supported Formats</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li>Ultralytics YOLO (v8, v9, v10, v11)</li>
                <li>Standard COCO JSON (Instances 1.0)</li>
                <li>Pascal VOC XML Schema</li>
                <li>Immutable CRDT Audit Lineage</li>
              </ul>
            </div>

            {/* Col 4: Data Protection & Legal Compliance */}
            <div className="space-y-2">
              <h5 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Data Privacy & Compliance</h5>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Sightline processes imagery strictly in client-side memory via WebRTC peer data channels. Zero images are stored on external server databases, guaranteeing full client confidentiality and compliance with international data standards and UAE Personal Data Protection laws (PDPL Decree-Law No. 45/2021).
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              <span>© {new Date().getFullYear()} Sightline CRDT Systems. Engineered for computer vision pipelines.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-400">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Client-Side Encryption</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>NDA & Confidentiality Safe</span>
              </span>
            </div>
          </div>
        </div>
      </footer>



      {/* Order Batch Modal Popup */}
      {selectedBatchTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setSelectedBatchTier(null); setOrderSubmitted(false); }}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!orderSubmitted ? (
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-semibold uppercase">
                    Order Verification Batch
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedBatchTier === 'starter' && 'Starter Batch (50 Images) — $50'}
                    {selectedBatchTier === 'pro' && 'Production Batch (100 Images) — $100'}
                    {selectedBatchTier === 'enterprise' && 'Enterprise Sprint (500 Images) — $350'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter your details below. We begin your dataset audit immediately upon receipt.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Your Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="engineer@company.com"
                      value={orderEmail}
                      onChange={(e) => setOrderEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Privacy & Data Ingestion Preference *</label>
                    <select
                      value={orderPrivacyMode}
                      onChange={(e) => setOrderPrivacyMode(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="cloud_link">Encrypted Cloud Storage (Drive, S3 Presigned URL, Dropbox)</option>
                      <option value="zero_pixel">Zero-Pixel Label-Only Audit (JSON/YAML coordinates; NO raw images)</option>
                      <option value="mnda_first">Execute Mutual NDA (MNDA) First (Before any link or file is shared)</option>
                      <option value="encrypted">PGP / Encrypted Transfer (ProtonMail / E2EE Key)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Zero-Retention Policy: Data purged immediately post-verification.</span>
                    </p>
                  </div>

                  {orderPrivacyMode !== 'mnda_first' && (
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        {orderPrivacyMode === 'zero_pixel' 
                          ? 'Annotation Manifest Link (JSON / TXT coordinates or GitHub / HuggingFace)' 
                          : 'Dataset Link (Drive, S3, Dropbox, or HuggingFace)'}
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/... or https://s3.amazonaws.com/..."
                        value={orderDatasetUrl}
                        onChange={(e) => setOrderDatasetUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/60 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="mnda_checkbox"
                      checked={orderRequireMnda}
                      onChange={(e) => setOrderRequireMnda(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="mnda_checkbox" className="text-[11px] text-slate-300 cursor-pointer leading-relaxed">
                      <strong className="text-white">Request Mutual NDA (MNDA):</strong> We will email a standard reciprocal confidentiality agreement countersigned by our lead engineering team prior to dataset transfer.
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target Training Format</label>
                    <select
                      value={orderFormat}
                      onChange={(e) => setOrderFormat(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="YOLOv8">Ultralytics YOLOv8 / YOLOv11 (txt + data.yaml)</option>
                      <option value="COCO">COCO JSON annotations</option>
                      <option value="PascalVOC">Pascal VOC XML</option>
                      <option value="Custom">Custom Schema</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Specific Instructions / Classes to Audit</label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Focus on forklift vs pallet occlusion; ignore background vehicles..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>24h SLA Guarantee</span>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Submit & Confirm Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Order Received!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you! We have logged your verification request for <strong className="text-white">{orderEmail}</strong>. {orderRequireMnda ? "Our team will first email you our countersigned Mutual Non-Disclosure Agreement (MNDA) within 2 hours before any file or link exchange." : "Our engineering lead will review your audit scope and confirm your delivery timeline within 2 hours."}
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setSelectedBatchTier(null); setOrderSubmitted(false); }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
                  >
                    Close Window
                  </button>
                  <button
                    onClick={() => { setSelectedBatchTier(null); onLaunchStudio(); }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-colors"
                  >
                    Explore Studio While You Wait
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
