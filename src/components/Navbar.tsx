import React, { useState, useRef, useEffect } from 'react';
import { Gavel, RotateCcw, Settings, Github, Swords, Users, Bot, ChevronDown, Check, Timer } from 'lucide-react';
import { GameMode, ArbiterPresetId, TimeMode } from '../engine/types';
import { ARBITER_PRESETS } from '../ai/schemas';

interface NavbarProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onResetMatch: () => void;
  onOpenSettings: () => void;
  arbiterPreset: ArbiterPresetId;
  onSelectArbiterPreset: (preset: ArbiterPresetId) => void;
  timeMode: TimeMode;
  onToggleTimeMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onSelectMode,
  onResetMatch,
  onOpenSettings,
  arbiterPreset,
  onSelectArbiterPreset,
  timeMode,
  onToggleTimeMode,
}) => {
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPreset = ARBITER_PRESETS[arbiterPreset] || ARBITER_PRESETS.strict;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPresetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-white flex-shrink-0">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">TicTacCourt</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 hidden xs:inline">
                AI Arena
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">Tactical Tic-Tac-Toe with an AI Arbiter</p>
          </div>
        </div>

        {/* Center: Mode Switcher & Arbiter Presets */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 text-xs font-medium">
            <button
              onClick={() => onSelectMode('PVE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'PVE'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">vs AI Bot</span>
              <span className="sm:hidden">PvE</span>
            </button>
            <button
              onClick={() => onSelectMode('PVP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'PVP'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pass & Play</span>
              <span className="sm:hidden">PvP</span>
            </button>
            <button
              onClick={() => onSelectMode('SPECTATOR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'SPECTATOR'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Arena</span>
              <span className="sm:hidden">Auto</span>
            </button>
          </div>

          {/* Arbiter Personality Preset Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
              title="Change Arbiter Personality Preset"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-slate-800 transition-all shadow-sm"
            >
              <span className="text-sm leading-none">{currentPreset.emoji}</span>
              <span className="hidden lg:inline">{currentPreset.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-slate-700 font-mono hidden xl:inline">
                ≥{currentPreset.threshold}/20
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isPresetDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-zinc-100">
                  Arbiter Personality Preset
                </div>
                <div className="space-y-1 mt-1">
                  {(Object.keys(ARBITER_PRESETS) as ArbiterPresetId[]).map(key => {
                    const preset = ARBITER_PRESETS[key];
                    const isSelected = arbiterPreset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onSelectArbiterPreset(key);
                          setIsPresetDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-amber-50/80 border border-amber-200/80 text-slate-900'
                            : 'hover:bg-zinc-50 border border-transparent text-slate-700'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">{preset.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate text-slate-900">{preset.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{preset.tagline}</p>
                          <span className="inline-block text-[10px] font-medium text-slate-400 mt-1 font-mono">
                            Threshold: ≥{preset.threshold}/20
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Time Resistance Quick Toggle */}
          <button
            onClick={onToggleTimeMode}
            title="Toggle Time Resistance (Shot Clock / Time Bank / Off)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              timeMode === 'SHOT_CLOCK'
                ? 'bg-amber-500/10 border-amber-300 text-amber-900'
                : timeMode === 'TIME_BANK'
                ? 'bg-blue-500/10 border-blue-300 text-blue-900'
                : 'bg-zinc-50 border-zinc-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <Timer className={`w-3.5 h-3.5 ${timeMode !== 'OFF' ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden md:inline">
              {timeMode === 'SHOT_CLOCK' ? '7s Shot Clock' : timeMode === 'TIME_BANK' ? '30s Bank' : 'Timer Off'}
            </span>
            <span className="md:hidden font-mono text-[11px]">
              {timeMode === 'SHOT_CLOCK' ? '7s' : timeMode === 'TIME_BANK' ? '30s' : 'Off'}
            </span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetMatch}
            title="Reset Match"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings & Arbiter Presets"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200"
          >
            <Settings className="w-4 h-4" />
          </button>
          <a
            href="https://github.com/1997agarwal/TicTacCourt"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
            Star on GitHub
          </a>
        </div>
      </div>
    </header>
  );
};

