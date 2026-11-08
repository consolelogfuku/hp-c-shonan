import Link from "@/components/AppLink";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { formatNewsDate, newsArticleHref, newsPageHref, type NewsArticle } from "@/lib/news";
import { SubpageFrame } from "./Shared";

type NewsPageProps = {
  articles: readonly NewsArticle[];
  page: number;
  totalPages: number;
};

export function NewsPage({ articles, page, totalPages }: NewsPageProps) {
  const groups: { year: string; articles: NewsArticle[] }[] = [];
  for (const article of articles) {
    const year = article.date.slice(0, 4);
    let group = groups.find((item) => item.year === year);
    if (!group) {
      group = { year, articles: [] };
      groups.push(group);
    }
    group.articles.push(article);
  }
  return (
    <SubpageFrame
      hero={{
        title: "お知らせ"
      }}
    >
      <section className="px-5 py-20 md:px-6 md:py-28" aria-label="お知らせ一覧">
        <div className="mx-auto max-w-[1280px] space-y-20">
          {articles.length === 0 && <p className="py-10 text-muted">お知らせはまだありません。</p>}
          {groups.map((group) => (
            <section key={group.year} className="grid gap-[26px] md:grid-cols-[144px_minmax(0,1fr)] md:gap-12" aria-labelledby={`year-${group.year}`}>
              <h2
                id={`year-${group.year}`}
                className="text-[27px] leading-[1.3] tracking-[0.04em] text-accent after:mt-4 after:block after:h-px after:w-12 after:bg-accent md:sticky md:top-[104px] md:self-start md:text-[30px]"
              >
                {group.year}
              </h2>
              <div>
                {group.articles.map(({ slug, date, title }) => (
                  <article key={slug} className="border-t border-line last:border-b">
                    <Link
                      href={newsArticleHref(slug)}
                      className="group grid grid-cols-[minmax(0,1fr)_20px] items-start gap-5 py-[22px] transition-[color,background-color,padding] duration-200 hover:bg-[rgba(238,245,249,0.7)] hover:px-[14px] hover:text-accent md:min-h-[164px] md:py-[26px_28px] md:pr-1"
                    >
                      <div>
                        <time dateTime={date} className="text-[15px] tracking-[0.08em] text-muted">{formatNewsDate(date)}</time>
                        <h3 className="mt-[13px] text-[19px] leading-[1.75] tracking-[0.04em]">{title}</h3>
                      </div>
                      <ArrowRight size={18} className="self-center text-accent transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
          {totalPages > 1 && (
            <nav className="flex flex-wrap justify-center gap-2" aria-label="お知らせ一覧のページ">
              {page > 1 && <Link href={newsPageHref(page - 1)} rel="prev" className="inline-flex h-11 items-center border border-line bg-white px-4 text-accent hover:border-accent">前へ</Link>}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                pageNumber === page ? (
                  <span key={pageNumber} aria-current="page" aria-label={`${pageNumber}ページ目（現在のページ）`} className="inline-flex h-11 w-11 items-center justify-center border border-accent bg-accent text-white">{pageNumber}</span>
                ) : (
                  <Link key={pageNumber} href={newsPageHref(pageNumber)} aria-label={`${pageNumber}ページ目`} className="inline-flex h-11 w-11 items-center justify-center border border-line bg-white hover:border-accent hover:text-accent">{pageNumber}</Link>
                )
              ))}
              {page < totalPages && <Link href={newsPageHref(page + 1)} rel="next" className="inline-flex h-11 items-center border border-line bg-white px-4 text-accent hover:border-accent">次へ</Link>}
            </nav>
          )}
        </div>
      </section>
    </SubpageFrame>
  );
}
