import Link from "@/components/AppLink";
import { formatNewsDate, newsArticleHref, type NewsArticle } from "@/lib/news";
import { site } from "@/lib/site";
import { HomeHeader } from "./HomeHeader";

/** 写真は public/images/top/ に置いている（施工事例は現行サイトの実写真）。 */
const work = (path: string) => `/images/top/works/${path}.jpg`;
/** 現行サイトの物件ページから選んだ写真。ファイル名は現行サイトの画像IDの先頭部分。 */
const unit = (id: string) => `/images/top/units/${id}.jpg`;

type Photo = { src: string; alt: string };

function Photo({ photo, href = "/works/", className = "", priority = false }: { photo: Photo; href?: string; className?: string; priority?: boolean }) {
  return (
    <Link href={href} className={`ph ${className}`.trim()}>
      <img src={photo.src} alt={photo.alt} loading={priority ? "eager" : "lazy"} decoding="async" />
    </Link>
  );
}

/** 縦長の写真（元画像が幅500px前後と小さいので、4列の小さめの枠に入れる） */
const gridPortrait: Photo[] = [
  { src: unit("12701-19"), alt: "吹き抜けのある明るいリビング" },
  { src: unit("12694-21"), alt: "観葉植物のある吹き抜けのリビング" },
  { src: unit("12847-20-retouched"), alt: "木目のアイランドキッチン" },
  { src: unit("9964-34"), alt: "ウッドデッキのバルコニー" },
];

const gridFour: Photo[] = [
  { src: work("matsubayashi/09"), alt: "リビング階段" },
  { src: unit("9964-29"), alt: "対面式のキッチン" },
  { src: work("kagawa/21"), alt: "吹き抜けを見下ろす" },
  { src: work("shimoterao/12"), alt: "木の手すりの階段" },
  { src: unit("5275-21-bright"), alt: "木目の天井がある明るいLDK" },
  { src: work("kagawa/15"), alt: "ダイニング" },
  { src: work("kowada/16"), alt: "中庭を囲む2階" },
  { src: work("shimoterao/24"), alt: "洗面室" },
];

const worksColumns: Photo[][] = [
  [
    { src: work("kagawa/14"), alt: "吹き抜けのあるダイニング" },
    { src: work("matsubayashi/10"), alt: "グレーを基調としたリビング" },
  ],
  [
    { src: work("shimoterao/14"), alt: "無垢の床と木の手すり" },
    { src: work("higashikaigan/01"), alt: "グレーの外観" },
  ],
  [
    { src: work("kowada/04-retouched"), alt: "木の天井のリビング" },
    { src: work("ninomiya/07-retouched"), alt: "梁のあるリビング" },
  ],
];

const entries = [
  { id: "concept", en: "CONCEPT", ja: "コンセプト", href: "/concept/", photo: { src: "/images/top/sea-beach.jpg", alt: "夕暮れの湘南の浜辺" }, note: true },
  { id: "voices", en: "VOICES", ja: "お客様の声", href: "/comments/", photo: { src: "/images/top/thanks2.jpg", alt: "お客様との食事会の様子" }, note: false },
  { id: "company", en: "COMPANY", ja: "会社案内", href: "/company/", photo: { src: work("ninomiya/01"), alt: "白い外観の住まい" }, note: false },
] as const;

