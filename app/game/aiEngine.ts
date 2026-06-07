// ============================================
// FOOTBALL INVESTOR — AI ENGINE
// Scout   → Easy   — يختار عشوائي
// Manager → Medium — يفضل السعر المتوسط
// Director→ Hard   — يحسب أفضل استثمار
// ============================================

import type { Player, GamePlayer, OwnedPlayer } from "./types";
import { getCurrentValue } from "./valueEngine";
import { getSeasonStats } from "./statsEngine";

export type AIDifficulty = "scout" | "manager" | "director";

export type AIDecision = {
  player: Player;
  slot: string;
  reason: string;
};

// ── Helper: slots not yet filled ───────────
export function getEmptySlots(owned: OwnedPlayer[]): string[] {
  const ALL_SLOTS = ["LW","ST","RW","CAM","LCM","RCM","LB","LCB","RCB","RB","GK"];
  const filled = new Set(owned.map(o => o.slot));
  return ALL_SLOTS.filter(s => !filled.has(s));
}

// ── Helper: players affordable ─────────────
function affordable(players: Player[], budget: number, season: number): Player[] {
  return players.filter(p => getCurrentValue(p, season) <= budget);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================
// SCOUT — Easy
// يختار عشوائي من اللاعبين المتاحين
// ============================================
function scoutDecide(
  players: Player[],
  gp: GamePlayer,
  season: number,
  slot: string
): Player | null {
  const pool = affordable(
    players.filter(p => p.position === slot),
    gp.budget,
    season
  );
  if (pool.length === 0) return null;
  return pickRandom(pool);
}

// ============================================
// MANAGER — Medium
// يفضل اللاعبين بسعر 30-70% من الميزانية
// ويتجنب الأغلى والأرخص
// ============================================
function managerDecide(
  players: Player[],
  gp: GamePlayer,
  season: number,
  slot: string
): Player | null {
  const pool = affordable(
    players.filter(p => p.position === slot),
    gp.budget,
    season
  );
  if (pool.length === 0) return null;

  // فضّل النطاق 30-70% من الميزانية
  const sweet = pool.filter(p => {
    const v = getCurrentValue(p, season);
    const ratio = v / gp.budget;
    return ratio >= 0.30 && ratio <= 0.70;
  });

  if (sweet.length > 0) return pickRandom(sweet);
  return pickRandom(pool); // fallback
}

// ============================================
// DIRECTOR — Hard
// يحسب أفضل نسبة تقييم/سعر
// يفضل اللاعبين الشباب (talent)
// ============================================
function directorDecide(
  players: Player[],
  gp: GamePlayer,
  season: number,
  slot: string
): Player | null {
  const pool = affordable(
    players.filter(p => p.position === slot),
    gp.budget,
    season
  );
  if (pool.length === 0) return null;

  // احسب score لكل لاعب
  const scored = pool.map(p => {
    const value = getCurrentValue(p, season);
    const stats = getSeasonStats(p, season);
    const ratio = value > 0 ? stats.rating / value : 0;

    // مكافأة للمواهب
    const talentBonus = p.hiddenType === "talent" ? 1.4 : 1.0;
    // عقوبة للـ trap
    const trapPenalty = p.hiddenType === "trap" ? 0.5 : 1.0;
    // مكافأة للشباب
    const age = p.startAge + (season - p.availableSeason);
    const ageBonus = age <= 23 ? 1.3 : age <= 27 ? 1.1 : 0.9;

    return { player: p, score: ratio * talentBonus * trapPenalty * ageBonus };
  });

  scored.sort((a, b) => b.score - a.score);

  // خذ من أفضل 3 عشوائياً (عشان ما يكون متوقع 100%)
  const top = scored.slice(0, Math.min(3, scored.length));
  return pickRandom(top).player;
}

// ============================================
// MAIN: AI TURN
// يقرر أي لاعب يشتري في أي مركز
// ============================================
export function makeAIDecision(
  difficulty: AIDifficulty,
  players: Player[],
  gp: GamePlayer,
  season: number
): AIDecision | null {
  const emptySlots = getEmptySlots(gp.owned);
  if (emptySlots.length === 0 || gp.purchaseChances <= 0) return null;

  // اختر مركز فاضي — Director يفضل الهجوم أولاً
  let slot: string;
  if (difficulty === "director") {
    const priority = ["ST","LW","RW","CAM","LCM","RCM","LB","LCB","RCB","RB","GK"];
    slot = priority.find(s => emptySlots.includes(s)) ?? pickRandom(emptySlots);
  } else {
    slot = pickRandom(emptySlots);
  }

  let chosen: Player | null = null;
  let reason = "";

  switch (difficulty) {
    case "scout":
      chosen = scoutDecide(players, gp, season, slot);
      reason = "Random pick";
      break;
    case "manager":
      chosen = managerDecide(players, gp, season, slot);
      reason = "Value pick";
      break;
    case "director":
      chosen = directorDecide(players, gp, season, slot);
      reason = "Smart investment";
      break;
  }

  if (!chosen) return null;
  return { player: chosen, slot, reason };
}

// ============================================
// AI DIFFICULTY LABELS
// ============================================
export const AI_DIFFICULTY_CONFIG: Record<AIDifficulty, {
  label: string;
  description: string;
  color: string;
  emoji: string;
}> = {
  scout: {
    label: "Scout",
    description: "يختار عشوائياً — مناسب للمبتدئين",
    color: "#10b981",
    emoji: "🟢",
  },
  manager: {
    label: "Manager",
    description: "يفكر بالأسعار — تحدي متوسط",
    color: "#f59e0b",
    emoji: "🟡",
  },
  director: {
    label: "Director",
    description: "يحسب كل شي — للمحترفين فقط",
    color: "#ef4444",
    emoji: "🔴",
  },
};