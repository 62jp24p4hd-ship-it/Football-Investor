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
  { key: "lucky" as BudgetMode, emoji: "🍀", en: "Lucky", ar: "المحظوظ", amount: "€10M" },
  { key: "balanced" as BudgetMode, emoji: "⚖️", en: "Balanced", ar: "متوازن", amount: "€30M" },
  { key: "rich" as BudgetMode, emoji: "💰", en: "Rich", ar: "غني", amount: "€100M" },
  { key: "billionaire" as BudgetMode, emoji: "💎", en: "Billionaire", ar: "مليardير", amount: "€200M" },
];

const HOW_TO_PLAY = [
  { emoji: "💰", en: "Buy players within your budget each season", ar: "اشتري لاعبين ضمن ميزانيتك كل موسم" },
  { emoji: "📈", en: "Player values rise and fall based on performance", ar: "قيم اللاعبين ترتفع وتنخفض حسب الأداء" },
  { emoji: "🏆", en: "Events like Ballon d'Or can boost player value", ar: "الأحداث كالكرة الذهبية ترفع قيمة اللاعب" },
  { emoji: "💼", en: "Sell players at the right time for maximum profit", ar: "بع اللاعبين في الوقت المناسب لأقصى ربح" },
  { emoji: "📋", en: "Manage contracts — don't let players leave for free", ar: "أدر العقود — لا تترك اللاعبين يرحلون مجاناً" },
];

