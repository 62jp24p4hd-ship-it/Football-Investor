"use client";

import type {
  GamePlayer,
} from "../game/types";

type EndGameModalProps = {
  open: boolean;
  players: GamePlayer[];
  winnerText: string;
  onShowStats: () => void;
  onRestart: () => void;
};

function formatMoney(
  value: number
) {
  return `€${Math.round(value)}M`;
}

export default function EndGameModal(
  props: EndGameModalProps
) {
  const {
    open,
    players,
    winnerText,
    onShowStats,
    onRestart,
  } = props;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">

      <div className="bg-zinc-950 border border-yellow-500 rounded-2xl p-6 w-full max-w-3xl text-center">

        <h2 className="text-4xl font-bold mb-4">
          🏁 Game Finished
        </h2>

        <p className="text-2xl text-yellow-300 font-bold mb-6">
          {winnerText}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">

          {players.map((player) => {
            const totalProfit =
              player.sold.reduce(
                (sum, sale) =>
                  sum + sale.profit,
                0
              );

            return (
              <div
                key={player.teamName}
                className="border border-zinc-700 bg-black/40 rounded-xl p-4"
              >
                <h3 className="text-2xl font-bold mb-2">
                  {player.teamName}
                </h3>

                <p>
                  Budget: {formatMoney(player.budget)}
                </p>

                <p>
                  Profit: {formatMoney(totalProfit)}
                </p>

                <p>
                  Sold Players: {player.sold.length}
                </p>
              </div>
            );
          })}

        </div>

        <div className="flex justify-center gap-4">

          <button
            onClick={onShowStats}
            className="px-6 py-3 rounded-xl bg-blue-700 transition-all active:scale-95"
          >
            View Statistics
          </button>

          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-xl bg-green-700 transition-all active:scale-95"
          >
            Restart Game
          </button>

        </div>

      </div>

    </div>
  );
}