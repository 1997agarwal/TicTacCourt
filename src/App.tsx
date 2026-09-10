import React, { useState, useEffect, useCallback } from 'react';
import { triggerConfetti } from './engine/confetti';
import { Navbar } from './components/Navbar';
import { Board } from './components/Board';
import { TokenCounter } from './components/TokenCounter';
import { ArbiterHUD } from './components/ArbiterHUD';
import { CourtroomModal } from './components/CourtroomModal';
import { SettingsModal } from './components/SettingsModal';
import { VerdictShareCard } from './components/VerdictShareCard';

import { Board as BoardType, Player, GameMode, ArbiterVerdict } from './engine/types';
import { createEmptyBoard, checkWinner, findBestMove, getAvailableCells } from './engine/gameRules';
import { applyMutation, decrementFrozenCells } from './engine/mutations';
import { soundManager } from './engine/sounds';
import { evaluateWithGemini } from './ai/geminiArbiter';
import { getBotRebuttal, getBotObjection } from './ai/adversaryBot';

export const App: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [grid, setGrid] = useState<BoardType>(() => createEmptyBoard(3));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningLine, setWinningLine] = useState<[number, number][] | null>(null);
  const [tokens, setTokens] = useState<{ X: number; O: number }>({ X: 2, O: 2 });
  const [mode, setMode] = useState<GameMode>('PVE');
  const [lastVerdict, setLastVerdict] = useState<ArbiterVerdict | null>(null);
  const [historyLog, setHistoryLog] = useState<string[]>([]);
  const [extraTurns, setExtraTurns] = useState<number>(0);

  // Modals & UI States
  const [isCourtroomOpen, setIsCourtroomOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('promptcourt_gemini_key') || '');

  const resetMatch = useCallback((size: number = 3) => {
    setBoardSize(size);
    setGrid(createEmptyBoard(size));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setTokens({ X: 2, O: 2 });
    setLastVerdict(null);
    setExtraTurns(0);
    setIsShareCardOpen(false);
    setHistoryLog(['Match initialized. 3x3 territory ready.']);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('promptcourt_gemini_key', key);
  };

  // Bot Turn Handler in PvE
  const triggerBotTurn = useCallback((currentGrid: BoardType, currentTokens: { X: number; O: number }, size: number) => {
    if (winner) return;

    setTimeout(() => {
      // 25% chance for bot to spend an objection token if it has one
      if (currentTokens.O > 0 && Math.random() < 0.25) {
        const botObj = getBotObjection();
        setTokens(prev => ({ ...prev, O: prev.O - 1 }));
        setIsDeliberating(true);
        soundManager.playObjection();

        setTimeout(async () => {
          const verdict = await evaluateWithGemini(
            apiKey,
            botObj.plea,
            "Human: Hey, you can't just make up rules!",
            botObj.chip,
            currentGrid,
            'O',
            size
          );

          setIsDeliberating(false);
          setLastVerdict(verdict);
          soundManager.playGavel();

          let activeGrid = currentGrid;
          let activeSize = size;

          if (verdict.status === 'SUSTAINED') {
            const mutResult = applyMutation(currentGrid, verdict.mutation, size);
            activeGrid = mutResult.newGrid;
            activeSize = mutResult.newSize;
            setGrid(activeGrid);
            if (mutResult.newSize !== size) {
              setBoardSize(mutResult.newSize);
            }
            setHistoryLog(prev => [...prev, `Bot Objection SUSTAINED: ${mutResult.message}`]);
          } else {
            setHistoryLog(prev => [...prev, `Bot Objection OVERRULED by Arbiter.`]);
          }

          // Continue bot regular move with mutated grid and size
          executeBotMove(activeGrid, activeSize);
        }, 1200);
      } else {
        executeBotMove(currentGrid, size);
      }
    }, 600);
  }, [winner, apiKey]);

  const triggerSuddenDeath = (currentGrid: BoardType) => {
    soundManager.playGavel();
    const mutResult = applyMutation(currentGrid, { type: "EXPAND" }, 3);
    setGrid(mutResult.newGrid);
    setBoardSize(4);
    setTokens(prev => ({ X: prev.X + 1, O: prev.O + 1 }));
    setLastVerdict({
      status: "SUSTAINED",
      score: 20,
      rulingTitle: "SUDDEN DEATH: DRAW FORBIDDEN!",
      reasoning: "The Supreme Court rejects stalemates. Expanding territory to 4x4 + 1 Bonus Objection Token awarded!",
      dialogue: "A draw is a waste of everyone's time! I hereby invoke the Sudden Death Protocol: The board expands to a 4x4 Grid. First to 4-in-a-row takes the crown!",
      mutation: { type: "EXPAND" }
    });
    setHistoryLog(prev => [
      ...prev,
      "⚖️ SUDDEN DEATH ACTIVATED: Stalemate rejected! Board expanded to 4x4 with 4-in-a-row win condition!"
    ]);
  };

  const executeBotMove = (currentGrid: BoardType, size: number) => {
    const [r, c] = findBestMove(currentGrid, 'O', size);
    if (currentGrid[r]?.[c] && !currentGrid[r][c].player && !currentGrid[r][c].isBlocked) {
      soundManager.playClick();
      const updatedGrid = decrementFrozenCells(currentGrid);
      updatedGrid[r][c].player = 'O';
      setGrid(updatedGrid);
      setHistoryLog(prev => [...prev, `Bot placed O on [${r + 1},${c + 1}].`]);

      const outcome = checkWinner(updatedGrid, size);
      if (outcome.winner === "DRAW" && size === 3) {
        triggerSuddenDeath(updatedGrid);
        setCurrentPlayer("X");
        return;
      }
      if (outcome.winner) {
        setWinner(outcome.winner);
        setWinningLine(outcome.line);
        setIsShareCardOpen(true);
        if (outcome.winner === 'O') {
          soundManager.playBuzzer();
        }
      } else {
        setCurrentPlayer('X');
      }
    }
  };

  // Cell Click (Player Move)
  const handleCellClick = (r: number, c: number) => {
    if (winner || isDeliberating) return;
    if (grid[r][c].player || grid[r][c].isBlocked || grid[r][c].frozenTurns > 0) return;

    soundManager.playClick();
    const updatedGrid = decrementFrozenCells(grid);
    updatedGrid[r][c].player = currentPlayer;
    setGrid(updatedGrid);

    const logEntry = `Player ${currentPlayer} placed piece on [${r + 1},${c + 1}].`;
    setHistoryLog(prev => [...prev, logEntry]);

    const outcome = checkWinner(updatedGrid, boardSize);
    if (outcome.winner === "DRAW" && boardSize === 3) {
      triggerSuddenDeath(updatedGrid);
      const nextPlayer: Player = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);
      if (mode === "PVE" && nextPlayer === "O") {
        setTimeout(() => executeBotMove(applyMutation(updatedGrid, { type: "EXPAND" }, 3).newGrid, 4), 800);
      }
      return;
    }
    if (outcome.winner) {
      setWinner(outcome.winner);
      setWinningLine(outcome.line);
      setIsShareCardOpen(true);
      if (outcome.winner !== 'DRAW') {
        triggerConfetti();
        soundManager.playFanfare();
      }
      return;
    }

    // Check extra turns from prior ruling
    if (extraTurns > 0) {
      setExtraTurns(prev => prev - 1);
      setHistoryLog(prev => [...prev, `Player ${currentPlayer} uses their granted consecutive move!`]);
      return;
    }

    // Next player
    const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // If PvE and next is O, trigger Bot turn
    if (mode === 'PVE' && nextPlayer === 'O') {
      triggerBotTurn(updatedGrid, tokens, boardSize);
    }
  };

  // Handle Player Objection Submission
  const handleSubmitPlea = async (plea: string, actionChip: string, rebuttal: string) => {
    if (tokens[currentPlayer] <= 0) return;

    // Deduct 1 token
    setTokens(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] - 1 }));
    setIsCourtroomOpen(false);
    setIsDeliberating(true);
    soundManager.playObjection();

    // Auto-generate bot rebuttal in PvE if player didn't specify
    const effectiveRebuttal = mode === 'PVE' && !rebuttal.trim()
      ? getBotRebuttal()
      : rebuttal;

    try {
      const verdict = await evaluateWithGemini(
        apiKey,
        plea,
        effectiveRebuttal,
        actionChip,
        grid,
        currentPlayer,
        boardSize
      );

      setLastVerdict(verdict);
      soundManager.playGavel();

      if (verdict.status === 'SUSTAINED') {
        const mutResult = applyMutation(grid, verdict.mutation, boardSize);
        setGrid(mutResult.newGrid);
        if (mutResult.newSize !== boardSize) {
          setBoardSize(mutResult.newSize);
        }
        if (mutResult.extraTurn) {
          setExtraTurns(1);
        }
        setHistoryLog(prev => [
          ...prev,
          `Court Verdict SUSTAINED: ${mutResult.message}`,
        ]);

        // Recheck winner in case mutation caused a win
        const outcome = checkWinner(mutResult.newGrid, mutResult.newSize);
        if (outcome.winner) {
          setWinner(outcome.winner);
          setWinningLine(outcome.line);
          setIsShareCardOpen(true);
          triggerConfetti();
          soundManager.playFanfare();
        }
      } else {
        setHistoryLog(prev => [
          ...prev,
          `Court Verdict OVERRULED: Objection dismissed by the Arbiter.`,
        ]);
      }
    } catch (err) {
      console.error('Error in plea deliberation:', err);
    } finally {
      setIsDeliberating(false);
    }
  };

  // Spectator mode simulation loop
  useEffect(() => {
    if (mode !== 'SPECTATOR' || winner || isDeliberating) return;

    const timer = setTimeout(() => {
      const available = getAvailableCells(grid);
      if (available.length === 0) return;

      const [r, c] = findBestMove(grid, currentPlayer, boardSize);
      handleCellClick(r, c);
    }, 900);

    return () => clearTimeout(timer);
  }, [mode, grid, currentPlayer, winner, isDeliberating, boardSize]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-amber-100">
      <Navbar
        mode={mode}
        onSelectMode={m => {
          setMode(m);
          resetMatch(3);
        }}
        onResetMatch={() => resetMatch(boardSize)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex flex-col gap-6">
        {/* Token Counter Ribbon */}
        <TokenCounter
          currentPlayer={currentPlayer}
          tokens={tokens}
          onCallObjection={() => setIsCourtroomOpen(true)}
          disabled={Boolean(winner) || isDeliberating || (mode === 'PVE' && currentPlayer === 'O')}
        />

        {/* Main Tactical Arena & Referee HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Tactical Board */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between w-full mb-4 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tactical Grid</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span>Current Turn:</span>
                <span className={`px-2 py-0.5 rounded-md font-bold text-white text-xs ${
                  currentPlayer === 'X' ? 'bg-blue-500' : 'bg-rose-500'
                }`}>
                  Player {currentPlayer} {mode === 'PVE' && currentPlayer === 'O' ? '(Bot)' : ''}
                </span>
              </div>
            </div>

            <Board
              grid={grid}
              size={boardSize}
              onCellClick={handleCellClick}
              winningLine={winningLine}
              disabled={Boolean(winner) || isDeliberating || (mode === 'PVE' && currentPlayer === 'O')}
            />
          </div>

          {/* Referee HUD Card */}
          <div className="lg:col-span-5">
            <ArbiterHUD
              lastVerdict={lastVerdict}
              isDeliberating={isDeliberating}
              historyLog={historyLog}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 py-4 bg-white/60 text-center text-xs text-slate-500">
        PromptCourt • An AI-Native Open Source Game • Designed with 2026 Light Modern UI Tokens
      </footer>

      {/* Modals */}
      <CourtroomModal
        isOpen={isCourtroomOpen}
        currentPlayer={currentPlayer}
        onClose={() => setIsCourtroomOpen(false)}
        onSubmitPlea={handleSubmitPlea}
        isBotOpponent={mode === 'PVE'}
        isSubmitting={isDeliberating}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <VerdictShareCard
        isOpen={isShareCardOpen}
        winner={winner}
        lastVerdict={lastVerdict}
        onPlayAgain={() => resetMatch(boardSize)}
      />
    </div>
  );
};
