# PromptCourt — Specification Document

## 1. Vision & Overview
PromptCourt takes the world's most ubiquitous solved game (Tic-Tac-Toe) and transforms it into an AI-native battle of tactics and persuasion.

## 2. Technical Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- Engine: Pure TypeScript state machine with Web Audio API sound synthesis.
- AI: Multi-tier Arbiter (Offline Mock Heuristic Engine + BYOK Gemini/Groq Live Providers).
- Testing: Vitest.

## 3. Tool-Calling Specification
The Arbiter returns structured responses obeying the following schema:
```typescript
interface ArbiterDecision {
  verdict: 'SUSTAINED' | 'OVERRULED';
  score: number; // 0-20
  rulingTitle: string;
  reasoning: string;
  dialogue: string;
  mutation?: {
    type: 'SWAP' | 'FREEZE' | 'EXPAND' | 'EXTRA_TURN' | 'BLOCK';
    from?: [number, number];
    to?: [number, number];
    cell?: [number, number];
    duration?: number;
  };
}
```
