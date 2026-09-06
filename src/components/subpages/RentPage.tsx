import Link from "next/link";
import { parkingLots, rentals } from "@/lib/site";
import { IMG, ListingCard, SectionHead, Status, SubpageFrame } from "./Shared";

const rentalImages = [
  `${IMG}/page/418-20200927131701.png`,
  `${IMG}/page/329-20200618143126.jpg`,
  `${IMG}/page/237-20191227135758.jpg`,
];

export function RentPage() {
  return (
    <SubpageFrame hero={{ title: "賃貸物件・貸駐車場", label: "Rent and parking", lead: "住まいも仕事場も駐車場も、地域を知る私たちがご案内します。", image: `${IMG}/units/img/7942-5-20200207101750_b5e3cbabe744a4.jpg`, imageAlt: "茅ヶ崎の住宅街にある住まい", imagePosition: "center 54%" }}>
      <nav className="border-b border-line bg-white/70" aria-label="賃貸物件ページ内"><ul className="mx-auto flex max-w-[1280px] justify-center px-5 md:px-6"><li><Link href="#rental-homes" className="block min-w-40 px-6 py-5 text-center hover:text-accent">賃貸物件</Link></li><li><Link href="#parking" className="block min-w-40 px-6 py-5 text-center hover:text-accent">貸駐車場</Link></li></ul></nav>
      <section id="rental-homes" className="scroll-mt-20 px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead title="賃貸物件" body="居住用から貸事務所・貸店舗まで、茅ヶ崎の物件をご紹介します。" />
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {rentals.map((item, index) => <ListingCard key={item.title} image={rentalImages[index]} imageAlt={`${item.title}の外観`} title={item.title} body={item.body} href={item.href} linkLabel="物件を見る" meta={<><Status muted>ご成約済み</Status><span>{item.category}</span></>} />)}
          </div>
        </div>
      </section>
      <section id="parking" className="scroll-mt-20 bg-tint/80 px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead title="貸駐車場" body="茅ヶ崎市内の月極駐車場をご案内しています。" />
          <div className="grid gap-4 md:grid-cols-2">
            {parkingLots.map((lot) => <article key={lot.name} className="grid grid-cols-[1fr_auto] items-center gap-6 bg-white p-6 md:p-8"><div><h3 className="text-[21px]">{lot.name}</h3><address className="mt-2 not-italic text-[14px] text-muted">{lot.address}</address><p className="mt-3 text-[16px] text-accent">{lot.price}</p></div><p className={`whitespace-nowrap px-3 py-2 text-[14px] ${lot.vacancy ? "bg-accent text-white" : "bg-[#e8edef] text-muted"}`}>{lot.vacancy ? `空き ${lot.vacancy}台` : "満車"}</p></article>)}
          </div>
        </div>
      </section>
    </SubpageFrame>
  );
}
