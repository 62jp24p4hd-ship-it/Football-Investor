"use client";

import React from "react";

type MatchPreviewModalProps = {
  round: number;
  userTeamName: string;
  opponentName: string;
  userIsHome: boolean;
  userLineup: { name: string; position: string }[];
  opponentLineup: { name: string; position: string }[];
  userAverage: number;
  opponentAverage: number;
  onStart: () => void;
  onClose: () => void;
};

export default function MatchPreviewModal({
  round,
  userTeamName,
  opponentName,
  userIsHome,
  userLineup,
  opponentLineup,
  userAverage,
  opponentAverage,
  onStart,
  onClose,
}: MatchPreviewModalProps) {
  const favoredSide =
    userAverage > opponentAverage ? "user" : opponentAverage > userAverage ? "opponent" : "even";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700">
          <div className="text-center text-xs text-slate-400 font-medium mb-2">
            Round {round} — Kickoff Preview
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 text-right">
              <div
                className={`text-lg font-bold truncate ${
                  userIsHome ? "text-emerald-300" : "text-slate-200"
                }`}
              >
                {userTeamName}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">
                {userIsHome ? "Home" : "Away"}
              </div>
            </div>
            <div className="text-slate-500 font-black text-xl">VS</div>
            <div className="flex-1 text-left">
              <div
                className={`text-lg font-bold truncate ${
                  !userIsHome ? "text-emerald-300" : "text-slate-200"
                }`}
              >
                {opponentName}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">
                {!userIsHome ? "Home" : "Away"}
              </div>
            </div>
          </div>
        </div>

        {/* Average ratings comparison */}
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Squad Average</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-2xl font-black w-14 text-right ${
                favoredSide === "user" ? "text-emerald-400" : "text-slate-300"
              }`}
            >
              {userAverage.toFixed(1)}
            </span>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{
                  width: `${(userAverage / (userAverage + opponentAverage)) * 100}%`,
                }}
              />
              <div
                className="bg-orange-500 h-full transition-all"
                style={{
                  width: `${(opponentAverage / (userAverage + opponentAverage)) * 100}%`,
                }}
              />
            </div>
            <span
              className={`text-2xl font-black w-14 ${
                favoredSide === "opponent" ? "text-orange-400" : "text-slate-300"
              }`}
            >
              {opponentAverage.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Lineups */}
        <div className="grid grid-cols-2 gap-4 px-6 py-4 max-h-72 overflow-y-auto">
          <div>
            <div className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">
              {userTeamName}
            </div>
            <div className="space-y-1.5">
              {userLineup.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No players signed yet</div>
              ) : (
                userLineup.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800 rounded px-1.5 py-0.5 w-10 text-center shrink-0">
                      {p.position}
                    </span>
                    <span className="text-slate-200 truncate">{p.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-orange-400 mb-2 uppercase tracking-wide">
              {opponentName}
            </div>
            <div className="space-y-1.5">
              {opponentLineup.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800 rounded px-1.5 py-0.5 w-10 text-center shrink-0">
                    {p.position}
                  </span>
                  <span className="text-slate-200 truncate">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start button */}
        <div className="px-6 py-4 border-t border-slate-800">
          <button
            onClick={onStart}
            className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white transition-all shadow-lg shadow-emerald-900/40"
          >
            ▶ Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
