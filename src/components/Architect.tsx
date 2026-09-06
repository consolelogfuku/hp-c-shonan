import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { architect } from "@/lib/site";
import { Reveal } from "./Reveal";

// 建築家 吉田靖氏の言葉（コンセプトページの実文）と手書き署名
export function Architect() {
  return (
    <section id="architect" className="band py-16 md:py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 md:px-6 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <figure className="relative isolate max-w-[520px]">
            <span className="absolute -bottom-6 -right-6 left-6 top-6 -z-10 bg-white" aria-hidden />
            <div className="relative aspect-[4/3]">
              <Image src={architect.house} alt={architect.houseAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3.5 text-[14px] text-muted">{architect.houseCaption}</figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <blockquote className="m-0 font-hand text-[21px] font-semibold leading-[1.8] tracking-[0.08em] md:text-[clamp(24px,2.6vw,34px)]">
            {architect.quote.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </blockquote>
          <p className="mt-7 max-w-[36em] text-[17px] leading-[1.9] text-muted">{architect.body}</p>
          <div className="mt-6 flex items-end gap-3.5">
            <Image src={architect.signature} alt={architect.signatureAlt} width={200} height={52} style={{ width: "auto", height: 52 }} />
            <span className="pb-1 text-[12px] text-muted">{architect.title}</span>
          </div>
          <p className="mt-7">
            <Link href="/concept/" className="inline-flex items-center gap-2 text-[15px] font-medium text-accent hover:underline underline-offset-4">
              建築家の家について読む
              <ArrowRight size={16} aria-hidden />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
