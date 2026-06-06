"use client";

import type { InvestorOfferState, GamePlayer } from "../game/types";
import { getOfferMessage, getOfferDiffDisplay, getOfferBorderColor, canAffordOffer } from "../game/investorOfferEngine";
import { getSeasonStats } from "../game/statsEngine";
import { calculateAge, nationalityFlag, positionBg } from "../game/helpers";

type Props = {
  offer: InvestorOfferState;
  activePlayer: GamePlayer;
  season: number;
  onAccept: () => void;
  onReject: () => void;
};

export default function InvestorOfferModal({ offer, activePlayer, season, onAccept, onReject }: Props) {
  const { selectedPlayer, marketValue, offerValue } = offer;
  const stats = getSeasonStats(selectedPlayer, season);
  const age = calculateAge(selectedPlayer.startAge, selectedPlayer.availableSeason, season);
  const canAfford = canAffordOffer(offer, activePlayer);
  const diffDisplay = getOfferDiffDisplay(offer);
  const message = getOfferMessage(offer);
  const borderColor = getOfferBorderColor(offer);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-[#0a0f14] border-2 ${borderColor} rounded-3xl w-full max-w-md overflow-hidden`}>
        <div className="p-6">

          <div className="text-center mb-5">
            <div className="text-3xl mb-2">💼</div>
            <h2 className="text-2xl font-black text-white">Investor Offer</h2>
            <p className="text-gray-400 text-sm mt-1">A special deal has arrived for {activePlayer.name}</p>
          </div>

          {/* Player info */}
          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-black text-white text-lg">{selectedPlayer.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positionBg(selectedPlayer.position)}`}>
                    {selectedPlayer.position}
                  </span>
                  <span className="text-xs text-gray-400">{nationalityFlag(selectedPlayer.nationality)}</span>
                  <span className="text-xs text-gray-500">{age}y</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Rating</div>
                <div className="font-black text-white text-xl">{stats.rating}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm font-bold text-gray-300">€{marketValue}M</div>
                <div className="text-[10px] text-gray-600">Market Value</div>
              </div>
              <div>
                <div className="text-lg font-black text-yellow-300">€{offerValue}M</div>
                <div className="text-[10px] text-gray-600">Offer Price</div>
              </div>
              <div>
                <div className={`text-sm font-bold ${diffDisplay.color}`}>{diffDisplay.text}</div>
                <div className="text-[10px] text-gray-600">Difference</div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 mb-2">{message}</div>

          {!canAfford && (
            <div className="text-center text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl px-3 py-2 mb-4">
              ⚠️ Insufficient budget — need €{offerValue}M
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <button onClick={onReject} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white font-bold transition-all">
              Reject
            </button>
            <button
              onClick={onAccept}
              disabled={!canAfford}
              className={`flex-1 py-3 rounded-xl font-black transition-all ${
                canAfford
                  ? "bg-emerald-600 hover:bg-emerald-500 text-black active:scale-95"
                  : "bg-white/5 text-gray-600 cursor-not-allowed"
              }`}
            >
              Accept €{offerValue}M
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}