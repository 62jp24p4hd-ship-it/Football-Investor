// ============================================
// FOOTBALL INVESTOR 1.8 - CONSTANTS
// ============================================

import type { BudgetMode, Position, SponsorBrand } from "./types";

// ============================================
// GAME SETTINGS
// ============================================

export const GAME_START_SEASON = 2008;
export const GAME_END_SEASON = 2028;
export const AUCTION_PREVIEW_SECONDS = 10;
export const CONTRACT_TIMER_SECONDS = 60;
export const PLAYER_SELECTION_TIMER_DEFAULT = 15;

export const MIN_PLAYER_VALUE = 1;    // M
export const MAX_PLAYER_VALUE = 100;  // M

export const MIN_SALARY_PERCENT = 0.07;   // 7% of market value
export const MAX_SALARY_PERCENT = 0.25;   // 25% of market value

export const MAX_CONTRACT_YEARS = 5;
export const MIN_CONTRACT_YEARS = 1;

export const PURCHASE_CHANCES_PER_SEASON = 4;
export const SELL_CHANCES_PER_SEASON = 4;

export const SELL_BONUS_THRESHOLD_FREEZE = 20;   // M
export const SELL_BONUS_THRESHOLD_TRIPLE = 40;   // M
export const SELL_BONUS_THRESHOLD_STEAL = 50;    // M

export const EVENT_CHOICE_SELL_THRESHOLD = 100;  // M - triggers event choice card

export const RETIREMENT_MIN_AGE = 30;
export const RETIREMENT_MAX_AGE = 40;

export const PLAYER_SATISFACTION_MIN = 0;
export const PLAYER_SATISFACTION_MAX = 100;
export const PLAYER_SATISFACTION_REJECT_THRESHOLD = 20;

export const NEGATIVE_BUDGET_WARNING = -50; // M

// ============================================
// BUDGET SETTINGS
// ============================================

export const BUDGET_SETTINGS: Record<
  BudgetMode,
  {
    label: string;
    budget: number;
    badEventMultiplier: number;
    goodEventMultiplier: number;
    description: string;
  }
> = {
  lucky: {
    label: "€10M Lucky Investor",
    budget: 10,
    badEventMultiplier: 0.75,
    goodEventMultiplier: 1.15,
    description: "High risk, high reward. Events hit harder.",
  },
  balanced: {
    label: "€30M Balanced",
    budget: 30,
    badEventMultiplier: 1.0,
    goodEventMultiplier: 1.0,
    description: "Standard experience. Fair and balanced.",
  },
  rich: {
    label: "€100M Rich Investor",
    budget: 100,
    badEventMultiplier: 1.25,
    goodEventMultiplier: 0.95,
    description: "More money, but events are stronger.",
  },
  billionaire: {
    label: "€200M Billionaire",
    budget: 200,
    badEventMultiplier: 1.5,
    goodEventMultiplier: 0.9,
    description: "Maximum budget. Events are brutal.",
  },
};

// ============================================
// FORMATION 4-3-3
// ============================================

export const FORMATION_433: string[][] = [
  ["LW", "", "ST", "", "RW"],
  ["", "", "CAM", "", ""],
  ["", "LCM", "", "RCM", ""],
  ["LB", "LCB", "", "RCB", "RB"],
  ["", "", "GK", "", ""],
];

export const ALL_POSITIONS: Position[] = [
  "GK",
  "LB",
  "LCB",
  "RCB",
  "RB",
  "LCM",
  "RCM",
  "CAM",
  "LW",
  "ST",
  "RW",
];

// ============================================
// SLOT → POSITION MAP
// ============================================

export const SLOT_TO_POSITION: Record<string, Position> = {
  GK: "GK",
  LB: "LB",
  LCB: "LCB",
  RCB: "RCB",
  RB: "RB",
  LCM: "LCM",
  RCM: "RCM",
  CAM: "CAM",
  LW: "LW",
  ST: "ST",
  RW: "RW",
};

// ============================================
// SPONSORSHIP BRANDS
// ============================================

export const SPONSOR_BRANDS: SponsorBrand[] = [
  "Nike",
  "Adidas",
  "Puma",
  "Pepsi",
  "EA Sports",
  "Red Bull",
  "Beats",
  "Hublot",
];

export const SPONSOR_ANNUAL_INCOME: Record<SponsorBrand, { min: number; max: number }> = {
  Nike: { min: 3, max: 12 },
  Adidas: { min: 3, max: 10 },
  Puma: { min: 2, max: 8 },
  Pepsi: { min: 1, max: 5 },
  "EA Sports": { min: 2, max: 7 },
  "Red Bull": { min: 1, max: 4 },
  Beats: { min: 1, max: 3 },
  Hublot: { min: 2, max: 6 },
};

