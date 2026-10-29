import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Cloud, 
  Mic, 
  Users, 
  Layers, 
  ArrowRight, 
  X,
  Tag,
  Copy,
  CheckCircle2
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutUrl?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  checkoutUrl = 'https://sightline.lemonsqueezy.com'
}) => {
  const [promoInput, setPromoInput] = useState('PH50');
  const [isCopied, setIsCopied] = useState(false);
  const [isDiscountApplied, setIsDiscountApplied] = useState(true);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText('PH50');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'PH50') {
      setIsDiscountApplied(true);
    }
  };

  const regularPrice = 49;
  const discountedPrice = 24.50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-emerald-500/20 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Special Product Hunt Launch Deal — <strong>50% OFF Lifetime Early Access</strong></span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[85vh]">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5" />
              Sightline Pro Architect Tier
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Scale Your Computer Vision Pipeline
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Upgrade from in-browser tinkering to an enterprise-grade collaborative verification pipeline for your ML engineering team.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-950/70 border border-indigo-500/40 rounded-xl p-5 sm:p-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Launch Discount
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    ${isDiscountApplied ? discountedPrice.toFixed(2) : regularPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">/ month (billed annually)</span>
                  {isDiscountApplied && (
                    <span className="text-xs line-through text-slate-500 font-mono">
                      ${regularPrice}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save 50% with code <span className="font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">PH50</span>
                </p>
              </div>

              {/* Promo code box */}
              <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400 ml-1" />
                <span className="text-xs font-mono font-bold text-amber-300">PH50</span>
                <button
                  onClick={handleCopyCode}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 rounded transition-colors flex items-center gap-1"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <Cloud className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">High-Volume Batch Audits</span>
                <span className="text-slate-400">Upload and verify large custom dataset batches without limits.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Private WebRTC Rooms</span>
                <span className="text-slate-400">Dedicated encrypted rooms to co-audit datasets with your engineering team.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <Mic className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Hands-Free Voice Patching</span>
                <span className="text-slate-400">Verbal bounding box coordinate nudging and rapid class reclassification.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Enterprise Export Formats</span>
                <span className="text-slate-400">Export in COCO, YOLOv8/v11, Pascal VOC, and immutable CRDT audit logs.</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Sightline Pro ($24.50/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Continue with Free
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              14-Day Money-Back Guarantee
            </span>
            <span>·</span>
            <span>Cancel Anytime</span>
            <span>·</span>
            <span>Instant Setup</span>
          </div>
        </div>
      </div>
    </div>
  );
};
