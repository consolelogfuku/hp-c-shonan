import { ArticleBody } from "@/components/news/ArticleBody";
import Link from "@/components/AppLink";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { formatNewsDate, getNewsArticlePage, newsArticleHref, newsPageHref, type NewsArticle } from "@/lib/news";
import { SubpageFrame } from "./Shared";

export function NewsDetailPage({ article, articles }: { article: NewsArticle; articles: readonly NewsArticle[] }) {
  const index = articles.findIndex((item) => item.slug === article.slug);
  const newer = articles[index - 1];
  const older = articles[index + 1];
  const listHref = newsPageHref(getNewsArticlePage(article.slug, articles) ?? 1);

  return (
    <SubpageFrame hero={{ title: "お知らせ" }}>
      <div className="mx-auto max-w-[928px] px-5 py-16 md:px-6 md:py-24">
        <article aria-labelledby="article-title">
          <header className="border-b border-line pb-8 md:pb-10">
            <div className="text-[14px]">
              <time dateTime={article.date} className="tabular-nums tracking-[0.08em] text-muted">{formatNewsDate(article.date)}</time>
            </div>
            <h2 id="article-title" className="mt-5 break-words text-[clamp(26px,3vw,36px)] leading-[1.65] text-[#213d50]">{article.title}</h2>
          </header>
          <div className="space-y-6 py-10 text-[18px] leading-[2.1] md:py-12 md:text-[20px]">
            <ArticleBody content={article.content} body={article.body.join("\n\n")} image={article.image} />
          </div>
        </article>
        <nav className="grid border-y border-line md:grid-cols-2" aria-label="前後のお知らせ">
          {newer ? <Link href={newsArticleHref(newer.slug)} className="group min-w-0 py-6 transition-colors hover:text-accent md:pr-8"><span className="flex items-center gap-2 text-[13px] text-muted"><ArrowLeft size={16} aria-hidden />新しい記事</span><span className="mt-2 block break-words text-[15px] leading-[1.8]">{newer.title}</span></Link> : <div className="hidden md:block" />}
          {older ? <Link href={newsArticleHref(older.slug)} className={`group min-w-0 py-6 transition-colors hover:text-accent md:pl-8 ${newer ? "border-t border-line md:border-l md:border-t-0" : ""}`}><span className="flex items-center gap-2 text-[13px] text-muted">以前の記事<ArrowRight size={16} aria-hidden /></span><span className="mt-2 block break-words text-[15px] leading-[1.8]">{older.title}</span></Link> : null}
        </nav>
        <div className="mt-10 text-center">
          <Link href={listHref} className="inline-flex min-h-12 items-center justify-center gap-3 border border-accent bg-white px-7 text-[15px] text-accent transition-colors hover:bg-accent hover:text-white"><ArrowLeft size={16} aria-hidden />お知らせ一覧に戻る</Link>
        </div>
      </div>
    </SubpageFrame>
  );
}
