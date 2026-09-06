import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { nav, site } from "@/lib/site";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer>
      <section id="contact-cta" className="relative bg-accent text-on-accent">
        {/* 上側の曲線（静止）。上のセクションの淡い青で塗る */}
        <div className="pointer-events-none absolute inset-x-0 -top-px h-10 -scale-y-100 overflow-hidden md:h-[72px]" aria-hidden>
          <svg viewBox="0 0 2880 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 block h-full w-[200%] fill-[#eef5f9]">
            <path d="M0,40 C360,88 1080,-8 1440,40 C1800,88 2520,-8 2880,40 V80 H0 Z" />
          </svg>
        </div>
        <Reveal className="mx-auto grid max-w-[1280px] items-center gap-8 px-5 py-20 md:grid-cols-[fit-content(560px)_auto] md:justify-center md:gap-x-24 md:px-6">
          <h2 className="text-[clamp(26px,2.6vw,34px)] leading-[1.5]">家づくりや土地のこと、まずはお気軽にご相談ください。</h2>
          <div>
            <a href={site.telHref} className="text-[30px] font-medium tracking-[0.02em] tabular-nums">
              {site.tel}
            </a>
            <p className="mb-4 mt-2 text-[14px] opacity-85">
              {site.hours}（定休日 {site.closed}）
            </p>
            <Link
              href="/contact/"
              className="inline-flex h-[52px] items-center gap-2.5 bg-white px-7 text-[15px] font-medium tracking-[0.08em] text-fg transition-[opacity,transform] hover:opacity-90 active:scale-[0.98]"
            >
              お問い合わせ
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="border-t border-line">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-12 text-[14px] md:grid-cols-12 md:px-6">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex" aria-label={site.name}>
              <Image src={site.logo} alt={site.name} width={310} height={52} className="h-8 w-auto" />
            </Link>
            <address className="mt-5 not-italic leading-[2] text-muted">
              {site.postal} {site.address}
              <br />
              TEL {site.tel} / FAX {site.fax}
              <br />
              営業時間 {site.hours}（定休日 {site.closed}）
            </address>
          </div>
          <nav aria-label="フッター" className="md:col-span-7">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact/" className="hover:text-accent">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/privacypolicy/" className="hover:text-accent">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/sitemap/" className="hover:text-accent">
                  サイトマップ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mx-auto max-w-[1280px] px-5 pb-8 text-[13px] text-muted md:px-6">
          <p>© Community Shonan inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
