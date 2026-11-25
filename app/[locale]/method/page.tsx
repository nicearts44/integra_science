import Link from "next/link";

import Figure from "@/components/Figure";
import { PageHero, SecHead, Quote, CtaBand } from "@/components/sections/common";
import Flow from "@/components/interactive/Flow";
import {
  flowStepsEn,
  tracesRemisesEn,
  revueCroiseeEn,
  coutTraceEn,
} from "@/lib/content/en/steps";
import { pageCopyEn } from "@/lib/content/en/pages";
import { principeEn } from "@/lib/content/en/vision";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.method;

export const metadata = pageMetaEn({
  title: seoEn.methode.title,
  description: seoEn.methode.description,
  path: "/en/method/",
  frPath: "/methode/",
});

export default function MethodEnPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Our method", path: "/en/method/" },
        ])}
      />

      <PageHero
        title={c.h1}
        lead={c.lead}
        figure="pipeline"
        primary={c.primary}
        secondary={c.secondary}
      />

      <section className="section">
        <div className="container container--narrow">
          <Quote text={principeEn.text} by={`— ${principeEn.by}`} align="left" />
        </div>
      </section>

      <section className="section section--soft" id="flow">
        <div className="container">
          <SecHead split title={c.flowTitle} sub={c.flowSub} />
          <Flow steps={flowStepsEn} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--2" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <div className="reveal stack-md">
              <h2 className="t-h2">{revueCroiseeEn.title}</h2>
              {revueCroiseeEn.paragraphs.map((p) => (
                <p className="t-body-sm t-muted" key={p}>
                  {p}
                </p>
              ))}
              <ul className="bullets">
                {revueCroiseeEn.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <Figure name={revueCroiseeEn.figure} wrapperClassName="figure reveal" />
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SecHead title={c.tracesTitle} sub={c.tracesSub} />
          <div className="grid grid--3">
            {tracesRemisesEn.map((t) => (
              <article className="card reveal" key={t.title}>
                <span className="card__icon">
                  <i className={`ph ${t.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">{t.title}</h3>
                <p className="card__text">{t.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead title={coutTraceEn.title} />
          <div className="compare reveal">
            <div className="compare__col">
              <p className="compare__label">{coutTraceEn.sans.label}</p>
              <ul>
                {coutTraceEn.sans.items.map((t) => (
                  <li key={t}>
                    <i className="ph ph-x-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="compare__col compare__col--after">
              <p className="compare__label">{coutTraceEn.avec.label}</p>
              <ul>
                {coutTraceEn.avec.items.map((t) => (
                  <li key={t}>
                    <i className="ph ph-check-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="t-subtle t-body-sm" style={{ marginTop: "var(--s6)", maxWidth: "60ch" }}>
            {c.note}{" "}
            <Link className="link-inline" href={c.noteLink.href}>
              {c.noteLink.label}
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand
        title={c.cta.title}
        text={c.cta.text}
        note={c.cta.note}
        primary={c.cta.primary}
        secondary={c.cta.secondary}
      />
    </>
  );
}
