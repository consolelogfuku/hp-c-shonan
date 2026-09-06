import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";

export const IMG = "https://www.c-shonan.co.jp/global-image";

type Hero = {
  title: string;
  label: string;
  lead: React.ReactNode;
  image: string;
  imageAlt: string;
  imagePosition?: string;
};

export function SubpageFrame({ hero, children }: { hero: Hero; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>
        <PageHero {...hero} />
        {children}
      </main>
      <Footer />
    </>
  );
}

export function SectionHead({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-12 grid gap-5 md:grid-cols-[minmax(280px,0.8fr)_minmax(0,1fr)] md:items-end md:gap-16">
      <h2 className="text-[clamp(28px,3.2vw,42px)] leading-[1.5]">{title}</h2>
      <p className="max-w-[46em] leading-[2] text-muted">{body}</p>
    </div>
  );
}

type ListingCardProps = {
  image: string;
  imageAlt: string;
  title: string;
  body: string;
  meta?: React.ReactNode;
  href?: string;
  linkLabel?: string;
};

export function ListingCard({ image, imageAlt, title, body, meta, href = "#", linkLabel = "詳細を見る" }: ListingCardProps) {
  return (
    <article className="group min-w-0">
      <Link href={href} className="block">
        <figure className="relative aspect-[4/3] overflow-hidden bg-tint">
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
        </figure>
        {meta ? <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-muted">{meta}</div> : null}
        <h3 className="mt-3 text-[21px] leading-[1.65]">{title}</h3>
        <p className="mt-2 leading-[1.9] text-muted">{body}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[14px] text-accent">
          {linkLabel}
          <ArrowRight size={15} aria-hidden />
        </span>
      </Link>
    </article>
  );
}

export function Status({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return <span className={muted ? "bg-[#edf2f5] px-2.5 py-1 text-muted" : "bg-accent px-2.5 py-1 text-white"}>{children}</span>;
}
