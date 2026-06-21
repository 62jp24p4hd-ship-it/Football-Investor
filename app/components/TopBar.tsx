"use client";

import type { GamePlayer, GameMode, BudgetMode } from "../game/types";
import { getLeagueTheme } from "../game/leagueThemes";

type Props = {
  season: number;
  mode: GameMode;
  gameLengthMode: "classic" | "infinite";
  budgetMode: BudgetMode;
  activePlayerIndex: number;
  gamePlayers: GamePlayer[];
  timerSeconds: number | null;
  timer: number;
  pendingSlot: string | null;
  onNextSeason: () => void;
  onSeasonClick: () => void;
  onFinishGame?: () => void;
  onSecretClick?: () => void;
  onSave?: () => void;
  canNextSeason: boolean;
  nextSeasonButtonLabel?: string;
  leagueRound?: number;
  leagueTotalRounds?: number;
  selectedLeagueId?: string;
  singlePlayerStyle?: "investor" | "clubOwner";
};

export default function TopBar({
  season, mode, gameLengthMode, activePlayerIndex, gamePlayers,
  timerSeconds, timer, pendingSlot, onNextSeason, onSeasonClick,
  onFinishGame, onSecretClick, onSave, canNextSeason, nextSeasonButtonLabel,
  leagueRound, leagueTotalRounds, selectedLeagueId, singlePlayerStyle
}: Props) {
  const isClubOwner = singlePlayerStyle === "clubOwner";
  const theme = isClubOwner ? getLeagueTheme(selectedLeagueId) : getLeagueTheme();
  const isTimerActive = pendingSlot !== null && timerSeconds !== null;
  const timerDanger = timer <= 5;
  const seasonsLeft = 2028 - season;
  const activePlayer = gamePlayers[activePlayerIndex];
  const budget = activePlayer?.budget ?? 0;
  const budgetPositive = budget >= 0;

  return (
    <header style={{
      background: theme.headerGradient,
      borderBottom: `1px solid ${isClubOwner ? theme.dimColor : "rgba(255,255,255,0.06)"}`,
      boxShadow: isClubOwner
        ? `0 4px 30px ${theme.glowColor}, 0 0 0 1px ${theme.dimColor}`
        : "0 4px 24px rgba(0,0,0,0.5)",
      transition: "background 0.6s ease, box-shadow 0.6s ease",
    }} className="sticky top-0 z-30 backdrop-blur-md">

      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">

          {/* ── LEFT: Logo + Season ── */}
          <div className="flex items-center gap-3">

            {/* Logo */}
            <div className="hidden md:flex items-center gap-2 pr-3" style={{ borderRight: `1px solid ${isClubOwner ? theme.dimColor : "rgba(255,255,255,0.08)"}` }}>
              <span className="text-xl">{isClubOwner ? theme.flag : "⚽"}</span>
              <span className="font-black text-white text-xs tracking-wider uppercase hidden lg:block"
                style={{
                  background: isClubOwner
                    ? `linear-gradient(135deg,#fff,${theme.textColor})`
                    : "linear-gradient(135deg,#fff,#a8f5d0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {isClubOwner ? (selectedLeagueId ? selectedLeagueId.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase()) : "Club Owner") : "Football\nInvestor"}
              </span>
            </div>

            {/* Season Card */}
            <button onClick={onSeasonClick}
              className="flex items-center gap-2.5 px-3 py-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 20px rgba(16,185,129,0.08)",
              }}>
              <span className="text-base">🗓️</span>
              <div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest leading-none mb-0.5">Season</div>
                <div className="font-black text-white leading-none" style={{
                  fontSize: "22px",
                  textShadow: "0 0 20px rgba(255,255,255,0.3)",
                }}>{season}</div>
              </div>
              {gameLengthMode === "classic" && seasonsLeft > 0 && (
                <div className="hidden lg:flex flex-col items-center justify-center px-2 py-1 rounded-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-[9px] text-gray-600 leading-none">left</span>
                  <span className="text-xs font-black text-gray-400 leading-none">{seasonsLeft}</span>
                </div>
              )}
              {gameLengthMode === "infinite" && (
                <span className="text-xs font-black text-purple-400 px-1.5 py-0.5 rounded-none"
                  style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)" }}>♾️</span>
              )}
              {typeof leagueRound === "number" && leagueRound > 0 && (
                <div className="flex flex-col items-center justify-center px-2 py-1"
                  style={{
                    background: theme.dimColor,
                    border: `1px solid ${isClubOwner ? theme.accentColor + "55" : "rgba(16,185,129,0.25)"}`,
                    borderRadius: "4px",
                    minWidth: "52px",
                  }}>
                  <span className="text-[9px] font-bold leading-none mb-0.5" style={{ color: theme.textColor, opacity: 0.7, letterSpacing: "0.1em" }}>
                    {isClubOwner ? `${theme.flag} JW` : "Round"}
                  </span>
                  <span className="text-xs font-black leading-none tabular-nums" style={{ color: theme.textColor }}>
                    {leagueRound}/{leagueTotalRounds ?? 36}
                  </span>
                  {/* Progress bar */}
                  <div style={{ width: "100%", height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "1px", marginTop: "3px" }}>
                    <div style={{
                      width: `${Math.min(100, (leagueRound / (leagueTotalRounds ?? 36)) * 100)}%`,
                      height: "100%",
                      background: theme.accentColor,
                      borderRadius: "1px",
                      boxShadow: `0 0 4px ${theme.accentColor}`,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              )}
            </button>

            {/* Budget Card — single mode shows active player */}
            {gamePlayers.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 transition-all"
                style={{
                  background: budgetPositive ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                  border: `1px solid ${budgetPositive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                  boxShadow: budgetPositive ? "0 0 20px rgba(16,185,129,0.1)" : "0 0 20px rgba(239,68,68,0.1)",
                }}>
                <span className="text-base">💰</span>
                <div>
                  <div className="text-[9px] uppercase tracking-widest leading-none mb-0.5"
                    style={{ color: budgetPositive ? "#6ee7b7" : "#fca5a5" }}>
                    {mode === "versus" ? activePlayer?.name?.split(" ")[0] : "Budget"}
                  </div>
                  <div className="font-black leading-none tabular-nums" style={{
                    fontSize: "20px",
                    color: budgetPositive ? "#34d399" : "#f87171",
                    textShadow: budgetPositive ? "0 0 16px rgba(52,211,153,0.5)" : "0 0 16px rgba(248,113,113,0.5)",
                  }}>
                    €{budget}M
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CENTER: Turn indicator (versus) ── */}
          {mode === "versus" && (
            <div className="flex items-center gap-2">
              {gamePlayers.map((gp, i) => (
                <div key={gp.name}
                  className="px-3 py-2 transition-all duration-300"
                  style={i === activePlayerIndex ? {
                    background: "rgba(234,179,8,0.1)",
                    border: "1px solid rgba(234,179,8,0.4)",
                    boxShadow: "0 0 16px rgba(234,179,8,0.15)",
                  } : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                  <div className="text-[9px] uppercase tracking-widest leading-none mb-0.5"
                    style={{ color: i === activePlayerIndex ? "#fbbf24" : "#4b5563" }}>
                    {i === activePlayerIndex ? "▶ Your Turn" : "Waiting"}
                  </div>
                  <div className={`text-sm font-black leading-none ${i === activePlayerIndex ? "text-yellow-300" : "text-gray-600"}`}>
                    {gp.name}
                  </div>
                  <div className="text-[9px] leading-none mt-0.5"
                    style={{ color: i === activePlayerIndex ? "#6ee7b7" : "#374151" }}>
                    €{gp.budget}M
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── RIGHT: Timer + Actions ── */}
          <div className="flex items-center gap-2.5">

            {/* Timer */}
            {isTimerActive && (
              <div className={`flex items-center gap-2 px-3 py-2 transition-all ${timerDanger ? "animate-pulse" : ""}`}
                style={timerDanger ? {
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.5)",
                  boxShadow: "0 0 20px rgba(239,68,68,0.2)",
                } : {
                  background: "rgba(234,179,8,0.08)",
                  border: "1px solid rgba(234,179,8,0.3)",
                }}>
                <span className="text-sm">⏱</span>
                <span className={`font-black text-2xl tabular-nums leading-none ${timerDanger ? "text-red-400" : "text-yellow-300"}`}>
                  {timer}s
                </span>
              </div>
            )}

            {/* Save button */}
            {onSave && (
              <button onClick={onSave}
                className="px-3 py-2.5 font-bold text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: isClubOwner ? theme.dimColor : "rgba(16,185,129,0.08)",
                  border: `1px solid ${isClubOwner ? theme.accentColor + "55" : "rgba(16,185,129,0.25)"}`,
                  color: isClubOwner ? theme.textColor : "#10b981",
                  borderRadius: "6px",
                }}
                title="Save Game">
                💾
              </button>
            )}

            {/* End button (infinite mode) */}
            {gameLengthMode === "infinite" && onFinishGame && (
              <button onClick={onFinishGame}
                className="px-3 py-2.5 font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#ef4444",
                }}>
                End
              </button>
            )}

            {/* NEXT SEASON — Main CTA */}
            <button
              onClick={() => { if (canNextSeason) onNextSeason(); else onSecretClick?.(); }}
              className="relative overflow-hidden transition-all duration-200 font-black text-sm"
              style={canNextSeason ? {
                background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                color: "white",
                padding: "10px 20px",
                boxShadow: "0 0 24px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                border: "1px solid rgba(16,185,129,0.5)",
                transform: "translateY(0)",
              } : {
                background: "rgba(255,255,255,0.04)",
                color: "#374151",
                padding: "10px 20px",
                border: "1px solid rgba(255,255,255,0.06)",
                cursor: "not-allowed",
              }}
              onMouseEnter={e => { if (canNextSeason) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px) scale(1.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; }}
              title={canNextSeason ? "" : "Next Season (locked)"}>
              {canNextSeason && (
                <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)" }} />
              )}
              <span className="relative flex items-center gap-2 tracking-wide uppercase text-xs">
                <span>{nextSeasonButtonLabel ?? "Next Season"}</span>
                <span className="text-base">→</span>
              </span>
            </button>

          </div>
        </div>

        {/* ── Pending slot bar ── */}
        {pendingSlot && (
          <div className="mt-2 flex items-center gap-2 text-xs animate-fade-in"
            style={{ color: "rgba(251,191,36,0.8)" }}>
            <span className="animate-pulse">⏳</span>
            <span>Selecting player for <strong style={{ color: "#fcd34d" }}>{pendingSlot}</strong></span>
            {timerSeconds !== null && (
              <span className={timerDanger ? "text-red-400 font-black animate-pulse" : "text-gray-500"}>
                — {timer}s remaining
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
