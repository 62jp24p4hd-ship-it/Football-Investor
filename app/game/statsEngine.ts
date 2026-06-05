import type {
  HiddenPlayerType,
  Player,
  SeasonStats,
} from "./types";

import {
  clampNumber,
  randomBetween,
} from "./helpers";

import {
  calculateMarketValueFromStats,
  calculateAge,
} from "./valueEngine";

export function generateStatsForSeason(
  player: Player,
  targetSeason: number,
  previousStats: SeasonStats | null,
  hiddenType: HiddenPlayerType
): SeasonStats {
  const age =
    calculateAge(
      player,
      targetSeason
    );

  let rating =
    previousStats?.rating ??
    randomBetween(58, 82);

  if (hiddenType === "talent") {
    rating += randomBetween(1, 5);
  }

  if (hiddenType === "normal") {
    rating += randomBetween(-2, 2);
  }

  if (hiddenType === "flop") {
    rating += randomBetween(-5, 1);
  }

  if (age >= 30) {
    rating -= randomBetween(0, 3);
  }

  rating =
    clampNumber(
      Math.round(rating),
      1,
      99
    );

  const games =
    randomBetween(12, 42);

  let goals = 0;
  let assists = 0;
  let cleanSheets = 0;

  if (
    player.position === "ST" ||
    player.position === "LW" ||
    player.position === "RW"
  ) {
    goals = Math.round(
      (rating / 99) *
        randomBetween(8, 38)
    );

    assists = Math.round(
      (rating / 99) *
        randomBetween(3, 18)
    );
  }

  if (
    player.position === "CM" ||
    player.position === "CAM"
  ) {
    goals = Math.round(
      (rating / 99) *
        randomBetween(1, 16)
    );

    assists = Math.round(
      (rating / 99) *
        randomBetween(4, 22)
    );
  }

  if (
    player.position === "CB" ||
    player.position === "LB" ||
    player.position === "RB"
  ) {
    goals = Math.round(
      (rating / 99) *
        randomBetween(0, 6)
    );

    assists = Math.round(
      (rating / 99) *
        randomBetween(0, 9)
    );
  }

  if (player.position === "GK") {
    cleanSheets = Math.round(
      (rating / 99) *
        randomBetween(3, 24)
    );
  }

  const yellowCards =
    randomBetween(0, 10);

  const redCards =
    randomBetween(0, 2);

  const tempStats: SeasonStats = {
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

  const value =
    calculateMarketValueFromStats(
      player,
      targetSeason,
      tempStats
    );

  return {
    ...tempStats,
    value,
  };
}

export function getSeasonStats(
  player: Player,
  targetSeason: number
): SeasonStats {
  const stats =
    player.statsBySeason?.[
      targetSeason
    ];

  if (stats) {
    return stats;
  }

  return {
    season: targetSeason,
    games: 0,
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    yellowCards: 0,
    redCards: 0,
    rating: 70,
    value:
      player.values?.[
        targetSeason
      ] ??
      player.values?.[
        player.availableSeason
      ] ??
      1,
  };
}