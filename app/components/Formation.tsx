"use client";

import type { GamePlayer, OwnedPlayer } from "../game/types";
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

// Each row: [leftPad%, slot, rightPad%] — controls centering on pitch
// Uses CSS grid with named areas per row for exact positioning
const ROWS: { slots: string[]; cols: string }[] = [
  { slots: ["LW", "ST", "RW"],     cols: "1fr 1fr 1fr" },
  { slots: ["CAM"],                cols: "1fr 1fr 1fr" },   // CAM centered
  { slots: ["LCM", "RCM"],         cols: "1fr 1fr 1fr" },   // LCM left, gap, RCM right
  { slots: ["LB", "LCB", "RCB", "RB"], cols: "1fr 1fr 1fr 1fr" },
  { slots: ["GK"],                 cols: "1fr 1fr 1fr" },   // GK centered
];

function getCardGlow(owned: OwnedPlayer): string {
  if (owned.player.secret) return "border-yellow-400 bg-yellow-950/60";
  if (owned.player.hiddenType === "talent") return "border-emerald-400 bg-emerald-950/60";
  if (owned.player.hiddenType === "trap") return "border-orange-400 bg-orange-950/50";
  return "border-blue-400/70 bg-blue-950/50";
}

function getRatingBg(rating: number): string {
  if (rating >= 88) return "bg-yellow-500 text-black";
  if (rating >= 80) return "bg-emerald-500 text-black";
  if (rating >= 70) return "bg-blue-500 text-white";
  return "bg-orange-500 text-white";
}

