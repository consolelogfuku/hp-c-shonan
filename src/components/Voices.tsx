import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { voices } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Voices() {
  return (
    <section id="voices" className="band py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-6">
        <Reveal>
          <SectionHead title="お客様の声" lead="コミュニティ湘南でご自宅を新築されたお客様から寄せられた声です。" />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid gap-5 lg:grid-cols-3">
          {voices.map((v) => (
            <article key={v.name} className="flex flex-col justify-between border border-line bg-surface p-7">
              <blockquote className="m-0 text-[17px] leading-[2.1]">「{v.quote}」</blockquote>
              <footer className="mt-6 flex items-center gap-3.5 text-[14px] leading-[1.6]">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden bg-tint">
                  <Image src={v.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <div>
                  <p className="font-hand text-[15px] font-semibold tracking-[0.08em]">{v.name}</p>
                  <p className="text-muted">{v.when}</p>
                </div>
              </footer>
            </article>
          ))}
        </Reveal>

        <div className="mt-8 text-center">
          <Link href="/comments/" className="inline-flex items-center gap-2 text-[15px] font-medium text-accent hover:underline underline-offset-4">
            お客様の声を読む
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
