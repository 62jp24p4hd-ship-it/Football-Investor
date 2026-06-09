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
      title: "🏆 Ballon d\'Or Winner", tone: "good",
      multiplier: 1, valueChangeMin: 20, valueChangeMax: 60,
      ratingChange: 5, gamesChange: 4, goalsChange: 10, assistsChange: 6, cleanSheetsChange: 0,
    },
    {
      title: "👟 Golden Boot", tone: "good",
      multiplier: 1, valueChangeMin: 20, valueChangeMax: 50,
      ratingChange: 4, gamesChange: 3, goalsChange: 18, assistsChange: 2, cleanSheetsChange: 0,
    },
    {
      title: "🌟 Golden Boy Award", tone: "good",
      multiplier: 1, valueChangeMin: 15, valueChangeMax: 50,
      maxAge: 21,
      ratingChange: 6, gamesChange: 5, goalsChange: 8, assistsChange: 6, cleanSheetsChange: 0,
    },
    {
      title: "🚀 Wonderkid Explosion", tone: "good",
      multiplier: 1, valueChangeMin: 30, valueChangeMax: 50,
      maxAge: 21,
      ratingChange: 7, gamesChange: 6, goalsChange: 12, assistsChange: 8, cleanSheetsChange: 0,
    },
    {
      title: "💰 Saudi Mega Offer", tone: "good",
      multiplier: 1, valueChangeMin: 40, valueChangeMax: 70,
      ratingChange: 2, gamesChange: 2, goalsChange: 3, assistsChange: 2, cleanSheetsChange: 0,
    },
    {
      title: "💸 Record Transfer Fee", tone: "good",
      multiplier: 1, valueChangeMin: 40, valueChangeMax: 80,
      ratingChange: 3, gamesChange: 3, goalsChange: 5, assistsChange: 4, cleanSheetsChange: 0,
    },
  ];
}

export function getNegativePlayerEvents(): PlayerEventEffect[] {
  return [
    {
      title: "🤕 ACL Injury", tone: "bad",
      multiplier: 1, valueChangeMin: -20, valueChangeMax: -5,
      ratingChange: -6, gamesChange: -10, goalsChange: -5, assistsChange: -4, cleanSheetsChange: -2,
    },
    {
      title: "🚑 Major Injury", tone: "bad",
      multiplier: 1, valueChangeMin: -30, valueChangeMax: -10,
      ratingChange: -10, gamesChange: -20, goalsChange: -8, assistsChange: -6, cleanSheetsChange: -3,
    },
    {
      title: "🪑 Bench Warmer", tone: "bad",
      multiplier: 1, valueChangeMin: -15, valueChangeMax: -5,
      ratingChange: -4, gamesChange: -8, goalsChange: -4, assistsChange: -3, cleanSheetsChange: -1,
    },
    {
      title: "📉 Failed Transfer", tone: "bad",
      multiplier: 1, valueChangeMin: -10, valueChangeMax: -5,
      ratingChange: -5, gamesChange: -5, goalsChange: -3, assistsChange: -3, cleanSheetsChange: -1,
    },
  ];
}

export function applyEventToPlayer(
  player: Player,
  targetSeason: number,
  effect: PlayerEventEffect,
  currentOwnedValue?: number
): Player {
  const stats = getSeasonStats(player, targetSeason);

  const newStats = {
    games: Math.max(0, stats.games + effect.gamesChange),
    goals: Math.max(0, stats.goals + effect.goalsChange),
    assists: Math.max(0, stats.assists + effect.assistsChange),
    cleanSheets: Math.max(0, stats.cleanSheets + effect.cleanSheetsChange),
    rating: Math.max(40, Math.min(99, stats.rating + effect.ratingChange)),
  };

  const base = currentOwnedValue && currentOwnedValue > 0 ? currentOwnedValue : (stats.value || 1);

  let finalValue: number;
  if (effect.valueChangeMin !== undefined && effect.valueChangeMax !== undefined) {
    const flatChange = effect.valueChangeMin + Math.random() * (effect.valueChangeMax - effect.valueChangeMin);
    finalValue = Math.max(1, Math.round(base + flatChange));
  } else {
    // fallback to multiplier
    finalValue = Math.max(1, Math.round(base * (effect.multiplier || 1)));
  }

  return applyStatsModifier(player, targetSeason, {
    ...newStats,
    value: finalValue,
  });
}

