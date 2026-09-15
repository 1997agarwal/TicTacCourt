# TicTacCourt ⚖️

<p align="center">
  <b>The AI-Native Tactical Arena Where Players Persuade an Autonomous AI Arbiter in Plain English to Bend the Rules.</b>
</p>

<p align="center">
  <a href="https://1997agarwal.github.io/TicTacCourt"><img src="https://img.shields.io/badge/▶_Play_Live_Demo-TicTacCourt-FF5722?style=for-the-badge&logo=githubpages&logoColor=white" alt="Play Live Demo"></a>
</p>

<p align="center">
  <a href="#license"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT"></a>
  <a href="#the-zero-draw-guarantee"><img src="https://img.shields.io/badge/Draws-100%25_Eliminated-emerald.svg" alt="Zero Draws"></a>
  <a href="#system-architecture"><img src="https://img.shields.io/badge/Architecture-Autonomous_Tool_Calling-orange.svg" alt="Tool Calling Architecture"></a>
  <a href="#typescript"><img src="https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="SPECIFICATION.md"><img src="https://img.shields.io/badge/PRD_Spec-Complete_v1.0-purple.svg" alt="PRD Spec"></a>
</p>

---

## ⚡ The Problem: Why Traditional Tic-Tac-Toe is Broken

Traditional Tic-Tac-Toe is a **mathematically solved, guaranteed draw**. 

Out of 255,168 possible game states, two competent players will **draw 100% of the time**. It creates an anticlimactic, frustrating experience where every match ends in an uninspired stalemate:
- **Zero Tactical Comebacks:** Once an opponent claims the center or forks you, the match is statistically over.
- **Static 9-Square Prison:** The 3×3 grid never evolves, forcing repetitive, algorithmic play.
- **The "Tutorial Trap":** Millions of developers build the same predictable 3×3 grid project that signals zero engineering creativity.

**TicTacCourt** breaks the 1,000-year-old stalemate loop by transforming the game into an unpredictable battle of **positional tactics + everyday courtroom persuasion**.

---

## ⚔️ How TicTacCourt is Fundamentally Different from Normal Tic-Tac-Toe

| Feature | Normal Tic-Tac-Toe | TicTacCourt |
|---|---|---|
| **Match Outcome** | **100% Guaranteed Draw** between competent players. Frustrating and repetitive. | **Zero-Draw Guarantee.** Stalemates trigger an automated Sudden Death protocol until a winner is crowned. |
| **Player Action** | Only 1 rigid choice: place an X or O on an empty square. | **Dual Action:** Place a piece OR spend an **Objection Token** to appeal directly to the AI Arbiter. |
| **Board Dynamics** | Completely static 3×3 grid with 9 fixed cells. | **Living, Mutating Grid:** Pieces swap places, cells freeze in ice, or the board expands into a **4×4 arena**! |
| **Win Condition** | Strict 3-in-a-row on 9 squares. | **Adaptive:** Starts at 3-in-a-row; shifts dynamically to **4-in-a-row** when the board expands to 4×4. |
| **Role of AI** | Basic deterministic Minimax algorithm (boring calculator). | **Autonomous Referee & Opponent:** Listens to natural speech, scores arguments (0–20), talks trash, and mutates state. |
| **Language Barrier** | None (no communication). | **Everyday Plain English:** No coding or jailbreak prompts required. Just natural excuses, humor, and witty complaints. |

---

## 🛡️ The 4 Killer Differentiators

### 1. ⚡ The Zero-Draw Guarantee (Sudden Death Protocol)
In TicTacCourt, **draws are mathematically forbidden**:
- If all 9 squares fill up in 3×3 without a winner, the AI Arbiter strikes the gavel and triggers the **Sudden Death Protocol**.
- The Arbiter awards each player **+1 Bonus Objection Token** and **expands the board into a 4×4 grid** (16 squares with a 4-in-a-row win condition).
- The match continues seamlessly until a decisive victor is crowned.

### 2. 🗣️ Plain-English Courtroom Appeals (No Tricky Prompting)
Players do not need prompt engineering skills or jailbreak tricks. You communicate like you're arguing with a referee on the playground:
- *"Hey Ref, swap my piece with theirs because they lured me into an unfair trap!"*
- *"Freeze their last move for one turn, they played too fast and broke my concentration!"*
- *"This board is too small, make it bigger so I have room to breathe."*
- *"Give me two turns in a row, I sneezed while clicking!"*

### 3. 🔄 Real-Time State Mutations via Tool Calling
When the Arbiter rules an objection **SUSTAINED** (score $\ge 12/20$), it executes structured function calls that physically alter the game board:
- **`SWAP`**: Exchanges the coordinates of two pieces on the board.
- **`FREEZE`**: Encases an opponent cell in ice, preventing plays on it for $N$ turns.
- **`EXPAND`**: Dynamically transitions the board from 3×3 to 4×4.
- **`EXTRA_TURN`**: Grants the appealing player an immediate consecutive move.
- **`BLOCK`**: Erects an impassable barricade on a contested tile.

### 4. 🤖 Tactical Adversary Bot with Counter-Rebuttals
When you file an appeal in **vs AI Bot** mode, the bot doesn't sit silently—it fires back a sharp, witty rebuttal to defend its position (*"Objection Ref! They walked straight into that corner trap with both eyes open. Don't bail them out!"*). Furthermore, when the bot is in danger, it spends its own Golden Gavel tokens to appeal to the Arbiter!

