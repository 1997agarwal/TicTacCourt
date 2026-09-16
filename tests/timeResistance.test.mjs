import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Core logic simulating Time Resistance behavior
function cycleTimeMode(current) {
  if (current === 'SHOT_CLOCK') return 'TIME_BANK';
  if (current === 'TIME_BANK') return 'OFF';
  return 'SHOT_CLOCK';
}

function tickPlayerTimer(timeRemaining, currentPlayer, timeMode, isPaused) {
  if (isPaused || timeMode === 'OFF') {
    return { nextTimes: { ...timeRemaining }, timedOut: false };
  }
  const current = timeRemaining[currentPlayer];
  const nextTime = Math.max(0, Number((current - 0.1).toFixed(1)));
  const timedOut = nextTime <= 0;
  return {
    nextTimes: { ...timeRemaining, [currentPlayer]: nextTime },
    timedOut,
  };
}

function computeVelocityStreak(prevStreak, currentPlayer, moveDuration) {
  if (moveDuration <= 2.2) {
    return {
      player: currentPlayer,
      count: prevStreak && prevStreak.player === currentPlayer ? prevStreak.count + 1 : 1,
    };
  }
  return null;
}

function resolveTimeoutWinner(currentPlayer) {
  return currentPlayer === 'X' ? 'O' : 'X';
}

describe('Time Resistance Mechanics', () => {
  test('cycles through time modes correctly', () => {
    let mode = 'SHOT_CLOCK';
    mode = cycleTimeMode(mode);
    assert.equal(mode, 'TIME_BANK');
    mode = cycleTimeMode(mode);
    assert.equal(mode, 'OFF');
    mode = cycleTimeMode(mode);
    assert.equal(mode, 'SHOT_CLOCK');
  });

  test('decrements active player clock while non-active player remains constant', () => {
    const times = { X: 7.0, O: 7.0 };
    const { nextTimes, timedOut } = tickPlayerTimer(times, 'X', 'SHOT_CLOCK', false);
    assert.equal(nextTimes.X, 6.9);
    assert.equal(nextTimes.O, 7.0);
    assert.equal(timedOut, false);
  });

  test('freezes timer during courtroom deliberation or modal open', () => {
    const times = { X: 4.2, O: 6.8 };
    const { nextTimes, timedOut } = tickPlayerTimer(times, 'X', 'SHOT_CLOCK', true);
    assert.equal(nextTimes.X, 4.2);
    assert.equal(nextTimes.O, 6.8);
    assert.equal(timedOut, false);
  });

  test('detects timeout and awards forfeit victory to opponent', () => {
    const times = { X: 0.1, O: 5.5 };
    const { nextTimes, timedOut } = tickPlayerTimer(times, 'X', 'SHOT_CLOCK', false);
    assert.equal(nextTimes.X, 0);
    assert.equal(timedOut, true);
    const victor = resolveTimeoutWinner('X');
    assert.equal(victor, 'O');
  });

  test('calculates velocity streak for fast consecutive moves under 2.2s', () => {
    let streak = null;
    streak = computeVelocityStreak(streak, 'X', 1.4);
    assert.deepEqual(streak, { player: 'X', count: 1 });

    streak = computeVelocityStreak(streak, 'X', 0.9);
    assert.deepEqual(streak, { player: 'X', count: 2 });

    // Slow move breaks streak
    streak = computeVelocityStreak(streak, 'X', 3.5);
    assert.equal(streak, null);
  });
});
