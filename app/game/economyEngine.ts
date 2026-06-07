// ============================================
// FOOTBALL INVESTOR 1.8 - ECONOMY ENGINE
// ============================================

import type { GamePlayer, FinancialDashboard, SoldPlayer, OwnedPlayer } from "./types";
import { getCurrentValue } from "./valueEngine";
import { calculateAnnualSalaries } from "./contractEngine";
import { calculateTeamSponsorshipIncome } from "./sponsorshipEngine";
import { NEGATIVE_BUDGET_WARNING, PURCHASE_CHANCES_PER_SEASON, SELL_CHANCES_PER_SEASON } from "./constants";

// ============================================
// APPLY SEASON SALARIES
// ============================================

export function applySeasonSalaries(
  gp: GamePlayer,
  currentSeason: number
): { updatedGP: GamePlayer; totalPaid: number } {
  // Only pay for players whose contracts are still active
  const activeSalaries = gp.owned.reduce((sum, item) => {
    const contractActive =
      currentSeason >= item.contract.startSeason &&
      currentSeason <= item.contract.endSeason;
    return contractActive ? sum + item.contract.salary : sum;
  }, 0);

  return {
    updatedGP: {
      ...gp,
      budget: gp.budget - activeSalaries,
      totalSalaryBudget: activeSalaries,
    },
    totalPaid: activeSalaries,
  };
}

// ============================================
// CALCULATE FINANCIAL DASHBOARD
// ============================================

export function calculateFinancialDashboard(
  gp: GamePlayer,
  currentSeason: number
): FinancialDashboard {
  const totalSalaries = calculateAnnualSalaries(gp.owned);
  const totalSponsorships = calculateTeamSponsorshipIncome(gp, currentSeason);
  const netIncome = totalSponsorships - totalSalaries;
  const projectedNextSeason = gp.budget + netIncome;

  return {
    totalSalaries,
    totalSponsorships,
    netIncome,
    projectedNextSeason,
  };
}

// ============================================
// TOTAL PROFIT / LOSS
// ============================================

export function calculateTotalProfit(sold: SoldPlayer[]): number {
  return sold.reduce((sum, s) => sum + s.profit, 0);
}

export function calculateTotalRevenue(sold: SoldPlayer[]): number {
  return sold.reduce((sum, s) => sum + s.sellPrice, 0);
}

export function calculateTotalSpent(sold: SoldPlayer[]): number {
  return sold.reduce((sum, s) => sum + s.buyPrice, 0);
}

// ============================================
// BEST DEAL
// ============================================

export function getBestDeal(sold: SoldPlayer[]): SoldPlayer | null {
  if (sold.length === 0) return null;
  return sold.reduce((best, s) => (s.profit > best.profit ? s : best), sold[0]);
}

export function getWorstDeal(sold: SoldPlayer[]): SoldPlayer | null {
  if (sold.length === 0) return null;
  return sold.reduce((worst, s) => (s.profit < worst.profit ? s : worst), sold[0]);
}

// ============================================
// PORTFOLIO VALUE
// ============================================

export function calculateCurrentPortfolioValue(
  owned: OwnedPlayer[],
  currentSeason: number
): number {
  return owned.reduce((sum, item) => {
    return sum + getCurrentValue(item.player, currentSeason);
  }, 0);
}

// ============================================
// TOTAL NET WORTH
// ============================================

export function calculateNetWorth(
  gp: GamePlayer,
  currentSeason: number
): number {
  return gp.budget + calculateCurrentPortfolioValue(gp.owned, currentSeason);
}

// ============================================
// IS IN NEGATIVE BUDGET
// ============================================

export function isNegativeBudget(budget: number): boolean {
  return budget < 0;
}

export function isDangerousNegative(budget: number): boolean {
  return budget < NEGATIVE_BUDGET_WARNING;
}

export function getBudgetStatusLabel(budget: number): string {
  if (budget >= 50) return "💰 Healthy";
  if (budget >= 10) return "🟡 Manageable";
  if (budget >= 0) return "⚠️ Tight";
  if (budget >= NEGATIVE_BUDGET_WARNING) return "🔴 In Debt";
  return "💀 Critical Debt";
}

export function getBudgetStatusColor(budget: number): string {
  if (budget >= 50) return "text-emerald-400";
  if (budget >= 10) return "text-yellow-400";
  if (budget >= 0) return "text-orange-400";
  return "text-red-400";
}

// ============================================
// AUTO-SELL ON GAME END
// ============================================

export function autoSellAllPlayers(
  gp: GamePlayer,
  currentSeason: number
): GamePlayer {
  const autoSold: SoldPlayer[] = gp.owned.map((item) => {
    const sellPrice = item.currentValue ?? getCurrentValue(item.player, currentSeason);
    return {
      owner: gp.name,
      name: item.player.name,
      buySeason: item.buySeason,
      sellSeason: currentSeason,
      buyPrice: item.buyPrice,
      sellPrice,
      profit: sellPrice - item.buyPrice,
      position: item.player.position,
    };
  });

  const autoMoney = autoSold.reduce((sum, s) => sum + s.sellPrice, 0);

  return {
    ...gp,
    budget: gp.budget + autoMoney,
    sold: [...autoSold, ...gp.sold],
    owned: [],
  };
}

// ============================================
// DETERMINE WINNER
// ============================================

export function determineWinner(
  players: GamePlayer[],
  currentSeason: number
): {
  winnerIndex: number;
  winnerName: string;
  scores: { name: string; score: number; breakdown: Record<string, number> }[];
  isDraw: boolean;
} {
  const scores = players.map((gp) => {
    const netWorth = calculateNetWorth(gp, currentSeason);
    const totalProfit = calculateTotalProfit(gp.sold);
    const sponsorIncome = gp.sold.reduce(
      (sum) => sum,
      0
    );

    // Weighted score: budget (40%) + portfolio (35%) + profit history (25%)
    const score = Math.round(
      gp.budget * 0.4 +
      calculateCurrentPortfolioValue(gp.owned, currentSeason) * 0.35 +
      Math.max(0, totalProfit) * 0.25
    );

    return {
      name: gp.name,
      score,
      breakdown: {
        budget: gp.budget,
        portfolio: calculateCurrentPortfolioValue(gp.owned, currentSeason),
        profit: totalProfit,
        netWorth,
      },
    };
  });

  const maxScore = Math.max(...scores.map((s) => s.score));
  const winnerIndex = scores.findIndex((s) => s.score === maxScore);
  const isDraw = scores.filter((s) => s.score === maxScore).length > 1;

  return {
    winnerIndex,
    winnerName: scores[winnerIndex]?.name ?? "Unknown",
    scores,
    isDraw,
  };
}

// ============================================
// SELL CHANCE BONUS
// ============================================

export function getSellBonusChances(sellPrice: number): number {
  if (sellPrice >= 80) return 2;
  if (sellPrice >= 50) return 1;
  return 0;
}

// ============================================
// PURCHASE CHANCES RESET
// ============================================

export function resetSeasonChances(
  gp: GamePlayer,
  newSeason: number
): GamePlayer {
  const chances = gp.tripleNextSeason ? PURCHASE_CHANCES_PER_SEASON + 2 : PURCHASE_CHANCES_PER_SEASON;
  return {
    ...gp,
    purchaseChances: gp.frozenSeason === newSeason ? 0 : chances,
    sellChances: SELL_CHANCES_PER_SEASON,
    soldBonusUsedThisSeason: false,
    tripleNextSeason: false,
  };
}