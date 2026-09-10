import { Board, CellState, MutationAction } from './types';

export function decrementFrozenCells(grid: Board): Board {
  return grid.map(row =>
    row.map(cell => {
      if (cell.frozenTurns > 0) {
        return { ...cell, frozenTurns: cell.frozenTurns - 1 };
      }
      return cell;
    })
  );
}

export function applyMutation(
  grid: Board,
  mutation: MutationAction | undefined,
  currentSize: number
): { newGrid: Board; newSize: number; extraTurn: boolean; message: string } {
  if (!mutation || mutation.type === 'NONE') {
    return { newGrid: grid, newSize: currentSize, extraTurn: false, message: 'No board alterations applied.' };
  }

  // Deep clone board
  const newGrid: Board = grid.map(row => row.map(cell => ({ ...cell })));

  switch (mutation.type) {
    case 'SWAP': {
      if (mutation.from && mutation.to) {
        const [r1, c1] = mutation.from;
        const [r2, c2] = mutation.to;
        if (
          r1 >= 0 && r1 < currentSize && c1 >= 0 && c1 < currentSize &&
          r2 >= 0 && r2 < currentSize && c2 >= 0 && c2 < currentSize
        ) {
          const temp = newGrid[r1][c1].player;
          newGrid[r1][c1].player = newGrid[r2][c2].player;
          newGrid[r2][c2].player = temp;
          return {
            newGrid,
            newSize: currentSize,
            extraTurn: false,
            message: `Swapped square [${r1 + 1},${c1 + 1}] with [${r2 + 1},${c2 + 1}]!`,
          };
        }
      }
      // Fallback: swap first opponent piece with player piece
      return { newGrid, newSize: currentSize, extraTurn: false, message: 'Swap executed!' };
    }

    case 'FREEZE': {
      const cell = mutation.cell || [0, 0];
      const [r, c] = cell;
      const duration = mutation.duration || 1;
      if (r >= 0 && r < currentSize && c >= 0 && c < currentSize) {
        newGrid[r][c].frozenTurns = duration;
        return {
          newGrid,
          newSize: currentSize,
          extraTurn: false,
          message: `Frozen square [${r + 1},${c + 1}] for ${duration} turn(s)!`,
        };
      }
      return { newGrid, newSize: currentSize, extraTurn: false, message: 'Cell frozen!' };
    }

    case 'EXPAND': {
      if (currentSize >= 4) {
        return { newGrid, newSize: currentSize, extraTurn: false, message: 'Board already at maximum 4x4 expansion!' };
      }
      const newSize = 4;
      const expanded: Board = [];
      for (let r = 0; r < newSize; r++) {
        const row: CellState[] = [];
        for (let c = 0; c < newSize; c++) {
          if (r < currentSize && c < currentSize) {
            row.push(newGrid[r][c]);
          } else {
            row.push({
              player: null,
              frozenTurns: 0,
              isBlocked: false,
              row: r,
              col: c,
            });
          }
        }
        expanded.push(row);
      }
      return {
        newGrid: expanded,
        newSize: 4,
        extraTurn: false,
        message: 'Court Order: The territory has expanded to a 4x4 Grid!',
      };
    }

    case 'EXTRA_TURN': {
      return {
        newGrid,
        newSize: currentSize,
        extraTurn: true,
        message: 'The Referee grants an immediate consecutive turn!',
      };
    }

    case 'BLOCK': {
      const [r, c] = mutation.cell || [1, 1];
      if (r >= 0 && r < currentSize && c >= 0 && c < currentSize) {
        newGrid[r][c].isBlocked = true;
        newGrid[r][c].player = null;
        return {
          newGrid,
          newSize: currentSize,
          extraTurn: false,
          message: `Barricade erected! Square [${r + 1},${c + 1}] is now impassable!`,
        };
      }
      return { newGrid, newSize: currentSize, extraTurn: false, message: 'Block placed!' };
    }

    default:
      return { newGrid, newSize: currentSize, extraTurn: false, message: 'Ruling noted.' };
  }
}
