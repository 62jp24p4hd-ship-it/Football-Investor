// ============================================
// FOOTBALL INVESTOR — SAVE SYSTEM
// localStorage-based save/load
// ============================================

import type { GamePlayer, GameMode, SeasonEvent, NewsItem, Position } from "./types";
import type {
  LeagueState,
  LeagueTeam,
  Fixture,
  StandingRow,
  LeaguePlayerStat,
} from "./leagueEngine";

const SAVE_KEY = "fi_save_v3";

// ── Slim formats (used in storage only) ─────────────────────────────────────

/** Minimal player info needed for match simulation (goal scorer names). */
type SlimPlayer = { name: string; position: Position };

/** Leage team with stripped-down players and no played fixtures. */
type PackedLeagueState = {
  teams: (Omit<LeagueTeam, "players"> & { players: SlimPlayer[] })[];
  fixtures: Fixture[];       // unplayed only
  currentRound: number;
  standings: StandingRow[];
  seasonPhase: "transfer" | "playing" | "finished";
  champion: string | null;
  playerStats: Record<string, LeaguePlayerStat>;
  totalRounds: number;
};

/** Background leagues: standings + phase only — no teams/fixtures. */
type PackedOtherLeague = {
  standings: StandingRow[];
  currentRound: number;
  seasonPhase: "transfer" | "playing" | "finished";
  champion: string | null;
  totalRounds: number;
  // Keep teams (slim) and upcoming fixtures so simulation can continue
  teams: (Omit<LeagueTeam, "players"> & { players: SlimPlayer[] })[];
  fixtures: Fixture[];
};

// ── Pack / unpack helpers ────────────────────────────────────────────────────

function packLeague(state: LeagueState): PackedLeagueState {
  return {
    currentRound: state.currentRound,
    seasonPhase: state.seasonPhase,
    champion: state.champion,
    totalRounds: state.totalRounds,
    standings: state.standings,
    playerStats: state.playerStats,
    teams: state.teams.map(t => ({
      id: t.id,
      name: t.name,
      isUser: t.isUser,
      strength: t.strength,
      players: t.players.map(p => ({ name: p.name, position: p.position })),
    })),
    // Only keep upcoming (unplayed) fixtures — played ones are captured in standings
    fixtures: state.fixtures.filter(f => !f.played),
  };
}

function unpackLeague(packed: PackedLeagueState): LeagueState {
  return {
    currentRound: packed.currentRound,
    seasonPhase: packed.seasonPhase,
    champion: packed.champion,
    totalRounds: packed.totalRounds,
    standings: packed.standings,
    playerStats: packed.playerStats ?? {},
    teams: packed.teams.map(t => ({
      ...t,
      // Slim players satisfy the Player type (all other fields optional)
      players: t.players as LeagueTeam["players"],
    })),
    fixtures: packed.fixtures,
  };
}

function packOtherLeague(state: LeagueState): PackedOtherLeague {
  return {
    currentRound: state.currentRound,
    seasonPhase: state.seasonPhase,
    champion: state.champion,
    totalRounds: state.totalRounds,
    standings: state.standings,
    teams: state.teams.map(t => ({
      id: t.id,
      name: t.name,
      isUser: t.isUser,
      strength: t.strength,
      players: t.players.map(p => ({ name: p.name, position: p.position })),
    })),
    fixtures: state.fixtures.filter(f => !f.played),
  };
}

function unpackOtherLeague(packed: PackedOtherLeague): LeagueState {
  return {
    currentRound: packed.currentRound,
    seasonPhase: packed.seasonPhase,
    champion: packed.champion,
    totalRounds: packed.totalRounds,
    standings: packed.standings,
    playerStats: {},
    teams: packed.teams.map(t => ({
      ...t,
      players: t.players as LeagueTeam["players"],
    })),
    fixtures: packed.fixtures,
  };
}

// ── SaveData ─────────────────────────────────────────────────────────────────

