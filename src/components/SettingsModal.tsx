import React, { useState } from 'react';
import { X, Key, Volume2, VolumeX, ShieldCheck, Check, Sparkles, Timer } from 'lucide-react';
import { soundManager } from '../engine/sounds';
import { ArbiterPresetId, TimeMode } from '../engine/types';
import { ARBITER_PRESETS } from '../ai/schemas';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  arbiterPreset: ArbiterPresetId;
  onSelectArbiterPreset: (preset: ArbiterPresetId) => void;
  timeMode: TimeMode;
  onSelectTimeMode: (mode: TimeMode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  arbiterPreset,
  onSelectArbiterPreset,
  timeMode,
  onSelectTimeMode,
}) => {
  const [localKey, setLocalKey] = useState(apiKey);
  const [localPreset, setLocalPreset] = useState<ArbiterPresetId>(arbiterPreset);
  const [localTimeMode, setLocalTimeMode] = useState<TimeMode>(timeMode);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(localKey);
    onSelectArbiterPreset(localPreset);
    onSelectTimeMode(localTimeMode);
    onClose();
  };

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundManager.setMuted(nextState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Courtroom & Arbiter Settings</h3>
            <p className="text-xs text-slate-500">Configure judicial personality and game engine</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-zinc-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-5">
          {/* Arbiter Personality Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI Arbiter Personality Preset
              </label>
              <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                Dynamic Prompt & Scoring
              </span>
            </div>
            <div className="space-y-2.5">
              {(Object.keys(ARBITER_PRESETS) as ArbiterPresetId[]).map(key => {
                const preset = ARBITER_PRESETS[key];
                const isSelected = localPreset === key;
                return (
                  <div
                    key={key}
                    onClick={() => setLocalPreset(key)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border text-left ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-400/40'
                        : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/80 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl leading-none">{preset.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>{preset.name}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${preset.badgeBg}`}>
                              Threshold: ≥{preset.threshold}/20
                            </span>
                          </div>
                          <div className="text-[11px] font-medium text-slate-600 mt-0.5">{preset.tagline}</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        isSelected ? 'bg-amber-500 text-white' : 'border border-zinc-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 pl-9 leading-relaxed border-t border-zinc-100 pt-1.5">
                      {preset.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Resistance Mode Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-500" />
                Time Resistance / Speed Clock
              </label>
              <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                Speed Wins
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  id: 'SHOT_CLOCK' as TimeMode,
                  name: '7-Second Shot Clock',
                  emoji: '⚡',
                  desc: 'Each turn has 7 seconds. Play fast! Hesitation causes instant forfeit on timeout. Pauses during Objections.',
                  tag: 'Dynamic Rush',
                },
                {
                  id: 'TIME_BANK' as TimeMode,
                  name: '30-Second Match Bank',
                  emoji: '⏱️',
                  desc: '30s total banked time per player for the whole game. Every second thinking drains your bank.',
                  tag: 'Chess Blitz',
                },
                {
                  id: 'OFF' as TimeMode,
                  name: 'Casual / Timer Off',
                  emoji: '⏸️',
                  desc: 'No ticking timer or timeout forfeiture. Take as much time as you need.',
                  tag: 'Untimed',
                },
              ].map(opt => {
                const isSelected = localTimeMode === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setLocalTimeMode(opt.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border text-left ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-400/40'
                        : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/80 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl leading-none">{opt.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>{opt.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200/80 text-slate-700">
                              {opt.tag}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        isSelected ? 'bg-amber-500 text-white' : 'border border-zinc-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
          <div className="pt-2 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2 border-t border-zinc-100">
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

