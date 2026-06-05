import type {
  GamePlayer,
} from "./types";

import {
  INITIAL_BUY_CHANCES,
  INITIAL_SELL_CHANCES,
  MAX_BUY_CHANCES,
  MAX_SELL_CHANCES,
} from "./constants";

import {
  getPlayerSponsorIncome,
} from "./sponsorshipEngine";

export function getTotalSalaries(
  player: GamePlayer
) {
  return player.owned.reduce(
    (sum, item) =>
      sum + item.contract.salary,
    0
  );
}

export function getTotalSponsorshipIncome(
  player: GamePlayer
) {
  return player.owned.reduce(
    (sum, item) =>
      sum + getPlayerSponsorIncome(item),
    0
  );
}

export function getNetSeasonForecast(
  player: GamePlayer
) {
  return (
    getTotalSponsorshipIncome(player) -
    getTotalSalaries(player)
  );
}

export function applyAnnualEconomy(
  player: GamePlayer
): GamePlayer {
  return {
    ...player,
    budget:
      player.budget +
      getTotalSponsorshipIncome(player) -
      getTotalSalaries(player),
  };
}

export function resetSeasonChances(
  player: GamePlayer
): GamePlayer {
  return {
    ...player,
    purchaseChances:
      INITIAL_BUY_CHANCES,
    sellChances:
      INITIAL_SELL_CHANCES,
    receivedSalePurchaseBonus:
      false,
    skippedTurn:
      false,
  };
}

export function applySalePurchaseBonus(
  player: GamePlayer
): GamePlayer {
  if (
    player.receivedSalePurchaseBonus
  ) {
    return player;
  }

  return {
    ...player,
    purchaseChances:
      Math.min(
        MAX_BUY_CHANCES,
        player.purchaseChances + 1
      ),
    receivedSalePurchaseBonus:
      true,
  };
}

export function applyExtraBuyCard(
  player: GamePlayer
): GamePlayer {
  return {
    ...player,
    purchaseChances:
      MAX_BUY_CHANCES,
  };
}

export function applyExtraSellCard(
  player: GamePlayer
): GamePlayer {
  return {
    ...player,
    sellChances:
      MAX_SELL_CHANCES,
  };
}

export function canAdvanceSeason(
  players: GamePlayer[]
) {
  return players.every(
    (player) =>
      player.purchaseChances <= 0 ||
      player.skippedTurn
  );
}

export function getBankruptcyWinnerIndex(
  players: GamePlayer[]
) {
  const positiveIndexes =
    players
      .map((player, index) => ({
        player,
        index,
      }))
      .filter(
        (item) =>
          item.player.budget >= 0
      );

  const negativeIndexes =
    players
      .map((player, index) => ({
        player,
        index,
      }))
      .filter(
        (item) =>
          item.player.budget < 0
      );

  if (
    positiveIndexes.length === 1 &&
    negativeIndexes.length === 1
  ) {
    return positiveIndexes[0].index;
  }

  return null;
}