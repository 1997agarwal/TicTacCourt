import React from 'react';
import { Gavel, CheckCircle2, XCircle, Sparkles, Scale } from 'lucide-react';
import { ArbiterVerdict } from '../engine/types';

interface ArbiterHUDProps {
  lastVerdict: ArbiterVerdict | null;
  isDeliberating: boolean;
  historyLog: string[];
}

export const ArbiterHUD: React.FC<ArbiterHUDProps> = ({
  lastVerdict,
  isDeliberating,
  historyLog,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-zinc-200 shadow-sm p-5 transition-all">
      {/* Arbiter Identity Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20 font-black">
              ⚖️
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">The AI Arbiter</h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                Supreme Ref
              </span>
            </div>
            <p className="text-xs text-slate-500">Autonomous Judicial Engine • Plain English Jurisprudence</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {isDeliberating ? (
            <span className="flex items-center gap-1.5 text-amber-600 animate-pulse">
              <Gavel className="w-4 h-4 animate-bounce" />
              Deliberating...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Court in Session
            </span>
          )}
        </div>
      </div>

      {/* Live Verdict Display */}
      {lastVerdict ? (
        <div className="mt-4 p-4 rounded-2xl border transition-all animate-in fade-in duration-300 bg-zinc-50/70 border-zinc-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {lastVerdict.status === 'SUSTAINED' ? (
                <span className="flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  OBJECTION SUSTAINED!
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300">
                  <XCircle className="w-3.5 h-3.5" />
                  OBJECTION OVERRULED!
                </span>
              )}
              <span className="font-bold text-xs text-slate-800">{lastVerdict.rulingTitle}</span>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Score: <span className="font-bold text-amber-600">{lastVerdict.score}/20</span>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-800 italic mt-2">
            "{lastVerdict.dialogue}"
          </p>

          <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-zinc-200/60 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span><strong className="text-slate-700">Judicial Precedent:</strong> {lastVerdict.reasoning}</span>
          </p>
        </div>
      ) : (
        <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-slate-500">
          No objections filed yet this match. Take normal moves, or spend an Objection Token to appeal to the Ref!
        </div>
      )}

      {/* Match History Log */}
      {historyLog.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Courtroom Docket Log:
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto pr-1 text-xs text-slate-600">
            {historyLog.slice(-3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
