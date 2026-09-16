import React, { useState } from 'react';
import { Gavel, Trophy, Share2, Copy, Check, RotateCcw, Timer } from 'lucide-react';
import { ArbiterVerdict, Player, WinReason } from '../engine/types';

interface VerdictShareCardProps {
  isOpen: boolean;
  winner: Player | 'DRAW' | null;
  lastVerdict: ArbiterVerdict | null;
  winReason?: WinReason | null;
  onPlayAgain: () => void;
}

export const VerdictShareCard: React.FC<VerdictShareCardProps> = ({
  isOpen,
  winner,
  lastVerdict,
  winReason,
  onPlayAgain,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !winner) return null;

  const isTimeoutWin = winReason === 'TIMEOUT';

  const shareText = `⚖️ I just played TicTacCourt (AI-Native Tic-Tac-Toe)!
Match Result: ${winner === 'DRAW' ? 'Stalemate Draw!' : isTimeoutWin ? `Player ${winner} won by Time Resistance (Opponent Timed Out)!` : `Player ${winner} Victorious!`}
Supreme Arbiter Ruling: "${lastVerdict?.dialogue || 'Court has concluded!'}"
Playable live demo: https://1997agarwal.github.io/TicTacCourt`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 text-center relative">
        <div className={`w-16 h-16 mx-auto rounded-3xl text-white flex items-center justify-center shadow-lg text-3xl font-black mb-3 ${
          isTimeoutWin
            ? 'bg-gradient-to-tr from-amber-500 to-rose-500 shadow-rose-500/20'
            : 'bg-gradient-to-tr from-amber-400 to-amber-500 shadow-amber-500/20'
        }`}>
          {winner === 'DRAW' ? '🤝' : isTimeoutWin ? '⚡' : '🏆'}
        </div>

        <h3 className="text-xl font-black text-slate-900">
          {winner === 'DRAW' ? 'Stalemate Declared!' : `Victory for Player ${winner}!`}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1.5">
          {isTimeoutWin ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
              <Timer className="w-3 h-3" /> Opponent Exhausted Shot Clock / Time Bank
            </span>
          ) : (
            'Court adjourned by the Supreme Arbiter'
          )}
        </p>

        {/* Highlight Ruling Box */}
        {lastVerdict && (
          <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <Gavel className="w-3.5 h-3.5" />
              Memorable Ruling of the Match:
            </div>
            <p className="text-xs font-semibold text-slate-800 italic">
              "{lastVerdict.dialogue}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Play Rematch
          </button>
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm hover:bg-amber-200 transition-all shadow-sm active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Card!' : 'Share Result'}
          </button>
        </div>
      </div>
    </div>
  );
};
