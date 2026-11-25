import Link from "next/link";

import Figure from "@/components/Figure";
import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import Tabs, { type TabItem } from "@/components/interactive/Tabs";
import {
  aplati,
  prestations as prestationsBilingue,
  prestationsPage,
} from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.prestations.title,
  description: seo.prestations.description,
  path: "/prestations/",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const prestations = aplati(prestationsBilingue, "fr");
const livrablesPage = aplati(prestationsPage.livrables, "fr");
const perimetreExclu = aplati(prestationsPage.perimetreExclu, "fr");

/** Libellés courts des onglets (maquette prestations.html). */
const TAB_LABELS: Record<string, string> = {
  "analyse-omiques": "Données omiques",
  "pipelines-reproductibles": "Pipelines reproductibles",
  "statistiques-appui-methodologique": "Statistiques et méthodologie",
  "evaluation-ia": "Évaluation de résultats d'IA",
};

function PrestationPanel({ slug }: { slug: string }) {
  const p = prestations.find((x) => x.slug === slug);
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

        <h3 className="t-h4">Ce que nous faisons</h3>
        <ul className="bullets">
          {p.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <h3 className="t-h4">Profils mobilisés</h3>
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
            <i className="ph ph-file-text" aria-hidden="true"></i> Livrables
          </p>
          <ul className="bullets">
            {p.livrables.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="t-h4">Conditions</h3>
          <p className="card__text">{p.conditions}</p>
        </div>

        <Link className="link-arrow" href="/contact/projet/">
          Proposer ce type de mission <i className="ph ph-arrow-right" aria-hidden="true"></i>
        </Link>
      </div>
    </div>
  );
}

export default function PrestationsPage() {
  const tabs: TabItem[] = prestations.map((p) => ({
    id: p.slug,
    label: TAB_LABELS[p.slug] ?? p.title,
    content: <PrestationPanel slug={p.slug} />,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Prestations", path: "/prestations/" },
        ])}
      />

      <PageHero
        title={
          <>
            Quatre prestations.
            <br />
            Quatre <em>livrables nommés</em>.
          </>
        }
        lead="Chaque mission fait l'objet d'une proposition écrite qui précise le périmètre, les livrables, le calendrier et les conditions. Rien ne commence avant que ces quatre éléments soient arrêtés."
        figure="documents"
        primary={{ href: "/contact/projet/", label: "Proposer un projet" }}
        secondary={{ href: "#prestations", label: "Voir les quatre prestations" }}
      />

      {/* ================= LES QUATRE PRESTATIONS ================= */}
      <section className="section" id="prestations">
        <div className="container">
          <Tabs items={tabs} ariaLabel="Prestations" />
        </div>
      </section>

      {/* ================= LE LIVRABLE ================= */}
      <section className="section section--soft">
        <div className="container">
          <SecHead
            split
            title="Un livrable n'est pas un PDF."
            sub="Chaque mission remet l'ensemble de ce qui permet de comprendre, vérifier et reprendre le travail. Le rapport seul n'est jamais suffisant."
          />

          <div className="grid grid--3">
            {livrablesPage.map((l) => (
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

      {/* ================= PÉRIMÈTRE EXCLU ================= */}
      <section className="section">
        <div className="container">
          <div
            className="grid grid--2"
            style={{ alignItems: "center", gap: "var(--s12)" }}
          >
            <div className="reveal stack-md">
              <h2 className="t-h2">{perimetreExclu.title}</h2>
              <p className="t-body-sm t-muted">{perimetreExclu.intro}</p>
              <ul className="bullets">
                {perimetreExclu.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <Figure name={perimetreExclu.figure} wrapperClassName="figure reveal" />
          </div>
        </div>
      </section>

      <CtaBand
        title="Décrivez le résultat attendu, pas seulement les données."
        text={
          <>
            Le périmètre, les livrables et le calendrier se décident au cadrage. Plus la
            demande est précise, plus la proposition l&apos;est.
          </>
        }
        note="Aucune donnée sensible dans le premier échange · Cadrage écrit avant toute mission"
        primary={{ href: "/contact/projet/", label: "Décrire un projet" }}
        secondary={{ href: "/methode/", label: "Voir la méthode" }}
      />
    </>
  );
}