// ============================================
// JOURNALISTS & SOURCES
// ============================================

export const JOURNALISTS = [
  "Fabrizio Romano",
  "David Ornstein",
  "Florian Plettenberg",
  "Matteo Moretto",
  "Ben Jacobs",
  "Jonathan Shrager",
];

export const NEWS_SOURCES = [
  "Sky Sports",
  "The Athletic",
  "Goal.com",
  "Marca",
  "L'Equipe",
  "Gazzetta dello Sport",
  "BILD",
  "Sport",
];

// ============================================
// GENERATED PLAYER NAMES
// ============================================

export const GENERATED_FIRST_NAMES = [
  "Luca", "Mateo", "Noah", "Rayan", "Elias",
  "Adam", "Nico", "Leo", "Milan", "Ilyas",
  "Dario", "Kian", "Yanis", "Amir", "Tiago",
  "Enzo", "Omar", "Sami", "Nabil", "Karim",
  "Yusuf", "Ismail", "Tariq", "Ziad", "Fares",
];

export const GENERATED_LAST_NAMES = [
  "Moretti", "Silva", "Kovacs", "Diallo", "Martinez",
  "Haddad", "Fernandes", "Santos", "Novak", "Mensah",
  "Benali", "Costa", "Bakker", "Romero", "Demir",
  "Fischer", "Mendes", "Vargas", "Nasser", "Al-Harbi",
  "Khalid", "Okonkwo", "Mbeki", "Dupont", "Mueller",
];

export const GENERATED_NATIONALITIES = [
  "Brazil", "Argentina", "France", "Spain", "Portugal",
  "Netherlands", "Germany", "Italy", "England", "Belgium",
  "Morocco", "Senegal", "Nigeria", "Turkey", "Croatia",
  "Uruguay", "Colombia", "Mexico", "Egypt", "Saudi Arabia",
];

export const GENERATED_LEAGUES = [
  "Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1",
  "Eredivisie", "Primeira Liga", "Belgian Pro League",
  "Turkish Super Lig", "Brazilian Serie A",
  "Argentine Primera Division", "MLS", "Saudi Pro League",
];

export const GENERATED_CLUBS: Record<string, string[]> = {
  "Premier League": ["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United", "Tottenham"],
  "La Liga": ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla", "Valencia"],
  "Serie A": ["Juventus", "AC Milan", "Inter Milan", "Napoli", "Roma"],
  "Bundesliga": ["Bayern Munich", "Dortmund", "Leipzig", "Leverkusen", "Frankfurt"],
  "Ligue 1": ["PSG", "Marseille", "Lyon", "Monaco", "Lille"],
  "Eredivisie": ["Ajax", "PSV", "Feyenoord", "AZ"],
  "Primeira Liga": ["Benfica", "Porto", "Sporting CP", "Braga"],
  "Belgian Pro League": ["Anderlecht", "Club Brugge", "Gent"],
  "Turkish Super Lig": ["Galatasaray", "Fenerbahce", "Besiktas"],
  "Brazilian Serie A": ["Flamengo", "Palmeiras", "Santos", "Corinthians"],
  "Argentine Primera Division": ["River Plate", "Boca Juniors", "Racing"],
  "MLS": ["LA Galaxy", "Seattle Sounders", "NYCFC", "Atlanta United"],
  "Saudi Pro League": ["Al-Hilal", "Al-Nassr", "Al-Ittihad", "Al-Ahli"],
};

// ============================================
// AUCTION SETTINGS
// ============================================

export const AUCTION_BID_INCREMENT = 5; // M

export function getAuctionTimerByBid(bid: number): number {
  if (bid >= 100) return 5;
  if (bid >= 50) return 10;
  return 15;
}

// ============================================
// PLAYER CARD COLORS (CSS classes)
// ============================================

export const CARD_COLORS = {
  secret: "border-yellow-400 bg-yellow-950/40 shadow-yellow-500/20",
  talent: "border-emerald-400 bg-emerald-950/40 shadow-emerald-500/20",
  trap: "border-orange-500 bg-orange-950/40 shadow-orange-500/20",
  normal: "border-blue-400 bg-blue-950/40 shadow-blue-500/20",
  unknown: "border-slate-500 bg-slate-900/40",
};

// ============================================
// NEWS TONE COLORS
// ============================================

export const NEWS_TONE_COLORS: Record<string, string> = {
  good: "border-emerald-500 bg-emerald-950/30",
  bad: "border-red-500 bg-red-950/30",
  neutral: "border-slate-600 bg-slate-900/30",
  special: "border-purple-500 bg-purple-950/30",
};