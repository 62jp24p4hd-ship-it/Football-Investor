// ============================================
// FOOTBALL INVESTOR 1.8 - SPONSORSHIP ENGINE
// ============================================

import type { Sponsorship, SponsorBrand, GamePlayer, NewsItem } from "./types";
import { pickRandom, randomBetween, randomId, shuffle } from "./helpers";
import { SPONSOR_BRANDS, SPONSOR_ANNUAL_INCOME, JOURNALISTS, NEWS_SOURCES } from "./constants";

// ============================================
// GENERATE SPONSORSHIP OFFER
// ============================================

export function generateSponsorshipOffer(
  playerValue: number,
  currentSeason: number
): Sponsorship {
  // Tier حسب القيمة → نوع الراعي
  let tier: "local" | "national" | "global" | "mega" | "legendary";

  if      (playerValue >= 150) tier = "legendary";
  else if (playerValue >= 70)  tier = "mega";
  else if (playerValue >= 30)  tier = "global";
  else if (playerValue >= 10)  tier = "national";
  else                         tier = "local";

  const incomeRanges = {
    local:     { min: 3,   max: 5   },
    national:  { min: 8,   max: 15  },
    global:    { min: 20,  max: 40  },
    mega:      { min: 50,  max: 100 },
    legendary: { min: 150, max: 300 },
  };

  const tierLabels = {
    local:     ["Local Brand", "Regional Club", "City Sponsor"],
    national:  ["National Bank", "Telecom Co.", "Sports Brand"],
    global:    ["Nike", "Adidas", "Pepsi", "Puma", "Red Bull"],
    mega:      ["Adidas", "Nike", "EA Sports", "Hublot", "Beats"],
    legendary: ["Nike", "Adidas", "EA Sports", "Hublot", "Crypto.com"],
  };

  const brand = pickRandom(tierLabels[tier]) as SponsorBrand;
  const range = incomeRanges[tier];
  const annualIncome = randomBetween(range.min, range.max);
  const duration = randomBetween(1, 3);

  return {
    brand,
    annualIncome,
    duration,
    startSeason: currentSeason,
    endSeason: currentSeason + duration - 1,
  };
}

// ============================================
// APPLY SPONSORSHIP INCOME
// ============================================

export function calculateAnnualSponsorshipIncome(
  sponsorships: Sponsorship[],
  currentSeason: number
): number {
  return sponsorships
    .filter((s) => currentSeason >= s.startSeason && currentSeason <= s.endSeason)
    .reduce((sum, s) => sum + s.annualIncome, 0);
}

// ============================================
// REMOVE EXPIRED SPONSORSHIPS
// ============================================

export function filterActiveSponsorships(
  sponsorships: Sponsorship[],
  currentSeason: number
): Sponsorship[] {
  return sponsorships.filter((s) => currentSeason <= s.endSeason);
}

// ============================================
// TEAM-LEVEL SPONSORSHIP INCOME
// ============================================

export function calculateTeamSponsorshipIncome(
  gp: GamePlayer,
  currentSeason: number
): number {
  // From team-level sponsorships
  const teamIncome = calculateAnnualSponsorshipIncome(gp.sponsorships, currentSeason);

  // From player-level sponsorships
  const playerIncome = gp.owned.reduce((sum, item) => {
    return sum + calculateAnnualSponsorshipIncome(item.sponsorships, currentSeason);
  }, 0);

  return teamIncome + playerIncome;
}

// ============================================
// APPLY SEASON SPONSORSHIP TO BUDGET
// ============================================

export function applySeasonSponsorships(
  gp: GamePlayer,
  currentSeason: number
): { updatedGP: GamePlayer; income: number } {
  const income = calculateTeamSponsorshipIncome(gp, currentSeason);

  // Clean expired sponsorships
  const cleanedTeamSponsors = filterActiveSponsorships(gp.sponsorships, currentSeason);
  const cleanedOwned = gp.owned.map((item) => ({
    ...item,
    sponsorships: filterActiveSponsorships(item.sponsorships, currentSeason),
  }));

  return {
    updatedGP: {
      ...gp,
      budget: gp.budget + income,
      sponsorships: cleanedTeamSponsors,
      owned: cleanedOwned,
    },
    income,
  };
}

// ============================================
// ADD SPONSORSHIP TO PLAYER
// ============================================

export function addSponsorshipToPlayer(
  gp: GamePlayer,
  playerName: string,
  sponsorship: Sponsorship
): GamePlayer {
  return {
    ...gp,
    owned: gp.owned.map((item) => {
      if (item.player.name !== playerName) return item;
      return {
        ...item,
        sponsorships: [...item.sponsorships, sponsorship],
      };
    }),
  };
}

