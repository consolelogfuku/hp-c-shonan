import Image from "@/components/AppImage";
import Link from "@/components/AppLink";
import { works } from "@/lib/site";
import { SubpageFrame } from "./Shared";

/** 施工事例一覧。写真と文字を左右交互に置き、1件ずつ大きく見せる。 */
export function WorksPage() {
  return (
    <SubpageFrame hero={{ title: "施工事例" }}>
      <section className="works-index">
        <ol className="works-list">
          {works.map((work, index) => (
            <li key={work.title} className="works-item">
              <Link href={work.href} className="works-link">
                <figure className="works-figure">
                  <Image src={work.image} alt={work.title} fill sizes="(max-width: 767px) 100vw, 60vw" className="object-cover" />
                </figure>
                <div className="works-text">
                  <span className="works-no">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="works-title">{work.title}</h2>
                  <p className="works-body">{work.body}</p>
                  <span className="works-more">施工事例を見る</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </SubpageFrame>
  );
}
