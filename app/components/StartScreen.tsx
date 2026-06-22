"use client";

import { useState, useEffect } from "react";
import type { BudgetMode, GameMode, EventType } from "../game/types";
import { getAllSlots, deleteSlot } from "../game/saveSystem";
import type { SlotInfo } from "../game/saveSystem";
import HowToPlayModal from "./HowToPlayModal";

type StartConfig = {
  mode: GameMode;
  singlePlayerStyle?: "investor" | "clubOwner";
  budgetMode: BudgetMode;
  team1Name: string;
  team2Name: string;
  eventsEnabled: boolean;
  eventType: EventType;
  timerSeconds: number | null;
  gameLengthMode: "classic" | "infinite";
  negativeBudgetEndsGame: boolean;
  easterUnlocked: boolean;
};

type Props = { onStart: (config: StartConfig) => void; onLoad: (slotNum: number) => void };

function Btn({
  selected, color, onClick, children, className = "",
}: {
  selected: boolean; color: string; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-150 font-black select-none overflow-hidden ${className}`}
      style={selected ? {
        background: `${color}18`,
        border: `1.5px solid ${color}`,
        boxShadow: `0 0 18px ${color}44, inset 0 0 10px ${color}0e`,
        borderRadius: "10px",
        color: "white",
      } : {
        background: "rgba(17,24,39,0.7)",
        border: "1.5px solid rgba(255,255,255,0.07)",
        borderRadius: "10px",
        color: "#6b7280",
      }}
      onMouseEnter={e => { if (!selected) { (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}55`; (e.currentTarget as HTMLButtonElement).style.color = "#d1d5db"; } }}
      onMouseLeave={e => { if (!selected) { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; } }}
      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)"; }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
      {children}
    </button>
  );
}

