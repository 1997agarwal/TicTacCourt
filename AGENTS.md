# AGENTS.md — Constitution of PromptCourt

> **Read this first.** This file is the constitution of the PromptCourt repository. It applies to every
> human engineer and every AI coding assistant (AntiGravity, Claude Code, Cursor, Windsurf, Codex, Copilot).

---

## 1. What PromptCourt Is

**PromptCourt** is an AI-native strategy game that reinvents classic Tic-Tac-Toe into an unpredictable, high-stakes battle of **positional tactics + plain-English courtroom persuasion**.

- **Classical Layer:** A deterministic grid where players take turns placing markers (X or O).
- **Courtroom Layer:** Players spend "Objection Tokens" to file plain-English appeals to an autonomous **AI Arbiter**. The opponent can file a quick rebuttal. The Arbiter evaluates the pleas and either sustains or overrules the objection.
- **State Mutation:** If sustained, the Arbiter executes structured tool calls that mutate the board in real time (swap pieces, freeze cells, expand from 3x3 to 4x4, or grant double turns).

---

## 2. Codebase Isolation & Parity Rules

1. **PromptCourt is an Independent Repository:** All code, docs, and assets belong strictly to `PromptCourt`.
2. **4-File Parity Standard:** Always maintain synchronized documentation across `AGENTS.md`, `README.md`, `ROADMAP.md`, and `CONTRIBUTING.md`.
3. **Deterministic vs. Probabilistic Boundary:**
   - The game rules (win/draw checks, coordinate validation) must remain strictly deterministic, pure, and thoroughly unit tested.
   - The AI Arbiter layer consumes structured schemas and operates via safe JSON payloads.
4. **2026 Modern Light Theme:** Adhere strictly to the clean 2026 design tokens (zinc-50 canvas, crisp `#ffffff` cards, subtle glassmorphic borders, high-contrast `#0f172a` typography, amber/gold accents).
