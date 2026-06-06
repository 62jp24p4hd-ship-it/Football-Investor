// ============================================
// FOOTBALL INVESTOR 1.8 - NEWS ENGINE
// ============================================

import type { NewsItem, NewsTone, Player, Contract, Sponsorship } from "./types";
import { pickRandom, randomId } from "./helpers";
import { JOURNALISTS, NEWS_SOURCES } from "./constants";

// ============================================
// BASE NEWS FACTORY
// ============================================

function makeNews(
  season: number,
  title: string,
  description: string,
  tone: NewsTone
): NewsItem {
  return {
    id: randomId(),
    season,
    title,
    description,
    tone,
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };
}

// ============================================
// TRANSFER NEWS
// ============================================

export function createTransferNews(
  season: number,
  playerName: string,
  ownerName: string,
  fee: number,
  contract: Contract
): NewsItem {
  const journalist = pickRandom(JOURNALISTS);
  return {
    id: randomId(),
    season,
    title: `🚨 HERE WE GO! — ${playerName}`,
    description:
      `${playerName} joins ${ownerName}! ` +
      `Transfer Fee: €${fee}M | ` +
      `Contract: ${contract.duration} year${contract.duration > 1 ? "s" : ""} | ` +
      `Salary: €${contract.salary}M/yr`,
    tone: "special",
    journalist,
    source: pickRandom(NEWS_SOURCES),
  };
}

// ============================================
// SALE NEWS
// ============================================

export function createSaleNews(
  season: number,
  playerName: string,
  ownerName: string,
  sellPrice: number,
  profit: number
): NewsItem {
  const tone: NewsTone = profit >= 0 ? "good" : "bad";
  const profitText =
    profit >= 0
      ? `Profit: +€${profit}M 📈`
      : `Loss: -€${Math.abs(profit)}M 📉`;

  return makeNews(
    season,
    `💰 Player Sold — ${playerName}`,
    `${ownerName} sold ${playerName} for €${sellPrice}M. ${profitText}`,
    tone
  );
}

// ============================================
// RETIREMENT NEWS
// ============================================

export function createRetirementNews(
  season: number,
  playerName: string,
  ownerName: string,
  age: number
): NewsItem {
  return makeNews(
    season,
    `👋 Retirement — ${playerName}`,
    `${playerName} (${ownerName}) announced retirement at age ${age}. No sell fee received.`,
    "bad"
  );
}

// ============================================
// SPONSORSHIP NEWS
// ============================================

export function createSponsorshipNewsItem(
  season: number,
  playerName: string,
  ownerName: string,
  sponsorship: Sponsorship
): NewsItem {
  return makeNews(
    season,
    `🤝 Sponsorship — ${sponsorship.brand} × ${playerName}`,
    `${playerName} (${ownerName}) signed a ${sponsorship.duration}-year deal with ${sponsorship.brand}. Income: €${sponsorship.annualIncome}M/yr.`,
    "special"
  );
}

// ============================================
// EVENT NEWS
// ============================================

export function createEventNews(
  season: number,
  title: string,
  description: string,
  tone: NewsTone
): NewsItem {
  return makeNews(season, title, description, tone);
}

// ============================================
// AWARD NEWS
// ============================================

export function createAwardNews(
  season: number,
  playerName: string,
  ownerName: string,
  awardName: string
): NewsItem {
  return makeNews(
    season,
    `🏆 Award — ${awardName}`,
    `${playerName} (${ownerName}) won the ${awardName}! Market value skyrockets.`,
    "good"
  );
}

// ============================================
// INJURY NEWS
// ============================================

export function createInjuryNews(
  season: number,
  playerName: string,
  ownerName: string,
  injuryType: string,
  gamesOut: number
): NewsItem {
  return makeNews(
    season,
    `🚑 Injury — ${playerName}`,
    `${playerName} (${ownerName}) suffers ${injuryType}. Expected to miss ${gamesOut}+ games.`,
    "bad"
  );
}

// ============================================
// AUCTION NEWS
// ============================================

export function createAuctionStartNews(season: number): NewsItem {
  return makeNews(
    season,
    "🏆 Legendary Auction Started",
    "A rare auction event has begun! Legendary players are up for grabs.",
    "special"
  );
}

