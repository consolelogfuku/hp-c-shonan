import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { getVoice, voices } from "../src/lib/voices.ts";

test("元サイトの14件を掲載順に移行し、全文と画像を保持する", () => {
  assert.deepEqual(voices.map(({ slug }) => slug), [
    "customer0513", "customer43", "customer12-", "customer11", "customer10",
    "customer9", "customer8", "customer7", "customer6", "customer5",
    "customer4", "customer3", "customer2", "customer1",
  ]);
  for (const voice of voices) {
    assert.equal(getVoice(voice.slug), voice);
    assert.equal(getVoice(`${voice.slug}.html`), voice);
    assert.equal(new URL(voice.sourceUrl).pathname, `/comments/${voice.slug}.html`);
    assert.match(voice.dateLabel, /^20\d{2}年\d{1,2}月$/);
    assert.ok(voice.body.length >= 80, voice.slug);
    assert.ok(statSync(fileURLToPath(new URL(`../public${voice.image}`, import.meta.url))).size > 1000);
  }
  assert.equal(getVoice("missing"), undefined);
});
