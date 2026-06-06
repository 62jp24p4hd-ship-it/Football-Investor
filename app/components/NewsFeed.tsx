"use client";

import type { NewsItem, SeasonEvent } from "../game/types";

type Props = {
  news: NewsItem[];
  seasonEvent: SeasonEvent | null;
};

function toneStyle(tone: string) {
  if (tone === "good") return "border-emerald-500/60 bg-emerald-950/30";
  if (tone === "bad") return "border-red-500/60 bg-red-950/30";
  if (tone === "special") return "border-purple-500/60 bg-purple-950/30";
  return "border-white/10 bg-white/5";
}

function toneDot(tone: string) {
  if (tone === "good") return "bg-emerald-400";
  if (tone === "bad") return "bg-red-400";
  if (tone === "special") return "bg-purple-400";
  return "bg-gray-500";
}

export default function NewsFeed({ news, seasonEvent }: Props) {
  return (
    <aside className="bg-[#0d1128] border-2 border-white/8 rounded-2xl overflow-hidden flex flex-col h-full">

      <div className="px-4 py-3 border-b border-white/8 bg-white/3">
        <div className="flex items-center gap-2">
          <span className="text-base">📰</span>
          <h2 className="font-black text-white text-sm">Football News</h2>
          {news.length > 0 && (
            <span className="ml-auto text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
              {news.length}
            </span>
          )}
        </div>
      </div>

      {/* Active Event */}
      <div className="px-4 py-3 border-b border-white/8">
        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Active Event</div>
        {seasonEvent ? (
          <div className={`border rounded-xl p-3 ${toneStyle(seasonEvent.tone)}`}>
            <div className="font-black text-white text-sm">{seasonEvent.title}</div>
            <div className="text-xs text-gray-300 mt-0.5 leading-relaxed">{seasonEvent.description}</div>
            {seasonEvent.marketMultiplier && (
              <div className={`text-xs font-black mt-1.5 ${seasonEvent.marketMultiplier > 1 ? "text-emerald-400" : "text-red-400"}`}>
                Market ×{seasonEvent.marketMultiplier}
              </div>
            )}
          </div>
        ) : (
          <div className="border border-white/8 rounded-xl p-3 text-xs text-gray-600 text-center">
            No active event this season
          </div>
        )}
      </div>

      {/* News list */}
      <div className="overflow-y-auto flex-1 p-3 space-y-2">
        {news.length === 0 ? (
          <div className="text-gray-600 text-sm text-center py-8">No news yet</div>
        ) : (
          news.map((item) => (
            <div key={item.id} className={`border rounded-xl p-3 transition-all ${toneStyle(item.tone)}`}
              style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${toneDot(item.tone)}`} />
                  <div className="font-black text-white text-sm leading-tight">{item.title}</div>
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">{item.season}</div>
              </div>
              <div className="text-xs text-gray-300 leading-relaxed pl-3">{item.description}</div>
              {item.journalist && (
                <div className="text-xs text-gray-600 mt-1.5 pl-3">
                  ✍️ {item.journalist} • {item.source}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}