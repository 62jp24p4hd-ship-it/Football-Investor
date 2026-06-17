"use client";

import React, { useState } from "react";
import type { LeaguePlayerStat } from "../game/leagueEngine";

type LeagueStatsModalProps = {
  topScorers: LeaguePlayerStat[];
  topAssists: LeaguePlayerStat[];
  topCleanSheets: LeaguePlayerStat[];
  onClose: () => void;
};

type Tab = "goals" | "assists" | "cleanSheets";

export default function LeagueStatsModal({
  topScorers,
  topAssists,
  topCleanSheets,
  onClose,
}: LeagueStatsModalProps) {
  const [tab, setTab] = useState<Tab>("goals");

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: "goals", label: "Top Scorers", emoji: "⚽" },
    { key: "assists", label: "Top Assists", emoji: "🅰️" },
    { key: "cleanSheets", label: "Clean Sheets", emoji: "🧤" },
  ];

  const activeList =
    tab === "goals" ? topScorers : tab === "assists" ? topAssists : topCleanSheets;

  const valueFor = (stat: LeaguePlayerStat) =>
    tab === "goals" ? stat.goals : tab === "assists" ? stat.assists : stat.cleanSheets;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">🏆 League Stats</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-sm">
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                tab === t.key
                  ? "text-emerald-300 border-b-2 border-emerald-400 bg-emerald-950/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto px-4 py-4 flex-1">
          {activeList.length === 0 ? (
            <div className="text-center text-slate-500 text-sm py-10">No data yet this season.</div>
          ) : (
            <div className="space-y-1.5">
              {activeList.map((stat, idx) => (
                <div
                  key={stat.playerName}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                    stat.isUserTeam ? "bg-emerald-950/30 ring-1 ring-emerald-400/30" : "bg-slate-800/40"
                  }`}
                >
                  <span className="text-xs font-mono text-slate-500 w-5 shrink-0 text-center">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={`text-sm font-semibold truncate ${stat.isUserTeam ? "text-emerald-300" : "text-slate-100"}`}>
                      {stat.playerName}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">{stat.teamName}</span>
                  </div>
                  <span className="text-base font-black text-slate-100 shrink-0">{valueFor(stat)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 text-center">
          <span className="text-xs text-slate-500">✦ Tap outside to close ✦</span>
        </div>
      </div>
    </div>
  );
}
