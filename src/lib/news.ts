import type { RichNode } from "./cms/rich-text";

export type NewsArticle = {
  slug: string;
  date: string;
  title: string;
  tag: "お知らせ" | "売買" | "賃貸" | "駐車場";
  body: readonly string[];
  content?: RichNode;
  sourceUrl: string;
  image?: { src: string; alt: string };
};

// Summaries of the current site's notices, checked on 2026-09-09.
// Publication dates follow the existing news list. See docs/news-content-notes.md.
export const newsArticles: readonly NewsArticle[] = ([
  {
    slug: "2026svc.html",
    date: "2026-07-25",
    title: "夏季休暇について",
    tag: "お知らせ",
    body: [
      "2026年の夏季休業期間は、8月4日（火）から8月16日（日）までです。",
      "営業再開は8月17日（月）午前10時を予定しております。休業期間中はご不便をおかけしますが、ご理解のほどお願いいたします。",
    ],
    sourceUrl: "https://www.c-shonan.co.jp/news/2026svc.html",
  },
  {
    slug: "yabata2652.html",
    date: "2026-06-26",
    title: "石川矢畑NO6 お蔭様でご成約となりました",
    tag: "売買",
    // The source detail contains unrelated rental copy; use only the list's announcement.
    body: ["石川矢畑NO6の成約をお知らせいたします。"],
    sourceUrl: "https://www.c-shonan.co.jp/news/yabata2652.html",
  },
  {
    slug: "samoka3581renta.html",
    date: "2026-04-10",
    title: "岡田貸家 お申込みを頂きました",
    tag: "賃貸",
    body: ["岡田貸家へのお申し込みを受け付けたため、入居者の募集を終了しました。"],
    sourceUrl: "https://www.c-shonan.co.jp/news/samoka3581renta.html",
  },
  {
    slug: "2512parking-copy-copy.html",
    date: "2026-03-29",
    title: "月極駐車場空き状況について",
    tag: "駐車場",
    body: [
      "2026年4月10日時点では、みずき駐車場に1台分の空きがありました。",
      "空き状況は変わるため、ご希望の方は最新の募集状況をお問い合わせください。",
    ],
    sourceUrl: "https://www.c-shonan.co.jp/news/2512parking-copy-copy.html",
  },
  {
    slug: "samoka3581rent.html",
    date: "2026-03-21",
    title: "岡田貸家 募集中です",
    tag: "賃貸",
    body: [
      "寒川町岡田の戸建て賃貸住宅をご紹介します。収納が多く、日当たりのよい住まいで、車5台分の駐車スペースがあります。近隣にはコンビニもあります。",
      "その後、2026年4月10日のお知らせで、お申し込みによる募集終了をご案内しています。",
    ],
    sourceUrl: "https://www.c-shonan.co.jp/news/samoka3581rent.html",
  },
  {
    slug: "sale0126yabata.html",
    date: "2026-01-26",
    title: "茅ヶ崎市矢畑売地 小島矢畑B区画",
    tag: "売買",
    body: [
      "小島矢畑B区画は、茅ヶ崎市矢畑の静かな住宅街に位置する40坪の整形地です。日当たりがよく、スーパーやドラッグストアにも歩いて行ける立地です。",
      "掲載時点の物件紹介です。現在の販売状況や詳しい条件はお問い合わせください。",
    ],
    sourceUrl: "https://www.c-shonan.co.jp/news/sale0126yabata.html",
  },
  {
    slug: "2025wv12.html",
    date: "2025-12-21",
    title: "冬期休暇のお知らせ",
    tag: "お知らせ",
    body: [
      "年末年始は、2025年12月27日（土）から2026年1月7日（水）まで休業いたします。",
      "年始の営業は1月8日（木）午前10時からです。ご不便をおかけしますが、ご理解のほどお願いいたします。",
    ],
    sourceUrl: "https://www.c-shonan.co.jp/news/2025wv12.html",
  },
  {
    slug: "sum718vac.html",
    date: "2025-07-18",
    title: "夏季休暇について",
    tag: "お知らせ",
    body: ["2025年の夏季休業期間は、8月5日（火）から8月15日（金）までです。期間中のご不便につきまして、ご理解くださいますようお願いいたします。"],
    sourceUrl: "https://www.c-shonan.co.jp/news/sum718vac.html",
  },
  {
    slug: "hagi73lent.html",
    date: "2025-07-03",
    title: "加藤貸家6号棟 終了致しました",
    tag: "賃貸",
    body: ["加藤貸家6号棟の募集は終了しました。ご関心をお寄せいただき、ありがとうございました。"],
    sourceUrl: "https://www.c-shonan.co.jp/news/hagi73lent.html",
  },
  {
    slug: "temp62close35.html",
    date: "2025-06-23",
    title: "臨時休業について",
    tag: "お知らせ",
    body: ["2025年6月29日（日）は臨時休業いたします。ご来店をご予定のお客様にはご不便をおかけしますが、ご理解くださいますようお願いいたします。"],
    sourceUrl: "https://www.c-shonan.co.jp/news/temp62close35.html",
  },
  {
    slug: "shorin2025621.html",
    date: "2025-06-21",
    title: "売地香川B区画、新築戸建て松林B号棟は販売終了致しました",
    tag: "売買",
    body: ["香川B区画の売地と、松林B号棟の新築戸建ては、どちらも販売を終了しました。ご検討いただき、ありがとうございました。"],
    sourceUrl: "https://www.c-shonan.co.jp/news/shorin2025621.html",
  },
] satisfies NewsArticle[]).sort((a, b) => b.date.localeCompare(a.date));

export const NEWS_PAGE_SIZE = 10;

export function formatNewsDate(date: string) {
  return date.replaceAll("-", ".");
}

export function newsArticleHref(slug: string) {
  return `/news/${slug}`;
}

export function newsPageHref(page: number) {
  return page === 1 ? "/news" : `/news?page=${page}`;
}

export function getNewsArticle(slug: string, articles: readonly NewsArticle[] = newsArticles) {
  return articles.find((article) => article.slug === slug);
}

export function getNewsPage(rawPage?: string | string[], articles: readonly NewsArticle[] = newsArticles) {
  if (rawPage !== undefined && (typeof rawPage !== "string" || !/^[1-9]\d*$/.test(rawPage))) return undefined;
  const page = rawPage === undefined ? 1 : Number(rawPage);
  const totalPages = Math.max(1, Math.ceil(articles.length / NEWS_PAGE_SIZE));
  if (!Number.isSafeInteger(page) || page > totalPages) return undefined;
  return { page, totalPages, articles: articles.slice((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE) };
}

export function getNewsArticlePage(slug: string, articles: readonly NewsArticle[] = newsArticles) {
  const index = articles.findIndex((article) => article.slug === slug);
  return index === -1 ? undefined : Math.floor(index / NEWS_PAGE_SIZE) + 1;
}
