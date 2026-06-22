"use client";

import React, { useEffect, useState, useRef } from "react";
import type { CLTie } from "../game/clTypes";
import { LEAGUE_FLAG } from "../game/clTeams";

type Props = {
  r16Ties?: CLTie[];
  ties?: CLTie[];
  title?: string;
  subtitle?: string;
  onDone: () => void;
};

// Stable star positions — computed once per mount
const STARS = Array.from({ length: 60 }, (_, i) => ({
  left: ((i * 137.508) % 100),
  top: ((i * 97.3) % 100),
  size: 1.5 + (i % 3),
  delay: (i * 0.13) % 3,
  dur: 2 + (i % 4),
}));

export default function CLDrawAnimation({ r16Ties, ties, title, subtitle, onDone }: Props) {
  const displayTies = ties ?? r16Ties ?? [];
  const drawTitle = title ?? "قرعة دور الـ16";
  const drawSubtitle = subtitle ?? "Round of 16 Draw";

  const [revealedTies, setRevealedTies] = useState<number>(0);
  const [phase, setPhase] = useState<"intro" | "drawing" | "done">("intro");
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    // Intro flash then start drawing
    const t1 = setTimeout(() => setShowTitle(true), 300);
    const t2 = setTimeout(() => setPhase("drawing"), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase !== "drawing") return;
    if (revealedTies < displayTies.length) {
      const t = setTimeout(() => setRevealedTies(prev => prev + 1), 650);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("done"), 900);
      return () => clearTimeout(t);
    }
  }, [phase, revealedTies, displayTies.length]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center overflow-y-auto"
      style={{
        background: "radial-gradient(ellipse at 50% 20%, #001a5e 0%, #000820 60%, #000510 100%)",
        cursor: "pointer",
      }}
      onClick={onDone}
    >
      {/* Animated star field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              background: i % 5 === 0 ? "#a78bfa" : "#fbbf24",
              opacity: 0,
              animation: `starPulse ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Top glow beam */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: "50%", transform: "translateX(-50%)",
          width: 300, height: 500,
          background: "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-lg px-4 py-8 flex flex-col" style={{ minHeight: "100vh" }}>

        {/* ── Header ── */}
        <div
          className="text-center mb-6"
          style={{
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.92)",
            transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Trophy + glow */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
            <div style={{
              fontSize: 56,
              filter: "drop-shadow(0 0 24px rgba(251,191,36,0.8))",
              animation: "trophyFloat 3s ease-in-out infinite",
            }}>🏆</div>
          </div>

          <h1 style={{
            color: "#fbbf24",
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: "0.06em",
            textShadow: "0 0 40px rgba(251,191,36,0.7), 0 2px 0 rgba(0,0,0,0.5)",
            margin: "0 0 6px",
          }}>
            {drawTitle}
          </h1>

          {/* Gold divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 6 }}>
            <div style={{ height: 1, width: 60, background: "linear-gradient(to right, transparent, #fbbf24)" }} />
            <div style={{ color: "#fbbf24", fontSize: 12 }}>✦</div>
            <div style={{ height: 1, width: 60, background: "linear-gradient(to left, transparent, #fbbf24)" }} />
          </div>

          <p style={{ color: "#94a3b8", fontSize: 12, letterSpacing: "0.04em" }}>
            {drawSubtitle} — انقر للتخطي
          </p>
        </div>

        {/* ── Matchup Cards ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {displayTies.map((tie, idx) => {
            const revealed = idx < revealedTies;
            const isUser = tie.userInvolved;
            const flagA = LEAGUE_FLAG[tie.teamALeagueId] ?? "🌍";
            const flagB = LEAGUE_FLAG[tie.teamBLeagueId] ?? "🌍";

            return (
              <div
                key={tie.id}
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateX(0) scale(1)" : "translateX(-40px) scale(0.95)",
                  transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                  position: "relative",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: isUser
                    ? "0 0 0 1.5px rgba(251,191,36,0.6), 0 8px 32px rgba(251,191,36,0.2), 0 2px 8px rgba(0,0,0,0.4)"
                    : "0 0 0 1px rgba(255,255,255,0.07), 0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                {/* Card background */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: isUser
                    ? "linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(30,58,138,0.6) 100%)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,8,40,0.8) 100%)",
                  backdropFilter: "blur(4px)",
                }} />

                {/* User glow pulse */}
                {isUser && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(251,191,36,0.05)",
                    animation: "userGlow 2s ease-in-out infinite alternate",
                  }} />
                )}

                {/* Match number badge */}
                <div style={{
                  position: "absolute", top: 10, left: 12,
                  width: 22, height: 22,
                  borderRadius: "50%",
                  background: isUser ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.07)",
                  border: isUser ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800,
                  color: isUser ? "#fbbf24" : "#475569",
                }}>
                  {idx + 1}
                </div>

                {/* Content */}
                <div style={{
                  position: "relative", zIndex: 1,
                  padding: "14px 16px 14px 44px",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {/* Team A */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 14 }}>{flagA}</span>
                      <span style={{
                        color: isUser ? "#fde68a" : "#e2e8f0",
                        fontWeight: isUser ? 800 : 600,
                        fontSize: 13.5,
                        lineHeight: 1.2,
                      }}>
                        {tie.teamA}
                      </span>
                    </div>
                    <div style={{ color: "#334155", fontSize: 9.5, marginLeft: 20 }}>
                      Leg 1 at home
                    </div>
                  </div>

                  {/* VS badge */}
                  <div style={{
                    flexShrink: 0,
                    width: 32, height: 32,
                    borderRadius: "50%",
                    background: isUser
                      ? "linear-gradient(135deg, #92400e, #fbbf24)"
                      : "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 900,
                    color: "#fff",
                    boxShadow: isUser ? "0 0 12px rgba(251,191,36,0.5)" : "0 0 8px rgba(59,130,246,0.4)",
                    letterSpacing: "0.02em",
                  }}>
                    VS
                  </div>

                  {/* Team B */}
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, justifyContent: "flex-end" }}>
                      <span style={{
                        color: isUser ? "#fde68a" : "#e2e8f0",
                        fontWeight: isUser ? 800 : 600,
                        fontSize: 13.5,
                        lineHeight: 1.2,
                      }}>
                        {tie.teamB}
                      </span>
                      <span style={{ fontSize: 14 }}>{flagB}</span>
                    </div>
                    <div style={{ color: "#334155", fontSize: 9.5, marginRight: 20 }}>
                      Leg 2 at home
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                {isUser && (
                  <div style={{
                    height: 2,
                    background: "linear-gradient(to right, transparent, #fbbf24, transparent)",
                  }} />
                )}
              </div>
            );
          })}

          {/* Placeholder skeletons for upcoming cards */}
          {Array.from({ length: Math.max(0, displayTies.length - revealedTies - 1) }).slice(0, 3).map((_, i) => (
            <div
              key={`sk-${i}`}
              style={{
                borderRadius: 14,
                height: 60,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                opacity: 0.3 - i * 0.08,
                animation: "skeletonPulse 1.5s ease-in-out infinite alternate",
              }}
            />
          ))}
        </div>

        {/* ── Done button ── */}
        {phase === "done" && (
          <div className="text-center mt-8 mb-4">
            <button
              onClick={onDone}
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #fbbf24 100%)",
                border: "none",
                borderRadius: 14,
                padding: "14px 48px",
                color: "#000",
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 0 40px rgba(251,191,36,0.45), 0 4px 16px rgba(0,0,0,0.4)",
                letterSpacing: "0.04em",
                animation: "btnPop 0.5s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              متابعة — Continue ›
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes starPulse {
          from { opacity: 0.05; transform: scale(0.8); }
          to   { opacity: 0.55; transform: scale(1.3); }
        }
        @keyframes trophyFloat {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes userGlow {
          from { opacity: 0.4; }
          to   { opacity: 1; }
        }
        @keyframes skeletonPulse {
          from { opacity: 0.15; }
          to   { opacity: 0.03; }
        }
        @keyframes btnPop {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
