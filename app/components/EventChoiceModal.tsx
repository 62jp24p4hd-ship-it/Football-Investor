"use client";

import type {
  PlayerEventEffect,
} from "../game/types";

type EventChoiceModalProps = {
  open: boolean;
  events: PlayerEventEffect[];
  onChoose: (
    event: PlayerEventEffect
  ) => void;
};

export default function EventChoiceModal(
  props: EventChoiceModalProps
) {
  const {
    open,
    events,
    onChoose,
  } = props;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

      <div className="bg-zinc-950 border border-yellow-500 rounded-2xl p-6 w-full max-w-4xl">

        <h2 className="text-3xl font-bold text-center mb-3">
          🎲 Event Choice Card
        </h2>

        <p className="text-center text-gray-400 mb-6">
          Choose one event
        </p>

        <div className="grid md:grid-cols-2 gap-4">

          {events.map((event) => (
            <button
              key={event.title}
              onClick={() =>
                onChoose(event)
              }
              className={`
                border
                rounded-xl
                p-5
                text-left
                transition-all
                duration-150
                active:scale-95
                ${
                  event.tone === "good"
                    ? "border-green-500 bg-green-950/40"
                    : "border-red-500 bg-red-950/40"
                }
              `}
            >
              <div className="text-2xl font-bold mb-3">
                {event.title}
              </div>

              <div className="space-y-2 text-sm">

                <div>
                  Rating:
                  {" "}
                  {event.ratingChange > 0
                    ? "+"
                    : ""}
                  {event.ratingChange}
                </div>

                <div>
                  Games:
                  {" "}
                  {event.gamesChange > 0
                    ? "+"
                    : ""}
                  {event.gamesChange}
                </div>

                <div>
                  Goals:
                  {" "}
                  {event.goalsChange > 0
                    ? "+"
                    : ""}
                  {event.goalsChange}
                </div>

                <div>
                  Assists:
                  {" "}
                  {event.assistsChange > 0
                    ? "+"
                    : ""}
                  {event.assistsChange}
                </div>

                <div>
                  Clean Sheets:
                  {" "}
                  {event.cleanSheetsChange > 0
                    ? "+"
                    : ""}
                  {event.cleanSheetsChange}
                </div>

                <div className="font-bold text-yellow-300">
                  Value x{event.multiplier}
                </div>

              </div>

            </button>
          ))}

        </div>

      </div>

    </div>
  );
}