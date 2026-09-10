import React from 'react';
import { Snowflake, ShieldAlert } from 'lucide-react';
import { Board as BoardType, Player } from '../engine/types';

interface BoardProps {
  grid: BoardType;
  size: number;
  onCellClick: (row: number, col: number) => void;
  winningLine: [number, number][] | null;
  disabled: boolean;
}

export const Board: React.FC<BoardProps> = ({
  grid,
  size,
  onCellClick,
  winningLine,
  disabled,
}) => {
  const isWinningCell = (r: number, c: number) => {
    return winningLine?.some(([lr, lc]) => lr === r && lc === c) ?? false;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`grid gap-2.5 p-3 sm:p-4 bg-zinc-200/70 rounded-3xl backdrop-blur-md shadow-inner border border-zinc-300/80 transition-all duration-500 ${
          size === 3 ? 'grid-cols-3' : 'grid-cols-4'
        }`}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isWinner = isWinningCell(r, c);
            const isFrozen = cell.frozenTurns > 0;
            const isBlocked = cell.isBlocked;
            const hasPiece = cell.player !== null;

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                disabled={disabled || hasPiece || isFrozen || isBlocked}
                className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center font-black text-3xl sm:text-5xl transition-all duration-300 select-none shadow-sm ${
                  isWinner
                    ? 'bg-amber-400 text-slate-900 scale-105 shadow-amber-400/50 shadow-lg z-10 animate-bounce'
                    : isFrozen
                    ? 'bg-cyan-50 border-2 border-cyan-300 text-cyan-700 cursor-not-allowed'
                    : isBlocked
                    ? 'bg-zinc-300 border-2 border-zinc-400 text-zinc-500 cursor-not-allowed'
                    : hasPiece
                    ? 'bg-white cursor-default'
                    : 'bg-white/90 hover:bg-white hover:scale-98 hover:shadow-md cursor-pointer border border-zinc-200/70 active:scale-95'
                }`}
              >
                {/* Coordinates Watermark */}
                <span className="absolute top-1.5 left-2 text-[9px] font-bold text-zinc-300 pointer-events-none">
                  {r + 1},{c + 1}
                </span>

                {/* Frozen Overlay */}
                {isFrozen && (
                  <div className="absolute inset-0 bg-cyan-100/60 rounded-2xl flex flex-col items-center justify-center text-cyan-800 backdrop-blur-[1px] pointer-events-none">
                    <Snowflake className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-cyan-600" />
                    <span className="text-[10px] font-bold tracking-tight mt-1">FROZEN</span>
                  </div>
                )}

                {/* Blocked Wall Overlay */}
                {isBlocked && (
                  <div className="absolute inset-0 bg-zinc-300/80 rounded-2xl flex flex-col items-center justify-center text-zinc-700 pointer-events-none">
                    <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[10px] font-bold tracking-tight mt-1">BLOCKED</span>
                  </div>
                )}

                {/* Player Mark */}
                {cell.player === 'X' && (
                  <span className="text-blue-600 transition-all scale-100 animate-in zoom-in-50 duration-200">
                    X
                  </span>
                )}
                {cell.player === 'O' && (
                  <span className="text-rose-500 transition-all scale-100 animate-in zoom-in-50 duration-200">
                    O
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="mt-3 text-xs text-slate-500 flex items-center gap-3">
        <span className="flex items-center gap-1 font-semibold text-slate-700">
          Grid: {size}×{size}
        </span>
        <span>•</span>
        <span>Win Condition: {size === 3 ? '3 in a row' : '4 in a row'}</span>
      </div>
    </div>
  );
};
