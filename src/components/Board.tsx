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

  const getCellSizeClasses = (s: number) => {
    if (s === 3) return 'w-20 h-20 sm:w-28 sm:h-28 text-3xl sm:text-5xl rounded-2xl';
    if (s === 4) return 'w-16 h-16 sm:w-22 sm:h-22 text-2xl sm:text-4xl rounded-2xl';
    if (s === 5) return 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-3xl rounded-xl';
    return 'w-10 h-10 sm:w-13 sm:h-13 text-base sm:text-2xl rounded-lg';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-auto">
      <div
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        className="grid gap-2 sm:gap-2.5 p-3 sm:p-4 bg-zinc-200/70 rounded-3xl backdrop-blur-md shadow-inner border border-zinc-300/80 transition-all duration-500 max-w-full"
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
                className={`relative ${getCellSizeClasses(size)} flex flex-col items-center justify-center font-black transition-all duration-300 select-none shadow-sm ${
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
                <span className="absolute top-1 left-1.5 text-[8px] sm:text-[9px] font-bold text-zinc-300 pointer-events-none">
                  {r + 1},{c + 1}
                </span>

                {/* Frozen Overlay */}
                {isFrozen && (
                  <div className="absolute inset-0 bg-cyan-100/60 rounded-xl flex flex-col items-center justify-center text-cyan-800 backdrop-blur-[1px] pointer-events-none">
                    <Snowflake className="w-4 h-4 sm:w-6 sm:h-6 animate-spin text-cyan-600" />
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-tight mt-0.5">FROZEN</span>
                  </div>
                )}

                {/* Blocked Wall Overlay */}
                {isBlocked && (
                  <div className="absolute inset-0 bg-zinc-300/80 rounded-xl flex flex-col items-center justify-center text-zinc-700 pointer-events-none">
                    <ShieldAlert className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-tight mt-0.5">BLOCKED</span>
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
        {size > 3 && (
          <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Sudden Death Active
          </span>
        )}
      </div>
    </div>
  );
};
