import { Board, CellState, Player } from './types';

export function createEmptyBoard(size: number): Board {
  const board: Board = [];
  for (let r = 0; r < size; r++) {
    const row: CellState[] = [];
    for (let c = 0; c < size; c++) {
      row.push({
        player: null,
        frozenTurns: 0,
        isBlocked: false,
        row: r,
        col: c,
      });
    }
    board.push(row);
  }
  return board;
}

export function checkWinner(
  grid: Board,
  size: number
): { winner: Player | 'DRAW' | null; line: [number, number][] | null } {
  const winLength = size === 3 ? 3 : 4;

  // Check rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const first = grid[r][c].player;
      if (!first || grid[r][c].isBlocked) continue;
      let match = true;
      const line: [number, number][] = [[r, c]];
      for (let k = 1; k < winLength; k++) {
        if (grid[r][c + k].player !== first || grid[r][c + k].isBlocked) {
          match = false;
          break;
        }
        line.push([r, c + k]);
      }
      if (match) return { winner: first, line };
    }
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      const first = grid[r][c].player;
      if (!first || grid[r][c].isBlocked) continue;
      let match = true;
      const line: [number, number][] = [[r, c]];
      for (let k = 1; k < winLength; k++) {
        if (grid[r + k][c].player !== first || grid[r + k][c].isBlocked) {
          match = false;
          break;
        }
        line.push([r + k, c]);
      }
      if (match) return { winner: first, line };
    }
  }

  // Check diagonal down-right
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const first = grid[r][c].player;
      if (!first || grid[r][c].isBlocked) continue;
      let match = true;
      const line: [number, number][] = [[r, c]];
      for (let k = 1; k < winLength; k++) {
        if (grid[r + k][c + k].player !== first || grid[r + k][c + k].isBlocked) {
          match = false;
          break;
        }
        line.push([r + k, c + k]);
      }
      if (match) return { winner: first, line };
    }
  }

  // Check diagonal down-left
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = winLength - 1; c < size; c++) {
      const first = grid[r][c].player;
      if (!first || grid[r][c].isBlocked) continue;
      let match = true;
      const line: [number, number][] = [[r, c]];
      for (let k = 1; k < winLength; k++) {
        if (grid[r + k][c - k].player !== first || grid[r + k][c - k].isBlocked) {
          match = false;
          break;
        }
        line.push([r + k, c - k]);
      }
      if (match) return { winner: first, line };
    }
  }

  // Check draw
  let isFull = true;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c].player && !grid[r][c].isBlocked) {
        isFull = false;
        break;
      }
    }
    if (!isFull) break;
  }

  if (isFull) {
    return { winner: 'DRAW', line: null };
  }

  return { winner: null, line: null };
}

export function getAvailableCells(grid: Board): [number, number][] {
  const available: [number, number][] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c];
      if (!cell.player && !cell.isBlocked && cell.frozenTurns <= 0) {
        available.push([r, c]);
      }
    }
  }
  return available;
}

export function findBestMove(grid: Board, botPlayer: Player, size: number): [number, number] {
  const humanPlayer: Player = botPlayer === 'X' ? 'O' : 'X';
  const available = getAvailableCells(grid);

  if (available.length === 0) return [0, 0];

  // 1. Can Bot win on this move?
  for (const [r, c] of available) {
    grid[r][c].player = botPlayer;
    const result = checkWinner(grid, size);
    grid[r][c].player = null;
    if (result.winner === botPlayer) return [r, c];
  }

  // 2. Can Human win on next move? If so, block!
  for (const [r, c] of available) {
    grid[r][c].player = humanPlayer;
    const result = checkWinner(grid, size);
    grid[r][c].player = null;
    if (result.winner === humanPlayer) return [r, c];
  }

  // 3. Take Center if available
  const center = Math.floor(size / 2);
  if (available.some(([r, c]) => r === center && c === center)) {
    return [center, center];
  }

  // 4. Take Corners if available
  const corners: [number, number][] = [
    [0, 0],
    [0, size - 1],
    [size - 1, 0],
    [size - 1, size - 1],
  ];
  const availableCorners = corners.filter(([cr, cc]) =>
    available.some(([ar, ac]) => ar === cr && ac === cc)
  );
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // 5. Random fallback
  return available[Math.floor(Math.random() * available.length)];
}
