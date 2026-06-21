// ============================================
// LEAGUE THEMES — shared across the UI
// ============================================

export type LeagueTheme = {
  headerGradient: string;   // TopBar background
  accentColor: string;      // primary accent (borders, highlights)
  glowColor: string;        // rgba glow
  textColor: string;        // colored text
  dimColor: string;         // muted version
  badgeGradient: string;    // round-counter badge
  flag: string;             // emoji flag
  shortName: string;        // 2-3 char abbreviation
};

export const LEAGUE_THEMES: Record<string, LeagueTheme> = {
  premier_league: {
    headerGradient: "linear-gradient(180deg, #09001a 0%, #140030 100%)",
    accentColor: "#a855f7",
    glowColor: "rgba(168,85,247,0.35)",
    textColor: "#c084fc",
    dimColor: "rgba(168,85,247,0.18)",
    badgeGradient: "linear-gradient(135deg,#7c3aed,#4c1d95)",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    shortName: "PL",
  },
  bundesliga: {
    headerGradient: "linear-gradient(180deg, #1a0000 0%, #3a0000 100%)",
    accentColor: "#dc2626",
    glowColor: "rgba(220,38,38,0.35)",
    textColor: "#f87171",
    dimColor: "rgba(220,38,38,0.18)",
    badgeGradient: "linear-gradient(135deg,#dc2626,#7f1d1d)",
    flag: "🇩🇪",
    shortName: "BL",
  },
  bundesliga2: {
    headerGradient: "linear-gradient(180deg, #150000 0%, #2d0000 100%)",
    accentColor: "#ef4444",
    glowColor: "rgba(239,68,68,0.3)",
    textColor: "#fca5a5",
    dimColor: "rgba(239,68,68,0.15)",
    badgeGradient: "linear-gradient(135deg,#b91c1c,#7f1d1d)",
    flag: "🇩🇪",
    shortName: "BL2",
  },
  la_liga: {
    headerGradient: "linear-gradient(180deg, #1a0000 0%, #2d0500 100%)",
    accentColor: "#f59e0b",
    glowColor: "rgba(245,158,11,0.35)",
    textColor: "#fbbf24",
    dimColor: "rgba(245,158,11,0.18)",
    badgeGradient: "linear-gradient(135deg,#d97706,#92400e)",
    flag: "🇪🇸",
    shortName: "LL",
  },
  segunda: {
    headerGradient: "linear-gradient(180deg, #140a00 0%, #2d1500 100%)",
    accentColor: "#f59e0b",
    glowColor: "rgba(245,158,11,0.3)",
    textColor: "#fcd34d",
    dimColor: "rgba(245,158,11,0.15)",
    badgeGradient: "linear-gradient(135deg,#b45309,#78350f)",
    flag: "🇪🇸",
    shortName: "2DA",
  },
  serie_a: {
    headerGradient: "linear-gradient(180deg, #000d1a 0%, #001a3d 100%)",
    accentColor: "#3b82f6",
    glowColor: "rgba(59,130,246,0.35)",
    textColor: "#93c5fd",
    dimColor: "rgba(59,130,246,0.18)",
    badgeGradient: "linear-gradient(135deg,#1d4ed8,#1e3a8a)",
    flag: "🇮🇹",
    shortName: "SA",
  },
  serie_b: {
    headerGradient: "linear-gradient(180deg, #000a15 0%, #001530 100%)",
    accentColor: "#60a5fa",
    glowColor: "rgba(96,165,250,0.3)",
    textColor: "#bfdbfe",
    dimColor: "rgba(96,165,250,0.15)",
    badgeGradient: "linear-gradient(135deg,#2563eb,#1e40af)",
    flag: "🇮🇹",
    shortName: "SB",
  },
  ligue_1: {
    headerGradient: "linear-gradient(180deg, #00000f 0%, #000b2d 100%)",
    accentColor: "#3b82f6",
    glowColor: "rgba(59,130,246,0.35)",
    textColor: "#93c5fd",
    dimColor: "rgba(59,130,246,0.18)",
    badgeGradient: "linear-gradient(135deg,#1d4ed8,#7f1d1d)",
    flag: "🇫🇷",
    shortName: "L1",
  },
  ligue_2: {
    headerGradient: "linear-gradient(180deg, #00000d 0%, #000820 100%)",
    accentColor: "#6366f1",
    glowColor: "rgba(99,102,241,0.3)",
    textColor: "#a5b4fc",
    dimColor: "rgba(99,102,241,0.15)",
    badgeGradient: "linear-gradient(135deg,#4f46e5,#312e81)",
    flag: "🇫🇷",
    shortName: "L2",
  },
  saudi_league: {
    headerGradient: "linear-gradient(180deg, #001a00 0%, #003300 100%)",
    accentColor: "#22c55e",
    glowColor: "rgba(34,197,94,0.35)",
    textColor: "#86efac",
    dimColor: "rgba(34,197,94,0.18)",
    badgeGradient: "linear-gradient(135deg,#16a34a,#14532d)",
    flag: "🇸🇦",
    shortName: "SPL",
  },
  portuguese_league: {
    headerGradient: "linear-gradient(180deg, #1a0000 0%, #001a00 100%)",
    accentColor: "#f87171",
    glowColor: "rgba(248,113,113,0.3)",
    textColor: "#fca5a5",
    dimColor: "rgba(248,113,113,0.15)",
    badgeGradient: "linear-gradient(135deg,#dc2626,#15803d)",
    flag: "🇵🇹",
    shortName: "PRT",
  },
  eredivisie: {
    headerGradient: "linear-gradient(180deg, #1a0500 0%, #3d1200 100%)",
    accentColor: "#f97316",
    glowColor: "rgba(249,115,22,0.35)",
    textColor: "#fdba74",
    dimColor: "rgba(249,115,22,0.18)",
    badgeGradient: "linear-gradient(135deg,#ea580c,#7c2d12)",
    flag: "🇳🇱",
    shortName: "ERE",
  },
  super_lig: {
    headerGradient: "linear-gradient(180deg, #1a0000 0%, #1a0500 100%)",
    accentColor: "#ef4444",
    glowColor: "rgba(239,68,68,0.35)",
    textColor: "#fca5a5",
    dimColor: "rgba(239,68,68,0.18)",
    badgeGradient: "linear-gradient(135deg,#dc2626,#7f1d1d)",
    flag: "🇹🇷",
    shortName: "SL",
  },
  championship: {
    headerGradient: "linear-gradient(180deg, #001a0a 0%, #00150a 100%)",
    accentColor: "#10b981",
    glowColor: "rgba(16,185,129,0.35)",
    textColor: "#6ee7b7",
    dimColor: "rgba(16,185,129,0.18)",
    badgeGradient: "linear-gradient(135deg,#059669,#064e3b)",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    shortName: "CHMP",
  },
};

export const DEFAULT_THEME: LeagueTheme = {
  headerGradient: "linear-gradient(180deg, #070b14 0%, #0a0f1e 100%)",
  accentColor: "#FFD54F",
  glowColor: "rgba(255,213,79,0.2)",
  textColor: "#FFD54F",
  dimColor: "rgba(255,213,79,0.12)",
  badgeGradient: "linear-gradient(135deg,#b8960a,#6b5500)",
  flag: "⚽",
  shortName: "FI",
};

export function getLeagueTheme(leagueId?: string): LeagueTheme {
  if (!leagueId) return DEFAULT_THEME;
  return LEAGUE_THEMES[leagueId] ?? DEFAULT_THEME;
}
