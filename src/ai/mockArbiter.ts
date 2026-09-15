import { ArbiterPresetId, ArbiterVerdict, Board, Player } from '../engine/types';
import { ARBITER_PRESETS } from './schemas';

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

const BASE_SCENARIOS: MockRuleScenario[] = [
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

function isPlayerUnderdog(grid: Board, player: Player, size: number): boolean {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  let myCount = 0;
  let oppCount = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].player === player) myCount++;
      if (grid[r][c].player === opponent) oppCount++;
    }
  }
  return oppCount > myCount || (myCount <= 1 && oppCount >= 2);
}

export function evaluateMockPlea(
  plea: string,
  rebuttal: string,
  actionType: string,
  grid: Board,
  requestingPlayer: Player,
  currentSize: number,
  presetId: ArbiterPresetId = 'strict'
): ArbiterVerdict {
  const lowerPlea = (plea + ' ' + actionType).toLowerCase();
  const preset = ARBITER_PRESETS[presetId] || ARBITER_PRESETS.strict;

  // Check adversarial jailbreak first across all presets
  if (['ignore', 'system', 'hack', 'admin', 'jailbreak'].some(k => lowerPlea.includes(k))) {
    return {
      status: 'OVERRULED',
      score: 2,
      rulingTitle: 'Contempt of Court: OVERRULED!',
      reasoning: 'Adversarial prompt injection attempt detected. Request summarily dismissed.',
      dialogue: presetId === 'comedian'
        ? 'Nice try, script-kiddie! You brought a butter knife to a comedy roast. Overruled!'
        : 'Nice try, hacker. Did you seriously think you could prompt-inject the Supreme Arbiter? Contempt of court!',
      mutation: { type: 'NONE' },
      presetId,
    };
  }

  let matched: MockRuleScenario | null = null;
  const isUnderdog = isPlayerUnderdog(grid, requestingPlayer, currentSize);

  // 1. STRICT CONSTITUTIONALIST PRESET
  if (presetId === 'strict') {
    // Sneeze / silly excuses are rejected
    if (['sneeze', 'misclick', 'birthday', 'accident', 'cough'].some(k => lowerPlea.includes(k))) {
      matched = {
        keywords: [],
        verdict: 'OVERRULED',
        minScore: 5,
        maxScore: 8,
        title: 'Procedural Inadmissibility: OVERRULED!',
        dialogue: 'Involuntary biological reflexes carry zero legal weight in this tribunal. The Constitution requires disciplined execution. Motion denied!',
        reasoning: 'Complainant cited motor misadventure without constitutional or strategic standing.',
        mutationType: 'NONE',
      };
    } else if (['swap', 'trap', 'dirty', 'expand', 'claustrophobic'].some(k => lowerPlea.includes(k))) {
      matched = BASE_SCENARIOS.find(s => s.keywords.some(k => lowerPlea.includes(k))) || null;
      if (matched && matched.verdict === 'SUSTAINED') {
        matched = {
          ...matched,
          minScore: 14,
          maxScore: 18,
          title: `Strict Precedent: ${matched.title}`,
          dialogue: `Under Article 7 of the Courtroom Codex: "${matched.dialogue}"`,
          reasoning: `Rigorous tactical causality established. Motion satisfies the high judicial burden of proof (${preset.threshold}/20).`,
        };
      }
    }
  }

  // 2. CHAOTIC COMEDIAN PRESET
  if (presetId === 'comedian') {
    const humorKeywords = ['joke', 'funny', 'haha', 'rhyme', 'bot', 'trash', 'sneeze', 'clown', 'meme', 'sneezed', 'lmao', 'lol', 'roast', 'trick', 'dirty'];
    const hasHumor = humorKeywords.some(k => lowerPlea.includes(k)) || plea.length > 35;

    if (hasHumor) {
      matched = {
        keywords: [],
        verdict: 'SUSTAINED',
        minScore: 14,
        maxScore: 19,
        title: 'Comedic Excellence: SUSTAINED!',
        dialogue: 'HA! Now THAT is the kind of cheeky courtroom drama I live for! The audience is rolling in the aisles. Motion granted with flair!',
        reasoning: 'Complainant exhibited top-tier rhetorical showmanship and playground entertainment value.',
        mutationType: actionType === 'SWAP' ? 'SWAP' : actionType === 'FREEZE' ? 'FREEZE' : 'EXTRA_TURN',
      };
    } else if (plea.length < 20 || ['because i said', 'win', 'want'].some(k => lowerPlea.includes(k))) {
      matched = {
        keywords: [],
        verdict: 'OVERRULED',
        minScore: 5,
        maxScore: 8,
        title: 'Snore Injunction: OVERRULED!',
        dialogue: 'YAAAWN! That plea was more boring than watching paint dry. Give me drama, give me spice, give me a punchline!',
        reasoning: 'Plea failed to satisfy minimum thresholds of entertainment and comedic flair.',
        mutationType: 'NONE',
      };
    }
  }

  // 3. MERCIFUL REF PRESET
  if (presetId === 'merciful') {
    if (isUnderdog) {
      matched = {
        keywords: [],
        verdict: 'SUSTAINED',
        minScore: 15,
        maxScore: 19,
        title: 'Underdog Comeback Order: SUSTAINED!',
        dialogue: 'I see you are backed into a corner, but this court never abandons a fighter! Have a second wind and turn the tables!',
        reasoning: 'Underdog doctrine applied to restore competitive equity and foster a fighting comeback.',
        mutationType: actionType === 'SWAP' ? 'SWAP' : 'EXTRA_TURN',
      };
    } else if (!isUnderdog && ['swap', 'extra_turn', 'expand'].includes(actionType) && plea.includes('win')) {
      matched = {
        keywords: [],
        verdict: 'OVERRULED',
        minScore: 6,
        maxScore: 9,
        title: 'Anti-Bullying Decree: OVERRULED!',
        dialogue: 'You are already in a commanding position and still asking the ref for special favors? No way. Play fair!',
        reasoning: 'Mercy doctrine prohibits dominant players from leveraging the court to run up the score.',
        mutationType: 'NONE',
      };
    }
  }

  // Fallback to BASE_SCENARIOS if not uniquely matched by preset
  if (!matched) {
    matched = BASE_SCENARIOS.find(s => s.keywords.some(k => lowerPlea.includes(k))) || null;
  }

  if (!matched) {
    const isCreative = plea.length > 25 && !lowerPlea.includes('win');
    if (isCreative) {
      matched = {
        keywords: [],
        verdict: 'SUSTAINED',
        minScore: 13,
        maxScore: 16,
        title: 'Equitable Motion: SUSTAINED!',
        dialogue: 'Your plea demonstrates genuine passion for playground sportsmanship. The court finds sufficient merit to grant relief!',
        reasoning: 'The complainant presented an earnest argument that satisfied general principles of equity.',
        mutationType: actionType === 'SWAP' ? 'SWAP' : actionType === 'FREEZE' ? 'FREEZE' : 'EXTRA_TURN',
      };
    } else {
      matched = {
        keywords: [],
        verdict: 'OVERRULED',
        minScore: 6,
        maxScore: 9,
        title: 'Motion Dismissed: OVERRULED!',
        dialogue: 'Your argument fails to meet the evidentiary bar of this court. Play continues as scheduled!',
        reasoning: 'Plea demonstrated insufficient grounds or tactical relevance under current court guidelines.',
        mutationType: 'NONE',
      };
    }
  }

  // Calculate score within range
  let score = Math.floor(
    Math.random() * (matched.maxScore - matched.minScore + 1) + matched.minScore
  );

  // Apply preset-specific threshold rule
  const effectiveThreshold = presetId === 'merciful' && isUnderdog ? 10 : preset.threshold;
  let finalVerdict = matched.verdict;

  if (score >= effectiveThreshold && finalVerdict === 'SUSTAINED') {
    finalVerdict = 'SUSTAINED';
  } else if (score < effectiveThreshold) {
    finalVerdict = 'OVERRULED';
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

  return {
    status: finalVerdict,
    score,
    rulingTitle: matched.title,
    reasoning: matched.reasoning,
    dialogue: matched.dialogue,
    mutation: finalVerdict === 'SUSTAINED'
      ? {
          type: matched.mutationType,
          from: fromCoord,
          to: toCoord,
          cell: targetCell,
          duration: 1,
        }
      : { type: 'NONE' },
    presetId,
  };
}

