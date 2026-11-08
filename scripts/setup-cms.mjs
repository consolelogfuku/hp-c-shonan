import { randomBytes } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const envFile = resolve(".dev.vars");
const current = existsSync(envFile) ? readFileSync(envFile, "utf8") : "";
if (/^\s*CMS_ADMIN_PASSWORD\s*=/m.test(current)) {
  console.log("管理パスワードは設定済みです。既存の設定を維持しました。");
} else {
  const password = randomBytes(24).toString("base64url");
  mkdirSync(".data", { recursive: true, mode: 0o700 });
  writeFileSync(envFile, `${current.trimEnd()}\nCMS_ADMIN_PASSWORD=${password}\n`, { mode: 0o600 });
  chmodSync(envFile, 0o600);
  const receipt = resolve(".data/admin-access.txt");
  writeFileSync(receipt, `コミュニティ湘南 管理画面\n\n管理画面: /admin\n管理パスワード: ${password}\n\nパスワードは .dev.vars の CMS_ADMIN_PASSWORD に設定されています。\n変更したときは開発サーバーを再起動してください。以前のログインは無効になります。\nこのファイルは外部に共有しないでください。\n`, { mode: 0o600 });
  console.log(`初期設定が完了しました。ログイン情報: ${receipt}`);
  console.log("設定を反映するため、開発サーバーを再起動してください。");
}
