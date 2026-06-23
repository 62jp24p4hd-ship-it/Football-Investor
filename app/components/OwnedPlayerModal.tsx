"use client";

import type { OwnedPlayer } from "../game/types";
import type { CLPlayerStat } from "../game/clTypes";
import { getCurrentValue } from "../game/valueEngine";
import { getSeasonStats } from "../game/statsEngine";
import { calculateAge, nationalityFlag, positionBg, getSatisfactionColor, getRetirementWarning } from "../game/helpers";
import { getContractStatusLabel, isContractLastSeason } from "../game/contractEngine";
import { sponsorBrandIcon, sponsorBrandColor } from "../game/sponsorshipEngine";

// حساب تفاصيل نمو القيمة — بناءً على الأداء المطلق للموسم
function getValueGrowthBreakdown(
  position: string,
  goals: number,
  assists: number,
  cleanSheets: number,
  games: number,
) {
  const attackers  = ["ST", "LW", "RW"];
  const midfielders = ["CAM", "LCM", "RCM"];
  const defenders  = ["LB", "LCB", "RCB", "RB"];

  const rows: { icon: string; label: string; pct: number }[] = [];

  if (games === 0) {
    rows.push({ icon: "💤", label: "No games played", pct: -4 });
  } else if (attackers.includes(position)) {
    let goalPct = 0;
    if (goals >= 25)      goalPct = 22;
    else if (goals >= 20) goalPct = 16;
    else if (goals >= 15) goalPct = 10;
    else if (goals >= 10) goalPct = 5;
    else if (goals >= 5)  goalPct = 1;
    else if (goals >= 1)  goalPct = -1;
    else                  goalPct = -4;
    rows.push({ icon: "⚽", label: `Goals (${goals})`, pct: goalPct });
    const astBonus = Math.floor(assists / 6) * 2;
    if (astBonus !== 0) rows.push({ icon: "🎯", label: `Assists bonus (${assists})`, pct: astBonus });

  } else if (midfielders.includes(position)) {
    let astPct = 0;
    if (assists >= 15)      astPct = 22;
    else if (assists >= 10) astPct = 16;
    else if (assists >= 7)  astPct = 10;
    else if (assists >= 4)  astPct = 5;
    else if (assists >= 2)  astPct = 1;
    else if (assists >= 1)  astPct = -1;
    else                    astPct = -4;
    rows.push({ icon: "🎯", label: `Assists (${assists})`, pct: astPct });
    const goalBonus = Math.floor(goals / 6) * 2;
    if (goalBonus !== 0) rows.push({ icon: "⚽", label: `Goals bonus (${goals})`, pct: goalBonus });

  } else if (defenders.includes(position)) {
    let csPct = 0;
    if (cleanSheets >= 18)      csPct = 22;
    else if (cleanSheets >= 13) csPct = 16;
    else if (cleanSheets >= 9)  csPct = 10;
    else if (cleanSheets >= 6)  csPct = 5;
    else if (cleanSheets >= 3)  csPct = 1;
    else if (cleanSheets >= 1)  csPct = -1;
    else                        csPct = -4;
    rows.push({ icon: "🧤", label: `Clean Sheets (${cleanSheets})`, pct: csPct });
    const goalBonus = Math.max(0, Math.floor(goals   / 5) * 3);
    const astBonus  = Math.max(0, Math.floor(assists / 5) * 2);
    if (goalBonus > 0) rows.push({ icon: "⚽", label: `Goals bonus (${goals})`,   pct: goalBonus });
    if (astBonus  > 0) rows.push({ icon: "🎯", label: `Assists bonus (${assists})`, pct: astBonus });

  } else if (position === "GK") {
    let csPct = 0;
    if (cleanSheets >= 18)      csPct = 22;
    else if (cleanSheets >= 13) csPct = 16;
    else if (cleanSheets >= 9)  csPct = 10;
    else if (cleanSheets >= 6)  csPct = 5;
    else if (cleanSheets >= 3)  csPct = 1;
    else if (cleanSheets >= 1)  csPct = -1;
    else                        csPct = -4;
    rows.push({ icon: "🧤", label: `Clean Sheets (${cleanSheets})`, pct: csPct });
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
  clStats?: CLPlayerStat;
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
  "ABDULLAH ALMUSAWI": "/images/abdullah-almusawi.png",
  "Ali Alsaif":        "/images/ali-alsaif.png",
  "Ali AlGhanim": "/images/ali-alghanim.png",
  "Abdulaziz Alghariri": "/images/abdulaziz-alghariri.png",
  "Ali Albrahim":        "/images/ali-albrahim.png",
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

export default function OwnedPlayerModal({ owned, ownerName, season, marketMultiplier, canSell, onSell, onKeep, onRenew, clStats }: Props) {
  const { player, buyPrice, buySeason, contract } = owned;
  const stats = getSeasonStats(player, season);
  const prevStats = getSeasonStats(player, season - 1);
  const currentVal = (owned.currentValue && owned.currentValue > 0)
    ? owned.currentValue
    : owned.buyPrice;
  const profit = currentVal - buyPrice;
  const age = calculateAge(player.startAge, player.availableSeason, season);

  // Career totals — فقط المواسم اللي لعبها الاعب معك (من الشراء حتى الموسم الحالي)
  const careerGoals       = Object.entries(player.statsBySeason ?? {})
    .filter(([s]) => { const n = Number(s); return n >= buySeason && n <= season; })
    .reduce((sum, [, st]) => sum + (st.goals ?? 0), 0);
  const careerAssists     = Object.entries(player.statsBySeason ?? {})
    .filter(([s]) => { const n = Number(s); return n >= buySeason && n <= season; })
    .reduce((sum, [, st]) => sum + (st.assists ?? 0), 0);
  const careerCleanSheets = Object.entries(player.statsBySeason ?? {})
    .filter(([s]) => { const n = Number(s); return n >= buySeason && n <= season; })
    .reduce((sum, [, st]) => sum + (st.cleanSheets ?? 0), 0);

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
    stats.games ?? 0,
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

  // Accent colour per player type
  const accent = player.secret
    ? "#D4AF37"
    : player.hiddenType === "talent" ? "#10b981"
    : player.hiddenType === "trap"   ? "#f97316"
    : "#818cf8";

  const accentDim  = `${accent}22`;
  const accentMid  = `${accent}44`;
  const accentBold = `${accent}99`;

  const defenders = ["LB","LCB","RCB","RB"];
  const isGK = player.position === "GK";
  const isDef = defenders.includes(player.position);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}>

      <div className="w-full max-w-lg overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0d1117 0%, #0a0d14 100%)",
          border: `1px solid ${accentMid}`,
          borderRadius: "24px",
          boxShadow: `0 0 60px ${accentDim}, 0 24px 48px rgba(0,0,0,0.7)`,
          maxHeight: "92vh",
          overflowY: "auto",
        }}>

        {/* ── HERO ─────────────────────────────────── */}
        <div className="relative px-6 pt-6 pb-5 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accentDim} 0%, rgba(0,0,0,0) 70%)` }}>

          {/* Glow blob */}
          <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)` }} />

          <div className="flex items-start justify-between relative z-10">
            {/* Left: identity */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{nationalityFlag(player.nationality)}</span>
                <PixelPortrait name={player.name} size={52} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white leading-tight tracking-tight">{player.name}</h2>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${positionBg(player.position)}`}>
                    {player.position}
                  </span>
                  <span className="text-gray-500 text-xs">{player.nationality}</span>
                  <span className="text-gray-700 text-xs">·</span>
                  <span className="text-gray-500 text-xs">{age}y</span>
                  {player.secret && <span className="text-[10px] font-black text-yellow-300 bg-yellow-900/30 px-1.5 py-0.5 rounded-md">GOATs</span>}
                </div>
                {player.league && <div className="text-gray-600 text-[11px] mt-1">{player.league}</div>}
              </div>
            </div>

            {/* Right: current value */}
            <div className="text-right shrink-0">
              <div className="text-3xl font-black leading-none" style={{ color: accent }}>€{currentVal}M</div>
              <div className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider">Current Value</div>
              {formInfo && (
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black"
                  style={{ background: `${formInfo.color}15`, border: `1px solid ${formInfo.color}40`, color: formInfo.color }}>
                  {formInfo.emoji} {formInfo.label}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${accentMid}, transparent)` }} />

        <div className="px-6 py-5 space-y-4">

          {/* ── THIS SEASON STATS ────────────────────── */}
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: `${accent}88` }}>
              Season {season}
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: isGK ? "repeat(3,1fr)" : isDef ? "repeat(5,1fr)" : "repeat(4,1fr)" }}>
              {[
                { val: stats.rating,          label: "Rating",       icon: "⭐" },
                { val: stats.games,            label: "Games",        icon: "🎮" },
                ...(!isGK ? [{ val: stats.goals ?? 0,   label: "Goals",   icon: "⚽" }] : []),
                ...(!isGK ? [{ val: stats.assists ?? 0, label: "Assists", icon: "🎯" }] : []),
                ...(isGK || isDef ? [{ val: stats.cleanSheets ?? 0, label: "Clean", icon: "🧤" }] : []),
              ].map(({ val, label, icon }) => (
                <div key={label} className="flex flex-col items-center py-2.5 px-1 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-[10px] mb-0.5">{icon}</span>
                  <span className="text-lg font-black text-white leading-none">{val}</span>
                  <span className="text-[9px] text-gray-600 mt-1 uppercase tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── INVESTMENT ROW ───────────────────────── */}
          <div className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: `${accent}88` }}>Investment</div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Bought {buySeason}</div>
                <div className="text-lg font-black text-gray-300">€{buyPrice}M</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-1 opacity-30">
                  <div style={{ width: 24, height: 1, background: profit >= 0 ? "#34d399" : "#f87171" }} />
                  <span style={{ fontSize: 12, color: profit >= 0 ? "#34d399" : "#f87171" }}>
                    {profit >= 0 ? "▶" : "◀"}
                  </span>
                  <div style={{ width: 24, height: 1, background: profit >= 0 ? "#34d399" : "#f87171" }} />
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">Now {season}</div>
                <div className="text-lg font-black" style={{ color: accent }}>€{currentVal}M</div>
              </div>
              <div className="w-px self-stretch mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">P&L</div>
                <div className={`text-lg font-black ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {profit >= 0 ? "+" : ""}€{profit}M
                </div>
              </div>
            </div>
          </div>

          {/* ── CAREER WITH YOU ──────────────────────── */}
          {season > buySeason && (
            <div className="rounded-2xl p-4 flex items-center justify-around"
              style={{ background: `${accent}0d`, border: `1px solid ${accent}25` }}>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: `${accent}77` }}>
                🏅<br/>Career
              </div>
              {!isGK && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{careerGoals}</div>
                    <div className="text-[9px] text-gray-600 mt-0.5">⚽ Goals</div>
                  </div>
                  <div className="w-px self-stretch" style={{ background: `${accent}20` }} />
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{careerAssists}</div>
                    <div className="text-[9px] text-gray-600 mt-0.5">🎯 Assists</div>
                  </div>
                </>
              )}
              {(isGK || isDef) && (
                <>
                  {isDef && <div className="w-px self-stretch" style={{ background: `${accent}20` }} />}
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{careerCleanSheets}</div>
                    <div className="text-[9px] text-gray-600 mt-0.5">🧤 Clean Sheets</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── VALUE GROWTH ─────────────────────────── */}
          {breakdown.rows.length > 0 && (
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-gray-600">
                  {breakdown.total >= 0 ? "📈" : "📉"} Value Forecast
                </span>
                <span className="text-sm font-black" style={{ color: breakdown.total >= 0 ? "#34d399" : "#f87171" }}>
                  {breakdown.total >= 0 ? "+" : ""}{Math.round(breakdown.total)}%
                </span>
              </div>
              <div className="space-y-2">
                {breakdown.rows.filter(r => r.pct !== 0).map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 flex-1">{row.icon} {row.label}</span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.abs(row.pct) / 25 * 100)}%`,
                          background: row.pct >= 0 ? "#34d399" : "#f87171",
                        }} />
                    </div>
                    <span className="text-[10px] font-black w-8 text-right"
                      style={{ color: row.pct >= 0 ? "#34d399" : "#f87171" }}>
                      {row.pct >= 0 ? "+" : ""}{row.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CONTRACT ─────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Contract",     value: contractStatus,          color: "text-white" },
              { label: "Salary",       value: `€${contract.salary}M/yr`, color: "text-red-400" },
              { label: "Satisfaction", value: `${contract.satisfaction}%`, color: getSatisfactionColor(contract.satisfaction) },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-[9px] uppercase tracking-wider text-gray-600 mb-1.5">{label}</div>
                <div className={`text-xs font-black ${color}`}>{value}</div>
              </div>
            ))}
            {/* Satisfaction bar */}
            <div className="col-span-3 h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${contract.satisfaction}%`,
                  background: contract.satisfaction >= 70
                    ? "linear-gradient(90deg,#10b981,#34d399)"
                    : contract.satisfaction >= 40
                    ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                    : "linear-gradient(90deg,#ef4444,#f87171)",
                }} />
            </div>
          </div>

          {/* ── SPONSORSHIPS ─────────────────────────── */}
          {owned.sponsorships.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Sponsorships</div>
              <div className="flex gap-2 flex-wrap">
                {owned.sponsorships.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    <span>{sponsorBrandIcon(s.brand)}</span>
                    <span className={`text-xs font-bold ${sponsorBrandColor(s.brand)}`}>{s.brand}</span>
                    <span className="text-emerald-400 text-xs font-bold">+€{s.annualIncome}M/yr</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CHAMPIONS LEAGUE ─────────────────────── */}
          {clStats && (clStats.goals > 0 || clStats.assists > 0 || clStats.cleanSheets > 0 || clStats.games > 0) && (
            <div className="rounded-2xl p-4"
              style={{
                background: "linear-gradient(135deg, rgba(0,8,32,0.9), rgba(0,16,64,0.6))",
                border: "1px solid rgba(251,191,36,0.3)",
              }}>
              <div className="flex items-center gap-2 mb-3">
                <span>🏆</span>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#fbbf24" }}>Champions League</span>
              </div>
              <div className={`grid gap-2 text-center ${isGK ? "grid-cols-2" : "grid-cols-4"}`}>
                {[
                  { val: clStats.games, label: "Games", color: "#fbbf24" },
                  ...(!isGK ? [{ val: clStats.goals, label: "⚽ Goals", color: "white" }] : []),
                  ...(!isGK ? [{ val: clStats.assists, label: "🎯 Assists", color: "white" }] : []),
                  { val: clStats.cleanSheets, label: "🧤 Clean", color: "white" },
                ].map(({ val, label, color }) => (
                  <div key={label}>
                    <div className="text-xl font-black" style={{ color }}>{val}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── WARNINGS ─────────────────────────────── */}
          {warning && (
            <div className="text-xs text-orange-400 rounded-xl px-4 py-3 text-center font-bold"
              style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}>
              {warning}
            </div>
          )}
          {owned.refusesRenewal && (
            <div className="text-xs text-purple-400 rounded-xl px-4 py-3 text-center font-bold"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
              👑 Florentino Perez is watching — this player refuses to renew.
            </div>
          )}
          {isLastSeason && !owned.refusesRenewal && (
            <div className="text-xs text-yellow-400 rounded-xl px-4 py-3 text-center font-bold"
              style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.25)" }}>
              ⚠️ Last season on contract — renew or lose this player for free!
            </div>
          )}

          {/* ── ACTIONS ──────────────────────────────── */}
          <div className="flex gap-2 pt-1">
            <button onClick={onKeep}
              className="flex-1 py-3.5 text-sm font-black rounded-2xl transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#9ca3af",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}>
              Keep
            </button>
            <button
              onClick={owned.refusesRenewal ? undefined : onRenew}
              disabled={!!owned.refusesRenewal}
              className="flex-1 py-3.5 text-sm font-black rounded-2xl transition-all"
              style={owned.refusesRenewal
                ? { background: "rgba(255,255,255,0.04)", color: "#4b5563", cursor: "not-allowed", border: "1px solid rgba(255,255,255,0.07)" }
                : { background: "linear-gradient(135deg, #1e40af, #3b82f6)", color: "white", boxShadow: "0 4px 20px rgba(59,130,246,0.35)", border: "none" }}>
              {owned.refusesRenewal ? "👑 Won't Renew" : "🔄 Renew"}
            </button>
            <button onClick={onSell} disabled={!canSell}
              className="flex-1 py-3.5 text-sm font-black rounded-2xl transition-all"
              style={canSell
                ? { background: "linear-gradient(135deg, #b91c1c, #ef4444)", color: "white", boxShadow: "0 4px 20px rgba(239,68,68,0.35)", border: "none" }
                : { background: "rgba(255,255,255,0.04)", color: "#4b5563", cursor: "not-allowed", border: "1px solid rgba(255,255,255,0.07)" }}>
              {canSell ? `Sell €${currentVal}M` : "No Sell Chances"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
