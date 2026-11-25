"use client";

import { useRef, useState } from "react";

export type AccordionItem = { id: string; title: string; body: React.ReactNode };

/**
 * Accordéon — reproduce initAccordion() de integra-v2.js (data-acc).
 */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  if (!items.length) return null;

  return (
    <div className="stack-md">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className={`acc${isOpen ? " is-open" : ""}`} data-acc>
            <button
              className="acc__trigger"
              type="button"
              data-acc-trigger
              aria-expanded={isOpen}
              aria-controls={`acc-panel-${item.id}`}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              {item.title}
              <i className="ph ph-caret-down" aria-hidden="true"></i>
            </button>
            <div
              className="acc__panel"
              id={`acc-panel-${item.id}`}
              data-acc-panel
              ref={(el) => {
                panelRefs.current[item.id] = el;
              }}
              style={{ height: isOpen ? `${panelRefs.current[item.id]?.scrollHeight ?? 0}px` : "0px" }}
            >
              <div className="acc__inner">{item.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