export type SaveData = {
  version: number;
  savedAt: string;
  season: number;
  turnIndex: number;
  mode: GameMode;
  // Club Owner fields (optional for backward compatibility)
  singlePlayerStyle?: "investor" | "clubOwner";
  selectedLeagueId?: string;
  leagueState?: PackedLeagueState | null;
  leagueEnabled?: boolean;
  otherLeagues?: Record<string, PackedOtherLeague>;
  pendingPromoted?: string[];
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

// ── Public API ───────────────────────────────────────────────────────────────

export function saveGame(
  data: Omit<SaveData, "leagueState" | "otherLeagues"> & {
    leagueState?: LeagueState | null;
    otherLeagues?: Record<string, LeagueState>;
  }
): void {
  try {
    const packed: SaveData = {
      ...(data as SaveData),
      leagueState: data.leagueState ? packLeague(data.leagueState) : data.leagueState,
      otherLeagues: data.otherLeagues
        ? Object.fromEntries(
            Object.entries(data.otherLeagues).map(([k, v]) => [k, packOtherLeague(v)])
          )
        : undefined,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(packed));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

export function loadGame(): (Omit<SaveData, "leagueState" | "otherLeagues"> & {
  leagueState?: LeagueState | null;
  otherLeagues?: Record<string, LeagueState>;
}) | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY) ?? localStorage.getItem("fi_save_v2") ?? localStorage.getItem("fi_save_v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    return {
      ...parsed,
      leagueState: parsed.leagueState ? unpackLeague(parsed.leagueState) : parsed.leagueState,
      otherLeagues: parsed.otherLeagues
        ? Object.fromEntries(
            Object.entries(parsed.otherLeagues).map(([k, v]) => [k, unpackOtherLeague(v)])
          )
        : undefined,
    };
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem("fi_save_v2");
  localStorage.removeItem("fi_save_v1");
}

export function hasSave(): boolean {
  return !!(
    localStorage.getItem(SAVE_KEY) ??
    localStorage.getItem("fi_save_v2") ??
    localStorage.getItem("fi_save_v1")
  );
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

// ── 10-Slot Save System ──────────────────────────────────────────────────────

const SLOT_KEY = (n: number) => `fi_save_slot_${n}`;
const AUTO_PTR_KEY = "fi_autosave_ptr";

export type SlotInfo = {
  slot: number;
  season: number;
  mode: string;
  savedAt: string;
  singlePlayerStyle?: "investor" | "clubOwner";
};

export function saveToSlot(
  n: number,
  data: Omit<SaveData, "leagueState" | "otherLeagues"> & {
    leagueState?: LeagueState | null;
    otherLeagues?: Record<string, LeagueState>;
  }
): void {
  try {
    const packed: SaveData = {
      ...(data as SaveData),
      leagueState: data.leagueState ? packLeague(data.leagueState) : data.leagueState,
      otherLeagues: data.otherLeagues
        ? Object.fromEntries(
            Object.entries(data.otherLeagues).map(([k, v]) => [k, packOtherLeague(v)])
          )
        : undefined,
    };
    localStorage.setItem(SLOT_KEY(n), JSON.stringify(packed));
  } catch (e) {
    console.error("Save to slot failed:", e);
    throw e;
  }
}

export function loadFromSlot(
  n: number
): (Omit<SaveData, "leagueState" | "otherLeagues"> & {
  leagueState?: LeagueState | null;
  otherLeagues?: Record<string, LeagueState>;
}) | null {
  try {
    const raw = localStorage.getItem(SLOT_KEY(n));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    return {
      ...parsed,
      leagueState: parsed.leagueState ? unpackLeague(parsed.leagueState) : parsed.leagueState,
      otherLeagues: parsed.otherLeagues
        ? Object.fromEntries(
            Object.entries(parsed.otherLeagues).map(([k, v]) => [k, unpackOtherLeague(v)])
          )
        : undefined,
    };
  } catch {
    return null;
  }
}

export function deleteSlot(n: number): void {
  localStorage.removeItem(SLOT_KEY(n));
}

/** Returns array of 10 entries (index 0 = slot 1). null = empty slot. */
export function getAllSlots(): (SlotInfo | null)[] {
  return Array.from({ length: 10 }, (_, i) => {
    const raw = localStorage.getItem(SLOT_KEY(i + 1));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as SaveData;
      return {
        slot: i + 1,
        season: parsed.season,
        mode: parsed.mode,
        savedAt: parsed.savedAt,
        singlePlayerStyle: parsed.singlePlayerStyle,
      };
    } catch {
      return null;
    }
  });
}

/**
 * Auto-save: cycles through slots 1→10, then wraps back to 1.
 * Returns {slot, nextWillWrap} — nextWillWrap=true means next call will overwrite slot 1.
 */
export function autoSave(
  data: Omit<SaveData, "leagueState" | "otherLeagues"> & {
    leagueState?: LeagueState | null;
    otherLeagues?: Record<string, LeagueState>;
  }
): { slot: number; nextWillWrap: boolean } {
  const ptrRaw = localStorage.getItem(AUTO_PTR_KEY);
  const lastSlot = ptrRaw ? parseInt(ptrRaw, 10) : 0;
  const nextSlot = (lastSlot % 10) + 1;
  saveToSlot(nextSlot, data);
  localStorage.setItem(AUTO_PTR_KEY, String(nextSlot));
  return { slot: nextSlot, nextWillWrap: nextSlot === 10 };
}