export function createAuctionWinNews(
  season: number,
  playerName: string,
  winnerName: string,
  finalBid: number
): NewsItem {
  return makeNews(
    season,
    `🏆 Auction Won — ${playerName}`,
    `${winnerName} won the auction for ${playerName} with a bid of €${finalBid}M!`,
    "special"
  );
}

// ============================================
// INVESTOR OFFER NEWS
// ============================================

export function createInvestorOfferNews(
  season: number,
  playerName: string,
  offerValue: number,
  marketValue: number,
  accepted: boolean
): NewsItem {
  return makeNews(
    season,
    accepted ? `💼 Offer Accepted — ${playerName}` : `💼 Offer Rejected — ${playerName}`,
    accepted
      ? `Investor offer of €${offerValue}M accepted. Market value was €${marketValue}M.`
      : `Investor offer of €${offerValue}M rejected. Market value was €${marketValue}M.`,
    accepted ? "special" : "neutral"
  );
}

// ============================================
// MARKET NEWS
// ============================================

export function createMarketNews(
  season: number,
  positive: boolean
): NewsItem {
  return makeNews(
    season,
    positive ? "🔥 Transfer Market Heating Up" : "📉 Market Crash",
    positive
      ? "Clubs are spending big. All player values up 20% this season."
      : "Financial crisis hits clubs. Player values drop 20% across the board.",
    positive ? "good" : "bad"
  );
}

// ============================================
// GAME START NEWS
// ============================================

export function createGameStartNews(
  season: number,
  budgetLabel: string,
  teamName1: string,
  teamName2?: string
): NewsItem {
  const teams = teamName2
    ? `${teamName1} vs ${teamName2}`
    : teamName1;

  return {
    id: randomId(),
    season,
    title: "⚽ Football Investor — Season Begins",
    description: `${teams} ready to invest. Budget: ${budgetLabel}. Season ${season} kicks off!`,
    tone: "neutral",
    journalist: "Fabrizio Romano",
    source: "Sky Sports",
  };
}

// ============================================
// FREEZE CARD NEWS
// ============================================

export function createFreezeCardNews(
  season: number,
  senderName: string,
  targetName: string
): NewsItem {
  return makeNews(
    season,
    "🧊 Freeze Card Used",
    `${senderName} froze ${targetName} for next season. They cannot buy players!`,
    "special"
  );
}

// ============================================
// TRIPLE BUY NEWS
// ============================================

export function createTripleBuyNews(
  season: number,
  ownerName: string
): NewsItem {
  return makeNews(
    season,
    "⚡ Triple Buy Activated",
    `${ownerName} will have 3 purchase chances next season!`,
    "special"
  );
}

// ============================================
// STEAL CARD NEWS
// ============================================

export function createStealCardNews(
  season: number,
  senderName: string,
  playerGiven: string,
  playerReceived: string
): NewsItem {
  return makeNews(
    season,
    "🕵️ Player Swap — Steal Card",
    `${senderName} swapped ${playerGiven} for ${playerReceived}!`,
    "special"
  );
}

// ============================================
// SEASON TRANSITION NEWS
// ============================================

export function createNewSeasonNews(season: number): NewsItem {
  return makeNews(
    season,
    `📅 Season ${season} Begins`,
    `A new football season kicks off. New opportunities, new risks, new legends.`,
    "neutral"
  );
}

// ============================================
// GENERATED CLASS NEWS (infinite mode)
// ============================================

export function createGeneratedClassNews(season: number): NewsItem {
  return {
    id: randomId(),
    season,
    title: "🧬 New Player Generation",
    description: `A new class of unknown players has entered the market in ${season}.`,
    tone: "special",
    journalist: pickRandom(JOURNALISTS),
    source: pickRandom(NEWS_SOURCES),
  };
}

// ============================================
// NEWS TONE ICON
// ============================================

export function getNewsToneIcon(tone: NewsTone): string {
  if (tone === "good") return "✅";
  if (tone === "bad") return "❌";
  if (tone === "special") return "⭐";
  return "📰";
}