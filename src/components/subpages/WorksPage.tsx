import { works } from "@/lib/site";
import { ListingCard, SectionHead, SubpageFrame } from "./Shared";

export function WorksPage() {
  return (
    <SubpageFrame hero={{ title: "施工事例" }}>
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
