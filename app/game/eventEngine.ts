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
// MAIN SEASON EVENT GENERATOR — Balanced
// ============================================

// ذاكرة الإيفنتات الأخيرة — anti-repetition
const recentEvents: string[] = [];
const MAX_RECENT = 3;

function recordEvent(id: string) {
  recentEvents.push(id);
  if (recentEvents.length > MAX_RECENT) recentEvents.shift();
}

function wasRecent(id: string): boolean {
  return recentEvents.includes(id);
}

export function createRandomSeasonEvent(
  season: number,
  gamePlayers: GamePlayer[]
): SeasonEventResult {
  const newsItems: NewsItem[] = [];
  let updatedPlayers = [...gamePlayers];

  // 0.05% — Bob Paisley (ultra-rare، دائماً ممكن)
  if (Math.random() < 0.0005) {
    const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
    return triggerBobPaisleyDisaster(updatedPlayers, ownerIndex, season);
  }

  // قائمة الإيفنتات المتاحة مع أوزانها
  type EventEntry = { id: string; weight: number; fn: () => SeasonEventResult };

  const pool: EventEntry[] = [
    // Quiet — 12%
    {
      id: "quiet", weight: wasRecent("quiet") ? 4 : 12,
      fn: () => ({
        event: null, updatedPlayers,
        newsItems: [{
          id: randomId(), season,
          title: "📰 Quiet Season",
          description: "No major events this season. Markets remain stable.",
          tone: "neutral" as const,
          journalist: pickRandom(JOURNALISTS),
          source: pickRandom(NEWS_SOURCES),
        }],
      }),
    },

    // Hot Market — 10% (مخفّض من 20%)
    {
      id: "hotMarket", weight: wasRecent("hotMarket") ? 2 : 10,
      fn: () => {
        const { event, newsItem } = createMarketEvent(season, true);
        const min = 10, max = 25;
        const changes: string[] = [];
        const up = updatedPlayers.map(gp => ({
          ...gp,
          owned: gp.owned.map(item => {
            const base = item.currentValue || item.buyPrice;
            const change = Math.round(min + Math.random() * (max - min));
            const newVal = Math.max(1, base + change);
            changes.push(`${item.player.name.split(" ").pop()}: €${base}M → €${newVal}M`);
            return { ...item, currentValue: newVal };
          }),
        }));
        return { event, updatedPlayers: up, newsItems: [newsItem, {
          id: randomId(), season,
          title: "🔥 Hot Market — Values Updated",
          description: changes.join(" | ") || "No players affected.",
          tone: "good" as const,
          journalist: pickRandom(JOURNALISTS), source: pickRandom(NEWS_SOURCES),
        }] };
      },
    },

    // Market Crash — 10% (مخفّض من 20%)
    {
      id: "marketCrash", weight: wasRecent("marketCrash") ? 2 : 10,
      fn: () => {
        const { event, newsItem } = createMarketEvent(season, false);
        const min = -25, max = -10;
        const changes: string[] = [];
        const up = updatedPlayers.map(gp => ({
          ...gp,
          owned: gp.owned.map(item => {
            const base = item.currentValue || item.buyPrice;
            const change = Math.round(min + Math.random() * (max - min));
            const newVal = Math.max(1, base + change);
            changes.push(`${item.player.name.split(" ").pop()}: €${base}M → €${newVal}M`);
            return { ...item, currentValue: newVal };
          }),
        }));
        return { event, updatedPlayers: up, newsItems: [newsItem, {
          id: randomId(), season,
          title: "📉 Market Crash — Values Updated",
          description: changes.join(" | ") || "No players affected.",
          tone: "bad" as const,
          journalist: pickRandom(JOURNALISTS), source: pickRandom(NEWS_SOURCES),
        }] };
      },
    },

    // Player positive event — 18%
    {
      id: "playerPositive", weight: 18,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        const result = applyEventToRandomOwnedPlayer(updatedPlayers, ownerIndex, season, true);
        return { event: null, updatedPlayers: result.updatedPlayers, newsItems: result.newsItem ? [result.newsItem] : [] };
      },
    },

    // Player negative event — 16%
    {
      id: "playerNegative", weight: 16,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        const result = applyEventToRandomOwnedPlayer(updatedPlayers, ownerIndex, season, false);
        return { event: null, updatedPlayers: result.updatedPlayers, newsItems: result.newsItem ? [result.newsItem] : [] };
      },
    },

    // Both players get events — 14%
    {
      id: "bothEvents", weight: wasRecent("bothEvents") ? 5 : 14,
      fn: () => {
        let up = [...updatedPlayers];
        const ni: NewsItem[] = [];
        for (let i = 0; i < gamePlayers.length; i++) {
          const result = applyEventToRandomOwnedPlayer(up, i, season, Math.random() > 0.4);
          up = result.updatedPlayers;
          if (result.newsItem) ni.push(result.newsItem);
        }
        return { event: null, updatedPlayers: up, newsItems: ni };
      },
    },

    // Dream Season — 5%
    {
      id: "dreamSeason", weight: wasRecent("dreamSeason") ? 1 : 5,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerDreamSeason(updatedPlayers, ownerIndex, season);
      },
    },

    // Locker Room Drama — 5%
    {
      id: "lockerRoom", weight: wasRecent("lockerRoom") ? 1 : 5,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerLockerRoomDrama(updatedPlayers, ownerIndex, season);
      },
    },

    // Free Transfer — 4%
    {
      id: "freeTransfer", weight: wasRecent("freeTransfer") ? 1 : 4,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return forcedSpecificEvent("freeTransfer", season, updatedPlayers, ownerIndex);
      },
    },

    // Florentino Perez — 3%
    {
      id: "florentinoPerez", weight: wasRecent("florentinoPerez") ? 1 : 3,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerFlorentinoPerezEvent(updatedPlayers, ownerIndex, season);
      },
    },

    // Temporary effects — 6% مجتمعة
    {
      id: "fastFood", weight: wasRecent("fastFood") ? 1 : 2,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerFastFoodAddiction(updatedPlayers, ownerIndex, season);
      },
    },
    {
      id: "breakup", weight: wasRecent("breakup") ? 1 : 2,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerBreakupSeason(updatedPlayers, ownerIndex, season);
      },
    },
    {
      id: "casinoNight", weight: wasRecent("casinoNight") ? 1 : 2,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerCasinoNight(updatedPlayers, ownerIndex, season);
      },
    },
    {
      id: "oneSeason", weight: wasRecent("oneSeason") ? 1 : 2,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerOneSeasonWonder(updatedPlayers, ownerIndex, season);
      },
    },
    {
      id: "youtube", weight: wasRecent("youtube") ? 1 : 2,
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerYouTubeViral(updatedPlayers, ownerIndex, season);
      },
    },
  ];

  // Weighted random selection
  const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const entry of pool) {
    rand -= entry.weight;
    if (rand <= 0) {
      recordEvent(entry.id);
      return entry.fn();
    }
  }

  // fallback
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

