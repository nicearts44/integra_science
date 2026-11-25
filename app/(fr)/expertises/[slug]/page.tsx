import Link from "next/link";
import { notFound } from "next/navigation";

import Figure from "@/components/Figure";
import { SecHead, CtaBand } from "@/components/sections/common";
import { aplati, poleBySlug, poles as polesBilingue } from "@/lib/content/bilingue";

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const poles = aplati(polesBilingue, "fr");

function getPole(slug: string) {
  const pole = poleBySlug(slug);
  return pole ? aplati(pole, "fr") : undefined;
}
import { pageMeta, breadcrumbLd, serviceLd, JsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return poles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pole = getPole(slug);
  if (!pole) return {};
  return pageMeta({
    title: pole.meta.title,
    description: pole.meta.description,
    path: `/expertises/${pole.slug}/`,
  });
}

/** Illustration d'identité, une par pôle (DESIGN.md § 15.4). */
const figures: Record<string, string> = {
  biologie: "hero-genome",
  bioinformatique: "pipeline",
  "bio-imagerie": "data",
  "medecine-sante": "medical",
  pharmacologie: "proof",
  "statistiques-ia": "analytics",
};

export default async function PolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pole = getPole(slug);
  if (!pole) notFound();

  const figure = figures[pole.slug];
  const lies = poles.filter((p) => pole.polesLies.includes(p.slug));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Accueil", path: "/" },
            { name: "Expertises", path: "/expertises/" },
            { name: pole.title, path: `/expertises/${pole.slug}/` },
          ]),
          serviceLd(pole.title, pole.chapeau),
        ]}
      />

      {/* ================= HERO ================= */}
      <section className="page-hero parity">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="page-hero__title t-h1">{pole.title}</h1>
              <p className="page-hero__lead t-lead">{pole.chapeau}</p>
              <div className="hero__actions">
                <Link className="btn btn--accent btn--on-dark" href="/contact/projet/">
                  Proposer une problématique liée à ce pôle{" "}
                  <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link className="btn btn--outline btn--on-dark" href="/expertises/">
                  Voir les six pôles
                </Link>
              </div>
            </div>
            {figure && (
              <div className="hero__visual">
                <Figure name={figure} wrapperClassName="hero__figure" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= CE QUE COUVRE CE PÔLE ================= */}
      <section className="section">
        <div className="container">
          <SecHead title="Ce que couvre ce pôle." />
          <div className="reveal stack-md" style={{ maxWidth: "72ch" }}>
            <p className="t-body-sm t-muted">{pole.couvertureDetail}</p>
          </div>
        </div>
      </section>

      {/* ================= CE QUE NOUS EN FAISONS ================= */}
      <section className="section section--soft">
        <div className="container">
          <SecHead title="Ce que nous en faisons." />
          <div className="reveal">
            <ul className="bullets">
              {pole.capacites.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= PROFILS MOBILISÉS ================= */}
      <section className="section">
        <div className="container">
          <SecHead title="Profils mobilisés." />
          <div className="reveal tag-row">
            {pole.profils.map((p) => (
              <span className="tag" key={p}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MENTION DE PÉRIMÈTRE ================= */}
      {pole.mentionPerimetre && (
        <section className="section">
          <div className="container">
            <p className="form__note reveal">
              <i className="ph ph-info" aria-hidden="true"></i>
              {pole.mentionPerimetre}
            </p>
          </div>
        </section>
      )}

      {/* ================= CE PÔLE TRAVAILLE AVEC ================= */}
      {lies.length > 0 && (
        <section className="section">
          <div className="container">
            <SecHead title="Ce pôle travaille avec." />
            <div className="grid grid--3">
              {lies.map((p) => (
                <Link className="pole reveal" href={`/expertises/${p.slug}/`} key={p.slug}>
                  <div className="pole__top">
                    <span className="pole__icon">
                      <i className={`ph ${p.icon}`} aria-hidden="true"></i>
                    </span>
                    <span className="pole__n">{p.num}</span>
                  </div>
                  <h3 className="t-h3">{p.title}</h3>
                  <p className="card__text">{p.resume}</p>
                  <span className="pole__link">
                    Découvrir le pôle <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <CtaBand
        title="Une question qui ne tient pas dans un seul pôle ?"
        text={
          <>
            C&apos;est le cas le plus fréquent. Décrivez la question et les données disponibles :
            nous identifions les pôles à mobiliser et la première étape à franchir.
          </>
        }
        note="Aucune donnée sensible dans le premier échange · Cadrage écrit avant toute mission"
        primary={{ href: "/contact/projet/", label: "Proposer une problématique liée à ce pôle" }}
        secondary={{ href: "/expertises/", label: "Voir les six pôles" }}
      />
    </>
  );
}
