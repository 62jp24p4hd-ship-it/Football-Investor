"use client";

import type {
  GamePlayer,
  OwnedPlayer,
  Slot,
} from "../game/types";

import {
  FORMATION_433,
} from "../game/constants";

type FormationProps = {
  player: GamePlayer;
  playerIndex: number;
  active: boolean;
  season: number;
  getCurrentValue: (owned: OwnedPlayer) => number;
  getAge: (owned: OwnedPlayer) => number;
  onSelectSlot: (
    playerIndex: number,
    slot: Slot
  ) => void;
  onSelectOwned: (
    playerIndex: number,
    ownedIndex: number
  ) => void;
};

function getCardColor(
  owned: OwnedPlayer | undefined
) {
  if (!owned) {
    return "border-zinc-700 bg-black/40 hover:bg-purple-950/40";
  }

  if (owned.player.secret) {
    return "border-yellow-400 bg-yellow-950/40";
  }

  if (owned.player.hiddenType === "talent") {
    return "border-green-500 bg-green-950/40";
  }

  if (owned.player.hiddenType === "flop") {
    return "border-red-500 bg-red-950/40";
  }

  return "border-blue-500 bg-blue-950/40";
}

function getTypeLabel(
  owned: OwnedPlayer
) {
  if (owned.player.secret) {
    return "⭐ Secret";
  }

  if (owned.player.hiddenType === "talent") {
    return "🟢 Talent";
  }

  if (owned.player.hiddenType === "flop") {
    return "🔴 Flop";
  }

  return "🔵 Normal";
}

function formatMoney(
  value: number
) {
  return `€${Math.round(value)}M`;
}

export default function Formation(
  props: FormationProps
) {
  const {
    player,
    playerIndex,
    active,
    getCurrentValue,
    getAge,
    onSelectSlot,
    onSelectOwned,
  } = props;

  function getOwnedBySlot(
    slot: Slot
  ) {
    return player.owned.find(
      (owned) => owned.slot === slot
    );
  }

  function getOwnedIndexBySlot(
    slot: Slot
  ) {
    return player.owned.findIndex(
      (owned) => owned.slot === slot
    );
  }

  return (
    <div
      className={`
        border
        rounded-2xl
        p-4
        bg-green-950/40
        ${
          active
            ? "border-yellow-400"
            : "border-green-900"
        }
      `}
    >
      <h2 className="text-2xl font-bold text-center mb-4">
        {player.teamName}
      </h2>

      <div className="space-y-3">
        {FORMATION_433.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-3"
          >
            {row.map((slot) => {
              const owned =
                getOwnedBySlot(slot);

              const ownedIndex =
                getOwnedIndexBySlot(slot);

              return (
                <button
                  key={slot}
                  disabled={!active}
                  onClick={() => {
                    if (!active) {
                      return;
                    }

                    if (
                      owned &&
                      ownedIndex >= 0
                    ) {
                      onSelectOwned(
                        playerIndex,
                        ownedIndex
                      );
                      return;
                    }

                    onSelectSlot(
                      playerIndex,
                      slot
                    );
                  }}
                  className={`
                    w-28
                    min-h-28
                    border
                    rounded-xl
                    p-2
                    text-center
                    transition-all
                    duration-150
                    active:scale-95
                    ${
                      !active
                        ? "opacity-60"
                        : ""
                    }
                    ${getCardColor(owned)}
                  `}
                >
                  <div className="font-bold text-sm">
                    {slot}
                  </div>

                  {owned ? (
                    <>
                      <div className="text-xs font-bold mt-1">
                        {owned.player.name}
                      </div>

                      <div className="text-[11px] mt-1">
                        {getTypeLabel(owned)}
                      </div>

                      <div className="text-[11px] text-gray-300">
                        Age {getAge(owned)}
                      </div>

                      <div className="text-[11px] text-yellow-300 font-bold">
                        {formatMoney(
                          getCurrentValue(owned)
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-300 mt-4">
                      Choose
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}