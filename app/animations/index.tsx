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
  "Abdulaziz Alghariri":"/images/abdulaziz-alghariri.png",
  "Ali AlGhanim":       "/images/ali-alghanim.png",
  "Reda Alrezk":        "/images/reda-alrezk.png",
  "Qousi":              "/images/qousi.png",
  "Ali Albrahim":       "/images/ali-albrahim.png",
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
// GOLDEN BOOT — Award celebration
// trigger: goldenBoot event
// ============================================

export function GoldenBootAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1000);
    const t2 = setTimeout(() => setPhase("exit"),  3200);
    const t3 = setTimeout(() => onDone(),          4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 0.4s ease",
      }}
    >
      {/* Gold backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at center, rgba(90,65,0,0.65) 0%, rgba(0,0,0,0.9) 100%)"
          : "rgba(0,0,0,0.82)",
        transition: "background 0.8s ease",
      }} />

      {/* Spotlight beam */}
      {phase === "hold" && (
        <div className="absolute" style={{
          width: "3px",
          height: "100vh",
          top: 0,
          background: "linear-gradient(180deg, rgba(212,175,55,0.6) 0%, transparent 60%)",
          animation: "bootSpotlight 2s ease-in-out infinite",
          transformOrigin: "top center",
        }} />
      )}

      {/* Gold confetti */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["⭐","✨","🌟","💛","⭐","✨","🌟","💫","⭐","✨","🌟","💛","✨","⭐"].map((em, i) => (
            <span key={i} style={{
              position: "absolute",
              left: `${(i * 7.3) % 95}%`,
              top: "-30px",
              fontSize: `${12 + (i % 4) * 7}px`,
              animation: `bootConfetti ${1.3 + i * 0.15}s linear ${i * 0.08}s infinite`,
            }}>{em}</span>
          ))}
        </div>
      )}

      {/* Glow rings */}
      {phase === "hold" && (<>
        <div className="absolute rounded-full" style={{
          width: "clamp(260px, 42vw, 400px)", height: "clamp(260px, 42vw, 400px)",
          border: "2px solid rgba(212,175,55,0.6)",
          animation: "bootRing 1.8s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          width: "clamp(320px, 52vw, 490px)", height: "clamp(320px, 52vw, 490px)",
          border: "1px solid rgba(212,175,55,0.25)",
          animation: "bootRing 2.2s ease-in-out infinite reverse",
        }} />
      </>)}

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Golden Boot pixel image */}
        <img
          src="/images/golden-boot-pixel.png"
          alt="Golden Boot"
          style={{
            width: "clamp(180px, 32vw, 260px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "enter"
              ? "bootSlideIn 1s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "hold"
              ? "bootFloat 2s ease-in-out infinite"
              : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 30px rgba(212,175,55,1)) drop-shadow(0 0 60px rgba(212,175,55,0.5)) drop-shadow(0 0 90px rgba(255,200,0,0.3))"
              : "drop-shadow(0 0 10px rgba(212,175,55,0.5))",
            transition: "filter 0.4s ease",
          }}
        />

        {/* Badge */}
        <div style={{
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.5s ease",
          textAlign: "center",
        }}>
          <div className="px-8 py-4" style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.92), rgba(20,14,0,0.92))",
            border: "1px solid rgba(212,175,55,0.8)",
            boxShadow: "0 0 40px rgba(212,175,55,0.35), inset 0 0 20px rgba(212,175,55,0.05)",
          }}>
            <div className="text-xs tracking-[0.4em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>
              👟 Award
            </div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{
              color: "#D4AF37",
              textShadow: "0 0 24px rgba(212,175,55,0.9), 0 0 48px rgba(212,175,55,0.4)",
            }}>
              Golden Boot
            </div>
            <div className="text-xs tracking-[0.25em] uppercase mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Top scorer of the season
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bootSlideIn {
          0%   { opacity: 0; transform: translateY(60px) rotate(-15deg) scale(0.4); }
          55%  { opacity: 1; transform: translateY(-10px) rotate(4deg) scale(1.1); }
          75%  { transform: translateY(4px) rotate(-1deg) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes bootFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes bootConfetti {
          0%   { transform: translateY(0) rotate(0deg);      opacity: 1; }
          100% { transform: translateY(110vh) rotate(480deg); opacity: 0; }
        }
        @keyframes bootRing {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%       { transform: scale(1.1);  opacity: 1; }
        }
        @keyframes bootSpotlight {
          0%, 100% { transform: rotate(-8deg); opacity: 0.6; }
          50%       { transform: rotate(8deg);  opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// BALLON D'OR — Greatest individual award
// trigger: ballonDor event
// ============================================

export function BallonDorAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1200);
    const t2 = setTimeout(() => setPhase("exit"),  4000);
    const t3 = setTimeout(() => onDone(),          4800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 0.4s ease",
      }}
    >
      {/* Deep gold backdrop with cinematic feel */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at 50% 40%, rgba(100,72,0,0.75) 0%, rgba(0,0,0,0.95) 70%)"
          : "rgba(0,0,0,0.88)",
        transition: "background 1.2s ease",
      }} />

      {/* Dramatic light beams */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute" style={{
              width: "2px",
              height: "60vh",
              top: 0,
              left: `${15 + i * 14}%`,
              background: `linear-gradient(180deg, rgba(212,175,55,${0.3 + (i % 3) * 0.15}) 0%, transparent 100%)`,
              animation: `bdBeam ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite alternate`,
              transformOrigin: "top center",
            }} />
          ))}
        </div>
      )}

      {/* Gold confetti burst */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["✨","⭐","🌟","💛","✨","⭐","🌟","💫","⭐","✨","🌟","💛","✨","⭐","💫","🌟"].map((em, i) => (
            <span key={i} style={{
              position: "absolute",
              left: `${(i * 6.5) % 95}%`,
              top: "-30px",
              fontSize: `${10 + (i % 5) * 7}px`,
              animation: `bdConfetti ${1.2 + i * 0.13}s linear ${i * 0.07}s infinite`,
            }}>{em}</span>
          ))}
        </div>
      )}

      {/* Triple rings */}
      {phase === "hold" && (<>
        <div className="absolute rounded-full" style={{
          width: "clamp(240px, 38vw, 380px)", height: "clamp(240px, 38vw, 380px)",
          border: "2px solid rgba(212,175,55,0.7)",
          animation: "bdRing 1.6s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          width: "clamp(300px, 48vw, 470px)", height: "clamp(300px, 48vw, 470px)",
          border: "1.5px solid rgba(212,175,55,0.35)",
          animation: "bdRing 2s ease-in-out 0.3s infinite reverse",
        }} />
        <div className="absolute rounded-full" style={{
          width: "clamp(360px, 58vw, 560px)", height: "clamp(360px, 58vw, 560px)",
          border: "1px solid rgba(212,175,55,0.15)",
          animation: "bdRing 2.4s ease-in-out 0.6s infinite",
        }} />
      </>)}

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Trophy image */}
        <img
          src="/images/ballon-dor-pixel.png"
          alt="Ballon d'Or"
          style={{
            width: "clamp(180px, 30vw, 250px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "enter"
              ? "bdTrophyIn 1.2s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "hold"
              ? "bdTrophyFloat 2.5s ease-in-out infinite"
              : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 32px rgba(255,200,0,1)) drop-shadow(0 0 64px rgba(212,175,55,0.7)) drop-shadow(0 0 100px rgba(212,175,55,0.3))"
              : "drop-shadow(0 0 12px rgba(212,175,55,0.5))",
            transition: "filter 0.5s ease",
          }}
        />

        {/* Badge */}
        <div style={{
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.6s ease 0.2s",
          textAlign: "center",
        }}>
          <div className="px-10 py-5" style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(25,18,0,0.95))",
            border: "1px solid rgba(212,175,55,0.9)",
            boxShadow: "0 0 50px rgba(212,175,55,0.4), 0 0 100px rgba(212,175,55,0.15), inset 0 0 30px rgba(212,175,55,0.06)",
          }}>
            <div className="text-[10px] tracking-[0.5em] uppercase mb-2" style={{ color: "rgba(212,175,55,0.55)" }}>
              The Ultimate Award
            </div>
            <div className="font-black text-3xl tracking-widest uppercase" style={{
              color: "#D4AF37",
              textShadow: "0 0 30px rgba(212,175,55,1), 0 0 60px rgba(212,175,55,0.5), 0 0 90px rgba(255,200,0,0.3)",
            }}>
              Ballon d&apos;Or
            </div>
            <div className="text-xs tracking-[0.3em] uppercase mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              Best player in the world
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bdTrophyIn {
          0%   { opacity: 0; transform: scale(0.2) translateY(80px) rotate(-10deg); }
          50%  { opacity: 1; transform: scale(1.12) translateY(-12px) rotate(3deg); }
          75%  { transform: scale(0.96) translateY(4px) rotate(-1deg); }
          100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
        }
        @keyframes bdTrophyFloat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          33%       { transform: translateY(-14px) rotate(2deg) scale(1.03); }
          66%       { transform: translateY(-6px) rotate(-1deg) scale(1.01); }
        }
        @keyframes bdConfetti {
          0%   { transform: translateY(0) rotate(0deg) scale(1);      opacity: 1; }
          100% { transform: translateY(110vh) rotate(600deg) scale(0.4); opacity: 0; }
        }
        @keyframes bdRing {
          0%, 100% { transform: scale(1);    opacity: 0.6; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
        @keyframes bdBeam {
          0%   { transform: rotate(-6deg); opacity: 0.4; }
          100% { transform: rotate(6deg);  opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// FAST FOOD ADDICTION
// trigger: fastFoodAddiction event
// ============================================

export function FastFoodAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("exit"),  3200);
    const t3 = setTimeout(() => onDone(),          4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 0.4s ease",
      }}
    >
      {/* Greasy reddish backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at center, rgba(80,20,0,0.65) 0%, rgba(0,0,0,0.92) 100%)"
          : "rgba(0,0,0,0.85)",
        transition: "background 0.8s ease",
      }} />

      {/* Falling junk food */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["🍔","🍟","🌭","🍕","🌮","🍔","🍟","🥤","🍔","🍟","🌭","🍕"].map((em, i) => (
            <span key={i} style={{
              position: "absolute",
              left: `${(i * 8.5) % 95}%`,
              top: "-30px",
              fontSize: `${16 + (i % 4) * 7}px`,
              animation: `ffFall ${1.1 + i * 0.16}s linear ${i * 0.09}s infinite`,
            }}>{em}</span>
          ))}
        </div>
      )}

      {/* Warning pulse ring */}
      {phase === "hold" && (
        <div className="absolute rounded-full" style={{
          width: "clamp(260px, 42vw, 400px)", height: "clamp(260px, 42vw, 400px)",
          border: "2px solid rgba(239,68,68,0.5)",
          animation: "ffWarningRing 1s ease-in-out infinite",
        }} />
      )}

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Pixel image */}
        <img
          src="/images/fastfood-pixel.png"
          alt="Fast Food Addiction"
          style={{
            width: "clamp(180px, 30vw, 250px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "enter"
              ? "ffBounceIn 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "hold"
              ? "ffWobble 0.6s ease-in-out infinite"
              : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 24px rgba(239,68,68,0.8)) drop-shadow(0 0 48px rgba(239,68,68,0.3))"
              : "none",
            transition: "filter 0.3s ease",
          }}
        />

        {/* Badge */}
        <div style={{
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.4s ease",
          textAlign: "center",
        }}>
          <div className="px-8 py-4" style={{
            background: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(239,68,68,0.7)",
            boxShadow: "0 0 30px rgba(239,68,68,0.25)",
          }}>
            <div className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: "rgba(239,68,68,0.6)" }}>
              ⚠️ Lifestyle Issue
            </div>
            <div className="font-black text-2xl tracking-wide uppercase" style={{
              color: "#ef4444",
              textShadow: "0 0 20px rgba(239,68,68,0.8)",
            }}>
              Fast Food Addiction
            </div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Player performance declining
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ffBounceIn {
          0%   { opacity: 0; transform: scale(0.3) translateY(-50px); }
          55%  { opacity: 1; transform: scale(1.1) translateY(8px); }
          75%  { transform: scale(0.95) translateY(-3px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ffWobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25%       { transform: rotate(-3deg) scale(1.03); }
          75%       { transform: rotate(3deg) scale(1.03); }
        }
        @keyframes ffFall {
          0%   { transform: translateY(0) rotate(0deg);      opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes ffWarningRing {
          0%, 100% { transform: scale(1);    opacity: 0.4; }
          50%       { transform: scale(1.08); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// YOUTUBE VIRAL
// trigger: youTubeViral event
// ============================================

export function YouTubeViralAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("exit"),  3400);
    const t3 = setTimeout(() => onDone(),          4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 0.4s ease",
      }}
    >
      {/* Red backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at center, rgba(180,0,0,0.55) 0%, rgba(0,0,0,0.92) 100%)"
          : "rgba(0,0,0,0.85)",
        transition: "background 0.8s ease",
      }} />

      {/* Notification popups */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {[
            { text: "+1M views", left: "5%",  top: "15%", delay: "0s" },
            { text: "+500K 👍", left: "75%", top: "20%", delay: "0.2s" },
            { text: "TRENDING 🔥", left: "10%", top: "70%", delay: "0.4s" },
            { text: "+2M views", left: "70%", top: "65%", delay: "0.6s" },
            { text: "VIRAL ⚡",  left: "40%", top: "10%", delay: "0.3s" },
          ].map((n, i) => (
            <div key={i} className="absolute font-black text-xs px-2 py-1" style={{
              left: n.left, top: n.top,
              background: "rgba(255,0,0,0.85)",
              color: "white",
              border: "1px solid rgba(255,100,100,0.6)",
              boxShadow: "0 0 10px rgba(255,0,0,0.5)",
              animation: `ytNotif 2s ease-in-out ${n.delay} infinite`,
              whiteSpace: "nowrap",
            }}>{n.text}</div>
          ))}
        </div>
      )}

      {/* Red glow ring */}
      {phase === "hold" && (
        <div className="absolute rounded-full" style={{
          width: "clamp(260px, 42vw, 400px)", height: "clamp(260px, 42vw, 400px)",
          border: "2px solid rgba(255,0,0,0.5)",
          animation: "ytRing 1.4s ease-in-out infinite",
        }} />
      )}

      <div className="relative z-10 flex flex-col items-center gap-4">
        <img
          src="/images/youtube-viral-pixel.png"
          alt="YouTube Viral"
          style={{
            width: "clamp(200px, 34vw, 280px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "enter"
              ? "ytZoomIn 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "hold"
              ? "ytPulse 1.2s ease-in-out infinite"
              : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 28px rgba(255,0,0,0.9)) drop-shadow(0 0 56px rgba(255,80,0,0.4))"
              : "none",
            transition: "filter 0.3s ease",
          }}
        />

        <div style={{
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.4s ease",
          textAlign: "center",
        }}>
          <div className="px-8 py-4" style={{
            background: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(255,0,0,0.7)",
            boxShadow: "0 0 30px rgba(255,0,0,0.3)",
          }}>
            <div className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: "rgba(255,80,0,0.7)" }}>
              📺 Going Viral
            </div>
            <div className="font-black text-2xl tracking-wide uppercase" style={{
              color: "#ff4444",
              textShadow: "0 0 20px rgba(255,0,0,0.9)",
            }}>
              YouTube Viral
            </div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Millions watching
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ytZoomIn {
          0%   { opacity: 0; transform: scale(0.3) rotate(-5deg); }
          55%  { opacity: 1; transform: scale(1.1) rotate(2deg); }
          75%  { transform: scale(0.97) rotate(-1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes ytPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.05); }
        }
        @keyframes ytNotif {
          0%   { opacity: 0; transform: translateY(8px) scale(0.9); }
          20%  { opacity: 1; transform: translateY(0) scale(1); }
          80%  { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-8px) scale(0.9); }
        }
        @keyframes ytRing {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// GOLDEN BOY — Best young player award
// trigger: goldenBoy event
// ============================================

export function GoldenBoyAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1100);
    const t2 = setTimeout(() => setPhase("exit"),  3600);
    const t3 = setTimeout(() => onDone(),          4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 0.4s ease",
      }}
    >
      {/* Warm gold backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at 50% 45%, rgba(100,75,0,0.65) 0%, rgba(0,0,0,0.92) 70%)"
          : "rgba(0,0,0,0.85)",
        transition: "background 1s ease",
      }} />

      {/* Star confetti */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["⭐","✨","🌟","💛","⭐","✨","💫","🌟","⭐","✨","⭐","💛","🌟","✨"].map((em, i) => (
            <span key={i} style={{
              position: "absolute",
              left: `${(i * 7.4) % 95}%`,
              top: "-30px",
              fontSize: `${12 + (i % 4) * 7}px`,
              animation: `gbConfetti ${1.2 + i * 0.14}s linear ${i * 0.08}s infinite`,
            }}>{em}</span>
          ))}
        </div>
      )}

      {/* Glow rings */}
      {phase === "hold" && (<>
        <div className="absolute rounded-full" style={{
          width: "clamp(250px, 40vw, 390px)", height: "clamp(250px, 40vw, 390px)",
          border: "2px solid rgba(255,200,0,0.6)",
          animation: "gbRing 1.7s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          width: "clamp(310px, 50vw, 480px)", height: "clamp(310px, 50vw, 480px)",
          border: "1px solid rgba(255,200,0,0.25)",
          animation: "gbRing 2.1s ease-in-out 0.4s infinite reverse",
        }} />
      </>)}

      <div className="relative z-10 flex flex-col items-center gap-5">
        <img
          src="/images/golden-boy-pixel.png"
          alt="Golden Boy"
          style={{
            width: "clamp(160px, 28vw, 230px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "enter"
              ? "gbEnter 1.1s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "hold"
              ? "gbFloat 2.2s ease-in-out infinite"
              : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 28px rgba(255,200,0,1)) drop-shadow(0 0 56px rgba(212,175,55,0.6)) drop-shadow(0 0 84px rgba(212,175,55,0.2))"
              : "drop-shadow(0 0 10px rgba(212,175,55,0.4))",
            transition: "filter 0.4s ease",
          }}
        />

        <div style={{
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.5s ease 0.2s",
          textAlign: "center",
        }}>
          <div className="px-9 py-4" style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.92), rgba(22,16,0,0.92))",
            border: "1px solid rgba(255,200,0,0.8)",
            boxShadow: "0 0 40px rgba(255,200,0,0.3), inset 0 0 20px rgba(255,200,0,0.04)",
          }}>
            <div className="text-[10px] tracking-[0.45em] uppercase mb-1.5" style={{ color: "rgba(255,200,0,0.55)" }}>
              🌟 Young Award
            </div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{
              color: "#ffc800",
              textShadow: "0 0 24px rgba(255,200,0,1), 0 0 48px rgba(212,175,55,0.5)",
            }}>
              Golden Boy
            </div>
            <div className="text-xs tracking-[0.25em] uppercase mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Best young player of the year
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gbEnter {
          0%   { opacity: 0; transform: scale(0.25) translateY(50px) rotate(10deg); }
          55%  { opacity: 1; transform: scale(1.1) translateY(-8px) rotate(-2deg); }
          75%  { transform: scale(0.97) translateY(3px) rotate(0deg); }
          100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
        }
        @keyframes gbFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-10px) rotate(1.5deg); }
        }
        @keyframes gbConfetti {
          0%   { transform: translateY(0) rotate(0deg);       opacity: 1; }
          100% { transform: translateY(110vh) rotate(500deg); opacity: 0; }
        }
        @keyframes gbRing {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%       { transform: scale(1.09); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// RECORD TRANSFER FEE
// trigger: recordTransfer event
// Style: slides from LEFT, green money theme, counter effect
// ============================================

export function RecordTransferAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("exit"),  3400);
    const t3 = setTimeout(() => onDone(),          4100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  // Counter animation
  useEffect(() => {
    if (phase !== "hold") return;
    let val = 0;
    const interval = setInterval(() => {
      val += 7;
      if (val >= 100) { setCounter(100); clearInterval(interval); return; }
      setCounter(val);
    }, 18);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.7s ease-in" : "opacity 0.3s ease",
      }}
    >
      {/* Dark green tinted backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at 35% 50%, rgba(0,60,20,0.6) 0%, rgba(0,0,0,0.92) 70%)"
          : "rgba(0,0,0,0.82)",
        transition: "background 0.9s ease",
      }} />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* Floating dollar signs from right side */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["$","€","£","$","€","$","£","$"].map((s, i) => (
            <span key={i} style={{
              position: "absolute",
              right: `${(i * 12) % 85}%`,
              top: `${(i * 13 + 5) % 80}%`,
              fontSize: `${14 + (i % 3) * 10}px`,
              fontWeight: 900,
              color: `rgba(0,${180 + i * 10},${60 + i * 8},${0.15 + (i % 3) * 0.08})`,
              animation: `rtFloat ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite alternate`,
              fontFamily: "monospace",
            }}>{s}</span>
          ))}
        </div>
      )}

      {/* Main content — slides from LEFT */}
      <div
        className="relative z-10 flex items-center gap-6 px-8 py-6"
        style={{
          animation: phase === "enter"
            ? "rtSlideFromLeft 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
            : phase === "exit"
            ? "rtSlideToRight 0.7s ease-in forwards"
            : "none",
          background: phase === "hold" ? "rgba(0,0,0,0.85)" : "transparent",
          border: phase === "hold" ? "1px solid rgba(0,200,80,0.5)" : "none",
          boxShadow: phase === "hold" ? "0 0 40px rgba(0,180,60,0.2), inset 0 0 20px rgba(0,180,60,0.04)" : "none",
          transition: "background 0.4s, border 0.4s, box-shadow 0.4s",
          maxWidth: "90vw",
        }}
      >
        {/* Image */}
        <img
          src="/images/record-transfer-pixel.png"
          alt="Record Transfer"
          style={{
            width: "clamp(130px, 22vw, 200px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            flexShrink: 0,
            filter: phase === "hold"
              ? "drop-shadow(0 0 20px rgba(0,220,80,0.8)) drop-shadow(0 0 40px rgba(0,180,60,0.4))"
              : "none",
            animation: phase === "hold" ? "rtImageBob 2s ease-in-out infinite" : "none",
            transition: "filter 0.4s ease",
          }}
        />

        {/* Text */}
        <div style={{ opacity: phase === "hold" ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}>
          <div className="text-[9px] tracking-[0.5em] uppercase mb-1" style={{ color: "rgba(0,200,80,0.6)" }}>
            💸 Breaking Record
          </div>
          <div className="font-black text-xl tracking-wide uppercase leading-tight" style={{
            color: "#00e060",
            textShadow: "0 0 20px rgba(0,220,80,0.9)",
          }}>
            Record Transfer Fee
          </div>
          <div className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            Historic deal completed
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[9px] mb-1" style={{ color: "rgba(0,200,80,0.6)" }}>
              <span>TRANSFER VALUE</span><span>{counter}%</span>
            </div>
            <div className="h-1.5" style={{ background: "rgba(255,255,255,0.08)", width: "180px" }}>
              <div className="h-full" style={{
                width: `${counter}%`,
                background: "linear-gradient(90deg, #00b840, #00e060)",
                boxShadow: "0 0 8px rgba(0,200,80,0.8)",
                transition: "width 0.05s linear",
              }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rtSlideFromLeft {
          0%   { opacity: 0; transform: translateX(-120px) scale(0.85); }
          60%  { opacity: 1; transform: translateX(8px) scale(1.02); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes rtSlideToRight {
          0%   { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(120px); }
        }
        @keyframes rtImageBob {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-8px) scale(1.03); }
        }
        @keyframes rtFloat {
          0%   { transform: translateY(0) rotate(-5deg); }
          100% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// WONDERKID — Rising star
// trigger: wonderkid event
// Style: splits from center, electric blue/cyan, glitch effect
// ============================================

export function WonderkidAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1000);
    const t2 = setTimeout(() => setPhase("exit"),  3400);
    const t3 = setTimeout(() => onDone(),          4100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.7s ease-in" : "opacity 0.3s ease",
      }}
    >
      {/* Electric blue backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold"
          ? "radial-gradient(ellipse at center, rgba(0,40,100,0.65) 0%, rgba(0,0,0,0.93) 70%)"
          : "rgba(0,0,0,0.85)",
        transition: "background 0.8s ease",
      }} />

      {/* Glitch lines */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute w-full" style={{
              height: "1px",
              top: `${15 + i * 17}%`,
              background: `rgba(0,180,255,${0.12 + i * 0.04})`,
              animation: `wkGlitch ${0.8 + i * 0.2}s steps(1) ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Rising particles */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: `${3 + (i % 3) * 3}px`,
              height: `${3 + (i % 3) * 3}px`,
              left: `${(i * 8.5) % 92}%`,
              bottom: "0",
              background: i % 2 === 0 ? "rgba(0,180,255,0.8)" : "rgba(0,255,200,0.6)",
              animation: `wkRise ${1.5 + i * 0.2}s ease-out ${i * 0.1}s infinite`,
              boxShadow: "0 0 6px rgba(0,180,255,0.8)",
            }} />
          ))}
        </div>
      )}

      {/* Cyan glow ring */}
      {phase === "hold" && (
        <div className="absolute rounded-full" style={{
          width: "clamp(250px, 40vw, 390px)", height: "clamp(250px, 40vw, 390px)",
          border: "2px solid rgba(0,200,255,0.5)",
          animation: "wkRing 1.5s ease-in-out infinite",
          boxShadow: "0 0 20px rgba(0,200,255,0.2)",
        }} />
      )}

      <div className="relative z-10 flex flex-col items-center gap-4">
        <img
          src="/images/wonderkid-pixel.png"
          alt="Wonderkid"
          style={{
            width: "clamp(150px, 26vw, 220px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "enter"
              ? "wkSplitIn 1s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "hold"
              ? "wkGlow 1.8s ease-in-out infinite"
              : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 20px rgba(0,200,255,0.9)) drop-shadow(0 0 40px rgba(0,150,255,0.5))"
              : "none",
            transition: "filter 0.4s ease",
          }}
        />

        <div style={{
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.4s ease 0.2s",
          textAlign: "center",
        }}>
          <div className="px-8 py-4" style={{
            background: "rgba(0,5,20,0.92)",
            border: "1px solid rgba(0,200,255,0.6)",
            boxShadow: "0 0 30px rgba(0,180,255,0.25), inset 0 0 15px rgba(0,180,255,0.04)",
          }}>
            <div className="text-[9px] tracking-[0.5em] uppercase mb-1.5" style={{ color: "rgba(0,200,255,0.55)" }}>
              🚀 Rising Star
            </div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{
              color: "#00c8ff",
              textShadow: "0 0 20px rgba(0,200,255,1), 0 0 40px rgba(0,150,255,0.5)",
            }}>
              Wonderkid
            </div>
            <div className="text-xs tracking-[0.25em] uppercase mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              The next big thing
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wkSplitIn {
          0%   { opacity: 0; transform: scaleX(0.1) scaleY(1.4); }
          50%  { opacity: 1; transform: scaleX(1.08) scaleY(0.95); }
          75%  { transform: scaleX(0.97) scaleY(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes wkGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(0,200,255,0.9)) drop-shadow(0 0 40px rgba(0,150,255,0.5)); }
          50%       { filter: drop-shadow(0 0 30px rgba(0,220,255,1)) drop-shadow(0 0 60px rgba(0,180,255,0.7)); }
        }
        @keyframes wkRise {
          0%   { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
        }
        @keyframes wkRing {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
        @keyframes wkGlitch {
          0%, 90%, 100% { opacity: 0; transform: translateX(0); }
          92%            { opacity: 1; transform: translateX(-8px); }
          95%            { opacity: 1; transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// BOB PAISLEY DISASTER — Plane crash event
// trigger: bobPaisleyDisaster event
// Style: flies in from right → explosion → shake screen
// ============================================

export function BobPaisleyAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"fly" | "explode" | "hold" | "exit">("fly");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("explode"), 1000);
    const t2 = setTimeout(() => setPhase("hold"),    1600);
    const t3 = setTimeout(() => setPhase("exit"),    3600);
    const t4 = setTimeout(() => onDone(),            4300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.7s ease-in" : "opacity 0.3s ease",
        animation: phase === "explode" ? "bpScreenShake 0.5s ease-out" : "none",
      }}
    >
      {/* Dark smoke backdrop */}
      <div className="absolute inset-0" style={{
        background: phase === "hold" || phase === "explode"
          ? "radial-gradient(ellipse at center, rgba(60,20,0,0.7) 0%, rgba(5,0,0,0.95) 70%)"
          : "rgba(0,0,0,0.5)",
        transition: "background 0.4s ease",
      }} />

      {/* Smoke particles */}
      {(phase === "hold") && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: `${30 + i * 15}px`,
              height: `${30 + i * 15}px`,
              left: `${30 + (i * 7) % 40}%`,
              top: `${20 + (i * 8) % 40}%`,
              background: `rgba(${40 + i * 5},${20 + i * 3},${10 + i * 2},0.4)`,
              filter: "blur(12px)",
              animation: `bpSmoke ${2 + i * 0.3}s ease-out ${i * 0.1}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Fire sparks */}
      {phase === "explode" && (
        <div className="absolute inset-0 overflow-hidden">
          {["🔥","💥","🔥","💥","🔥","💥","🔥","💥"].map((em, i) => (
            <span key={i} style={{
              position: "absolute",
              left: `${30 + (i * 6) % 40}%`,
              top: `${25 + (i * 7) % 35}%`,
              fontSize: `${20 + (i % 3) * 14}px`,
              animation: `bpSpark 0.6s ease-out ${i * 0.05}s forwards`,
            }}>{em}</span>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Plane image */}
        <img
          src="/images/bob-paisley-pixel.png"
          alt="Bob Paisley Disaster"
          style={{
            width: "clamp(220px, 38vw, 320px)",
            height: "auto",
            imageRendering: "pixelated",
            objectFit: "contain",
            animation: phase === "fly"
              ? "bpFlyIn 1s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "explode"
              ? "bpExplode 0.5s ease-out forwards"
              : phase === "hold"
              ? "bpHover 2.5s ease-in-out infinite"
              : "none",
            filter: phase === "hold"
              ? "drop-shadow(0 0 20px rgba(255,80,0,0.8)) drop-shadow(0 0 40px rgba(255,40,0,0.4))"
              : phase === "explode"
              ? "drop-shadow(0 0 40px rgba(255,200,0,1)) brightness(1.5)"
              : "none",
            transition: "filter 0.3s ease",
          }}
        />

        {/* Badge */}
        <div style={{
          opacity: phase === "hold" ? 1 : 0,
          transition: "opacity 0.5s ease",
          textAlign: "center",
        }}>
          <div className="px-8 py-4" style={{
            background: "rgba(5,0,0,0.92)",
            border: "1px solid rgba(255,80,0,0.7)",
            boxShadow: "0 0 30px rgba(255,60,0,0.3)",
          }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1.5" style={{ color: "rgba(255,120,0,0.65)" }}>
              ✈️ Disaster
            </div>
            <div className="font-black text-2xl tracking-wide uppercase" style={{
              color: "#ff5000",
              textShadow: "0 0 20px rgba(255,80,0,0.9)",
            }}>
              Bob Paisley
            </div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              A catastrophic turn of events
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bpFlyIn {
          0%   { opacity: 0; transform: translateX(120vw) rotate(-15deg) scale(0.6); }
          70%  { opacity: 1; transform: translateX(-10px) rotate(3deg) scale(1.05); }
          100% { opacity: 1; transform: translateX(0) rotate(0deg) scale(1); }
        }
        @keyframes bpExplode {
          0%   { transform: scale(1) rotate(0deg); }
          30%  { transform: scale(1.3) rotate(-5deg); filter: brightness(2); }
          60%  { transform: scale(0.85) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes bpHover {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          40%       { transform: translateY(-8px) rotate(-2deg); }
          70%       { transform: translateY(4px) rotate(1deg); }
        }
        @keyframes bpSmoke {
          0%   { transform: translateY(0) scale(1); opacity: 0.4; }
          100% { transform: translateY(-60px) scale(1.8); opacity: 0; }
        }
        @keyframes bpSpark {
          0%   { opacity: 1; transform: scale(0.5) translate(0,0); }
          100% { opacity: 0; transform: scale(1.5) translate(${Math.random() > 0.5 ? '' : '-'}30px,-40px); }
        }
        @keyframes bpScreenShake {
          0%, 100% { transform: translate(0,0); }
          20%       { transform: translate(-8px, 4px); }
          40%       { transform: translate(8px,-4px); }
          60%       { transform: translate(-5px, 3px); }
          80%       { transform: translate(5px,-2px); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// HOT MARKET — Style: zoom from top, green flash
// ============================================
export function HotMarketAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  800);
    const t2 = setTimeout(() => setPhase("exit"),  2800);
    const t3 = setTimeout(() => onDone(),          3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity: phase==="exit"?0:1, transition: phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s ease" }}>
      <div className="absolute inset-0" style={{ background: phase==="hold"?"radial-gradient(ellipse at center, rgba(0,70,10,0.6) 0%, rgba(0,0,0,0.92) 70%)":"rgba(0,0,0,0.82)", transition:"background 0.8s ease" }} />
      {phase==="hold" && <div className="absolute inset-0 overflow-hidden">{["📈","💹","📈","💹","📈","💹","📈","💹"].map((em,i)=><span key={i} style={{position:"absolute",left:`${(i*12)%92}%`,top:"-20px",fontSize:`${16+(i%3)*8}px`,animation:`hmFall ${1.2+i*0.15}s linear ${i*0.1}s infinite`}}>{em}</span>)}</div>}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/hot-market-pixel.png" alt="Hot Market" style={{ width:"clamp(200px,34vw,280px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"hmDrop 0.8s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"hmBob 2s ease-in-out infinite":"none", filter:phase==="hold"?"drop-shadow(0 0 24px rgba(0,220,80,0.9)) drop-shadow(0 0 48px rgba(0,180,60,0.4))":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.4s ease", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(0,5,0,0.92)", border:"1px solid rgba(0,200,80,0.7)", boxShadow:"0 0 30px rgba(0,180,60,0.25)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(0,200,80,0.6)" }}>🔥 Market Event</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#00e060", textShadow:"0 0 20px rgba(0,220,80,0.9)" }}>Hot Market</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Player values surging</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes hmDrop{0%{opacity:0;transform:translateY(-80px) scale(0.7)}60%{opacity:1;transform:translateY(8px) scale(1.05)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes hmBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes hmFall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// ONE SEASON WONDER — Style: spotlight from above, fades fast
// ============================================
export function OneSeasonWonderAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("exit"),  3000);
    const t3 = setTimeout(() => onDone(),          3700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s ease" }}>
      <div className="absolute inset-0" style={{ background:phase==="hold"?"radial-gradient(ellipse at 50% 30%, rgba(255,180,0,0.4) 0%, rgba(0,0,0,0.93) 60%)":"rgba(0,0,0,0.85)", transition:"background 0.8s ease" }} />
      {phase==="hold" && <div className="absolute" style={{ width:"4px", height:"100vh", top:0, left:"50%", background:"linear-gradient(180deg,rgba(255,220,0,0.8) 0%,transparent 50%)", animation:"oswSpot 2s ease-in-out infinite alternate", transformOrigin:"top center" }} />}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/one-season-wonder-pixel.png" alt="One Season Wonder" style={{ width:"clamp(200px,34vw,280px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"oswIn 0.9s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"oswFloat 2.5s ease-in-out infinite":"none", filter:phase==="hold"?"drop-shadow(0 0 24px rgba(255,180,0,0.8))":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.4s ease", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(10,8,0,0.92)", border:"1px solid rgba(255,180,0,0.7)", boxShadow:"0 0 30px rgba(255,160,0,0.2)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(255,180,0,0.6)" }}>🎯 Limited Glory</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#ffb400", textShadow:"0 0 20px rgba(255,180,0,0.9)" }}>One Season Wonder</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Shine while it lasts</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes oswIn{0%{opacity:0;transform:scale(1.4) translateY(-30px)}60%{opacity:1;transform:scale(0.97) translateY(4px)}100%{opacity:1;transform:scale(1) translateY(0)}}@keyframes oswFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes oswSpot{0%{transform:rotate(-12deg)}100%{transform:rotate(12deg)}}`}</style>
    </div>
  );
}

// ============================================
// CASINO NIGHT — Style: slot machine flash, multicolor
// ============================================
export function CasinoNightAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("exit"),  3200);
    const t3 = setTimeout(() => onDone(),          4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s ease" }}>
      <div className="absolute inset-0" style={{ background:phase==="hold"?"radial-gradient(ellipse at center, rgba(80,40,0,0.65) 0%, rgba(0,0,0,0.93) 70%)":"rgba(0,0,0,0.85)", transition:"background 0.8s ease" }} />
      {phase==="hold" && <div className="absolute inset-0 overflow-hidden">{["🎰","🃏","🎲","💰","🎰","🃏","🎲","💰","🎰","🃏"].map((em,i)=><span key={i} style={{position:"absolute",left:`${(i*10)%92}%`,top:`${(i*9+5)%80}%`,fontSize:`${14+(i%3)*8}px`,animation:`cnFloat ${1.5+i*0.2}s ease-in-out ${i*0.1}s infinite alternate`}}>{em}</span>)}</div>}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/casino-night-pixel.png" alt="Casino Night" style={{ width:"clamp(180px,30vw,250px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"cnIn 0.9s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"cnPulse 1.5s ease-in-out infinite":"none", filter:phase==="hold"?"drop-shadow(0 0 28px rgba(255,180,0,0.9)) drop-shadow(0 0 56px rgba(255,100,0,0.4))":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.4s ease", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(10,5,0,0.92)", border:"1px solid rgba(255,160,0,0.7)", boxShadow:"0 0 30px rgba(255,130,0,0.25)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(255,160,0,0.6)" }}>🎰 Risky Night</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#ffaa00", textShadow:"0 0 20px rgba(255,160,0,0.9)" }}>Casino Night</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Luck of the draw</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes cnIn{0%{opacity:0;transform:rotate(-10deg) scale(0.4)}60%{opacity:1;transform:rotate(3deg) scale(1.08)}100%{opacity:1;transform:rotate(0) scale(1)}}@keyframes cnPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes cnFloat{0%{transform:translateY(0) rotate(-5deg)}100%{transform:translateY(-15px) rotate(5deg)}}`}</style>
    </div>
  );
}

// ============================================
// MARKET CRASH — Style: drops from top, red screen flash
// ============================================
export function MarketCrashAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  800);
    const t2 = setTimeout(() => setPhase("exit"),  2800);
    const t3 = setTimeout(() => onDone(),          3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s ease", animation:phase==="enter"?"mcFlash 0.5s ease-out":"none" }}>
      <div className="absolute inset-0" style={{ background:phase==="hold"?"radial-gradient(ellipse at center, rgba(80,0,0,0.65) 0%, rgba(0,0,0,0.93) 70%)":"rgba(0,0,0,0.85)", transition:"background 0.5s ease" }} />
      {phase==="hold" && <div className="absolute inset-0 overflow-hidden">{["📉","💸","📉","💸","📉","💸","📉","💸"].map((em,i)=><span key={i} style={{position:"absolute",left:`${(i*12)%92}%`,top:"-20px",fontSize:`${16+(i%3)*8}px`,animation:`mcDrop ${1+i*0.12}s linear ${i*0.08}s infinite`}}>{em}</span>)}</div>}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/market-crash-pixel.png" alt="Market Crash" style={{ width:"clamp(200px,34vw,280px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"mcFallIn 0.8s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"mcShake 0.5s ease-in-out 3":"none", filter:phase==="hold"?"drop-shadow(0 0 24px rgba(255,0,0,0.9)) drop-shadow(0 0 48px rgba(200,0,0,0.4))":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.4s ease", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(10,0,0,0.92)", border:"1px solid rgba(255,0,0,0.7)", boxShadow:"0 0 30px rgba(200,0,0,0.25)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(255,80,80,0.6)" }}>📉 Market Disaster</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#ff3333", textShadow:"0 0 20px rgba(255,50,50,0.9)" }}>Market Crash</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Values collapsing</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes mcFlash{0%,100%{background:transparent}50%{background:rgba(200,0,0,0.3)}}@keyframes mcFallIn{0%{opacity:0;transform:translateY(-60px) scale(0.8)}60%{opacity:1;transform:translateY(6px) scale(1.04)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes mcShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}@keyframes mcDrop{0%{transform:translateY(0)}100%{transform:translateY(110vh);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// FAILED TRANSFER — Style: slides from right, crosses out
// ============================================
export function FailedTransferAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("exit"),  3000);
    const t3 = setTimeout(() => onDone(),          3700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s ease" }}>
      <div className="absolute inset-0" style={{ background:phase==="hold"?"radial-gradient(ellipse at center, rgba(60,0,60,0.6) 0%, rgba(0,0,0,0.92) 70%)":"rgba(0,0,0,0.85)", transition:"background 0.8s ease" }} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/failed-transfer-pixel.png" alt="Failed Transfer" style={{ width:"clamp(200px,34vw,280px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"ftSlide 0.9s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"ftHover 2s ease-in-out infinite":"none", filter:phase==="hold"?"drop-shadow(0 0 20px rgba(200,0,200,0.7))":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.4s ease", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(8,0,8,0.92)", border:"1px solid rgba(180,0,180,0.6)", boxShadow:"0 0 30px rgba(150,0,150,0.2)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(200,0,200,0.6)" }}>❌ Deal Collapsed</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#cc00cc", textShadow:"0 0 20px rgba(180,0,180,0.9)" }}>Failed Transfer</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Negotiations broke down</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes ftSlide{0%{opacity:0;transform:translateX(100px) scale(0.85)}60%{opacity:1;transform:translateX(-6px) scale(1.03)}100%{opacity:1;transform:translateX(0) scale(1)}}@keyframes ftHover{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-8px) rotate(-1deg)}}`}</style>
    </div>
  );
}

// ============================================
// BENCH WARMER — Style: slow drooping entry, cold blue
// ============================================
export function BenchWarmerAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1000);
    const t2 = setTimeout(() => setPhase("exit"),  3200);
    const t3 = setTimeout(() => onDone(),          4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.4s ease" }}>
      <div className="absolute inset-0" style={{ background:phase==="hold"?"radial-gradient(ellipse at center, rgba(0,20,60,0.65) 0%, rgba(0,0,0,0.93) 70%)":"rgba(0,0,0,0.85)", transition:"background 0.9s ease" }} />
      {phase==="hold" && <div className="absolute inset-0 overflow-hidden">{["💤","😴","💤","😴","💤","😴"].map((em,i)=><span key={i} style={{position:"absolute",left:`${10+(i*16)}%`,bottom:`${20+(i%3)*15}%`,fontSize:`${16+(i%3)*6}px`,animation:`bwFloat ${2+i*0.3}s ease-in-out ${i*0.2}s infinite alternate`}}>{em}</span>)}</div>}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/bench-warmer-pixel.png" alt="Bench Warmer" style={{ width:"clamp(220px,36vw,300px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"bwSlump 1s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"bwSad 3s ease-in-out infinite":"none", filter:phase==="hold"?"drop-shadow(0 0 20px rgba(50,100,255,0.6)) drop-shadow(0 0 40px rgba(30,80,200,0.3))":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.5s ease", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(0,3,12,0.92)", border:"1px solid rgba(50,100,255,0.5)", boxShadow:"0 0 30px rgba(30,80,200,0.2)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(80,130,255,0.6)" }}>🪑 Sidelined</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#5080ff", textShadow:"0 0 20px rgba(60,100,255,0.8)" }}>Bench Warmer</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Not seeing any game time</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes bwSlump{0%{opacity:0;transform:translateY(-40px) scale(0.9)}70%{opacity:1;transform:translateY(6px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes bwSad{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(6px) rotate(-1deg)}}@keyframes bwFloat{0%{transform:translateY(0)}100%{transform:translateY(-12px)}}`}</style>
    </div>
  );
}

// ============================================
// BREAKUP SEASON — Style: splits apart from center, pink/grey
// ============================================
export function BreakupSeasonAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1000);
    const t2 = setTimeout(() => setPhase("exit"),  3400);
    const t3 = setTimeout(() => onDone(),          4100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.4s ease" }}>
      <div className="absolute inset-0" style={{ background:phase==="hold"?"radial-gradient(ellipse at center, rgba(60,0,30,0.6) 0%, rgba(0,0,0,0.93) 70%)":"rgba(0,0,0,0.85)", transition:"background 0.9s ease" }} />
      {/* Falling broken hearts */}
      {phase==="hold" && <div className="absolute inset-0 overflow-hidden">{["💔","💔","💔","💔","💔","💔","💔","💔"].map((em,i)=><span key={i} style={{position:"absolute",left:`${(i*12)%92}%`,top:"-20px",fontSize:`${14+(i%3)*8}px`,animation:`bsHeartFall ${1.3+i*0.14}s linear ${i*0.09}s infinite`}}>{em}</span>)}</div>}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/breakup-season-pixel.png" alt="Breakup Season" style={{ width:"clamp(240px,38vw,320px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"bsSplitIn 1s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"bsSad 3s ease-in-out infinite":"none", filter:phase==="hold"?"drop-shadow(0 0 20px rgba(200,0,80,0.7)) drop-shadow(0 0 40px rgba(150,0,60,0.3))":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.5s ease", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(10,0,5,0.92)", border:"1px solid rgba(200,0,80,0.6)", boxShadow:"0 0 30px rgba(160,0,60,0.2)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(220,0,90,0.6)" }}>💔 Personal Life</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#cc0050", textShadow:"0 0 20px rgba(200,0,80,0.9)" }}>Breakup Season</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Off the pitch troubles</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes bsSplitIn{0%{opacity:0;transform:scale(0.5) translateY(30px)}55%{opacity:1;transform:scale(1.06) translateY(-5px)}100%{opacity:1;transform:scale(1) translateY(0)}}@keyframes bsSad{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(5px) rotate(-0.5deg)}}@keyframes bsHeartFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(180deg);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// FREE TRANSFER — Style: walks off screen, fading grey
// ============================================
export function FreeTransferAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("exit"),  3200);
    const t3 = setTimeout(() => onDone(),          3900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.4s ease" }}>
      <div className="absolute inset-0" style={{ background:phase==="hold"?"radial-gradient(ellipse at 30% 50%, rgba(20,20,40,0.65) 0%, rgba(0,0,0,0.93) 70%)":"rgba(0,0,0,0.85)", transition:"background 0.8s ease" }} />
      {/* Dotted path trail */}
      {phase==="hold" && <div className="absolute bottom-1/3 left-0 right-0 flex justify-center gap-3">{[...Array(8)].map((_,i)=><div key={i} className="rounded-full" style={{width:"6px",height:"6px",background:`rgba(150,150,180,${0.5-i*0.05})`,animation:`ftDotPulse 1.5s ease-in-out ${i*0.15}s infinite`}} />)}</div>}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/free-transfer-pixel.png" alt="Free Transfer" style={{ width:"clamp(200px,32vw,270px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"ftWalkIn 0.9s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"ftWalkHold 2.5s ease-in-out infinite":"none", filter:phase==="hold"?"drop-shadow(0 0 16px rgba(120,120,160,0.6)) drop-shadow(0 0 32px rgba(80,80,120,0.3)) grayscale(0.3)":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.5s ease", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(5,5,10,0.92)", border:"1px solid rgba(120,120,180,0.5)", boxShadow:"0 0 30px rgba(80,80,140,0.2)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(140,140,200,0.6)" }}>📋 Contract Expired</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#8888cc", textShadow:"0 0 20px rgba(120,120,180,0.8)" }}>Free Transfer</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Player leaving for nothing</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes ftWalkIn{0%{opacity:0;transform:translateX(-80px) scale(0.85)}60%{opacity:1;transform:translateX(6px) scale(1.03)}100%{opacity:1;transform:translateX(0) scale(1)}}@keyframes ftWalkHold{0%,100%{transform:translateX(0)}50%{transform:translateX(8px)}}@keyframes ftDotPulse{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.4);opacity:1}}`}</style>
    </div>
  );
}

// ============================================
// MAJOR INJURY — Style: screen goes dark, red pulse, drops down
// ============================================
export function MajorInjuryAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  800);
    const t2 = setTimeout(() => setPhase("exit"),  3200);
    const t3 = setTimeout(() => onDone(),          4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.4s ease" }}>
      <div className="absolute inset-0" style={{ background:phase==="hold"?"radial-gradient(ellipse at center, rgba(70,0,0,0.7) 0%, rgba(0,0,0,0.96) 65%)":"rgba(0,0,0,0.88)", transition:"background 0.6s ease" }} />
      {/* Heartbeat pulse lines */}
      {phase==="hold" && <div className="absolute bottom-1/4 left-0 right-0 flex justify-center items-center gap-1 px-8">{[2,1,3,8,1,2,1,4,1,2].map((h,i)=><div key={i} style={{width:"14px",height:`${h*8}px`,background:`rgba(255,${40-h*2},${40-h*2},${0.5+h*0.05})`,animation:`miPulse 1.2s ease-in-out ${i*0.08}s infinite`}} />)}</div>}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/major-injury-pixel.png" alt="Major Injury" style={{ width:"clamp(240px,40vw,320px)", imageRendering:"pixelated", objectFit:"contain", animation:phase==="enter"?"miDropIn 0.8s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"miBreath 3s ease-in-out infinite":"none", filter:phase==="hold"?"drop-shadow(0 0 24px rgba(255,30,30,0.7)) drop-shadow(0 0 48px rgba(200,0,0,0.3))":"none" }} />
        <div style={{ opacity:phase==="hold"?1:0, transition:"opacity 0.5s ease 0.1s", textAlign:"center" }}>
          <div className="px-8 py-4" style={{ background:"rgba(8,0,0,0.92)", border:"1px solid rgba(220,0,0,0.6)", boxShadow:"0 0 30px rgba(180,0,0,0.25)" }}>
            <div className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color:"rgba(255,60,60,0.6)" }}>🚑 Emergency</div>
            <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#ff2222", textShadow:"0 0 20px rgba(255,40,40,0.9)" }}>Major Injury</div>
            <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.3)" }}>Long-term absence expected</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes miDropIn{0%{opacity:0;transform:translateY(50px) scale(0.85)}55%{opacity:1;transform:translateY(-5px) scale(1.04)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes miBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}@keyframes miPulse{0%,100%{transform:scaleY(1);opacity:0.5}50%{transform:scaleY(1.3);opacity:1}}`}</style>
    </div>
  );
}

