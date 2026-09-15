import { ArbiterPresetId, ArbiterVerdict, Board, Player } from '../engine/types';
import { ARBITER_PRESETS, getSystemPromptForPreset } from './schemas';
import { evaluateMockPlea } from './mockArbiter';

function checkUnderdogStatus(grid: Board, player: Player, size: number): boolean {
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

export async function evaluateWithGemini(
  apiKey: string,
  plea: string,
  rebuttal: string,
  actionType: string,
  grid: Board,
  requestingPlayer: Player,
  currentSize: number,
  presetId: ArbiterPresetId = 'strict'
): Promise<ArbiterVerdict> {
  if (!apiKey || apiKey.trim() === '') {
    // Fallback to mock arbiter if no key provided
    return evaluateMockPlea(plea, rebuttal, actionType, grid, requestingPlayer, currentSize, presetId);
  }

  const isUnderdog = checkUnderdogStatus(grid, requestingPlayer, currentSize);
  const preset = ARBITER_PRESETS[presetId] || ARBITER_PRESETS.strict;
  const activeThreshold = presetId === 'merciful' && isUnderdog ? 10 : preset.threshold;
  const systemInstruction = getSystemPromptForPreset(presetId, isUnderdog);

  const prompt = `Current Board State (${currentSize}x${currentSize}):
${JSON.stringify(grid.map(row => row.map(c => (c.player ? c.player : '.'))))}

Requesting Player: ${requestingPlayer}
Opponent: ${requestingPlayer === 'X' ? 'O' : 'X'}
Requested Action: ${actionType}
Active Arbiter Personality: ${preset.name} (${preset.emoji})
Presiding Judicial Standard: Threshold >= ${activeThreshold}/20 to SUSTAIN
Player's Plain English Plea: "${plea}"
Opponent's Rebuttal: "${rebuttal || 'No rebuttal submitted'}"

Render your verdict according to your assigned personality instructions.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text);
    const score = typeof parsed.score === 'number' ? parsed.score : 12;
    const isSustained = parsed.verdict === 'SUSTAINED' && score >= activeThreshold;

    return {
      status: isSustained ? 'SUSTAINED' : 'OVERRULED',
      score,
      rulingTitle: parsed.rulingTitle || `${preset.emoji} Official Judicial Order`,
      reasoning: parsed.reasoning || `Evaluated by ${preset.name} with threshold >= ${activeThreshold}/20.`,
      dialogue: parsed.dialogue || 'Court has made its decision.',
      mutation: isSustained ? (parsed.mutation || { type: 'NONE' }) : { type: 'NONE' },
      presetId,
    };
  } catch (err) {
    console.warn('Live API call failed, falling back to Mock Arbiter:', err);
    return evaluateMockPlea(plea, rebuttal, actionType, grid, requestingPlayer, currentSize, presetId);
  }
}

