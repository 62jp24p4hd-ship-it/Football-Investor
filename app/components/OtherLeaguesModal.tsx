"use client";

import React, { useState } from "react";
import type { LeagueState } from "../game/leagueEngine";
import { getTopScorers } from "../game/leagueEngine";

type Props = {
  otherLeagues: Record<string, LeagueState>;
  onClose: () => void;
};

const LEAGUE_INFO: Record<string, { name: string; flag: string; logo: string }> = {
  premier_league: { name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", logo: "/images/league-premier.png" },
  bundesliga:     { name: "Bundesliga",     flag: "🇩🇪", logo: "/images/league-bundesliga.png" },
  la_liga:        { name: "La Liga",        flag: "🇪🇸", logo: "/images/league-laliga.png" },
  serie_a:        { name: "Serie A",        flag: "🇮🇹", logo: "/images/league-seriea.png" },
  ligue_1:        { name: "Ligue 1",        flag: "🇫🇷", logo: "/images/league-ligue1.png" },
  saudi_league:       { name: "Saudi Pro League", flag: "🇸🇦", logo: "/images/league-saudi.png" },
  portuguese_league:  { name: "Primeira Liga",    flag: "🇵🇹", logo: "/images/league-portugal.png" },
  eredivisie:         { name: "Eredivisie",       flag: "🇳🇱", logo: "/images/league-eredivisie.png" },
  super_lig:          { name: "Süper Lig",        flag: "🇹🇷", logo: "/images/league-superlig.png" },
};

type Tab = "standings" | "scorers";

export default function OtherLeaguesModal({ otherLeagues, onClose }: Props) {
  const leagueIds = Object.keys(otherLeagues);
  const [activeLeague, setActiveLeague] = useState(leagueIds[0] ?? "");
  const [activeTab, setActiveTab] = useState<Tab>("standings");

  const league = activeLeague ? otherLeagues[activeLeague] : null;
  const info = LEAGUE_INFO[activeLeague] ?? { name: activeLeague, flag: "🏆", logo: "" };
  const topScorers = league ? getTopScorers(league, 10) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl"
        style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="font-black text-white text-base">🌍 Other Leagues</div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center font-black text-lg transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", borderRadius: "6px" }}>
            ×
          </button>
        </div>

        {/* League Tabs */}
        <div className="flex gap-1 px-3 py-2 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {leagueIds.map(lid => {
            const i = LEAGUE_INFO[lid] ?? { name: lid, flag: "🏆", logo: "" };
            return (
              <button key={lid} onClick={() => setActiveLeague(lid)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0"
                style={activeLeague === lid ? {
                  background: "rgba(255,213,79,0.15)",
                  border: "1.5px solid rgba(255,213,79,0.6)",
                  color: "#FFD54F",
                } : {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#6b7280",
                }}>
                {i.logo && (
                  <img src={i.logo} alt={i.name}
                    style={{ width: "14px", height: "14px", objectFit: "contain" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                {i.flag} {i.name}
              </button>
            );
          })}
        </div>

        {/* Sub Tabs */}
        <div className="flex gap-1 px-3 py-2">
          {(["standings", "scorers"] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={activeTab === tab ? {
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              } : {
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#6b7280",
              }}>
              {tab === "standings" ? "📊 Standings" : "⚽ Top Scorers"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-3 pb-4">
          {!league ? (
            <div className="text-center text-gray-500 py-8">No data</div>
          ) : activeTab === "standings" ? (
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: "#6b7280", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th className="text-left py-2 px-1">#</th>
                  <th className="text-left py-2 px-1">Team</th>
                  <th className="text-center py-2 px-1">P</th>
                  <th className="text-center py-2 px-1">W</th>
                  <th className="text-center py-2 px-1">D</th>
                  <th className="text-center py-2 px-1">L</th>
                  <th className="text-center py-2 px-1">GD</th>
                  <th className="text-center py-2 px-1 font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {league.standings.map((row, idx) => {
                  const gd = row.goalsFor - row.goalsAgainst;
                  const pos = idx + 1;
                  const total = league.standings.length;
                  let rowColor = "rgba(255,255,255,0.7)";
                  let rowBg = "transparent";
                  if (pos === 1) rowBg = "rgba(234,179,8,0.15)";
                  else if (pos <= 4) rowBg = "rgba(16,185,129,0.12)";
                  else if (pos > total - 3) rowBg = "rgba(239,68,68,0.12)";

                  return (
                    <tr key={row.teamId} style={{ background: rowBg, borderBottom: "1px solid rgba(255,255,255,0.04)", color: rowColor }}>
                      <td className="py-1.5 px-1">{pos}</td>
                      <td className="py-1.5 px-1 truncate max-w-[100px] font-medium">{row.teamName}</td>
                      <td className="text-center py-1.5 px-1">{row.played}</td>
                      <td className="text-center py-1.5 px-1">{row.won}</td>
                      <td className="text-center py-1.5 px-1">{row.drawn}</td>
                      <td className="text-center py-1.5 px-1">{row.lost}</td>
                      <td className="text-center py-1.5 px-1">{gd > 0 ? `+${gd}` : gd}</td>
                      <td className="text-center py-1.5 px-1 font-black" style={{ color: "#FFD54F" }}>{row.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="space-y-1 mt-1">
              {topScorers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No goals yet</div>
              ) : topScorers.map((p, i) => (
                <div key={p.playerName} className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: i === 0 ? "rgba(234,179,8,0.1)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black w-5 text-center" style={{ color: i === 0 ? "#FFD54F" : "#6b7280" }}>
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{p.playerName}</div>
                      <div className="text-[10px]" style={{ color: "#6b7280" }}>{p.teamName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span style={{ color: "#10B981" }}>⚽ {p.goals}</span>
                    <span style={{ color: "#6b7280" }}>🅰️ {p.assists}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Round info */}
        {league && (
          <div className="px-4 py-2 text-center text-[10px]"
            style={{ color: "#4b5563", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            Round {league.currentRound} / {league.totalRounds}
          </div>
        )}
      </div>
    </div>
  );
}