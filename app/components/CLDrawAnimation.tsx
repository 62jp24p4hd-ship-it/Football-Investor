"use client";

import React, { useEffect, useState } from "react";
import type { CLTie } from "../game/clTypes";

type Props = {
  r16Ties: CLTie[];
  onDone: () => void;
};

export default function CLDrawAnimation({ r16Ties, onDone }: Props) {
  const [revealedTies, setRevealedTies] = useState<number>(0);
  const [phase, setPhase] = useState<"drawing" | "done">("drawing");

  useEffect(() => {
    if (revealedTies < r16Ties.length) {
      const t = setTimeout(() => {
        setRevealedTies(prev => prev + 1);
      }, 600);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("done"), 800);
      return () => clearTimeout(t);
    }
  }, [revealedTies, r16Ties.length]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto py-8"
      style={{
        background: "linear-gradient(160deg, #000820 0%, #001040 60%, #000820 100%)",
      }}
      onClick={onDone}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              background: "#fbbf24",
              opacity: 0.2 + Math.random() * 0.4,
              animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <h1 style={{
            color: "#fbbf24",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textShadow: "0 0 30px rgba(251,191,36,0.6)",
            marginBottom: 4,
          }}>
            قرعة دور الـ16
          </h1>
          <p style={{ color: "#64748b", fontSize: 13 }}>Round of 16 Draw — انقر للتخطي</p>
        </div>

        {/* Ties */}
        <div className="flex flex-col gap-3">
          {r16Ties.map((tie, idx) => (
            <div
              key={tie.id}
              style={{
                opacity: idx < revealedTies ? 1 : 0,
                transform: idx < revealedTies ? "translateX(0)" : "translateX(-30px)",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                background: "rgba(255,255,255,0.04)",
                border: tie.userInvolved
                  ? "1px solid rgba(251,191,36,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: tie.userInvolved ? "0 0 20px rgba(251,191,36,0.15)" : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{
                  color: tie.userInvolved ? "#fbbf24" : "#e2e8f0",
                  fontWeight: tie.userInvolved ? 800 : 600,
                  fontSize: 15,
                }}>
                  {tie.teamA}
                </span>
                <span style={{ color: "#475569", fontSize: 11, display: "block" }}>
                  {tie.teamALeagueId.replace(/_/g, " ")} • Leg 1 at home
                </span>
              </div>
              <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: 18, margin: "0 16px" }}>vs</span>
              <div style={{ flex: 1, textAlign: "right" }}>
                <span style={{
                  color: tie.userInvolved ? "#fbbf24" : "#e2e8f0",
                  fontWeight: tie.userInvolved ? 800 : 600,
                  fontSize: 15,
                }}>
                  {tie.teamB}
                </span>
                <span style={{ color: "#475569", fontSize: 11, display: "block" }}>
                  {tie.teamBLeagueId.replace(/_/g, " ")} • Leg 2 at home
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Done button */}
        {phase === "done" && (
          <div className="text-center mt-8">
            <button
              onClick={onDone}
              style={{
                background: "linear-gradient(135deg, #1e3a8a, #fbbf24)",
                border: "none",
                borderRadius: 12,
                padding: "12px 40px",
                color: "#000",
                fontWeight: 900,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(251,191,36,0.4)",
              }}
            >
              متابعة — Continue
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes starTwinkle {
          from { opacity: 0.1; }
          to { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
