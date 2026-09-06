import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  title: string;
  label: string;
  lead: React.ReactNode;
  image: string;
  imageAlt: string;
  imagePosition?: string;
};

export function PageHero({ title, label, lead, image, imageAlt, imagePosition = "center 58%" }: PageHeroProps) {
  return (
    <section className="relative min-h-[300px] overflow-hidden bg-[#0b1a24] text-white md:min-h-[360px]" aria-labelledby="page-title">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover brightness-[1.08] saturate-[0.96]"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,26,36,0.44),rgba(11,26,36,0.05)),linear-gradient(0deg,rgba(11,26,36,0.14),transparent_55%)]" />
      <div className="relative z-10 mx-auto flex min-h-[300px] max-w-[1280px] flex-col px-5 pb-4 pt-12 md:min-h-[360px] md:px-6 md:pb-5 md:pt-[55px]">
        <nav className="mb-[18px] flex flex-wrap items-center gap-[9px] text-[13px] tracking-[0.04em] md:mb-[26px]" aria-label="パンくずリスト">
          <Link href="/" className="opacity-80 hover:opacity-100 hover:underline hover:underline-offset-4">
            トップ
          </Link>
          <span className="h-px w-[18px] bg-current opacity-55" aria-hidden />
          <span aria-current="page">{title}</span>
        </nav>
        <p className="mb-1.5 text-[15px] tracking-[0.12em]">{label}</p>
        <h1 id="page-title" className="text-[32px] font-medium leading-[1.35] tracking-[0.1em] [text-shadow:0_2px_16px_rgba(11,26,36,0.36)] min-[461px]:text-[36px] md:text-[clamp(36px,5vw,58px)]">
          {title}
        </h1>
        <p className="mt-4 max-w-[34em] text-[16px] leading-[1.9] [text-shadow:0_1px_10px_rgba(11,26,36,0.5)] md:text-[18px]">{lead}</p>
      </div>
    </section>
  );
}
