"use client";

import { useState } from "react";
import type { GamePlayer, OwnedPlayer } from "../game/types";
import { getCurrentValue } from "../game/valueEngine";
import { getSeasonStats } from "../game/statsEngine";
import { positionBg } from "../game/helpers";

import { PIXEL_PORTRAITS } from "../game/playerPortraits";

type Props = {
  gamePlayer: GamePlayer;
  playerIndex: number;
  season: number;
  isActive: boolean;
  pendingSlot: string | null;
  marketMultiplier: number;
  isVersus?: boolean;
  isClubOwner?: boolean;
  onSlotClick: (slot: string) => void;
  onOwnedClick: (playerIndex: number, ownedIndex: number) => void;
  onCompareReady?: (a: OwnedPlayer, b: OwnedPlayer) => void;
};

// ── Card animations per type ─────────────────
function getCardAnimation(owned: OwnedPlayer, isVersus: boolean = false): string {
  if (owned.player.secret) return "cardGoldPulse 2.5s ease-in-out infinite";
  if (!isVersus && owned.player.hiddenType === "talent") return "cardGreenPulse 3s ease-in-out infinite";
  if (!isVersus && owned.player.hiddenType === "trap") return "cardOrangeBlink 4s ease-in-out infinite";
  return "none";
}

function getRatingColor(rating: number): string {
  if (rating >= 88) return "#FFD54F";
  if (rating >= 80) return "#f97316";
  if (rating >= 70) return "#3b82f6";
  return "#ef4444";
}

function getRatingBg(rating: number): string {
  if (rating >= 88) return "rgba(255,213,79,0.15)";
  if (rating >= 80) return "rgba(249,115,22,0.15)";
  if (rating >= 70) return "rgba(59,130,246,0.15)";
  return "rgba(239,68,68,0.15)";
}

function getCardBorder(owned: OwnedPlayer, isVersus: boolean = false): string {
  if (owned.player.secret) return "rgba(212,175,55,0.8)";
  if (!isVersus && owned.player.hiddenType === "talent") return "rgba(52,211,153,0.7)";
  if (!isVersus && owned.player.hiddenType === "trap") return "rgba(251,146,60,0.6)";
  return "rgba(99,102,241,0.5)";
}

function getCardGlow(owned: OwnedPlayer, isVersus: boolean = false): string {
  if (owned.player.secret) return "0 0 20px rgba(212,175,55,0.4)";
  if (!isVersus && owned.player.hiddenType === "talent") return "0 0 16px rgba(52,211,153,0.3)";
  if (!isVersus && owned.player.hiddenType === "trap") return "0 0 16px rgba(251,146,60,0.25)";
  return "0 0 14px rgba(99,102,241,0.2)";
}

