"use client";

import React from "react";
import type { MatchEvent } from "../game/leagueEngine";

type MatchSummaryModalProps = {
  round: number;
  userTeamName: string;
  opponentName: string;
  userIsHome: boolean;
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
  roundLabel?: string;
  onClose: () => void;
};

export default function MatchSummaryModal({
  round,
  userTeamName,
  opponentName,
  userIsHome,
  homeGoals,
  awayGoals,
  events,
  roundLabel,
  onClose,
}: MatchSummaryModalProps) {
  const homeName = userIsHome ? userTeamName : opponentName;
  const awayName = userIsHome ? opponentName : userTeamName;

  const userGoals = userIsHome ? homeGoals : awayGoals;
  const oppGoals = userIsHome ? awayGoals : homeGoals;
  const outcome = userGoals > oppGoals ? "WIN" : userGoals < oppGoals ? "LOSS" : "DRAW";

  const theme =
    outcome === "WIN"
      ? {
          headerGrad: "from-emerald-600 via-emerald-700 to-slate-900",
          glow: "shadow-emerald-500/30",
          badge: "bg-emerald-500 text-white",
          ring: "ring-emerald-400/40",
          emoji: "🏆",
        }
      : outcome === "LOSS"
      ? {
          headerGrad: "from-red-700 via-red-800 to-slate-900",
          glow: "shadow-red-500/30",
          badge: "bg-red-500 text-white",
          ring: "ring-red-400/40",
          emoji: "😞",
        }
      : {
          headerGrad: "from-slate-600 via-slate-700 to-slate-900",
          glow: "shadow-slate-500/30",
          badge: "bg-slate-400 text-slate-900",
          ring: "ring-slate-400/40",
          emoji: "🤝",
        };

  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);
  const goalEvents = sortedEvents.filter((e) => e.type === "goal");

  // Goals are split into a "home side" column and an "away side" column,
  // matching exactly where homeName/awayName are positioned in the header above
  // (left = home, right = away) — NOT fixed to user/opponent, since the user
  // can be on either side depending on the fixture.
  const homeColumnGoals = goalEvents.filter((event) => event.team === "home");
  const awayColumnGoals = goalEvents.filter((event) => event.team === "away");

  function GoalEntry({ event, align, isUserGoal }: { event: MatchEvent; align: "left" | "right"; isUserGoal: boolean }) {
    return (
      <div
        className={`flex items-center gap-3 text-base rounded-2xl px-4 py-3.5 ${
          isUserGoal ? "bg-emerald-950/30" : "bg-slate-800/40"
        } ${align === "right" ? "flex-row-reverse text-right" : ""}`}
      >
        <span className="text-sm text-slate-400 font-mono w-12 shrink-0 bg-slate-800 rounded-lg py-1.5 text-center">
          {event.minute}'
        </span>
        <span className="text-2xl shrink-0">⚽</span>
        <div className="flex flex-col min-w-0">
          <span className={`font-semibold text-base truncate ${isUserGoal ? "text-emerald-300" : "text-slate-100"}`}>
            {event.scorerName ?? "Unknown"}
          </span>
          {event.assistName && (
            <span className="text-xs text-slate-500 truncate">
              🅰️ assist: {event.assistName}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-[fadeIn_0.25s_ease-out]"
      onClick={onClose}
    >
      <div
        className={`bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl ${theme.glow} ring-1 ${theme.ring} max-w-5xl w-full overflow-hidden cursor-pointer animate-[popIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]`}
        onClick={onClose}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${theme.headerGrad} px-12 py-12 relative overflow-hidden`}>
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative flex items-center justify-between mb-6">
            <span className="text-base text-white/70 font-semibold uppercase tracking-widest">
              {roundLabel ?? `Round ${round}`}
            </span>
            <span
              className={`text-base font-black px-5 py-2 rounded-full ${theme.badge} flex items-center gap-2 shadow-lg`}
            >
              <span className="text-xl">{theme.emoji}</span>
              {outcome}
            </span>
          </div>

          <div className="relative grid grid-cols-2 gap-8 mt-6 items-center">
            <div className="text-right">
              <div
                className={`text-3xl font-bold truncate ${
                  userIsHome ? "text-white" : "text-white/70"
                }`}
              >
                {homeName}
              </div>
              {userIsHome && (
                <div className="text-sm text-emerald-300 font-semibold uppercase mt-1.5">
                  Your Team
                </div>
              )}
            </div>

            <div className="text-left">
              <div
                className={`text-3xl font-bold truncate ${
                  !userIsHome ? "text-white" : "text-white/70"
                }`}
              >
                {awayName}
              </div>
              {!userIsHome && (
                <div className="text-sm text-emerald-300 font-semibold uppercase mt-1.5">
                  Your Team
                </div>
              )}
            </div>
          </div>

          <div className="relative flex items-center justify-center gap-6 mt-4">
            <span className="text-7xl font-black text-white drop-shadow-lg">{homeGoals}</span>
            <span className="text-white/40 text-4xl font-light">-</span>
            <span className="text-7xl font-black text-white drop-shadow-lg">{awayGoals}</span>
          </div>
        </div>

        {/* Goals — two columns matching the home/away name positions in the header above */}
        <div className="px-12 py-10 max-h-[32rem] overflow-y-auto bg-slate-900">
          {goalEvents.length === 0 ? (
            <div className="text-center text-slate-500 text-lg py-16">
              <div className="text-5xl mb-4">🔇</div>
              No goals in this match.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 relative">
              {/* Vertical divider line down the middle */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700/60 -translate-x-1/2" />

              {/* Left column — home team's goals (whoever that is) */}
              <div className="space-y-3 pr-4">
                {homeColumnGoals.map((event, idx) => (
                  <GoalEntry key={idx} event={event} align="left" isUserGoal={userIsHome} />
                ))}
                {homeColumnGoals.length === 0 && (
                  <div className="text-center text-slate-600 text-sm py-6 italic">No goals</div>
                )}
              </div>

              {/* Right column — away team's goals (whoever that is) */}
              <div className="space-y-3 pl-4">
                {awayColumnGoals.map((event, idx) => (
                  <GoalEntry key={idx} event={event} align="right" isUserGoal={!userIsHome} />
                ))}
                {awayColumnGoals.length === 0 && (
                  <div className="text-center text-slate-600 text-sm py-6 italic">No goals</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-12 py-6 border-t border-slate-800 text-center bg-slate-900">
          <span className="text-sm text-slate-500">✦ Tap anywhere to close ✦</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}
