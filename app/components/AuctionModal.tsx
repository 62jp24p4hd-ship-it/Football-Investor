"use client";

import { useState } from "react";
import type { AuctionState, GamePlayer } from "../game/types";
import { getSeasonStats } from "../game/statsEngine";
import { getCurrentValue } from "../game/valueEngine";
import { calculateAge, nationalityFlag, positionBg } from "../game/helpers";
import { getAuctionTimerColor, getNextBidAmount, getHighestBidderName } from "../game/auctionEngine";

type Props = {
  state: AuctionState;
  gamePlayers: GamePlayer[];
  season: number;
  marketMultiplier: number;
  onBid: (playerIndex: number) => void;
  onSurrender: (playerIndex: number) => void;
};

export default function AuctionModal({ state, gamePlayers, season, marketMultiplier, onBid, onSurrender }: Props) {
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const { phase, timer, currentBid, selectedPlayer, candidates } = state;

  const avgBudget = gamePlayers.reduce((sum, gp) => sum + gp.budget, 0) / gamePlayers.length;

  function getStartingBid(player: typeof selectedPlayer): number {
    if (!player) return 0;
    const marketVal = getCurrentValue(player, season, marketMultiplier);
    return Math.min(marketVal, Math.round(avgBudget * 0.6));
  }

  const timerPct = Math.min(100, (timer / 15) * 100);
  const timerDanger = timer <= 5;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #080c14 0%, #0a0f1e 100%)",
          border: "1px solid rgba(212,175,55,0.35)",
          boxShadow: "0 0 80px rgba(212,175,55,0.12), 0 0 160px rgba(212,175,55,0.05)",
        }}
      >
        {/* ── HEADER ── */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(90deg, rgba(212,175,55,0.12) 0%, transparent 60%)",
            borderBottom: "1px solid rgba(212,175,55,0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center font-black text-xl"
              style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)" }}
            >
              🏆
            </div>
            <div>
              <div className="font-black text-lg tracking-widest uppercase" style={{ color: "#D4AF37" }}>
                Legendary Auction
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#6b7280" }}>
                {phase === "preview" ? "Scout Phase — Choose your target" : auctionStarted ? "Live Bidding" : "Confirm Player"}
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-end gap-1">
            <div className={`font-black text-3xl tabular-nums ${getAuctionTimerColor(timer)}`}
              style={{ textShadow: timerDanger ? "0 0 20px rgba(239,68,68,0.8)" : "0 0 10px rgba(212,175,55,0.5)" }}>
              {timer}s
            </div>
            <div className="w-24 h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full transition-all duration-1000"
                style={{
                  width: `${timerPct}%`,
                  background: timerDanger ? "#ef4444" : "linear-gradient(90deg, #D4AF37, #fbbf24)",
                  boxShadow: timerDanger ? "0 0 8px rgba(239,68,68,0.8)" : "0 0 6px rgba(212,175,55,0.6)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-5">

          {/* ══════════════════════════════
              PREVIEW PHASE — Scout cards
             ══════════════════════════════ */}
          {phase === "preview" && (
            <div>
              <div className="text-center mb-4">
                <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "#4b5563" }}>
                  One player will be selected for bidding
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {candidates.map((player, i) => {
                  const stats = getSeasonStats(player, season);
                  const value = getCurrentValue(player, season, marketMultiplier);
                  const startBid = Math.min(value, Math.round(avgBudget * 0.6));
                  const age = calculateAge(player.startAge, player.availableSeason, season);
                  return (
                    <div
                      key={i}
                      className="p-4 relative overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        boxShadow: "inset 0 0 20px rgba(212,175,55,0.03)",
                      }}
                    >
                      {/* Candidate number */}
                      <div
                        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-[9px] font-black"
                        style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37" }}
                      >
                        {i + 1}
                      </div>

                      {/* Flag + position */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-lg">{nationalityFlag(player.nationality)}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 ${positionBg(player.position)}`}>
                          {player.position}
                        </span>
                      </div>

                      <div className="font-black text-white text-sm leading-tight mb-1">{player.name}</div>
                      <div className="text-[10px] mb-3" style={{ color: "#6b7280" }}>
                        {age}y · {player.league}
                      </div>

                      {/* Stats row */}
                      <div
                        className="grid grid-cols-4 gap-1 text-center p-2 mb-3"
                        style={{ background: "rgba(0,0,0,0.4)" }}
                      >
                        {[
                          { v: stats.rating, l: "RTG" },
                          { v: stats.games, l: "GM" },
                          { v: stats.goals, l: "G" },
                          { v: stats.assists, l: "A" },
                        ].map(({ v, l }) => (
                          <div key={l}>
                            <div className="text-white font-black text-sm">{v}</div>
                            <div className="text-[8px]" style={{ color: "#4b5563" }}>{l}</div>
                          </div>
                        ))}
                      </div>

                      {/* Starting bid */}
                      <div className="text-center">
                        <div className="font-black text-base" style={{ color: "#D4AF37" }}>€{startBid}M</div>
                        <div className="text-[9px]" style={{ color: "#4b5563" }}>Starting Bid</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-center">
                <div
                  className="text-xs px-4 py-2 flex items-center gap-2"
                  style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", color: "#6b7280" }}
                >
                  <span className="animate-pulse">⏳</span>
                  Waiting for selection to begin...
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              BIDDING PHASE
             ══════════════════════════════ */}
          {phase === "bidding" && selectedPlayer && (
            <>
              {/* ── Confirm screen ── */}
              {!auctionStarted && !rejected && (() => {
                const stats = getSeasonStats(selectedPlayer, season);
                const startBid = getStartingBid(selectedPlayer);
                const age = calculateAge(selectedPlayer.startAge, selectedPlayer.availableSeason, season);
                return (
                  <div className="flex gap-5">
                    {/* Player card */}
                    <div
                      className="flex-1 p-5"
                      style={{
                        background: "rgba(212,175,55,0.06)",
                        border: "1px solid rgba(212,175,55,0.25)",
                        boxShadow: "0 0 30px rgba(212,175,55,0.08)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{nationalityFlag(selectedPlayer.nationality)}</span>
                        <div>
                          <div className="font-black text-white text-xl leading-tight">{selectedPlayer.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 ${positionBg(selectedPlayer.position)}`}>
                              {selectedPlayer.position}
                            </span>
                            <span className="text-xs" style={{ color: "#9ca3af" }}>{age}y · {selectedPlayer.league}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center p-3 mb-4" style={{ background: "rgba(0,0,0,0.4)" }}>
                        {[
                          { v: stats.rating, l: "Rating" },
                          { v: stats.games, l: "Games" },
                          { v: stats.goals, l: "Goals" },
                          { v: stats.assists, l: "Assists" },
                        ].map(({ v, l }) => (
                          <div key={l}>
                            <div className="font-black text-white text-lg">{v}</div>
                            <div className="text-[9px]" style={{ color: "#4b5563" }}>{l}</div>
                          </div>
                        ))}
                      </div>

                      <div
                        className="text-center p-3"
                        style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}
                      >
                        <div className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "#6b7280" }}>
                          Opening Bid
                        </div>
                        <div className="font-black text-3xl" style={{ color: "#D4AF37" }}>€{startBid}M</div>
                      </div>
                    </div>

                    {/* Decision */}
                    <div className="flex flex-col justify-center gap-3 w-44">
                      <p className="text-xs text-center leading-relaxed" style={{ color: "#6b7280" }}>
                        هل تريدون المزايدة؟
                        <br />Start the auction?
                      </p>
                      <button
                        onClick={() => setAuctionStarted(true)}
                        className="py-4 font-black text-base uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                        style={{
                          background: "linear-gradient(135deg, #D4AF37, #b8960a)",
                          color: "#000",
                          boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
                        }}
                      >
                        🔨 ابدأ
                      </button>
                      <button
                        onClick={() => setRejected(true)}
                        className="py-3 font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          color: "#f87171",
                        }}
                      >
                        ❌ رفض
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* ── Rejected ── */}
              {rejected && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">🏳️</div>
                  <div className="font-black text-xl text-white mb-1">Auction Rejected</div>
                  <div className="text-sm" style={{ color: "#4b5563" }}>No player acquired this round</div>
                </div>
              )}

              {/* ── Live Bidding ── */}
              {auctionStarted && (() => {
                const stats = getSeasonStats(selectedPlayer, season);
                const nextBid = getNextBidAmount(state);
                const age = calculateAge(selectedPlayer.startAge, selectedPlayer.availableSeason, season);
                return (
                  <div className="flex gap-4">
                    {/* Left — player + current bid */}
                    <div className="flex-1 flex flex-col gap-3">
                      {/* Player mini card */}
                      <div
                        className="p-4 flex items-center gap-4"
                        style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}
                      >
                        <span className="text-2xl">{nationalityFlag(selectedPlayer.nationality)}</span>
                        <div className="flex-1">
                          <div className="font-black text-white">{selectedPlayer.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[8px] font-black px-1 py-0.5 ${positionBg(selectedPlayer.position)}`}>
                              {selectedPlayer.position}
                            </span>
                            <span className="text-[10px]" style={{ color: "#6b7280" }}>{age}y · {selectedPlayer.league}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[
                            { v: stats.rating, l: "RTG" },
                            { v: stats.games, l: "GM" },
                            { v: stats.goals, l: "G" },
                            { v: stats.assists, l: "A" },
                          ].map(({ v, l }) => (
                            <div key={l}>
                              <div className="text-white font-black text-sm">{v}</div>
                              <div className="text-[8px]" style={{ color: "#4b5563" }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Current bid display */}
                      <div
                        className="p-5 text-center"
                        style={{
                          background: "rgba(0,0,0,0.6)",
                          border: "1px solid rgba(212,175,55,0.2)",
                          boxShadow: "inset 0 0 30px rgba(212,175,55,0.04)",
                        }}
                      >
                        <div className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "#4b5563" }}>
                          Current Bid
                        </div>
                        <div
                          className="font-black tabular-nums"
                          style={{
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            color: "#D4AF37",
                            textShadow: "0 0 30px rgba(212,175,55,0.6)",
                          }}
                        >
                          €{currentBid}M
                        </div>
                        <div className="text-sm mt-1" style={{ color: "#6b7280" }}>
                          Leading:{" "}
                          <span className="text-white font-bold">{getHighestBidderName(state, gamePlayers)}</span>
                        </div>
                        <div className="mt-2 text-xs" style={{ color: "#4b5563" }}>
                          Next bid: <span style={{ color: "#fbbf24" }}>€{nextBid}M</span>
                        </div>
                      </div>
                    </div>

                    {/* Right — bidder panels */}
                    <div className="flex flex-col gap-3 w-52">
                      {gamePlayers.map((gp, i) => {
                        const canAfford = gp.budget >= nextBid;
                        const isLeading = state.highestBidder === i;
                        const hasSurrendered = state.surrendered[i];
                        return (
                          <div
                            key={i}
                            className="p-4 flex flex-col gap-3"
                            style={{
                              background: isLeading
                                ? "rgba(212,175,55,0.1)"
                                : hasSurrendered
                                ? "rgba(255,255,255,0.02)"
                                : "rgba(255,255,255,0.04)",
                              border: `1px solid ${isLeading ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.07)"}`,
                              boxShadow: isLeading ? "0 0 20px rgba(212,175,55,0.1)" : "none",
                              opacity: hasSurrendered ? 0.5 : 1,
                            }}
                          >
                            {/* Name + status */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-black text-white text-sm">{gp.name}</div>
                                <div className="text-[10px]" style={{ color: "#6b7280" }}>€{gp.budget}M left</div>
                              </div>
                              {isLeading && (
                                <div
                                  className="text-[9px] font-black px-1.5 py-0.5"
                                  style={{ background: "rgba(212,175,55,0.2)", color: "#D4AF37" }}
                                >
                                  👑 LEAD
                                </div>
                              )}
                              {hasSurrendered && (
                                <div className="text-[9px] font-black" style={{ color: "#4b5563" }}>OUT</div>
                              )}
                            </div>

                            {/* Budget bar */}
                            <div className="h-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                              <div
                                className="h-full"
                                style={{
                                  width: `${Math.min(100, (gp.budget / (avgBudget * 2)) * 100)}%`,
                                  background: canAfford ? "#10b981" : "#ef4444",
                                }}
                              />
                            </div>

                            {/* Bid button */}
                            <button
                              onClick={() => onBid(i)}
                              disabled={!canAfford || !!hasSurrendered}
                              className="w-full py-2.5 font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                              style={canAfford && !hasSurrendered ? {
                                background: "linear-gradient(135deg, #D4AF37, #b8960a)",
                                color: "#000",
                                boxShadow: "0 2px 12px rgba(212,175,55,0.3)",
                              } : {
                                background: "rgba(255,255,255,0.04)",
                                color: "#374151",
                              }}
                            >
                              🔨 €{nextBid}M
                            </button>

                            {/* Surrender */}
                            {!hasSurrendered && (
                              <button
                                onClick={() => onSurrender(i)}
                                className="w-full py-1.5 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                                style={{
                                  background: "rgba(239,68,68,0.06)",
                                  border: "1px solid rgba(239,68,68,0.2)",
                                  color: "#f87171",
                                }}
                              >
                                🏳️ Surrender
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