function SlotCard({
  slot, owned, ownedIndex, isActive, isPending, playerIndex,
  onSlotClick, onOwnedClick, season, marketMultiplier, isVersus
}: {
  slot: string; owned: OwnedPlayer | undefined; ownedIndex: number;
  isActive: boolean; isPending: boolean; playerIndex: number;
  onSlotClick: (s: string) => void; onOwnedClick: (pi: number, oi: number) => void;
  season: number; marketMultiplier: number; isVersus?: boolean;
}) {
  if (owned) {
    const stats = getSeasonStats(owned.player, season);
    const value = (owned.currentValue && owned.currentValue > 0)
      ? owned.currentValue
      : owned.buyPrice;
    const profit = value - owned.buyPrice;
    const ratingColor = getRatingColor(stats.rating);
    const borderColor = getCardBorder(owned, isVersus);
    const glowColor = getCardGlow(owned, isVersus);
    const portrait = PIXEL_PORTRAITS[owned.player.name];
    const isYousef = owned.player.name === "Yousef Alnuwasser";
    const shortName = isYousef ? "Yousef" : (owned.player.name.split(" ").pop() || owned.player.name);

    return (
      <button
        onClick={() => { if (!isActive) return; onOwnedClick(playerIndex, ownedIndex); }}
        className="w-full h-full flex flex-col items-center justify-between transition-all duration-200 relative overflow-hidden"
        style={{
          background: "rgba(10,12,20,0.75)",
          border: `1.5px solid ${borderColor}`,
          borderRadius: "14px",
          boxShadow: isActive ? glowColor : "0 2px 8px rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "8px 6px 7px",
          cursor: isActive ? "pointer" : "default",
          animation: getCardAnimation(owned, isVersus),
        }}
        onMouseEnter={e => {
          if (!isActive) return;
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = glowColor.replace("0.4", "0.8").replace("0.3", "0.6").replace("0.2", "0.5");
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = glowColor;
        }}
      >
        {/* ── GOAT card animation for Yousef ── */}
        {isYousef && (
          <>
            {/* Floating 🐐 badge above card */}
            <div style={{
              position:"absolute", top:"-10px", right:"4px",
              fontSize:"16px", zIndex:20, lineHeight:1,
              animation:"yousefGoat 2.2s ease-in-out infinite",
              filter:"drop-shadow(0 0 8px rgba(212,175,55,0.95))",
              pointerEvents:"none",
            }}>🐐</div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{borderRadius:"14px",zIndex:0}}>

              {/* Holographic rainbow sweep */}
              <div style={{
                position:"absolute", top:0, left:0, right:0, bottom:0,
                background:"linear-gradient(105deg, transparent 5%, rgba(212,175,55,0.35) 25%, rgba(168,85,247,0.25) 45%, rgba(56,189,248,0.25) 65%, rgba(52,211,153,0.2) 80%, transparent 95%)",
                animation:"yousefSweep 2.2s ease-in-out infinite",
                borderRadius:"14px",
              }} />

              {/* Pulsing top halo */}
              <div style={{
                position:"absolute", top:0, left:0, right:0, height:"45%",
                background:"linear-gradient(180deg, rgba(212,175,55,0.22) 0%, rgba(168,85,247,0.08) 60%, transparent 100%)",
                borderRadius:"14px 14px 0 0",
                animation:"yousefTopGlow 1.8s ease-in-out infinite alternate",
              }} />

              {/* G.O.A.T watermark */}
              <div style={{
                position:"absolute", bottom:"24px", left:0, right:0,
                textAlign:"center",
                fontSize:"7px", fontWeight:900, letterSpacing:"0.35em",
                color:"rgba(212,175,55,0.18)",
                pointerEvents:"none",
              }}>G.O.A.T</div>

              {/* Multi-color sparkle particles */}
              {([
                {c:"#FFD54F", s:"rgba(255,213,79,0.9)",  l:10},
                {c:"#c084fc", s:"rgba(192,132,252,0.9)", l:24},
                {c:"#38bdf8", s:"rgba(56,189,248,0.9)",  l:38},
                {c:"#FFD54F", s:"rgba(255,213,79,0.9)",  l:52},
                {c:"#34d399", s:"rgba(52,211,153,0.9)",  l:66},
                {c:"#f87171", s:"rgba(248,113,113,0.9)", l:80},
              ] as const).map((p,i) => (
                <div key={i} style={{
                  position:"absolute",
                  width: i%2===0 ? "3px" : "2px",
                  height: i%2===0 ? "3px" : "2px",
                  borderRadius:"50%",
                  background: p.c,
                  boxShadow:`0 0 6px ${p.s}`,
                  left:`${p.l}%`,
                  bottom:"4%",
                  animation:`yousefParticle ${1.2+i*0.22}s ease-out ${i*0.14}s infinite`,
                }} />
              ))}
            </div>
          </>
        )}
        {/* Shimmer sweep for other secret cards */}
        {owned.player.secret && owned.player.name !== "Yousef Alnuwasser" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{borderRadius:"14px"}}>
            <div style={{
              position:"absolute", top:0, left:0, right:0, bottom:0,
              background:"linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.25) 50%, transparent 70%)",
              animation:"cardGoldSweep 2.5s ease-in-out infinite",
            }} />
          </div>
        )}
        {!isVersus && owned.player.hiddenType === "talent" && (
          <div className="absolute inset-0 pointer-events-none" style={{borderRadius:"14px",
            background:"linear-gradient(180deg,rgba(52,211,153,0.06) 0%,transparent 60%)",
            animation:"cardGreenGlow 3s ease-in-out infinite"}} />
        )}
        {!isVersus && owned.player.hiddenType === "trap" && (
          <div className="absolute inset-0 pointer-events-none" style={{borderRadius:"14px",
            background:"linear-gradient(180deg,rgba(251,146,60,0.05) 0%,transparent 60%)",
            animation:"cardOrangeGlow 4s ease-in-out infinite"}} />
        )}

        {/* TOP: Position badge */}
        <div className={`text-[9px] font-black px-1.5 py-0.5 ${positionBg(slot)}`}
          style={{ borderRadius: "5px", letterSpacing: "0.05em" }}>
          {slot}
        </div>

        {/* MIDDLE: Portrait or name */}
        <div className="flex flex-col items-center gap-0.5 flex-1 justify-center">
          {portrait ? (
            <img src={portrait} alt={shortName}
              style={{
                width: isYousef ? "28px" : "36px",
                height: isYousef ? "28px" : "36px",
                imageRendering: "pixelated", objectFit: "contain",
                filter: `drop-shadow(0 0 6px ${borderColor})`
              }} />
          ) : null}
          <div className="text-white font-black text-center leading-tight"
            style={{
              fontSize: isYousef ? "11px" : portrait ? "9px" : "11px",
              maxWidth: "100%", overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%",
              textShadow: isYousef ? "0 0 8px rgba(212,175,55,0.9), 0 1px 4px rgba(0,0,0,0.9)" : "0 1px 4px rgba(0,0,0,0.8)",
              color: isYousef ? "#FFD54F" : "#fff",
            }}>
            {shortName}
          </div>
          {owned.activeEffects && owned.activeEffects.length > 0 && (
            <div className="text-[10px]">{owned.activeEffects.map(e => e.emoji).join("")}</div>
          )}
        </div>

        {/* Rating badge */}
        <div className="flex items-center justify-center"
          style={{ background: getRatingBg(stats.rating), borderRadius: "6px",
            padding: "2px 7px", border: `1px solid ${ratingColor}44` }}>
          <span className="font-black text-[11px]" style={{ color: ratingColor }}>{stats.rating}</span>
        </div>

        {/* BOTTOM: Value + profit */}
        <div className="flex items-center justify-center gap-1 w-full" style={{ marginTop: "4px" }}>
          <span className="text-yellow-300 font-bold" style={{ fontSize: "9px" }}>€{+value.toFixed(1)}M</span>
          <span className={`font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}
            style={{ fontSize: "9px" }}>
            {profit >= 0 ? "+" : ""}{+profit.toFixed(1)}M
          </span>
        </div>

        {/* Contract warning badge */}
        {owned.contract && (owned.contract.endSeason - season) <= 2 && (
          <div style={{
            position: "absolute", top: "4px", left: "4px",
            background: (owned.contract.endSeason - season) <= 1 ? "rgba(239,68,68,0.9)" : "rgba(245,158,11,0.85)",
            borderRadius: "4px", padding: "1px 4px",
            fontSize: "7px", fontWeight: 900, color: "white",
            letterSpacing: "0.05em", zIndex: 10,
            boxShadow: (owned.contract.endSeason - season) <= 1 ? "0 0 6px rgba(239,68,68,0.6)" : "0 0 6px rgba(245,158,11,0.5)",
          }}>
            {(owned.contract.endSeason - season) <= 1 ? "⚠️ آخر موسم" : "📋 موسم"}
          </div>
        )}
      </button>
    );
  }

  // Empty slot
  return (
    <button
      onClick={() => { if (!isActive) return; onSlotClick(slot); }}
      className="w-full h-full flex flex-col items-center justify-center transition-all duration-200"
      style={{
        background: isPending ? "rgba(234,179,8,0.08)" : "rgba(255,255,255,0.03)",
        border: isPending
          ? "1.5px solid rgba(234,179,8,0.5)"
          : isActive
          ? "1.5px dashed rgba(255,255,255,0.12)"
          : "1.5px dashed rgba(255,255,255,0.06)",
        borderRadius: "14px",
        backdropFilter: "blur(4px)",
        cursor: isActive ? "pointer" : "default",
        boxShadow: isPending ? "0 0 12px rgba(234,179,8,0.15)" : "none",
      }}
      onMouseEnter={e => {
        if (!isActive || isPending) return;
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(52,211,153,0.4)";
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(52,211,153,0.06)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
      }}
    >
      <div className={`text-[9px] font-black px-1.5 py-0.5 mb-1 ${positionBg(slot)}`}
        style={{ borderRadius: "5px" }}>
        {slot}
      </div>
      {isPending
        ? <span className="text-yellow-400 text-xl animate-pulse">⋯</span>
        : isActive
        ? <span className="text-white/20 text-2xl font-black">+</span>
        : null}
    </button>
  );
}

// ── Keyframes injected globally ─────────────
if (typeof document !== "undefined") {
  const styleId = "formation-card-animations";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes yousefSweep {
        0%   { transform: translateX(-160%); opacity:0; }
        25%  { opacity:1; }
        75%  { opacity:1; }
        100% { transform: translateX(160%); opacity:0; }
      }
      @keyframes yousefTopGlow {
        0%   { opacity:0.35; }
        100% { opacity:1; }
      }
      @keyframes yousefParticle {
        0%   { transform:translateY(0) scale(1);   opacity:0.9; }
        100% { transform:translateY(-75px) scale(0.2); opacity:0; }
      }
      @keyframes yousefGoat {
        0%,100% { transform: translateY(0) rotate(-8deg) scale(1);    filter: drop-shadow(0 0 6px rgba(212,175,55,0.8));  }
        50%     { transform: translateY(-5px) rotate(8deg) scale(1.2); filter: drop-shadow(0 0 14px rgba(212,175,55,1)); }
      }
      @keyframes cardGoldPulse {
        0%,100% { box-shadow: 0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.2), 0 2px 8px rgba(0,0,0,0.6); }
        50%      { box-shadow: 0 0 35px rgba(212,175,55,0.8), 0 0 70px rgba(212,175,55,0.35), 0 0 100px rgba(255,213,79,0.15); }
      }
      @keyframes cardGoldSweep {
        0%   { transform: translateX(-150%); }
        50%  { transform: translateX(150%); }
        100% { transform: translateX(150%); }
      }
      @keyframes cardGreenPulse {
        0%,100% { box-shadow: 0 0 10px rgba(52,211,153,0.2); border-color: rgba(52,211,153,0.6); }
        50%      { box-shadow: 0 0 20px rgba(52,211,153,0.45); border-color: rgba(52,211,153,0.9); }
      }
      @keyframes cardGreenGlow {
        0%,100% { opacity: 0.5; }
        50%      { opacity: 1; }
      }
      @keyframes cardOrangeBlink {
        0%,100% { box-shadow: 0 0 8px rgba(251,146,60,0.15); border-color: rgba(251,146,60,0.5); }
        50%      { box-shadow: 0 0 16px rgba(251,146,60,0.35); border-color: rgba(251,146,60,0.8); }
      }
      @keyframes cardOrangeGlow {
        0%,100% { opacity: 0.4; }
        50%      { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

export default function Formation({ gamePlayer, playerIndex, season, isActive, pendingSlot, marketMultiplier, isVersus, isClubOwner, onSlotClick, onOwnedClick, onCompareReady }: Props) {
  const isFrozen = gamePlayer.frozenSeason === season;
  const [filterPos, setFilterPos] = useState<string>("ALL");
  const [compareMode, setCompareMode] = useState(false);
  const [compareSlots, setCompareSlots] = useState<string[]>([]);

  const ALL_SLOTS = ["LW","ST","RW","CAM","LCM","RCM","LB","LCB","RCB","RB","GK"];

  const owned = (slot: string) => gamePlayer.owned.find(o => o.slot === slot);
  const ownedIdx = (slot: string) => gamePlayer.owned.findIndex(o => o.slot === slot);

  // Contract warnings count
  const contractWarnings = gamePlayer.owned.filter(o =>
    o.contract && (o.contract.endSeason - season) <= 2
  ).length;

  function handleCompareClick(slot: string) {
    const o = owned(slot);
    if (!o) return;
    const next = compareSlots.includes(slot)
      ? compareSlots.filter(s => s !== slot)
      : [...compareSlots, slot].slice(-2);
    setCompareSlots(next);
    if (next.length === 2) {
      const a = owned(next[0]);
      const b = owned(next[1]);
      if (a && b && onCompareReady) {
        onCompareReady(a, b);
        setCompareMode(false);
        setCompareSlots([]);
      }
    }
  }

  function card(slot: string) {
    const o = owned(slot);
    const oIdx = ownedIdx(slot);
    const posMatch = filterPos === "ALL" || !o || o.player.position === filterPos ||
      (filterPos === "ATT" && ["ST","LW","RW","SS","CF"].includes(o.player.position)) ||
      (filterPos === "MID" && ["CM","CAM","CDM","LM","RM"].includes(o.player.position)) ||
      (filterPos === "DEF" && ["CB","LB","RB","LWB","RWB"].includes(o.player.position)) ||
      (filterPos === "GK" && o.player.position === "GK");

    const dimmed = filterPos !== "ALL" && o && !posMatch;
    const isCompareSelected = compareSlots.includes(slot);

    return (
      <div key={slot} style={{ opacity: dimmed ? 0.3 : 1, transition: "opacity 0.2s", position: "relative" }}>
        {compareMode && o && (
          <div
            onClick={() => handleCompareClick(slot)}
            style={{
              position: "absolute", inset: 0, zIndex: 20, borderRadius: "14px",
              background: isCompareSelected ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.08)",
              border: `2px solid ${isCompareSelected ? "#6366f1" : "rgba(99,102,241,0.4)"}`,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isCompareSelected ? "0 0 16px rgba(99,102,241,0.5)" : "none",
            }}>
            {isCompareSelected && <span style={{ fontSize: "20px" }}>✓</span>}
          </div>
        )}
        <SlotCard
          slot={slot}
          owned={o} ownedIndex={oIdx}
          isActive={isActive && !compareMode} isPending={pendingSlot === slot}
          playerIndex={playerIndex}
          onSlotClick={onSlotClick} onOwnedClick={onOwnedClick}
          season={season} marketMultiplier={marketMultiplier}
          isVersus={isVersus}
        />
      </div>
    );
  }

  const CARD_H = "h-[118px]";

  return (
    <div className={`relative overflow-hidden transition-all duration-300`}
      style={{
        borderRadius: "16px",
        border: isActive ? "1.5px solid rgba(52,211,153,0.5)" : "1.5px solid rgba(255,255,255,0.08)",
        boxShadow: isActive ? "0 0 30px rgba(52,211,153,0.08)" : "none",
        opacity: isActive ? 1 : 0.82,
      }}>

      {/* Pitch background */}
      <div className="absolute inset-0 pitch-bg pointer-events-none">
        <div className="absolute inset-3 border border-white/5" style={{ borderRadius: "8px" }} />
        <div className="absolute top-1/2 left-3 right-3 h-px bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/5" />
        <div className="absolute top-3 left-[28%] right-[28%] h-7 border-b border-l border-r border-white/5" />
        <div className="absolute bottom-3 left-[28%] right-[28%] h-7 border-t border-l border-r border-white/5" />
      </div>

      {/* ── Filter & Compare toolbar ── */}
      {isActive && !isVersus && (
        <div className="relative z-20 flex items-center justify-between gap-2 px-3 pt-2.5 pb-1">
          {/* Position filters */}
          <div className="flex gap-1">
            {(["ALL","GK","DEF","MID","ATT"] as const).map(pos => (
              <button key={pos} onClick={() => setFilterPos(pos)}
                style={{
                  fontSize: "9px", fontWeight: 800, padding: "3px 7px", borderRadius: "5px", cursor: "pointer",
                  background: filterPos === pos ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.06)",
                  border: filterPos === pos ? "1px solid rgba(52,211,153,0.7)" : "1px solid rgba(255,255,255,0.1)",
                  color: filterPos === pos ? "#34d399" : "#6b7280",
                  transition: "all 0.15s",
                }}>
                {pos}
              </button>
            ))}
          </div>
          {/* Right: contract warnings + compare button */}
          <div className="flex items-center gap-2">
            {contractWarnings > 0 && !compareMode && (
              <div style={{
                fontSize: "9px", fontWeight: 800, padding: "3px 7px", borderRadius: "5px",
                background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
                color: "#f87171", letterSpacing: "0.05em",
              }}>
                ⚠️ {contractWarnings} عقود
              </div>
            )}
            {!compareMode ? (
              <button onClick={() => { setCompareMode(true); setCompareSlots([]); }}
                style={{
                  fontSize: "9px", fontWeight: 800, padding: "3px 7px", borderRadius: "5px", cursor: "pointer",
                  background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)",
                  color: "#a5b4fc", transition: "all 0.15s",
                }}>
                ⚖️ قارن
              </button>
            ) : (
              <button onClick={() => { setCompareMode(false); setCompareSlots([]); }}
                style={{
                  fontSize: "9px", fontWeight: 800, padding: "3px 7px", borderRadius: "5px", cursor: "pointer",
                  background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
                  color: "#f87171",
                }}>
                ✕ إلغاء المقارنة
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 p-3 flex flex-col gap-2">

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2"
          style={{
            background: isActive ? "rgba(52,211,153,0.08)" : "rgba(0,0,0,0.4)",
            border: isActive ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(255,255,255,0.07)",
            borderRadius: "10px",
          }}>
          <div>
            <div className="font-black text-white text-sm">{gamePlayer.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-emerald-400 font-bold">€{gamePlayer.budget}M</span>
              <span className="text-white/20 text-xs">•</span>
              {isClubOwner ? (
                <span className="text-xs text-yellow-400 font-bold">🎟 ∞</span>
              ) : (
                <span className="text-xs text-yellow-400 font-bold">🎟 {gamePlayer.purchaseChances}</span>
              )}
              {isFrozen && <span className="text-xs text-blue-400 font-bold">🧊 Frozen</span>}
            </div>
          </div>
          {isActive && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active</span>
            </div>
          )}
        </div>

        {/* Row 1: LW ST RW */}
        <div className={`grid grid-cols-3 gap-2 ${CARD_H}`}>
          {card("LW")}{card("ST")}{card("RW")}
        </div>

        {/* Row 2: CAM */}
        <div className={`grid grid-cols-3 gap-2 ${CARD_H}`}>
          <div />{card("CAM")}<div />
        </div>

        {/* Row 3: LCM RCM */}
        <div className={`grid grid-cols-3 gap-2 ${CARD_H}`}>
          {card("LCM")}<div />{card("RCM")}
        </div>

        {/* Row 4: LB LCB RCB RB */}
        <div className={`grid grid-cols-4 gap-2 ${CARD_H}`}>
          {card("LB")}{card("LCB")}{card("RCB")}{card("RB")}
        </div>

        {/* Row 5: GK */}
        <div className={`grid grid-cols-3 gap-2 ${CARD_H}`}>
          <div />{card("GK")}<div />
        </div>

      </div>

    </div>
  );
}
