"use client";

import { useRef, useState } from "react";

export type TabItem = { id: string; label: string; content: React.ReactNode };

/**
 * Onglets — reproduce initTabs() de integra-v2-plus.js
 * (sélection, flèches gauche/droite, aria).
 */
export default function Tabs({ items, ariaLabel }: { items: TabItem[]; ariaLabel: string }) {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  if (!items.length) return null;

  function select(i: number, focus = false) {
    const n = items.length;
    const next = ((i % n) + n) % n;
    setActive(next);
    if (focus) tabsRef.current[next]?.focus();
  }

  return (
    <div data-tabs>
      <div className="tabs__list" role="tablist" aria-label={ariaLabel}>
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            className="tabs__tab"
            role="tab"
            type="button"
            id={`tab-${item.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${item.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                select(i + 1, true);
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                select(i - 1, true);
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          className="tabs__panel"
          role="tabpanel"
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={i !== active}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
