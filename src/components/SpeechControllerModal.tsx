import React, { useState, useEffect, useRef } from 'react';
import { VisualObject, ObjectStatus } from '../types/sightline';
import { Mic, MicOff, Check, X, Sparkles, Volume2, AlertCircle } from 'lucide-react';

interface SpeechControllerModalProps {
  targetObject: VisualObject | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyPatch: (
    id: string,
    updates: Partial<VisualObject['current']>,
    author?: 'human' | 'ai',
    status?: ObjectStatus
  ) => void;
}

// Quick speech intent simulation presets for instant zero-cost testing
const SAMPLE_VOICE_COMMANDS = [
  'Correct label to Industrial Pallet Rack',
  'Label as Autonomous Delivery Robot',
  'Verify with 100% confidence',
  'Change label to High Voltage Junction Box',
  'Mark as verified safety hazard',
];

export const SpeechControllerModal: React.FC<SpeechControllerModalProps> = ({
  targetObject,
  isOpen,
  onClose,
  onApplyPatch,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedAction, setParsedAction] = useState<{
    name?: string;
    confidence?: number;
    status?: ObjectStatus;
  } | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
      } else {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          parseVoiceIntent(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error/handled:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const parseVoiceIntent = (text: string) => {
    const lower = text.toLowerCase().trim();
    const action: { name?: string; confidence?: number; status?: ObjectStatus } = {};

    // Check verification intent
    if (lower.includes('verify') || lower.includes('confirm') || lower.includes('correct box')) {
      action.confidence = 1.0;
      action.status = 'verified';
    }

    // Check label extraction patterns
    const labelMatch =
      lower.match(/(?:correct|label|change|name|rename|set label to|call it)\s+(?:as\s+|to\s+)?(.+)/i) ||
      lower.match(/it's a (.+)/i) ||
      lower.match(/this is a (.+)/i);

    if (labelMatch && labelMatch[1]) {
      let extracted = labelMatch[1].trim();
      // Remove trailing punctuation or confidence words
      extracted = extracted.replace(/\b(with 100% confidence|please|verified)\b/gi, '').trim();
      if (extracted.length > 0) {
        action.name = extracted.charAt(0).toUpperCase() + extracted.slice(1);
        action.status = 'corrected';
        action.confidence = 1.0;
      }
    }

    if (Object.keys(action).length > 0) {
      setParsedAction(action);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      setParsedAction(null);
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Error starting speech:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSimulateCommand = (cmd: string) => {
    setTranscript(cmd);
    parseVoiceIntent(cmd);
  };

  const handleApplyVoicePatch = () => {
    if (!targetObject || !parsedAction) return;

    onApplyPatch(
      targetObject.id,
      {
        ...(parsedAction.name ? { name: parsedAction.name } : {}),
        ...(parsedAction.confidence !== undefined ? { confidence: parsedAction.confidence } : {}),
      },
      'human',
      parsedAction.status || 'corrected'
    );

    onClose();
  };

  if (!isOpen || !targetObject) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Task 1: Atomic Speech-to-Patch Pipeline
              </h3>
              <p className="text-[11px] text-slate-400">
                Correcting: <span className="text-slate-200 font-medium">{targetObject.current.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Listening / Microphone Controller */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping" />
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!speechSupported}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                !speechSupported
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : isListening
                  ? 'bg-rose-600 text-white scale-105 shadow-rose-900/50'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="text-xs text-slate-300 font-medium">
            {isListening ? (
              <span className="text-rose-400 animate-pulse flex items-center gap-1.5 justify-center">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Listening to human voice... Speak correction now
              </span>
            ) : speechSupported ? (
              <span>Click microphone to speak or test with preset intents below</span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
                Speech API restricted in iframe; use instant voice simulations below
              </span>
            )}
          </div>
        </div>

        {/* Live Transcript & Parsed Intent Diff */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 space-y-2">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-indigo-400" /> Speech Transcript
            </span>
            <span className="font-mono text-[10px] text-slate-600">Web Speech API</span>
          </div>
          <div className="text-sm font-medium text-white min-h-[24px]">
            {transcript ? `"${transcript}"` : <span className="text-slate-600 italic">No audio recorded yet</span>}
          </div>

          {parsedAction && (
            <div className="pt-2 border-t border-slate-900 mt-2">
              <div className="text-[11px] text-indigo-300 font-medium mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Extracted CRDT Immutable Patch:
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-indigo-900/50 text-xs font-mono space-y-1">
                {parsedAction.name && (
                  <div>
                    <span className="text-slate-400">name: </span>
                    <span className="text-rose-400 line-through mr-1">"{targetObject.current.name}"</span>
                    <span className="text-emerald-400">"{parsedAction.name}"</span>
                  </div>
                )}
                {parsedAction.confidence !== undefined && (
                  <div>
                    <span className="text-slate-400">confidence: </span>
                    <span className="text-rose-400 line-through mr-1">{targetObject.current.confidence}</span>
                    <span className="text-emerald-400">{parsedAction.confidence}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">status: </span>
                  <span className="text-emerald-400">"{parsedAction.status || 'corrected'}"</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Simulation Buttons */}
        <div className="mb-5">
          <div className="text-[11px] text-slate-400 mb-1.5 font-medium">Quick Simulated Human Audio Commands:</div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_VOICE_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleSimulateCommand(cmd)}
                className="text-left text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyVoicePatch}
            disabled={!parsedAction}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              parsedAction
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Commit Immutable Patch to Yjs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
