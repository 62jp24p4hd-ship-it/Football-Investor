"use client";

import type { AuctionState, GamePlayer } from "../game/types";
import { getSeasonStats } from "../game/statsEngine";
import { getCurrentValue } from "../game/valueEngine";
import { calculateAge, nationalityFlag, positionBg } from "../game/helpers";
import { getAuctionPhaseLabel, getAuctionTimerColor, canAffordNextBid, getNextBidAmount, getHighestBidderName } from "../game/auctionEngine";
import { AUCTION_BID_INCREMENT } from "../game/constants";

type Props = {
  state: AuctionState;
  gamePlayers: GamePlayer[];
  season: number;
  marketMultiplier: number;
  onBid: (playerIndex: number) => void;
  onSurrender: (playerIndex: number) => void;
};

export default function AuctionModal({ state, gamePlayers, season, marketMultiplier, onBid, onSurrender }: Props) {
  const { phase, timer, currentBid, selectedPlayer, candidates } = state;

  return (
    <div className="fixed inset-0 bg-black/92 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-yellow-500/40 rounded-3xl w-full max-w-4xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-yellow-950/20">
          <div>
            <h2 className="text-3xl font-black text-yellow-300">🏆 Legendary Auction</h2>
            <p className="text-sm text-gray-400 mt-0.5">{getAuctionPhaseLabel(phase)}</p>
          </div>
          <div className={`text-4xl font-black tabular-nums ${getAuctionTimerColor(timer)}`}>
            {timer}s
          </div>
        </div>

        <div className="p-6">

          {/* Preview Phase */}
          {phase === "preview" && (
            <div>
              <p className="text-center text-gray-400 mb-4 text-sm">Previewing candidates — bidding starts when timer ends</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {candidates.map((player, i) => {
                  const stats = getSeasonStats(player, season);
                  const value = getCurrentValue(player, season, marketMultiplier);
                  const age = calculateAge(player.startAge, player.availableSeason, season);
                  return (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-black text-white">{player.name}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${positionBg(player.position)}`}>{player.position}</span>
                            <span className="text-xs text-gray-500">{nationalityFlag(player.nationality)} {age}y</span>
                          </div>
                        </div>
                        <div className="text-yellow-300 font-black text-lg">€{value}M</div>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center bg-black/30 rounded-xl p-2">
                        <div><div className="font-bold text-sm text-white">{stats.rating}</div><div className="text-[9px] text-gray-600">RTG</div></div>
                        <div><div className="font-bold text-sm text-white">{stats.games}</div><div className="text-[9px] text-gray-600">GM</div></div>
                        <div><div className="font-bold text-sm text-white">{stats.goals}</div><div className="text-[9px] text-gray-600">G</div></div>
                        <div><div className="font-bold text-sm text-white">{stats.assists}</div><div className="text-[9px] text-gray-600">A</div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bidding Phase */}
          {phase === "bidding" && selectedPlayer && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Player card */}
                <div className="bg-white/5 border border-yellow-500/20 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-black text-white text-xl">{selectedPlayer.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positionBg(selectedPlayer.position)}`}>
                          {selectedPlayer.position}
                        </span>
                        <span className="text-sm text-gray-400">
                          {nationalityFlag(selectedPlayer.nationality)} {calculateAge(selectedPlayer.startAge, selectedPlayer.availableSeason, season)}y
                        </span>
                      </div>
                    </div>
                    <div className="text-yellow-300 font-black text-2xl">
                      €{getCurrentValue(selectedPlayer, season, marketMultiplier)}M
                    </div>
                  </div>
                  {(() => {
                    const stats = getSeasonStats(selectedPlayer, season);
                    return (
                      <div className="grid grid-cols-4 gap-2 text-center bg-black/30 rounded-xl p-3">
                        <div><div className="font-black text-lg text-white">{stats.rating}</div><div className="text-[10px] text-gray-600">RTG</div></div>
                        <div><div className="font-bold text-base text-white">{stats.games}</div><div className="text-[10px] text-gray-600">GM</div></div>
                        <div><div className="font-bold text-base text-white">{stats.goals}</div><div className="text-[10px] text-gray-600">G</div></div>
                        <div><div className="font-bold text-base text-white">{stats.assists}</div><div className="text-[10px] text-gray-600">A</div></div>
                      </div>
                    );
                  })()}
                </div>

                {/* Bidding panel */}
                <div className="flex flex-col gap-4">
                  <div className="bg-yellow-950/30 border border-yellow-500/30 rounded-2xl p-4 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Bid</div>
                    <div className="text-4xl font-black text-yellow-300">€{currentBid}M</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Highest: <span className="text-white font-bold">{getHighestBidderName(state, gamePlayers)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {gamePlayers.map((gp, i) => {
                      const canAfford = canAffordNextBid(state, gp);
                      const isHighest = state.highestBidder === i;
                      const hasSurrendered = state.surrendered[i];

                      return (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-bold text-white text-sm">{gp.name}</div>
                              <div className="text-xs text-gray-500">Budget: €{gp.budget}M</div>
                            </div>
                            {isHighest && <span className="text-xs text-yellow-400 font-bold">👑 Leading</span>}
                            {hasSurrendered && <span className="text-xs text-red-400">🏳️ Surrendered</span>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onBid(i)}
                              disabled={!canAfford || hasSurrendered}
                              className={`flex-1 py-2 rounded-xl text-sm font-black transition-all active:scale-95 ${
                                canAfford && !hasSurrendered
                                  ? "bg-yellow-600 hover:bg-yellow-500 text-black"
                                  : "bg-white/5 text-gray-600 cursor-not-allowed"
                              }`}
                            >
                              🔨 €{getNextBidAmount(state)}M
                            </button>
                            {!hasSurrendered && (
                              <button
                                onClick={() => onSurrender(i)}
                                className="px-3 py-2 rounded-xl text-sm border border-red-500/30 text-red-400 hover:bg-red-950/30 transition-all"
                              >
                                🏳️
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}