"use client";

import { useEffect, useState } from "react";

// ============================================
// FOOTBALL INVESTOR — EVENT ANIMATIONS
// كل أنيميشنات الإيفنتات في مكان واحد
// ============================================

// ── Shared types ────────────────────────────
type AnimProps = {
  onDone: () => void;
};

// ============================================
// FLORENTINO PÉREZ — BOSS ENTRANCE
// trigger: florentinoPerez event
// ============================================

export function FlorentinoEntrance({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1200);
    const t2 = setTimeout(() => setPhase("exit"),  2200);
    const t3 = setTimeout(() => onDone(),          3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const overlayOpacity = phase === "exit" ? 0 : 1;

  const imgStyle: React.CSSProperties = {
    width: "clamp(180px, 30vw, 280px)",
    height: "auto",
    imageRendering: "pixelated",
    objectFit: "contain",
    transition:
      phase === "enter" ? "transform 1.2s cubic-bezier(0.22,1,0.36,1), opacity 1.2s ease"
      : phase === "exit" ? "transform 0.8s ease-in, opacity 0.8s ease-in"
      : "none",
    transform:
      phase === "exit" ? "scale(0.7) translateY(-40px)" : "scale(1) translateY(0)",
    opacity: phase === "exit" ? 0 : 1,
    filter:
      phase === "hold"
        ? "drop-shadow(0 0 32px rgba(212,175,55,0.9)) drop-shadow(0 0 64px rgba(212,175,55,0.4))"
        : "drop-shadow(0 0 16px rgba(212,175,55,0.5))",
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: overlayOpacity,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 1.2s ease",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.72)" }} />

      {/* Glow ring */}
      <div className="absolute" style={{
        width: "clamp(220px, 35vw, 340px)",
        height: "clamp(220px, 35vw, 340px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
        animation: phase === "hold" ? "florPulse 1.5s ease-in-out infinite" : "none",
      }} />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <img
          src="/images/florentino-pixel.png"
          alt="Florentino Pérez"
          style={{
            ...imgStyle,
            animation: phase === "enter" ? "florZoomIn 1.2s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}
        />

        {/* Name badge */}
        <div
          className="text-center px-6 py-2"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(212,175,55,0.6)",
            boxShadow: "0 0 20px rgba(212,175,55,0.3)",
            opacity: phase === "hold" ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div className="font-black text-lg tracking-widest uppercase" style={{ color: "#D4AF37" }}>
            Florentino Pérez
          </div>
          <div className="text-xs tracking-[0.3em] uppercase mt-0.5" style={{ color: "#9ca3af" }}>
            Real Madrid President
          </div>
        </div>
      </div>

      <style>{`
        @keyframes florZoomIn {
          0%   { opacity: 0; transform: scale(0.2) translateY(60px); }
          60%  { opacity: 1; transform: scale(1.08) translateY(-8px); }
          80%  { transform: scale(0.97) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes florPulse {
          0%, 100% { transform: scale(1);    opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

// ============================================
// ACL INJURY — DRAMATIC FALL
// trigger: aclInjury event
// ============================================

export function AclInjuryAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  800);
    const t2 = setTimeout(() => setPhase("exit"),  2800);
    const t3 = setTimeout(() => onDone(),          3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 0.5s ease",
      }}
    >
      {/* Dark red backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at center, rgba(120,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%)"
          : "rgba(0,0,0,0.75)",
        transition: "background 0.8s ease",
      }} />

      {/* Shockwave ring */}
      {phase === "hold" && (
        <div className="absolute" style={{
          width: "300px", height: "300px",
          borderRadius: "50%",
          border: "2px solid rgba(239,68,68,0.6)",
          animation: "aclShockwave 1.2s ease-out infinite",
        }} />
      )}

      <div className="relative z-10 flex flex-col items-center gap-5">

        {/* Pixel art injury image */}
        <img
          src="/images/acl-injury-pixel.png"
          alt="ACL Injury"
          style={{
            width: "clamp(160px, 28vw, 240px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "enter" ? "aclFall 0.8s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 24px rgba(239,68,68,0.9)) drop-shadow(0 0 48px rgba(239,68,68,0.4))"
              : "drop-shadow(0 0 8px rgba(239,68,68,0.4))",
            transition: "filter 0.3s ease",
            ...(phase === "hold" ? { animation: "aclShake 0.4s ease-in-out 3" } : {}),
          }}
        />

        {/* Text badge */}
        <div
          className="text-center px-8 py-4"
          style={{
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(239,68,68,0.7)",
            boxShadow: "0 0 30px rgba(239,68,68,0.3)",
            opacity: phase === "hold" ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            className="font-black text-xl tracking-widest uppercase mb-1"
            style={{ color: "#ef4444", textShadow: "0 0 20px rgba(239,68,68,0.8)" }}
          >
            ⚠️ ACL Injury
          </div>
          <div className="text-xs tracking-[0.2em] uppercase" style={{ color: "#9ca3af" }}>
            Season-ending injury
          </div>

          {/* Medical bars */}
          <div className="mt-3 space-y-1.5">
            {[
              { label: "Ligament", pct: 15, color: "#ef4444" },
              { label: "Recovery", pct: 85, color: "#f97316" },
              { label: "Season",   pct: 5,  color: "#ef4444" },
            ].map(({ label, pct, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[9px] text-gray-500 w-16 text-right uppercase">{label}</span>
                <div className="flex-1 h-1.5 rounded-none" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-none" style={{
                    width: `${pct}%`,
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                    transition: "width 1s ease",
                  }} />
                </div>
                <span className="text-[9px] font-bold w-6" style={{ color }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aclFall {
          0%   { opacity: 0; transform: translateY(-60px) rotate(-15deg) scale(0.5); }
          60%  { opacity: 1; transform: translateY(10px) rotate(5deg) scale(1.1); }
          80%  { transform: translateY(-5px) rotate(-2deg) scale(1.0); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes aclShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25%       { transform: translateX(-8px) rotate(-3deg); }
          75%       { transform: translateX(8px) rotate(3deg); }
        }
        @keyframes aclShockwave {
          0%   { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// SAUDI OFFER — MONEY ENTRANCE
// trigger: saudiOffer event
// ============================================

export function SaudiOfferAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1000);
    const t2 = setTimeout(() => setPhase("exit"),  2800);
    const t3 = setTimeout(() => onDone(),          3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 0.5s ease",
      }}
    >
      {/* Gold/green backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at center, rgba(0,80,40,0.55) 0%, rgba(0,0,0,0.88) 100%)"
          : "rgba(0,0,0,0.78)",
        transition: "background 0.8s ease",
      }} />

      {/* Money rain */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["💰","💵","💴","💶","💰","💵","💰","💵"].map((em, i) => (
            <span key={i} style={{
              position: "absolute",
              left: `${10 + i * 11}%`,
              top: "-40px",
              fontSize: `${18 + (i % 3) * 8}px`,
              animation: `saudiMoneyRain ${1.2 + i * 0.15}s linear ${i * 0.12}s infinite`,
              opacity: 0.7,
            }}>{em}</span>
          ))}
        </div>
      )}

      {/* Glow ring */}
      <div className="absolute" style={{
        width: "clamp(240px, 38vw, 360px)",
        height: "clamp(240px, 38vw, 360px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
        animation: phase === "hold" ? "saudiPulse 1.4s ease-in-out infinite" : "none",
      }} />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Pixel portrait */}
        <img
          src="/images/saudi-offer-pixel.png"
          alt="Saudi Offer"
          style={{
            width: "clamp(160px, 28vw, 240px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "enter" ? "saudiZoomIn 1s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 28px rgba(16,185,129,0.9)) drop-shadow(0 0 56px rgba(212,175,55,0.4))"
              : "drop-shadow(0 0 8px rgba(16,185,129,0.4))",
            transition: "filter 0.3s ease",
          }}
        />

        {/* Badge */}
        <div
          className="text-center px-8 py-4"
          style={{
            background: "rgba(0,0,0,0.88)",
            border: "1px solid rgba(16,185,129,0.7)",
            boxShadow: "0 0 30px rgba(16,185,129,0.3), 0 0 60px rgba(212,175,55,0.15)",
            opacity: phase === "hold" ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div className="font-black text-xl tracking-widest uppercase mb-1"
            style={{ color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.8)" }}>
            💰 Saudi Mega Offer
          </div>
          <div className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: "#D4AF37" }}>
            The money has arrived
          </div>
        </div>
      </div>

      <style>{`
        @keyframes saudiZoomIn {
          0%   { opacity: 0; transform: scale(0.3) translateY(40px); }
          60%  { opacity: 1; transform: scale(1.06) translateY(-6px); }
          80%  { transform: scale(0.98) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes saudiPulse {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%       { transform: scale(1.18); opacity: 1;   }
        }
        @keyframes saudiMoneyRain {
          0%   { transform: translateY(0) rotate(0deg);    opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// GOAT SIGNING — Easter Egg player purchased
// trigger: after buying any secret/goat player
// ============================================

const GOAT_PORTRAITS: Record<string, string> = {
  "Yousef Alnuwasser":  "/images/yousef-pixel.png",
  "Hussain Alrezk":     "/images/hussain-alrezk.png",
  "ABDULLAH ALMUSAWI":  "/images/abdullah-almusawi.png",
  "Ali Alsaif":         "/images/ali-alsaif.png",
  "Ali AlGhanim":       "/images/ali-alghanim.png",
  "Reda Alrezk":        "/images/reda-alrezk.png",
  "Qousi":              "/images/qousi.png",
  "Ali Albrahim":       "/images/ali-albrahim.png",
  "Abdulaziz Alghariri":"/images/abdulaziz-alghariri.png",
  "Mohammed Al Abullah":"/images/mohammed-al-abullah.png",
};

type GoatAnimProps = AnimProps & { playerName: string };

export function GoatSigningAnimation({ onDone, playerName }: GoatAnimProps) {
  const [phase, setPhase] = useState<"goat" | "player" | "hold" | "exit">("goat");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("player"), 1600); // goat → player
    const t2 = setTimeout(() => setPhase("hold"),   2600); // player → hold
    const t3 = setTimeout(() => setPhase("exit"),   4800); // hold → exit
    const t4 = setTimeout(() => onDone(),           5600); // unmount
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  const portrait = GOAT_PORTRAITS[playerName];

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 1s ease-in" : "opacity 0.4s ease",
      }}
    >
      {/* Deep gold backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at center, rgba(80,55,0,0.7) 0%, rgba(0,0,0,0.92) 100%)"
          : "rgba(0,0,0,0.88)",
        transition: "background 1s ease",
      }} />

      {/* Gold particle rain */}
      {(phase === "hold" || phase === "player") && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["✨","⭐","🌟","💛","✨","⭐","🌟","✨","💫","⭐","🌟","💛"].map((em, i) => (
            <span key={i} style={{
              position: "absolute",
              left: `${(i * 8.5) % 95}%`,
              top: "-30px",
              fontSize: `${14 + (i % 4) * 6}px`,
              animation: `goatStarFall ${1.4 + i * 0.18}s linear ${i * 0.1}s infinite`,
              opacity: 0.85,
            }}>{em}</span>
          ))}
        </div>
      )}

      {/* Outer glow rings */}
      {phase === "hold" && (<>
        <div className="absolute rounded-full" style={{
          width: "clamp(280px, 45vw, 420px)", height: "clamp(280px, 45vw, 420px)",
          border: "2px solid rgba(212,175,55,0.5)",
          animation: "goatRing1 2s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          width: "clamp(340px, 55vw, 520px)", height: "clamp(340px, 55vw, 520px)",
          border: "1px solid rgba(212,175,55,0.25)",
          animation: "goatRing2 2.4s ease-in-out infinite",
        }} />
      </>)}

      <div className="relative z-10 flex flex-col items-center gap-4">

        {/* Phase 1: GOAT emoji big entrance */}
        {phase === "goat" && (
          <div style={{
            fontSize: "clamp(100px, 20vw, 160px)",
            animation: "goatEmojiBounce 1.6s cubic-bezier(0.22,1,0.36,1) forwards",
            filter: "drop-shadow(0 0 40px rgba(212,175,55,0.9))",
          }}>
            🐐
          </div>
        )}

        {/* Phase 2+: Player portrait */}
        {(phase === "player" || phase === "hold" || phase === "exit") && portrait && (
          <img
            src={portrait}
            alt={playerName}
            style={{
              width: "clamp(180px, 32vw, 260px)",
              height: "auto",
              imageRendering: "pixelated",
              objectFit: "contain",
              animation: phase === "player" ? "goatPlayerIn 1s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
              filter: phase === "hold"
                ? "drop-shadow(0 0 32px rgba(212,175,55,1)) drop-shadow(0 0 64px rgba(212,175,55,0.5)) drop-shadow(0 0 96px rgba(212,175,55,0.2))"
                : "drop-shadow(0 0 16px rgba(212,175,55,0.6))",
              transition: "filter 0.5s ease",
            }}
          />
        )}

        {/* No portrait fallback */}
        {(phase === "player" || phase === "hold") && !portrait && (
          <div style={{
            fontSize: "clamp(80px, 16vw, 130px)",
            animation: phase === "player" ? "goatPlayerIn 1s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
          }}>🐐</div>
        )}

        {/* Name badge */}
        <div style={{
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.6s ease",
          textAlign: "center",
        }}>
          <div className="px-8 py-4" style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,14,0,0.9))",
            border: "1px solid rgba(212,175,55,0.8)",
            boxShadow: "0 0 40px rgba(212,175,55,0.4), inset 0 0 20px rgba(212,175,55,0.05)",
          }}>
            <div className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(212,175,55,0.6)" }}>
              🐐 GOAT SIGNED
            </div>
            <div className="font-black text-2xl tracking-wide uppercase" style={{
              color: "#D4AF37",
              textShadow: "0 0 30px rgba(212,175,55,0.9), 0 0 60px rgba(212,175,55,0.4)",
            }}>
              {playerName}
            </div>
            <div className="text-xs tracking-[0.3em] uppercase mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              has joined your squad
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes goatEmojiBounce {
          0%   { opacity: 0; transform: scale(0.1) rotate(-20deg); }
          40%  { opacity: 1; transform: scale(1.3) rotate(8deg); }
          60%  { transform: scale(0.9) rotate(-4deg); }
          75%  { transform: scale(1.1) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes goatPlayerIn {
          0%   { opacity: 0; transform: scale(0.3) translateY(30px); }
          50%  { opacity: 1; transform: scale(1.08) translateY(-8px); }
          75%  { transform: scale(0.97) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes goatStarFall {
          0%   { transform: translateY(0) rotate(0deg) scale(1);    opacity: 1; }
          100% { transform: translateY(110vh) rotate(540deg) scale(0.5); opacity: 0; }
        }
        @keyframes goatRing1 {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%       { transform: scale(1.12); opacity: 1; }
        }
        @keyframes goatRing2 {
          0%, 100% { transform: scale(1);    opacity: 0.25; }
          50%       { transform: scale(1.08); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// أضف أنيميشنات جديدة هنا
// ============================================
