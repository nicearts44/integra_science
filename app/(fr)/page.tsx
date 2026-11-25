import Link from "next/link";

import Figure from "@/components/Figure";
import { SecHead, Quote, CtaBand } from "@/components/sections/common";
import { aplati, poles, prestations, steps, vision } from "@/lib/content/bilingue";
import { localize, t } from "@/lib/locale";
import { pageMeta, seo } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.accueil.title,
  description: seo.accueil.description,
  path: "/",
});

/** Contenu de l'accueil : toutes les chaînes sont bilingues, on les remet à plat ici. */
const P = localize(
  {
    constatCards: [
      {
        icon: "ph-stack",
        title: {
          fr: "Des données plus volumineuses",
          en: "Larger volumes of data",
        },
        text: {
          fr: "Séquençage, imagerie, protéomique : les volumes dépassent ce qu'un poste de travail peut traiter, et les formats changent à chaque technologie.",
          en: "Sequencing, imaging, proteomics: volumes exceed what a workstation can process, and formats change with every technology.",
        },
      },
      {
        icon: "ph-share-network",
        title: { fr: "Des compétences dispersées", en: "Scattered skills" },
        text: {
          fr: "La biologie, les statistiques et l'ingénierie des données vivent dans des services différents, avec des calendriers et des vocabulaires différents.",
          en: "Biology, statistics and data engineering live in different departments, with different calendars and different vocabularies.",
        },
      },
      {
        icon: "ph-seal-check",
        title: { fr: "Des résultats à défendre", en: "Results to defend" },
        text: {
          fr: "Un résultat doit tenir devant un comité de lecture, un financeur ou un partenaire. Cela suppose de savoir d'où il vient et ce qu'il ne prouve pas.",
          en: "A result has to hold before a review committee, a funder or a partner. That requires knowing where it comes from and what it does not prove.",
        },
      },
    ],
  },
  "fr",
);