function SlotCard({
  slot, owned, ownedIndex, isActive, isPending, playerIndex, onSlotClick, onOwnedClick, season, marketMultiplier
}: {
  slot: string;
  owned: OwnedPlayer | undefined;
  ownedIndex: number;
  isActive: boolean;
  isPending: boolean;
  playerIndex: number;
  onSlotClick: (s: string) => void;
  onOwnedClick: (pi: number, oi: number) => void;
  season: number;
  marketMultiplier: number;
}) {
  if (owned) {
    const stats = getSeasonStats(owned.player, season);
    const value = getCurrentValue(owned.player, season, marketMultiplier);
    const profit = value - owned.buyPrice;
    return (
      <button
        onClick={() => { if (!isActive) return; onOwnedClick(playerIndex, ownedIndex); }}
        className={`border-2 rounded-none w-full text-left p-2 transition-all duration-150 active:scale-95 ${getCardGlow(owned)} ${
          isActive ? "hover:brightness-125 cursor-pointer" : "cursor-default"
        }`}
        style={{ minHeight: "80px" }}
      >
        <div className={`text-[10px] font-black px-1 rounded-none inline-block mb-0.5 ${positionBg(slot)}`}>{slot}</div>
        <div className="text-xs font-black text-white truncate">{owned.player.name.split(" ").pop()}</div>
        <div className={`text-[10px] font-black px-1 rounded-none inline-block mt-0.5 ${getRatingBg(stats.rating)}`}>{stats.rating}</div>
        <div className="text-[10px] text-yellow-300 font-bold mt-0.5">€{value}M</div>
        <div className={`text-[10px] font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {profit >= 0 ? "↑" : "↓"}{Math.abs(profit)}M
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => { if (!isActive) return; onSlotClick(slot); }}
      className={`border-2 rounded-none w-full flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
        isPending
          ? "border-yellow-500/80 bg-yellow-900/40"
          : isActive
          ? "border-white/15 bg-white/5 hover:border-emerald-500/60 hover:bg-emerald-900/20 cursor-pointer"
          : "border-white/5 bg-white/3 cursor-default"
      }`}
      style={{ minHeight: "80px" }}
    >
      <div className={`text-[10px] font-black px-1 rounded-none inline-block mb-1 ${positionBg(slot)}`}>{slot}</div>
      {isPending
        ? <span className="text-yellow-400 text-lg animate-pulse">⋯</span>
        : isActive
        ? <span className="text-white/30 text-2xl font-black">+</span>
        : null}
    </button>
  );
}

export default function Formation({ gamePlayer, playerIndex, season, isActive, pendingSlot, marketMultiplier, onSlotClick, onOwnedClick }: Props) {
  const isFrozen = gamePlayer.frozenSeason === season;

  function getOwnedBySlot(slot: string): OwnedPlayer | undefined {
    return gamePlayer.owned.find((item) => item.slot === slot);
  }

  function getOwnedIndexBySlot(slot: string): number {
    return gamePlayer.owned.findIndex((item) => item.slot === slot);
  }

  function renderRow(row: typeof ROWS[0], rowIndex: number) {
    const { slots, cols } = row;
    const isCentered = slots.length === 1; // CAM, GK
    const isLCMRCM = slots.length === 2;

    if (isCentered) {
      // Single slot — center it in a 3-col grid
      return (
        <div key={rowIndex} className="grid gap-1.5" style={{ gridTemplateColumns: cols }}>
          <div />
          <SlotCard
            slot={slots[0]}
            owned={getOwnedBySlot(slots[0])}
            ownedIndex={getOwnedIndexBySlot(slots[0])}
            isActive={isActive}
            isPending={pendingSlot === slots[0]}
            playerIndex={playerIndex}
            onSlotClick={onSlotClick}
            onOwnedClick={onOwnedClick}
            season={season}
            marketMultiplier={marketMultiplier}
          />
          <div />
        </div>
      );
    }

    if (isLCMRCM) {
      // Two slots — left and right with gap in middle
      return (
        <div key={rowIndex} className="grid gap-1.5" style={{ gridTemplateColumns: cols }}>
          <SlotCard
            slot={slots[0]}
            owned={getOwnedBySlot(slots[0])}
            ownedIndex={getOwnedIndexBySlot(slots[0])}
            isActive={isActive}
            isPending={pendingSlot === slots[0]}
            playerIndex={playerIndex}
            onSlotClick={onSlotClick}
            onOwnedClick={onOwnedClick}
            season={season}
            marketMultiplier={marketMultiplier}
          />
          <div />
          <SlotCard
            slot={slots[1]}
            owned={getOwnedBySlot(slots[1])}
            ownedIndex={getOwnedIndexBySlot(slots[1])}
            isActive={isActive}
            isPending={pendingSlot === slots[1]}
            playerIndex={playerIndex}
            onSlotClick={onSlotClick}
            onOwnedClick={onOwnedClick}
            season={season}
            marketMultiplier={marketMultiplier}
          />
        </div>
      );
    }

    // Normal rows (3 or 4 slots)
    return (
      <div key={rowIndex} className="grid gap-1.5" style={{ gridTemplateColumns: cols }}>
        {slots.map((slot) => (
          <SlotCard
            key={slot}
            slot={slot}
            owned={getOwnedBySlot(slot)}
            ownedIndex={getOwnedIndexBySlot(slot)}
            isActive={isActive}
            isPending={pendingSlot === slot}
            playerIndex={playerIndex}
            onSlotClick={onSlotClick}
            onOwnedClick={onOwnedClick}
            season={season}
            marketMultiplier={marketMultiplier}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`relative rounded-none overflow-hidden border-2 transition-all duration-300 ${
      isActive ? "border-emerald-500/60 shadow-2xl shadow-emerald-500/10" : "border-white/8 opacity-70"
    }`}>
      {/* Pitch background */}
      <div className="absolute inset-0 pitch-bg">
        <div className="absolute inset-2 border border-white/8" />
        <div className="absolute top-1/2 left-2 right-2 h-px bg-white/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/8" />
        <div className="absolute top-2 left-1/4 right-1/4 h-4 border-b border-l border-r border-white/8" />
        <div className="absolute bottom-2 left-1/4 right-1/4 h-4 border-t border-l border-r border-white/8" />
      </div>

      <div className="relative z-10 p-2 flex flex-col gap-1.5">
        {/* Team header */}
        <div className={`flex items-center justify-between px-2 py-1.5 rounded-none backdrop-blur-sm ${
          isActive ? "bg-emerald-900/40 border border-emerald-500/30" : "bg-black/40 border border-white/8"
        }`}>
          <div>
            <div className="font-black text-white text-xs">{gamePlayer.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-emerald-400 font-bold">€{gamePlayer.budget}M</span>
              <span className="text-gray-600 text-[10px]">•</span>
              <span className="text-[10px] text-yellow-400">🎟 {gamePlayer.purchaseChances}</span>
              {isFrozen && <span className="text-[10px] text-blue-400 font-bold">🧊</span>}
            </div>
          </div>
          {isActive && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Active</span>
            </div>
          )}
        </div>

        {/* Formation rows */}
        {ROWS.map((row, rowIndex) => renderRow(row, rowIndex))}
      </div>
    </div>
  );
}