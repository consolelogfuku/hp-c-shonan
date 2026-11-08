import assert from "node:assert/strict";
import test from "node:test";
import { NEWS_PAGE_SIZE, formatNewsDate, getNewsArticle, getNewsArticlePage, getNewsPage, newsArticleHref, newsArticles, newsPageHref } from "../src/lib/news.ts";

test("pagination covers every article once, in publication order", () => {
  const first = getNewsPage();
  assert.equal(first.page, 1);
  assert.equal(first.articles.length, NEWS_PAGE_SIZE);
  const pages = Array.from({ length: first.totalPages }, (_, i) => getNewsPage(String(i + 1)));
  assert.ok(pages.every((page) => page.articles.length > 0 && page.articles.length <= NEWS_PAGE_SIZE));
  const combined = pages.flatMap((page) => page.articles);
  assert.deepEqual(combined, newsArticles);
  assert.equal(new Set(combined.map((article) => article.slug)).size, combined.length);
  assert.equal(combined[0].slug, "2026svc.html");
  assert.equal(combined.at(-1).slug, "shorin2025621.html");
  for (let i = 1; i < combined.length; i++) assert.ok(combined[i - 1].date >= combined[i].date);
});

test("invalid or out-of-range page queries are rejected", () => {
  for (const value of ["", "0", "-1", "1.5", "abc", "01", "1e0", "Infinity", "9007199254740993", ["1", "2"], String(getNewsPage().totalPages + 1)]) {
    assert.equal(getNewsPage(value), undefined, JSON.stringify(value));
  }
});

test("old article URLs resolve and each detail can return to its containing page", () => {
  for (const article of newsArticles) {
    assert.equal(getNewsArticle(article.slug), article);
    const page = getNewsArticlePage(article.slug);
    assert.ok(getNewsPage(String(page)).articles.some((item) => item.slug === article.slug));
    assert.equal(new URL(article.sourceUrl).pathname, newsArticleHref(article.slug));
    assert.ok(article.body.length > 0);
  }
  assert.equal(getNewsArticlePage("shorin2025621.html"), 2);
  assert.equal(newsPageHref(1), "/news");
  assert.equal(newsPageHref(2), "/news?page=2");
  assert.equal(formatNewsDate("2026-07-25"), "2026.07.25");
});

test("unknown article identifiers do not resolve", () => {
  for (const slug of ["missing.html", "toString", "", "2026svc.html/extra"]) {
    assert.equal(getNewsArticle(slug), undefined);
    assert.equal(getNewsArticlePage(slug), undefined);
  }
});
