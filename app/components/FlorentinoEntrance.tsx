"use client";

import { useEffect, useState } from "react";

type Props = {
  onDone: () => void;
};

export default function FlorentinoEntrance({ onDone }: Props) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    // enter → hold after 1.2s
    const t1 = setTimeout(() => setPhase("hold"), 1200);
    // hold → exit after 1s more
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    // unmount after exit anim (0.8s)
    const t3 = setTimeout(() => onDone(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const imgStyle: React.CSSProperties = {
    width: "clamp(180px, 30vw, 280px)",
    height: "auto",
    imageRendering: "pixelated",
    objectFit: "contain",
    transition: phase === "enter"
      ? "transform 1.2s cubic-bezier(0.22,1,0.36,1), opacity 1.2s ease"
      : phase === "exit"
      ? "transform 0.8s ease-in, opacity 0.8s ease-in"
      : "none",
    transform:
      phase === "enter" ? "scale(1) translateY(0)" :
      phase === "hold"  ? "scale(1) translateY(0)" :
      "scale(0.7) translateY(-40px)",
    opacity: phase === "hold" ? 1 : phase === "exit" ? 0 : 1,
    filter: phase === "hold"
      ? "drop-shadow(0 0 32px rgba(212,175,55,0.9)) drop-shadow(0 0 64px rgba(212,175,55,0.4))"
      : "drop-shadow(0 0 16px rgba(212,175,55,0.5))",
  };

  const overlayStyle: React.CSSProperties = {
    opacity: phase === "hold" ? 1 : phase === "exit" ? 0 : 1,
    transition: phase === "exit" ? "opacity 0.8s ease-in" : "opacity 1.2s ease",
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center pointer-events-none"
      style={overlayStyle}
    >
      {/* Dark backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.72)" }}
      />

      {/* Glow rings */}
      <div className="absolute" style={{
        width: "clamp(220px, 35vw, 340px)",
        height: "clamp(220px, 35vw, 340px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
        animation: phase === "hold" ? "florPulse 1.5s ease-in-out infinite" : "none",
      }} />

      {/* Portrait */}
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
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}