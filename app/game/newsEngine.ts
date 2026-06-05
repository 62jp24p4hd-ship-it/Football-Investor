import type {
  NewsItem,
} from "./types";

export function addNewsItem(
  currentNews: NewsItem[],
  newsItem: NewsItem
) {
  return [
    newsItem,
    ...currentNews,
  ];
}

export function addNewsItems(
  currentNews: NewsItem[],
  newsItems: NewsItem[]
) {
  return [
    ...newsItems.reverse(),
    ...currentNews,
  ];
}

export function getLatestNews(
  news: NewsItem[],
  limit = 50
) {
  return news.slice(0, limit);
}

export function filterNewsBySeason(
  news: NewsItem[],
  season: number
) {
  return news.filter(
    (item) =>
      item.season === season
  );
}

export function filterGoodNews(
  news: NewsItem[]
) {
  return news.filter(
    (item) =>
      item.tone === "good"
  );
}

export function filterBadNews(
  news: NewsItem[]
) {
  return news.filter(
    (item) =>
      item.tone === "bad"
  );
}

export function filterSpecialNews(
  news: NewsItem[]
) {
  return news.filter(
    (item) =>
      item.tone === "special"
  );
}

export function clearNews() {
  return [] as NewsItem[];
}