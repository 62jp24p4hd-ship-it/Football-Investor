"use client";

import { useState } from "react";
import type { GamePlayer } from "../game/types";
import { calculateTotalProfit, calculateCurrentPortfolioValue, calculateNetWorth, determineWinner } from "../game/economyEngine";

type Props = {
  gamePlayers: GamePlayer[];
  season: number;
  mode: "single" | "versus";
  onRestart: () => void;
};

export default function EndGameModal({ gamePlayers, season, mode, onRestart }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const { winnerName, scores, isDraw } = determineWinner(gamePlayers, season);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        <div className="p-8 text-center border-b border-white/5">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-black text-white mb-2">Game Over</h1>

          {mode === "versus" ? (
            isDraw ? (
              <p className="text-2xl text-yellow-300 font-bold">It's a Draw!</p>
            ) : (
              <p className="text-2xl text-emerald-400 font-bold">{winnerName} Wins!</p>
            )
          ) : (
            <p className="text-xl text-gray-300">
              Final Net Worth: <span className="text-emerald-400 font-black">€{scores[0]?.breakdown.netWorth}M</span>
            </p>
          )}
        </div>

        <div className="overflow-y-auto p-6 space-y-4">

          {/* Score cards */}
          <div className={`grid gap-4 ${mode === "versus" ? "grid-cols-2" : "grid-cols-1"}`}>
            {scores.map((s, i) => {
              const gp = gamePlayers[i];
              const totalProfit = calculateTotalProfit(gp.sold);
              const isWinner = mode === "versus" && s.name === winnerName && !isDraw;

              return (
                <div key={i} className={`rounded-none border p-5 ${
                  isWinner
                    ? "border-yellow-500/50 bg-yellow-950/20"
                    : "border-white/10 bg-white/5"
                }`}>
                  {isWinner && <div className="text-yellow-400 font-bold text-sm mb-2">👑 Winner</div>}
                  <div className="font-black text-white text-xl mb-3">{s.name}</div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Final Budget</span>
                      <span className={`font-bold ${gp.budget >= 0 ? "text-white" : "text-red-400"}`}>€{gp.budget}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Portfolio Value</span>
                      <span className="text-yellow-300 font-bold">€{s.breakdown.portfolio}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Net Worth</span>
                      <span className="text-emerald-400 font-bold">€{s.breakdown.netWorth}M</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total P&L</span>
                      <span className={`font-black ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {totalProfit >= 0 ? "+" : ""}€{totalProfit}M
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Players Sold</span>
                      <span className="text-white font-bold">{gp.sold.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sale history toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-2 rounded-none border border-white/10 text-gray-500 hover:text-white text-sm transition-all"
          >
            {showDetails ? "▲ Hide Sale History" : "▼ Show Sale History"}
          </button>

          {showDetails && (
            <div className="space-y-2">
              {gamePlayers.flatMap((gp) => gp.sold).sort((a, b) => b.profit - a.profit).map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-none px-4 py-2.5">
                  <div>
                    <span className="text-sm text-white font-bold">{s.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({s.owner})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">€{s.buyPrice}M → €{s.sellPrice}M</span>
                    <span className={`text-sm font-black ${s.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {s.profit >= 0 ? "+" : ""}€{s.profit}M
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-none bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-lg transition-all hover:scale-[1.02] active:scale-98"
          >
            🔄 Play Again
          </button>
        </div>

      </div>
    </div>
  );
}