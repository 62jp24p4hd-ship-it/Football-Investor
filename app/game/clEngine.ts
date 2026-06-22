// ============================================
// CHAMPIONS LEAGUE ENGINE
// ============================================

import type { CLState, CLTeam, CLStanding, CLFixture, CLTie, CLPlayerStat } from "./clTypes";
import { getCLQualifiers, CL_LEAGUE_SPOTS } from "./clTeams";
import type { OwnedPlayer } from "./types";
import type { LeagueState } from "./leagueEngine";

// ============================================
// HELPERS
// ============================================

function clRandomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function clShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function poissonSample(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

// ============================================
// SIMULATE A CL MATCH
// ============================================

export function simulateCLMatch(
  homeStrength: number,
  awayStrength: number,
  homeTeamName: string,
  awayTeamName: string,
  homePlayerNames?: string[],
  awayPlayerNames?: string[],
): {
  homeGoals: number;
  awayGoals: number;
  scorers: Array<{ name: string; team: string }>;
  assisters: Array<{ name: string; team: string }>;
  homeCleanSheet: boolean;
  awayCleanSheet: boolean;
  events: import("./leagueEngine").MatchEvent[];
} {
  const diff = (homeStrength - awayStrength) / 10;
  const homeXG = Math.max(0.3, 1.4 + diff * 0.5 + 0.15 + (Math.random() - 0.5) * 0.8);
  const awayXG = Math.max(0.3, 1.2 - diff * 0.5 + (Math.random() - 0.5) * 0.8);

  const homeGoals = poissonSample(homeXG);
  const awayGoals = poissonSample(awayXG);

  const scorers: Array<{ name: string; team: string }> = [];
  const assisters: Array<{ name: string; team: string }> = [];
  const events: import("./leagueEngine").MatchEvent[] = [];

  // Track used minutes to avoid duplicates
  const usedMinutes = new Set<number>();
  function randMinute() {
    let m = Math.floor(Math.random() * 90) + 1;
    while (usedMinutes.has(m)) m = m % 90 + 1;
    usedMinutes.add(m);
    return m;
  }

  // Use real player names if provided, otherwise generic fallbacks
  const homePlayers = (homePlayerNames && homePlayerNames.length > 0)
    ? homePlayerNames
    : ["Striker", "Midfielder", "Forward"];
  const awayPlayers = (awayPlayerNames && awayPlayerNames.length > 0)
    ? awayPlayerNames
    : ["Striker", "Forward", "Winger"];

  function pickGoalPair(players: string[]): { scorer: string; assister: string | null } {
    const scorer = players[Math.floor(Math.random() * players.length)];
    const others = players.filter(n => n !== scorer);
    const assister = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : null;
    return { scorer, assister };
  }

  for (let g = 0; g < homeGoals; g++) {
    const { scorer, assister } = pickGoalPair(homePlayers);
    const minute = randMinute();
    scorers.push({ name: scorer, team: homeTeamName });
    if (assister) {
      assisters.push({ name: assister, team: homeTeamName });
      events.push({ minute, type: "goal", team: "home", scorerName: scorer, assistName: assister });
    } else {
      events.push({ minute, type: "goal", team: "home", scorerName: scorer });
    }
  }

  for (let g = 0; g < awayGoals; g++) {
    const { scorer, assister } = pickGoalPair(awayPlayers);
    const minute = randMinute();
    scorers.push({ name: scorer, team: awayTeamName });
    if (assister) {
      assisters.push({ name: assister, team: awayTeamName });
      events.push({ minute, type: "goal", team: "away", scorerName: scorer, assistName: assister });
    } else {
      events.push({ minute, type: "goal", team: "away", scorerName: scorer });
    }
  }

  events.sort((a, b) => a.minute - b.minute);

  return {
    homeGoals,
    awayGoals,
    scorers,
    assisters,
    homeCleanSheet: awayGoals === 0,
    awayCleanSheet: homeGoals === 0,
    events,
  };
}

// ============================================
// DRAW GROUP FIXTURES
// Constraint: no two teams from same domestic league face each other
// Each team plays exactly 8 matches (one per round)
// ============================================

export function drawGroupFixtures(teams: CLTeam[]): CLFixture[] {
  const n = teams.length; // 36
  const fixtures: CLFixture[] = [];
  const usedPairs = new Set<string>();

  for (let round = 1; round <= 8; round++) {
    let roundComplete = false;
    let attempts = 0;

    while (!roundComplete && attempts < 200) {
      attempts++;
      const roundPaired = new Set<number>();
      const roundMatches: [number, number][] = [];
      let failed = false;

      // Shuffle team indices for this attempt
      const order = clShuffle(Array.from({ length: n }, (_, i) => i));

      for (const i of order) {
        if (roundPaired.has(i)) continue;

        // Collect valid partners: different league, not used pair, not paired this round
        const candidates = order.filter(j =>
          j !== i &&
          !roundPaired.has(j) &&
          teams[j].leagueId !== teams[i].leagueId &&
          !usedPairs.has(`${Math.min(i, j)}-${Math.max(i, j)}`)
        );

        if (candidates.length === 0) {
          // Try allowing already-used pairs as fallback (still different league)
          const fallback = order.filter(j =>
            j !== i &&
            !roundPaired.has(j) &&
            teams[j].leagueId !== teams[i].leagueId
          );
          if (fallback.length === 0) { failed = true; break; }
          const j = fallback[Math.floor(Math.random() * fallback.length)];
          roundPaired.add(i);
          roundPaired.add(j);
          roundMatches.push([i, j]);
          continue;
        }

        const j = candidates[Math.floor(Math.random() * candidates.length)];
        roundPaired.add(i);
        roundPaired.add(j);
        roundMatches.push([i, j]);
      }

      if (!failed && roundMatches.length === n / 2) {
        roundComplete = true;
        for (const [i, j] of roundMatches) {
          usedPairs.add(`${Math.min(i, j)}-${Math.max(i, j)}`);
          const homeIsI = Math.random() < 0.5;
          fixtures.push({
            round,
            homeTeam: homeIsI ? teams[i].name : teams[j].name,
            awayTeam: homeIsI ? teams[j].name : teams[i].name,
            homeLeagueId: homeIsI ? teams[i].leagueId : teams[j].leagueId,
            awayLeagueId: homeIsI ? teams[j].leagueId : teams[i].leagueId,
            played: false,
          });
        }
      }
    }

    // Guaranteed fallback: pair teams in shuffled order ignoring pair-reuse constraint
    if (!roundComplete) {
      const order = clShuffle(Array.from({ length: n }, (_, i) => i));
      const roundPaired = new Set<number>();
      for (const i of order) {
        if (roundPaired.has(i)) continue;
        const partner = order.find(j =>
          j !== i && !roundPaired.has(j) && teams[j].leagueId !== teams[i].leagueId
        );
        if (partner === undefined) continue;
        roundPaired.add(i);
        roundPaired.add(partner);
        const key = `${Math.min(i, partner)}-${Math.max(i, partner)}`;
        usedPairs.add(key);
        const homeIsI = Math.random() < 0.5;
        fixtures.push({
          round,
          homeTeam: homeIsI ? teams[i].name : teams[partner].name,
          awayTeam: homeIsI ? teams[partner].name : teams[i].name,
          homeLeagueId: homeIsI ? teams[i].leagueId : teams[partner].leagueId,
          awayLeagueId: homeIsI ? teams[partner].leagueId : teams[i].leagueId,
          played: false,
        });
      }
    }
  }

  return fixtures;
}

// ============================================
// UPDATE STANDINGS FROM FIXTURES
// ============================================

export function updateStandings(teams: CLTeam[], fixtures: CLFixture[]): CLStanding[] {
  const table: Record<string, CLStanding> = {};

  for (const t of teams) {
    table[t.name] = {
      teamName: t.name,
      leagueId: t.leagueId,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0,
      isUser: t.isUser,
    };
  }

  for (const f of fixtures) {
    if (!f.played || f.homeGoals === undefined || f.awayGoals === undefined) continue;
    const home = table[f.homeTeam];
    const away = table[f.awayTeam];
    if (!home || !away) continue;

    home.played++; away.played++;
    home.goalsFor += f.homeGoals; home.goalsAgainst += f.awayGoals;
    away.goalsFor += f.awayGoals; away.goalsAgainst += f.homeGoals;

    if (f.homeGoals > f.awayGoals) {
      home.won++; home.points += 3; away.lost++;
    } else if (f.homeGoals < f.awayGoals) {
      away.won++; away.points += 3; home.lost++;
    } else {
      home.drawn++; home.points++;
      away.drawn++; away.points++;
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
// UPDATE PLAYER STATS FROM MATCH
// ============================================

function updatePlayerStats(
  stats: Record<string, CLPlayerStat>,
  scorers: Array<{ name: string; team: string }>,
  assisters: Array<{ name: string; team: string }>,
  homeTeam: string,
  awayTeam: string,
  homeGoals: number,
  awayGoals: number,
  userTeamName: string,
  userRoster?: OwnedPlayer[]
): Record<string, CLPlayerStat> {
  const updated = { ...stats };

  const ensure = (name: string, team: string): CLPlayerStat => {
    if (!updated[name]) {
      updated[name] = { playerName: name, teamName: team, goals: 0, assists: 0, cleanSheets: 0, games: 0 };
    }
    return updated[name];
  };

  // Count games for user's players
  if (userRoster) {
    for (const op of userRoster) {
      const s = ensure(op.player.name, userTeamName);
      s.games++;
    }
  }

  for (const sc of scorers) {
    const s = ensure(sc.name, sc.team);
    s.goals++;
  }
  for (const as_ of assisters) {
    const s = ensure(as_.name, as_.team);
    s.assists++;
  }

  // Clean sheets — only for user's goalkeeper
  if (userRoster) {
    const isUserHome = homeTeam === userTeamName;
    const userConceded = isUserHome ? awayGoals : homeGoals;
    if (userConceded === 0) {
      const gk = userRoster.find(o => o.slot === "GK" || o.player.position === "GK");
      if (gk) {
        const s = ensure(gk.player.name, userTeamName);
        s.cleanSheets++;
      }
    }
  }

  return updated;
}

// ============================================
// PLAY A GROUP ROUND
// ============================================

export function playCLRound(
  clState: CLState,
  round: number,
  userTeamName: string,
  userStrength: number,
  userRoster?: OwnedPlayer[]
): { clState: CLState; userEvents: import("./leagueEngine").MatchEvent[]; userFixture: CLFixture | null } {
  let playerStats = { ...clState.playerStats };
  let userEvents: import("./leagueEngine").MatchEvent[] = [];
  let userFixtureResult: CLFixture | null = null;

  const updatedFixtures = clState.groupFixtures.map(f => {
    if (f.round !== round || f.played) return f;

    const isUserHome = f.homeTeam === userTeamName;
    const isUserAway = f.awayTeam === userTeamName;
    const isUserMatch = isUserHome || isUserAway;

    const homeTeam = clState.teams.find(t => t.name === f.homeTeam);
    const awayTeam = clState.teams.find(t => t.name === f.awayTeam);
    const homeStrength = isUserHome ? userStrength : (homeTeam?.strength ?? 70);
    const awayStrength = isUserAway ? userStrength : (awayTeam?.strength ?? 70);

    // Derive player name lists: user roster or team rosters for AI
    const homePlayerNames = isUserHome
      ? userRoster?.map(o => o.player.name)
      : clState.teamRosters?.[f.homeTeam];
    const awayPlayerNames = isUserAway
      ? userRoster?.map(o => o.player.name)
      : clState.teamRosters?.[f.awayTeam];

    const result = simulateCLMatch(
      homeStrength, awayStrength,
      f.homeTeam, f.awayTeam,
      homePlayerNames,
      awayPlayerNames,
    );

    // Capture user match events
    if (isUserMatch) {
      userEvents = result.events;
      userFixtureResult = { ...f, homeGoals: result.homeGoals, awayGoals: result.awayGoals, played: true };
    }

    // Update player stats
    playerStats = updatePlayerStats(
      playerStats,
      result.scorers,
      result.assisters,
      f.homeTeam,
      f.awayTeam,
      result.homeGoals,
      result.awayGoals,
      userTeamName,
      isUserMatch ? userRoster : undefined
    );

    return { ...f, homeGoals: result.homeGoals, awayGoals: result.awayGoals, played: true };
  });

  const newStandings = updateStandings(clState.teams, updatedFixtures);

  return {
    clState: {
      ...clState,
      groupFixtures: updatedFixtures,
      currentGroupRound: round,
      standings: newStandings,
      playerStats,
    },
    userEvents,
    userFixture: userFixtureResult,
  };
}

// ============================================
// SETUP PLAYOFF (after 8 group rounds)
// 9th vs 24th, 10th vs 23rd, ..., 16th vs 17th
// ============================================

export function setupPlayoff(clState: CLState): CLState {
  const sorted = [...clState.standings]; // already sorted by points/GD/GF

  const playoffTies: CLTie[] = [];
  for (let i = 0; i < 8; i++) {
    const higherSeed = sorted[8 + i];  // 9th through 16th
    const lowerSeed = sorted[23 - i];  // 24th through 17th

    if (!higherSeed || !lowerSeed) continue;

    const userInvolved = higherSeed.isUser || lowerSeed.isUser;

    // Lower seed (higher position number) plays leg 1 at home
    playoffTies.push({
      id: clRandomId(),
      teamA: lowerSeed.teamName,    // leg1 at home (worse position)
      teamB: higherSeed.teamName,   // leg2 at home
      teamALeagueId: lowerSeed.leagueId,
      teamBLeagueId: higherSeed.leagueId,
      leg1: null,
      leg2: null,
      winner: null,
      userInvolved,
    });
  }

  return { ...clState, playoffTies, phase: "playoff_leg1" };
}

// ============================================
// DETERMINE TIE WINNER (aggregate)
// ============================================

function determineTieWinner(tie: CLTie): string | null {
  if (!tie.leg1 || !tie.leg2) return null;
  // A plays leg1 at home, B plays leg2 at home
  // teamA goals total = leg1.goalsA + leg2.goalsA
  // teamB goals total = leg1.goalsB + leg2.goalsB
  const aTotal = tie.leg1.goalsA + tie.leg2.goalsA;
  const bTotal = tie.leg1.goalsB + tie.leg2.goalsB;
  if (aTotal > bTotal) return tie.teamA;
  if (bTotal > aTotal) return tie.teamB;
  // Away goals rule: in leg2 (played at teamB's home), teamA's goals are "away" goals
  // Actually for simplicity: coin flip on aggregate draw
  return Math.random() < 0.5 ? tie.teamA : tie.teamB;
}

// ============================================
// PLAY PLAYOFF LEG
// ============================================

export function playPlayoffLeg(
  clState: CLState,
  leg: 1 | 2,
  userTeamName: string,
  userStrength: number,
  userRoster?: OwnedPlayer[]
): { clState: CLState; userEvents: import("./leagueEngine").MatchEvent[]; userTie: CLTie | null } {
  let playerStats = { ...clState.playerStats };
  let capturedUserEvents: import("./leagueEngine").MatchEvent[] = [];
  let capturedUserTie: CLTie | null = null;

  const updatedTies = clState.playoffTies.map(tie => {
    if (leg === 1 && tie.leg1 !== null) return tie;
    if (leg === 2 && tie.leg2 !== null) return tie;

    const homeTeamName = leg === 1 ? tie.teamA : tie.teamB;
    const awayTeamName = leg === 1 ? tie.teamB : tie.teamA;

    const homeTeam = clState.teams.find(t => t.name === homeTeamName);
    const awayTeam = clState.teams.find(t => t.name === awayTeamName);

    const isUserHome = homeTeamName === userTeamName;
    const isUserAway = awayTeamName === userTeamName;
    const isUserMatch = isUserHome || isUserAway;

    const homeStrength = isUserHome ? userStrength : (homeTeam?.strength ?? 70);
    const awayStrength = isUserAway ? userStrength : (awayTeam?.strength ?? 70);

    const homePlayerNames = isUserHome
      ? userRoster?.map(o => o.player.name)
      : clState.teamRosters?.[homeTeamName];
    const awayPlayerNames = isUserAway
      ? userRoster?.map(o => o.player.name)
      : clState.teamRosters?.[awayTeamName];

    const result = simulateCLMatch(
      homeStrength, awayStrength,
      homeTeamName, awayTeamName,
      homePlayerNames,
      awayPlayerNames,
    );

    if (isUserMatch) capturedUserEvents = result.events;

    playerStats = updatePlayerStats(
      playerStats, result.scorers, result.assisters,
      homeTeamName, awayTeamName, result.homeGoals, result.awayGoals,
      userTeamName, isUserMatch ? userRoster : undefined
    );

    let newTie: CLTie;
    if (leg === 1) {
      newTie = { ...tie, leg1: { goalsA: result.homeGoals, goalsB: result.awayGoals } };
    } else {
      newTie = { ...tie, leg2: { goalsA: result.awayGoals, goalsB: result.homeGoals } };
    }

    if (leg === 2) newTie.winner = determineTieWinner(newTie);
    if (isUserMatch) capturedUserTie = newTie;

    return newTie;
  });

  return {
    clState: {
      ...clState,
      playoffTies: updatedTies,
      phase: leg === 1 ? "playoff_leg2" : "r16_leg1",
      playerStats,
    },
    userEvents: capturedUserEvents,
    userTie: capturedUserTie,
  };
}

// ============================================
// DRAW R16
// 8 direct qualifiers (top 8) vs 8 playoff winners
// Fully random, assigns left/right bracket sides
// ============================================

export function drawR16(clState: CLState): CLState {
  const directQualifiers = clState.standings.slice(0, 8).map(s => s.teamName);
  const playoffWinners = clState.playoffTies
    .map(t => t.winner)
    .filter((w): w is string => w !== null);

  // Shuffle both groups
  const shuffledDirect = clShuffle(directQualifiers);
  const shuffledWinners = clShuffle(playoffWinners);

  const r16Ties: CLTie[] = [];
  for (let i = 0; i < 8; i++) {
    const directTeam = shuffledDirect[i] ?? `Direct Qualifier ${i + 1}`;
    const winnerTeam = shuffledWinners[i] ?? `PW-${i + 1}`;

    const directStanding = clState.standings.find(s => s.teamName === directTeam);
    const winnerTie = clState.playoffTies.find(t => t.winner === winnerTeam);

    const directLeagueId = directStanding?.leagueId ?? "unknown";
    const winnerLeagueId = winnerTie
      ? (winnerTeam === winnerTie.teamA ? winnerTie.teamALeagueId : winnerTie.teamBLeagueId)
      : "unknown";

    const isUserInvolved = directTeam === clState.teams.find(t => t.isUser)?.name ||
                           winnerTeam === clState.teams.find(t => t.isUser)?.name;

    // Playoff winner plays leg1 at home
    r16Ties.push({
      id: clRandomId(),
      teamA: winnerTeam,     // leg1 at home
      teamB: directTeam,     // leg2 at home
      teamALeagueId: winnerLeagueId,
      teamBLeagueId: directLeagueId,
      leg1: null,
      leg2: null,
      winner: null,
      userInvolved: isUserInvolved,
      side: i < 4 ? "left" : "right",
    });
  }

  return { ...clState, r16Ties, phase: "r16_leg1" };
}

// ============================================
// PLAY KNOCKOUT LEGS (R16, QF, SF, Final)
// ============================================

export function playKnockoutLeg(
  clState: CLState,
  round: "r16" | "qf" | "sf" | "final",
  leg: 1 | 2,
  userTeamName: string,
  userStrength: number,
  userRoster?: OwnedPlayer[]
): { clState: CLState; userEvents: import("./leagueEngine").MatchEvent[]; userTie: CLTie | null } {
  let playerStats = { ...clState.playerStats };
  let capturedUserEvents: import("./leagueEngine").MatchEvent[] = [];
  let capturedUserTie: CLTie | null = null;

  function playTies(ties: CLTie[]): CLTie[] {
    return ties.map(tie => {
      if (round === "final") {
        if (tie.leg1 !== null) return tie;
        const homeTeamName = tie.teamA;
        const awayTeamName = tie.teamB;
        const isUserHome = homeTeamName === userTeamName;
        const isUserAway = awayTeamName === userTeamName;
        const isUserMatch = isUserHome || isUserAway;
        const homeTeam = clState.teams.find(t => t.name === homeTeamName);
        const awayTeam = clState.teams.find(t => t.name === awayTeamName);
        const hs = isUserHome ? userStrength : (homeTeam?.strength ?? 70);
        const as_ = isUserAway ? userStrength : (awayTeam?.strength ?? 70);
        const hPN = isUserHome ? userRoster?.map(o => o.player.name) : clState.teamRosters?.[homeTeamName];
        const aPN = isUserAway ? userRoster?.map(o => o.player.name) : clState.teamRosters?.[awayTeamName];
        const result = simulateCLMatch(hs, as_, homeTeamName, awayTeamName, hPN, aPN);
        if (isUserMatch) capturedUserEvents = result.events;
        playerStats = updatePlayerStats(playerStats, result.scorers, result.assisters,
          homeTeamName, awayTeamName, result.homeGoals, result.awayGoals, userTeamName,
          isUserMatch ? userRoster : undefined);
        let hg = result.homeGoals, ag = result.awayGoals;
        if (hg === ag) { if (Math.random() < 0.5) hg++; else ag++; }
        const winner = hg > ag ? tie.teamA : tie.teamB;
        const newTie = { ...tie, leg1: { goalsA: hg, goalsB: ag }, winner };
        if (isUserMatch) capturedUserTie = newTie;
        return newTie;
      }

      if (leg === 1 && tie.leg1 !== null) return tie;
      if (leg === 2 && tie.leg2 !== null) return tie;
      const homeTeamName = leg === 1 ? tie.teamA : tie.teamB;
      const awayTeamName = leg === 1 ? tie.teamB : tie.teamA;
      const isUserHome = homeTeamName === userTeamName;
      const isUserAway = awayTeamName === userTeamName;
      const isUserMatch = isUserHome || isUserAway;
      const homeTeam = clState.teams.find(t => t.name === homeTeamName);
      const awayTeam = clState.teams.find(t => t.name === awayTeamName);
      const hs = isUserHome ? userStrength : (homeTeam?.strength ?? 70);
      const as_ = isUserAway ? userStrength : (awayTeam?.strength ?? 70);
      const hPN2 = isUserHome ? userRoster?.map(o => o.player.name) : clState.teamRosters?.[homeTeamName];
      const aPN2 = isUserAway ? userRoster?.map(o => o.player.name) : clState.teamRosters?.[awayTeamName];
      const result = simulateCLMatch(hs, as_, homeTeamName, awayTeamName, hPN2, aPN2);
      if (isUserMatch) capturedUserEvents = result.events;
      playerStats = updatePlayerStats(playerStats, result.scorers, result.assisters,
        homeTeamName, awayTeamName, result.homeGoals, result.awayGoals, userTeamName,
        isUserMatch ? userRoster : undefined);
      let newTie: CLTie;
      if (leg === 1) {
        newTie = { ...tie, leg1: { goalsA: result.homeGoals, goalsB: result.awayGoals } };
      } else {
        newTie = { ...tie, leg2: { goalsA: result.awayGoals, goalsB: result.homeGoals } };
      }
      if (leg === 2) newTie.winner = determineTieWinner(newTie);
      if (isUserMatch) capturedUserTie = newTie;
      return newTie;
    });
  }

  let newClState = { ...clState, playerStats };

  if (round === "r16") {
    const updatedTies = playTies(clState.r16Ties);
    newClState.r16Ties = updatedTies;
    if (leg === 1) newClState.phase = "r16_leg2";
    else {
      const leftWinners = updatedTies.filter(t => t.side === "left").map(t => t.winner).filter((w): w is string => w !== null);
      const rightWinners = updatedTies.filter(t => t.side === "right").map(t => t.winner).filter((w): w is string => w !== null);
      const qfTies: CLTie[] = [];
      for (let i = 0; i < 2; i++) {
        if (leftWinners[i*2] && leftWinners[i*2+1]) {
          const a = leftWinners[i*2], b = leftWinners[i*2+1];
          qfTies.push({ id: clRandomId(), teamA: a, teamB: b,
            teamALeagueId: clState.standings.find(s => s.teamName===a)?.leagueId ?? "unknown",
            teamBLeagueId: clState.standings.find(s => s.teamName===b)?.leagueId ?? "unknown",
            leg1: null, leg2: null, winner: null,
            userInvolved: a===userTeamName||b===userTeamName, side: "left" });
        }
      }
      for (let i = 0; i < 2; i++) {
        if (rightWinners[i*2] && rightWinners[i*2+1]) {
          const a = rightWinners[i*2], b = rightWinners[i*2+1];
          qfTies.push({ id: clRandomId(), teamA: a, teamB: b,
            teamALeagueId: clState.standings.find(s => s.teamName===a)?.leagueId ?? "unknown",
            teamBLeagueId: clState.standings.find(s => s.teamName===b)?.leagueId ?? "unknown",
            leg1: null, leg2: null, winner: null,
            userInvolved: a===userTeamName||b===userTeamName, side: "right" });
        }
      }
      newClState.qfTies = qfTies;
      newClState.phase = "qf_leg1";
    }
  } else if (round === "qf") {
    const updatedTies = playTies(clState.qfTies);
    newClState.qfTies = updatedTies;
    if (leg === 1) newClState.phase = "qf_leg2";
    else {
      const leftW = updatedTies.filter(t=>t.side==="left").map(t=>t.winner).filter((w): w is string => w!==null);
      const rightW = updatedTies.filter(t=>t.side==="right").map(t=>t.winner).filter((w): w is string => w!==null);
      const sfTies: CLTie[] = [];
      if (leftW.length >= 2) sfTies.push({ id: clRandomId(), teamA: leftW[0], teamB: leftW[1],
        teamALeagueId: clState.standings.find(s=>s.teamName===leftW[0])?.leagueId??"unknown",
        teamBLeagueId: clState.standings.find(s=>s.teamName===leftW[1])?.leagueId??"unknown",
        leg1: null, leg2: null, winner: null, userInvolved: leftW[0]===userTeamName||leftW[1]===userTeamName, side: "left" });
      if (rightW.length >= 2) sfTies.push({ id: clRandomId(), teamA: rightW[0], teamB: rightW[1],
        teamALeagueId: clState.standings.find(s=>s.teamName===rightW[0])?.leagueId??"unknown",
        teamBLeagueId: clState.standings.find(s=>s.teamName===rightW[1])?.leagueId??"unknown",
        leg1: null, leg2: null, winner: null, userInvolved: rightW[0]===userTeamName||rightW[1]===userTeamName, side: "right" });
      newClState.sfTies = sfTies;
      newClState.phase = "sf_leg1";
    }
  } else if (round === "sf") {
    const updatedTies = playTies(clState.sfTies);
    newClState.sfTies = updatedTies;
    if (leg === 1) newClState.phase = "sf_leg2";
    else {
      const finalists = updatedTies.map(t=>t.winner).filter((w): w is string => w!==null);
      if (finalists.length >= 2) {
        const a = finalists[0], b = finalists[1];
        newClState.finalTie = { id: clRandomId(), teamA: a, teamB: b,
          teamALeagueId: clState.standings.find(s=>s.teamName===a)?.leagueId??"unknown",
          teamBLeagueId: clState.standings.find(s=>s.teamName===b)?.leagueId??"unknown",
          leg1: null, leg2: null, winner: null, userInvolved: a===userTeamName||b===userTeamName };
        newClState.phase = "final";
      }
    }
  } else if (round === "final" && clState.finalTie) {
    const updatedFinal = playTies([clState.finalTie])[0];
    newClState.finalTie = updatedFinal;
    newClState.champion = updatedFinal.winner;
    newClState.phase = "finished";
  }

  return { clState: newClState, userEvents: capturedUserEvents, userTie: capturedUserTie };
}

// ============================================
// INITIALIZE CL
// ============================================

export function initializeCL(
  season: number,
  allLeagueStandings: Record<string, { teamName: string; isUser: boolean }[]>,
  userLeagueId: string,
  userTeamName: string,
  allLeagueStates?: Record<string, LeagueState>
): CLState {
  const clLeagueIds = Object.keys(CL_LEAGUE_SPOTS);
  const allTeams: CLTeam[] = [];

  for (const leagueId of clLeagueIds) {
    const standings = allLeagueStandings[leagueId] ?? [];
    if (standings.length === 0) continue;

    const qualifiers = getCLQualifiers(leagueId, standings, season);
    allTeams.push(...qualifiers);
  }

  // Ensure we have at least some teams; pad to 36 if needed
  while (allTeams.length < 36) {
    allTeams.push({
      name: `Club ${allTeams.length + 1}`,
      leagueId: "unknown",
      strength: 70,
      isUser: false,
    });
  }

  // Trim to exactly 36
  const teams = allTeams.slice(0, 36);

  const groupFixtures = drawGroupFixtures(teams);
  const standings = updateStandings(teams, groupFixtures);

  // Build team rosters from all league states so AI teams get real player names
  const teamRosters: Record<string, string[]> = {};
  if (allLeagueStates) {
    for (const leagueState of Object.values(allLeagueStates)) {
      for (const team of leagueState.teams) {
        if (!team.isUser && team.players && team.players.length > 0) {
          teamRosters[team.name] = team.players.map(p => p.name);
        }
      }
    }
  }

  return {
    season,
    phase: "group",
    teams,
    standings,
    groupFixtures,
    currentGroupRound: 0,
    playoffTies: [],
    r16Ties: [],
    qfTies: [],
    sfTies: [],
    finalTie: null,
    playerStats: {},
    champion: null,
    teamRosters,
  };
}

// ============================================
// GET CL TOP SCORERS / ASSISTS / CLEAN SHEETS
// ============================================

// Generic fallback names produced when a team has no roster — exclude from display
const GENERIC_PLAYER_NAMES = new Set([
  "Striker", "Forward", "Winger", "Midfielder", "Playmaker",
]);

function isRealPlayer(name: string): boolean {
  return !GENERIC_PLAYER_NAMES.has(name);
}

export function getCLTopScorers(clState: CLState, limit: number = 10): CLPlayerStat[] {
  return Object.values(clState.playerStats)
    .filter(p => p.goals > 0 && isRealPlayer(p.playerName))
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
}

export function getCLTopAssists(clState: CLState, limit: number = 10): CLPlayerStat[] {
  return Object.values(clState.playerStats)
    .filter(p => p.assists > 0 && isRealPlayer(p.playerName))
    .sort((a, b) => b.assists - a.assists)
    .slice(0, limit);
}

export function getCLTopCleanSheets(clState: CLState, limit: number = 10): CLPlayerStat[] {
  return Object.values(clState.playerStats)
    .filter(p => p.cleanSheets > 0 && isRealPlayer(p.playerName))
    .sort((a, b) => b.cleanSheets - a.cleanSheets)
    .slice(0, limit);
}

// ============================================
// REBUILD TEAM ROSTERS (for existing CLState that was created before teamRosters existed)
// ============================================

export function rebuildCLTeamRosters(
  clState: CLState,
  allLeagueStates: Record<string, LeagueState>
): CLState {
  const teamRosters: Record<string, string[]> = { ...clState.teamRosters };
  for (const leagueState of Object.values(allLeagueStates)) {
    for (const team of leagueState.teams) {
      if (!team.isUser && team.players && team.players.length > 0) {
        // Only set if not already present (preserve any existing roster)
        if (!teamRosters[team.name] || teamRosters[team.name].length === 0) {
          teamRosters[team.name] = team.players.map(p => p.name);
        }
      }
    }
  }
  return { ...clState, teamRosters };
}

// ============================================
// CL ROUND SCHEDULE
// Returns which CL round fires after a given domestic round
// CL Round N fires after domestic round (N*2)+1
// ============================================

export function getCLRoundForDomesticRound(domesticRound: number): number | null {
  // CL rounds 1-8 fire after domestic rounds 3, 5, 7, 9, 11, 13, 15, 17
  if (domesticRound < 3 || domesticRound > 17) return null;
  if (domesticRound % 2 === 0) return null; // only odd rounds trigger CL
  return (domesticRound - 1) / 2;
}
