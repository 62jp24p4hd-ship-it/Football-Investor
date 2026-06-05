"use client";

import type {
  NewsItem,
  SeasonEvent,
} from "../game/types";

type NewsFeedProps = {
  news: NewsItem[];
  seasonEvent: SeasonEvent | null;
};

function newsColor(tone: string) {
  if (tone === "good") {
    return "border-green-500 bg-green-950/40";
  }

  if (tone === "bad") {
    return "border-red-500 bg-red-950/40";
  }

  if (tone === "special") {
    return "border-purple-500 bg-purple-950/40";
  }

  return "border-zinc-700 bg-black/40";
}

export default function NewsFeed(
  props: NewsFeedProps
) {
  const {
    news,
    seasonEvent,
  } = props;

  return (
    <aside className="border border-zinc-800 bg-zinc-950 rounded-2xl p-4">

      <h2 className="text-2xl font-bold mb-4">
        📰 Football News
      </h2>

      {seasonEvent && (
        <div
          className={`
            border
            rounded-xl
            p-3
            mb-4
            ${newsColor(seasonEvent.tone)}
          `}
        >
          <div className="text-sm text-gray-400">
            Current Event
          </div>

          <div className="font-bold">
            {seasonEvent.title}
          </div>

          <p className="text-sm text-gray-300">
            {seasonEvent.description}
          </p>
        </div>
      )}

      <div className="space-y-3 max-h-[600px] overflow-y-auto">

        {news.length === 0 ? (
          <p className="text-gray-500">
            No news yet.
          </p>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className={`
                border
                rounded-xl
                p-3
                ${newsColor(item.tone)}
              `}
            >
              <div className="text-xs text-gray-400 mb-1">
                Season {item.season}
                {item.sourceName && (
                  <>
                    {" "}
                    • {item.sourceName}
                  </>
                )}
              </div>

              <div className="font-bold">
                {item.title}
              </div>

              <p className="text-sm text-gray-300">
                {item.description}
              </p>
            </div>
          ))
        )}

      </div>

    </aside>
  );
}