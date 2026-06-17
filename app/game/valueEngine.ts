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
// PRICE TIER SYSTEM — نمو واقعي
// أقصى نمو عادي: 10% في الموسم
// أقصى نمو استثنائي: 20% في الموسم
// ============================================

// ============================================
// PRICE TIER SYSTEM — نظام جديد كامل
//
// القواعد:
// - لاعب واحد فقط بسعر max (الـ elite) rating فوق 60
//   نموه 20-30% أقصى شي في الموسم
// - الباقي متفاوتين: كل ما زاد السعر زاد rating وزادت فرص النمو
// - كل ما قل السعر قل rating وقلت فرص النمو وزادت فرص النزول
// - أقصى نمو لأي لاعب = 30% في الموسم الواحد
// ============================================

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// احسب نمو اللاعب بناءً على سعره النسبي من الميزانية
export function applyPriceTierGrowth(
  currentPrice: number,
  budget: number,
  rating: number = 70
): number {
  if (budget <= 0) return currentPrice;

  const ratio = Math.min(1, currentPrice / budget);
  const roll = Math.random();

  const ratingBonus = (rating - 70) / 200;

  const dropChance    = Math.max(0.05, 0.65 - ratio * 0.55 - ratingBonus * 1.5);
  const growBigChance = Math.min(0.60, 0.05 + ratio * 0.25 + ratingBonus * 2.0);

  let changePct: number;

  if (roll < dropChance) {
    const maxDrop = 0.20 - ratio * 0.15;
    changePct = -randBetween(0.02, Math.max(0.03, maxDrop));
  } else if (roll < dropChance + growBigChance) {
    const maxGrow = 0.08 + ratio * 0.22 + Math.max(0, ratingBonus) * 1.5;
    changePct = randBetween(0.06, Math.min(0.50, maxGrow));
  } else {
    changePct = randBetween(0.00, 0.08);
  }

  changePct = Math.max(-0.30, Math.min(0.50, changePct));

  const newPrice = Math.round(currentPrice * (1 + changePct));
  const cap = Math.round(budget * 8);
  return Math.max(1, Math.min(cap, newPrice));
}

// ============================================
// PERFORMANCE-BASED VALUE GROWTH — No Cap
// ============================================

export type PerformanceGrowthResult = {
  newValue: number;
  changePct: number;
  changeAbs: number;
  direction: "up" | "down" | "flat";
};

function getPerformanceBonusPct(
  position: string,
  goals: number,
  assists: number,
  cleanSheets: number
): number {
  const attackers = ["ST", "LW", "RW"];
  const midfielders = ["CAM", "LCM", "RCM"];
  const defenders = ["LB", "LCB", "RCB", "RB"];

  let bonus = 0;

  if (attackers.includes(position)) {
    bonus += Math.floor(goals / 5) * 5;
    bonus += Math.floor(assists / 5) * 2.5;
  } else if (midfielders.includes(position)) {
    bonus += Math.floor(assists / 5) * 5;
    bonus += Math.floor(goals / 5) * 2.5;
  } else if (defenders.includes(position)) {
    bonus += Math.floor(cleanSheets / 5) * 5;
    // Goals وAssists: bonus فقط — لا عقوبة لو نزلوا
    bonus += Math.max(0, Math.floor(goals / 5) * 10);
    bonus += Math.max(0, Math.floor(assists / 5) * 12.5);
  } else if (position === "GK") {
    bonus += Math.floor(cleanSheets / 5) * 10;
  }

  return bonus; // النسبة المئوية (مثلاً 25 = +25%)
}

export function calculatePerformanceGrowth(
  currentValue: number,
  position: string,
  currentGoals: number,
  currentAssists: number,
  currentCleanSheets: number,
  prevGoals: number,
  prevAssists: number,
  prevCleanSheets: number
): PerformanceGrowthResult {
  const defenders = ["LB", "LCB", "RCB", "RB"];
  const currentBonus = getPerformanceBonusPct(position, currentGoals, currentAssists, currentCleanSheets);

  // للمدافعين: فقط Clean Sheets تؤثر سلبياً — Goals/Assists bonus فقط
  let prevBonus: number;
  if (defenders.includes(position)) {
    const prevCSBonus = Math.floor(prevCleanSheets / 5) * 5;
    const currCSBonus = Math.floor(currentCleanSheets / 5) * 5;
    const currGoalBonus = Math.max(0, Math.floor(currentGoals / 5) * 10);
    const currAstBonus  = Math.max(0, Math.floor(currentAssists / 5) * 12.5);
    prevBonus = prevCSBonus; // فقط الـ CS السابق يُقارن
    const netCS = currCSBonus - prevCSBonus;
    const baseline = (Math.random() * 10) - 5;
    const totalPct = netCS + currGoalBonus + currAstBonus + baseline;
    const changeAbs = Math.round(currentValue * (totalPct / 100));
    const newValue = Math.max(1, currentValue + changeAbs);
    return {
      newValue,
      changePct: totalPct,
      changeAbs,
      direction: totalPct > 1 ? "up" : totalPct < -1 ? "down" : "flat",
    };
  }

  prevBonus = getPerformanceBonusPct(position, prevGoals, prevAssists, prevCleanSheets);

  // الفرق بين الموسمين — إذا تحسّن يزيد، إذا انخفض ينقص
  const netPct = currentBonus - prevBonus;

  // أضف baseline random صغير (±5%) لإضفاء تشويق
  const baseline = (Math.random() * 10) - 5; // -5% to +5%
  const totalPct = netPct + baseline;

  const changeAbs = Math.round(currentValue * (totalPct / 100));
  const newValue = Math.max(1, currentValue + changeAbs);

  return {
    newValue,
    changePct: totalPct,
    changeAbs,
    direction: totalPct > 1 ? "up" : totalPct < -1 ? "down" : "flat",
  };
}

