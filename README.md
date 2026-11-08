# hp-c-shonan

ホームページのリニューアル。

## 開発

```bash
npm install
npm run cms:setup
npm run dev
```

`http://localhost:9999` でサイト、`http://localhost:9999/admin` でお知らせ管理画面を開く。

## デザイン案（mock）

最新のデザイン案は `docs/mock/v3/index.html` をブラウザで開く。サーバーは不要。トップ、コンセプト、お客様の声、施工事例（一覧と6棟の詳細）、売買物件、賃貸物件・貸駐車場のページがある。施工事例の写真は現行サイトの実写真で、夕日と夜の写真だけAIで生成したイメージ。

以前のA〜Cの3案は `docs/mock/v2/index.html` にある。写真はすべてAIで生成したイメージで、本番の施工事例には使わない。

## 技術構成

- TanStack Start / React / TypeScript
- Cloudflare Workers
- Cloudflare D1（記事、公開状態、管理セッション）
- Cloudflare R2（記事画像）
- Tiptap（お知らせ本文エディター）

開発時もCloudflare Vite Pluginを使い、D1とR2をローカルで動かす。初回起動時にD1マイグレーションを自動適用する。

## 構成

- `src/routes/` TanStack RouterのページとAPIルート
- `src/components/` セクションごとのコンポーネント
- `src/lib/site.ts` 物件・施工事例・お客様の声などの表示コンテンツ
- `src/lib/cms/` お知らせ管理、入力検証、D1/R2アクセス
- `migrations/` D1のスキーマ変更
- `docs/current-site-audit.md` 現行サイトの調査メモ
- `.agents/skills/design-taste-frontend/` デザイン方針のスキル
