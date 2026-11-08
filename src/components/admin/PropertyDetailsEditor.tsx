import { useRef, useState, type DragEvent } from "react";
import AppImage from "@/components/AppImage";
import { prepareUpload } from "@/lib/cms/image-upload";
import type { PropertyDetailRow, PropertyDetails, PropertyImage } from "@/lib/cms/property-model";

type Props = {
  value: PropertyDetails;
  disabled: boolean;
  onChange: (value: PropertyDetails) => void;
  onError: (message: string) => void;
  onUploading: (uploading: boolean) => void;
};

async function uploadFile(file: File) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) throw new Error("8MB以下のJPEG・PNG・WebP画像を選んでください。");
  const image = await prepareUpload(file);
  const data = new FormData();
  data.set("image", image, "image.webp");
  const response = await fetch("/api/admin/media", { method: "POST", body: data });
  const result = await response.json() as { src?: string; error?: string };
  if (!response.ok || !result.src) throw new Error(result.error || "画像を追加できませんでした。");
  return { src: result.src, alt: "", focalX: 50, focalY: 50 } satisfies PropertyImage;
}

function DetailImageField({ label, help, image, disabled, onChange, upload }: { label: string; help: string; image: PropertyImage | null; disabled: boolean; onChange: (image: PropertyImage | null) => void; upload: (file: File) => Promise<PropertyImage | null> }) {
  const picker = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  async function choose(file?: File) { if (file) { const added = await upload(file); if (added) onChange(added); } }
  function drop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files[0]); }
  return <div className="cms-detail-image-field"><div><b>{label}</b><p>{help}</p></div>{image ? <div className="cms-detail-image-preview"><AppImage src={image.src} alt={image.alt} width={900} height={600} /><button type="button" className="cms-image-remove" disabled={disabled} aria-label={`${label}を削除`} title={`${label}を削除`} onClick={() => onChange(null)}><span aria-hidden>×</span></button></div> : <div className={`cms-detail-image-empty ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop}><span>画像をここにドロップ</span></div>}<button type="button" className="cms-button" disabled={disabled} onClick={() => picker.current?.click()}>{image ? "画像を変更" : "画像を選択"}</button><input ref={picker} className="cms-sr" type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} onChange={(event) => { choose(event.target.files?.[0]); event.target.value = ""; }} />{image && <label className="cms-field">画像の説明（任意）<input value={image.alt} maxLength={200} disabled={disabled} onChange={(event) => onChange({ ...image, alt: event.target.value })} /></label>}</div>;
}

function RowsEditor({ title, help, rows, disabled, addLabel, onChange }: { title: string; help: string; rows: PropertyDetailRow[]; disabled: boolean; addLabel: string; onChange: (rows: PropertyDetailRow[]) => void }) {
  function update(index: number, key: keyof PropertyDetailRow, value: string) { onChange(rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row)); }
  return <section className="cms-detail-form-section"><div><h3>{title}</h3><p>{help}</p></div><div className="cms-detail-rows">{rows.map((row, index) => <div className="cms-detail-row" key={`${title}-${index}`}><label className="cms-field"><span>項目名</span><input value={row.label} maxLength={60} disabled={disabled} placeholder={title === "周辺環境" ? "例：茅ヶ崎小学校" : "例：土地権利"} onChange={(event) => update(index, "label", event.target.value)} /></label><label className="cms-field"><span>内容</span><input value={row.value} maxLength={500} disabled={disabled} placeholder={title === "周辺環境" ? "例：約650m" : "例：所有権"} onChange={(event) => update(index, "value", event.target.value)} /></label><button type="button" className="cms-image-remove cms-row-remove" disabled={disabled} aria-label={`${row.label || "項目"}を削除`} onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))}><span aria-hidden>×</span></button></div>)}</div><button type="button" className="cms-button cms-add-row" disabled={disabled} onClick={() => onChange([...rows, { label: "", value: "" }])}>＋ {addLabel}</button></section>;
}

export function PropertyDetailsEditor({ value, disabled, onChange, onError, onUploading }: Props) {
  const photoPicker = useRef<HTMLInputElement>(null);
  async function upload(file: File) {
    if (disabled) return null;
    onUploading(true); onError("");
    try { return await uploadFile(file); }
    catch (error) { onError(error instanceof Error ? error.message : "画像を追加できませんでした。"); return null; }
    finally { onUploading(false); }
  }
  async function addPhoto(file?: File) { if (!file) return; if (value.photos.length >= 30) { onError("詳細写真は30枚まで追加できます。"); return; } const image = await upload(file); if (image) onChange({ ...value, photos: [...value.photos, image] }); }
  return <div className="cms-property-details-editor">
    <header className="cms-form-section-heading"><span>2</span><div><h2>詳細ページに表示する内容</h2><p>物件を開いたときに表示する、詳しい情報を入力します。</p></div></header>
    <label className="cms-field"><span>詳しい紹介文</span><textarea value={value.introduction} maxLength={10000} disabled={disabled} placeholder="立地や日当たり、暮らしやすさなど、物件の特徴を詳しく入力してください。" onChange={(event) => onChange({ ...value, introduction: event.target.value })} /><small>{value.introduction.length.toLocaleString()} / 10,000文字</small></label>
    <div className="cms-detail-image-grid">
      <DetailImageField label="全体図・区画図" help="土地や区画全体が分かる図面を登録します。" image={value.sitePlan} disabled={disabled} upload={upload} onChange={(sitePlan) => onChange({ ...value, sitePlan })} />
      <DetailImageField label="参考プラン" help="間取りや建物の参考プランを登録します。" image={value.referencePlan} disabled={disabled} upload={upload} onChange={(referencePlan) => onChange({ ...value, referencePlan })} />
    </div>
    <div className="cms-property-fields-two"><label className="cms-field"><span>全体図の補足（任意）</span><textarea value={value.sitePlanNote} maxLength={2000} disabled={disabled} placeholder="例：図面と現況が異なる場合は現況を優先します。" onChange={(event) => onChange({ ...value, sitePlanNote: event.target.value })} /></label><label className="cms-field"><span>参考プランの補足（任意）</span><textarea value={value.referencePlanNote} maxLength={3000} disabled={disabled} placeholder="プラン面積や間取りの特徴などを入力してください。" onChange={(event) => onChange({ ...value, referencePlanNote: event.target.value })} /></label></div>
    <section className="cms-detail-form-section"><div><h3>写真</h3><p>現地、建物、室内、前面道路などの写真を追加します。</p></div>{value.photos.length > 0 && <div className="cms-detail-photo-grid">{value.photos.map((photo, index) => <div className="cms-detail-photo" key={`${photo.src}-${index}`}><div><AppImage src={photo.src} alt={photo.alt} width={600} height={400} /><button type="button" className="cms-image-remove" disabled={disabled} aria-label={`写真${index + 1}を削除`} onClick={() => onChange({ ...value, photos: value.photos.filter((_, photoIndex) => photoIndex !== index) })}><span aria-hidden>×</span></button></div><label className="cms-field"><span>写真の説明</span><input value={photo.alt} maxLength={200} disabled={disabled} placeholder="例：南側から見た現地" onChange={(event) => onChange({ ...value, photos: value.photos.map((item, photoIndex) => photoIndex === index ? { ...item, alt: event.target.value } : item) })} /></label></div>)}</div>}<button type="button" className="cms-button" disabled={disabled} onClick={() => photoPicker.current?.click()}>＋ 写真を追加</button><small>最大30枚 · JPEG / PNG / WebP · 1枚8MBまで</small><input ref={photoPicker} className="cms-sr" type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} onChange={(event) => { addPhoto(event.target.files?.[0]); event.target.value = ""; }} /></section>
    <RowsEditor title="周辺環境" help="学校、買い物、病院など、施設名と距離を入力します。" rows={value.nearby} disabled={disabled} addLabel="周辺施設を追加" onChange={(nearby) => onChange({ ...value, nearby })} />
    <RowsEditor title="物件概要" help="必要な項目だけ入力してください。空欄の項目は公開ページに表示されません。" rows={value.specifications} disabled={disabled} addLabel="概要項目を追加" onChange={(specifications) => onChange({ ...value, specifications })} />
    <section className="cms-detail-form-section"><div><h3>地図</h3><p>「所在地」に入力した住所から、詳細ページへ地図を自動表示します。</p></div></section>
  </div>;
}
