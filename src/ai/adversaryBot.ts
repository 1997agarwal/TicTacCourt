export const BOT_REBUTTALS = [
  "Objection Ref! They walked straight into that corner trap with both eyes open. Don't bail them out!",
  "Are you kidding me? A sneeze? That is the oldest playground excuse in history! Overrule it!",
  "Ref, this is pure jealousy because my tactical diagonal is mathematically flawless.",
  "Don't listen to them! If you grant this swap, it sets a dangerous precedent for all of Tic-Tac-Toe!",
  "I spent 10 minutes calculating that move and they want to undo it in 5 seconds? Absolute nonsense!",
  "Hold on! If you expand the board to 4x4, you are rewarding their complete lack of territorial awareness!"
];

export const BOT_OBJECTIONS = [
  {
    plea: "Hey Ref! The human player is staring at me aggressively through the screen. Swap our pieces to restore balance!",
    chip: 'SWAP',
  },
  {
    plea: "Ref, my CPU temperature spiked during their last move! Freeze their center square while I cool down!",
    chip: 'FREEZE',
  },
  {
    plea: "This board is not worthy of my 200 IQ algorithms. Expand this arena to 4x4 immediately!",
    chip: 'EXPAND',
  },
  {
    plea: "Ref, I just computed the meaning of life and got distracted. Grant me an extra turn on behalf of Silicon Valley!",
    chip: 'EXTRA_TURN',
  }
];

export function getBotRebuttal(): string {
  return BOT_REBUTTALS[Math.floor(Math.random() * BOT_REBUTTALS.length)];
}

export function getBotObjection(): { plea: string; chip: string } {
  return BOT_OBJECTIONS[Math.floor(Math.random() * BOT_OBJECTIONS.length)];
}
