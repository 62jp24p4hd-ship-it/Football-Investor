"use client";

import { useState } from "react";
import type { BudgetMode, GameMode, EventType } from "../game/types";
import type { AIDifficulty } from "../game/aiEngine";
import { AI_DIFFICULTY_CONFIG } from "../game/aiEngine";

type StartConfig = {
  mode: GameMode;
  budgetMode: BudgetMode;
  team1Name: string;
  team2Name: string;
  eventsEnabled: boolean;
  eventType: EventType;
  timerSeconds: number | null;
  gameLengthMode: "classic" | "infinite";
  aiDifficulty?: AIDifficulty;
};

type Props = { onStart: (config: StartConfig) => void };

const BUDGETS = [
  { key: "lucky" as BudgetMode,      emoji: "🍀", label: "Lucky",      amount: "€10M",  color: "#10b981" },
  { key: "balanced" as BudgetMode,   emoji: "⚖️", label: "Balanced",   amount: "€30M",  color: "#D4AF37" },
  { key: "rich" as BudgetMode,       emoji: "💰", label: "Rich",       amount: "€100M", color: "#a855f7" },
  { key: "billionaire" as BudgetMode,emoji: "💎", label: "Billionaire",amount: "€200M", color: "#3b82f6" },
];

const MODES = [
  { key: "single"  as GameMode, icon: "👤", en: "SINGLE PLAYER",   ar: "لاعب واحد",        color: "#10b981" },
  { key: "versus"  as GameMode, icon: "👥", en: "VERSUS FRIEND",   ar: "ضد صديق",           color: "#3b82f6" },
  { key: "ai"      as GameMode, icon: "👑", en: "VS AI",           ar: "ضد الكمبيوتر",      color: "#a855f7" },
];

