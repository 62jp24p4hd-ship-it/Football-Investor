import { players2008 } from "../data/players2008";
import { players2009 } from "../data/players2009";
import { players2010 } from "../data/players2010";
import { players2011 } from "../data/players2011";
import { players2012 } from "../data/players2012";
import { players2013 } from "../data/players2013";
import { players2014 } from "../data/players2014";
import { players2015 } from "../data/players2015";
import { players2016 } from "../data/players2016";
import { players2017 } from "../data/players2017";
import { players2018 } from "../data/players2018";
import { players2019 } from "../data/players2019";
import { players2020 } from "../data/players2020";
import { players2021 } from "../data/players2021";
import { players2022 } from "../data/players2022";
import { players2023 } from "../data/players2023";
import { players2024 } from "../data/players2024";
import { players2025 } from "../data/players2025";
import { players2026 } from "../data/players2026";
import { players2027 } from "../data/players2027";
import { players2028 } from "../data/players2028";

import type {
  Player,
  Position,
} from "./types";

import {
  buildDynamicPlayers,
} from "./careerEngine";

type RawPlayer = Omit<
  Player,
  | "hiddenType"
  | "secret"
  | "values"
  | "statsBySeason"
>;

export const rawPlayers: RawPlayer[] = [
  ...players2008,
  ...players2009,
  ...players2010,
  ...players2011,
  ...players2012,
  ...players2013,
  ...players2014,
  ...players2015,
  ...players2016,
  ...players2017,
  ...players2018,
  ...players2019,
  ...players2020,
  ...players2021,
  ...players2022,
  ...players2023,
  ...players2024,
  ...players2025,
  ...players2026,
  ...players2027,
  ...players2028,
] as RawPlayer[];

export function getAllPlayers(): Player[] {
  return buildDynamicPlayers(
    rawPlayers
  );
}

export function getPlayersBySeason(
  season: number
): Player[] {
  return getAllPlayers().filter(
    (player) =>
      player.availableSeason === season
  );
}

export function getPlayersBySeasonAndPosition(
  season: number,
  position: Position
): Player[] {
  return getAllPlayers().filter(
    (player) =>
      player.availableSeason === season &&
      player.position === position
  );
}