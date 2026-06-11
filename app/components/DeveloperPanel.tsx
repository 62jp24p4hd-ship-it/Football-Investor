"use client";

import { useRef, useState } from "react";
import type { DevEventId } from "../game/types";

type Props = {
  onTrigger: (eventId: DevEventId) => void;
  onClose: () => void;
};

// Pixel art images for events that have animations
// Non-DevEventId entries handled separately
const SPECIAL_PIXEL_IMAGES: Record<string, string> = {
  yousefCard: "/images/yousef-pixel.png",
};

const EVENT_PIXEL_IMAGES: Partial<Record<DevEventId, string>> = {
  florentinoPerez: "/images/florentino-pixel.png",
  aclInjury:       "/images/acl-injury-pixel.png",
  saudiOffer:      "/images/saudi-offer-pixel.png",
  goldenBoot:      "/images/golden-boot-pixel.png",
  ballonDor:           "/images/ballon-dor-pixel.png",
  goldenBoy:           "/images/golden-boy-pixel.png",
  recordTransfer:      "/images/record-transfer-pixel.png",
  wonderkid:           "/images/wonderkid-pixel.png",
  hotMarket:           "/images/hot-market-pixel.png",
  oneSeasonWonder:     "/images/one-season-wonder-pixel.png",
  casinoNight:         "/images/casino-night-pixel.png",
  marketCrash:         "/images/market-crash-pixel.png",
  failedTransfer:      "/images/failed-transfer-pixel.png",
  benchWarmer:         "/images/bench-warmer-pixel.png",
  breakupSeason:       "/images/breakup-season-pixel.png",
  freeTransfer:        "/images/free-transfer-pixel.png",
  majorInjury:         "/images/major-injury-pixel.png",
  bobPaisleyDisaster:  "/images/bob-paisley-pixel.png",
  fastFoodAddiction:   "/images/fastfood-pixel.png",
  youTubeViral:        "/images/youtube-viral-pixel.png",
};

const DEV_EVENTS: { id: DevEventId | string; label: string; type: "positive" | "negative" | "special" }[] = [
  { id: "hotMarket",         label: "🔥 Hot Market",            type: "positive" },
  { id: "ballonDor",         label: "🏆 Ballon d'Or",           type: "positive" },
  { id: "goldenBoy",         label: "🌟 Golden Boy",            type: "positive" },
  { id: "goldenBoot",        label: "👟 Golden Boot",           type: "positive" },
  { id: "wonderkid",         label: "🚀 Wonderkid",             type: "positive" },
  { id: "oneSeasonWonder",   label: "🎯 One Season Wonder",     type: "positive" },
  { id: "youTubeViral",      label: "📺 YouTube Goes Viral",    type: "positive" },
  { id: "saudiOffer",        label: "💰 Saudi Offer",           type: "positive" },
  { id: "recordTransfer",    label: "💸 Record Transfer",       type: "positive" },
  { id: "aclInjury",         label: "ACL Injury",               type: "negative" },
  { id: "majorInjury",       label: "🚑 Major Injury",          type: "negative" },
  { id: "benchWarmer",       label: "🪑 Bench Warmer",          type: "negative" },
  { id: "failedTransfer",    label: "📉 Failed Transfer",       type: "negative" },
  { id: "freeTransfer",      label: "💔 Free Transfer",         type: "negative" },
  { id: "fastFoodAddiction", label: "🍔 Fast Food Addiction",   type: "negative" },
  { id: "breakupSeason",     label: "💔 Breakup Season",        type: "negative" },
  { id: "casinoNight",       label: "🎰 Casino Night",          type: "negative" },
  { id: "marketCrash",       label: "📉 Market Crash",          type: "negative" },
  { id: "retirement",        label: "👋 Retirement Check",      type: "special"  },
  { id: "investorOffer",     label: "💼 Investor Offer",        type: "special"  },
  { id: "legendaryAuction",  label: "🏆 Legendary Auction",    type: "special"  },
  { id: "sponsorshipOffer",  label: "🤝 Sponsorship Offer",    type: "special"  },
  { id: "florentinoPerez",   label: "Florentino Perez",         type: "special"  },
  { id: "bobPaisleyDisaster",label: "✈️ Bob Paisley Disaster",  type: "special"  },
  { id: "dreamSeason",       label: "🔥 Dream Season",          type: "special"  },
  { id: "lockerRoomDrama",   label: "🗣️ Locker Room Drama",    type: "special"  },
  { id: "yousefCard",        label: "Yousef Alnuwasser",          type: "special"  },
];

export default function DeveloperPanel({ onTrigger, onClose }: Props) {
  const [pos, setPos] = useState({ x: Math.max(0, window.innerWidth - 560), y: 80 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.current) return;
    setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  }

  function onMouseUp() {
    dragging.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  return (
    <div
      className="fixed z-50 overflow-hidden shadow-2xl shadow-purple-500/10"
      style={{
        left: pos.x,
        top: pos.y,
        width: "520px",
        background: "#0a0f14",
        border: "1px solid rgba(168,85,247,0.4)",
        userSelect: "none",
      }}
    >
      {/* Header — drag handle */}
      <div
        onMouseDown={onMouseDown}
        className="px-5 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
        style={{
          borderBottom: "1px solid rgba(168,85,247,0.2)",
          background: "rgba(88,28,135,0.3)",
        }}
      >
        <div>
          <div className="font-black text-purple-300 text-base">⚙️ Developer Panel</div>
          <div className="text-[11px] text-purple-500">Trigger any event manually</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-purple-600 select-none">⠿ drag</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-none bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition-all flex items-center justify-center"
          >
            ×
          </button>
        </div>
      </div>

      {/* Events list */}
      <div className="p-4 max-h-[70vh] overflow-y-auto">
        {["positive", "negative", "special"].map((type) => (
          <div key={type} className="mb-3">
            <div
              className="text-[10px] uppercase tracking-widest px-1 py-1.5 font-black"
              style={{
                color: type === "positive" ? "#34d399" : type === "negative" ? "#f87171" : "#c084fc",
              }}
            >
              {type === "positive" ? "✅ Positive" : type === "negative" ? "❌ Negative" : "⭐ Special"}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {DEV_EVENTS.filter((e) => e.type === type).map((event) => (
                <button
                  key={event.id}
                  onClick={() => onTrigger(event.id as DevEventId)}
                  className={`text-left px-3 py-2.5 text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 ${
                    type === "positive"
                      ? "bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/20"
                      : type === "negative"
                      ? "bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/20"
                      : "bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/20"
                  }`}
                >
                  {(EVENT_PIXEL_IMAGES[event.id as DevEventId] || SPECIAL_PIXEL_IMAGES[event.id]) ? (
                    <img
                      src={EVENT_PIXEL_IMAGES[event.id as DevEventId] || SPECIAL_PIXEL_IMAGES[event.id]}
                      alt=""
                      width={22}
                      height={22}
                      style={{ imageRendering: "pixelated", objectFit: "contain", flexShrink: 0 }}
                    />
                  ) : null}
                  <span className="leading-tight">{event.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
