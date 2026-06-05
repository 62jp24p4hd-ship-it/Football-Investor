"use client";

import type {
  OwnedPlayer,
} from "../game/types";

import {
  getPlayerSponsorText,
} from "../game/sponsorshipEngine";

type OwnedPlayerModalProps = {
  open: boolean;
  ownedPlayer: OwnedPlayer | null;
  currentValue: number;
  currentAge: number;
  sellChances: number;
  onSell: () => void;
  onClose: () => void;
};

function formatMoney(value: number) {
  return `€${Math.round(value)}M`;
}

export default function OwnedPlayerModal(
  props: OwnedPlayerModalProps
) {
  const {
    open,
    ownedPlayer,
    currentValue,
    currentAge,
    sellChances,
    onSell,
    onClose,
  } = props;

  if (!open || !ownedPlayer) {
    return null;
  }

  const profit =
    currentValue - ownedPlayer.buyPrice;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-red-500 rounded-2xl p-6 w-full max-w-2xl">

        <h2 className="text-3xl font-bold text-center mb-4">
          {ownedPlayer.player.name}
        </h2>

        <div className="grid md:grid-cols-2 gap-3 mb-6 text-sm">

          <div>
            Position: {ownedPlayer.player.position}
          </div>

          <div>
            Slot: {ownedPlayer.slot}
          </div>

          <div>
            Age: {currentAge}
          </div>

          <div>
            Bought: {formatMoney(ownedPlayer.buyPrice)}
          </div>

          <div>
            Current: {formatMoney(currentValue)}
          </div>

          <div
            className={
              profit >= 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            Profit / Loss: {formatMoney(profit)}
          </div>

          <div>
            Salary: {formatMoney(ownedPlayer.contract.salary)} / year
          </div>

          <div>
            Contract: {ownedPlayer.contract.years} years
          </div>

          <div>
            Sponsor: {getPlayerSponsorText(ownedPlayer)}
          </div>

          {ownedPlayer.player.sponsorship && (
            <div>
              Sponsor Income: {formatMoney(ownedPlayer.player.sponsorship.investorIncome)} / year
            </div>
          )}

        </div>

        <div className="text-center text-gray-400 mb-4">
          Sell Chances Left: {sellChances}
        </div>

        <div className="flex justify-center gap-4">

          <button
            onClick={onSell}
            disabled={sellChances <= 0}
            className="
              px-6
              py-3
              rounded-xl
              bg-red-700
              disabled:bg-zinc-700
              transition-all
              active:scale-95
            "
          >
            Sell Player
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-green-700 transition-all active:scale-95"
          >
            Keep Player
          </button>

        </div>

      </div>
    </div>
  );
}