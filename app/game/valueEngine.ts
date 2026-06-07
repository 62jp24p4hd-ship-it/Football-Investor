// ============================================
// FOOTBALL INVESTOR 1.8 - VALUE ENGINE
// ============================================

import type { Player, SeasonStats, HiddenPlayerType } from "./types";
import { clamp, roundTo, calculateAge, isAttacker, isMidfielder, isDefender, isGoalkeeper } from "./helpers";
import { MIN_PLAYER_VALUE, MAX_PLAYER_VALUE } from "./constants";

// ============================================
// BASE VALUE FROM STATS
// ============================================

export function calculateBaseValue(
  player: Player,
  targetSeason: number,
  stats: SeasonStats
): number {
  const age = calculateAge(player.startAge, player.availableSeason, targetSeason);

  // Base formula from stats
  let value =
    stats.rating * 0.5 +
    stats.games * 0.2 +
    stats.goals * 1.3 +
    stats.assists * 1.0 +
    stats.cleanSheets * 0.9;

  // Age multiplier
  if (age <= 18) value *= 1.5;
  else if (age <= 21) value *= 1.35;
  else if (age <= 25) value *= 1.2;
  else if (age <= 29) value *= 1.0;
  else if (age <= 32) value *= 0.85;
  else if (age <= 35) value *= 0.65;
  else value *= 0.45;

  // Position premium
  if (isAttacker(player.position)) value *= 1.1;
  if (isGoalkeeper(player.position)) value *= 0.9;

  // Secret player bonus
  if (player.secret) value *= 6;

  return clamp(
    Math.round(value),
    MIN_PLAYER_VALUE,
    MAX_PLAYER_VALUE
  );
}

// ============================================
// HIDDEN TYPE MULTIPLIER
// ============================================

export function getHiddenTypeValueMultiplier(
  hiddenType: HiddenPlayerType,
  seasonsOwned: number
): number {
  switch (hiddenType) {
    case "talent":
      // Grows faster over time
      return 1 + seasonsOwned * 0.08;
    case "trap":
      // Looks good early, drops later
      if (seasonsOwned <= 2) return 1.1;
      return Math.max(0.4, 1.1 - (seasonsOwned - 2) * 0.15);
    case "secret":
      return 1 + seasonsOwned * 0.12;
    case "normal":
    default:
      return 1 + seasonsOwned * 0.03;
  }
}

// ============================================
// APPLY EVENT MULTIPLIER
// ============================================

export function applyEventMultiplier(
  value: number,
  multiplier: number
): number {
  return clamp(
    Math.round(value * multiplier),
    MIN_PLAYER_VALUE,
    MAX_PLAYER_VALUE
  );
}

// ============================================
// CURRENT VALUE WITH MODIFIERS
// ============================================

export function getCurrentValue(
  player: Player,
  targetSeason: number,
  marketMultiplier: number = 1,
  playerMultiplier: number = 1
): number {
  const stats = player.statsBySeason?.[targetSeason];
  if (!stats) {
    const baseVal = player.values?.[targetSeason] ??
      player.values?.[player.availableSeason] ??
      MIN_PLAYER_VALUE;
    return clamp(
      Math.round(baseVal * marketMultiplier * playerMultiplier),
      MIN_PLAYER_VALUE,
      MAX_PLAYER_VALUE
    );
  }

  let value = stats.value;
  value = Math.round(value * marketMultiplier * playerMultiplier);
  return clamp(value, MIN_PLAYER_VALUE, MAX_PLAYER_VALUE);
}

// ============================================
// VALUE TREND (for display)
// ============================================

export function getValueTrend(
  player: Player,
  currentSeason: number
): "up" | "down" | "stable" {
  const prevSeason = currentSeason - 1;
  const prevVal = player.values?.[prevSeason];
  const currVal = player.values?.[currentSeason];

  if (!prevVal || !currVal) return "stable";

  const diff = currVal - prevVal;
  if (diff > 2) return "up";
  if (diff < -2) return "down";
  return "stable";
}

export function getValueTrendIcon(trend: "up" | "down" | "stable"): string {
  if (trend === "up") return "📈";
  if (trend === "down") return "📉";
  return "➡️";
}

export function getValueTrendColor(trend: "up" | "down" | "stable"): string {
  if (trend === "up") return "text-emerald-400";
  if (trend === "down") return "text-red-400";
  return "text-gray-400";
}

// ============================================
// PROFIT CALCULATION
// ============================================