export default function StartScreen({ onStart }: Props) {
  const [mode, setMode]               = useState<GameMode | null>(null);
  const [budgetMode, setBudgetMode]   = useState<BudgetMode>("balanced");
  const [team1Name, setTeam1Name]     = useState("Team 1");
  const [team2Name, setTeam2Name]     = useState("Team 2");
  const [eventsEnabled]               = useState(true);
  const [eventType]                   = useState<EventType>("all");
  const [timerSeconds]                = useState<number | null>(null);
  const [gameLengthMode]              = useState<"classic" | "infinite">("classic");
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>("manager");
  const [easterClicks, setEasterClicks] = useState(0);
  const [easterUnlocked, setEasterUnlocked] = useState(false);

  function handleStart() {
    if (!mode) return;
    onStart({
      mode, budgetMode,
      team1Name: team1Name.trim() || "Team 1",
      team2Name: team2Name.trim() || "Team 2",
      eventsEnabled, eventType, timerSeconds, gameLengthMode, aiDifficulty,
    });
  }

  const canStart = !!mode;

  return (
    <main className="min-h-screen w-full text-white flex overflow-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── BACKGROUND IMAGE ── */}
      <div className="absolute inset-0 z-0">
        <img src="/start-bg.png" alt="" className="w-full h-full object-cover object-center" />
        {/* Dark overlay — stronger on left for readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(4,8,16,0.97) 0%, rgba(4,8,16,0.92) 38%, rgba(4,8,16,0.3) 65%, rgba(4,8,16,0.0) 100%)" }} />
      </div>

      {/* ── LEFT PANEL ── */}
      <div className="relative z-10 flex flex-col w-[400px] min-w-[360px] max-w-[420px] h-screen overflow-y-auto px-7 py-6">

        {/* Logo */}
        <div className="mb-6 cursor-pointer select-none" onClick={() => { const n = easterClicks+1; setEasterClicks(n); if(n>=5) setEasterUnlocked(true); }}>
          <img src="/logo.png" alt="Football Investor" className="w-20 h-20 object-contain mb-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="text-[11px] tracking-[0.3em] uppercase text-gray-500 mt-1">Build Your Legacy</div>
          {easterUnlocked && <div className="text-yellow-400 text-xs font-bold mt-1 animate-pulse">😏 شطور...</div>}
        </div>

        {/* ── GAME MODE ── */}
        <Section label="► GAME MODE">
          <div className="space-y-2">
            {MODES.map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-none"
                style={{
                  background: mode === m.key ? `${m.color}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${mode === m.key ? m.color : "rgba(255,255,255,0.08)"}`,
                  boxShadow: mode === m.key ? `0 0 16px ${m.color}30` : "none",
                }}>
                <div className="w-8 h-8 rounded-none flex items-center justify-center text-sm"
                  style={{ background: mode === m.key ? `${m.color}25` : "rgba(255,255,255,0.06)" }}>
                  {m.icon}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black tracking-wider text-white">{m.en}</div>
                  <div className="text-[10px] text-gray-500">{m.ar}</div>
                </div>
                {mode === m.key && <div className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: m.color }} />}
              </button>
            ))}
          </div>

          {/* AI difficulty */}
          {mode === "ai" && (
            <div className="mt-3 space-y-1.5">
              <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Difficulty</div>
              {(["scout","manager","director"] as AIDifficulty[]).map(d => {
                const cfg = AI_DIFFICULTY_CONFIG[d];
                return (
                  <button key={d} onClick={() => setAiDifficulty(d)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-none transition-all"
                    style={{
                      background: aiDifficulty === d ? `${cfg.color}18` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${aiDifficulty === d ? cfg.color : "rgba(255,255,255,0.06)"}`,
                    }}>
                    <span className="text-sm">{cfg.emoji}</span>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">{cfg.label}</div>
                      <div className="text-[9px] text-gray-500">{cfg.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Section>

        {/* ── STARTING BUDGET ── */}
        <Section label="► STARTING BUDGET">
          <div className="grid grid-cols-2 gap-2">
            {BUDGETS.map(b => (
              <button key={b.key} onClick={() => setBudgetMode(b.key)}
                className="flex flex-col items-start px-3 py-2.5 rounded-none transition-all"
                style={{
                  background: budgetMode === b.key ? `${b.color}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${budgetMode === b.key ? b.color : "rgba(255,255,255,0.07)"}`,
                  boxShadow: budgetMode === b.key ? `0 0 12px ${b.color}25` : "none",
                }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs">{b.emoji}</span>
                  <span className="text-[10px] font-black tracking-wider text-white">{b.label.toUpperCase()}</span>
                </div>
                <div className="text-sm font-black" style={{ color: budgetMode === b.key ? b.color : "#9ca3af" }}>{b.amount}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* ── SEASON MODE ── */}
        <Section label="► SEASON MODE">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-none"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}>
            <span>🏆</span>
            <div className="text-left">
              <div className="text-xs font-black text-yellow-400 tracking-wider">وضع الموسم</div>
              <div className="text-[10px] text-gray-500">ابن امبراطوريتك على مدار المواسم</div>
            </div>
          </button>
        </Section>

        {/* ── TEAM NAMES ── */}
        {mode && (
          <Section label="► TEAM NAME">
            <input value={team1Name} onChange={e => setTeam1Name(e.target.value)}
              placeholder="Your team name"
              className="w-full px-3 py-2.5 text-white text-xs font-bold placeholder-gray-600 focus:outline-none rounded-none mb-2"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            {mode === "versus" && (
              <input value={team2Name} onChange={e => setTeam2Name(e.target.value)}
                placeholder="Opponent team name"
                className="w-full px-3 py-2.5 text-white text-xs font-bold placeholder-gray-600 focus:outline-none rounded-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            )}
            {mode === "ai" && (
              <div className="px-3 py-2.5 text-xs font-bold rounded-none flex items-center gap-2"
                style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
                <span>🤖</span>
                <span className="text-purple-400">{AI_DIFFICULTY_CONFIG[aiDifficulty].label} AI</span>
              </div>
            )}
          </Section>
        )}

        {/* ── START BUTTON ── */}
        <button onClick={handleStart} disabled={!canStart}
          className="w-full py-4 font-black text-sm tracking-[0.2em] uppercase transition-all duration-300 mt-auto rounded-none"
          style={canStart ? {
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            boxShadow: "0 4px 24px rgba(16,185,129,0.4)",
          } : {
            background: "rgba(255,255,255,0.05)",
            color: "#374151",
            cursor: "not-allowed",
          }}>
          {canStart ? "▶  START GAME" : "SELECT MODE TO START"}
        </button>

        {/* ── BOTTOM LINKS ── */}
        <div className="flex items-center gap-4 mt-4 pb-2">
          <button className="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
            <span>⚙️</span> SETTINGS
          </button>
          <button className="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
            <span>📖</span> MANUAL
          </button>
        </div>

      </div>

      {/* ── RIGHT SIDE: just the background shows through ── */}

    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[9px] font-black tracking-[0.25em] mb-2.5 flex items-center gap-2"
        style={{ color: "#10b981" }}>
        {label}
      </div>
      {children}
    </div>
  );
}