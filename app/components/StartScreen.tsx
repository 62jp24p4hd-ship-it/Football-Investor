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
  { key: "lucky" as BudgetMode, emoji: "🍀", en: "Lucky", ar: "المحظوظ", amount: "€10M", desc: "High risk, high reward", descAr: "مخاطرة عالية، مكافأة عالية" },
  { key: "balanced" as BudgetMode, emoji: "⚖️", en: "Balanced", ar: "المتوازن", amount: "€30M", desc: "Standard experience", descAr: "تجربة متوازنة ومنطقية" },
  { key: "rich" as BudgetMode, emoji: "💰", en: "Rich", ar: "الغني", amount: "€100M", desc: "More money, stronger events", descAr: "ميزانية كبيرة، أحداث أقوى" },
  { key: "billionaire" as BudgetMode, emoji: "💎", en: "Billionaire", ar: "المليارder", amount: "€200M", desc: "Maximum budget", descAr: "أقصى ميزانية، أحداث مدمرة" },
];

const HOW_TO_PLAY = [
  {
    emoji: "⚽",
    en: "Buy players each season by clicking on position slots",
    ar: "اشتري لاعبين كل موسم بالضغط على المراكز في التشكيلة",
  },
  {
    emoji: "📝",
    en: "Negotiate contracts — salary and duration affect player satisfaction",
    ar: "فاوض على العقود — الراتب والمدة يؤثران على رضا اللاعب",
  },
  {
    emoji: "💰",
    en: "Sell players at peak value to maximize profit",
    ar: "بع اللاعبين في ذروة قيمتهم لتحقيق أكبر ربح",
  },
  {
    emoji: "📈",
    en: "Player values change every season based on performance, age & events",
    ar: "قيم اللاعبين تتغير كل موسم حسب الأداء والعمر والأحداث",
  },
  {
    emoji: "🎴",
    en: "Earn special cards by selling for big amounts — Freeze, Triple Buy, Steal",
    ar: "احصل على بطاقات خاصة بالبيع بمبالغ كبيرة — تجميد، شراء ثلاثي، سرقة",
  },
  {
    emoji: "📰",
    en: "Random events shake the market — injuries, awards, crashes, Saudi offers",
    ar: "الأحداث العشوائية تزعزع السوق — إصابات، جوائز، انهيار، عروض سعودية",
  },
  {
    emoji: "🤝",
    en: "Sponsorships give annual income — manage them wisely",
    ar: "الرعايات تعطيك دخلاً سنوياً — أدرها بذكاء",
  },
  {
    emoji: "👋",
    en: "Players retire between age 30-40 — sell before it's too late",
    ar: "اللاعبون يعتزلون بين 30-40 — بع قبل فوات الأوان",
  },
  {
    emoji: "🏆",
    en: "Highest net worth (budget + squad value) at the end wins",
    ar: "صاحب أعلى قيمة صافية (ميزانية + قيمة الفريق) في النهاية يفوز",
  },
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

  const sectionStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "20px",
  };

  const sectionTitle = "text-sm uppercase tracking-widest text-gray-400 mb-4 font-black";

  return (
    <main className="min-h-screen bg-[#060912] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[15%] w-[700px] h-[700px] rounded-full blur-[180px]" style={{ background: "rgba(16,185,129,0.07)" }} />
        <div className="absolute bottom-[-15%] right-[15%] w-[600px] h-[600px] rounded-full blur-[160px]" style={{ background: "rgba(59,130,246,0.05)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.01) 1px, transparent 1px)", backgroundSize: "45px 45px" }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-10">
          <p
            onClick={() => { const n = easterClicks+1; setEasterClicks(n); if(n>=5) setEasterUnlocked(true); }}
            className="text-xl font-black mb-4 cursor-pointer tracking-wide"
            style={{ color: "#D4AF37", textShadow: "0 0 30px rgba(212,175,55,0.6)" }}
          >
            👀 حجي المطور المستقل — 7GE
          </p>

          <div style={{ fontSize: "88px", fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg, #ffffff, #a8f5d0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Football
          </div>
          <div style={{ fontSize: "88px", fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Investor
          </div>

          <p className="text-gray-500 text-base tracking-widest uppercase mt-5">
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
          className="w-full mb-5 py-4 rounded-2xl font-bold text-base transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#9ca3af" }}>
          {showHowToPlay ? "▲ إخفاء الدليل — Hide Guide" : "📖 كيف تلعب — How To Play"}
        </button>

        {showHowToPlay && (
          <div className="mb-5 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="space-y-4">
              {HOW_TO_PLAY.map((item, i) => (
                <div key={i} className="flex items-start gap-3 pb-3" style={{ borderBottom: i < HOW_TO_PLAY.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                  <div>
                    <div className="text-white font-bold text-sm">{item.en}</div>
                    <div className="text-gray-400 text-xs mt-1 leading-relaxed">{item.ar}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Mode */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Game Mode — وضع اللعبة</div>
          <div className="grid grid-cols-2 gap-4">
            {([["single","👤","Single Player","لاعب واحد"],["versus","👥","Versus Friend","ضد صديق"]] as const).map(([m, emoji, en, ar]) => (
              <button key={m} onClick={() => setMode(m as GameMode)}
                className="py-5 rounded-2xl font-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={mode === m ? {
                  borderColor: m === "single" ? "#10b981" : "#3b82f6",
                  borderWidth: 2, borderStyle: "solid",
                  background: m === "single" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)",
                  boxShadow: m === "single" ? "0 0 25px rgba(16,185,129,0.25)" : "0 0 25px rgba(59,130,246,0.25)"
                } : { border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-white text-lg">{en}</div>
                <div className="text-gray-400 text-sm font-normal mt-1">{ar}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Team Names */}
        {mode && (
          <div style={sectionStyle}>
            <div className={sectionTitle}>Team Names — أسماء الفرق</div>
            <div className={`grid gap-4 ${mode === "versus" ? "grid-cols-2" : "grid-cols-1"}`}>
              <input value={team1Name} onChange={(e) => setTeam1Name(e.target.value)} placeholder="Team 1"
                className="px-4 py-4 text-white placeholder-gray-600 font-bold text-base focus:outline-none transition-colors rounded-xl"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }} />
              {mode === "versus" && (
                <input value={team2Name} onChange={(e) => setTeam2Name(e.target.value)} placeholder="Team 2"
                  className="px-4 py-4 text-white placeholder-gray-600 font-bold text-base focus:outline-none transition-colors rounded-xl"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }} />
              )}
            </div>
          </div>
        )}

        {/* Budget */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Starting Budget — الميزانية الابتدائية</div>
          <div className="grid grid-cols-2 gap-4">
            {BUDGETS.map((b) => (
              <button key={b.key} onClick={() => setBudgetMode(b.key)}
                className="py-5 px-4 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02]"
                style={budgetMode === b.key
                  ? { border: "2px solid rgba(16,185,129,0.7)", background: "rgba(16,185,129,0.12)", boxShadow: "0 0 20px rgba(16,185,129,0.15)" }
                  : { border: "2px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <div className="text-2xl mb-2">{b.emoji}</div>
                <div className="text-white font-black text-lg">{b.amount} {b.en}</div>
                <div className="text-gray-500 text-xs mt-1">{b.desc}</div>
                <div className="text-gray-600 text-xs mt-0.5">{b.descAr}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Season Mode */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Season Mode — وضع الموسم</div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setGameLengthMode("classic")}
              className="py-5 rounded-2xl font-black transition-all hover:scale-[1.02]"
              style={gameLengthMode === "classic"
                ? { border: "2px solid #f59e0b", background: "rgba(245,158,11,0.12)", boxShadow: "0 0 20px rgba(245,158,11,0.2)" }
                : { border: "2px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-white text-lg">Modern Era</div>
              <div className="text-gray-400 text-sm font-normal mt-1">2008 — 2028</div>
            </button>
            <button onClick={() => setGameLengthMode("infinite")}
              className="py-5 rounded-2xl font-black transition-all hover:scale-[1.02]"
              style={gameLengthMode === "infinite"
                ? { border: "2px solid #a855f7", background: "rgba(168,85,247,0.12)", boxShadow: "0 0 20px rgba(168,85,247,0.2)" }
                : { border: "2px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <div className="text-3xl mb-2">♾️</div>
              <div className="text-white text-lg">Infinite Mode</div>
              <div className="text-gray-400 text-sm font-normal mt-1">لا نهاية</div>
            </button>
          </div>
        </div>

        {/* Events */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Events — الأحداث</div>
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setEventsEnabled(!eventsEnabled)}
              className="relative w-16 h-8 rounded-full transition-colors duration-300 flex-shrink-0"
              style={{ background: eventsEnabled ? "#10b981" : "rgba(255,255,255,0.1)" }}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${eventsEnabled ? "left-9" : "left-1"}`} />
            </button>
            <span className="font-bold text-base" style={{ color: eventsEnabled ? "#10b981" : "#6b7280" }}>
              {eventsEnabled ? "Events ON — الأحداث مفعّلة" : "Events OFF — الأحداث مغلقة"}
            </span>
          </div>
          {eventsEnabled && (
            <div className="flex gap-3">
              {(["all","positive","negative"] as EventType[]).map((e) => (
                <button key={e} onClick={() => setEventType(e)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                  style={eventType === e ? {
                    border: `2px solid ${e === "positive" ? "#10b981" : e === "negative" ? "#ef4444" : "rgba(255,255,255,0.4)"}`,
                    background: e === "positive" ? "rgba(16,185,129,0.15)" : e === "negative" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)",
                    color: e === "positive" ? "#34d399" : e === "negative" ? "#f87171" : "#ffffff"
                  } : { border: "2px solid rgba(255,255,255,0.08)", background: "transparent", color: "#6b7280" }}>
                  {e === "all" ? "الكل — All" : e === "positive" ? "✅ إيجابية" : "❌ سلبية"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timer */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Selection Timer — مؤقت الاختيار</div>
          <div className="flex gap-3">
            {TIMER_OPTIONS.map((t) => (
              <button key={String(t.value)} onClick={() => setTimerSeconds(t.value)}
                className="flex-1 py-4 rounded-xl text-base font-bold transition-all"
                style={timerSeconds === t.value
                  ? { border: "2px solid #f59e0b", background: "rgba(245,158,11,0.15)", color: "#fbbf24" }
                  : { border: "2px solid rgba(255,255,255,0.08)", background: "transparent", color: "#6b7280" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button onClick={handleStart} disabled={!mode}
          className="w-full py-6 rounded-2xl font-black text-2xl tracking-wide transition-all duration-300"
          style={mode ? {
            background: "linear-gradient(135deg, #10b981, #059669)",
            boxShadow: "0 8px 30px rgba(16,185,129,0.4)",
            color: "black",
          } : {
            background: "rgba(255,255,255,0.04)",
            color: "#4b5563",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
          {mode ? "⚽ ابدأ اللعبة — Start Game" : "اختر وضع اللعبة أولاً"}
        </button>

      </div>
    </main>
  );
}