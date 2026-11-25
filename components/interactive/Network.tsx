"use client";

import { useState } from "react";

export type NetNode = {
  id: string;
  cx: number;
  cy: number;
  label: string;
  title: string;
  text: string;
  tags: string[];
};

export type NetEdge = { id: string; from: string; to: string; d: string };

/**
 * Schéma du réseau — reproduce initNetwork() de integra-v2-plus.js.
 */
export default function Network({ nodes, edges }: { nodes: NetNode[]; edges: NetEdge[] }) {
  const [active, setActive] = useState(nodes[0]?.id ?? "");
  const current = nodes.find((n) => n.id === active);

  function select(id: string) {
    setActive(id);
  }

  return (
    <div className="network reveal">
      <div>
        <svg
          className="network__svg"
          viewBox="0 0 520 400"
          role="group"
          aria-label="Schéma des liens entre les six pôles d'expertise"
        >
          {edges.map((e) => {
            const on = e.from === active || e.to === active;
            return <path key={e.id} className={`edge${on ? " is-on" : ""}`} d={e.d} />;
          })}
          {nodes.map((n) => (
            <g
              key={n.id}
              className={`node${n.id === active ? " is-on" : ""}`}
              tabIndex={0}
              role="button"
              aria-label={n.title}
              onClick={() => select(n.id)}
              onMouseEnter={() => select(n.id)}
              onFocus={() => select(n.id)}
            >
              <circle cx={n.cx} cy={n.cy} r={30} />
              <text x={n.cx} y={n.cy + 5}>
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="network__info" aria-live="polite">
        {current && (
          <>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            <div className="tag-row">
              {current.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
