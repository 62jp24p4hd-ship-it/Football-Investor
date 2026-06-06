"use client";

import { useState } from "react";
import type { BudgetMode, GameMode, EventType } from "../game/types";

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

const BUDGETS = [
  { key: "lucky" as BudgetMode, emoji: "🍀", en: "Lucky Investor", ar: "المستثمر المحظوظ", amount: "€10M", desc: "High risk, high reward", color: "border-blue-500 bg-blue-900/30" },
  { key: "balanced" as BudgetMode, emoji: "⚖️", en: "Balanced", ar: "المتوازن", amount: "€30M", desc: "Standard experience", color: "border-emerald-500 bg-emerald-900/30" },
  { key: "rich" as BudgetMode, emoji: "💰", en: "Rich Investor", ar: "المستثمر الغني", amount: "€100M", desc: "More money, stronger events", color: "border-yellow-500 bg-yellow-900/30" },
  { key: "billionaire" as BudgetMode, emoji: "💎", en: "Billionaire", ar: "المليارder", amount: "€200M", desc: "Maximum budget, brutal events", color: "border-purple-500 bg-purple-900/30" },
];

const HOW_TO_PLAY = [
  { emoji: "⚽", en: "Buy players each season", ar: "اشتري لاعبين كل موسم وابني فريقك" },
  { emoji: "💰", en: "Sell at the right time", ar: "بع في الوقت المناسب لتحقيق أكبر ربح" },
  { emoji: "📈", en: "Player values change every season", ar: "قيم اللاعبين تتغير كل موسم حسب الأداء" },
  { emoji: "🎴", en: "Use special cards strategically", ar: "استخدم البطاقات الخاصة بذكاء — Freeze, Triple, Steal" },
  { emoji: "📰", en: "Events shake up the market", ar: "الأحداث تغير السوق — إصابات، جوائز، انهيار" },
  { emoji: "🤝", en: "Manage contracts & sponsorships", ar: "أدر العقود والرعايات لتزيد دخلك" },
  { emoji: "🏆", en: "Highest net worth by 2028 wins", ar: "صاحب أعلى قيمة صافية في 2028 يفوز" },
];

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

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[15%] w-[700px] h-[700px] bg-emerald-500/6 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[15%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "45px 45px" }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-12">
          <p
            onClick={() => { const n = easterClicks+1; setEasterClicks(n); if(n>=5) setEasterUnlocked(true); }}
            className="text-2xl font-black mb-4 cursor-pointer"
            style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.5)" }}
          >
            👀 عمو يوسف المطور المستقل — 7GE
          </p>

          <h1 className="font-black leading-none mb-1" style={{ fontSize: "80px", background: "linear-gradient(135deg, #ffffff, #a8f5d0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Football
          </h1>
          <h1 className="font-black leading-none" style={{ fontSize: "80px", background: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Investor
          </h1>

          <p className="text-gray-400 text-sm tracking-widest uppercase mt-4">
            Build The Most Valuable Squad
          </p>

          {easterUnlocked && (
            <p className="mt-3 text-yellow-400 text-base font-black animate-pulse">
              😏 شطور... الحين دور عن بطاقتي.
            </p>
          )}
        </div>

        {/* How To Play */}
        <button onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="w-full mb-6 py-3 rounded-2xl border border-white/15 text-gray-300 hover:text-white hover:border-emerald-500/50 transition-all text-sm font-bold">
          {showHowToPlay ? "▲ إخفاء الدليل — Hide Guide" : "📖 كيف تلعب — How To Play"}
        </button>

        {showHowToPlay && (
          <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            {HOW_TO_PLAY.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <div className="text-white font-bold text-sm">{item.en}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{item.ar}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Game Mode */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Game Mode — وضع اللعبة</div>
          <div className="grid grid-cols-2 gap-4">
            {([["single","👤","Single Player","لاعب واحد"],["versus","👥","Versus Friend","ضد صديق"]] as const).map(([m, emoji, en, ar]) => (
              <button key={m} onClick={() => setMode(m as GameMode)}
                className="py-5 rounded-2xl border-2 font-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={mode === m ? {
                  borderColor: m === "single" ? "#10b981" : "#3b82f6",
                  background: m === "single" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)",
                  boxShadow: m === "single" ? "0 0 20px rgba(16,185,129,0.2)" : "0 0 20px rgba(59,130,246,0.2)"
                } : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-white text-base">{en}</div>
                <div className="text-gray-400 text-xs font-normal mt-0.5">{ar}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Team Names */}
        {mode && (
          <div className="mb-8">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Team Names — أسماء الفرق</div>
            <div className={`grid gap-4 ${mode === "versus" ? "grid-cols-2" : "grid-cols-1"}`}>
              <input value={team1Name} onChange={(e) => setTeam1Name(e.target.value)} placeholder="Team 1"
                className="bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors font-bold text-base" />
              {mode === "versus" && (
                <input value={team2Name} onChange={(e) => setTeam2Name(e.target.value)} placeholder="Team 2"
                  className="bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors font-bold text-base" />
              )}
            </div>
          </div>
        )}

        {/* Budget */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Starting Budget — الميزانية الابتدائية</div>
          <div className="grid grid-cols-2 gap-4">
            {BUDGETS.map((b) => (
              <button key={b.key} onClick={() => setBudgetMode(b.key)}
                className={`py-4 px-4 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                  budgetMode === b.key ? b.color : "border-white/10 bg-white/3"
                }`}>
                <div className="text-xl mb-1">{b.emoji}</div>
                <div className="font-black text-white text-base">{b.amount} {b.en}</div>
                <div className="text-gray-400 text-xs mt-0.5">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Season Mode */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Season Mode — وضع الموسم</div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setGameLengthMode("classic")}
              className="py-4 rounded-2xl border-2 font-black transition-all hover:scale-[1.02]"
              style={gameLengthMode === "classic" ? { borderColor: "#f59e0b", background: "rgba(245,158,11,0.15)", boxShadow: "0 0 20px rgba(245,158,11,0.2)" } : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-white">Modern Era</div>
              <div className="text-gray-400 text-xs font-normal">2008–2028</div>
            </button>
            <button onClick={() => setGameLengthMode("infinite")}
              className="py-4 rounded-2xl border-2 font-black transition-all hover:scale-[1.02]"
              style={gameLengthMode === "infinite" ? { borderColor: "#a855f7", background: "rgba(168,85,247,0.15)", boxShadow: "0 0 20px rgba(168,85,247,0.2)" } : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
              <div className="text-2xl mb-1">♾️</div>
              <div className="text-white">Infinite Mode</div>
              <div className="text-gray-400 text-xs font-normal">لا نهاية</div>
            </button>
          </div>
        </div>

        {/* Events */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Events — الأحداث</div>
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setEventsEnabled(!eventsEnabled)}
              className="relative w-16 h-8 rounded-full transition-colors duration-300"
              style={{ background: eventsEnabled ? "#10b981" : "rgba(255,255,255,0.1)" }}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${eventsEnabled ? "left-9" : "left-1"}`} />
            </button>
            <span className="font-bold" style={{ color: eventsEnabled ? "#10b981" : "#6b7280" }}>
              {eventsEnabled ? "Events ON — الأحداث مفعّلة" : "Events OFF — الأحداث مغلقة"}
            </span>
          </div>
          {eventsEnabled && (
            <div className="flex gap-3">
              {(["all","positive","negative"] as EventType[]).map((e) => (
                <button key={e} onClick={() => setEventType(e)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all"
                  style={eventType === e ? {
                    borderColor: e === "positive" ? "#10b981" : e === "negative" ? "#ef4444" : "#ffffff40",
                    background: e === "positive" ? "rgba(16,185,129,0.15)" : e === "negative" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)",
                    color: e === "positive" ? "#34d399" : e === "negative" ? "#f87171" : "#ffffff"
                  } : { borderColor: "rgba(255,255,255,0.1)", background: "transparent", color: "#6b7280" }}>
                  {e === "all" ? "الكل — All" : e === "positive" ? "✅ إيجابية" : "❌ سلبية"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-bold">Selection Timer — مؤقت الاختيار</div>
          <div className="flex gap-3">
            {TIMER_OPTIONS.map((t) => (
              <button key={String(t.value)} onClick={() => setTimerSeconds(t.value)}
                className="flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all"
                style={timerSeconds === t.value ? { borderColor: "#f59e0b", background: "rgba(245,158,11,0.15)", color: "#fbbf24" } : { borderColor: "rgba(255,255,255,0.1)", background: "transparent", color: "#6b7280" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button onClick={handleStart} disabled={!mode}
          className="w-full py-6 rounded-2xl font-black text-xl tracking-wide transition-all duration-300"
          style={mode ? {
            background: "linear-gradient(135deg, #10b981, #059669)",
            boxShadow: "0 8px 30px rgba(16,185,129,0.4)",
            color: "black",
            transform: "translateY(0)"
          } : {
            background: "rgba(255,255,255,0.05)",
            color: "#4b5563",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
          {mode ? "⚽ Start Game — ابدأ اللعبة" : "اختر وضع اللعبة أولاً — Select a Game Mode First"}
        </button>

      </div>
    </main>
  );
}