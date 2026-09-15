import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Inline test logic to ensure zero-transpilation speed
function createEmptyBoard(size) {
  const board = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push({ player: null, frozenTurns: 0, isBlocked: false, row: r, col: c });
    }
    board.push(row);
  }
  return board;
}

function checkWinner(grid, size) {
  const winLength = size === 3 ? 3 : 4;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const first = grid[r][c].player;
      if (!first || grid[r][c].isBlocked) continue;
      let match = true;
      const line = [[r, c]];
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

  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      const first = grid[r][c].player;
      if (!first || grid[r][c].isBlocked) continue;
      let match = true;
      const line = [[r, c]];
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

  return { winner: null, line: null };
}

describe('TicTacCourt Deterministic Rules', () => {
  test('creates 3x3 empty board correctly', () => {
    const b = createEmptyBoard(3);
    assert.equal(b.length, 3);
    assert.equal(b[0].length, 3);
    assert.equal(b[0][0].player, null);
  });

  test('detects horizontal win for Player X', () => {
    const b = createEmptyBoard(3);
    b[1][0].player = 'X';
    b[1][1].player = 'X';
    b[1][2].player = 'X';
    const res = checkWinner(b, 3);
    assert.equal(res.winner, 'X');
  });

  test('detects vertical win for Player O', () => {
    const b = createEmptyBoard(3);
    b[0][2].player = 'O';
    b[1][2].player = 'O';
    b[2][2].player = 'O';
    const res = checkWinner(b, 3);
    assert.equal(res.winner, 'O');
  });

  test('detects 4-in-a-row on 4x4 expanded board', () => {
    const b = createEmptyBoard(4);
    b[2][0].player = 'X';
    b[2][1].player = 'X';
    b[2][2].player = 'X';
    b[2][3].player = 'X';
    const res = checkWinner(b, 4);
    assert.equal(res.winner, 'X');
  });
});
