"use client";

import { useEffect, useRef, useState } from "react";
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
  "Hot Market":        "/images/hot-market-pixel.png",
  "Hot Transfer":      "/images/hot-market-pixel.png",
  "One Season Wonder": "/images/one-season-wonder-pixel.png",
  "Casino":            "/images/casino-night-pixel.png",
  "Market Crash":      "/images/market-crash-pixel.png",
  "Failed Transfer":   "/images/failed-transfer-pixel.png",
  "Bench Warmer":      "/images/bench-warmer-pixel.png",
  "Breakup":           "/images/breakup-season-pixel.png",
  "Free Transfer":     "/images/free-transfer-pixel.png",
  "Major Injury":      "/images/major-injury-pixel.png",
  "Heart Attack":      "/images/eriksen-pixel.png",
  "Doping Ban":        "/images/doping-ban-pixel.png",
  "Girls Magnet":      "/images/girls-magnet-pixel.png",
  "Racist Attack":     "/images/racism-attack-pixel.png",
  "Club Legend":       "/images/club-legend-pixel.png",
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

const TONE = {
  good: {
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.35)",
    titleColor: "#34d399",
    badge: "GOOD",
    badgeBg: "rgba(16,185,129,0.2)",
    badgeColor: "#34d399",
    special: false,
  },
  bad: {
    accent: "#ef4444",
    accentDim: "rgba(239,68,68,0.12)",
    accentBorder: "rgba(239,68,68,0.35)",
    titleColor: "#f87171",
    badge: "BREAKING",
    badgeBg: "rgba(239,68,68,0.2)",
    badgeColor: "#f87171",
    special: false,
  },
  special: {
    accent: "#a855f7",
    accentDim: "rgba(168,85,247,0.12)",
    accentBorder: "rgba(168,85,247,0.35)",
    titleColor: "#c084fc",
    badge: "SPECIAL",
    badgeBg: "rgba(168,85,247,0.2)",
    badgeColor: "#c084fc",
    special: false,
  },
  neutral: {
    accent: "#64748b",
    accentDim: "rgba(255,255,255,0.04)",
    accentBorder: "rgba(255,255,255,0.1)",
    titleColor: "#e2e8f0",
    badge: "NEWS",
    badgeBg: "rgba(255,255,255,0.08)",
    badgeColor: "#94a3b8",
    special: false,
  },
  league_title: {
    accent: "#fbbf24",
    accentDim: "rgba(251,191,36,0.15)",
    accentBorder: "rgba(251,191,36,0.5)",
    titleColor: "#fbbf24",
    badge: "🏆 TITLE",
    badgeBg: "rgba(251,191,36,0.2)",
    badgeColor: "#fbbf24",
    special: true,
  },
  relegated: {
    accent: "#dc2626",
    accentDim: "rgba(220,38,38,0.15)",
    accentBorder: "rgba(220,38,38,0.6)",
    titleColor: "#f87171",
    badge: "📉 RELEGATED",
    badgeBg: "rgba(220,38,38,0.2)",
    badgeColor: "#f87171",
    special: true,
  },
  cl_champion: {
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.15)",
    accentBorder: "rgba(251,191,36,0.6)",
    titleColor: "#fbbf24",
    badge: "👑 UCL",
    badgeBg: "rgba(59,130,246,0.2)",
    badgeColor: "#93c5fd",
    special: true,
  },
};

function getTone(t: string) {
  return TONE[t as keyof typeof TONE] ?? TONE.neutral;
}

