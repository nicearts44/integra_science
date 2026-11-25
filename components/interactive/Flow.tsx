"use client";

import { useRef, useState } from "react";

export type FlowStep = {
  /** Clé stable, identique dans les deux langues. */
  key: string;
  step: string;
  title: string;
  short: string;
  text: string;
  trace: string;
};

/**
 * Diagramme de flux interactif — reproduce initFlow() de integra-v2-plus.js.
 */
export default function Flow({ steps }: { steps: FlowStep[] }) {
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Array<HTMLButtonElement | null>>([]);

  if (!steps.length) return null;
  const current = steps[index];

  function render(i: number, focus = false) {
    const n = steps.length;
    const next = ((i % n) + n) % n;
    setIndex(next);
    if (focus) nodesRef.current[next]?.focus();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panel = panelRef.current;
    if (panel && !reduced) {
      panel.classList.remove("is-anim");
      void panel.offsetWidth;
      panel.classList.add("is-anim");
      panel.animate(
        [
          { opacity: 0.35, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }
  }

  return (
    <div className="flow reveal">
      <div className="flow__rail" role="tablist" aria-label="Étapes de la méthode">
        {steps.map((s, i) => (
          <button
            key={s.step}
            ref={(el) => {
              nodesRef.current[i] = el;
            }}
            className="flow__node"
            role="tab"
            type="button"
            aria-selected={i === index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => render(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                render(index + 1, true);
              }
              if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                render(index - 1, true);
              }
            }}
          >
            <span className="flow__num">{String(i + 1).padStart(2, "0")}</span>
            <span className="flow__label">{s.short}</span>
          </button>
        ))}
      </div>

      <div className="flow__panel" ref={panelRef} aria-live="polite">
        <span className="flow__step">{current.step}</span>
        <h3 className="flow__title">{current.title}</h3>
        <p className="flow__text">{current.text}</p>
        <div className="flow__trace">
          <i className="ph ph-file-text" aria-hidden="true"></i>
          <span>
            <b>Trace écrite</b>
            {current.trace}
          </span>
        </div>
        <div className="flow__nav">
          <button className="btn btn--outline btn--sm" type="button" onClick={() => render(index - 1)}>
            <i className="ph ph-arrow-left" aria-hidden="true"></i> Précédent
          </button>
          <button className="btn btn--accent btn--sm" type="button" onClick={() => render(index + 1)}>
            Suivant <i className="ph ph-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
