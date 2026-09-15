# CLAUDE.md — Quick Reference for TicTacCourt

## Commands
- Install: `npm install`
- Dev Server: `npm run dev` (starts on port 5174)
- Build: `npm run build`
- Run Tests: `npm run test`
- Preview: `npm run preview`

## Architecture Highlights
- `src/engine/gameRules.ts`: Pure deterministic win/loss/draw evaluators (3x3 and 4x4).
- `src/engine/mutations.ts`: Board state mutators (swap, freeze, expand, extra move).
- `src/engine/sounds.ts`: Web Audio API procedural sound synthesizer (zero audio asset dependencies).
- `src/ai/mockArbiter.ts`: Zero-latency offline AI referee with 30+ witty contextual rulings.
- `src/ai/geminiArbiter.ts`: Live Gemini API client for BYOK generative mode.
- `src/components/`: Modular React components following the 2026 Light Modern UI standard.
