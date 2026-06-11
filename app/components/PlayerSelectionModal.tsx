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

// ── Custom player pixel portraits ──────────────
const PIXEL_PORTRAITS: Record<string, string> = {
  "Yousef Alnuwasser": "/images/yousef-pixel.png",
  "Hussain Alrezk":    "/images/hussain-alrezk.png",
  "ABDULLAH ALMUSAWI": "/images/abdullah-almusawi.png",
  "Ali Alsaif":        "/images/ali-alsaif.png",
  "Abdulaziz Alghariri": "/images/abdulaziz-alghariri.png",
  "Ali Albrahim":        "/images/ali-albrahim.png",
};

function PixelPortrait({ name, size = 56 }: { name: string; size?: number }) {
  const src = PIXEL_PORTRAITS[name];
  if (!src) return null;
  return (
    <div className="flex justify-center mb-3">
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{
          imageRendering: "pixelated",
          objectFit: "contain",
          filter: "drop-shadow(0 0 8px rgba(212,175,55,0.7))",
        }}
      />
    </div>
  );
}

function getCardStyle(player: Player, budget: number, value: number): string {
  const affordable = value <= budget;
  if (player.secret) return "border-yellow-400 shadow-yellow-400/20";
  if (player.hiddenType === "talent") return "border-emerald-400 shadow-emerald-400/20";
  if (player.hiddenType === "trap") return "border-orange-400 shadow-orange-400/15";
  if (!affordable) return "border-red-500/40 shadow-red-500/10";
  return "border-purple-500/60 shadow-purple-500/10";
}

function getCardBg(player: Player, affordable: boolean): string {
  if (!affordable) return "#1a0a0a";
  if (player.secret) return "#1a1500";
  if (player.hiddenType === "talent") return "#0a1a10";
  if (player.hiddenType === "trap") return "#1a1000";
  return "#0d0d1f";
}

