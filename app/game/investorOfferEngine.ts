import type {
  GamePlayer,
  InvestorOfferState,
  Player,
} from "./types";

import {
  pickRandom,
  shuffle,
} from "./helpers";

export function createInvestorOfferValue(
  marketValue: number
) {
  const minOffer =
    Math.max(
      1,
      Math.round(marketValue * 0.7)
    );

  const maxOffer =
    Math.max(
      minOffer,
      Math.round(marketValue * 1.7)
    );

  return (
    Math.floor(
      Math.random() *
        (maxOffer - minOffer + 1)
    ) + minOffer
  );
}

export function getInvestorOfferCandidates(
  playerPool: Player[],
  season: number,
  players: GamePlayer[]
) {
  const ownedNames =
    new Set(
      players.flatMap((gamePlayer) =>
        gamePlayer.owned.map(
          (owned) => owned.player.name
        )
      )
    );

  return shuffle(
    playerPool.filter(
      (player) =>
        player.availableSeason === season &&
        !ownedNames.has(player.name)
    )
  ).slice(0, 3);
}

export function createInvestorOfferState(
  playerPool: Player[],
  season: number,
  players: GamePlayer[],
  targetPlayerIndex: number,
  getValue: (player: Player) => number
): InvestorOfferState | null {
  const candidates =
    getInvestorOfferCandidates(
      playerPool,
      season,
      players
    );

  if (candidates.length === 0) {
    return null;
  }

  const selectedPlayer =
    pickRandom(candidates);

  const marketValue =
    getValue(selectedPlayer);

  const offerValue =
    createInvestorOfferValue(
      marketValue
    );

  return {
    targetPlayerIndex,
    selectedPlayer,
    marketValue,
    offerValue,
  };
}

export function canAffordInvestorOffer(
  offer: InvestorOfferState,
  player: GamePlayer
) {
  return player.budget >= offer.offerValue;
}

export function getInvestorOfferProfitText(
  offer: InvestorOfferState
) {
  const difference =
    offer.offerValue -
    offer.marketValue;

  if (difference > 0) {
    return `Above market by €${difference}M`;
  }

  if (difference < 0) {
    return `Below market by €${Math.abs(difference)}M`;
  }

  return "Fair market value";
}

export function getInvestorOfferTone(
  offer: InvestorOfferState
) {
  const ratio =
    offer.offerValue /
    offer.marketValue;

  if (ratio <= 0.85) {
    return "good";
  }

  if (ratio >= 1.35) {
    return "bad";
  }

  return "neutral";
}

export function getInvestorOfferMessage(
  offer: InvestorOfferState
) {
  const tone =
    getInvestorOfferTone(offer);

  if (tone === "good") {
    return "This looks like a bargain.";
  }

  if (tone === "bad") {
    return "This offer is expensive.";
  }

  return "This is a balanced offer.";
}