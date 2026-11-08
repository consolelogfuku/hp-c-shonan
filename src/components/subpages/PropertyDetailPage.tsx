import Image from "@/components/AppImage";
import Link from "@/components/AppLink";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  emptyPropertyDetails,
  propertyImagePosition,
  propertyKindLabel,
  propertyStatusLabel,
  sectionForKind,
  type PropertyDetailRow,
  type PublicProperty,
} from "@/lib/cms/property-model";
import { SubpageFrame } from "./Shared";

function DetailImage({ image, caption }: { image: NonNullable<PublicProperty["property"]["image"]>; caption?: string }) {
  return <figure><div className="relative aspect-[3/2] overflow-hidden bg-tint"><Image src={image.src} alt={image.alt} fill sizes="(max-width:767px) 100vw, 50vw" className="object-contain" /></div>{(caption || image.alt) && <figcaption className="mt-3 whitespace-pre-wrap text-[14px] leading-[1.8] text-muted">{caption || image.alt}</figcaption>}</figure>;
}

function DetailRows({ rows }: { rows: PropertyDetailRow[] }) {
  return <dl className="mt-6 border-t border-line">{rows.filter(({ label, value }) => label && value).map(({ label, value }, index) => <div key={`${label}-${index}`} className="grid gap-1 border-b border-line py-4 text-[15px] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6 md:text-[16px]"><dt className="text-muted">{label}</dt><dd className="whitespace-pre-wrap">{value}</dd></div>)}</dl>;
}

