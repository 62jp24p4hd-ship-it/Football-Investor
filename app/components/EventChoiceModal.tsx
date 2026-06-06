"use client";

import type { SeasonEvent } from "../game/types";

type Props = {
  option1: SeasonEvent;
  option2: SeasonEvent;
  onChoose: (event: SeasonEvent) => void;
};

export default function EventChoiceModal({ option1, option2, onChoose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-purple-500/40 rounded-3xl w-full max-w-lg overflow-hidden">
        <div className="p-6">

          <div className="text-center mb-6">
            <div className="text-4xl mb-2">⚡</div>
            <h2 className="text-2xl font-black text-white">Choose Your Boost</h2>
            <p className="text-gray-400 text-sm mt-1">
              You sold a player for over €100M! Choose one special event.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[option1, option2].map((event, i) => (
              <button
                key={i}
                onClick={() => onChoose(event)}
                className="bg-white/5 border border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-5 text-left transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">
                    {i === 0 ? "🌟" : "⚡"}
                  </div>
                  <div>
                    <div className="font-black text-white text-lg group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{event.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}