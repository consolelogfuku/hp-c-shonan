"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState, type ReactNode } from "react";

// 矢印ボタン付きの横スクロールカルーセル。端まで来たら反対側へ戻り、同じボタンでループできる。
export function Carousel({
  children,
  step,
  count,
  className = "",
  trackClassName = "",
  navOffsetClassName = "top-1/2",
  label,
}: {
  children: ReactNode;
  step: "page" | "item";
  count?: number;
  className?: string;
  trackClassName?: string;
  navOffsetClassName?: string;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const el = track.current;
    if (!el || !count) return;
    const onScroll = () => setCurrent(Math.round(el.scrollLeft / el.clientWidth) + 1);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);

  const stepPx = () => {
    const el = track.current!;
    if (step === "page") return el.clientWidth;
    const first = el.children[0] as HTMLElement;
    return first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).gap || "0");
  };
  const maxLeft = () => track.current!.scrollWidth - track.current!.clientWidth;

  const prev = () => {
    const el = track.current!;
    if (el.scrollLeft <= 2) el.scrollTo({ left: maxLeft(), behavior: "smooth" });
    else el.scrollBy({ left: -stepPx(), behavior: "smooth" });
  };
  const next = () => {
    const el = track.current!;
    if (el.scrollLeft >= maxLeft() - 2) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: stepPx(), behavior: "smooth" });
  };

  const navBase =
    "absolute z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line bg-white/90 text-fg transition-colors hover:border-accent hover:bg-white hover:text-accent md:h-14 md:w-14";

  return (
    <div className={`relative ${className}`}>
      {count ? (
        <span
          aria-live="polite"
          className="absolute right-5 top-5 z-10 bg-[#0b1a24]/55 px-3 py-1 text-[12px] tracking-[0.1em] tabular-nums text-white md:right-6"
        >
          {current} / {count}
        </span>
      ) : null}
      <div
        ref={track}
        tabIndex={0}
        aria-label={label}
        className={`snap-row flex snap-x snap-mandatory overflow-x-auto ${trackClassName}`}
      >
        {children}
      </div>
      <button type="button" onClick={prev} aria-label="前へ" className={`${navBase} left-5 md:left-6 ${navOffsetClassName}`}>
        <CaretLeft size={22} aria-hidden />
      </button>
      <button type="button" onClick={next} aria-label="次へ" className={`${navBase} right-5 md:right-6 ${navOffsetClassName}`}>
        <CaretRight size={22} aria-hidden />
      </button>
    </div>
  );
}
