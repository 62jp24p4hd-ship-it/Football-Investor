"use client";

import React, { useEffect, useState } from "react";
import { LEAGUE_FLAG } from "../game/clTeams";

export type GroupDrawFixture = {
  round: number;
  opponent: string;
  opponentLeagueId: string;
  isHome: boolean;
};

type Props = {
  userTeamName: string;
  fixtures: GroupDrawFixture[];
  onDone: () => void;
};

// Stable star field
const STARS = Array.from({ length: 55 }, (_, i) => ({
  left: (i * 137.508) % 100,
  top: (i * 97.3) % 100,
  size: 1.2 + (i % 3),
  delay: (i * 0.15) % 3.5,
  dur: 2 + (i % 4),
}));

// League short label
const LEAGUE_SHORT: Record<string, string> = {
  premier_league:    "Premier League",
  bundesliga:        "Bundesliga",
  ligue_1:           "Ligue 1",
  serie_a:           "Serie A",
  la_liga:           "La Liga",
  saudi_league:      "Saudi Pro League",
  portuguese_league: "Primeira Liga",
  eredivisie:        "Eredivisie",
  super_lig:         "Süper Lig",
};

export default function CLGroupDrawAnimation({ userTeamName, fixtures, onDone }: Props) {
  const [phase, setPhase] = useState<"intro" | "drawing" | "done">("intro");
  const [showTitle, setShowTitle] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [revealingBall, setRevealingBall] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 400);
    const t2 = setTimeout(() => setPhase("drawing"), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase !== "drawing") return;
    if (revealed >= fixtures.length) {
      const t = setTimeout(() => setPhase("done"), 1000);
      return () => clearTimeout(t);
    }
    // Ball spin → reveal
    setRevealingBall(true);
    const t1 = setTimeout(() => {
      setRevealingBall(false);
      setRevealed(prev => prev + 1);
    }, 700);
    return () => clearTimeout(t1);
  }, [phase, revealed, fixtures.length]);

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center overflow-y-auto"
      style={{
        background: "radial-gradient(ellipse at 50% 15%, #001a5e 0%, #000820 55%, #000510 100%)",
        cursor: "pointer",
      }}
      onClick={onDone}
    >
      {/* Star field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((s, i) => (
          <div key={i} className="absolute rounded-full" style={{
            left: `${s.left}%`, top: `${s.top}%`,
            width: s.size, height: s.size,
            background: i % 5 === 0 ? "#a78bfa" : "#fbbf24",
            opacity: 0,
            animation: `starPulse ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* Top beam */}
      <div className="absolute pointer-events-none" style={{
        top: 0, left: "50%", transform: "translateX(-50%)",
        width: 340, height: 480,
        background: "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.16) 0%, transparent 70%)",
      }} />

      <div className="relative z-10 w-full max-w-lg px-4 py-8 flex flex-col" style={{ minHeight: "100vh" }}>

        {/* ── Header ── */}
        <div className="text-center mb-5" style={{
          opacity: showTitle ? 1 : 0,
          transform: showTitle ? "translateY(0) scale(1)" : "translateY(-18px) scale(0.92)",
          transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <div style={{
            fontSize: 52,
            filter: "drop-shadow(0 0 24px rgba(251,191,36,0.85))",
            animation: "trophyFloat 3s ease-in-out infinite",
            marginBottom: 10,
          }}>🏆</div>

          <h1 style={{
            color: "#fbbf24",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "0.06em",
            textShadow: "0 0 40px rgba(251,191,36,0.7), 0 2px 0 rgba(0,0,0,0.5)",
            margin: "0 0 4px",
          }}>قرعة دور المجموعات</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 5 }}>
            <div style={{ height: 1, width: 55, background: "linear-gradient(to right, transparent, #fbbf24)" }} />
            <div style={{ color: "#fbbf24", fontSize: 11 }}>✦</div>
            <div style={{ height: 1, width: 55, background: "linear-gradient(to left, transparent, #fbbf24)" }} />
          </div>

          <p style={{ color: "#94a3b8", fontSize: 11, letterSpacing: "0.04em" }}>
            Champions League Group Stage · انقر للتخطي
          </p>

          {/* User team badge */}
          <div style={{
            marginTop: 12,
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(251,191,36,0.12)",
            border: "1px solid rgba(251,191,36,0.35)",
            borderRadius: 10, padding: "6px 16px",
          }}>
            <span style={{ fontSize: 14 }}>⚽</span>
            <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: 13 }}>{userTeamName}</span>
          </div>
        </div>

        {/* ── Fixtures ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {fixtures.map((fix, idx) => {
            const isRevealed = idx < revealed;
            const isCurrentlySpinning = phase === "drawing" && idx === revealed && revealingBall;
            const flag = LEAGUE_FLAG[fix.opponentLeagueId] ?? "🌍";
            const leagueLabel = LEAGUE_SHORT[fix.opponentLeagueId] ?? fix.opponentLeagueId;

            return (
              <div key={idx} style={{
                opacity: isRevealed ? 1 : isCurrentlySpinning ? 0.5 : 0,
                transform: isRevealed
                  ? "translateX(0) scale(1)"
                  : isCurrentlySpinning
                  ? "translateX(0) scale(0.97)"
                  : "translateX(-35px) scale(0.94)",
                transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                position: "relative",
                borderRadius: 13,
                overflow: "hidden",
                boxShadow: "0 0 0 1.5px rgba(251,191,36,0.5), 0 6px 24px rgba(251,191,36,0.15), 0 2px 8px rgba(0,0,0,0.4)",
              }}>
                {/* Card bg */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(15,40,110,0.7) 100%)",
                  backdropFilter: "blur(4px)",
                }} />

                {/* Gold shimmer */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(251,191,36,0.04)",
                  animation: "userGlow 2.2s ease-in-out infinite alternate",
                }} />

                <div style={{
                  position: "relative", zIndex: 1,
                  display: "flex", alignItems: "center",
                  padding: "10px 14px", gap: 10,
                }}>
                  {/* Round badge */}
                  <div style={{
                    minWidth: 32, height: 32,
                    borderRadius: "50%",
                    background: "rgba(251,191,36,0.2)",
                    border: "1.5px solid rgba(251,191,36,0.6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#fbbf24" }}>{fix.round}</span>
                  </div>

                  {/* Match info */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                    {/* Home team */}
                    <div style={{
                      flex: 1, textAlign: "right",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      <span style={{
                        fontWeight: 900, fontSize: 12,
                        color: fix.isHome ? "#fbbf24" : "#94a3b8",
                      }}>
                        {fix.isHome ? userTeamName : fix.opponent}
                      </span>
                    </div>

                    {/* VS */}
                    <div style={{
                      fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.1em", flexShrink: 0,
                      padding: "2px 6px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 4,
                    }}>VS</div>

                    {/* Away team */}
                    <div style={{
                      flex: 1, textAlign: "left",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      <span style={{
                        fontWeight: 900, fontSize: 12,
                        color: !fix.isHome ? "#fbbf24" : "#94a3b8",
                      }}>
                        {fix.isHome ? fix.opponent : userTeamName}
                      </span>
                    </div>
                  </div>

                  {/* League flag + home/away */}
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 2, flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 16 }}>{flag}</span>
                    <span style={{
                      fontSize: 8, fontWeight: 700,
                      color: fix.isHome ? "#34d399" : "#f87171",
                      letterSpacing: "0.06em",
                    }}>{fix.isHome ? "HOME" : "AWAY"}</span>
                  </div>
                </div>

                {/* Opponent league label */}
                <div style={{
                  position: "relative", zIndex: 1,
                  paddingBottom: 6, paddingLeft: 56, paddingRight: 14,
                  marginTop: -4,
                  fontSize: 9, color: "rgba(148,163,184,0.6)",
                  letterSpacing: "0.03em",
                }}>{leagueLabel}</div>
              </div>
            );
          })}

          {/* Spinning ball while revealing next */}
          {phase === "drawing" && revealed < fixtures.length && revealingBall && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "8px 0",
            }}>
              <div style={{
                fontSize: 32,
                animation: "ballSpin 0.5s linear infinite",
                filter: "drop-shadow(0 0 12px rgba(251,191,36,0.7))",
              }}>⚽</div>
            </div>
          )}
        </div>

        {/* Done state */}
        {phase === "done" && (
          <div style={{
            marginTop: 20, textAlign: "center",
            animation: "fadeInUp 0.5s ease-out both",
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
            <div style={{
              color: "#fbbf24", fontSize: 14, fontWeight: 900,
              textShadow: "0 0 20px rgba(251,191,36,0.5)",
              marginBottom: 4,
            }}>القرعة اكتملت!</div>
            <div style={{ color: "#94a3b8", fontSize: 11 }}>انقر للمتابعة</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes starPulse {
          0%   { opacity: 0.15; transform: scale(0.8); }
          100% { opacity: 0.7;  transform: scale(1.2); }
        }
        @keyframes trophyFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes userGlow {
          0%   { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes ballSpin {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
