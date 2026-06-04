"use client";

import { useEffect, useMemo, useState } from "react";

import { players2008 } from "./data/players2008";
import { players2009 } from "./data/players2009";
import { players2010 } from "./data/players2010";
import { players2011 } from "./data/players2011";
import { players2012 } from "./data/players2012";
import { players2013 } from "./data/players2013";
import { players2014 } from "./data/players2014";
import { players2015 } from "./data/players2015";
import { players2016 } from "./data/players2016";
import { players2017 } from "./data/players2017";
import { players2018 } from "./data/players2018";
import { players2019 } from "./data/players2019";
import { players2020 } from "./data/players2020";
import { players2021 } from "./data/players2021";
import { players2022 } from "./data/players2022";
import { players2023 } from "./data/players2023";
import { players2024 } from "./data/players2024";
import { players2025 } from "./data/players2025";
import { players2026 } from "./data/players2026";
import { players2027 } from "./data/players2027";
import { players2028 } from "./data/players2028";

type Position =
  | "GK"
  | "LB"
  | "CB"
  | "RB"
  | "CM"
  | "CAM"
  | "LW"
  | "RW"
  | "ST";

type GeneratedPlayerType =
  | "talent"
  | "normal"
  | "flop";

type SeasonStats = {
  season: number;
  games: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  value: number;
};

type Player = {
  name: string;
  position: Position | string;
  availableSeason: number;
  startAge: number;
  nationality: string;
  height: number;
  league: string;
  games?: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  yellowCards?: number;
  redCards?: number;
  rating?: number;
  secret?: boolean;
  hiddenType?: GeneratedPlayerType;
  values?: Record<number, number>;
  statsBySeason?: Record<number, SeasonStats>;
};

type Owned = {
  player: Player;
  slot: string;
  buySeason: number;
  buyPrice: number;
};

type Sold = {
  owner: string;
  name: string;
  buySeason: number;
  sellSeason: number;
  buyPrice: number;
  sellPrice: number;
  profit: number;
};

type CardData = {
  unlocked: boolean;
  used: boolean;
};

type Cards = {
  freeze: CardData;
  triple: CardData;
  steal: CardData;
};

type GamePlayer = {
  name: string;
  budget: number;
  owned: Owned[];
  sold: Sold[];
  purchaseChances: number;
  soldBonusUsedThisSeason: boolean;
  cards: Cards;
  tripleNextSeason: boolean;
  frozenSeason: number | null;
};

type RewardCard =
  | "freeze"
  | "triple"
  | "steal";

type GameLengthMode =
  | "classic"
  | "infinite";

type BudgetMode =
  | "lucky"
  | "balanced"
  | "rich"
  | "billionaire";

type EventType =
  | "all"
  | "positive"
  | "negative";

type NewsTone =
  | "good"
  | "bad"
  | "neutral"
  | "special";

type NewsItem = {
  id: number;
  season: number;
  title: string;
  description: string;
  tone: NewsTone;
};

type SeasonEvent = {
  title: string;
  description: string;
  tone: NewsTone;
  marketMultiplier?: number;
  playerMultipliers?: Record<string, number>;
};

type DevEventId =
  | "hotMarket"
  | "saudiOffer"
  | "ballonDor"
  | "goldenBoy"
  | "goldenBoot"
  | "recordTransfer"
  | "wonderkid"
  | "aclInjury"
  | "majorInjury"
  | "benchWarmer"
  | "failedTransfer"
  | "freeTransfer"
  | "marketCrash"
  | "retirement"
  | "investorOffer"
  | "legendaryAuction";

type AuctionPhase =
  | "preview"
  | "bidding"
  | "finished";

type AuctionState = {
  candidates: Player[];
  selectedPlayer: Player | null;
  phase: AuctionPhase;
  timer: number;
  currentBid: number;
  highestBidder: number | null;
  replacementSlot: string | null;
};

type InvestorOfferState = {
  candidates: Player[];
  selectedPlayer: Player;
  marketValue: number;
  offerValue: number;
};

type SeasonEventResult = {
  event: SeasonEvent | null;
  updatedPlayers: GamePlayer[];
  newsItems: NewsItem[];
};

const CLASSIC_END_SEASON = 2028;
const AUCTION_PREVIEW_SECONDS = 10;

const budgetSettings: Record<
  BudgetMode,
  {
    label: string;
    budget: number;
    badEventMultiplier: number;
    goodEventMultiplier: number;
  }
> = {
  lucky: {
    label: "€10M Lucky Investor",
    budget: 10,
    badEventMultiplier: 0.75,
    goodEventMultiplier: 1.15,
  },
  balanced: {
    label: "€30M Balanced",
    budget: 30,
    badEventMultiplier: 1,
    goodEventMultiplier: 1,
  },
  rich: {
    label: "€100M Rich Investor",
    budget: 100,
    badEventMultiplier: 1.25,
    goodEventMultiplier: 0.95,
  },
  billionaire: {
    label: "€200M Billionaire",
    budget: 200,
    badEventMultiplier: 1.5,
    goodEventMultiplier: 0.9,
  },
};

const generatedFirstNames = [
  "Luca",
  "Mateo",
  "Noah",
  "Rayan",
  "Elias",
  "Adam",
  "Nico",
  "Leo",
  "Milan",
  "Ilyas",
  "Dario",
  "Kian",
  "Yanis",
  "Amir",
  "Tiago",
  "Enzo",
  "Omar",
  "Sami",
];

const generatedLastNames = [
  "Moretti",
  "Silva",
  "Kovacs",
  "Diallo",
  "Martinez",
  "Haddad",
  "Fernandes",
  "Santos",
  "Novak",
  "Mensah",
  "Benali",
  "Costa",
  "Bakker",
  "Romero",
  "Demir",
  "Fischer",
  "Mendes",
  "Vargas",
];

const generatedNationalities = [
  "Brazil",
  "Argentina",
  "France",
  "Spain",
  "Portugal",
  "Netherlands",
  "Germany",
  "Italy",
  "England",
  "Belgium",
  "Morocco",
  "Senegal",
  "Nigeria",
  "Turkey",
  "Croatia",
  "Uruguay",
];

const generatedLeagues = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Eredivisie",
  "Primeira Liga",
  "Belgian Pro League",
  "Turkish Super Lig",
  "Brazilian Serie A",
  "Argentine Primera Division",
  "MLS",
];

function pickRandom<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomId() {
  return Date.now() + Math.floor(Math.random() * 100000);
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getStartingBudget(budgetMode: BudgetMode) {
  return budgetSettings[budgetMode].budget;
}

function emptyCards(): Cards {
  return {
    freeze: {
      unlocked: false,
      used: false,
    },
    triple: {
      unlocked: false,
      used: false,
    },
    steal: {
      unlocked: false,
      used: false,
    },
  };
}

function createPlayers(budgetMode: BudgetMode): GamePlayer[] {
  const startingBudget = getStartingBudget(budgetMode);

  return [
    {
      name: "Player 1",
      budget: startingBudget,
      owned: [],
      sold: [],
      purchaseChances: 1,
      soldBonusUsedThisSeason: false,
      cards: emptyCards(),
      tripleNextSeason: false,
      frozenSeason: null,
    },
    {
      name: "Player 2",
      budget: startingBudget,
      owned: [],
      sold: [],
      purchaseChances: 1,
      soldBonusUsedThisSeason: false,
      cards: emptyCards(),
      tripleNextSeason: false,
      frozenSeason: null,
    },
  ];
}

function getBaseRating(player: Player) {
  return clampNumber(
    Math.round(player.rating ?? 70),
    0,
    99
  );
}

function calculateAge(
  player: Player,
  targetSeason: number
) {
  return (
    player.startAge +
    (targetSeason - player.availableSeason)
  );
}

function getHiddenTypeForPlayer(
  player: Player
): GeneratedPlayerType {
  if (player.secret) {
    return "talent";
  }

  if (player.hiddenType) {
    return player.hiddenType;
  }

  const rating = getBaseRating(player);

  if (rating >= 84) {
    return Math.random() < 0.55
      ? "talent"
      : "normal";
  }

  if (rating <= 70) {
    return Math.random() < 0.45
      ? "flop"
      : "normal";
  }

  const roll = Math.random();

  if (roll < 0.18) {
    return "talent";
  }

  if (roll < 0.45) {
    return "flop";
  }

  return "normal";
}

function calculateMarketValueFromStats(
  player: Player,
  targetSeason: number,
  stats: SeasonStats
) {
  const age = calculateAge(
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

function generateStatsForSeason(
  player: Player,
  targetSeason: number,
  previousStats: SeasonStats | null,
  hiddenType: GeneratedPlayerType
): SeasonStats {
  const age = calculateAge(
    player,
    targetSeason
  );

  let rating =
    previousStats?.rating ??
    getBaseRating(player) +
      randomBetween(-3, 3);

  if (hiddenType === "talent") {
    rating += randomBetween(0, 5);
  }

  if (hiddenType === "normal") {
    rating += randomBetween(-2, 2);
  }

  if (hiddenType === "flop") {
    rating += randomBetween(-6, 1);
  }

  if (age >= 30) {
    rating -= randomBetween(0, 3);
  }

  rating = clampNumber(
    Math.round(rating),
    0,
    99
  );

  const games = randomBetween(
    12,
    42
  );

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
        randomBetween(10, 38)
    );

    assists = Math.round(
      (rating / 99) *
        randomBetween(4, 18)
    );
  }

  if (
    player.position === "CM" ||
    player.position === "CAM"
  ) {
    goals = Math.round(
      (rating / 99) *
        randomBetween(2, 16)
    );

    assists = Math.round(
      (rating / 99) *
        randomBetween(5, 22)
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
        randomBetween(4, 24)
    );
  }

  const yellowCards =
    randomBetween(0, 10);

  const redCards =
    randomBetween(0, 2);

  const value =
    calculateMarketValueFromStats(
      player,
      targetSeason,
      {
        season: targetSeason,
        games,
        goals,
        assists,
        cleanSheets,
        yellowCards,
        redCards,
        rating,
        value: 1,
      }
    );

  return {
    season: targetSeason,
    games,
    goals,
    assists,
    cleanSheets,
    yellowCards,
    redCards,
    rating,
    value,
  };
}

function buildDynamicCareer(
  player: Player
): Player {
  const hiddenType =
    getHiddenTypeForPlayer(player);

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
    let s = player.availableSeason;
    s <= CLASSIC_END_SEASON;
    s++
  ) {
    const stats =
      generateStatsForSeason(
        player,
        s,
        previousStats,
        hiddenType
      );

    statsBySeason[s] = stats;
    values[s] = stats.value;

    previousStats = stats;
  }

  return {
    ...player,
    hiddenType,
    rating:
      statsBySeason[
        player.availableSeason
      ]?.rating ??
      player.rating ??
      70,
    values,
    statsBySeason,
  };
}

function buildDynamicPlayers(
  list: Player[]
) {
  return list.map((player) =>
    buildDynamicCareer(player)
  );
}

function getSeasonStats(
  player: Player,
  targetSeason: number
): SeasonStats {
  const stats =
    player.statsBySeason?.[targetSeason];

  if (stats) {
    return stats;
  }

  return {
    season: targetSeason,
    games: player.games ?? 0,
    goals: player.goals ?? 0,
    assists: player.assists ?? 0,
    cleanSheets: player.cleanSheets ?? 0,
    yellowCards: player.yellowCards ?? 0,
    redCards: player.redCards ?? 0,
    rating: getBaseRating(player),
    value:
      player.values?.[targetSeason] ??
      player.values?.[player.availableSeason] ??
      1,
  };
}

