"use client";

import type { RewardCard } from "../game/types";
import { getCardDisplayInfo } from "../game/rewardCardEngine";

type Props = {
  cards: RewardCard[];
  playerName: string;
  sellPrice: number;
  onChoose: (card: RewardCard) => void;
};

export default function RewardModal({ cards, playerName, sellPrice, onChoose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-purple-500/30 rounded-3xl w-full max-w-md overflow-hidden">

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🎴</div>
            <h2 className="text-2xl font-black text-white">Special Card Unlocked!</h2>
            <p className="text-gray-400 text-sm mt-1">
              You sold {playerName} for <span className="text-emerald-400 font-bold">€{sellPrice}M</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">Choose ONE reward card</p>
          </div>

          <div className="flex flex-col gap-3">
            {cards.map((card) => {
              const info = getCardDisplayInfo(card);
              return (
                <button
                  key={card}
                  onClick={() => onChoose(card)}
                  className={`border rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-95 ${info.color}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{info.icon}</span>
                    <div>
                      <div className="font-black text-white text-lg">{info.name}</div>
                      <div className="text-sm text-gray-300 mt-0.5">{info.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}