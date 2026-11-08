import Image from "@/components/AppImage";
import Link from "@/components/AppLink";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { voices, type Voice } from "@/lib/voices";
import { SectionHead, SubpageFrame } from "./Shared";

function excerpt(voice: Voice) {
  const text = voice.body.replace(/\n/g, "");
  return text.length > 100 ? `${text.slice(0, 100)}…` : text;
}

export function VoicesPage() {
  return (
    <SubpageFrame hero={{ title: "お客様の声" }}>
      <section className="px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead title="住まい手から届いた言葉" body="家づくりを決めた理由や、完成した住まいで感じていることを、住まい手の言葉でご紹介します。" />
          <p className="mb-8 text-[17px] text-muted">全 {voices.length} 件</p>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
            {voices.map((voice) => (
              <article key={voice.slug} className="border-t border-line py-8">
                <Link href={`/comments/${voice.slug}.html`} className="group block h-full">
                  <div className="flex items-center gap-5">
                    <figure className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-tint">
                      <Image src={voice.image} alt="" fill sizes="80px" className="object-cover" />
                    </figure>
                    <div>
                      <span className="text-[15px] tracking-[0.08em] text-muted">{voice.dateLabel}</span>
                      <h3 className="mt-1 text-[24px] font-normal leading-[1.5]">{voice.name}</h3>
                    </div>
                  </div>
                  <p className="mt-6 leading-[2] text-muted">{excerpt(voice)}</p>
                  <span className="mt-6 inline-flex items-center gap-3 border-b border-current pb-1 text-[15px] transition-[gap] group-hover:gap-5">
                    全文を読む <ArrowRight size={16} aria-hidden />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SubpageFrame>
  );
}
