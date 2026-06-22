// ============================================
// FOOTBALL INVESTOR 1.8 - LEAGUE ENGINE
// 20-Team Domestic League (Home & Away, 38 rounds)
// ============================================

import type { GamePlayer, Player, OwnedPlayer, NewsItem } from "./types";
import { randomId, pickRandom, shuffle } from "./helpers";
import { getSeasonStats } from "./statsEngine";

// ============================================
// TYPES
// ============================================

export type LeagueTeam = {
  id: string;            // "team1".."team18" or "user"
  name: string;
  isUser: boolean;
  players: Player[];      // 11 players (one per position) for strength calc
  strength: number;       // average rating
};

export type Fixture = {
  round: number;          // 1-36
  homeId: string;
  awayId: string;
  played: boolean;
  homeGoals?: number;
  awayGoals?: number;
};

export type MatchEvent = {
  minute: number;
  type: "goal" | "assist";
  team: "home" | "away";
  scorerName?: string;
  assistName?: string;
};

export type MatchResult = {
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
};

export type StandingRow = {
  teamId: string;
  teamName: string;
  isUser: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type LeaguePlayerStat = {
  playerName: string;
  teamName: string;
  isUserTeam: boolean;
  goals: number;
  assists: number;
  cleanSheets: number;
};

export type LeagueState = {
  teams: LeagueTeam[];
  fixtures: Fixture[];
  currentRound: number;       // 1-36, 0 = not started
  standings: StandingRow[];
  seasonPhase: "transfer" | "playing" | "finished";
  champion: string | null;
  playerStats: Record<string, LeaguePlayerStat>; // keyed by player name
  totalRounds: number; // dynamic based on team count (38 for 20 teams, 34 for 18 teams)
};

// ============================================
// CONSTANTS
// ============================================

export const TOTAL_TEAMS = 20; // 19 dummy + user — kept even so no team ever gets a bye round
export const TOTAL_ROUNDS = 38; // default (Premier League 20 teams). Use getTotalRounds() for dynamic leagues.
export function getTotalRounds(teamCount: number): number {
  return (teamCount - 1) * 2;
}
export const TRANSFER_WINDOW_START = 19;
export const TRANSFER_WINDOW_END = 22;
export const TRANSFER_WINDOW_CLOSE_ROUND = 23;

// Prize money awarded at the end of the season based on final league position
// (1st = top of table, 20th = bottom). Stored in millions, matching the
// budget scale used throughout the game (e.g. 100 = €100M).
export const PRIZE_MONEY_BY_POSITION: number[] = [
  100,  // 1st
  80,   // 2nd
  50,   // 3rd
  35,   // 4th
  25,   // 5th
  18,   // 6th
  14,   // 7th
  11,   // 8th
  9,    // 9th
  7,    // 10th
  5.5,  // 11th
  4.5,  // 12th
  3.5,  // 13th
  3,    // 14th
  2.5,  // 15th
  2,    // 16th
  1.5,  // 17th
  1.2,  // 18th
  1,    // 19th
  0.8,  // 20th
];

export function getPrizeMoneyForPosition(position: number): number {
  // position is 1-indexed (1st place, 2nd place, etc.)
  return PRIZE_MONEY_BY_POSITION[position - 1] ?? 0;
}

// ============================================
// LEAGUE-WIDE STAT LEADERBOARDS (top scorers, assists, clean sheets)
// ============================================

export function getTopScorers(league: LeagueState, limit: number = 10): LeaguePlayerStat[] {
  return Object.values(league.playerStats)
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
}

export function getTopAssists(league: LeagueState, limit: number = 10): LeaguePlayerStat[] {
  return Object.values(league.playerStats)
    .filter(p => p.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, limit);
}

export function getTopCleanSheets(league: LeagueState, limit: number = 10): LeaguePlayerStat[] {
  return Object.values(league.playerStats)
    .filter(p => p.cleanSheets > 0)
    .sort((a, b) => b.cleanSheets - a.cleanSheets)
    .slice(0, limit);
}

// ============================================
// BEST PLAYER OF THE SEASON
// Score = goals + assists*0.7 + rating*0.15 (rating pulled from the player
// pool when available; dummy-team players default to a neutral baseline).
// ============================================

export function getBestPlayerOfSeason(
  league: LeagueState,
  allPlayers: Player[]
): { stat: LeaguePlayerStat; score: number } | null {
  const entries = Object.values(league.playerStats);
  if (entries.length === 0) return null;

  let best: { stat: LeaguePlayerStat; score: number } | null = null;

  for (const stat of entries) {
    const playerRecord = allPlayers.find(p => p.name === stat.playerName);
    const rating = playerRecord?.rating ?? 70;
    const score = stat.goals + stat.assists * 0.7 + rating * 0.15;

    if (!best || score > best.score) {
      best = { stat, score };
    }
  }

  return best;
}

function ordinalSuffix(n: number): string {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const DUMMY_TEAM_NAMES = [
  "Arsenal","Aston Villa","Bournemouth","Brentford","Brighton",
  "Chelsea","Coventry City","Crystal Palace","Everton","Fulham",
  "Hull City","Ipswich Town","Leeds United","Liverpool","Manchester City",
  "Manchester United","Newcastle United","Nottingham Forest","Sunderland","Tottenham Hotspur",
];

const BUNDESLIGA_TEAM_NAMES = [
  "Bayer Leverkusen","Bayern Munich","Borussia Dortmund","RB Leipzig","VfB Stuttgart",
  "Eintracht Frankfurt","TSG Hoffenheim","FC Heidenheim","Werder Bremen","SC Freiburg",
  "FC Augsburg","VfL Wolfsburg","Borussia Mönchengladbach","Mainz 05","VfL Bochum",
  "Union Berlin","FC St. Pauli","Holstein Kiel",
];

const LA_LIGA_TEAM_NAMES = [
  "Barcelona","Real Madrid","Villarreal","Atlético Madrid","Real Betis",
  "Celta Vigo","Getafe","Rayo Vallecano","Valencia","Real Sociedad",
  "Espanyol","Athletic Bilbao","Sevilla","Deportivo Alavés","Elche",
  "Levante","Osasuna","Mallorca","Girona","Real Oviedo",
];

const SERIE_A_TEAM_NAMES = [
  "AC Milan","Inter Milan","Juventus","Napoli","AS Roma",
  "Lazio","Atalanta","Fiorentina","Bologna","Torino",
  "Udinese","Genoa","Cagliari","Lecce","Hellas Verona",
  "Empoli","Monza","Como","Parma","Venezia",
];

const LIGUE_1_TEAM_NAMES = [
  "Paris Saint-Germain","Marseille","Monaco","Lyon","Lille",
  "Lens","Nice","Rennes","Brest","Toulouse",
  "Strasbourg","Lorient","Paris FC","Angers","Le Havre",
  "Auxerre","Nantes","Metz",
];

const SAUDI_LEAGUE_TEAM_NAMES = [
  "Al Nassr","Al Hilal","Al Ahli","Al Ittihad","Al Shabab",
  "Al Qadsiah","Al Taawoun","Al Ettifaq","Al Fateh","Al Fayha",
  "Al Khaleej","Al Riyadh","Damac FC","Al Okhdood","Al Kholood",
  "Al Hazem","NEOM SC","Al Najma",
];

const PORTUGUESE_LEAGUE_TEAM_NAMES = [
  "Sporting CP","FC Porto","SL Benfica","SC Braga","Vitória de Guimarães",
  "Famalicão","Moreirense","Arouca","Estoril Praia","Gil Vicente",
  "Rio Ave","Santa Clara","Nacional","Casa Pia","Estrela da Amadora",
  "Alverca","Tondela","AVS Futebol SAD",
];

const EREDIVISIE_TEAM_NAMES = [
  "Ajax","PSV Eindhoven","Feyenoord","AZ Alkmaar","FC Twente",
  "FC Utrecht","Sparta Rotterdam","NEC Nijmegen","Go Ahead Eagles","Fortuna Sittard",
  "SC Heerenveen","FC Groningen","PEC Zwolle","Almere City","Heracles Almelo",
  "RKC Waalwijk","Willem II","NAC Breda",
];

const SUPER_LIG_TEAM_NAMES = [
  "Galatasaray","Fenerbahçe","Beşiktaş","Trabzonspor","İstanbul Başakşehir",
  "Göztepe","Samsunspor","Çaykur Rizespor","Konyaspor","Alanyaspor",
  "Kocaelispor","Gaziantep FK","Kasımpaşa","Gençlerbirliği","Eyüpspor",
  "Amedspor","Çorum FK","Erzurumspor FK",
];

const CHAMPIONSHIP_TEAM_NAMES = [
  "Birmingham City","Blackburn Rovers","Bolton Wanderers","Bristol City","Burnley",
  "Cardiff City","Charlton Athletic","Derby County","Lincoln City","Middlesbrough",
  "Millwall","Norwich City","Portsmouth","Preston North End","Queens Park Rangers",
  "Sheffield United","Southampton","Stoke City","Swansea City","Watford",
  "West Bromwich Albion","West Ham United","Wolverhampton Wanderers","Wrexham",
];

const BUNDESLIGA2_TEAM_NAMES = [
  "Hamburger SV","Schalke 04","Hertha BSC","FC Köln","Fortuna Düsseldorf",
  "Hannover 96","SC Paderborn","Karlsruher SC","1. FC Nürnberg","1. FC Kaiserslautern",
  "Greuther Fürth","Magdeburg","Eintracht Braunschweig","Elversberg","Darmstadt 98",
  "Preußen Münster","SSV Ulm","Jahn Regensburg",
];

const SEGUNDA_TEAM_NAMES = [
  "Real Zaragoza","Sporting Gijón","Tenerife","Real Oviedo","Racing Santander",
  "Levante","Eibar","Elche","Albacete","Burgos",
  "Cartagena","Eldense","Huesca","Mirandés","Racing Ferrol",
  "Castellón","Deportivo La Coruña","Málaga","Córdoba","Almería",
  "Granada","Cádiz",
];

const SERIE_B_TEAM_NAMES = [
  "Sassuolo","Salernitana","Frosinone","Palermo","Cremonese",
  "Sampdoria","Brescia","Pisa","Catanzaro","Modena",
  "Bari","Spezia","Cosenza","Südtirol","Reggiana",
  "Cittadella","Cesena","Mantova","Juve Stabia","Carrarese",
];

const LIGUE_2_TEAM_NAMES = [
  "FC Metz","FC Nantes","AS Saint-Étienne","Montpellier Hérault SC","Stade de Reims",
  "Clermont Foot 63","FC Sochaux-Montbéliard","En Avant Guingamp","Dijon FCO","Grenoble Foot 38",
  "US Boulogne CO","AS Nancy Lorraine","Red Star FC","Stade Lavallois Mayenne FC","Rodez AF",
  "Pau FC","FC Annecy","USL Dunkerque",
];

const POSITIONS_FOR_TEAM = ["GK","LB","LCB","RCB","RB","LCM","RCM","CAM","LW","ST","RW"];

// ============================================
// GENERATE LEAGUE TEAMS (called once at season start)
// ============================================

export function generateLeagueTeams(
  allPlayers: Player[],
  season: number,
  userTeamName: string,
  ownedPlayerNames: string[] = [],
  leagueId: string = "premier_league",
  relegatedTeams: string[] = [],
  promotedTeams: string[] = []
): LeagueTeam[] {
  // A single season's database only has ~10 players per position, but we
  // need 19 unique players per position (one for each dummy team) to avoid
  // any player appearing on multiple clubs — which would double/triple-count
  // their goals in the league-wide stat leaderboards. Widen the search to a
  // ±3 season window around the league's actual season, then deduplicate by
  // name (keeping whichever entry is closest to the real season, so ratings/
  // ages stay as realistic as possible for that point in time).
  const SEASON_WINDOW = 3;
  const ownedSet = new Set(ownedPlayerNames);
  const candidatePlayers = allPlayers.filter(
    p => !p.secret &&
      Math.abs(p.availableSeason - season) <= SEASON_WINDOW &&
      !ownedSet.has(p.name) // exclude players the user already owns — otherwise
                              // the same player could simultaneously "play" for
                              // a dummy team and the user's own squad, double
                              // counting their goals in the league stat tables.
  );

  // Deduplicate by name, keeping the entry whose availableSeason is closest
  // to the league's actual season (ties broken by whichever appears first).
  const closestByName = new Map<string, Player>();
  for (const p of candidatePlayers) {
    const existing = closestByName.get(p.name);
    if (!existing) {
      closestByName.set(p.name, p);
      continue;
    }
    const existingDist = Math.abs(existing.availableSeason - season);
    const candidateDist = Math.abs(p.availableSeason - season);
    if (candidateDist < existingDist) {
      closestByName.set(p.name, p);
    }
  }
  const seasonPlayers = Array.from(closestByName.values());

  // Group available players by position
  const byPosition: Record<string, Player[]> = {};
  for (const pos of POSITIONS_FOR_TEAM) {
    byPosition[pos] = shuffle(seasonPlayers.filter(p => p.position === pos));
  }

  const teams: LeagueTeam[] = [];

  // Track a running cursor per position so each player is assigned to at
  // most one dummy team this season — prevents the same real player (e.g.
  // Robinho) from appearing on multiple clubs and having his goals double
  // (or triple) counted in the league-wide stat leaderboards.
  const positionCursor: Record<string, number> = {};
  for (const pos of POSITIONS_FOR_TEAM) positionCursor[pos] = 0;

  // Get base club names for this league
  const baseLeagueNames =
    leagueId === "bundesliga"        ? BUNDESLIGA_TEAM_NAMES :
    leagueId === "la_liga"           ? LA_LIGA_TEAM_NAMES :
    leagueId === "serie_a"           ? SERIE_A_TEAM_NAMES :
    leagueId === "ligue_1"           ? LIGUE_1_TEAM_NAMES :
    leagueId === "saudi_league"      ? SAUDI_LEAGUE_TEAM_NAMES :
    leagueId === "portuguese_league" ? PORTUGUESE_LEAGUE_TEAM_NAMES :
    leagueId === "eredivisie"        ? EREDIVISIE_TEAM_NAMES :
    leagueId === "super_lig"         ? SUPER_LIG_TEAM_NAMES :
    leagueId === "championship"      ? CHAMPIONSHIP_TEAM_NAMES :
    leagueId === "bundesliga2"       ? BUNDESLIGA2_TEAM_NAMES :
    leagueId === "segunda"            ? SEGUNDA_TEAM_NAMES :
    leagueId === "serie_b"            ? SERIE_B_TEAM_NAMES :
    leagueId === "ligue_2"            ? LIGUE_2_TEAM_NAMES :
    DUMMY_TEAM_NAMES;

  // Apply promotion/relegation:
  // - Remove promoted teams (they left this league going up)
  // - Add relegated teams (they came down from the league above)
  const adjustedNames = [
    ...baseLeagueNames.filter(name => !promotedTeams.includes(name)),
    ...relegatedTeams.filter(name => !baseLeagueNames.includes(name) && !promotedTeams.includes(name)),
  ];

  // Exclude user's club (they occupy one slot)
  const dummyTeamNames = adjustedNames.filter(name => name !== userTeamName);

  // Build dummy teams (all clubs except user's chosen one)
  for (let i = 0; i < dummyTeamNames.length; i++) {
    const squad: Player[] = [];
    for (const pos of POSITIONS_FOR_TEAM) {
      const pool = byPosition[pos];
      let player: Player | undefined;

      if (pool.length > 0) {
        // Walk forward through the pool without wrapping back to an
        // already-used player, unless we've genuinely exhausted the pool
        // (more teams than available real players for that position even
        // after widening the search window — should be very rare now).
        const cursor = positionCursor[pos];
        if (cursor < pool.length) {
          player = pool[cursor];
          positionCursor[pos] = cursor + 1;
        } else {
          // Pool exhausted — fall back to reusing players rather than
          // leaving the slot empty.
          player = pool[cursor % pool.length];
        }
      }

      if (player) squad.push(player);
    }
    const strength = squad.length > 0
      ? squad.reduce((sum, p) => sum + (p.rating ?? 70), 0) / squad.length
      : 70;

    teams.push({
      id: `team${i + 1}`,
      name: dummyTeamNames[i],
      isUser: false,
      players: squad,
      strength,
    });
  }

  // User's team placeholder (strength recalculated dynamically from owned players)
  teams.push({
    id: "user",
    name: userTeamName || "Your Team",
    isUser: true,
    players: [],
    strength: 70,
  });

  return teams;
}

// ============================================
// CALCULATE USER TEAM STRENGTH (from owned players)
// ============================================

export function calculateUserStrength(gp: GamePlayer, season: number): number {
  if (gp.owned.length === 0) return 65;
  const ratings = gp.owned.map(item => {
    const stats = getSeasonStats(item.player, season);
    return stats.rating ?? item.player.rating ?? 70;
  });
  return ratings.reduce((s, r) => s + r, 0) / ratings.length;
}

// ============================================
// GENERATE FIXTURES (round-robin, home & away)
// Standard circle method for 19 teams (odd number -> one bye per round... 
// but we need exactly 19 teams playing 36 rounds with no byes since 19 is odd.
// Solution: pad to 20 with a "ghost" that's actually team vs team double round-robin
// won't work cleanly with odd count. We use the standard algorithm for N=19 (odd):
// each round one team sits out in single round-robin (19 rounds), but since we need
// 38 rounds total = 2x19, we treat this as if there were 19 OTHER teams and user 
// plays each of them home & away = 38 matches exactly. The 19 dummy teams ALSO 
// play each other home & away (sharing the same 36-round calendar).
// ============================================

export function generateFixtures(teamIds: string[]): Fixture[] {
  // teamIds should have 20 entries (19 dummy + user)
  // We use circle method: with odd N, add a "bye" placeholder making it even (20)
  const ids = [...teamIds];
  const hasBye = ids.length % 2 !== 0;
  if (hasBye) ids.push("__BYE__");

  const n = ids.length;
  const half = n / 2;
  const rounds: Fixture[][] = [];

  // First half of season (round-robin single leg)
  const arr = [...ids];
  for (let round = 0; round < n - 1; round++) {
    const roundFixtures: Fixture[] = [];
    for (let i = 0; i < half; i++) {
      const home = arr[i];
      const away = arr[n - 1 - i];
      if (home !== "__BYE__" && away !== "__BYE__") {
        roundFixtures.push({
          round: round + 1,
          homeId: home,
          awayId: away,
          played: false,
        });
      }
    }
    rounds.push(roundFixtures);
    // rotate (keep first element fixed)
    const last = arr.pop()!;
    arr.splice(1, 0, last);
  }

  // Second half (reverse home/away) for the full 36-round home-and-away calendar
  const secondHalf: Fixture[][] = rounds.map((roundFixtures, idx) =>
    roundFixtures.map(f => ({
      round: rounds.length + idx + 1,
      homeId: f.awayId,
      awayId: f.homeId,
      played: false,
    }))
  );

  const allRounds = [...rounds, ...secondHalf];
  return allRounds.flat();
}

// ============================================
// SIMULATE A SINGLE MATCH (with events for user's match)
// ============================================

export function simulateMatch(
  homeStrength: number,
  awayStrength: number,
  homeRoster?: Player[],
  awayRoster?: Player[],
  generateEvents: boolean = false
): MatchResult {
  // Expected goals based on strength differential + home advantage
  const strengthDiff = (homeStrength - awayStrength) / 10;
  const homeBaseXG = 1.4 + strengthDiff * 0.5 + 0.15; // home advantage
  const awayBaseXG = 1.2 - strengthDiff * 0.5;

  const homeXG = Math.max(0.3, homeBaseXG + (Math.random() - 0.5) * 0.8);
  const awayXG = Math.max(0.3, awayBaseXG + (Math.random() - 0.5) * 0.8);

  const homeGoals = poissonSample(homeXG);
  const awayGoals = poissonSample(awayXG);

  const events: MatchEvent[] = [];

  if (generateEvents) {
    const attackers = (homeRoster ?? []).filter(p =>
      ["ST", "LW", "RW", "CAM"].includes(p.position)
    );
    const midfielders = (homeRoster ?? []).filter(p =>
      ["LCM", "RCM", "CAM", "LW", "RW"].includes(p.position)
    );
    const awayAttackers = (awayRoster ?? []).filter(p =>
      ["ST", "LW", "RW", "CAM"].includes(p.position)
    );
    const awayMidfielders = (awayRoster ?? []).filter(p =>
      ["LCM", "RCM", "CAM", "LW", "RW"].includes(p.position)
    );

    for (let g = 0; g < homeGoals; g++) {
      const scorer = attackers.length > 0 ? pickRandom(attackers) : (homeRoster ?? [])[0];
      const assister = midfielders.length > 0 ? pickRandom(midfielders) : undefined;
      events.push({
        minute: Math.floor(Math.random() * 90) + 1,
        type: "goal",
        team: "home",
        scorerName: scorer?.name,
        assistName: assister && assister.name !== scorer?.name ? assister.name : undefined,
      });
    }

    for (let g = 0; g < awayGoals; g++) {
      const scorer = awayAttackers.length > 0 ? pickRandom(awayAttackers) : (awayRoster ?? [])[0];
      const assister = awayMidfielders.length > 0 ? pickRandom(awayMidfielders) : undefined;
      events.push({
        minute: Math.floor(Math.random() * 90) + 1,
        type: "goal",
        team: "away",
        scorerName: scorer?.name,
        assistName: assister && assister.name !== scorer?.name ? assister.name : undefined,
      });
    }

    events.sort((a, b) => a.minute - b.minute);
  }

  return { homeGoals, awayGoals, events };
}

// Simple Poisson sampler for realistic football scorelines
function poissonSample(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// ============================================
// PLAY A FULL ROUND (user's match detailed, others simulated quickly)
// ============================================

export function playRound(
  league: LeagueState,
  gamePlayers: GamePlayer[],
  userIndex: number,
  season: number
): {
  updatedLeague: LeagueState;
  updatedGamePlayers: GamePlayer[];
  userMatch: { fixture: Fixture; result: MatchResult; opponent: LeagueTeam } | null;
  newsItems: NewsItem[];
  prizeMoneyAwarded: number; // 0 unless this round ended the season
} {
  const round = league.currentRound + 1;
  const roundFixtures = league.fixtures.filter(f => f.round === round);
  const newsItems: NewsItem[] = [];

  let updatedGamePlayers = [...gamePlayers];
  let userMatchInfo: { fixture: Fixture; result: MatchResult; opponent: LeagueTeam } | null = null;
  const updatedPlayerStats: Record<string, LeaguePlayerStat> = { ...league.playerStats };

  const updatedFixtures = league.fixtures.map(f => ({ ...f }));

  for (const fixture of roundFixtures) {
    const homeTeam = league.teams.find(t => t.id === fixture.homeId)!;
    const awayTeam = league.teams.find(t => t.id === fixture.awayId)!;

    const isUserMatch = homeTeam.isUser || awayTeam.isUser;

    const userGp = gamePlayers[userIndex];
    const userStrength = calculateUserStrength(userGp, season);
    const userRoster = userGp.owned.map(o => o.player);

    const homeStrength = homeTeam.isUser ? userStrength : homeTeam.strength;
    const awayStrength = awayTeam.isUser ? userStrength : awayTeam.strength;
    const homeRoster = homeTeam.isUser ? userRoster : homeTeam.players;
    const awayRoster = awayTeam.isUser ? userRoster : awayTeam.players;

    // Generate full goal/assist events for every match in the round (not just
    // the user's), so league-wide top scorer/assist/clean-sheet tables are accurate.
    const result = simulateMatch(homeStrength, awayStrength, homeRoster, awayRoster, true);

    // Update fixture
    const fIdx = updatedFixtures.findIndex(f => f.round === fixture.round && f.homeId === fixture.homeId && f.awayId === fixture.awayId);
    if (fIdx >= 0) {
      updatedFixtures[fIdx] = {
        ...updatedFixtures[fIdx],
        played: true,
        homeGoals: result.homeGoals,
        awayGoals: result.awayGoals,
      };
    }

    // Accumulate goals/assists from this match into the league-wide player stats table
    for (const event of result.events) {
      if (event.type !== "goal") continue;
      const isHomeEvent = event.team === "home";
      const scoringTeam = isHomeEvent ? homeTeam : awayTeam;

      if (event.scorerName) {
        const existing = updatedPlayerStats[event.scorerName] ?? {
          playerName: event.scorerName,
          teamName: scoringTeam.name,
          isUserTeam: scoringTeam.isUser,
          goals: 0,
          assists: 0,
          cleanSheets: 0,
        };
        updatedPlayerStats[event.scorerName] = { ...existing, goals: existing.goals + 1 };
      }
      if (event.assistName) {
        const existing = updatedPlayerStats[event.assistName] ?? {
          playerName: event.assistName,
          teamName: scoringTeam.name,
          isUserTeam: scoringTeam.isUser,
          goals: 0,
          assists: 0,
          cleanSheets: 0,
        };
        updatedPlayerStats[event.assistName] = { ...existing, assists: existing.assists + 1 };
      }
    }

    // Clean sheets: credit the GK (and whole roster's GK specifically) of the team that conceded 0
    if (result.awayGoals === 0) {
      const gk = homeRoster.find(p => p.position === "GK");
      if (gk) {
        const existing = updatedPlayerStats[gk.name] ?? {
          playerName: gk.name, teamName: homeTeam.name, isUserTeam: homeTeam.isUser,
          goals: 0, assists: 0, cleanSheets: 0,
        };
        updatedPlayerStats[gk.name] = { ...existing, cleanSheets: existing.cleanSheets + 1 };
      }
    }
    if (result.homeGoals === 0) {
      const gk = awayRoster.find(p => p.position === "GK");
      if (gk) {
        const existing = updatedPlayerStats[gk.name] ?? {
          playerName: gk.name, teamName: awayTeam.name, isUserTeam: awayTeam.isUser,
          goals: 0, assists: 0, cleanSheets: 0,
        };
        updatedPlayerStats[gk.name] = { ...existing, cleanSheets: existing.cleanSheets + 1 };
      }
    }

    if (isUserMatch) {
      const opponent = homeTeam.isUser ? awayTeam : homeTeam;
      userMatchInfo = { fixture: updatedFixtures[fIdx], result, opponent };

      // Apply cumulative stats to owned players based on match events
      const userIsHome = homeTeam.isUser;
      const statsUpdate = applyMatchToOwnedPlayers(
        userGp,
        result,
        userIsHome,
        season
      );
      updatedGamePlayers[userIndex] = statsUpdate.updatedGp;

      const userGoals = userIsHome ? result.homeGoals : result.awayGoals;
      const oppGoals = userIsHome ? result.awayGoals : result.homeGoals;
      const outcome = userGoals > oppGoals ? "Win" : userGoals < oppGoals ? "Loss" : "Draw";
      const tone = outcome === "Win" ? "good" : outcome === "Loss" ? "bad" : "neutral";

      const scoreline = `${userIsHome ? userGoals : oppGoals}-${userIsHome ? oppGoals : userGoals}`;
      const journalist = pickRandom(["Fabrizio Romano", "David Ornstein", "Gary Neville", "Jamie Carragher", "Roy Keane"]);
      const source = pickRandom(["Sky Sports", "BBC Sport", "The Athletic", "ESPN FC", "TalkSPORT"]);

      const winComments = [
        `Dominant showing from ${userGp.name}. ${opponent.name} had no answer tonight.`,
        `Clinical performance. ${userGp.name} looked a different class and fully deserved the three points.`,
        `${opponent.name} tried to hang on but were outplayed from start to finish. A statement result.`,
        `You can't argue with that scoreline. ${userGp.name} were simply better in every department.`,
        `Controlled, composed, and clinical. This is what title-chasing football looks like.`,
        `${userGp.name} put on a masterclass. ${opponent.name} were chasing shadows all night.`,
        `Three points that tell the full story. ${userGp.name} were electric from the first whistle.`,
      ];
      const bigWinComments = [
        `An absolute statement of intent. ${userGp.name} destroyed ${opponent.name} — this was ruthless.`,
        `This wasn't a match, it was a demolition. ${userGp.name} are in frightening form right now.`,
        `You have to feel for ${opponent.name} tonight. Totally outclassed from minute one.`,
        `${userGoals} goals — this was an embarrassment for ${opponent.name}. ${userGp.name} are flying.`,
      ];
      const lossComments = [
        `Difficult night for ${userGp.name}. ${opponent.name} took their chances and deserved the win.`,
        `${userGp.name} struggled to create meaningful chances. ${opponent.name} were well-organised and clinical.`,
        `A below-par performance. ${userGp.name} will need to regroup quickly after this setback.`,
        `${opponent.name} exposed the weaknesses we've seen before. This result will sting for a while.`,
        `Hard to find positives after that. ${userGp.name} were second best for large spells of the game.`,
        `${userGp.name} ran out of ideas against a resolute ${opponent.name} side. Disappointing evening.`,
      ];
      const bigLossComments = [
        `An absolute nightmare. ${userGp.name} collapsed completely — this performance raises serious questions.`,
        `There are no excuses for a result like this. ${userGp.name} were all over the place defensively.`,
        `${opponent.name} were relentless. ${userGp.name} had no answer and it showed on the scoreboard.`,
      ];
      const drawComments = [
        `Honours even in a tight contest. Both sides had moments but neither could find a winner.`,
        `A point each and both sides will take it. ${userGp.name} showed resilience to earn the draw.`,
        `Frustrating for ${userGp.name} — they had enough to win this but ${opponent.name} held firm.`,
        `A fair result in the end. Compact from both teams and moments of quality were limited.`,
        `${userGp.name} will feel they left two points on the pitch. Still, a clean sheet is a solid base.`,
      ];

      const diff = userGoals - oppGoals;
      let comment: string;
      if (outcome === "Win") {
        comment = diff >= 3 ? pickRandom(bigWinComments) : pickRandom(winComments);
      } else if (outcome === "Loss") {
        comment = diff <= -3 ? pickRandom(bigLossComments) : pickRandom(lossComments);
      } else {
        comment = pickRandom(drawComments);
      }

      newsItems.push({
        id: randomId(),
        season,
        title: `⚽ R${round}: ${outcome} ${scoreline} vs ${opponent.name}`,
        description: comment,
        tone,
        journalist,
        source,
      });
    }
  }

  const updatedLeague: LeagueState = {
    ...league,
    fixtures: updatedFixtures,
    currentRound: round,
    standings: computeStandings(league.teams, updatedFixtures),
    playerStats: updatedPlayerStats,
    seasonPhase:
      round >= TRANSFER_WINDOW_START && round <= TRANSFER_WINDOW_END
        ? "transfer"
        : round >= league.totalRounds
        ? "finished"
        : "playing",
  };

  let prizeMoneyAwarded = 0;

  if (round >= league.totalRounds) {
    const champion = updatedLeague.standings[0];
    updatedLeague.champion = champion?.teamId ?? null;

    // Find user's final position in the table (1-indexed) and award prize money
    const userStandingIndex = updatedLeague.standings.findIndex(s => s.isUser);
    const userPosition = userStandingIndex >= 0 ? userStandingIndex + 1 : null;

    if (userPosition !== null) {
      prizeMoneyAwarded = getPrizeMoneyForPosition(userPosition);
      if (prizeMoneyAwarded > 0) {
        updatedGamePlayers[userIndex] = {
          ...updatedGamePlayers[userIndex],
          budget: updatedGamePlayers[userIndex].budget + prizeMoneyAwarded,
        };
        newsItems.push({
          id: randomId(),
          season,
          title: `💰 Prize Money: €${prizeMoneyAwarded}M`,
          description: `${updatedGamePlayers[userIndex].name} finished the season in ${userPosition}${ordinalSuffix(userPosition)} place and earned €${prizeMoneyAwarded}M in prize money.`,
          tone: userPosition <= 4 ? "good" : userPosition >= 18 ? "bad" : "neutral",
          journalist: "Fabrizio Romano",
          source: "Sky Sports",
        });
      }
    }

    if (champion?.isUser) {
      newsItems.push({
        id: randomId(),
        season,
        title: `🏆 PREMIER LEAGUE CHAMPIONS!`,
        description: `${champion.teamName} has won the league title with ${champion.points} points! An incredible season.`,
        tone: "good",
        journalist: "Fabrizio Romano",
        source: "Sky Sports",
      });
    } else {
      newsItems.push({
        id: randomId(),
        season,
        title: `🏆 Season Ended — ${champion?.teamName} Champions`,
        description: `${champion?.teamName} clinched the league title with ${champion?.points} points.`,
        tone: "neutral",
        journalist: "David Ornstein",
        source: "The Athletic",
      });
    }
  }

  return { updatedLeague, updatedGamePlayers, userMatch: userMatchInfo, newsItems, prizeMoneyAwarded };
}

// ============================================
// APPLY MATCH EVENTS TO OWNED PLAYERS (cumulative stats)
// ============================================

function applyMatchToOwnedPlayers(
  gp: GamePlayer,
  result: MatchResult,
  userIsHome: boolean,
  season: number
): { updatedGp: GamePlayer; summary: string } {
  const teamSide = userIsHome ? "home" : "away";
  const relevantEvents = result.events.filter(e => e.team === teamSide);

  const summaryParts: string[] = [];

  // Expected performance score per game, by position group — used as a baseline
  // to compare actual match output against, so rating growth reflects whether
  // the player over- or under-performed their role, not just raw goal count.
  function expectedPerformance(position: string): number {
    if (["ST", "LW", "RW", "CAM"].includes(position)) return 0.55; // attackers expected to contribute most
    if (["LCM", "RCM"].includes(position)) return 0.30;
    if (["LB", "RB", "LCB", "RCB"].includes(position)) return 0.12;
    return 0.08; // GK
  }

  const MAX_RATING_DELTA_PER_MATCH = 0.4; // hard cap so growth stays gradual across a 36-game season

  const updatedOwned: OwnedPlayer[] = gp.owned.map(item => {
    const goalsScored = relevantEvents.filter(e => e.type === "goal" && e.scorerName === item.player.name).length;
    const assistsMade = relevantEvents.filter(e => e.type === "goal" && e.assistName === item.player.name).length;

    if (goalsScored > 0) summaryParts.push(`${item.player.name} scored ${goalsScored}`);
    if (assistsMade > 0) summaryParts.push(`${item.player.name} assisted ${assistsMade}`);

    const currentStats = getSeasonStats(item.player, season);
    const expected = expectedPerformance(item.player.position);
    const actualPerformance = goalsScored * 1.0 + assistsMade * 0.5; // contribution score for this match
    const performanceDelta = actualPerformance - expected; // positive = overperformed, negative = underperformed

    // Scale delta into a small rating nudge, clamped to a gradual max per match
    const ratingDelta = Math.max(
      -MAX_RATING_DELTA_PER_MATCH,
      Math.min(MAX_RATING_DELTA_PER_MATCH, performanceDelta * 0.35)
    );

    // Track rating internally with decimals (ratingPrecise) so small per-match
    // nudges actually accumulate instead of being lost to rounding every game.
    const previousPreciseRating = currentStats.ratingPrecise ?? currentStats.rating ?? 70;
    const newPreciseRating = Math.max(40, Math.min(99, previousPreciseRating + ratingDelta));

    const newStatsBySeason = {
      ...(item.player.statsBySeason ?? {}),
      [season]: {
        ...currentStats,
        games: (currentStats.games ?? 0) + 1,
        goals: (currentStats.goals ?? 0) + goalsScored,
        assists: (currentStats.assists ?? 0) + assistsMade,
        rating: Math.round(newPreciseRating),
        ratingPrecise: newPreciseRating,
      },
    };

    return {
      ...item,
      player: { ...item.player, statsBySeason: newStatsBySeason },
    };
  });

  const finalOwned = updatedOwned;

  return {
    updatedGp: { ...gp, owned: finalOwned },
    summary: summaryParts.length > 0 ? summaryParts.join(", ") + "." : "Squad rotation, no standout stats.",
  };
}

// ============================================
// COMPUTE STANDINGS FROM FIXTURES
// ============================================

export function computeStandings(teams: LeagueTeam[], fixtures: Fixture[]): StandingRow[] {
  const table: Record<string, StandingRow> = {};

  for (const team of teams) {
    table[team.id] = {
      teamId: team.id,
      teamName: team.name,
      isUser: team.isUser,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    };
  }

  for (const f of fixtures) {
    if (!f.played || f.homeGoals === undefined || f.awayGoals === undefined) continue;

    const home = table[f.homeId];
    const away = table[f.awayId];
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.goalsFor += f.homeGoals;
    home.goalsAgainst += f.awayGoals;
    away.goalsFor += f.awayGoals;
    away.goalsAgainst += f.homeGoals;

    if (f.homeGoals > f.awayGoals) {
      home.won++; home.points += 3;
      away.lost++;
    } else if (f.homeGoals < f.awayGoals) {
      away.won++; away.points += 3;
      home.lost++;
    } else {
      home.drawn++; home.points += 1;
      away.drawn++; away.points += 1;
    }
  }

  return Object.values(table).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });
}

// ============================================
// INITIALIZE A NEW LEAGUE SEASON
// ============================================

export function initializeLeagueSeason(
  allPlayers: Player[],
  season: number,
  userTeamName: string,
  ownedPlayerNames: string[] = [],
  leagueId: string = "premier_league",
  relegatedTeams: string[] = [],   // teams coming DOWN from tier above (added to this league)
  promotedTeams: string[] = []     // teams going UP from this league (removed from this league)
): LeagueState {
  const teams = generateLeagueTeams(allPlayers, season, userTeamName, ownedPlayerNames, leagueId, relegatedTeams, promotedTeams);
  const teamIds = teams.map(t => t.id);
  const fixtures = generateFixtures(teamIds);

  const totalRounds = getTotalRounds(teams.length);

  return {
    teams,
    fixtures,
    currentRound: 0,
    standings: computeStandings(teams, fixtures),
    seasonPhase: "transfer", // before Start Season is pressed, transfers allowed
    champion: null,
    playerStats: {},
    totalRounds,
  };
}

// ============================================
// CHECK IF TRANSFER MARKET IS OPEN
// ============================================

export function isTransferMarketOpen(league: LeagueState | null): boolean {
  if (!league) return true; // no league active yet = pre-season, always open
  if (league.currentRound === 0) return true; // before Start Season pressed
  if (league.seasonPhase === "finished") return true;
  return league.currentRound >= TRANSFER_WINDOW_START && league.currentRound <= TRANSFER_WINDOW_END;
}

// ============================================
// GET USER'S NEXT FIXTURE
// ============================================

export function getUserNextFixture(league: LeagueState): Fixture | null {
  const nextRound = league.currentRound + 1;
  return league.fixtures.find(
    f => f.round === nextRound && (f.homeId === "user" || f.awayId === "user")
  ) ?? null;
}

// ============================================
// MATCH PREVIEW (lineups + averages before simulation)
// ============================================

export type MatchPreview = {
  round: number;
  userIsHome: boolean;
  opponentName: string;
  userLineup: { name: string; position: string }[];
  opponentLineup: { name: string; position: string }[];
  userAverage: number;
  opponentAverage: number;
};

export function getMatchPreview(
  league: LeagueState,
  gamePlayers: GamePlayer[],
  userIndex: number,
  season: number
): MatchPreview | null {
  const fixture = getUserNextFixture(league);
  if (!fixture) return null;

  const userIsHome = fixture.homeId === "user";
  const opponentId = userIsHome ? fixture.awayId : fixture.homeId;
  const opponentTeam = league.teams.find(t => t.id === opponentId);
  if (!opponentTeam) return null;

  const userGp = gamePlayers[userIndex];
  const userRoster = userGp.owned.map(o => ({ name: o.player.name, position: o.slot ?? o.player.position }));
  const userAverage = calculateUserStrength(userGp, season);

  const opponentLineup = opponentTeam.players.map(p => ({ name: p.name, position: p.position }));

  return {
    round: fixture.round,
    userIsHome,
    opponentName: opponentTeam.name,
    userLineup: userRoster,
    opponentLineup,
    userAverage,
    opponentAverage: opponentTeam.strength,
  };
}

// ============================================
// TRANSFER WINDOW CHANCES BOOST
// During rounds 19-22, purchase/sell chances are increased above normal.
// ============================================

export const TRANSFER_WINDOW_PURCHASE_CHANCES = 6; // vs normal 4
export const TRANSFER_WINDOW_SELL_CHANCES = 6;     // vs normal 4

export function getTransferWindowChances(): { purchaseChances: number; sellChances: number } {
  return {
    purchaseChances: TRANSFER_WINDOW_PURCHASE_CHANCES,
    sellChances: TRANSFER_WINDOW_SELL_CHANCES,
  };
}

export function isInTransferWindow(league: LeagueState): boolean {
  return league.currentRound >= TRANSFER_WINDOW_START && league.currentRound <= TRANSFER_WINDOW_END;
}