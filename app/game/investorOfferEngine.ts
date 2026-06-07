// ============================================
// FOOTBALL INVESTOR 1.8 - INVESTOR OFFER ENGINE
// ============================================

import type {
  InvestorOfferState,
  GamePlayer,
  Player,
  NewsItem,
  OwnedPlayer,
  Contract,
} from "./types";
import { pickRandom, randomId, shuffle } from "./helpers";
import { createInvestorOfferValue, getOfferTone, getOfferDifferenceText } from "./valueEngine";
import { getCurrentValue } from "./valueEngine";
import { createInvestorOfferNews } from "./newsEngine";
import { generateRequiredSalary, finalizeContract } from "./contractEngine";

// ============================================
// GET CANDIDATES FOR INVESTOR OFFER
// ============================================

export function getInvestorOfferCandidates(
  playerPool: Player[],
  currentSeason: number,
  gamePlayers: GamePlayer[]
): Player[] {
  const ownedNames = new Set(
    gamePlayers.flatMap((gp) => gp.owned.map((item) => item.player.name))
  );

  const available = playerPool.filter(
    (p) =>
      p.availableSeason === currentSeason &&
      !ownedNames.has(p.name)
  );

  return shuffle(available).slice(0, 3);
}

// ============================================
// CREATE INVESTOR OFFER STATE
// ============================================

export function createInvestorOffer(
  playerPool: Player[],
  currentSeason: number,
  gamePlayers: GamePlayer[]
): InvestorOfferState | null {
  const candidates = getInvestorOfferCandidates(
    playerPool,
    currentSeason,
    gamePlayers
  );

  if (candidates.length === 0) return null;

  const selectedPlayer = pickRandom(candidates);
  const marketValue = getCurrentValue(selectedPlayer, currentSeason);
  const offerValue = createInvestorOfferValue(marketValue);
  const offerTone = getOfferTone(offerValue, marketValue);

  return {
    candidates,
    selectedPlayer,
    marketValue,
    offerValue,
    offerTone,
  };
}

// ============================================
// ACCEPT INVESTOR OFFER
// ============================================

export function acceptInvestorOffer(
  offer: InvestorOfferState,
  gamePlayers: GamePlayer[],
  activeIndex: number,
  currentSeason: number
): { updatedPlayers: GamePlayer[]; newsItem: NewsItem } {
  const player = offer.selectedPlayer;
  const price = offer.offerValue;
  const slot = player.position;

  // Auto-generate contract for investor offer
  const requiredSalary = generateRequiredSalary(offer.marketValue);
  const contract: Contract = finalizeContract(
    {
      player,
      slot,
      offeredSalary: requiredSalary,
      offeredDuration: 2,
      satisfaction: 75,
      requiredSalary,
      marketValue: offer.marketValue,
      timer: 60,
      attempts: 0,
    },
    currentSeason
  );

  const newOwned: OwnedPlayer = {
    player,
    slot,
    buySeason: currentSeason,
    buyPrice: price,
    currentValue: price,
    budgetAtBuy: gamePlayers[activeIndex]?.budget ?? price,
    contract,
    sponsorships: [],
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== activeIndex) return gp;

    // Remove any existing player in the same position
    const filteredOwned = gp.owned.filter(
      (item) => item.slot !== slot
    );

    return {
      ...gp,
      budget: gp.budget - price,
      owned: [...filteredOwned, newOwned],
    };
  });

  const newsItem = createInvestorOfferNews(
    currentSeason,
    player.name,
    offer.offerValue,
    offer.marketValue,
    true
  );

  return { updatedPlayers, newsItem };
}

// ============================================
// REJECT INVESTOR OFFER
// ============================================

export function rejectInvestorOffer(
  offer: InvestorOfferState,
  currentSeason: number
): NewsItem {
  return createInvestorOfferNews(
    currentSeason,
    offer.selectedPlayer.name,
    offer.offerValue,
    offer.marketValue,
    false
  );
}

// ============================================
// CAN AFFORD OFFER
// ============================================

export function canAffordOffer(
  offer: InvestorOfferState,
  gp: GamePlayer
): boolean {
  return gp.budget >= offer.offerValue;
}

// ============================================
// OFFER UI HELPERS
// ============================================

export function getOfferMessage(offer: InvestorOfferState): string {
  const tone = getOfferTone(offer.offerValue, offer.marketValue);
  if (tone === "good") return "🟢 This looks like a bargain! Don't miss it.";
  if (tone === "bad") return "🔴 This offer is above market value. Be careful.";
  return "🟡 This is a fair deal at market price.";
}

export function getOfferDiffDisplay(offer: InvestorOfferState): {
  text: string;
  color: string;
} {
  const diff = offer.offerValue - offer.marketValue;
  if (diff < 0) {
    return {
      text: `€${Math.abs(diff)}M below market ✅`,
      color: "text-emerald-400",
    };
  }
  if (diff > 0) {
    return {
      text: `€${diff}M above market ⚠️`,
      color: "text-red-400",
    };
  }
  return {
    text: "Exactly at market value",
    color: "text-yellow-400",
  };
}

export function getOfferBorderColor(offer: InvestorOfferState): string {
  const tone = getOfferTone(offer.offerValue, offer.marketValue);
  if (tone === "good") return "border-emerald-500";
  if (tone === "bad") return "border-red-500";
  return "border-yellow-500";
}