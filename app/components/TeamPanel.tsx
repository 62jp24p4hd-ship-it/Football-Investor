"use client";

import { useState } from "react";
import type { GamePlayer, RewardCard } from "../game/types";
import { getCurrentValue } from "../game/valueEngine";
import { getCardStatus, getCardDisplayInfo, ALL_REWARD_CARDS } from "../game/rewardCardEngine";
import { calculateFinancialDashboard, calculateNetWorth } from "../game/economyEngine";

type Props = {
  gamePlayer: GamePlayer;
  playerIndex: number;
  season: number;
  marketMultiplier: number;
  isActive: boolean;
  mode: "single" | "versus";
  onUseCard: (playerIndex: number, card: RewardCard) => void;
  onShowStats: () => void;
  onSkipTurn?: () => void;
};

export default function TeamPanel({ gamePlayer, playerIndex, season, marketMultiplier, isActive, mode, onUseCard, onShowStats, onSkipTurn }: Props) {
  const [showFinancials, setShowFinancials] = useState(false);
  const dashboard = calculateFinancialDashboard(gamePlayer, season);
  const netWorth = calculateNetWorth(gamePlayer, season);
  const isFrozen = gamePlayer.frozenSeason === season;

  const portfolioValue = gamePlayer.owned.reduce((sum, item) =>
    sum + getCurrentValue(item.player, season, marketMultiplier), 0);

  return (
    <div className={`bg-[#0d1128] border-2 rounded-2xl overflow-hidden transition-all ${
      isActive ? "border-emerald-500/40 shadow-xl shadow-emerald-500/5" : "border-white/8"
    }`}>

      {/* Header */}
      <div className={`px-4 py-3 border-b border-white/8 flex items-center justify-between ${
        isActive ? "bg-emerald-900/20" : "bg-white/3"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-emerald-400 shadow-emerald-400/80 shadow-md animate-pulse" : "bg-white/20"}`} />
          <div>
            <div className="font-black text-white text-sm">{gamePlayer.name}</div>
            {isFrozen && <div className="text-xs text-blue-400 font-bold">🧊 Frozen this season</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mode === "versus" && isActive && onSkipTurn && (
            <button onClick={onSkipTurn} className="text-xs px-2 py-1 rounded-lg bg-white/8 border border-white/10 text-gray-500 hover:text-white transition-all font-bold">
              Skip
            </button>
          )}
          <button onClick={onShowStats} className="text-xs px-2 py-1 rounded-lg bg-white/8 border border-white/10 text-gray-500 hover:text-white transition-all">
            📊 Stats
          </button>
        </div>
      </div>

      {/* Financial summary */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2 border-b border-white/8">
        <div className="text-center">
          <div className={`font-black text-lg ${gamePlayer.budget >= 0 ? "text-white" : "text-red-400"}`}>
            €{gamePlayer.budget}M
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Budget</div>
        </div>
        <div className="text-center">
          <div className="font-black text-lg text-yellow-300">€{portfolioValue}M</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Squad</div>
        </div>
        <div className="text-center">
          <div className="font-black text-lg text-emerald-400">€{netWorth}M</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Net Worth</div>
        </div>
      </div>

      {/* Chances */}
      <div className="px-4 py-2 flex items-center gap-4 border-b border-white/8">
        <div className="flex items-center gap-1.5 bg-yellow-900/20 border border-yellow-500/20 rounded-lg px-2 py-1">
          <span className="text-sm">🎟</span>
          <span className="text-xs text-yellow-300 font-bold">{gamePlayer.purchaseChances} buy</span>
        </div>
        <div className="flex items-center gap-1.5 bg-red-900/20 border border-red-500/20 rounded-lg px-2 py-1">
          <span className="text-sm">💰</span>
          <span className="text-xs text-red-300 font-bold">{gamePlayer.sellChances} sell</span>
        </div>
      </div>

      {/* Financial Dashboard toggle */}
      <button onClick={() => setShowFinancials(!showFinancials)}
        className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-500 hover:text-gray-300 border-b border-white/8 transition-colors">
        <span>💼 Financial Dashboard</span>
        <span>{showFinancials ? "▲" : "▼"}</span>
      </button>

      {showFinancials && (
        <div className="px-4 py-3 border-b border-white/8 space-y-2 bg-black/20">
          {[
            { label: "Annual Salaries", value: `-€${dashboard.totalSalaries}M`, color: "text-red-400" },
            { label: "Sponsorship Income", value: `+€${dashboard.totalSponsorships}M`, color: "text-emerald-400" },
            { label: "Net Income", value: `${dashboard.netIncome >= 0 ? "+" : ""}€${dashboard.netIncome}M`, color: dashboard.netIncome >= 0 ? "text-emerald-400" : "text-red-400" },
            { label: "Next Season", value: `€${dashboard.projectedNextSeason}M`, color: dashboard.projectedNextSeason >= 0 ? "text-white" : "text-red-400" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-xs">
              <span className="text-gray-500">{row.label}</span>
              <span className={`font-bold ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Special Cards */}
      <div className="px-4 py-3">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Special Cards</div>
        <div className="flex flex-col gap-1.5">
          {ALL_REWARD_CARDS.map((card) => {
            const info = getCardDisplayInfo(card);
            const status = getCardStatus(gamePlayer.cards[card], season);
            return (
              <div key={card} className={`rounded-xl border px-3 py-2 flex items-center justify-between transition-all ${
                status === "ready" ? `${info.color} shadow-md` : "border-white/8 bg-transparent"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">{info.icon}</span>
                  <div>
                    <div className={`text-xs font-black ${status === "ready" ? "text-white" : "text-gray-600"}`}>
                      {info.name}
                    </div>
                    <div className="text-[10px] text-gray-600 leading-tight">
                      {status === "locked" ? info.unlockRequirement : status === "used" ? "Used" : info.description}
                    </div>
                  </div>
                </div>
                {status === "ready" && (isActive || mode === "single") ? (
                  <button onClick={() => onUseCard(playerIndex, card)}
                    className="text-xs px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-black transition-all active:scale-95">
                    Use
                  </button>
                ) : status === "locked" ? (
                  <span className="text-gray-700">🔒</span>
                ) : status === "used" ? (
                  <span className="text-gray-700 text-xs">✓</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}