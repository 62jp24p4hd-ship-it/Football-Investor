// ============================================
// FOOTBALL INVESTOR 1.8 - AUCTION ENGINE
// ============================================

import type {
  AuctionState,
  AuctionPhase,
  GamePlayer,
  Player,
  NewsItem,
  OwnedPlayer,
  Contract,
} from "./types";
import { pickRandom, randomId, shuffle } from "./helpers";
import { getCurrentValue } from "./valueEngine";
import { createAuctionStartNews, createAuctionWinNews } from "./newsEngine";
import { generateRequiredSalary, finalizeContract } from "./contractEngine";
import {
  AUCTION_PREVIEW_SECONDS,
  AUCTION_BID_INCREMENT,
  getAuctionTimerByBid,
} from "./constants";

// ============================================
// CREATE AUCTION STATE
// ============================================

export function createAuctionState(
  playerPool: Player[],
  currentSeason: number,
  gamePlayers: GamePlayer[]
): AuctionState | null {
  const ownedNames = new Set(
    gamePlayers.flatMap((gp) => gp.owned.map((item) => item.player.name))
  );

  const available = shuffle(
    playerPool.filter(
      (p) =>
        p.availableSeason === currentSeason &&
        !ownedNames.has(p.name)
    )
  ).slice(0, 3);

  if (available.length === 0) return null;

  return {
    candidates: available,
    selectedPlayer: null,
    phase: "preview",
    timer: AUCTION_PREVIEW_SECONDS,
    currentBid: 0,
    highestBidder: null,
    replacementSlot: null,
    surrendered: {},
  };
}

// ============================================
// TRANSITION TO BIDDING PHASE
// ============================================

export function startBiddingPhase(
  state: AuctionState,
  currentSeason: number,
  gamePlayers: GamePlayer[]
): AuctionState {
  const selected = pickRandom(state.candidates);
  const startingBid = getCurrentValue(selected, currentSeason);

  return {
    ...state,
    selectedPlayer: selected,
    phase: "bidding",
    currentBid: startingBid,
    timer: getAuctionTimerByBid(startingBid),
    highestBidder: null,
    surrendered: {},
  };
}

// ============================================
// PLACE BID
// ============================================

export function placeBid(
  state: AuctionState,
  bidderIndex: number
): AuctionState {
  const nextBid = state.currentBid + AUCTION_BID_INCREMENT;

  return {
    ...state,
    currentBid: nextBid,
    highestBidder: bidderIndex,
    timer: getAuctionTimerByBid(nextBid),
    surrendered: {
      ...state.surrendered,
      // Reset surrender for non-bidder
      [bidderIndex === 0 ? 1 : 0]: false,
    },
  };
}

// ============================================
// SURRENDER
// ============================================

export function surrenderAuction(
  state: AuctionState,
  playerIndex: number
): AuctionState {
  const newSurrendered = {
    ...state.surrendered,
    [playerIndex]: true,
  };

  return {
    ...state,
    surrendered: newSurrendered,
  };
}

// ============================================
// CHECK IF AUCTION SHOULD END
// ============================================

export function shouldAuctionEnd(state: AuctionState, totalPlayers: number): boolean {
  if (state.phase !== "bidding") return false;

  // All players surrendered
  const surrenderedCount = Object.values(state.surrendered).filter(Boolean).length;
  if (surrenderedCount >= totalPlayers) return true;

  // Timer ran out
  if (state.timer <= 0) return true;

  return false;
}

// ============================================
// FINISH AUCTION
// ============================================

export function finishAuction(
  state: AuctionState,
  gamePlayers: GamePlayer[],
  currentSeason: number
): {
  updatedPlayers: GamePlayer[];
  newsItem: NewsItem;
  winner: string | null;
} {
  if (!state.selectedPlayer || state.highestBidder === null) {
    return {
      updatedPlayers: gamePlayers,
      newsItem: {
        id: randomId(),
        season: currentSeason,
        title: "🏆 Auction Ended — No Winner",
        description: "The auction ended with no bids placed.",
        tone: "neutral",
      },
      winner: null,
    };
  }

  const winnerIndex = state.highestBidder;
  const player = state.selectedPlayer;
  const price = state.currentBid;
  const slot = state.replacementSlot ?? player.position;

  const requiredSalary = generateRequiredSalary(getCurrentValue(player, currentSeason));
  const contract: Contract = finalizeContract(
    {
      player,
      slot,
      offeredSalary: requiredSalary,
      offeredDuration: 2,
      satisfaction: 80,
      requiredSalary,
      marketValue: getCurrentValue(player, currentSeason),
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
    budgetAtBuy: gamePlayers[winnerIndex]?.budget ?? price,
    contract,
    sponsorships: [],
  };

  const updatedPlayers = gamePlayers.map((gp, i) => {
    if (i !== winnerIndex) return gp;

    const filteredOwned = gp.owned.filter(
      (item) => item.slot !== slot
    );

    return {
      ...gp,
      budget: gp.budget - price,
      owned: [...filteredOwned, newOwned],
    };
  });

  const newsItem = createAuctionWinNews(
    currentSeason,
    player.name,
    gamePlayers[winnerIndex].name,
    price
  );

  return {
    updatedPlayers,
    newsItem,
    winner: gamePlayers[winnerIndex].name,
  };
}

// ============================================
// CAN AFFORD BID
// ============================================

export function canAffordNextBid(
  state: AuctionState,
  gp: GamePlayer
): boolean {
  const nextBid = state.currentBid + AUCTION_BID_INCREMENT;
  return gp.budget >= nextBid;
}

// ============================================
// TICK AUCTION TIMER
// ============================================

export function tickAuctionTimer(state: AuctionState): AuctionState {
  return {
    ...state,
    timer: Math.max(0, state.timer - 1),
  };
}

// ============================================
// AUCTION UI HELPERS
// ============================================

export function getAuctionPhaseLabel(phase: AuctionPhase): string {
  switch (phase) {
    case "preview": return "👁️ Preview Phase";
    case "bidding": return "🔨 Bidding Phase";
    case "finished": return "🏆 Auction Complete";
  }
}

export function getAuctionTimerColor(timer: number): string {
  if (timer <= 3) return "text-red-400 animate-pulse";
  if (timer <= 7) return "text-orange-400";
  return "text-yellow-300";
}

export function getBidButtonLabel(
  state: AuctionState,
  playerIndex: number,
  gp: GamePlayer
): string {
  if (!canAffordNextBid(state, gp)) return "💸 Can't Afford";
  if (state.highestBidder === playerIndex) return "✅ Highest Bidder";
  return `🔨 Bid €${state.currentBid + AUCTION_BID_INCREMENT}M`;
}

export function getHighestBidderName(
  state: AuctionState,
  gamePlayers: GamePlayer[]
): string {
  if (state.highestBidder === null) return "No bids yet";
  return gamePlayers[state.highestBidder]?.name ?? "Unknown";
}

export function getNextBidAmount(state: AuctionState): number {
  return state.currentBid + AUCTION_BID_INCREMENT;
}

// ============================================
// AUCTION START NEWS
// ============================================

export function getAuctionStartNews(season: number): NewsItem {
  return createAuctionStartNews(season);
}