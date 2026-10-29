import React from 'react';
import { X, Download, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface LaunchCoversModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchCoversModal: React.FC<LaunchCoversModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const covers = [
    {
      id: 1,
      title: 'Cover 1: Product Hero & Vision Canvas',
      desc: 'Dark obsidian UI showing real-time bounding box annotations with sub-pixel HUD',
      file: '/cover-1-hero.jpg',
      downloadName: 'sightline-cover-1-hero.jpg',
    },
    {
      id: 2,
      title: 'Cover 2: Real-Time CRDT & WebRTC Sync',
      desc: '3D futuristic node visualization of conflict-free peer state synchronization',
      file: '/cover-2-crdt.jpg',
      downloadName: 'sightline-cover-2-crdt.jpg',
    },
    {
      id: 3,
      title: 'Cover 3: Multimodal Voice Patching Engine',
      desc: 'Voice waveform HUD and natural language coordinate patch execution',
      file: '/cover-3-voice.jpg',
      downloadName: 'sightline-cover-3-voice.jpg',
    },
  ];

  const handleDownloadAll = () => {
    covers.forEach((c, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = c.file;
        link.download = c.downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Launch Showcase Covers
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  1200 × 630 px
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimized for Peerlist, Product Hunt, Twitter/X, and GitHub README
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="mt-4 flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-xl p-3">
          <span className="text-xs text-slate-300">
            Click <b>Download Image</b> or right-click any image to <b>Save Image As...</b>
          </span>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All 3 Covers</span>
          </button>
        </div>

        {/* Covers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {covers.map((c) => (
            <div
              key={c.id}
              className="group flex flex-col bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-all duration-200"
            >
              <div className="relative aspect-video bg-black overflow-hidden border-b border-slate-800">
                <img
                  src={c.file}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/70 text-slate-200 backdrop-blur-xs border border-white/10">
                  Cover {c.id}
                </span>
              </div>
              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white">{c.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">1376×768 (16:9)</span>
                  <a
                    href={c.file}
                    download={c.downloadName}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Check className="w-4 h-4" />
            <span>Ready for instant upload to your Peerlist cover slots</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
