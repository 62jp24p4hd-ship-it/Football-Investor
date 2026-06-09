// ============================================
// FOOTBALL INVESTOR — CONTRACT ENGINE
// ============================================

import type { Contract, ContractNegotiation, OwnedPlayer, Player } from "./types";
import { clamp, randomBetween, randomFloat } from "./helpers";
import {
  MIN_SALARY_PERCENT, MAX_SALARY_PERCENT,
  MIN_CONTRACT_YEARS, MAX_CONTRACT_YEARS,
  PLAYER_SATISFACTION_REJECT_THRESHOLD,
  CONTRACT_TIMER_SECONDS,
} from "./constants";

// ============================================
// GENERATE REQUIRED SALARY
// ============================================

export function generateRequiredSalary(marketValue: number): number {
  const percent = randomFloat(MIN_SALARY_PERCENT, MAX_SALARY_PERCENT);
  return Math.max(1, Math.round(marketValue * percent));
}

// ============================================
// CALCULATE SATISFACTION
// ============================================

export function calculateSatisfaction(
  offeredSalary: number,
  requiredSalary: number,
  offeredDuration: number,
  marketValue: number
): number {
  let satisfaction = 50;
  const salaryRatio = offeredSalary / requiredSalary;
  if (salaryRatio >= 1.3) satisfaction += 40;
  else if (salaryRatio >= 1.1) satisfaction += 25;
  else if (salaryRatio >= 1.0) satisfaction += 15;
  else if (salaryRatio >= 0.85) satisfaction -= 10;
  else if (salaryRatio >= 0.7) satisfaction -= 25;
  else satisfaction -= 40;

  if (offeredDuration === 2 || offeredDuration === 3) satisfaction += 10;
  else if (offeredDuration === 1) satisfaction -= 5;
  else if (offeredDuration === 4) satisfaction -= 8;
  else if (offeredDuration === 5) satisfaction -= 15;

  if (marketValue >= 60) satisfaction -= 10;
  else if (marketValue >= 40) satisfaction -= 5;

  return clamp(Math.round(satisfaction), 0, 100);
}

// ============================================
// CREATE NEGOTIATION STATE
// ============================================

export function createNegotiation(
  player: Player,
  slot: string,
  marketValue: number
): ContractNegotiation {
  const requiredSalary = generateRequiredSalary(marketValue);
  // اللاعب يبدأ بعرضه الأولي
  const playerInitialSalary = Math.max(1, Math.round(marketValue * 0.10));
  const playerInitialDuration = marketValue >= 50 ? 2 : 3;
  const defaultDuration = 2;
  const satisfaction = calculateSatisfaction(requiredSalary, requiredSalary, defaultDuration, marketValue);

  return {
    player, slot,
    offeredSalary: playerInitialSalary,
    offeredDuration: playerInitialDuration,
    satisfaction,
    requiredSalary,
    marketValue,
    timer: CONTRACT_TIMER_SECONDS,
    attempts: 0,
    playerCounterMessage: `👋 I'm interested. My asking price is €${playerInitialSalary}M/yr for ${playerInitialDuration} years.`,
  };
}

// ============================================
// CREATE RENEWAL NEGOTIATION (for owned player)
// ============================================

export function createRenewalNegotiation(
  owned: OwnedPlayer,
  currentValue: number
): ContractNegotiation {
  const requiredSalary = generateRequiredSalary(currentValue);
  const defaultDuration = 2;
  const satisfaction = calculateSatisfaction(requiredSalary, requiredSalary, defaultDuration, currentValue);

  return {
    player: owned.player,
    slot: owned.slot,
    offeredSalary: requiredSalary,
    offeredDuration: defaultDuration,
    satisfaction,
    requiredSalary,
    marketValue: currentValue,
    timer: CONTRACT_TIMER_SECONDS,
    attempts: 0,
    isRenewal: true,
  };
}

// ============================================
// UPDATE OFFER
// ============================================

export function updateOffer(
  negotiation: ContractNegotiation,
  newSalary: number,
  newDuration: number
): ContractNegotiation {
  const satisfaction = calculateSatisfaction(
    newSalary, negotiation.requiredSalary, newDuration, negotiation.marketValue
  );
  return { ...negotiation, offeredSalary: newSalary, offeredDuration: newDuration, satisfaction, attempts: negotiation.attempts + 1 };
}

export function isRejected(negotiation: ContractNegotiation): boolean {
  return negotiation.satisfaction < PLAYER_SATISFACTION_REJECT_THRESHOLD;
}

// ============================================
// ACCEPTANCE SYSTEM — حسب نسبة الرضا
// ============================================

export function getAcceptanceProbability(satisfaction: number): number {
  if (satisfaction < 20) return 0;    // رفض تلقائي
  if (satisfaction >= 100) return 1;  // قبول تلقائي
  // النسبة مباشرة = نسبة الرضا / 100
  return Math.min(1, Math.max(0, satisfaction / 100));
}

export function willPlayerAccept(satisfaction: number): boolean {
  if (satisfaction < 20) return false;
  if (satisfaction >= 100) return true;
  return Math.random() < getAcceptanceProbability(satisfaction);
}

// ============================================
// PLAYER COUNTER OFFER — اللاعب يقدم عرضه
// ============================================

