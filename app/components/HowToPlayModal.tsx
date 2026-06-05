"use client";

type HowToPlayModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function HowToPlayModal(
  props: HowToPlayModalProps
) {
  const { open, onClose } = props;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-blue-500 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            📖 How To Play
          </h2>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-red-700 transition-all active:scale-95"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 text-gray-200">
          <section>
            <h3 className="text-xl font-bold mb-2">🎯 Goal</h3>
            <p>
              Buy players, manage contracts and sponsorships, sell at the right time,
              and finish with the best profit.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">🔁 Turns</h3>
            <p>
              In versus mode, turns alternate between Team 1 and Team 2. The starter
              also flips every season.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">🛒 Buying</h3>
            <p>
              Each team starts every season with 1 buy chance. Selling at least one
              player gives +1 extra buy chance once per season.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">💰 Selling</h3>
            <p>
              Each team starts every season with 3 sell chances. Extra Sell Card
              increases sell chances to 6.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">📋 Contracts</h3>
            <p>
              Players can accept or reject contracts based on salary, years, and
              satisfaction.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">🤝 Sponsorships</h3>
            <p>
              Some players sign sponsorship deals. You earn a yearly investor share
              from active deals.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">🏆 Auction</h3>
            <p>
              Legendary Auction uses turn-based bidding. Each bid adds €5M. Players
              cannot bid twice in a row.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">🎴 Cards</h3>
            <p>
              Special cards have a 5-season cooldown. Freeze Card is removed in v1.8.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}