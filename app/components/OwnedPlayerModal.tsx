"use client";

import type { OwnedPlayer, GamePlayer } from "../game/types";
import { getCurrentValue } from "../game/valueEngine";
import { getSeasonStats } from "../game/statsEngine";
import { calculateAge, nationalityFlag, positionBg, getSatisfactionColor } from "../game/helpers";
import { getRetirementWarning } from "../game/helpers";
import { getContractStatusLabel } from "../game/contractEngine";
import { sponsorBrandIcon, sponsorBrandColor } from "../game/sponsorshipEngine";

type Props = {
  owned: OwnedPlayer;
  ownerName: string;
  season: number;
  marketMultiplier: number;
  canSell: boolean;
  onSell: () => void;
  onKeep: () => void;
};

export default function OwnedPlayerModal({
  owned,
  ownerName,
  season,
  marketMultiplier,
  canSell,
  onSell,
  onKeep,
}: Props) {
  const { player, buyPrice, buySeason, contract } = owned;
  const stats = getSeasonStats(player, season);
  const value = getCurrentValue(player, season, marketMultiplier);
  const profit = value - buyPrice;
  const age = calculateAge(player.startAge, player.availableSeason, season);
  const retirementWarning = getRetirementWarning(age);
  const contractStatus = getContractStatusLabel(contract, season);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden">

        {/* Top color bar based on type */}
        <div className={`h-1 ${
          player.secret ? "bg-yellow-400" :
          player.hiddenType === "talent" ? "bg-emerald-500" :
          player.hiddenType === "trap" ? "bg-orange-500" :
          "bg-blue-500"
        }`} />

        <div className="p-6">

          {/* Player header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-white">{player.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positionBg(player.position)}`}>
                  {player.position}
                </span>
                <span className="text-xs text-gray-400">{nationalityFlag(player.nationality)} {player.nationality}</span>
                <span className="text-xs text-gray-500">{age}y</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">{player.league}</div>
            </div>
            <div className="text-right">
              <div className="text-yellow-300 font-black text-2xl">€{value}M</div>
              <div className="text-xs text-gray-500">Current Value</div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/5 rounded-2xl p-4 mb-4 grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="font-black text-lg text-white">{stats.rating}</div>
              <div className="text-[10px] text-gray-600">RTG</div>
            </div>
            <div>
              <div className="font-bold text-base text-white">{stats.games}</div>
              <div className="text-[10px] text-gray-600">GM</div>
            </div>
            {player.position === "GK" ? (
              <>
                <div className="col-span-2">
                  <div className="font-bold text-base text-white">{stats.cleanSheets}</div>
                  <div className="text-[10px] text-gray-600">Clean Sheets</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="font-bold text-base text-white">{stats.goals}</div>
                  <div className="text-[10px] text-gray-600">Goals</div>
                </div>
                <div>
                  <div className="font-bold text-base text-white">{stats.assists}</div>
                  <div className="text-[10px] text-gray-600">Assists</div>
                </div>
              </>
            )}
          </div>

          {/* Investment info */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-sm font-bold text-gray-300">€{buyPrice}M</div>
              <div className="text-[10px] text-gray-600">Bought ({buySeason})</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-sm font-bold text-yellow-300">€{value}M</div>
              <div className="text-[10px] text-gray-600">Now ({season})</div>
            </div>
            <div className={`rounded-xl p-3 text-center ${profit >= 0 ? "bg-emerald-950/30" : "bg-red-950/30"}`}>
              <div className={`text-sm font-black ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {profit >= 0 ? "+" : ""}€{profit}M
              </div>
              <div className="text-[10px] text-gray-600">Profit</div>
            </div>
          </div>

          {/* Contract */}
          <div className="bg-white/5 rounded-xl p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Contract</span>
              <span className="text-xs font-bold text-white">{contractStatus}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">Salary</span>
              <span className="text-xs text-red-400 font-bold">€{contract.salary}M/yr</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">Satisfaction</span>
              <span className={`text-xs font-bold ${getSatisfactionColor(contract.satisfaction)}`}>
                {contract.satisfaction}%
              </span>
            </div>
          </div>

          {/* Sponsorships */}
          {owned.sponsorships.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">Sponsorships</div>
              {owned.sponsorships.map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 mb-1">
                  <span className={`text-sm font-bold ${sponsorBrandColor(s.brand)}`}>
                    {sponsorBrandIcon(s.brand)} {s.brand}
                  </span>
                  <span className="text-xs text-emerald-400">+€{s.annualIncome}M/yr</span>
                </div>
              ))}
            </div>
          )}

          {retirementWarning && (
            <div className="text-xs text-orange-400 bg-orange-950/30 border border-orange-500/20 rounded-lg px-3 py-2 mb-4">
              {retirementWarning}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onKeep}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all font-bold"
            >
              Keep
            </button>
            <button
              onClick={onSell}
              disabled={!canSell}
              className={`flex-1 py-3 rounded-xl font-black transition-all ${
                canSell
                  ? "bg-red-600 hover:bg-red-500 text-white active:scale-95"
                  : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
              }`}
            >
              {canSell ? `Sell €${value}M` : "No Sell Chances"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}