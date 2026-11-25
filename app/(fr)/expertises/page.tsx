import Link from "next/link";

import Figure from "@/components/Figure";
import { SecHead, CtaBand } from "@/components/sections/common";
import Network, { type NetNode, type NetEdge } from "@/components/interactive/Network";
import Flow from "@/components/interactive/Flow";
import Counters from "@/components/interactive/Counters";
import {
  aplati,
  networkGeometry,
  poles as polesBilingue,
  steps,
} from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.expertises.title,
  description: seo.expertises.description,
  path: "/expertises/",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const poles = aplati(polesBilingue, "fr");
const flowSteps = aplati(steps.flowSteps, "fr");

const nodes: NetNode[] = networkGeometry.nodes.map((n) => {
  const pole = poles.find((p) => p.slug === n.id || netSlug(n.id) === p.slug);
  return {
    ...n,
    label: pole?.net.label ?? "",
    title: pole?.title ?? "",
    text: pole?.net.text ?? "",
    tags: pole?.net.tags ?? [],
  };
});

function netSlug(id: string): string {
  const map: Record<string, string> = {
    bio: "biologie",
    binf: "bioinformatique",
    img: "bio-imagerie",
    med: "medecine-sante",
    pharma: "pharmacologie",
    stat: "statistiques-ia",
  };
  return map[id] ?? id;
}

const edges: NetEdge[] = networkGeometry.edges;

const compareSans = [
  "On ne sait plus quel paramètre a été employé",
  "La version de l'outil n'est pas notée",
  "Les limites sont découvertes en relecture",
  "Reprendre le travail signifie le refaire",
];

const compareAvec = [
  "Paramètres, versions et décisions sont consignés",
  "Le journal d'exécution permet de rejouer l'analyse",
  "Les réserves sont écrites et assumées",
  "Reprendre le travail signifie l'ouvrir",
];

export default function ExpertisesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Expertises", path: "/expertises/" },
        ])}
      />

      {/* ================= HERO INTERNE ================= */}
      <section className="page-hero parity">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="page-hero__title t-h1">
                Six pôles qui se parlent,
                <br />
                une seule <em>exigence de preuve</em>.
              </h1>
              <p className="page-hero__lead t-lead">
                Aucun pôle ne travaille seul sur une question qui engage plusieurs disciplines.
                Chaque mission mobilise les compétences nécessaires, dès le cadrage, et les fait se
                contredire avant de conclure.
              </p>
              <div className="hero__actions">
                <Link className="btn btn--accent btn--on-dark" href="/contact/projet/">
                  Proposer une problématique <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link className="btn btn--outline btn--on-dark" href="#poles">
                  Voir les six pôles
                </Link>
              </div>
            </div>
            <div className="hero__visual">
              <Figure name="data" wrapperClassName="hero__figure" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CARTE DU RÉSEAU ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Le réseau, pas la hiérarchie."
            sub="Survolez un pôle pour voir avec qui il travaille. Le trait s'allume quand les deux pôles coopèrent sur les mêmes missions."
          />
          <Network nodes={nodes} edges={edges} />
        </div>
      </section>

      {/* ================= LES SIX PÔLES ================= */}
      <section className="section section--soft" id="poles">
        <div className="container">
          <SecHead
            title="Ce que couvre chaque pôle."
            sub="Six domaines, un même standard de documentation. Chaque fiche détaille les capacités, les profils mobilisés et les pôles partenaires."
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
                <p className="card__text">{p.couverture}</p>
                <ul className="bullets">
                  {p.capacites.slice(0, 3).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <span className="pole__link">
                  Voir le détail du pôle <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DIAGRAMME DE FLUX ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Comment une question devient un résultat défendable."
            sub="Sélectionnez une étape pour voir ce qui s'y décide et la trace écrite qui en sort."
          />
          <Flow steps={flowSteps} />
        </div>
      </section>

      {/* ================= LE RÉSEAU EN PRATIQUE ================= */}
      <section className="section">
        <div className="container">
          <div className="fig-band reveal">
            <Figure name="medical" />
            <p className="fig-band__cap">
              Un résultat n&apos;entre dans une décision de santé qu&apos;après avoir été relu par un
              autre pôle.
            </p>
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
                {compareSans.map((t) => (
                  <li key={t}>
                    <i className="ph ph-x-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="compare__col compare__col--after">
              <p className="compare__label">Un résultat documenté</p>
              <ul>
                {compareAvec.map((t) => (
                  <li key={t}>
                    <i className="ph ph-check-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHIFFRES ================= */}
      <section className="section">
        <div className="container">
          <Counters
            items={[
              { value: 6, label: "pôles d'expertise mobilisables" },
              { value: 6, label: "étapes, chacune avec sa trace écrite" },
              { value: 4, label: "prestations cadrées par un livrable nommé" },
            ]}
          />
        </div>
      </section>

      {/* ================= APPEL FINAL ================= */}
      <CtaBand
        title="Une question qui ne tient pas dans un seul pôle ?"
        text={
          <>
            C&apos;est le cas le plus fréquent. Décrivez la question et les données disponibles :
            nous identifions les pôles à mobiliser et la première étape à franchir.
          </>
        }
        note="Aucune donnée sensible dans le premier échange · Cadrage écrit avant toute mission"
        primary={{ href: "/contact/projet/", label: "Proposer une problématique" }}
        secondary={{ href: "/contact/candidature/", label: "Rejoindre le réseau" }}
      />
    </>
  );
}
