// ============================================
// FOOTBALL INVESTOR — SAVE SYSTEM
// localStorage-based save/load
// ============================================

import type { GamePlayer, GameMode, SeasonEvent, NewsItem } from "./types";

const SAVE_KEY = "fi_save_v1";

export type SaveData = {
  version: number;
  savedAt: string;
  season: number;
  turnIndex: number;
  mode: GameMode;
  gameLengthMode: "classic" | "infinite";
  budgetMode: string;
  eventsEnabled: boolean;
  eventType: string;
  timerSeconds: number | null;
  negativeBudgetEndsGame: boolean;
  gamePlayers: GamePlayer[];
  news: NewsItem[];
  seasonEvent: SeasonEvent | null;
};

export function saveGame(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  return !!localStorage.getItem(SAVE_KEY);
}

export function getSaveInfo(): { season: number; mode: string; savedAt: string } | null {
  const save = loadGame();
  if (!save) return null;
  return {
    season: save.season,
    mode: save.mode,
    savedAt: save.savedAt,
  };
}