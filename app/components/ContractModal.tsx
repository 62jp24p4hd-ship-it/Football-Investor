"use client";

import type { ContractNegotiation } from "../game/types";
import { updateOffer, isRejected, getNegotiationHint, contractSummary } from "../game/contractEngine";
import { getSatisfactionColor, getSatisfactionLabel, getSatisfactionBar } from "../game/helpers";
import { getSeasonStats } from "../game/statsEngine";
import { nationalityFlag, positionBg } from "../game/helpers";

type Props = {
  negotiation: ContractNegotiation;
  season: number;
  onUpdate: (negotiation: ContractNegotiation) => void;
  onSign: () => void;
  onCancel: () => void;
};

const DURATION_OPTIONS = [1, 2, 3, 4, 5];

export default function ContractModal({
  negotiation,
  season,
  onUpdate,
  onSign,
  onCancel,
}: Props) {
  const { player, offeredSalary, offeredDuration, satisfaction, requiredSalary, marketValue, timer } = negotiation;
  const stats = getSeasonStats(player, season);
  const rejected = isRejected(negotiation);
  const hint = getNegotiationHint(negotiation);
  const timerDanger = timer <= 10;

  const minSalary = Math.max(1, Math.round(marketValue * 0.03));
  const maxSalary = Math.round(marketValue * 0.4);

  function handleSalaryChange(val: number) {
    onUpdate(updateOffer(negotiation, val, offeredDuration));
  }

  function handleDurationChange(dur: number) {
    onUpdate(updateOffer(negotiation, offeredSalary, dur));
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden">

        {/* Timer bar */}
        <div className="h-1 bg-white/5">
          <div
            className={`h-full transition-all duration-1000 ${timerDanger ? "bg-red-500" : "bg-emerald-500"}`}
            style={{ width: `${(timer / 60) * 100}%` }}
          />
        </div>

        <div className="p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-white">Contract Negotiation</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positionBg(player.position)}`}>
                  {player.position}
                </span>
                <span className="text-sm text-gray-400">{nationalityFlag(player.nationality)} {player.name}</span>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl border font-black text-lg tabular-nums ${
              timerDanger ? "border-red-500/50 bg-red-500/10 text-red-400 animate-pulse" : "border-white/10 text-gray-400"
            }`}>
              {timer}s
            </div>
          </div>

          {/* Player value */}
          <div className="bg-white/5 rounded-2xl p-4 mb-5 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-yellow-300 font-black text-xl">€{marketValue}M</div>
              <div className="text-xs text-gray-500">Market Value</div>
            </div>
            <div>
              <div className="text-red-400 font-black text-xl">€{requiredSalary}M</div>
              <div className="text-xs text-gray-500">Min Salary</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-sm">{stats.rating}/99</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>

          {/* Satisfaction */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Player Satisfaction</span>
              <span className={`font-black text-sm ${getSatisfactionColor(satisfaction)}`}>
                {getSatisfactionLabel(satisfaction)} — {satisfaction}%
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getSatisfactionBar(satisfaction)}`}
                style={{ width: `${satisfaction}%` }}
              />
            </div>
            {rejected && (
              <div className="mt-2 text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2">
                🚨 Player refuses to negotiate further!
              </div>
            )}
          </div>

          {/* Salary slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Annual Salary</span>
              <span className="text-white font-black">€{offeredSalary}M/yr</span>
            </div>
            <input
              type="range"
              min={minSalary}
              max={maxSalary}
              value={offeredSalary}
              onChange={(e) => handleSalaryChange(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>€{minSalary}M</span>
              <span>€{maxSalary}M</span>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Contract Duration</div>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => handleDurationChange(d)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                    offeredDuration === d
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
                  }`}
                >
                  {d}yr
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/5 rounded-xl px-4 py-3 mb-5 text-sm text-center text-gray-300">
            {contractSummary({ salary: offeredSalary, duration: offeredDuration, satisfaction, requiredSalary, startSeason: season, endSeason: season + offeredDuration - 1 })}
          </div>

          {/* Hint */}
          <div className="text-xs text-gray-500 text-center mb-5">{hint}</div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all font-bold"
            >
              Cancel
            </button>
            <button
              onClick={onSign}
              disabled={rejected}
              className={`flex-2 flex-grow py-3 rounded-xl font-black transition-all ${
                rejected
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 active:scale-95"
              }`}
            >
              ✍️ Sign Contract
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}