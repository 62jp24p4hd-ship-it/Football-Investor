"use client";

import type {
  ContractOffer,
  Player,
} from "../game/types";

type ContractModalProps = {
  open: boolean;
  player: Player | null;
  marketValue: number;
  contract: ContractOffer | null;
  onChangeContract: (
    salary: number,
    years: number
  ) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

function formatMoney(value: number) {
  return `€${Math.round(value)}M`;
}

export default function ContractModal(
  props: ContractModalProps
) {
  const {
    open,
    player,
    marketValue,
    contract,
    onChangeContract,
    onConfirm,
    onCancel,
  } = props;

  if (!open || !player || !contract) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-green-500 rounded-2xl p-6 w-full max-w-2xl">

        <h2 className="text-3xl font-bold text-center mb-4">
          Contract Negotiation
        </h2>

        <div className="text-center mb-6">
          <div className="text-2xl font-bold">
            {player.name}
          </div>

          <div className="text-gray-400">
            Market Value: {formatMoney(marketValue)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">

          <div>
            <label className="block mb-2">
              Salary / Year
            </label>

            <input
              type="number"
              min={1}
              value={contract.salary}
              onChange={(event) =>
                onChangeContract(
                  Number(event.target.value),
                  contract.years
                )
              }
              className="w-full bg-black border border-zinc-700 rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block mb-2">
              Contract Years
            </label>

            <input
              type="number"
              min={1}
              max={5}
              value={contract.years}
              onChange={(event) =>
                onChangeContract(
                  contract.salary,
                  Number(event.target.value)
                )
              }
              className="w-full bg-black border border-zinc-700 rounded-xl p-3"
            />
          </div>

        </div>

        <div className="mb-6">
          <div className="mb-2">
            Player Satisfaction
          </div>

          <div className="h-5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`
                h-full
                ${
                  contract.satisfaction >= 75
                    ? "bg-green-500"
                    : contract.satisfaction >= 45
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }
              `}
              style={{
                width: `${contract.satisfaction}%`,
              }}
            />
          </div>

          <div className="text-center font-bold mt-2">
            {contract.satisfaction}%
          </div>
        </div>

        <div className="flex justify-center gap-4">

          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl bg-green-700 transition-all active:scale-95"
          >
            Offer Contract
          </button>

          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-red-700 transition-all active:scale-95"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}