function applySpecificEventToPlayer(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number,
  picked: import("./types").OwnedPlayer,
  effect: PlayerEventEffect
): { updatedPlayers: GamePlayer[]; newsItem: NewsItem | null } {
  const owner = gamePlayers[ownerIndex];
  const currentOwnedValue = picked.currentValue && picked.currentValue > 0 ? picked.currentValue : picked.buyPrice;
  const playerBefore = picked.player;
  const playerAfter = applyEventToPlayer(picked.player, season, effect, currentOwnedValue);
  const beforeStats = getSeasonStats(playerBefore, season);
  const afterStats = getSeasonStats(playerAfter, season);

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: effect.title,
    description: `${owner.name}: ${playerBefore.name} | Rating ${beforeStats.rating}→${afterStats.rating} | Value €${currentOwnedValue}M→€${afterStats.value}M`,
    tone: effect.tone,
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item =>
        item.player.name === picked.player.name
          ? { ...item, player: playerAfter, currentValue: afterStats.value }
          : item
      ),
    };
  });

  return { updatedPlayers, newsItem };
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

  const effects = positive ? getPositivePlayerEvents() : getNegativePlayerEvents();
  const effect = pickRandom(effects);

  // فلتر حسب maxAge إذا موجود في الإيفنت
  let eligibleCandidates = candidates;
  if (effect.maxAge) {
    const young = candidates.filter(item => {
      const age = item.player.startAge + (season - item.player.availableSeason);
      return age <= effect.maxAge!;
    });
    if (young.length > 0) eligibleCandidates = young;
    else {
      // ما في لاعبين بالعمر المطلوب — اختار إيفنت ثاني بدون maxAge
      const fallbackEffects = effects.filter(e => !e.maxAge);
      if (fallbackEffects.length === 0) return { updatedPlayers: gamePlayers, newsItem: null };
      const fallbackEffect = pickRandom(fallbackEffects);
      const picked2 = pickRandom(candidates);
      return applySpecificEventToPlayer(gamePlayers, ownerIndex, season, picked2, fallbackEffect);
    }
  }

  const picked = pickRandom(eligibleCandidates);

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
// MARKET EVENTS — تغيير ثابت بالمليون لكل اللاعبين
// ============================================

