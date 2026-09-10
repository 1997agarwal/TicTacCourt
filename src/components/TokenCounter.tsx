import React from 'react';
import { Gavel, Sparkles } from 'lucide-react';
import { Player } from '../engine/types';

interface TokenCounterProps {
  currentPlayer: Player;
  tokens: { X: number; O: number };
  onCallObjection: () => void;
  disabled: boolean;
}

export const TokenCounter: React.FC<TokenCounterProps> = ({
  currentPlayer,
  tokens,
  onCallObjection,
  disabled,
}) => {
  const currentTokenCount = tokens[currentPlayer];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-zinc-200 shadow-sm">
      {/* Player X Tokens */}
      <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
        currentPlayer === 'X' ? 'bg-amber-50/80 border border-amber-300 ring-2 ring-amber-400/20' : 'opacity-70'
      }`}>
        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
          X
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">Player X Tokens</div>
          <div className="flex items-center gap-1 mt-0.5">
            {[...Array(2)].map((_, i) => (
              <Gavel
                key={i}
                className={`w-4 h-4 transition-all ${
                  i < tokens.X ? 'text-amber-500 fill-amber-500' : 'text-zinc-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Center Objection Button */}
      <button
        onClick={onCallObjection}
        disabled={disabled || currentTokenCount <= 0}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
          disabled || currentTokenCount <= 0
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-amber-500/25 animate-pulse-subtle'
        }`}
      >
        <Gavel className="w-4 h-4" />
        <span>File Objection to Ref!</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
      </button>

      {/* Player O Tokens */}
      <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
        currentPlayer === 'O' ? 'bg-amber-50/80 border border-amber-300 ring-2 ring-amber-400/20' : 'opacity-70'
      }`}>
        <div className="w-8 h-8 rounded-lg bg-rose-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
          O
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">Player O Tokens</div>
          <div className="flex items-center gap-1 mt-0.5">
            {[...Array(2)].map((_, i) => (
              <Gavel
                key={i}
                className={`w-4 h-4 transition-all ${
                  i < tokens.O ? 'text-amber-500 fill-amber-500' : 'text-zinc-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
