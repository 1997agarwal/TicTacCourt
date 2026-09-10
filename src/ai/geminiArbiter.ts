import { ArbiterVerdict, Board, Player } from '../engine/types';
import { SYSTEM_PROMPT_ARBITER } from './schemas';
import { evaluateMockPlea } from './mockArbiter';

export async function evaluateWithGemini(
  apiKey: string,
  plea: string,
  rebuttal: string,
  actionType: string,
  grid: Board,
  requestingPlayer: Player,
  currentSize: number
): Promise<ArbiterVerdict> {
  if (!apiKey || apiKey.trim() === '') {
    // Fallback to mock arbiter if no key provided
    return evaluateMockPlea(plea, rebuttal, actionType, grid, requestingPlayer, currentSize);
  }

  const prompt = `Current Board State (${currentSize}x${currentSize}):
${JSON.stringify(grid.map(row => row.map(c => (c.player ? c.player : '.'))))}

Requesting Player: ${requestingPlayer}
Requested Action: ${actionType}
Player's Plain English Plea: "${plea}"
Opponent's Rebuttal: "${rebuttal || 'No rebuttal submitted'}"

Render your verdict according to your instructions.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT_ARBITER }],
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
    return {
      status: parsed.verdict === 'SUSTAINED' ? 'SUSTAINED' : 'OVERRULED',
      score: typeof parsed.score === 'number' ? parsed.score : 12,
      rulingTitle: parsed.rulingTitle || 'Official Judicial Order',
      reasoning: parsed.reasoning || 'Evaluated under principles of playground fairness.',
      dialogue: parsed.dialogue || 'Court has made its decision.',
      mutation: parsed.mutation || { type: 'NONE' },
    };
  } catch (err) {
    console.warn('Live API call failed, falling back to Mock Arbiter:', err);
    return evaluateMockPlea(plea, rebuttal, actionType, grid, requestingPlayer, currentSize);
  }
}
