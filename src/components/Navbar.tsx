import React from 'react';
import { Gavel, RotateCcw, Settings, Github, Swords, Users, Bot } from 'lucide-react';
import { GameMode } from '../engine/types';

interface NavbarProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onResetMatch: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onSelectMode,
  onResetMatch,
  onOpenSettings,
}) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-white">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">TicTacCourt</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                AI Arena
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Tactical Tic-Tac-Toe with an AI Arbiter</p>
          </div>
        </div>

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
            title="Settings & API Key"
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
