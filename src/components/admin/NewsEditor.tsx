import { useEffect, useMemo, useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { ConfirmDialog } from "./ConfirmDialog";
import { ArticleBody } from "@/components/news/ArticleBody";
import { contentFromLegacy } from "@/lib/cms/rich-text";
import { type AdminArticle, type ArticleInput, type SaveAction } from "@/lib/cms/model";
import { formatNewsDate } from "@/lib/news";

export function NewsEditor({ initial, today }: { initial: AdminArticle | null; today: string }) {
  const [record, setRecord] = useState(initial);
  const [form, setForm] = useState<ArticleInput>(initial?.article ?? { title: "", date: today, tag: "お知らせ", body: "", image: null });
  const [baseline, setBaseline] = useState(JSON.stringify(form));
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<"publish" | "unpublish" | null>(null);
  const dirty = JSON.stringify(form) !== baseline;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update<K extends keyof ArticleInput>(key: K, value: ArticleInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
    setError("");
  }

  async function save(action: SaveAction) {
    if (busy) return;
    setBusy(action);
    setError("");
    setMessage("");
    try {
      const response = await fetch(record ? `/api/admin/news/${record.slug}` : "/api/admin/news", {
        method: record ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: record?.version, action, article: form }),
      });
      const result = await response.json() as AdminArticle & { error?: string };
      if (!response.ok) throw new Error(result.error || "保存できませんでした。");
      setRecord(result);
      setForm(result.article);
      setBaseline(JSON.stringify(result.article));
      setMessage(action === "publish" ? record?.published ? "更新しました。サイトに反映されています。" : "公開しました。サイトに反映されています。" : action === "unpublish" ? "非公開にしました。記事は下書き中に戻りました。" : "下書きを保存しました。");
      if (!record) window.history.replaceState(null, "", `/admin/news/${result.slug}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "保存できませんでした。入力内容は残っています。");
    } finally {
      setBusy(null);
      if (action !== "draft") setConfirmAction(null);
    }
  }

  const editorContent = useMemo(() => form.content || contentFromLegacy(form.body, form.image), [form.content, form.body, form.image]);
  const stateLabel = record?.published ? "公開中" : "下書き中";

  return <div data-unsaved={dirty}>
    <a href="/admin/news" className="cms-back">← お知らせ一覧</a>

    <div className="cms-editor-tabs" role="tablist" aria-label="記事の表示切り替え">
      <button type="button" role="tab" aria-selected={view === "edit"} aria-controls="news-edit-panel" onClick={() => setView("edit")}>編集</button>
      <button type="button" role="tab" aria-selected={view === "preview"} aria-controls="news-preview-panel" onClick={() => setView("preview")}>プレビュー</button>
    </div>

    <div aria-live="polite">{message && <p role="status" className="cms-notice">✓ {message}</p>}</div>
    {error && <div role="alert" className="cms-error">{error}{error.includes("ログイン") && <p><a href="/admin/login" target="_blank" rel="noreferrer">別のタブでログインする ↗</a></p>}</div>}

    {view === "edit" ? <div id="news-edit-panel" role="tabpanel" className="cms-editor-layout">
      <section className="cms-card cms-editor-fields" aria-label="記事の編集">
        <label className="cms-field cms-date-field">記事に表示する日付<input type="date" value={form.date} disabled={!!busy} onChange={(event) => update("date", event.target.value)} /><small>時刻指定や予約公開はありません。「公開する」を押すとすぐに公開されます。</small></label>
        <label className="cms-field cms-title-field">タイトル<input value={form.title} maxLength={50} placeholder="例：夏季休暇のお知らせ" onChange={(event) => update("title", event.target.value)} disabled={!!busy} /><small>{form.title.length} / 50文字</small></label>
        <div className="cms-field cms-body-field"><span>本文</span><RichTextEditor value={editorContent} disabled={!!busy} onChange={(content, body) => { setForm((current) => ({ ...current, content, body, image: null })); setMessage(""); setError(""); }} onError={setError} onUploading={(uploading) => setBusy(uploading ? "image" : null)} /><small>{form.body.length.toLocaleString()} / 30,000文字 · 画像は本文に表示された位置で公開されます。</small></div>
      </section>

      <aside className="cms-editor-aside">
        <section className="cms-card cms-settings">
          <h2>公開設定</h2>
          <div className="cms-state-row"><span className={`cms-badge ${record?.published ? "is-public" : "is-draft"}`}>{stateLabel}</span>{dirty && <small>未保存の変更</small>}</div>
          <div className="cms-save-note">{record?.published ? "「更新する」を押すと、編集内容がすぐに公開サイトへ反映されます。" : "下書き中の記事は公開サイトには表示されません。"}</div>
          <div className="cms-settings-actions">
            {record?.published ? <>
              <button className="cms-button cms-primary" type="button" disabled={!!busy} onClick={() => save("publish")}>{busy === "publish" ? "更新中…" : "更新する"}</button>
              <button className="cms-button cms-delete-button" type="button" disabled={!!busy} onClick={() => setConfirmAction("unpublish")}>非公開にする</button>
            </> : <>
              <button className="cms-button" type="button" disabled={!!busy} onClick={() => save("draft")}>{busy === "draft" ? "保存中…" : "下書きを保存する"}</button>
              <button className="cms-button cms-primary" type="button" disabled={!!busy} onClick={() => setConfirmAction("publish")}>{busy === "publish" ? "公開中…" : "公開する"}</button>
            </>}
          </div>
        </section>
      </aside>
    </div> : <section id="news-preview-panel" role="tabpanel" className="cms-card cms-inline-preview">
      <article className="cms-full-preview"><p>{formatNewsDate(form.date)}</p><h2>{form.title || "タイトル未入力"}</h2><ArticleBody content={form.content} body={form.body} image={form.image} /></article>
    </section>}

    <ConfirmDialog open={confirmAction === "publish"} title="この記事を公開しますか？" confirmLabel="公開する" busyLabel="公開中…" busy={busy === "publish"} onConfirm={() => save("publish")} onClose={() => { if (!busy) setConfirmAction(null); }}><p>公開すると、どなたでもこの記事を見られるようになります。</p></ConfirmDialog>
    <ConfirmDialog open={confirmAction === "unpublish"} title="この記事を非公開にしますか？" confirmLabel="非公開にする" tone="danger" busyLabel="変更中…" busy={busy === "unpublish"} onConfirm={() => save("unpublish")} onClose={() => { if (!busy) setConfirmAction(null); }}><p>非公開にすると、この記事は下書き中に戻ります。</p><p>公開サイトからは見られなくなります。</p></ConfirmDialog>
  </div>;
}