// ============================================
// YOUSEF CARD SELECTION — Epic Developer Reveal
// trigger: clicking Yousef's card in transfer market
// ============================================

export function YousefCardAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"black"|"glitch"|"reveal"|"hold"|"exit">("black");
  const [glitchText, setGlitchText] = useState("LOADING...");

  useEffect(() => {
    const glitchTexts = ["7GE", "???", "7GE", "LEGEND", "7GE", "DEV", "7GE"];
    let gi = 0;
    const glitchInt = setInterval(() => {
      setGlitchText(glitchTexts[gi % glitchTexts.length]);
      gi++;
    }, 120);

    const t1 = setTimeout(() => { clearInterval(glitchInt); setPhase("glitch"); }, 300);
    const t2 = setTimeout(() => setPhase("reveal"),  1200);
    const t3 = setTimeout(() => setPhase("hold"),    2400);
    const t4 = setTimeout(() => setPhase("exit"),    6000);
    const t5 = setTimeout(() => onDone(),            6700);
    return () => {
      clearInterval(glitchInt);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.7s ease-in" : "none",
        background: "#000",
      }}
    >

      {/* ── BIG 7GE BACKGROUND TEXT ── */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-black"
          style={{
            fontSize: "clamp(200px, 40vw, 380px)",
            color: "transparent",
            WebkitTextStroke: phase === "hold"
              ? "1px rgba(212,175,55,0.12)"
              : "1px rgba(212,175,55,0.04)",
            letterSpacing: "0.05em",
            transition: "WebkitTextStroke 1s ease",
            animation: phase === "hold" ? "bgTextPulse 4s ease-in-out infinite" : "none",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          7GE
        </span>
      </div>

      {/* ── SCAN LINES ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          zIndex: 1,
        }}
      />

      {/* ── GLITCH PHASE ── */}
      {(phase === "glitch") && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 3 }}
        >
          <span
            className="font-black tracking-widest"
            style={{
              fontSize: "clamp(60px, 12vw, 120px)",
              color: "#D4AF37",
              textShadow: "4px 0 #ff0000, -4px 0 #0000ff, 0 0 30px rgba(212,175,55,0.9)",
              animation: "glitchMove 0.15s steps(1) infinite",
            }}
          >
            {glitchText}
          </span>
        </div>
      )}

      {/* ── GOLD BEAMS ── */}
      {(phase === "reveal" || phase === "hold") && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: "1px",
                height: "100vh",
                top: 0,
                left: `${5 + i * 8}%`,
                background: `linear-gradient(180deg,
                  transparent 0%,
                  rgba(212,175,55,${0.06 + (i % 3) * 0.04}) 30%,
                  rgba(212,175,55,${0.1 + (i % 3) * 0.05}) 50%,
                  rgba(212,175,55,${0.06 + (i % 3) * 0.04}) 70%,
                  transparent 100%)`,
                animation: `beamWave ${3 + i * 0.4}s ease-in-out ${i * 0.15}s infinite alternate`,
                transformOrigin: "center center",
              }}
            />
          ))}
        </div>
      )}

      {/* ── FLOATING 7GE PARTICLES ── */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          {["7","G","E","7","G","E","7","G","E","7"].map((char, i) => (
            <span
              key={i}
              className="absolute font-black"
              style={{
                left: `${(i * 10.5) % 90}%`,
                bottom: `${(i * 7) % 30}%`,
                fontSize: `${10 + (i % 4) * 6}px`,
                color: `rgba(212,175,55,${0.15 + (i % 3) * 0.1})`,
                animation: `charFloat ${3 + i * 0.35}s ease-in-out ${i * 0.2}s infinite alternate`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      )}

      {/* ── GOLD PARTICLES RISE ── */}
      {(phase === "reveal" || phase === "hold") && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                left: `${(i * 6.3) % 94}%`,
                bottom: "5%",
                background: "#D4AF37",
                boxShadow: "0 0 4px rgba(212,175,55,0.8)",
                animation: `particleRise ${2 + i * 0.2}s ease-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── RINGS ── */}
      {phase === "hold" && (
        <>
          {[280, 380, 480].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                border: `1px solid rgba(212,175,55,${0.25 - i * 0.06})`,
                animation: `ringRotate ${8 + i * 4}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
                zIndex: 2,
              }}
            />
          ))}
        </>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="relative flex flex-col items-center gap-5" style={{ zIndex: 10 }}>

        {/* Portrait */}
        <div
          style={{
            opacity: phase === "black" || phase === "glitch" ? 0 : 1,
            animation: phase === "reveal"
              ? "portraitReveal 1.2s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "hold"
              ? "portraitFloat 3.5s ease-in-out infinite"
              : "none",
            transition: "opacity 0.4s ease",
          }}
        >
          <img
            src="/images/yousef-pixel.png"
            alt="Yousef"
            style={{
              width: "clamp(130px, 18vw, 180px)",
              height: "auto",
              imageRendering: "pixelated",
              objectFit: "contain",
              filter: phase === "hold"
                ? "drop-shadow(0 0 20px rgba(212,175,55,1)) drop-shadow(0 0 40px rgba(212,175,55,0.6)) drop-shadow(0 0 80px rgba(212,175,55,0.3))"
                : "drop-shadow(0 0 8px rgba(212,175,55,0.4))",
              transition: "filter 0.6s ease",
            }}
          />
        </div>

        {/* Badge */}
        <div
          style={{
            opacity: phase === "hold" ? 1 : 0,
            transform: phase === "hold" ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
            transition: "all 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s",
            textAlign: "center",
          }}
        >
          <div
            className="px-10 py-6"
            style={{
              background: "linear-gradient(135deg, rgba(5,3,0,0.97), rgba(15,10,0,0.97))",
              border: "1px solid rgba(212,175,55,0.7)",
              boxShadow: "0 0 60px rgba(212,175,55,0.25), 0 0 120px rgba(212,175,55,0.08), inset 0 0 40px rgba(212,175,55,0.04)",
            }}
          >
            {/* Top line */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5))" }} />
              <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: "rgba(212,175,55,0.5)" }}>Creator</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.5), transparent)" }} />
            </div>

            {/* Name */}
            <div
              className="font-black uppercase tracking-widest mb-1"
              style={{
                fontSize: "clamp(1.3rem, 3vw, 2rem)",
                color: "#D4AF37",
                textShadow: "0 0 30px rgba(212,175,55,1), 0 0 60px rgba(212,175,55,0.5)",
              }}
            >
              Yousef Alnuwasser
            </div>

            {/* Tag */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span
                className="font-black text-sm px-3 py-1 tracking-widest"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#D4AF37",
                }}
              >
                7GE
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                Independent Developer
              </span>
            </div>

            {/* Message */}
            <div
              className="text-xs leading-relaxed px-2 py-3 text-center"
              style={{
                color: "rgba(255,255,255,0.4)",
                borderTop: "1px solid rgba(212,175,55,0.1)",
                borderBottom: "1px solid rgba(212,175,55,0.1)",
              }}
            >
              شطور اشتريت المطور نفسه
              <span className="mx-2" style={{ color: "rgba(212,175,55,0.3)" }}>·</span>
              لاتنسى تدعم المشروع 😏
            </div>

            {/* Bottom line */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3))" }} />
              <span className="text-base">⭐</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.3), transparent)" }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bgTextPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @keyframes glitchMove {
          0%   { transform: translate(0,0) skewX(0deg); }
          20%  { transform: translate(-4px,2px) skewX(-3deg); }
          40%  { transform: translate(4px,-2px) skewX(3deg); }
          60%  { transform: translate(-2px,4px) skewX(-1deg); }
          80%  { transform: translate(2px,-4px) skewX(2deg); }
          100% { transform: translate(0,0) skewX(0deg); }
        }
        @keyframes beamWave {
          0%   { transform: scaleY(0.8) translateY(-10%); opacity: 0.4; }
          100% { transform: scaleY(1.2) translateY(10%);  opacity: 1; }
        }
        @keyframes charFloat {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.15; }
          100% { transform: translateY(-40px) rotate(10deg); opacity: 0.35; }
        }
        @keyframes particleRise {
          0%   { transform: translateY(0) scale(1);    opacity: 0.8; }
          100% { transform: translateY(-90vh) scale(0.3); opacity: 0; }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes portraitReveal {
          0%   { opacity: 0; transform: scale(0.2) translateY(30px); filter: brightness(5) blur(8px); }
          50%  { opacity: 1; transform: scale(1.1) translateY(-6px); filter: brightness(1.5) blur(0); }
          75%  { transform: scale(0.97) translateY(2px); filter: brightness(1); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
        }
        @keyframes portraitFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          40%       { transform: translateY(-14px) scale(1.03); }
          70%       { transform: translateY(-5px) scale(1.01); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// أضف أنيميشنات جديدة هنا
// ============================================

// ============================================
// ERIKSEN HEART ATTACK
// ============================================
// ============================================
// ERIKSEN HEART ATTACK
// Concept: ECG flatline — screen goes white then red crash
// ============================================
export function EriksenAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"black"|"flash"|"crash"|"hold"|"exit">("black");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"),  200);
    const t2 = setTimeout(() => setPhase("crash"),  700);
    const t3 = setTimeout(() => setPhase("hold"),   1400);
    const t4 = setTimeout(() => setPhase("exit"),   4500);
    const t5 = setTimeout(() => onDone(),           5200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5); };
  }, [onDone]);

  // ECG values — normal then flatline
  const ecgNormal = [0,5,2,8,30,-20,10,2,0,3,1,0,4,2,0,6,25,-18,8,0];
  const ecgFlat   = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const ecg = phase === "hold" ? ecgFlat : ecgNormal;
  const maxV = 35;
  const pts = ecg.map((v,i) => `${(i/(ecg.length-1))*260},${40 - (v/maxV)*35}`).join(" ");

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden"
      style={{
        background: phase==="flash" ? "#ffffff"
          : phase==="crash" ? "#cc0000"
          : phase==="hold" || phase==="exit" ? "#000" : "#000",
        transition: phase==="flash" ? "background 0.2s" : phase==="crash" ? "background 0.5s" : "background 0.8s ease",
        opacity: phase==="exit" ? 0 : 1,
      }}>

      {/* Screen shake on crash */}
      <div className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ animation: phase==="crash" ? "ekgScreenShake 0.5s ease-out" : "none" }}>

        {/* Dark overlay after crash */}
        {(phase==="hold" || phase==="exit") && (
          <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at center, rgba(60,0,0,0.7) 0%, rgba(0,0,0,0.98) 70%)" }} />
        )}

        {/* ECG monitor frame */}
        {(phase==="crash" || phase==="hold") && (
          <div className="absolute top-8 left-0 right-0 flex justify-center" style={{ zIndex:3 }}>
            <div style={{ background:"rgba(0,0,0,0.9)", border:`1px solid ${phase==="hold"?"rgba(255,0,0,0.5)":"rgba(0,255,80,0.5)"}`, padding:"8px 16px", minWidth:"300px" }}>
              <div className="text-[9px] tracking-widest uppercase mb-1" style={{ color: phase==="hold" ? "#ff4444" : "#00ff50" }}>
                {phase==="hold" ? "⚠️ CARDIAC ARREST — FLATLINE" : "ECG MONITOR"}
              </div>
              <svg width="260" height="50" style={{ display:"block" }}>
                <polyline points={pts} fill="none"
                  stroke={phase==="hold" ? "#ff2222" : "#00ff50"}
                  strokeWidth="2"
                  style={{ filter: `drop-shadow(0 0 4px ${phase==="hold" ? "#ff2222" : "#00ff50"})` }}
                />
                {phase==="hold" && (
                  <circle cx="260" cy="40" r="3" fill="#ff2222"
                    style={{ animation:"ekgDot 0.8s ease-in-out infinite" }} />
                )}
              </svg>
            </div>
          </div>
        )}

        {/* Portrait */}
        <div className="relative z-10 flex flex-col items-center gap-5 mt-16">
          <img src="/images/eriksen-pixel.png" alt="Heart Attack"
            style={{
              width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
              animation: phase==="crash" ? "ekgFall 0.7s cubic-bezier(0.22,1,0.36,1) forwards"
                : phase==="hold" ? "ekgLieDown 3s ease-in-out infinite" : "none",
              filter: phase==="hold" ? "grayscale(0.6) drop-shadow(0 0 20px rgba(255,0,0,0.6))"
                : phase==="crash" ? "brightness(2)" : "none",
              transition:"filter 0.5s ease",
              transform: phase==="hold" ? "rotate(90deg) translateX(20px)" : "none",
            }}
          />
          {phase==="hold" && (
            <div style={{ textAlign:"center", opacity:1 }}>
              <div className="px-10 py-5" style={{ background:"rgba(5,0,0,0.97)", border:"1px solid rgba(255,0,0,0.8)", boxShadow:"0 0 50px rgba(255,0,0,0.4), inset 0 0 30px rgba(255,0,0,0.05)" }}>
                <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color:"rgba(255,100,100,0.6)" }}>CARDIAC ARREST</div>
                <div className="font-black text-3xl tracking-widest uppercase" style={{ color:"#ff1111", textShadow:"0 0 30px rgba(255,0,0,1), 0 0 60px rgba(255,0,0,0.5)" }}>Heart Attack</div>
                <div className="text-xs tracking-[0.2em] uppercase mt-2" style={{ color:"rgba(255,255,255,0.25)" }}>Player collapsed on the pitch</div>
                <div className="text-xs mt-1" style={{ color:"rgba(255,100,100,0.5)" }}>Value −65% · Out full season</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ekgScreenShake{0%,100%{transform:translate(0)}15%{transform:translate(-12px,8px)}30%{transform:translate(12px,-8px)}45%{transform:translate(-8px,4px)}60%{transform:translate(8px,-4px)}75%{transform:translate(-4px,2px)}}
        @keyframes ekgFall{0%{opacity:0;transform:scale(0.5) translateY(-60px) rotate(0deg)}60%{opacity:1;transform:scale(1.05) translateY(6px) rotate(45deg)}100%{opacity:1;transform:rotate(90deg) translateX(20px)}}
        @keyframes ekgLieDown{0%,100%{transform:rotate(90deg) translateX(20px) scale(1)}50%{transform:rotate(90deg) translateX(20px) scale(1.02)}}
        @keyframes ekgDot{0%,100%{opacity:1}50%{opacity:0}}
      `}</style>
    </div>
  );
}

// ============================================
// DOPING BAN
// Concept: newspaper headlines flash + mugshot style
// ============================================
export function DopingBanAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"flash"|"hold"|"exit">("enter");
  const [headline, setHeadline] = useState(0);
  const headlines = ["BANNED!", "DOPING!", "SCANDAL!", "SUSPENDED!", "BUSTED!"];
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"), 300);
    const t2 = setTimeout(() => setPhase("hold"),  1200);
    const t3 = setTimeout(() => setPhase("exit"),  4200);
    const t4 = setTimeout(() => onDone(),          5000);
    const hi = setInterval(() => setHeadline(h => (h+1)%headlines.length), 200);
    setTimeout(() => clearInterval(hi), 1200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearInterval(hi); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ opacity: phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s":"none",
        background: phase==="flash" ? "#f5f0e0" : phase==="hold" ? "#0a0a0a" : "#000" }}>

      {/* Newspaper flash */}
      {phase==="flash" && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex:5 }}>
          <div style={{ fontFamily:"serif", fontSize:"clamp(60px,12vw,100px)", fontWeight:900, color:"#1a1a1a",
            textAlign:"center", lineHeight:1, animation:"dopFlash 0.15s steps(1) infinite",
            textShadow:"4px 4px 0 rgba(0,0,0,0.2)" }}>
            {headlines[headline]}
          </div>
        </div>
      )}

      {phase==="hold" && (
        <>
          {/* Mugshot grid lines */}
          <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(0,80,150,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,80,150,0.04) 1px,transparent 1px)", backgroundSize:"30px 30px" }} />

          {/* Red BANNED stamp */}
          <div className="absolute" style={{ top:"12%", right:"8%", zIndex:5,
            border:"4px solid rgba(255,0,0,0.85)", padding:"6px 16px",
            transform:"rotate(-15deg)",
            color:"rgba(255,0,0,0.85)", fontWeight:900, fontSize:"clamp(20px,4vw,36px)",
            letterSpacing:"0.15em", animation:"dopStamp 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
            textShadow:"0 0 10px rgba(255,0,0,0.5)" }}>
            BANNED
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Mugshot frame */}
            <div style={{ position:"relative", border:"3px solid #444", padding:"8px", background:"#111" }}>
              <img src="/images/doping-ban-pixel.png" alt="Doping Ban"
                style={{ width:"clamp(150px,24vw,200px)", imageRendering:"pixelated", objectFit:"contain",
                  filter:"grayscale(0.8) contrast(1.2)" }} />
              {/* Mugshot number bar */}
              <div style={{ background:"#222", borderTop:"1px solid #444", padding:"4px 8px",
                display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
                {["0","0","7","4","2"].map((n,i) => (
                  <span key={i} style={{ color:"#888", fontSize:"14px", fontFamily:"monospace", fontWeight:700 }}>{n}</span>
                ))}
              </div>
            </div>

            <div style={{ textAlign:"center" }}>
              <div className="px-8 py-4" style={{ background:"rgba(0,5,15,0.98)", border:"1px solid rgba(0,100,255,0.5)", boxShadow:"0 0 40px rgba(0,80,200,0.2)" }}>
                <div className="text-[9px] tracking-[0.5em] uppercase mb-1" style={{ color:"rgba(80,120,255,0.6)" }}>WADA SUSPENSION</div>
                <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#4466ff", textShadow:"0 0 20px rgba(60,100,255,0.9)" }}>Doping Ban</div>
                <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.25)" }}>Cannot sell or renew during suspension</div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes dopFlash{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)}}
        @keyframes dopStamp{0%{transform:rotate(-15deg) scale(3);opacity:0}60%{transform:rotate(-15deg) scale(0.9);opacity:1}100%{transform:rotate(-15deg) scale(1);opacity:1}}
      `}</style>
    </div>
  );
}

