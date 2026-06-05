import type {
  GamePlayer,
  PlayerCards,
  RewardCardType,
} from "./types";

import {
  CARD_COOLDOWN_SEASONS,
} from "./constants";

import {
  applyExtraBuyCard,
  applyExtraSellCard,
} from "./economyEngine";

export function createEmptyCardState() {
  return {
    unlocked: false,
    cooldown: 0,
  };
}

export function createEmptyCards(): PlayerCards {
  return {
    tripleBuy: createEmptyCardState(),
    extraSell: createEmptyCardState(),
    steal: createEmptyCardState(),
    eventChoice: createEmptyCardState(),
  };
}

export function getCardName(
  card: RewardCardType
) {
  if (card === "tripleBuy") {
    return "⚡ Extra Buy Card";
  }

  if (card === "extraSell") {
    return "💸 Extra Sell Card";
  }

  if (card === "steal") {
    return "🕵️ Steal Card";
  }

  return "🎲 Event Choice Card";
}

export function getEligibleRewardCards(
  sellPrice: number,
  player: GamePlayer
): RewardCardType[] {
  const cards: RewardCardType[] = [];

  if (
    sellPrice >= 40 &&
    player.cards.tripleBuy.cooldown <= 0
  ) {
    cards.push("tripleBuy");
  }

  if (
    sellPrice >= 70 &&
    player.cards.extraSell.cooldown <= 0
  ) {
    cards.push("extraSell");
  }

  if (
    sellPrice >= 50 &&
    player.cards.steal.cooldown <= 0
  ) {
    cards.push("steal");
  }

  if (
    sellPrice >= 100 &&
    player.cards.eventChoice.cooldown <= 0
  ) {
    cards.push("eventChoice");
  }

  return cards;
}

export function unlockRewardCard(
  player: GamePlayer,
  card: RewardCardType
): GamePlayer {
  return {
    ...player,
    cards: {
      ...player.cards,
      [card]: {
        unlocked: true,
        cooldown: 0,
      },
    },
  };
}

export function putCardOnCooldown(
  player: GamePlayer,
  card: RewardCardType
): GamePlayer {
  return {
    ...player,
    cards: {
      ...player.cards,
      [card]: {
        unlocked: true,
        cooldown:
          CARD_COOLDOWN_SEASONS,
      },
    },
  };
}

export function reduceCardCooldowns(
  cards: PlayerCards
): PlayerCards {
  return {
    tripleBuy: {
      ...cards.tripleBuy,
      cooldown:
        Math.max(
          0,
          cards.tripleBuy.cooldown - 1
        ),
    },
    extraSell: {
      ...cards.extraSell,
      cooldown:
        Math.max(
          0,
          cards.extraSell.cooldown - 1
        ),
    },
    steal: {
      ...cards.steal,
      cooldown:
        Math.max(
          0,
          cards.steal.cooldown - 1
        ),
    },
    eventChoice: {
      ...cards.eventChoice,
      cooldown:
        Math.max(
          0,
          cards.eventChoice.cooldown - 1
        ),
    },
  };
}

export function canUseCard(
  player: GamePlayer,
  card: RewardCardType
) {
  const cardState =
    player.cards[card];

  return (
    cardState.unlocked &&
    cardState.cooldown <= 0
  );
}

export function useRewardCard(
  player: GamePlayer,
  card: RewardCardType
): GamePlayer {
  if (!canUseCard(player, card)) {
    return player;
  }

  let updatedPlayer =
    putCardOnCooldown(
      player,
      card
    );

  if (card === "tripleBuy") {
    updatedPlayer =
      applyExtraBuyCard(
        updatedPlayer
      );
  }

  if (card === "extraSell") {
    updatedPlayer =
      applyExtraSellCard(
        updatedPlayer
      );
  }

  return updatedPlayer;
}

export function getCardStatusText(
  player: GamePlayer,
  card: RewardCardType
) {
  const cardState =
    player.cards[card];

  if (!cardState.unlocked) {
    return "Locked";
  }

  if (cardState.cooldown > 0) {
    return `${cardState.cooldown} seasons left`;
  }

  return "Ready";
}