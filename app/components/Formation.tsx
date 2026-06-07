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

function getCardGlow(owned: OwnedPlayer): string {
  if (owned.player.secret) return "border-yellow-400 bg-yellow-950/70 shadow-yellow-400/30";
  if (owned.player.hiddenType === "talent") return "border-emerald-400 bg-emerald-950/70 shadow-emerald-400/30";
  if (owned.player.hiddenType === "trap") return "border-orange-400 bg-orange-950/60 shadow-orange-400/20";
  return "border-blue-400/80 bg-blue-950/60 shadow-blue-400/20";
}

function getRatingBg(rating: number): string {
  if (rating >= 88) return "bg-yellow-500 text-black";
  if (rating >= 80) return "bg-emerald-500 text-black";
  if (rating >= 70) return "bg-blue-500 text-white";
  return "bg-orange-500 text-white";
}

function SlotCard({
  slot, owned, ownedIndex, isActive, isPending, playerIndex,
  onSlotClick, onOwnedClick, season, marketMultiplier
}: {
  slot: string; owned: OwnedPlayer | undefined; ownedIndex: number;
  isActive: boolean; isPending: boolean; playerIndex: number;
  onSlotClick: (s: string) => void; onOwnedClick: (pi: number, oi: number) => void;
  season: number; marketMultiplier: number;
}) {
  if (owned) {
    const stats = getSeasonStats(owned.player, season);
    const value = getCurrentValue(owned.player, season, marketMultiplier);
    const profit = value - owned.buyPrice;
    return (
      <button
        onClick={() => { if (!isActive) return; onOwnedClick(playerIndex, ownedIndex); }}
        className={`border-2 rounded-none w-full h-full text-left p-3 flex flex-col transition-all duration-150 shadow-lg ${getCardGlow(owned)} ${
          isActive ? "hover:brightness-125 hover:scale-[1.02] cursor-pointer" : "cursor-default"
        }`}
      >
        <div className={`text-xs font-black px-1.5 py-0.5 rounded-none inline-block mb-2 ${positionBg(slot)}`}>{slot}</div>
        <div className="text-sm font-black text-white leading-tight truncate mb-1">{owned.player.name.split(" ").pop()}</div>
        <div className={`text-xs font-black px-1.5 py-0.5 rounded-none inline-block mb-2 ${getRatingBg(stats.rating)}`}>{stats.rating}</div>
        <div className="mt-auto">
          <div className="text-xs text-yellow-300 font-bold">€{value}M</div>
          <div className={`text-xs font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {profit >= 0 ? "↑" : "↓"}{Math.abs(profit)}M
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => { if (!isActive) return; onSlotClick(slot); }}
      className={`border-2 rounded-none w-full h-full flex flex-col items-center justify-center transition-all duration-200 ${
        isPending
          ? "border-yellow-500 bg-yellow-900/40 shadow-lg shadow-yellow-500/20"
          : isActive
          ? "border-white/20 bg-white/5 hover:border-emerald-400/60 hover:bg-emerald-900/20 cursor-pointer"
          : "border-white/8 bg-white/3 cursor-default"
      }`}
    >
      <div className={`text-xs font-black px-1.5 py-0.5 rounded-none inline-block mb-2 ${positionBg(slot)}`}>{slot}</div>
      {isPending
        ? <span className="text-yellow-400 text-2xl animate-pulse">⋯</span>
        : isActive
        ? <span className="text-white/25 text-3xl font-black">+</span>
        : null}
    </button>
  );
}

export default function Formation({ gamePlayer, playerIndex, season, isActive, pendingSlot, marketMultiplier, onSlotClick, onOwnedClick }: Props) {
  const isFrozen = gamePlayer.frozenSeason === season;

  const owned = (slot: string) => gamePlayer.owned.find(o => o.slot === slot);
  const ownedIdx = (slot: string) => gamePlayer.owned.findIndex(o => o.slot === slot);

  function card(slot: string) {
    return (
      <SlotCard
        key={slot} slot={slot}
        owned={owned(slot)} ownedIndex={ownedIdx(slot)}
        isActive={isActive} isPending={pendingSlot === slot}
        playerIndex={playerIndex}
        onSlotClick={onSlotClick} onOwnedClick={onOwnedClick}
        season={season} marketMultiplier={marketMultiplier}
      />
    );
  }

  // Card height for each row — makes all rows same total height
  const CARD_H = "h-[120px]";

  return (
    <div className={`relative rounded-none overflow-hidden border-2 transition-all duration-300 ${
      isActive ? "border-emerald-500/60 shadow-2xl shadow-emerald-500/10" : "border-white/10 opacity-80"
    }`}>

      {/* Pitch background */}
      <div className="absolute inset-0 pitch-bg pointer-events-none">
        <div className="absolute inset-3 border border-white/8" />
        <div className="absolute top-1/2 left-3 right-3 h-px bg-white/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/8" />
        <div className="absolute top-3 left-[28%] right-[28%] h-8 border-b border-l border-r border-white/8" />
        <div className="absolute bottom-3 left-[28%] right-[28%] h-8 border-t border-l border-r border-white/8" />
      </div>

      <div className="relative z-10 p-3 flex flex-col gap-2">

        {/* Header */}
        <div className={`flex items-center justify-between px-3 py-2 rounded-none ${
          isActive ? "bg-emerald-900/50 border border-emerald-500/40" : "bg-black/50 border border-white/10"
        }`}>
          <div>
            <div className="font-black text-white text-sm">{gamePlayer.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-emerald-400 font-bold">€{gamePlayer.budget}M</span>
              <span className="text-white/20 text-xs">•</span>
              <span className="text-xs text-yellow-400 font-bold">🎟 {gamePlayer.purchaseChances}</span>
              {isFrozen && <span className="text-xs text-blue-400 font-bold">🧊 Frozen</span>}
            </div>
          </div>
          {isActive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/60" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active</span>
            </div>
          )}
        </div>

        {/* Row 1: LW · ST · RW */}
        <div className={`grid grid-cols-3 gap-2 ${CARD_H}`}>
          {card("LW")}{card("ST")}{card("RW")}
        </div>

        {/* Row 2: CAM (centered) */}
        <div className={`grid grid-cols-3 gap-2 ${CARD_H}`}>
          <div />{card("CAM")}<div />
        </div>

        {/* Row 3: LCM · gap · RCM */}
        <div className={`grid grid-cols-3 gap-2 ${CARD_H}`}>
          {card("LCM")}<div />{card("RCM")}
        </div>

        {/* Row 4: LB · LCB · RCB · RB */}
        <div className={`grid grid-cols-4 gap-2 ${CARD_H}`}>
          {card("LB")}{card("LCB")}{card("RCB")}{card("RB")}
        </div>

        {/* Row 5: GK (centered) */}
        <div className={`grid grid-cols-3 gap-2 ${CARD_H}`}>
          <div />{card("GK")}<div />
        </div>

      </div>
    </div>
  );
}