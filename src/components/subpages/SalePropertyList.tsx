import Image from "@/components/AppImage";
import Link from "@/components/AppLink";
import { useMemo, useState, type ReactNode } from "react";
import { propertyDetailHref, propertyImagePosition, propertyStatusLabel, type PublicProperty } from "@/lib/cms/property-model";

const PAGE_SIZE = 30;

function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return href ? <Link href={href} className="flex h-full flex-col">{children}</Link> : <div className="flex h-full flex-col">{children}</div>;
}

export function SalePropertyCard({ record, preview = false }: { record: PublicProperty; preview?: boolean }) {
  const property = record.property;
  const specs = [["土地面積", property.landArea], ["交通", property.access], ["所在地", property.address], ["種別", property.propertyType]].filter(([, value]) => value);
  const href = preview ? "" : propertyDetailHref(record);
  return <article className="group min-w-0"><CardLink href={href}>
    <figure className="sale-property-image relative h-[280px] overflow-hidden bg-[#e9eef1] md:h-[330px]">{property.image ? <Image src={property.image.src} alt={property.image.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 33vw" className="object-cover transition-transform duration-[450ms] group-hover:scale-[1.025]" style={{ objectPosition: propertyImagePosition(property.image) }} /> : <div className="flex h-full items-center justify-center bg-[linear-gradient(145deg,#f7fafb,#e8f1f5)] text-[15px] text-muted">画像はありません</div>}</figure>
    <div className="mt-5 flex flex-wrap items-center gap-2.5"><span className={property.status === "available" ? "inline-flex min-h-[34px] items-center bg-accent px-[13px] py-[5px] text-[15px] text-white" : "inline-flex min-h-[34px] items-center bg-[#e8edef] px-[13px] py-[5px] text-[15px] text-muted"}>{propertyStatusLabel(property)}</span><span className="inline-flex min-h-[34px] items-center border border-[#b8ccd7] px-[13px] py-[5px] text-[15px] text-accent">{property.dealType === "owner" ? "売主物件" : "仲介物件"}</span></div>
    <h2 className="mt-2.5 text-[21px] leading-[1.65]">{property.title}</h2>{property.price && <p className="mt-2.5 text-[22px] font-medium text-accent">{property.price}</p>}{property.description && <p className="mt-2 leading-[1.9] text-muted">{property.description}</p>}
    {specs.length > 0 && <dl className="mt-[18px] grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-4">{specs.map(([label, value]) => <div key={label}><dt className="text-[14px] text-muted">{label}</dt><dd className="mt-1 text-[16px] leading-[1.7]">{value}</dd></div>)}</dl>}
    {href && <span className="mt-auto inline-flex items-center gap-2 pt-[18px] text-[14px] text-accent">詳細を見る<span aria-hidden className="h-[9px] w-[9px] rotate-45 border-r-[1.5px] border-t-[1.5px] border-current" /></span>}
  </CardLink></article>;
}

export function SalePropertyList({ properties }: { properties: PublicProperty[] }) {
  const [status, setStatus] = useState<"all" | "available" | "closed">("all");
  const [type, setType] = useState<"all" | "owner" | "broker">("all");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => properties.filter(({ property }) => (status === "all" || property.status === status) && (type === "all" || property.dealType === type)), [properties, status, type]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const reset = () => { setStatus("all"); setType("all"); setPage(1); };
  const selectClass = "min-h-11 w-full border border-[#b9cbd4] bg-white px-[14px] py-2 text-[15px]";
  return <section className="px-5 pb-[78px] pt-14 md:px-6 md:pb-28 md:pt-[76px]" aria-label="売買物件一覧"><div className="mx-auto max-w-[1280px]">
    <div className="mb-[34px] grid gap-4 border border-line bg-tint/70 p-[18px] md:grid-cols-[repeat(2,minmax(180px,280px))] md:gap-[18px] md:px-5"><label className="grid gap-[7px]"><span className="text-[14px] text-muted">販売状況</span><select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }} aria-label="販売状況で絞り込む" className={selectClass}><option value="all">すべて</option><option value="available">販売中</option><option value="closed">成約済み</option></select></label><label className="grid gap-[7px]"><span className="text-[14px] text-muted">取引態様</span><select value={type} onChange={(event) => { setType(event.target.value as typeof type); setPage(1); }} aria-label="取引態様で絞り込む" className={selectClass}><option value="all">すべて</option><option value="owner">売主物件</option><option value="broker">仲介物件</option></select></label></div>
    <p className="mb-6 text-[15px] text-muted" aria-live="polite"><strong className="mr-1 text-[24px] font-medium text-accent">{filtered.length}</strong>件の物件</p>
    {visible.length ? <div className="sale-property-grid grid grid-cols-1 gap-x-7 gap-y-[58px] md:grid-cols-2">{visible.map((record) => <SalePropertyCard key={record.slug} record={record} />)}</div> : <div className="mt-7 border border-line px-6 py-[52px] text-center"><p className="text-muted">選択した条件に一致する物件はありません。</p><button type="button" onClick={reset} className="mt-[18px] border border-accent px-[18px] py-2.5 text-accent">すべての物件を表示</button></div>}
    {totalPages > 1 && <nav className="mt-12 flex items-center justify-center gap-2 md:mt-[68px]" aria-label="売買物件のページ"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="min-h-11 border border-line bg-white px-[14px]">前へ</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={pageNumber === currentPage ? "page" : undefined} className="min-h-11 min-w-11 border border-line bg-white aria-[current=page]:bg-accent aria-[current=page]:text-white">{pageNumber}</button>)}<button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="min-h-11 border border-line bg-white px-[14px]">次へ</button></nav>}
  </div></section>;
}
