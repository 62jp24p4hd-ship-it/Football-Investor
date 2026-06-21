"use client";

import React, { useEffect, useState, useMemo } from "react";

type Props = {
  championName: string;
  isUserChampion: boolean;
  userTeamName: string;
  leagueId: string;
  leagueName: string;
  leagueLogo?: string;
  bestPlayerName: string | null;
  bestPlayerTeam: string | null;
  bestPlayerGoals: number;
  bestPlayerAssists: number;
  bestPlayerPhoto?: string;
  onDone: () => void;
};

type Theme = {
  gradient: string;
  glowColor: string;
  accentColor: string;
  dimColor: string;
  particleColors: string[];
};

const THEMES: Record<string, Theme> = {
  premier_league: {
    gradient: "linear-gradient(160deg, #0d0118 0%, #2a0a45 45%, #0d0118 100%)",
    glowColor: "#a855f7",
    accentColor: "#00ff87",
    dimColor: "#c084fc",
    particleColors: ["#00ff87", "#a855f7", "#ffd700", "#e9d5ff", "#ffffff"],
  },
  bundesliga: {
    gradient: "linear-gradient(160deg, #0d0000 0%, #8b0000 45%, #0d0000 100%)",
    glowColor: "#dc2626",
    accentColor: "#ffd700",
    dimColor: "#fca5a5",
    particleColors: ["#dc2626", "#ffd700", "#ffffff", "#f87171", "#fbbf24"],
  },
  bundesliga2: {
    gradient: "linear-gradient(160deg, #0d0000 0%, #7f1d1d 40%, #111827 100%)",
    glowColor: "#dc2626",
    accentColor: "#d1d5db",
    dimColor: "#fca5a5",
    particleColors: ["#dc2626", "#d1d5db", "#ffffff", "#f87171", "#e5e7eb"],
  },
  la_liga: {
    gradient: "linear-gradient(160deg, #0d0000 0%, #9b1c1c 35%, #3d2600 100%)",
    glowColor: "#dc2626",
    accentColor: "#ffd700",
    dimColor: "#fca5a5",
    particleColors: ["#dc2626", "#ffd700", "#ffffff", "#fbbf24", "#fde68a"],
  },
  segunda: {
    gradient: "linear-gradient(160deg, #0d0000 0%, #92400e 35%, #3d2600 100%)",
    glowColor: "#d97706",
    accentColor: "#fbbf24",
    dimColor: "#fcd34d",
    particleColors: ["#d97706", "#fbbf24", "#ffffff", "#fcd34d", "#f59e0b"],
  },
  serie_a: {
    gradient: "linear-gradient(160deg, #000a1a 0%, #1e3a8a 45%, #000a1a 100%)",
    glowColor: "#3b82f6",
    accentColor: "#ffd700",
    dimColor: "#93c5fd",
    particleColors: ["#3b82f6", "#ffd700", "#ffffff", "#93c5fd", "#fde68a"],
  },
  serie_b: {
    gradient: "linear-gradient(160deg, #000a1a 0%, #1e3a6e 40%, #111827 100%)",
    glowColor: "#60a5fa",
    accentColor: "#d1d5db",
    dimColor: "#bfdbfe",
    particleColors: ["#60a5fa", "#d1d5db", "#ffffff", "#93c5fd", "#e2e8f0"],
  },
  ligue_1: {
    gradient: "linear-gradient(160deg, #000a1a 0%, #1e3a8a 40%, #3b0000 100%)",
    glowColor: "#3b82f6",
    accentColor: "#ef4444",
    dimColor: "#bfdbfe",
    particleColors: ["#3b82f6", "#ef4444", "#ffffff", "#93c5fd", "#fca5a5"],
  },
  ligue_2: {
    gradient: "linear-gradient(160deg, #000a1a 0%, #1e3a8a 40%, #111827 100%)",
    glowColor: "#60a5fa",
    accentColor: "#93c5fd",
    dimColor: "#bfdbfe",
    particleColors: ["#60a5fa", "#93c5fd", "#ffffff", "#bfdbfe", "#e2e8f0"],
  },
  saudi_league: {
    gradient: "linear-gradient(160deg, #001a00 0%, #005c2e 45%, #001a00 100%)",
    glowColor: "#22c55e",
    accentColor: "#ffd700",
    dimColor: "#86efac",
    particleColors: ["#22c55e", "#ffd700", "#ffffff", "#86efac", "#fde68a"],
  },
  portuguese_league: {
    gradient: "linear-gradient(160deg, #1a0000 0%, #991b1b 30%, #14532d 70%, #0a0a0a 100%)",
    glowColor: "#dc2626",
    accentColor: "#fcd34d",
    dimColor: "#fca5a5",
    particleColors: ["#dc2626", "#22c55e", "#fcd34d", "#ffffff", "#86efac"],
  },
  eredivisie: {
    gradient: "linear-gradient(160deg, #1a0800 0%, #c2410c 45%, #0d0000 100%)",
    glowColor: "#f97316",
    accentColor: "#fde68a",
    dimColor: "#fed7aa",
    particleColors: ["#f97316", "#fde68a", "#ffffff", "#fdba74", "#fbbf24"],
  },
  super_lig: {
    gradient: "linear-gradient(160deg, #1a0000 0%, #991b1b 40%, #1a1200 100%)",
    glowColor: "#ef4444",
    accentColor: "#fbbf24",
    dimColor: "#fca5a5",
    particleColors: ["#ef4444", "#fbbf24", "#ffffff", "#f87171", "#fde68a"],
  },
  championship: {
    gradient: "linear-gradient(160deg, #000a1a 0%, #1e40af 45%, #000a1a 100%)",
    glowColor: "#3b82f6",
    accentColor: "#fbbf24",
    dimColor: "#bfdbfe",
    particleColors: ["#3b82f6", "#fbbf24", "#ffffff", "#93c5fd", "#fde68a"],
  },
};

