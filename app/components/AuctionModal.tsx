"use client";

import { useState } from "react";
import type { AuctionState, GamePlayer } from "../game/types";
import { getSeasonStats } from "../game/statsEngine";
import { getCurrentValue } from "../game/valueEngine";
import { calculateAge, nationalityFlag, positionBg } from "../game/helpers";
import { getAuctionTimerColor, getNextBidAmount, getHighestBidderName } from "../game/auctionEngine";
import { AUCTION_BID_INCREMENT } from "../game/constants";

type Props = {
  state: AuctionState;
  gamePlayers: GamePlayer[];
  season: number;
  marketMultiplier: number;
  onBid: (playerIndex: number) => void;
  onSurrender: (playerIndex: number) => void;
};

// Hidden success chance for each player in auction (40-70% success)
function getPlayerSuccessChance(): number {
  return Math.random() * 0.3 + 0.4; // 40% to 70%
}

export default function AuctionModal({
  state, gamePlayers, season, marketMultiplier, onBid, onSurrender
}: Props) {
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const { phase, timer, currentBid, selectedPlayer, candidates } = state;

  // Calculate affordable starting bid based on average budget
  const avgBudget = gamePlayers.reduce((sum, gp) => sum + gp.budget, 0) / gamePlayers.length;

  function getAffordablePrice(player: typeof selectedPlayer): number {
    if (!player) return 0;
    const marketVal = getCurrentValue(player, season, marketMultiplier);
    // Cap starting bid at 60% of avg budget to keep it affordable
    return Math.min(marketVal, Math.round(avgBudget * 0.6));
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}>
      <div className="rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl"
        style={{ background: "#0a0f14", border: "2px solid rgba(234,179,8,0.4)" }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ background: "rgba(234,179,8,0.1)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h2 className="text-3xl font-black" style={{ color: "#fbbf24" }}>🏆 Legendary Auction</h2>
            <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
              {phase === "preview" ? "👁️ Preview Phase — Bidding starts when timer ends" : "🔨 Bidding Phase"}
            </p>
          </div>
          <div className={`text-4xl font-black tabular-nums ${getAuctionTimerColor(timer)}`}>
            {timer}s
          </div>
        </div>

        <div className="p-6">

          {/* PREVIEW PHASE */}
          {phase === "preview" && (
            <div className="grid grid-cols-3 gap-4">
              {candidates.map((player, i) => {
                const stats = getSeasonStats(player, season);
                const value = getCurrentValue(player, season, marketMultiplier);
                const affordableVal = Math.min(value, Math.round(avgBudget * 0.6));
                const age = calculateAge(player.startAge, player.availableSeason, season);

                return (
                  <div key={i} className="rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg inline-block mb-1 ${positionBg(player.position)}`}>
                          {player.position}
                        </div>
                        <div className="font-black text-white text-base">{player.name}</div>
                        <div className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                          {nationalityFlag(player.nationality)} {age}y • {player.league}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-xl" style={{ color: "#fbbf24" }}>€{affordableVal}M</div>
                        <div className="text-[10px]" style={{ color: "#6b7280" }}>Starting Bid</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center rounded-xl p-2"
                      style={{ background: "rgba(0,0,0,0.3)" }}>
                      <div><div className="text-white font-bold text-sm">{stats.rating}</div><div className="text-[9px]" style={{ color: "#6b7280" }}>RTG</div></div>
                      <div><div className="text-white font-bold text-sm">{stats.games}</div><div className="text-[9px]" style={{ color: "#6b7280" }}>GM</div></div>
                      <div><div className="text-white font-bold text-sm">{stats.goals}</div><div className="text-[9px]" style={{ color: "#6b7280" }}>G</div></div>
                      <div><div className="text-white font-bold text-sm">{stats.assists}</div><div className="text-[9px]" style={{ color: "#6b7280" }}>A</div></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BIDDING PHASE */}
          {phase === "bidding" && selectedPlayer && (
            <>
              {/* Player selected but auction not started yet - show Accept/Reject */}
              {!auctionStarted && !rejected && (
                <div className="max-w-lg mx-auto text-center">
                  {(() => {
                    const stats = getSeasonStats(selectedPlayer, season);
                    const startingBid = getAffordablePrice(selectedPlayer);
                    const age = calculateAge(selectedPlayer.startAge, selectedPlayer.availableSeason, season);
                    return (
                      <>
                        <div className="rounded-2xl p-5 mb-6"
                          style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)" }}>
                          <div className="text-3xl mb-1">{nationalityFlag(selectedPlayer.nationality)}</div>
                          <div className="font-black text-white text-2xl">{selectedPlayer.name}</div>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${positionBg(selectedPlayer.position)}`}>
                              {selectedPlayer.position}
                            </span>
                            <span className="text-sm" style={{ color: "#9ca3af" }}>{age}y • {selectedPlayer.league}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-3 mt-4 text-center rounded-xl p-3"
                            style={{ background: "rgba(0,0,0,0.3)" }}>
                            <div><div className="text-white font-black text-lg">{stats.rating}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>RTG</div></div>
                            <div><div className="text-white font-bold text-base">{stats.games}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>GM</div></div>
                            <div><div className="text-white font-bold text-base">{stats.goals}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>G</div></div>
                            <div><div className="text-white font-bold text-base">{stats.assists}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>A</div></div>
                          </div>
                          <div className="mt-4">
                            <div className="font-black text-3xl" style={{ color: "#fbbf24" }}>€{startingBid}M</div>
                            <div className="text-xs mt-1" style={{ color: "#6b7280" }}>Starting Bid</div>
                          </div>
                        </div>

                        <p className="text-sm mb-6 font-bold" style={{ color: "#9ca3af" }}>
                          هل تريدون المزايدة على هذا اللاعب؟
                          <br />Do you want to bid on this player?
                        </p>

                        <div className="flex gap-4">
                          <button
                            onClick={() => setRejected(true)}
                            className="flex-1 py-4 rounded-2xl font-black text-lg transition-all"
                            style={{ border: "2px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                            ❌ رفض — Reject
                          </button>
                          <button
                            onClick={() => setAuctionStarted(true)}
                            className="flex-1 py-4 rounded-2xl font-black text-lg transition-all"
                            style={{ background: "linear-gradient(135deg, #d97706, #b45309)", color: "black", boxShadow: "0 4px 20px rgba(217,119,6,0.4)" }}>
                            🔨 ابدأ المزايدة
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Auction rejected */}
              {rejected && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">❌</div>
                  <div className="text-2xl font-black text-white mb-2">تم رفض المزايدة</div>
                  <div className="text-gray-400">Auction Rejected — No player acquired</div>
                </div>
              )}

              {/* Auction started - show bidding UI */}
              {auctionStarted && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Player card */}
                  <div className="rounded-2xl p-5"
                    style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)" }}>
                    {(() => {
                      const stats = getSeasonStats(selectedPlayer, season);
                      const age = calculateAge(selectedPlayer.startAge, selectedPlayer.availableSeason, season);
                      return (
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="font-black text-white text-xl">{selectedPlayer.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-black px-1.5 py-0.5 rounded-lg ${positionBg(selectedPlayer.position)}`}>
                                  {selectedPlayer.position}
                                </span>
                                <span className="text-sm" style={{ color: "#9ca3af" }}>
                                  {nationalityFlag(selectedPlayer.nationality)} {age}y
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-center rounded-xl p-3 mb-4"
                            style={{ background: "rgba(0,0,0,0.3)" }}>
                            <div><div className="text-white font-black text-lg">{stats.rating}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>RTG</div></div>
                            <div><div className="text-white font-bold text-base">{stats.games}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>GM</div></div>
                            <div><div className="text-white font-bold text-base">{stats.goals}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>G</div></div>
                            <div><div className="text-white font-bold text-base">{stats.assists}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>A</div></div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="rounded-2xl p-4 text-center"
                      style={{ background: "rgba(0,0,0,0.4)" }}>
                      <div className="text-xs mb-1" style={{ color: "#6b7280" }}>CURRENT BID</div>
                      <div className="text-4xl font-black" style={{ color: "#fbbf24" }}>€{currentBid}M</div>
                      <div className="text-sm mt-1" style={{ color: "#9ca3af" }}>
                        Highest: <span className="text-white font-bold">{getHighestBidderName(state, gamePlayers)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bidding panel */}
                  <div className="flex flex-col gap-3">
                    {gamePlayers.map((gp, i) => {
                      const nextBid = getNextBidAmount(state);
                      const canAfford = gp.budget >= nextBid;
                      const isHighest = state.highestBidder === i;
                      const hasSurrendered = state.surrendered[i];

                      return (
                        <div key={i} className="rounded-2xl p-4"
                          style={{ background: isHighest ? "rgba(234,179,8,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${isHighest ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.08)"}` }}>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-black text-white">{gp.name}</div>
                              <div className="text-xs" style={{ color: "#9ca3af" }}>Budget: €{gp.budget}M</div>
                            </div>
                            {isHighest && <span className="text-xs font-black" style={{ color: "#fbbf24" }}>👑 Leading</span>}
                            {hasSurrendered && <span className="text-xs font-black" style={{ color: "#6b7280" }}>🏳️ Out</span>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onBid(i)}
                              disabled={!canAfford || !!hasSurrendered}
                              className="flex-1 py-3 rounded-xl font-black transition-all"
                              style={canAfford && !hasSurrendered ? {
                                background: "linear-gradient(135deg, #d97706, #b45309)",
                                color: "black"
                              } : {
                                background: "rgba(255,255,255,0.05)",
                                color: "#4b5563",
                                cursor: "not-allowed"
                              }}>
                              🔨 €{nextBid}M
                            </button>
                            {!hasSurrendered && (
                              <button
                                onClick={() => onSurrender(i)}
                                className="px-4 py-3 rounded-xl font-bold transition-all"
                                style={{ border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", background: "rgba(239,68,68,0.05)" }}>
                                🏳️
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}