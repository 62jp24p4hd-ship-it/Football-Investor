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
  // Higher value = better sponsors
  let availableBrands: SponsorBrand[];

  if (playerValue >= 60) {
    availableBrands = ["Nike", "Adidas", "EA Sports", "Hublot"];
  } else if (playerValue >= 30) {
    availableBrands = ["Nike", "Adidas", "Puma", "Pepsi", "Red Bull"];
  } else {
    availableBrands = ["Puma", "Pepsi", "Red Bull", "Beats"];
  }

  const brand = pickRandom(availableBrands);
  const incomeRange = SPONSOR_ANNUAL_INCOME[brand];
  const annualIncome = randomBetween(incomeRange.min, incomeRange.max);
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

export function shouldReceiveSponsorshipOffer(playerValue: number): boolean {
  // Higher value players get offers more often
  const chance = Math.min(0.4, playerValue / 200);
  return Math.random() < chance;
}