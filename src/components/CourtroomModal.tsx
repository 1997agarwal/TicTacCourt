import React, { useState } from 'react';
import { Gavel, X, Sparkles, Send, RefreshCw, Snowflake, Maximize2, Zap, MessageSquare } from 'lucide-react';
import { ACTION_CHIPS, ActionChipTemplate } from '../ai/schemas';
import { Player } from '../engine/types';

interface CourtroomModalProps {
  isOpen: boolean;
  currentPlayer: Player;
  onClose: () => void;
  onSubmitPlea: (plea: string, actionChip: string, rebuttal: string) => void;
  isBotOpponent: boolean;
  isSubmitting: boolean;
}

export const CourtroomModal: React.FC<CourtroomModalProps> = ({
  isOpen,
  currentPlayer,
  onClose,
  onSubmitPlea,
  isBotOpponent,
  isSubmitting,
}) => {
  const [selectedChip, setSelectedChip] = useState<ActionChipTemplate>(ACTION_CHIPS[0]);
  const [pleaText, setPleaText] = useState(ACTION_CHIPS[0].defaultPrompt);
  const [rebuttalText, setRebuttalText] = useState('');

  if (!isOpen) return null;

  const handleChipSelect = (chip: ActionChipTemplate) => {
    setSelectedChip(chip);
    if (chip.id !== 'custom') {
      setPleaText(chip.defaultPrompt);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pleaText.trim() || isSubmitting) return;
    onSubmitPlea(pleaText, selectedChip.type, rebuttalText);
  };

  const getChipIcon = (id: string) => {
    switch (id) {
      case 'swap': return <RefreshCw className="w-4 h-4" />;
      case 'freeze': return <Snowflake className="w-4 h-4" />;
      case 'expand': return <Maximize2 className="w-4 h-4" />;
      case 'extra_turn': return <Zap className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200 relative overflow-hidden">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Courtroom Objection: Player {currentPlayer}</h3>
              <p className="text-xs text-slate-500">Appeal to the AI Arbiter in plain English</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-zinc-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick-Assist Action Chips */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              1. Choose Objection Motion:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTION_CHIPS.map(chip => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleChipSelect(chip)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                    selectedChip.id === chip.id
                      ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm ring-1 ring-amber-400'
                      : 'bg-zinc-50 border-zinc-200 text-slate-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className="text-amber-600">{getChipIcon(chip.id)}</span>
                  <span className="truncate">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Plain English Plea Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Your Plain-English Argument to the Ref:
              </label>
              <span className="text-[11px] text-amber-700 font-medium">Keep it fun, clever, or relatable</span>
            </div>
            <textarea
              rows={3}
              value={pleaText}
              onChange={e => setPleaText(e.target.value)}
              placeholder={selectedChip.placeholder}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all resize-none"
              required
            />
          </div>

          {/* Opponent Rebuttal */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Opponent Counter-Plea (Rebuttal):
              </label>
              <span className="text-[11px] text-slate-400">
                {isBotOpponent ? 'Automated Adversary Bot defense' : `Player ${currentPlayer === 'X' ? 'O' : 'X'} defense`}
              </span>
            </div>
            <input
              type="text"
              value={rebuttalText}
              onChange={e => setRebuttalText(e.target.value)}
              placeholder={isBotOpponent ? "The Bot will formulate a sharp rebuttal..." : "Type opponent's counter-objection..."}
              disabled={isBotOpponent}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-zinc-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !pleaText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>The Arbiter is Deliberating...</span>
                </>
              ) : (
                <>
                  <Gavel className="w-4 h-4" />
                  <span>Submit to the Arbiter</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
