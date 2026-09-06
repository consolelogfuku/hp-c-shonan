import { works } from "@/lib/site";
import { IMG, ListingCard, SectionHead, SubpageFrame } from "./Shared";

export function WorksPage() {
  return (
    <SubpageFrame hero={{ title: "施工事例", label: "Works", lead: "家族の数だけある、心地よい暮らしのかたち。", image: `${IMG}/units/img/5279-15-20191219162420_b5dfb25a47a895.jpg`, imageAlt: "吹き抜けと木の質感を生かした施工事例", imagePosition: "center 52%" }}>
      <section className="px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead title="家族の暮らしから生まれた家" body="土地の個性と住まう人の希望を読み、一棟ずつ異なる答えを形にしています。" />
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
            {works.map((work) => <ListingCard key={work.title} image={work.image} imageAlt={work.title} title={work.title} body={work.body} href={work.href} linkLabel="施工事例を見る" />)}
          </div>
        </div>
      </section>
    </SubpageFrame>
  );
}
