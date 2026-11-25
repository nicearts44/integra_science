import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import Tabs, { type TabItem } from "@/components/interactive/Tabs";
import { aplati, catalogues, references } from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.publications.title,
  description: seo.publications.description,
  path: "/publications/",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const publicationsPubliees = () => aplati(catalogues.publications, "fr");
const gabaritsPublications = aplati(references.gabaritsPublications, "fr");

type TypePub = "Article" | "Communication" | "Rapport";

function Liste({ filtre }: { filtre?: TypePub }) {
  const reelles = publicationsPubliees().filter((p) => !filtre || p.type === filtre);
  const source = reelles.length
    ? reelles.map((p) => ({ title: p.title, resume: p.resume, cadre: p.cadre, annee: p.annee, gabarit: false }))
    : gabaritsPublications
        .filter((g) => !filtre || g.type === filtre)
        .map((g) => ({ title: g.title, resume: g.resume, cadre: g.cadre, annee: g.annee, gabarit: true }));

  return (
    <>
      <div className="grid grid--3">
        {source.map((p, i) => (
          <article className="post reveal" key={`${p.title}-${i}`}>
            <div className="post__meta">
              {p.gabarit && <span className="post__kind">Gabarit</span>}
              <span>{filtre ?? "Publication"}</span>
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

      {reelles.length === 0 && (
        <div className="empty reveal" style={{ marginTop: "var(--s8)" }}>
          <i className="ph ph-newspaper" aria-hidden="true"></i>
          <h3>Aucune publication en ligne pour le moment</h3>
          <p>
            Les cartes ci-dessus sont des gabarits : elles montrent la forme que prendront les
            contenus, pas des publications réelles. Elles seront remplacées au fur et à mesure
            des vérifications et des accords.
          </p>
        </div>
      )}
    </>
  );
}

export default function PublicationsPage() {
  const tabs: TabItem[] = [
    { id: "toutes", label: "Toutes", content: <Liste /> },
    { id: "articles", label: "Articles", content: <Liste filtre="Article" /> },
    { id: "communications", label: "Communications", content: <Liste filtre="Communication" /> },
    { id: "rapports", label: "Rapports", content: <Liste filtre="Rapport" /> },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Publications", path: "/publications/" },
        ])}
      />

      <PageHero
        title={
          <>
            Publications
            <br />
            <em>vérifiées</em>.
          </>
        }
        lead="Travaux scientifiques, communications et rapports rendus publics avec l'accord des parties. Aucun contenu n'est publié avant d'avoir été relu par un pôle qui n'a pas réalisé le travail."
        figure="publications"
        primary={{ href: "/references/", label: "Voir aussi les cas d'usage" }}
      />

      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Ce qui a été publié."
            sub="Filtrer par nature de contenu. Les entrées vérifiées remplacent les gabarits au fil des parutions."
          />
          <Tabs items={tabs} ariaLabel="Filtrer les publications" />
        </div>
      </section>

      <CtaBand
        title="Un travail qui mérite d'être publié ?"
        text={
          <>
            Un résultat se publie avec l&apos;accord du demandeur, après relecture croisée. Les
            limites sont écrites dans le texte, pas sous-entendues.
          </>
        }
        note="Vérification et anonymisation avant toute parution · Aucun nom sans accord écrit"
        primary={{ href: "/contact/projet/", label: "Nous écrire" }}
        secondary={{ href: "/references/", label: "Voir les références" }}
      />
    </>
  );
}
