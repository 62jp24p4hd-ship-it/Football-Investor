// ============================================
// FOOTBALL INVESTOR 1.8 - GAME SETUP
// ============================================

import type {
  GamePlayer,
  OwnedPlayer,
  BudgetMode,
  GameMode,
  NewsItem,
} from "./types";
import { randomId } from "./helpers";
import { emptyCards } from "./rewardCardEngine";
import { BUDGET_SETTINGS, GAME_START_SEASON } from "./constants";
import { applyPriceTierGrowth, calculatePerformanceGrowth } from "./valueEngine";
import type { PerformanceGrowthResult } from "./valueEngine";
import { expireActiveEffects } from "./eventEngine";
import { getSingleSeasonChances } from "./singleMode";
import { getVersusSeasonChances } from "./versusMode";
import { applyRetirementToSquad } from "./careerEngine";
import { checkSeasonSponsorships } from "./sponsorshipEngine";
import { createRetirementNews, createNewSeasonNews, createGameStartNews, createContractWarningNews, createContractExpiredNews } from "./newsEngine";
import { isContractExpired, isContractLastSeason } from "./contractEngine";

// ============================================
// CREATE INITIAL GAME PLAYERS
// ============================================

export function createInitialGamePlayers(
  budgetMode: BudgetMode,
  team1Name: string,
  team2Name: string,
  mode: GameMode = "versus"
): GamePlayer[] {
  const budget = BUDGET_SETTINGS[budgetMode].budget;
  const dummyGp = { tripleNextSeason: false, frozenSeason: null } as GamePlayer;
  const chances = mode === "single"
    ? getSingleSeasonChances(dummyGp, GAME_START_SEASON)
    : getVersusSeasonChances(dummyGp, GAME_START_SEASON);

  const base: GamePlayer = {
    name: "",
    budget,
    owned: [],
    sold: [],
    purchaseChances: chances.purchaseChances,
    sellChances: chances.sellChances,
    soldBonusUsedThisSeason: false,
    cards: emptyCards(),
    tripleNextSeason: false,
    frozenSeason: null,
    totalSalaryBudget: 0,
    sponsorships: [],
  };

  if (mode === "single") {
    return [{ ...base, name: team1Name }];
  }

  return [
    { ...base, name: team1Name },
    { ...base, name: team2Name },
  ];
}

// ============================================
// GAME START NEWS
// ============================================

export function buildGameStartNews(
  budgetMode: BudgetMode,
  team1Name: string,
  team2Name: string,
  mode: GameMode
): NewsItem {
  const label = BUDGET_SETTINGS[budgetMode].label;
  return createGameStartNews(
    GAME_START_SEASON,
    label,
    team1Name,
    mode === "versus" ? team2Name : undefined
  );
}

// ============================================
// SEASON TRANSITION SETUP
// ============================================

export type SeasonSetupResult = {
  updatedPlayers: GamePlayer[];
  retirementNews: NewsItem[];
  salaryNews: NewsItem[];
  sponsorshipNews: NewsItem[];
  seasonNews: NewsItem;
};

