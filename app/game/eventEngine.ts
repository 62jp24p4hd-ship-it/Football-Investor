// ============================================
// FOOTBALL INVESTOR 1.8 - EVENT ENGINE
// ============================================

import type {
  GamePlayer,
  SeasonEvent,
  SeasonEventResult,
  NewsItem,
  PlayerEventEffect,
  EventChoice,
  Player,
} from "./types";
import { pickRandom, randomId, shuffle } from "./helpers";
import { applyStatsModifier, getSeasonStats } from "./statsEngine";
import { calculateBaseValue } from "./valueEngine";
import { JOURNALISTS, NEWS_SOURCES } from "./constants";

// ============================================
// POSITIVE PLAYER EVENTS
// ============================================

export function getPositivePlayerEvents(): PlayerEventEffect[] {
  return [
    {
      title: "🏆 Ballon d'Or Winner",
      tone: "good",
      multiplier: 1.5,
      ratingChange: 5,
      gamesChange: 4,
      goalsChange: 10,
      assistsChange: 6,
      cleanSheetsChange: 0,
    },
    {
      title: "👟 Golden Boot",
      tone: "good",
      multiplier: 1.4,
      ratingChange: 4,
      gamesChange: 3,
      goalsChange: 18,
      assistsChange: 2,
      cleanSheetsChange: 0,
    },
    {
      title: "🌟 Golden Boy Award",
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
      multiplier: 2.0,
      ratingChange: 7,
      gamesChange: 6,
      goalsChange: 12,
      assistsChange: 8,
      cleanSheetsChange: 0,
    },
    {
      title: "💰 Saudi Mega Offer",
      tone: "good",
      multiplier: 1.5,
      ratingChange: 2,
      gamesChange: 2,
      goalsChange: 3,
      assistsChange: 2,
      cleanSheetsChange: 0,
    },
    {
      title: "💸 Record Transfer Fee",
      tone: "good",
      multiplier: 1.45,
      ratingChange: 3,
      gamesChange: 3,
      goalsChange: 5,
      assistsChange: 4,
      cleanSheetsChange: 0,
    },
    {
      title: "🏅 Champions League MVP",
      tone: "good",
      multiplier: 1.35,
      ratingChange: 4,
      gamesChange: 4,
      goalsChange: 7,
      assistsChange: 5,
      cleanSheetsChange: 2,
    },
    {
      title: "🤝 Free Transfer Coup",
      tone: "good",
      multiplier: 1.3,
      ratingChange: 2,
      gamesChange: 5,
      goalsChange: 4,
      assistsChange: 3,
      cleanSheetsChange: 0,
    },
  ];
}

// ============================================
// NEGATIVE PLAYER EVENTS
// ============================================

export function getNegativePlayerEvents(): PlayerEventEffect[] {
  return [
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
    {
      title: "😤 Contract Dispute",
      tone: "bad",
      multiplier: 0.65,
      ratingChange: -4,
      gamesChange: -12,
      goalsChange: -5,
      assistsChange: -4,
      cleanSheetsChange: -3,
    },
    {
      title: "📰 Scandal",
      tone: "bad",
      multiplier: 0.55,
      ratingChange: -6,
      gamesChange: -8,
      goalsChange: -6,
      assistsChange: -4,
      cleanSheetsChange: -2,
    },
  ];
}

// ============================================
// APPLY EVENT TO PLAYER
// ============================================

export function applyEventToPlayer(
  player: Player,
  targetSeason: number,
  effect: PlayerEventEffect,
  currentOwnedValue?: number  // القيمة الحالية للاعب المملوك
): Player {
  const stats = getSeasonStats(player, targetSeason);

  const newStats = {
    games: Math.max(0, stats.games + effect.gamesChange),
    goals: Math.max(0, stats.goals + effect.goalsChange),
    assists: Math.max(0, stats.assists + effect.assistsChange),
    cleanSheets: Math.max(0, stats.cleanSheets + effect.cleanSheetsChange),
    rating: Math.max(40, Math.min(99, stats.rating + effect.ratingChange)),
  };

  // استخدم currentValue كأساس إذا متوفرة، وإلا استخدم قيمة قاعدة البيانات
  const baseValue = currentOwnedValue && currentOwnedValue > 0
    ? currentOwnedValue
    : stats.value;

  // حدّ التغيير: أقصاه 40% للـ positive، أدناه 50% للـ negative
  const clampedMultiplier = effect.multiplier >= 1
    ? Math.min(effect.multiplier, 1.40)   // max +40%
    : Math.max(effect.multiplier, 0.50);  // max -50%

  const finalValue = Math.max(1, Math.round(baseValue * clampedMultiplier));

  return applyStatsModifier(player, targetSeason, {
    ...newStats,
    value: finalValue,
  });
}

// ============================================
// APPLY EVENT TO RANDOM OWNED PLAYER
// ============================================

