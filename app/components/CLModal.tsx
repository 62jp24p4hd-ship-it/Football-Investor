"use client";

import React, { useState } from "react";
import type { CLState, CLTie } from "../game/clTypes";
import { getCLTopScorers, getCLTopAssists, getCLTopCleanSheets } from "../game/clEngine";
import { LEAGUE_FLAG } from "../game/clTeams";

type Tab = "standings" | "playoff" | "bracket" | "scorers" | "assists" | "cleansheets";

type Props = {
  clState: CLState;
  onClose: () => void;
};

const CL_GOLD = "#fbbf24";
const CL_BG = "#000820";
const CL_BORDER = "rgba(251,191,36,0.2)";
const CL_SURFACE = "rgba(255,255,255,0.04)";

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        border: active ? `1px solid ${CL_GOLD}` : "1px solid rgba(255,255,255,0.08)",
        background: active ? `${CL_GOLD}18` : "transparent",
        color: active ? CL_GOLD : "#64748b",
        fontWeight: active ? 700 : 500,
        fontSize: 12,
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function LeagueFlag({ leagueId }: { leagueId: string }) {
  return <span style={{ fontSize: 14 }}>{LEAGUE_FLAG[leagueId] ?? "🌍"}</span>;
}

// ── Standings Tab ────────────────────────────

