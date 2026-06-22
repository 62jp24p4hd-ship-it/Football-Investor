"use client";

import React, { useEffect, useState, useRef } from "react";

type Props = {
  championName: string;
  isUserChampion: boolean;
  userTeamName: string;
  onDone: () => void;
};

// Fixed confetti pieces
const CONFETTI = Array.from({ length: 80 }, (_, i) => ({
  x: (i * 37.7) % 100,
  delay: (i * 0.08) % 2.5,
  dur: 2.5 + (i % 4) * 0.5,
  size: 4 + (i % 5) * 2,
  color: [
    "#fbbf24", "#facc15", "#ffffff", "#a78bfa",
    "#60a5fa", "#34d399", "#f87171", "#fde68a",
  ][i % 8],
  rotate: (i * 47) % 360,
  drift: ((i * 13) % 60) - 30,
}));

// Fixed star rays
const RAYS = Array.from({ length: 12 }, (_, i) => ({
  angle: i * 30,
  length: 80 + (i % 3) * 40,
  delay: i * 0.1,
}));

// Fixed particle sparks
const SPARKS = Array.from({ length: 24 }, (_, i) => ({
  angle: i * 15,
  distance: 80 + (i % 4) * 30,
  delay: 0.3 + (i % 6) * 0.15,
  size: 3 + (i % 3) * 2,
}));