// ============================================
// SPONSORSHIP NEWS
// ============================================

export function createSponsorshipNews(
  season: number,
  playerName: string,
  ownerName: string,
  sponsorship: Sponsorship
): NewsItem {
  const journalist = pickRandom(JOURNALISTS);
  const source = pickRandom(NEWS_SOURCES);

  return {
    id: randomId(),
    season,
    title: `🤝 Sponsorship Deal — ${sponsorship.brand}`,
    description: `${playerName} (${ownerName}) signed a ${sponsorship.duration}-year deal with ${sponsorship.brand}. Annual income: €${sponsorship.annualIncome}M.`,
    tone: "special",
    journalist,
    source,
  };
}

// ============================================
// SPONSORSHIP DISPLAY
// ============================================

export function sponsorBrandIcon(brand: SponsorBrand): string {
  const icons: Record<SponsorBrand, string> = {
    Nike: "✔️",
    Adidas: "🌿",
    Puma: "🐆",
    Pepsi: "🥤",
    "EA Sports": "🎮",
    "Red Bull": "🐂",
    Beats: "🎧",
    Hublot: "⌚",
  };
  return icons[brand] ?? "🤝";
}

export function sponsorBrandColor(brand: SponsorBrand): string {
  const colors: Record<SponsorBrand, string> = {
    Nike: "text-white",
    Adidas: "text-blue-300",
    Puma: "text-red-300",
    Pepsi: "text-blue-400",
    "EA Sports": "text-green-300",
    "Red Bull": "text-yellow-400",
    Beats: "text-red-400",
    Hublot: "text-yellow-300",
  };
  return colors[brand] ?? "text-gray-300";
}

// ============================================
// RANDOM SPONSORSHIP EVENT
// ============================================

export function shouldReceiveSponsorshipOffer(
  playerValue: number,
  goals: number = 0,
  assists: number = 0,
  activeEffects: string[] = []
): boolean {
  // احتمال أساسي حسب القيمة
  let chance = 0;
  if      (playerValue >= 150) chance = 0.50;
  else if (playerValue >= 70)  chance = 0.40;
  else if (playerValue >= 30)  chance = 0.30;
  else if (playerValue >= 10)  chance = 0.20;
  else                         chance = 0.10;

  // Performance bonuses
  if (goals >= 20)                           chance += 0.10;
  if (assists >= 15)                         chance += 0.10;
  if (activeEffects.includes("dreamSeason")) chance += 0.15;
  if (activeEffects.includes("youtube"))     chance += 0.20;

  return Math.random() < Math.min(0.85, chance);
}

// فحص كل لاعب في الفريق بشكل مستقل — لا حد للعدد
export type SponsorshipCheckResult = {
  updatedPlayers: GamePlayer[];
  newsItems: NewsItem[];
};

export function checkSeasonSponsorships(
  gamePlayers: GamePlayer[],
  season: number
): SponsorshipCheckResult {
  const newsItems: NewsItem[] = [];
  const updatedPlayers = gamePlayers.map(gp => {
    let updatedOwned = gp.owned.map(item => {
      const value = item.currentValue || item.buyPrice;
      const stats = item.player.statsBySeason?.[season - 1] ?? item.player.statsBySeason?.[season];
      const goals = stats?.goals ?? 0;
      const assists = stats?.assists ?? 0;
      const activeEffectIds = (item.activeEffects ?? []).map(e => e.id);

      // تحقق لو عنده راعي فعّال بالفعل
      const hasActiveSponsor = item.sponsorships.some(
        s => season >= s.startSeason && season <= s.endSeason
      );
      if (hasActiveSponsor) return item;

      if (!shouldReceiveSponsorshipOffer(value, goals, assists, activeEffectIds)) return item;

      const sponsorship = generateSponsorshipOffer(value, season);

      newsItems.push({
        id: randomId(),
        season,
        title: `🤝 Sponsorship Deal — ${item.player.name}`,
        description: `${item.player.name} (${gp.name}) signed a new sponsorship deal: €${sponsorship.annualIncome}M/yr for ${sponsorship.duration} season${sponsorship.duration > 1 ? "s" : ""}.`,
        tone: "good",
        journalist: pickRandom(JOURNALISTS),
        source: pickRandom(NEWS_SOURCES),
      });

      return {
        ...item,
        sponsorships: [...item.sponsorships, sponsorship],
      };
    });

    return { ...gp, owned: updatedOwned };
  });

  return { updatedPlayers, newsItems };
}