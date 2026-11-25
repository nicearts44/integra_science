import Link from "next/link";

import Figure from "@/components/Figure";
import { SecHead, CtaBand } from "@/components/sections/common";
import { polesEn, urlSlug } from "@/lib/content/en/poles";
import { flowStepsEn } from "@/lib/content/en/steps";
import { pageCopyEn } from "@/lib/content/en/pages";
import {
  rupturesEn,
  iaBlocEn,
  publicsEn,
  sansCadreEn,
  avecCadreEn,
  principeEn,
} from "@/lib/content/en/vision";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.vision;

export const metadata = pageMetaEn({
  title: seoEn.vision.title,
  description: seoEn.vision.description,
  path: "/en/vision/",
  frPath: "/vision/",
});

export default function VisionEnPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Our vision", path: "/en/vision/" },
        ])}
      />

      <section className="page-hero parity">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="page-hero__title t-h1">{c.h1}</h1>
              <p className="page-hero__lead t-lead">{c.lead}</p>
              <div className="hero__actions">
                <Link className="btn btn--accent btn--on-dark" href={c.primary.href}>
                  {c.primary.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link className="btn btn--outline btn--on-dark" href={c.secondary.href}>
                  {c.secondary.label}
                </Link>
              </div>
            </div>
            <div className="hero__visual">
              <Figure name="convergence" wrapperClassName="hero__figure" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SecHead split title={c.constatTitle} sub={c.constatSub} />

          <div className="grid grid--3">
            {rupturesEn.map((r) => (
              <article className="card reveal" key={r.title}>
                <span className="card__icon">
                  <i className={`ph ${r.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{r.title}</h3>
                <p className="card__text">{r.text}</p>
              </article>
            ))}
          </div>

          <div className="grid grid--2 mt-12" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <Figure name="research" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h3
                className="t-h2"
                style={{ fontSize: "var(--fs-h3)", fontFamily: "var(--font-sans)", fontWeight: 600 }}
              >
                {iaBlocEn.title}
              </h3>
              <p className="t-body-sm t-muted">{iaBlocEn.text}</p>
              <ul className="bullets">
                {iaBlocEn.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link className="link-arrow" href={iaBlocEn.link.href}>
                {iaBlocEn.link.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead title={c.polesTitle} sub={c.polesSub} />
          <div className="grid grid--3">
            {polesEn.map((p) => (
              <Link className="pole reveal" href={`/en/expertise/${urlSlug(p.slug)}/`} key={p.slug}>
                <div className="pole__top">
                  <span className="pole__icon">
                    <i className={`ph ${p.icon}`} aria-hidden="true"></i>
                  </span>
                  <span className="pole__n">{p.num}</span>
                </div>
                <h3 className="t-h3">{p.title}</h3>
                <p className="card__text">{p.resume}</p>
                <span className="pole__link">
                  See the pôle <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SecHead title={c.publicsTitle} />
          <div className="grid grid--4">
            {publicsEn.map((p) => (
              <article className="card reveal" key={p.title}>
                <span className="card__icon">
                  <i className={`ph ${p.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">{p.title}</h3>
                <p className="card__text">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead split title={c.stepsTitle} sub={c.stepsSub} />

          <div className="steps reveal">
            {flowStepsEn.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="step__title">{s.title}</span>
                <span className="step__trace">
                  <i className="ph ph-file-text" aria-hidden="true"></i> {s.trace}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid--2 mt-12" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <Figure name="pipeline" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h3 className="t-h3">{c.traceTitle}</h3>
              <p className="t-body-sm t-muted">{c.traceText}</p>
              <Link className="link-arrow" href={c.traceLink.href}>
                {c.traceLink.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SecHead title={c.compareTitle} />
          <div className="compare reveal">
            <div className="compare__col">
              <p className="compare__label">{c.compareSans}</p>
              <ul>
                {sansCadreEn.map((t) => (
                  <li key={t}>
                    <i className="ph ph-x-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="compare__col compare__col--after">
              <p className="compare__label">{c.compareAvec}</p>
              <ul>
                {avecCadreEn.map((t) => (
                  <li key={t}>
                    <i className="ph ph-check-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <figure className="quote reveal">
            <span className="quote__mark" aria-hidden="true">
              “
            </span>
            <blockquote className="quote__text">{principeEn.text}</blockquote>
            <figcaption className="quote__by">— {principeEn.by}</figcaption>
          </figure>
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
