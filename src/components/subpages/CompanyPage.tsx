import Image from "next/image";
import { site } from "@/lib/site";
import { SectionHead, SubpageFrame } from "./Shared";

const companyRows = [
  ["会社名", site.name], ["代表者", site.ceo], ["設立", site.founded], ["資本金", site.capital],
  ["所在地", `${site.postal} ${site.address}`], ["電話番号", site.tel], ["営業時間", `${site.hours}（定休日 ${site.closed}）`],
  ["免許・許可", site.licenses.join("\n")],
] as const;

export function CompanyPage() {
  return (
    <SubpageFrame hero={{ title: "会社案内", label: "Company", lead: "茅ヶ崎で、住まいと暮らしに向き合ってきました。", image: site.shopPhoto, imageAlt: "株式会社コミュニティ湘南の店舗外観", imagePosition: "center 55%" }}>
      <section className="px-5 py-20 md:px-6 md:py-28"><div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1fr_0.9fr] md:items-center md:gap-16"><figure className="relative aspect-[5/4] overflow-hidden"><Image src={site.shopPhoto} alt="株式会社コミュニティ湘南の店舗外観" fill sizes="(max-width:767px) 100vw, 52vw" className="object-cover" /></figure><div><h2 className="text-[clamp(28px,3vw,40px)] leading-[1.6]">茅ヶ崎の暮らしを、<br />地域のすぐそばで。</h2><p className="mt-6 leading-[2] text-muted">2000年の創業以来、土地探しから設計、施工、その後の暮らしまで、ご家族と長くお付き合いできる仕事を大切にしてきました。</p><div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center"><p><strong className="block text-[22px] text-accent">26年</strong><span className="text-[12px] text-muted">茅ヶ崎での歩み</span></p><p><strong className="block text-[22px] text-accent">200棟以上</strong><span className="text-[12px] text-muted">建築家と手がけた住まい</span></p><p><strong className="block text-[22px] text-accent">地域密着</strong><span className="text-[12px] text-muted">土地と暮らしのご相談</span></p></div></div></div></section>
      <section className="bg-tint/80 px-5 py-20 md:px-6 md:py-28"><div className="mx-auto max-w-[1280px]"><SectionHead title="会社概要" body="住まいと不動産に関するご相談を、ひとつの窓口で承ります。" /><dl className="grid border-t border-line md:grid-cols-[220px_1fr]">{companyRows.map(([dt,dd]) => <div key={dt} className="contents"><dt className="border-b border-line py-5 text-accent md:px-5">{dt}</dt><dd className="whitespace-pre-line border-b border-line py-5 text-muted md:px-5">{dd}</dd></div>)}</dl></div></section>
      <section className="px-5 py-20 md:px-6 md:py-28"><div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[0.72fr_1fr] md:gap-16"><div><h2 className="text-[clamp(28px,3vw,40px)]">アクセス</h2><address className="mt-6 not-italic leading-[2] text-muted">{site.postal}<br />{site.address}</address><dl className="mt-7 space-y-5"><div><dt className="text-accent">電車でお越しの方</dt><dd className="mt-1 text-muted">{site.access}</dd></div><div><dt className="text-accent">お車でお越しの方</dt><dd className="mt-1 text-muted">駐車場 {site.parking}</dd></div></dl></div><iframe className="h-[420px] w-full border-0" title="株式会社コミュニティ湘南の地図" src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></section>
    </SubpageFrame>
  );
}