export function HomePage({ articles }: { articles: readonly NewsArticle[] }) {
  return (
    <div className="home">
      <HomeHeader />
      <main>
        <section className="home-hero">
          <div className="home-hero-frame">
            <img src={work("kagawa/11")} alt="吹き抜けのある明るいリビング" fetchPriority="high" />
            <h1 className="mincho">建築家とともに創る、<br />湘南の憩いのわが家。</h1>
          </div>
        </section>

        <nav className="home-quick-links" aria-label="主なご案内">
          <Link href="/works/">施工事例を見る</Link>
          <Link href="/sale/">販売中の物件を見る</Link>
        </nav>

        <section className="home-lead">
          <p className="mincho">
            茅ヶ崎で<span className="tcy">26</span>年。<br />
            土地探しから設計、<br />
            完成後のメンテナンスまで、<br />
            地元の不動産会社が<br />
            一貫してお手伝いします。
          </p>
        </section>

        <section className="home-gallery" id="works">
          <div className="home-wrap">
            <Photo photo={{ src: unit("9964-10"), alt: "青空と白い外観の住まい" }} className="aspect-[16/9]" />
            <div className="home-grid-2">
              <Photo photo={{ src: work("shimoterao/08"), alt: "無垢床のLDK" }} className="aspect-[4/3]" />
              <Photo photo={{ src: work("kowada/15"), alt: "中庭のウッドデッキ" }} className="aspect-[4/3]" />
            </div>
          </div>
        </section>
        <div className="home-band">
          <div className="home-wrap">
            <Photo photo={{ src: unit("5279-10-lawn"), alt: "芝生の庭に面した白い板張りと大きな切妻屋根の住まい" }} className="aspect-[3/2]" />
          </div>
        </div>
        <div className="home-band">
          <div className="home-grid-4 home-grid-portrait home-wrap">
            {gridPortrait.map((photo) => <Photo key={photo.src} photo={photo} />)}
          </div>
        </div>
        <div className="home-band">
          <div className="home-grid-4 home-wrap">
            {gridFour.map((photo) => <Photo key={photo.src} photo={photo} />)}
          </div>
        </div>

        <section className="home-pillars" id="pillars">
          <div className="home-wrap">
            <div className="home-pillar">
              <Photo photo={{ src: work("shimoterao/07-bright-lawn"), alt: "芝生の庭に面した、無垢の床と梁のある明るいLDK" }} className="aspect-[8/5]" />
              <div className="home-pillar-text">
                <h2>注文住宅</h2>
                <p>住み心地を決めるのは、予算より良いプランニング。<br />一級建築士と、設計から完成まで一緒に考えます。</p>
                <div className="home-btns">
                  <Link href="/works/">施工事例を見る</Link>
                  <Link href="/concept/">コンセプト</Link>
                </div>
              </div>
            </div>
            <div className="home-pillar flip">
              <Photo photo={{ src: work("kagawa/09"), alt: "吹き抜けのある明るいリビング" }} href="/sale/" className="aspect-[8/5]" />
              <div className="home-pillar-text">
                <h2>新築戸建て</h2>
                <p>売主として、茅ヶ崎の新築戸建てを販売しています。<br />売主物件は、仲介手数料がかかりません。</p>
                <div className="home-btns">
                  <Link href="/sale/">販売中の物件</Link>
                  <Link href="/sale/">これまでの物件</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-works" id="houses">
          <div className="home-wrap">
            <div className="home-head">
              <span className="en">WORKS</span>
              <h2 className="mincho">施工事例</h2>
            </div>
            <div className="home-works-grid">
              {worksColumns.map((column, index) => (
                <div key={index}>
                  {column.map((photo) => <Photo key={photo.src} photo={photo} />)}
                </div>
              ))}
            </div>
            <Link href="/works/" className="home-outline">施工事例一覧</Link>
          </div>
        </section>

        <section className="home-concept" id="about">
          <div className="home-wrap">
            <div className="home-concept-text">
              <span className="home-concept-v en" aria-hidden>CONCEPT</span>
              <span className="home-concept-label">設計コンセプト</span>
              <h2>敷地を読む、<br />環境を読む、<br />居心地を考える。</h2>
              <p>建築は丈夫でなければならない。<br />機能的でなければならない。<br />美しくなければならない。</p>
              <p>建物の敷地は、世界で唯一その場所だけです。<br />その場所のポテンシャルをしっかり把握して、<br />住まう人の考えと融合させる。</p>
              <p className="name">一級建築士 吉田 靖</p>
              <div className="home-btns">
                <Link href="/concept/">設計コンセプト</Link>
                <Link href="/concept/">耐震・性能</Link>
              </div>
            </div>
            <Photo photo={{ src: unit("5279-10-lawn"), alt: "芝生の庭に面した白い外観の住まい" }} href="/concept/" className="aspect-[4/3]" />
          </div>
        </section>

        <section className="home-links">
          <div className="home-wrap">
            {entries.map((entry) => (
              <Link key={entry.id} id={entry.id} href={entry.href} className="home-link-card">
                <span className="ph">
                  <img src={entry.photo.src} alt={entry.photo.alt} loading="lazy" decoding="async" />
                  {entry.note && <span className="home-note">写真はイメージです</span>}
                </span>
                <span className="cap">
                  <span className="en">{entry.en}</span>
                  <span className="ja mincho">{entry.ja}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-news" id="news">
          <div className="home-wrap">
            <div className="home-news-head">
              <span className="en">NEWS</span>
              <h2 className="mincho">お知らせ</h2>
              <Link href="/news/" className="more">お知らせ一覧</Link>
            </div>
            <ul>
              {articles.slice(0, 3).map((article) => (
                <li key={article.slug}>
                  <Link href={newsArticleHref(article.slug)}>
                    <time dateTime={article.date}>{formatNewsDate(article.date)}</time>
                    <span>{article.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="home-contact" id="contact">
          <img src="/images/top/day-night.jpg" alt="夜、窓に明かりが灯る家" loading="lazy" decoding="async" />
          <div className="home-contact-body">
            <span className="en">CONTACT</span>
            <h2 className="mincho">お気軽にお問い合わせください。</h2>
            <div className="home-contact-actions">
              <a className="tel" href={site.telHref}>{site.tel}</a>
              <Link className="form" href="/contact/">お問い合わせ</Link>
            </div>
          </div>
          <span className="home-note">写真はイメージです</span>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-wrap">
          <div className="home-footer-top">
            <div className="home-footer-company">
              <img src="/images/top/logo.png" alt={site.name} width={310} height={52} loading="lazy" />
              <p>{site.postal} {site.address}<br />営業時間 {site.hours}（定休日 {site.closed}）</p>
            </div>
            <div className="home-footer-nav">
              <div>
                <span className="en">HOME</span>
                <Link href="/works/">施工事例</Link>
                <Link href="/concept/">コンセプト</Link>
                <Link href="/comments/">お客様の声</Link>
                <Link href="/company/">会社案内</Link>
              </div>
              <div>
                <span className="en">PROPERTY</span>
                <Link href="/sale/">売買物件</Link>
                <Link href="/rent/">賃貸物件</Link>
                <Link href="/rent/">貸駐車場</Link>
              </div>
            </div>
          </div>
          <div className="home-footer-bottom">
            <span>{site.licenses.join(" / ")}</span>
            <span className="en">© COMMUNITY SHONAN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
