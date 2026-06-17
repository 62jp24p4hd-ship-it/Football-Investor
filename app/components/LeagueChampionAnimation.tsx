"use client";

import React, { useEffect, useState } from "react";

type LeagueChampionAnimationProps = {
  championName: string;
  isUserChampion: boolean;
  bestPlayerName: string | null;
  bestPlayerTeam: string | null;
  bestPlayerGoals: number;
  bestPlayerAssists: number;
  onDone: () => void;
};

export default function LeagueChampionAnimation({
  championName,
  isUserChampion,
  bestPlayerName,
  bestPlayerTeam,
  bestPlayerGoals,
  bestPlayerAssists,
  onDone,
}: LeagueChampionAnimationProps) {
  const [stage, setStage] = useState<"champion" | "bestPlayer">("champion");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("bestPlayer"), 3200);
    const t2 = setTimeout(() => onDone(), bestPlayerName ? 6400 : 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone, bestPlayerName]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer"
      onClick={onDone}
    >
      {stage === "champion" ? (
        <div className="text-center animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="text-7xl mb-6 animate-[bounce_1.5s_ease-in-out_infinite]">🏆</div>
          <div className="text-sm text-yellow-300 font-semibold uppercase tracking-widest mb-3">
            Premier League Champions
          </div>
          <div
            className={`text-5xl font-black ${
              isUserChampion ? "text-yellow-300" : "text-white"
            } drop-shadow-[0_0_25px_rgba(250,204,21,0.5)]`}
          >
            {championName}
          </div>
          {isUserChampion && (
            <div className="text-emerald-300 text-lg font-semibold mt-4">
              You won the league! 🎉
            </div>
          )}
        </div>
      ) : (
        bestPlayerName && (
          <div className="text-center animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="text-7xl mb-6">⭐</div>
            <div className="text-sm text-blue-300 font-semibold uppercase tracking-widest mb-3">
              Player of the Season
            </div>
            <div className="text-5xl font-black text-white drop-shadow-[0_0_25px_rgba(96,165,250,0.5)]">
              {bestPlayerName}
            </div>
            <div className="text-slate-400 text-base mt-2">{bestPlayerTeam}</div>
            <div className="text-slate-300 text-lg font-semibold mt-4">
              {bestPlayerGoals} Goals · {bestPlayerAssists} Assists
            </div>
          </div>
        )
      )}

      <style>{`
        @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
