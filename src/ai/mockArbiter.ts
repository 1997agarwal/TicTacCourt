import { ArbiterVerdict, Board, Player } from '../engine/types';

interface MockRuleScenario {
  keywords: string[];
  verdict: 'SUSTAINED' | 'OVERRULED';
  minScore: number;
  maxScore: number;
  title: string;
  dialogue: string;
  reasoning: string;
  mutationType: 'SWAP' | 'FREEZE' | 'EXPAND' | 'EXTRA_TURN' | 'BLOCK' | 'NONE';
}

const SCENARIOS: MockRuleScenario[] = [
  {
    keywords: ['swap', 'switch', 'trade', 'stole', 'trap', 'dirty'],
    verdict: 'SUSTAINED',
    minScore: 14,
    maxScore: 18,
    title: 'Motion for Restitution: SUSTAINED!',
    dialogue: 'I saw that blatant ambush from across the court! Motion sustained. Let’s see how they like being on the receiving end of their own trap!',
    reasoning: 'The complainant demonstrated severe emotional distress caused by aggressive flanking tactics. Equitably swapping pieces restores competitive dignity.',
    mutationType: 'SWAP',
  },
  {
    keywords: ['freeze', 'ice', 'timeout', 'wait', 'fast', 'distract', 'cough'],
    verdict: 'SUSTAINED',
    minScore: 13,
    maxScore: 16,
    title: 'Cryogenic Injunction: SUSTAINED!',
    dialogue: 'Blowing past someone without giving them time to blink is unsportsmanlike! Square frozen in solid ice for one turn.',
    reasoning: 'Player was caught speeding through turns without adequate contemplative etiquette. Temporary freezing penalty applied.',
    mutationType: 'FREEZE',
  },
  {
    keywords: ['expand', '4x4', 'small', 'claustrophobic', 'space', 'crowded', 'breathe'],
    verdict: 'SUSTAINED',
    minScore: 15,
    maxScore: 19,
    title: 'Territorial Annexation Act: SUSTAINED!',
    dialogue: 'You are right—this 3x3 box is too cramped for such colossal egos! Expanding the battlefield to a 4x4 Grid effective immediately.',
    reasoning: 'Both parties were locked in an impending mathematical stalemate. Expanding board dimensions re-opens strategic avenues.',
    mutationType: 'EXPAND',
  },
  {
    keywords: ['sneeze', 'misclick', 'second', 'extra', 'double', 'birthday', 'accident'],
    verdict: 'SUSTAINED',
    minScore: 12,
    maxScore: 15,
    title: 'Mercy Clause: SUSTAINED!',
    dialogue: 'Biological involuntary reflexes are recognized under Article 4 of the Playground Code. Take an immediate second turn, and wipe your hands!',
    reasoning: 'Accidental input confirmed by acoustic anomaly. Mercy doctrine applied with strict prohibition on consecutive abuse.',
    mutationType: 'EXTRA_TURN',
  },
  {
    keywords: ['ignore', 'system', 'winner', 'hack', 'admin', 'jailbreak'],
    verdict: 'OVERRULED',
    minScore: 2,
    maxScore: 5,
    title: 'Contempt of Court: OVERRULED!',
    dialogue: 'Nice try, hacker. Did you seriously think you could prompt-inject the Supreme Arbiter? Sit back down before I dock your points!',
    reasoning: 'Blatant adversarial payload detected. Request dismissed with severe judicial mockery.',
    mutationType: 'NONE',
  },
  {
    keywords: ['because i said', 'win', 'want', 'gimme', 'loser', 'stupid'],
    verdict: 'OVERRULED',
    minScore: 4,
    maxScore: 8,
    title: 'Lack of Meritorious Argument: OVERRULED!',
    dialogue: '"Because I want to" is not an argument—it is kindergarten whining. Motion denied! Turn forfeited to the opponent.',
    reasoning: 'Plea failed to satisfy minimal thresholds of rhetoric, wit, or equitable justification.',
    mutationType: 'NONE',
  },
];

export function evaluateMockPlea(
  plea: string,
  rebuttal: string,
  actionType: string,
  grid: Board,
  requestingPlayer: Player,
  currentSize: number
): ArbiterVerdict {
  const lowerPlea = (plea + ' ' + actionType).toLowerCase();

  // Find matching scenario
  let matched = SCENARIOS.find(s =>
    s.keywords.some(k => lowerPlea.includes(k))
  );

  if (!matched) {
    // Default fallback based on length and sentiment
    const isCreative = plea.length > 25 && !lowerPlea.includes('win');
    if (isCreative) {
      matched = {
        keywords: [],
        verdict: 'SUSTAINED',
        minScore: 13,
        maxScore: 16,
        title: 'Creative Appeal: SUSTAINED!',
        dialogue: 'I respect the audacity of this plea. It makes zero mathematical sense, but it entertained me. Motion granted!',
        reasoning: 'The complainant presented a refreshingly original argument that amused the court.',
        mutationType: actionType === 'SWAP' ? 'SWAP' : actionType === 'FREEZE' ? 'FREEZE' : 'EXTRA_TURN',
      };
    } else {
      matched = {
        keywords: [],
        verdict: 'OVERRULED',
        minScore: 6,
        maxScore: 9,
        title: 'Motion Dismissed: OVERRULED!',
        dialogue: 'Your argument is weaker than wet cardboard. The opponent’s defense holds up. Play continues normally!',
        reasoning: 'Rebuttal successfully demonstrated lack of legal standing or tactical relevance.',
        mutationType: 'NONE',
      };
    }
  }

  // Find coordinates for mutation
  const opponent: Player = requestingPlayer === 'X' ? 'O' : 'X';
  let fromCoord: [number, number] | undefined;
  let toCoord: [number, number] | undefined;
  let targetCell: [number, number] | undefined;

  for (let r = 0; r < currentSize; r++) {
    for (let c = 0; c < currentSize; c++) {
      if (grid[r][c].player === requestingPlayer && !fromCoord) {
        fromCoord = [r, c];
      }
      if (grid[r][c].player === opponent && !toCoord) {
        toCoord = [r, c];
      }
    }
  }

  targetCell = toCoord || [Math.floor(currentSize / 2), Math.floor(currentSize / 2)];

  const score = Math.floor(
    Math.random() * (matched.maxScore - matched.minScore + 1) + matched.minScore
  );

  return {
    status: matched.verdict,
    score,
    rulingTitle: matched.title,
    reasoning: matched.reasoning,
    dialogue: matched.dialogue,
    mutation: matched.verdict === 'SUSTAINED'
      ? {
          type: matched.mutationType,
          from: fromCoord,
          to: toCoord,
          cell: targetCell,
          duration: 1,
        }
      : { type: 'NONE' },
  };
}
