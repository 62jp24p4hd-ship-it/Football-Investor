import type {
  NewsItem,
  NewsTone,
  Position,
  Slot,
} from "./types";

import {
  JOURNALISTS,
  NEWSPAPERS,
} from "./constants";

export function randomBetween(
  min: number,
  max: number
) {
  return (
    Math.floor(
      Math.random() * (max - min + 1)
    ) + min
  );
}

export function pickRandom<T>(
  list: T[]
): T {
  return list[
    Math.floor(
      Math.random() * list.length
    )
  ];
}

export function shuffle<T>(
  list: T[]
): T[] {
  return [...list].sort(
    () => Math.random() - 0.5
  );
}

export function clampNumber(
  value: number,
  min: number,
  max: number
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

export function randomId() {
  return (
    Date.now() +
    Math.floor(
      Math.random() * 100000
    )
  );
}

export function formatMoney(
  value: number
) {
  return `€${Math.round(value)}M`;
}

export function slotToPosition(
  slot: Slot | string
): Position {
  if (
    slot === "LCM" ||
    slot === "RCM"
  ) {
    return "CM";
  }

  if (
    slot === "LCB" ||
    slot === "RCB"
  ) {
    return "CB";
  }

  return slot as Position;
}

export function getSlotsForPosition(
  position: Position
): Slot[] {
  if (position === "CB") {
    return ["LCB", "RCB"];
  }

  if (position === "CM") {
    return ["LCM", "RCM"];
  }

  return [position as Slot];
}

export function getRandomNewsSource(): {
  sourceName: string;
  sourceType: "journalist" | "newspaper";
} {
  const useJournalist =
    Math.random() > 0.5;

  if (useJournalist) {
    return {
      sourceName:
        pickRandom(JOURNALISTS),
      sourceType: "journalist",
    };
  }

  return {
    sourceName:
      pickRandom(NEWSPAPERS),
    sourceType: "newspaper",
  };
}

export function createNewsItem(
  season: number,
  title: string,
  description: string,
  tone: NewsTone
): NewsItem {
  return {
    id: randomId(),
    season,
    title,
    description,
    tone,
    ...getRandomNewsSource(),
  };
}

export function getSeasonStarter(
  firstSeasonStarter: number,
  season: number,
  startSeason: number
) {
  const offset =
    season - startSeason;

  if (offset % 2 === 0) {
    return firstSeasonStarter;
  }

  return firstSeasonStarter === 0
    ? 1
    : 0;
}

export function getOtherPlayerIndex(
  playerIndex: number
) {
  return playerIndex === 0
    ? 1
    : 0;
}