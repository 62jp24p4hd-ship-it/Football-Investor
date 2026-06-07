// ============================================
// FOOTBALL INVESTOR — SINGLE MODE RULES
// ============================================

import type { GamePlayer } from "./types";
import { PURCHASE_CHANCES_PER_SEASON, SELL_CHANCES_PER_SEASON } from "./constants";

// ── Constants ──────────────────────────────
export const SINGLE_PURCHASE_CHANCES = PURCHASE_CHANCES_PER_SEASON; // 4
export const SINGLE_SELL_CHANCES = SELL_CHANCES_PER_SEASON;          // 4

// ── Can advance to next season? ────────────
// Single: player must exhaust all purchase chances
export function singleCanNextSeason(
  gamePlayers: GamePlayer[],
  devUnlocked: boolean,
  pendingSlot: string | null,
  hasModal: boolean
): boolean {
  if (devUnlocked) return true;
  if (pendingSlot || hasModal) return false;
  return (gamePlayers[0]?.purchaseChances ?? 0) <= 0;
}

// ── Initial chances for a new season ───────
export function getSingleSeasonChances(gp: GamePlayer, newSeason: number): {
  purchaseChances: number;
  sellChances: number;
} {
  const base = gp.tripleNextSeason ? SINGLE_PURCHASE_CHANCES + 2 : SINGLE_PURCHASE_CHANCES;
  return {
    purchaseChances: gp.frozenSeason === newSeason ? 0 : base,
    sellChances: SINGLE_SELL_CHANCES,
  };
}

// ── Is turn over? (single has no turns, always active) ──
export function isSingleTurnOver(gp: GamePlayer): boolean {
  return gp.purchaseChances <= 0;
}