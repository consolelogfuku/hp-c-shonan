import Image from "@/components/AppImage";
import Link from "@/components/AppLink";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { voices, type Voice } from "@/lib/voices";
import { SubpageFrame } from "./Shared";

export function VoiceDetailPage({ voice }: { voice: Voice }) {
  const index = voices.findIndex(({ slug }) => slug === voice.slug);
  const newer = voices[index - 1];
  const older = voices[index + 1];

  return (
    <SubpageFrame hero={{ title: "お客様の声" }}>
      <div className="mx-auto max-w-[960px] px-5 py-16 md:px-6 md:py-24">
        <Link href="/comments/" className="inline-flex min-h-11 items-center gap-2 text-[16px] hover:underline hover:underline-offset-4">
          <ArrowLeft size={17} aria-hidden />お客様の声一覧に戻る
        </Link>
        <article className="mt-12" aria-labelledby="voice-name">
          <header className="flex items-center gap-6 border-b border-line pb-9">
            <figure className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-tint">
              <Image src={voice.image} alt="" fill sizes="96px" className="object-cover" priority />
            </figure>
            <div>
              <p className="text-[16px] tracking-[0.08em] text-muted">{voice.dateLabel}</p>
              <h2 id="voice-name" className="mt-2 text-[clamp(28px,3vw,40px)] font-normal">{voice.name}</h2>
            </div>
          </header>
          <div className="space-y-7 py-12 leading-[2.2] md:py-16">
            {voice.body.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        </article>
        <nav className="grid gap-4 border-t border-line pt-10 md:grid-cols-2" aria-label="ほかのお客様の声">
          {newer ? <Link href={`/comments/${newer.slug}.html`} className="flex min-h-16 items-center gap-3 border border-line px-5 py-3 text-[16px] hover:bg-tint"><ArrowLeft size={18} aria-hidden /><span>{newer.name}</span></Link> : <span />}
          {older ? <Link href={`/comments/${older.slug}.html`} className="flex min-h-16 items-center justify-end gap-3 border border-line px-5 py-3 text-right text-[16px] hover:bg-tint"><span>{older.name}</span><ArrowRight size={18} aria-hidden /></Link> : null}
        </nav>
      </div>
    </SubpageFrame>
  );
}
