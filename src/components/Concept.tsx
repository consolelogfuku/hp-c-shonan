import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { concept } from "@/lib/site";
import { Carousel } from "./Carousel";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Concept() {
  return (
    <section id="concept" className="py-16 md:py-24">
      <Reveal className="mx-auto max-w-[1280px] px-5 md:px-6">
        <SectionHead
          title="住み心地を決めるのは、予算より良いプランニング。"
          leadClassName="lg:max-w-none"
          lead={
            <>
              建築家との家づくりを、設計料の負担を抑えて。
              <br className="br-pc" />
              コミュニティ湘南は一級建築士とともに、茅ヶ崎で200棟以上の住まいを手がけてきました。
            </>
          }
        />
      </Reveal>

      {/* 画面幅いっぱいの写真カルーセル（矢印でループ） */}
      <Reveal className="mt-14" delay={0.05}>
        <Carousel step="page" count={concept.photos.length} label="住まいの写真">
          {concept.photos.map((ph) => (
            <figure key={ph.src} className="relative m-0 h-[min(64dvh,680px)] min-h-[320px] w-full shrink-0 snap-start">
              <Image src={ph.src} alt={ph.alt} fill sizes="100vw" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1a24]/55 to-transparent px-5 py-5 text-[13px] text-white md:px-6">
                <span className="mx-auto block max-w-[1280px]">{ph.caption}</span>
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </Reveal>

      <div className="mx-auto mt-10 max-w-[1280px] px-5 md:px-6">
        {concept.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05} className="grid gap-3 border-t border-line py-9 md:grid-cols-12 md:gap-8">
            <h3 className="text-[21px] font-bold leading-[1.6] tracking-[0.06em] md:col-span-4">{item.title}</h3>
            <p className="max-w-[44em] text-[17px] leading-[1.9] text-muted md:col-span-8">{item.body}</p>
          </Reveal>
        ))}
        <div className="border-t border-line pt-7 text-center">
          <Link href="/concept/" className="inline-flex items-center gap-2 text-[15px] font-medium text-accent hover:underline underline-offset-4">
            家創りのコンセプトを読む
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
