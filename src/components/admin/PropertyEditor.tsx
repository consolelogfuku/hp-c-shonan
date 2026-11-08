import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent,
} from "react";
import AppImage from "@/components/AppImage";
import { RentPropertyCard } from "@/components/subpages/RentPropertyList";
import { SalePropertyCard } from "@/components/subpages/SalePropertyList";
import { PropertyDetailContent } from "@/components/subpages/PropertyDetailPage";
import { ConfirmDialog } from "./ConfirmDialog";
import { PropertyDetailsEditor } from "./PropertyDetailsEditor";
import { prepareUpload } from "@/lib/cms/image-upload";
import {
  emptyProperty,
  emptyPropertyDetails,
  propertyImagePosition,
  type AdminProperty,
  type PropertyInput,
  type PropertySaveAction,
  type PropertySection,
} from "@/lib/cms/property-model";

function PropertyPreview({ property }: { property: PropertyInput }) {
  const record = {
    slug: "preview",
    property: {
      ...property,
      title: property.title || "物件名未入力",
      linkUrl: "",
    },
  };
  return (
    <div className="cms-public-property-preview">
      {property.kind === "sale" ? (
        <SalePropertyCard record={record} preview />
      ) : (
        <RentPropertyCard record={record} preview />
      )}
    </div>
  );
}

function PropertyPagePreview({ property }: { property: PropertyInput }) {
  return <div className="cms-public-detail-preview"><PropertyDetailContent record={{ slug: "preview", property: { ...property, title: property.title || "物件名未入力" } }} preview /></div>;
}

