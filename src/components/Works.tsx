import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { works } from "@/lib/site";
import { Carousel } from "./Carousel";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Works() {
  return (
    <section id="works" className="band py-16 md:py-24">
      <Reveal className="mx-auto max-w-[1280px] px-5 md:px-6">
        <SectionHead
          title="施工事例"
          leadClassName="lg:max-w-none lg:whitespace-nowrap"
          lead="建築主の思い、建築家の設計、施工者の技術が集まった住まいをご紹介します。"
        />
      </Reveal>

      <Reveal className="mt-12" delay={0.05}>
        <Carousel
          step="item"
          label="施工事例の一覧"
          navOffsetClassName="top-[calc(50%-40px)]"
          trackClassName="gap-6 px-5 pb-4 scroll-pl-5 md:px-6 md:scroll-pl-6 [--pad:max(1.5rem,calc((100vw-1280px)/2+1.5rem))] xl:px-[var(--pad)] xl:scroll-pl-[var(--pad)]"
        >
          {works.map((w, i) => (
            <Link
              key={w.href}
              href={w.href}
              className={`group w-[82vw] shrink-0 snap-start sm:w-[560px] ${i % 3 === 1 ? "sm:mt-10" : ""}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-tint">
                <Image
                  src={w.image}
                  alt={w.title}
                  fill
                  sizes="(min-width: 640px) 560px, 82vw"
                  className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 text-[19px] leading-[1.6] tracking-[0.06em]">{w.title}</h3>
              <p className="mt-1 text-[15px] text-muted">{w.body}</p>
            </Link>
          ))}
        </Carousel>
      </Reveal>

      <div className="mt-6 text-center">
        <Link
          href="/works/"
          className="inline-flex h-[52px] items-center gap-2.5 border border-line bg-surface px-7 text-[15px] font-medium tracking-[0.08em] transition-[border-color,transform] hover:border-accent active:scale-[0.98]"
        >
          施工事例を見る
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
