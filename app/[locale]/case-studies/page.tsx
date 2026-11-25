import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import { pageCopyEn } from "@/lib/content/en/pages";
import { gabaritsCasEn } from "@/lib/content/en/references";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.casUsage;

export const metadata = pageMetaEn({
  title: seoEn.casUsage.title,
  description: seoEn.casUsage.description,
  path: "/en/case-studies/",
  frPath: "/cas-usage/",
});

export default function CaseStudiesEnPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Case studies", path: "/en/case-studies/" },
        ])}
      />

      <PageHero
        title={c.h1}
        lead={c.lead}
        figure="restitution"
        primary={c.primary}
        secondary={c.secondary}
      />

      <section className="section">
        <div className="container">
          <SecHead split title={c.title} sub={c.sub} />

          <div className="grid grid--2">
            {gabaritsCasEn.map((g, i) => (
              <article className="post reveal" key={i}>
                <div className="post__meta">
                  <span className="post__kind">{c.gabarit}</span>
                  <span>Case study</span>
                </div>
                <h3 className="post__title">{g.title}</h3>
                <p className="post__text">
                  <strong>{c.situation}</strong> {g.situation}
                </p>
                <p className="post__text">
                  <strong>{c.question}</strong> {g.question}
                </p>
                <p className="post__text">
                  <strong>{c.done}</strong> {g.fait}
                </p>
                <p className="post__text">
                  <strong>{c.notProven}</strong> {g.limites}
                </p>
                <div className="post__foot">
                  <span className="tag">{c.anonymised}</span>
                  <span className="t-mono">{g.duree}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="empty reveal" style={{ marginTop: "var(--s8)" }}>
            <i className="ph ph-briefcase" aria-hidden="true"></i>
            <h3>{c.emptyCasTitle}</h3>
            <p>{c.emptyCasText}</p>
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
