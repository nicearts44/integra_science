import Link from "next/link";

import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import { aplati, engagementsNote as engagementsNoteBilingue, steps } from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.qualite.title,
  description: seo.qualite.description,
  path: "/qualite-scientifique/",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const engagements = aplati(steps.engagements, "fr");
const engagementsNote = aplati(engagementsNoteBilingue, "fr");

export default function QualitePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Qualité scientifique", path: "/qualite-scientifique/" },
        ])}
      />

      <PageHero
        title={
          <>
            Cinq engagements
            <br />
            <em>vérifiables</em>.
          </>
        }
        lead="Un engagement qui ne se vérifie pas n'est pas un engagement. Ceux-ci décrivent notre manière de travailler, et ce qu'un demandeur peut exiger de nous à chaque étape."
        figure="proof"
        primary={{ href: "/methode/", label: "Voir la méthode" }}
        secondary={{ href: "/contact/projet/", label: "Nous écrire" }}
      />

      <section className="section">
        <div className="container">
          <SecHead
            title="Ce à quoi nous nous engageons."
            sub="Chaque engagement renvoie à une trace écrite produite pendant la mission."
          />

          <div className="grid grid--3">
            {engagements.map((e) => (
              <article className="card reveal" key={e.title}>
                <span className="card__icon">
                  <i className={`ph ${e.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">{e.title}</h3>
                <p className="card__text">{e.text}</p>
              </article>
            ))}
          </div>

          <p
            className="t-subtle t-body-sm"
            style={{ marginTop: "var(--s6)", maxWidth: "60ch" }}
          >
            {engagementsNote}
          </p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container container--narrow">
          <div className="stack-md">
            <h2 className="t-h2">Ce que nous refusons de promettre.</h2>
            <p className="t-body-sm t-muted">
              Nous ne délivrons ni certification, ni accréditation, ni validation clinique
              officielle. Nous n&apos;affirmons pas qu&apos;un résultat est « fiable » : nous
              disons ce qu&apos;il autorise à conclure, et dans quelles conditions.
            </p>
            <p className="t-body-sm t-muted">
              Cette limite est aussi une garantie : elle oblige à écrire les réserves au lieu
              de les taire.
            </p>
            <Link className="link-arrow" href="/prestations/">
              Voir le périmètre des prestations{" "}
              <i className="ph ph-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Une exigence de preuve à opposer à un résultat ?"
        text={
          <>
            Décrivez la conclusion que l&apos;on vous demande d&apos;accepter et les éléments
            fournis. Nous disons ce qui manque pour pouvoir la défendre.
          </>
        }
        note="Aucune donnée sensible dans le premier échange · Cadrage écrit avant toute mission"
        primary={{ href: "/contact/projet/", label: "Proposer une problématique" }}
        secondary={{ href: "/reseau/", label: "Voir le réseau" }}
      />
    </>
  );
}
