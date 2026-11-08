export type PageHeroProps = {
  title: string;
};

const labels: Record<string, string> = {
  "施工事例": "WORKS",
  "設計コンセプト": "CONCEPT",
  "コンセプト": "CONCEPT",
  "お客様の声": "VOICES",
  "会社案内": "COMPANY",
  "お知らせ": "NEWS",
  "売買物件": "PROPERTY / SALE",
  "賃貸物件": "PROPERTY / RENT",
  "貸駐車場": "PROPERTY / PARKING",
  "賃貸物件・貸駐車場": "PROPERTY / RENT",
};

export function PageHero({ title }: PageHeroProps) {
  return (
    <section className="subpage-hero" aria-labelledby="page-title">
      <div className="subpage-hero-inner">
        <span className="subpage-hero-label" aria-hidden>{labels[title] ?? "COMMUNITY SHONAN"}</span>
        <h1 id="page-title">{title}</h1>
      </div>
    </section>
  );
}