// ============================================
// FAST FOOD ADDICTION — Temporary Negative
// ============================================

export function triggerFastFoodAddiction(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) {
    return { event: null, updatedPlayers: gamePlayers, newsItems: [] };
  }

  const candidates = owner.owned.filter(item => {
    const effects = item.activeEffects ?? [];
    return !effects.some(e => e.id === "fastFood");
  });
  if (candidates.length === 0) {
    return { event: null, updatedPlayers: gamePlayers, newsItems: [] };
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const valuePenalty = Math.round(picked.currentValue * 0.20);
  const newValue = Math.max(1, picked.currentValue - valuePenalty);

  const effect: import("./types").ActiveEffect = {
    id: "fastFood",
    name: "Fast Food Addiction",
    emoji: "🍔",
    expiresAfterSeason: season + 1,
    valueChangePct: -0.20,
    ratingChange: -5,
  };

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: `🍔 Fast Food Addiction — ${picked.player.name}`,
    description: `${picked.player.name} has reportedly gained weight during the summer after developing an unhealthy fast-food habit. Coaches are concerned about his physical condition. Value dropped by €${valuePenalty}M.`,
    tone: "bad",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item =>
        item.player.name === picked.player.name
          ? {
              ...item,
              currentValue: newValue,
              activeEffects: [...(item.activeEffects ?? []), effect],
            }
          : item
      ),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

