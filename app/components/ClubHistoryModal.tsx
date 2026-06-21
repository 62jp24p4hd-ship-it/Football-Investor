"use client";

import { getLeagueTheme } from "../game/leagueThemes";

export type TrophyRecord = {
  season: number;
  leagueId: string;
  leagueName: string;
  position: number;
  points: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  isChampion: boolean;
};

export const HISTORY_KEY = "fi_club_history";

export function loadClubHistory(): TrophyRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSeasonToHistory(record: TrophyRecord): void {
  try {
    const history = loadClubHistory();
    // avoid duplicates for same season
    const filtered = history.filter(r => r.season !== record.season || r.leagueId !== record.leagueId);
    filtered.push(record);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch {}
}

type Props = {
  leagueId: string;
  leagueName: string;
  teamName: string;
  onClose: () => void;
};

export default function ClubHistoryModal({ leagueId, leagueName, teamName, onClose }: Props) {
  const theme = getLeagueTheme(leagueId);
  const history = loadClubHistory()
    .filter(r => r.leagueId === leagueId)
    .sort((a, b) => b.season - a.season);

  const championships = history.filter(r => r.isChampion).length;
  const top3 = history.filter(r => r.position <= 3).length;
  const totalSeasons = history.length;
  const avgPosition = totalSeasons > 0
    ? (history.reduce((s, r) => s + r.position, 0) / totalSeasons).toFixed(1)
    : "—";

  const positionEmoji = (pos: number, total: number) => {
    if (pos === 1) return "🏆";
    if (pos === 2) return "🥈";
    if (pos === 3) return "🥉";
    if (pos > total - 3) return "⬇️";
    return "📊";
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)" }}>
      <div className="w-full max-w-lg overflow-hidden"
        style={{
          background: `linear-gradient(160deg, #08090f 0%, ${theme.accentColor}14 100%)`,
          border: `1px solid ${theme.accentColor}44`,
          borderRadius: "18px",
          boxShadow: `0 0 50px ${theme.glowColor}`,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          animation: "historyIn 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}>
        <style>{`@keyframes historyIn{from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: `1px solid ${theme.dimColor}` }}>
          <div>
            <div className="font-black text-white text-base flex items-center gap-2">
              {theme.flag} سجل {teamName}
            </div>
            <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: theme.textColor }}>
              {leagueName} — Club History
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center font-black text-lg hover:scale-110 active:scale-90 transition-all"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#9ca3af" }}>
            ×
          </button>
        </div>

        {/* Summary stats */}
        <div className="px-5 py-3 grid grid-cols-4 gap-2 flex-shrink-0"
          style={{ borderBottom: `1px solid ${theme.dimColor}` }}>
          {[
            { label: "بطولات", value: championships, icon: "🏆", color: "#FFD54F" },
            { label: "بوديوم", value: top3, icon: "🎖️", color: theme.textColor },
            { label: "مواسم", value: totalSeasons, icon: "📅", color: "#9ca3af" },
            { label: "متوسط المركز", value: avgPosition, icon: "📊", color: "#6b7280" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="text-center p-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${theme.dimColor}` }}>
              <div className="text-lg mb-0.5">{icon}</div>
              <div className="font-black text-lg leading-none" style={{ color }}>{value}</div>
              <div className="text-[8px] text-gray-600 uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Season list */}
        <div className="overflow-y-auto flex-1 p-5 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <div className="text-4xl mb-3">📋</div>
              <div className="font-bold">لا يوجد سجل بعد</div>
              <div className="text-sm mt-1 text-gray-700">أكمل موسمك الأول لتظهر هنا</div>
            </div>
          ) : (
            history.map(record => (
              <div key={`${record.season}-${record.leagueId}`}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: record.isChampion ? `${theme.accentColor}12` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${record.isChampion ? theme.accentColor + "44" : "rgba(255,255,255,0.06)"}`,
                }}>
                <div className="text-2xl flex-shrink-0">
                  {positionEmoji(record.position, 18)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm">موسم {record.season}</span>
                    {record.isChampion && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: theme.badgeGradient, color: "white" }}>
                        🏆 بطل
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    المركز {record.position} · {record.points} نقطة · {record.won}ف {record.drawn}ت {record.lost}خ
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-sm" style={{ color: theme.textColor }}>
                    {record.goalsFor}<span className="text-gray-600">:</span>{record.goalsAgainst}
                  </div>
                  <div className="text-[9px] text-gray-600">أهداف</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
