import Link from "next/link";

import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import Tabs, { type TabItem } from "@/components/interactive/Tabs";
import { aplati, catalogues, references } from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.references.title,
  description: seo.references.description,
  path: "/references/",
});

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const conditions = aplati(references.conditions, "fr");
const gabaritsPublications = aplati(references.gabaritsPublications, "fr");
const gabaritsCas = aplati(references.gabaritsCas, "fr");
const gabaritsActualites = aplati(references.gabaritsActualites, "fr");
const publicationsPubliees = () => aplati(catalogues.publications, "fr");
const casPublies = () => aplati(catalogues.casUsage, "fr");
const actualitesPubliees = () => aplati(catalogues.actualites, "fr");

/* ------------------------------------------------------------------ */
/* Publications                                                        */
/* ------------------------------------------------------------------ */

function PublicationsPanel({ filtre }: { filtre?: "Article" | "Communication" | "Rapport" }) {
  const reelles = publicationsPubliees().filter((p) => !filtre || p.type === filtre);

  if (reelles.length === 0) {
    if (filtre) {
      const libelle = filtre === "Article" ? "Articles" : filtre === "Communication" ? "Communications" : "Rapports";
      const icon = filtre === "Article" ? "ph-file-text" : filtre === "Communication" ? "ph-microphone-stage" : "ph-clipboard-text";
      const texte =
        filtre === "Article"
          ? "Cette catégorie se remplira dès la première publication vérifiée."
          : filtre === "Communication"
            ? "Congrès, colloques et séminaires auxquels le réseau participe."
            : "Rapports rendus publics avec l'accord du demandeur.";
      return (
        <div className="empty">
          <i className={`ph ${icon}`} aria-hidden="true"></i>
          <h3>{libelle}</h3>
          <p>{texte}</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid--3">
          {gabaritsPublications.map((g, i) => (
            <article className="post reveal" key={`${g.title}-${i}`}>
              <div className="post__meta">
                <span className="post__kind">Gabarit</span>
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
          <h3>Aucune publication en ligne pour le moment</h3>
          <p>
            Les trois cartes ci-dessus sont des gabarits : elles montrent la forme que
            prendront les contenus, pas des publications réelles. Elles seront remplacées au fur
            et à mesure des vérifications et des accords.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="grid grid--3">
      {reelles.map((p) => (
        <article className="post reveal" key={p.slug}>
          <div className="post__meta">
            <span className="post__kind">{p.type}</span>
            <span>{p.cadre}</span>
          </div>
          <h3 className="post__title">{p.title}</h3>
          <p className="post__text">{p.resume}</p>
          <div className="post__foot">
            <span className="tag">{p.cadre}</span>
            <span className="t-mono">{p.annee}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cas d'usage                                                         */
/* ------------------------------------------------------------------ */

function CasPanel() {
  const reels = casPublies();

  if (reels.length === 0) {
    return (
      <>
        <div className="grid grid--2">
          {gabaritsCas.map((g, i) => (
            <article className="post reveal" key={i}>
              <div className="post__meta">
                <span className="post__kind">Gabarit</span>
                <span>Cas d&apos;usage</span>
              </div>
              <h3 className="post__title">{g.title}</h3>
              <p className="post__text">
                <strong>La situation.</strong> {g.situation}
              </p>
              <p className="post__text">
                <strong>La question.</strong> {g.question}
              </p>
              <p className="post__text">
                <strong>Ce qui a été fait.</strong> {g.fait}
              </p>
              <p className="post__text">
                <strong>Ce que cela ne prouve pas.</strong> {g.limites}
              </p>
              <div className="post__foot">
                <span className="tag">Anonymisé</span>
                <span className="t-mono">{g.duree}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="empty reveal" style={{ marginTop: "var(--s8)" }}>
          <i className="ph ph-briefcase" aria-hidden="true"></i>
          <h3>Aucun cas d&apos;usage publié pour le moment</h3>
          <p>
            Un cas d&apos;usage n&apos;est publié qu&apos;une fois vérifié et anonymisé. Les
            deux cartes ci-dessus en montrent la forme attendue.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="grid grid--2">
      {reels.map((c) => (
        <article className="post reveal" key={c.slug}>
          <div className="post__meta">
            <span className="post__kind">Cas d&apos;usage</span>
            <span>{c.duree}</span>
          </div>
          <h3 className="post__title">{c.title}</h3>
          <p className="post__text">
            <strong>La situation.</strong> {c.situation}
          </p>
          <p className="post__text">
            <strong>La question.</strong> {c.question}
          </p>
          <p className="post__text">
            <strong>Ce qui a été fait.</strong> {c.fait}
          </p>
          <p className="post__text">
            <strong>Ce que cela ne prouve pas.</strong> {c.limites}
          </p>
          <div className="post__foot">
            <span className="tag">Anonymisé</span>
            <span className="t-mono">{c.duree}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ReferencesPage() {
  const actus = actualitesPubliees();

  const publicationTabs: TabItem[] = [
    { id: "toutes", label: "Toutes", content: <PublicationsPanel /> },
    { id: "articles", label: "Articles", content: <PublicationsPanel filtre="Article" /> },
    {
      id: "communications",
      label: "Communications",
      content: <PublicationsPanel filtre="Communication" />,
    },
    { id: "rapports", label: "Rapports", content: <PublicationsPanel filtre="Rapport" /> },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Références", path: "/references/" },
        ])}
      />

      <PageHero
        title={
          <>
            Publications et cas d&apos;usage.
            <br />
            <em>Ce qui a été vérifié</em>.
          </>
        }
        lead="Chaque contenu publié ici est vérifié avant parution, et anonymisé lorsque le demandeur ne souhaite pas être nommé. Deux règles, non négociables : un contenu non vérifié ne paraît pas, un contenu non anonymisé ne paraît pas."
        figure="publications"
      />

      {/* ================= LES DEUX GATES ================= */}
      <section className="section">
        <div className="container">
          <div className="compare reveal">
            {conditions.map((c) => (
              <div
                className={`compare__col${c.label.startsWith("Condition 2") ? " compare__col--after" : ""}`}
                key={c.label}
              >
                <p className="compare__label">{c.label}</p>
                <ul>
                  {c.items.map((i) => (
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

      {/* ================= PUBLICATIONS ================= */}
      <section className="section section--soft" id="publications">
        <div className="container">
          <SecHead
            split
            title="Publications."
            sub="Travaux scientifiques, communications et rapports rendus publics avec l'accord des parties."
          />
          <Tabs items={publicationTabs} ariaLabel="Filtrer les publications" />
        </div>
      </section>

      {/* ================= CAS D'USAGE ================= */}
      <section className="section" id="cas-usage">
        <div className="container">
          <SecHead
            split
            title="Cas d'usage."
            sub="Une situation réelle, décrite sans la nommer : la question posée, ce qui a été fait, ce qui en est sorti, et ce que cela ne prouve pas."
          />
          <CasPanel />
        </div>
      </section>

      {/* ================= ACTUALITÉS ================= */}
      <section className="section section--soft" id="actualites">
        <div className="container">
          <SecHead
            split
            title="Actualités."
            sub="Ce qui bouge dans le réseau : arrivées, missions en cours, prises de position."
          />

          {actus.length === 0 ? (
            <>
              <div className="grid grid--3">
                {gabaritsActualites.map((g, i) => (
                  <article className="post reveal" key={i}>
                    <div className="post__meta">
                      <span className="post__kind">Gabarit</span>
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
                <h3>Le flux d&apos;actualités est prêt, il attend ses premières entrées</h3>
                <p>
                  Chaque actualité est un contenu éditorial simple : un titre, deux à trois
                  phrases, une catégorie, une date. Un flux RSS sera disponible dès la première
                  publication.
                </p>
              </div>
            </>
          ) : (
            <div className="grid grid--3">
              {actus.map((a) => (
                <article className="post reveal" key={a.slug}>
                  <div className="post__meta">
                    <span className="post__kind">{a.categorie}</span>
                    <span>{DATE_FORMAT.format(new Date(a.date))}</span>
                  </div>
                  <h3 className="post__title">{a.title}</h3>
                  <p className="post__text">{a.text}</p>
                  <div className="post__foot">
                    <span className="tag">{a.categorie}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Un travail qui mérite d'être raconté ?"
        text={
          <>
            Un cas d&apos;usage se publie avec votre accord, anonymisé si vous le souhaitez, et
            après relecture par un pôle qui n&apos;a pas réalisé la mission.
          </>
        }
        note="Vérification et anonymisation avant toute parution · Aucun nom sans accord écrit"
        primary={{ href: "/contact/projet/", label: "Nous écrire" }}
        secondary={{ href: "/methode/", label: "Voir la méthode" }}
      />

      <p className="t-subtle t-body-sm container" style={{ paddingBottom: "var(--s10)" }}>
        <Link className="link-inline" href="/publications/">
          Voir toutes les publications
        </Link>{" "}
        ·{" "}
        <Link className="link-inline" href="/cas-usage/">
          Voir tous les cas d&apos;usage
        </Link>{" "}
        ·{" "}
        <Link className="link-inline" href="/actualites/">
          Voir toutes les actualités
        </Link>
      </p>
    </>
  );
}
