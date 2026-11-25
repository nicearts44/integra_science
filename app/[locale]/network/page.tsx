import Link from "next/link";

import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import {
  rolesEn,
  engagementsEn,
  engagementsNoteEn,
  pageCopyEn,
} from "@/lib/content/en/pages";
import { poleStatuses } from "@/lib/content/bilingue";
import { t } from "@/lib/locale";
import { urlSlug } from "@/lib/content/en/poles";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

const c = pageCopyEn.network;

export const metadata = pageMetaEn({
  title: seoEn.reseau.title,
  description: seoEn.reseau.description,
  path: "/en/network/",
  frPath: "/reseau/",
});

export default function NetworkEnPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "The network", path: "/en/network/" },
        ])}
      />

      <PageHero
        title={c.h1}
        lead={c.lead}
        figure="collaboration"
        primary={c.primary}
        secondary={c.secondary}
      />

      <section className="section" id="roles">
        <div className="container">
          <SecHead split title={c.rolesTitle} sub={c.rolesSub} />

          <div className="grid grid--3">
            {rolesEn.map((r) => (
              <article className="card reveal" key={r.title}>
                <span className="card__icon">
                  <i className={`ph ${r.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{r.title}</h3>
                <p className="card__text">{r.text}</p>
                <div className="tag-row" style={{ marginTop: "auto" }}>
                  <span className="tag">{r.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SecHead title={c.membersTitle} sub={c.membersSub} />

          <div className="grid grid--3">
            {poleStatuses.map((p) => (
              <article className="post reveal" key={p.key}>
                <div className="post__meta">
                  <span className="post__kind">{`Pôle ${p.pole.num.en}`}</span>
                </div>
                <h3 className="post__title">{t(p.pole.title, "en")}</h3>
                <p className="post__text">{t(p.fonction, "en")}</p>
                <div className="post__foot">
                  <span className="tag">{t(p.statut, "en")}</span>
                  <Link className="link-arrow" href={`/en/expertise/${p.pole.slug.en}/`}>
                    See the pôle <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="empty reveal" style={{ marginTop: "var(--s8)" }}>
            <i className="ph ph-user-circle-dashed" aria-hidden="true"></i>
            <h3>{c.emptyTitle}</h3>
            <p>{c.emptyText}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead title={c.engTitle} />

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
