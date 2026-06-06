"use client";

import type { GamePlayer, OwnedPlayer } from "../game/types";
import { FORMATION_433 } from "../game/constants";
import { getCurrentValue } from "../game/valueEngine";
import { getSeasonStats } from "../game/statsEngine";
import { positionBg } from "../game/helpers";

type Props = {
  gamePlayer: GamePlayer;
  playerIndex: number;
  season: number;
  isActive: boolean;
  pendingSlot: string | null;
  marketMultiplier: number;
  onSlotClick: (slot: string) => void;
  onOwnedClick: (playerIndex: number, ownedIndex: number) => void;
};

function getCardGlow(owned: OwnedPlayer): string {
  if (owned.player.secret) return "border-yellow-400 bg-yellow-950/60 shadow-yellow-400/20";
  if (owned.player.hiddenType === "talent") return "border-emerald-400 bg-emerald-950/60 shadow-emerald-400/20";
  if (owned.player.hiddenType === "trap") return "border-orange-400 bg-orange-950/50 shadow-orange-400/15";
  return "border-blue-400/70 bg-blue-950/50 shadow-blue-400/10";
}

function getRatingBg(rating: number): string {
  if (rating >= 88) return "bg-yellow-500 text-black";
  if (rating >= 80) return "bg-emerald-500 text-black";
  if (rating >= 70) return "bg-blue-500 text-white";
  return "bg-orange-500 text-white";
}

export default function Formation({ gamePlayer, playerIndex, season, isActive, pendingSlot, marketMultiplier, onSlotClick, onOwnedClick }: Props) {
  const isFrozen = gamePlayer.frozenSeason === season;

  function getOwnedBySlot(slot: string): OwnedPlayer | undefined {
    return gamePlayer.owned.find((item) => item.slot === slot);
  }

  function getOwnedIndexBySlot(slot: string): number {
    return gamePlayer.owned.findIndex((item) => item.slot === slot);
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
      isActive ? "border-emerald-500/60 shadow-2xl shadow-emerald-500/10" : "border-white/8 opacity-70"
    }`}>

      {/* Pitch background */}
      <div className="absolute inset-0 pitch-bg">
        {/* Pitch lines */}
        <div className="absolute inset-3 border border-white/8 rounded-xl" />
        <div className="absolute top-1/2 left-3 right-3 h-px bg-white/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/8" />
        <div className="absolute top-3 left-1/4 right-1/4 h-6 border-b border-l border-r border-white/8 rounded-b-lg" />
        <div className="absolute bottom-3 left-1/4 right-1/4 h-6 border-t border-l border-r border-white/8 rounded-t-lg" />
      </div>

      <div className="relative z-10 p-3">

        {/* Team header */}
        <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-xl backdrop-blur-sm ${
          isActive ? "bg-emerald-900/40 border border-emerald-500/30" : "bg-black/40 border border-white/8"
        }`}>
          <div>
            <div className="font-black text-white text-sm">{gamePlayer.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-emerald-400 font-bold">€{gamePlayer.budget}M</span>
              <span className="text-gray-600 text-xs">•</span>
              <span className="text-xs text-yellow-400">🎟 {gamePlayer.purchaseChances}</span>
              {isFrozen && <span className="text-xs text-blue-400 font-bold">🧊 Frozen</span>}
            </div>
          </div>
          {isActive && (
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Active</span>
            </div>
          )}
        </div>

        {/* Formation grid */}
        <div className="grid grid-cols-5 gap-2" style={{minHeight: "420px"}}>
          {FORMATION_433.flat().map((slot, index) => {
            if (!slot) return <div key={index} className="h-[120px]" style={{}} />;

            const owned = getOwnedBySlot(slot);
            const ownedIndex = getOwnedIndexBySlot(slot);
            const isPending = pendingSlot === slot;

            if (owned) {
              const stats = getSeasonStats(owned.player, season);
              const value = getCurrentValue(owned.player, season, marketMultiplier);
              const profit = value - owned.buyPrice;

              return (
                <button
                  key={index}
                  onClick={() => { if (!isActive) return; onOwnedClick(playerIndex, ownedIndex); }}
                  className={`border-2 rounded-2xl p-1.5 h-[120px] transition-all duration-150 active:scale-95 shadow-lg ${getCardGlow(owned)} ${
                    isActive ? "hover:brightness-125 hover:scale-105 cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className={`text-[10px] font-black mb-1 inline-block px-1 rounded-md ${positionBg(slot)}`}>
                    {slot}
                  </div>
                  <div className="text-xs font-black text-white leading-tight truncate">
                    {owned.player.name.split(" ").pop()}
                  </div>
                  <div className={`text-[10px] font-black px-1.5 rounded mt-0.5 inline-block ${getRatingBg(stats.rating)}`}>
                    {stats.rating}
                  </div>
                  <div className="text-[10px] text-yellow-300 font-bold mt-1">€{value}M</div>
                  <div className={`text-[10px] font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {profit >= 0 ? "↑" : "↓"}{Math.abs(profit)}M
                  </div>
                </button>
              );
            }

            return (
              <button
                key={index}
                onClick={() => { if (!isActive) return; onSlotClick(slot); }}
                className={`border-2 rounded-2xl p-1.5 h-[120px] transition-all duration-200 active:scale-95 ${
                  isPending
                    ? "border-yellow-500/80 bg-yellow-900/40 shadow-lg shadow-yellow-500/20"
                    : isActive
                    ? "border-white/15 bg-white/5 hover:border-emerald-500/60 hover:bg-emerald-900/20 hover:scale-105 cursor-pointer"
                    : "border-white/5 bg-white/3 cursor-default"
                }`}
              >
                <div className={`text-[9px] font-black mb-1 inline-block px-1 rounded-md ${positionBg(slot)}`}>
                  {slot}
                </div>
                <div className="text-center mt-2">
                  {isPending
                    ? <span className="text-yellow-400 text-lg animate-pulse">⋯</span>
                    : isActive
                    ? <span className="text-white/20 text-xl font-black">+</span>
                    : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}