export function setupNewSeason(
  newSeason: number,
  gamePlayers: GamePlayer[],
  mode: GameMode = "single"
): SeasonSetupResult {
  const retirementNews: NewsItem[] = [];
  const salaryNews: NewsItem[] = [];
  const sponsorshipNews: NewsItem[] = [];

  const baseChances = mode === "single" ? getSingleSeasonChances : getVersusSeasonChances;

  // Step 1: Reset chances + retirements
  let updatedPlayers = gamePlayers.map((gp): GamePlayer => {
    const { purchaseChances, sellChances } = baseChances(gp, newSeason);
    const reset: GamePlayer = {
      ...gp,
      purchaseChances,
      sellChances,
      soldBonusUsedThisSeason: false,
      tripleNextSeason: false,
    };

    const { surviving, retired } = applyRetirementToSquad(reset.owned, newSeason);

    retired.forEach((r) => {
      retirementNews.push(
        createRetirementNews(newSeason, r.playerName, gp.name, r.age)
      );
    });

    // Remove expired contracts (player leaves as free agent)
    const afterContracts = (surviving as OwnedPlayer[]).filter((item) => {
      if (isContractExpired(item.contract, newSeason)) {
        retirementNews.push(createContractExpiredNews(newSeason, item.player.name, gp.name));
        return false;
      }
      return true;
    });

    // Warn about contracts with 1 season remaining
    afterContracts.forEach((item) => {
      if (isContractLastSeason(item.contract, newSeason)) {
        retirementNews.push(createContractWarningNews(newSeason, item.player.name, gp.name));
      }
    });

    // Apply performance-based value growth
    const updatedOwned = afterContracts.map((item) => {
      const safeCurrentValue = item.currentValue && item.currentValue > 0
        ? item.currentValue
        : item.buyPrice;

      // stats الموسم اللي انتهى للتو (newSeason - 1)
      const justEndedSeason = newSeason - 1;
      const seasonStats = item.player.statsBySeason?.[justEndedSeason] ?? null;

      if (seasonStats) {
        const result = calculatePerformanceGrowth(
          safeCurrentValue,
          item.player.position,
          seasonStats.goals ?? 0,
          seasonStats.assists ?? 0,
          seasonStats.cleanSheets ?? 0,
          seasonStats.games ?? 0,
        );

        // خبر التغيير في القيمة
        if (Math.abs(result.changePct) > 3) {
          const icon = result.direction === "up" ? "⬆️" : "⬇️";
          const sign = result.changeAbs >= 0 ? "+" : "";
          retirementNews.push({
            id: randomId(),
            season: newSeason,
            title: `${icon} ${item.player.name} — Value ${result.direction === "up" ? "Increased" : "Decreased"}`,
            description: `${item.player.name} (${gp.name}): ${sign}€${result.changeAbs}M (${sign}${Math.round(result.changePct)}%) | New Value: €${result.newValue}M`,
            tone: result.direction === "up" ? "good" : "bad",
            journalist: "David Ornstein",
            source: "The Athletic",
          });
        }

        return { ...item, currentValue: result.newValue };
      }

      // fallback: tier growth للاعبين بدون stats
      const effectiveBudget = item.budgetAtBuy && item.budgetAtBuy > 0
        ? item.budgetAtBuy : Math.max(item.buyPrice * 3, 30);
      const currentRating = item.player.statsBySeason?.[newSeason - 1]?.rating ?? item.player.rating ?? 70;
      const newVal = applyPriceTierGrowth(safeCurrentValue, effectiveBudget, currentRating);
      return { ...item, currentValue: newVal };
    });

    return { ...reset, owned: updatedOwned };
  });

  // Step 2: Apply salaries
  updatedPlayers = updatedPlayers.map((gp) => {
    const totalPaid = gp.owned.reduce((sum, item) => {
      const active =
        newSeason >= item.contract.startSeason &&
        newSeason <= item.contract.endSeason;
      return active ? sum + item.contract.salary : sum;
    }, 0);

    if (totalPaid > 0) {
      salaryNews.push({
        id: randomId(),
        season: newSeason,
        title: `💼 Salaries Paid — ${gp.name}`,
        description: `€${totalPaid}M paid in player salaries this season.`,
        tone: "neutral",
      });
    }

    return { ...gp, budget: gp.budget - totalPaid, totalSalaryBudget: totalPaid };
  });

  // Step 3: Apply sponsorships
  updatedPlayers = updatedPlayers.map((gp) => {
    const teamIncome = gp.sponsorships
      .filter((s) => newSeason >= s.startSeason && newSeason <= s.endSeason)
      .reduce((sum, s) => sum + s.annualIncome, 0);

    const playerIncome = gp.owned.reduce((sum, item) => {
      return sum + item.sponsorships
        .filter((s) => newSeason >= s.startSeason && newSeason <= s.endSeason)
        .reduce((s2, sp) => s2 + sp.annualIncome, 0);
    }, 0);

    const income = teamIncome + playerIncome;

    if (income > 0) {
      sponsorshipNews.push({
        id: randomId(),
        season: newSeason,
        title: `🤝 Sponsorship Income — ${gp.name}`,
        description: `€${income}M received from sponsorships this season.`,
        tone: "good",
      });
    }

    // Clean expired sponsorships
    const cleanTeam = gp.sponsorships.filter((s) => newSeason <= s.endSeason);
    const cleanOwned = gp.owned.map((item) => ({
      ...item,
      sponsorships: item.sponsorships.filter((s) => newSeason <= s.endSeason),
    }));

    return {
      ...gp,
      budget: gp.budget + income,
      sponsorships: cleanTeam,
      owned: cleanOwned,
    };
  });

  // Expire temporary effects (Fast Food etc.)
  updatedPlayers = expireActiveEffects(updatedPlayers, newSeason);

  // Check sponsorships for all players independently
  const sponsorCheck = checkSeasonSponsorships(updatedPlayers, newSeason);
  updatedPlayers = sponsorCheck.updatedPlayers;
  sponsorshipNews.push(...sponsorCheck.newsItems);

  return {
    updatedPlayers,
    retirementNews,
    salaryNews,
    sponsorshipNews,
    seasonNews: createNewSeasonNews(newSeason),
  };
}

// ============================================
// FULL RESET STATE (for restart)
// ============================================

export type FullGameState = {
  gamePlayers: GamePlayer[];
  news: NewsItem[];
};

export function buildInitialState(
  budgetMode: BudgetMode,
  team1Name: string,
  team2Name: string,
  mode: GameMode
): FullGameState {
  const gamePlayers = createInitialGamePlayers(budgetMode, team1Name, team2Name, mode);
  const startNews = buildGameStartNews(budgetMode, team1Name, team2Name, mode);
  return { gamePlayers, news: [startNews] };
}

// ============================================
// TURN ORDER
// ============================================

export function getFirstTurn(mode: GameMode): number {
  if (mode === "single") return 0;
  return Math.random() < 0.5 ? 0 : 1;
}

export function getNextTurn(currentTurn: number, totalPlayers: number): number {
  return (currentTurn + 1) % totalPlayers;
}

// ============================================
// VALIDATE CAN START GAME
// ============================================

export function validateGameStart(
  mode: GameMode | null,
  team1Name: string,
  team2Name: string
): string | null {
  if (!mode) return "Please select a game mode.";
  if (!team1Name.trim()) return "Please enter a name for Team 1.";
  if (mode === "versus" && !team2Name.trim()) return "Please enter a name for Team 2.";
  return null;
}