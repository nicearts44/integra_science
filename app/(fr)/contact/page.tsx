import Link from "next/link";

import Figure from "@/components/Figure";
import { PageHero, SecHead, Quote } from "@/components/sections/common";
import { siteParams } from "@/lib/content/site";
import { breadcrumbLd, citationAttribution, JsonLd, pageMeta, seo } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.contact.title,
  description: seo.contact.description,
  path: "/contact/",
});

/* Coordonnées — COPYWRITING § 12.6 : un champ vide, aucune ligne rendue. */
type Ligne = { icon: string; label: string; value: string; href?: string };

function coordonnees(): Ligne[] {
  const lignes: Ligne[] = [];
  if (siteParams.adresse) lignes.push({ icon: "ph-map-pin", label: "Adresse postale", value: siteParams.adresse });
  if (siteParams.telephone) {
    lignes.push({ icon: "ph-phone", label: "Téléphone", value: siteParams.telephone, href: `tel:${siteParams.telephone.replace(/[^\d+]/g, "")}` });
  }
  if (siteParams.email_contact) {
    lignes.push({ icon: "ph-envelope-simple", label: "Email de contact", value: siteParams.email_contact, href: `mailto:${siteParams.email_contact}` });
  }
  if (siteParams.horaires) lignes.push({ icon: "ph-clock", label: "Horaires", value: siteParams.horaires });
  return lignes;
}

export default function ContactPage() {
  const lignes = coordonnees();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact/" },
        ])}
      />

      {/* ================= HERO INTERNE ================= */}
      <PageHero
        title="Décrivez-nous votre problématique."
        lead="Un premier échange sert à comprendre la question, le contexte et le résultat attendu. Il ne vous engage à rien, et n'exige aucune donnée sensible."
        figure="contact"
        primary={{ href: "/contact/projet/", label: "Écrire au réseau" }}
        secondary={{ href: "/contact/candidature/", label: "Rejoindre le réseau" }}
      />

      {/* ================= TROIS CHEMINS ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Trois manières de nous écrire."
            sub="Choisissez le chemin qui correspond à votre situation : le formulaire et le délai de réponse ne sont pas les mêmes."
          />

          <div className="grid grid--3">
            <Link className="card reveal" href="/contact/projet/">
              <span className="card__icon">
                <i className="ph ph-flask" aria-hidden="true"></i>
              </span>
              <h3 className="t-h3">Proposer un projet</h3>
              <p className="card__text">Vous avez une problématique scientifique ou médicale à cadrer.</p>
              <span className="link-arrow">
                Réponse sous 3 jours ouvrés <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </span>
            </Link>

            <Link className="card reveal" href="/contact/candidature/">
              <span className="card__icon">
                <i className="ph ph-users-three" aria-hidden="true"></i>
              </span>
              <h3 className="t-h3">Rejoindre le réseau</h3>
              <p className="card__text">Vous souhaitez contribuer à un réseau pluridisciplinaire.</p>
              <span className="link-arrow">
                Échange préalable <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </span>
            </Link>

            <Link className="card reveal" href="/contact/partenariat/">
              <span className="card__icon">
                <i className="ph ph-buildings" aria-hidden="true"></i>
              </span>
              <h3 className="t-h3">Partenariat institutionnel</h3>
              <p className="card__text">Vous représentez une institution, un laboratoire ou un partenaire.</p>
              <span className="link-arrow">
                Prendre contact <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FORMULAIRE ================= */}
      <section className="section section--soft" id="formulaire">
        <div className="container">
          <div className="grid grid--2" style={{ gap: "var(--s12)", alignItems: "start" }}>
            <div className="reveal">
              <h2 className="t-h2" style={{ marginBottom: "var(--s4)" }}>
                Décrire la demande
              </h2>
              <p className="t-body-sm t-muted" style={{ marginBottom: "var(--s6)" }}>
                Plus la description est précise, plus la première réponse est utile. Cinquante caractères minimum :
                une phrase suffit.
              </p>

              <ul className="bullets">
                <li>
                  <Link className="link-arrow" href="/contact/projet/">
                    Proposer un projet <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </Link>
                </li>
                <li>
                  <Link className="link-arrow" href="/contact/candidature/">
                    Rejoindre le réseau <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </Link>
                </li>
                <li>
                  <Link className="link-arrow" href="/contact/partenariat/">
                    Partenariat institutionnel <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </Link>
                </li>
              </ul>
            </div>

            <aside className="reveal stack-md">
              <div className="card">
                <span className="card__icon">
                  <i className="ph ph-clock" aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">Ce qui se passe ensuite</h3>
                <ol className="spec-list">
                  <li className="spec-list__row">
                    <span className="spec-list__term">Accusé de réception</span>
                    <span className="spec-list__desc">Sous 2 jours ouvrés</span>
                  </li>
                  <li className="spec-list__row">
                    <span className="spec-list__term">Première lecture</span>
                    <span className="spec-list__desc">Périmètre, compétences, questions ouvertes</span>
                  </li>
                  <li className="spec-list__row">
                    <span className="spec-list__term">Échange</span>
                    <span className="spec-list__desc">Si la demande le justifie</span>
                  </li>
                  <li className="spec-list__row">
                    <span className="spec-list__term">Proposition</span>
                    <span className="spec-list__desc">Écrite : livrables, calendrier, conditions</span>
                  </li>
                </ol>
              </div>

              <div className="card">
                <span className="card__icon">
                  <i className="ph ph-shield-check" aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">Confidentialité</h3>
                <p className="card__text">
                  Le premier échange sert à comprendre la question, pas à transférer les données. Le cadre d'échange,
                  la durée de conservation et les destinataires sont définis avant toute transmission.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ================= REJOINDRE LE RÉSEAU ================= */}
      <section className="section" id="rejoindre">
        <div className="container">
          <div className="grid grid--2" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <Figure name="collaboration" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h2 className="t-h2">Le réseau grandit par cooptation, pas par annuaire.</h2>
              <p className="t-body-sm t-muted">
                Chaque personne est identifiée par un pôle, avec un rôle explicite et une reconnaissance de sa
                contribution. Rien n'est publié sans son accord : ni nom, ni fonction, ni lien professionnel.
              </p>
              <ul className="bullets">
                <li>Une place de membre fondateur, pour celles et ceux qui arrivent tôt</li>
                <li>Un cadre pluridisciplinaire pour travailler sur des projets concrets</li>
                <li>La maîtrise de l'usage de votre nom et de vos contributions</li>
                <li>Aucune exclusivité : vous restez libre de vos autres engagements</li>
              </ul>
              <Link className="link-arrow" href="/contact/projet/">
                Écrire au réseau <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CITATION ================= */}
      <section className="section section--soft">
        <div className="container container--narrow">
          <Quote
            text="Une demande bien posée vaut mieux qu'une analyse rapide."
            by={`— ${citationAttribution()}`}
          />
        </div>
      </section>

      {/* ================= COORDONNÉES (§ 12.6) ================= */}
      {lignes.length > 0 && (
        <section className="section">
          <div className="container">
            <SecHead title="Coordonnées" />
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "var(--s3)" }}>
              {lignes.map((ligne) => (
                <p className="contact-line" key={ligne.label}>
                  <i className={`ph ${ligne.icon}`} aria-hidden="true"></i>
                  <span>
                    <strong>{ligne.label} : </strong>
                    {ligne.href ? <a href={ligne.href}>{ligne.value}</a> : ligne.value}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
