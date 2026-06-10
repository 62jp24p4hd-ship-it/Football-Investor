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
// أضف أنيميشنات جديدة هنا
// ============================================
