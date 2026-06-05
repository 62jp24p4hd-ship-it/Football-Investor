"use client";

import type {
  RewardCardType,
} from "../game/types";

import {
  getCardName,
} from "../game/rewardCardEngine";

type RewardModalProps = {
  open: boolean;
  cards: RewardCardType[];
  onChoose: (
    card: RewardCardType
  ) => void;
};

export default function RewardModal(
  props: RewardModalProps
) {
  const {
    open,
    cards,
    onChoose,
  } = props;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

      <div className="bg-zinc-950 border border-purple-500 rounded-2xl p-6 w-full max-w-xl">

        <h2 className="text-3xl font-bold text-center mb-3">
          🎁 Reward Card
        </h2>

        <p className="text-center text-gray-400 mb-6">
          Choose one reward
        </p>

        <div className="grid gap-3">

          {cards.map((card) => (
            <button
              key={card}
              onClick={() =>
                onChoose(card)
              }
              className="
                p-4
                rounded-xl
                bg-purple-700
                transition-all
                duration-150
                active:scale-95
                hover:bg-purple-600
              "
            >
              {getCardName(card)}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}