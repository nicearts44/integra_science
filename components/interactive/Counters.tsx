"use client";

import { useEffect, useRef, useState } from "react";

export type CounterItem = { value: number; label: string; suffix?: string };

/**
 * Compteurs animés — reproduce initCounters() de integra-v2-plus.js.
 * La valeur finale est le contenu serveur : aucun compteur « 0 » au rendu initial.
 */
export default function Counters({ items }: { items: CounterItem[] }) {
  const [values, setValues] = useState<number[]>(items.map((i) => i.value));
  const wrapRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const els = Array.from(wrap.querySelectorAll<HTMLElement>("[data-count]"));
    if (!els.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function run(el: HTMLElement) {
      const target = parseFloat(el.dataset.count || "0");
      if (reduced) {
        el.textContent = String(target);
        return;
      }
      const start = performance.now();
      const dur = 900;
      function tick(now: number) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach(run);
      return;
    }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              done.current = true;
              run(e.target as HTMLElement);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.5 },
      );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="counters reveal" ref={wrapRef}>
      {items.map((item, i) => (
        <div className="counter" key={item.label}>
          <div className="counter__value" data-count={item.value} data-suffix={item.suffix ?? ""}>
            {values[i]}
            {item.suffix ?? ""}
          </div>
          <div className="counter__label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
