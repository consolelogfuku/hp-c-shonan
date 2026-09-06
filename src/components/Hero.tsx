"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { hero } from "@/lib/site";

const INTERVAL_MS = 6500;
const FADE_MS = 1600;

// 画面幅いっぱいの海の写真 3 枚。社長の言葉はモックどおり固定表示する。
export function Hero() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const reduce = useRef(false);
  const leavingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) return;
    const timer = setInterval(() => go((i) => (i + 1) % hero.slides.length), INTERVAL_MS);
    return () => {
      clearInterval(timer);
      if (leavingTimer.current) clearTimeout(leavingTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (nextOf: (i: number) => number) => {
    setIndex((i) => {
      const n = nextOf(i);
      if (n !== i) {
        setLeaving(i);
        if (leavingTimer.current) clearTimeout(leavingTimer.current);
        leavingTimer.current = setTimeout(() => setLeaving((l) => (l === i ? null : l)), FADE_MS + 200);
      }
      return n;
    });
  };

  return (
    <section className="relative h-[min(84dvh,880px)] min-h-[560px] overflow-hidden bg-[#0b1a24]">
      {hero.slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`hero-slide absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
            i === index ? "is-active opacity-100" : "opacity-0"
          } ${i === leaving ? "is-leaving" : ""}`}
          aria-hidden={i !== index}
        >
          <Image src={slide.src} alt={slide.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-[1280px] flex-col items-center justify-end px-5 pb-[72px] text-center text-white md:px-6 md:pb-24">
        <p className="mb-[18px] mt-5 min-h-[1.6em] max-w-[40em] font-hand text-[clamp(18px,1.8vw,23px)] font-semibold tracking-[0.2em] [text-shadow:0_1px_10px_rgba(11,26,36,0.55)] md:whitespace-nowrap">
          {hero.phrase}
        </p>
        <h1 className="text-[30px] font-medium leading-[1.4] tracking-[0.05em] [text-shadow:0_2px_16px_rgba(11,26,36,0.45)] md:text-[clamp(34px,4.2vw,56px)] md:tracking-[0.12em]">
          建築家とともに創る、
          <br />
          湘南の憩いのわが家。
        </h1>
        <p className="mt-5 max-w-[40em] text-[19px] leading-[2] [text-shadow:0_1px_10px_rgba(11,26,36,0.55)] lg:max-w-none">
          茅ヶ崎で26年。土地探しから設計、完成後のメンテナンスまで、
          <br className="br-pc" />
          地元の不動産会社が一貫してお手伝いします。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="#works"
            className="inline-flex h-[52px] items-center gap-2.5 border border-white/70 bg-[#0b1a24]/20 px-7 text-[15px] font-medium tracking-[0.08em] text-white backdrop-blur-sm transition-[border-color,transform] hover:border-white active:scale-[0.98]"
          >
            施工事例を見る
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <div className="mt-10 flex gap-2" role="tablist" aria-label="写真の切り替え">
          {hero.slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1}枚目の写真`}
              onClick={() => go(() => i)}
              className={`h-[3px] transition-[width,background-color] duration-300 ${
                i === index ? "w-8 bg-white" : "w-3 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
