import type {
  OwnedPlayer,
  SponsorshipDeal,
} from "./types";

import {
  INVESTOR_SHARE_MAX,
  INVESTOR_SHARE_MIN,
  MAX_SPONSORSHIP_YEARS,
  MIN_SPONSORSHIP_YEARS,
  SPONSOR_BRANDS,
} from "./constants";

import {
  pickRandom,
  randomBetween,
} from "./helpers";

export function createSponsorshipDeal(
  marketValue: number
): SponsorshipDeal {
  const totalValue =
    Math.max(
      1,
      Math.round(
        marketValue *
          randomBetween(20, 120) /
          100
      )
    );

  const investorSharePercent =
    randomBetween(
      INVESTOR_SHARE_MIN,
      INVESTOR_SHARE_MAX
    );

  const investorIncome =
    Math.round(
      (totalValue *
        investorSharePercent) /
        100
    );

  return {
    brand:
      pickRandom(
        SPONSOR_BRANDS
      ),
    totalValue,
    investorSharePercent,
    investorIncome,
    yearsLeft:
      randomBetween(
        MIN_SPONSORSHIP_YEARS,
        MAX_SPONSORSHIP_YEARS
      ),
    status: "active",
  };
}

export function tryGenerateSponsorship(
  marketValue: number
) {
  const chance =
    randomBetween(1, 100);

  if (chance > 18) {
    return null;
  }

  return createSponsorshipDeal(
    marketValue
  );
}

export function progressSponsorshipYear(
  deal: SponsorshipDeal
): SponsorshipDeal {
  const yearsLeft =
    deal.yearsLeft - 1;

  return {
    ...deal,
    yearsLeft,
    status:
      yearsLeft <= 0
        ? "expired"
        : "active",
  };
}

export function getPlayerSponsorIncome(
  player: OwnedPlayer
) {
  const deal =
    player.player.sponsorship;

  if (
    !deal ||
    deal.status !== "active"
  ) {
    return 0;
  }

  return deal.investorIncome;
}

export function getPlayerSponsorText(
  player: OwnedPlayer
) {
  const deal =
    player.player.sponsorship;

  if (
    !deal ||
    deal.status !== "active"
  ) {
    return "No Sponsor";
  }

  return `${deal.brand} (${deal.yearsLeft}Y)`;
}