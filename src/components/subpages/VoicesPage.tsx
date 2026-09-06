import Image from "next/image";
import { voices } from "@/lib/site";
import { IMG, SectionHead, SubpageFrame } from "./Shared";

export function VoicesPage() {
  const [featuredVoice, ...rest] = voices;
  return (
    <SubpageFrame hero={{ title: "お客様の声", label: "Voices", lead: "家づくりを終えたご家族の、率直な言葉をご紹介します。", image: `${IMG}/units/img/4638-16-20191206023713_b5de940499cf62.jpg`, imageAlt: "家族が集まる開放的なリビング", imagePosition: "center 56%" }}>
      <section className="px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead title="住まい手から届いた言葉" body="家づくりを決めた理由や、完成した住まいで感じていることを伺いました。" />
          <article className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-16">
            <figure className="relative aspect-[4/5] overflow-hidden bg-tint"><Image src={featuredVoice.image} alt={`${featuredVoice.name}の住まい`} fill sizes="(max-width:767px) 100vw, 42vw" className="object-cover" /></figure>
            <div><blockquote className="text-[clamp(22px,2.4vw,31px)] leading-[1.9] text-accent">「{featuredVoice.quote}」</blockquote><p className="mt-7 leading-[1.9] text-muted">{featuredVoice.name}<br />{featuredVoice.when}</p></div>
          </article>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {rest.map((voice) => <article key={voice.name} className="grid gap-6 bg-white p-6 sm:grid-cols-[140px_1fr] md:p-8"><figure className="relative aspect-square overflow-hidden"><Image src={voice.image} alt={`${voice.name}の住まい`} fill sizes="140px" className="object-cover" /></figure><div><blockquote className="leading-[2]">「{voice.quote}」</blockquote><p className="mt-4 text-[14px] text-muted">{voice.name}<br />{voice.when}</p></div></article>)}
          </div>
        </div>
      </section>
      <section className="bg-tint/80 px-5 py-20 md:px-6 md:py-28"><div className="mx-auto max-w-[1280px]"><SectionHead title="お聞きしていること" body="完成後の実感を、これから家づくりを始める方にも役立つ形でご紹介します。" /><dl className="grid border-t border-line md:grid-cols-[240px_1fr]">{[["決めた理由","コミュニティ湘南でご自宅を新築された理由"],["実現したこと","家づくりで大切にした希望やこだわり"],["完成後の感想","良かった点と、これから改善してほしい点"]].map(([dt,dd]) => <div key={dt} className="contents"><dt className="border-b border-line py-5 text-accent md:px-5">{dt}</dt><dd className="border-b border-line py-5 text-muted md:px-5">{dd}</dd></div>)}</dl></div></section>
    </SubpageFrame>
  );
}