// ============================================
// GIRLS MAGNET
// Concept: paparazzi camera flashes + spotlight
// ============================================
export function GirlsMagnetAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  800);
    const t2 = setTimeout(() => setPhase("exit"),  4000);
    const t3 = setTimeout(() => onDone(),          4700);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.3s",
        background:"#000" }}>

      {/* Camera flashes */}
      {phase==="hold" && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_,i) => (
            <div key={i} className="absolute inset-0" style={{
              background:"rgba(255,255,255,0.9)",
              animation:`gmFlash 2s steps(1) ${i*0.25}s infinite`,
              opacity:0,
            }} />
          ))}
        </div>
      )}

      {/* Spotlight beam from top */}
      {phase==="hold" && (
        <div className="absolute" style={{
          top:0, left:"50%", transform:"translateX(-50%)",
          width:"200px", height:"100vh",
          background:"linear-gradient(180deg, rgba(255,200,255,0.15) 0%, transparent 70%)",
          animation:"gmSpot 2s ease-in-out infinite alternate",
          clipPath:"polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
        }} />
      )}

      {/* Floating hearts */}
      {phase==="hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["💋","❤️","💕","💖","💗","💓"].map((em,i) => (
            <span key={i} style={{
              position:"absolute",
              left:`${15+(i*14)}%`, bottom:"-20px",
              fontSize:`${20+(i%3)*12}px`,
              animation:`gmHeart ${1.5+i*0.3}s ease-out ${i*0.15}s infinite`,
            }}>{em}</span>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-5"
        style={{ animation: phase==="enter" ? "gmReveal 0.8s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}>

        <img src="/images/girls-magnet-pixel.png" alt="Girls Magnet"
          style={{
            width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="hold" ? "gmPose 3s ease-in-out infinite" : "none",
            filter: phase==="hold" ? "drop-shadow(0 0 30px rgba(255,150,200,0.9)) drop-shadow(0 0 60px rgba(255,80,180,0.4)) saturate(1.3)" : "none",
          }}
        />

        {phase==="hold" && (
          <div style={{ textAlign:"center" }}>
            <div className="px-10 py-5" style={{
              background:"linear-gradient(135deg,rgba(10,0,8,0.97),rgba(30,0,20,0.97))",
              border:"1px solid rgba(255,100,180,0.8)",
              boxShadow:"0 0 50px rgba(255,80,160,0.35), inset 0 0 30px rgba(255,80,160,0.05)" }}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color:"rgba(255,150,200,0.6)" }}>CELEBRITY STATUS</div>
              <div className="font-black text-3xl tracking-widest uppercase" style={{ color:"#ff3080", textShadow:"0 0 30px rgba(255,60,140,1), 0 0 60px rgba(255,60,140,0.4)" }}>Girls Magnet</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-2" style={{ color:"rgba(255,255,255,0.25)" }}>Marketing value +25% · Salary demands +30%</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes gmFlash{0%,90%,100%{opacity:0}92%{opacity:0.6}95%{opacity:0}}
        @keyframes gmSpot{0%{transform:translateX(-50%) rotate(-5deg)}100%{transform:translateX(-50%) rotate(5deg)}}
        @keyframes gmHeart{0%{transform:translateY(0) scale(0.5);opacity:1}100%{transform:translateY(-100vh) scale(1.5);opacity:0}}
        @keyframes gmReveal{0%{opacity:0;transform:scale(0.5)}60%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
        @keyframes gmPose{0%,100%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.04) rotate(-2deg)}75%{transform:scale(1.04) rotate(2deg)}}
      `}</style>
    </div>
  );
}

// ============================================
// RACIST ATTACK
// Concept: screen cracks + color drains + fist rises
// ============================================
export function RacistAttackAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"crack"|"hold"|"fist"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("crack"),  400);
    const t2 = setTimeout(() => setPhase("hold"),   1000);
    const t3 = setTimeout(() => setPhase("fist"),   3000);
    const t4 = setTimeout(() => setPhase("exit"),   4500);
    const t5 = setTimeout(() => onDone(),           5200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden flex items-center justify-center"
      style={{
        opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"none",
        background: phase==="crack" ? "#1a0800"
          : phase==="hold" || phase==="fist" ? "#050200" : "#000",
      }}>

      {/* Crack overlay */}
      {(phase==="crack" || phase==="hold") && (
        <div className="absolute inset-0" style={{ zIndex:2,
          backgroundImage:"radial-gradient(ellipse at 40% 40%, transparent 40%, rgba(0,0,0,0.8) 80%)",
          animation:"raCrack 0.6s ease-out forwards" }} />
      )}

      {/* Noise texture */}
      {phase==="hold" && (
        <div className="absolute inset-0" style={{ zIndex:1,
          backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 4px)",
          animation:"raNoise 0.1s steps(1) infinite" }} />
      )}

      {/* Crying tears */}
      {(phase==="hold" || phase==="fist") && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex:3 }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} className="absolute rounded-full" style={{
              width:`${4+(i%3)*3}px`, height:`${4+(i%3)*3}px`,
              left:`${20+(i*12)}%`, top:"30%",
              background:"rgba(100,160,255,0.7)",
              animation:`raTear ${1+i*0.2}s ease-in ${i*0.1}s infinite`,
            }} />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-5"
        style={{ animation:phase==="crack"?"raShake 0.5s ease-out":"none" }}>

        <img src="/images/racism-attack-pixel.png" alt="Racist Attack"
          style={{
            width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
            filter: phase==="hold" ? "grayscale(0.7) brightness(0.8) drop-shadow(0 0 15px rgba(100,60,30,0.5))"
              : phase==="fist" ? "grayscale(0) brightness(1.2) drop-shadow(0 0 20px rgba(255,160,60,0.6))" : "none",
            animation: phase==="crack" ? "raSlump 0.6s ease-out forwards"
              : phase==="fist" ? "raRise 0.8s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
            transition:"filter 0.8s ease",
          }}
        />

        {(phase==="hold" || phase==="fist") && (
          <div style={{ textAlign:"center", opacity:1 }}>
            <div className="px-8 py-5" style={{
              background:"rgba(5,2,0,0.97)",
              border:`1px solid ${phase==="fist" ? "rgba(255,160,60,0.7)" : "rgba(100,60,30,0.5)"}`,
              boxShadow:`0 0 40px ${phase==="fist" ? "rgba(255,140,40,0.25)" : "rgba(80,40,10,0.2)"}`,
              transition:"all 0.8s ease" }}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: phase==="fist" ? "rgba(255,180,60,0.7)" : "rgba(180,100,50,0.5)" }}>
                {phase==="fist" ? "NO SURRENDER" : "RACIAL ABUSE"}
              </div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{
                color: phase==="fist" ? "#ff9020" : "#8a4020",
                textShadow: phase==="fist" ? "0 0 24px rgba(255,140,40,0.9)" : "0 0 15px rgba(150,70,30,0.5)" }}>
                {phase==="fist" ? "Stand Strong" : "Racist Attack"}
              </div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.2)" }}>
                {phase==="fist" ? "Bounce back coming — stronger than ever" : "Value −20% · Performance affected 2 seasons"}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes raCrack{0%{opacity:0}100%{opacity:1}}
        @keyframes raShake{0%,100%{transform:translate(0)}20%{transform:translate(-10px,5px)}40%{transform:translate(10px,-5px)}60%{transform:translate(-6px,3px)}80%{transform:translate(6px,-3px)}}
        @keyframes raSlump{0%{transform:translateY(-20px)}100%{transform:translateY(5px) rotate(-2deg)}}
        @keyframes raRise{0%{transform:rotate(-2deg) translateY(5px)}60%{transform:rotate(2deg) translateY(-8px) scale(1.05)}100%{transform:rotate(0) translateY(0) scale(1)}}
        @keyframes raTear{0%{transform:translateY(0);opacity:0.8}100%{transform:translateY(60vh);opacity:0}}
        @keyframes raNoise{0%{opacity:0.3}50%{opacity:0.6}100%{opacity:0.3}}
      `}</style>
    </div>
  );
}

