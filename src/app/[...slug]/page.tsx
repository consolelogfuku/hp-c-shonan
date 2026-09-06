import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { nav, site } from "@/lib/site";

const titles: Record<string, string> = Object.fromEntries(
  [...nav, { label: "お問い合わせ", href: "/contact/" }, { label: "プライバシーポリシー", href: "/privacypolicy/" }, { label: "サイトマップ", href: "/sitemap/" }].map(
    (n) => [n.href.replaceAll("/", ""), n.label],
  ),
);

// 下層ページは次フェーズで移行する。現段階では現行サイトの該当ページへ案内する。
export default async function SectionPlaceholder({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const section = slug[0] ?? "";
  const title = titles[section] ?? "ページ";
  const currentPath = `/${slug.join("/")}`;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
        <h1 className="text-[2rem] font-bold leading-[1.3] tracking-[-0.01em] md:text-[2.5rem]">{title}</h1>
        <p className="mt-5 max-w-[40em] text-[15px] leading-[1.9] text-muted">
          このページはリニューアル第2フェーズで、現行サイトの内容を移行して制作します。現時点では現行サイトの該当ページをご覧ください。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`${site.currentUrl}${currentPath}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 bg-accent px-6 text-[15px] font-medium text-accent-fg hover:bg-accent-hover active:scale-[0.98]"
          >
            現行サイトで見る
            <ArrowUpRight size={18} aria-hidden />
          </a>
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 border border-line bg-surface px-6 text-[15px] font-medium hover:border-accent active:scale-[0.98]"
          >
            <ArrowLeft size={18} aria-hidden />
            トップへ戻る
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