export function calculateProfit(
  sellPrice: number,
  buyPrice: number
): number {
  return sellPrice - buyPrice;
}

export function getProfitColor(profit: number): string {
  if (profit > 0) return "text-emerald-400";
  if (profit < 0) return "text-red-400";
  return "text-gray-400";
}

export function getProfitIcon(profit: number): string {
  if (profit > 0) return "💹";
  if (profit < 0) return "🔻";
  return "➖";
}

// ============================================
// INVESTOR OFFER VALUE
// ============================================

export function createInvestorOfferValue(marketValue: number): number {
  const minOffer = Math.max(MIN_PLAYER_VALUE, Math.round(marketValue * 0.7));
  const maxOffer = Math.max(minOffer, Math.round(marketValue * 1.7));
  return Math.floor(Math.random() * (maxOffer - minOffer + 1)) + minOffer;
}

export function getOfferTone(offerValue: number, marketValue: number): "good" | "bad" | "neutral" {
  const ratio = offerValue / marketValue;
  if (ratio <= 0.85) return "good";   // cheap = good for buyer
  if (ratio >= 1.35) return "bad";    // expensive = bad for buyer
  return "neutral";
}

export function getOfferDifferenceText(offerValue: number, marketValue: number): string {
  const diff = offerValue - marketValue;
  if (diff > 0) return `€${diff}M above market`;
  if (diff < 0) return `€${Math.abs(diff)}M below market`;
  return "Exactly at market value";
}

// ============================================
// TOTAL PORTFOLIO VALUE
// ============================================

export function calculatePortfolioValue(
  ownedPlayers: { player: Player; buyPrice: number }[],
  currentSeason: number
): number {
  return ownedPlayers.reduce((sum, item) => {
    const val = getCurrentValue(item.player, currentSeason);
    return sum + val;
  }, 0);
}

// ============================================
// RATING TO STARS (for display)
// ============================================

export function ratingToStars(rating: number): string {
  if (rating >= 90) return "⭐⭐⭐⭐⭐";
  if (rating >= 80) return "⭐⭐⭐⭐";
  if (rating >= 70) return "⭐⭐⭐";
  if (rating >= 60) return "⭐⭐";
  return "⭐";
}

export function getRatingColor(rating: number): string {
  if (rating >= 88) return "text-yellow-300";
  if (rating >= 80) return "text-emerald-400";
  if (rating >= 70) return "text-blue-400";
  if (rating >= 60) return "text-orange-400";
  return "text-red-400";
}

export function getRatingBg(rating: number): string {
  if (rating >= 88) return "bg-yellow-500";
  if (rating >= 80) return "bg-emerald-500";
  if (rating >= 70) return "bg-blue-500";
  if (rating >= 60) return "bg-orange-500";
  return "bg-red-500";
}

// ============================================
// PRICE TIER SYSTEM
// كل لاعب له tier حسب نسبة سعره من الميزانية
// الرخيص: احتمال كبير ينزل، نادراً يصعد كثير
// الغالي: مستقر أكثر مع نمو معقول
// ============================================

export type PriceTier = "cheap" | "mid" | "premium" | "elite";

export function getPriceTier(price: number, budget: number): PriceTier {
  const ratio = price / budget;
  if (ratio <= 0.2)  return "cheap";
  if (ratio <= 0.5)  return "mid";
  if (ratio <= 0.8)  return "premium";
  return "elite";
}

