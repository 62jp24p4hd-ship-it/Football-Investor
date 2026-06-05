"use client";

import type {
  GamePlayer,
} from "../game/types";

type StatisticsModalProps = {
  open: boolean;
  players: GamePlayer[];
  onClose: () => void;
};

function formatMoney(
  value: number
) {
  return `€${Math.round(value)}M`;
}

export default function StatisticsModal(
  props: StatisticsModalProps
) {
  const {
    open,
    players,
    onClose,
  } = props;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

      <div className="bg-zinc-950 border border-cyan-500 rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold">
            📊 Statistics
          </h2>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-red-700 transition-all active:scale-95"
          >
            Close
          </button>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

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
                className="border border-zinc-700 rounded-xl p-4"
              >
                <h3 className="text-2xl font-bold mb-4">
                  {player.teamName}
                </h3>

                <div className="space-y-2">

                  <div>
                    Budget:
                    {" "}
                    <span className="text-green-400">
                      {formatMoney(
                        player.budget
                      )}
                    </span>
                  </div>

                  <div>
                    Owned Players:
                    {" "}
                    {player.owned.length}
                  </div>

                  <div>
                    Sold Players:
                    {" "}
                    {player.sold.length}
                  </div>

                  <div>
                    Total Profit:
                    {" "}
                    <span
                      className={
                        totalProfit >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {formatMoney(
                        totalProfit
                      )}
                    </span>
                  </div>

                </div>

                <div className="mt-4">

                  <div className="font-bold mb-2">
                    Sales History
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">

                    {player.sold.length === 0 ? (
                      <div className="text-gray-500">
                        No sales yet
                      </div>
                    ) : (
                      player.sold.map(
                        (sale, index) => (
                          <div
                            key={`${sale.name}-${index}`}
                            className="border border-zinc-800 rounded-lg p-2 text-sm"
                          >
                            <div className="font-bold">
                              {sale.name}
                            </div>

                            <div>
                              Buy:
                              {" "}
                              {formatMoney(
                                sale.buyPrice
                              )}
                            </div>

                            <div>
                              Sell:
                              {" "}
                              {formatMoney(
                                sale.sellPrice
                              )}
                            </div>

                            <div
                              className={
                                sale.profit >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              Profit:
                              {" "}
                              {formatMoney(
                                sale.profit
                              )}
                            </div>
                          </div>
                        )
                      )
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}