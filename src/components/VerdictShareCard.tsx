import React, { useState } from 'react';
import { Gavel, Trophy, Share2, Copy, Check, RotateCcw } from 'lucide-react';
import { ArbiterVerdict, Player } from '../engine/types';

interface VerdictShareCardProps {
  isOpen: boolean;
  winner: Player | 'DRAW' | null;
  lastVerdict: ArbiterVerdict | null;
  onPlayAgain: () => void;
}

export const VerdictShareCard: React.FC<VerdictShareCardProps> = ({
  isOpen,
  winner,
  lastVerdict,
  onPlayAgain,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !winner) return null;

  const shareText = `⚖️ I just played TicTacCourt (AI-Native Tic-Tac-Toe)!
Match Result: ${winner === 'DRAW' ? 'Stalemate Draw!' : `Player ${winner} Victorious!`}
Supreme Arbiter Ruling: "${lastVerdict?.dialogue || 'Court has concluded!'}"
Playable open source demo on GitHub: https://github.com/1997agarwal/TicTacCourt`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 text-center relative">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 text-3xl font-black mb-3">
          {winner === 'DRAW' ? '🤝' : '🏆'}
        </div>

        <h3 className="text-xl font-black text-slate-900">
          {winner === 'DRAW' ? 'Stalemate Declared!' : `Victory for Player ${winner}!`}
        </h3>
        <p className="text-xs text-slate-500 mt-1">Court adjourned by the Supreme Arbiter</p>

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
