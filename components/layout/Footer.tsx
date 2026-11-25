import Link from "next/link";

import { siteParams } from "@/lib/content/site";
import { ui, type Locale } from "@/lib/strings";

/** Réseaux : l'icône n'est rendue que si l'URL est renseignée (§ 16.2). */
const socials: Array<{ key: string; href: string; icon: string; label: string }> = [
  { key: "linkedin", href: siteParams.linkedin, icon: "ph-linkedin-logo", label: "LinkedIn" },
  { key: "x_twitter", href: siteParams.x_twitter, icon: "ph-x-logo", label: "X" },
  { key: "orcid", href: siteParams.orcid, icon: "ph-link-simple", label: "ORCID" },
  { key: "researchgate", href: siteParams.researchgate, icon: "ph-link-simple", label: "ResearchGate" },
  { key: "google_scholar", href: siteParams.google_scholar, icon: "ph-link-simple", label: "Google Scholar" },
].filter((s) => s.href !== "");

/** Bloc coordonnées : entièrement omis si les quatre champs sont vides (§ 16.2). */
const hasContact =
  siteParams.adresse !== "" ||
  siteParams.telephone !== "" ||
  siteParams.email_contact !== "" ||
  siteParams.horaires !== "";

export default function Footer({ locale = "fr" }: { locale?: Locale }) {
  const year = new Date().getFullYear();
  const t = ui(locale);
  const navLinks = t.footerNavLinks;
  const referenceLinks = t.footerRefLinks;
  const infoLinks = t.footerInfoLinks;
  const home = locale === "en" ? "/en/" : "/";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link className="logo" href={home}>
              <span className="logo__mark">
                <i className="ph ph-hexagon" aria-hidden="true"></i>
              </span>
              <span className="logo__text">
                INTEGRA <span>SCIENCE</span>
              </span>
            </Link>
            <p className="footer__baseline">{t.footerBaseline}</p>
            {socials.length > 0 && (
              <div className="tag-row" style={{ marginTop: "var(--s4)" }}>
                {socials.map((s) => (
                  <a key={s.key} className="icon-btn" href={s.href} aria-label={s.label} title={s.label} rel="noopener noreferrer" target="_blank">
                    <i className={`ph ${s.icon}`} aria-hidden="true"></i>
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-labelledby="f1">
            <h2 className="footer__heading" id="f1">
              {t.footerNav}
            </h2>
            <ul className="footer__list">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f2">
            <h2 className="footer__heading" id="f2">
              {t.footerRefs}
            </h2>
            <ul className="footer__list">
              {referenceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f3">
            <h2 className="footer__heading" id="f3">
              {t.footerInfo}
            </h2>
            <ul className="footer__list">
              {infoLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
            {hasContact && (
              <address style={{ marginTop: "var(--s4)", fontStyle: "normal", display: "grid", gap: "6px" }}>
                {siteParams.email_contact !== "" && (
                  <span className="contact-line">
                    <i className="ph ph-envelope" aria-hidden="true"></i>
                    <a href={`mailto:${siteParams.email_contact}`}>{siteParams.email_contact}</a>
                  </span>
                )}
                {siteParams.telephone !== "" && (
                  <span className="contact-line">
                    <i className="ph ph-phone" aria-hidden="true"></i>
                    <a href={`tel:${siteParams.telephone.replace(/\s/g, "")}`}>{siteParams.telephone}</a>
                  </span>
                )}
                {siteParams.adresse !== "" && (
                  <span className="contact-line">
                    <i className="ph ph-map-pin" aria-hidden="true"></i>
                    {siteParams.adresse}
                  </span>
                )}
                {siteParams.horaires !== "" && (
                  <span className="contact-line">
                    <i className="ph ph-clock" aria-hidden="true"></i>
                    {siteParams.horaires}
                  </span>
                )}
              </address>
            )}
          </nav>
        </div>

        <div className="footer__bottom">
          <p>
            © <span data-year>{year}</span> INTEGRA SCIENCE
          </p>
          <p>{t.footerTag}</p>
        </div>
      </div>
    </footer>
  );
}
