"use client";

type Props = {
  onClose: () => void;
};

const SECTIONS = [
  {
    title: "🎯 Objective",
    content: "Build the most valuable football empire by 2028. Buy players, develop them, sell at the right time, and manage your budget wisely.",
  },
  {
    title: "⚽ Building Your Squad",
    content: "Click any position slot to open the player market. You get limited purchase chances per season — use them wisely! Each player has a hidden type: Talent (grows fast), Normal (steady), or Trap (looks good, disappoints).",
  },
  {
    title: "📝 Contracts",
    content: "Players don't come free — negotiate salary and contract duration. Keep player satisfaction above 20% or they'll reject your offer. You have 60 seconds per negotiation.",
  },
  {
    title: "💰 Selling",
    content: "Sell players when their value peaks. Selling for €20M+ unlocks a Freeze Card, €40M+ unlocks Triple Buy, €50M+ unlocks Steal Card. Selling over €100M lets you choose a special event.",
  },
  {
    title: "📈 Market Events",
    content: "Every season brings random events: Hot Market (values +20%), Market Crash (values -20%), player injuries, awards, Saudi offers, and more. Adapt your strategy accordingly.",
  },
  {
    title: "🎴 Special Cards",
    content: "🧊 Freeze: Block your opponent for 1 season | ⚡ Triple Buy: Get 3 purchase chances next season | 🕵️ Steal: Swap one of your players with your opponent's.",
  },
  {
    title: "🏆 Winning",
    content: "The player with the highest net worth (budget + portfolio value) at the end of the game wins. Manage salaries and sponsorships to maximize your financial position.",
  },
  {
    title: "💼 Economy",
    content: "Players have annual salaries — these are deducted each season. Sponsorships (Nike, Adidas, etc.) provide annual income. Monitor your Financial Dashboard to stay profitable.",
  },
];

export default function HowToPlayModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f14] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">

        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">📖 How To Play</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-sm"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          {SECTIONS.map((section, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <div className="font-black text-white mb-2">{section.title}</div>
              <div className="text-sm text-gray-300 leading-relaxed">{section.content}</div>
            </div>
          ))}

          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4 text-center">
            <div className="text-emerald-400 font-black mb-1">💡 Pro Tip</div>
            <div className="text-sm text-gray-300">
              Buy young talents (age 17-21) early — their value multiplier is highest. Sell veterans before age 30 to avoid retirement losses.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}