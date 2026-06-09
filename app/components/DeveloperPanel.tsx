"use client";

import type { DevEventId } from "../game/types";

type Props = {
  onTrigger: (eventId: DevEventId) => void;
  onClose: () => void;
};

const DEV_EVENTS: { id: DevEventId; label: string; type: "positive" | "negative" | "special" }[] = [
  { id: "hotMarket", label: "🔥 Hot Market", type: "positive" },
  { id: "ballonDor", label: "🏆 Ballon d'Or", type: "positive" },
  { id: "goldenBoy", label: "🌟 Golden Boy", type: "positive" },
  { id: "goldenBoot", label: "👟 Golden Boot", type: "positive" },
  { id: "wonderkid", label: "🚀 Wonderkid", type: "positive" },
  { id: "saudiOffer", label: "💰 Saudi Offer", type: "positive" },
  { id: "recordTransfer", label: "💸 Record Transfer", type: "positive" },
  { id: "aclInjury", label: "🤕 ACL Injury", type: "negative" },
  { id: "majorInjury", label: "🚑 Major Injury", type: "negative" },
  { id: "benchWarmer", label: "🪑 Bench Warmer", type: "negative" },
  { id: "failedTransfer", label: "📉 Failed Transfer", type: "negative" },
  { id: "freeTransfer", label: "💔 Free Transfer", type: "negative" },
  { id: "marketCrash", label: "📉 Market Crash", type: "negative" },
  { id: "retirement", label: "👋 Retirement Check", type: "special" },
  { id: "investorOffer", label: "💼 Investor Offer", type: "special" },
  { id: "legendaryAuction", label: "🏆 Legendary Auction", type: "special" },
  { id: "sponsorshipOffer", label: "🤝 Sponsorship Offer", type: "special" },
  { id: "florentinoPerez", label: "👑 Florentino Perez", type: "special" },
];

export default function DeveloperPanel({ onTrigger, onClose }: Props) {
  return (
    <div className="fixed top-20 right-4 w-72 bg-[#0a0f14] border border-purple-500/40 rounded-none z-50 overflow-hidden shadow-2xl shadow-purple-500/10">

      <div className="px-4 py-3 border-b border-purple-500/20 flex items-center justify-between bg-purple-950/30">
        <div>
          <div className="font-black text-purple-300 text-sm">⚙️ Developer Panel</div>
          <div className="text-[10px] text-purple-500">Trigger any event manually</div>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-none bg-red-700 hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center justify-center"
        >
          ×
        </button>
      </div>

      <div className="p-3 space-y-1 max-h-[500px] overflow-y-auto">
        {["positive", "negative", "special"].map((type) => (
          <div key={type}>
            <div className="text-[10px] uppercase tracking-widest text-gray-600 px-1 py-1.5">
              {type === "positive" ? "✅ Positive" : type === "negative" ? "❌ Negative" : "⭐ Special"}
            </div>
            {DEV_EVENTS.filter((e) => e.type === type).map((event) => (
              <button
                key={event.id}
                onClick={() => onTrigger(event.id)}
                className={`w-full text-left px-3 py-2 rounded-none text-sm transition-all hover:scale-[1.01] active:scale-95 mb-1 ${
                  type === "positive"
                    ? "bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/20"
                    : type === "negative"
                    ? "bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/20"
                    : "bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-500/20"
                }`}
              >
                {event.label}
              </button>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}