import Link from "next/link";

import Figure from "@/components/Figure";
import { PageHero, SecHead, Quote, CtaBand } from "@/components/sections/common";
import Flow from "@/components/interactive/Flow";
import { aplati, methodePage, steps, vision } from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.methode.title,
  description: seo.methode.description,
  path: "/methode/",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const flowSteps = aplati(steps.flowSteps, "fr");
const tracesRemises = aplati(steps.tracesRemises, "fr");
const revueCroisee = aplati(methodePage.revueCroisee, "fr");
const coutTrace = aplati(methodePage.coutTrace, "fr");
const principe = aplati(vision.principe, "fr");

export default function MethodePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Notre méthode", path: "/methode/" },
        ])}
      />

      <PageHero
        title={
          <>
            Six étapes.
            <br />
            Six <em>traces écrites</em>.
          </>
        }
        lead="De la réception de la demande au rapport final, chaque étape produit un document qui permet de savoir ce qui a été décidé, par qui, et pourquoi."
        figure="pipeline"
        primary={{ href: "#flux", label: "Voir le parcours d'une mission" }}
        secondary={{ href: "/contact/projet/", label: "Proposer une mission" }}
      />

      {/* ================= LE PRINCIPE ================= */}
      <section className="section">
        <div className="container container--narrow">
          <Quote text={principe.text} by={`— ${principe.by}`} align="left" />
        </div>
      </section>

      {/* ================= FLUX INTERACTIF ================= */}
      <section className="section section--soft" id="flux">
        <div className="container">
          <SecHead
            split
            title="Parcours d'une mission."
            sub="Sélectionnez une étape pour voir ce qui s'y décide et la trace écrite qui en sort."
          />
          <Flow steps={flowSteps} />
        </div>
      </section>

      {/* ================= LA REVUE CROISÉE ================= */}
      <section className="section">
        <div className="container">
          <div
            className="grid grid--2"
            style={{ alignItems: "center", gap: "var(--s12)" }}
          >
            <div className="reveal stack-md">
              <h2 className="t-h2">{revueCroisee.title}</h2>
              {revueCroisee.paragraphs.map((p) => (
                <p className="t-body-sm t-muted" key={p}>
                  {p}
                </p>
              ))}
              <ul className="bullets">
                {revueCroisee.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <Figure name={revueCroisee.figure} wrapperClassName="figure reveal" />
          </div>
        </div>
      </section>

      {/* ================= LES SIX TRACES ================= */}
      <section className="section section--soft">
        <div className="container">
          <SecHead
            title="Ce que vous gardez."
            sub="Six documents, remis au fil de la mission. Ils appartiennent au demandeur."
          />

          <div className="grid grid--3">
            {tracesRemises.map((t) => (
              <article className="card reveal" key={t.title}>
                <span className="card__icon">
                  <i className={`ph ${t.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">{t.title}</h3>
                <p className="card__text">{t.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LE COÛT DE LA TRACE ================= */}
      <section className="section">
        <div className="container">
          <SecHead title={coutTrace.title} />
          <div className="compare reveal">
            <div className="compare__col">
              <p className="compare__label">{coutTrace.sans.label}</p>
              <ul>
                {coutTrace.sans.items.map((t) => (
                  <li key={t}>
                    <i className="ph ph-x-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="compare__col compare__col--after">
              <p className="compare__label">{coutTrace.avec.label}</p>
              <ul>
                {coutTrace.avec.items.map((t) => (
                  <li key={t}>
                    <i className="ph ph-check-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="t-subtle t-body-sm" style={{ marginTop: "var(--s6)", maxWidth: "60ch" }}>
            La méthode est identique quel que soit le pôle qui réalise la mission.{" "}
            <Link className="link-inline" href="/qualite-scientifique/">
              Voir les engagements de qualité scientifique
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand
        title="Une mission à cadrer ?"
        text={
          <>
            Le cadrage est l&apos;étape qui décide de tout le reste. Il se fait par écrit, avant
            que la moindre analyse commence.
          </>
        }
        note="Aucune donnée sensible dans le premier échange · Cadrage écrit avant toute mission"
        primary={{ href: "/contact/projet/", label: "Proposer une mission" }}
        secondary={{ href: "/prestations/", label: "Voir les prestations" }}
      />
    </>
  );
}
