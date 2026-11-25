import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import Tabs, { type TabItem } from "@/components/interactive/Tabs";
import { pageCopyEn } from "@/lib/content/en/pages";
import { gabaritsPublicationsEn } from "@/lib/content/en/references";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.publications;

export const metadata = pageMetaEn({
  title: seoEn.publications.title,
  description: seoEn.publications.description,
  path: "/en/publications/",
  frPath: "/publications/",
});

type TypePub = "Article" | "Communication" | "Rapport";

function Liste({ filtre }: { filtre?: TypePub }) {
  const source = gabaritsPublicationsEn.filter((g) => !filtre || g.type === filtre);

  return (
    <>
      <div className="grid grid--3">
        {source.map((p, i) => (
          <article className="post reveal" key={`${p.title}-${i}`}>
            <div className="post__meta">
              <span className="post__kind">{c.gabarit}</span>
              <span>{filtre ?? "Publication"}</span>
            </div>
            <h3 className="post__title">{p.title}</h3>
            <p className="post__text">{p.resume}</p>
            <div className="post__foot">
              <span className="tag">{p.cadre}</span>
              <span className="t-mono">{p.annee}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="empty reveal" style={{ marginTop: "var(--s8)" }}>
        <i className="ph ph-newspaper" aria-hidden="true"></i>
        <h3>{c.emptyPubTitle}</h3>
        <p>{c.emptyPubText}</p>
      </div>
    </>
  );
}

export default function PublicationsEnPage() {
  const tabs: TabItem[] = [
    { id: "all", label: "All", content: <Liste /> },
    { id: "articles", label: "Articles", content: <Liste filtre="Article" /> },
    { id: "communications", label: "Communications", content: <Liste filtre="Communication" /> },
    { id: "reports", label: "Reports", content: <Liste filtre="Rapport" /> },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Publications", path: "/en/publications/" },
        ])}
      />

      <PageHero
        title={c.h1}
        lead={c.lead}
        figure="publications"
        primary={c.primary}
      />

      <section className="section">
        <div className="container">
          <SecHead split title={c.title} sub={c.sub} />
          <Tabs items={tabs} ariaLabel="Filter publications" />
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
