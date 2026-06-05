"use client";

import type {
  AuctionState,
  GamePlayer,
} from "../game/types";

import {
  AUCTION_BID_INCREMENT,
} from "../game/constants";

import {
  getAuctionExtraValue,
} from "../game/auctionEngine";

type AuctionModalProps = {
  open: boolean;
  state: AuctionState | null;
  players: GamePlayer[];
  canBid: (
    playerIndex: number
  ) => boolean;
  onBid: (
    playerIndex: number
  ) => void;
  onSurrender: (
    playerIndex: number
  ) => void;
};

function formatMoney(
  value: number
) {
  return `€${Math.round(value)}M`;
}

export default function AuctionModal(
  props: AuctionModalProps
) {
  const {
    open,
    state,
    players,
    canBid,
    onBid,
    onSurrender,
  } = props;

  if (!open || !state) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">

      <div className="bg-zinc-950 border border-purple-500 rounded-2xl p-6 w-full max-w-5xl">

        {state.phase === "preview" && (
          <>
            <h2 className="text-3xl font-bold text-center mb-4">
              🏆 Legendary Auction
            </h2>

            <div className="text-center text-yellow-400 text-2xl font-bold mb-6">
              Preview ends in {state.timer}s
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {state.candidates.map((player) => (
                <div
                  key={player.name}
                  className="border border-purple-500 bg-purple-950/30 rounded-xl p-4 text-center"
                >
                  <div className="text-xl font-bold mb-2">
                    {player.name}
                  </div>

                  <div className="text-gray-300">
                    {player.position}
                  </div>

                  <div className="text-gray-400">
                    {player.nationality}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {state.phase === "bidding" &&
          state.selectedPlayer && (
            <>
              <h2 className="text-3xl font-bold text-center mb-4">
                🏆 Auction Bidding
              </h2>

              <div className="text-center mb-6">

                <div className="text-yellow-400 font-bold mb-2">
                  {players[state.currentTurn]?.teamName} turn
                </div>

                <div className="text-4xl font-bold">
                  {state.selectedPlayer.name}
                </div>

                <div className="text-gray-400">
                  Base Value:
                  {" "}
                  {formatMoney(state.baseValue)}
                </div>

              </div>

              <div className="flex justify-center mb-6">
                <div className="text-center">

                  <div className="text-green-400 text-2xl font-bold mb-2">
                    +{formatMoney(getAuctionExtraValue(state))}
                  </div>

                  <div className="border border-yellow-500 rounded-xl px-10 py-5 text-4xl font-bold bg-black/50">
                    {formatMoney(state.currentBid)}
                  </div>

                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                {players.map((player, index) => (
                  <div
                    key={player.teamName}
                    className={`
                      border
                      rounded-xl
                      p-4
                      ${
                        state.currentTurn === index
                          ? "border-yellow-400 bg-yellow-950/20"
                          : "border-zinc-800 bg-black/40"
                      }
                    `}
                  >
                    <div className="text-xl font-bold mb-2">
                      {player.teamName}
                    </div>

                    <div className="mb-3 text-gray-300">
                      Budget:
                      {" "}
                      {formatMoney(player.budget)}
                    </div>

                    <div className="flex gap-2">

                      <button
                        disabled={
                          state.currentTurn !== index
                        }
                        onClick={() =>
                          onSurrender(index)
                        }
                        className={`
                          flex-1
                          py-3
                          rounded-xl
                          bg-red-700
                          transition-all
                          active:scale-95
                          ${
                            state.currentTurn !== index
                              ? "opacity-40"
                              : ""
                          }
                        `}
                      >
                        Surrender
                      </button>

                      <button
                        disabled={!canBid(index)}
                        onClick={() =>
                          onBid(index)
                        }
                        className={`
                          flex-1
                          py-3
                          rounded-xl
                          bg-green-700
                          transition-all
                          active:scale-95
                          ${
                            !canBid(index)
                              ? "opacity-40"
                              : ""
                          }
                        `}
                      >
                        +{AUCTION_BID_INCREMENT}M Bid
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            </>
          )}

      </div>

    </div>
  );
}