export function generatePlayerCounterOffer(
  negotiation: ContractNegotiation
): { salary: number; duration: number; message: string } {
  const { satisfaction, requiredSalary, marketValue, offeredSalary, offeredDuration } = negotiation;

  // اللاعب يطلب زيادة حسب درجة رضاه
  let demandMultiplier = 1.0;
  if (satisfaction < 30) demandMultiplier = 1.40;
  else if (satisfaction < 50) demandMultiplier = 1.25;
  else if (satisfaction < 70) demandMultiplier = 1.10;
  else demandMultiplier = 1.02;

  const counterSalary = Math.max(
    requiredSalary,
    Math.round(Math.max(offeredSalary, requiredSalary) * demandMultiplier)
  );

  // مدة العقد المفضلة للاعب
  const preferredDuration = marketValue >= 50 ? 2 : 3;

  let message = "";
  if (satisfaction < 30) message = `💢 This offer is insulting. I want €${counterSalary}M/yr for ${preferredDuration} years.`;
  else if (satisfaction < 50) message = `🙁 Not good enough. I need at least €${counterSalary}M/yr.`;
  else if (satisfaction < 70) message = `🤔 Getting closer. How about €${counterSalary}M/yr for ${preferredDuration} years?`;
  else message = `😊 Almost there. Just raise it to €${counterSalary}M/yr and we have a deal.`;

  return { salary: counterSalary, duration: preferredDuration, message };
}

// راتب الاعب يتحدد حسب سعر شرائه
export function getRecommendedSalary(buyPrice: number): number {
  if (buyPrice <= 5)  return Math.max(1, Math.round(buyPrice * 0.15));
  if (buyPrice <= 15) return Math.max(1, Math.round(buyPrice * 0.12));
  if (buyPrice <= 40) return Math.max(1, Math.round(buyPrice * 0.10));
  if (buyPrice <= 80) return Math.max(1, Math.round(buyPrice * 0.08));
  return Math.max(1, Math.round(buyPrice * 0.06));
}

export function finalizeContract(negotiation: ContractNegotiation, currentSeason: number): Contract {
  return {
    salary: negotiation.offeredSalary,
    duration: negotiation.offeredDuration,
    satisfaction: negotiation.satisfaction,
    requiredSalary: negotiation.requiredSalary,
    startSeason: currentSeason,
    endSeason: currentSeason + negotiation.offeredDuration - 1,
  };
}

// ============================================
// CONTRACT WARNING SYSTEM
// ============================================

export function getContractSeasonsRemaining(contract: Contract, currentSeason: number): number {
  return contract.endSeason - currentSeason + 1;
}

export function isContractExpired(contract: Contract, currentSeason: number): boolean {
  // العقد ينتهي إذا الموسم الحالي أكبر من endSeason
  return currentSeason > contract.endSeason;
}

export function isContractLastSeason(contract: Contract, currentSeason: number): boolean {
  return contract.endSeason === currentSeason;
}

// يولّد أخبار تحذير العقود التي تنتهي قريباً
export function getContractWarningNews(
  ownedPlayers: OwnedPlayer[],
  currentSeason: number
): { playerName: string; ownerName: string; seasonsLeft: number }[] {
  const warnings: { playerName: string; ownerName: string; seasonsLeft: number }[] = [];
  for (const item of ownedPlayers) {
    const left = getContractSeasonsRemaining(item.contract, currentSeason);
    if (left === 1) {
      warnings.push({ playerName: item.player.name, ownerName: "", seasonsLeft: 1 });
    }
  }
  return warnings;
}

// ============================================
// OTHER HELPERS
// ============================================

export function totalContractCost(contract: Contract): number {
  return contract.salary * contract.duration;
}

export function calculateAnnualSalaries(owned: { contract: Contract }[]): number {
  return owned.reduce((sum, item) => sum + item.contract.salary, 0);
}

export function getContractStatusLabel(contract: Contract, currentSeason: number): string {
  const remaining = getContractSeasonsRemaining(contract, currentSeason);
  if (remaining <= 0) return "🔴 Expired";
  if (remaining === 1) return "🟡 Last Season";
  return `🟢 ${remaining} seasons left`;
}

export function canAffordSalary(budget: number, annualSalaries: number, newSalary: number, seasons: number = 1): boolean {
  return budget >= (annualSalaries + newSalary) * seasons;
}

export function getNegotiationHint(negotiation: ContractNegotiation): string {
  const { satisfaction, offeredSalary, requiredSalary, offeredDuration } = negotiation;
  const ratio = offeredSalary / requiredSalary;
  if (satisfaction >= 80) return "✅ Player is very happy with this offer!";
  if (satisfaction >= 60) return "🙂 Player is satisfied. Consider signing now.";
  if (ratio < 0.9) return "💰 Increase the salary to improve satisfaction.";
  if (offeredDuration > 3) return "📅 Try reducing the contract length.";
  if (satisfaction < 30) return "⚠️ Danger zone! Player may reject permanently.";
  return "🤝 Keep negotiating to find the right balance.";
}

export function getSalarySliderSteps(marketValue: number): number[] {
  const min = Math.max(1, Math.round(marketValue * 0.05));
  const max = Math.round(marketValue * 0.35);
  const steps: number[] = [];
  for (let v = min; v <= max; v += Math.max(1, Math.round(marketValue * 0.02))) {
    steps.push(v);
  }
  return steps;
}

export function contractSummary(contract: Contract): string {
  return `€${contract.salary}M/yr × ${contract.duration} yr = €${totalContractCost(contract)}M total`;
}