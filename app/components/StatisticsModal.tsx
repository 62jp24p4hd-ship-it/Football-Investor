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

type Props = { onStart: (config: StartConfig) => void };

const TIMER_OPTIONS: { label: string; value: number | null }[] = [
  { label: "No Timer", value: null },
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
];

const BUDGET_DISPLAY = {
  lucky: { emoji: "🍀", label: "Lucky", amount: "€10M", color: "border-blue-500 bg-blue-900/30 text-blue-300" },
  balanced: { emoji: "⚖️", label: "Balanced", amount: "€30M", color: "border-emerald-500 bg-emerald-900/30 text-emerald-300" },
  rich: { emoji: "💰", label: "Rich", amount: "€100M", color: "border-yellow-500 bg-yellow-900/30 text-yellow-300" },
  billionaire: { emoji: "💎", label: "Billionaire", amount: "€200M", color: "border-purple-500 bg-purple-900/30 text-purple-300" },
};

export default function StartScreen({ onStart }: Props) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("balanced");
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [eventType, setEventType] = useState<EventType>("all");
  const [timerSeconds, setTimerSeconds] = useState<number | null>(15);
  const [gameLengthMode, setGameLengthMode] = useState<"classic" | "infinite">("classic");
  const [easterClicks, setEasterClicks] = useState(0);
  const [easterUnlocked, setEasterUnlocked] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  function handleStart() {
    if (!mode) return;
    onStart({ mode, budgetMode, team1Name: team1Name.trim() || "Team 1", team2Name: team2Name.trim() || "Team 2", eventsEnabled, eventType, timerSeconds, gameLengthMode });
  }

  return (
    <main className="min-h-screen bg-[#060912] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-10">
          <p onClick={() => { const n = easterClicks+1; setEasterClicks(n); if(n>=5) setEasterUnlocked(true); }}
            className="text-emerald-400/50 text-xs mb-3 cursor-pointer hover:text-emerald-400 transition-colors tracking-[0.3em] uppercase">
            عمو يوسف المطور المستقل — 7GE 👀
          </p>

          <div className="relative inline-block mb-2">
            <div className="text-6xl font-black tracking-tight leading-none">
              <span className="text-gradient-green">Football</span>
            </div>
            <div className="text-6xl font-black tracking-tight leading-none">
              <span className="text-gradient-gold">Investor</span>
            </div>
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          </div>

          <p className="text-gray-500 text-sm tracking-widest uppercase mt-4">
            Build the most valuable squad • 2008 — 2028
          </p>

          {easterUnlocked && (
            <p className="mt-3 text-yellow-400 text-sm font-bold animate-pulse">
              😏 شطور... الحين دور عن بطاقتي.
            </p>
          )}
        </div>

        {/* How To Play */}
        <button onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="w-full mb-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-emerald-500/40 transition-all text-sm font-bold">
          {showHowToPlay ? "▲ Hide Guide" : "📖 How To Play"}
        </button>

        {showHowToPlay && (
          <div className="mb-5 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-gray-300 space-y-2 animate-fade-in">
            <p>⚽ <strong className="text-white">Buy players</strong> each season and build your squad</p>
            <p>💰 <strong className="text-white">Sell at peak value</strong> to maximize profit</p>
            <p>📈 <strong className="text-white">Values change</strong> every season based on performance & events</p>
            <p>🎴 <strong className="text-white">Special cards</strong> — Freeze, Triple Buy, Steal</p>
            <p>🏆 <strong className="text-white">Highest net worth</strong> by 2028 wins</p>
          </div>
        )}

        {/* Game Mode */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Game Mode</div>
          <div className="grid grid-cols-2 gap-3">
            {([["single","👤 Single Player"],["versus","👥 Versus Friend"]] as [GameMode,string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`py-4 rounded-2xl border-2 font-black text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  mode === m
                    ? m === "single" ? "border-emerald-500 bg-emerald-900/40 text-white glow-green" : "border-blue-500 bg-blue-900/40 text-white"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                }`}>{label}</button>
            ))}
          </div>
        </div>

        {/* Team Names */}
        {mode && (
          <div className="mb-5 animate-fade-in">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Team Names</div>
            <div className={`grid gap-3 ${mode === "versus" ? "grid-cols-2" : "grid-cols-1"}`}>
              <input value={team1Name} onChange={(e) => setTeam1Name(e.target.value)} placeholder="Team 1"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors font-bold" />
              {mode === "versus" && (
                <input value={team2Name} onChange={(e) => setTeam2Name(e.target.value)} placeholder="Team 2"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors font-bold" />
              )}
            </div>
          </div>
        )}

        {/* Season Mode */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Season Mode</div>
          <div className="grid grid-cols-2 gap-3">
            {([["classic","🏆 Classic 2008–2028"],["infinite","♾️ Infinite Mode"]] as const).map(([g, label]) => (
              <button key={g} onClick={() => setGameLengthMode(g)}
                className={`py-3 rounded-xl border font-bold transition-all duration-200 hover:scale-[1.02] ${
                  gameLengthMode === g
                    ? "border-yellow-500 bg-yellow-900/30 text-yellow-300 glow-yellow"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                }`}>{label}</button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Starting Budget</div>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(BUDGET_DISPLAY) as BudgetMode[]).map((b) => {
              const d = BUDGET_DISPLAY[b];
              return (
                <button key={b} onClick={() => setBudgetMode(b)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                    budgetMode === b ? d.color : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                  }`}>
                  <div className="font-black text-sm">{d.emoji} {d.label}</div>
                  <div className="text-lg font-black mt-0.5">{d.amount}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Events */}
        <div className="mb-5">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Events</div>
          <div className="flex items-center gap-4 mb-3">
            <button onClick={() => setEventsEnabled(!eventsEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${eventsEnabled ? "bg-emerald-500" : "bg-white/15"}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${eventsEnabled ? "left-8" : "left-1"}`} />
            </button>
            <span className={`text-sm font-bold ${eventsEnabled ? "text-emerald-400" : "text-gray-500"}`}>
              {eventsEnabled ? "Events ON" : "Events OFF"}
            </span>
          </div>
          {eventsEnabled && (
            <div className="flex gap-2">
              {(["all","positive","negative"] as EventType[]).map((e) => (
                <button key={e} onClick={() => setEventType(e)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                    eventType === e
                      ? e === "positive" ? "border-emerald-500 bg-emerald-900/40 text-emerald-300"
                        : e === "negative" ? "border-red-500 bg-red-900/40 text-red-300"
                        : "border-white/30 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
                  }`}>
                  {e === "all" ? "All" : e === "positive" ? "✅ Positive" : "❌ Negative"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Selection Timer</div>
          <div className="flex gap-2">
            {TIMER_OPTIONS.map((t) => (
              <button key={String(t.value)} onClick={() => setTimerSeconds(t.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  timerSeconds === t.value
                    ? "border-yellow-500 bg-yellow-900/30 text-yellow-300"
                    : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
                }`}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button onClick={handleStart} disabled={!mode}
          className={`w-full py-5 rounded-2xl font-black text-xl tracking-wide transition-all duration-300 ${
            mode
              ? "btn-primary text-black hover:scale-[1.02] active:scale-[0.98]"
              : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/10"
          }`}>
          {mode ? "⚽ Start Game" : "Select a Game Mode First"}
        </button>

      </div>
    </main>
  );
}