function applyStatsModifier(
  player: Player,
  targetSeason: number,
  modifier: Partial<SeasonStats>
): Player {
  const oldStats =
    getSeasonStats(
      player,
      targetSeason
    );

  const newStats: SeasonStats = {
    ...oldStats,
    ...modifier,
    rating: clampNumber(
      Math.round(
        modifier.rating ??
          oldStats.rating
      ),
      0,
      99
    ),
  };

  newStats.value =
    modifier.value ??
    calculateMarketValueFromStats(
      player,
      targetSeason,
      newStats
    );

  return {
    ...player,
    rating: newStats.rating,
    games: newStats.games,
    goals: newStats.goals,
    assists: newStats.assists,
    cleanSheets:
      newStats.cleanSheets,
    yellowCards:
      newStats.yellowCards,
    redCards:
      newStats.redCards,
    values: {
      ...(player.values ?? {}),
      [targetSeason]:
        newStats.value,
    },
    statsBySeason: {
      ...(player.statsBySeason ?? {}),
      [targetSeason]:
        newStats,
    },
  };
}

function getRetirementChance(
  age: number
) {
  if (age < 30) return 0;
  if (age <= 32) return 0.02;
  if (age <= 35) return 0.05;
  if (age <= 38) return 0.1;

  return 0.2;
}

function shouldPlayerRetire(
  player: Player,
  targetSeason: number
) {
  if (player.secret) {
    return false;
  }

  const age =
    calculateAge(
      player,
      targetSeason
    );

  const chance =
    getRetirementChance(
      age
    );

  if (chance <= 0) {
    return false;
  }

  return Math.random() < chance;
}

function applyRetirementSystem(
  newSeason: number,
  list: GamePlayer[]
): {
  updatedPlayers: GamePlayer[];
  retirementNews: NewsItem[];
} {
  const retirementNews: NewsItem[] =
    [];

  const updatedPlayers =
    list.map((gp) => {
      const keptOwned: Owned[] =
        [];

      gp.owned.forEach((item) => {
        const player =
          item.player;

        const age =
          calculateAge(
            player,
            newSeason
          );

        if (
          shouldPlayerRetire(
            player,
            newSeason
          )
        ) {
          retirementNews.push({
            id: randomId(),
            season:
              newSeason,
            title:
              "👋 Retirement",
            description:
              `${gp.name}: ${player.name} retired at age ${age}. No money was received.`,
            tone:
              "bad",
          });

          return;
        }

        keptOwned.push(item);
      });

      return {
        ...gp,
        owned:
          keptOwned,
      };
    });

  return {
    updatedPlayers,
    retirementNews,
  };
}

function getRetirementWarningText(
  player: Player,
  targetSeason: number
) {
  const age =
    calculateAge(
      player,
      targetSeason
    );

  if (age < 30) {
    return null;
  }

  if (age <= 32) {
    return "Low retirement risk";
  }

  if (age <= 35) {
    return "Medium retirement risk";
  }

  if (age <= 38) {
    return "High retirement risk";
  }

  return "Very high retirement risk";
}

function createInvestorOfferValue(
  marketValue: number
) {
  const minOffer =
    Math.max(
      1,
      Math.round(
        marketValue * 0.7
      )
    );

  const maxOffer =
    Math.max(
      minOffer,
      Math.round(
        marketValue * 1.7
      )
    );

  return randomBetween(
    minOffer,
    maxOffer
  );
}

function getInvestorOfferCandidates(
  playerPool: Player[],
  currentSeason: number,
  list: GamePlayer[]
) {
  const ownedNames =
    new Set(
      list.flatMap((gp) =>
        gp.owned.map(
          (item) =>
            item.player.name
        )
      )
    );

  return shuffle(
    playerPool.filter(
      (player) =>
        player.availableSeason === currentSeason &&
        !ownedNames.has(player.name)
    )
  ).slice(0, 3);
}

function createInvestorOfferState(
  playerPool: Player[],
  currentSeason: number,
  list: GamePlayer[],
  getValue: (player: Player) => number
): InvestorOfferState | null {
  const candidates =
    getInvestorOfferCandidates(
      playerPool,
      currentSeason,
      list
    );

  if (candidates.length === 0) {
    return null;
  }

  const selectedPlayer =
    pickRandom(candidates);

  const marketValue =
    getValue(selectedPlayer);

  const offerValue =
    createInvestorOfferValue(
      marketValue
    );

  return {
    candidates,
    selectedPlayer,
    marketValue,
    offerValue,
  };
}

function acceptInvestorOffer(
  offer: InvestorOfferState,
  activeIndex: number,
  currentSeason: number,
  list: GamePlayer[]
) {
  const player =
    offer.selectedPlayer;

  const price =
    offer.offerValue;

  const slot =
    player.position;

  return list.map((gp, index) => {
    if (index !== activeIndex) {
      return gp;
    }

    const filteredOwned =
      gp.owned.filter(
        (item) =>
          slotToPosition(item.slot) !==
          player.position
      );

    return {
      ...gp,
      budget:
        gp.budget - price,
      owned: [
        ...filteredOwned,
        {
          player,
          slot,
          buySeason:
            currentSeason,
          buyPrice:
            price,
        },
      ],
    };
  });
}

type PlayerEventEffect = {
  title: string;
  tone: NewsTone;
  multiplier: number;
  ratingChange: number;
  gamesChange: number;
  goalsChange: number;
  assistsChange: number;
  cleanSheetsChange: number;
};

function getPositivePlayerEvent(): PlayerEventEffect {
  const events: PlayerEventEffect[] = [
    {
      title: "🏆 Ballon d'Or Winner",
      tone: "good",
      multiplier: 1.4,
      ratingChange: 5,
      gamesChange: 4,
      goalsChange: 10,
      assistsChange: 6,
      cleanSheetsChange: 0,
    },
    {
      title: "👟 Golden Boot",
      tone: "good",
      multiplier: 1.35,
      ratingChange: 4,
      gamesChange: 3,
      goalsChange: 18,
      assistsChange: 2,
      cleanSheetsChange: 0,
    },
    {
      title: "🌟 Golden Boy",
      tone: "good",
      multiplier: 1.6,
      ratingChange: 6,
      gamesChange: 5,
      goalsChange: 8,
      assistsChange: 6,
      cleanSheetsChange: 0,
    },
    {
      title: "🚀 Wonderkid Explosion",
      tone: "good",
      multiplier: 2,
      ratingChange: 7,
      gamesChange: 6,
      goalsChange: 12,
      assistsChange: 8,
      cleanSheetsChange: 0,
    },
    {
      title: "💰 Saudi Offer",
      tone: "good",
      multiplier: 1.5,
      ratingChange: 2,
      gamesChange: 1,
      goalsChange: 2,
      assistsChange: 2,
      cleanSheetsChange: 0,
    },
  ];

  return pickRandom(events);
}

function getNegativePlayerEvent(): PlayerEventEffect {
  const events: PlayerEventEffect[] = [
    {
      title: "🤕 ACL Injury",
      tone: "bad",
      multiplier: 0.5,
      ratingChange: -6,
      gamesChange: -25,
      goalsChange: -12,
      assistsChange: -8,
      cleanSheetsChange: -8,
    },
    {
      title: "🚑 Major Injury",
      tone: "bad",
      multiplier: 0.2,
      ratingChange: -10,
      gamesChange: -35,
      goalsChange: -20,
      assistsChange: -14,
      cleanSheetsChange: -12,
    },
    {
      title: "🪑 Bench Warmer",
      tone: "bad",
      multiplier: 0.7,
      ratingChange: -4,
      gamesChange: -20,
      goalsChange: -8,
      assistsChange: -6,
      cleanSheetsChange: -5,
    },
    {
      title: "📉 Failed Transfer",
      tone: "bad",
      multiplier: 0.6,
      ratingChange: -5,
      gamesChange: -10,
      goalsChange: -7,
      assistsChange: -5,
      cleanSheetsChange: -3,
    },
  ];

  return pickRandom(events);
}

function applyEventToPlayer(
  player: Player,
  targetSeason: number,
  effect: PlayerEventEffect
): Player {
  const stats =
    getSeasonStats(
      player,
      targetSeason
    );

  const newStats: SeasonStats = {
    ...stats,

    games: clampNumber(
      stats.games +
        effect.gamesChange,
      0,
      60
    ),

    goals: clampNumber(
      stats.goals +
        effect.goalsChange,
      0,
      80
    ),

    assists: clampNumber(
      stats.assists +
        effect.assistsChange,
      0,
      60
    ),

    cleanSheets:
      clampNumber(
        stats.cleanSheets +
          effect.cleanSheetsChange,
        0,
        40
      ),

    rating: clampNumber(
      stats.rating +
        effect.ratingChange,
      0,
      99
    ),
  };

  const calculatedValue =
    calculateMarketValueFromStats(
      player,
      targetSeason,
      newStats
    );

  newStats.value =
    Math.max(
      1,
      Math.round(
        calculatedValue *
          effect.multiplier
      )
    );

  return applyStatsModifier(
    player,
    targetSeason,
    newStats
  );
}

function createDetailedPlayerEventNews(
  season: number,
  ownerName: string,
  playerBefore: Player,
  playerAfter: Player,
  effect: PlayerEventEffect
): NewsItem {
  const beforeStats =
    getSeasonStats(
      playerBefore,
      season
    );

  const afterStats =
    getSeasonStats(
      playerAfter,
      season
    );

  return {
    id: randomId(),
    season,
    title: effect.title,
    description:
      `${ownerName}: ${playerBefore.name} | ` +
      `Rating ${beforeStats.rating} → ${afterStats.rating} | ` +
      `Games ${beforeStats.games} → ${afterStats.games} | ` +
      `Goals ${beforeStats.goals} → ${afterStats.goals} | ` +
      `Assists ${beforeStats.assists} → ${afterStats.assists} | ` +
      `Value €${beforeStats.value}M → €${afterStats.value}M`,
    tone: effect.tone,
  };
}

function applyRandomPlayerEventToOwner(
  newSeason: number,
  list: GamePlayer[],
  playerIndex: number,
  positive: boolean
): {
  updatedPlayers: GamePlayer[];
  newsItem: NewsItem | null;
} {
  const owner =
    list[playerIndex];

  if (!owner || owner.owned.length === 0) {
    return {
      updatedPlayers: list,
      newsItem: null,
    };
  }

  const ownedCandidates =
    owner.owned.filter(
      (item) =>
        !item.player.secret
    );

  if (ownedCandidates.length === 0) {
    return {
      updatedPlayers: list,
      newsItem: null,
    };
  }

  const picked =
    pickRandom(
      ownedCandidates
    );

  const effect =
    positive
      ? getPositivePlayerEvent()
      : getNegativePlayerEvent();

  const playerBefore =
    picked.player;

  const playerAfter =
    applyEventToPlayer(
      picked.player,
      newSeason,
      effect
    );

  const updatedPlayers =
    list.map((gp, gpIndex) => {
      if (gpIndex !== playerIndex) {
        return gp;
      }

      return {
        ...gp,
        owned:
          gp.owned.map((item) =>
            item.player.name === picked.player.name
              ? {
                  ...item,
                  player: playerAfter,
                }
              : item
          ),
      };
    });

  return {
    updatedPlayers,
    newsItem:
      createDetailedPlayerEventNews(
        newSeason,
        owner.name,
        playerBefore,
        playerAfter,
        effect
      ),
  };
}

function createSharedMarketEvent(
  newSeason: number,
  list: GamePlayer[],
  positive: boolean
): SeasonEventResult {
  const multiplier =
    positive ? 1.2 : 0.8;

  const title =
    positive
      ? "🔥 Hot Market"
      : "📉 Market Crash";

  const description =
    positive
      ? "All player values increased by 20%."
      : "All player values dropped by 20%.";

  return {
    event: {
      title,
      description,
      tone:
        positive
          ? "good"
          : "bad",
      marketMultiplier:
        multiplier,
    },
    updatedPlayers:
      list,
    newsItems: [
      {
        id: randomId(),
        season: newSeason,
        title,
        description,
        tone:
          positive
            ? "good"
            : "bad",
      },
    ],
  };
}

