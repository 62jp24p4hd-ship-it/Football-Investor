"use client";

import { useState } from "react";
import type { ContractNegotiation } from "../game/types";
import { updateOffer, getNegotiationHint, contractSummary } from "../game/contractEngine";
import { getSatisfactionColor, getSatisfactionLabel, getSatisfactionBar, nationalityFlag, positionBg } from "../game/helpers";
import { getSeasonStats } from "../game/statsEngine";

type Props = {
  negotiation: ContractNegotiation;
  season: number;
  onUpdate: (negotiation: ContractNegotiation) => void;
  onSign: () => void;
  onCancel: () => void;
};

const DURATION_OPTIONS = [1, 2, 3, 4, 5];

// ============================================
// REJECTION PROBABILITY SYSTEM
// ============================================
function getRejectChance(satisfaction: number): number {
  if (satisfaction >= 50) return 0;
  if (satisfaction >= 40) return 0.10;
  if (satisfaction >= 30) return 0.25;
  if (satisfaction >= 20) return 0.45;
  return 1.0; // auto reject
}

function shouldReject(satisfaction: number): boolean {
  const chance = getRejectChance(satisfaction);
  if (chance >= 1.0) return true;
  return Math.random() < chance;
}

export default function ContractModal({ negotiation, season, onUpdate, onSign, onCancel }: Props) {
  const [rejectionMsg, setRejectionMsg] = useState<string | null>(null);
  const { player, offeredSalary, offeredDuration, satisfaction, requiredSalary, marketValue, timer } = negotiation;
  const stats = getSeasonStats(player, season);
  const hint = getNegotiationHint(negotiation);
  const timerDanger = timer <= 10;
  const autoReject = satisfaction < 20;

  const minSalary = Math.max(1, Math.round(marketValue * 0.03));
  const maxSalary = Math.round(marketValue * 0.4);

  function handleSalaryChange(val: number) {
    setRejectionMsg(null);
    onUpdate(updateOffer(negotiation, val, offeredDuration));
  }

  function handleDurationChange(dur: number) {
    setRejectionMsg(null);
    onUpdate(updateOffer(negotiation, offeredSalary, dur));
  }

  function handleSign() {
    if (autoReject) {
      setRejectionMsg(`🚫 ${player.name} رفض نهائياً — الرضا منخفض جداً`);
      return;
    }
    if (shouldReject(satisfaction)) {
      setRejectionMsg(`😤 ${player.name} رفض العرض — قدم عرضاً محسناً`);
      return;
    }
    setRejectionMsg(null);
    onSign();
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden">

        {/* Timer bar */}
        <div className="h-1.5 bg-white/5">
          <div className={`h-full transition-all duration-1000 ${timerDanger ? "bg-red-500" : "bg-emerald-500"}`}
            style={{ width: `${(timer / 60) * 100}%` }} />
        </div>

        <div className="p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-white">Contract Negotiation</h2>
              <p className="text-xs text-gray-500 mt-0.5">مفاوضات العقد</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${positionBg(player.position)}`}>{player.position}</span>
                <span className="text-sm text-gray-300 font-bold">{nationalityFlag(player.nationality)} {player.name}</span>
              </div>
            </div>
            <div className={`px-3 py-2 rounded-xl border font-black text-2xl tabular-nums ${
              timerDanger ? "border-red-500/60 bg-red-900/30 text-red-400 animate-pulse" : "border-white/10 text-gray-400"
            }`}>{timer}s</div>
          </div>

          {/* Player value */}
          <div className="grid grid-cols-3 gap-3 mb-5 bg-white/5 rounded-2xl p-4 text-center">
            <div>
              <div className="text-yellow-300 font-black text-xl">€{marketValue}M</div>
              <div className="text-xs text-gray-500">Market Value</div>
            </div>
            <div>
              <div className="text-red-400 font-black text-xl">€{requiredSalary}M</div>
              <div className="text-xs text-gray-500">Min Salary</div>
            </div>
            <div>
              <div className="text-white font-bold text-lg">{stats.rating}/99</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>

          {/* Satisfaction */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Player Satisfaction — رضا اللاعب</span>
              <span className={`font-black text-sm ${getSatisfactionColor(satisfaction)}`}>
                {getSatisfactionLabel(satisfaction)} — {satisfaction}%
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${getSatisfactionBar(satisfaction)}`}
                style={{ width: `${satisfaction}%` }} />
            </div>

            {/* Rejection probability indicator */}
            {satisfaction < 50 && (
              <div className={`mt-2 text-xs px-3 py-2 rounded-xl border font-bold text-center ${
                autoReject
                  ? "border-red-500/60 bg-red-950/40 text-red-400"
                  : satisfaction < 30
                  ? "border-orange-500/40 bg-orange-950/30 text-orange-400"
                  : "border-yellow-500/30 bg-yellow-950/20 text-yellow-400"
              }`}>
                {autoReject
                  ? "🚨 سيرفض تلقائياً — Auto Reject"
                  : satisfaction < 30
                  ? `⚠️ احتمال رفض عالي — ${Math.round(getRejectChance(satisfaction) * 100)}% reject chance`
                  : `⚡ احتمال رفض — ${Math.round(getRejectChance(satisfaction) * 100)}% reject chance`
                }
              </div>
            )}

            {/* Rejection message */}
            {rejectionMsg && (
              <div className="mt-2 text-sm text-red-400 bg-red-950/40 border border-red-500/40 rounded-xl px-4 py-3 text-center font-bold animate-fade-in">
                {rejectionMsg}
              </div>
            )}
          </div>

          {/* Salary slider */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Annual Salary — الراتب السنوي</span>
              <span className="text-white font-black text-lg">€{offeredSalary}M/yr</span>
            </div>
            <input type="range" min={minSalary} max={maxSalary} value={offeredSalary}
              onChange={(e) => handleSalaryChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#10b981" }} />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>€{minSalary}M</span><span>€{maxSalary}M</span>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-bold">Contract Duration — مدة العقد</div>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button key={d} onClick={() => handleDurationChange(d)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                  style={offeredDuration === d
                    ? { borderColor: "#10b981", background: "rgba(16,185,129,0.15)", color: "#34d399" }
                    : { borderColor: "rgba(255,255,255,0.1)", background: "transparent", color: "#6b7280" }}>
                  {d}yr
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/5 rounded-xl px-4 py-3 mb-4 text-sm text-center text-gray-300">
            {contractSummary({ salary: offeredSalary, duration: offeredDuration, satisfaction, requiredSalary, startSeason: season, endSeason: season + offeredDuration - 1 })}
          </div>

          <div className="text-xs text-gray-500 text-center mb-5">{hint}</div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white font-bold transition-all">
              Cancel
            </button>
            <button onClick={handleSign} disabled={autoReject}
              className="flex-[2] py-3 rounded-xl font-black transition-all text-base"
              style={autoReject
                ? { background: "rgba(255,255,255,0.05)", color: "#4b5563", cursor: "not-allowed" }
                : { background: "linear-gradient(135deg, #10b981, #059669)", color: "black", boxShadow: "0 4px 15px rgba(16,185,129,0.3)" }}>
              ✍️ Sign Contract
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}