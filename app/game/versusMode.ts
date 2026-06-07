// ============================================
// FOOTBALL INVESTOR — VERSUS MODE RULES
// ============================================

import type { GamePlayer } from "./types";
import { PURCHASE_CHANCES_VERSUS, SELL_CHANCES_PER_SEASON } from "./constants";

// ── Constants ──────────────────────────────
export const VERSUS_PURCHASE_CHANCES = PURCHASE_CHANCES_VERSUS; // 1
export const VERSUS_SELL_CHANCES = SELL_CHANCES_PER_SEASON;      // 4

// ── Can advance to next season? ────────────
// Versus: BOTH players must have bought at least 1 player (or exhausted chances)
export function versusCanNextSeason(
  gamePlayers: GamePlayer[],
  devUnlocked: boolean,
  pendingSlot: string | null,
  hasModal: boolean
): boolean {
  if (devUnlocked) return true;
  if (pendingSlot || hasModal) return false;
  return gamePlayers.every((gp) => gp.owned.length > 0 || gp.purchaseChances <= 0);
}

// ── Initial chances for a new season ───────
export function getVersusSeasonChances(gp: GamePlayer, newSeason: number): {
  purchaseChances: number;
  sellChances: number;
} {
  const base = gp.tripleNextSeason ? VERSUS_PURCHASE_CHANCES + 2 : VERSUS_PURCHASE_CHANCES;
  return {
    purchaseChances: gp.frozenSeason === newSeason ? 0 : base,
    sellChances: VERSUS_SELL_CHANCES,
  };
}

// ── Is current player's turn over? ─────────
// Versus: turn ends when player buys OR explicitly skips
export function isVersusTurnOver(gp: GamePlayer): boolean {
  return gp.purchaseChances <= 0;
}

// ── Get next player index ───────────────────
export function getNextPlayerIndex(current: number, total: number): number {
  return (current + 1) % total;
}

// ── Skip turn (spends purchase chance) ─────
export function skipVersusTurn(gp: GamePlayer): GamePlayer {
  return {
    ...gp,
    purchaseChances: Math.max(0, gp.purchaseChances - 1),
  };
}