function StandingsTab({ clState }: { clState: CLState }) {
  const sorted = [...clState.standings];

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#475569", fontSize: 11 }}>
              <th style={{ textAlign: "left", padding: "6px 8px", width: 32 }}>#</th>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>Club</th>
              <th style={{ padding: "6px 8px", width: 32 }}>P</th>
              <th style={{ padding: "6px 8px", width: 32 }}>W</th>
              <th style={{ padding: "6px 8px", width: 32 }}>D</th>
              <th style={{ padding: "6px 8px", width: 32 }}>L</th>
              <th style={{ padding: "6px 8px", width: 50 }}>GF:GA</th>
              <th style={{ padding: "6px 8px", width: 36, fontWeight: 700, color: "#e2e8f0" }}>Pts</th>
              <th style={{ padding: "6px 8px", width: 28 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => {
              const pos = idx + 1;
              const isDirect = pos <= 8;
              const isPlayoff = pos >= 9 && pos <= 24;
              const isUser = row.isUser;

              return (
                <tr
                  key={row.teamName}
                  style={{
                    background: isUser
                      ? "rgba(251,191,36,0.08)"
                      : idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                    borderLeft: isDirect
                      ? `3px solid ${CL_GOLD}`
                      : isPlayoff
                      ? "3px solid #94a3b8"
                      : "3px solid transparent",
                  }}
                >
                  <td style={{ padding: "6px 8px", color: "#64748b", fontWeight: 600 }}>{pos}</td>
                  <td style={{ padding: "6px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <LeagueFlag leagueId={row.leagueId} />
                      <span style={{
                        color: isUser ? CL_GOLD : "#e2e8f0",
                        fontWeight: isUser ? 800 : 500,
                      }}>
                        {row.teamName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", color: "#94a3b8" }}>{row.played}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", color: "#94a3b8" }}>{row.won}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", color: "#94a3b8" }}>{row.drawn}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", color: "#94a3b8" }}>{row.lost}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center", color: "#94a3b8" }}>
                    {row.goalsFor}:{row.goalsAgainst}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", color: "#e2e8f0", fontWeight: 700 }}>
                    {row.points}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontSize: 11 }}>
                    {isDirect ? (
                      <span style={{ color: CL_GOLD, fontWeight: 800 }}>✓</span>
                    ) : isPlayoff ? (
                      <span style={{ color: "#94a3b8", fontWeight: 700 }}>P</span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: "#64748b" }}>
        <span><span style={{ color: CL_GOLD, fontWeight: 800 }}>✓</span> Direct R16 (Top 8)</span>
        <span><span style={{ color: "#94a3b8", fontWeight: 700 }}>P</span> Playoff (9th-24th)</span>
      </div>
    </div>
  );
}

// ── Playoff Tab ────────────────────────────

function PlayoffTab({ clState }: { clState: CLState }) {
  const userTeam = clState.standings.find(s => s.isUser)?.teamName;

  if (clState.playoffTies.length === 0) {
    return (
      <div style={{ color: "#64748b", textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🏟️</div>
        <div>الملحق المؤهل يبدأ بعد انتهاء دور المجموعات</div>
        <div style={{ fontSize: 12, marginTop: 6, color: "#334155" }}>Playoff round starts after group phase</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>🏟️</div>
        <div style={{ color: CL_GOLD, fontSize: 15, fontWeight: 900, letterSpacing: "0.06em" }}>
          ملحق التأهل
        </div>
        <div style={{ color: "#475569", fontSize: 11, letterSpacing: "0.1em", marginTop: 2 }}>
          PLAYOFF ROUND — إياب وذهاب
        </div>
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(251,191,36,0.4), transparent)", marginTop: 12 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {clState.playoffTies.map((tie, i) => {
          const isUser = tie.userInvolved;
          const flagA = LEAGUE_FLAG[tie.teamALeagueId] ?? "🌍";
          const flagB = LEAGUE_FLAG[tie.teamBLeagueId] ?? "🌍";
          const leg1A = tie.leg1?.goalsA ?? null;
          const leg1B = tie.leg1?.goalsB ?? null;
          const leg2A = tie.leg2?.goalsA ?? null;
          const leg2B = tie.leg2?.goalsB ?? null;
          const aTotal = (leg1A ?? 0) + (leg2A ?? 0);
          const bTotal = (leg1B ?? 0) + (leg2B ?? 0);
          const played = leg1A !== null;
          const finished = !!tie.winner;

          const isAWinner = finished && tie.winner === tie.teamA;
          const isBWinner = finished && tie.winner === tie.teamB;
          const isUserA = tie.teamA === userTeam;
          const isUserB = tie.teamB === userTeam;

          return (
            <div
              key={tie.id}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: isUser
                  ? "1.5px solid rgba(251,191,36,0.5)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: isUser
                  ? "0 0 20px rgba(251,191,36,0.15), 0 4px 16px rgba(0,0,0,0.4)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                position: "relative",
              }}
            >
              {/* Card background */}
              <div style={{
                position: "absolute", inset: 0,
                background: isUser
                  ? "linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(15,23,60,0.95) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,8,32,0.95) 100%)",
              }} />

              {/* Match number */}
              <div style={{
                position: "absolute", top: 10, left: 10,
                fontSize: 9, fontWeight: 800,
                color: isUser ? CL_GOLD : "#334155",
                letterSpacing: "0.05em",
              }}>
                #{i + 1}
              </div>

              {/* Main VS layout */}
              <div style={{
                position: "relative", zIndex: 1,
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                padding: "16px 12px 12px",
                gap: 8,
              }}>
                {/* Team A — Left */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{flagA}</div>
                  <div style={{
                    color: isAWinner ? CL_GOLD : isUser && isUserA ? "#fde68a" : "#e2e8f0",
                    fontWeight: isUser && isUserA ? 900 : 600,
                    fontSize: 12,
                    lineHeight: 1.3,
                    textShadow: isUser && isUserA ? "0 0 12px rgba(251,191,36,0.4)" : "none",
                  }}>
                    {tie.teamA}
                  </div>
                  {isAWinner && (
                    <div style={{ fontSize: 9, color: CL_GOLD, marginTop: 4, fontWeight: 800, letterSpacing: "0.05em" }}>
                      ✓ متأهل
                    </div>
                  )}
                </div>

                {/* Center — Score / VS */}
                <div style={{ textAlign: "center", minWidth: 70 }}>
                  {played ? (
                    <div>
                      {/* Aggregate score */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <span style={{
                          fontSize: 20, fontWeight: 900,
                          color: isAWinner ? CL_GOLD : "#e2e8f0",
                        }}>{aTotal}</span>
                        <span style={{ color: "#334155", fontSize: 14, fontWeight: 700 }}>—</span>
                        <span style={{
                          fontSize: 20, fontWeight: 900,
                          color: isBWinner ? CL_GOLD : "#e2e8f0",
                        }}>{bTotal}</span>
                      </div>
                      <div style={{ color: "#334155", fontSize: 9, marginTop: 2, letterSpacing: "0.05em" }}>
                        مجموع
                      </div>
                      {/* Leg scores */}
                      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                        {leg1A !== null && (
                          <div style={{ fontSize: 9, color: "#475569" }}>
                            ذهاب: {leg1A}–{leg1B}
                          </div>
                        )}
                        {leg2A !== null && (
                          <div style={{ fontSize: 9, color: "#475569" }}>
                            إياب: {leg2A}–{leg2B}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: isUser
                          ? "linear-gradient(135deg, #92400e, #fbbf24)"
                          : "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto",
                        fontSize: 10, fontWeight: 900, color: "#fff",
                        boxShadow: isUser ? "0 0 12px rgba(251,191,36,0.4)" : "0 0 8px rgba(59,130,246,0.3)",
                      }}>VS</div>
                      <div style={{ color: "#334155", fontSize: 9, marginTop: 4 }}>لم تُلعب</div>
                    </div>
                  )}
                </div>

                {/* Team B — Right */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{flagB}</div>
                  <div style={{
                    color: isBWinner ? CL_GOLD : isUser && isUserB ? "#fde68a" : "#e2e8f0",
                    fontWeight: isUser && isUserB ? 900 : 600,
                    fontSize: 12,
                    lineHeight: 1.3,
                    textShadow: isUser && isUserB ? "0 0 12px rgba(251,191,36,0.4)" : "none",
                  }}>
                    {tie.teamB}
                  </div>
                  {isBWinner && (
                    <div style={{ fontSize: 9, color: CL_GOLD, marginTop: 4, fontWeight: 800, letterSpacing: "0.05em" }}>
                      ✓ متأهل
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom accent for user tie */}
              {isUser && (
                <div style={{
                  height: 2,
                  background: "linear-gradient(to right, transparent, #fbbf24, transparent)",
                }} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes playoffGlow {
          from { box-shadow: 0 0 20px rgba(251,191,36,0.15); }
          to   { box-shadow: 0 0 35px rgba(251,191,36,0.3); }
        }
      `}</style>
    </div>
  );
}

// ── Bracket Tab ────────────────────────────

function TeamSlot({
  name, isWinner, score, isUser,
}: { name: string; isWinner: boolean; score: number | null; isUser?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "5px 8px", gap: 4, minHeight: 26,
    }}>
      <span style={{
        fontSize: 10.5, fontWeight: isWinner ? 700 : 400,
        color: isUser ? CL_GOLD : isWinner ? "#e2e8f0" : "#64748b",
        flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{name}</span>
      {score !== null && (
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: isWinner ? (isUser ? CL_GOLD : "#e2e8f0") : "#475569",
          minWidth: 14, textAlign: "right", flexShrink: 0,
        }}>{score}</span>
      )}
    </div>
  );
}

function MatchCard({ tie, width, userTeam }: {
  tie: CLTie | null; width: number; userTeam?: string;
}) {
  const isUser = tie?.userInvolved;
  const aGoals = tie ? (tie.leg1?.goalsA ?? 0) + (tie.leg2?.goalsA ?? 0) : 0;
  const bGoals = tie ? (tie.leg1?.goalsB ?? 0) + (tie.leg2?.goalsB ?? 0) : 0;
  const played = !!(tie?.leg1);

  return (
    <div style={{
      width, flexShrink: 0,
      background: isUser ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${isUser ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 7, overflow: "hidden",
      boxShadow: isUser ? `0 0 10px rgba(251,191,36,0.12)` : "none",
    }}>
      {!tie ? (
        <>
          <TeamSlot name="TBD" isWinner={false} score={null} />
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
          <TeamSlot name="TBD" isWinner={false} score={null} />
        </>
      ) : (
        <>
          <TeamSlot
            name={tie.teamA} isWinner={tie.winner === tie.teamA}
            score={played ? aGoals : null} isUser={tie.teamA === userTeam}
          />
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
          <TeamSlot
            name={tie.teamB} isWinner={tie.winner === tie.teamB}
            score={played ? bGoals : null} isUser={tie.teamB === userTeam}
          />
        </>
      )}
    </div>
  );
}

function BracketColumn({ ties, label, height, cardWidth, userTeam }: {
  ties: (CLTie | null)[];
  label: string;
  height: number;
  cardWidth: number;
  userTeam?: string;
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      height, width: cardWidth + 14, flexShrink: 0,
    }}>
      <div style={{
        fontSize: 9, color: "#475569", fontWeight: 800, textAlign: "center",
        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, flexShrink: 0,
      }}>
        {label}
      </div>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "space-around", width: "100%", alignItems: "center",
      }}>
        {ties.map((tie, i) => (
          <MatchCard key={i} tie={tie} width={cardWidth} userTeam={userTeam} />
        ))}
      </div>
    </div>
  );
}

function BracketTab({ clState }: { clState: CLState }) {
  const phase = clState.phase;
  const userTeam = clState.standings.find(s => s.isUser)?.teamName;

  if (phase === "group") {
    return (
      <div style={{ color: "#64748b", textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚽</div>
        <div>الدور الإقصائي يبدأ بعد انتهاء دور المجموعات</div>
        <div style={{ fontSize: 12, marginTop: 6 }}>Knockout stage starts after the group phase</div>
      </div>
    );
  }

  const CARD_W = 136;
  const H = 440;

  // Playoff-only phase: show grid
  if (phase === "playoff_leg1" || phase === "playoff_leg2") {
    return (
      <div>
        <div style={{ color: CL_GOLD, fontSize: 13, fontWeight: 800, marginBottom: 12, textAlign: "center" }}>
          ملحق التأهل — Playoff Round
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {clState.playoffTies.map((tie, i) => (
            <MatchCard key={i} tie={tie} width={CARD_W} userTeam={userTeam} />
          ))}
        </div>
      </div>
    );
  }

  // R16 onwards: full visual bracket
  const pad = (arr: CLTie[], len: number): (CLTie | null)[] =>
    [...arr, ...Array(Math.max(0, len - arr.length)).fill(null)] as (CLTie | null)[];

  const r16L = clState.r16Ties.filter(t => t.side === "left");
  const r16R = clState.r16Ties.filter(t => t.side === "right");
  const qfL  = clState.qfTies.filter(t => t.side === "left");
  const qfR  = clState.qfTies.filter(t => t.side === "right");
  const sfL  = clState.sfTies.filter(t => t.side === "left");
  const sfR  = clState.sfTies.filter(t => t.side === "right");

  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "stretch", minWidth: "max-content" }}>

        {/* ── LEFT: R16 → QF → SF ── */}
        <BracketColumn ties={pad(r16L, 4)} label="دور الـ16"     height={H} cardWidth={CARD_W} userTeam={userTeam} />
        <BracketColumn ties={pad(qfL, 2)}  label="ربع النهائي"   height={H} cardWidth={CARD_W} userTeam={userTeam} />
        <BracketColumn ties={[sfL[0] ?? null]} label="نصف النهائي" height={H} cardWidth={CARD_W} userTeam={userTeam} />

        {/* ── FINAL ── */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: H, padding: "0 16px", flexShrink: 0,
        }}>
          <div style={{
            color: CL_GOLD, fontSize: 10, fontWeight: 900, letterSpacing: "0.12em",
            textAlign: "center", marginBottom: 10, textShadow: `0 0 14px ${CL_GOLD}70`,
          }}>
            🏆 FINAL
          </div>
          <MatchCard tie={clState.finalTie ?? null} width={CARD_W + 24} userTeam={userTeam} />
          {clState.champion && (
            <div style={{
              color: CL_GOLD, fontSize: 12, fontWeight: 900, marginTop: 10,
              textAlign: "center", maxWidth: CARD_W + 24,
              textShadow: `0 0 10px ${CL_GOLD}60`,
            }}>
              🏆 {clState.champion}
            </div>
          )}
        </div>

        {/* ── RIGHT: SF → QF → R16 ── */}
        <BracketColumn ties={[sfR[0] ?? null]} label="نصف النهائي" height={H} cardWidth={CARD_W} userTeam={userTeam} />
        <BracketColumn ties={pad(qfR, 2)}  label="ربع النهائي"   height={H} cardWidth={CARD_W} userTeam={userTeam} />
        <BracketColumn ties={pad(r16R, 4)} label="دور الـ16"     height={H} cardWidth={CARD_W} userTeam={userTeam} />

      </div>
    </div>
  );
}

// ── Stats Tab ────────────────────────────

function StatRow({ rank, name, team, value, label }: {
  rank: number; name: string; team: string; value: number; label: string;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ color: "#334155", fontWeight: 700, fontSize: 13, width: 24, textAlign: "center" }}>
        {rank}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{name}</div>
        <div style={{ color: "#475569", fontSize: 11 }}>{team}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ color: CL_GOLD, fontSize: 22, fontWeight: 900 }}>{value}</div>
        <div style={{ color: "#334155", fontSize: 10 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────

export default function CLModal({ clState, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("standings");

  const topScorers = getCLTopScorers(clState, 10);
  const topAssists = getCLTopAssists(clState, 10);
  const topCleanSheets = getCLTopCleanSheets(clState, 10);

  const phaseLabel: Record<string, string> = {
    group: `جولة ${clState.currentGroupRound} / 8`,
    playoff_leg1: "ملحق — الجولة الأولى",
    playoff_leg2: "ملحق — الجولة الثانية",
    r16_leg1: "دور الـ16 — الجولة الأولى",
    r16_leg2: "دور الـ16 — الجولة الثانية",
    qf_leg1: "ربع النهائي — الجولة الأولى",
    qf_leg2: "ربع النهائي — الجولة الثانية",
    sf_leg1: "نصف النهائي — الجولة الأولى",
    sf_leg2: "نصف النهائي — الجولة الثانية",
    final: "النهائي",
    finished: clState.champion ? `🏆 ${clState.champion}` : "منتهي",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-6 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div
        style={{
          background: CL_BG,
          border: `1px solid ${CL_BORDER}`,
          borderRadius: 20,
          width: "100%",
          maxWidth: 680,
          margin: "0 16px",
          overflow: "hidden",
          boxShadow: `0 0 60px rgba(251,191,36,0.12), 0 40px 80px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #000820, #001040)",
          borderBottom: `1px solid ${CL_BORDER}`,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🏆</span>
              <div>
                <h2 style={{ color: CL_GOLD, fontSize: 20, fontWeight: 900, margin: 0 }}>
                  دوري أبطال أوروبا
                </h2>
                <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>
                  Champions League · Season {clState.season} · {phaseLabel[clState.phase] ?? clState.phase}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#64748b",
              width: 36,
              height: 36,
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >×</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: 6,
          padding: "12px 16px",
          borderBottom: `1px solid ${CL_BORDER}`,
          overflowX: "auto",
          flexShrink: 0,
        }}>
          <TabButton label="الترتيب" active={tab === "standings"} onClick={() => setTab("standings")} />
          {clState.playoffTies.length > 0 && (
            <TabButton label="🏟️ الملحق" active={tab === "playoff"} onClick={() => setTab("playoff")} />
          )}
          <TabButton label="الأدوار الإقصائية" active={tab === "bracket"} onClick={() => setTab("bracket")} />
          <TabButton label="⚽ الهدافون" active={tab === "scorers"} onClick={() => setTab("scorers")} />
          <TabButton label="🎯 صناعة الأهداف" active={tab === "assists"} onClick={() => setTab("assists")} />
          <TabButton label="🧤 الشباك النظيفة" active={tab === "cleansheets"} onClick={() => setTab("cleansheets")} />
        </div>

        {/* Content */}
        <div style={{ padding: "16px 20px", maxHeight: "70vh", overflowY: "auto" }}>
          {tab === "standings" && <StandingsTab clState={clState} />}
          {tab === "playoff" && <PlayoffTab clState={clState} />}
          {tab === "bracket" && <BracketTab clState={clState} />}

          {tab === "scorers" && (
            <div>
              <h3 style={{ color: CL_GOLD, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                ⚽ Top Scorers — الهدافون
              </h3>
              {topScorers.length === 0 ? (
                <div style={{ color: "#334155", textAlign: "center", padding: 32 }}>No goals scored yet</div>
              ) : (
                topScorers.map((s, i) => (
                  <StatRow key={s.playerName} rank={i + 1} name={s.playerName} team={s.teamName} value={s.goals} label="goals" />
                ))
              )}
            </div>
          )}

          {tab === "assists" && (
            <div>
              <h3 style={{ color: CL_GOLD, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                🎯 Top Assists — صناعة الأهداف
              </h3>
              {topAssists.length === 0 ? (
                <div style={{ color: "#334155", textAlign: "center", padding: 32 }}>No assists recorded yet</div>
              ) : (
                topAssists.map((s, i) => (
                  <StatRow key={s.playerName} rank={i + 1} name={s.playerName} team={s.teamName} value={s.assists} label="assists" />
                ))
              )}
            </div>
          )}

          {tab === "cleansheets" && (
            <div>
              <h3 style={{ color: CL_GOLD, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                🧤 Clean Sheets — الشباك النظيفة
              </h3>
              {topCleanSheets.length === 0 ? (
                <div style={{ color: "#334155", textAlign: "center", padding: 32 }}>No clean sheets yet</div>
              ) : (
                topCleanSheets.map((s, i) => (
                  <StatRow key={s.playerName} rank={i + 1} name={s.playerName} team={s.teamName} value={s.cleanSheets} label="clean sheets" />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
