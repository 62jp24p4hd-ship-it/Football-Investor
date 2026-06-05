"use client";

import type {
  GameLengthMode,
  GameMode,
} from "../game/types";

type TopBarProps = {
  season: number;
  mode: GameMode;
  gameLengthMode: GameLengthMode;
  currentTeamName: string;
  message: string;
  onSeasonClick: () => void;
  onRestart: () => void;
  onOpenHowToPlay: () => void;
};

export default function TopBar(
  props: TopBarProps
) {
  const {
    season,
    mode,
    gameLengthMode,
    currentTeamName,
    message,
    onSeasonClick,
    onRestart,
    onOpenHowToPlay,
  } = props;

  return (
    <div className="mb-6">

      <div className="flex items-center justify-between gap-3 mb-4">

        <div>
          <h1 className="text-3xl font-bold">
            Football Investor v1.8
          </h1>

          <p className="text-sm text-gray-400">
            {mode === "single"
              ? "Single Player"
              : "Play vs Friend"}
            {" | "}
            {gameLengthMode === "classic"
              ? "Classic 2008-2028"
              : "Infinite Mode"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenHowToPlay}
            className="px-4 py-2 rounded-xl bg-blue-700 transition-all active:scale-95"
          >
            How To Play
          </button>

          <button
            onClick={onRestart}
            className="px-4 py-2 rounded-xl bg-red-700 transition-all active:scale-95"
          >
            Restart
          </button>
        </div>

      </div>

      <div className="text-center mb-3">
        <button
          onClick={onSeasonClick}
          className="text-2xl font-bold text-yellow-300 transition-all active:scale-95"
        >
          Season {season}
        </button>
      </div>

      {mode === "versus" && (
        <div className="text-center text-yellow-400 font-bold mb-3">
          Current Turn: {currentTeamName}
        </div>
      )}

      {message && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-3 text-center">
          {message}
        </div>
      )}

    </div>
  );
}