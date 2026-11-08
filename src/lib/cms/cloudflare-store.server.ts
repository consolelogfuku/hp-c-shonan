import { env } from "cloudflare:workers";
import type { NewsArticle } from "../news";
import { newsArticles } from "../news";
import { CmsError, inputFromArticle, validateArticle, type AdminArticle, type ArticleInput } from "./model";
import { richImages } from "./rich-text";
import { initialProperties } from "./property-seed";
import { sectionForKind, validateProperty, type AdminProperty, type PropertyInput, type PropertySaveAction, type PropertySection, type PublicProperty } from "./property-model";

type Row = {
  slug: string;
  content: string;
  published: number;
  version: number;
  updated_at: string;
  source_url: string;
};

type PropertyRow = {
  slug: string;
  section: PropertySection;
  kind: PropertyInput["kind"];
  content: string;
  published: number;
  version: number;
  updated_at: string;
};

function admin(row: Row): AdminArticle {
  return {
    slug: row.slug,
    article: JSON.parse(row.content) as ArticleInput,
    published: row.published === 1,
    version: row.version,
    updatedAt: row.updated_at,
  };
}

async function seed() {
  const seeded = await env.DB.prepare("SELECT key FROM cms_meta WHERE key = ?").bind("seed-v1").first();
  if (seeded) return;
  const importedAt = new Date().toISOString();
  const statements = newsArticles.map((article) =>
    env.DB.prepare(
      "INSERT OR IGNORE INTO cms_news(slug, content, published, updated_at, source_url) VALUES(?, ?, 1, ?, ?)",
    ).bind(article.slug, JSON.stringify(inputFromArticle(article)), importedAt, article.sourceUrl),
  );
  statements.push(env.DB.prepare("INSERT OR IGNORE INTO cms_meta(key) VALUES(?)").bind("seed-v1"));
  await env.DB.batch(statements);
}

async function row(slug: string) {
  await seed();
  return env.DB.prepare("SELECT * FROM cms_news WHERE slug = ?").bind(slug).first<Row>();
}

export async function listAdminArticles() {
  await seed();
  const result = await env.DB.prepare("SELECT * FROM cms_news ORDER BY updated_at DESC, slug").all<Row>();
  return result.results.map(admin);
}

export async function getAdminArticle(slug: string) {
  const found = await row(slug);
  return found ? admin(found) : undefined;
}

