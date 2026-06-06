"use client";

import { useState } from "react";
import type { BudgetMode, GameMode, EventType } from "../game/types";
import { BUDGET_SETTINGS } from "../game/constants";

type StartConfig = {
  mode: GameMode;
  budgetMode: BudgetMode;
  team1Name: string;
  team2Name: string;
  eventsEnabled: boolean;
  eventType: EventType;
  timerSeconds: number | null;
  gameLengthMode: "classic" | "infinite";
};

type Props = {
  onStart: (config: StartConfig) => void;
};

const TIMER_OPTIONS: { label: string; value: number | null }[] = [
  { label: "No Timer", value: null },
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "45s", value: 45 },
  { label: "60s", value: 60 },
];

export default function StartScreen({ onStart }: Props) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("balanced");
  const [team1Name, setTeam1Name] = useState("Investor 1");
  const [team2Name, setTeam2Name] = useState("Investor 2");
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [eventType, setEventType] = useState<EventType>("all");
  const [timerSeconds, setTimerSeconds] = useState<number | null>(15);
  const [gameLengthMode, setGameLengthMode] = useState<"classic" | "infinite">("classic");
  const [easterClicks, setEasterClicks] = useState(0);
  const [easterUnlocked, setEasterUnlocked] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  function handleStart() {
    if (!mode) return;
    onStart({
      mode,
      budgetMode,
      team1Name: team1Name.trim() || "Investor 1",
      team2Name: team2Name.trim() || "Investor 2",
      eventsEnabled,
      eventType,
      timerSeconds,
      gameLengthMode,
    });
  }

  function handleEasterClick() {
    const next = easterClicks + 1;
    setEasterClicks(next);
    if (next >= 5) setEasterUnlocked(true);
  }

  return (
    <main className="min-h-screen bg-[#060a0f] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        <div className="text-center mb-10">
          <p
            onClick={handleEasterClick}
            className="text-emerald-400/60 text-sm mb-3 cursor-pointer hover:text-emerald-400 transition-colors tracking-widest uppercase"
          >
            عمو يوسف المطور المستقل — 7GE 👀
          </p>
          <h1 className="text-6xl font-black tracking-tight bg-gradient-to-br from-white via-emerald-200 to-emerald-500 bg-clip-text text-transparent">
            Football
          </h1>
          <h1 className="text-6xl font-black tracking-tight bg-gradient-to-br from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Investor
          </h1>
          <p className="text-gray-400 mt-4 text-sm tracking-wider uppercase">
            Build the most valuable squad • 2008 — 2028
          </p>
          {easterUnlocked && (
            <p className="mt-3 text-yellow-400 text-sm font-bold animate-pulse">
              😏 شطور... الحين دور عن بطاقتي.
            </p>
          )}
        </div>

        <button
          onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="w-full mb-6 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
        >
          {showHowToPlay ? "▲ Hide Guide" : "📖 How To Play"}
        </button>

        {showHowToPlay && (
          <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-gray-300 space-y-2">
            <p>⚽ <strong className="text-white">Buy players</strong> each season and build your squad</p>
            <p>💰 <strong className="text-white">Sell at the right time</strong> to maximize profit</p>
            <p>📈 <strong className="text-white">Player values</strong> change every season based on performance</p>
            <p>🎴 <strong className="text-white">Events</strong> shake up the market — injuries, awards, crashes</p>
            <p>🏆 <strong className="text-white">Most valuable empire</strong> by 2028 wins</p>
          </div>
        )}

        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Game Mode</h2>
          <div className="grid grid-cols-2 gap-3">
            {(["single", "versus"] as GameMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-4 rounded-2xl border-2 font-bold transition-all duration-200 ${
                  mode === m
                    ? m === "single"
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                }`}
              >
                {m === "single" ? "👤 Single Player" : "👥 Versus Friend"}
              </button>
            ))}
          </div>
        </section>

        {mode && (
          <section className="mb-6">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Team Names</h2>
            <div className={`grid gap-3 ${mode === "versus" ? "grid-cols-2" : "grid-cols-1"}`}>
              <input
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="Team 1 Name"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {mode === "versus" && (
                <input
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Team 2 Name"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              )}
            </div>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Starting Budget</h2>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(BUDGET_SETTINGS) as BudgetMode[]).map((b) => (
              <button
                key={b}
                onClick={() => setBudgetMode(b)}
                className={`py-3 px-4 rounded-xl border transition-all duration-200 text-left ${
                  budgetMode === b
                    ? "border-emerald-500 bg-emerald-500/15 text-white"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                }`}
              >
                <div className="font-bold text-sm">{BUDGET_SETTINGS[b].label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{BUDGET_SETTINGS[b].description}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Season Mode</h2>
          <div className="grid grid-cols-2 gap-3">
            {(["classic", "infinite"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGameLengthMode(g)}
                className={`py-3 rounded-xl border font-bold transition-all duration-200 ${
                  gameLengthMode === g
                    ? "border-yellow-500 bg-yellow-500/15 text-yellow-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                }`}
              >
                {g === "classic" ? "🏆 Classic 2008–2028" : "♾️ Infinite Mode"}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Events</h2>
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => setEventsEnabled(!eventsEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                eventsEnabled ? "bg-emerald-500" : "bg-white/10"
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                eventsEnabled ? "left-8" : "left-1"
              }`} />
            </button>
            <span className="text-sm text-gray-400">{eventsEnabled ? "Events ON" : "Events OFF"}</span>
          </div>
          {eventsEnabled && (
            <div className="flex gap-2">
              {(["all", "positive", "negative"] as EventType[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setEventType(e)}
                  className={`flex-1 py-2 rounded-xl text-sm border transition-all ${
                    eventType === e
                      ? e === "positive"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : e === "negative"
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : "border-white/30 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-gray-500"
                  }`}
                >
                  {e === "all" ? "All" : e === "positive" ? "✅ Positive" : "❌ Negative"}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Selection Timer</h2>
          <div className="flex gap-2">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={String(t.value)}
                onClick={() => setTimerSeconds(t.value)}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${
                  timerSeconds === t.value
                    ? "border-yellow-500 bg-yellow-500/20 text-yellow-300"
                    : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleStart}
          disabled={!mode}
          className={`w-full py-5 rounded-2xl font-black text-xl tracking-wide transition-all duration-300 ${
            mode
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/10"
          }`}
        >
          {mode ? "⚽ Start Game" : "Select a Game Mode First"}
        </button>

      </div>
    </main>
  );
}