// ── Special epic card for title / relegation / cl win ──
function EpicNewsCard({ item, isNewest, isNew }: { item: NewsItem; isNewest: boolean; isNew: boolean }) {
  const tone = item.tone;
  const isTitle = tone === "league_title";
  const isCL = tone === "cl_champion";
  const isRelegated = tone === "relegated";

  const bg = isTitle
    ? "linear-gradient(135deg, rgba(120,80,0,0.7) 0%, rgba(40,30,0,0.95) 100%)"
    : isCL
    ? "linear-gradient(135deg, rgba(0,20,80,0.85) 0%, rgba(10,10,40,0.98) 100%)"
    : "linear-gradient(135deg, rgba(80,0,0,0.7) 0%, rgba(30,10,10,0.95) 100%)";

  const borderColor = isTitle ? "#fbbf24" : isCL ? "#3b82f6" : "#dc2626";
  const glow = isTitle
    ? "0 0 30px rgba(251,191,36,0.4), 0 4px 16px rgba(0,0,0,0.6)"
    : isCL
    ? "0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(251,191,36,0.15), 0 4px 16px rgba(0,0,0,0.6)"
    : "0 0 30px rgba(220,38,38,0.4), 0 4px 16px rgba(0,0,0,0.6)";

  const emoji = isTitle ? "🏆" : isCL ? "👑" : "📉";
  const accentColor = isTitle ? "#fbbf24" : isCL ? "#93c5fd" : "#f87171";
  const titleColor = isTitle || isCL ? "#fbbf24" : "#f87171";

  return (
    <div
      style={{
        borderRadius: 10,
        overflow: "hidden",
        border: `1.5px solid ${borderColor}`,
        background: bg,
        boxShadow: glow,
        animation: isNewest && isNew ? "epicSlideIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" : undefined,
        position: "relative",
      }}
    >
      {/* Shimmer overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: isTitle
          ? "linear-gradient(105deg, transparent 40%, rgba(251,191,36,0.08) 50%, transparent 60%)"
          : isCL
          ? "linear-gradient(105deg, transparent 40%, rgba(59,130,246,0.08) 50%, transparent 60%)"
          : "none",
        animation: isTitle || isCL ? "shimmerSlide 3s ease-in-out infinite" : "none",
        pointerEvents: "none",
      }} />

      {/* Stars (title/CL only) */}
      {(isTitle || isCL) && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${(i * 137) % 100}%`,
              top: `${(i * 73) % 100}%`,
              width: 2, height: 2, borderRadius: "50%",
              background: isTitle ? "#fbbf24" : "#93c5fd",
              opacity: 0,
              animation: `starTwinkle 2s ease-in-out ${i * 0.3}s infinite alternate`,
            }} />
          ))}
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, padding: "12px 14px" }}>
        {/* Badge row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{
            fontSize: 9, fontWeight: 900, letterSpacing: "0.12em",
            background: isTitle ? "rgba(251,191,36,0.2)" : isCL ? "rgba(59,130,246,0.2)" : "rgba(220,38,38,0.2)",
            color: accentColor,
            padding: "2px 7px", borderRadius: 3,
            border: `1px solid ${borderColor}55`,
          }}>
            {isTitle ? "🏆 LEAGUE TITLE" : isCL ? "👑 CHAMPIONS LEAGUE" : "📉 RELEGATED"}
          </span>
          {isNewest && (
            <span style={{
              fontSize: 8, fontWeight: 900, color: "#dc2626",
              letterSpacing: "0.1em",
              animation: "newBlink 1s step-end 3",
            }}>● NEW</span>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            fontSize: 28,
            filter: isTitle ? "drop-shadow(0 0 8px rgba(251,191,36,0.8))" : isCL ? "drop-shadow(0 0 8px rgba(59,130,246,0.8))" : "none",
            animation: (isTitle || isCL) ? "epicEmoji 2s ease-in-out infinite alternate" : "none",
            flexShrink: 0,
          }}>
            {emoji}
          </div>
          <div>
            <div style={{
              color: titleColor,
              fontWeight: 900,
              fontSize: 13,
              lineHeight: 1.3,
              marginBottom: 4,
              textShadow: isTitle || isCL ? `0 0 16px ${borderColor}88` : "none",
            }}>
              {item.title}
            </div>
            <div style={{ color: "#64748b", fontSize: 10.5, lineHeight: 1.4 }}>
              {item.description}
            </div>
          </div>
        </div>

        {/* Bottom glow line */}
        <div style={{
          height: 1.5,
          marginTop: 10,
          background: isTitle
            ? "linear-gradient(to right, transparent, #fbbf24, transparent)"
            : isCL
            ? "linear-gradient(to right, transparent, #3b82f6, #fbbf24, transparent)"
            : "linear-gradient(to right, transparent, #dc2626, transparent)",
          boxShadow: `0 0 6px ${borderColor}`,
        }} />
      </div>
    </div>
  );
}

// Scrolling ticker
function NewsTicker({ items }: { items: NewsItem[] }) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const text = items.map(i => `${i.title}  ·  `).join("  ///  ");
  if (items.length === 0) return null;

  return (
    <div style={{
      borderTop: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(0,0,0,0.4)",
      overflow: "hidden",
      height: 28,
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    }}>
      <div style={{
        background: "#dc2626",
        color: "#fff",
        fontSize: 9,
        fontWeight: 900,
        padding: "0 8px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        letterSpacing: "0.1em",
        flexShrink: 0,
      }}>
        LIVE
      </div>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div
          ref={tickerRef}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            color: "#94a3b8",
            fontSize: 10,
            fontWeight: 600,
            animation: `tickerScroll ${Math.max(12, text.length * 0.12)}s linear infinite`,
            paddingLeft: "100%",
          }}
        >
          {text}
        </div>
      </div>
      <style>{`
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

const MAX_NEWS = 5;

export default function NewsFeed({ news, seasonEvent, season }: Props) {
  const currentNews = news.filter(item => item.season === season);
  // News is already newest-first (addNewsItem prepends). Just take top 5.
  const visibleNews = currentNews.slice(0, MAX_NEWS);

  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevCountRef = useRef(currentNews.length);

  // Detect new arrivals for flash animation
  useEffect(() => {
    if (currentNews.length > prevCountRef.current && currentNews.length > 0) {
      const latest = currentNews[currentNews.length - 1];
      setNewIds(prev => new Set([...prev, String(latest.id)]));
      setTimeout(() => {
        setNewIds(prev => {
          const next = new Set(prev);
          next.delete(String(latest.id));
          return next;
        });
      }, 1800);
    }
    prevCountRef.current = currentNews.length;
  }, [currentNews.length]);

  return (
    <aside
      className="rounded-none overflow-hidden flex flex-col h-full"
      style={{
        background: "rgba(5,8,20,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* ── Header ── */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(90deg, rgba(220,38,38,0.14) 0%, transparent 70%)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
      }}>
        {/* Red pulsing live dot */}
        <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#dc2626",
            boxShadow: "0 0 6px #dc2626",
          }} />
          <div style={{
            position: "absolute", inset: -3,
            borderRadius: "50%",
            border: "1.5px solid rgba(220,38,38,0.5)",
            animation: "livePulse 1.4s ease-out infinite",
          }} />
        </div>
        <span style={{ fontWeight: 900, color: "#fff", fontSize: 13, letterSpacing: "0.04em" }}>
          Football News
        </span>
      </div>

      {/* ── Active Event ── */}
      {seasonEvent && (() => {
        const cfg = getTone(seasonEvent.tone);
        return (
          <div style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "10px 14px",
            background: cfg.accentDim,
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 9, color: cfg.accent, fontWeight: 800, letterSpacing: "0.15em", marginBottom: 6 }}>
              ⚡ ACTIVE EVENT
            </div>
            <div style={{
              borderLeft: `3px solid ${cfg.accent}`,
              paddingLeft: 10,
            }}>
              <div style={{ color: cfg.titleColor, fontWeight: 800, fontSize: 12, lineHeight: 1.3, marginBottom: 3 }}>
                {seasonEvent.title}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.4 }}>
                {seasonEvent.description}
              </div>
              {seasonEvent.marketMultiplier && (
                <div style={{
                  marginTop: 5,
                  display: "inline-block",
                  background: seasonEvent.marketMultiplier > 1 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: seasonEvent.marketMultiplier > 1 ? "#34d399" : "#f87171",
                  border: `1px solid ${seasonEvent.marketMultiplier > 1 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                  fontSize: 10, fontWeight: 900,
                  padding: "2px 8px", borderRadius: 4,
                }}>
                  Market ×{seasonEvent.marketMultiplier}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── News Cards (max 5, newest first) ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px 6px" }}>
        {visibleNews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#374151" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 11 }}>No news this season</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visibleNews.map((item, idx) => {
              const cfg = getTone(item.tone);
              const portrait = getNewsPortrait(item.title);
              const isNewest = idx === 0;
              const isNew = newIds.has(String(item.id));

              // Special epic cards
              if (cfg.special) {
                return <EpicNewsCard key={item.id} item={item} isNewest={isNewest} isNew={isNew} />;
              }

              return (
                <div
                  key={item.id}
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    border: `1px solid ${isNew ? cfg.accent : cfg.accentBorder}`,
                    background: isNew
                      ? `linear-gradient(120deg, ${cfg.accentDim}, rgba(5,8,20,0.9))`
                      : "rgba(255,255,255,0.03)",
                    boxShadow: isNew
                      ? `0 0 16px ${cfg.accent}55, 0 2px 8px rgba(0,0,0,0.4)`
                      : "0 1px 4px rgba(0,0,0,0.3)",
                    animation: isNewest && isNew
                      ? "newsSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"
                      : undefined,
                    transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                    position: "relative",
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: 3,
                    background: cfg.accent,
                    boxShadow: isNew ? `0 0 8px ${cfg.accent}` : "none",
                    transition: "box-shadow 0.4s ease",
                  }} />

                  <div style={{ padding: "9px 10px 9px 13px" }}>
                    {/* Top row: badge + source */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 8, fontWeight: 900, letterSpacing: "0.12em",
                        background: cfg.badgeBg, color: cfg.badgeColor,
                        padding: "2px 6px", borderRadius: 3,
                        border: `1px solid ${cfg.accentBorder}`,
                      }}>
                        {cfg.badge}
                      </span>
                      {isNewest && (
                        <span style={{
                          fontSize: 8, fontWeight: 900, color: "#dc2626",
                          letterSpacing: "0.1em",
                          animation: "newBlink 1s step-end 3",
                        }}>
                          ● NEW
                        </span>
                      )}
                      <span style={{ marginLeft: "auto", fontSize: 9, color: "#334155", fontWeight: 600 }}>
                        {item.source ?? "Sky Sports"}
                      </span>
                    </div>

                    {/* Title row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      {portrait && (
                        <img
                          src={portrait}
                          alt=""
                          width={32}
                          height={32}
                          style={{ imageRendering: "pixelated", objectFit: "contain", flexShrink: 0 }}
                        />
                      )}
                      <div style={{
                        color: cfg.titleColor,
                        fontWeight: 800,
                        fontSize: 12,
                        lineHeight: 1.35,
                      }}>
                        {cleanTitle(item.title, !!portrait)}
                      </div>
                    </div>

                    {/* Description */}
                    <div style={{ color: "#64748b", fontSize: 10.5, lineHeight: 1.5 }}>
                      {item.description}
                    </div>

                    {/* Journalist */}
                    {item.journalist && (
                      <div style={{ marginTop: 5, fontSize: 9.5, color: "#1e293b", fontWeight: 600 }}>
                        ✍️ {item.journalist}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Scrolling Ticker ── */}
      <NewsTicker items={currentNews} />

      <style>{`
        @keyframes livePulse {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes newsSlideIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes newBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes epicSlideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.93); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmerSlide {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes starTwinkle {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 0.8; transform: scale(1.5); }
        }
        @keyframes epicEmoji {
          from { transform: scale(1) rotate(-3deg); filter: drop-shadow(0 0 6px rgba(251,191,36,0.6)); }
          to   { transform: scale(1.15) rotate(3deg); filter: drop-shadow(0 0 14px rgba(251,191,36,1)); }
        }
      `}</style>
    </aside>
  );
}
