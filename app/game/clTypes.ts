// ============================================
// CHAMPIONS LEAGUE - TYPES
// ============================================

export type CLTeam = {
  name: string;
  leagueId: string;
  strength: number;
  isUser: boolean;
};

export type CLStanding = {
  teamName: string;
  leagueId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  isUser: boolean;
};

export type CLFixture = {
  round: number;         // 1-8
  homeTeam: string;
  awayTeam: string;
  homeLeagueId: string;
  awayLeagueId: string;
  homeGoals?: number;
  awayGoals?: number;
  played: boolean;
};

export type CLTie = {
  id: string;
  teamA: string;         // plays leg1 at home
  teamB: string;         // plays leg2 at home
  teamALeagueId: string;
  teamBLeagueId: string;
  leg1: { goalsA: number; goalsB: number } | null;
  leg2: { goalsA: number; goalsB: number } | null;
  winner: string | null;
  userInvolved: boolean;
  side?: "left" | "right";  // bracket side
};

export type CLPlayerStat = {
  playerName: string;
  teamName: string;
  goals: number;
  assists: number;
  cleanSheets: number;
  games: number;
};

export type CLPhase =
  | "group"
  | "playoff_leg1" | "playoff_leg2"
  | "r16_leg1"     | "r16_leg2"
  | "qf_leg1"      | "qf_leg2"
  | "sf_leg1"      | "sf_leg2"
  | "final"
  | "finished";

export type CLState = {
  season: number;
  phase: CLPhase;
  teams: CLTeam[];
  standings: CLStanding[];
  groupFixtures: CLFixture[];
  currentGroupRound: number;   // 0 = not started, 1-8 = rounds played
  playoffTies: CLTie[];        // 8 ties
  r16Ties: CLTie[];            // 8 ties
  qfTies: CLTie[];             // 4 ties
  sfTies: CLTie[];             // 2 ties
  finalTie: CLTie | null;
  playerStats: Record<string, CLPlayerStat>;
  champion: string | null;
};
