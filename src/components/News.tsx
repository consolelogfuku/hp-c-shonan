import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { news } from "@/lib/site";
import { Reveal } from "./Reveal";

export function News() {
  return (
    <section id="news" className="py-16 md:py-24">
      <Reveal className="mx-auto grid max-w-[1280px] gap-8 px-5 md:px-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="text-[clamp(28px,3vw,38px)] leading-[1.5] tracking-[0.1em]">お知らせ</h2>
          <Link href="/news/" className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-accent hover:underline underline-offset-4">
            お知らせ一覧
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <ul className="lg:col-span-8">
          {news.map((n) => (
            <li key={n.href} className="border-t border-line last:border-b">
              <Link href={n.href} className="group flex flex-col gap-1 py-[18px] text-[16px] sm:flex-row sm:items-baseline sm:gap-6">
                <time className="shrink-0 text-[14px] tabular-nums text-muted">{n.date}</time>
                <span className="w-16 shrink-0 text-[13px] text-muted">{n.tag}</span>
                <span className="leading-[1.6] group-hover:text-accent">{n.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
