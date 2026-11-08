import { validateRichContent, richText, richImages, type RichNode } from "./rich-text.ts";
import type { NewsArticle } from "../news";

export type ArticleInput = {
  title: string;
  date: string;
  tag: NewsArticle["tag"];
  body: string;
  content?: RichNode;
  image: { src: string; alt: string } | null;
};
export type AdminArticle = {
  slug: string;
  article: ArticleInput;
  published: boolean;
  version: number;
  updatedAt: string;
};
export type SaveAction = "draft" | "publish" | "unpublish";
export const NEWS_TAGS = ["お知らせ", "売買", "賃貸", "駐車場"] as const;

export class CmsError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

export function validateArticle(value: unknown, publishing: boolean): ArticleInput {
  if (!value || typeof value !== "object") throw new CmsError("記事の入力を確認してください。");
  const input = value as Record<string, unknown>;
  if (typeof input.title !== "string" || input.title.length > 50) throw new CmsError("タイトルは50文字以内で入力してください。");
  if (typeof input.body !== "string" || input.body.length > 30000) throw new CmsError("本文は30,000文字以内で入力してください。");
  if (typeof input.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !Number.isFinite(Date.parse(input.date)) || new Date(input.date).toISOString().slice(0, 10) !== input.date) throw new CmsError("掲載日を正しく入力してください。");
  if (!NEWS_TAGS.includes(input.tag as NewsArticle["tag"])) throw new CmsError("カテゴリを選択してください。");
  let image: ArticleInput["image"] = null;
  if (input.image != null) {
    const item = input.image as Record<string, unknown>;
    if (typeof item.src !== "string" || !/^\/media\/[a-f0-9-]{36}\.webp$/.test(item.src) || typeof item.alt !== "string" || item.alt.length > 200) throw new CmsError("画像をアップロードし直してください。");
    image = { src: item.src, alt: item.alt.trim() };
  }
  let content: RichNode | undefined;
  if (input.content !== undefined) {
    try { content = validateRichContent(input.content); }
    catch (error) { throw new CmsError(error instanceof Error ? error.message : "本文の書式を確認してください。"); }
    image = null;
  }
  const article = { title: input.title.trim(), date: input.date, tag: input.tag as NewsArticle["tag"], body: content ? richText(content).trim() : input.body.trim(), image, ...(content ? { content } : {}) };
  if (publishing && (!article.title || (!article.body && !content?.content?.some(node => richImages(node).length)))) throw new CmsError("公開するにはタイトルと本文を入力してください。");
  return article;
}

export function inputFromArticle(article: NewsArticle): ArticleInput {
  return { title: article.title, date: article.date, tag: article.tag, body: article.body.join("\n\n"), image: article.image ?? null };
}
