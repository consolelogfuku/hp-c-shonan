import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { featured } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function FeaturedProperty() {
  return (
    <section id="sale" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-6">
        <Reveal>
          <SectionHead title="販売中の物件" lead="売主物件のため仲介手数料は不要です。参考プランもご用意しています。" />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 border border-line bg-surface">
          <div className="grid lg:grid-cols-12">
            <div className="relative aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:min-h-[440px]">
              <Image src={featured.image} alt={featured.imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8 md:p-10 lg:col-span-7">
              <div className="flex flex-wrap gap-2 text-[13px] font-medium">
                <span className="bg-accent px-2.5 py-1 text-on-accent">{featured.status}</span>
                <span className="border border-line px-2.5 py-1 text-muted">{featured.dealType}</span>
                <span className="border border-line px-2.5 py-1 text-muted">仲介手数料不要</span>
              </div>
              <h3 className="mt-5 text-[clamp(22px,2vw,27px)] leading-[1.5] tracking-[0.06em]">
                <Link href={featured.href} className="hover:text-accent">
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-2 text-[clamp(28px,2.4vw,32px)] font-medium tracking-[0.02em] tabular-nums text-accent">{featured.price}</p>
              <p className="mt-4 max-w-[40em] text-[17px] leading-[1.9] text-muted">{featured.body}</p>

              <dl className="mt-6 grid gap-x-8 gap-y-3 text-[15px] sm:grid-cols-2">
                {featured.specs.map((s) => (
                  <div key={s.label} className="flex gap-4 border-t border-line pt-3">
                    <dt className="w-20 shrink-0 text-muted">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <Link
                  href="/sale/"
                  className="inline-flex h-[52px] items-center gap-2.5 bg-accent px-7 text-[15px] font-medium tracking-[0.08em] text-on-accent transition-[background-color,transform] hover:bg-accent-hover active:scale-[0.98]"
                >
                  売買物件を見る
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
