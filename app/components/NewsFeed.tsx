"use client";

import type { NewsItem, SeasonEvent } from "../game/types";

// ── Custom player pixel portraits ──────────────
const PIXEL_PORTRAITS: Record<string, string> = {
  "Yousef Alnuwasser": "/images/yousef-pixel.png",
  "Hussain Alrezk":    "/images/hussain-alrezk.png",
  "ABDULLAH ALMUSAWI": "/images/abdullah-almusawi.png",
  "Ali Alsaif":        "/images/ali-alsaif.png",
  "Abdulaziz Alghariri": "/images/abdulaziz-alghariri.png",
  "Ali Albrahim":        "/images/ali-albrahim.png",
  "Florentino":        "/images/florentino-pixel.png",
  "ACL":               "/images/acl-injury-pixel.png",
  "Saudi":             "/images/saudi-offer-pixel.png",
  "Golden Boot":       "/images/golden-boot-pixel.png",
  "Ballon":            "/images/ballon-dor-pixel.png",
  "Golden Boy":        "/images/golden-boy-pixel.png",
  "Record Transfer":   "/images/record-transfer-pixel.png",
  "Wonderkid":         "/images/wonderkid-pixel.png",
  "Bob Paisley":       "/images/bob-paisley-pixel.png",
  "Paisley":           "/images/bob-paisley-pixel.png",
  "Fast Food":         "/images/fastfood-pixel.png",
  "Food Addiction":    "/images/fastfood-pixel.png",
  "YouTube":           "/images/youtube-viral-pixel.png",
  "Viral":             "/images/youtube-viral-pixel.png",
};

function getNewsPortrait(title: string): string | null {
  for (const [name, src] of Object.entries(PIXEL_PORTRAITS)) {
    if (title.includes(name)) return src;
  }
  return null;
}

function cleanTitle(title: string, hasPortrait: boolean): string {
  if (hasPortrait) {
    return title
      .replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\u{2B00}-\u{2BFF}⚠️💰🤕👑🔥📺🚀🏆🌟👟💸🚑🪑📉💔🍔🎰✈️🗣️💼🤝🎯💵💴💶]+\s*/gu, "")
      .trim();
  }
  return title.replace("👑 ", "");
}

type Props = {
  news: NewsItem[];
  seasonEvent: SeasonEvent | null;
  season: number;
};

function toneConfig(tone: string) {
  if (tone === "good") return {
    border: "border-emerald-500/70",
    bg: "rgba(6,78,59,0.25)",
    glow: "0 0 12px rgba(16,185,129,0.15)",
    dot: "bg-emerald-400",
    dotGlow: "shadow-emerald-400/80",
    titleColor: "#34d399",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  };
  if (tone === "bad") return {
    border: "border-red-500/70",
    bg: "rgba(127,29,29,0.25)",
    glow: "0 0 12px rgba(239,68,68,0.15)",
    dot: "bg-red-400",
    dotGlow: "shadow-red-400/80",
    titleColor: "#f87171",
    badge: "bg-red-500/20 text-red-300 border-red-500/40",
  };
  if (tone === "special") return {
    border: "border-purple-500/70",
    bg: "rgba(88,28,135,0.25)",
    glow: "0 0 12px rgba(168,85,247,0.2)",
    dot: "bg-purple-400",
    dotGlow: "shadow-purple-400/80",
    titleColor: "#c084fc",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  };
  return {
    border: "border-white/12",
    bg: "rgba(255,255,255,0.04)",
    glow: "none",
    dot: "bg-gray-500",
    dotGlow: "",
    titleColor: "#e5e7eb",
    badge: "bg-white/10 text-gray-400 border-white/15",
  };
}

function toneLabel(tone: string) {
  if (tone === "good") return "✅ Good";
  if (tone === "bad") return "🔴 Breaking";
  if (tone === "special") return "⭐ Special";
  return "📋 News";
}

