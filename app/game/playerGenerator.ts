// ============================================
// FOOTBALL INVESTOR 1.8 - PLAYER GENERATOR
// ============================================

import type { Player, Position, HiddenPlayerType } from "./types";
import { pickRandom, randomBetween, randomId } from "./helpers";
import { buildDynamicCareer } from "./careerEngine";
import {
  GENERATED_FIRST_NAMES,
  GENERATED_LAST_NAMES,
  GENERATED_NATIONALITIES,
  GENERATED_LEAGUES,
  GENERATED_CLUBS,
  ALL_POSITIONS,
} from "./constants";

// ============================================
// GENERATE SINGLE PLAYER
// ============================================

export function createGeneratedPlayer(
  season: number,
  position: Position
): Player {
  const typeRoll = Math.random();
  let hiddenType: HiddenPlayerType;

  if (typeRoll < 0.12) hiddenType = "talent";
  else if (typeRoll < 0.40) hiddenType = "trap";
  else hiddenType = "normal";

  const league = pickRandom(GENERATED_LEAGUES);
  const clubs = GENERATED_CLUBS[league] ?? ["Unknown Club"];
  const club = pickRandom(clubs);

  const baseRating =
    hiddenType === "talent"
      ? randomBetween(76, 86)
      : hiddenType === "trap"
      ? randomBetween(72, 84) // trap looks deceptively good
      : randomBetween(64, 78);

  const player: Player = {
    id: `gen_${season}_${position}_${randomId()}`,
    name: `${pickRandom(GENERATED_FIRST_NAMES)} ${pickRandom(GENERATED_LAST_NAMES)}`,
    position,
    availableSeason: season,
    startAge: randomBetween(17, 23),
    nationality: pickRandom(GENERATED_NATIONALITIES),
    height: randomBetween(168, 198),
    league,
    club,
    hiddenType,
    rating: baseRating,
  };

  return buildDynamicCareer(player);
}

// ============================================
// GENERATE FULL SEASON POOL
// ============================================

export function generateSeasonPlayerPool(season: number): Player[] {
  const generated: Player[] = [];

  ALL_POSITIONS.forEach((position) => {
    for (let i = 0; i < 5; i++) {
      generated.push(createGeneratedPlayer(season, position));
    }
  });

  return generated;
}

// ============================================
// GENERATE AUCTION CANDIDATES
// ============================================

export function generateAuctionCandidates(season: number): Player[] {
  // Auction players are always high quality
  const positions: Position[] = ["ST", "CAM", "LCM"];
  return positions.map((pos) => {
    const player: Player = {
      id: `auction_${season}_${pos}_${randomId()}`,
      name: `${pickRandom(GENERATED_FIRST_NAMES)} ${pickRandom(GENERATED_LAST_NAMES)}`,
      position: pos,
      availableSeason: season,
      startAge: randomBetween(19, 25),
      nationality: pickRandom(GENERATED_NATIONALITIES),
      height: randomBetween(174, 192),
      league: pickRandom(GENERATED_LEAGUES),
      club: "Free Agent",
      hiddenType: Math.random() < 0.6 ? "talent" : "normal",
      rating: randomBetween(80, 90),
    };
    return buildDynamicCareer(player);
  });
}

// ============================================
// SECRET PLAYERS
// ============================================

export function createSecretPlayers(): Player[] {
  return [
    buildDynamicCareer({
      id: "secret_yousef",
      name: "Yousef Alnuwasser",
      position: "ST",
      availableSeason: 2016,
      startAge: 18,
      nationality: "Saudi Arabia",
      height: 185,
      league: "Saudi Pro League",
      club: "Al Kharj FC",
      games: 38,
      goals: 70,
      assists: 30,
      rating: 99,
      secret: true,
      hiddenType: "secret",
    }),
  ];
}