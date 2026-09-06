"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { nav, site } from "@/lib/site";

// 塗り壁の背景となじむよう、罫線ではなく半透明 + ぼかしで区切る
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/[0.68] shadow-[0_1px_0_rgba(28,91,126,0.06)] backdrop-blur-[14px] backdrop-saturate-[1.1]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-5 md:h-[72px] md:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={site.name}>
          <Image src={site.logo} alt={site.name} width={310} height={52} priority className="h-7 w-auto md:h-9" />
        </Link>

        <nav aria-label="メイン" className="hidden xl:block">
          <ul className="flex items-center gap-6 text-[15px] font-medium tracking-[0.04em]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="whitespace-nowrap transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href={site.telHref} className="hidden text-[16px] font-medium tabular-nums hover:text-accent lg:inline-flex">
            {site.tel}
          </a>
          <Link
            href="/contact/"
            className="inline-flex h-10 items-center whitespace-nowrap bg-accent px-3 text-[14px] font-medium text-on-accent transition-[background-color,transform] hover:bg-accent-hover active:scale-[0.98] md:px-4 md:text-[15px]"
          >
            お問い合わせ
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            className="inline-flex h-10 w-10 items-center justify-center border border-line bg-surface xl:hidden"
          >
            {open ? <X size={20} aria-hidden /> : <List size={20} aria-hidden />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-surface xl:hidden">
        <ul className="mx-auto grid max-w-[1280px] gap-1 px-5 py-4 md:px-6">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)} className="block px-3 py-3 text-[16px] font-medium hover:bg-tint">
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 border-t border-line pt-3">
            <a href={site.telHref} className="flex flex-wrap items-baseline gap-x-3 px-3 py-2 text-[16px] font-medium">
              <span className="tabular-nums">{site.tel}</span>
              <span className="text-[13px] text-muted">{site.hours}（火・水定休）</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