export function applyEventToRandomOwnedPlayer(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number,
  positive: boolean
): { updatedPlayers: GamePlayer[]; newsItem: NewsItem | null } {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) {
    return { updatedPlayers: gamePlayers, newsItem: null };
  }

  const candidates = owner.owned.filter((item) => !item.player.secret);
  if (candidates.length === 0) {
    return { updatedPlayers: gamePlayers, newsItem: null };
  }

  const picked = pickRandom(candidates);
  const effects = positive ? getPositivePlayerEvents() : getNegativePlayerEvents();
  const effect = pickRandom(effects);

  const playerBefore = picked.player;
  const playerAfter = applyEventToPlayer(
    picked.player,
    season,
    effect,
    picked.currentValue && picked.currentValue > 0 ? picked.currentValue : picked.buyPrice
  );

  const beforeStats = getSeasonStats(playerBefore, season);
  const afterStats = getSeasonStats(playerAfter, season);

  const journalist = pickRandom(JOURNALISTS);
  const source = pickRandom(NEWS_SOURCES);

  const newsItem: NewsItem = {
    id: randomId(),
    season,
    title: effect.title,
    description:
      `${owner.name}: ${playerBefore.name} | ` +
      `Rating ${beforeStats.rating}→${afterStats.rating} | ` +
      `Value €${beforeStats.value}M→€${afterStats.value}M`,
    tone: effect.tone,
    journalist,
    source,
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map((item) =>
        item.player.name === picked.player.name
          ? { ...item, player: playerAfter, currentValue: afterStats.value }
          : item
      ),
    };
  });

  return { updatedPlayers, newsItem };
}

// ============================================
// MARKET EVENTS
// ============================================

export function createMarketEvent(
  season: number,
  positive: boolean
): { event: SeasonEvent; newsItem: NewsItem } {
  const multiplier = positive ? 1.2 : 0.8;
  const title = positive ? "🔥 Hot Transfer Market" : "📉 Market Crash";
  const description = positive
    ? "A buying frenzy has hit the market. All player values up 20%."
    : "Economic downturn hits football. All player values down 20%.";

  const event: SeasonEvent = {
    id: `market_${season}`,
    title,
    description,
    tone: positive ? "good" : "bad",
    marketMultiplier: multiplier,
  };

  const newsItem: NewsItem = {
    id: randomId(),
    season,
    title,
    description,
    tone: positive ? "good" : "bad",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  return { event, newsItem };
}

// ============================================
// MAIN SEASON EVENT GENERATOR
// ============================================

export function createRandomSeasonEvent(
  season: number,
  gamePlayers: GamePlayer[]
): SeasonEventResult {
  const newsItems: NewsItem[] = [];
  let updatedPlayers = [...gamePlayers];
  const roll = Math.random();

  // 15% — quiet season
  if (roll < 0.15) {
    return {
      event: null,
      updatedPlayers,
      newsItems: [
        {
          id: randomId(),
          season,
          title: "📰 Quiet Season",
          description: "No major events this season. Markets remain stable.",
          tone: "neutral",
          journalist: pickRandom(JOURNALISTS),
          source: pickRandom(NEWS_SOURCES),
        },
      ],
    };
  }

  // 20% — hot market
  if (roll < 0.35) {
    const { event, newsItem } = createMarketEvent(season, true);
    return { event, updatedPlayers, newsItems: [newsItem] };
  }

  // 20% — market crash
  if (roll < 0.55) {
    const { event, newsItem } = createMarketEvent(season, false);
    return { event, updatedPlayers, newsItems: [newsItem] };
  }

  // 20% — one player event
  if (roll < 0.75) {
    const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
    const result = applyEventToRandomOwnedPlayer(
      updatedPlayers,
      ownerIndex,
      season,
      Math.random() > 0.45
    );
    updatedPlayers = result.updatedPlayers;
    if (result.newsItem) newsItems.push(result.newsItem);
    return { event: null, updatedPlayers, newsItems };
  }

  // 25% — both players get events
  for (let i = 0; i < gamePlayers.length; i++) {
    const result = applyEventToRandomOwnedPlayer(
      updatedPlayers,
      i,
      season,
      Math.random() > 0.45
    );
    updatedPlayers = result.updatedPlayers;
    if (result.newsItem) newsItems.push(result.newsItem);
  }

  return { event: null, updatedPlayers, newsItems };
}

// ============================================
// EVENT CHOICE (after 100M+ sale)
// ============================================

export function createEventChoiceOptions(season: number): [SeasonEvent, SeasonEvent] {
  const positiveEvents = getPositivePlayerEvents();
  const shuffled = shuffle(positiveEvents);

  const toSeasonEvent = (effect: PlayerEventEffect, index: number): SeasonEvent => ({
    id: `choice_${season}_${index}`,
    title: effect.title,
    description: `Apply this boost to one of your players next season.`,
    tone: "good",
  });

  return [
    toSeasonEvent(shuffled[0], 0),
    toSeasonEvent(shuffled[1], 1),
  ];
}

// ============================================
// FORCED EVENT (developer panel)
// ============================================

export function forcedPositiveEvent(
  season: number,
  gamePlayers: GamePlayer[],
  ownerIndex: number
): SeasonEventResult {
  const result = applyEventToRandomOwnedPlayer(gamePlayers, ownerIndex, season, true);
  return {
    event: null,
    updatedPlayers: result.updatedPlayers,
    newsItems: result.newsItem ? [result.newsItem] : [],
  };
}

export function forcedNegativeEvent(
  season: number,
  gamePlayers: GamePlayer[],
  ownerIndex: number
): SeasonEventResult {
  const result = applyEventToRandomOwnedPlayer(gamePlayers, ownerIndex, season, false);
  return {
    event: null,
    updatedPlayers: result.updatedPlayers,
    newsItems: result.newsItem ? [result.newsItem] : [],
  };
}

export function forcedMarketEvent(
  season: number,
  gamePlayers: GamePlayer[],
  positive: boolean
): SeasonEventResult {
  const { event, newsItem } = createMarketEvent(season, positive);
  return { event, updatedPlayers: gamePlayers, newsItems: [newsItem] };
}