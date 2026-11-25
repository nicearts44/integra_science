import Link from "next/link";

import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import { engagementsEn, engagementsNoteEn, pageCopyEn } from "@/lib/content/en/pages";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.quality;

export const metadata = pageMetaEn({
  title: seoEn.qualite.title,
  description: seoEn.qualite.description,
  path: "/en/scientific-quality/",
  frPath: "/qualite-scientifique/",
});

export default function ScientificQualityEnPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Scientific quality", path: "/en/scientific-quality/" },
        ])}
      />

      <PageHero
        title={c.h1}
        lead={c.lead}
        figure="proof"
        primary={c.primary}
        secondary={c.secondary}
      />

      <section className="section">
        <div className="container">
          <SecHead title={c.engTitle} sub={c.engSub} />

          <div className="grid grid--3">
            {engagementsEn.map((e) => (
              <article className="card reveal" key={e.title}>
                <span className="card__icon">
                  <i className={`ph ${e.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">{e.title}</h3>
                <p className="card__text">{e.text}</p>
              </article>
            ))}
          </div>

          <p className="t-subtle t-body-sm" style={{ marginTop: "var(--s6)", maxWidth: "60ch" }}>
            {engagementsNoteEn}
          </p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container container--narrow">
          <div className="stack-md">
            <h2 className="t-h2">{c.refuseTitle}</h2>
            <p className="t-body-sm t-muted">{c.refuseP1}</p>
            <p className="t-body-sm t-muted">{c.refuseP2}</p>
            <Link className="link-arrow" href={c.refuseLink.href}>
              {c.refuseLink.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
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
