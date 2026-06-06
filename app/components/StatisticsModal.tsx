"use client";

import type { GamePlayer } from "../game/types";
import { calculateTotalProfit, calculateTotalRevenue, calculateCurrentPortfolioValue, calculateNetWorth, getBestDeal, getWorstDeal } from "../game/economyEngine";
import { getCurrentValue } from "../game/valueEngine";
import { getSeasonStats } from "../game/statsEngine";
import { calculateAge, positionBg } from "../game/helpers";

type Props = {
  gamePlayers: GamePlayer[];
  season: number;
  marketMultiplier: number;
  onClose: () => void;
};

export default function StatisticsModal({ gamePlayers, season, marketMultiplier, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">📊 Statistics</h2>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-sm">
            Close
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {gamePlayers.map((gp, i) => {
            const totalProfit = calculateTotalProfit(gp.sold);
            const totalRevenue = calculateTotalRevenue(gp.sold);
            const portfolioValue = calculateCurrentPortfolioValue(gp.owned, season);
            const netWorth = calculateNetWorth(gp, season);
            const bestDeal = getBestDeal(gp.sold);
            const worstDeal = getWorstDeal(gp.sold);

            return (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-xl font-black text-white mb-4">{gp.name}</h3>

                {/* Summary grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-black/30 rounded-xl p-3 text-center">
                    <div className={`font-black text-lg ${gp.budget >= 0 ? "text-white" : "text-red-400"}`}>€{gp.budget}M</div>
                    <div className="text-[10px] text-gray-600 uppercase">Budget</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 text-center">
                    <div className="font-black text-lg text-yellow-300">€{portfolioValue}M</div>
                    <div className="text-[10px] text-gray-600 uppercase">Portfolio</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 text-center">
                    <div className="font-black text-lg text-emerald-400">€{netWorth}M</div>
                    <div className="text-[10px] text-gray-600 uppercase">Net Worth</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 text-center">
                    <div className={`font-black text-lg ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {totalProfit >= 0 ? "+" : ""}€{totalProfit}M
                    </div>
                    <div className="text-[10px] text-gray-600 uppercase">Total P&L</div>
                  </div>
                </div>

                {/* Best/Worst deals */}
                {bestDeal && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3">
                      <div className="text-xs text-emerald-400 font-bold mb-1">🏆 Best Deal</div>
                      <div className="font-bold text-white text-sm">{bestDeal.name}</div>
                      <div className="text-xs text-emerald-400">+€{bestDeal.profit}M profit</div>
                    </div>
                    {worstDeal && worstDeal.profit < 0 && (
                      <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3">
                        <div className="text-xs text-red-400 font-bold mb-1">💔 Worst Deal</div>
                        <div className="font-bold text-white text-sm">{worstDeal.name}</div>
                        <div className="text-xs text-red-400">€{worstDeal.profit}M loss</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Current squad */}
                {gp.owned.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">Current Squad ({gp.owned.length})</div>
                    <div className="space-y-2">
                      {gp.owned.map((item, j) => {
                        const value = getCurrentValue(item.player, season, marketMultiplier);
                        const profit = value - item.buyPrice;
                        const stats = getSeasonStats(item.player, season);
                        return (
                          <div key={j} className="flex items-center justify-between bg-black/30 rounded-xl px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${positionBg(item.player.position)}`}>{item.slot}</span>
                              <span className="text-sm text-white font-bold">{item.player.name}</span>
                              <span className="text-xs text-gray-500">{stats.rating} RTG</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-yellow-300">€{value}M</span>
                              <span className={`text-xs font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {profit >= 0 ? "+" : ""}€{profit}M
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sale history */}
                {gp.sold.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">Sale History ({gp.sold.length})</div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {gp.sold.map((s, j) => (
                        <div key={j} className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-1.5">
                          <div className="text-sm text-gray-300">{s.name}</div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">€{s.buyPrice}M → €{s.sellPrice}M</span>
                            <span className={`text-xs font-bold ${s.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {s.profit >= 0 ? "+" : ""}€{s.profit}M
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}