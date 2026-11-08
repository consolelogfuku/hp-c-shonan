import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import type { AdminArticle } from "@/lib/cms/model";
import { formatNewsDate } from "@/lib/news";

const ADMIN_PAGE_SIZE = 25;

function paginationItems(current: number, total: number) {
  const pages = [...new Set([1, current - 1, current, current + 1, total])].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const items: (number | string)[] = [];
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) items.push(`ellipsis-${pages[index - 1]}`);
    items.push(page);
  });
  return items;
}

export function NewsManager({ articles }: { articles: AdminArticle[] }) {
  const [items, setItems] = useState(articles);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminArticle | null>(null);
  const [error, setError] = useState("");
  const published = items.filter((article) => article.published).length;
  const visible = items.filter((article) => (filter === "all" || (filter === "published" ? article.published : !article.published)) && article.article.title.includes(query.trim()));
  const totalPages = Math.max(1, Math.ceil(visible.length / ADMIN_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * ADMIN_PAGE_SIZE;
  const pageArticles = visible.slice(firstIndex, firstIndex + ADMIN_PAGE_SIZE);
  async function remove(article: AdminArticle) {
    setDeleting(article.slug); setError("");
    try {
      const response = await fetch(`/api/admin/news/${article.slug}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ version: article.version }) });
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error || "記事を削除できませんでした。");
      }
      setItems((current) => current.filter((item) => item.slug !== article.slug));
      setPendingDelete(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "記事を削除できませんでした。");
      setPendingDelete(null);
    } finally { setDeleting(null); }
  }
  return <>
    <div className="cms-heading"><h1>お知らせ一覧</h1><a href="/admin/news/new" className="cms-button cms-primary">新規作成</a></div>
    <div className="cms-stats"><div className="cms-card"><span>すべての記事</span><strong>{items.length}<small>件</small></strong></div><div className="cms-card"><span>公開中</span><strong>{published}<small>件</small></strong></div><div className="cms-card"><span>下書き中</span><strong>{items.length - published}<small>件</small></strong></div></div>
    {error && <div role="alert" className="cms-error">{error}</div>}
    <section className="cms-card cms-list-card" aria-label="管理中のお知らせ">
      <div className="cms-list-toolbar"><div className="cms-tabs" aria-label="公開状態で絞り込み">{[["all", "すべて"], ["published", "公開中"], ["draft", "下書き中"]].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setFilter(value); setPage(1); }}>{label}</button>)}</div><label className="cms-search"><span className="cms-sr">記事を検索</span><input type="search" placeholder="タイトルで検索" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label></div>
      <p className="cms-result-count" role="status">{visible.length > ADMIN_PAGE_SIZE ? `${visible.length}件中 ${firstIndex + 1}〜${Math.min(firstIndex + ADMIN_PAGE_SIZE, visible.length)}件を表示` : `${visible.length}件のお知らせ`}</p>
      <div className="cms-article-list">{pageArticles.map((article) => <article key={article.slug} className="cms-list-row"><div className="cms-list-copy"><div className="cms-row-meta"><span className={`cms-badge ${article.published ? "is-public" : "is-draft"}`}>{article.published ? "公開中" : "下書き中"}</span></div><a href={`/admin/news/${article.slug}`} className="cms-article-title">{article.article.title || "無題のお知らせ"}</a><p className="cms-muted">記事に表示する日付 {formatNewsDate(article.article.date)}</p></div><div className="cms-row-actions"><a href={`/admin/news/${article.slug}`} className="cms-button" aria-label={`${article.article.title || "無題のお知らせ"}を編集`}>編集</a><button type="button" className="cms-button cms-delete-button" aria-label={`${article.article.title || "無題のお知らせ"}を削除`} disabled={deleting === article.slug} onClick={() => setPendingDelete(article)}>{deleting === article.slug ? "削除中…" : "削除"}</button></div></article>)}</div>
      {visible.length === 0 && <div className="cms-empty"><h2>お知らせがありません</h2><p>検索条件を変えるか、新しいお知らせを作成してください。</p></div>}
      {visible.length > 0 && <nav className="cms-pagination" aria-label="お知らせ一覧のページ"><button type="button" className="cms-page-button cms-page-direction" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>前へ</button>{paginationItems(currentPage, totalPages).map((item) => typeof item === "number" ? <button type="button" className="cms-page-button" aria-label={`${item}ページ目`} aria-current={item === currentPage ? "page" : undefined} key={item} onClick={() => setPage(item)}>{item}</button> : <span className="cms-page-ellipsis" aria-hidden key={item}>…</span>)}<button type="button" className="cms-page-button cms-page-direction" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>次へ</button></nav>}
    </section>
    <ConfirmDialog open={pendingDelete !== null} title="この記事を削除しますか？" confirmLabel="削除" tone="danger" busy={deleting !== null} onConfirm={() => { if (pendingDelete) remove(pendingDelete); }} onClose={() => { if (!deleting) setPendingDelete(null); }}><p>「{pendingDelete?.article.title || "無題のお知らせ"}」を完全に削除します。</p>{pendingDelete?.published && <p>公開中の記事のため、公開サイトからも削除されます。</p>}<p>この操作は元に戻せません。</p></ConfirmDialog>
  </>;
}