function createRandomSeasonEventV17(
  newSeason: number,
  list: GamePlayer[]
): SeasonEventResult {
  const newsItems: NewsItem[] = [];

  let updatedPlayers = [...list];

  const roll = Math.random();

  if (roll < 0.2) {
    return {
      event: null,
      updatedPlayers,
      newsItems: [
        {
          id: randomId(),
          season: newSeason,
          title: "📰 Quiet Season",
          description:
            "No major football events happened this season.",
          tone: "neutral",
        },
      ],
    };
  }

  if (roll < 0.4) {
    return createSharedMarketEvent(
      newSeason,
      updatedPlayers,
      true
    );
  }

  if (roll < 0.6) {
    return createSharedMarketEvent(
      newSeason,
      updatedPlayers,
      false
    );
  }

  if (roll < 0.8) {
    const result =
      applyRandomPlayerEventToOwner(
        newSeason,
        updatedPlayers,
        0,
        Math.random() > 0.5
      );

    updatedPlayers =
      result.updatedPlayers;

    if (result.newsItem) {
      newsItems.push(
        result.newsItem
      );
    }

    return {
      event: null,
      updatedPlayers,
      newsItems,
    };
  }

  const p1 =
    applyRandomPlayerEventToOwner(
      newSeason,
      updatedPlayers,
      0,
      Math.random() > 0.5
    );

  updatedPlayers =
    p1.updatedPlayers;

  if (p1.newsItem) {
    newsItems.push(
      p1.newsItem
    );
  }

  const p2 =
    applyRandomPlayerEventToOwner(
      newSeason,
      updatedPlayers,
      1,
      Math.random() > 0.5
    );

  updatedPlayers =
    p2.updatedPlayers;

  if (p2.newsItem) {
    newsItems.push(
      p2.newsItem
    );
  }

  return {
    event: null,
    updatedPlayers,
    newsItems,
  };
}

function canAffordInvestorOffer(
  offer: InvestorOfferState,
  gp: GamePlayer
) {
  return gp.budget >= offer.offerValue;
}

function getInvestorOfferProfitText(
  offer: InvestorOfferState
) {
  const difference =
    offer.offerValue -
    offer.marketValue;

  if (difference > 0) {
    return `Above market by €${difference}M`;
  }

  if (difference < 0) {
    return `Below market by €${Math.abs(difference)}M`;
  }

  return "Fair market value";
}

function getInvestorOfferTone(
  offer: InvestorOfferState
) {
  const ratio =
    offer.offerValue /
    offer.marketValue;

  if (ratio <= 0.85) {
    return "good";
  }

  if (ratio >= 1.35) {
    return "bad";
  }

  return "neutral";
}

function getInvestorOfferMessage(
  offer: InvestorOfferState
) {
  const tone =
    getInvestorOfferTone(
      offer
    );

  if (tone === "good") {
    return "This looks like a bargain.";
  }

  if (tone === "bad") {
    return "This offer is expensive.";
  }

  return "This is a balanced offer.";
}

function createInvestorOfferNews(
  season: number,
  playerName: string,
  offerValue: number,
  marketValue: number,
  accepted: boolean
): NewsItem {
  return {
    id: randomId(),
    season,
    title: accepted
      ? "💼 Investor Offer Accepted"
      : "💼 Investor Offer Rejected",
    description: accepted
      ? `${playerName} joined for €${offerValue}M. Market value was €${marketValue}M.`
      : `${playerName} offer was rejected. Offer was €${offerValue}M while market value was €${marketValue}M.`,
    tone: accepted
      ? "special"
      : "neutral",
  };
}

function createGeneratedPlayer(
  season: number,
  position: Position
): Player {
  const typeRoll =
    Math.random();

  let hiddenType: GeneratedPlayerType;

  if (typeRoll < 0.15) {
    hiddenType = "talent";
  } else if (typeRoll < 0.45) {
    hiddenType = "flop";
  } else {
    hiddenType = "normal";
  }

  const player: Player = {
    name:
      `${pickRandom(generatedFirstNames)} ${pickRandom(generatedLastNames)}`,
    position,
    availableSeason:
      season,
    startAge:
      randomBetween(17, 22),
    nationality:
      pickRandom(generatedNationalities),
    height:
      randomBetween(168, 198),
    league:
      pickRandom(generatedLeagues),
    hiddenType,
    rating:
      hiddenType === "talent"
        ? randomBetween(78, 88)
        : hiddenType === "normal"
        ? randomBetween(68, 80)
        : randomBetween(55, 72),
  };

  return buildDynamicCareer(player);
}

const secretPlayers: Player[] = [
  buildDynamicCareer({
    name: "Yousef Alnuwasser",
    position: "ST",
    availableSeason: 2016,
    startAge: 18,
    nationality: "Saudi Arabia",
    height: 185,
    league: "Saudi Pro League",
    games: 38,
    goals: 70,
    assists: 30,
    rating: 99,
    secret: true,
    hiddenType: "talent",
  }),
];

const rawBasePlayers: Player[] = [
  ...players2008,
  ...players2009,
  ...players2010,
  ...players2011,
  ...players2012,
  ...players2013,
  ...players2014,
  ...players2015,
  ...players2016,
  ...players2017,
  ...players2018,
  ...players2019,
  ...players2020,
  ...players2021,
  ...players2022,
  ...players2023,
  ...players2024,
  ...players2025,
  ...players2026,
  ...players2027,
  ...players2028,
];

const formation433 = [
  ["LW", "", "ST", "", "RW"],
  ["", "", "CAM", "", ""],
  ["", "LCM", "", "RCM", ""],
  ["LB", "LCB", "", "RCB", "RB"],
  ["", "", "GK", "", ""],
];

function slotToPosition(slot: string) {
  if (slot === "LCM" || slot === "RCM") {
    return "CM";
  }

  if (slot === "LCB" || slot === "RCB") {
    return "CB";
  }

  return slot;
}

function shuffle<T>(list: T[]) {
  return [...list].sort(
    () => Math.random() - 0.5
  );
}

function getAuctionTimerByBid(bid: number) {
  if (bid >= 100) {
    return 5;
  }

  if (bid >= 50) {
    return 10;
  }

  return 15;
}

