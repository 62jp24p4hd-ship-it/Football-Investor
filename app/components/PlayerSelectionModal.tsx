"use client";

import { useState } from "react";
import type { Player, GamePlayer } from "../game/types";
import { getCurrentValue } from "../game/valueEngine";
import { getSeasonStats } from "../game/statsEngine";
import { calculateAge, nationalityFlag, positionBg, getRetirementWarning } from "../game/helpers";
import { getRatingColor, getRatingBg } from "../game/valueEngine";

type Props = {
  slot: string;
  options: Player[];
  activePlayer: GamePlayer;
  season: number;
  timer: number;
  timerSeconds: number | null;
  marketMultiplier: number;
  onBuy: (player: Player) => void;
  onClose: () => void;
};

function getCardStyle(player: Player): string {
  if (player.secret) return "border-yellow-400 bg-yellow-950/70 shadow-yellow-400/20";
  if (player.hiddenType === "talent") return "border-emerald-400 bg-emerald-950/70 shadow-emerald-400/20";
  if (player.hiddenType === "trap") return "border-orange-400 bg-orange-950/60 shadow-orange-400/15";
  return "border-purple-500/60 bg-[#1a1040]/80 shadow-purple-500/10";
}

export default function PlayerSelectionModal({ slot, options, activePlayer, season, timer, timerSeconds, marketMultiplier, onBuy, onClose }: Props) {
  const [selected, setSelected] = useState<Player | null>(null);
  const timerDanger = timerSeconds !== null && timer <= 5;

  return (
    <div className="fixed inset-0 bg-black/88 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-[#0d1128] border-2 border-purple-500/40 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl shadow-purple-500/15 animate-fade-in">

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between bg-purple-950/20">
          <div>
            <h2 className="text-2xl font-black text-white">
              Choose <span className={`px-2 py-0.5 rounded-lg text-lg ${positionBg(slot)}`}>{slot}</span>
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {activePlayer.name} • <span className="text-emerald-400 font-bold">€{activePlayer.budget}M</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {timerSeconds !== null && (
              <div className={`px-4 py-2 rounded-xl border font-black text-3xl tabular-nums ${
                timerDanger ? "border-red-500/60 bg-red-900/30 text-red-400 animate-pulse" : "border-yellow-500/40 bg-yellow-900/20 text-yellow-300"
              }`}>{timer}s</div>
            )}
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/8 border border-white/10 text-gray-400 hover:text-white transition-all text-sm font-bold">
              Close
            </button>
          </div>
        </div>

        <div className="p-6">

          {/* CARDS VIEW */}
          {!selected ? (
            options.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-5xl mb-3">😔</div>
                <div>No players available for {slot} in {season}</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {options.map((player, i) => {
                  const stats = getSeasonStats(player, season);
                  const value = getCurrentValue(player, season, marketMultiplier);
                  const age = calculateAge(player.startAge, player.availableSeason, season);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelected(player)}
                      className={`border-2 rounded-2xl p-4 text-left transition-all duration-200 hover:scale-105 hover:brightness-125 active:scale-95 cursor-pointer shadow-lg ${getCardStyle(player)}`}
                      style={{ animation: `fadeInUp 0.3s ease-out both`, animationDelay: `${i * 0.07}s` }}
                    >
                      <div className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg inline-block mb-2 ${positionBg(player.position)}`}>
                        {player.position}
                      </div>
                      <div className="font-black text-white text-sm leading-tight mb-1 truncate">
                        {player.name}
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        {nationalityFlag(player.nationality)} {age}y
                      </div>
                      <div className={`text-[10px] font-black px-1.5 py-0.5 rounded-md inline-block mb-1 ${getRatingBg(stats.rating)}`}>
                        {stats.rating} RTG
                      </div>
                      <div className="text-yellow-300 font-black text-base mt-1">€{value}M</div>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            /* DETAIL VIEW */
            <div className="max-w-md mx-auto" style={{ animation: "fadeInUp 0.25s ease-out both" }}>
              <div className={`border-2 rounded-3xl p-6 shadow-2xl ${getCardStyle(selected)}`}>
                <div className="text-center mb-5">
                  <div className="text-4xl mb-2">{nationalityFlag(selected.nationality)}</div>
                  <h3 className="text-3xl font-black text-white leading-tight">{selected.name}</h3>
                  <div className={`inline-block mt-2 text-xs font-black px-2.5 py-1 rounded-xl ${positionBg(selected.position)}`}>
                    {selected.position}
                  </div>
                </div>

                {(() => {
                  const stats = getSeasonStats(selected, season);
                  const value = getCurrentValue(selected, season, marketMultiplier);
                  const age = calculateAge(selected.startAge, selected.availableSeason, season);
                  const warning = getRetirementWarning(age);
                  return (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                          ["Nationality", selected.nationality],
                          ["Age", `${age} years`],
                          ["Height", `${selected.height} cm`],
                          ["League", selected.league],
                        ].map(([label, val]) => (
                          <div key={label} className="bg-black/30 rounded-xl p-2.5">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
                            <div className="text-white font-bold text-xs truncate">{val}</div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-4 bg-black/30 rounded-2xl p-3 text-center">
                        <div>
                          <div className={`font-black text-xl ${getRatingColor(stats.rating)}`}>{stats.rating}</div>
                          <div className="text-[9px] text-gray-500 uppercase">RTG</div>
                        </div>
                        <div>
                          <div className="font-black text-lg text-white">{stats.games}</div>
                          <div className="text-[9px] text-gray-500 uppercase">GM</div>
                        </div>
                        {selected.position === "GK" ? (
                          <div className="col-span-2">
                            <div className="font-black text-lg text-white">{stats.cleanSheets}</div>
                            <div className="text-[9px] text-gray-500 uppercase">Clean Sheets</div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="font-black text-lg text-white">{stats.goals}</div>
                              <div className="text-[9px] text-gray-500 uppercase">G</div>
                            </div>
                            <div>
                              <div className="font-black text-lg text-white">{stats.assists}</div>
                              <div className="text-[9px] text-gray-500 uppercase">A</div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="text-center mb-4">
                        <div className="text-4xl font-black text-yellow-300">€{value}M</div>
                        <div className="text-xs text-gray-500 mt-1">Market Value {season}</div>
                      </div>

                      {warning && (
                        <div className="text-xs text-orange-400 bg-orange-950/40 border border-orange-500/20 rounded-xl px-3 py-2 mb-4 text-center font-bold">
                          {warning}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button onClick={() => setSelected(null)}
                          className="flex-1 py-3 rounded-xl border border-white/20 text-gray-400 hover:text-white hover:border-white/40 font-bold transition-all active:scale-95">
                          ← Change
                        </button>
                        <button onClick={() => onBuy(selected)}
                          className="flex-[2] py-3 rounded-xl btn-primary text-black font-black transition-all active:scale-95 text-base">
                          ✅ Buy for €{value}M
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}