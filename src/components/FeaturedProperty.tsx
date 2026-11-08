import Image from "@/components/AppImage";
import Link from "@/components/AppLink";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { propertyDetailHref, propertyImagePosition, type PublicProperty } from "@/lib/cms/property-model";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function FeaturedProperty({ record }: { record?: PublicProperty }) {
  if (!record) return null;
  const featured = record.property;
  const specs = [
    { label: "土地面積", value: featured.landArea },
    { label: "交通", value: featured.access },
    { label: "所在地", value: featured.address },
    { label: "種別", value: featured.propertyType },
  ].filter((item) => item.value);
  return (
    <section id="sale" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-6">
        <Reveal>
          <SectionHead title="販売中の物件" lead="売主物件のため仲介手数料は不要です。参考プランもご用意しています。" />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 border border-line bg-surface">
          <div className="grid lg:grid-cols-12">
            <div className="relative aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:min-h-[440px]">
              {featured.image ? <Image src={featured.image.src} alt={featured.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: propertyImagePosition(featured.image) }} /> : <div className="flex h-full items-center justify-center bg-tint text-muted">画像はありません</div>}
            </div>
            <div className="p-8 md:p-10 lg:col-span-7">
              <div className="flex flex-wrap gap-2 text-[13px] font-medium">
                <span className="bg-accent px-2.5 py-1 text-on-accent">販売中</span>
                <span className="border border-line px-2.5 py-1 text-muted">{featured.dealType === "owner" ? "売主物件" : "仲介物件"}</span>
                {featured.dealType === "owner" && <span className="border border-line px-2.5 py-1 text-muted">仲介手数料不要</span>}
              </div>
              <h3 className="mt-5 text-[clamp(22px,2vw,27px)] leading-[1.5] tracking-[0.06em]">
                <Link href={propertyDetailHref(record)} className="hover:text-accent">{featured.title}</Link>
              </h3>
              <p className="mt-2 text-[clamp(28px,2.4vw,32px)] font-medium tracking-[0.02em] tabular-nums text-accent">{featured.price}</p>
              {featured.description && <p className="mt-4 max-w-[40em] text-[17px] leading-[1.9] text-muted">{featured.description}</p>}

              <dl className="mt-6 grid gap-x-8 gap-y-3 text-[15px] sm:grid-cols-2">
                {specs.map((s) => (
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
