"use client";

import React, { useState } from "react";
import type { LeagueState } from "../game/leagueEngine";
import { getTopScorers, getTopAssists } from "../game/leagueEngine";

type Props = {
  otherLeagues: Record<string, LeagueState>;
  onClose: () => void;
};

const LEAGUE_INFO: Record<string, { name: string; flag: string; logo: string; color: string }> = {
  premier_league:    { name: "Premier League",  flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", logo: "/images/league-premier.png",    color: "#3d195b" },
  bundesliga:        { name: "Bundesliga",       flag: "🇩🇪",        logo: "/images/league-bundesliga.png", color: "#d00000" },
  la_liga:           { name: "La Liga",          flag: "🇪🇸",        logo: "/images/league-laliga.png",     color: "#ee8700" },
  serie_a:           { name: "Serie A",          flag: "🇮🇹",        logo: "/images/league-seriea.png",     color: "#0066cc" },
  ligue_1:           { name: "Ligue 1",          flag: "🇫🇷",        logo: "/images/league-ligue1.png",     color: "#002395" },
  saudi_league:      { name: "Saudi Pro League", flag: "🇸🇦",        logo: "/images/league-saudi.png",      color: "#006c35" },
  portuguese_league: { name: "Primeira Liga",    flag: "🇵🇹",        logo: "/images/league-portugal.png",   color: "#006600" },
  eredivisie:        { name: "Eredivisie",       flag: "🇳🇱",        logo: "/images/league-eredivisie.png", color: "#ff6600" },
  super_lig:         { name: "Süper Lig",        flag: "🇹🇷",        logo: "/images/league-superlig.png",   color: "#e30a17" },
  championship:      { name: "Championship",    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",       logo: "/images/league-championship.png", color: "#5c2d8a" },
  bundesliga2:       { name: "Bundesliga 2",   flag: "🇩🇪",        logo: "/images/league-bundesliga2.png",  color: "#a00000" },
  segunda:           { name: "Segunda División", flag: "🇪🇸",        logo: "/images/league-segunda.png",       color: "#c8a800" },
  serie_b:           { name: "Serie B",           flag: "🇮🇹",        logo: "/images/league-serieb.png",        color: "#004a99" },
  ligue_2:           { name: "Ligue 2",           flag: "🇫🇷",        logo: "/images/league-ligue2.png",         color: "#001e96" },
};

type Tab = "standings" | "scorers" | "assists";

export default function OtherLeaguesModal({ otherLeagues, onClose }: Props) {
  const leagueIds = Object.keys(otherLeagues);
  const [activeLeague, setActiveLeague] = useState(leagueIds[0] ?? "");
  const [activeTab, setActiveTab] = useState<Tab>("standings");

  const league = activeLeague ? otherLeagues[activeLeague] : null;
  const info = LEAGUE_INFO[activeLeague] ?? { name: activeLeague, flag: "🏆", logo: "", color: "#FFD54F" };
  const topScorers = league ? getTopScorers(league, 10) : [];
  const topAssists = league ? getTopAssists(league, 10) : [];

  const champion = league?.standings[0];
  const totalTeams = league?.standings.length ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg flex flex-col overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0a0d14, #0d1117)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px 20px 0 0",
          maxHeight: "92vh",
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div className="font-black text-white text-lg tracking-wide">🌍 Other Leagues</div>
            <div className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Round {league?.currentRound ?? 0} / {league?.totalRounds ?? 0}
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center font-black text-xl transition-all hover:scale-110 active:scale-90"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", borderRadius: "10px" }}>
            ×
          </button>
        </div>

        {/* ── League Selector Grid ── */}
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2">
            {leagueIds.map(lid => {
              const i = LEAGUE_INFO[lid] ?? { name: lid, flag: "🏆", logo: "", color: "#FFD54F" };
              const isActive = activeLeague === lid;
              return (
                <button key={lid} onClick={() => { setActiveLeague(lid); setActiveTab("standings"); }}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl transition-all duration-150"
                  style={isActive ? {
                    background: `rgba(${hexToRgb(i.color)}, 0.18)`,
                    border: `1.5px solid ${i.color}`,
                    boxShadow: `0 0 16px rgba(${hexToRgb(i.color)}, 0.25)`,
                  } : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                  {i.logo
                    ? <img src={i.logo} alt={i.name} style={{ width: "28px", height: "28px", objectFit: "contain", opacity: isActive ? 1 : 0.5 }}
                        onError={e => { (e.target as HTMLImageElement).replaceWith(Object.assign(document.createElement("span"), { textContent: i.flag, style: "font-size:20px" })); }} />
                    : <span style={{ fontSize: "20px" }}>{i.flag}</span>
                  }
                  <span className="text-[9px] font-bold text-center leading-tight"
                    style={{ color: isActive ? "white" : "#6b7280" }}>
                    {i.name.split(" ").slice(0, 2).join(" ")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active League Header ── */}
        {league && (
          <div className="mx-4 mb-3 px-4 py-3 rounded-xl flex-shrink-0"
            style={{ background: `rgba(${hexToRgb(info.color)}, 0.12)`, border: `1px solid rgba(${hexToRgb(info.color)}, 0.3)` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {info.logo && (
                  <img src={info.logo} alt={info.name} style={{ width: "36px", height: "36px", objectFit: "contain" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <div>
                  <div className="font-black text-white text-sm">{info.name}</div>
                  <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {totalTeams} clubs · {league.currentRound}/{league.totalRounds} rounds
                  </div>
                </div>
              </div>
              {champion && (
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,215,0,0.6)" }}>Leader</div>
                  <div className="text-xs font-black" style={{ color: "#FFD54F" }}>{champion.teamName}</div>
                  <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{champion.points} pts</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 px-4 mb-3 flex-shrink-0">
          {([
            { key: "standings", label: "📊 Standings" },
            { key: "scorers",   label: "⚽ Scorers" },
            { key: "assists",   label: "🅰️ Assists" },
          ] as { key: Tab; label: string }[]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={activeTab === tab.key ? {
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              } : {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#6b7280",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="overflow-y-auto flex-1 px-4 pb-6">
          {!league ? (
            <div className="text-center text-gray-500 py-12">No data available</div>
          ) : activeTab === "standings" ? (
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ background: "#0d1117" }}>
                <tr style={{ color: "#4b5563", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left py-2 px-1 font-medium">#</th>
                  <th className="text-left py-2 px-1 font-medium">Team</th>
                  <th className="text-center py-2 px-1 font-medium">P</th>
                  <th className="text-center py-2 px-1 font-medium">W</th>
                  <th className="text-center py-2 px-1 font-medium">D</th>
                  <th className="text-center py-2 px-1 font-medium">L</th>
                  <th className="text-center py-2 px-1 font-medium">GD</th>
                  <th className="text-center py-2 px-1 font-bold text-white">Pts</th>
                </tr>
              </thead>
              <tbody>
                {league.standings.map((row, idx) => {
                  const gd = row.goalsFor - row.goalsAgainst;
                  const pos = idx + 1;
                  let bg = "transparent";
                  let textColor = "rgba(255,255,255,0.7)";
                  if (pos === 1) { bg = "rgba(234,179,8,0.12)"; textColor = "#FFD54F"; }
                  else if (pos <= 4) { bg = "rgba(16,185,129,0.08)"; textColor = "rgba(255,255,255,0.8)"; }
                  else if (pos > totalTeams - 3) { bg = "rgba(239,68,68,0.08)"; textColor = "rgba(255,100,100,0.8)"; }

                  return (
                    <tr key={row.teamId}
                      style={{ background: bg, borderBottom: "1px solid rgba(255,255,255,0.03)", color: textColor }}>
                      <td className="py-2 px-1 font-bold" style={{ color: pos === 1 ? "#FFD54F" : "#4b5563" }}>{pos}</td>
                      <td className="py-2 px-1 font-medium truncate max-w-[110px]">{row.teamName}</td>
                      <td className="text-center py-2 px-1">{row.played}</td>
                      <td className="text-center py-2 px-1">{row.won}</td>
                      <td className="text-center py-2 px-1">{row.drawn}</td>
                      <td className="text-center py-2 px-1">{row.lost}</td>
                      <td className="text-center py-2 px-1">{gd > 0 ? `+${gd}` : gd}</td>
                      <td className="text-center py-2 px-1 font-black" style={{ color: "#FFD54F" }}>{row.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="space-y-2">
              {(activeTab === "scorers" ? topScorers : topAssists).length === 0 ? (
                <div className="text-center py-12" style={{ color: "#4b5563" }}>No data yet</div>
              ) : (activeTab === "scorers" ? topScorers : topAssists).map((p, i) => (
                <div key={p.playerName}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{
                    background: i === 0 ? "rgba(234,179,8,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 0 ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.05)"}`,
                  }}>
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-black text-sm"
                      style={{ color: i === 0 ? "#FFD54F" : i < 3 ? "rgba(255,255,255,0.5)" : "#374151" }}>
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{p.playerName}</div>
                      <div className="text-[10px]" style={{ color: "#6b7280" }}>{p.teamName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-black">
                    {activeTab === "scorers"
                      ? <span style={{ color: "#10B981" }}>⚽ {p.goals}</span>
                      : <span style={{ color: "#60a5fa" }}>🅰️ {p.assists}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255,255,255";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}