export default function CLChampionAnimation({ championName, isUserChampion, userTeamName, onDone }: Props) {
  const [phase, setPhase] = useState<"dark" | "trophy" | "rays" | "text" | "done">("dark");
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("trophy"), 400),
      setTimeout(() => setPhase("rays"),   1400),
      setTimeout(() => setPhase("text"),   2000),
      setTimeout(() => setPhase("done"),   3200),
      setTimeout(() => setShowContinue(true), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const trophyVisible = phase !== "dark";
  const raysVisible   = phase === "rays" || phase === "text" || phase === "done";
  const textVisible   = phase === "text" || phase === "done";

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#000", cursor: "pointer" }}
      onClick={onDone}
    >
      {/* ── Animated starfield background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {CONFETTI.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${c.x}%`,
              top: "-20px",
              width: c.size,
              height: c.size * 0.5,
              background: c.color,
              borderRadius: 2,
              transform: `rotate(${c.rotate}deg)`,
              opacity: raysVisible ? 0.85 : 0,
              animation: raysVisible
                ? `confettiFall ${c.dur}s ease-in ${c.delay}s infinite`
                : "none",
            }}
          />
        ))}
      </div>

      {/* ── Deep blue/black radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #001a6e 0%, #000820 45%, #000 100%)",
          opacity: trophyVisible ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* ── Trophy glow pulse ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400,
          borderRadius: "50%",
          background: raysVisible
            ? "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)"
            : "transparent",
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          transition: "background 0.8s ease",
          animation: raysVisible ? "glowPulse 2s ease-in-out infinite" : "none",
        }}
      />

      {/* ── Sun rays ── */}
      {raysVisible && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%, -60%)",
            animation: "slowSpin 20s linear infinite",
          }}
        >
          {RAYS.map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 2,
                height: r.length,
                background: "linear-gradient(to bottom, rgba(251,191,36,0.5), transparent)",
                transformOrigin: "top center",
                transform: `rotate(${r.angle}deg) translateY(0)`,
                opacity: 0,
                animation: `rayFade 1s ease-out ${r.delay}s forwards`,
                top: 0, left: "50%", marginLeft: -1,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Spark particles ── */}
      {raysVisible && (
        <div
          className="absolute pointer-events-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -60%)" }}
        >
          {SPARKS.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                background: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#fff" : "#a78bfa",
                opacity: 0,
                animation: `sparkOut 1.2s ease-out ${s.delay}s infinite`,
                transform: `rotate(${s.angle}deg) translateY(-${s.distance}px)`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ gap: 0, userSelect: "none" }}
      >
        {/* Trophy image */}
        <div
          style={{
            opacity: trophyVisible ? 1 : 0,
            transform: trophyVisible
              ? raysVisible ? "scale(1) translateY(0)" : "scale(0.6) translateY(30px)"
              : "scale(0.3) translateY(60px)",
            transition: "all 1s cubic-bezier(0.34,1.56,0.64,1)",
            filter: raysVisible
              ? "drop-shadow(0 0 40px rgba(251,191,36,0.9)) drop-shadow(0 0 80px rgba(251,191,36,0.5))"
              : "drop-shadow(0 0 10px rgba(251,191,36,0.3))",
            animation: raysVisible ? "trophyFloat 3s ease-in-out infinite" : "none",
            marginBottom: 24,
          }}
        >
          <img
            src="/images/cl-trophy.png"
            alt="Champions League Trophy"
            style={{
              width: 180,
              height: "auto",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* "Champions of Europe" label */}
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
            transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Gold divider top */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            justifyContent: "center", marginBottom: 10,
          }}>
            <div style={{ height: 1, width: 50, background: "linear-gradient(to right, transparent, #fbbf24)" }} />
            <span style={{ color: "#fbbf24", fontSize: 11, letterSpacing: "0.3em", fontWeight: 800 }}>✦ UEFA ✦</span>
            <div style={{ height: 1, width: 50, background: "linear-gradient(to left, transparent, #fbbf24)" }} />
          </div>

          {/* Champion name */}
          <h1
            style={{
              color: isUserChampion ? "#fbbf24" : "#e2e8f0",
              fontSize: isUserChampion ? 32 : 28,
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: "0.04em",
              textShadow: isUserChampion
                ? "0 0 60px rgba(251,191,36,0.9), 0 0 20px rgba(251,191,36,0.6), 0 2px 0 rgba(0,0,0,0.8)"
                : "0 0 20px rgba(255,255,255,0.3), 0 2px 0 rgba(0,0,0,0.8)",
              margin: "0 0 6px",
              animation: isUserChampion && textVisible ? "nameGlow 2s ease-in-out infinite alternate" : "none",
            }}
          >
            {championName}
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "#94a3b8",
            fontSize: 12,
            textAlign: "center",
            letterSpacing: "0.2em",
            fontWeight: 600,
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            Champions of Europe
          </p>

          {/* Gold divider bottom */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            justifyContent: "center", marginBottom: isUserChampion ? 20 : 0,
          }}>
            <div style={{ height: 1, width: 80, background: "linear-gradient(to right, transparent, #fbbf24)" }} />
            <div style={{ height: 1, width: 80, background: "linear-gradient(to left, transparent, #fbbf24)" }} />
          </div>

          {/* User celebration message */}
          {isUserChampion && textVisible && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(234,179,8,0.08))",
                border: "1px solid rgba(251,191,36,0.4)",
                borderRadius: 12,
                padding: "12px 24px",
                textAlign: "center",
                animation: "celebrationPop 0.6s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>🏆👑🎉</div>
              <div style={{
                color: "#fbbf24",
                fontWeight: 900,
                fontSize: 15,
                textShadow: "0 0 20px rgba(251,191,36,0.6)",
              }}>
                أنت بطل أوروبا!
              </div>
              <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 3 }}>
                {userTeamName} wins the Champions League
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Continue hint */}
      {showContinue && (
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: 0, right: 0,
            textAlign: "center",
            color: "#334155",
            fontSize: 12,
            letterSpacing: "0.08em",
            animation: "fadeInUp 0.5s ease",
          }}
        >
          انقر للمتابعة — Tap to continue
        </div>
      )}

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) translateX(var(--drift, 0px)); opacity: 0; }
        }
        @keyframes trophyFloat {
          0%,100% { transform: scale(1) translateY(0) rotate(-1deg); }
          50%      { transform: scale(1.04) translateY(-10px) rotate(1deg); }
        }
        @keyframes glowPulse {
          0%,100% { transform: translate(-50%,-60%) scale(1); opacity: 0.8; }
          50%      { transform: translate(-50%,-60%) scale(1.3); opacity: 1; }
        }
        @keyframes slowSpin {
          from { transform: translate(-50%,-60%) rotate(0deg); }
          to   { transform: translate(-50%,-60%) rotate(360deg); }
        }
        @keyframes rayFade {
          from { opacity: 0; }
          to   { opacity: 0.6; }
        }
        @keyframes sparkOut {
          0%   { opacity: 1; transform: rotate(var(--angle,0deg)) translateY(-20px) scale(1); }
          100% { opacity: 0; transform: rotate(var(--angle,0deg)) translateY(-120px) scale(0); }
        }
        @keyframes nameGlow {
          from { text-shadow: 0 0 40px rgba(251,191,36,0.7), 0 2px 0 rgba(0,0,0,0.8); }
          to   { text-shadow: 0 0 80px rgba(251,191,36,1), 0 0 120px rgba(251,191,36,0.4), 0 2px 0 rgba(0,0,0,0.8); }
        }
        @keyframes celebrationPop {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
