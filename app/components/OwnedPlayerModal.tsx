"use client";

import type { OwnedPlayer } from "../game/types";
import { getCurrentValue } from "../game/valueEngine";
import { getSeasonStats } from "../game/statsEngine";
import { calculateAge, nationalityFlag, positionBg, getSatisfactionColor, getRetirementWarning } from "../game/helpers";
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

export default function OwnedPlayerModal({ owned, ownerName, season, marketMultiplier, canSell, onSell, onKeep }: Props) {
  const { player, buyPrice, buySeason, contract } = owned;
  const stats = getSeasonStats(player, season);
  const value = getCurrentValue(player, season, marketMultiplier);
  const profit = value - buyPrice;
  const age = calculateAge(player.startAge, player.availableSeason, season);
  const warning = getRetirementWarning(age);
  const contractStatus = getContractStatusLabel(contract, season);

  const cardColor = player.secret
    ? "border-yellow-400 bg-yellow-950/30"
    : player.hiddenType === "talent"
    ? "border-emerald-400 bg-emerald-950/30"
    : player.hiddenType === "trap"
    ? "border-orange-400 bg-orange-950/30"
    : "border-blue-400/60 bg-blue-950/30";

  const topBar = player.secret ? "bg-yellow-400"
    : player.hiddenType === "talent" ? "bg-emerald-500"
    : player.hiddenType === "trap" ? "bg-orange-500"
    : "bg-blue-500";

  return (
    <div className="fixed inset-0 bg-black/88 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`border-2 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl ${cardColor}`}
        style={{ background: "#0a0f14" }}>

        <div className={`h-2 ${topBar}`} />

        <div className="p-8">

          {/* Player header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-3xl mb-2">{nationalityFlag(player.nationality)}</div>
              <h2 className="text-4xl font-black text-white leading-tight">{player.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm font-black px-2.5 py-1 rounded-xl ${positionBg(player.position)}`}>
                  {player.position}
                </span>
                <span className="text-gray-400">{player.nationality}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{age} years old</span>
              </div>
              <div className="text-gray-500 text-sm mt-1">{player.league}</div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-yellow-300">€{value}M</div>
              <div className="text-gray-500 text-sm mt-1">Current Value</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6 bg-black/30 rounded-2xl p-5 text-center">
            <div>
              <div className="text-3xl font-black text-white">{stats.rating}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.games}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Games</div>
            </div>
            {player.position === "GK" ? (
              <div className="col-span-2">
                <div className="text-2xl font-bold text-white">{stats.cleanSheets}</div>
                <div className="text-xs text-gray-500 uppercase mt-1">Clean Sheets</div>
              </div>
            ) : (
              <>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.goals}</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Goals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.assists}</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Assists</div>
                </div>
              </>
            )}
          </div>

          {/* Investment */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <div className="text-xl font-black text-gray-300">€{buyPrice}M</div>
              <div className="text-xs text-gray-500 mt-1">Bought ({buySeason})</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <div className="text-xl font-black text-yellow-300">€{value}M</div>
              <div className="text-xs text-gray-500 mt-1">Now ({season})</div>
            </div>
            <div className={`rounded-2xl p-4 text-center ${profit >= 0 ? "bg-emerald-950/40" : "bg-red-950/40"}`}>
              <div className={`text-xl font-black ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {profit >= 0 ? "+" : ""}€{profit}M
              </div>
              <div className="text-xs text-gray-500 mt-1">Profit / Loss</div>
            </div>
          </div>

          {/* Contract */}
          <div className="bg-white/5 rounded-2xl p-4 mb-4 grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">Contract</div>
              <div className="text-sm font-bold text-white">{contractStatus}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">Salary</div>
              <div className="text-sm font-bold text-red-400">€{contract.salary}M/yr</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">Satisfaction</div>
              <div className={`text-sm font-bold ${getSatisfactionColor(contract.satisfaction)}`}>
                {contract.satisfaction}%
              </div>
            </div>
          </div>

          {/* Sponsorships */}
          {owned.sponsorships.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Sponsorships</div>
              <div className="flex gap-2 flex-wrap">
                {owned.sponsorships.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-sm">{sponsorBrandIcon(s.brand)}</span>
                    <span className={`text-sm font-bold ${sponsorBrandColor(s.brand)}`}>{s.brand}</span>
                    <span className="text-emerald-400 text-sm font-bold">+€{s.annualIncome}M/yr</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warning && (
            <div className="text-sm text-orange-400 bg-orange-950/30 border border-orange-500/20 rounded-xl px-4 py-3 mb-5 text-center font-bold">
              {warning}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={onKeep}
              className="flex-1 py-4 rounded-2xl border border-white/15 text-gray-400 hover:text-white hover:border-white/30 font-black text-lg transition-all">
              Keep
            </button>
            <button onClick={onSell} disabled={!canSell}
              className="flex-1 py-4 rounded-2xl font-black text-lg transition-all"
              style={canSell
                ? { background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", boxShadow: "0 4px 15px rgba(239,68,68,0.3)" }
                : { background: "rgba(255,255,255,0.05)", color: "#4b5563", cursor: "not-allowed" }}>
              {canSell ? `Sell €${value}M` : "No Sell Chances"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}