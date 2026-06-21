// ============================================
// CHAMPIONS LEAGUE - TEAM NAMES & QUALIFIERS
// ============================================

import type { CLTeam } from "./clTypes";

// Real CL team names by league, ordered by typical finishing position
// Position 0 = 1st place, position 1 = 2nd place, etc.

export const CL_LEAGUE_SPOTS: Record<string, number> = {
  premier_league:     5,
  bundesliga:         5,
  ligue_1:            5,
  serie_a:            5,
  la_liga:            5,
  saudi_league:       3,
  portuguese_league:  3,
  eredivisie:         3,
  super_lig:          2,
};

export const CL_TEAM_NAMES: Record<string, string[]> = {
  premier_league:     ["Manchester City", "Arsenal", "Liverpool", "Chelsea", "Tottenham"],
  bundesliga:         ["Bayern Munich", "Borussia Dortmund", "Bayer Leverkusen", "RB Leipzig", "VfB Stuttgart"],
  ligue_1:            ["Paris Saint-Germain", "AS Monaco", "Olympique Marseille", "Olympique Lyon", "LOSC Lille"],
  serie_a:            ["Inter Milan", "AC Milan", "Juventus", "Napoli", "AS Roma"],
  la_liga:            ["Real Madrid", "FC Barcelona", "Atlético Madrid", "Villarreal", "Sevilla FC"],
  saudi_league:       ["Al-Hilal", "Al-Nassr", "Al-Ittihad"],
  portuguese_league:  ["SL Benfica", "FC Porto", "Sporting CP"],
  eredivisie:         ["Ajax", "PSV Eindhoven", "Feyenoord"],
  super_lig:          ["Galatasaray", "Fenerbahçe"],
};

// League flag emojis for display
export const LEAGUE_FLAG: Record<string, string> = {
  premier_league:    "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  bundesliga:        "🇩🇪",
  ligue_1:           "🇫🇷",
  serie_a:           "🇮🇹",
  la_liga:           "🇪🇸",
  saudi_league:      "🇸🇦",
  portuguese_league: "🇵🇹",
  eredivisie:        "🇳🇱",
  super_lig:         "🇹🇷",
};

/**
 * Get CL-qualifying teams from a given league's standings.
 * Maps standing positions to real CL team names.
 * If the user's team is in this league, maps them to a real name at that position
 * (or keeps user name if position overlaps).
 *
 * @param leagueId - The league identifier
 * @param standings - Array of { teamName, isUser } in standings order (1st = index 0)
 * @param season - Current season (used to vary team names slightly over time)
 * @returns Array of CLTeam objects for the qualifying spots
 */
export function getCLQualifiers(
  leagueId: string,
  standings: { teamName: string; isUser: boolean }[],
  season: number
): CLTeam[] {
  const spots = CL_LEAGUE_SPOTS[leagueId] ?? 0;
  const realNames = CL_TEAM_NAMES[leagueId] ?? [];
  const results: CLTeam[] = [];

  for (let pos = 0; pos < spots && pos < standings.length; pos++) {
    const entry = standings[pos];
    if (!entry) break;

    // Use the real CL team name for this position, unless it's the user
    const realName = realNames[pos] ?? `Team from ${leagueId} (${pos + 1})`;
    const name = entry.isUser ? entry.teamName : realName;

    // Strength: 85 at position 0, decreasing by 4 per position, ±3 random noise, clamped 55-95
    const baseStrength = 85 - pos * 4;
    const noise = (Math.random() - 0.5) * 6; // ±3
    const strength = Math.max(55, Math.min(95, Math.round(baseStrength + noise)));

    results.push({
      name,
      leagueId,
      strength,
      isUser: entry.isUser,
    });
  }

  return results;
}