// expire active effects each new season
export function expireActiveEffects(
  gamePlayers: GamePlayer[],
  newSeason: number
): GamePlayer[] {
  return gamePlayers.map(gp => ({
    ...gp,
    owned: gp.owned.map(item => {
      if (!item.activeEffects || item.activeEffects.length === 0) return item;
      const remaining = item.activeEffects.filter(e => e.expiresAfterSeason >= newSeason);
      const expired = item.activeEffects.filter(e => e.expiresAfterSeason < newSeason);

      // restore value for expired effects
      let restoredValue = item.currentValue;
      expired.forEach(e => {
        if (e.valueChangePct) {
          restoredValue = Math.round(restoredValue / (1 + e.valueChangePct));
        }
      });

      return { ...item, currentValue: Math.max(1, restoredValue), activeEffects: remaining };
    }),
  }));
}

// ============================================
// BREAKUP SEASON — Temporary Negative
// ============================================

export function triggerBreakupSeason(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const candidates = owner.owned.filter(item =>
    !(item.activeEffects ?? []).some(e => e.id === "breakup")
  );
  if (candidates.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const valuePenalty = Math.round(picked.currentValue * 0.10);
  const newValue = Math.max(1, picked.currentValue - valuePenalty);

  const effect: import("./types").ActiveEffect = {
    id: "breakup",
    name: "Breakup Season",
    emoji: "💔",
    expiresAfterSeason: season + 1,
    valueChangePct: -0.10,
    ratingChange: -4,
  };

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: `💔 Breakup Season — ${picked.player.name}`,
    description: `Sources close to ${picked.player.name} report a difficult personal period. The player's recent performances have been affected by off-field distractions.`,
    tone: "bad",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item =>
        item.player.name === picked.player.name
          ? { ...item, currentValue: newValue, activeEffects: [...(item.activeEffects ?? []), effect] }
          : item
      ),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

// ============================================
// CASINO NIGHT — Contract Penalty
// ============================================

export function triggerCasinoNight(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const candidates = owner.owned.filter(item =>
    !(item.activeEffects ?? []).some(e => e.id === "casino")
  );
  if (candidates.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  // Casino: يرفع متطلبات الراتب بدون تغيير القيمة
  const effect: import("./types").ActiveEffect = {
    id: "casino",
    name: "Casino Night",
    emoji: "🎰",
    expiresAfterSeason: season + 2, // موسمان أو حتى تجديد العقد
    salaryDemandMultiplier: 1.50,   // +50% على راتب الاعب
  };

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: `🎰 Casino Night — ${picked.player.name}`,
    description: `${picked.player.name} reportedly suffered heavy losses during a late-night casino visit. Sources claim the player is now seeking a significantly larger contract.`,
    tone: "bad",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item =>
        item.player.name === picked.player.name
          ? { ...item, activeEffects: [...(item.activeEffects ?? []), effect] }
          : item
      ),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

// ============================================
// ONE SEASON WONDER — Temporary Positive
// ============================================

export function triggerOneSeasonWonder(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const candidates = owner.owned.filter(item =>
    !(item.activeEffects ?? []).some(e => e.id === "oneSeason")
  );
  if (candidates.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const valueBonus = Math.round(picked.currentValue * 0.60);
  const newValue = picked.currentValue + valueBonus;

  const effect: import("./types").ActiveEffect = {
    id: "oneSeason",
    name: "One Season Wonder",
    emoji: "🎯",
    expiresAfterSeason: season + 1,
    valueChangePct: 0.60,
  };

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: `🎯 One Season Wonder — ${picked.player.name}`,
    description: `${picked.player.name} is enjoying the best season of his career. His performances have exceeded all expectations and attracted attention from clubs around the world.`,
    tone: "good",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item =>
        item.player.name === picked.player.name
          ? { ...item, currentValue: newValue, activeEffects: [...(item.activeEffects ?? []), effect] }
          : item
      ),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

// ============================================
// YOUTUBE GOES VIRAL — Temporary Positive
// ============================================

export function triggerYouTubeViral(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const candidates = owner.owned.filter(item =>
    !(item.activeEffects ?? []).some(e => e.id === "youtube")
  );
  if (candidates.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const valueBonus = Math.round(picked.currentValue * 0.20);
  const newValue = picked.currentValue + valueBonus;

  const effect: import("./types").ActiveEffect = {
    id: "youtube",
    name: "YouTube Goes Viral",
    emoji: "📺",
    expiresAfterSeason: season + 1,
    valueChangePct: 0.20,
  };

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: `📺 YouTube Compilation Goes Viral — ${picked.player.name}`,
    description: `A viral compilation has dramatically increased ${picked.player.name}'s popularity. The player has gained worldwide attention after a highlights video spread across social media.`,
    tone: "good",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item =>
        item.player.name === picked.player.name
          ? { ...item, currentValue: newValue, activeEffects: [...(item.activeEffects ?? []), effect] }
          : item
      ),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

// ============================================
// DREAM SEASON — Legendary Positive (Team-Wide)
// ============================================

export function triggerDreamSeason(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const effect: import("./types").ActiveEffect = {
    id: "dreamSeason",
    name: "Dream Season",
    emoji: "🔥",
    expiresAfterSeason: season + 1,
    valueChangePct: 0.25,
  };

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: `🔥 Dream Season — ${owner.name}`,
    description: `${owner.name} is enjoying a dream season. Every player seems to be performing at an elite level and the entire squad is benefiting from an incredible run of form.`,
    tone: "good",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item => {
        const alreadyHas = (item.activeEffects ?? []).some(e => e.id === "dreamSeason");
        if (alreadyHas) return item;
        const valueBonus = Math.round(item.currentValue * 0.25);
        return {
          ...item,
          currentValue: item.currentValue + valueBonus,
          activeEffects: [...(item.activeEffects ?? []), effect],
        };
      }),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

// ============================================
// LOCKER ROOM DRAMA — Legendary Negative (Team-Wide)
// ============================================

export function triggerLockerRoomDrama(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const owner = gamePlayers[ownerIndex];
  if (!owner || owner.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const effect: import("./types").ActiveEffect = {
    id: "lockerRoom",
    name: "Locker Room Drama",
    emoji: "🗣️",
    expiresAfterSeason: season + 1,
    valueChangePct: 0,
    ratingChange: -3,
    salaryDemandMultiplier: 1.50,
  };

  const newsItem: NewsItem = {
    id: randomId(), season,
    title: `🗣️ Locker Room Drama — ${owner.name}`,
    description: `Reports suggest major tensions have emerged inside the dressing room at ${owner.name}. Several players are unhappy and the atmosphere around the club has deteriorated significantly.`,
    tone: "bad",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item => {
        const alreadyHas = (item.activeEffects ?? []).some(e => e.id === "lockerRoom");
        if (alreadyHas) return item;
        return {
          ...item,
          activeEffects: [...(item.activeEffects ?? []), effect],
        };
      }),
    };
  });

  return { event: null, updatedPlayers, newsItems: [newsItem] };
}

// ============================================
// SEPARATE EVENT PER INVESTOR — Versus Mode
// ============================================

export function createVersusSeasonEvents(
  season: number,
  gamePlayers: GamePlayer[]
): { updatedPlayers: GamePlayer[]; newsItems: NewsItem[] } {
  let players = [...gamePlayers];
  const allNews: NewsItem[] = [];

  // Track used event IDs لتجنب التكرار
  const usedIds: string[] = [];

  for (let i = 0; i < players.length; i++) {
    const gp = players[i];
    if (!gp) continue;

    // أنشئ pool مستقل لكل لاعب مع تجنب الـ IDs المستخدمة
    const result = createRandomSeasonEventForPlayer(season, players, i, usedIds);
    players = result.updatedPlayers;

    if (result.eventId) usedIds.push(result.eventId);

    // أضف header للخبر يوضح أن الإيفنت خاص بهذا اللاعب
    result.newsItems.forEach(item => {
      allNews.push({
        ...item,
        title: `📢 ${gp.name}: ${item.title}`,
      });
    });
  }

  return { updatedPlayers: players, newsItems: allNews };
}

function createRandomSeasonEventForPlayer(
  season: number,
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  excludeIds: string[]
): { updatedPlayers: GamePlayer[]; newsItems: NewsItem[]; eventId: string | null } {
  const updatedPlayers = [...gamePlayers];

  function wrapPlayerEvent(positive: boolean): SeasonEventResult {
    const r = applyEventToRandomOwnedPlayer(updatedPlayers, ownerIndex, season, positive);
    return { event: null, updatedPlayers: r.updatedPlayers, newsItems: r.newsItem ? [r.newsItem] : [] };
  }

  type EventEntry = { id: string; weight: number; fn: () => SeasonEventResult };

  const pool: EventEntry[] = [
    { id: "playerPositive", weight: 22, fn: () => wrapPlayerEvent(true) },
    { id: "playerNegative", weight: 20, fn: () => wrapPlayerEvent(false) },
    { id: "hotMarket",      weight: wasRecent("hotMarket_"+ownerIndex) ? 2 : 10, fn: () => applyMarketEventForPlayer(updatedPlayers, ownerIndex, season, true) },
    { id: "marketCrash",    weight: wasRecent("marketCrash_"+ownerIndex) ? 2 : 10, fn: () => applyMarketEventForPlayer(updatedPlayers, ownerIndex, season, false) },
    { id: "quiet",          weight: 12, fn: () => ({ event: null, updatedPlayers, newsItems: [{ id: randomId(), season, title: "📰 Quiet Season", description: "No major market events.", tone: "neutral" as const, journalist: pickRandom(JOURNALISTS), source: pickRandom(NEWS_SOURCES) }] }) },
    { id: "fastFood",       weight: wasRecent("fastFood") ? 1 : 5, fn: () => triggerFastFoodAddiction(updatedPlayers, ownerIndex, season) },
    { id: "breakup",        weight: wasRecent("breakup") ? 1 : 5, fn: () => triggerBreakupSeason(updatedPlayers, ownerIndex, season) },
    { id: "oneSeason",      weight: wasRecent("oneSeason") ? 1 : 5, fn: () => triggerOneSeasonWonder(updatedPlayers, ownerIndex, season) },
    { id: "youtube",        weight: wasRecent("youtube") ? 1 : 5, fn: () => triggerYouTubeViral(updatedPlayers, ownerIndex, season) },
    { id: "casinoNight",    weight: wasRecent("casinoNight") ? 1 : 4, fn: () => triggerCasinoNight(updatedPlayers, ownerIndex, season) },
    { id: "freeTransfer",   weight: 3, fn: () => forcedSpecificEvent("freeTransfer", season, updatedPlayers, ownerIndex) },
    { id: "florentinoPerez",weight: 2, fn: () => triggerFlorentinoPerezEvent(updatedPlayers, ownerIndex, season) },
    { id: "dreamSeason",    weight: wasRecent("dreamSeason") ? 1 : 4, fn: () => triggerDreamSeason(updatedPlayers, ownerIndex, season) },
    { id: "lockerRoom",     weight: wasRecent("lockerRoom") ? 1 : 4, fn: () => triggerLockerRoomDrama(updatedPlayers, ownerIndex, season) },
  ].filter(e => !excludeIds.includes(e.id));

  if (pool.length === 0) return { updatedPlayers, newsItems: [], eventId: null };

  const total = pool.reduce((s, e) => s + e.weight, 0);
  let rand = Math.random() * total;
  for (const entry of pool) {
    rand -= entry.weight;
    if (rand <= 0) {
      recordEvent(entry.id);
      const result = entry.fn();
      // إرجاع النوع الصحيح مع eventId منفصل
      return { updatedPlayers: result.updatedPlayers, newsItems: result.newsItems, eventId: entry.id };
    }
  }

  return { updatedPlayers, newsItems: [], eventId: null };
}

function applyMarketEventForPlayer(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number,
  positive: boolean
): SeasonEventResult {
  const { event, newsItem } = createMarketEvent(season, positive);
  const min = positive ? 10 : -25;
  const max = positive ? 25 : -10;
  const changes: string[] = [];

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== ownerIndex) return gp;
    return {
      ...gp,
      owned: gp.owned.map(item => {
        const base = item.currentValue || item.buyPrice;
        const change = Math.round(min + Math.random() * (max - min));
        const newVal = Math.max(1, base + change);
        changes.push(`${item.player.name.split(" ").pop()}: €${base}M → €${newVal}M`);
        return { ...item, currentValue: newVal };
      }),
    };
  });

  return {
    event,
    updatedPlayers,
    newsItems: [newsItem, {
      id: randomId(), season,
      title: positive ? "🔥 Hot Market — Values Updated" : "📉 Market Crash — Values Updated",
      description: changes.join(" | ") || "No players affected.",
      tone: positive ? "good" as const : "bad" as const,
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}