function Section({ label, accent = "#FFD54F", children }: { label: string; accent?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex justify-center mb-3">
        <div style={{
          background: "rgba(17,24,39,0.9)",
          border: `1.5px solid ${accent}55`,
          borderRadius: "999px",
          padding: "5px 20px",
          backdropFilter: "blur(8px)",
          boxShadow: `0 0 16px ${accent}22`,
          display: "inline-flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{ width:"6px", height:"6px", borderRadius:"50%", background: accent, boxShadow:`0 0 6px ${accent}` }} />
          <span style={{ fontSize:"10px", fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color: accent }}>
            {label}
          </span>
        </div>
      </div>
      <div style={{
        background: "rgba(17,24,39,0.6)",
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: "14px",
        padding: "12px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        {children}
      </div>
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

export default function StartScreen({ onStart, onLoad }: Props) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [singlePlayerStyle, setSinglePlayerStyle] = useState<"investor" | "clubOwner" | null>(null);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("balanced");
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [eventType, setEventType] = useState<EventType>("all");
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [gameLengthMode, setGameLengthMode] = useState<"classic" | "infinite">("classic");
  const [negativeBudgetEndsGame, setNegativeBudgetEndsGame] = useState(true);
  const [easterClicks, setEasterClicks] = useState(0);
  const [easterUnlocked, setEasterUnlocked] = useState<boolean>(() => {
    try { return localStorage.getItem("fi_easter_unlocked") === "1"; } catch { return false; }
  });
  const [showShatoor, setShowShatoor] = useState(false);
  const [showEasterPopup, setShowEasterPopup] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showDevMsg, setShowDevMsg] = useState(false);
  const [slots, setSlots] = useState<(SlotInfo | null)[]>([]);
  const [showSaves, setShowSaves] = useState(false);

  // ── Background transition state ──
  const [activeBg, setActiveBg] = useState<"default" | "classic" | "infinite">("default");
  const [bgFading, setBgFading] = useState(false);

  useEffect(() => {
    setSlots(getAllSlots());
  }, []);

  // ── Handle game length selection with bg transition ──
  function handleGameLengthSelect(val: "classic" | "infinite") {
    const target = val === "classic" ? "classic" : "infinite";
    if (gameLengthMode === val) {
      // already selected — toggle back to default
      setBgFading(true);
      setTimeout(() => { setActiveBg("default"); setBgFading(false); }, 600);
    } else {
      setBgFading(true);
      setTimeout(() => { setActiveBg(target); setBgFading(false); }, 600);
    }
    setGameLengthMode(val);
  }

  function handleStart() {
    if (!mode) return;
    if (mode === "single" && !singlePlayerStyle) return;
    onStart({
      mode,
      singlePlayerStyle: mode === "single" ? singlePlayerStyle! : undefined,
      budgetMode, team1Name: team1Name.trim() || "Team 1", team2Name: team2Name.trim() || "Team 2",
      eventsEnabled, eventType, timerSeconds, gameLengthMode, negativeBudgetEndsGame, easterUnlocked,
    });
  }

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#050810" }}>

      {/* ── Background image layer 1 (default) ── */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/start-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: activeBg === "default" ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
        }} />

      {/* ── Background image layer 2 (2028) ── */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: activeBg === "classic" ? "url('/images/bg-2028.png')" : "url('/images/bg-infinite.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: activeBg !== "default" ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
        }} />

      {/* ── Flash overlay during transition ── */}
      {bgFading && (
        <div className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.08)",
            animation: "bgFlash 0.6s ease-in-out forwards",
          }} />
      )}

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 z-[1]"
        style={{ background: "rgba(5,8,16,0.55)" }} />

      {/* ── Vignette ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />

      {/* ── Grid ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <style>{`
        @keyframes bgFlash {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* ── 10-Slot Saves Panel ── */}
      {showSaves && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md overflow-hidden" style={{ background: "linear-gradient(160deg,#080c14,#0a0f1e)", border: "1px solid rgba(255,213,79,0.3)", boxShadow: "0 0 60px rgba(255,213,79,0.1)", borderRadius: "16px", animation: "modalSlideUp 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,213,79,0.06)" }}>
              <div>
                <div className="font-black text-white text-base tracking-wide">💾 المحفوظات</div>
                <div className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,213,79,0.5)" }}>Saved Games — 10 Slots</div>
              </div>
              <button onClick={() => setShowSaves(false)}
                className="w-8 h-8 flex items-center justify-center font-black text-lg transition-all hover:scale-110 active:scale-90"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", borderRadius: "6px" }}>
                ×
              </button>
            </div>
            <div className="p-4 space-y-2" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {slots.map((info, i) => {
                const slotNum = i + 1;
                const modeLabel = !info ? "—" : info.singlePlayerStyle === "clubOwner" ? "🏟️ مالك نادي" : info.mode === "versus" ? "👥 ضد صديق" : "💼 مستثمر";
                return (
                  <div key={slotNum} style={{
                    background: info ? "rgba(255,213,79,0.06)" : "rgba(255,255,255,0.02)",
                    border: info ? "1px solid rgba(255,213,79,0.2)" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <div style={{ fontSize: "11px", fontWeight: 900, color: info ? "#FFD54F" : "#374151", minWidth: "22px", textAlign: "center" }}>
                      {slotNum}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {info ? (
                        <>
                          <div style={{ fontSize: "12px", fontWeight: 800, color: "white", lineHeight: 1.3 }}>{modeLabel}</div>
                          <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>
                            الموسم {info.season} · {new Date(info.savedAt).toLocaleDateString("ar-SA")}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: "11px", color: "#374151", fontStyle: "italic" }}>خانة فارغة</div>
                      )}
                    </div>
                    {info && (
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button
                          onClick={() => { setShowSaves(false); onLoad(slotNum); }}
                          style={{ fontSize: "10px", fontWeight: 800, padding: "5px 10px", background: "rgba(16,185,129,0.15)", border: "1px solid #10b981", color: "#10b981", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" }}>
                          ▶ تحميل
                        </button>
                        <button
                          onClick={() => { deleteSlot(slotNum); setSlots(getAllSlots()); }}
                          style={{ fontSize: "10px", fontWeight: 800, padding: "5px 8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", borderRadius: "6px", cursor: "pointer" }}>
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <style>{`
            @keyframes modalSlideUp{from{opacity:0;transform:translateY(30px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
          `}</style>
        </div>
      )}

      <div className="relative z-10 w-full max-w-xl">

        {/* ── Logo ── */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-3">
            <button onClick={() => { setShowHowToPlay(h => !h); setShowDevMsg(false); }} style={{ borderRadius:"999px", padding:"8px 16px", background:showHowToPlay?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.05)", border:showHowToPlay?"1.5px solid rgba(99,102,241,0.7)":"1.5px solid rgba(255,255,255,0.1)", color:showHowToPlay?"#a5b4fc":"#6b7280", fontSize:"11px", fontWeight:800, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.15s", flexShrink:0 }}>
              📖 كيف تلعب
            </button>
            <img
              src="/images/logo.png"
              alt="Football Investor"
              style={{ width:"220px", height:"220px", objectFit:"contain", filter:"drop-shadow(0 0 40px rgba(212,175,55,0.4))", mixBlendMode:"screen" as const, flexShrink:0 }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <button onClick={() => { setShowDevMsg(d => !d); setShowHowToPlay(false); }} style={{ borderRadius:"999px", padding:"8px 16px", background:showDevMsg?"rgba(212,175,55,0.12)":"rgba(255,255,255,0.05)", border:showDevMsg?"1.5px solid rgba(212,175,55,0.7)":"1.5px solid rgba(255,255,255,0.1)", color:showDevMsg?"#D4AF37":"#6b7280", fontSize:"11px", fontWeight:800, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.15s", flexShrink:0 }}>
              💌 رسالة المطور
            </button>
          </div>
          <p onClick={() => {
              const n = easterClicks + 1;
              setEasterClicks(n);
              if (n >= 5) {
                if (!easterUnlocked) {
                  setEasterUnlocked(true);
                  try { localStorage.setItem("fi_easter_unlocked", "1"); } catch {}
                }
                setEasterClicks(0);
                setShowShatoor(true);
                setTimeout(() => {
                  setShowShatoor(false);
                  setTimeout(() => setShowEasterPopup(true), 200);
                }, 1400);
              }
            }}
            className="text-sm font-black mb-3 cursor-pointer select-none transition-all duration-150"
            style={{
              color: "#D4AF37",
              textShadow: `0 0 ${20 + easterClicks * 8}px rgba(212,175,55,${0.5 + easterClicks * 0.1})`,
              transform: "scale(1)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLParagraphElement).style.transform = "scale(1.06)"; (e.currentTarget as HTMLParagraphElement).style.textShadow = "0 0 30px rgba(212,175,55,0.8)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLParagraphElement).style.transform = "scale(1)"; (e.currentTarget as HTMLParagraphElement).style.textShadow = `0 0 ${20 + easterClicks * 8}px rgba(212,175,55,0.5)`; }}
            onMouseDown={e => { (e.currentTarget as HTMLParagraphElement).style.transform = "scale(0.95)"; }}
            onMouseUp={e => { (e.currentTarget as HTMLParagraphElement).style.transform = "scale(1.06)"; }}>
            👀 حجي المطور المستقل
            {easterClicks > 0 && easterClicks < 5 && (
              <span className="ml-2 text-xs opacity-70">{"👀".repeat(easterClicks)}</span>
            )}
          </p>

          {showShatoor && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
              <p className="font-black text-center"
                style={{
                  fontSize: "96px",
                  color: "#D4AF37",
                  textShadow: "0 0 60px rgba(212,175,55,0.9), 0 0 120px rgba(212,175,55,0.5)",
                  animation: "shatoorAnim 1.4s ease forwards",
                }}>
                شطور
              </p>
              <style>{`
                @keyframes shatoorAnim {
                  0%   { opacity: 0; transform: scale(0.5) translateY(20px); }
                  30%  { opacity: 1; transform: scale(1.1) translateY(-8px); }
                  60%  { opacity: 1; transform: scale(1.0) translateY(-4px); }
                  100% { opacity: 0; transform: scale(1.15) translateY(-20px); }
                }
              `}</style>
            </div>
          )}

          {showEasterPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.88)" }}>
              <div className="w-full max-w-sm p-7 text-center shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #0d1117, #1a1200)",
                  border: "1px solid rgba(212,175,55,0.5)",
                  boxShadow: "0 0 60px rgba(212,175,55,0.2)",
                  animation: "fadeInScale 0.4s ease forwards",
                }}>
                <style>{`
                  @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.85); }
                    to   { opacity: 1; transform: scale(1); }
                  }
                `}</style>
                <div className="text-5xl mb-4">😏</div>
                <p className="text-white font-black text-lg leading-relaxed mb-6"
                  style={{ textShadow: "0 0 20px rgba(212,175,55,0.3)" }}>
                  شطور... الحين دور عن بطاقتي و بطايق الشباب في اللعبة 😏
                </p>
                <button onClick={() => setShowEasterPopup(false)}
                  className="w-full py-3 font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #b8960a)",
                    color: "#000",
                    boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
                  }}>
                  ✅ فهمت
                </button>
              </div>
            </div>
          )}
          <p className="text-gray-500 text-xs tracking-[0.3em] uppercase mt-1">Build The Most Valuable Squad</p>

          {/* ── Saves button ── */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => { setSlots(getAllSlots()); setShowSaves(true); }}
              style={{
                borderRadius: "999px", padding: "8px 22px",
                background: slots.some(Boolean) ? "rgba(255,213,79,0.12)" : "rgba(255,255,255,0.05)",
                border: slots.some(Boolean) ? "1.5px solid rgba(255,213,79,0.6)" : "1.5px solid rgba(255,255,255,0.1)",
                color: slots.some(Boolean) ? "#FFD54F" : "#6b7280",
                fontSize: "12px", fontWeight: 800, cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: slots.some(Boolean) ? "0 0 14px rgba(255,213,79,0.2)" : "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
              💾 المحفوظات {slots.filter(Boolean).length > 0 && `(${slots.filter(Boolean).length}/10)`}
            </button>
          </div>
        </div>

        {showHowToPlay && (
          <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
        )}

        {showDevMsg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", animation:"modalFadeIn 0.25s ease-out" }}>
            <div className="w-full max-w-md overflow-hidden"
              style={{ background:"linear-gradient(160deg,#08070000,#0d0a00)", border:"1px solid rgba(212,175,55,0.4)", boxShadow:"0 0 60px rgba(212,175,55,0.15)", animation:"modalSlideUp 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(212,175,55,0.1)", background:"rgba(212,175,55,0.06)" }}>
                <div>
                  <div className="font-black text-white text-lg">رسالة المطور</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color:"rgba(212,175,55,0.5)" }}>Developer Message</div>
                </div>
                <button onClick={() => setShowDevMsg(false)}
                  className="w-8 h-8 flex items-center justify-center font-black text-lg transition-all hover:scale-110 active:scale-90"
                  style={{ background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.3)", color:"#FFD54F" }}>
                  ×
                </button>
              </div>
              <div className="p-5 text-sm leading-relaxed" style={{ maxHeight:"70vh", overflowY:"auto" }}>
                <p className="text-gray-300 mb-3">السلام عليكم،</p>
                <p className="text-gray-300 mb-3">أنا يوسف، شخص يعشق كرة القدم وبايرن ميونخ وقضى ساعات طويلة في ألعاب الكورة.</p>
                <p className="text-gray-300 mb-3">في يوم جتني فكرة: <span className="text-white font-bold italic">"ليش أكون مدرب… إذا أقدر أكون مستثمر؟"</span></p>
                <p className="text-gray-300 mb-3">المشروع بدأ كتجربة من الصفر وتحول للعبة كاملة تجمع بين الاستثمار، العقود، الرعاة، المزادات، والأحداث المفاجئة.</p>
                <p className="text-gray-300 mb-4">إذا استمتعت باللعبة أو ضيعت ساعات تحاول تثبت أن عندك عقلية استثمارية أفضل من أصحابك… فأعتبر مهمتي نجحت. 😄</p>
                <div className="pt-3 mb-3" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-yellow-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">📱 حساباتي</p>
                  <p className="text-gray-500 text-xs">X: <span className="text-white">@7geisthebest</span> &nbsp;|&nbsp; Instagram: <span className="text-white">@7geisthebest</span></p>
                </div>
                <div className="pt-3 mb-3" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">🏟 حسابات اللعبة</p>
                  <p className="text-gray-500 text-xs">X: <span className="text-white">@Football_inv</span> &nbsp;|&nbsp; Instagram: <span className="text-white">@Football_Investor</span> &nbsp;|&nbsp; TikTok: <span className="text-white">@Football_investor</span></p>
                </div>
                <div className="pt-3 text-center" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-gray-500 text-xs">شكرًا لكل شخص دعم المشروع أو جرب اللعبة.</p>
                  <p className="text-yellow-400 font-bold text-sm mt-1">— 7GE</p>
                  <p className="text-gray-600 text-[10px]">Creator of Football Investor</p>
                </div>
              </div>
            </div>
            <style>{`
              @keyframes modalFadeIn{from{opacity:0}to{opacity:1}}
              @keyframes modalSlideUp{from{opacity:0;transform:translateY(30px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
            `}</style>
          </div>
        )}

        {/* ── GAME MODE ── */}
        <Section label="Game Mode — وضع اللعبة" accent="#FFD54F">
          <div className="grid grid-cols-2 gap-2">
            {([
              { key:"single", emoji:"👤", en:"Single Player", ar:"لاعب واحد", color:"#FFD54F" },
              { key:"versus", emoji:"👥", en:"Versus Friend", ar:"ضد صديق", color:"#FFD54F" },
            ] as const).map(m => (
              <Btn key={m.key} selected={mode===m.key} color={m.color} onClick={() => { setMode(m.key); if (m.key !== "single") setSinglePlayerStyle(null); }} className="py-4 text-center">
                <div className="text-2xl mb-1.5">{m.emoji}</div>
                <div className="text-sm leading-none">{m.en}</div>
                <div className="text-[10px] font-normal mt-1 opacity-60">{m.ar}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* ── SINGLE PLAYER STYLE ── */}
        {mode === "single" && (
          <Section label="Play Style — طريقة اللعب" accent="#FFD54F">
            <div className="grid grid-cols-2 gap-2">
              {([
                { key:"investor", emoji:"💼", en:"Investor", ar:"مستثمر", desc:"Buy & sell players for profit" },
                { key:"clubOwner", emoji:"🏟️", en:"Club Owner", ar:"مالك نادي", desc:"Run a club, compete in an 18-team league" },
              ] as const).map(s => (
                <Btn key={s.key} selected={singlePlayerStyle===s.key} color="#FFD54F" onClick={() => setSinglePlayerStyle(s.key)} className="py-4 text-center">
                  <div className="text-2xl mb-1.5">{s.emoji}</div>
                  <div className="text-sm leading-none">{s.en}</div>
                  <div className="text-[10px] font-normal mt-1 opacity-60">{s.ar}</div>
                  <div className="text-[9px] font-normal mt-1 opacity-50">{s.desc}</div>
                </Btn>
              ))}
            </div>
          </Section>
        )}

        {/* ── TEAM NAMES — hidden for clubOwner (club chosen in league selection) ── */}
        {mode && singlePlayerStyle !== "clubOwner" && (
          <Section label="Team Names — أسماء الفرق" accent="#FFD54F">
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
        {/* Club Owner: show info that club is selected in next screen */}
        {mode && singlePlayerStyle === "clubOwner" && (
          <Section label="Club Selection — اختيار النادي" accent="#FFD54F">
            <div className="py-3 text-center" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
              🏟️ ستختار ناديك في الشاشة التالية
              <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                You will select your club in the next screen
              </div>
            </div>
          </Section>
        )}

        {/* ── STARTING BUDGET ── */}
        {singlePlayerStyle === "clubOwner" ? (
          <Section label="Starting Budget — الميزانية" accent="#FFD54F">
            <div className="rounded-xl py-4 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,213,79,0.3)" }}>
              <div className="text-xl mb-1">🏟️</div>
              <div className="text-base font-black leading-none" style={{ color: "#FFD54F" }}>€150M</div>
              <div className="text-[10px] font-normal mt-1 opacity-60">Fixed for Club Owner mode — ميزانية ثابتة لمالك النادي</div>
            </div>
          </Section>
        ) : (
          <Section label="Starting Budget — الميزانية" accent="#FFD54F">
            <div className="grid grid-cols-2 gap-2">
              {([
                { key:"lucky",       emoji:"🍀", label:"Lucky",       amount:"€10M",  color:"#10B981" },
                { key:"balanced",    emoji:"⚖️", label:"Balanced",    amount:"€30M",  color:"#FFD54F" },
                { key:"rich",        emoji:"💰", label:"Rich",        amount:"€100M", color:"#FFD54F" },
                { key:"billionaire", emoji:"💎", label:"Billionaire", amount:"€200M", color:"#10B981" },
              ] as const).map(b => (
                <Btn key={b.key} selected={budgetMode===b.key} color={b.color} onClick={() => setBudgetMode(b.key)} className="py-3.5 text-center">
                  <div className="text-xl mb-1">{b.emoji}</div>
                  <div className="text-base font-black leading-none" style={budgetMode===b.key ? { color: b.color } : {}}>{b.amount}</div>
                  <div className="text-[10px] font-normal mt-0.5 opacity-60">{b.label}</div>
                </Btn>
              ))}
            </div>
          </Section>
        )}

        {/* ── GAME LENGTH ── */}
        <Section label="Game Length — طول اللعبة" accent="#FFD54F">
          <div className="grid grid-cols-2 gap-2">
            {([
              { key:"classic",  emoji:"🏆", label:"Classic",  desc:"2008 → 2028", color:"#FFD54F" },
              { key:"infinite", emoji:"♾️", label:"Infinite", desc:"بلا نهاية",  color:"#FFD54F" },
            ] as const).map(g => (
              <Btn key={g.key} selected={gameLengthMode===g.key} color={g.color} onClick={() => handleGameLengthSelect(g.key)} className="py-3.5 text-center">
                <div className="text-xl mb-1">{g.emoji}</div>
                <div className="text-sm leading-none">{g.label}</div>
                <div className="text-[10px] font-normal mt-0.5 opacity-50">{g.desc}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* ── SEASON EVENTS ── */}
        <Section label="Season Events — أحداث الموسم" accent="#10B981">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-white text-xs font-bold">Random events affecting player values</div>
              <div className="text-gray-600 text-[10px] mt-0.5">أحداث عشوائية تؤثر على قيم اللاعبين</div>
            </div>
            <button onClick={() => setEventsEnabled(!eventsEnabled)}
              className="px-4 py-2 font-black text-sm transition-all hover:scale-105 active:scale-95"
              style={eventsEnabled ? {
                background: "rgba(16,185,129,0.15)", border: "1.5px solid #10B981", color: "#10B981", borderRadius:"8px", boxShadow: "0 0 12px rgba(16,185,129,0.3)"
              } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#4b5563" }}>
              {eventsEnabled ? "ON" : "OFF"}
            </button>
          </div>
          {eventsEnabled && (
            <div className="grid grid-cols-3 gap-2">
              {([
                { key:"all",      emoji:"🎲", label:"All",           color:"#10B981" },
                { key:"positive", emoji:"✅", label:"Positive Only", color:"#FFD54F" },
                { key:"negative", emoji:"❌", label:"Negative Only", color:"#EF4444" },
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
        <Section label="Negative Budget — الميزانية بالسالب" accent="#EF4444">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-xs font-bold">{negativeBudgetEndsGame ? "Game ends when budget goes negative" : "Game continues if budget goes negative"}</div>
              <div className="text-gray-600 text-[10px] mt-0.5">{negativeBudgetEndsGame ? "تنتهي اللعبة عند الميزانية السالبة" : "تكمل اللعبة عند الميزانية السالبة"}</div>
            </div>
            <button onClick={() => setNegativeBudgetEndsGame(!negativeBudgetEndsGame)}
              className="px-4 py-2 font-black text-sm transition-all hover:scale-105 active:scale-95"
              style={negativeBudgetEndsGame ? {
                background: "rgba(239,68,68,0.15)", border: "1.5px solid #EF4444", color: "#EF4444", borderRadius:"8px", boxShadow: "0 0 12px rgba(239,68,68,0.25)"
              } : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#4b5563" }}>
              {negativeBudgetEndsGame ? "ON" : "OFF"}
            </button>
          </div>
        </Section>

        {/* ── TURN TIMER ── */}
        <Section label="Turn Timer — مؤقت الدور" accent="#FFD54F">
          <div className="grid grid-cols-4 gap-2">
            {([
              { val:null,  label:"Off",  emoji:"🚫", color:"#10B981" },
              { val:15,    label:"15s",  emoji:"⚡", color:"#FFD54F" },
              { val:30,    label:"30s",  emoji:"⏱", color:"#FFD54F" },
              { val:60,    label:"60s",  emoji:"🔴", color:"#EF4444" },
            ] as const).map(t => (
              <Btn key={String(t.val)} selected={timerSeconds===t.val} color={t.color} onClick={() => setTimerSeconds(t.val)} className="py-3 text-center">
                <div className="text-base mb-0.5">{t.emoji}</div>
                <div className="text-xs">{t.label}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* ── START ── */}
        <div style={{ position:"relative", marginBottom:"16px" }}>
          <button onClick={handleStart} disabled={!mode || (mode === "single" && !singlePlayerStyle)}
            className="w-full py-5 font-black text-base uppercase tracking-[0.2em] transition-all duration-200 relative overflow-hidden"
            style={(mode && !(mode === "single" && !singlePlayerStyle)) ? {
              background: "linear-gradient(135deg, #b8960a 0%, #FFD54F 40%, #f0c030 60%, #b8960a 100%)",
              color: "#111827",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(255,213,79,0.45), 0 2px 0 rgba(255,255,255,0.2) inset",
              border: "1.5px solid rgba(255,213,79,0.8)",
              letterSpacing: "0.25em",
            } : {
              background: "rgba(17,24,39,0.7)",
              color: "#374151",
              cursor: "not-allowed",
              borderRadius: "12px",
              border: "1.5px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={e => { if (mode) { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.02)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(255,213,79,0.6), 0 2px 0 rgba(255,255,255,0.2) inset"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = mode ? "0 8px 32px rgba(255,213,79,0.45), 0 2px 0 rgba(255,255,255,0.2) inset" : "none"; }}
            onMouseDown={e => { if (mode) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
            onMouseUp={e => { if (mode) (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}>
            {mode && (
              <span style={{
                position:"absolute", top:0, left:0, right:0, bottom:0,
                background:"linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                animation:"startSweep 2.5s ease-in-out infinite",
                pointerEvents:"none",
              }} />
            )}
            <span style={{ position:"relative", zIndex:1 }}>
              {!mode
                ? "Select a Mode to Continue"
                : (mode === "single" && !singlePlayerStyle)
                  ? "Select a Play Style to Continue"
                  : "▶  Start Game"}
            </span>
          </button>
          <style>{`
            @keyframes startSweep {
              0%   { transform: translateX(-100%); }
              50%  { transform: translateX(100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>

      </div>
    </main>
  );
}