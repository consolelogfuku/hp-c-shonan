import assert from "node:assert/strict";
import test from "node:test";
import { validateArticle } from "../src/lib/cms/model.ts";
import { contentFromLegacy, richImages, richText, safeLink, validateRichContent } from "../src/lib/cms/rich-text.ts";
import { emptyProperty, propertyDetailHref, validateProperty } from "../src/lib/cms/property-model.ts";

const base = {
  title: "テストのお知らせ",
  date: "2026-09-12",
  tag: "お知らせ",
  body: "最初の段落。\n\n次の段落。",
  image: null,
};

test("下書きは空でも保存でき、公開時はタイトルと本文が必要", () => {
  assert.equal(validateArticle({ ...base, title: "", body: "" }, false).title, "");
  assert.throws(() => validateArticle({ ...base, title: "", body: "" }, true));
  assert.equal(validateArticle(base, true).title, base.title);
});

test("記事の文字数、日付、画像パスを検証する", () => {
  for (const value of [
    { ...base, title: "あ".repeat(51) },
    { ...base, date: "2026-02-30" },
    { ...base, tag: "不明" },
    { ...base, image: { src: "https://example.com/image.webp", alt: "画像" } },
  ]) assert.throws(() => validateArticle(value, true));
});

test("リッチ本文は順序と安全な書式だけを保持する", () => {
  const src = "/media/12345678-1234-1234-1234-123456789012.webp";
  const content = validateRichContent({ type: "doc", content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "見出し" }] },
    { type: "paragraph", content: [{ type: "text", text: "画像の前", marks: [{ type: "bold" }] }] },
    { type: "image", attrs: { src, alt: "本文画像" } },
    { type: "paragraph", content: [{ type: "text", text: "画像の後" }] },
  ] });
  assert.deepEqual(richImages(content), [src]);
  assert.match(richText(content), /画像の前/);
  assert.throws(() => validateRichContent({ type: "doc", content: [{ type: "image", attrs: { src: "javascript:alert(1)" } }] }));
  assert.equal(safeLink("https://example.com"), true);
  assert.equal(safeLink("javascript:alert(1)"), false);
});

test("従来の本文と画像をリッチ本文へ変換できる", () => {
  const src = "/media/12345678-1234-1234-1234-123456789012.webp";
  const content = contentFromLegacy("一段落目\n\n二段落目", { src, alt: "画像" });
  assert.deepEqual(content.content?.map((node) => node.type), ["image", "paragraph", "paragraph"]);
  assert.deepEqual(richImages(content), [src]);
});

test("物件種別ごとの項目を検証する", () => {
  const src = "/media/12345678-1234-1234-1234-123456789012.webp";
  const sale = { ...emptyProperty("sale"), title: "矢畑売地", image: { src, alt: "現地" }, details: {
    ...emptyProperty("sale").details,
    introduction: "南向きで日当たりのよい土地です。",
    sitePlan: { src, alt: "区画図" },
    photos: [{ src, alt: "南側から見た現地" }],
    nearby: [{ label: "茅ヶ崎小学校", value: "約650m" }],
  } };
  const validated = validateProperty(sale, "sale", true);
  assert.equal(validated.dealType, "owner");
  assert.equal(validated.details.introduction, "南向きで日当たりのよい土地です。");
  assert.equal(validated.details.photos[0].alt, "南側から見た現地");
  assert.equal(propertyDetailHref({ slug: "sample", property: sale }), "/sale/sample");
  const parking = { ...emptyProperty("rent"), kind: "parking", title: "萩園駐車場", address: "茅ヶ崎市萩園", vacancy: 2 };
  assert.equal(validateProperty(parking, "rent", true).vacancy, 2);
  assert.throws(() => validateProperty({ ...parking, vacancy: -1 }, "rent", true));
  assert.throws(() => validateProperty({ ...sale, linkUrl: "https://example.com" }, "sale", true));
  assert.throws(() => validateProperty({ ...sale, image: { src: "javascript:alert(1)", alt: "" } }, "sale", true));
  assert.throws(() => validateProperty({ ...sale, details: { ...sale.details, photos: Array(31).fill({ src, alt: "現地" }) } }, "sale", true));
});