export function PropertyEditor({
  initial,
  section,
}: {
  initial: AdminProperty | null;
  section: PropertySection;
}) {
  const [record, setRecord] = useState(initial);
  const [form, setForm] = useState<PropertyInput>(() => {
    const blank = emptyProperty(section);
    return initial ? { ...blank, ...initial.property } : blank;
  });
  const [baseline, setBaseline] = useState(JSON.stringify(form));
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [previewTarget, setPreviewTarget] = useState<"thumbnail" | "detail">("thumbnail");
  const [busy, setBusy] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<
    "publish" | "unpublish" | null
  >(null);
  const picker = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(form) !== baseline;
  const base = section === "sale" ? "/admin/sale" : "/admin/rent";
  const listLabel = section === "sale" ? "売買物件一覧" : "賃貸・駐車場一覧";

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update<K extends keyof PropertyInput>(
    key: K,
    value: PropertyInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
    setError("");
  }

  function changeKind(kind: PropertyInput["kind"]) {
    setForm((current) => ({
      ...current,
      kind,
      status:
        kind === "parking"
          ? current.vacancy && current.vacancy > 0
            ? "available"
            : "closed"
          : current.status,
      dealType: kind === "sale" ? (current.dealType ?? "owner") : null,
      image: kind === "parking" ? null : current.image,
      vacancy: kind === "parking" ? (current.vacancy ?? 0) : null,
      description: kind === "parking" ? "" : current.description,
      details: current.kind === kind ? current.details : emptyPropertyDetails(kind),
    }));
    setMessage("");
    setError("");
  }

  async function upload(file: File) {
    if (busy) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError("8MB以下のJPEG・PNG・WebP画像を選んでください。");
      return;
    }
    setBusy("image");
    setError("");
    try {
      const image = await prepareUpload(file);
      const data = new FormData();
      data.set("image", image, "image.webp");
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as {
        src?: string;
        error?: string;
      };
      if (!response.ok || !result.src)
        throw new Error(result.error || "画像を追加できませんでした。");
      update("image", {
        src: result.src,
        alt: form.image?.alt ?? "",
        focalX: 50,
        focalY: 50,
      });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "画像を追加できませんでした。",
      );
    } finally {
      setBusy(null);
    }
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) upload(file);
  }

  function setImageFocus(event: MouseEvent<HTMLButtonElement>) {
    if (!form.image) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const focalX = Math.round(
      ((event.clientX - bounds.left) / bounds.width) * 100,
    );
    const focalY = Math.round(
      ((event.clientY - bounds.top) / bounds.height) * 100,
    );
    update("image", { ...form.image, focalX, focalY });
  }

  async function save(action: PropertySaveAction) {
    if (busy) return;
    setBusy(action);
    setError("");
    setMessage("");
    try {
      const response = await fetch(
        record
          ? `/api/admin/properties/${record.slug}`
          : "/api/admin/properties",
        {
          method: record ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section,
            version: record?.version,
            action,
            property: form,
          }),
        },
      );
      const result = (await response.json()) as AdminProperty & {
        error?: string;
      };
      if (!response.ok)
        throw new Error(result.error || "保存できませんでした。");
      setRecord(result);
      setForm(result.property);
      setBaseline(JSON.stringify(result.property));
      setMessage(
        action === "publish"
          ? record?.published
            ? "更新しました。公開サイトに反映されています。"
            : "公開しました。公開サイトに反映されています。"
          : action === "unpublish"
            ? "非公開にしました。下書き中に戻りました。"
            : "下書きを保存しました。",
      );
      if (!record)
        window.history.replaceState(null, "", `${base}/${result.slug}`);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "保存できませんでした。入力内容は残っています。",
      );
    } finally {
      setBusy(null);
      if (action !== "draft") setConfirmAction(null);
    }
  }

  return (
    <div data-unsaved={dirty}>
      <a href={base} className="cms-back">
        ← {listLabel}
      </a>
      <div
        className="cms-editor-tabs"
        role="tablist"
        aria-label="物件の表示切り替え"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === "edit"}
          onClick={() => setView("edit")}
        >
          編集
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "preview"}
          onClick={() => setView("preview")}
        >
          プレビュー
        </button>
      </div>
      <div aria-live="polite">
        {message && (
          <p role="status" className="cms-notice">
            ✓ {message}
          </p>
        )}
      </div>
      {error && (
        <div role="alert" className="cms-error">
          {error}
        </div>
      )}

      {view === "edit" ? (
        <div className="cms-editor-layout">
          <section
            className="cms-card cms-editor-fields"
            aria-label="物件の編集"
          >
            <header className="cms-form-section-heading"><span>1</span><div><h2>一覧（サムネイル）に表示する内容</h2><p>物件一覧で最初に見える画像と基本情報を入力します。</p></div></header>
            {section === "rent" && (
              <label className="cms-field">
                種別
                <select
                  value={form.kind}
                  disabled={!!busy}
                  onChange={(event) =>
                    changeKind(event.target.value as PropertyInput["kind"])
                  }
                >
                  <option value="residential">居住用</option>
                  <option value="commercial">貸店舗・事務所</option>
                  <option value="parking">貸駐車場</option>
                </select>
              </label>
            )}
            <label className="cms-field cms-title-field">
              物件名
              <input
                value={form.title}
                maxLength={80}
                placeholder={
                  form.kind === "parking"
                    ? "例：萩園駐車場"
                    : "例：茅ヶ崎市矢畑 売地"
                }
                disabled={!!busy}
                onChange={(event) => update("title", event.target.value)}
              />
              <small>{form.title.length} / 80文字</small>
            </label>
            <div className="cms-property-fields-two">
              {form.kind !== "parking" && (
                <label className="cms-field">
                  {form.kind === "sale" ? "販売状況" : "募集状況"}
                  <select
                    value={form.status}
                    disabled={!!busy}
                    onChange={(event) =>
                      update(
                        "status",
                        event.target.value as PropertyInput["status"],
                      )
                    }
                  >
                    <option value="available">
                      {form.kind === "sale" ? "販売中" : "募集中"}
                    </option>
                    <option value="closed">成約済み</option>
                  </select>
                </label>
              )}
              {form.kind === "sale" && (
                <label className="cms-field">
                  取引態様
                  <select
                    value={form.dealType ?? "owner"}
                    disabled={!!busy}
                    onChange={(event) =>
                      update(
                        "dealType",
                        event.target.value as "owner" | "broker",
                      )
                    }
                  >
                    <option value="owner">売主物件</option>
                    <option value="broker">仲介物件</option>
                  </select>
                </label>
              )}
              <label className="cms-field">
                価格・賃料
                <input
                  value={form.price}
                  maxLength={60}
                  placeholder={
                    form.kind === "sale" ? "例：2,780万円" : "例：7,000円/月"
                  }
                  disabled={!!busy}
                  onChange={(event) => update("price", event.target.value)}
                />
              </label>
              {form.kind === "parking" && (
                <label className="cms-field">
                  空き台数
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={form.vacancy ?? ""}
                    disabled={!!busy}
                    onChange={(event) => {
                      const vacancy =
                        event.target.value === ""
                          ? null
                          : Number(event.target.value);
                      setForm((current) => ({
                        ...current,
                        vacancy,
                        status: vacancy && vacancy > 0 ? "available" : "closed",
                      }));
                      setMessage("");
                      setError("");
                    }}
                  />
                  <small>
                    1台以上で「募集中」、0台で「満車」と表示します。
                  </small>
                </label>
              )}
            </div>
            <label className="cms-field">
              所在地
              <input
                value={form.address}
                maxLength={200}
                placeholder="例：茅ヶ崎市矢畑254-1"
                disabled={!!busy}
                onChange={(event) => update("address", event.target.value)}
              />
            </label>
            {form.kind !== "parking" && (
              <>
                <label className="cms-field">
                  交通
                  <input
                    value={form.access}
                    maxLength={200}
                    placeholder="例：茅ヶ崎駅 徒歩22分"
                    disabled={!!busy}
                    onChange={(event) => update("access", event.target.value)}
                  />
                </label>
                <div className="cms-property-fields-two">
                  {form.kind === "sale" ? (
                    <>
                      <label className="cms-field">
                        土地面積
                        <input
                          value={form.landArea}
                          maxLength={100}
                          placeholder="例：135.17㎡"
                          disabled={!!busy}
                          onChange={(event) =>
                            update("landArea", event.target.value)
                          }
                        />
                      </label>
                      <label className="cms-field">
                        物件種別
                        <input
                          value={form.propertyType}
                          maxLength={100}
                          placeholder="例：建築条件付売地"
                          disabled={!!busy}
                          onChange={(event) =>
                            update("propertyType", event.target.value)
                          }
                        />
                      </label>
                    </>
                  ) : (
                    <label className="cms-field">
                      間取り・広さ
                      <input
                        value={form.layout}
                        maxLength={100}
                        placeholder="例：3LDK / 65.2㎡"
                        disabled={!!busy}
                        onChange={(event) =>
                          update("layout", event.target.value)
                        }
                      />
                    </label>
                  )}
                </div>
                <label className="cms-field">
                  一覧に表示する説明（任意）
                  <textarea
                    value={form.description}
                    maxLength={2000}
                    placeholder="一覧で伝えたい物件の特徴を短く入力してください。"
                    disabled={!!busy}
                    onChange={(event) =>
                      update("description", event.target.value)
                    }
                  />
                  <small>
                    {form.description.length.toLocaleString()} / 2,000文字
                  </small>
                </label>
                <div className="cms-field">
                  <span>画像</span>
                  <div
                    className={`cms-property-image-upload ${dragging ? "is-dragging" : ""}`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={drop}
                  >
                    {form.image ? (
                      <div className="cms-uploaded cms-property-photo-editor">
                        <div className="cms-focus-heading">
                          <div>
                            <b>画像の表示位置を調整</b>
                            <p>
                              写真の中で、中央にしたい箇所をクリックしてください。
                            </p>
                          </div>
                          <button
                            type="button"
                            className="cms-button cms-focus-reset"
                            disabled={!!busy}
                            onClick={() =>
                              update(
                                "image",
                                form.image
                                  ? { ...form.image, focalX: 50, focalY: 50 }
                                  : null,
                              )
                            }
                          >
                            カーソルを元に戻す
                          </button>
                        </div>
                        <div className="cms-focus-stage-wrap">
                          <button
                            type="button"
                            className="cms-focus-stage"
                            disabled={!!busy}
                            aria-label="一覧画像の中央にする場所を選ぶ"
                            onClick={setImageFocus}
                            style={
                              {
                                "--focus-x": `${form.image.focalX ?? 50}%`,
                                "--focus-y": `${form.image.focalY ?? 50}%`,
                              } as CSSProperties
                            }
                          >
                            <AppImage
                              src={form.image.src}
                              alt={form.image.alt}
                              fill
                              style={{
                                objectPosition: propertyImagePosition(
                                  form.image,
                                ),
                              }}
                            />
                            <span className="cms-focus-point" aria-hidden />
                            <span className="cms-focus-help">
                              クリックした場所が一覧画像の中央になります
                            </span>
                          </button>
                          <button
                            type="button"
                            className="cms-image-remove"
                            disabled={!!busy}
                            aria-label="画像を削除"
                            title="画像を削除"
                            onClick={() => update("image", null)}
                          >
                            <span aria-hidden>×</span>
                          </button>
                        </div>
                        <div className="cms-focus-preview-block">
                          <p>
                            公開サイトの物件一覧では、実際に次のように表示されます。
                          </p>
                          <div
                            className="cms-focus-previews"
                            aria-label="公開サイトでの実際の表示"
                          >
                            <figure>
                              <AppImage
                                src={form.image.src}
                                alt=""
                                fill
                                style={{
                                  objectPosition: propertyImagePosition(
                                    form.image,
                                  ),
                                }}
                              />
                              <figcaption>パソコンでの表示</figcaption>
                            </figure>
                            <figure>
                              <AppImage
                                src={form.image.src}
                                alt=""
                                fill
                                style={{
                                  objectPosition: propertyImagePosition(
                                    form.image,
                                  ),
                                }}
                              />
                              <figcaption>スマートフォンでの表示</figcaption>
                            </figure>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>
                        {busy === "image"
                          ? "画像を追加しています…"
                          : "画像をここにドロップ"}
                      </p>
                    )}
                    <button
                      type="button"
                      className="cms-button"
                      disabled={!!busy}
                      onClick={() => picker.current?.click()}
                    >
                      {form.image ? "別の画像に変更" : "ファイルを選択"}
                    </button>
                    <small>JPEG / PNG / WebP · 8MBまで</small>
                    <input
                      ref={picker}
                      className="cms-sr"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={!!busy}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) upload(file);
                        event.target.value = "";
                      }}
                    />
                  </div>
                  {form.image && (
                    <label className="cms-field">
                      画像の説明（任意）
                      <input
                        value={form.image.alt}
                        maxLength={200}
                        disabled={!!busy}
                        onChange={(event) =>
                          update(
                            "image",
                            form.image
                              ? { ...form.image, alt: event.target.value }
                              : null,
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              </>
            )}
            <PropertyDetailsEditor value={form.details ?? emptyPropertyDetails(form.kind)} disabled={!!busy} onChange={(details) => update("details", details)} onError={setError} onUploading={(uploading) => setBusy(uploading ? "detail-image" : null)} />
          </section>
          <aside className="cms-editor-aside">
            <section className="cms-card cms-settings">
              <h2>公開設定</h2>
              <div className="cms-state-row">
                <span
                  className={`cms-badge ${record?.published ? "is-public" : "is-draft"}`}
                >
                  {record?.published ? "公開中" : "下書き中"}
                </span>
                {dirty && <small>未保存の変更</small>}
              </div>
              <div className="cms-save-note">
                {record?.published
                  ? "「更新する」を押すと、編集内容がすぐに公開サイトへ反映されます。"
                  : "下書き中の物件は公開サイトには表示されません。"}
              </div>
              <div className="cms-settings-actions">
                {record?.published ? (
                  <>
                    <button
                      className="cms-button cms-primary"
                      type="button"
                      disabled={!!busy}
                      onClick={() => save("publish")}
                    >
                      {busy === "publish" ? "更新中…" : "更新する"}
                    </button>
                    <button
                      className="cms-button cms-delete-button"
                      type="button"
                      disabled={!!busy}
                      onClick={() => setConfirmAction("unpublish")}
                    >
                      非公開にする
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="cms-button"
                      type="button"
                      disabled={!!busy}
                      onClick={() => save("draft")}
                    >
                      {busy === "draft" ? "保存中…" : "下書きを保存する"}
                    </button>
                    <button
                      className="cms-button cms-primary"
                      type="button"
                      disabled={!!busy}
                      onClick={() => setConfirmAction("publish")}
                    >
                      公開する
                    </button>
                  </>
                )}
              </div>
            </section>
          </aside>
        </div>
      ) : (
        <section className="cms-card cms-inline-preview">
          <div className="cms-preview-target-tabs" role="tablist" aria-label="プレビューする画面"><button type="button" role="tab" aria-selected={previewTarget === "thumbnail"} onClick={() => setPreviewTarget("thumbnail")}>一覧（サムネイル）</button><button type="button" role="tab" aria-selected={previewTarget === "detail"} onClick={() => setPreviewTarget("detail")}>詳細ページ</button></div>
          {previewTarget === "thumbnail" ? <PropertyPreview property={form} /> : <PropertyPagePreview property={form} />}
        </section>
      )}

      <ConfirmDialog
        open={confirmAction === "publish"}
        title="この物件を公開しますか？"
        confirmLabel="公開する"
        busyLabel="公開中…"
        busy={busy === "publish"}
        onConfirm={() => save("publish")}
        onClose={() => {
          if (!busy) setConfirmAction(null);
        }}
      >
        <p>公開すると、どなたでもこの物件を見られるようになります。</p>
      </ConfirmDialog>
      <ConfirmDialog
        open={confirmAction === "unpublish"}
        title="この物件を非公開にしますか？"
        confirmLabel="非公開にする"
        tone="danger"
        busyLabel="変更中…"
        busy={busy === "unpublish"}
        onConfirm={() => save("unpublish")}
        onClose={() => {
          if (!busy) setConfirmAction(null);
        }}
      >
        <p>非公開にすると、この物件は下書き中に戻ります。</p>
        <p>公開サイトからは見られなくなります。</p>
      </ConfirmDialog>
    </div>
  );
}
