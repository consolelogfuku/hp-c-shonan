import Link from "@/components/AppLink";
import { site } from "@/lib/site";

export function HomeFooter() {
  return (
    <>
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
                <Link href="/concept/">設計コンセプト</Link>
                <Link href="/comments/">お客様の声</Link>
                <Link href="/company/">会社案内</Link>
                <Link href="/news/">お知らせ</Link>
              </div>
              <div>
                <span className="en">PROPERTY</span>
                <Link href="/sale/">売買物件</Link>
                <Link href="/rent/">賃貸物件</Link>
                <Link href="/parking/">貸駐車場</Link>
              </div>
            </div>
          </div>
          <div className="home-footer-bottom">
            <span>{site.licenses.join(" / ")}</span>
            <span className="en">© COMMUNITY SHONAN</span>
          </div>
        </div>
      </footer>
    </>
  );
}
