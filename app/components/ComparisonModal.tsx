"use client";

import type { OwnedPlayer } from "../game/types";
import { getSeasonStats } from "../game/statsEngine";
import { positionBg } from "../game/helpers";

type Props = {
  playerA: OwnedPlayer;
  playerB: OwnedPlayer;
  season: number;
  onClose: () => void;
};

function StatRow({ label, a, b, higherIsBetter = true }: { label: string; a: number; b: number; higherIsBetter?: boolean }) {
  const aWins = higherIsBetter ? a > b : a < b;
  const bWins = higherIsBetter ? b > a : b < a;
  const max = Math.max(Math.abs(a), Math.abs(b), 1);
  const aWidth = Math.round((Math.abs(a) / max) * 100);
  const bWidth = Math.round((Math.abs(b) / max) * 100);

  return (
    <div className="py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="text-center text-[9px] text-gray-500 uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-center gap-3">
        {/* A */}
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="font-black text-sm" style={{ color: aWins ? "#34d399" : bWins ? "#6b7280" : "#9ca3af" }}>
              {a}
            </span>
            {aWins && <span className="text-[9px]">✓</span>}
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{
              width: `${aWidth}%`, height: "100%",
              background: aWins ? "linear-gradient(90deg,#34d399,#10b981)" : "rgba(255,255,255,0.15)",
              borderRadius: "2px", marginLeft: "auto",
            }} />
          </div>
        </div>
        {/* Label center */}
        <div style={{ minWidth: "70px", textAlign: "center", fontSize: "10px", color: "#4b5563" }} />
        {/* B */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {bWins && <span className="text-[9px]">✓</span>}
            <span className="font-black text-sm" style={{ color: bWins ? "#34d399" : aWins ? "#6b7280" : "#9ca3af" }}>
              {b}
            </span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{
              width: `${bWidth}%`, height: "100%",
              background: bWins ? "linear-gradient(90deg,#10b981,#34d399)" : "rgba(255,255,255,0.15)",
              borderRadius: "2px",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonModal({ playerA, playerB, season, onClose }: Props) {
  const statsA = getSeasonStats(playerA.player, season);
  const statsB = getSeasonStats(playerB.player, season);

  const valueA = playerA.currentValue || playerA.buyPrice;
  const valueB = playerB.currentValue || playerB.buyPrice;
  const profitA = valueA - playerA.buyPrice;
  const profitB = valueB - playerB.buyPrice;

  function PlayerHeader({ owned, stats }: { owned: OwnedPlayer; stats: ReturnType<typeof getSeasonStats> }) {
    const value = owned.currentValue || owned.buyPrice;
    const profit = value - owned.buyPrice;
    return (
      <div className="text-center p-4">
        <div className={`inline-flex px-2 py-0.5 text-[9px] font-black mb-2 ${positionBg(owned.player.position)}`}
          style={{ borderRadius: "4px" }}>
          {owned.player.position}
        </div>
        <div className="font-black text-white text-sm leading-tight mb-1">
          {owned.player.name}
        </div>
        <div className="text-[10px] text-gray-500">{owned.player.club ?? "Free"}</div>
        <div className="mt-2 font-black text-base" style={{ color: profit >= 0 ? "#34d399" : "#f87171" }}>
          €{value}M
        </div>
        <div className="text-[10px]" style={{ color: profit >= 0 ? "#6ee7b7" : "#fca5a5" }}>
          {profit >= 0 ? "+" : ""}€{profit}M
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", animation: "cmpFadeIn 0.25s ease" }}>
      <style>{`@keyframes cmpFadeIn{from{opacity:0}to{opacity:1}}`}</style>

      <div className="w-full max-w-md overflow-hidden"
        style={{
          background: "linear-gradient(160deg,#08090f,#0d1018)",
          border: "1px solid rgba(99,102,241,0.35)",
          borderRadius: "18px",
          boxShadow: "0 0 50px rgba(99,102,241,0.2)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}>

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(99,102,241,0.08)" }}>
          <div className="font-black text-white text-sm">⚖️ مقارنة اللاعبين</div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center font-black hover:scale-110 active:scale-90 transition-all"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#9ca3af" }}>
            ×
          </button>
        </div>

        {/* Player headers */}
        <div className="grid grid-cols-2 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <PlayerHeader owned={playerA} stats={statsA} />
          </div>
          <PlayerHeader owned={playerB} stats={statsB} />
        </div>

        {/* Stats */}
        <div className="overflow-y-auto flex-1 px-5 py-2">

          {/* Section: Stats du saison */}
          <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 pt-3 pb-1">إحصائيات الموسم</div>
          <StatRow label="تقييم" a={statsA.rating} b={statsB.rating} />
          <StatRow label="مباريات" a={statsA.games} b={statsB.games} />
          <StatRow label="أهداف" a={statsA.goals} b={statsB.goals} />
          <StatRow label="تمريرات حاسمة" a={statsA.assists} b={statsB.assists} />
          <StatRow label="شباك نظيفة" a={statsA.cleanSheets} b={statsB.cleanSheets} />

          {/* Section: Financial */}
          <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 pt-3 pb-1">المالية</div>
          <StatRow label="القيمة الحالية (M€)" a={valueA} b={valueB} />
          <StatRow label="سعر الشراء (M€)" a={playerA.buyPrice} b={playerB.buyPrice} higherIsBetter={false} />
          <StatRow label="الربح / الخسارة (M€)" a={profitA} b={profitB} />

          {/* Section: Contract */}
          <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 pt-3 pb-1">العقد</div>
          <StatRow label="نهاية العقد" a={playerA.contract?.endSeason ?? 0} b={playerB.contract?.endSeason ?? 0} />
          <StatRow label="الراتب (M€/موسم)" a={playerA.contract?.salary ?? 0} b={playerB.contract?.salary ?? 0} higherIsBetter={false} />
          <div className="h-3" />
        </div>
      </div>
    </div>
  );
}
