// ============================================
// FOOTBALL INVESTOR 1.8 - CONTRACT ENGINE
// ============================================

import type { Contract, ContractNegotiation, Player } from "./types";
import { clamp, randomBetween, randomFloat } from "./helpers";
import {
  MIN_SALARY_PERCENT,
  MAX_SALARY_PERCENT,
  MIN_CONTRACT_YEARS,
  MAX_CONTRACT_YEARS,
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
  let satisfaction = 50; // base

  // Salary ratio
  const salaryRatio = offeredSalary / requiredSalary;
  if (salaryRatio >= 1.3) satisfaction += 40;
  else if (salaryRatio >= 1.1) satisfaction += 25;
  else if (salaryRatio >= 1.0) satisfaction += 15;
  else if (salaryRatio >= 0.85) satisfaction -= 10;
  else if (salaryRatio >= 0.7) satisfaction -= 25;
  else satisfaction -= 40;

  // Duration preference (players prefer 2-3 years)
  if (offeredDuration === 2 || offeredDuration === 3) {
    satisfaction += 10;
  } else if (offeredDuration === 1) {
    satisfaction -= 5; // too short
  } else if (offeredDuration === 4) {
    satisfaction -= 8;
  } else if (offeredDuration === 5) {
    satisfaction -= 15; // too long for player
  }

  // High value players are harder to satisfy
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
  const defaultSalary = requiredSalary;
  const defaultDuration = 2;

  const satisfaction = calculateSatisfaction(
    defaultSalary,
    requiredSalary,
    defaultDuration,
    marketValue
  );

  return {
    player,
    slot,
    offeredSalary: defaultSalary,
    offeredDuration: defaultDuration,
    satisfaction,
    requiredSalary,
    marketValue,
    timer: CONTRACT_TIMER_SECONDS,
    attempts: 0,
  };
}

// ============================================
// UPDATE NEGOTIATION OFFER
// ============================================

export function updateOffer(
  negotiation: ContractNegotiation,
  newSalary: number,
  newDuration: number
): ContractNegotiation {
  const satisfaction = calculateSatisfaction(
    newSalary,
    negotiation.requiredSalary,
    newDuration,
    negotiation.marketValue
  );

  return {
    ...negotiation,
    offeredSalary: newSalary,
    offeredDuration: newDuration,
    satisfaction,
    attempts: negotiation.attempts + 1,
  };
}

// ============================================
// CHECK IF PLAYER REJECTS
// ============================================

export function isRejected(negotiation: ContractNegotiation): boolean {
  return negotiation.satisfaction < PLAYER_SATISFACTION_REJECT_THRESHOLD;
}

// ============================================
// FINALIZE CONTRACT
// ============================================

export function finalizeContract(
  negotiation: ContractNegotiation,
  currentSeason: number
): Contract {
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
// TOTAL CONTRACT COST
// ============================================

export function totalContractCost(contract: Contract): number {
  return contract.salary * contract.duration;
}

// ============================================
// ANNUAL SALARY BURDEN
// ============================================

export function calculateAnnualSalaries(
  owned: { contract: Contract }[]
): number {
  return owned.reduce((sum, item) => sum + item.contract.salary, 0);
}

// ============================================
// CONTRACT STATUS LABEL
// ============================================

export function getContractStatusLabel(
  contract: Contract,
  currentSeason: number
): string {
  const remaining = contract.endSeason - currentSeason + 1;
  if (remaining <= 0) return "🔴 Expired";
  if (remaining === 1) return "🟡 Last Season";
  return `🟢 ${remaining} seasons left`;
}

// ============================================
// SALARY AFFORDABILITY
// ============================================

export function canAffordSalary(
  budget: number,
  annualSalaries: number,
  newSalary: number,
  seasons: number = 1
): boolean {
  return budget >= (annualSalaries + newSalary) * seasons;
}

// ============================================
// NEGOTIATION HINTS
// ============================================

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

// ============================================
// CONTRACT SUMMARY TEXT
// ============================================

export function contractSummary(contract: Contract): string {
  return `€${contract.salary}M/yr × ${contract.duration} yr = €${totalContractCost(contract)}M total`;
}