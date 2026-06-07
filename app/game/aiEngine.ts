// ============================================
// FOOTBALL INVESTOR — AI ENGINE v2
// لاعب ثاني حقيقي يشتري، يبيع، يزايد
// Scout   → سهل   — عشوائي
// Manager → متوسط — يفكر بالأسعار والعمر
// Director→ صعب   — يحسب ROI ويلعب استراتيجي
// ============================================

import type { Player, GamePlayer, OwnedPlayer } from "./types";
import { getSeasonStats } from "./statsEngine";

export type AIDifficulty = "scout" | "manager" | "director";

export type AIDecision = {
  player: Player;
  slot: string;
  reason: string;
};

export type AISellDecision = {
  ownedIndex: number;
  reason: string;
};

export type AIBidDecision = {
  shouldBid: boolean;
  reason: string;
};

// ============================================
// HELPERS
// ============================================

const ALL_SLOTS = ["LW","ST","RW","CAM","LCM","RCM","LB","LCB","RCB","RB","GK"];

export function getEmptySlots(owned: OwnedPlayer[]): string[] {
  const filled = new Set(owned.map(o => o.slot));
  return ALL_SLOTS.filter(s => !filled.has(s));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPlayerValue(p: Player, season: number): number {
  return p.statsBySeason?.[season]?.value ??
    p.values?.[season] ??
    p.values?.[p.availableSeason] ??
    1;
}

function getPlayerRating(p: Player, season: number): number {
  return p.statsBySeason?.[season]?.rating ?? p.rating ?? 60;
}

function getPlayerAge(p: Player, season: number): number {
  return p.startAge + (season - p.availableSeason);
}

// ============================================
// BUY DECISION
// ============================================

function scoutBuy(players: Player[], gp: GamePlayer, season: number, slot: string): Player | null {
  const pool = players.filter(p =>
    p.position === slot &&
    getPlayerValue(p, season) <= gp.budget
  );
  return pool.length > 0 ? pickRandom(pool) : null;
}

function managerBuy(players: Player[], gp: GamePlayer, season: number, slot: string): Player | null {
  const pool = players.filter(p => {
    if (p.position !== slot) return false;
    const v = getPlayerValue(p, season);
    if (v > gp.budget) return false;
    const ratio = v / gp.budget;
    return ratio >= 0.25 && ratio <= 0.80;
  });
  if (pool.length > 0) return pickRandom(pool);
  // fallback: أي لاعب في المركز
  const fallback = players.filter(p => p.position === slot && getPlayerValue(p, season) <= gp.budget);
  return fallback.length > 0 ? pickRandom(fallback) : null;
}

function directorBuy(players: Player[], gp: GamePlayer, season: number, slot: string): Player | null {
  const pool = players.filter(p =>
    p.position === slot && getPlayerValue(p, season) <= gp.budget
  );
  if (pool.length === 0) return null;

  const scored = pool.map(p => {
    const value = getPlayerValue(p, season);
    const rating = getPlayerRating(p, season);
    const age = getPlayerAge(p, season);
    const talentBonus = p.hiddenType === "talent" ? 1.5 : 1.0;
    const trapPenalty = p.hiddenType === "trap" ? 0.4 : 1.0;
    const ageBonus = age <= 22 ? 1.4 : age <= 26 ? 1.2 : age <= 30 ? 1.0 : 0.7;
    const costEfficiency = value > 0 ? rating / value : 0;
    return { p, score: costEfficiency * talentBonus * trapPenalty * ageBonus };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(3, scored.length));
  return pickRandom(top).p;
}

// ============================================
// SELL DECISION
// يقرر هل الـ AI يبيع أحد لاعبيه أم لا
// ============================================

export function makeAISellDecision(
  difficulty: AIDifficulty,
  gp: GamePlayer,
  season: number
): AISellDecision | null {
  if (gp.owned.length === 0 || gp.sellChances <= 0) return null;

  for (let i = 0; i < gp.owned.length; i++) {
    const item = gp.owned[i];
    const currentVal = item.currentValue && item.currentValue > 0 ? item.currentValue : item.buyPrice;
    const profit = currentVal - item.buyPrice;
    const profitRatio = item.buyPrice > 0 ? profit / item.buyPrice : 0;
    const age = getPlayerAge(item.player, season);
    const rating = getPlayerRating(item.player, season);

    switch (difficulty) {
      case "scout":
        // يبيع عشوائياً 20% من الوقت
        if (Math.random() < 0.20) return { ownedIndex: i, reason: "Random sell" };
        break;

      case "manager":
        // يبيع لو الربح >50% أو اللاعب كبير في السن
        if (profitRatio > 0.50 && Math.random() < 0.60) return { ownedIndex: i, reason: "Good profit" };
        if (age > 32 && Math.random() < 0.50) return { ownedIndex: i, reason: "Aging player" };
        break;

      case "director":
        // يبيع لو الربح >30% ورأى فرصة أفضل، أو لو التقييم نزل
        if (profitRatio > 0.30 && rating < 65 && Math.random() < 0.70) return { ownedIndex: i, reason: "Underperforming" };
        if (profitRatio > 0.80 && Math.random() < 0.65) return { ownedIndex: i, reason: "Max profit" };
        if (age > 30 && profitRatio > 0.10 && Math.random() < 0.55) return { ownedIndex: i, reason: "Sell before decline" };
        break;
    }
  }
  return null;
}

// ============================================
// BID DECISION — للمزايدات
// ============================================

export function makeAIBidDecision(
  difficulty: AIDifficulty,
  gp: GamePlayer,
  currentBid: number,
  playerValue: number,
  playerRating: number
): AIBidDecision {
  const nextBid = currentBid + 5;
  if (gp.budget < nextBid) return { shouldBid: false, reason: "No budget" };

  const budgetRatio = nextBid / gp.budget;

  switch (difficulty) {
    case "scout":
      // يزايد عشوائياً 40% من الوقت لو الميزانية تسمح
      if (budgetRatio > 0.60) return { shouldBid: false, reason: "Too expensive" };
      return { shouldBid: Math.random() < 0.40, reason: "Random bid" };

    case "manager":
      // يزايد لو السعر أقل من 70% من قيمة اللاعب
      if (budgetRatio > 0.70) return { shouldBid: false, reason: "Over budget" };
      if (nextBid > playerValue * 0.85) return { shouldBid: false, reason: "Overpriced" };
      return { shouldBid: Math.random() < 0.55, reason: "Good value bid" };

    case "director":
      // يزايد بذكاء — يقيّم الـ ROI
      if (budgetRatio > 0.80) return { shouldBid: false, reason: "Protecting budget" };
      if (nextBid > playerValue * 0.90) return { shouldBid: false, reason: "No margin" };
      if (playerRating >= 80 && budgetRatio <= 0.60) return { shouldBid: true, reason: "Elite player worth it" };
      return { shouldBid: Math.random() < 0.65, reason: "Calculated bid" };
  }
}

// ============================================
// MAIN BUY DECISION
// ============================================

export function makeAIDecision(
  difficulty: AIDifficulty,
  players: Player[],
  gp: GamePlayer,
  season: number
): AIDecision | null {
  if (gp.purchaseChances <= 0) return null;

  const emptySlots = getEmptySlots(gp.owned);
  if (emptySlots.length === 0) return null;

  // اختار مركز — Director يفضل الهجوم
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
      chosen = scoutBuy(players, gp, season, slot);
      reason = "Random pick";
      break;
    case "manager":
      chosen = managerBuy(players, gp, season, slot);
      reason = "Balanced pick";
      break;
    case "director":
      chosen = directorBuy(players, gp, season, slot);
      reason = "Smart investment";
      break;
  }

  if (!chosen) return null;
  return { player: chosen, slot, reason };
}

// ============================================
// AI DIFFICULTY CONFIG
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
    description: "يفكر بالأسعار والعمر — تحدي متوسط",
    color: "#f59e0b",
    emoji: "🟡",
  },
  director: {
    label: "Director",
    description: "يحسب كل شي ويلعب استراتيجي — للمحترفين",
    color: "#ef4444",
    emoji: "🔴",
  },
};