// ============================================
// CLUB OWNER LEAGUE PRICING — rating-based tiers
// Designed for a fixed €150M budget building an 11-player squad.
// Price is driven primarily by rating, with light randomness for variety,
// so a balanced squad of good players is actually buildable.
// ============================================

export function calculateLeaguePlayerPrice(rating: number): number {
  let min: number;
  let max: number;

  if (rating >= 90) { min = 35; max = 50; }
  else if (rating >= 80) { min = 20; max = 35; }
  else if (rating >= 70) { min = 8; max = 15; }
  else if (rating >= 60) { min = 3; max = 8; }
  else { min = 0.5; max = 3; }

  const price = randBetween(min, max);
  return Math.max(0.5, Math.round(price * 10) / 10); // one decimal of precision (e.g. 12.3M)
}

// ============================================
// AFFORDABLE PLAYER GUARANTEE (LEAGUE MODE)
// Same selection-card purpose as guaranteeAffordablePlayer, but uses
// calculateLeaguePlayerPrice instead of scaling off the full budget,
// so prices stay realistic regardless of how much budget remains.
// ============================================

export function applyLeaguePricing(
  players: import("./types").Player[],
  season: number
): import("./types").Player[] {
  return players.map(p => {
    const origRating = p.statsBySeason?.[season]?.rating ?? p.rating ?? 70;
    const price = calculateLeaguePlayerPrice(origRating);

    return {
      ...p,
      statsBySeason: p.statsBySeason ? {
        ...p.statsBySeason,
        [season]: p.statsBySeason[season]
          ? { ...p.statsBySeason[season], value: price, rating: origRating }
          : { season, games: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, rating: origRating, value: price }
      } : p.statsBySeason,
      values: { ...(p.values ?? {}), [season]: price },
    };
  });
}

// ============================================
// RE-PRICE OWNED SQUAD (LEAGUE MODE, SEASON TRANSITION)
// The normal season-growth system regenerates statsBySeason[season].value
// using the standard game economy (€30-200M tiers), which makes a squad
// bought for €150M total suddenly "worth" €800M+ on paper. This re-applies
// the same rating-based league pricing to a player's CURRENT contract value
// so the displayed squad worth stays realistic for the fixed €150M economy.
// ============================================

export function reapplyLeaguePricingToOwnedSquad(
  gp: import("./types").GamePlayer,
  season: number
): import("./types").GamePlayer {
  const updatedOwned = gp.owned.map(item => {
    const rating = item.player.statsBySeason?.[season]?.rating ?? item.player.rating ?? 70;
    const price = calculateLeaguePlayerPrice(rating);

    const updatedStatsBySeason = item.player.statsBySeason ? {
      ...item.player.statsBySeason,
      [season]: item.player.statsBySeason[season]
        ? { ...item.player.statsBySeason[season], value: price }
        : { season, games: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, rating, value: price }
    } : item.player.statsBySeason;

    return {
      ...item,
      player: {
        ...item.player,
        statsBySeason: updatedStatsBySeason,
        values: { ...(item.player.values ?? {}), [season]: price },
      },
    };
  });

  return { ...gp, owned: updatedOwned };
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

  const n = players.length;

  // ترتيب اللاعبين من الأغلى للأرخص حسب قيمتهم الأصلية
  const getOriginalVal = (p: import("./types").Player): number =>
    p.statsBySeason?.[season]?.value ??
    p.values?.[season] ??
    p.values?.[p.availableSeason] ??
    1;

  const originalRating = (p: import("./types").Player): number =>
    p.statsBySeason?.[season]?.rating ?? p.rating ?? 70;

  // رتّب من الأعلى قيمة للأدنى
  const sorted = [...players]
    .map((p, i) => ({ p, i, val: getOriginalVal(p) }))
    .sort((a, b) => b.val - a.val);

  // أسعار موزّعة: واحد بـ 100%، الباقي بشكل تنازلي
  // الأول = budget (100%)
  // الثاني = 70-80%
  // الثالث = 50-65%
  // الرابع = 35-50%
  // الخامس = 20-35%
  const priceSlots: number[] = sorted.map((_, rank) => {
    if (rank === 0) return budget;
    // توزيع تدريجي
    const ratio = Math.max(0.05, 1 - (rank / (n - 1 || 1)) * 0.95);
    // أضف تشويش بسيط ±5%
    const jitter = 1 + (Math.random() - 0.5) * 0.10;
    return Math.max(1, Math.round(budget * ratio * jitter));
  });

  // Rating حسب النسبة من الميزانية
  function scaledRating(priceRatio: number, origRating: number): number {
    if (priceRatio >= 0.90) return Math.max(61, Math.min(origRating, 90));  // elite: 61+
    if (priceRatio >= 0.65) return Math.min(origRating, 75);                // premium: ≤75
    if (priceRatio >= 0.40) return Math.min(origRating, 65);                // mid-high: ≤65
    if (priceRatio >= 0.20) return Math.min(origRating, 55);                // mid-low: ≤55
    return Math.min(origRating, 44);                                          // cheap: ≤44
  }

  // طبّق الأسعار والتقييمات
  const result = [...players];
  sorted.forEach(({ p, i }, rank) => {
    const newPrice = priceSlots[rank];
    const ratio = newPrice / budget;
    const newRating = scaledRating(ratio, originalRating(p));

    result[i] = {
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

  return result;
}