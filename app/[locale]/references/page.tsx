import Link from "next/link";

import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import Tabs, { type TabItem } from "@/components/interactive/Tabs";
import { pageCopyEn } from "@/lib/content/en/pages";
import {
  conditionsEn,
  gabaritsPublicationsEn,
  gabaritsCasEn,
  gabaritsActualitesEn,
} from "@/lib/content/en/references";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.references;

export const metadata = pageMetaEn({
  title: seoEn.references.title,
  description: seoEn.references.description,
  path: "/en/references/",
  frPath: "/references/",
});

function PublicationsPanel({ filtre }: { filtre?: "Article" | "Communication" | "Rapport" }) {
  const source = gabaritsPublicationsEn.filter((g) => !filtre || g.type === filtre);

  if (filtre && source.length === 0) {
    return (
      <div className="empty">
        <i className="ph ph-file-text" aria-hidden="true"></i>
        <h3>{filtre}</h3>
        <p>This category will fill up from the first verified publication.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid--3">
        {source.map((g, i) => (
          <article className="post reveal" key={`${g.title}-${i}`}>
            <div className="post__meta">
              <span className="post__kind">{c.gabarit}</span>
              <span>{g.type}</span>
            </div>
            <h3 className="post__title">{g.title}</h3>
            <p className="post__text">{g.resume}</p>
            <div className="post__foot">
              <span className="tag">{g.cadre}</span>
              <span className="t-mono">{g.annee}</span>
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

function CasPanel() {
  return (
    <>
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
    </>
  );
}

export default function ReferencesEnPage() {
  const publicationTabs: TabItem[] = [
    { id: "all", label: c.all, content: <PublicationsPanel /> },
    { id: "articles", label: c.articles, content: <PublicationsPanel filtre="Article" /> },
    {
      id: "communications",
      label: c.communications,
      content: <PublicationsPanel filtre="Communication" />,
    },
    { id: "reports", label: c.reports, content: <PublicationsPanel filtre="Rapport" /> },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "References", path: "/en/references/" },
        ])}
      />

      <PageHero title={c.h1} lead={c.lead} figure="publications" />

      <section className="section">
        <div className="container">
          <div className="compare reveal">
            {conditionsEn.map((cond) => (
              <div
                className={`compare__col${cond.label.startsWith("Condition 2") ? " compare__col--after" : ""}`}
                key={cond.label}
              >
                <p className="compare__label">{cond.label}</p>
                <ul>
                  {cond.items.map((i) => (
                    <li key={i.text}>
                      <i
                        className={`ph ${i.ok ? "ph-check-circle" : "ph-x-circle"}`}
                        aria-hidden="true"
                      ></i>{" "}
                      {i.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="publications">
        <div className="container">
          <SecHead split title={c.pubTitle} sub={c.pubSub} />
          <Tabs items={publicationTabs} ariaLabel="Filter publications" />
        </div>
      </section>

      <section className="section" id="case-studies">
        <div className="container">
          <SecHead split title={c.casTitle} sub={c.casSub} />
          <CasPanel />
        </div>
      </section>

      <section className="section section--soft" id="news">
        <div className="container">
          <SecHead split title={c.actusTitle} sub={c.actusSub} />

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

      <p className="t-subtle t-body-sm container" style={{ paddingBottom: "var(--s10)" }}>
        <Link className="link-inline" href="/en/publications/">
          See all publications
        </Link>{" "}
        ·{" "}
        <Link className="link-inline" href="/en/case-studies/">
          See all case studies
        </Link>{" "}
        ·{" "}
        <Link className="link-inline" href="/en/news/">
          See all news
        </Link>
      </p>
    </>
  );
}
