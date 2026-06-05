import type {
  ContractOffer,
} from "./types";

import {
  MAX_CONTRACT_YEARS,
  MIN_CONTRACT_YEARS,
  SALARY_PERCENT_MAX,
  SALARY_PERCENT_MIN,
} from "./constants";

import {
  clampNumber,
  randomBetween,
} from "./helpers";

export function createContractOffer(
  marketValue: number
): ContractOffer {
  const salaryPercent =
    randomBetween(
      SALARY_PERCENT_MIN,
      SALARY_PERCENT_MAX
    );

  const salary =
    Math.max(
      1,
      Math.round(
        (marketValue * salaryPercent) / 100
      )
    );

  const years =
    randomBetween(
      MIN_CONTRACT_YEARS,
      MAX_CONTRACT_YEARS
    );

  const satisfaction =
    calculateContractSatisfaction(
      marketValue,
      salary,
      years
    );

  return {
    salary,
    years,
    satisfaction,
    status: "pending",
  };
}

export function calculateContractSatisfaction(
  marketValue: number,
  salary: number,
  years: number
) {
  const minSalary =
    Math.max(
      1,
      Math.round(
        (marketValue * SALARY_PERCENT_MIN) / 100
      )
    );

  const maxSalary =
    Math.max(
      minSalary,
      Math.round(
        (marketValue * SALARY_PERCENT_MAX) / 100
      )
    );

  let satisfaction =
    Math.round(
      ((salary - minSalary) /
        Math.max(
          1,
          maxSalary - minSalary
        )) *
        100
    );

  if (years >= 4) {
    satisfaction += 10;
  }

  if (years <= 1) {
    satisfaction -= 10;
  }

  return clampNumber(
    satisfaction,
    0,
    100
  );
}

export function updateContractOffer(
  marketValue: number,
  salary: number,
  years: number
): ContractOffer {
  const safeYears =
    clampNumber(
      years,
      MIN_CONTRACT_YEARS,
      MAX_CONTRACT_YEARS
    );

  const safeSalary =
    Math.max(
      1,
      Math.round(salary)
    );

  return {
    salary: safeSalary,
    years: safeYears,
    satisfaction:
      calculateContractSatisfaction(
        marketValue,
        safeSalary,
        safeYears
      ),
    status: "pending",
  };
}

export function willAcceptContract(
  contract: ContractOffer
) {
  const minimumChance = 20;

  const acceptChance =
    Math.max(
      minimumChance,
      contract.satisfaction
    );

  return (
    randomBetween(1, 100) <=
    acceptChance
  );
}

export function acceptContract(
  contract: ContractOffer
): ContractOffer {
  return {
    ...contract,
    status: "accepted",
  };
}

export function rejectContract(
  contract: ContractOffer
): ContractOffer {
  return {
    ...contract,
    status: "rejected",
  };
}