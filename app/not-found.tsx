import Link from "next/link";

import { pageMeta, seo } from "@/lib/seo";

export const metadata = pageMeta({
  title: seo.introuvable.title,
  description: seo.introuvable.description,
  path: "/404",
});

const LIENS = [
  { href: "/", label: "Accueil", icon: "ph-house" },
  { href: "/expertises/", label: "Expertises", icon: "ph-flask" },
  { href: "/prestations/", label: "Prestations", icon: "ph-briefcase" },
  { href: "/contact/", label: "Contact", icon: "ph-envelope" },
];

export default function NotFound() {
  return (
    <>
      <section className="page-hero parity">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="page-hero__title t-h1">Cette page n'existe pas.</h1>
              <p className="page-hero__lead t-lead">
                Le lien que vous avez suivi ne mène nulle part — ou plus. Les sections ci-dessous vous ramèneront à
                l'essentiel.
              </p>
            </div>
            <div className="hero__visual">
              <p className="t-display" style={{ textAlign: "center" }}>
                404
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--4">
            {LIENS.map((lien) => (
              <Link className="card reveal" href={lien.href} key={lien.href}>
                <span className="card__icon">
                  <i className={`ph ${lien.icon}`} aria-hidden="true"></i>
                </span>
                <span className="t-h3">{lien.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
