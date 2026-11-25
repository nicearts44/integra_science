import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import { aplati, catalogues, references } from "@/lib/content/bilingue";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.casUsage.title,
  description: seo.casUsage.description,
  path: "/cas-usage/",
});

/* Contenu lu dans lib/content/bilingue.ts, projeté en français. */
const casPublies = () => aplati(catalogues.casUsage, "fr");
const gabaritsCas = aplati(references.gabaritsCas, "fr");

export default function CasUsagePage() {
  const reels = casPublies();
  const source = reels.length
    ? reels.map((c) => ({ ...c, gabarit: false }))
    : gabaritsCas.map((g) => ({ ...g, gabarit: true }));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Cas d'usage", path: "/cas-usage/" },
        ])}
      />

      <PageHero
        title={
          <>
            Une situation réelle,
            <br />
            décrite <em>sans la nommer</em>.
          </>
        }
        lead="La question posée, ce qui a été fait, ce qui en est sorti, et ce que cela ne prouve pas. C'est ce dernier paragraphe qui distingue un cas d'usage d'une publicité."
        figure="restitution"
        primary={{ href: "/contact/projet/", label: "Proposer une problématique" }}
        secondary={{ href: "/references/", label: "Voir aussi les publications" }}
      />

      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Ce qui a été fait, et ce que cela ne prouve pas."
            sub="Chaque cas est publié après vérification et anonymisation. Aucun élément ne permet de ré-identifier le demandeur."
          />

          <div className="grid grid--2">
            {source.map((c, i) => (
              <article className="post reveal" key={`${c.title}-${i}`}>
                <div className="post__meta">
                  {c.gabarit && <span className="post__kind">Gabarit</span>}
                  <span>Cas d&apos;usage</span>
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

          {reels.length === 0 && (
            <div className="empty reveal" style={{ marginTop: "var(--s8)" }}>
              <i className="ph ph-briefcase" aria-hidden="true"></i>
              <h3>Aucun cas d&apos;usage publié pour le moment</h3>
              <p>
                Un cas n&apos;est publié qu&apos;une fois vérifié par un pôle relecteur et
                anonymisé avec l&apos;accord du demandeur. Les cartes ci-dessus en montrent la
                forme attendue.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Votre situation ressemble à l'une de celles-ci ?"
        text={
          <>
            Décrivez la question et les données disponibles. Nous identifions les pôles à
            mobiliser et la première étape à franchir.
          </>
        }
        note="Aucune donnée sensible dans le premier échange · Cadrage écrit avant toute mission"
        primary={{ href: "/contact/projet/", label: "Proposer une problématique" }}
        secondary={{ href: "/methode/", label: "Voir la méthode" }}
      />
    </>
  );
}
