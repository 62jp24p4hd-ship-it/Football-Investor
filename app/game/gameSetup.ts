import type {
  GamePlayer,
  PlayerCards,
  TeamStarterState,
} from "./types";

import {
  BUDGET_SETTINGS,
  INITIAL_BUY_CHANCES,
  INITIAL_SELL_CHANCES,
  START_SEASON,
} from "./constants";

import {
  createEmptyCards,
} from "./rewardCardEngine";

import {
  getSeasonStarter,
} from "./helpers";

export function createInitialCards(): PlayerCards {
  return createEmptyCards();
}

export function createGamePlayer(
  name: string,
  teamName: string,
  budgetMode: keyof typeof BUDGET_SETTINGS
): GamePlayer {
  return {
    name,
    teamName,

    budget:
      BUDGET_SETTINGS[
        budgetMode
      ].amount,

    owned: [],
    sold: [],

    purchaseChances:
      INITIAL_BUY_CHANCES,

    sellChances:
      INITIAL_SELL_CHANCES,

    receivedSalePurchaseBonus:
      false,

    skippedTurn: false,

    cards:
      createInitialCards(),
  };
}

export function createSinglePlayerSetup(
  budgetMode: keyof typeof BUDGET_SETTINGS
) {
  return [
    createGamePlayer(
      "Player",
      "My Team",
      budgetMode
    ),
  ];
}

export function createVersusSetup(
  teamOneName: string,
  teamTwoName: string,
  budgetMode: keyof typeof BUDGET_SETTINGS
) {
  return [
    createGamePlayer(
      "Player 1",
      teamOneName || "Team 1",
      budgetMode
    ),

    createGamePlayer(
      "Player 2",
      teamTwoName || "Team 2",
      budgetMode
    ),
  ];
}

export function createStarterState(
  firstStarter: number
): TeamStarterState {
  return {
    firstSeasonStarter:
      firstStarter,
    currentSeasonStarter:
      firstStarter,
  };
}

export function updateSeasonStarter(
  starterState: TeamStarterState,
  season: number
): TeamStarterState {
  return {
    ...starterState,
    currentSeasonStarter:
      getSeasonStarter(
        starterState.firstSeasonStarter,
        season,
        START_SEASON
      ),
  };
}