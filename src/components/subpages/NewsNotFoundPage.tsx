import { SubpageFrame } from "./Shared";

export function NewsNotFoundPage() {
  return <SubpageFrame hero={{ title: "お知らせ" }}>
    <section className="mx-auto max-w-[1120px] px-5 py-20 text-center md:px-8 md:py-28">
      <h2 className="text-[clamp(24px,3vw,36px)]">お知らせが見つかりませんでした</h2>
      <p className="mt-5 text-muted">削除されたか、公開を終了した可能性があります。</p>
      <a href="/news" className="mt-8 inline-flex border border-line bg-surface px-6 py-3 text-accent transition-colors hover:border-accent">お知らせ一覧へ戻る</a>
    </section>
  </SubpageFrame>;
}