const pourQui = localize(vision.publics, "fr");
const polesFr = aplati(poles, "fr");
const prestationsFr = aplati(prestations, "fr");
const visionFr = aplati(vision, "fr");

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="hero__title">
                Les problèmes du vivant ne se résolvent pas dans <em>une seule discipline</em>.
              </h1>
              <p className="hero__lead">
                INTEGRA SCIENCE réunit biologistes, bioinformaticiens, médecins, pharmacologues et
                spécialistes de l&apos;imagerie et des données. Un seul interlocuteur, du cadrage de
                la question à la restitution des résultats.
              </p>
              <div className="hero__actions">
                <Link className="btn btn--accent btn--on-dark" href="/contact/projet/">
                  Proposer un projet <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link className="btn btn--outline btn--on-dark" href="#methode">
                  Découvrir notre méthode
                </Link>
              </div>
              <div className="hero__facts">
                <div className="hero__fact">
                  <strong>6</strong>
                  <span>pôles d&apos;expertise</span>
                </div>
                <div className="hero__fact">
                  <strong>4</strong>
                  <span>prestations cadrées</span>
                </div>
                <div className="hero__fact">
                  <strong>6</strong>
                  <span>étapes, 6 traces écrites</span>
                </div>
              </div>
            </div>

            <div className="hero__visual">
              <Figure name="hero-genome" wrapperClassName="hero__figure" />
              <div className="hero__badges">
                <span className="hero__chip">
                  <i className="ph ph-check-circle" aria-hidden="true"></i> Revue scientifique croisée
                </span>
                <span className="hero__chip">
                  <i className="ph ph-file-text" aria-hidden="true"></i> Livrables documentés
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONSTAT ================= */}
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
            {P.constatCards.map((c) => (
              <article className="card reveal" key={c.title}>
                <span className="card__icon">
                  <i className={`ph ${c.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{c.title}</h3>
                <p className="card__text">{c.text}</p>
              </article>
            ))}
          </div>

          <div className="grid grid--2 mt-12" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <Figure name="research" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h3
                className="t-h2"
                style={{ fontSize: "var(--fs-h3)", fontFamily: "var(--font-sans)", fontWeight: 600 }}
              >
                L&apos;intelligence artificielle a déplacé la difficulté une seconde fois.
              </h3>
              <p className="t-body-sm t-muted">{visionFr.iaBloc.text}</p>
              <ul className="bullets">
                {visionFr.iaBloc.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link className="link-arrow" href="/expertises/">
                Voir comment nous travaillons <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SIX PÔLES ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            title="Six pôles. Une même exigence de preuve."
            sub="Chaque pôle est autonome dans son domaine et intervient dans les missions des autres. C'est ce croisement qui produit un résultat défendable."
          />

          <div className="grid grid--3">
            {polesFr.map((p) => (
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

      {/* ================= BANDEAU DU RÉSEAU ================= */}
      <section className="section section--soft">
        <div className="container">
          <div className="fig-band reveal">
            <Figure name="convergence" />
            <p className="fig-band__cap">
              Six disciplines, une seule exigence : que le résultat puisse être examiné.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRESTATIONS ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Ce que nous prenons en charge."
            sub="Chaque mission fait l'objet d'une proposition écrite qui précise le périmètre, les livrables, le calendrier et les conditions."
          />

          <div className="grid grid--2">
            {prestationsFr.map((p) => (
              <article className="card reveal" key={p.slug}>
                <span className="card__icon">
                  <i className={`ph ${p.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="card__text">{p.resume}</p>
                <div className="card__foot">
                  <div className="deliverable">
                    <span className="deliverable__label">
                      <i className="ph ph-package" aria-hidden="true"></i> Livrable
                    </span>
                    {p.livrableCourt}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= POUR QUI ================= */}
      <section className="section section--tint">
        <div className="container">
          <SecHead title="Vous avez des données, une question, et pas toutes les compétences pour y répondre." />
          <div className="grid grid--4">
            {pourQui.map((c) => (
              <article className="card reveal" key={c.title}>
                <span className="card__icon">
                  <i className={`ph ${c.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">{c.title}</h3>
                <p className="card__text">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MÉTHODE ================= */}
      <section className="section" id="methode">
        <div className="container">
          <SecHead
            split
            title="Six étapes. Six traces écrites."
            sub="De la première demande au rapport final, chaque étape produit un document qui permet de savoir ce qui a été décidé, par qui, et pourquoi."
          />

          <div className="steps reveal">
            {localize(steps.flowSteps, "fr").map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="step__title">{s.title}</span>
                <span className="step__trace">
                  <i className="ph ph-file-text" aria-hidden="true"></i> {s.trace}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid--2 mt-12" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <Figure name="pipeline" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h3 className="t-h3">
                La traçabilité n&apos;est pas un document en plus. C&apos;est le livrable.
              </h3>
              <p className="t-body-sm t-muted">
                Paramètres, versions d&apos;outils, journaux d&apos;exécution et décisions de revue sont
                conservés avec les résultats. Un rapport que l&apos;on ne peut pas reprendre est un
                rapport que l&apos;on ne peut pas défendre.
              </p>
              <Link className="link-arrow" href="/methode/">
                Voir la méthode en détail <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CITATION ================= */}
      <section className="section section--soft">
        <div className="container container--narrow">
          <Quote
            text={
              <>
                Un résultat scientifique ne doit pas seulement être produit.
                <br />
                Il doit pouvoir être examiné, compris et justifié.
              </>
            }
            by="— Coordination scientifique, INTEGRA SCIENCE"
          />
        </div>
      </section>

      {/* ================= APPEL FINAL ================= */}
      <CtaBand
        title="Une problématique à cadrer ?"
        text={
          <>
            Décrivez-nous la question, le contexte et le résultat attendu. Nous vous répondons avec
            une première lecture du périmètre, des compétences à mobiliser et des conditions de la
            mission.
          </>
        }
        note="Aucune donnée sensible dans le premier échange · Cadrage avant toute mission"
        primary={{ href: "/contact/projet/", label: "Proposer un projet" }}
        secondary={{ href: "/contact/candidature/", label: "Rejoindre le réseau" }}
      />
    </>
  );
}
