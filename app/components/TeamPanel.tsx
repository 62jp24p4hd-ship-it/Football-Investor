"use client";

import type {
  GamePlayer,
} from "../game/types";

import {
  getNetSeasonForecast,
  getTotalSalaries,
  getTotalSponsorshipIncome,
} from "../game/economyEngine";

type TeamPanelProps = {
  player: GamePlayer;
  active: boolean;
};

function formatMoney(
  value: number
) {
  return `€${Math.round(value)}M`;
}

export default function TeamPanel(
  props: TeamPanelProps
) {
  const {
    player,
    active,
  } = props;

  const salaries =
    getTotalSalaries(player);

  const sponsorshipIncome =
    getTotalSponsorshipIncome(
      player
    );

  const forecast =
    getNetSeasonForecast(
      player
    );

  return (
    <div
      className={`
        border
        rounded-2xl
        p-4
        ${
          active
            ? "border-yellow-400 bg-yellow-950/20"
            : "border-zinc-800 bg-zinc-950"
        }
      `}
    >
      <div className="flex justify-between items-center mb-4">

        <div>
          <h2 className="text-2xl font-bold">
            {player.teamName}
          </h2>

          <p className="text-gray-400">
            {player.name}
          </p>
        </div>

        {active && (
          <div className="text-yellow-400 font-bold">
            ACTIVE TURN
          </div>
        )}

      </div>

      <div className="grid grid-cols-2 gap-3">

        <div className="bg-black/40 rounded-xl p-3">
          <div className="text-sm text-gray-400">
            Budget
          </div>

          <div className="text-xl font-bold text-green-400">
            {formatMoney(
              player.budget
            )}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-3">
          <div className="text-sm text-gray-400">
            Owned Players
          </div>

          <div className="text-xl font-bold">
            {player.owned.length}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-3">
          <div className="text-sm text-gray-400">
            Buy Chances
          </div>

          <div className="text-xl font-bold text-cyan-400">
            {player.purchaseChances}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-3">
          <div className="text-sm text-gray-400">
            Sell Chances
          </div>

          <div className="text-xl font-bold text-pink-400">
            {player.sellChances}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-3">
          <div className="text-sm text-gray-400">
            Salaries
          </div>

          <div className="text-xl font-bold text-red-400">
            {formatMoney(
              salaries
            )}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-3">
          <div className="text-sm text-gray-400">
            Sponsorships
          </div>

          <div className="text-xl font-bold text-green-400">
            {formatMoney(
              sponsorshipIncome
            )}
          </div>
        </div>

      </div>

      <div className="mt-4 rounded-xl p-3 bg-black/40">

        <div className="text-sm text-gray-400">
          Next Season Forecast
        </div>

        <div
          className={`text-xl font-bold ${
            forecast >= 0
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {forecast >= 0 ? "+" : ""}
          {formatMoney(forecast)}
        </div>

      </div>

    </div>
  );
}