export default function StartScreen({ onStart }: Props) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("balanced");
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [eventType, setEventType] = useState<EventType>("all");
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [gameLengthMode, setGameLengthMode] = useState<"classic" | "infinite">("classic");
  const [easterClicks, setEasterClicks] = useState(0);
  const [easterUnlocked, setEasterUnlocked] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showDevMsg, setShowDevMsg] = useState(false);

  function handleStart() {
    if (!mode) return;
    onStart({ mode, budgetMode, team1Name: team1Name.trim() || "Team 1", team2Name: team2Name.trim() || "Team 2", eventsEnabled, eventType, timerSeconds, gameLengthMode });
  }

  const sectionStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "0px",
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
            👀 حجي المطور المستقل
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
          className="w-full mb-3 py-4 rounded-none font-bold text-base transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#9ca3af" }}>
          {showHowToPlay ? "▲ إخفاء الدليل — Hide Guide" : "📖 كيف تلعب — How To Play"}
        </button>

        {showHowToPlay && (
          <div className="mb-3 rounded-none p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
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

        {/* Developer Message */}
        <button onClick={() => setShowDevMsg(!showDevMsg)}
          className="w-full mb-5 py-4 rounded-none font-bold text-base transition-all"
          style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", color: "#D4AF37" }}>
          {showDevMsg ? "▲ إخفاء رسالة المطور" : "💌 رسالة من المطور"}
        </button>

        {showDevMsg && (
          <div className="mb-5 rounded-none p-5 text-sm leading-relaxed" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>

            <p className="text-gray-300 mb-4">السلام عليكم،</p>
            <p className="text-gray-300 mb-4">أنا يوسف <span className="text-yellow-400 font-bold">(7GE)</span>، شخص يعشق كرة القدم وبايرن ميونخ وقضى ساعات طويلة في ألعاب الكورة، خصوصًا طور الكرير مود.</p>
            <p className="text-gray-300 mb-4">في يوم من الأيام جتني فكرة بسيطة:<br/><span className="text-white font-bold italic">"ليش أكون مدرب… إذا أقدر أكون مستثمر؟"</span></p>
            <p className="text-gray-300 mb-4">ومن هنا بدأت رحلة <span className="text-emerald-400 font-bold">Football Investor</span>.</p>
            <p className="text-gray-300 mb-4">المشروع بدأ كتجربة لتعلم تطوير الألعاب من الصفر، رغم أني ما كنت أملك أي خبرة سابقة في المجال. ومع الوقت تحول إلى لعبة كاملة تجمع بين الاستثمار، العقود، الرعاة، المزادات، الأحداث المفاجئة، واتخاذ القرارات الذكية لبناء أعظم إمبراطورية استثمارية في عالم كرة القدم.</p>
            <p className="text-gray-300 mb-4">هدفي كان بسيط:<br/><span className="text-white font-bold">أصنع لعبة كرة قدم مختلفة عن أي شيء جربته من قبل.</span></p>
            <p className="text-gray-300 mb-6">إذا استمتعت باللعبة، أو ضيعت ساعات من وقتك وأنت تحاول تثبت أن عندك عقلية استثمارية أفضل من أصحابك… فأعتبر مهمتي نجحت. 😄</p>

            <div className="border-t border-white/8 pt-4 mb-4">
              <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-2">📱 حساباتي الشخصية (7GE)</p>
              <p className="text-gray-400 text-xs">X / Twitter: <span className="text-white">@7geisthebest</span></p>
              <p className="text-gray-400 text-xs">Instagram: <span className="text-white">@7geisthebest</span></p>
            </div>

            <div className="border-t border-white/8 pt-4 mb-4">
              <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">🏟 الحسابات الرسمية للعبة</p>
              <p className="text-gray-400 text-xs">X / Twitter: <span className="text-white">@Football_inv</span></p>
              <p className="text-gray-400 text-xs">Instagram: <span className="text-white">@Football_Investor</span></p>
              <p className="text-gray-400 text-xs">TikTok: <span className="text-white">@Football_investor</span></p>
            </div>

            <div className="border-t border-white/8 pt-4 mb-4">
              <p className="text-gray-400 text-xs mb-2">تابع حسابات اللعبة للحصول على:</p>
              {["آخر التحديثات والإضافات الجديدة","أخبار التطوير","الإعلانات الرسمية","التصويت على الأفكار القادمة","لقطات وصور من مراحل التطوير"].map((item, i) => (
                <p key={i} className="text-gray-500 text-xs">• {item}</p>
              ))}
            </div>

            <div className="border-t border-white/8 pt-4 mb-4">
              <p className="text-gray-300 text-xs leading-relaxed">💡 عندك فكرة، اقتراح، ملاحظة، أو حتى شيء تشوف أنه ممكن يجعل اللعبة أفضل؟ لا تتردد بالتواصل معي عبر حسابات Football Investor.<br/><br/>أقرأ اقتراحات اللاعبين بشكل مستمر، والكثير من الأفكار الموجودة داخل اللعبة بدأت أساسًا من آراء المجتمع.</p>
            </div>

            <div className="border-t border-white/8 pt-4 text-center">
              <p className="text-gray-400 text-xs">شكرًا لكل شخص دعم المشروع أو جرب اللعبة.</p>
              <p className="text-yellow-400 font-bold text-sm mt-2">— 7GE</p>
              <p className="text-gray-600 text-xs">Creator of Football Investor</p>
            </div>

          </div>
        )}

        {/* Game Mode */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Game Mode — وضع اللعبة</div>
          <div className="grid grid-cols-2 gap-3">
            {(["single","versus"] as const).map((m) => {
              const cfg = {
                single: { emoji: "👤", en: "Single Player", ar: "لاعب واحد", color: "#10b981" },
                versus: { emoji: "👥", en: "Versus Friend", ar: "ضد صديق", color: "#3b82f6" },
              }[m];
              return (
                <button key={m} onClick={() => setMode(m)}
                  className="py-5 rounded-none font-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={mode === m ? {
                    borderColor: cfg.color, borderWidth: 2, borderStyle: "solid",
                    background: `${cfg.color}22`,
                    boxShadow: `0 0 25px ${cfg.color}44`
                  } : { border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-3xl mb-2">{cfg.emoji}</div>
                  <div className="text-white text-base">{cfg.en}</div>
                  <div className="text-gray-400 text-sm font-normal mt-1">{cfg.ar}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Starting Budget — الميزانية الابتدائية</div>
          <div className="grid grid-cols-2 gap-3">
            {BUDGETS.map((b) => (
              <button key={b.key} onClick={() => setBudgetMode(b.key)}
                className="py-4 rounded-none font-black transition-all duration-200 hover:scale-[1.02]"
                style={budgetMode === b.key ? {
                  border: "2px solid #10b981", background: "rgba(16,185,129,0.15)", boxShadow: "0 0 20px rgba(16,185,129,0.25)"
                } : { border: "2px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <div className="text-2xl mb-1">{b.emoji}</div>
                <div className="text-white text-base">{b.amount}</div>
                <div className="text-gray-400 text-sm font-normal">{b.en}</div>
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
                className="px-4 py-4 text-white placeholder-gray-600 font-bold text-base focus:outline-none transition-colors rounded-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }} />
              {mode === "versus" && (
                <input value={team2Name} onChange={(e) => setTeam2Name(e.target.value)} placeholder="Team 2"
                  className="px-4 py-4 text-white placeholder-gray-600 font-bold text-base focus:outline-none transition-colors rounded-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }} />
              )}
            </div>
          </div>
        )}

        {/* Game Length */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Game Length — طول اللعبة</div>
          <div className="grid grid-cols-2 gap-3">
            {([["classic","🏆","Classic","2008 → 2028"],["infinite","∞","Infinite","بلا نهاية"]] as const).map(([k,e,en,desc]) => (
              <button key={k} onClick={() => setGameLengthMode(k)}
                className="py-4 rounded-none font-black transition-all"
                style={gameLengthMode === k ? {
                  border: "2px solid #D4AF37", background: "rgba(212,175,55,0.12)"
                } : { border: "2px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <div className="text-2xl mb-1">{e}</div>
                <div className="text-white text-sm">{en}</div>
                <div className="text-gray-500 text-xs font-normal">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Events */}
        <div style={sectionStyle}>
          <div className="flex items-center justify-between">
            <div>
              <div className={sectionTitle} style={{ marginBottom: 0 }}>Season Events — أحداث الموسم</div>
              <div className="text-gray-500 text-xs mt-1">Random events that affect player values</div>
            </div>
            <button onClick={() => setEventsEnabled(!eventsEnabled)}
              className="px-4 py-2 rounded-none font-bold text-sm transition-all"
              style={eventsEnabled ? {
                background: "rgba(16,185,129,0.15)", border: "1px solid #10b981", color: "#10b981"
              } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280" }}>
              {eventsEnabled ? "ON" : "OFF"}
            </button>
          </div>
          {eventsEnabled && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {([["all","🎲","All Events"],["positive","✅","Positive Only"],["negative","❌","Negative Only"]] as const).map(([k,e,label]) => (
                <button key={k} onClick={() => setEventType(k)}
                  className="py-2 rounded-none text-xs font-bold transition-all"
                  style={eventType === k ? {
                    border: "1px solid #10b981", background: "rgba(16,185,129,0.12)", color: "#10b981"
                  } : { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#6b7280" }}>
                  {e} {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timer */}
        <div style={sectionStyle}>
          <div className={sectionTitle}>Turn Timer — مؤقت الدور</div>
          <div className="grid grid-cols-4 gap-2">
            {TIMER_OPTIONS.map((t) => (
              <button key={String(t.value)} onClick={() => setTimerSeconds(t.value)}
                className="py-3 rounded-none font-bold text-sm transition-all"
                style={timerSeconds === t.value ? {
                  border: "1px solid #10b981", background: "rgba(16,185,129,0.12)", color: "#10b981"
                } : { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#6b7280" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <button onClick={handleStart} disabled={!mode}
          className="w-full py-6 rounded-none font-black text-xl tracking-widest uppercase transition-all duration-300 mb-6"
          style={mode ? {
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
          } : {
            background: "rgba(255,255,255,0.05)",
            color: "#374151",
            cursor: "not-allowed",
          }}>
          {mode ? "▶  Start Game" : "Select a Mode to Continue"}
        </button>

      </div>
    </main>
  );
}