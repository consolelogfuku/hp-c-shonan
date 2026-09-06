"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { facts } from "@/lib/site";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const ctrl = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => ctrl.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
    </span>
  );
}

// 実績の数字。視界に入ったらカウントアップする
export function Facts() {
  return (
    <section className="pb-24 pt-[72px]">
      <ul className="mx-auto grid max-w-[1280px] gap-8 px-5 text-center md:grid-cols-3 md:gap-0 md:divide-x md:divide-line md:px-6">
        {facts.map((f) => (
          <li key={f.unit + f.value} className="px-4">
            <p className="text-[clamp(44px,5vw,64px)] font-medium leading-[1.1] tracking-[0.02em] text-accent">
              {f.prefix ? <span className="text-[0.75em]">{f.prefix}</span> : null}
              <Count to={f.value} />
              {f.unit ? <small className="ml-1 text-[0.42em] font-normal tracking-[0.06em]">{f.unit}</small> : null}
            </p>
            <p className="mt-2.5 text-[15px] text-muted">{f.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