// ============================================
// CLUB LEGEND
// Concept: stadium statue reveal, crowd roar effect
// ============================================
export function ClubLegendAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"dark"|"spotlight"|"unveil"|"hold"|"exit">("dark");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("spotlight"), 300);
    const t2 = setTimeout(() => setPhase("unveil"),    1000);
    const t3 = setTimeout(() => setPhase("hold"),      2000);
    const t4 = setTimeout(() => setPhase("exit"),      5500);
    const t5 = setTimeout(() => onDone(),              6200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 1s ease-in":"none",
        background:"#000" }}>

      {/* Stadium crowd silhouette */}
      {(phase==="hold" || phase==="unveil") && (
        <div className="absolute bottom-0 left-0 right-0" style={{ height:"25%", zIndex:1,
          background:"linear-gradient(180deg, transparent 0%, rgba(10,8,0,0.9) 100%)",
          backgroundImage:"repeating-linear-gradient(90deg, rgba(255,200,0,0.03) 0, rgba(255,200,0,0.03) 2px, transparent 2px, transparent 8px)" }} />
      )}

      {/* Confetti */}
      {phase==="hold" && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex:2 }}>
          {[...Array(20)].map((_,i) => (
            <div key={i} className="absolute" style={{
              width:`${4+(i%3)*3}px`, height:`${8+(i%4)*4}px`,
              left:`${(i*5.3)%96}%`, top:"-20px",
              background:`hsl(${(i*37)%360},80%,60%)`,
              animation:`clConfetti ${2+i*0.15}s linear ${i*0.08}s infinite`,
              borderRadius:"1px",
            }} />
          ))}
        </div>
      )}

      {/* Spotlight */}
      {(phase==="spotlight" || phase==="unveil" || phase==="hold") && (
        <div className="absolute" style={{
          top:0, left:"50%", transform:"translateX(-50%)",
          width:"300px", height:"100vh", zIndex:1,
          background:"linear-gradient(180deg, rgba(255,220,100,0.25) 0%, rgba(255,200,50,0.05) 50%, transparent 80%)",
          clipPath:"polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)",
          animation:"clSpot 3s ease-in-out infinite alternate",
        }} />
      )}

      {/* Three concentric gold rings expanding */}
      {phase==="hold" && (
        <>
          {[200,320,440].map((size,i) => (
            <div key={i} className="absolute rounded-full" style={{
              width:`${size}px`, height:`${size}px`,
              border:`${2-i*0.5}px solid rgba(212,175,55,${0.6-i*0.15})`,
              animation:`clExpand 2.5s ease-out ${i*0.3}s infinite`,
              zIndex:2,
            }} />
          ))}
        </>
      )}

      {/* Portrait */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div style={{
          position:"relative",
          animation: phase==="spotlight" ? "clSpotReveal 0.7s ease-out forwards"
            : phase==="unveil" ? "clUnveil 1s cubic-bezier(0.22,1,0.36,1) forwards"
            : phase==="hold" ? "clLegendFloat 4s ease-in-out infinite" : "none",
        }}>
          {/* Gold pedestal */}
          {(phase==="unveil" || phase==="hold") && (
            <div style={{ position:"absolute", bottom:"-16px", left:"50%", transform:"translateX(-50%)",
              width:"80%", height:"16px",
              background:"linear-gradient(90deg,#8B6914,#D4AF37,#8B6914)",
              boxShadow:"0 4px 20px rgba(212,175,55,0.5)" }} />
          )}
          <img src="/images/club-legend-pixel.png" alt="Club Legend"
            style={{
              width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
              filter: phase==="hold"
                ? "drop-shadow(0 0 30px rgba(212,175,55,1)) drop-shadow(0 0 60px rgba(212,175,55,0.6)) drop-shadow(0 0 100px rgba(255,220,80,0.3))"
                : "none",
              transition:"filter 0.8s ease",
            }}
          />
        </div>

        {phase==="hold" && (
          <div style={{ textAlign:"center" }}>
            <div className="px-10 py-6" style={{
              background:"linear-gradient(135deg,rgba(0,0,0,0.97),rgba(15,10,0,0.97))",
              border:"1px solid rgba(212,175,55,0.9)",
              boxShadow:"0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.15), inset 0 0 40px rgba(212,175,55,0.05)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.6))" }} />
                <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color:"rgba(212,175,55,0.5)" }}>Eternal</span>
                <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,rgba(212,175,55,0.6),transparent)" }} />
              </div>
              <div className="font-black tracking-widest uppercase" style={{
                fontSize:"clamp(1.5rem,4vw,2.5rem)",
                color:"#D4AF37",
                textShadow:"0 0 30px rgba(212,175,55,1), 0 0 60px rgba(212,175,55,0.6), 0 0 100px rgba(255,220,80,0.3)" }}>
                Club Legend
              </div>
              <div className="text-xs tracking-[0.25em] uppercase mt-2" style={{ color:"rgba(255,255,255,0.25)" }}>
                Forever loyal · Accepts any contract
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes clSpotReveal{0%{opacity:0;transform:scale(0.3)}100%{opacity:1;transform:scale(1)}}
        @keyframes clUnveil{0%{opacity:0;transform:scale(0.5) translateY(40px)}60%{opacity:1;transform:scale(1.1) translateY(-8px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes clLegendFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-16px) scale(1.03)}}
        @keyframes clExpand{0%{transform:scale(0.3);opacity:0.8}100%{transform:scale(2);opacity:0}}
        @keyframes clSpot{0%{transform:translateX(-50%) rotate(-4deg)}100%{transform:translateX(-50%) rotate(4deg)}}
        @keyframes clConfetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
      `}</style>
    </div>
  );
}

// ============================================
// أضف أنيميشنات جديدة هنا
// ============================================