"use client";

import type {
  InvestorOfferState,
} from "../game/types";

type InvestorOfferModalProps = {
  open: boolean;
  offer: InvestorOfferState | null;
  teamName: string;
  onAccept: () => void;
  onReject: () => void;
};

function formatMoney(
  value: number
) {
  return `€${Math.round(value)}M`;
}

export default function InvestorOfferModal(
  props: InvestorOfferModalProps
) {
  const {
    open,
    offer,
    teamName,
    onAccept,
    onReject,
  } = props;

  if (!open || !offer) {
    return null;
  }

  const difference =
    offer.offerValue -
    offer.marketValue;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

      <div className="bg-zinc-950 border border-green-500 rounded-2xl p-6 w-full max-w-2xl">

        <h2 className="text-3xl font-bold text-center mb-4">
          💼 Investor Offer
        </h2>

        <div className="text-center mb-6">

          <div className="text-2xl font-bold">
            {offer.selectedPlayer.name}
          </div>

          <div className="text-gray-400">
            Team: {teamName}
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="bg-black/40 rounded-xl p-4 text-center">
            <div className="text-gray-400 mb-2">
              Market Value
            </div>

            <div className="text-yellow-300 text-2xl font-bold">
              {formatMoney(
                offer.marketValue
              )}
            </div>
          </div>

          <div className="bg-black/40 rounded-xl p-4 text-center">
            <div className="text-gray-400 mb-2">
              Investor Price
            </div>

            <div className="text-green-400 text-2xl font-bold">
              {formatMoney(
                offer.offerValue
              )}
            </div>
          </div>

        </div>

        <div className="text-center mb-6">

          <div
            className={`text-xl font-bold ${
              difference >= 0
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {difference >= 0
              ? "+"
              : ""}
            {formatMoney(
              difference
            )}
          </div>

          <div className="text-gray-400 mt-2">
            {difference < 0
              ? "Great Deal"
              : difference > 0
              ? "Expensive Deal"
              : "Fair Deal"}
          </div>

        </div>

        <div className="flex justify-center gap-4">

          <button
            onClick={onAccept}
            className="
              px-6
              py-3
              rounded-xl
              bg-green-700
              transition-all
              duration-150
              active:scale-95
            "
          >
            Accept
          </button>

          <button
            onClick={onReject}
            className="
              px-6
              py-3
              rounded-xl
              bg-red-700
              transition-all
              duration-150
              active:scale-95
            "
          >
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}