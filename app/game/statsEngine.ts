// ============================================
// FOOTBALL INVESTOR 1.8 - STATS ENGINE
// ============================================

import type { Player, SeasonStats, HiddenPlayerType } from "./types";
import { clamp, randomBetween, calculateAge, isAttacker, isMidfielder, isDefender, isGoalkeeper } from "./helpers";
import { calculateBaseValue } from "./valueEngine";

// ============================================
// BASE RATING FROM PLAYER
// ============================================

export function getBaseRating(player: Player): number {
  return clamp(Math.round(player.rating ?? 70), 40, 99);
}

// ============================================
// GENERATE STATS FOR A SEASON
// ============================================

export function generateSeasonStats(
  player: Player,
  targetSeason: number,
  previousStats: SeasonStats | null,
  hiddenType: HiddenPlayerType
): SeasonStats {
  const age = calculateAge(player.startAge, player.availableSeason, targetSeason);

  // Rating evolution
  let rating = previousStats?.rating ?? (getBaseRating(player) + randomBetween(-3, 3));

  switch (hiddenType) {
    case "talent":
      rating += randomBetween(1, 5);
      break;
    case "trap":
      // Looks good first 2 seasons, then drops
      const seasonsIn = targetSeason - player.availableSeason;
      if (seasonsIn <= 1) {
        rating += randomBetween(2, 5); // deceivingly good
      } else {
        rating += randomBetween(-7, -1); // then crashes
      }
      break;
    case "secret":
      rating += randomBetween(2, 6);
      break;
    case "normal":
    default:
      rating += randomBetween(-2, 3);
      break;
  }

  // Age decline
  if (age >= 33) rating -= randomBetween(2, 4);
  else if (age >= 30) rating -= randomBetween(0, 2);

  rating = clamp(Math.round(rating), 40, 99);

  // Games played
  const games = randomBetween(15, 42);

  // Position-based stats
  let goals = 0;
  let assists = 0;
  let cleanSheets = 0;

  if (isAttacker(player.position)) {
    goals = Math.round((rating / 99) * randomBetween(8, 38));
    assists = Math.round((rating / 99) * randomBetween(3, 18));
  } else if (isMidfielder(player.position)) {
    if (player.position === "CAM") {
      goals = Math.round((rating / 99) * randomBetween(5, 20));
      assists = Math.round((rating / 99) * randomBetween(8, 24));
    } else {
      goals = Math.round((rating / 99) * randomBetween(2, 12));
      assists = Math.round((rating / 99) * randomBetween(5, 18));
    }
  } else if (isDefender(player.position)) {
    goals = Math.round((rating / 99) * randomBetween(0, 5));
    assists = Math.round((rating / 99) * randomBetween(0, 8));
  } else if (isGoalkeeper(player.position)) {
    cleanSheets = Math.round((rating / 99) * randomBetween(5, 24));
  }

  // Discipline
  const yellowCards = randomBetween(0, 10);
  const redCards = randomBetween(0, 2);

  // Calculate value from stats
  const draftStats: SeasonStats = {
    season: targetSeason,
    games,
    goals,
    assists,
    cleanSheets,
    yellowCards,
    redCards,
    rating,
    value: 1,
  };

  const value = calculateBaseValue(player, targetSeason, draftStats);

  return { ...draftStats, value };
}

// ============================================
// GET STATS FOR A SEASON
// ============================================

export function getSeasonStats(
  player: Player,
  targetSeason: number
): SeasonStats {
  const cached = player.statsBySeason?.[targetSeason];
  if (cached) return cached;

  // Fallback
  return {
    season: targetSeason,
    games: player.games ?? 0,
    goals: player.goals ?? 0,
    assists: player.assists ?? 0,
    cleanSheets: player.cleanSheets ?? 0,
    yellowCards: 0,
    redCards: 0,
    rating: getBaseRating(player),
    value:
      player.values?.[targetSeason] ??
      player.values?.[player.availableSeason] ??
      1,
  };
}

// ============================================
// APPLY STATS MODIFIER (for events)
// ============================================

export function applyStatsModifier(
  player: Player,
  targetSeason: number,
  modifier: Partial<SeasonStats>
): Player {
  const oldStats = getSeasonStats(player, targetSeason);

  const newRating = clamp(
    Math.round(modifier.rating ?? oldStats.rating),
    40,
    99
  );

  const newStats: SeasonStats = {
    ...oldStats,
    ...modifier,
    rating: newRating,
    games: clamp(modifier.games ?? oldStats.games, 0, 60),
    goals: clamp(modifier.goals ?? oldStats.goals, 0, 80),
    assists: clamp(modifier.assists ?? oldStats.assists, 0, 60),
    cleanSheets: clamp(modifier.cleanSheets ?? oldStats.cleanSheets, 0, 40),
  };

  // استخدم القيمة المُمررة دائماً — لا تعيد الحساب من قاعدة البيانات
  if (modifier.value === undefined || modifier.value === null) {
    newStats.value = calculateBaseValue(player, targetSeason, newStats);
  }

  return {
    ...player,
    rating: newStats.rating,
    values: {
      ...(player.values ?? {}),
      [targetSeason]: newStats.value,
    },
    statsBySeason: {
      ...(player.statsBySeason ?? {}),
      [targetSeason]: newStats,
    },
  };
}

// ============================================
// STATS DISPLAY HELPERS
// ============================================

export function getStatLine(
  player: Player,
  season: number
): string {
  const stats = getSeasonStats(player, season);

  if (isGoalkeeper(player.position)) {
    return `${stats.games}G | ${stats.cleanSheets} CS | ${stats.rating} RTG`;
  }

  if (isDefender(player.position)) {
    return `${stats.games}G | ${stats.goals} Goals | ${stats.assists} Ast | ${stats.rating} RTG`;
  }

  return `${stats.games}G | ${stats.goals} Goals | ${stats.assists} Ast | ${stats.rating} RTG`;
}

export function getStatChangeText(
  before: number,
  after: number,
  label: string
): string {
  const diff = after - before;
  if (diff === 0) return `${label}: ${after}`;
  const sign = diff > 0 ? "+" : "";
  return `${label}: ${before} → ${after} (${sign}${diff})`;
}

// ============================================
// RATING CHANGE LABEL
// ============================================

export function getRatingChangeLabel(change: number): string {
  if (change >= 5) return "🚀 Massive Improvement";
  if (change >= 3) return "📈 Good Progress";
  if (change >= 1) return "↗️ Slight Improvement";
  if (change === 0) return "➡️ No Change";
  if (change >= -2) return "↘️ Slight Decline";
  if (change >= -5) return "📉 Noticeable Decline";
  return "💔 Major Decline";
}