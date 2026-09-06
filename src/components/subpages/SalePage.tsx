import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { featured } from "@/lib/site";
import { IMG, ListingCard, SectionHead, Status, SubpageFrame } from "./Shared";

const pastSales = [
  [`${IMG}/units/img/12847-11-20251025121137_b68fc3fe9c270b.JPG`, "茅ヶ崎市矢畑 新築戸建", "高い勾配天井と大きな窓を備えた、開放感のある住まい。"],
  [`${IMG}/units/img/9167-10-20200829120339_b5f49c58b2d65f.jpg`, "茅ヶ崎市矢畑 A号棟", "通風・採光・眺望を生かして計画した新築戸建て。"],
  [`${IMG}/units/img/10249-10-20210823155914_b61234742609c0.jpg`, "茅ヶ崎市東海岸北2丁目", "駅や海へ歩ける、暮らしやすい住宅地の物件。"],
  [`${IMG}/page/424-20201101144725.jpg`, "茅ヶ崎市西久保 新築戸建て", "高い天井とフルフラットバルコニーのある住まい。"],
] as const;

export function SalePage() {
  return (
    <SubpageFrame
      hero={{
        title: "売買物件",
        label: "Sale",
        lead: "茅ヶ崎で、土地と住まいの可能性を一緒に考えます。",
        image: featured.image,
        imageAlt: "茅ヶ崎市矢畑の販売中の土地",
      }}
    >
      <section className="px-5 py-20 md:px-6 md:py-28">
        <article className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-16">
          <figure className="relative aspect-[4/3] overflow-hidden bg-tint">
            <Image src={featured.image} alt={featured.imageAlt} fill sizes="(max-width: 767px) 100vw, 58vw" className="object-cover" />
          </figure>
          <div>
            <div className="flex items-center gap-3 text-[13px] text-muted"><Status>{featured.status}</Status><span>{featured.dealType}</span></div>
            <h2 className="mt-5 text-[clamp(28px,3vw,40px)] leading-[1.5]">茅ヶ崎市矢畑売地<br />小島矢畑B区画</h2>
            <p className="mt-5 leading-[2] text-muted">{featured.body}</p>
            <p className="mt-5 text-[28px] text-accent">{featured.price}</p>
            <dl className="mt-6 border-t border-line">
              {featured.specs.map((spec) => <div key={spec.label} className="grid grid-cols-[100px_1fr] gap-4 border-b border-line py-3 text-[14px]"><dt className="text-muted">{spec.label}</dt><dd>{spec.value}</dd></div>)}
            </dl>
            <Link href={featured.href} className="mt-7 inline-flex h-[52px] items-center gap-2 bg-accent px-7 text-[15px] text-white hover:bg-accent-hover">物件の詳細を見る<ArrowRight size={16} aria-hidden /></Link>
          </div>
        </article>
      </section>
      <section className="bg-tint/80 px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead title="これまでの取扱物件" body="土地の特徴を読み、ご家族の暮らしまで見据えた住まいをご提案してきました。" />
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {pastSales.map(([image, title, body]) => <ListingCard key={title} image={image} imageAlt={title} title={title} body={body} meta={<><Status muted>ご成約済み</Status><span>売主</span></>} />)}
          </div>
        </div>
      </section>
    </SubpageFrame>
  );
}
