export type Player = 'X' | 'O';
export type CellContent = Player | null;

export interface CellState {
  player: CellContent;
  frozenTurns: number;
  isBlocked: boolean;
  row: number;
  col: number;
}

export type Board = CellState[][];

export type MutationType = 'SWAP' | 'FREEZE' | 'EXPAND' | 'EXTRA_TURN' | 'BLOCK' | 'NONE';

export interface MutationAction {
  type: MutationType;
  from?: [number, number];
  to?: [number, number];
  cell?: [number, number];
  duration?: number;
}

export interface ArbiterVerdict {
  status: 'SUSTAINED' | 'OVERRULED';
  score: number;
  rulingTitle: string;
  reasoning: string;
  dialogue: string;
  mutation?: MutationAction;
}

export type GameMode = 'PVE' | 'PVP' | 'SPECTATOR';
export type CourtPhase = 'IDLE' | 'FILING' | 'REBUTTAL' | 'VERDICT' | 'MUTATING';

export interface ActiveObjection {
  player: Player;
  plea: string;
  actionChip: string;
  rebuttal?: string;
  targetA?: [number, number];
  targetB?: [number, number];
}

export interface GameState {
  boardSize: number;
  grid: Board;
  currentPlayer: Player;
  winner: Player | 'DRAW' | null;
  winningLine: [number, number][] | null;
  tokens: { X: number; O: number };
  courtPhase: CourtPhase;
  activeObjection: ActiveObjection | null;
  lastVerdict: ArbiterVerdict | null;
  history: string[];
  extraTurnsRemaining: number;
  mode: GameMode;
}
