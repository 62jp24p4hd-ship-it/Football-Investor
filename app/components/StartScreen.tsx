"use client";

import type {
  BudgetMode,
  EventType,
  GameLengthMode,
  GameMode,
} from "../game/types";

import {
  BUDGET_SETTINGS,
} from "../game/constants";

type StartScreenProps = {
  mode: GameMode | null;
  setMode: (mode: GameMode) => void;

  gameLengthMode: GameLengthMode | null;
  setGameLengthMode: (mode: GameLengthMode) => void;

  budgetMode: BudgetMode;
  setBudgetMode: (mode: BudgetMode) => void;

  eventsEnabled: boolean;
  setEventsEnabled: (value: boolean) => void;

  eventType: EventType;
  setEventType: (value: EventType) => void;

  selectedTime: number;
  setSelectedTime: (value: number) => void;

  teamOneName: string;
  setTeamOneName: (value: string) => void;

  teamTwoName: string;
  setTeamTwoName: (value: string) => void;

  onStart: (starterIndex: number) => void;
  onOpenHowToPlay: () => void;
};

function buttonClass(active: boolean) {
  return `
    p-4
    rounded-xl
    transition-all
    duration-150
    active:scale-95
    ${
      active
        ? "bg-green-700 border-green-300"
        : "bg-zinc-800 border-zinc-700"
    }
    border
  `;
}

export default function StartScreen(
  props: StartScreenProps
) {
  const {
    mode,
    setMode,
    gameLengthMode,
    setGameLengthMode,
    budgetMode,
    setBudgetMode,
    eventsEnabled,
    setEventsEnabled,
    eventType,
    setEventType,
    selectedTime,
    setSelectedTime,
    teamOneName,
    setTeamOneName,
    teamTwoName,
    setTeamTwoName,
    onStart,
    onOpenHowToPlay,
  } = props;

  function canStart() {
    return Boolean(
      mode &&
        gameLengthMode &&
        budgetMode
    );
  }

  function startRandom() {
    const starter =
      Math.random() > 0.5
        ? 0
        : 1;

    onStart(starter);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6">

        <h1 className="text-5xl font-bold text-center mb-3">
          Football Investor v1.8
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Enhanced Edition
        </p>

        <button
          onClick={onOpenHowToPlay}
          className="
            w-full
            mb-6
            p-3
            rounded-xl
            bg-blue-700
            transition-all
            duration-150
            active:scale-95
          "
        >
          📖 How To Play
        </button>

        <div className="space-y-6">

          <section>
            <h2 className="text-xl font-bold mb-3">
              Game Mode
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setMode("single")
                }
                className={buttonClass(
                  mode === "single"
                )}
              >
                Single Player
              </button>

              <button
                onClick={() =>
                  setMode("versus")
                }
                className={buttonClass(
                  mode === "versus"
                )}
              >
                Play vs Friend
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              Season Mode
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setGameLengthMode(
                    "classic"
                  )
                }
                className={buttonClass(
                  gameLengthMode ===
                    "classic"
                )}
              >
                Classic 2008-2028
              </button>

              <button
                onClick={() =>
                  setGameLengthMode(
                    "infinite"
                  )
                }
                className={buttonClass(
                  gameLengthMode ===
                    "infinite"
                )}
              >
                Infinite Mode
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              Starting Budget
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {(
                Object.keys(
                  BUDGET_SETTINGS
                ) as BudgetMode[]
              ).map((key) => (
                <button
                  key={key}
                  onClick={() =>
                    setBudgetMode(key)
                  }
                  className={buttonClass(
                    budgetMode === key
                  )}
                >
                  {BUDGET_SETTINGS[key].label}
                  <br />
                  <span className="text-sm text-gray-300">
                    €{BUDGET_SETTINGS[key].amount}M
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              Timer
            </h2>

            <div className="grid grid-cols-4 gap-3">
              {[10, 15, 30, 60].map(
                (time) => (
                  <button
                    key={time}
                    onClick={() =>
                      setSelectedTime(time)
                    }
                    className={buttonClass(
                      selectedTime === time
                    )}
                  >
                    {time}s
                  </button>
                )
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              Events
            </h2>

            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() =>
                  setEventsEnabled(
                    !eventsEnabled
                  )
                }
                className={`
                  w-20
                  h-10
                  rounded-full
                  relative
                  transition-all
                  ${
                    eventsEnabled
                      ? "bg-green-600"
                      : "bg-zinc-700"
                  }
                `}
              >
                <span
                  className={`
                    absolute
                    top-1
                    w-8
                    h-8
                    bg-white
                    rounded-full
                    transition-all
                    ${
                      eventsEnabled
                        ? "left-11"
                        : "left-1"
                    }
                  `}
                />
              </button>

              <span>
                {eventsEnabled
                  ? "ON"
                  : "OFF"}
              </span>
            </div>

            {eventsEnabled && (
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() =>
                    setEventType("all")
                  }
                  className={buttonClass(
                    eventType === "all"
                  )}
                >
                  All
                </button>

                <button
                  onClick={() =>
                    setEventType("positive")
                  }
                  className={buttonClass(
                    eventType === "positive"
                  )}
                >
                  Positive
                </button>

                <button
                  onClick={() =>
                    setEventType("negative")
                  }
                  className={buttonClass(
                    eventType === "negative"
                  )}
                >
                  Negative
                </button>
              </div>
            )}
          </section>

          {mode === "versus" && (
            <section>
              <h2 className="text-xl font-bold mb-3">
                Team Names
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={teamOneName}
                  onChange={(event) =>
                    setTeamOneName(
                      event.target.value
                    )
                  }
                  placeholder="Team 1"
                  className="bg-black border border-zinc-700 rounded-xl p-3"
                />

                <input
                  value={teamTwoName}
                  onChange={(event) =>
                    setTeamTwoName(
                      event.target.value
                    )
                  }
                  placeholder="Team 2"
                  className="bg-black border border-zinc-700 rounded-xl p-3"
                />
              </div>
            </section>
          )}

          {mode === "versus" ? (
            <section>
              <h2 className="text-xl font-bold mb-3">
                Who Starts 2008?
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <button
                  disabled={!canStart()}
                  onClick={() => onStart(0)}
                  className="p-4 rounded-xl bg-cyan-700 disabled:bg-zinc-700 transition-all active:scale-95"
                >
                  Team 1
                </button>

                <button
                  disabled={!canStart()}
                  onClick={() => onStart(1)}
                  className="p-4 rounded-xl bg-pink-700 disabled:bg-zinc-700 transition-all active:scale-95"
                >
                  Team 2
                </button>

                <button
                  disabled={!canStart()}
                  onClick={startRandom}
                  className="p-4 rounded-xl bg-yellow-700 disabled:bg-zinc-700 transition-all active:scale-95"
                >
                  Random
                </button>
              </div>
            </section>
          ) : (
            <button
              disabled={!canStart()}
              onClick={() => onStart(0)}
              className="
                w-full
                p-4
                rounded-xl
                bg-green-700
                disabled:bg-zinc-700
                text-xl
                font-bold
                transition-all
                active:scale-95
              "
            >
              Start Game
            </button>
          )}

        </div>
      </div>
    </main>
  );
}