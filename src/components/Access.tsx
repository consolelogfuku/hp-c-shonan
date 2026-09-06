import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

const rows = [
  { label: "所在地", value: `${site.postal} ${site.address}` },
  { label: "アクセス", value: site.access },
  { label: "営業時間", value: `${site.hours}（定休日 ${site.closed}）` },
  { label: "駐車場", value: site.parking },
  { label: "免許", value: site.licenses.join(" / ") },
];

// 左に会社情報（店舗写真 + 表）、右に地図。幅は 1:1
export function Access() {
  return (
    <section id="company" className="band-to-blue py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-6">
        <Reveal>
          <h2 className="text-[clamp(28px,3vw,38px)] leading-[1.5] tracking-[0.1em]">会社案内・アクセス</h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-[16/9] bg-tint">
              <Image src={site.shopPhoto} alt="店舗外観" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <dl className="mt-6 text-[15px]">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-4 border-t border-line py-3">
                  <dt className="w-20 shrink-0 text-muted">{r.label}</dt>
                  <dd className="leading-[1.8]">{r.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/company/" className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-accent hover:underline underline-offset-4">
              会社案内を見る
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="border border-line bg-surface lg:h-full">
            <iframe
              title="株式会社コミュニティ湘南の地図"
              src={site.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full lg:h-full lg:min-h-[520px] lg:aspect-auto"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
