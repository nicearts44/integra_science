"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { enEquivalent, frEquivalent } from "@/lib/i18n";
import { ui, type Locale } from "@/lib/strings";

type NavItem = { href: string; label: string; icon?: string };

function isActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export default function Header({ locale = "fr" }: { locale?: Locale }) {
  const pathname = usePathname() || "/";
  const isEn = locale === "en";
  const t = ui(locale);
  const mainNav: NavItem[] = t.mainNav as unknown as NavItem[];
  const referenceNav: NavItem[] = t.referenceNav as unknown as NavItem[];
  const tailNav: NavItem[] = t.tailNav as unknown as NavItem[];
  const mobileNav: NavItem[] = t.mobileNav as unknown as NavItem[];
  const contactHref = isEn ? "/en/contact/project/" : "/contact/projet/";
  const expertiseHref = isEn ? "/en/expertise/" : "/expertises/";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* En-tête au défilement (initHeader de la maquette) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* État initial du thème (le script anti-flash a déjà posé data-theme) */
  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  /* Fermeture du menu mobile à Échap + verrouillage du défilement */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Fermeture des menus au clic extérieur / Échap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("integra-theme", next);
      } catch {
        /* stockage indisponible */
      }
      setDark(next === "dark");
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduced) {
      // @ts-expect-out-of-range — API optionnelle du navigateur
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120);
  }

  const frHome = "/";
  const enHome = "/en/";
  // Équivalent exact dans l'autre langue (CONTEXT_MVP § 4.3).
  const currentEn = enEquivalent(pathname);
  const currentFr = frEquivalent(pathname);

  return (
    <>
      <header className={`header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header__inner">
          <Link className="logo" href={isEn ? enHome : frHome} aria-label={t.logoLabel}>
            <span className="logo__mark">
              <i className="ph ph-hexagon" aria-hidden="true"></i>
            </span>
            <span className="logo__text">
              INTEGRA <span>SCIENCE</span>
            </span>
          </Link>

          <nav className="nav" aria-label={t.navAria}>
            {mainNav.map((item) => (
              <Link
                key={item.href}
                className={`nav__link${isActive(pathname, item.href) ? " is-active" : ""}`}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}

            <div
              className={`nav__group${dropdownOpen ? " is-open" : ""}`}
              onMouseEnter={openDropdown}
              onMouseLeave={scheduleClose}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="nav__trigger"
                type="button"
                aria-expanded={dropdownOpen}
                aria-controls="nav-references"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                {t.references} <i className="ph ph-caret-down" aria-hidden="true"></i>
              </button>
              <div className="nav__menu" id="nav-references" role="menu">
                {referenceNav.map((item) => (
                  <Link key={item.href} href={item.href} role="menuitem">
                    <i className={`ph ${item.icon}`} aria-hidden="true"></i> {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {tailNav.map((item) => (
              <Link
                key={item.href}
                className={`nav__link${isActive(pathname, item.href) ? " is-active" : ""}`}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <nav className="lang" aria-label={t.langAria}>
              <Link
                href={isEn ? currentFr ?? frHome : pathname}
                hrefLang="fr"
                lang="fr"
                aria-current={!isEn ? "true" : undefined}
              >
                FR
              </Link>
              <Link
                href={isEn ? pathname : currentEn ?? enHome}
                hrefLang="en"
                lang="en"
                aria-current={isEn ? "true" : undefined}
              >
                EN
              </Link>
            </nav>

            <button
              className="icon-btn"
              type="button"
              onClick={toggleTheme}
              aria-pressed={dark}
              aria-label={dark ? t.themeLight : t.themeDark}
              title={dark ? t.themeLightTitle : t.themeDarkTitle}
            >
              <i className={dark ? "ph ph-sun" : "ph ph-moon-stars"} aria-hidden="true"></i>
            </button>

            <Link className="btn btn--accent btn--sm btn--cta" href={contactHref}>
              {t.cta}
            </Link>

            <button
              className="icon-btn burger"
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={t.openMenu}
              onClick={() => setMobileOpen(true)}
            >
              <i className="ph ph-list" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-nav${mobileOpen ? " is-open" : ""}`}
        id="mobile-nav"
        data-mobile-nav
        hidden={!mobileOpen}
      >
        <div className="mobile-nav__head">
          <Link className="logo" href={isEn ? enHome : frHome}>
            <span className="logo__mark">
              <i className="ph ph-hexagon" aria-hidden="true"></i>
            </span>
            <span className="logo__text">
              INTEGRA <span>SCIENCE</span>
            </span>
          </Link>
          <button className="icon-btn" type="button" aria-label={t.closeMenu} onClick={() => setMobileOpen(false)}>
            <i className="ph ph-x" aria-hidden="true"></i>
          </button>
        </div>
        <nav className="mobile-nav__links" aria-label={t.navMobileAria}>
          {mobileNav.map((item) => (
            <Link key={item.href + item.label} href={item.href} onClick={() => setMobileOpen(false)}>
              {item.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
            </Link>
          ))}
        </nav>
        <div className="mobile-nav__foot">
          <Link className="btn btn--accent" href={contactHref} onClick={() => setMobileOpen(false)}>
            {t.cta}
          </Link>
          <Link className="btn btn--outline" href={expertiseHref} onClick={() => setMobileOpen(false)}>
            {t.ctaSecondary}
          </Link>
        </div>
      </div>
    </>
  );
}
