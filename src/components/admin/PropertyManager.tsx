import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { propertyKindLabel, propertyStatusLabel, type AdminProperty, type PropertySection } from "@/lib/cms/property-model";

const PAGE_SIZE = 25;

function paginationItems(current: number, total: number) {
  const pages = [...new Set([1, current - 1, current, current + 1, total])].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const items: (number | string)[] = [];
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) items.push(`ellipsis-${pages[index - 1]}`);
    items.push(page);
  });
  return items;
}

export function PropertyManager({ records, section }: { records: AdminProperty[]; section: PropertySection }) {
  const [items, setItems] = useState(records);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminProperty | null>(null);
  const [error, setError] = useState("");
  const base = section === "sale" ? "/admin/sale" : "/admin/rent";
  const title = section === "sale" ? "売買物件一覧" : "賃貸・駐車場一覧";
  const published = items.filter((record) => record.published).length;
  const visible = items.filter((record) => (filter === "all" || (filter === "published" ? record.published : !record.published)) && record.property.title.includes(query.trim()));
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRecords = visible.slice(firstIndex, firstIndex + PAGE_SIZE);

  async function remove(record: AdminProperty) {
    setDeleting(record.slug); setError("");
    try {
      const response = await fetch(`/api/admin/properties/${record.slug}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ version: record.version }) });
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error || "物件を削除できませんでした。");
      }
      setItems((current) => current.filter((item) => item.slug !== record.slug));
      setPendingDelete(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "物件を削除できませんでした。");
      setPendingDelete(null);
    } finally { setDeleting(null); }
  }

  return <>
    <div className="cms-heading"><h1>{title}</h1><a href={`${base}/new`} className="cms-button cms-primary">新規作成</a></div>
    <div className="cms-stats"><div className="cms-card"><span>すべて</span><strong>{items.length}<small>件</small></strong></div><div className="cms-card"><span>公開中</span><strong>{published}<small>件</small></strong></div><div className="cms-card"><span>下書き中</span><strong>{items.length - published}<small>件</small></strong></div></div>
    {error && <div role="alert" className="cms-error">{error}</div>}
    <section className="cms-card cms-list-card" aria-label={title}>
      <div className="cms-list-toolbar"><div className="cms-tabs" aria-label="公開状態で絞り込み">{[["all", "すべて"], ["published", "公開中"], ["draft", "下書き中"]].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setFilter(value); setPage(1); }}>{label}</button>)}</div><label className="cms-search"><span className="cms-sr">物件を検索</span><input type="search" placeholder="物件名で検索" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label></div>
      <p className="cms-result-count" role="status">{visible.length > PAGE_SIZE ? `${visible.length}件中 ${firstIndex + 1}〜${Math.min(firstIndex + PAGE_SIZE, visible.length)}件を表示` : `${visible.length}件`}</p>
      <div className="cms-article-list">{pageRecords.map((record) => <article key={record.slug} className="cms-list-row"><div className="cms-list-copy"><div className="cms-row-meta"><span className={`cms-badge ${record.published ? "is-public" : "is-draft"}`}>{record.published ? "公開中" : "下書き中"}</span><span>{propertyKindLabel(record.property.kind)}</span><span>{propertyStatusLabel(record.property)}</span></div><a href={`${base}/${record.slug}`} className="cms-article-title">{record.property.title || "無題の物件"}</a>{record.property.price && <p className="cms-muted">{record.property.price}</p>}</div><div className="cms-row-actions"><a href={`${base}/${record.slug}`} className="cms-button" aria-label={`${record.property.title || "無題の物件"}を編集`}>編集</a><button type="button" className="cms-button cms-delete-button" aria-label={`${record.property.title || "無題の物件"}を削除`} disabled={deleting === record.slug} onClick={() => setPendingDelete(record)}>{deleting === record.slug ? "削除中…" : "削除"}</button></div></article>)}</div>
      {visible.length === 0 && <div className="cms-empty"><h2>物件がありません</h2><p>検索条件を変えるか、新しい物件を作成してください。</p></div>}
      {visible.length > 0 && <nav className="cms-pagination" aria-label={`${title}のページ`}><button type="button" className="cms-page-button cms-page-direction" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>前へ</button>{paginationItems(currentPage, totalPages).map((item) => typeof item === "number" ? <button type="button" className="cms-page-button" aria-label={`${item}ページ目`} aria-current={item === currentPage ? "page" : undefined} key={item} onClick={() => setPage(item)}>{item}</button> : <span className="cms-page-ellipsis" aria-hidden key={item}>…</span>)}<button type="button" className="cms-page-button cms-page-direction" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>次へ</button></nav>}
    </section>
    <ConfirmDialog open={pendingDelete !== null} title="この物件を削除しますか？" confirmLabel="削除" tone="danger" busy={deleting !== null} onConfirm={() => { if (pendingDelete) remove(pendingDelete); }} onClose={() => { if (!deleting) setPendingDelete(null); }}><p>「{pendingDelete?.property.title || "無題の物件"}」を完全に削除します。</p>{pendingDelete?.published && <p>公開中のため、公開サイトからも削除されます。</p>}<p>この操作は元に戻せません。</p></ConfirmDialog>
  </>;
}
