/* ===================================================================
   Interface bilingue — libellés de navigation et d'interface.
   CONTEXT_MVP § 4.3 : chaque sélecteur de langue pointe vers l'équivalent
   exact de la page, jamais vers l'accueil de l'autre langue.

   Les contenus éditoriaux bilingues vivent dans lib/content/en/.
   =================================================================== */

export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];

export const strings = {
  fr: {
    lang: "fr",
    skip: "Aller au contenu",
    logoLabel: "INTEGRA SCIENCE, accueil",
    navAria: "Navigation principale",
    navMobileAria: "Navigation mobile",
    langAria: "Langue",
    references: "Références",
    cta: "Proposer un projet",
    ctaSecondary: "Voir les expertises",
    themeLight: "Passer en thème clair",
    themeDark: "Passer en thème sombre",
    themeLightTitle: "Thème clair",
    themeDarkTitle: "Thème sombre",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    footerBaseline: "Réseau d'expertise scientifique au service du vivant et de la santé.",
    footerNav: "Navigation",
    footerRefs: "Références",
    footerInfo: "Informations",
    footerTag: "Réseau d'expertise scientifique",
    mainNav: [
      { href: "/vision/", label: "Notre vision" },
      { href: "/expertises/", label: "Expertises" },
      { href: "/prestations/", label: "Prestations" },
    ],
    referenceNav: [
      { href: "/cas-usage/", label: "Cas d'usage", icon: "ph-briefcase" },
      { href: "/publications/", label: "Publications scientifiques", icon: "ph-file-text" },
      { href: "/qualite-scientifique/", label: "Qualité scientifique", icon: "ph-seal-check" },
    ],
    tailNav: [
      { href: "/methode/", label: "Méthode" },
      { href: "/reseau/", label: "Le réseau" },
      { href: "/actualites/", label: "Actualités" },
    ],
    mobileNav: [
      { href: "/vision/", label: "Notre vision" },
      { href: "/expertises/", label: "Expertises" },
      { href: "/prestations/", label: "Prestations" },
      { href: "/cas-usage/", label: "Cas d'usage" },
      { href: "/publications/", label: "Publications" },
      { href: "/qualite-scientifique/", label: "Qualité scientifique" },
      { href: "/methode/", label: "Méthode" },
      { href: "/reseau/", label: "Le réseau" },
      { href: "/actualites/", label: "Actualités" },
      { href: "/newsletter/", label: "Lettre d'information" },
      { href: "/contact/", label: "Contact" },
    ],
    footerNavLinks: [
      { href: "/vision/", label: "Notre vision" },
      { href: "/expertises/", label: "Expertises" },
      { href: "/prestations/", label: "Prestations" },
      { href: "/methode/", label: "Notre méthode" },
      { href: "/reseau/", label: "Le réseau" },
      { href: "/qualite-scientifique/", label: "Qualité scientifique" },
    ],
    footerRefLinks: [
      { href: "/publications/", label: "Publications" },
      { href: "/cas-usage/", label: "Cas d'usage" },
      { href: "/actualites/", label: "Actualités" },
      { href: "/newsletter/", label: "Lettre d'information" },
      { href: "/contact/", label: "Contact" },
    ],
    footerInfoLinks: [
      { href: "/mentions-legales/", label: "Mentions légales" },
      { href: "/confidentialite/", label: "Politique de confidentialité" },
    ],
    deliverable: "Livrable",
    step: "Étape",
  },
  en: {
    lang: "en",
    skip: "Skip to content",
    logoLabel: "INTEGRA SCIENCE, home",
    navAria: "Main navigation",
    navMobileAria: "Mobile navigation",
    langAria: "Language",
    references: "References",
    cta: "Submit a project",
    ctaSecondary: "See the expertises",
    themeLight: "Switch to light theme",
    themeDark: "Switch to dark theme",
    themeLightTitle: "Light theme",
    themeDarkTitle: "Dark theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    footerBaseline: "A scientific expertise network serving life sciences and health.",
    footerNav: "Navigation",
    footerRefs: "References",
    footerInfo: "Information",
    footerTag: "Scientific expertise network",
    mainNav: [
      { href: "/en/vision/", label: "Our vision" },
      { href: "/en/expertise/", label: "Expertise" },
      { href: "/en/services/", label: "Services" },
    ],
    referenceNav: [
      { href: "/en/case-studies/", label: "Case studies", icon: "ph-briefcase" },
      { href: "/en/publications/", label: "Scientific publications", icon: "ph-file-text" },
      { href: "/en/scientific-quality/", label: "Scientific quality", icon: "ph-seal-check" },
    ],
    tailNav: [
      { href: "/en/method/", label: "Method" },
      { href: "/en/network/", label: "The network" },
      { href: "/en/news/", label: "News" },
    ],
    mobileNav: [
      { href: "/en/vision/", label: "Our vision" },
      { href: "/en/expertise/", label: "Expertise" },
      { href: "/en/services/", label: "Services" },
      { href: "/en/case-studies/", label: "Case studies" },
      { href: "/en/publications/", label: "Publications" },
      { href: "/en/scientific-quality/", label: "Scientific quality" },
      { href: "/en/method/", label: "Method" },
      { href: "/en/network/", label: "The network" },
      { href: "/en/news/", label: "News" },
      { href: "/en/newsletter/", label: "Newsletter" },
      { href: "/en/contact/", label: "Contact" },
    ],
    footerNavLinks: [
      { href: "/en/vision/", label: "Our vision" },
      { href: "/en/expertise/", label: "Expertise" },
      { href: "/en/services/", label: "Services" },
      { href: "/en/method/", label: "Our method" },
      { href: "/en/network/", label: "The network" },
      { href: "/en/scientific-quality/", label: "Scientific quality" },
    ],
    footerRefLinks: [
      { href: "/en/publications/", label: "Publications" },
      { href: "/en/case-studies/", label: "Case studies" },
      { href: "/en/news/", label: "News" },
      { href: "/en/newsletter/", label: "Newsletter" },
      { href: "/en/contact/", label: "Contact" },
    ],
    footerInfoLinks: [
      { href: "/en/legal/", label: "Legal notice" },
      { href: "/en/privacy/", label: "Privacy policy" },
    ],
    deliverable: "Deliverable",
    step: "Step",
  },
} as const;

export type UiStrings = (typeof strings)["fr"];

/** Libellés de l'interface pour une langue donnée. */
export function ui(locale: Locale): UiStrings {
  return strings[locale] as UiStrings;
}
