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
const MAX_RECENT = 6; // كان 3 — الحين يتذكر آخر 6 إيفنتات

function recordEvent(id: string) {
  recentEvents.push(id);
  if (recentEvents.length > MAX_RECENT) recentEvents.shift();
}

function wasRecent(id: string): boolean {
  return recentEvents.includes(id);
}

// عدد مرات تكرار الإيفنت في الذاكرة الأخيرة
function recentCount(id: string): number {
  return recentEvents.filter(e => e === id).length;
}

// وزن ديناميكي — كلما طلع أكثر كلما خفّ وزنه أكثر
function dynamicWeight(id: string, baseWeight: number): number {
  const count = recentCount(id);
  if (count === 0) return baseWeight;
  if (count === 1) return Math.round(baseWeight * 0.3);
  return Math.round(baseWeight * 0.1); // إذا طلع مرتين في آخر 6 مواسم يصير نادر جداً
}

export function createRandomSeasonEvent(
  season: number,
  gamePlayers: GamePlayer[],
  isDuringSeason = false
): SeasonEventResult {
  const newsItems: NewsItem[] = [];
  let updatedPlayers = [...gamePlayers];

  // 0.05% — Bob Paisley (ultra-rare) — لا يظهر أثناء الموسم
  if (!isDuringSeason && Math.random() < 0.0005) {
    const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
    return triggerBobPaisleyDisaster(updatedPlayers, ownerIndex, season);
  }

  // قائمة الإيفنتات المتاحة مع أوزانها
  type EventEntry = { id: string; weight: number; fn: () => SeasonEventResult };

  const pool: EventEntry[] = [
    // Quiet — خفّضناه من 12% إلى 5%
    {
      id: "quiet", weight: dynamicWeight("quiet", 5),
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

    // Hot Market — 9%
    {
      id: "hotMarket", weight: dynamicWeight("hotMarket", 9),
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

    // Market Crash — 9%
    {
      id: "marketCrash", weight: dynamicWeight("marketCrash", 9),
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

    // Player positive event — 14% (خفّضناه من 18%)
    {
      id: "playerPositive", weight: dynamicWeight("playerPositive", 14),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        const result = applyEventToRandomOwnedPlayer(updatedPlayers, ownerIndex, season, true);
        return { event: null, updatedPlayers: result.updatedPlayers, newsItems: result.newsItem ? [result.newsItem] : [] };
      },
    },

    // Player negative event — 12% (خفّضناه من 16%)
    {
      id: "playerNegative", weight: dynamicWeight("playerNegative", 12),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        const result = applyEventToRandomOwnedPlayer(updatedPlayers, ownerIndex, season, false);
        return { event: null, updatedPlayers: result.updatedPlayers, newsItems: result.newsItem ? [result.newsItem] : [] };
      },
    },

    // Both players get events — 10% (خفّضناه من 14%)
    {
      id: "bothEvents", weight: dynamicWeight("bothEvents", 10),
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

    // Dream Season — رفعناه من 5% إلى 8%
    {
      id: "dreamSeason", weight: dynamicWeight("dreamSeason", 8),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerDreamSeason(updatedPlayers, ownerIndex, season);
      },
    },

    // Locker Room Drama — رفعناه من 5% إلى 7%
    {
      id: "lockerRoom", weight: dynamicWeight("lockerRoom", 7),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerLockerRoomDrama(updatedPlayers, ownerIndex, season);
      },
    },

    // Free Transfer — رفعناه من 4% إلى 6%
    {
      id: "freeTransfer", weight: dynamicWeight("freeTransfer", 6),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return forcedSpecificEvent("freeTransfer", season, updatedPlayers, ownerIndex);
      },
    },

    // Florentino Perez — رفعناه من 3% إلى 5%
    {
      id: "florentinoPerez", weight: dynamicWeight("florentinoPerez", 5),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerFlorentinoPerezEvent(updatedPlayers, ownerIndex, season);
      },
    },

    // الإيفنتات الفردية — رفعنا كل واحد من 2% إلى 4%
    {
      id: "fastFood", weight: dynamicWeight("fastFood", 4),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerFastFoodAddiction(updatedPlayers, ownerIndex, season);
      },
    },
    {
      id: "breakup", weight: dynamicWeight("breakup", 4),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerBreakupSeason(updatedPlayers, ownerIndex, season);
      },
    },
    {
      id: "casinoNight", weight: dynamicWeight("casinoNight", 4),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerCasinoNight(updatedPlayers, ownerIndex, season);
      },
    },
    {
      id: "oneSeason", weight: dynamicWeight("oneSeason", 4),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerOneSeasonWonder(updatedPlayers, ownerIndex, season);
      },
    },
    {
      id: "youtube", weight: dynamicWeight("youtube", 4),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerYouTubeViral(updatedPlayers, ownerIndex, season);
      },
    },
    // Eriksen Heart Attack — 3%
    {
      id: "eriksenHeartAttack", weight: dynamicWeight("eriksenHeartAttack", 3),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerEriksenHeartAttack(updatedPlayers, ownerIndex, season);
      },
    },
    // Doping Ban — 4%
    {
      id: "dopingBan", weight: dynamicWeight("dopingBan", 4),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerDopingBan(updatedPlayers, ownerIndex, season);
      },
    },
    // Girls Magnet — 4%
    {
      id: "girlsMagnet", weight: dynamicWeight("girlsMagnet", 4),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerGirlsMagnet(updatedPlayers, ownerIndex, season);
      },
    },
    // Racist Attack — 3%
    {
      id: "racistAttack", weight: dynamicWeight("racistAttack", 3),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerRacistAttack(updatedPlayers, ownerIndex, season);
      },
    },
    // Club Legend — 3%
    {
      id: "clubLegend", weight: dynamicWeight("clubLegend", 3),
      fn: () => {
        const ownerIndex = Math.floor(Math.random() * gamePlayers.length);
        return triggerClubLegend(updatedPlayers, ownerIndex, season);
      },
    },
  ];

  // أثناء الموسم: أزل الإيفنتات التي تطرد اللاعبين من النادي
  const DEPARTURE_EVENTS = new Set(["freeTransfer", "florentinoPerez"]);
  const activePool = isDuringSeason
    ? pool.filter(e => !DEPARTURE_EVENTS.has(e.id))
    : pool;

  // Weighted random selection
  const totalWeight = activePool.reduce((sum, e) => sum + e.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const entry of activePool) {
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

// ============================================
// ERIKSEN HEART ATTACK
// ============================================
export function triggerEriksenHeartAttack(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const gp = gamePlayers[ownerIndex];
  if (!gp || gp.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const target = pickRandom(gp.owned);
  const oldVal = target.currentValue || target.buyPrice;
  const newVal = Math.max(1, Math.round(oldVal * 0.35)); // ينهار 65%

  const updatedPlayers = gamePlayers.map((p, i) => {
    if (i !== ownerIndex) return p;
    return {
      ...p,
      owned: p.owned.map(item => {
        if (item.player.name !== target.player.name) return item;
        return {
          ...item,
          currentValue: newVal,
          activeEffects: [
            ...(item.activeEffects || []).filter(e => e.id !== "eriksenHeartAttack"),
            {
              id: "eriksenHeartAttack",
              name: "Heart Attack Recovery",
              emoji: "💔",
              expiresAfterSeason: season + 1,
              ratingChange: -15,
              valueChangePct: -0.65,
            },
          ],
        };
      }),
    };
  });

  return {
    event: null,
    updatedPlayers,
    newsItems: [{
      id: randomId(), season,
      title: `💔 Heart Attack — ${target.player.name}`,
      description: `${target.player.name} collapses on the pitch with a cardiac arrest. Airlifted to hospital. Out for the full season. Value crashes from €${oldVal}M to €${newVal}M.`,
      tone: "bad",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}

// ============================================
// DOPING BAN — 1-5 seasons
// ============================================
export function triggerDopingBan(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const gp = gamePlayers[ownerIndex];
  if (!gp || gp.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const target = pickRandom(gp.owned);
  const banLength = Math.floor(Math.random() * 5) + 1; // 1-5 مواسم
  const bannedUntil = season + banLength;
  const oldVal = target.currentValue || target.buyPrice;
  const newVal = Math.max(1, Math.round(oldVal * 0.45));

  const updatedPlayers = gamePlayers.map((p, i) => {
    if (i !== ownerIndex) return p;
    return {
      ...p,
      owned: p.owned.map(item => {
        if (item.player.name !== target.player.name) return item;
        return {
          ...item,
          currentValue: newVal,
          activeEffects: [
            ...(item.activeEffects || []).filter(e => e.id !== "dopingBan"),
            {
              id: "dopingBan",
              name: `Doping Ban (${banLength} seasons)`,
              emoji: "🚫",
              expiresAfterSeason: bannedUntil,
              bannedUntilSeason: bannedUntil,
              ratingChange: -20,
              valueChangePct: -0.55,
            },
          ],
        };
      }),
    };
  });

  return {
    event: null,
    updatedPlayers,
    newsItems: [{
      id: randomId(), season,
      title: `🚫 Doping Ban — ${target.player.name}`,
      description: `${target.player.name} tests positive for banned substances. Suspended for ${banLength} season${banLength > 1 ? "s" : ""}. Value drops from €${oldVal}M to €${newVal}M. Cannot be sold or renewed during ban.`,
      tone: "bad",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}

// ============================================
// GIRLS MAGNET — 2 seasons boost
// ============================================
export function triggerGirlsMagnet(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const gp = gamePlayers[ownerIndex];
  if (!gp || gp.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const target = pickRandom(gp.owned);
  const oldVal = target.currentValue || target.buyPrice;
  const newVal = Math.round(oldVal * 1.25); // +25% قيمة تسويقية

  const updatedPlayers = gamePlayers.map((p, i) => {
    if (i !== ownerIndex) return p;
    return {
      ...p,
      owned: p.owned.map(item => {
        if (item.player.name !== target.player.name) return item;
        return {
          ...item,
          currentValue: newVal,
          activeEffects: [
            ...(item.activeEffects || []).filter(e => e.id !== "girlsMagnet"),
            {
              id: "girlsMagnet",
              name: "Girls Magnet",
              emoji: "💋",
              expiresAfterSeason: season + 2,
              girlsMagnet: true,
              valueChangePct: 0.25,
              salaryDemandMultiplier: 1.3,
            },
          ],
        };
      }),
    };
  });

  return {
    event: null,
    updatedPlayers,
    newsItems: [{
      id: randomId(), season,
      title: `💋 Girls Magnet — ${target.player.name}`,
      description: `${target.player.name} becomes a social media sensation. Marketing value soars. Value up from €${oldVal}M to €${newVal}M — but salary demands rise 30%.`,
      tone: "good",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}

// ============================================
// RACIST ATTACK — 2 seasons debuff, bounce back 3rd
// ============================================
export function triggerRacistAttack(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const gp = gamePlayers[ownerIndex];
  if (!gp || gp.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const target = pickRandom(gp.owned);
  const oldVal = target.currentValue || target.buyPrice;
  const newVal = Math.max(1, Math.round(oldVal * 0.80));

  const updatedPlayers = gamePlayers.map((p, i) => {
    if (i !== ownerIndex) return p;
    return {
      ...p,
      owned: p.owned.map(item => {
        if (item.player.name !== target.player.name) return item;
        return {
          ...item,
          currentValue: newVal,
          activeEffects: [
            ...(item.activeEffects || []).filter(e => e.id !== "racistAttack"),
            {
              id: "racistAttack",
              name: "Racist Attack Trauma",
              emoji: "✊",
              expiresAfterSeason: season + 2,
              racismDebuff: true,
              ratingChange: -8,
              valueChangePct: -0.20,
            },
          ],
        };
      }),
    };
  });

  return {
    event: null,
    updatedPlayers,
    newsItems: [{
      id: randomId(), season,
      title: `✊ Racist Attack — ${target.player.name}`,
      description: `${target.player.name} faces racial abuse from the stands. Mentally affected for 2 seasons. Value drops from €${oldVal}M to €${newVal}M. After 2 seasons, expect a powerful bounce back.`,
      tone: "bad",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}

// ============================================
// CLUB LEGEND — accepts any renewal offer
// ============================================
export function triggerClubLegend(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const gp = gamePlayers[ownerIndex];
  if (!gp || gp.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  // يختار اللاعب الأطول وقتاً في الفريق
  const longestOwned = [...gp.owned].sort(
    (a, b) => a.buySeason - b.buySeason
  )[0];

  const updatedPlayers = gamePlayers.map((p, i) => {
    if (i !== ownerIndex) return p;
    return {
      ...p,
      owned: p.owned.map(item => {
        if (item.player.name !== longestOwned.player.name) return item;
        return {
          ...item,
          isClubLegend: true,
          currentValue: Math.round((item.currentValue || item.buyPrice) * 1.15),
        };
      }),
    };
  });

  return {
    event: null,
    updatedPlayers,
    newsItems: [{
      id: randomId(), season,
      title: `👑 Club Legend — ${longestOwned.player.name}`,
      description: `${longestOwned.player.name} is declared a club legend after years of service. He will accept ANY contract renewal offer — no matter how low the salary. Value up +15%.`,
      tone: "special",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}
// ============================================
// TOURNAMENT CONSTANTS
// ============================================

const WORLD_CUP_SEASONS = [2010, 2014, 2018, 2022, 2026];
const EURO_SEASONS      = [2008, 2012, 2016, 2020, 2024];

const EUROPEAN_NATIONALITIES = new Set([
  "France", "Spain", "Germany", "Italy", "Portugal", "Netherlands",
  "Belgium", "England", "Croatia", "Denmark", "Sweden", "Norway",
  "Switzerland", "Austria", "Poland", "Czech Republic", "Slovakia",
  "Serbia", "Scotland", "Wales", "Ireland", "Russia", "Turkey",
  "Greece", "Hungary", "Romania", "Ukraine", "Finland", "Slovenia", "Albania",
]);

function isEuropean(nationality: string): boolean {
  return EUROPEAN_NATIONALITIES.has(nationality);
}

// ============================================
// WORLD CUP EVENT
// ============================================

export function triggerWorldCup(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const gp = gamePlayers[ownerIndex];
  if (!gp || gp.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  // فقط اللاعبين اللي بلدانهم فازت (نطلب كل اللاعبين عشان الإيفنت ما يطلع الا لو الشرط تحقق)
  const candidates = gp.owned.filter(item => !item.player.secret);
  if (candidates.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const target = pickRandom(candidates);
  const oldVal = target.currentValue || target.buyPrice;
  const bonus = Math.round(oldVal * 0.30);
  const newVal = oldVal + bonus;

  const updatedPlayers = gamePlayers.map((p, i) => {
    if (i !== ownerIndex) return p;
    return {
      ...p,
      owned: p.owned.map(item =>
        item.player.name !== target.player.name ? item : {
          ...item,
          currentValue: newVal,
          activeEffects: [
            ...(item.activeEffects || []),
            {
              id: "worldCup",
              name: "World Cup Winner",
              emoji: "🏆",
              expiresAfterSeason: season + 1,
              valueChangePct: 0.30,
            },
          ],
        }
      ),
    };
  });

  return {
    event: null,
    updatedPlayers,
    newsItems: [{
      id: randomId(), season,
      title: `🏆 World Cup Winner — ${target.player.name}`,
      description: `${target.player.name} wins the FIFA World Cup with ${target.player.nationality}! Value rockets from €${oldVal}M to €${newVal}M (+30%).`,
      tone: "good",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}

// ============================================
// EURO EVENT — أوروبيين فقط
// ============================================

export function triggerEuro(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const gp = gamePlayers[ownerIndex];
  if (!gp || gp.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  // فقط اللاعبين الأوروبيين
  const candidates = gp.owned.filter(item =>
    !item.player.secret && isEuropean(item.player.nationality)
  );
  if (candidates.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const target = pickRandom(candidates);
  const oldVal = target.currentValue || target.buyPrice;
  const bonus = Math.round(oldVal * 0.20);
  const newVal = oldVal + bonus;

  const updatedPlayers = gamePlayers.map((p, i) => {
    if (i !== ownerIndex) return p;
    return {
      ...p,
      owned: p.owned.map(item =>
        item.player.name !== target.player.name ? item : {
          ...item,
          currentValue: newVal,
          activeEffects: [
            ...(item.activeEffects || []),
            {
              id: "euro",
              name: "Euro Champion",
              emoji: "⭐",
              expiresAfterSeason: season + 1,
              valueChangePct: 0.20,
            },
          ],
        }
      ),
    };
  });

  return {
    event: null,
    updatedPlayers,
    newsItems: [{
      id: randomId(), season,
      title: `⭐ Euro Champion — ${target.player.name}`,
      description: `${target.player.name} lifts the UEFA European Championship with ${target.player.nationality}! Value rises from €${oldVal}M to €${newVal}M (+20%).`,
      tone: "good",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}

// ============================================
// CHAMPIONS LEAGUE EVENT — كل موسم
// ============================================

export function triggerChampionsLeague(
  gamePlayers: GamePlayer[],
  ownerIndex: number,
  season: number
): SeasonEventResult {
  const gp = gamePlayers[ownerIndex];
  if (!gp || gp.owned.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const candidates = gp.owned.filter(item => !item.player.secret);
  if (candidates.length === 0) return { event: null, updatedPlayers: gamePlayers, newsItems: [] };

  const target = pickRandom(candidates);
  const oldVal = target.currentValue || target.buyPrice;
  const bonus = Math.round(oldVal * 0.25);
  const newVal = oldVal + bonus;

  const updatedPlayers = gamePlayers.map((p, i) => {
    if (i !== ownerIndex) return p;
    return {
      ...p,
      owned: p.owned.map(item =>
        item.player.name !== target.player.name ? item : {
          ...item,
          currentValue: newVal,
          activeEffects: [
            ...(item.activeEffects || []),
            {
              id: "championsLeague",
              name: "Champions League Winner",
              emoji: "🏆",
              expiresAfterSeason: season + 1,
              valueChangePct: 0.25,
            },
          ],
        }
      ),
    };
  });

  return {
    event: null,
    updatedPlayers,
    newsItems: [{
      id: randomId(), season,
      title: `🏆 Champions League Winner — ${target.player.name}`,
      description: `${target.player.name} wins the UEFA Champions League! Crowned King of Europe. Value soars from €${oldVal}M to €${newVal}M (+25%).`,
      tone: "good",
      journalist: pickRandom(JOURNALISTS),
      source: pickRandom(NEWS_SOURCES),
    }],
  };
}

// ============================================
// TOURNAMENT CHECKER — يستدعى من setupNewSeason
// يتحقق من المواسم ويطلق الإيفنت المناسب
// ============================================

export function checkTournamentEvents(
  gamePlayers: GamePlayer[],
  season: number
): { updatedPlayers: GamePlayer[]; newsItems: NewsItem[] } {
  let players = [...gamePlayers];
  const allNews: NewsItem[] = [];

  // Champions League — كل موسم، فرصة 30%
  if (Math.random() < 0.30) {
    for (let i = 0; i < players.length; i++) {
      const result = triggerChampionsLeague(players, i, season);
      if (result.newsItems.length > 0) {
        players = result.updatedPlayers;
        allNews.push(...result.newsItems);
        break; // لاعب واحد فقط يفوز
      }
    }
  }

  // World Cup — فقط في مواسم البطولة
  if (WORLD_CUP_SEASONS.includes(season) && Math.random() < 0.70) {
    for (let i = 0; i < players.length; i++) {
      const result = triggerWorldCup(players, i, season);
      if (result.newsItems.length > 0) {
        players = result.updatedPlayers;
        allNews.push(...result.newsItems);
        break;
      }
    }
  }

  // Euro — فقط في مواسم البطولة + لاعب أوروبي
  if (EURO_SEASONS.includes(season) && Math.random() < 0.70) {
    for (let i = 0; i < players.length; i++) {
      const result = triggerEuro(players, i, season);
      if (result.newsItems.length > 0) {
        players = result.updatedPlayers;
        allNews.push(...result.newsItems);
        break;
      }
    }
  }

  return { updatedPlayers: players, newsItems: allNews };
}