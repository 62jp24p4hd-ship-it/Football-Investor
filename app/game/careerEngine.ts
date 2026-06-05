import type {
  HiddenPlayerType,
  Player,
  SeasonStats,
} from "./types";

import {
  CLASSIC_END_SEASON,
} from "./constants";

import {
  randomBetween,
} from "./helpers";

import {
  generateStatsForSeason,
} from "./statsEngine";

export function getHiddenTypeForPlayer(
  player: Partial<Player>
): HiddenPlayerType {
  if (player.secret) {
    return "talent";
  }

  if (player.hiddenType) {
    return player.hiddenType;
  }

  const roll =
    Math.random();

  if (roll < 0.18) {
    return "talent";
  }

  if (roll < 0.45) {
    return "flop";
  }

  return "normal";
}

export function buildDynamicCareer(
  rawPlayer: Omit<
    Player,
    "hiddenType" | "secret" | "values" | "statsBySeason"
  > &
    Partial<
      Pick<
        Player,
        "hiddenType" | "secret" | "values" | "statsBySeason"
      >
    >
): Player {
  const hiddenType =
    getHiddenTypeForPlayer(
      rawPlayer
    );

  const statsBySeason: Record<
    number,
    SeasonStats
  > = {};

  const values: Record<
    number,
    number
  > = {};

  let previousStats: SeasonStats | null =
    null;

  for (
    let season =
      rawPlayer.availableSeason;
    season <= CLASSIC_END_SEASON;
    season++
  ) {
    const stats =
      generateStatsForSeason(
        {
          ...rawPlayer,
          hiddenType,
          secret:
            rawPlayer.secret ?? false,
          values: {},
          statsBySeason: {},
        },
        season,
        previousStats,
        hiddenType
      );

    statsBySeason[season] =
      stats;

    values[season] =
      stats.value;

    previousStats =
      stats;
  }

  return {
    ...rawPlayer,
    hiddenType,
    secret:
      rawPlayer.secret ?? false,
    values,
    statsBySeason,
    sponsorship:
      rawPlayer.sponsorship ?? null,
  };
}

export function buildDynamicPlayers<
  T extends Omit<
    Player,
    "hiddenType" | "secret" | "values" | "statsBySeason"
  > &
    Partial<
      Pick<
        Player,
        "hiddenType" | "secret" | "values" | "statsBySeason"
      >
    >
>(players: T[]) {
  return players.map(
    (player) =>
      buildDynamicCareer(player)
  );
}

export function createRetirementChance(
  age: number
) {
  if (age < 30) {
    return 0;
  }

  if (age <= 32) {
    return 2;
  }

  if (age <= 35) {
    return 5;
  }

  if (age <= 38) {
    return 10;
  }

  return 20;
}

export function shouldRetire(
  age: number
) {
  const chance =
    createRetirementChance(age);

  if (chance <= 0) {
    return false;
  }

  return randomBetween(
    1,
    100
  ) <= chance;
}