export default function PlayerSelectionModal({
  slot, options, activePlayer, season, timer, timerSeconds, marketMultiplier, onBuy, onClose
}: Props) {
  const [selected, setSelected] = useState<Player | null>(null);
  const timerDanger = timerSeconds !== null && timer <= 5;
  const budget = activePlayer.budget;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40 p-4"
      style={{ background: "rgba(0,0,0,0.88)" }}>
      <div className="rounded-none w-full max-w-[98vw] overflow-hidden shadow-2xl"
        style={{ background: "#0a0914", border: "2px solid rgba(168,85,247,0.4)" }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ background: "rgba(168,85,247,0.1)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h2 className="text-2xl font-black text-white">
              Choose <span className={`px-2 py-0.5 rounded-none text-lg ${positionBg(slot)}`}>{slot}</span>
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
              {activePlayer.name} • Budget: <span style={{ color: "#34d399", fontWeight: 700 }}>€{budget}M</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {timerSeconds !== null && (
              <div className="px-4 py-2 rounded-none font-black text-3xl tabular-nums"
                style={{
                  border: timerDanger ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(245,158,11,0.4)",
                  background: timerDanger ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.08)",
                  color: timerDanger ? "#f87171" : "#fbbf24",
                  animation: timerDanger ? "pulse 1s infinite" : "none"
                }}>
                {timer}s
              </div>
            )}
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-none text-sm font-bold transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
              Close
            </button>
          </div>
        </div>

        <div className="p-6">
          {!selected ? (
            // CARDS VIEW
            options.length === 0 ? (
              <div className="text-center py-16" style={{ color: "#6b7280" }}>
                <div className="text-5xl mb-3">😔</div>
                <div>No players available for {slot} in {season}</div>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-5">
                {options.map((player, i) => {
                  const stats = getSeasonStats(player, season);
                  const value = getCurrentValue(player, season, marketMultiplier);
                  const age = calculateAge(player.startAge, player.availableSeason, season);
                  const affordable = value <= budget;

                  return (
                    <button
                      key={i}
                      onClick={() => setSelected(player)}
                      className="rounded-none p-10 text-left transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg relative overflow-hidden"
                      style={{
                        border: `2px solid`,
                        borderColor: affordable ? (player.hiddenType === "talent" ? "#34d399" : player.hiddenType === "trap" ? "#fb923c" : "#7c3aed") : "#991b1b",
                        background: getCardBg(player, affordable),
                        animation: `fadeInUp 0.3s ease-out both`,
                        animationDelay: `${i * 0.07}s`,
                        opacity: affordable ? 1 : 0.75,
                      }}>

                      {/* Affordable badge */}
                      {affordable && (
                        <div className="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-none"
                          style={{ background: "rgba(16,185,129,0.3)", color: "#34d399" }}>
                          ✓ CAN BUY
                        </div>
                      )}
                      {!affordable && (
                        <div className="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-none"
                          style={{ background: "rgba(239,68,68,0.3)", color: "#f87171" }}>
                          TOO COSTLY
                        </div>
                      )}

                      {/* Pixel portrait — custom players */}
                      <PixelPortrait name={player.name} size={56} />

                      {/* Position */}
                      <div className={`text-[10px] font-black px-1.5 py-0.5 rounded-none inline-block mb-2 ${positionBg(player.position)}`}>
                        {player.position}
                      </div>

                      {/* Name */}
                      <div className="font-black text-white text-lg leading-tight mb-2 truncate">{player.name}</div>

                      {/* Flag + Age */}
                      <div className="text-sm mb-2" style={{ color: "#9ca3af" }}>
                        {nationalityFlag(player.nationality)} {age}y
                      </div>

                      {/* League */}
                      <div className="text-xs mb-3 truncate" style={{ color: "#6b7280" }}>{player.league}</div>

                      {/* Rating */}
                      <div className={`text-xs font-black px-2 py-1 rounded-none inline-block mb-2 ${getRatingBg(stats.rating)}`}>
                        {stats.rating} RTG
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-1 mb-3 text-center rounded-none p-2"
                        style={{ background: "rgba(0,0,0,0.3)" }}>
                        {player.position === "GK" ? (
                          <>
                            <div><div className="text-white font-bold text-sm">{stats.games}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>GM</div></div>
                            <div className="col-span-2"><div className="text-white font-bold text-sm">{stats.cleanSheets}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>CS</div></div>
                          </>
                        ) : (
                          <>
                            <div><div className="text-white font-bold text-sm">{stats.games}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>GM</div></div>
                            <div><div className="text-white font-bold text-sm">{stats.goals}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>G</div></div>
                            <div><div className="text-white font-bold text-sm">{stats.assists}</div><div className="text-[10px]" style={{ color: "#6b7280" }}>A</div></div>
                          </>
                        )}
                      </div>

                      {/* Value */}
                      <div className="font-black text-2xl mt-2" style={{ color: affordable ? "#fbbf24" : "#f87171" }}>
                        €{value}M
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            // DETAIL VIEW
            <div className="max-w-md mx-auto" style={{ animation: "fadeInUp 0.25s ease-out both" }}>
              {(() => {
                const stats = getSeasonStats(selected, season);
                const value = getCurrentValue(selected, season, marketMultiplier);
                const age = calculateAge(selected.startAge, selected.availableSeason, season);
                const warning = getRetirementWarning(age);
                const affordable = value <= budget;

                return (
                  <div className="rounded-none p-8 shadow-2xl"
                    style={{
                      border: `2px solid ${affordable ? "#7c3aed" : "#991b1b"}`,
                      background: getCardBg(selected, affordable)
                    }}>

                    <div className="text-center mb-6">
                      <PixelPortrait name={selected.name} size={72} />
                      <div className="text-4xl mb-2">{nationalityFlag(selected.nationality)}</div>
                      <h3 className="text-3xl font-black text-white leading-tight">{selected.name}</h3>
                      <div className={`inline-block mt-2 text-xs font-black px-2.5 py-1 rounded-none ${positionBg(selected.position)}`}>
                        {selected.position}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        ["Nationality", selected.nationality],
                        ["Age", `${age} years`],
                        ["Height", `${selected.height} cm`],
                        ["League", selected.league],
                      ].map(([label, val]) => (
                        <div key={label} className="rounded-none p-2.5" style={{ background: "rgba(0,0,0,0.3)" }}>
                          <div className="text-[10px] uppercase tracking-wider" style={{ color: "#6b7280" }}>{label}</div>
                          <div className="text-white font-bold text-xs truncate">{val}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4 rounded-none p-3 text-center"
                      style={{ background: "rgba(0,0,0,0.3)" }}>
                      <div>
                        <div className={`font-black text-xl ${getRatingColor(stats.rating)}`}>{stats.rating}</div>
                        <div className="text-[9px] uppercase" style={{ color: "#6b7280" }}>RTG</div>
                      </div>
                      <div>
                        <div className="font-black text-lg text-white">{stats.games}</div>
                        <div className="text-[9px] uppercase" style={{ color: "#6b7280" }}>GM</div>
                      </div>
                      {selected.position === "GK" ? (
                        <div className="col-span-2">
                          <div className="font-black text-lg text-white">{stats.cleanSheets}</div>
                          <div className="text-[9px] uppercase" style={{ color: "#6b7280" }}>Clean Sheets</div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="font-black text-lg text-white">{stats.goals}</div>
                            <div className="text-[9px] uppercase" style={{ color: "#6b7280" }}>G</div>
                          </div>
                          <div>
                            <div className="font-black text-lg text-white">{stats.assists}</div>
                            <div className="text-[9px] uppercase" style={{ color: "#6b7280" }}>A</div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-4xl font-black" style={{ color: affordable ? "#fbbf24" : "#f87171" }}>
                        €{value}M
                      </div>
                      <div className="text-xs mt-1" style={{ color: "#6b7280" }}>Market Value {season}</div>
                      {!affordable && (
                        <div className="text-xs mt-2 font-bold" style={{ color: "#f87171" }}>
                          ⚠️ Over budget by €{value - budget}M
                        </div>
                      )}
                    </div>

                    {warning && (
                      <div className="text-sm text-center font-bold px-3 py-2 rounded-none mb-4"
                        style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#fb923c" }}>
                        {warning}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setSelected(null)}
                        className="flex-1 py-3 rounded-none font-bold transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#9ca3af" }}>
                        ← Change
                      </button>
                      <button onClick={() => onBuy(selected)} disabled={!affordable}
                        className="flex-[2] py-3 rounded-none font-black text-base transition-all"
                        style={affordable ? {
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          color: "black",
                          boxShadow: "0 4px 15px rgba(16,185,129,0.3)"
                        } : {
                          background: "rgba(255,255,255,0.05)",
                          color: "#4b5563",
                          cursor: "not-allowed"
                        }}>
                        {affordable ? `✅ Buy for €${value}M` : `❌ Can't Afford`}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
