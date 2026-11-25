import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import { pageCopyEn } from "@/lib/content/en/pages";
import { gabaritsActualitesEn } from "@/lib/content/en/references";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.actualites;

export const metadata = pageMetaEn({
  title: seoEn.actualites.title,
  description: seoEn.actualites.description,
  path: "/en/news/",
  frPath: "/actualites/",
});

export default function NewsEnPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "News", path: "/en/news/" },
        ])}
      />

      <PageHero
        title={c.h1}
        lead={c.lead}
        figure="analytics"
        primary={c.primary}
        secondary={c.secondary}
      />

      <section className="section">
        <div className="container">
          <SecHead split title={c.title} sub={c.sub} />

          <div className="grid grid--3">
            {gabaritsActualitesEn.map((g, i) => (
              <article className="post reveal" key={i}>
                <div className="post__meta">
                  <span className="post__kind">{c.gabarit}</span>
                  <span>[Date]</span>
                </div>
                <h3 className="post__title">{g.title}</h3>
                <p className="post__text">{g.text}</p>
                <div className="post__foot">
                  <span className="tag">{g.categorie}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="empty reveal" style={{ marginTop: "var(--s8)" }}>
            <i className="ph ph-newspaper-clipping" aria-hidden="true"></i>
            <h3>{c.emptyActusTitle}</h3>
            <p>{c.emptyActusText}</p>
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
