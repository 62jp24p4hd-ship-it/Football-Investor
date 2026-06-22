"use client";

import React from "react";
import type { StandingRow } from "../game/leagueEngine";

type LeagueStandingsProps = {
  standings: StandingRow[];
  currentRound: number;
  totalRounds: number;
  leagueName?: string;
  leagueLogo?: string;
  tier?: 1 | 2;
  leagueId?: string;
};

// Returns positions (1-indexed) that should be green in tier 1 (below champion)
function getCLGreenPositions(leagueId?: string): number[] {
  if (["saudi_league", "portuguese_league", "eredivisie"].includes(leagueId ?? "")) return [2, 3];
  if (leagueId === "super_lig") return [2];
  return [2, 3, 4, 5]; // default: big-5 style (2–5 green)
}

export default function LeagueStandings({
  standings,
  currentRound,
  totalRounds,
  leagueName = "Premier League",
  leagueLogo,
  tier = 1,
  leagueId,
}: LeagueStandingsProps) {
  if (!standings || standings.length === 0) return null;

  const totalTeams = standings.length;
  const clGreenPositions = tier === 1 ? getCLGreenPositions(leagueId) : [];

  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {leagueLogo && (
            <img
              src={leagueLogo}
              alt={leagueName}
              style={{ width: "22px", height: "22px", objectFit: "contain" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <h3 className="text-sm font-bold text-slate-200">🏆 {leagueName}</h3>
        </div>
        <span className="text-xs text-slate-400">
          Round {currentRound}/{totalRounds}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-1 px-1 font-medium">#</th>
              <th className="text-left py-1 px-1 font-medium">Team</th>
              <th className="text-center py-1 px-1 font-medium">P</th>
              <th className="text-center py-1 px-1 font-medium">W</th>
              <th className="text-center py-1 px-1 font-medium">D</th>
              <th className="text-center py-1 px-1 font-medium">L</th>
              <th className="text-center py-1 px-1 font-medium">GD</th>
              <th className="text-center py-1 px-1 font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, idx) => {
              const gd = row.goalsFor - row.goalsAgainst;
              const position = idx + 1;
              const isRelegationZone = position > totalTeams - 3;

              let rowText = "text-slate-300";
              let isGoldAnimated = false;
              let isRedAnimated = false;
              let isGreen = false;

              if (position === 1) {
                isGoldAnimated = true;
                rowText = "text-yellow-100 font-semibold";
              } else if (tier === 2 && (position === 2 || position === 3)) {
                // Tier 2: positions 2–3 are promotion spots → green
                isGreen = true;
                rowText = "text-green-100";
              } else if (tier === 1 && clGreenPositions.includes(position)) {
                // Tier 1: only specific leagues have CL spots below 1st → green
                isGreen = true;
                rowText = "text-green-100";
              } else if (isRelegationZone) {
                isRedAnimated = true;
                rowText = "text-red-100";
              }

              return (
                <tr
                  key={row.teamId}
                  className={`border-b border-slate-800/50 ${rowText} ${
                    isGoldAnimated ? "gold-shimmer-row" : ""
                  } ${
                    isRedAnimated ? "red-shimmer-row" : ""
                  } ${
                    isGreen ? "bg-green-600/30" : ""
                  } ${row.isUser ? "ring-2 ring-emerald-400/70 ring-inset font-bold" : ""}`}
                >
                  <td className="py-1 px-1">{position}</td>
                  <td className="py-1 px-1 truncate max-w-[90px]">
                    {row.teamName}
                    {row.isUser && <span className="ml-1 text-emerald-300">●</span>}
                  </td>
                  <td className="text-center py-1 px-1">{row.played}</td>
                  <td className="text-center py-1 px-1">{row.won}</td>
                  <td className="text-center py-1 px-1">{row.drawn}</td>
                  <td className="text-center py-1 px-1">{row.lost}</td>
                  <td className="text-center py-1 px-1">
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td className="text-center py-1 px-1 font-bold">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .gold-shimmer-row {
          background: linear-gradient(
            90deg,
            rgba(234, 179, 8, 0.25) 0%,
            rgba(250, 204, 21, 0.55) 25%,
            rgba(234, 179, 8, 0.25) 50%,
            rgba(250, 204, 21, 0.55) 75%,
            rgba(234, 179, 8, 0.25) 100%
          );
          background-size: 200% 100%;
          animation: goldShimmer 2.5s linear infinite;
        }
        @keyframes goldShimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: -200% 0%; }
        }

        .red-shimmer-row {
          background: linear-gradient(
            90deg,
            rgba(220, 38, 38, 0.2) 0%,
            rgba(239, 68, 68, 0.5) 25%,
            rgba(220, 38, 38, 0.2) 50%,
            rgba(239, 68, 68, 0.5) 75%,
            rgba(220, 38, 38, 0.2) 100%
          );
          background-size: 200% 100%;
          animation: redShimmer 2.5s linear infinite;
        }
        @keyframes redShimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: -200% 0%; }
        }
      `}</style>
    </div>
  );
}