export async function listPublishedArticles(): Promise<NewsArticle[]> {
  await seed();
  const result = await env.DB.prepare("SELECT * FROM cms_news WHERE published = 1").all<Row>();
  return result.results.map((item) => {
    const input = JSON.parse(item.content) as ArticleInput;
    return {
      slug: item.slug,
      date: input.date,
      title: input.title,
      tag: input.tag,
      body: input.body.split(/\n\s*\n/),
      sourceUrl: item.source_url,
      ...(input.content ? { content: input.content } : {}),
      ...(input.image ? { image: input.image } : {}),
    };
  }).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

async function validateMedia(article: ArticleInput) {
  const paths = [
    ...(article.image ? [article.image.src] : []),
    ...(article.content ? richImages(article.content) : []),
  ];
  for (const path of paths) {
    const object = await env.MEDIA.head(path.slice("/media/".length));
    if (!object) throw new CmsError("画像が見つかりません。アップロードし直してください。");
  }
}

export async function saveArticle(slug: string | undefined, version: unknown, action: unknown, value: unknown) {
  if (action !== "draft" && action !== "publish" && action !== "unpublish") throw new CmsError("保存方法を確認してください。");
  if (slug !== undefined && (!Number.isSafeInteger(version) || Number(version) < 1)) throw new CmsError("記事を読み込み直してください。");
  const article = action === "unpublish" && value === undefined ? undefined : validateArticle(value, action === "publish");
  if (article) await validateMedia(article);
  await seed();
  const now = new Date().toISOString();

  if (slug === undefined) {
    if (!article || action === "unpublish") throw new CmsError("記事が見つかりません。", 404);
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO cms_news(slug, content, published, updated_at) VALUES(?, ?, ?, ?)")
      .bind(id, JSON.stringify(article), action === "publish" ? 1 : 0, now).run();
    return (await getAdminArticle(id))!;
  }

  const current = await row(slug);
  if (!current) throw new CmsError("記事が見つかりません。", 404);
  if (current.version !== version) throw new CmsError("別の画面でこの記事が更新されました。入力内容を控えてから、記事を読み込み直してください。", 409);
  const published = action === "publish" ? 1 : action === "unpublish" ? 0 : current.published;
  const result = await env.DB.prepare(
    "UPDATE cms_news SET content = ?, published = ?, version = version + 1, updated_at = ? WHERE slug = ? AND version = ?",
  ).bind(article ? JSON.stringify(article) : current.content, published, now, slug, version).run();
  if (result.meta.changes !== 1) throw new CmsError("別の画面でこの記事が更新されました。記事を読み込み直してください。", 409);
  return (await getAdminArticle(slug))!;
}

export async function deleteArticle(slug: string, version: unknown) {
  if (!Number.isSafeInteger(version) || Number(version) < 1) throw new CmsError("記事を読み込み直してください。");
  const result = await env.DB.prepare("DELETE FROM cms_news WHERE slug = ? AND version = ?").bind(slug, version).run();
  if (result.meta.changes !== 1) throw new CmsError("記事が見つからないか、別の画面で更新されています。", 409);
}

export async function addMedia(bytes: ArrayBuffer) {
  const name = `${crypto.randomUUID()}.webp`;
  await env.MEDIA.put(name, bytes, { httpMetadata: { contentType: "image/webp" } });
  return `/media/${name}`;
}

export async function getMedia(name: string) {
  return env.MEDIA.get(name);
}

export async function isPublicMedia(name: string) {
  const path = `/media/${name}`;
  const [articles, properties] = await Promise.all([
    listPublishedArticles(),
    listPublishedProperties("all"),
  ]);
  return articles.some((article) => article.image?.src === path || (article.content ? richImages(article.content).includes(path) : false)) || properties.some((item) => item.property.image?.src === path);
}

function adminProperty(row: PropertyRow): AdminProperty {
  return {
    slug: row.slug,
    property: JSON.parse(row.content) as PropertyInput,
    published: row.published === 1,
    version: row.version,
    updatedAt: row.updated_at,
  };
}

async function seedProperties() {
  const key = "properties-seed-v1";
  const seeded = await env.DB.prepare("SELECT key FROM cms_meta WHERE key = ?").bind(key).first();
  if (seeded) return;
  const importedAt = new Date().toISOString();
  const statements = initialProperties.map((property, index) =>
    env.DB.prepare("INSERT OR IGNORE INTO cms_properties(slug, section, kind, content, published, updated_at) VALUES(?, ?, ?, ?, 1, ?)")
      .bind(`legacy-property-${String(index + 1).padStart(3, "0")}`, sectionForKind(property.kind), property.kind, JSON.stringify(property), importedAt),
  );
  statements.push(env.DB.prepare("INSERT OR IGNORE INTO cms_meta(key) VALUES(?)").bind(key));
  await env.DB.batch(statements);
}

async function propertyRow(slug: string) {
  await seedProperties();
  return env.DB.prepare("SELECT * FROM cms_properties WHERE slug = ?").bind(slug).first<PropertyRow>();
}

export async function listAdminProperties(section: PropertySection) {
  await seedProperties();
  const result = await env.DB.prepare("SELECT * FROM cms_properties WHERE section = ? ORDER BY updated_at DESC, slug")
    .bind(section).all<PropertyRow>();
  return result.results.map(adminProperty);
}

export async function getAdminProperty(slug: string) {
  const found = await propertyRow(slug);
  return found ? adminProperty(found) : undefined;
}

export async function listPublishedProperties(section: PropertySection | "all"): Promise<PublicProperty[]> {
  await seedProperties();
  const statement = section === "all"
    ? env.DB.prepare("SELECT * FROM cms_properties WHERE published = 1 ORDER BY updated_at DESC, slug")
    : env.DB.prepare("SELECT * FROM cms_properties WHERE published = 1 AND section = ? ORDER BY updated_at DESC, slug").bind(section);
  const result = await statement.all<PropertyRow>();
  return result.results.map((item) => ({ slug: item.slug, property: JSON.parse(item.content) as PropertyInput }));
}

export async function getPublishedProperty(section: PropertySection, slug: string): Promise<PublicProperty | undefined> {
  await seedProperties();
  const item = await env.DB.prepare("SELECT * FROM cms_properties WHERE slug = ? AND section = ? AND published = 1")
    .bind(slug, section).first<PropertyRow>();
  return item ? { slug: item.slug, property: JSON.parse(item.content) as PropertyInput } : undefined;
}

async function validatePropertyMedia(property: PropertyInput) {
  const paths = [property.image?.src, property.details?.sitePlan?.src, property.details?.referencePlan?.src, ...(property.details?.photos.map((image) => image.src) ?? [])]
    .filter((src): src is string => Boolean(src?.startsWith("/media/")));
  for (const path of new Set(paths)) {
    const object = await env.MEDIA.head(path.slice("/media/".length));
    if (!object) throw new CmsError("画像が見つかりません。アップロードし直してください。");
  }
}

export async function saveProperty(section: PropertySection, slug: string | undefined, version: unknown, action: unknown, value: unknown) {
  if (section !== "sale" && section !== "rent") throw new CmsError("物件の種類を確認してください。");
  if (action !== "draft" && action !== "publish" && action !== "unpublish") throw new CmsError("保存方法を確認してください。");
  if (slug !== undefined && (!Number.isSafeInteger(version) || Number(version) < 1)) throw new CmsError("物件を読み込み直してください。");
  const property = action === "unpublish" && value === undefined ? undefined : validateProperty(value, section, action === "publish");
  if (property) await validatePropertyMedia(property);
  await seedProperties();
  const now = new Date().toISOString();

  if (slug === undefined) {
    if (!property || action === "unpublish") throw new CmsError("物件が見つかりません。", 404);
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO cms_properties(slug, section, kind, content, published, updated_at) VALUES(?, ?, ?, ?, ?, ?)")
      .bind(id, section, property.kind, JSON.stringify(property), action === "publish" ? 1 : 0, now).run();
    return (await getAdminProperty(id))!;
  }

  const current = await propertyRow(slug);
  if (!current || current.section !== section) throw new CmsError("物件が見つかりません。", 404);
  if (current.version !== version) throw new CmsError("別の画面でこの物件が更新されました。物件を読み込み直してください。", 409);
  const published = action === "publish" ? 1 : action === "unpublish" ? 0 : current.published;
  const content = property ? JSON.stringify(property) : current.content;
  const kind = property?.kind ?? current.kind;
  const result = await env.DB.prepare("UPDATE cms_properties SET kind = ?, content = ?, published = ?, version = version + 1, updated_at = ? WHERE slug = ? AND version = ?")
    .bind(kind, content, published, now, slug, version).run();
  if (result.meta.changes !== 1) throw new CmsError("別の画面でこの物件が更新されました。物件を読み込み直してください。", 409);
  return (await getAdminProperty(slug))!;
}

export async function deleteProperty(slug: string, version: unknown) {
  if (!Number.isSafeInteger(version) || Number(version) < 1) throw new CmsError("物件を読み込み直してください。");
  const result = await env.DB.prepare("DELETE FROM cms_properties WHERE slug = ? AND version = ?").bind(slug, version).run();
  if (result.meta.changes !== 1) throw new CmsError("物件が見つからないか、別の画面で更新されています。", 409);
}

export async function allowLoginAttempt(now = Date.now()) {
  const current = await env.DB.prepare("SELECT attempts, resets FROM cms_login_limit WHERE id = 1").first<{ attempts: number; resets: number }>();
  if (!current || current.resets <= now) {
    await env.DB.prepare("INSERT INTO cms_login_limit(id, attempts, resets) VALUES(1, 1, ?) ON CONFLICT(id) DO UPDATE SET attempts = 1, resets = excluded.resets")
      .bind(now + 15 * 60_000).run();
    return true;
  }
  if (current.attempts >= 10) return false;
  await env.DB.prepare("UPDATE cms_login_limit SET attempts = attempts + 1 WHERE id = 1").run();
  return true;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function createSession(password: string) {
  const token = randomToken();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM cms_sessions WHERE expires <= ?").bind(Date.now()),
    env.DB.prepare("INSERT INTO cms_sessions(token_hash, password_hash, expires) VALUES(?, ?, ?)")
      .bind(await sha256(token), await sha256(password), Date.now() + 8 * 60 * 60_000),
    env.DB.prepare("DELETE FROM cms_login_limit"),
  ]);
  return token;
}

export async function sessionValid(token: string, password: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const found = await env.DB.prepare("SELECT 1 FROM cms_sessions WHERE token_hash = ? AND password_hash = ? AND expires > ?")
    .bind(await sha256(token), await sha256(password), Date.now()).first();
  return Boolean(found);
}

export async function revokeSession(token: string) {
  await env.DB.prepare("DELETE FROM cms_sessions WHERE token_hash = ?").bind(await sha256(token)).run();
}
