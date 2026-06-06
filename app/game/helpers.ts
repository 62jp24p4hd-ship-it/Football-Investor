// ============================================
// FOOTBALL INVESTOR 1.8 - HELPERS
// ============================================

import type { Position } from "./types";
import { SLOT_TO_POSITION } from "./constants";

// ============================================
// RANDOM UTILITIES
// ============================================

export function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomId(): number {
  return Date.now() + Math.floor(Math.random() * 100000);
}

export function shuffle<T>(list: T[]): T[] {
  return [...list].sort(() => Math.random() - 0.5);
}

export function weightedRandom<T>(
  items: T[],
  weights: number[]
): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return items[i];
  }
  return items[items.length - 1];
}

// ============================================
// NUMBER UTILITIES
// ============================================

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function roundTo(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function formatMoney(value: number): string {
  if (value >= 1000) {
    return `€${roundTo(value / 1000, 1)}B`;
  }
  return `€${value}M`;
}

export function formatMoneyShort(value: number): string {
  return `€${value}M`;
}

export function signedMoney(value: number): string {
  if (value >= 0) return `+€${value}M`;
  return `-€${Math.abs(value)}M`;
}

// ============================================
// POSITION UTILITIES
// ============================================

export function slotToPosition(slot: string): Position {
  return SLOT_TO_POSITION[slot] ?? (slot as Position);
}

export function isAttacker(position: Position): boolean {
  return ["ST", "LW", "RW"].includes(position);
}

export function isMidfielder(position: Position): boolean {
  return ["LCM", "RCM", "CAM"].includes(position);
}

export function isDefender(position: Position): boolean {
  return ["LB", "LCB", "RCB", "RB"].includes(position);
}

export function isGoalkeeper(position: Position): boolean {
  return position === "GK";
}

// ============================================
// AGE UTILITIES
// ============================================

export function calculateAge(
  startAge: number,
  availableSeason: number,
  targetSeason: number
): number {
  return startAge + (targetSeason - availableSeason);
}

export function getAgeCategory(age: number): string {
  if (age <= 21) return "wonderkid";
  if (age <= 25) return "young";
  if (age <= 29) return "prime";
  if (age <= 33) return "veteran";
  return "aging";
}

// ============================================
// RETIREMENT UTILITIES
// ============================================

export function getRetirementChance(age: number): number {
  if (age < 30) return 0;
  if (age <= 32) return 0.02;
  if (age <= 35) return 0.05;
  if (age <= 38) return 0.10;
  return 0.20;
}

export function getRetirementWarning(age: number): string | null {
  if (age < 30) return null;
  if (age <= 32) return "⚠️ Low retirement risk";
  if (age <= 35) return "⚠️ Medium retirement risk";
  if (age <= 38) return "⚠️ High retirement risk";
  return "🚨 Very high retirement risk";
}

export function getRetirementAge(startAge: number): number {
  return randomBetween(30, 40);
}

// ============================================
// SATISFACTION UTILITIES
// ============================================

export function getSatisfactionColor(satisfaction: number): string {
  if (satisfaction >= 80) return "text-emerald-400";
  if (satisfaction >= 60) return "text-yellow-400";
  if (satisfaction >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getSatisfactionLabel(satisfaction: number): string {
  if (satisfaction >= 80) return "Very Happy 😊";
  if (satisfaction >= 60) return "Happy 🙂";
  if (satisfaction >= 40) return "Neutral 😐";
  if (satisfaction >= 20) return "Unhappy 😠";
  return "Furious 🤬";
}

export function getSatisfactionBar(satisfaction: number): string {
  if (satisfaction >= 80) return "bg-emerald-500";
  if (satisfaction >= 60) return "bg-yellow-500";
  if (satisfaction >= 40) return "bg-orange-500";
  return "bg-red-500";
}

// ============================================
// CARD UTILITIES
// ============================================

export function cardName(card: string): string {
  if (card === "freeze") return "🧊 Freeze Card";
  if (card === "triple") return "⚡ Triple Buy Card";
  return "🕵️ Steal Card";
}

export function cardLockedMessage(card: string): string {
  if (card === "freeze") return "Sell a player for €20M+ to unlock";
  if (card === "triple") return "Sell a player for €40M+ to unlock";
  return "Sell a player for €50M+ to unlock";
}

// ============================================
// DATE / SEASON UTILITIES
// ============================================

export function seasonLabel(season: number): string {
  return `${season}/${String(season + 1).slice(2)}`;
}

export function seasonsRemaining(currentSeason: number, endSeason: number): number {
  return Math.max(0, endSeason - currentSeason);
}

// ============================================
// STRING UTILITIES
// ============================================

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "...";
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ============================================
// NATIONALITY FLAG EMOJI
// ============================================

export function nationalityFlag(nationality: string): string {
  const flags: Record<string, string> = {
    Brazil: "🇧🇷",
    Argentina: "🇦🇷",
    France: "🇫🇷",
    Spain: "🇪🇸",
    Portugal: "🇵🇹",
    Netherlands: "🇳🇱",
    Germany: "🇩🇪",
    Italy: "🇮🇹",
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    Belgium: "🇧🇪",
    Morocco: "🇲🇦",
    Senegal: "🇸🇳",
    Nigeria: "🇳🇬",
    Turkey: "🇹🇷",
    Croatia: "🇭🇷",
    Uruguay: "🇺🇾",
    Colombia: "🇨🇴",
    Mexico: "🇲🇽",
    Egypt: "🇪🇬",
    "Saudi Arabia": "🇸🇦",
  };
  return flags[nationality] ?? "🌍";
}

// ============================================
// POSITION DISPLAY
// ============================================

export function positionColor(position: string): string {
  if (["ST", "LW", "RW"].includes(position)) return "text-red-400";
  if (["CAM", "LCM", "RCM"].includes(position)) return "text-yellow-400";
  if (["LB", "LCB", "RCB", "RB"].includes(position)) return "text-blue-400";
  return "text-emerald-400";
}

export function positionBg(position: string): string {
  if (["ST", "LW", "RW"].includes(position)) return "bg-red-900/50 text-red-300";
  if (["CAM", "LCM", "RCM"].includes(position)) return "bg-yellow-900/50 text-yellow-300";
  if (["LB", "LCB", "RCB", "RB"].includes(position)) return "bg-blue-900/50 text-blue-300";
  return "bg-emerald-900/50 text-emerald-300";
}