export function PropertyDetailContent({ record, preview = false }: { record: PublicProperty; preview?: boolean }) {
  const property = record.property;
  const details = property.details ?? emptyPropertyDetails(property.kind);
  const section = sectionForKind(property.kind);
  const listHref = section === "sale" ? "/sale" : "/rent";
  const sectionLabel = section === "sale" ? "売買物件" : "賃貸物件・貸駐車場";
  const facts: PropertyDetailRow[] = property.kind === "sale"
    ? [{ label: "土地面積", value: property.landArea }, { label: "交通", value: property.access }, { label: "所在地", value: property.address }, { label: "物件種別", value: property.propertyType }, { label: "取引態様", value: property.dealType === "owner" ? "売主物件" : "仲介物件" }]
    : property.kind === "parking"
      ? [{ label: "所在地", value: property.address }, { label: "空き状況", value: property.vacancy == null ? "" : `${property.vacancy}台` }]
      : [{ label: "所在地", value: property.address }, { label: "交通", value: property.access }, { label: "間取り・広さ", value: property.layout }];
  const visibleFacts = facts.filter(({ value }) => value);
  const overviewRows = details.specifications;

  return <article className={preview ? "mx-auto max-w-[1180px] px-5 py-10 md:px-6" : "mx-auto max-w-[1180px] px-5 py-14 md:px-6 md:py-20"} aria-labelledby={preview ? undefined : "property-title"}>
    {!preview && <Link href={listHref} className="mb-8 inline-flex min-h-11 items-center gap-2 text-[15px] text-accent hover:underline hover:underline-offset-4"><ArrowLeft size={17} aria-hidden />{sectionLabel}一覧に戻る</Link>}
    <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1.16fr)_minmax(340px,.84fr)] lg:gap-14">
      <figure className="relative aspect-[3/2] overflow-hidden bg-[#e9eef1]">{property.image ? <Image src={property.image.src} alt={property.image.alt} fill priority={!preview} sizes="(max-width:1023px) 100vw, 58vw" className="object-cover" style={{ objectPosition: propertyImagePosition(property.image) }} /> : <div className="grid h-full place-items-center bg-[linear-gradient(145deg,#f7fafb,#e8f1f5)] text-accent"><span className="grid h-28 w-28 place-items-center rounded-full border border-accent/25 bg-white/70 text-[54px]" aria-hidden>{property.kind === "parking" ? "P" : "―"}</span></div>}</figure>
      <header><div className="flex flex-wrap items-center gap-2.5"><span className={property.status === "available" ? "inline-flex min-h-[34px] items-center bg-accent px-[13px] py-[5px] text-[15px] text-white" : "inline-flex min-h-[34px] items-center bg-[#e8edef] px-[13px] py-[5px] text-[15px] text-muted"}>{propertyStatusLabel(property)}</span><span className="inline-flex min-h-[34px] items-center border border-[#b8ccd7] px-[13px] py-[5px] text-[15px] text-accent">{propertyKindLabel(property.kind)}</span>{property.kind === "sale" && property.dealType === "owner" && <span className="inline-flex min-h-[34px] items-center border border-[#b8ccd7] px-[13px] py-[5px] text-[15px] text-accent">仲介手数料不要</span>}</div><h2 id={preview ? undefined : "property-title"} className="mt-5 text-[clamp(27px,3vw,38px)] leading-[1.55] text-[#213d50]">{property.title}</h2>{property.price && <p className="mt-4 text-[clamp(27px,3vw,36px)] font-medium tracking-[.02em] text-accent">{property.price}</p>}{property.description && <p className="mt-5 whitespace-pre-wrap text-[16px] leading-[2] text-muted">{property.description}</p>}{visibleFacts.length > 0 && <DetailRows rows={visibleFacts} />}</header>
    </div>

    {details.introduction && <section className="mt-12 border-t border-line pt-9 md:mt-16 md:pt-12" aria-labelledby="detail-introduction"><h3 id="detail-introduction" className="text-[24px] md:text-[28px]">物件について</h3><p className="mt-5 whitespace-pre-wrap text-[16px] leading-[2.1] text-muted md:text-[17px]">{details.introduction}</p></section>}
    {(details.sitePlan || details.referencePlan || details.sitePlanNote || details.referencePlanNote) && <section className="mt-12 border-t border-line pt-9 md:mt-16 md:pt-12" aria-labelledby="detail-plans"><h3 id="detail-plans" className="text-[24px] md:text-[28px]">全体図・参考プラン</h3><div className="mt-7 grid gap-9 md:grid-cols-2">{(details.sitePlan || details.sitePlanNote) && <div><h4 className="mb-4 text-[19px]">全体図・区画図</h4>{details.sitePlan && <DetailImage image={details.sitePlan} caption={details.sitePlanNote} />}{!details.sitePlan && details.sitePlanNote && <p className="whitespace-pre-wrap leading-[2] text-muted">{details.sitePlanNote}</p>}</div>}{(details.referencePlan || details.referencePlanNote) && <div><h4 className="mb-4 text-[19px]">参考プラン</h4>{details.referencePlan && <DetailImage image={details.referencePlan} caption={details.referencePlanNote} />}{!details.referencePlan && details.referencePlanNote && <p className="whitespace-pre-wrap leading-[2] text-muted">{details.referencePlanNote}</p>}</div>}</div></section>}
    {details.photos.length > 0 && <section className="mt-12 border-t border-line pt-9 md:mt-16 md:pt-12" aria-labelledby="detail-photos"><h3 id="detail-photos" className="text-[24px] md:text-[28px]">写真</h3><div className="mt-7 grid gap-x-6 gap-y-9 md:grid-cols-2 lg:grid-cols-3">{details.photos.map((photo, index) => <DetailImage key={`${photo.src}-${index}`} image={photo} />)}</div></section>}
    {details.nearby.some(({ label, value }) => label && value) && <section className="mt-12 border-t border-line pt-9 md:mt-16 md:pt-12" aria-labelledby="detail-nearby"><h3 id="detail-nearby" className="text-[24px] md:text-[28px]">周辺環境</h3><DetailRows rows={details.nearby} /></section>}
    {overviewRows.some(({ label, value }) => label && value) && <section className="mt-12 border-t border-line pt-9 md:mt-16 md:pt-12" aria-labelledby="detail-overview"><h3 id="detail-overview" className="text-[24px] md:text-[28px]">物件概要</h3><DetailRows rows={overviewRows} /></section>}
    {property.address && <section className="mt-12 border-t border-line pt-9 md:mt-16 md:pt-12" aria-labelledby="property-map"><h3 id="property-map" className="text-[24px] md:text-[28px]">所在地</h3><p className="mt-3 text-[16px] text-muted">{property.address}</p><div className="mt-6 aspect-[16/9] max-h-[520px] overflow-hidden border border-line bg-tint"><iframe title={`${property.title}の所在地`} src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed`} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></section>}
    <section className="mt-12 border border-line bg-white px-6 py-8 text-center md:mt-16 md:px-10 md:py-10" aria-label="お問い合わせ"><h3 className="text-[22px] md:text-[26px]">この物件についてお問い合わせ</h3><p className="mt-3 text-[15px] leading-[1.9] text-muted">空き状況や詳細について、お気軽にお問い合わせください。</p>{preview ? <span className="mt-6 inline-flex min-h-[52px] items-center justify-center gap-3 bg-accent px-7 text-[15px] text-white">お問い合わせへ<ArrowRight size={17} aria-hidden /></span> : <Link href="/contact/" className="mt-6 inline-flex min-h-[52px] items-center justify-center gap-3 bg-accent px-7 text-[15px] text-white transition-colors hover:bg-accent-hover">お問い合わせへ<ArrowRight size={17} aria-hidden /></Link>}</section>
  </article>;
}

export function PropertyDetailPage({ record }: { record: PublicProperty }) {
  const section = sectionForKind(record.property.kind);
  const listHref = section === "sale" ? "/sale" : "/rent";
  const sectionLabel = section === "sale" ? "売買物件" : "賃貸物件・貸駐車場";
  return <SubpageFrame hero={{ title: sectionLabel }}><PropertyDetailContent record={record} /></SubpageFrame>;
}

export function PropertyNotFoundPage({ section }: { section: "sale" | "rent" }) {
  const label = section === "sale" ? "売買物件" : "賃貸物件・貸駐車場";
  const href = section === "sale" ? "/sale" : "/rent";
  return <SubpageFrame hero={{ title: label }}><div className="mx-auto max-w-[900px] px-5 py-20 text-center"><h2 className="text-[28px]">物件が見つかりません</h2><p className="mt-4 text-muted">掲載が終了したか、非公開になった可能性があります。</p><Link href={href} className="mt-8 inline-flex min-h-12 items-center gap-2 border border-accent bg-white px-7 text-accent"><ArrowLeft size={16} aria-hidden />{label}一覧に戻る</Link></div></SubpageFrame>;
}