### 5. 🎭 3 Distinct Arbiter Personality Presets
Switch the presiding judge anytime via the Navbar quick-select or Settings modal. Each preset dynamically steers the judicial system prompt and scoring thresholds:
- ⚖️ **The Strict Constitutionalist:** Demands rigorous tactical and legal logic; strictly rejects silly excuses, whining, or "sneeze" claims. Imposes a high judicial threshold ($\ge 14/20$) to sustain motions.
- 🎭 **The Chaotic Comedian:** Rewards humor, witty rhymes, memes, and sharp trash talk. Overrules dry, boring textbook arguments as snoozefests. Lower bar to sustain ($\ge 11/20$) for hilarious arguments.
- 🤝 **The Merciful Ref:** Deeply compassionate playground arbiter who roots for the underdog. Dynamically inspects the board; grants bonus points, extra moves, and swaps when a player is on the brink of defeat ($\ge 10/20$ threshold for trailing players).

---

## 🏗️ System Architecture

```
                    [ Player X ]                    [ Opponent (O / Bot) ]
                         │                                    │
    1. Normal Move [r,c] │                                    │
                         ▼                                    │
              ┌──────────────────────┐                        │
              │  Deterministic Grid  │                        │
              │     State Engine     │                        │
              └──────────┬───────────┘                        │
                         │                                    │
        2. Spends Token  │                                    │ 3. Counter-Rebuttal
        "Swap my piece!" │                                    │    "Ref, they walked
                         ▼                                    ▼     into that trap!"
              ┌───────────────────────────────────────────────────────┐
              │           The Courtroom Orchestration Layer           │
              ├───────────────────────────────────────────────────────┤
              │ • Intent & Entity Parser (Extracts SWAP / FREEZE)     │
              │ • Autonomous AI Arbiter (Scored 0–20 on Wit & Logic)  │
              │   ├─ Zero-Latency Offline Mock Arbiter (30+ Rulings)  │
              │   └─ BYOK Live Gemini 1.5/2.5 Flash Client            │
              └──────────────────────────┬────────────────────────────┘
                                         │
                         4. Verdict:     │
                         SUSTAINED (16/20)
                                         ▼
              ┌───────────────────────────────────────────────────────┐
              │              Structured Tool Execution                │
              │  • applyMutation({ type: 'SWAP', from, to })          │
              │  • Web Audio Gavel Thump + Fanfare                    │
              └──────────────────────────┬────────────────────────────┘
                                         │
                                         ▼
              ┌───────────────────────────────────────────────────────┐
              │            Mutated 2026 Light Modern Board            │
              └───────────────────────────────────────────────────────┘
```

---

## 🎮 Gameplay Walkthrough: How a Turn Plays Out

1. **The Tactical Dilemma:** Player X gets trapped by Player O's aggressive diagonal fork. In ordinary Tic-Tac-Toe, Player X has mathematically lost.
2. **The Plain-English Objection:** Player X clicks **"File Objection to Ref!"**, picks **"🔄 The Swap"**, and types:  
   > *"Hey ref! That bot lured me into a dirty trap! Swap my corner piece with their center piece out of good sportsmanship!"*
3. **The Opponent's Rebuttal:** The Bot immediately fires back:  
   > *"Objection ref! They walked straight into that corner trap with both eyes open. Don't bail them out!"*
4. **The Arbiter's Verdict:** The Supreme Arbiter strikes the gavel with a loud wooden thump:  
   > **OBJECTION SUSTAINED! (Score: 16/20)**  
   > *"I saw that blatant ambush from across the court! Motion sustained. Let’s see how the bot likes being on the receiving end of its own trap!"*
5. **Physical Mutation:** The pieces swap positions live on screen, turning an unavoidable defeat into an instant offensive advantage!

---

## 🚀 Quick Start

### 1. Launch the 2026 Light Theme Studio
```bash
# Clone the repository
git clone https://github.com/1997agarwal/TicTacCourt.git
cd TicTacCourt

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Open **`http://localhost:5174`** to launch the interactive game studio.

### 2. Run the Automated Test Suite
```bash
# Run deterministic game rules, mutations, and arbiter schema tests
npm run test
```

### 3. Production Build
```bash
# Compile and package for production deployment
npm run build
```

---

## 👤 Author

**Harshit Agarwal**  
*AI Product Manager & 0-to-1 Systems Builder*  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-181717?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/1997agarwal)
[![X](https://img.shields.io/badge/X-Follow_%401997agarwal-181717?style=flat-square&logo=x&logoColor=white)](https://x.com/1997agarwal)
[![GitHub](https://img.shields.io/badge/GitHub-Explore_Repos-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/1997agarwal)
[![Email](https://img.shields.io/badge/Email-Get_in_Touch-181717?style=flat-square&logo=gmail&logoColor=white)](mailto:agarwal.harshit97@gmail.com)

- **GitHub:** [@1997agarwal](https://github.com/1997agarwal)  
- **LinkedIn:** [1997agarwal](https://www.linkedin.com/in/1997agarwal)  
- **X (Twitter):** [@1997agarwal](https://x.com/1997agarwal)  

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
