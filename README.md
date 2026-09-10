<div align="center">

# ⚖️ PromptCourt
### The AI-Native Tactical Tic-Tac-Toe Arena

**Persuade a witty AI Referee in plain English to bend the board rules.**

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)

[Live Demo](#) • [How to Play](#how-to-play) • [Architecture](#architecture) • [Quickstart](#quickstart)

</div>

---

## 🎯 What is PromptCourt?

Traditional Tic-Tac-Toe is a mathematically solved, guaranteed draw. Most AI tutorials rebuild the exact same 3×3 grid. 

**PromptCourt flips the game entirely on its head:**
1. **Positional Grid Tactics:** Take normal turns placing X and O on the grid.
2. **Everyday Courtroom Appeals:** Spend **2 Objection Tokens** per game to plead with the autonomous **AI Arbiter** in everyday, conversational English.
3. **The Rebuttal:** The opponent (human or adversary bot) has a chance to shoot down your excuse.
4. **Physical Board Mutation:** If your plea is **SUSTAINED**, the Arbiter executes structured tool calls that **physically mutate the board** in real time—swapping pieces, freezing cells, expanding the board to 4×4, or granting extra moves!

---

## 🏛️ Architecture & System Flow

```
┌─────────────────┐       1. Plain English Plea       ┌────────────────────┐
│   Player (X)    ├──────────────────────────────────►│  AI Arbiter (Ref)  │
└─────────────────┘                                   └─────────┬──────────┘
         ▲                                                      │
         │ 2. Rebuttal Plea                                     │ 3. Evaluate & Score
         │                                                      │    (Logic + Wit)
┌────────┴────────┐                                             ▼
│ Opponent (O/Bot)│                                   ┌────────────────────┐
└─────────────────┘                                   │ Structured Verdict │
                                                      └─────────┬──────────┘
                                                                │
                                   4. Tool Call State Mutation  ▼
                                                      ┌────────────────────┐
                                                      │ Board Engine       │
                                                      │ (Swap/Freeze/Grow) │
                                                      └────────────────────┘
```

---

## 🚀 Key Features

- **🗣️ Plain English Interaction:** No tricky prompt-engineering jargon required. Speak naturally or click 1-tap quick action chips (`Swap`, `Freeze`, `Expand`, `Double Turn`).
- **🤖 Dual Engine Architecture:**
  - **Zero-Key Mock Mode:** Instant 0-latency offline play with 30+ humorous, context-aware verdicts.
  - **BYOK (Bring Your Own Key):** Connect Google Gemini or Groq to experience genuine live LLM reasoning.
- **⚡ Adversary AI Bot:** A witty bot opponent that calculates sharp tactical moves and fires back hilarious counter-rebuttals.
- **🔊 Procedural Web Audio:** Zero external audio files; pure Web Audio API synthesizer for gavel strikes, objection chimes, and victory fanfares.
- **🎨 2026 Light Modern UI:** Built with Tailwind CSS, glassmorphism cards, amber/gold accents, and fluid micro-animations.
- **📸 1-Click Match Verdict Card:** Export shareable match summaries and referee roasts to share on social media.

---

## 💻 Quickstart

```bash
# Clone the repository
git clone https://github.com/1997agarwal/PromptCourt.git
cd PromptCourt

# Install dependencies
npm install

# Start development server
npm run dev

# Run automated tests
npm run test
```

---

## 📜 License

MIT © [Harshit Agarwal](https://github.com/1997agarwal)
