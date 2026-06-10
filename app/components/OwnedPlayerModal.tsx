"use client";

import type { OwnedPlayer } from "../game/types";
import { getCurrentValue } from "../game/valueEngine";
import { getSeasonStats } from "../game/statsEngine";
import { calculateAge, nationalityFlag, positionBg, getSatisfactionColor, getRetirementWarning } from "../game/helpers";
import { getContractStatusLabel, isContractLastSeason } from "../game/contractEngine";
import { sponsorBrandIcon, sponsorBrandColor } from "../game/sponsorshipEngine";

// حساب تفاصيل نمو القيمة حسب المركز
function getValueGrowthBreakdown(
  position: string,
  currentGoals: number,
  currentAssists: number,
  currentCleanSheets: number,
  prevGoals: number,
  prevAssists: number,
  prevCleanSheets: number,
) {
  const attackers = ["ST", "LW", "RW"];
  const midfielders = ["CAM", "LCM", "RCM"];
  const defenders = ["LB", "LCB", "RCB", "RB"];

  const rows: { icon: string; label: string; pct: number }[] = [];

  if (attackers.includes(position)) {
    const gDiff = currentGoals - prevGoals;
    const aDiff = currentAssists - prevAssists;
    rows.push({ icon: "⚽", label: `Goals (${currentGoals})`, pct: Math.floor(currentGoals / 5) * 5 - Math.floor(prevGoals / 5) * 5 });
    rows.push({ icon: "🎯", label: `Assists (${currentAssists})`, pct: (Math.floor(currentAssists / 5) * 2.5) - (Math.floor(prevAssists / 5) * 2.5) });
  } else if (midfielders.includes(position)) {
    rows.push({ icon: "🎯", label: `Assists (${currentAssists})`, pct: Math.floor(currentAssists / 5) * 5 - Math.floor(prevAssists / 5) * 5 });
    rows.push({ icon: "⚽", label: `Goals (${currentGoals})`, pct: (Math.floor(currentGoals / 5) * 2.5) - (Math.floor(prevGoals / 5) * 2.5) });
  } else if (defenders.includes(position)) {
    // Clean Sheets: يمكن يرتفع أو ينخفض
    rows.push({ icon: "🧤", label: `Clean Sheets (${currentCleanSheets})`, pct: Math.floor(currentCleanSheets / 5) * 5 - Math.floor(prevCleanSheets / 5) * 5 });
    // Goals وAssists: bonus فقط — لا عقوبة
    rows.push({ icon: "⚽", label: `Goals (${currentGoals})`, pct: Math.max(0, (Math.floor(currentGoals / 5) * 10) - (Math.floor(prevGoals / 5) * 10)) });
    rows.push({ icon: "🎯", label: `Assists (${currentAssists})`, pct: Math.max(0, (Math.floor(currentAssists / 5) * 12.5) - (Math.floor(prevAssists / 5) * 12.5)) });
  } else if (position === "GK") {
    rows.push({ icon: "🧤", label: `Clean Sheets (${currentCleanSheets})`, pct: Math.floor(currentCleanSheets / 5) * 10 - Math.floor(prevCleanSheets / 5) * 10 });
  }

  const total = rows.reduce((sum, r) => sum + r.pct, 0);
  return { rows, total };
}

type Props = {
  owned: OwnedPlayer;
  ownerName: string;
  season: number;
  marketMultiplier: number;
  canSell: boolean;
  onSell: () => void;
  onKeep: () => void;
  onRenew: () => void;
};

function Stat({ value, label, icon, highlight }: { value: number; label: string; icon?: string; highlight?: boolean }) {
  return (
    <div>
      <div className={`text-2xl font-black ${highlight ? "text-emerald-400" : "text-white"}`}>{value}</div>
      <div className="text-[10px] text-gray-500 uppercase mt-1">{icon ? `${icon} ` : ""}{label}</div>
    </div>
  );
}

// ── Custom player pixel portraits ──────────────
const PIXEL_PORTRAITS: Record<string, string> = {
  "Yousef Alnuwasser": "/images/yousef-pixel.png",
  "Hussain Alrezk":    "/images/hussain-alrezk.png",
};

function PixelPortrait({ name, size = 72 }: { name: string; size?: number }) {
  const src = PIXEL_PORTRAITS[name];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{
        imageRendering: "pixelated",
        objectFit: "contain",
        filter: "drop-shadow(0 0 10px rgba(212,175,55,0.7))",
      }}
    />
  );
}

