import Image from "@/components/AppImage";
import Link from "@/components/AppLink";
import { useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { nav, site } from "@/lib/site";

// 塗り壁の背景となじむよう、罫線ではなく半透明 + ぼかしで区切る
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });

  const isCurrent = (href: string) => {
    const normalizedHref = href === "/" ? href : href.replace(/\/$/, "");
    return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/[0.68] shadow-[0_1px_0_rgba(28,91,126,0.06)] backdrop-blur-[14px] backdrop-saturate-[1.1]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-5 px-5 md:h-[72px] md:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={site.name}>
          <Image src={site.logo} alt={site.name} width={310} height={52} priority className="h-7 w-auto md:h-[34px]" />
        </Link>

        <nav aria-label="メイン" className="hidden xl:block">
          <ul className="flex items-center gap-[18px] text-[13.5px] font-medium tracking-[0.025em]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="relative whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:-bottom-2 after:h-px after:bg-accent after:opacity-0 hover:text-accent aria-[current=page]:text-accent aria-[current=page]:after:opacity-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href={site.telHref} className="hidden whitespace-nowrap text-[15px] font-medium tabular-nums hover:text-accent lg:inline-flex">
            {site.tel}
          </a>
          <Link
            href="/contact/"
            className="inline-flex h-10 items-center whitespace-nowrap bg-accent px-[15px] text-[14px] font-medium text-on-accent transition-[background-color,transform] hover:bg-accent-hover active:scale-[0.98]"
          >
            お問い合わせ
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-accent bg-accent text-white transition-colors hover:bg-accent-hover xl:hidden"
          >
            {open ? (
              <X size={20} weight="regular" aria-hidden />
            ) : (
              <span
                aria-hidden
                className="block h-[1.5px] w-4 bg-white shadow-[0_-5px_0_white,0_5px_0_white]"
              />
            )}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="モバイルメニュー"
        hidden={!open}
        className="mobile-nav-panel absolute right-0 top-full h-[calc(100vh-64px)] w-[min(86vw,360px)] overflow-y-auto border-l border-t border-line bg-white/[0.98] shadow-[-18px_20px_42px_rgba(11,26,36,0.14)] backdrop-blur-2xl md:h-[calc(100vh-72px)] xl:hidden"
      >
        <ul className="grid w-full px-5 pb-8 pt-[22px]">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="block border-b border-line px-[14px] py-3 text-[16px] font-medium transition-colors hover:bg-tint aria-[current=page]:bg-tint aria-[current=page]:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-3">
            <a href={site.telHref} className="flex flex-wrap items-baseline gap-x-3 px-[14px] py-3 text-[16px] font-medium">
              <span className="tabular-nums">{site.tel}</span>
              <span className="text-[13px] text-muted">{site.hours}（火・水定休）</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
