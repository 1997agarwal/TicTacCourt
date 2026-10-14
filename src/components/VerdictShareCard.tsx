import React, { useState } from 'react';
import { Gavel, Trophy, Share2, Copy, Check, RotateCcw, Timer, FileText, Download } from 'lucide-react';
import { ArbiterVerdict, Player, WinReason } from '../engine/types';

interface VerdictShareCardProps {
  isOpen: boolean;
  winner: Player | 'DRAW' | null;
  lastVerdict: ArbiterVerdict | null;
  winReason?: WinReason | null;
  historyLog?: string[];
  boardSize?: number;
  onPlayAgain: () => void;
}

export const VerdictShareCard: React.FC<VerdictShareCardProps> = ({
  isOpen,
  winner,
  lastVerdict,
  winReason,
  historyLog = [],
  boardSize = 3,
  onPlayAgain,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

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

  const handleDownloadTranscript = () => {
    const docketId = `TCC-${Date.now().toString().slice(-6)}`;
    const outcomeText = winner === 'DRAW' ? 'Stalemate Dismissal' : isTimeoutWin ? `Forfeit Judgment for Player ${winner} (Opponent Timed Out)` : `Judgment Rendered in Favor of Player ${winner}`;
    
    const transcriptContent = `# 🏛️ Supreme Court of TicTacCourt: Official Case Record
> **Docket Case Number:** ${docketId}  
> **Final Ruling:** ${outcomeText}  
> **Territory Dimensions:** ${boardSize}×${boardSize} Grid (Cascading Sudden Death)  
> **Supreme Arbiter Gavel:** "${lastVerdict?.dialogue || 'Court has reached final adjournment.'}"  
> **Live Arena Reference:** https://1997agarwal.github.io/TicTacCourt  

---

## ⚖️ Official Stenographer Trial Log
${historyLog.map((entry, idx) => `[Entry #${String(idx + 1).padStart(2, '0')}] ${entry}`).join('\n')}

---
*Certified authentic and sealed by the Supreme AI Arbiter of TicTacCourt.*
*Play and persuade the referee at: https://1997agarwal.github.io/TicTacCourt*
`;

    const blob = new Blob([transcriptContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tictaccourt-transcript-${docketId.toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
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
        <div className="mt-6 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onPlayAgain}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Play Rematch
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm hover:bg-amber-200 transition-all shadow-sm active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Card!' : 'Share Result'}
            </button>
          </div>

          <button
            onClick={handleDownloadTranscript}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs border border-slate-200 transition active:scale-95"
            title="Download full stenographer transcript of objections, rulings, and board mutations"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Transcript Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Stenographer Record (.md)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