const DEFAULT_THEME: Theme = {
  gradient: "linear-gradient(160deg, #0a0a0a 0%, #1a1a2e 45%, #0a0a0a 100%)",
  glowColor: "#ffd700",
  accentColor: "#ffd700",
  dimColor: "#fde68a",
  particleColors: ["#ffd700", "#ffffff", "#fbbf24", "#fde68a", "#e5e7eb"],
};

export default function LeagueChampionAnimation({
  championName,
  isUserChampion,
  userTeamName,
  leagueId,
  leagueName,
  leagueLogo,
  bestPlayerName,
  bestPlayerTeam,
  bestPlayerGoals,
  bestPlayerAssists,
  bestPlayerPhoto,
  onDone,
}: Props) {
  type Phase = "intro" | "reveal" | "celebrate" | "fade" | "bestPlayer" | "exit";
  const [phase, setPhase] = useState<Phase>("intro");

  const theme = THEMES[leagueId] ?? DEFAULT_THEME;

  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 2.5 + Math.random() * 2.5,
        size: 5 + Math.floor(Math.random() * 9),
        color: theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)],
        isCircle: Math.random() > 0.5,
        drift: (Math.random() - 0.5) * 120,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leagueId]
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("reveal"), 500));
    timers.push(setTimeout(() => setPhase("celebrate"), 1800));

    if (bestPlayerName) {
      timers.push(setTimeout(() => setPhase("fade"), 6200));
      timers.push(setTimeout(() => setPhase("bestPlayer"), 6900));
      timers.push(setTimeout(() => { setPhase("exit"); setTimeout(onDone, 500); }, 11000));
    } else {
      timers.push(setTimeout(() => { setPhase("exit"); setTimeout(onDone, 500); }, 6200));
    }

    return () => timers.forEach(clearTimeout);
  }, [onDone, bestPlayerName]);

  const handleClick = () => {
    setPhase("exit");
    setTimeout(onDone, 400);
  };

  const champVisible = phase === "intro" || phase === "reveal" || phase === "celebrate";
  const bestVisible = phase === "bestPlayer";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* ── CHAMPION PHASE ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          background: theme.gradient,
          opacity: champVisible ? 1 : 0,
          transition: "opacity 0.7s ease",
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${theme.glowColor}25 0%, transparent 70%)`,
            opacity: phase === "celebrate" ? 1 : 0.3,
            transition: "opacity 1.2s ease",
          }}
        />

        {/* Confetti — only when user wins */}
        {isUserChampion && phase === "celebrate" &&
          particles.map((p) => (
            <div
              key={p.id}
              className="absolute pointer-events-none top-0"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.isCircle ? p.size : p.size * 1.6,
                backgroundColor: p.color,
                borderRadius: p.isCircle ? "50%" : "2px",
                animationName: "confettiFall",
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                animationTimingFunction: "linear",
                animationFillMode: "forwards",
                "--drift": `${p.drift}px`,
              } as React.CSSProperties}
            />
          ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          {/* League logo */}
          <div
            style={{
              opacity: phase === "intro" ? 0 : 1,
              transform: phase === "intro" ? "scale(0.4) rotate(-15deg)" : "scale(1) rotate(0deg)",
              transition: "all 0.9s cubic-bezier(0.34,1.56,0.64,1)",
              filter: `drop-shadow(0 0 24px ${theme.glowColor})`,
              marginBottom: 20,
            }}
          >
            {leagueLogo ? (
              <img
                src={leagueLogo}
                alt={leagueName}
                style={{ width: 88, height: 88, objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: 72 }}>🏆</span>
            )}
          </div>

          {/* League name */}
          <div
            style={{
              color: theme.accentColor,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              opacity: phase === "intro" ? 0 : 1,
              transform: phase === "intro" ? "translateY(16px)" : "translateY(0)",
              transition: "all 0.6s ease 0.15s",
              textShadow: `0 0 24px ${theme.accentColor}90`,
              marginBottom: 18,
            }}
          >
            {leagueName}
          </div>

          {/* CHAMPIONS or WINNER */}
          <div
            style={{
              color: "#ffffff",
              fontSize: "clamp(38px, 7.5vw, 76px)",
              fontWeight: 900,
              letterSpacing: isUserChampion ? "0.08em" : "0.04em",
              textTransform: "uppercase",
              lineHeight: 1,
              opacity: phase === "celebrate" ? 1 : 0,
              transform: phase === "celebrate" ? "scale(1)" : "scale(1.25)",
              transition: "all 0.55s cubic-bezier(0.34,1.56,0.64,1)",
              textShadow: `0 0 50px ${theme.glowColor}, 0 0 20px ${theme.glowColor}80, 0 4px 20px rgba(0,0,0,0.9)`,
              marginBottom: 14,
            }}
          >
            {isUserChampion ? "🏆 CHAMPIONS 🏆" : "🏆 WINNER"}
          </div>

          {/* Club / team name */}
          <div
            style={{
              color: theme.accentColor,
              fontSize: "clamp(26px, 5vw, 54px)",
              fontWeight: 800,
              letterSpacing: "0.02em",
              opacity: phase === "intro" ? 0 : 1,
              transform: phase === "intro" ? "translateY(28px)" : "translateY(0)",
              transition: "all 0.75s cubic-bezier(0.34,1.56,0.64,1) 0.2s",
              textShadow: `0 0 36px ${theme.accentColor}80, 0 2px 12px rgba(0,0,0,0.9)`,
            }}
          >
            {isUserChampion ? userTeamName : championName}
          </div>

          {/* Congratulations line */}
          {isUserChampion && (
            <div
              style={{
                color: theme.dimColor,
                fontSize: 17,
                fontWeight: 600,
                marginTop: 18,
                opacity: phase === "celebrate" ? 1 : 0,
                transform: phase === "celebrate" ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.5s ease 0.2s",
              }}
            >
              🎉 أنت بطل الدوري هذا الموسم!
            </div>
          )}

          {/* Non-user winner note */}
          {!isUserChampion && (
            <div
              style={{
                color: "#6b7280",
                fontSize: 15,
                fontWeight: 500,
                marginTop: 14,
                opacity: phase === "celebrate" ? 1 : 0,
                transition: "opacity 0.5s ease 0.2s",
              }}
            >
              فاز بالدوري هذا الموسم
            </div>
          )}
        </div>
      </div>

      {/* ── BEST PLAYER PHASE ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(160deg, #020208 0%, #0d0d20 45%, #020208 100%)",
          opacity: bestVisible ? 1 : 0,
          transition: "opacity 0.7s ease",
          pointerEvents: bestVisible ? "auto" : "none",
        }}
      >
        {/* Spotlight beam */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 300,
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(250,204,21,0.18) 0%, rgba(250,204,21,0.06) 40%, transparent 80%)",
            filter: "blur(30px)",
          }}
        />

        {/* Subtle star particles */}
        {bestVisible &&
          [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                left: `${10 + i * 11}%`,
                top: `${15 + (i % 3) * 20}%`,
                fontSize: 14 + (i % 3) * 6,
                opacity: 0.25 + (i % 3) * 0.1,
                animation: `starFloat ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite alternate`,
              }}
            >
              ✦
            </div>
          ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8">

          {/* Label */}
          <div
            style={{
              color: "#fbbf24",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              opacity: bestVisible ? 1 : 0,
              animation: bestVisible ? "slideUpFade 0.5s ease 0.05s both" : "none",
              textShadow: "0 0 20px rgba(251,191,36,0.7)",
              marginBottom: 20,
            }}
          >
            أفضل لاعب في الدوري
          </div>

          {/* Photo + Crown (or fallback star icon) */}
          <div style={{ position: "relative", marginBottom: 18, display: "inline-block" }}>
            {bestPlayerPhoto ? (
              <>
                {/* Glow ring behind photo */}
                <div style={{
                  position: "absolute", inset: -6,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 70%)",
                  animation: bestVisible ? "crownGlow 2s ease-in-out infinite alternate" : "none",
                }} />
                {/* Photo circle */}
                <div style={{
                  width: 130, height: 130,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid rgba(251,191,36,0.8)",
                  boxShadow: "0 0 30px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2)",
                  position: "relative",
                  opacity: bestVisible ? 1 : 0,
                  animation: bestVisible ? "slideUpFade 0.6s ease 0.1s both" : "none",
                }}>
                  <img
                    src={bestPlayerPhoto}
                    alt={bestPlayerName ?? ""}
                    style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }}
                  />
                </div>
                {/* Crown SVG on top */}
                <div style={{
                  position: "absolute",
                  top: -38,
                  left: "50%",
                  transform: "translateX(-50%)",
                  opacity: bestVisible ? 1 : 0,
                  animation: bestVisible ? "crownDrop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.4s both" : "none",
                  filter: "drop-shadow(0 0 12px rgba(251,191,36,0.9))",
                  zIndex: 10,
                }}>
                  <svg width="72" height="52" viewBox="0 0 72 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Crown body */}
                    <path d="M8 44 L8 20 L20 32 L36 8 L52 32 L64 20 L64 44 Z"
                      fill="url(#crownGrad)" stroke="rgba(251,191,36,0.9)" strokeWidth="1.5" strokeLinejoin="round"/>
                    {/* Base band */}
                    <rect x="6" y="40" width="60" height="8" rx="3"
                      fill="url(#crownBandGrad)" stroke="rgba(251,191,36,0.6)" strokeWidth="1"/>
                    {/* Center gem */}
                    <circle cx="36" cy="10" r="5" fill="url(#gemGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
                    {/* Left gem */}
                    <circle cx="20" cy="33" r="3.5" fill="url(#gemGrad2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
                    {/* Right gem */}
                    <circle cx="52" cy="33" r="3.5" fill="url(#gemGrad2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
                    {/* Band gems */}
                    <circle cx="22" cy="44" r="2.5" fill="#ff4d6d" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6"/>
                    <circle cx="36" cy="44" r="2.5" fill="#4ade80" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6"/>
                    <circle cx="50" cy="44" r="2.5" fill="#60a5fa" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6"/>
                    <defs>
                      <linearGradient id="crownGrad" x1="36" y1="8" x2="36" y2="44" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fde68a"/>
                        <stop offset="50%" stopColor="#f59e0b"/>
                        <stop offset="100%" stopColor="#b45309"/>
                      </linearGradient>
                      <linearGradient id="crownBandGrad" x1="6" y1="44" x2="66" y2="44" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#92400e"/>
                        <stop offset="50%" stopColor="#d97706"/>
                        <stop offset="100%" stopColor="#92400e"/>
                      </linearGradient>
                      <radialGradient id="gemGrad" cx="50%" cy="35%" r="60%">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="40%" stopColor="#fbbf24"/>
                        <stop offset="100%" stopColor="#b45309"/>
                      </radialGradient>
                      <radialGradient id="gemGrad2" cx="40%" cy="35%" r="60%">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="50%" stopColor="#fcd34d"/>
                        <stop offset="100%" stopColor="#92400e"/>
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </>
            ) : (
              /* Fallback: star icon */
              <div
                style={{
                  fontSize: 72,
                  opacity: bestVisible ? 1 : 0,
                  animation: bestVisible ? "slideUpFade 0.5s ease 0.1s both" : "none",
                  filter: "drop-shadow(0 0 20px rgba(250,204,21,0.6))",
                }}
              >
                ⭐
              </div>
            )}
          </div>

          {/* Player name */}
          <div
            style={{
              color: "#ffffff",
              fontSize: "clamp(26px, 5vw, 52px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 8,
              opacity: bestVisible ? 1 : 0,
              animation: bestVisible ? "slideUpFade 0.65s ease 0.25s both" : "none",
              textShadow:
                "0 0 40px rgba(251,191,36,0.5), 0 0 80px rgba(251,191,36,0.2), 0 4px 20px rgba(0,0,0,0.9)",
            }}
          >
            {bestPlayerName}
          </div>

          {/* Team */}
          <div
            style={{
              color: "#6b7280",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "0.05em",
              marginBottom: 28,
              opacity: bestVisible ? 1 : 0,
              animation: bestVisible ? "slideUpFade 0.5s ease 0.35s both" : "none",
            }}
          >
            {bestPlayerTeam}
          </div>

          {/* Stats card */}
          <div
            style={{
              display: "inline-flex",
              gap: 0,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: 18,
              overflow: "hidden",
              opacity: bestVisible ? 1 : 0,
              animation: bestVisible ? "slideUpFade 0.55s ease 0.4s both" : "none",
              boxShadow: "0 0 40px rgba(251,191,36,0.08)",
            }}
          >
            <div style={{ padding: "18px 36px", textAlign: "center" }}>
              <div
                style={{
                  color: "#fbbf24",
                  fontSize: 34,
                  fontWeight: 900,
                  lineHeight: 1,
                  textShadow: "0 0 20px rgba(251,191,36,0.6)",
                }}
              >
                {bestPlayerGoals}
              </div>
              <div
                style={{
                  color: "#4b5563",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                Goals
              </div>
            </div>
            <div style={{ width: 1, background: "rgba(251,191,36,0.12)" }} />
            <div style={{ padding: "18px 36px", textAlign: "center" }}>
              <div
                style={{
                  color: "#fbbf24",
                  fontSize: 34,
                  fontWeight: 900,
                  lineHeight: 1,
                  textShadow: "0 0 20px rgba(251,191,36,0.6)",
                }}
              >
                {bestPlayerAssists}
              </div>
              <div
                style={{
                  color: "#4b5563",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                Assists
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shared keyframes */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) translateX(0) rotate(0deg);       opacity: 1; }
          80%  { opacity: 0.9; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(540deg); opacity: 0; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes starFloat {
          from { transform: translateY(0px) scale(1);   }
          to   { transform: translateY(-10px) scale(1.15); }
        }
        @keyframes crownDrop {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-30px) rotate(-8deg) scale(0.6); }
          60%  { transform: translateX(-50%) translateY(6px) rotate(3deg) scale(1.05); }
          80%  { transform: translateX(-50%) translateY(-3px) rotate(-1deg) scale(0.98); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes crownGlow {
          from { opacity: 0.4; transform: scale(0.95); }
          to   { opacity: 1;   transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
