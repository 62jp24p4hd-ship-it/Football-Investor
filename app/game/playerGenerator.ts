import type {
  Player,
  Position,
  Slot,
} from "./types";

import {
  getPlayersBySeasonAndPosition,
} from "./playerDatabase";

import {
  pickRandom,
  shuffle,
  slotToPosition,
} from "./helpers";

export function getAvailablePlayersForSlot(
  season: number,
  slot: Slot
): Player[] {
  const position =
    slotToPosition(slot);

  return shuffle(
    getPlayersBySeasonAndPosition(
      season,
      position
    )
  ).slice(0, 5);
}

export function getRandomPlayerForSlot(
  season: number,
  slot: Slot
): Player | null {
  const players =
    getAvailablePlayersForSlot(
      season,
      slot
    );

  if (players.length === 0) {
    return null;
  }

  return pickRandom(players);
}

export function getSeasonPositionPool(
  season: number,
  position: Position
): Player[] {
  return shuffle(
    getPlayersBySeasonAndPosition(
      season,
      position
    )
  );
}

export function generateSelectionPool(
  season: number,
  slot: Slot
): Player[] {
  return getAvailablePlayersForSlot(
    season,
    slot
  );
}