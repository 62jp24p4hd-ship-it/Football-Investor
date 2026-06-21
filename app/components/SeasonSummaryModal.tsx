"use client";

import { getLeagueTheme } from "../game/leagueThemes";
import type { LeagueState } from "../game/leagueEngine";
import type { GamePlayer } from "../game/types";

type Props = {
  season: number;
  leagueState: LeagueState;
  leagueId: string;
  leagueName: string;
  userTeamName: string;
  gamePlayers: GamePlayer[];
  onContinue: () => void;
};

export default function SeasonSummaryModal({
  season, leagueState, leagueId, leagueName, userTeamName, gamePlayers, onContinue,
}: Props) {
  const theme = getLeagueTheme(leagueId);
  const userTeam = leagueState.teams.find(t => t.isUser);
  const userStanding = leagueState.standings.find(r => r.teamName === userTeamName);
  const position = leagueState.standings.findIndex(r => r.teamName === userTeamName) + 1;
  const totalTeams = leagueState.standings.length;
  const isChampion = leagueState.champion === userTeamName;

  // Top scorer from playerStats
  const topScorer = Object.entries(leagueState.playerStats ?? {})
    .sort(([,a],[,b]) => b.goals - a.goals)[0];

  // User's owned players stats this season
  const userPlayers = gamePlayers[0]?.owned ?? [];
  const squadStrength = userTeam?.strength ?? 0;
  const budget = gamePlayers[0]?.budget ?? 0;

  const positionEmoji = position === 1 ? "🏆" : position <= 3 ? "🥈" : position <= 6 ? "✅" : position > totalTeams - 3 ? "⬇️" : "📊";
  const positionLabel = position === 1 ? "البطل! 🎊" : position === 2 ? "الوصيف" : position === 3 ? "المركز الثالث" : `المركز ${position}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}>

      <style>{`
        @keyframes summaryIn {
          from { opacity: 0; transform: scale(0.88) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes summaryShine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="w-full max-w-lg overflow-hidden"
        style={{
          background: `linear-gradient(160deg, #08090f 0%, ${theme.accentColor}18 100%)`,
          border: `1px solid ${theme.accentColor}55`,
          borderRadius: "20px",
          boxShadow: `0 0 60px ${theme.glowColor}, 0 0 0 1px ${theme.dimColor}`,
          animation: "summaryIn 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center relative overflow-hidden"
          style={{ borderBottom: `1px solid ${theme.dimColor}` }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: `linear-gradient(135deg, transparent 30%, ${theme.accentColor}12 50%, transparent 70%)`,
            animation: "summaryShine 3s ease-in-out infinite",
          }} />
          <div className="text-4xl mb-2">{positionEmoji}</div>
          <div className="font-black text-white text-xl mb-1">
            نهاية موسم {season}
          </div>
          <div className="text-sm" style={{ color: theme.textColor }}>
            {theme.flag} {leagueName}
          </div>
          {isChampion && (
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 font-black text-sm"
              style={{
                background: theme.badgeGradient,
                borderRadius: "999px",
                color: "white",
                boxShadow: `0 0 16px ${theme.glowColor}`,
              }}>
              🏆 أبطال {leagueName}!
            </div>
          )}
        </div>

        {/* Main stats */}
        <div className="px-6 py-5 space-y-4">

          {/* Position */}
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${theme.dimColor}` }}>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">الترتيب النهائي</div>
              <div className="font-black text-white text-2xl">{positionLabel}</div>
              <div className="text-xs mt-1" style={{ color: theme.textColor }}>
                من أصل {totalTeams} فريق
              </div>
            </div>
            <div className="text-5xl">{positionEmoji}</div>
          </div>

          {/* Stats grid */}
          {userStanding && (
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "نقاط", value: userStanding.points, color: theme.textColor },
                { label: "فوز", value: userStanding.won, color: "#34d399" },
                { label: "تعادل", value: userStanding.drawn, color: "#fbbf24" },
                { label: "خسارة", value: userStanding.lost, color: "#f87171" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="font-black text-xl" style={{ color }}>{value}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Goals */}
          {userStanding && (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="font-black text-lg text-emerald-400">{userStanding.goalsFor}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider">أهداف سُجّلت</div>
              </div>
              <div className="p-3 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="font-black text-lg text-red-400">{userStanding.goalsAgainst}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider">أهداف استُقبلت</div>
              </div>
            </div>
          )}

          {/* Top scorer */}
          {topScorer && (
            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: "rgba(255,213,79,0.06)", border: "1px solid rgba(255,213,79,0.2)" }}>
              <div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">الهداف الأول</div>
                <div className="font-black text-white text-sm">{topScorer[0]}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-yellow-300 text-xl">{topScorer[1].goals}</div>
                <div className="text-[9px] text-gray-500">هدف</div>
              </div>
            </div>
          )}

          {/* Budget */}
          <div className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs text-gray-500">الميزانية المتبقية</div>
            <div className="font-black text-base" style={{ color: budget >= 0 ? "#34d399" : "#f87171" }}>
              €{budget}M
            </div>
          </div>
        </div>

        {/* Continue */}
        <div className="px-6 pb-6">
          <button onClick={onContinue}
            className="w-full py-4 font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            style={{
              background: theme.badgeGradient,
              color: "white",
              borderRadius: "12px",
              boxShadow: `0 6px 24px ${theme.glowColor}`,
              border: `1px solid ${theme.accentColor}66`,
            }}>
            <span style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.1) 50%,transparent 100%)",
              animation: "summaryShine 2s ease-in-out infinite",
            }} />
            <span className="relative">▶ الموسم التالي →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
