import Link from "next/link";

import { PageHero, SecHead, CtaBand } from "@/components/sections/common";
import { roles, steps, engagementsNote } from "@/lib/content/bilingue";
import { poleStatuses } from "@/lib/content/bilingue";
import { t } from "@/lib/locale";
import { pageMeta, seo, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.reseau.title,
  description: seo.reseau.description,
  path: "/reseau/",
});

export default function ReseauPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Le réseau", path: "/reseau/" },
        ])}
      />

      <PageHero
        title={
          <>
            Un réseau,
            <br />
            pas un <em>annuaire</em>.
          </>
        }
        lead="Chaque rôle est écrit avant d'être occupé. Les postes à pourvoir restent visibles : c'est le principe d'un réseau en construction, et la condition pour que personne ne soit affiché sans son accord."
        figure="collaboration"
        primary={{ href: "/contact/candidature/", label: "Rejoindre le réseau" }}
        secondary={{ href: "#roles", label: "Voir les fonctions" }}
      />

      {/* ================= LES FONCTIONS ================= */}
      <section className="section" id="roles">
        <div className="container">
          <SecHead
            split
            title="Cinq fonctions. Une seule règle : le rôle est écrit."
            sub="Une fonction n'est affichée comme occupée qu'une fois la personne officiellement identifiée. Les postes à pourvoir restent visibles : c'est le principe d'un réseau en construction."
          />

          <div className="grid grid--3">
            {roles.map((r) => (
              <article className="card reveal" key={r.key}>
                <span className="card__icon">
                  <i className={`ph ${r.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{t(r.title, "fr")}</h3>
                <p className="card__text">{t(r.text, "fr")}</p>
                <div className="tag-row" style={{ marginTop: "auto" }}>
                  <span className="tag">{t(r.tag, "fr")}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LES MEMBRES ================= */}
      <section className="section section--soft">
        <div className="container">
          <SecHead
            title="Les membres et experts."
            sub="Un responsable par pôle, avec les autres membres du pôle. Aucun profil réel n'est publié sans l'accord de la personne : ni nom, ni fonction, ni lien professionnel."
          />

          <div className="grid grid--3">
            {poleStatuses.map((p) => (
              <article className="post reveal" key={p.key}>
                <div className="post__meta">
                  <span className="post__kind">{`Pôle ${p.pole.num.fr}`}</span>
                </div>
                <h3 className="post__title">{t(p.pole.title, "fr")}</h3>
                <p className="post__text">{t(p.fonction, "fr")}</p>
                <div className="post__foot">
                  <span className="tag">{t(p.statut, "fr")}</span>
                  <Link className="link-arrow" href={`/expertises/${p.pole.slug.fr}/`}>
                    Voir le pôle <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="empty reveal" style={{ marginTop: "var(--s8)" }}>
            <i className="ph ph-user-circle-dashed" aria-hidden="true"></i>
            <h3>Les fiches détaillées attendent les accords</h3>
            <p>
              Chaque personne est publiée une fois qu&apos;elle a donné son accord sur son nom,
              sa fonction et son lien professionnel. Les fiches apparaîtront ici.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ENGAGEMENTS ================= */}
      <section className="section">
        <div className="container">
          <SecHead title="Ce à quoi nous nous engageons." />

          <div className="grid grid--3">
            {steps.engagements.map((e) => (
              <article className="card reveal" key={String(e.icon)}>
                <span className="card__icon">
                  <i className={`ph ${String(e.icon)}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">{t(e.title as never, "fr")}</h3>
                <p className="card__text">{t(e.text as never, "fr")}</p>
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

      <CtaBand
        title="Le réseau est ouvert à celles et ceux qui arrivent tôt."
        text={
          <>
            Une place de membre fondateur, un cadre pluridisciplinaire, et la maîtrise de
            l&apos;usage de votre nom. Aucune exclusivité : vous restez libre de vos autres
            engagements.
          </>
        }
        note="Aucun profil publié sans accord écrit · Ni nom, ni fonction, ni lien sans validation"
        primary={{ href: "/contact/candidature/", label: "Rejoindre le réseau" }}
        secondary={{ href: "/expertises/", label: "Voir les six pôles" }}
      />
    </>
  );
}
