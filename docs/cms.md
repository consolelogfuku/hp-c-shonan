# お知らせ管理

## ローカル起動

Node.js 22.13以降を使用する。

```sh
npm install
npm run cms:setup
npm run dev
```

サイトは `http://localhost:9999`、管理画面は `http://localhost:9999/admin` で開く。`cms:setup` が管理パスワードを `.dev.vars` に生成し、ログイン情報を `.data/admin-access.txt` に保存する。どちらもGit管理の対象外。

開発サーバーの起動時に `migrations/` をローカルD1へ適用する。開発用D1とR2の実体は `.wrangler/` に保存される。

以前のローカルSQLite版を使用していた場合は、初回だけ次を実行すると `.data/cms.sqlite` の記事と画像をローカルD1/R2へ引き継げる。

```sh
npm run db:import:legacy
```

## できること

- お知らせの一覧、検索、状態別絞り込み、作成、編集、削除。一覧は1ページ25件。
- タイトル、本文、記事に表示する日付、記事画像の保存。
- 下書き保存、プレビュー、公開、更新、非公開への変更。
- 公開中の記事を更新すると公開サイトへすぐに反映。非公開にすると下書き状態へ戻る。
- 複数画面で編集した場合、古い内容による上書きを防止。
- ログインは8時間有効。失敗が続いた場合は15分間ログインを制限。

本文はTiptapのリッチテキストエディター。見出し、太字、斜体、下線、取り消し線、文字サイズ・色、リスト、リンク、引用、文字揃え、表、区切り線、元に戻す・やり直しに対応する。

画像はファイル選択、貼り付け、ドラッグ＆ドロップでカーソル位置またはドロップ位置へ追加する。ブラウザーで最大2000pxのWebPへ変換してからアップロードする。本文は許可した構造だけのJSONとしてサーバーで検証し、HTMLやJavaScriptは保存・実行しない。

「記事に表示する日付」は表示用の日付であり、予約公開ではない。「公開する」を確定するとすぐに公開される。

## 保存先

- 記事、公開状態、管理セッション、ログイン試行回数: Cloudflare D1（`DB` binding）
- 記事画像: Cloudflare R2（`MEDIA` binding）
- 管理パスワード: ローカルは `.dev.vars`、本番はWorker Secret

下書き画像はログイン中の管理者だけが取得できる。公開記事で参照された画像だけを公開配信する。

## 検証

```sh
npm test
npm run build
```

## Cloudflareへ公開する前の準備

CloudflareアカウントでD1データベース `c-shonan` とR2バケット `c-shonan-media` を作成し、発行されたD1の `database_id` を `wrangler.jsonc` に設定する。続いて管理パスワードをWorker Secretへ登録し、リモートD1へマイグレーションを適用してからデプロイする。

```sh
npx wrangler secret put CMS_ADMIN_PASSWORD
npm run db:migrate:remote
npm run deploy
```
