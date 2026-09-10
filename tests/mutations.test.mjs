import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

function applySwap(grid, [r1, c1], [r2, c2]) {
  const newGrid = grid.map(row => row.map(c => ({ ...c })));
  const temp = newGrid[r1][c1].player;
  newGrid[r1][c1].player = newGrid[r2][c2].player;
  newGrid[r2][c2].player = temp;
  return newGrid;
}

function expandBoard(grid, currentSize) {
  const newSize = 4;
  const expanded = [];
  for (let r = 0; r < newSize; r++) {
    const row = [];
    for (let c = 0; c < newSize; c++) {
      if (r < currentSize && c < currentSize) {
        row.push(grid[r][c]);
      } else {
        row.push({ player: null, frozenTurns: 0, isBlocked: false, row: r, col: c });
      }
    }
    expanded.push(row);
  }
  return expanded;
}

describe('PromptCourt Board State Mutations', () => {
  test('swaps pieces between two coordinates', () => {
    const grid = [
      [{ player: 'X' }, { player: null }],
      [{ player: null }, { player: 'O' }]
    ];
    const updated = applySwap(grid, [0, 0], [1, 1]);
    assert.equal(updated[0][0].player, 'O');
    assert.equal(updated[1][1].player, 'X');
  });

  test('expands board from 3x3 to 4x4', () => {
    const grid = [
      [{ player: 'X' }, { player: null }, { player: null }],
      [{ player: null }, { player: 'O' }, { player: null }],
      [{ player: null }, { player: null }, { player: null }]
    ];
    const expanded = expandBoard(grid, 3);
    assert.equal(expanded.length, 4);
    assert.equal(expanded[0].length, 4);
    assert.equal(expanded[0][0].player, 'X');
    assert.equal(expanded[1][1].player, 'O');
    assert.equal(expanded[3][3].player, null);
  });
});
