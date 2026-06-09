"use client";

import { useState, useEffect } from "react";
import type { BudgetMode, GameMode, EventType } from "../game/types";
import { getSaveInfo, deleteSave } from "../game/saveSystem";

type StartConfig = {
  mode: GameMode;
  budgetMode: BudgetMode;
  team1Name: string;
  team2Name: string;
  eventsEnabled: boolean;
  eventType: EventType;
  timerSeconds: number | null;
  gameLengthMode: "classic" | "infinite";
  negativeBudgetEndsGame: boolean;
};

type Props = { onStart: (config: StartConfig) => void; onContinue?: () => void };

// ── Reusable styled button ──────────────────
function Btn({
  selected, color, onClick, children, className = "",
}: {
  selected: boolean; color: string; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-150 font-black rounded-none select-none ${className}`}
      style={selected ? {
        background: `${color}22`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}55, inset 0 0 12px ${color}11`,
        transform: "scale(1.02)",
        color: "white",
      } : {
        background: "rgba(255,255,255,0.04)",
        border: "2px solid rgba(255,255,255,0.08)",
        color: "#6b7280",
      }}
      onMouseEnter={e => { if (!selected) { (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}66`; (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af"; } }}
      onMouseLeave={e => { if (!selected) { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; } }}
      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)"; }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = selected ? "scale(1.02)" : "scale(1)"; }}>
      {children}
    </button>
  );
}

// ── Section wrapper ─────────────────────────
function Section({ label, accent = "#10b981", children }: { label: string; accent?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-none overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
      <div className="px-4 py-2 flex items-center gap-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="w-1 h-4 rounded-full" style={{ background: accent }} />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: accent }}>{label}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

const HOW_TO_PLAY = [
  { emoji: "💰", en: "Buy players within your budget each season", ar: "اشتري لاعبين ضمن ميزانيتك كل موسم" },
  { emoji: "📈", en: "Player values rise and fall based on performance", ar: "قيم اللاعبين ترتفع وتنخفض حسب الأداء" },
  { emoji: "🏆", en: "Events like Ballon d'Or can boost player value", ar: "الأحداث كالكرة الذهبية ترفع قيمة اللاعب" },
  { emoji: "💼", en: "Sell players at the right time for maximum profit", ar: "بع اللاعبين في الوقت المناسب لأقصى ربح" },
  { emoji: "📋", en: "Manage contracts — don't let players leave for free", ar: "أدر العقود — لا تترك اللاعبين يرحلون مجاناً" },
];

export default function StartScreen({ onStart, onContinue }: Props) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("balanced");
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [eventType, setEventType] = useState<EventType>("all");
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [gameLengthMode, setGameLengthMode] = useState<"classic" | "infinite">("classic");
  const [negativeBudgetEndsGame, setNegativeBudgetEndsGame] = useState(true);
  const [easterClicks, setEasterClicks] = useState(0);
  const [easterUnlocked, setEasterUnlocked] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showDevMsg, setShowDevMsg] = useState(false);
  const [saveInfo, setSaveInfo] = useState<{ season: number; mode: string; savedAt: string } | null>(null);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);

  useEffect(() => {
    const info = getSaveInfo();
    setSaveInfo(info);
    if (info) setShowSavePopup(true);
  }, []);

  function handleStart() {
    if (!mode) return;
    onStart({ mode, budgetMode, team1Name: team1Name.trim() || "Team 1", team2Name: team2Name.trim() || "Team 2", eventsEnabled, eventType, timerSeconds, gameLengthMode, negativeBudgetEndsGame });
  }

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 20% 50%, #050d1a 0%, #060912 60%, #030610 100%)" }}>

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: "rgba(16,185,129,0.06)" }} />
        <div className="absolute bottom-[-20%] right-[10%] w-[400px] h-[400px] rounded-full blur-[180px]" style={{ background: "rgba(59,130,246,0.05)" }} />
      </div>

      {/* ── Save popup ── */}
      {showSavePopup && saveInfo && !showNewGameConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.88)" }}>
          <div className="w-full max-w-sm p-6 shadow-2xl" style={{ background: "#0d1117", border: "1px solid rgba(16,185,129,0.3)", boxShadow: "0 0 40px rgba(16,185,129,0.15)" }}>
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">💾</div>
              <div className="text-white font-black text-xl">Save Found</div>
              <div className="text-gray-500 text-xs mt-1">يوجد حفظ سابق للعبة</div>
            </div>
            <div className="p-3 mb-5 text-xs space-y-1.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex justify-between text-gray-400"><span>Season</span><span className="text-white font-bold">{saveInfo.season}</span></div>
              <div className="flex justify-between text-gray-400"><span>Mode</span><span className="text-white font-bold capitalize">{saveInfo.mode}</span></div>
              <div className="flex justify-between text-gray-400"><span>Saved</span><span className="text-white font-bold">{new Date(saveInfo.savedAt).toLocaleDateString()}</span></div>
            </div>
            <button onClick={() => { setShowSavePopup(false); onContinue?.(); }}
              className="w-full py-3.5 font-black text-sm uppercase tracking-wider mb-2 transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "white", boxShadow: "0 4px 20px rgba(16,185,129,0.4)" }}>
              ▶ Continue Game — متابعة
            </button>
            <button onClick={() => { setShowSavePopup(false); setShowNewGameConfirm(true); }}
              className="w-full py-3 font-bold text-sm uppercase transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280" }}>
              New Game — لعبة جديدة
            </button>
          </div>
        </div>
      )}

      {/* ── New game confirm ── */}
      {showNewGameConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.88)" }}>
          <div className="w-full max-w-sm p-6 shadow-2xl" style={{ background: "#0d1117", border: "1px solid rgba(239,68,68,0.3)", boxShadow: "0 0 40px rgba(239,68,68,0.1)" }}>
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-white font-black text-base">Starting a new game will delete your save.</div>
              <div className="text-gray-500 text-sm mt-1">Are you sure?</div>
            </div>
            <button onClick={() => { deleteSave(); setSaveInfo(null); setShowNewGameConfirm(false); }}
              className="w-full py-3.5 font-black text-sm uppercase mb-2 transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", color: "#ef4444" }}>
              Yes, Delete & Start New
            </button>
            <button onClick={() => { setShowNewGameConfirm(false); setShowSavePopup(true); }}
              className="w-full py-3 font-bold text-sm uppercase transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-xl">

        {/* ── Title ── */}
        <div className="text-center mb-6">
          <p onClick={() => { const n = easterClicks+1; setEasterClicks(n); if(n>=5) setEasterUnlocked(true); }}
            className="text-sm font-black mb-3 cursor-pointer tracking-wide" style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.5)" }}>
            👀 حجي المطور المستقل
          </p>
          <div style={{ fontSize: "72px", fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg,#fff 0%,#a8f5d0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Football</div>
          <div style={{ fontSize: "72px", fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg,#10b981,#34d399,#6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Investor</div>
          <p className="text-gray-500 text-xs tracking-[0.3em] uppercase mt-3">Build The Most Valuable Squad</p>
          {easterUnlocked && <p className="mt-2 text-yellow-400 text-sm font-black animate-pulse">😏 شطور... الحين دور عن بطاقتي.</p>}
        </div>

        {/* ── How To Play ── */}
        <button onClick={() => setShowHowToPlay(!showHowToPlay)}
          className="w-full mb-3 py-3 font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
          {showHowToPlay ? "▲ Hide Guide — إخفاء الدليل" : "📖 How To Play — كيف تلعب"}
        </button>
        {showHowToPlay && (
          <div className="mb-3 p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {HOW_TO_PLAY.map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-3" style={{ borderBottom: i < HOW_TO_PLAY.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <div><div className="text-white font-bold text-xs">{item.en}</div><div className="text-gray-500 text-[10px] mt-0.5">{item.ar}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* ── Developer Message ── */}
        <button onClick={() => setShowDevMsg(!showDevMsg)}
          className="w-full mb-4 py-3 font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
          style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", color: "#D4AF37" }}>
          {showDevMsg ? "▲ إخفاء رسالة المطور" : "💌 رسالة من المطور"}
        </button>
        {showDevMsg && (
          <div className="mb-4 p-5 text-sm leading-relaxed" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)" }}>
            <p className="text-gray-300 mb-3">السلام عليكم،</p>
            <p className="text-gray-300 mb-3">أنا يوسف <span className="text-yellow-400 font-bold">(7GE)</span>، شخص يعشق كرة القدم وبايرن ميونخ وقضى ساعات طويلة في ألعاب الكورة.</p>
            <p className="text-gray-300 mb-3">في يوم جتني فكرة: <span className="text-white font-bold italic">"ليش أكون مدرب… إذا أقدر أكون مستثمر؟"</span></p>
            <p className="text-gray-300 mb-3">المشروع بدأ كتجربة من الصفر وتحول للعبة كاملة تجمع بين الاستثمار، العقود، الرعاة، المزادات، والأحداث المفاجئة.</p>
            <p className="text-gray-300 mb-4">إذا استمتعت باللعبة أو ضيعت ساعات تحاول تثبت أن عندك عقلية استثمارية أفضل من أصحابك… فأعتبر مهمتي نجحت. 😄</p>
            <div className="border-t border-white/8 pt-3 mb-3">
              <p className="text-yellow-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">📱 حساباتي (7GE)</p>
              <p className="text-gray-500 text-xs">X: <span className="text-white">@7geisthebest</span> &nbsp;|&nbsp; Instagram: <span className="text-white">@7geisthebest</span></p>
            </div>
            <div className="border-t border-white/8 pt-3 mb-3">
              <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">🏟 حسابات اللعبة</p>
              <p className="text-gray-500 text-xs">X: <span className="text-white">@Football_inv</span> &nbsp;|&nbsp; Instagram: <span className="text-white">@Football_Investor</span> &nbsp;|&nbsp; TikTok: <span className="text-white">@Football_investor</span></p>
            </div>
            <div className="border-t border-white/8 pt-3 text-center">
              <p className="text-gray-500 text-xs">شكرًا لكل شخص دعم المشروع أو جرب اللعبة.</p>
              <p className="text-yellow-400 font-bold text-sm mt-1">— 7GE</p>
              <p className="text-gray-600 text-[10px]">Creator of Football Investor</p>
            </div>
          </div>
        )}

        {/* ── GAME MODE ── */}
        <Section label="Game Mode — وضع اللعبة" accent="#3b82f6">
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { key:"single", emoji:"👤", en:"Single Player", ar:"لاعب واحد", color:"#3b82f6" },
              { key:"versus", emoji:"👥", en:"Versus Friend", ar:"ضد صديق", color:"#a855f7" },
            ] as const).map(m => (
              <Btn key={m.key} selected={mode===m.key} color={m.color} onClick={() => setMode(m.key)} className="py-4 text-center">
                <div className="text-2xl mb-1.5">{m.emoji}</div>
                <div className="text-sm leading-none">{m.en}</div>
                <div className="text-[10px] font-normal mt-1 opacity-60">{m.ar}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* ── TEAM NAMES ── */}
        {mode && (
          <Section label="Team Names — أسماء الفرق" accent="#6366f1">
            <div className={`grid gap-3 ${mode === "versus" ? "grid-cols-2" : "grid-cols-1"}`}>
              <input value={team1Name} onChange={e => setTeam1Name(e.target.value)} placeholder="Team 1"
                className="px-4 py-3 text-white placeholder-gray-600 font-bold text-sm focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "#6366f155")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              {mode === "versus" && (
                <input value={team2Name} onChange={e => setTeam2Name(e.target.value)} placeholder="Team 2"
                  className="px-4 py-3 text-white placeholder-gray-600 font-bold text-sm focus:outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => (e.target.style.borderColor = "#a855f755")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              )}
            </div>
          </Section>
        )}

        {/* ── STARTING BUDGET ── */}
        <Section label="Starting Budget — الميزانية" accent="#D4AF37">
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { key:"lucky",       emoji:"🍀", label:"Lucky",       amount:"€10M",  color:"#10b981" },
              { key:"balanced",    emoji:"⚖️", label:"Balanced",    amount:"€30M",  color:"#3b82f6" },
              { key:"rich",        emoji:"💰", label:"Rich",        amount:"€100M", color:"#D4AF37" },
              { key:"billionaire", emoji:"💎", label:"Billionaire", amount:"€200M", color:"#06b6d4" },
            ] as const).map(b => (
              <Btn key={b.key} selected={budgetMode===b.key} color={b.color} onClick={() => setBudgetMode(b.key)} className="py-3.5 text-center">
                <div className="text-xl mb-1">{b.emoji}</div>
                <div className="text-base font-black leading-none" style={budgetMode===b.key ? { color: b.color } : {}}>{b.amount}</div>
                <div className="text-[10px] font-normal mt-0.5 opacity-60">{b.label}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* ── GAME LENGTH ── */}
        <Section label="Game Length — طول اللعبة" accent="#D4AF37">
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { key:"classic",  emoji:"🏆", label:"Classic",  desc:"2008 → 2028", color:"#D4AF37" },
              { key:"infinite", emoji:"♾️", label:"Infinite", desc:"بلا نهاية",  color:"#a855f7" },
            ] as const).map(g => (
              <Btn key={g.key} selected={gameLengthMode===g.key} color={g.color} onClick={() => setGameLengthMode(g.key)} className="py-3.5 text-center">
                <div className="text-xl mb-1">{g.emoji}</div>
                <div className="text-sm leading-none">{g.label}</div>
                <div className="text-[10px] font-normal mt-0.5 opacity-50">{g.desc}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* ── SEASON EVENTS ── */}
        <Section label="Season Events — أحداث الموسم" accent="#10b981">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-white text-xs font-bold">Random events affecting player values</div>
              <div className="text-gray-600 text-[10px] mt-0.5">أحداث عشوائية تؤثر على قيم اللاعبين</div>
            </div>
            <button onClick={() => setEventsEnabled(!eventsEnabled)}
              className="px-4 py-2 font-black text-sm transition-all hover:scale-105 active:scale-95"
              style={eventsEnabled ? {
                background: "rgba(16,185,129,0.15)", border: "1px solid #10b981", color: "#10b981", boxShadow: "0 0 12px rgba(16,185,129,0.3)"
              } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#4b5563" }}>
              {eventsEnabled ? "ON" : "OFF"}
            </button>
          </div>
          {eventsEnabled && (
            <div className="grid grid-cols-3 gap-2">
              {([
                { key:"all",      emoji:"🎲", label:"All",           color:"#10b981" },
                { key:"positive", emoji:"✅", label:"Positive Only", color:"#3b82f6" },
                { key:"negative", emoji:"❌", label:"Negative Only", color:"#ef4444" },
              ] as const).map(e => (
                <Btn key={e.key} selected={eventType===e.key} color={e.color} onClick={() => setEventType(e.key)} className="py-2.5 text-center">
                  <div className="text-base mb-0.5">{e.emoji}</div>
                  <div className="text-[10px] leading-tight">{e.label}</div>
                </Btn>
              ))}
            </div>
          )}
        </Section>

        {/* ── NEGATIVE BUDGET ── */}
        <Section label="Negative Budget — الميزانية بالسالب" accent="#ef4444">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-xs font-bold">{negativeBudgetEndsGame ? "Game ends when budget goes negative" : "Game continues if budget goes negative"}</div>
              <div className="text-gray-600 text-[10px] mt-0.5">{negativeBudgetEndsGame ? "تنتهي اللعبة عند الميزانية السالبة" : "تكمل اللعبة عند الميزانية السالبة"}</div>
            </div>
            <button onClick={() => setNegativeBudgetEndsGame(!negativeBudgetEndsGame)}
              className="px-4 py-2 font-black text-sm transition-all hover:scale-105 active:scale-95"
              style={negativeBudgetEndsGame ? {
                background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", color: "#ef4444", boxShadow: "0 0 12px rgba(239,68,68,0.25)"
              } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#4b5563" }}>
              {negativeBudgetEndsGame ? "ON" : "OFF"}
            </button>
          </div>
        </Section>

        {/* ── TURN TIMER ── */}
        <Section label="Turn Timer — مؤقت الدور" accent="#f59e0b">
          <div className="grid grid-cols-4 gap-2">
            {([
              { val:null,  label:"Off",  emoji:"🚫", color:"#10b981" },
              { val:15,    label:"15s",  emoji:"⚡", color:"#3b82f6" },
              { val:30,    label:"30s",  emoji:"⏱", color:"#f97316" },
              { val:60,    label:"60s",  emoji:"🔴", color:"#ef4444" },
            ] as const).map(t => (
              <Btn key={String(t.val)} selected={timerSeconds===t.val} color={t.color} onClick={() => setTimerSeconds(t.val)} className="py-3 text-center">
                <div className="text-base mb-0.5">{t.emoji}</div>
                <div className="text-xs">{t.label}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* ── START ── */}
        <button onClick={handleStart} disabled={!mode}
          className="w-full py-5 font-black text-base uppercase tracking-[0.2em] transition-all duration-200 mb-4"
          style={mode ? {
            background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
            color: "white",
            boxShadow: "0 8px 32px rgba(16,185,129,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
            border: "1px solid rgba(16,185,129,0.5)",
          } : {
            background: "rgba(255,255,255,0.04)",
            color: "#374151",
            cursor: "not-allowed",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          onMouseEnter={e => { if (mode) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.01)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
          onMouseDown={e => { if (mode) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
          onMouseUp={e => { if (mode) (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}>
          {mode ? "▶  Start Game" : "Select a Mode to Continue"}
        </button>

      </div>
    </main>
  );
}