export default function Home() {
  const [mode, setMode] =
    useState<"single" | "versus" | null>(null);

  const [gameLengthMode, setGameLengthMode] =
    useState<GameLengthMode | null>(null);

  const [budgetMode, setBudgetMode] =
    useState<BudgetMode>("balanced");

  const [eventsEnabled, setEventsEnabled] =
    useState(true);

  const [eventType, setEventType] =
    useState<EventType>("all");

  const [showHowToPlay, setShowHowToPlay] =
    useState(false);

  const [started, setStarted] =
    useState(false);

  const [season, setSeason] =
    useState(2008);

  const [gamePlayers, setGamePlayers] =
    useState<GamePlayer[]>(
      createPlayers("balanced")
    );

  const [
    generatedPlayersBySeason,
    setGeneratedPlayersBySeason,
  ] =
    useState<Record<number, Player[]>>({});

  const [basePlayers, setBasePlayers] =
    useState<Player[]>([]);

  const [selectedSlot, setSelectedSlot] =
    useState("");

  const [pendingSlot, setPendingSlot] =
    useState<string | null>(null);

  const [showPlayerModal, setShowPlayerModal] =
    useState(false);

  const [
    selectedOwnedAction,
    setSelectedOwnedAction,
  ] =
    useState<{
      playerIndex: number;
      ownedIndex: number;
    } | null>(null);

  const [showEndModal, setShowEndModal] =
    useState(false);

  const [showStats, setShowStats] =
    useState(false);

  const [selectedTime, setSelectedTime] =
    useState<number | null>(15);

  const [timer, setTimer] =
    useState(15);

  const [timerActive, setTimerActive] =
    useState(false);

  const [turnIndex, setTurnIndex] =
    useState(0);

  const [easterClicks, setEasterClicks] =
    useState(0);

  const [easterUnlocked, setEasterUnlocked] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [
    seasonSecretClicks,
    setSeasonSecretClicks,
  ] =
    useState(0);

  const [
    showDeveloperPanel,
    setShowDeveloperPanel,
  ] =
    useState(false);

  const [auctionState, setAuctionState] =
    useState<AuctionState | null>(null);

  const [investorOffer, setInvestorOffer] =
    useState<InvestorOfferState | null>(null);

  const [rewardChoice, setRewardChoice] =
    useState<{
      playerIndex: number;
      cards: RewardCard[];
    } | null>(null);

  const [stealChallenge, setStealChallenge] =
    useState<{
      userIndex: number;
      showHelp: boolean;
      success: boolean;
      ownIndex: number | null;
      enemyIndex: number | null;
    } | null>(null);

  const [seasonEvent, setSeasonEvent] =
    useState<SeasonEvent | null>(null);

  const [news, setNews] =
    useState<NewsItem[]>([]);

  const activePlayerIndex =
    mode === "versus"
      ? turnIndex
      : 0;

  const activePlayer =
    gamePlayers[
      activePlayerIndex
    ];

  const isFrozen =
    activePlayer?.frozenSeason ===
    season;

  useEffect(() => {
    if (basePlayers.length > 0) {
      return;
    }

    setBasePlayers(
      buildDynamicPlayers(
        rawBasePlayers
      )
    );
  }, [
    basePlayers.length,
  ]);

  useEffect(() => {
    if (
      gameLengthMode !== "infinite" ||
      season <= 2028
    ) {
      return;
    }

    if (
      generatedPlayersBySeason[
        season
      ]
    ) {
      return;
    }

    const positions: Position[] = [
      "GK",
      "LB",
      "CB",
      "RB",
      "CM",
      "CAM",
      "LW",
      "RW",
      "ST",
    ];

    const generated: Player[] = [];

    positions.forEach((position) => {
      for (let i = 0; i < 12; i++) {
        generated.push(
          createGeneratedPlayer(
            season,
            position
          )
        );
      }
    });

    setGeneratedPlayersBySeason(
      (prev) => ({
        ...prev,
        [season]: generated,
      })
    );
  }, [
    season,
    gameLengthMode,
    generatedPlayersBySeason,
  ]);

  const players =
    useMemo<Player[]>(() => {
      const normalPlayers =
        easterUnlocked
          ? [
              ...basePlayers,
              ...secretPlayers,
            ]
          : basePlayers;

      const generated =
        generatedPlayersBySeason[
          season
        ] ?? [];

      return [
        ...normalPlayers,
        ...generated,
      ];
    }, [
      easterUnlocked,
      season,
      basePlayers,
      generatedPlayersBySeason,
    ]);

  function notify(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  function addNews(
    item: Omit<NewsItem, "id">
  ) {
    setNews((prev) => [
      {
        ...item,
        id: randomId(),
      },
      ...prev,
    ]);
  }

  function addNewsItem(
    item: NewsItem
  ) {
    setNews((prev) => [
      item,
      ...prev,
    ]);
  }

  function updateGamePlayer(
    index: number,
    newData: GamePlayer
  ) {
    setGamePlayers((prev) =>
      prev.map((p, i) =>
        i === index
          ? newData
          : p
      )
    );
  }

  function currentValue(
    player: Player
  ) {
    const stats =
      getSeasonStats(
        player,
        season
      );

    let value =
      stats.value;

    if (
      seasonEvent?.marketMultiplier
    ) {
      value *=
        seasonEvent.marketMultiplier;
    }

    if (
      seasonEvent
        ?.playerMultipliers?.[
        player.name
      ]
    ) {
      value *=
        seasonEvent.playerMultipliers[
          player.name
        ];
    }

    return Math.max(
      1,
      Math.round(value)
    );
  }

  function currentAge(
    player: Player
  ) {
    return calculateAge(
      player,
      season
    );
  }

  function getOwnedBySlot(
    playerIndex: number,
    slot: string
  ) {
    return gamePlayers[
      playerIndex
    ].owned.find(
      (item) =>
        item.slot === slot
    );
  }

  function getOwnedIndexBySlot(
    playerIndex: number,
    slot: string
  ) {
    return gamePlayers[
      playerIndex
    ].owned.findIndex(
      (item) =>
        item.slot === slot
    );
  }

  function getOptions(
    slot: string
  ): Player[] {
    const realPosition =
      slotToPosition(slot);

    return shuffle(
      players.filter(
        (p) =>
          p.position === realPosition &&
          p.availableSeason === season &&
          !gamePlayers.some(
            (team) =>
              team.owned.some(
                (item) =>
                  item.player.name ===
                  p.name
              )
          )
      )
    ).slice(0, 5);
  }

  const options =
    useMemo<Player[]>(() => {
      if (!selectedSlot) {
        return [];
      }

      return getOptions(
        selectedSlot
      );
    }, [
      selectedSlot,
      season,
      gamePlayers,
      players,
    ]);

  function openDeveloperPanel() {
    setShowDeveloperPanel(true);
  }

  function closeDeveloperPanel() {
    setShowDeveloperPanel(false);
  }

  function handleSeasonSecretClick() {
    const next =
      seasonSecretClicks + 1;

    setSeasonSecretClicks(next);

    if (next >= 20) {
      openDeveloperPanel();

      notify(
        "Developer Panel Unlocked"
      );
    }
  }

  function triggerLegendaryAuction() {
    const candidates =
      shuffle(
        players.filter(
          (p) =>
            p.availableSeason ===
            season
        )
      ).slice(0, 3);

    if (candidates.length === 0) {
      return notify(
        "No auction players available"
      );
    }

    setAuctionState({
      candidates,
      selectedPlayer: null,
      phase: "preview",
      timer: AUCTION_PREVIEW_SECONDS,
      currentBid: 0,
      highestBidder: null,
      replacementSlot: null,
    });

    addNews({
      season,
      title: "🏆 Legendary Auction",
      description:
        "A rare auction event has started.",
      tone: "special",
    });
  }

  function triggerInvestorOffer() {
    const offer =
      createInvestorOfferState(
        players,
        season,
        gamePlayers,
        currentValue
      );

    if (!offer) {
      return notify(
        "No investor offer available"
      );
    }

    setInvestorOffer(offer);

    addNews({
      season,
      title: "💼 Investor Offer",
      description:
        `${offer.selectedPlayer.name} received an investor offer worth €${offer.offerValue}M. Market value is €${offer.marketValue}M.`,
      tone: "special",
    });
  }

  function acceptCurrentInvestorOffer() {
    if (!investorOffer) {
      return;
    }

    const gp =
      gamePlayers[
        activePlayerIndex
      ];

    if (
      !canAffordInvestorOffer(
        investorOffer,
        gp
      )
    ) {
      return notify(
        "الميزانية غير كافية لقبول العرض"
      );
    }

    const updatedPlayers =
      acceptInvestorOffer(
        investorOffer,
        activePlayerIndex,
        season,
        gamePlayers
      );

    setGamePlayers(
      updatedPlayers
    );

    addNewsItem(
      createInvestorOfferNews(
        season,
        investorOffer.selectedPlayer.name,
        investorOffer.offerValue,
        investorOffer.marketValue,
        true
      )
    );

    notify(
      `تم قبول عرض ${investorOffer.selectedPlayer.name}`
    );

    setInvestorOffer(null);
  }

  function rejectCurrentInvestorOffer() {
    if (!investorOffer) {
      return;
    }

    addNewsItem(
      createInvestorOfferNews(
        season,
        investorOffer.selectedPlayer.name,
        investorOffer.offerValue,
        investorOffer.marketValue,
        false
      )
    );

    notify(
      "تم رفض العرض"
    );

    setInvestorOffer(null);
  }

  function runDeveloperEvent(
    eventId: DevEventId
  ) {
    if (eventId === "legendaryAuction") {
      triggerLegendaryAuction();
      return;
    }

    if (eventId === "investorOffer") {
      triggerInvestorOffer();
      return;
    }

    if (eventId === "retirement") {
      const result =
        applyRetirementSystem(
          season,
          gamePlayers
        );

      setGamePlayers(
        result.updatedPlayers
      );

      setNews((prev) => [
        ...result.retirementNews,
        ...prev,
      ]);

      notify(
        "Retirement check completed"
      );

      return;
    }

    const positiveEvents: DevEventId[] = [
      "hotMarket",
      "saudiOffer",
      "ballonDor",
      "goldenBoy",
      "goldenBoot",
      "recordTransfer",
      "wonderkid",
    ];

    const negativeEvents: DevEventId[] = [
      "aclInjury",
      "majorInjury",
      "benchWarmer",
      "failedTransfer",
      "freeTransfer",
      "marketCrash",
    ];

    if (positiveEvents.includes(eventId)) {
      const result =
        applyRandomPlayerEventToOwner(
          season,
          gamePlayers,
          activePlayerIndex,
          true
        );

      setGamePlayers(
        result.updatedPlayers
      );

      if (result.newsItem) {
        addNewsItem(result.newsItem);
      }

      return;
    }

    if (negativeEvents.includes(eventId)) {
      const result =
        applyRandomPlayerEventToOwner(
          season,
          gamePlayers,
          activePlayerIndex,
          false
        );

      setGamePlayers(
        result.updatedPlayers
      );

      if (result.newsItem) {
        addNewsItem(result.newsItem);
      }
    }
  }

  function buyPlayer(
    player: Player,
    slot: string = selectedSlot
  ) {
    const gp =
      gamePlayers[
        activePlayerIndex
      ];

    const price =
      currentValue(
        player
      );

    if (!slot) {
      return;
    }

    if (isFrozen) {
      return notify(
        "أنت مجمد هذا الموسم 🧊"
      );
    }

    if (gp.purchaseChances <= 0) {
      return notify(
        "ما عندك فرص شراء"
      );
    }

    if (gp.budget < price) {
      return notify(
        "الميزانية غير كافية"
      );
    }

    if (
      getOwnedBySlot(
        activePlayerIndex,
        slot
      )
    ) {
      return notify(
        "هذا المركز مشغول"
      );
    }

    const alreadyOwned =
      gamePlayers.some((team) =>
        team.owned.some(
          (item) =>
            item.player.name ===
            player.name
        )
      );

    if (alreadyOwned) {
      return notify(
        "اللاعب مملوك بالفعل"
      );
    }

    const updatedPlayer: GamePlayer = {
      ...gp,
      budget:
        gp.budget - price,
      purchaseChances:
        gp.purchaseChances - 1,
      owned: [
        ...gp.owned,
        {
          player,
          slot,
          buySeason:
            season,
          buyPrice:
            price,
        },
      ],
    };

    const updatedList =
      gamePlayers.map((p, i) =>
        i === activePlayerIndex
          ? updatedPlayer
          : p
      );

    setGamePlayers(updatedList);

    addNews({
      season,
      title: "✅ New Signing",
      description:
        `${gp.name} signed ${player.name} for €${price}M`,
      tone: "special",
    });

    notify(
      `${player.name} signed`
    );

    setSelectedSlot("");
    setPendingSlot(null);
    setShowPlayerModal(false);
    setTimerActive(false);

    if (mode === "versus") {
      endVersusTurn(updatedList);
    }
  }

  function eligibleCards(
    gp: GamePlayer,
    sellPrice: number
  ): RewardCard[] {
    const cards: RewardCard[] = [];

    if (
      sellPrice >= 20 &&
      !gp.cards.freeze.unlocked &&
      !gp.cards.freeze.used
    ) {
      cards.push("freeze");
    }

    if (
      sellPrice >= 40 &&
      !gp.cards.triple.unlocked &&
      !gp.cards.triple.used
    ) {
      cards.push("triple");
    }

    if (
      sellPrice >= 50 &&
      !gp.cards.steal.unlocked &&
      !gp.cards.steal.used
    ) {
      cards.push("steal");
    }

    return cards;
  }

  function sellPlayer(
    playerIndex: number,
    ownedIndex: number
  ) {
    const gp =
      gamePlayers[
        playerIndex
      ];

    const item =
      gp.owned[
        ownedIndex
      ];

    const sellPrice =
      currentValue(
        item.player
      );

    const profit =
      sellPrice -
      item.buyPrice;

    const extraChance =
      gp.soldBonusUsedThisSeason
        ? 0
        : 1;

    const soldItem: Sold = {
      owner: gp.name,
      name: item.player.name,
      buySeason:
        item.buySeason,
      sellSeason:
        season,
      buyPrice:
        item.buyPrice,
      sellPrice,
      profit,
    };

    const updatedPlayer: GamePlayer = {
      ...gp,
      budget:
        gp.budget + sellPrice,
      purchaseChances:
        gp.purchaseChances + extraChance,
      soldBonusUsedThisSeason:
        true,
      sold: [
        soldItem,
        ...gp.sold,
      ],
      owned:
        gp.owned.filter(
          (_, i) =>
            i !== ownedIndex
        ),
    };

    updateGamePlayer(
      playerIndex,
      updatedPlayer
    );

    setSelectedOwnedAction(null);

    addNews({
      season,
      title: "💰 Player Sold",
      description:
        `${item.player.name} sold for €${sellPrice}M`,
      tone:
        profit >= 0
          ? "good"
          : "bad",
    });

    notify(
      `${item.player.name} sold`
    );

    const cards =
      eligibleCards(
        gp,
        sellPrice
      );

    if (cards.length > 0) {
      setRewardChoice({
        playerIndex,
        cards,
      });
    }
  }

  function chooseReward(
    card: RewardCard
  ) {
    if (!rewardChoice) {
      return;
    }

    const ownerName =
      gamePlayers[
        rewardChoice.playerIndex
      ].name;

    setGamePlayers((prev) =>
      prev.map((gp, i) => {
        if (
          i !==
          rewardChoice.playerIndex
        ) {
          return gp;
        }

        return {
          ...gp,
          cards: {
            ...gp.cards,
            [card]: {
              unlocked: true,
              used: false,
            },
          },
        };
      })
    );

    addNews({
      season,
      title: "🎴 Special Card Unlocked",
      description:
        `${ownerName} unlocked ${cardName(card)}.`,
      tone: "special",
    });

    setRewardChoice(null);

    notify(
      "تم فتح كرت خاص ✅"
    );
  }

  function endVersusTurn(
    updatedList?: GamePlayer[]
  ) {
    setTimerActive(false);

    if (selectedTime !== null) {
      setTimer(selectedTime);
    }

    if (turnIndex === 0) {
      setTurnIndex(1);
      return;
    }

    setTurnIndex(0);

    nextSeason(updatedList);
  }

  function autoPickFromSelectedSlot() {
    const gp =
      gamePlayers[
        activePlayerIndex
      ];

    if (!selectedSlot) {
      return;
    }

    if (
      gp.purchaseChances <= 0
    ) {
      return;
    }

    if (isFrozen) {
      return;
    }

    const affordable =
      options.filter(
        (p) =>
          currentValue(p) <=
          gp.budget
      );

    if (
      affordable.length === 0
    ) {
      setSelectedSlot("");
      setPendingSlot(null);
      setShowPlayerModal(false);
      setTimerActive(false);

      if (
        mode === "versus"
      ) {
        endVersusTurn();
      }

      return;
    }

    const randomPlayer =
      pickRandom(
        affordable
      );

    buyPlayer(
      randomPlayer,
      selectedSlot
    );
  }

  function finishGame() {
    const finalPlayers =
      gamePlayers.map((gp) => {
        const autoSold: Sold[] =
          gp.owned.map((item) => {
            const sellPrice =
              currentValue(
                item.player
              );

            return {
              owner: gp.name,
              name:
                item.player.name,
              buySeason:
                item.buySeason,
              sellSeason:
                season,
              buyPrice:
                item.buyPrice,
              sellPrice,
              profit:
                sellPrice -
                item.buyPrice,
            };
          });

        const autoMoney =
          autoSold.reduce(
            (sum, s) =>
              sum +
              s.sellPrice,
            0
          );

        return {
          ...gp,
          budget:
            gp.budget +
            autoMoney,
          sold: [
            ...autoSold,
            ...gp.sold,
          ],
          owned: [],
        };
      });

    setGamePlayers(
      finalPlayers
    );

    setShowEndModal(
      true
    );
  }

  function setupSeasonV17(
    newSeason: number,
    list: GamePlayer[]
  ) {
    const resetPlayers =
      list.map((gp) => {
        const chances =
          gp.tripleNextSeason
            ? 3
            : 1;

        return {
          ...gp,
          purchaseChances:
            gp.frozenSeason ===
            newSeason
              ? 0
              : chances,
          soldBonusUsedThisSeason:
            false,
          tripleNextSeason:
            false,
        };
      });

    const retirementResult =
      applyRetirementSystem(
        newSeason,
        resetPlayers
      );

    return retirementResult;
  }

  function nextSeason(
    listOverride?: GamePlayer[]
  ) {
    if (selectedSlot) {
      return notify(
        "يجب إنهاء اختيار اللاعب أولاً"
      );
    }

    if (auctionState) {
      return notify(
        "يوجد مزاد نشط حالياً"
      );
    }

    if (investorOffer) {
      return notify(
        "يوجد عرض مستثمر مفتوح حالياً"
      );
    }

    const currentList =
      listOverride ??
      gamePlayers;

    if (
      gameLengthMode === "classic" &&
      season >= CLASSIC_END_SEASON
    ) {
      finishGame();
      return;
    }

    const newSeason =
      season + 1;

    const seasonSetup =
      setupSeasonV17(
        newSeason,
        currentList
      );

    const eventResult =
      eventsEnabled
        ? createRandomSeasonEventV17(
            newSeason,
            seasonSetup.updatedPlayers
          )
        : {
            event: null,
            updatedPlayers:
              seasonSetup.updatedPlayers,
            newsItems: [
              {
                id: randomId(),
                season: newSeason,
                title: "📰 Events Disabled",
                description:
                  "No events happened because events are disabled.",
                tone: "neutral" as const,
              },
            ],
          };

    setSeason(newSeason);
    setTurnIndex(0);
    setSelectedSlot("");
    setPendingSlot(null);
    setShowPlayerModal(false);
    setTimerActive(false);
    setInvestorOffer(null);

    if (selectedTime !== null) {
      setTimer(selectedTime);
    }

    setSeasonEvent(
      eventResult.event
    );

    setGamePlayers(
      eventResult.updatedPlayers
    );

    setNews((prev) => {
      const generatedNews =
        gameLengthMode === "infinite" &&
        newSeason > 2028
          ? [
              {
                id: randomId(),
                season: newSeason,
                title: "🧬 New Generated Class",
                description:
                  "A new group of unknown players entered the market.",
                tone: "special" as const,
              },
            ]
          : [];

      return [
        ...seasonSetup.retirementNews,
        ...eventResult.newsItems,
        ...generatedNews,
        ...prev,
      ];
    });

    if (
      mode === "single" &&
      Math.random() < 0.25
    ) {
      setTimeout(() => {
        triggerInvestorOffer();
      }, 600);
    }
  }

  function restartGame() {
    setStarted(false);
    setMode(null);
    setGameLengthMode(null);
    setBudgetMode("balanced");
    setEventsEnabled(true);
    setEventType("all");
    setShowHowToPlay(false);
    setSeason(2008);
    setTurnIndex(0);

    setGamePlayers(
      createPlayers("balanced")
    );

    setBasePlayers(
      buildDynamicPlayers(
        rawBasePlayers
      )
    );

    setGeneratedPlayersBySeason({});
    setSelectedSlot("");
    setPendingSlot(null);
    setShowPlayerModal(false);
    setSelectedOwnedAction(null);
    setShowEndModal(false);
    setShowStats(false);
    setSelectedTime(15);
    setTimer(15);
    setTimerActive(false);
    setRewardChoice(null);
    setStealChallenge(null);
    setSeasonEvent(null);
    setNews([]);
    setSeasonSecretClicks(0);
    setShowDeveloperPanel(false);
    setAuctionState(null);
    setInvestorOffer(null);
  }

  function totalProfit(
    playerIndex: number
  ) {
    return gamePlayers[
      playerIndex
    ].sold.reduce(
      (sum, s) =>
        sum + s.profit,
      0
    );
  }

  function getWinnerText() {
    const p1Profit =
      totalProfit(0);

    const p2Profit =
      totalProfit(1);

    if (mode === "single") {
      return `Total Profit / Loss: €${p1Profit}M`;
    }

    if (p1Profit > p2Profit) {
      return "Winner: Player 1";
    }

    if (p2Profit > p1Profit) {
      return "Winner: Player 2";
    }

    return "Draw";
  }

  function startGame() {
    if (
      !mode ||
      !gameLengthMode
    ) {
      return;
    }

    setBasePlayers(
      buildDynamicPlayers(
        rawBasePlayers
      )
    );

    setStarted(true);
    setSeason(2008);
    setTurnIndex(0);

    setGamePlayers(
      createPlayers(
        budgetMode
      )
    );

    setGeneratedPlayersBySeason({});
    setSelectedSlot("");
    setPendingSlot(null);
    setShowPlayerModal(false);
    setSelectedOwnedAction(null);
    setRewardChoice(null);
    setStealChallenge(null);
    setSeasonEvent(null);
    setSeasonSecretClicks(0);
    setShowDeveloperPanel(false);
    setAuctionState(null);
    setInvestorOffer(null);

    if (selectedTime !== null) {
      setTimer(selectedTime);
    }

    setTimerActive(false);

    setNews([
      {
        id: randomId(),
        season: 2008,
        title: "📰 Game Started",
        description:
          `Football Investor 1.7 started with ${budgetSettings[budgetMode].label}.`,
        tone: "neutral",
      },
    ]);
  }

  function selectSlot(
    slot: string
  ) {
    if (isFrozen) {
      return notify(
        "أنت مجمد هذا الموسم 🧊"
      );
    }

    if (
      !activePlayer ||
      activePlayer.purchaseChances <= 0
    ) {
      return notify(
        "ما عندك فرص شراء"
      );
    }

    if (
      pendingSlot &&
      pendingSlot !== slot
    ) {
      return notify(
        "عندك اختيار مفتوح، خلصه أولاً"
      );
    }

    setSelectedOwnedAction(null);
    setPendingSlot(slot);
    setSelectedSlot(slot);
    setShowPlayerModal(true);

    if (selectedTime !== null) {
      setTimer(selectedTime);
      setTimerActive(true);
    }
  }

  function closePlayerSelection() {
    notify(
      "الوقت مازال مستمر ⏳"
    );

    setShowPlayerModal(false);
  }

  function selectOwnedPlayer(
    playerIndex: number,
    ownedIndex: number
  ) {
    const canControl =
      mode === "single" ||
      playerIndex === activePlayerIndex;

    if (!canControl) {
      return notify(
        "مو دور هذا اللاعب الآن"
      );
    }

    setShowPlayerModal(false);

    setSelectedOwnedAction({
      playerIndex,
      ownedIndex,
    });
  }

  function keepOwnedPlayer() {
    setSelectedOwnedAction(null);
  }

  function cardName(
    card: RewardCard
  ) {
    if (card === "freeze") {
      return "🧊 Freeze Card";
    }

    if (card === "triple") {
      return "⚡ Triple Buy Card";
    }

    return "🕵️ Steal Card";
  }

  function lockedMessage(
    card: RewardCard
  ) {
    if (card === "freeze") {
      return "لفتح Freeze Card: بع لاعب بقيمة €20M أو أكثر";
    }

    if (card === "triple") {
      return "لفتح Triple Buy Card: بع لاعب بقيمة €40M أو أكثر";
    }

    return "لفتح Steal Card: بع لاعب بقيمة €50M أو أكثر";
  }

  function useFreezeCard(
    playerIndex: number
  ) {
    if (mode !== "versus") {
      return notify(
        "كرت التجميد يعمل ضد صديق فقط"
      );
    }

    const enemyIndex =
      playerIndex === 0 ? 1 : 0;

    setGamePlayers((prev) =>
      prev.map((gp, i) => {
        if (i === playerIndex) {
          return {
            ...gp,
            cards: {
              ...gp.cards,
              freeze: {
                unlocked: true,
                used: true,
              },
            },
          };
        }

        if (i === enemyIndex) {
          return {
            ...gp,
            frozenSeason:
              season + 1,
          };
        }

        return gp;
      })
    );

    addNews({
      season,
      title:
        "🧊 Freeze Card Used",
      description:
        `${gamePlayers[playerIndex].name} froze ${gamePlayers[enemyIndex].name} next season.`,
      tone: "special",
    });

    notify(
      "تم استخدام كرت التجميد 🧊"
    );
  }

  function useTripleCard(
    playerIndex: number
  ) {
    setGamePlayers((prev) =>
      prev.map((gp, i) =>
        i === playerIndex
          ? {
              ...gp,
              tripleNextSeason: true,
              cards: {
                ...gp.cards,
                triple: {
                  unlocked: true,
                  used: true,
                },
              },
            }
          : gp
      )
    );

    addNews({
      season,
      title:
        "⚡ Triple Buy Used",
      description:
        `${gamePlayers[playerIndex].name} will receive 3 purchase chances next season.`,
      tone: "special",
    });

    notify(
      "تم استخدام Triple Buy ⚡"
    );
  }

  function useStealCard(
    playerIndex: number
  ) {
    if (mode !== "versus") {
      return notify(
        "كرت السرقة يعمل ضد صديق فقط"
      );
    }

    setGamePlayers((prev) =>
      prev.map((gp, i) =>
        i === playerIndex
          ? {
              ...gp,
              cards: {
                ...gp.cards,
                steal: {
                  unlocked: true,
                  used: true,
                },
              },
            }
          : gp
      )
    );

    addNews({
      season,
      title:
        "🕵️ Steal Card Activated",
      description:
        `${gamePlayers[playerIndex].name} activated Steal Card.`,
      tone: "special",
    });

    setStealChallenge({
      userIndex: playerIndex,
      showHelp: false,
      success: false,
      ownIndex: null,
      enemyIndex: null,
    });
  }

  function swapPlayers() {
    if (!stealChallenge) {
      return;
    }

    const userIndex =
      stealChallenge.userIndex;

    const enemyIndex =
      userIndex === 0 ? 1 : 0;

    if (
      stealChallenge.ownIndex === null ||
      stealChallenge.enemyIndex === null
    ) {
      return notify(
        "اختر لاعب منك ولاعب من الخصم"
      );
    }

    const userPlayerName =
      gamePlayers[userIndex].owned[
        stealChallenge.ownIndex
      ].player.name;

    const enemyPlayerName =
      gamePlayers[enemyIndex].owned[
        stealChallenge.enemyIndex
      ].player.name;

    setGamePlayers((prev) => {
      const copy = [...prev];

      const user = {
        ...copy[userIndex],
        owned: [
          ...copy[userIndex].owned,
        ],
      };

      const enemy = {
        ...copy[enemyIndex],
        owned: [
          ...copy[enemyIndex].owned,
        ],
      };

      const userPlayer =
        user.owned[
          stealChallenge.ownIndex!
        ];

      const enemyPlayer =
        enemy.owned[
          stealChallenge.enemyIndex!
        ];

      user.owned[
        stealChallenge.ownIndex!
      ] = {
        ...enemyPlayer,
        slot:
          userPlayer.slot,
      };

      enemy.owned[
        stealChallenge.enemyIndex!
      ] = {
        ...userPlayer,
        slot:
          enemyPlayer.slot,
      };

      copy[userIndex] = user;
      copy[enemyIndex] = enemy;

      return copy;
    });

    addNews({
      season,
      title:
        "🕵️ Player Swap",
      description:
        `${gamePlayers[userIndex].name} swapped ${userPlayerName} for ${enemyPlayerName}.`,
      tone: "special",
    });

    setStealChallenge(null);

    notify(
      "تم تبديل اللاعبين بنجاح 🕵️"
    );
  }

  function placeBid(
    playerIndex: number
  ) {
    if (
      !auctionState ||
      !auctionState.selectedPlayer ||
      auctionState.phase !== "bidding"
    ) {
      return;
    }

    const nextBid =
      auctionState.currentBid + 5;

    const gp =
      gamePlayers[playerIndex];

    if (gp.budget < nextBid) {
      return notify(
        "الميزانية غير كافية للمزايدة"
      );
    }

    setAuctionState({
      ...auctionState,
      currentBid:
        nextBid,
      highestBidder:
        playerIndex,
      timer:
        getAuctionTimerByBid(
          nextBid
        ),
    });
  }

  function finishAuction() {
    if (
      !auctionState ||
      !auctionState.selectedPlayer ||
      auctionState.highestBidder === null
    ) {
      setAuctionState(null);
      return;
    }

    const winnerIndex =
      auctionState.highestBidder;

    const player =
      auctionState.selectedPlayer;

    const price =
      auctionState.currentBid;

    const slot =
      auctionState.replacementSlot ||
      player.position;

    setGamePlayers((prev) =>
      prev.map((gp, index) => {
        if (index !== winnerIndex) {
          return gp;
        }

        const filteredOwned =
          gp.owned.filter(
            (item) =>
              slotToPosition(
                item.slot
              ) !== player.position
          );

        return {
          ...gp,
          budget:
            gp.budget - price,
          owned: [
            ...filteredOwned,
            {
              player,
              slot,
              buySeason:
                season,
              buyPrice:
                price,
            },
          ],
        };
      })
    );

    addNews({
      season,
      title:
        "🏆 Auction Won",
      description:
        `${gamePlayers[winnerIndex].name} won ${player.name} for €${price}M.`,
      tone: "special",
    });

    notify(
      `${player.name} تم الفوز به في المزاد`
    );

    setAuctionState(null);
  }

  useEffect(() => {
    if (!started) return;
    if (!timerActive) return;
    if (showEndModal) return;
    if (!selectedSlot) return;
    if (selectedTime === null) return;

    if (timer <= 0) {
      autoPickFromSelectedSlot();
      return;
    }

    const interval =
      setTimeout(() => {
        setTimer(
          (prev) => prev - 1
        );
      }, 1000);

    return () =>
      clearTimeout(
        interval
      );
  }, [
    timer,
    timerActive,
    selectedSlot,
    started,
    showEndModal,
    selectedTime,
  ]);

  useEffect(() => {
    if (!auctionState) {
      return;
    }

    if (auctionState.timer <= 0) {
      if (
        auctionState.phase === "preview"
      ) {
        const selected =
          pickRandom(
            auctionState.candidates
          );

        const value =
          currentValue(
            selected
          );

        setAuctionState({
          ...auctionState,
          selectedPlayer:
            selected,
          candidates: [
            selected,
          ],
          phase:
            "bidding",
          currentBid:
            value,
          timer:
            getAuctionTimerByBid(
              value
            ),
          highestBidder:
            null,
          replacementSlot:
            null,
        });

        return;
      }

      if (
        auctionState.phase === "bidding"
      ) {
        finishAuction();
        return;
      }
    }

    const interval =
      setTimeout(() => {
        setAuctionState(
          (prev) =>
            prev
              ? {
                  ...prev,
                  timer:
                    prev.timer - 1,
                }
              : prev
        );
      }, 1000);

    return () =>
      clearTimeout(
        interval
      );
  }, [
    auctionState,
  ]);

  function newsClass(
    tone: NewsItem["tone"]
  ) {
    if (tone === "good") {
      return "border-green-500 bg-green-950/40";
    }

    if (tone === "bad") {
      return "border-red-500 bg-red-950/40";
    }

    if (tone === "special") {
      return "border-purple-500 bg-purple-950/40";
    }

    return "border-gray-600 bg-black/40";
  }

  function renderNewsFeed() {
    return (
      <aside className="bg-zinc-900 border border-gray-700 rounded-2xl p-5">
        <h2 className="text-2xl font-bold mb-3">
          📰 Football News
        </h2>

        {seasonEvent ? (
          <div
            className={`border rounded-xl p-3 mb-4 ${newsClass(
              seasonEvent.tone
            )}`}
          >
            <p className="font-bold">
              Current Event
            </p>

            <p>
              {seasonEvent.title}
            </p>

            <p className="text-sm text-gray-300">
              {seasonEvent.description}
            </p>
          </div>
        ) : (
          <div className="border border-gray-600 bg-black/40 rounded-xl p-3 mb-4">
            <p className="font-bold">
              Current Event
            </p>

            <p>
              No active event this season.
            </p>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto space-y-3">
          {news.length === 0 ? (
            <p className="text-gray-400">
              No news yet.
            </p>
          ) : (
            news.map((item) => (
              <div
                key={item.id}
                className={`border rounded-xl p-3 ${newsClass(
                  item.tone
                )}`}
              >
                <p className="text-sm text-gray-400">
                  Season {item.season}
                </p>

                <p className="font-bold">
                  {item.title}
                </p>

                <p className="text-sm text-gray-200">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    );
  }

  function renderCards(
    playerIndex: number
  ) {
    const gp =
      gamePlayers[
        playerIndex
      ];

    const cards: RewardCard[] = [
      "freeze",
      "triple",
      "steal",
    ];

    return (
      <div className="mt-4 bg-black/30 border border-gray-700 rounded-xl p-3">
        <h3 className="font-bold mb-2">
          Special Cards
        </h3>

        <div className="flex flex-wrap gap-2">
          {cards.map((card) => {
            const data =
              gp.cards[card];

            if (data.used) {
              return (
                <button
                  key={card}
                  className="bg-gray-700 px-3 py-2 rounded-lg text-sm"
                >
                  ✅ {cardName(card)} Used
                </button>
              );
            }

            if (!data.unlocked) {
              return (
                <button
                  key={card}
                  onClick={() =>
                    notify(
                      lockedMessage(card)
                    )
                  }
                  className="bg-zinc-800 border border-gray-600 px-3 py-2 rounded-lg text-sm"
                >
                  🔒 {cardName(card)}
                </button>
              );
            }

            return (
              <button
                key={card}
                onClick={() => {
                  if (card === "freeze") {
                    useFreezeCard(playerIndex);
                  }

                  if (card === "triple") {
                    useTripleCard(playerIndex);
                  }

                  if (card === "steal") {
                    useStealCard(playerIndex);
                  }
                }}
                className="bg-purple-700 px-3 py-2 rounded-lg text-sm"
              >
                {cardName(card)} Ready
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function playerCardColor(
    player: Player
  ) {
    if (player.secret) {
      return "border-yellow-400 bg-yellow-950/30";
    }

    if (player.hiddenType === "talent") {
      return "border-green-500 bg-green-950/30";
    }

    if (player.hiddenType === "flop") {
      return "border-red-500 bg-red-950/30";
    }

    return "border-blue-500 bg-blue-950/30";
  }

  function renderPlayerInfoCard(
    player: Player,
    index: number,
    compact = false
  ) {
    const stats =
      getSeasonStats(
        player,
        season
      );

    const retirementWarning =
      getRetirementWarningText(
        player,
        season
      );

    return (
      <div
        key={player.name}
        className={`border rounded-xl p-4 ${playerCardColor(
          player
        )} transition-all duration-300`}
        style={{
          animation:
            "fadeInUp 0.35s ease-out both",
          animationDelay:
            `${index * 0.08}s`,
        }}
      >
        <h3 className="text-xl font-bold mb-2">
          {player.name}
        </h3>

        <p>Position: {player.position}</p>
        <p>Age: {currentAge(player)}</p>
        <p>Nationality: {player.nationality}</p>
        <p>Height: {player.height} cm</p>
        <p>League: {player.league}</p>

        <div className="mt-3 border-t border-white/20 pt-3">
          <p className="text-yellow-300 font-bold">
            Season {season} Stats
          </p>

          <p>Games: {stats.games}</p>
          <p>Goals: {stats.goals}</p>
          <p>Assists: {stats.assists}</p>

          {player.position === "GK" && (
            <p>
              Clean Sheets: {stats.cleanSheets}
            </p>
          )}

          <p>Rating: {stats.rating}/99</p>
        </div>

        <p className="text-yellow-300 font-bold mt-2">
          Value: €{currentValue(player)}M
        </p>

        {retirementWarning && (
          <p className="text-orange-300 text-sm mt-2">
            ⚠️ {retirementWarning}
          </p>
        )}

        {player.secret && (
          <p className="text-yellow-300 font-bold">
            🟡 Gold Secret Card
          </p>
        )}

        {!compact && (
          <button
            onClick={() =>
              buyPlayer(player)
            }
            className="mt-4 w-full bg-blue-600 px-4 py-2 rounded-lg"
          >
            Buy Player
          </button>
        )}
      </div>
    );
  }

  function renderFormation(
    playerIndex: number
  ) {
    const isActive =
      mode === "single" ||
      playerIndex === activePlayerIndex;

    const gp =
      gamePlayers[playerIndex];

    const frozen =
      gp.frozenSeason === season;

    return (
      <div
        className={`bg-green-900 border rounded-2xl p-4 ${
          isActive
            ? "border-yellow-400"
            : "border-green-700 opacity-70"
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {gp.name}
            </h2>

            <p>Cash: €{gp.budget}M</p>

            <p>
              🎟️ Purchase Chances:
              {gp.purchaseChances}
            </p>

            {frozen && (
              <p className="text-blue-300">
                🧊 Frozen This Season
              </p>
            )}
          </div>
        </div>

        {renderCards(playerIndex)}

        <div className="grid grid-cols-5 gap-3 text-center mt-4">
          {formation433.flat().map((slot, index) => {
            const ownedPlayer =
              slot
                ? getOwnedBySlot(
                    playerIndex,
                    slot
                  )
                : undefined;

            const ownedIndex =
              slot
                ? getOwnedIndexBySlot(
                    playerIndex,
                    slot
                  )
                : -1;

            return slot ? (
              <button
                key={index}
                onClick={() => {
                  if (!isActive) {
                    return;
                  }

                  if (
                    ownedPlayer &&
                    ownedIndex !== -1
                  ) {
                    selectOwnedPlayer(
                      playerIndex,
                      ownedIndex
                    );
                    return;
                  }

                  selectSlot(slot);
                }}
                className={`border rounded-xl p-3 min-h-24 transition-all duration-150 active:scale-95 active:translate-y-1 ${
                  ownedPlayer
                    ? playerCardColor(
                        ownedPlayer.player
                      )
                    : pendingSlot === slot
                    ? "bg-yellow-900/50 border-yellow-400"
                    : "bg-black/40 border-green-500 hover:bg-green-800/40"
                }`}
              >
                <div className="font-bold">
                  {slot}
                </div>

                <div className="text-xs mt-2">
                  {ownedPlayer
                    ? ownedPlayer.player.name
                    : pendingSlot === slot
                    ? "Pending..."
                    : "Choose"}
                </div>

                {ownedPlayer && (
                  <>
                    <div className="text-[11px] mt-1 text-gray-300">
                      Bought €{ownedPlayer.buyPrice}M
                    </div>

                    <div className="text-[11px] text-yellow-300">
                      Age {currentAge(ownedPlayer.player)}
                    </div>
                  </>
                )}
              </button>
            ) : (
              <div key={index}></div>
            );
          })}
        </div>
      </div>
    );
  }

  const selectedOwned =
    selectedOwnedAction !== null
      ? gamePlayers[
          selectedOwnedAction.playerIndex
        ]?.owned[
          selectedOwnedAction.ownedIndex
        ]
      : null;

  function ownedPlayerProfit(
    item: Owned
  ) {
    return (
      currentValue(item.player) -
      item.buyPrice
    );
  }

  function ownedPlayerProfitColor(
    item: Owned
  ) {
    return ownedPlayerProfit(item) >= 0
      ? "text-green-400"
      : "text-red-400";
  }

  function renderPortfolio(
    playerIndex: number
  ) {
    const gp =
      gamePlayers[playerIndex];

    return (
      <aside className="bg-zinc-900 border border-gray-700 rounded-2xl p-5">
        <h2 className="text-3xl font-bold mb-4">
          Portfolio
        </h2>

        <p className="text-xl mb-2">
          Cash: €{gp.budget}M
        </p>

        <p className="text-xl mb-4">
          🎟️ Purchase Chances:
          {gp.purchaseChances}
        </p>

        <h3 className="text-xl font-bold mb-3">
          Owned Players
        </h3>

        {gp.owned.length === 0 ? (
          <p className="text-gray-400">
            No players owned.
          </p>
        ) : (
          <div className="space-y-3">
            {gp.owned.map((item, index) => (
              <div
                key={index}
                className={`border rounded-xl p-3 ${playerCardColor(
                  item.player
                )}`}
              >
                <p className="font-bold">
                  {item.player.name}
                </p>

                <p>
                  Slot: {item.slot}
                </p>

                <p>
                  Current: €{currentValue(item.player)}M
                </p>

                <p className={ownedPlayerProfitColor(item)}>
                  Profit: €{ownedPlayerProfit(item)}M
                </p>

                <button
                  onClick={() =>
                    selectOwnedPlayer(
                      playerIndex,
                      index
                    )
                  }
                  className="mt-2 bg-red-700 px-3 py-2 rounded-lg"
                >
                  Manage Player
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>
    );
  }

  const devEvents: {
    id: DevEventId;
    label: string;
  }[] = [
    {
      id: "hotMarket",
      label: "🔥 Hot Market",
    },
    {
      id: "saudiOffer",
      label: "💰 Saudi Offer",
    },
    {
      id: "ballonDor",
      label: "🏆 Ballon d'Or",
    },
    {
      id: "goldenBoy",
      label: "🌟 Golden Boy",
    },
    {
      id: "goldenBoot",
      label: "👟 Golden Boot",
    },
    {
      id: "recordTransfer",
      label: "💸 Record Transfer",
    },
    {
      id: "wonderkid",
      label: "🚀 Wonderkid",
    },
    {
      id: "aclInjury",
      label: "🤕 ACL Injury",
    },
    {
      id: "majorInjury",
      label: "🚑 Major Injury",
    },
    {
      id: "benchWarmer",
      label: "🪑 Bench Warmer",
    },
    {
      id: "failedTransfer",
      label: "📉 Failed Transfer",
    },
    {
      id: "freeTransfer",
      label: "💔 Free Transfer",
    },
    {
      id: "marketCrash",
      label: "📉 Market Crash",
    },
    {
      id: "retirement",
      label: "👋 Retirement Check",
    },
    {
      id: "investorOffer",
      label: "💼 Investor Offer",
    },
    {
      id: "legendaryAuction",
      label: "🏆 Legendary Auction",
    },
  ];

  if (!started) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">

        <p
          onClick={() => {
            const next =
              easterClicks + 1;

            setEasterClicks(next);

            if (next >= 5) {
              setEasterUnlocked(true);
            }
          }}
          className="text-yellow-400 mb-2 cursor-pointer"
        >
          عمو يوسف المطور المستقل AKA 7GE 👀
        </p>

        <h1 className="text-5xl font-bold mb-4">
          Football Investor 1.7
        </h1>

        {easterUnlocked && (
          <p className="text-yellow-400 mb-4 font-bold animate-pulse text-center">
            😏 شطور... نفذت المطلوب منك، الحين دور عن بطاقتي.
            <br />
            Clever... You completed your task. Now find my card.
          </p>
        )}

        <button
          onClick={() =>
            setShowHowToPlay(true)
          }
          className="mb-8 bg-blue-700 px-6 py-3 rounded-xl text-lg transition-all duration-150 hover:scale-105"
        >
          📖 How To Play
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Starting Budget
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {(
            Object.keys(
              budgetSettings
            ) as BudgetMode[]
          ).map((budget) => (
            <button
              key={budget}
              onClick={() =>
                setBudgetMode(budget)
              }
              className={`p-4 rounded-xl border-2 transition-all ${
                budgetMode === budget
                  ? "bg-green-700 border-green-300"
                  : "bg-zinc-800 border-gray-700"
              }`}
            >
              {
                budgetSettings[
                  budget
                ].label
              }
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">
          Events
        </h2>

        <div className="flex items-center gap-4 mb-4">

          <button
            onClick={() =>
              setEventsEnabled(
                !eventsEnabled
              )
            }
            className={`w-24 h-12 rounded-full relative transition-all ${
              eventsEnabled
                ? "bg-green-600"
                : "bg-zinc-700"
            }`}
          >
            <div
              className={`absolute top-1 w-10 h-10 bg-white rounded-full transition-all ${
                eventsEnabled
                  ? "left-12"
                  : "left-1"
              }`}
            />
          </button>

          <span>
            {eventsEnabled
              ? "ON"
              : "OFF"}
          </span>

        </div>

        {eventsEnabled && (
          <div className="flex gap-3 mb-8">

            <button
              onClick={() =>
                setEventType("all")
              }
              className={`px-4 py-2 rounded-lg ${
                eventType === "all"
                  ? "bg-green-600"
                  : "bg-zinc-700"
              }`}
            >
              All
            </button>

            <button
              onClick={() =>
                setEventType(
                  "positive"
                )
              }
              className={`px-4 py-2 rounded-lg ${
                eventType ===
                "positive"
                  ? "bg-green-600"
                  : "bg-zinc-700"
              }`}
            >
              Positive
            </button>

            <button
              onClick={() =>
                setEventType(
                  "negative"
                )
              }
              className={`px-4 py-2 rounded-lg ${
                eventType ===
                "negative"
                  ? "bg-red-600"
                  : "bg-zinc-700"
              }`}
            >
              Negative
            </button>

          </div>
        )}

        <h2 className="text-2xl font-bold mb-3">
          Game Mode
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-8">

          <button
            onClick={() =>
              setMode("single")
            }
            className={`px-8 py-4 rounded-xl text-xl border-2 ${
              mode === "single"
                ? "bg-green-700 border-green-300"
                : "bg-green-600 border-green-800"
            }`}
          >
            Single Player
          </button>

          <button
            onClick={() =>
              setMode("versus")
            }
            className={`px-8 py-4 rounded-xl text-xl border-2 ${
              mode === "versus"
                ? "bg-blue-700 border-blue-300"
                : "bg-blue-600 border-blue-800"
            }`}
          >
            Play vs Friend
          </button>

        </div>

        {mode && (
          <>
            <h2 className="text-2xl font-bold mb-3">
              Season Mode
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-8">

              <button
                onClick={() =>
                  setGameLengthMode("classic")
                }
                className={`px-8 py-4 rounded-xl text-xl border-2 ${
                  gameLengthMode === "classic"
                    ? "bg-yellow-700 border-yellow-300"
                    : "bg-zinc-800 border-yellow-700"
                }`}
              >
                Classic 2008-2028
              </button>

              <button
                onClick={() =>
                  setGameLengthMode("infinite")
                }
                className={`px-8 py-4 rounded-xl text-xl border-2 ${
                  gameLengthMode === "infinite"
                    ? "bg-purple-700 border-purple-300"
                    : "bg-zinc-800 border-purple-700"
                }`}
              >
                Infinite Mode
              </button>

            </div>

            <h2 className="text-2xl font-bold mb-4">
              Choose Timer
            </h2>

            <div className="flex flex-wrap justify-center gap-3 mb-6">

              {[
                {
                  label: "No Timer",
                  value: null,
                },
                {
                  label: "15 sec",
                  value: 15,
                },
                {
                  label: "30 sec",
                  value: 30,
                },
                {
                  label: "45 sec",
                  value: 45,
                },
                {
                  label: "1 min",
                  value: 60,
                },
              ].map((t) => (
                <button
                  key={String(t.value)}
                  onClick={() =>
                    setSelectedTime(
                      t.value
                    )
                  }
                  className={`px-5 py-3 rounded-xl border-2 ${
                    selectedTime === t.value
                      ? "bg-yellow-600 border-yellow-300"
                      : "bg-zinc-800 border-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}

            </div>

            <button
              onClick={startGame}
              disabled={!gameLengthMode}
              className="bg-white text-black px-8 py-4 rounded-xl text-xl disabled:bg-gray-500"
            >
              Start Game
            </button>

          </>
        )}

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8 relative">

      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-zinc-900 border border-yellow-500 px-6 py-3 rounded-xl z-50">
          {message}
        </div>
      )}

      <h1
        onClick={handleSeasonSecretClick}
        className="text-4xl font-bold mb-2 cursor-pointer"
      >
        Season {season}
      </h1>

      <p className="text-lg text-gray-400 mb-2">
        Mode:
        {gameLengthMode === "classic"
          ? " Classic 2008-2028"
          : " Infinite"}
      </p>

      <p className="text-lg text-gray-400 mb-4">
        Budget: {budgetSettings[budgetMode].label}
      </p>

      {gameLengthMode === "infinite" && season > 2028 && (
        <p className="text-purple-300 mb-2">
          🧬 Generated Players Active
        </p>
      )}

      {mode === "versus" && (
        <p className="text-2xl mb-2">
          Turn: {activePlayer?.name}
          {" | "}
          {selectedTime === null
            ? "No Timer"
            : selectedSlot
            ? `${timer}s`
            : "Waiting"}
        </p>
      )}

      {mode === "single" && (
        <p className="text-2xl mb-2">
          {selectedTime === null
            ? "No Timer"
            : pendingSlot
            ? `Timer: ${timer}s`
            : ""}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={() =>
            nextSeason()
          }
          disabled={
            !!pendingSlot ||
            !!auctionState ||
            !!investorOffer
          }
          className="bg-yellow-600 px-5 py-3 rounded-lg disabled:bg-gray-600"
        >
          Continue Next Season
        </button>

        {gameLengthMode === "infinite" && (
          <button
            onClick={finishGame}
            className="bg-red-700 px-5 py-3 rounded-lg"
          >
            End Game
          </button>
        )}

      </div>

      {showDeveloperPanel && (
        <div className="fixed top-24 right-4 w-80 bg-zinc-950 border border-purple-500 rounded-2xl p-4 z-50">

          <div className="flex justify-between items-center mb-4">

            <h2 className="font-bold text-purple-300">
              Developer Events
            </h2>

            <button
              onClick={closeDeveloperPanel}
              className="bg-red-700 px-3 py-1 rounded"
            >
              X
            </button>

          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">

            {devEvents.map((event) => (
              <button
                key={event.id}
                onClick={() =>
                  runDeveloperEvent(
                    event.id
                  )
                }
                className="w-full text-left bg-purple-700 hover:bg-purple-600 px-3 py-2 rounded-lg"
              >
                {event.label}
              </button>
            ))}

          </div>

        </div>
      )}

      {investorOffer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-green-500 rounded-2xl p-8 max-w-xl w-full">

            <h2 className="text-3xl font-bold text-center mb-4">
              💼 Investor Offer
            </h2>

            <div className="text-center space-y-3">

              <p className="text-xl font-bold">
                {
                  investorOffer
                    .selectedPlayer
                    .name
                }
              </p>

              <p>
                Market Value:
                {" "}
                €{
                  investorOffer
                    .marketValue
                }M
              </p>

              <p className="text-green-300 font-bold text-2xl">
                Offer:
                {" "}
                €{
                  investorOffer
                    .offerValue
                }M
              </p>

              <p className="text-gray-300">
                {
                  getInvestorOfferProfitText(
                    investorOffer
                  )
                }
              </p>

              <p>
                {
                  getInvestorOfferMessage(
                    investorOffer
                  )
                }
              </p>

            </div>

            <div className="flex gap-4 justify-center mt-8">

              <button
                onClick={
                  acceptCurrentInvestorOffer
                }
                className="bg-green-700 px-6 py-3 rounded-xl"
              >
                Accept
              </button>

              <button
                onClick={
                  rejectCurrentInvestorOffer
                }
                className="bg-red-700 px-6 py-3 rounded-xl"
              >
                Reject
              </button>

            </div>

          </div>

        </div>
      )}

      {auctionState && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 max-w-4xl w-full mx-4">

            <h2 className="text-4xl font-bold text-center mb-4">
              🏆 Legendary Auction
            </h2>

            <p className="text-center text-yellow-300 mb-6">
              Timer: {auctionState.timer}s
            </p>

            {auctionState.phase === "preview" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {auctionState.candidates.map(
                  (
                    player,
                    index
                  ) =>
                    renderPlayerInfoCard(
                      player,
                      index,
                      true
                    )
                )}
              </div>
            ) : (
              <>
                {auctionState.selectedPlayer && (
                  <div className="max-w-md mx-auto">

                    {renderPlayerInfoCard(
                      auctionState.selectedPlayer,
                      0,
                      true
                    )}

                    <div className="text-center mt-6">

                      <p className="text-2xl font-bold mb-4">
                        Current Bid: €{auctionState.currentBid}M
                      </p>

                      <div className="flex gap-4 justify-center">
                        {gamePlayers.map(
                          (
                            gp,
                            index
                          ) => (
                            <button
                              key={gp.name}
                              onClick={() =>
                                placeBid(
                                  index
                                )
                              }
                              className="bg-yellow-700 px-5 py-3 rounded-xl"
                            >
                              {gp.name}
                            </button>
                          )
                        )}
                      </div>

                    </div>

                  </div>
                )}
              </>
            )}

          </div>

        </div>
      )}

      {showPlayerModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">

          <div className="bg-zinc-900 border border-purple-500 rounded-2xl p-6 max-w-6xl w-full mx-4">

            <div className="flex justify-between items-center mb-5">

              <div>
                <h2 className="text-3xl font-bold">
                  Choose {selectedSlot} Player
                </h2>

                <p className="text-gray-300">
                  {activePlayer?.name}
                </p>
              </div>

              <div className="text-right">

                <p
                  className={`text-3xl font-bold ${
                    timer <= 5
                      ? "text-red-400"
                      : "text-yellow-300"
                  }`}
                >
                  {selectedTime === null
                    ? "No Timer"
                    : `${timer}s`}
                </p>

                <button
                  onClick={closePlayerSelection}
                  className="mt-2 bg-gray-700 px-4 py-2 rounded-lg"
                >
                  Close
                </button>

              </div>

            </div>

            {options.length === 0 ? (
              <p className="text-red-400">
                No players available for this position in {season}.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                {options.map((player, index) =>
                  renderPlayerInfoCard(
                    player,
                    index
                  )
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {pendingSlot && !showPlayerModal && (
        <div className="fixed top-5 right-5 bg-yellow-900 border border-yellow-400 px-5 py-3 rounded-xl z-40">
          ⏳ Pending Selection: {pendingSlot}
          {" "}
          {selectedTime === null
            ? ""
            : `${timer}s`}
        </div>
      )}

      {selectedOwned && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 text-center max-w-md w-full">

            <h2 className="text-2xl font-bold mb-4">
              {selectedOwned.player.name}
            </h2>

            {renderPlayerInfoCard(
              selectedOwned.player,
              0,
              true
            )}

            <p className="mt-4">
              Bought For: €{selectedOwned.buyPrice}M
            </p>

            <p className="mt-2">
              Current Value: €{currentValue(selectedOwned.player)}M
            </p>

            <p
              className={`mt-2 ${
                ownedPlayerProfit(
                  selectedOwned
                ) >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              Profit: €{ownedPlayerProfit(selectedOwned)}M
            </p>

            <div className="flex gap-4 justify-center mt-6">

              <button
                onClick={() =>
                  sellPlayer(
                    selectedOwnedAction!.playerIndex,
                    selectedOwnedAction!.ownedIndex
                  )
                }
                className="bg-red-700 px-5 py-3 rounded-xl"
              >
                Sell Player
              </button>

              <button
                onClick={keepOwnedPlayer}
                className="bg-green-700 px-5 py-3 rounded-xl"
              >
                Keep Player
              </button>

            </div>

          </div>

        </div>
      )}

      {rewardChoice && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 max-w-xl w-full mx-4 text-center">

            <h2 className="text-3xl font-bold mb-4">
              Choose ONE Special Card
            </h2>

            <p className="mb-6 text-gray-300">
              اختر كرت واحد فقط
            </p>

            <div className="flex flex-col gap-3">
              {rewardChoice.cards.map((card) => (
                <button
                  key={card}
                  onClick={() =>
                    chooseReward(card)
                  }
                  className="bg-purple-700 px-5 py-3 rounded-xl text-xl"
                >
                  {cardName(card)}
                </button>
              ))}
            </div>

          </div>

        </div>
      )}

      {stealChallenge && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 max-w-3xl w-full mx-4 text-center">

            {!stealChallenge.success ? (
              <>
                <h2 className="text-3xl font-bold mb-4">
                  3-2-1 Challenge
                </h2>

                <p className="mb-6">
                  حدد مين فاز بالتحدي:
                </p>

                <div className="flex gap-4 justify-center">

                  <button
                    onClick={() => {
                      if (stealChallenge.userIndex === 0) {
                        setStealChallenge({
                          ...stealChallenge,
                          success: true,
                        });
                      } else {
                        setStealChallenge(null);
                        notify("خسرت التحدي وضاع الكرت");
                      }
                    }}
                    className="bg-blue-600 px-5 py-3 rounded-xl"
                  >
                    Player 1 Won
                  </button>

                  <button
                    onClick={() => {
                      if (stealChallenge.userIndex === 1) {
                        setStealChallenge({
                          ...stealChallenge,
                          success: true,
                        });
                      } else {
                        setStealChallenge(null);
                        notify("خسرت التحدي وضاع الكرت");
                      }
                    }}
                    className="bg-green-600 px-5 py-3 rounded-xl"
                  >
                    Player 2 Won
                  </button>

                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">
                  Swap Players
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">

                  <div>
                    <h3 className="font-bold mb-2">
                      Your Player
                    </h3>

                    {gamePlayers[
                      stealChallenge.userIndex
                    ].owned.map((item, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setStealChallenge({
                            ...stealChallenge,
                            ownIndex: index,
                          })
                        }
                        className={`block w-full text-left p-3 rounded-lg mb-2 ${
                          stealChallenge.ownIndex === index
                            ? "bg-blue-700"
                            : "bg-black/40"
                        }`}
                      >
                        {item.player.name} - {item.slot}
                      </button>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">
                      Enemy Player
                    </h3>

                    {gamePlayers[
                      stealChallenge.userIndex === 0 ? 1 : 0
                    ].owned.map((item, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setStealChallenge({
                            ...stealChallenge,
                            enemyIndex: index,
                          })
                        }
                        className={`block w-full text-left p-3 rounded-lg mb-2 ${
                          stealChallenge.enemyIndex === index
                            ? "bg-red-700"
                            : "bg-black/40"
                        }`}
                      >
                        {item.player.name} - {item.slot}
                      </button>
                    ))}

                  </div>

                </div>

                <div className="flex gap-4 justify-center mt-6">

                  <button
                    onClick={swapPlayers}
                    className="bg-purple-700 px-5 py-3 rounded-xl"
                  >
                    Confirm Swap
                  </button>

                  <button
                    onClick={() =>
                      setStealChallenge(null)
                    }
                    className="bg-gray-700 px-5 py-3 rounded-xl"
                  >
                    Cancel
                  </button>

                </div>
              </>
            )}

          </div>

        </div>
      )}

      {mode === "single" ? (

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

          <section className="xl:col-span-2">
            {renderFormation(0)}
          </section>

          {renderPortfolio(0)}

          {renderNewsFeed()}

        </div>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          <div className="xl:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-8">

            {renderFormation(0)}

            {renderFormation(1)}

          </div>

          {renderNewsFeed()}

        </div>

      )}

      {showEndModal && (

        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

          <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 max-w-6xl w-full mx-4 overflow-y-auto max-h-[90vh]">

            {!showStats ? (

              <>
                <h1 className="text-4xl font-bold mb-4 text-center">
                  Game Finished
                </h1>

                <p className="text-2xl text-center mb-6">
                  {getWinnerText()}
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center">

                  <button
                    onClick={() =>
                      setShowStats(true)
                    }
                    className="bg-blue-700 px-6 py-3 rounded-xl text-xl"
                  >
                    View Statistics
                  </button>

                  <button
                    onClick={restartGame}
                    className="bg-green-600 px-6 py-3 rounded-xl text-xl"
                  >
                    Restart Game
                  </button>

                </div>

              </>
            ) : (

              <>
                <h1 className="text-4xl font-bold mb-4 text-center">
                  Statistics
                </h1>

                <p className="text-2xl text-center mb-6">
                  {getWinnerText()}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                  {gamePlayers.map((gp, playerIndex) => (
                    <div
                      key={gp.name}
                      className="bg-black/40 border border-gray-700 rounded-xl p-4"
                    >
                      <h2 className="text-2xl font-bold mb-2">
                        {gp.name}
                      </h2>

                      <p>
                        Final Cash: €{gp.budget}M
                      </p>

                      <p
                        className={
                          totalProfit(playerIndex) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        Total Profit / Loss: €{totalProfit(playerIndex)}M
                      </p>
                    </div>
                  ))}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                  {gamePlayers
                    .flatMap((gp) => gp.sold)
                    .map((soldItem, index) => (
                      <div
                        key={index}
                        className="bg-black/40 border border-gray-700 rounded-xl p-4"
                      >
                        <p className="text-xl font-bold">
                          {soldItem.name}
                        </p>

                        <p>
                          Owner: {soldItem.owner}
                        </p>

                        <p>
                          Bought: €{soldItem.buyPrice}M
                        </p>

                        <p>
                          Sold: €{soldItem.sellPrice}M
                        </p>

                        <p
                          className={
                            soldItem.profit >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {soldItem.profit >= 0
                            ? "Profit"
                            : "Loss"}
                          : €{soldItem.profit}M
                        </p>
                      </div>
                    ))}

                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">

                  <button
                    onClick={() =>
                      setShowStats(false)
                    }
                    className="bg-gray-700 px-6 py-3 rounded-xl text-xl"
                  >
                    Back
                  </button>

                  <button
                    onClick={restartGame}
                    className="bg-green-600 px-6 py-3 rounded-xl text-xl"
                  >
                    Restart Game
                  </button>

                </div>
              </>
            )}

          </div>

        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

    </main>
  );
}