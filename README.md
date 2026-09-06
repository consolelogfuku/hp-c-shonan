# hp-c-shonan

株式会社コミュニティ湘南（https://www.c-shonan.co.jp/）ホームページのリニューアル。

## 開発

```bash
npm install
npm run dev
```

## 構成

- `src/app/page.tsx` トップページ
- `src/components/` セクションごとのコンポーネント
- `src/lib/site.ts` 表示コンテンツ（物件・施工事例・お客様の声・お知らせ・駐車場）。将来は管理画面 / CMS から取得する想定
- `docs/current-site-audit.md` 現行サイトの調査メモ
- `.agents/skills/design-taste-frontend/` デザイン方針のスキル
