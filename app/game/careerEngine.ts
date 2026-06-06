// ============================================
// FOOTBALL INVESTOR 1.8 - CAREER ENGINE
// ============================================

import type { Player, HiddenPlayerType, SeasonStats } from "./types";
import { randomBetween, pickRandom, randomId } from "./helpers";
import { getBaseRating, generateSeasonStats } from "./statsEngine";
import { getRetirementChance } from "./helpers";
import { GAME_END_SEASON } from "./constants";

// ============================================
// DETERMINE HIDDEN TYPE
// ============================================

export function determineHiddenType(player: Player): HiddenPlayerType {
  if (player.secret) return "secret";
  if (player.hiddenType) return player.hiddenType;

  const rating = getBaseRating(player);
  const roll = Math.random();

  if (rating >= 84) {
    // High rated → more likely talent
    if (roll < 0.55) return "talent";
    if (roll < 0.75) return "normal";
    return "trap";
  }

  if (rating <= 65) {
    // Low rated → more likely trap
    if (roll < 0.45) return "trap";
    if (roll < 0.75) return "normal";
    return "talent";
  }

  // Mid-rated
  if (roll < 0.15) return "talent";
  if (roll < 0.45) return "trap";
  return "normal";
}

// ============================================
// BUILD FULL DYNAMIC CAREER
// ============================================

export function buildDynamicCareer(player: Player): Player {
  const hiddenType = determineHiddenType(player);

  const statsBySeason: Record<number, SeasonStats> = {};
  const values: Record<number, number> = {};

  let previousStats: SeasonStats | null = null;

  const endSeason = Math.max(GAME_END_SEASON, player.availableSeason + 10);

  for (let s = player.availableSeason; s <= endSeason; s++) {
    const stats = generateSeasonStats(player, s, previousStats, hiddenType);
    statsBySeason[s] = stats;
    values[s] = stats.value;
    previousStats = stats;
  }

  return {
    ...player,
    id: player.id ?? `p_${randomId()}`,
    hiddenType,
    rating: statsBySeason[player.availableSeason]?.rating ?? player.rating ?? 70,
    values,
    statsBySeason,
  };
}

// ============================================
// BUILD MULTIPLE PLAYERS
// ============================================

export function buildDynamicPlayers(list: Player[]): Player[] {
  return list.map((p) => buildDynamicCareer(p));
}

// ============================================
// RETIREMENT SYSTEM
// ============================================

export function shouldPlayerRetire(
  player: Player,
  targetSeason: number
): boolean {
  if (player.secret) return false;

  const age = player.startAge + (targetSeason - player.availableSeason);
  const chance = getRetirementChance(age);

  if (chance <= 0) return false;
  return Math.random() < chance;
}

export type RetirementResult = {
  retired: boolean;
  playerName: string;
  age: number;
};

export function applyRetirementToSquad(
  ownedPlayers: { player: Player; slot: string; buySeason: number; buyPrice: number }[],
  newSeason: number
): {
  surviving: typeof ownedPlayers;
  retired: RetirementResult[];
} {
  const surviving: typeof ownedPlayers = [];
  const retired: RetirementResult[] = [];

  for (const item of ownedPlayers) {
    const age = item.player.startAge + (newSeason - item.player.availableSeason);
    if (shouldPlayerRetire(item.player, newSeason)) {
      retired.push({
        retired: true,
        playerName: item.player.name,
        age,
      });
    } else {
      surviving.push(item);
    }
  }

  return { surviving, retired };
}

// ============================================
// CAREER PEEK (for scouting display)
// ============================================

export function getCareerPeakValue(player: Player): number {
  if (!player.values) return 1;
  return Math.max(...Object.values(player.values));
}

export function getCareerPeakSeason(player: Player): number {
  if (!player.values) return player.availableSeason;
  let peak = player.availableSeason;
  let peakVal = 0;
  for (const [season, val] of Object.entries(player.values)) {
    if (val > peakVal) {
      peakVal = val;
      peak = Number(season);
    }
  }
  return peak;
}

export function getCareerTrajectory(
  player: Player,
  fromSeason: number,
  toSeason: number
): number[] {
  const result: number[] = [];
  for (let s = fromSeason; s <= toSeason; s++) {
    result.push(player.values?.[s] ?? 0);
  }
  return result;
}

// ============================================
// PLAYER PROGRESSION LABEL
// ============================================

export function getProgressionLabel(
  hiddenType: HiddenPlayerType | undefined
): string {
  switch (hiddenType) {
    case "talent": return "🌟 High Potential";
    case "trap": return "⚠️ Risky Investment";
    case "secret": return "🟡 Secret Card";
    case "normal": return "📊 Steady Player";
    default: return "❓ Unknown";
  }
}

export function getHiddenTypeColor(
  hiddenType: HiddenPlayerType | undefined
): string {
  switch (hiddenType) {
    case "talent": return "text-emerald-400";
    case "trap": return "text-orange-400";
    case "secret": return "text-yellow-300";
    case "normal": return "text-blue-400";
    default: return "text-gray-400";
  }
}