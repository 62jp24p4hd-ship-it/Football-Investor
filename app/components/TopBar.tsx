"use client";

import type { GamePlayer, GameMode, BudgetMode } from "../game/types";

type Props = {
  season: number;
  mode: GameMode;
  gameLengthMode: "classic" | "infinite";
  budgetMode: BudgetMode;
  activePlayerIndex: number;
  gamePlayers: GamePlayer[];
  timerSeconds: number | null;
  timer: number;
  pendingSlot: string | null;
  onNextSeason: () => void;
  onSeasonClick: () => void;
  onFinishGame?: () => void;
  onSecretClick?: () => void;
  onSave?: () => void;
  canNextSeason: boolean;
};

export default function TopBar({ season, mode, gameLengthMode, activePlayerIndex, gamePlayers, timerSeconds, timer, pendingSlot, onNextSeason, onSeasonClick, onFinishGame, onSecretClick, onSave, canNextSeason }: Props) {
  const isTimerActive = pendingSlot !== null && timerSeconds !== null;
  const timerDanger = timer <= 5;
  const seasonsLeft = 2028 - season;

  return (
    <header className="bg-[#0a0e1a]/95 backdrop-blur-md border-b border-white/8 sticky top-0 z-30 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Left: Logo + Season */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-black text-lg">⚽</span>
              <span className="font-black text-white text-sm hidden md:block">Football Investor</span>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <button onClick={onSeasonClick} className="flex items-center gap-2">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Season</div>
              <div className="text-3xl font-black text-white leading-none">
                {season}
              </div>
              {gameLengthMode === "classic" && seasonsLeft > 0 && (
                <div className="text-[10px] text-gray-600 hidden md:block">
                  {seasonsLeft} left
                </div>
              )}
            </button>

            {gameLengthMode === "infinite" && (
              <span className="text-xs text-purple-400 font-bold bg-purple-900/30 border border-purple-500/30 px-2 py-0.5 rounded-none">♾️ Infinite</span>
            )}
          </div>

          {/* Center: Turn indicator */}
          {mode === "versus" && (
            <div className="flex items-center gap-2">
              {gamePlayers.map((gp, i) => (
                <div key={gp.name} className={`px-3 py-1.5 rounded-none text-sm font-black transition-all border ${
                  i === activePlayerIndex
                    ? "border-yellow-500/60 bg-yellow-900/30 text-yellow-300 shadow-lg shadow-yellow-500/10"
                    : "border-white/8 bg-white/5 text-gray-500"
                }`}>
                  {i === activePlayerIndex && <span className="mr-1">▶</span>}{gp.name}
                </div>
              ))}
            </div>
          )}

          {/* Timer */}
          {isTimerActive && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-none border ${
              timerDanger
                ? "border-red-500/60 bg-red-900/30 animate-pulse"
                : "border-yellow-500/30 bg-yellow-900/20"
            }`}>
              <span className="text-xs text-gray-400">⏱</span>
              <span className={`font-black text-2xl tabular-nums ${timerDanger ? "text-red-400" : "text-yellow-300"}`}>
                {timer}s
              </span>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {mode === "single" && gamePlayers[0] && (
              <div className="text-right hidden md:block">
                <div className="text-[10px] text-gray-500 uppercase">Budget</div>
                <div className={`font-black text-sm ${gamePlayers[0].budget >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  €{gamePlayers[0].budget}M
                </div>
              </div>
            )}

            <button
              onClick={() => { if (canNextSeason) onNextSeason(); else onSecretClick?.(); }}
              className={`px-5 py-2.5 rounded-none font-black text-sm transition-all duration-200 ${
                canNextSeason
                  ? "btn-primary text-black hover:scale-105 active:scale-95"
                  : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
              }`}
              title={canNextSeason ? "" : "Next Season (locked)"}>
              Next Season →
            </button>

            {onSave && (
              <button onClick={onSave}
                className="px-3 py-2.5 rounded-none font-bold text-sm transition-all"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}
                title="Save Game">
                💾
              </button>
            )}

            {gameLengthMode === "infinite" && onFinishGame && (
              <button onClick={onFinishGame}
                className="px-4 py-2.5 rounded-none font-bold text-sm bg-red-900/40 border border-red-500/30 text-red-400 hover:bg-red-800/40 transition-all">
                End
              </button>
            )}
          </div>

        </div>

        {/* Pending slot bar */}
        {pendingSlot && (
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-400/80 animate-fade-in">
            <span className="animate-pulse">⏳</span>
            <span>Selecting player for <strong className="text-yellow-300">{pendingSlot}</strong></span>
            {timerSeconds !== null && (
              <span className={timerDanger ? "text-red-400 font-black animate-pulse" : "text-gray-500"}>
                — {timer}s remaining
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}