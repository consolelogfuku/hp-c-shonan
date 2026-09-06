import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { IMG, SubpageFrame } from "./Shared";

const groups = [
  {
    year: "2026",
    items: [
      ["2026.07.25", "夏季休暇について"],
      ["2026.06.26", "石川矢畑NO6 お蔭様でご成約となりました"],
      ["2026.04.10", "岡田貸家 お申込みを頂きました"],
      ["2026.03.29", "月極駐車場空き状況について"],
      ["2026.03.21", "岡田貸家 募集中です"],
      ["2026.01.26", "茅ヶ崎市矢畑売地 小島矢畑B区画"],
    ],
  },
  {
    year: "2025",
    items: [
      ["2025.12.21", "冬期休暇のお知らせ"],
      ["2025.07.18", "夏季休暇について"],
      ["2025.07.03", "加藤貸家6号棟 終了致しました"],
      ["2025.06.23", "臨時休業について"],
      ["2025.06.21", "売地香川B区画、新築戸建て松林B号棟は販売終了致しました"],
    ],
  },
] as const;

export function NewsPage() {
  return (
    <SubpageFrame
      hero={{
        title: "お知らせ",
        label: "News",
        lead: "休業日をはじめ、売買物件、賃貸物件、月極駐車場などの更新情報を掲載しています。",
        image: `${IMG}/units/img/1530-13-20191030165417_b5db941a982a97.jpg`,
        imageAlt: "茅ヶ崎の砂浜と青い空",
      }}
    >
      <section className="px-5 py-20 md:px-6 md:py-28" aria-label="お知らせ一覧">
        <div className="mx-auto max-w-[1280px] space-y-20">
          {groups.map((group) => (
            <section key={group.year} className="grid gap-8 md:grid-cols-[150px_1fr] md:gap-10" aria-labelledby={`year-${group.year}`}>
              <h2 id={`year-${group.year}`} className="text-[32px] tracking-[0.08em] text-accent">
                {group.year}
              </h2>
              <div>
                {group.items.map(([date, title]) => (
                  <article key={`${date}-${title}`} className="border-t border-line last:border-b">
                    <Link href="#" className="group grid min-h-[124px] grid-cols-[1fr_auto] items-center gap-5 py-6">
                      <div>
                        <time className="text-[14px] tracking-[0.06em] text-muted">{date}</time>
                        <h3 className="mt-2 text-[18px] leading-[1.75] md:text-[20px]">{title}</h3>
                      </div>
                      <ArrowRight size={18} className="text-accent transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
          <nav className="flex justify-center gap-2" aria-label="お知らせ一覧のページ">
            {[1, 2, 3, 4, 5].map((page) => (
              <span key={page} className={`inline-flex h-11 w-11 items-center justify-center border ${page === 1 ? "border-accent bg-accent text-white" : "border-line bg-white"}`} aria-current={page === 1 ? "page" : undefined}>
                {page}
              </span>
            ))}
            <span className="inline-flex h-11 items-center justify-center border border-line bg-white px-4">次へ</span>
          </nav>
        </div>
      </section>
    </SubpageFrame>
  );
}