// نسب التغيير الموسمية — واقعية ومتوازنة
const TIER_CONFIG: Record<PriceTier, {
  dropChance: number;
  dropMin: number; dropMax: number;
  riseSmallChance: number;
  riseSmallMin: number; riseSmallMax: number;
  riseBigChance: number;
  riseBigMin: number; riseBigMax: number;
}> = {
  cheap: {
    // رخيص — 65% ينزل، 15% يصعد بسيط، 20% يصعد كثير
    // لكن أقصى ارتفاع 40% في موسم واحد
    dropChance: 0.65, dropMin: 0.05, dropMax: 0.30,
    riseSmallChance: 0.15, riseSmallMin: 0.03, riseSmallMax: 0.12,
    riseBigChance: 0.20, riseBigMin: 0.15, riseBigMax: 0.40,
  },
  mid: {
    // متوسط — 40% ينزل، 40% يصعد عادي، 20% يصعد كثير
    dropChance: 0.40, dropMin: 0.03, dropMax: 0.20,
    riseSmallChance: 0.40, riseSmallMin: 0.03, riseSmallMax: 0.15,
    riseBigChance: 0.20, riseBigMin: 0.15, riseBigMax: 0.35,
  },
  premium: {
    // غالي — 20% ينزل، 55% يصعد عادي، 25% يصعد كثير
    dropChance: 0.20, dropMin: 0.02, dropMax: 0.12,
    riseSmallChance: 0.55, riseSmallMin: 0.03, riseSmallMax: 0.12,
    riseBigChance: 0.25, riseBigMin: 0.12, riseBigMax: 0.28,
  },
  elite: {
    // أغلى — 10% ينزل، 65% يصعد عادي، 25% يصعد كثير
    dropChance: 0.10, dropMin: 0.01, dropMax: 0.08,
    riseSmallChance: 0.65, riseSmallMin: 0.02, riseSmallMax: 0.10,
    riseBigChance: 0.25, riseBigMin: 0.10, riseBigMax: 0.22,
  },
};

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function applyPriceTierGrowth(
  currentPrice: number,
  budget: number
): number {
  const tier = getPriceTier(currentPrice, budget);
  const cfg = TIER_CONFIG[tier];
  const roll = Math.random();

  let newPrice: number;
  if (roll < cfg.dropChance) {
    const pct = randBetween(cfg.dropMin, cfg.dropMax);
    newPrice = currentPrice * (1 - pct);
  } else if (roll < cfg.dropChance + cfg.riseSmallChance) {
    const pct = randBetween(cfg.riseSmallMin, cfg.riseSmallMax);
    newPrice = currentPrice * (1 + pct);
  } else {
    const pct = randBetween(cfg.riseBigMin, cfg.riseBigMax);
    newPrice = currentPrice * (1 + pct);
  }

  // أقصى قيمة = ضعف الميزانية (لمنع الارتفاعات الجنونية)
  const cap = budget * 2;
  return Math.max(1, Math.min(cap, Math.round(newPrice)));
}

// ============================================
// AFFORDABLE PLAYER GUARANTEE
// ============================================

export function guaranteeAffordablePlayer(
  players: import("./types").Player[],
  budget: number,
  season: number
): import("./types").Player[] {
  if (players.length === 0) return players;

  const getVal = (p: import("./types").Player): number =>
    p.statsBySeason?.[season]?.value ??
    p.values?.[season] ??
    p.values?.[p.availableSeason] ??
    1;

  const getRating = (p: import("./types").Player): number =>
    p.statsBySeason?.[season]?.rating ?? p.rating ?? 70;

  const rawVals = players.map(getVal);
  const maxRaw = Math.max(...rawVals);
  const minRaw = Math.min(...rawVals);

  // Price range: cheapest = 5% of budget, most expensive = 100%
  const minPrice = Math.max(1, Math.round(budget * 0.05));
  const maxPrice = Math.max(minPrice + 1, budget);

  function scalePrice(raw: number): number {
    if (maxRaw === minRaw) return Math.round(budget * 0.5);
    const ratio = (raw - minRaw) / (maxRaw - minRaw);
    return Math.max(minPrice, Math.min(maxPrice, Math.round(minPrice + ratio * (maxPrice - minPrice))));
  }

  // Rating يتكيف مع السعر — الرخيص ≤ 49، الغالي يحتفظ بتقييمه الأصلي
  function scaleRating(originalRating: number, newPrice: number): number {
    const priceRatio = newPrice / budget;
    if (priceRatio <= 0.10) return Math.min(originalRating, 44);      // أرخص 10% → max 44
    if (priceRatio <= 0.20) return Math.min(originalRating, 54);      // 10-20% → max 54
    if (priceRatio <= 0.40) return Math.min(originalRating, 65);      // 20-40% → max 65
    if (priceRatio <= 0.70) return Math.min(originalRating, 78);      // 40-70% → max 78
    return originalRating;                                              // +70% → تقييمه الأصلي
  }

  return players.map((p, i) => {
    const newPrice = scalePrice(rawVals[i]);
    const originalRating = getRating(p);
    const newRating = scaleRating(originalRating, newPrice);
    return {
      ...p,
      statsBySeason: p.statsBySeason ? {
        ...p.statsBySeason,
        [season]: p.statsBySeason[season]
          ? { ...p.statsBySeason[season], value: newPrice, rating: newRating }
          : { season, games: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, rating: newRating, value: newPrice }
      } : p.statsBySeason,
      values: { ...(p.values ?? {}), [season]: newPrice },
    };
  });
}