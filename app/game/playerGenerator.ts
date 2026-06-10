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
  const goatBase = {
    secret: true,
    hiddenType: "secret" as const,
    league: "GOATs",
    club: "GOATs FC",
    height: 183,
    games: 38,
    goals: 25,
    assists: 15,
    rating: 99,
    cardColor: "gold",
  };

  const goats = [
    buildDynamicCareer({ id: "goat_ali_s",     name: "Ali Alsaif",          position: "LW",  availableSeason: 2010, startAge: 23, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_ali_g",     name: "Ali AlGhanim",        position: "RW",  availableSeason: 2011, startAge: 24, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_reda",      name: "Reda Alrezk",         position: "LB",  availableSeason: 2013, startAge: 21, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_qousi",     name: "Qousi",               position: "LCB", availableSeason: 2014, startAge: 23, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_hussain",   name: "Hussain Alrezk",      position: "LCM", availableSeason: 2015, startAge: 22, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_yousef",    name: "Yousef Alnuwasser",   position: "ST",  availableSeason: 2016, startAge: 22, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_abdullah",  name: "ABDULLAH ALMUSAWI",   position: "RCM", availableSeason: 2017, startAge: 25, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_ali_b",     name: "Ali Albrahim",        position: "CAM", availableSeason: 2018, startAge: 25, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_mohammed",  name: "Mohammed Al Abullah", position: "RB",  availableSeason: 2019, startAge: 22, nationality: "Saudi Arabia", ...goatBase }),
    buildDynamicCareer({ id: "goat_abdulaziz", name: "Abdulaziz Alghariri", position: "RCB", availableSeason: 2020, startAge: 21, nationality: "Saudi Arabia", ...goatBase }),
  ];

  // Force value = 101M for all seasons
  return goats.map(p => {
    const overriddenValues: Record<number, number> = {};
    const overriddenStats: Record<number, import("./types").SeasonStats> = {};
    Object.keys(p.statsBySeason ?? {}).forEach(s => {
      const season = Number(s);
      overriddenStats[season] = { ...p.statsBySeason![season], value: 101 };
      overriddenValues[season] = 101;
    });
    return { ...p, values: overriddenValues, statsBySeason: overriddenStats };
  });
}