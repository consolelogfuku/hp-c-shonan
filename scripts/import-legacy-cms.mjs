import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const legacyPath = resolve(".data/cms.sqlite");
if (!existsSync(legacyPath)) {
  console.log("旧CMSデータがないため、移行は不要です。");
  process.exit(0);
}

function wrangler(args) {
  const result = spawnSync("npx", ["wrangler", ...args], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function sql(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

wrangler(["d1", "migrations", "apply", "c-shonan", "--local"]);

const database = new DatabaseSync(legacyPath, { readOnly: true });
const articles = database.prepare("SELECT slug, content, published, version, updated_at, source_url FROM cms_news").all();
const media = database.prepare("SELECT name, bytes FROM cms_media").all();
database.close();

const directory = mkdtempSync(join(tmpdir(), "c-shonan-cms-import-"));
try {
  const statements = [
    ...articles.map((article) => `INSERT INTO cms_news(slug, content, published, version, updated_at, source_url) VALUES(${sql(article.slug)}, ${sql(article.content)}, ${Number(article.published) ? 1 : 0}, ${Number(article.version)}, ${sql(article.updated_at)}, ${sql(article.source_url || "")}) ON CONFLICT(slug) DO UPDATE SET content=excluded.content, published=excluded.published, version=excluded.version, updated_at=excluded.updated_at, source_url=excluded.source_url;`),
    "INSERT OR IGNORE INTO cms_meta(key) VALUES('seed-v1');",
  ];
  const sqlFile = join(directory, "legacy.sql");
  writeFileSync(sqlFile, `${statements.join("\n")}\n`);
  wrangler(["d1", "execute", "c-shonan", "--local", "--file", sqlFile]);

  for (const item of media) {
    const file = join(directory, item.name);
    writeFileSync(file, item.bytes);
    wrangler(["r2", "object", "put", `c-shonan-media/${item.name}`, "--local", "--file", file, "--content-type", "image/webp"]);
  }
  console.log(`旧CMSから記事${articles.length}件・画像${media.length}件をローカルD1/R2へ移行しました。`);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
