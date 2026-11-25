import Link from "next/link";

import Figure from "@/components/Figure";
import { SecHead, CtaBand } from "@/components/sections/common";
import { aplati, poles as polesBilingue, steps, vision } from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.vision.title,
  description: seo.vision.description,
  path: "/vision/",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const poles = aplati(polesBilingue, "fr");
const flowSteps = aplati(steps.flowSteps, "fr");
const ruptures = aplati(vision.ruptures, "fr");
const iaBloc = aplati(vision.iaBloc, "fr");
const publics = aplati(vision.publics, "fr");
const sansCadre = aplati(vision.sansCadre, "fr");
const avecCadre = aplati(vision.avecCadre, "fr");
const principe = aplati(vision.principe, "fr");

export default function VisionPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Notre vision", path: "/vision/" },
        ])}
      />

      {/* ================= HERO ================= */}
      <section className="page-hero parity">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="page-hero__title t-h1">
                La difficulté n&apos;est plus de produire la donnée.
                <br />
                C&apos;est de savoir ce qu&apos;elle <em>autorise à conclure</em>.
              </h1>
              <p className="page-hero__lead t-lead">
                Séquençage, imagerie, protéomique : les volumes ont changé d&apos;échelle, pas
                les organisations qui les traitent. Nous réunissons les disciplines qui doivent
                se contredire avant de conclure.
              </p>
              <div className="hero__actions">
                <Link className="btn btn--accent btn--on-dark" href="/expertises/">
                  Voir les six pôles <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link className="btn btn--outline btn--on-dark" href="/methode/">
                  Comprendre la méthode
                </Link>
              </div>
            </div>
            <div className="hero__visual">
              <Figure name="convergence" wrapperClassName="hero__figure" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= LES TROIS RUPTURES ================= */}
      <section className="section section--tint">
        <div className="container">
          <SecHead
            split
            title={
              <>
                Les données ont changé d&apos;échelle.
                <br />
                Pas les organisations qui les traitent.
              </>
            }
            sub="La difficulté n'est plus de produire la donnée, mais de savoir ce qu'elle autorise à conclure."
          />

          <div className="grid grid--3">
            {ruptures.map((r) => (
              <article className="card reveal" key={r.title}>
                <span className="card__icon">
                  <i className={`ph ${r.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{r.title}</h3>
                <p className="card__text">{r.text}</p>
              </article>
            ))}
          </div>

          <div
            className="grid grid--2 mt-12"
            style={{ alignItems: "center", gap: "var(--s12)" }}
          >
            <Figure name="research" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h3
                className="t-h2"
                style={{
                  fontSize: "var(--fs-h3)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                }}
              >
                {iaBloc.title}
              </h3>
              <p className="t-body-sm t-muted">{iaBloc.text}</p>
              <ul className="bullets">
                {iaBloc.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link className="link-arrow" href={iaBloc.link.href}>
                {iaBloc.link.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LES SIX PÔLES ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            title="Six pôles. Une même exigence de preuve."
            sub="Chaque pôle garde sa méthode et son vocabulaire. Ce qui est commun, c'est l'obligation de documenter ce qui a été fait, et d'écrire ce que le résultat ne prouve pas."
          />

          <div className="grid grid--3">
            {poles.map((p) => (
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
                  Voir le pôle <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= POUR QUI ================= */}
      <section className="section section--tint">
        <div className="container">
          <SecHead
            title="Vous avez des données, une question, et pas toutes les compétences pour y répondre."
          />
          <div className="grid grid--4">
            {publics.map((p) => (
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

      {/* ================= MÉTHODE EN BREF ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Six étapes. Six traces écrites."
            sub="De la première demande au rapport final, chaque étape produit un document qui permet de savoir ce qui a été décidé, par qui, et pourquoi."
          />

          <div className="steps reveal">
            {flowSteps.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="step__title">{s.title}</span>
                <span className="step__trace">
                  <i className="ph ph-file-text" aria-hidden="true"></i> {s.trace}
                </span>
              </div>
            ))}
          </div>

          <div
            className="grid grid--2 mt-12"
            style={{ alignItems: "center", gap: "var(--s12)" }}
          >
            <Figure name="pipeline" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h3 className="t-h3">
                La traçabilité n&apos;est pas un document en plus. C&apos;est le livrable.
              </h3>
              <p className="t-body-sm t-muted">
                Paramètres, versions d&apos;outils, journaux d&apos;exécution et décisions de
                revue sont conservés avec les résultats. Un rapport que l&apos;on ne peut pas
                reprendre est un rapport que l&apos;on ne peut pas défendre.
              </p>
              <Link className="link-arrow" href="/methode/">
                Voir la méthode en détail{" "}
                <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CE QUE ÇA CHANGE ================= */}
      <section className="section section--soft">
        <div className="container">
          <SecHead title="La différence n'est pas la vitesse. C'est la reprise." />

          <div className="compare reveal">
            <div className="compare__col">
              <p className="compare__label">Un résultat sans cadre</p>
              <ul>
                {sansCadre.map((t) => (
                  <li key={t}>
                    <i className="ph ph-x-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="compare__col compare__col--after">
              <p className="compare__label">Un résultat documenté</p>
              <ul>
                {avecCadre.map((t) => (
                  <li key={t}>
                    <i className="ph ph-check-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CITATION ================= */}
      <section className="section">
        <div className="container container--narrow">
          <figure className="quote reveal">
            <span className="quote__mark" aria-hidden="true">
              “
            </span>
            <blockquote className="quote__text">{principe.text}</blockquote>
            <figcaption className="quote__by">— {principe.by}</figcaption>
          </figure>
        </div>
      </section>

      {/* ================= APPEL FINAL ================= */}
      <CtaBand
        title="Une problématique à cadrer ?"
        text={
          <>
            Décrivez la question, les données disponibles et la décision attendue. Nous
            répondons par une première lecture écrite du problème, pas par une offre
            commerciale.
          </>
        }
        note="Aucune donnée sensible dans le premier échange · Cadrage écrit avant toute mission"
        primary={{ href: "/contact/projet/", label: "Proposer une problématique" }}
        secondary={{ href: "/expertises/", label: "Voir les six pôles" }}
      />
    </>
  );
}
