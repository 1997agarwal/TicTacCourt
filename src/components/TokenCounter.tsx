import React from 'react';
import { Gavel, Sparkles, Timer, Zap } from 'lucide-react';
import { Player, TimeMode } from '../engine/types';

interface TokenCounterProps {
  currentPlayer: Player;
  tokens: { X: number; O: number };
  onCallObjection: () => void;
  disabled: boolean;
  timeMode?: TimeMode;
  timeRemaining?: { X: number; O: number };
  maxTime?: number;
  velocityStreak?: { player: Player; count: number } | null;
}

export const TokenCounter: React.FC<TokenCounterProps> = ({
  currentPlayer,
  tokens,
  onCallObjection,
  disabled,
  timeMode = 'SHOT_CLOCK',
  timeRemaining = { X: 7, O: 7 },
  maxTime = 7,
  velocityStreak = null,
}) => {
  const currentTokenCount = tokens[currentPlayer];

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0.0s';
    if (seconds < 10) return `${seconds.toFixed(1)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isTimerActive = timeMode !== 'OFF';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-zinc-200 shadow-sm transition-all">
      {/* Player X Card */}
      <div className={`flex flex-col min-w-[150px] p-3 rounded-xl transition-all ${
        currentPlayer === 'X'
          ? isTimerActive && timeRemaining.X <= 2.5
            ? 'bg-rose-50 border-2 border-rose-400 ring-2 ring-rose-400/20'
            : 'bg-amber-50/80 border border-amber-300 ring-2 ring-amber-400/20'
          : 'bg-zinc-50 border border-zinc-200/80 opacity-80'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-black flex items-center justify-center text-sm shadow-sm flex-shrink-0">
            X
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Player X</span>
              {velocityStreak?.player === 'X' && velocityStreak.count >= 2 && (
                <span className="flex items-center text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full border border-amber-200">
                  <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                  {velocityStreak.count}x Speed
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(tokens.X)].map((_, i) => (
                <Gavel
                  key={i}
                  className="w-3.5 h-3.5 text-amber-500 fill-amber-500 transition-all"
                />
              ))}
              {tokens.X === 0 && <span className="text-[10px] text-zinc-400">No tokens</span>}
            </div>
          </div>
        </div>

        {/* Time Resistance Countdown for X */}
        {isTimerActive && (
          <div className="mt-2 pt-2 border-t border-zinc-200/60">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1 text-slate-500">
                <Timer className="w-3 h-3 text-slate-400" />
                <span className="font-semibold text-[10px]">Shot Clock:</span>
              </span>
              <span className={`font-black ${
                currentPlayer === 'X'
                  ? timeRemaining.X <= 2.5
                    ? 'text-rose-600 animate-pulse text-xs'
                    : timeRemaining.X <= 4
                    ? 'text-amber-600 text-xs'
                    : 'text-blue-600 text-xs'
                  : 'text-slate-500'
              }`}>
                {formatTime(timeRemaining.X)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-100 ${
                  timeRemaining.X <= 2.5
                    ? 'bg-rose-500 animate-pulse'
                    : timeRemaining.X <= 4
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, (timeRemaining.X / maxTime) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Center Objection Button & Time Resistance Badge */}
      <div className="flex flex-col items-center gap-1.5">
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
        {isTimerActive && (
          <span className="text-[10px] font-bold text-amber-800 tracking-wider uppercase flex items-center gap-1 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200/80">
            <Timer className="w-3 h-3 text-amber-700" />
            <span>Time Resistance Active • Play Fast or Forfeit!</span>
          </span>
        )}
      </div>

      {/* Player O Card */}
      <div className={`flex flex-col min-w-[150px] p-3 rounded-xl transition-all ${
        currentPlayer === 'O'
          ? isTimerActive && timeRemaining.O <= 2.5
            ? 'bg-rose-50 border-2 border-rose-400 ring-2 ring-rose-400/20'
            : 'bg-amber-50/80 border border-amber-300 ring-2 ring-amber-400/20'
          : 'bg-zinc-50 border border-zinc-200/80 opacity-80'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white font-black flex items-center justify-center text-sm shadow-sm flex-shrink-0">
            O
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Player O</span>
              {velocityStreak?.player === 'O' && velocityStreak.count >= 2 && (
                <span className="flex items-center text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full border border-amber-200">
                  <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                  {velocityStreak.count}x Speed
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(tokens.O)].map((_, i) => (
                <Gavel
                  key={i}
                  className="w-3.5 h-3.5 text-amber-500 fill-amber-500 transition-all"
                />
              ))}
              {tokens.O === 0 && <span className="text-[10px] text-zinc-400">No tokens</span>}
            </div>
          </div>
        </div>

        {/* Time Resistance Countdown for O */}
        {isTimerActive && (
          <div className="mt-2 pt-2 border-t border-zinc-200/60">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1 text-slate-500">
                <Timer className="w-3 h-3 text-slate-400" />
                <span className="font-semibold text-[10px]">Shot Clock:</span>
              </span>
              <span className={`font-black ${
                currentPlayer === 'O'
                  ? timeRemaining.O <= 2.5
                    ? 'text-rose-600 animate-pulse text-xs'
                    : timeRemaining.O <= 4
                    ? 'text-amber-600 text-xs'
                    : 'text-rose-600 text-xs'
                  : 'text-slate-500'
              }`}>
                {formatTime(timeRemaining.O)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-100 ${
                  timeRemaining.O <= 2.5
                    ? 'bg-rose-500 animate-pulse'
                    : timeRemaining.O <= 4
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, (timeRemaining.O / maxTime) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
