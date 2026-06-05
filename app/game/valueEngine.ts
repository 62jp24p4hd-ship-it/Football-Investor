import type {
  Player,
  SeasonStats,
} from "./types";

export function calculateAge(
  player: Player,
  targetSeason: number
) {
  return (
    player.startAge +
    (targetSeason - player.availableSeason)
  );
}

export function getBaseRating(
  player: Player
) {
  const firstStats =
    player.statsBySeason?.[
      player.availableSeason
    ];

  return Math.max(
    1,
    Math.min(
      99,
      Math.round(
        firstStats?.rating ?? 70
      )
    )
  );
}

export function calculateMarketValueFromStats(
  player: Player,
  targetSeason: number,
  stats: SeasonStats
) {
  const age =
    calculateAge(
      player,
      targetSeason
    );

  let value =
    stats.rating * 0.45 +
    stats.games * 0.18 +
    stats.goals * 1.2 +
    stats.assists * 0.9 +
    stats.cleanSheets * 0.8;

  if (age <= 21) {
    value *= 1.35;
  } else if (age <= 25) {
    value *= 1.2;
  } else if (age >= 34) {
    value *= 0.65;
  } else if (age >= 30) {
    value *= 0.85;
  }

  if (player.secret) {
    value *= 6;
  }

  return Math.max(
    1,
    Math.round(value)
  );
}

export function getPlayerValue(
  player: Player,
  season: number,
  marketMultiplier = 1
) {
  const value =
    player.values?.[season] ??
    player.values?.[
      player.availableSeason
    ] ??
    1;

  return Math.max(
    1,
    Math.round(
      value * marketMultiplier
    )
  );
}