export default function NewsFeed({ news, seasonEvent, season }: Props) {
  // Only show news from current season
  const currentNews = news.filter(item => item.season === season);

  return (
    <aside
      className="rounded-none overflow-hidden flex flex-col h-full"
      style={{
        background: "rgba(5,8,20,0.75)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "linear-gradient(90deg, rgba(16,185,129,0.12) 0%, transparent 60%)",
        }}
      >
        <div className="w-[3px] h-5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px #34d399" }} />
        <span className="font-black text-white text-sm tracking-wide">Football News</span>
        {currentNews.length > 0 && (
          <span
            className="ml-auto text-xs font-black px-2 py-0.5 rounded-full"
            style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            {currentNews.length}
          </span>
        )}
      </div>

      {/* Active Event */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="text-[9px] uppercase tracking-[0.2em] font-black mb-2"
          style={{ color: "#6b7280" }}
        >
          ⚡ Active Event
        </div>
        {seasonEvent ? (() => {
          const cfg = toneConfig(seasonEvent.tone);
          return (
            <div
              className={`border rounded-none p-3 ${cfg.border}`}
              style={{ background: cfg.bg, boxShadow: cfg.glow }}
            >
              <div className="font-black text-sm leading-tight mb-1" style={{ color: cfg.titleColor }}>
                {seasonEvent.title}
              </div>
              <div className="text-xs text-gray-300 leading-relaxed">{seasonEvent.description}</div>
              {seasonEvent.marketMultiplier && (
                <div
                  className="text-xs font-black mt-2 inline-block px-2 py-0.5 rounded-none"
                  style={{
                    background: seasonEvent.marketMultiplier > 1 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                    color: seasonEvent.marketMultiplier > 1 ? "#34d399" : "#f87171",
                    border: `1px solid ${seasonEvent.marketMultiplier > 1 ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                  }}
                >
                  Market ×{seasonEvent.marketMultiplier}
                </div>
              )}
            </div>
          );
        })() : (
          <div
            className="rounded-none p-3 text-xs text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#4b5563" }}
          >
            No active event this season
          </div>
        )}
      </div>

      {/* News list — current season only */}
      <div className="overflow-y-auto flex-1 p-3 space-y-2">
        {currentNews.length === 0 ? (
          <div className="text-center py-8" style={{ color: "#374151" }}>
            <div className="text-2xl mb-2">📭</div>
            <div className="text-xs">No news this season yet</div>
          </div>
        ) : (
          currentNews.map((item) => {
            const cfg = toneConfig(item.tone);
            return (
              <div
                key={item.id}
                className={`border rounded-none p-3 transition-all ${cfg.border}`}
                style={{
                  background: cfg.bg,
                  boxShadow: cfg.glow,
                  animation: "slideInNews 0.35s ease-out both",
                }}
              >
                {/* Badge + Season */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-none border ${cfg.badge}`}
                  >
                    {toneLabel(item.tone)}
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: "#4b5563" }}>{item.season}</span>
                </div>

                {/* Title */}
                <div className="flex items-start gap-1.5 mb-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 shadow-sm ${cfg.dot} ${cfg.dotGlow}`}
                  />
                  <div className="font-black text-sm leading-tight flex items-center gap-2" style={{ color: cfg.titleColor }}>
                    {getNewsPortrait(item.title) && (
                      <img
                        src={getNewsPortrait(item.title)!}
                        alt=""
                        width={36}
                        height={36}
                        style={{ imageRendering: "pixelated", objectFit: "contain", flexShrink: 0 }}
                      />
                    )}
                    {cleanTitle(item.title, !!getNewsPortrait(item.title))}
                  </div>
                </div>

                {/* Description */}
                <div className="text-xs text-gray-300 leading-relaxed pl-3">{item.description}</div>

                {/* Journalist */}
                {item.journalist && (
                  <div className="text-[10px] mt-1.5 pl-3" style={{ color: "#4b5563" }}>
                    ✍️ {item.journalist} · {item.source}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes slideInNews {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </aside>
  );
}
