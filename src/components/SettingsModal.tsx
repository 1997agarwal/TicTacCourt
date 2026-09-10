import React, { useState } from 'react';
import { X, Key, Sparkles, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { soundManager } from '../engine/sounds';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [localKey, setLocalKey] = useState(apiKey);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(localKey);
    onClose();
  };

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundManager.setMuted(nextState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 relative">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <h3 className="font-bold text-slate-900 text-base">Courtroom & AI Settings</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-zinc-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center gap-2.5">
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-amber-600" />}
              <div>
                <div className="text-sm font-semibold text-slate-800">Courtroom Sound Effects</div>
                <div className="text-xs text-slate-500">Procedural Web Audio gavel & fanfares</div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isMuted ? 'bg-zinc-200 text-slate-600' : 'bg-amber-500 text-white shadow-sm'
              }`}
            >
              {isMuted ? 'Muted' : 'Enabled'}
            </button>
          </div>

          {/* AI Engine Provider & BYOK */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Google Gemini API Key (Optional BYOK):
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                value={localKey}
                onChange={e => setLocalKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Leaves blank for <strong>Zero-Latency Offline Mock Arbiter</strong> (100% Free). Stored locally in your browser.</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-zinc-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