export default function OwnedPlayerModal({ owned, ownerName, season, marketMultiplier, canSell, onSell, onKeep, onRenew }: Props) {
  const { player, buyPrice, buySeason, contract } = owned;
  const stats = getSeasonStats(player, season);
  const prevStats = getSeasonStats(player, season - 1);
  const currentVal = (owned.currentValue && owned.currentValue > 0)
    ? owned.currentValue
    : owned.buyPrice;
  const profit = currentVal - buyPrice;
  const age = calculateAge(player.startAge, player.availableSeason, season);

  const formConfig: Record<string, { label: string; color: string; emoji: string }> = {
    excellent: { label: "Excellent Season", color: "#D4AF37", emoji: "🔥" },
    good:      { label: "Good Season",      color: "#10b981", emoji: "📈" },
    average:   { label: "Average Season",   color: "#6b7280", emoji: "➡️" },
    bad:       { label: "Bad Season",       color: "#f97316", emoji: "📉" },
    disaster:  { label: "Disaster Season",  color: "#ef4444", emoji: "💥" },
  };
  const formInfo = stats.form ? formConfig[stats.form] : null;
  const warning = getRetirementWarning(age);
  const contractStatus = getContractStatusLabel(contract, season);

  // Value Growth Breakdown
  const breakdown = getValueGrowthBreakdown(
    player.position,
    stats.goals ?? 0,
    stats.assists ?? 0,
    stats.cleanSheets ?? 0,
    prevStats?.goals ?? 0,
    prevStats?.assists ?? 0,
    prevStats?.cleanSheets ?? 0,
  );
  const isLastSeason = isContractLastSeason(contract, season);

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
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{nationalityFlag(player.nationality)}</div>
                <PixelPortrait name={player.name} size={64} />
              </div>
              <h2 className="text-4xl font-black text-white leading-tight">{player.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm font-black px-2.5 py-1 rounded-none ${positionBg(player.position)}`}>
                  {player.position}
                </span>
                <span className="text-gray-400">{player.nationality}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{age} years old</span>
              </div>
              <div className="text-gray-500 text-sm mt-1">{player.league}</div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-yellow-300">€{currentVal}M</div>
              <div className="text-gray-500 text-sm mt-1">Current Value</div>
              {formInfo && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-black"
                  style={{ background: `${formInfo.color}18`, border: `1px solid ${formInfo.color}55`, color: formInfo.color }}>
                  {formInfo.emoji} {formInfo.label}
                </div>
              )}
            </div>
          </div>

          {/* Stats — حسب المركز */}
          {(() => {
            const defenders = ["LB","LCB","RCB","RB"];
            const pos = player.position;

            if (pos === "GK") return (
              <div className="grid grid-cols-3 gap-4 mb-6 bg-black/30 rounded-none p-5 text-center">
                <Stat value={stats.rating} label="Rating" />
                <Stat value={stats.games} label="Games" />
                <Stat value={stats.cleanSheets ?? 0} label="Clean Sheets" icon="🧤" />
              </div>
            );

            if (defenders.includes(pos)) return (
              <div className="grid grid-cols-5 gap-3 mb-6 bg-black/30 rounded-none p-5 text-center">
                <Stat value={stats.rating} label="Rating" />
                <Stat value={stats.games} label="Games" />
                <Stat value={stats.goals ?? 0} label="Goals" icon="⚽" />
                <Stat value={stats.assists ?? 0} label="Assists" icon="🎯" />
                <Stat value={stats.cleanSheets ?? 0} label="Clean Sheets" icon="🧤" highlight />
              </div>
            );

            return (
              <div className="grid grid-cols-4 gap-4 mb-6 bg-black/30 rounded-none p-5 text-center">
                <Stat value={stats.rating} label="Rating" />
                <Stat value={stats.games} label="Games" />
                <Stat value={stats.goals ?? 0} label="Goals" icon="⚽" />
                <Stat value={stats.assists ?? 0} label="Assists" icon="🎯" />
              </div>
            );
          })()}

          {/* Investment */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-none p-4 text-center">
              <div className="text-xl font-black text-gray-300">€{buyPrice}M</div>
              <div className="text-xs text-gray-500 mt-1">Bought ({buySeason})</div>
            </div>
            <div className="bg-white/5 rounded-none p-4 text-center">
              <div className="text-xl font-black text-yellow-300">€{currentVal}M</div>
              <div className="text-xs text-gray-500 mt-1">Now ({season})</div>
            </div>
            <div className={`rounded-none p-4 text-center ${profit >= 0 ? "bg-emerald-950/40" : "bg-red-950/40"}`}>
              <div className={`text-xl font-black ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {profit >= 0 ? "+" : ""}€{profit}M
              </div>
              <div className="text-xs text-gray-500 mt-1">Profit / Loss</div>
            </div>

            {/* Value Growth Breakdown */}
            {breakdown.rows.length > 0 && (
              <div className="rounded-none p-3 col-span-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2 flex items-center gap-1">
                  {breakdown.total >= 0 ? "📈" : "📉"} Value Growth Breakdown
                </div>
                <div className="space-y-1.5">
                  {breakdown.rows.filter(r => r.pct !== 0).map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{row.icon} {row.label}</span>
                      <span className="text-xs font-black" style={{ color: row.pct >= 0 ? "#34d399" : "#f87171" }}>
                        {row.pct >= 0 ? "+" : ""}{row.pct}%
                      </span>
                    </div>
                  ))}
                  {breakdown.rows.filter(r => r.pct !== 0).length === 0 && (
                    <div className="text-xs text-gray-600 text-center">No change from previous season</div>
                  )}
                </div>
                {breakdown.rows.some(r => r.pct !== 0) && (
                  <div className="flex items-center justify-between mt-2 pt-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-xs font-black text-gray-300">📊 Total Bonus</span>
                    <span className="text-sm font-black" style={{ color: breakdown.total >= 0 ? "#34d399" : "#f87171" }}>
                      {breakdown.total >= 0 ? "+" : ""}{breakdown.total}%
                    </span>
                  </div>
                )}

                {/* Prev vs Current stats */}
                {season > player.availableSeason && (
                  <div className="mt-3 pt-2 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="text-[9px] uppercase tracking-widest text-gray-700 mb-1.5">Season Comparison</div>
                    {stats.goals !== undefined && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">⚽ Goals</span>
                        <span className="text-gray-400">{prevStats?.goals ?? 0} → <span className="text-white font-bold">{stats.goals}</span></span>
                      </div>
                    )}
                    {stats.assists !== undefined && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">🎯 Assists</span>
                        <span className="text-gray-400">{prevStats?.assists ?? 0} → <span className="text-white font-bold">{stats.assists}</span></span>
                      </div>
                    )}
                    {stats.cleanSheets !== undefined && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">🧤 Clean Sheets</span>
                        <span className="text-gray-400">{prevStats?.cleanSheets ?? 0} → <span className="text-white font-bold">{stats.cleanSheets}</span></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contract */}
          <div className="bg-white/5 rounded-none p-4 mb-4 grid grid-cols-3 gap-4">
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
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-none px-3 py-2">
                    <span className="text-sm">{sponsorBrandIcon(s.brand)}</span>
                    <span className={`text-sm font-bold ${sponsorBrandColor(s.brand)}`}>{s.brand}</span>
                    <span className="text-emerald-400 text-sm font-bold">+€{s.annualIncome}M/yr</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warning && (
            <div className="text-sm text-orange-400 bg-orange-950/30 border border-orange-500/20 rounded-none px-4 py-3 mb-5 text-center font-bold">
              {warning}
            </div>
          )}

          {/* Florentino Perez warning */}
          {owned.refusesRenewal && (
            <div className="text-sm text-purple-400 bg-purple-950/40 border border-purple-500/30 rounded-none px-4 py-3 mb-4 text-center font-bold">
              👑 Florentino Perez is watching — this player refuses to renew.
            </div>
          )}

          {/* Contract warning */}
          {isLastSeason && !owned.refusesRenewal && (
            <div className="text-sm text-yellow-400 bg-yellow-950/40 border border-yellow-500/30 rounded-none px-4 py-3 mb-4 text-center font-bold">
              ⚠️ Last season on contract — renew or lose this player for free!
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onKeep}
              className="flex-1 py-4 rounded-none border border-white/15 text-gray-400 hover:text-white hover:border-white/30 font-black text-base transition-all">
              Keep
            </button>
            <button
              onClick={owned.refusesRenewal ? undefined : onRenew}
              disabled={!!owned.refusesRenewal}
              className="flex-1 py-4 rounded-none font-black text-base transition-all"
              style={owned.refusesRenewal
                ? { background: "rgba(255,255,255,0.05)", color: "#4b5563", cursor: "not-allowed", border: "1px solid rgba(255,255,255,0.08)" }
                : { background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "white", boxShadow: "0 4px 15px rgba(37,99,235,0.3)" }}>
              {owned.refusesRenewal ? "👑 Won't Renew" : "🔄 Renew"}
            </button>
            <button onClick={onSell} disabled={!canSell}
              className="flex-1 py-4 rounded-none font-black text-base transition-all"
              style={canSell
                ? { background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", boxShadow: "0 4px 15px rgba(239,68,68,0.3)" }
                : { background: "rgba(255,255,255,0.05)", color: "#4b5563", cursor: "not-allowed" }}>
              {canSell ? `Sell €${currentVal}M` : "No Sell Chances"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}