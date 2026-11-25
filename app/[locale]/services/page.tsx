import Link from "next/link";

import Figure from "@/components/Figure";
import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import Tabs, { type TabItem } from "@/components/interactive/Tabs";
import { prestationsEn } from "@/lib/content/en/prestations";
import { pageCopyEn } from "@/lib/content/en/pages";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.services;

export const metadata = pageMetaEn({
  title: seoEn.prestations.title,
  description: seoEn.prestations.description,
  path: "/en/services/",
  frPath: "/prestations/",
});

const livrablesEn = [
  {
    icon: "ph-file-text",
    title: "The report",
    text: "Results, method, limits, conditions of use. Written to be read by a scientist outside the project.",
  },
  {
    icon: "ph-code",
    title: "The reproduction files",
    text: "Scripts, execution environment, tool versions, parameters. What allows the analysis to be re-run identically.",
  },
  {
    icon: "ph-seal-check",
    title: "The review record",
    text: "The reservations raised by the reviewing pôle and the reasoned decision that follows. Kept with the results.",
  },
];

function Panel({ slug }: { slug: string }) {
  const p = prestationsEn.find((x) => x.slug === slug);
  if (!p) return null;

  return (
    <div className="grid grid--2" style={{ gap: "var(--s10)", alignItems: "start" }}>
      <div className="stack-md">
        <span className="card__icon">
          <i className={`ph ${p.icon}`} aria-hidden="true"></i>
        </span>
        <h2 className="t-h2" style={{ fontSize: "var(--fs-h3)" }}>
          {p.title}
        </h2>
        <p className="t-body-sm t-muted">{p.situation}</p>

        <h3 className="t-h4">{c.what}</h3>
        <ul className="bullets">
          {p.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <h3 className="t-h4">{c.profils}</h3>
        <div className="tag-row">
          {p.profils.map((x) => (
            <span className="tag" key={x}>
              {x}
            </span>
          ))}
        </div>
      </div>

      <div className="stack-md">
        <div className="deliverable">
          <p className="deliverable__label">
            <i className="ph ph-file-text" aria-hidden="true"></i> {c.deliverables}
          </p>
          <ul className="bullets">
            {p.livrables.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="t-h4">{c.conditions}</h3>
          <p className="card__text">{p.conditions}</p>
        </div>

        <Link className="link-arrow" href={c.link.href}>
          {c.link.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesEnPage() {
  const tabs: TabItem[] = prestationsEn.map((p) => ({
    id: p.slug,
    label:
      (c.tabLabels as Record<string, string>)[p.slug] ?? p.title,
    content: <Panel slug={p.slug} />,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Services", path: "/en/services/" },
        ])}
      />

      <PageHero
        title={c.h1}
        lead={c.lead}
        figure="documents"
        primary={c.primary}
        secondary={c.secondary}
      />

      <section className="section" id="services">
        <div className="container">
          <Tabs items={tabs} ariaLabel="Services" />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SecHead split title={c.livrablesTitle} sub={c.livrablesSub} />
          <div className="grid grid--3">
            {livrablesEn.map((l) => (
              <article className="card reveal" key={l.title}>
                <span className="card__icon">
                  <i className={`ph ${l.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{l.title}</h3>
                <p className="card__text">{l.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--2" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <div className="reveal stack-md">
              <h2 className="t-h2">{c.perimetreTitle}</h2>
              <p className="t-body-sm t-muted">{c.perimetreIntro}</p>
              <ul className="bullets">
                {c.perimetre.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <Figure name="restitution" wrapperClassName="figure reveal" />
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
