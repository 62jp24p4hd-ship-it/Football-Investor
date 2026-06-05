"use client";

import type {
  Player,
  Slot,
} from "../game/types";

import {
  getSeasonStats,
} from "../game/statsEngine";

type PlayerSelectionModalProps = {
  open: boolean;
  slot: Slot | null;
  season: number;
  budget: number;
  timer: number;
  players: Player[];
  selectedPlayer: Player | null;
  getPlayerValue: (player: Player) => number;
  getPlayerAge: (player: Player) => number;
  onPreviewPlayer: (player: Player) => void;
  onBackToList: () => void;
  onBuyPlayer: () => void;
  onClose: () => void;
};

function formatMoney(value: number) {
  return `€${Math.round(value)}M`;
}

function selectionCardClass() {
  return `
    border
    border-purple-500
    bg-purple-950/40
    rounded-xl
    p-4
    text-left
    transition-all
    duration-150
    active:scale-95
    hover:bg-purple-900/50
  `;
}

export default function PlayerSelectionModal(
  props: PlayerSelectionModalProps
) {
  const {
    open,
    slot,
    season,
    budget,
    timer,
    players,
    selectedPlayer,
    getPlayerValue,
    getPlayerAge,
    onPreviewPlayer,
    onBackToList,
    onBuyPlayer,
    onClose,
  } = props;

  if (!open || !slot) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-purple-500 rounded-2xl p-5 max-w-6xl w-full max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-start gap-4 mb-5">

          <div>
            <h2 className="text-3xl font-bold">
              Choose {slot}
            </h2>

            <p className="text-gray-400">
              Budget: {formatMoney(budget)}
              {" | "}
              Timer: {timer}s
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-700 transition-all active:scale-95"
          >
            Close
          </button>

        </div>

        {!selectedPlayer ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {players.map((player, index) => {
              const stats =
                getSeasonStats(
                  player,
                  season
                );

              return (
                <button
                  key={player.name}
                  onClick={() =>
                    onPreviewPlayer(player)
                  }
                  className={selectionCardClass()}
                  style={{
                    animation:
                      "fadeInUp 0.25s ease-out both",
                    animationDelay:
                      `${index * 0.05}s`,
                  }}
                >
                  <div className="text-xl font-bold mb-2">
                    {player.name}
                  </div>

                  <div className="text-sm text-gray-300">
                    {player.position}
                  </div>

                  <div className="text-sm">
                    Age: {getPlayerAge(player)}
                  </div>

                  <div className="text-sm">
                    Rating: {stats.rating}/99
                  </div>

                  <div className="text-yellow-300 font-bold mt-2">
                    {formatMoney(
                      getPlayerValue(player)
                    )}
                  </div>
                </button>
              );
            })}

          </div>
        ) : (
          <div className="max-w-2xl mx-auto border border-purple-500 bg-purple-950/30 rounded-2xl p-6">

            {(() => {
              const stats =
                getSeasonStats(
                  selectedPlayer,
                  season
                );

              return (
                <>
                  <h3 className="text-4xl font-bold mb-4 text-center">
                    {selectedPlayer.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-6">

                    <div>
                      Position: {selectedPlayer.position}
                    </div>

                    <div>
                      Age: {getPlayerAge(selectedPlayer)}
                    </div>

                    <div>
                      Nationality: {selectedPlayer.nationality}
                    </div>

                    <div>
                      Height: {selectedPlayer.height} cm
                    </div>

                    <div>
                      League: {selectedPlayer.league}
                    </div>

                    <div>
                      Value: {formatMoney(getPlayerValue(selectedPlayer))}
                    </div>

                    <div>
                      Games: {stats.games}
                    </div>

                    <div>
                      Rating: {stats.rating}/99
                    </div>

                    <div>
                      Goals: {stats.goals}
                    </div>

                    <div>
                      Assists: {stats.assists}
                    </div>

                  </div>

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={onBuyPlayer}
                      className="px-6 py-3 rounded-xl bg-green-700 transition-all active:scale-95"
                    >
                      Buy Player
                    </button>

                    <button
                      onClick={onBackToList}
                      className="px-6 py-3 rounded-xl bg-gray-700 transition-all active:scale-95"
                    >
                      Change Player
                    </button>

                  </div>
                </>
              );
            })()}

          </div>
        )}

      </div>
    </div>
  );
}