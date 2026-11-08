import Image from "@/components/AppImage";

export type PageHeroProps = {
  title: string;
};

export function PageHero({ title }: PageHeroProps) {
  return (
    <section className="relative min-h-[210px] overflow-hidden border-b border-line bg-[#f8faf9] text-[#213d50] md:min-h-[240px]" aria-labelledby="page-title">
      <Image
        src="/images/common-hero-background-v2.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/45 via-white/10 to-transparent" aria-hidden />
      <div className="relative z-10 mx-auto flex min-h-[210px] max-w-[1280px] items-center px-5 py-7 md:min-h-[240px] md:px-6 md:py-8">
        <h1 id="page-title" className="text-[32px] font-medium leading-[1.35] tracking-[0.08em] min-[461px]:text-[35px] md:text-[clamp(36px,4vw,46px)]">
          {title}
        </h1>
      </div>
    </section>
  );
}
