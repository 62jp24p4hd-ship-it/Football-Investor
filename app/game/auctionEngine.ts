import type {
  AuctionState,
  GamePlayer,
  Player,
} from "./types";

import {
  AUCTION_BID_INCREMENT,
  AUCTION_PREVIEW_SECONDS,
} from "./constants";

import {
  pickRandom,
} from "./helpers";

export function createAuctionPreviewState(
  candidates: Player[]
): AuctionState {
  return {
    phase: "preview",
    timer: AUCTION_PREVIEW_SECONDS,
    candidates,
    selectedPlayer: null,
    baseValue: 0,
    currentBid: 0,
    currentTurn: 0,
    highestBidder: null,
    winnerIndex: null,
  };
}

export function startAuctionBidding(
  state: AuctionState,
  getValue: (player: Player) => number
): AuctionState {
  const selectedPlayer =
    pickRandom(state.candidates);

  const baseValue =
    getValue(selectedPlayer);

  const starter =
    Math.random() > 0.5 ? 0 : 1;

  return {
    ...state,
    phase: "bidding",
    selectedPlayer,
    baseValue,
    currentBid: baseValue,
    currentTurn: starter,
    highestBidder: null,
    winnerIndex: null,
  };
}

export function canAuctionBid(
  state: AuctionState,
  bidder: GamePlayer,
  bidderIndex: number
) {
  if (
    state.phase !== "bidding" ||
    !state.selectedPlayer
  ) {
    return false;
  }

  if (state.currentTurn !== bidderIndex) {
    return false;
  }

  const nextBid =
    state.currentBid +
    AUCTION_BID_INCREMENT;

  return bidder.budget >= nextBid;
}

export function placeAuctionBid(
  state: AuctionState,
  bidderIndex: number
): AuctionState {
  const nextBid =
    state.currentBid +
    AUCTION_BID_INCREMENT;

  return {
    ...state,
    currentBid: nextBid,
    highestBidder: bidderIndex,
    currentTurn:
      bidderIndex === 0 ? 1 : 0,
  };
}

export function surrenderAuction(
  state: AuctionState,
  surrenderPlayerIndex: number
): AuctionState {
  const winnerIndex =
    surrenderPlayerIndex === 0 ? 1 : 0;

  return {
    ...state,
    phase: "finished",
    winnerIndex,
  };
}

export function finishAuctionByTimer(
  state: AuctionState
): AuctionState {
  const winnerIndex =
    state.highestBidder ??
    state.currentTurn;

  return {
    ...state,
    phase: "finished",
    winnerIndex,
  };
}

export function getAuctionExtraValue(
  state: AuctionState
) {
  return Math.max(
    0,
    state.currentBid - state.baseValue
  );
}

export function getAuctionTurnText(
  state: AuctionState,
  players: GamePlayer[]
) {
  return `${players[state.currentTurn].teamName} turn`;
}