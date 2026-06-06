// ============================================
// FOOTBALL INVESTOR 1.8 - REWARD CARD ENGINE
// ============================================

import type { Cards, CardData, RewardCard, GamePlayer } from "./types";
import {
  SELL_BONUS_THRESHOLD_FREEZE,
  SELL_BONUS_THRESHOLD_TRIPLE,
  SELL_BONUS_THRESHOLD_STEAL,
} from "./constants";

// ============================================
// EMPTY CARDS
// ============================================

export function emptyCards(): Cards {
  return {
    freeze: { unlocked: false, used: false, cooldownUntil: null },
    triple: { unlocked: false, used: false, cooldownUntil: null },
    steal: { unlocked: false, used: false, cooldownUntil: null },
  };
}

// ============================================
// ELIGIBLE CARDS AFTER SELL
// ============================================

export function getEligibleCards(
  gp: GamePlayer,
  sellPrice: number
): RewardCard[] {
  const cards: RewardCard[] = [];

  if (
    sellPrice >= SELL_BONUS_THRESHOLD_FREEZE &&
    !gp.cards.freeze.unlocked &&
    !gp.cards.freeze.used
  ) {
    cards.push("freeze");
  }

  if (
    sellPrice >= SELL_BONUS_THRESHOLD_TRIPLE &&
    !gp.cards.triple.unlocked &&
    !gp.cards.triple.used
  ) {
    cards.push("triple");
  }

  if (
    sellPrice >= SELL_BONUS_THRESHOLD_STEAL &&
    !gp.cards.steal.unlocked &&
    !gp.cards.steal.used
  ) {
    cards.push("steal");
  }

  return cards;
}

// ============================================
// UNLOCK CARD
// ============================================

export function unlockCard(
  gp: GamePlayer,
  card: RewardCard
): GamePlayer {
  return {
    ...gp,
    cards: {
      ...gp.cards,
      [card]: {
        unlocked: true,
        used: false,
        cooldownUntil: null,
      },
    },
  };
}

// ============================================
// USE FREEZE CARD
// ============================================

export function useFreezeCard(
  players: GamePlayer[],
  userIndex: number,
  currentSeason: number
): GamePlayer[] {
  const enemyIndex = userIndex === 0 ? 1 : 0;

  return players.map((gp, i) => {
    if (i === userIndex) {
      return {
        ...gp,
        cards: {
          ...gp.cards,
          freeze: { unlocked: true, used: true, cooldownUntil: null },
        },
      };
    }
    if (i === enemyIndex) {
      return {
        ...gp,
        frozenSeason: currentSeason + 1,
      };
    }
    return gp;
  });
}

// ============================================
// USE TRIPLE BUY CARD
// ============================================

export function useTripleCard(
  players: GamePlayer[],
  userIndex: number
): GamePlayer[] {
  return players.map((gp, i) => {
    if (i !== userIndex) return gp;
    return {
      ...gp,
      tripleNextSeason: true,
      cards: {
        ...gp.cards,
        triple: { unlocked: true, used: true, cooldownUntil: null },
      },
    };
  });
}

// ============================================
// USE STEAL CARD — SWAP PLAYERS
// ============================================

export function executeStealSwap(
  players: GamePlayer[],
  userIndex: number,
  ownOwnedIndex: number,
  enemyOwnedIndex: number
): GamePlayer[] {
  const enemyIndex = userIndex === 0 ? 1 : 0;

  return players.map((gp, i) => {
    if (i === userIndex) {
      const copy = [...gp.owned];
      const enemyItem = players[enemyIndex].owned[enemyOwnedIndex];
      copy[ownOwnedIndex] = {
        ...enemyItem,
        slot: gp.owned[ownOwnedIndex].slot,
      };
      return {
        ...gp,
        owned: copy,
        cards: {
          ...gp.cards,
          steal: { unlocked: true, used: true, cooldownUntil: null },
        },
      };
    }
    if (i === enemyIndex) {
      const copy = [...gp.owned];
      const userItem = players[userIndex].owned[ownOwnedIndex];
      copy[enemyOwnedIndex] = {
        ...userItem,
        slot: gp.owned[enemyOwnedIndex].slot,
      };
      return { ...gp, owned: copy };
    }
    return gp;
  });
}

// ============================================
// CARD STATUS
// ============================================

export function getCardStatus(
  card: CardData,
  currentSeason: number
): "locked" | "ready" | "used" | "cooldown" {
  if (card.used) return "used";
  if (!card.unlocked) return "locked";
  if (card.cooldownUntil !== null && currentSeason < card.cooldownUntil) return "cooldown";
  return "ready";
}

// ============================================
// CARD DISPLAY INFO
// ============================================

export type CardDisplayInfo = {
  name: string;
  icon: string;
  description: string;
  unlockRequirement: string;
  color: string;
};

export function getCardDisplayInfo(card: RewardCard): CardDisplayInfo {
  switch (card) {
    case "freeze":
      return {
        name: "Freeze Card",
        icon: "🧊",
        description: "Freeze your opponent for 1 season — they cannot buy players.",
        unlockRequirement: "Sell a player for €20M+",
        color: "bg-blue-700 border-blue-400",
      };
    case "triple":
      return {
        name: "Triple Buy Card",
        icon: "⚡",
        description: "Get 3 purchase chances next season instead of 1.",
        unlockRequirement: "Sell a player for €40M+",
        color: "bg-yellow-700 border-yellow-400",
      };
    case "steal":
      return {
        name: "Steal Card",
        icon: "🕵️",
        description: "Win a challenge to swap one of your players with your opponent.",
        unlockRequirement: "Sell a player for €50M+",
        color: "bg-purple-700 border-purple-400",
      };
  }
}

// ============================================
// CARD LOCKED TOOLTIP
// ============================================

export function getCardLockedTooltip(card: RewardCard): string {
  switch (card) {
    case "freeze": return "Sell a player for €20M or more to unlock";
    case "triple": return "Sell a player for €40M or more to unlock";
    case "steal": return "Sell a player for €50M or more to unlock";
  }
}

// ============================================
// ALL CARDS LIST
// ============================================

export const ALL_REWARD_CARDS: RewardCard[] = ["freeze", "triple", "steal"];