export function createMarketEvent(
  season: number,
  positive: boolean
): { event: SeasonEvent; newsItem: NewsItem } {
  const title = positive ? "🔥 Hot Transfer Market" : "📉 Market Crash";
  const changeMin = positive ? 10 : -25;
  const changeMax = positive ? 25 : -10;
  const description = positive
    ? `A buying frenzy hits the market. Each player value +€${changeMin}M–€${changeMax}M.`
    : `Economic downturn hits football. Each player value -€${Math.abs(changeMin)}M–€${Math.abs(changeMax)}M.`;

  const event: SeasonEvent = {
    id: `market_${season}`,
    title,
    description,
    tone: positive ? "good" : "bad",
    marketMultiplier: 1, // لا نستخدم multiplier — نستخدم flat change
    flatMarketChangeMin: changeMin,
    flatMarketChangeMax: changeMax,
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

  // 0.05% — Bob Paisley Plane Disaster (ultra-rare)
  if (roll < 0.0005) {
    const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
    return triggerBobPaisleyDisaster(updatedPlayers, ownerIndex, season);
  }

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
    const min = 10, max = 25;
    const changes: string[] = [];
    updatedPlayers = updatedPlayers.map(gp => ({
      ...gp,
      owned: gp.owned.map(item => {
        const base = (item.currentValue && item.currentValue > 0) ? item.currentValue : item.buyPrice;
        const change = Math.round(min + Math.random() * (max - min));
        const newVal = Math.max(1, base + change);
        changes.push(`${item.player.name.split(" ").pop()}: €${base}M → €${newVal}M`);
        return { ...item, currentValue: newVal };
      }),
    }));
    const detailNews: NewsItem = {
      id: randomId(), season,
      title: "🔥 Hot Market — Values Updated",
      description: changes.length > 0 ? changes.join(" | ") : "No players affected.",
      tone: "good",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    };
    return { event, updatedPlayers, newsItems: [newsItem, detailNews] };
  }

  // 20% — market crash
  if (roll < 0.55) {
    const { event, newsItem } = createMarketEvent(season, false);
    const min = -25, max = -10;
    const changes: string[] = [];
    updatedPlayers = updatedPlayers.map(gp => ({
      ...gp,
      owned: gp.owned.map(item => {
        const base = (item.currentValue && item.currentValue > 0) ? item.currentValue : item.buyPrice;
        const change = Math.round(min + Math.random() * (max - min));
        const newVal = Math.max(1, base + change);
        changes.push(`${item.player.name.split(" ").pop()}: €${base}M → €${newVal}M`);
        return { ...item, currentValue: newVal };
      }),
    }));
    const detailNews: NewsItem = {
      id: randomId(), season,
      title: "📉 Market Crash — Values Updated",
      description: changes.length > 0 ? changes.join(" | ") : "No players affected.",
      tone: "bad",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    };
    return { event, updatedPlayers, newsItems: [newsItem, detailNews] };
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

// ============================================
// FORCED SPECIFIC EVENT — للـ Developer Panel
// يطبّق الإيفنت المحدد بالضبط بدل عشوائي
// ============================================

const EVENT_MAP: Record<string, PlayerEventEffect & { isFreeTransfer?: boolean; isFlorentinoPerez?: boolean }> = {
  ballonDor: {
    title: "🏆 Ballon d'Or Winner", tone: "good",
    multiplier: 1, valueChangeMin: 20, valueChangeMax: 60,
    ratingChange: 5, gamesChange: 4, goalsChange: 10, assistsChange: 6, cleanSheetsChange: 0,
  },
  goldenBoot: {
    title: "👟 Golden Boot", tone: "good",
    multiplier: 1, valueChangeMin: 20, valueChangeMax: 50,
    ratingChange: 4, gamesChange: 3, goalsChange: 18, assistsChange: 2, cleanSheetsChange: 0,
  },
  goldenBoy: {
    title: "🌟 Golden Boy Award", tone: "good",
    multiplier: 1, valueChangeMin: 15, valueChangeMax: 50,
    ratingChange: 6, gamesChange: 5, goalsChange: 8, assistsChange: 6, cleanSheetsChange: 0,
  },
  wonderkid: {
    title: "🚀 Wonderkid Explosion", tone: "good",
    multiplier: 1, valueChangeMin: 30, valueChangeMax: 50,
    maxAge: 21,
    ratingChange: 7, gamesChange: 6, goalsChange: 12, assistsChange: 8, cleanSheetsChange: 0,
  },
  saudiOffer: {
    title: "💰 Saudi Mega Offer", tone: "good",
    multiplier: 1, valueChangeMin: 40, valueChangeMax: 70,
    ratingChange: 2, gamesChange: 2, goalsChange: 3, assistsChange: 2, cleanSheetsChange: 0,
  },
  recordTransfer: {
    title: "💸 Record Transfer Fee", tone: "good",
    multiplier: 1, valueChangeMin: 40, valueChangeMax: 80,
    ratingChange: 3, gamesChange: 3, goalsChange: 5, assistsChange: 4, cleanSheetsChange: 0,
  },
  aclInjury: {
    title: "🤕 ACL Injury", tone: "bad",
    multiplier: 1, valueChangeMin: -20, valueChangeMax: -5,
    ratingChange: -6, gamesChange: -10, goalsChange: -5, assistsChange: -4, cleanSheetsChange: -2,
  },
  majorInjury: {
    title: "🚑 Major Injury", tone: "bad",
    multiplier: 1, valueChangeMin: -30, valueChangeMax: -10,
    ratingChange: -10, gamesChange: -20, goalsChange: -8, assistsChange: -6, cleanSheetsChange: -3,
  },
  benchWarmer: {
    title: "🪑 Bench Warmer", tone: "bad",
    multiplier: 1, valueChangeMin: -15, valueChangeMax: -5,
    ratingChange: -4, gamesChange: -8, goalsChange: -4, assistsChange: -3, cleanSheetsChange: -1,
  },
  failedTransfer: {
    title: "📉 Failed Transfer", tone: "bad",
    multiplier: 1, valueChangeMin: -10, valueChangeMax: -5,
    ratingChange: -5, gamesChange: -5, goalsChange: -3, assistsChange: -3, cleanSheetsChange: -1,
  },
  freeTransfer: {
    title: "🚪 Free Transfer — Player Leaves!", tone: "bad",
    multiplier: 1, valueChangeMin: 0, valueChangeMax: 0,
    isFreeTransfer: true,
    ratingChange: 0, gamesChange: 0, goalsChange: 0, assistsChange: 0, cleanSheetsChange: 0,
  },
  florentinoPerez: {
    title: "👑 Florentino Perez Interest", tone: "bad",
    multiplier: 1, valueChangeMin: 0, valueChangeMax: 0,
    isFlorentinoPerez: true,
    ratingChange: 0, gamesChange: 0, goalsChange: 0, assistsChange: 0, cleanSheetsChange: 0,
  },
};

// ============================================
// FLORENTINO PEREZ EVENT
// ============================================

export function triggerFlorentinoPerezEvent(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) {
    return { event: null, updatedPlayers: gamePlayers, newsItems: [] };
  }

  // اختار لاعب عشوائي
  const candidates = owner.owned.filter(item => !item.refusesRenewal && !item.player.secret);
  if (candidates.length === 0) {
    return { event: null, updatedPlayers: gamePlayers, newsItems: [] };
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: `👑 Florentino Perez — ${picked.player.name}`,
    description: `Florentino Perez has entered the race for ${picked.player.name}. The player is now refusing to renew his contract with ${owner.name}.`,
    tone: "bad",
    journalist: "Fabrizio Romano",
    source: "Sky Sports",
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item =>
        item.player.name === picked.player.name
          ? { ...item, refusesRenewal: true }
          : item
      ),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

export function forcedSpecificEvent(
  eventId: string,
  season: number,
  gamePlayers: GamePlayer[],
  ownerIndex: number
): SeasonEventResult {
  const effect = EVENT_MAP[eventId];
  if (!effect) {
    const positive = ["ballonDor","goldenBoy","goldenBoot","wonderkid","saudiOffer","recordTransfer"].includes(eventId);
    const result = applyEventToRandomOwnedPlayer(gamePlayers, ownerIndex, season, positive);
    return { event: null, updatedPlayers: result.updatedPlayers, newsItems: result.newsItem ? [result.newsItem] : [] };
  }

  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  // فلتر حسب العمر للـ Wonderkid
  let candidates = owner.owned.filter(item => !item.player.secret);
  if (effect.maxAge) {
    const young = candidates.filter(item => {
      const age = item.player.startAge + (season - item.player.availableSeason);
      return age <= effect.maxAge!;
    });
    if (young.length > 0) candidates = young;
  }
  if (candidates.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  // Free Transfer — يطرد اللاعب فوراً
  if ((effect as any).isFreeTransfer) {
    const newsItem: NewsItem = {
      id: randomId(), season,
      title: "🚪 Free Transfer — Player Leaves!",
      description: `${picked.player.name} has left ${owner.name} on a free transfer!`,
      tone: "bad",
      journalist: "Fabrizio Romano",
      source: "Sky Sports",
    };
    const updatedPlayers = gamePlayers.map((gp, i) => {
      if (i !== ownerIndex) return gp;
      return {
        ...gp,
        owned: gp.owned.filter(item => item.player.name !== picked.player.name),
        sold: [...gp.sold, {
          owner: gp.name, name: picked.player.name,
          buySeason: picked.buySeason, sellSeason: season,
          buyPrice: picked.buyPrice, sellPrice: 0, profit: -picked.buyPrice,
          position: picked.player.position,
        }],
      };
    });
    return { event: null, updatedPlayers, newsItems: [newsItem] };
  }

  // Florentino Perez — يرفض التجديد
  if ((effect as any).isFlorentinoPerez) {
    return triggerFlorentinoPerezEvent(gamePlayers, ownerIndex, season);
  }

  const currentOwnedValue = picked.currentValue && picked.currentValue > 0 ? picked.currentValue : picked.buyPrice;
  const playerBefore = picked.player;
  const playerAfter = applyEventToPlayer(picked.player, season, effect, currentOwnedValue);
  const beforeStats = getSeasonStats(playerBefore, season);
  const afterStats = getSeasonStats(playerAfter, season);
  const afterValue = afterStats.value;

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: effect.title,
    description: `${owner.name}: ${playerBefore.name} | Rating ${beforeStats.rating}→${afterStats.rating} | Value €${currentOwnedValue}M→€${afterValue}M`,
    tone: effect.tone as import("./types").NewsTone,
    journalist: "David Ornstein",
    source: "The Athletic",
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item =>
        item.player.name === picked.player.name
          ? { ...item, player: playerAfter, currentValue: afterValue }
          : item
      ),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

// ============================================
// BOB PAISLEY PLANE DISASTER — Ultra Rare
// ============================================

export function triggerBobPaisleyDisaster(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) {
    return { event: null, updatedPlayers: gamePlayers, newsItems: [] };
  }

  // اختار عدد عشوائي من 1 إلى min(11, عدد اللاعبين)
  const maxAffected = Math.min(11, owner.owned.length);
  const count = 1 + Math.floor(Math.random() * maxAffected);

  // خلط اللاعبين واختيار عشوائي
  const shuffled = [...owner.owned].sort(() => Math.random() - 0.5);
  const affected = shuffled.slice(0, count);
  const affectedNames = affected.map(item => item.player.name);

  const newsItem: NewsItem = {
    id: randomId(),
    season,
    title: "✈️ Bob Paisley Plane Disaster",
    description: `A tragic aviation accident occurred while several players from ${owner.name} were travelling for a commercial shoot. ` +
      `${count} career${count > 1 ? "s have" : " has"} come to an unexpected end. ` +
      `Affected players: ${affectedNames.join(", ")}.`,
    tone: "bad",
    journalist: "Fabrizio Romano",
    source: "Sky Sports",
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    const affectedSet = new Set(affectedNames);
    return {
      ...gp,
      owned: gp.owned.filter(item => !affectedSet.has(item.player.name)),
      sold: [
        ...gp.sold,
        ...affected.map(item => ({
          owner: gp.name,
          name: item.player.name,
          buySeason: item.buySeason,
          sellSeason: season,
          buyPrice: item.buyPrice,
          sellPrice: 0,
          profit: -item.buyPrice,
          position: item.player.position,
        })),
      ],
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}