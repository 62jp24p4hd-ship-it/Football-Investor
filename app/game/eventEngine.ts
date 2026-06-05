import type {
  GamePlayer,
  NewsItem,
  Player,
  PlayerEventEffect,
  SeasonEvent,
  SeasonStats,
} from "./types";

import {
  createNewsItem,
  pickRandom,
} from "./helpers";

import {
  getSeasonStats,
} from "./statsEngine";

import {
  calculateMarketValueFromStats,
} from "./valueEngine";

export function getPositivePlayerEvent(): PlayerEventEffect {
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

export function getNegativePlayerEvent(): PlayerEventEffect {
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

export function applyEventToPlayer(
  player: Player,
  season: number,
  effect: PlayerEventEffect
): Player {
  const oldStats =
    getSeasonStats(player, season);

  const newStats: SeasonStats = {
    ...oldStats,
    games: Math.max(
      0,
      oldStats.games + effect.gamesChange
    ),
    goals: Math.max(
      0,
      oldStats.goals + effect.goalsChange
    ),
    assists: Math.max(
      0,
      oldStats.assists + effect.assistsChange
    ),
    cleanSheets: Math.max(
      0,
      oldStats.cleanSheets + effect.cleanSheetsChange
    ),
    rating: Math.max(
      1,
      Math.min(
        99,
        oldStats.rating + effect.ratingChange
      )
    ),
  };

  const calculatedValue =
    calculateMarketValueFromStats(
      player,
      season,
      newStats
    );

  newStats.value =
    Math.max(
      1,
      Math.round(
        calculatedValue * effect.multiplier
      )
    );

  return {
    ...player,
    values: {
      ...player.values,
      [season]: newStats.value,
    },
    statsBySeason: {
      ...player.statsBySeason,
      [season]: newStats,
    },
  };
}

export function applyRandomPlayerEventToOwner(
  season: number,
  players: GamePlayer[],
  playerIndex: number,
  positive: boolean
): {
  updatedPlayers: GamePlayer[];
  newsItem: NewsItem | null;
} {
  const owner =
    players[playerIndex];

  if (!owner || owner.owned.length === 0) {
    return {
      updatedPlayers: players,
      newsItem: null,
    };
  }

  const candidates =
    owner.owned.filter(
      (item) => !item.player.secret
    );

  if (candidates.length === 0) {
    return {
      updatedPlayers: players,
      newsItem: null,
    };
  }

  const selectedOwned =
    pickRandom(candidates);

  const effect =
    positive
      ? getPositivePlayerEvent()
      : getNegativePlayerEvent();

  const updatedPlayer =
    applyEventToPlayer(
      selectedOwned.player,
      season,
      effect
    );

  const updatedPlayers =
    players.map((gamePlayer, index) => {
      if (index !== playerIndex) {
        return gamePlayer;
      }

      return {
        ...gamePlayer,
        owned: gamePlayer.owned.map((owned) =>
          owned.player.name === selectedOwned.player.name
            ? {
                ...owned,
                player: updatedPlayer,
              }
            : owned
        ),
      };
    });

  const newsItem =
    createNewsItem(
      season,
      effect.title,
      `${owner.teamName}: ${selectedOwned.player.name} was affected by ${effect.title}.`,
      effect.tone
    );

  return {
    updatedPlayers,
    newsItem,
  };
}

export function createSharedMarketEvent(
  season: number,
  positive: boolean
): {
  event: SeasonEvent;
  newsItem: NewsItem;
} {
  const title =
    positive
      ? "🔥 Hot Market"
      : "📉 Market Crash";

  const description =
    positive
      ? "All player values increased by 20% this season."
      : "All player values dropped by 20% this season.";

  const tone =
    positive ? "good" : "bad";

  const event: SeasonEvent = {
    title,
    description,
    tone,
    marketMultiplier:
      positive ? 1.2 : 0.8,
  };

  const newsItem =
    createNewsItem(
      season,
      title,
      description,
      tone
    );

  return {
    event,
    newsItem,
  };
}

export function createEventChoiceOptions(): PlayerEventEffect[] {
  const first =
    Math.random() > 0.5
      ? getPositivePlayerEvent()
      : getNegativePlayerEvent();

  let second =
    Math.random() > 0.5
      ? getPositivePlayerEvent()
      : getNegativePlayerEvent();

  if (second.title === first.title) {
    second =
      first.tone === "good"
        ? getNegativePlayerEvent()
        : getPositivePlayerEvent();
  }

  return [first, second];
}