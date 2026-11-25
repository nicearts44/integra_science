import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import { aplati, catalogues, references } from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.actualites.title,
  description: seo.actualites.description,
  path: "/actualites/",
});

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const actualitesPubliees = () => aplati(catalogues.actualites, "fr");
const gabaritsActualites = aplati(references.gabaritsActualites, "fr");

export default function ActualitesPage() {
  const actus = actualitesPubliees();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Actualités", path: "/actualites/" },
        ])}
      />

      <PageHero
        title={
          <>
            Ce qui bouge
            <br />
            dans le <em>réseau</em>.
          </>
        }
        lead="Arrivées, missions en cours, prises de position. Une actualité est un contenu simple : un titre, deux à trois phrases, une catégorie, une date."
        figure="analytics"
        primary={{ href: "/references/", label: "Voir les références" }}
        secondary={{ href: "/newsletter/", label: "S'abonner à la lettre" }}
      />

      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Le fil des actualités."
            sub="Chaque entrée est datée. Aucune date n'est annoncée à l'avance : ce qui est publié a eu lieu."
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
                  Un flux RSS sera disponible dès la première publication. Les cartes ci-dessus
                  montrent la forme attendue, pas des actualités réelles.
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
        title="Recevoir les actualités par courriel ?"
        text={
          <>
            La lettre d&apos;information paraît rarement, et seulement quand il y a quelque
            chose à dire. Désinscription en un clic.
          </>
        }
        note="Double opt-in · Aucune donnée transmise à un tiers · Désinscription en un clic"
        primary={{ href: "/newsletter/", label: "S'abonner à la lettre" }}
        secondary={{ href: "/contact/", label: "Nous écrire" }}
      />
    </>
  );
}
