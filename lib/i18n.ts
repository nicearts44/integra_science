/**
 * Correspondance FR ↔ EN (CONTEXT_MVP § 4.3 — chaque sélecteur de langue
 * pointe vers l'équivalent exact, jamais vers l'accueil de l'autre langue).
 */
export const frToEn: Record<string, string> = {
  "/": "/en/",
  "/vision/": "/en/vision/",
  "/expertises/": "/en/expertise/",
  "/prestations/": "/en/services/",
  "/methode/": "/en/method/",
  "/reseau/": "/en/network/",
  "/qualite-scientifique/": "/en/scientific-quality/",
  "/references/": "/en/references/",
  "/cas-usage/": "/en/case-studies/",
  "/publications/": "/en/publications/",
  "/actualites/": "/en/news/",
  "/expertises/biologie/": "/en/expertise/biology/",
  "/expertises/bioinformatique/": "/en/expertise/bioinformatics/",
  "/expertises/bio-imagerie/": "/en/expertise/bio-imaging/",
  "/expertises/medecine-sante/": "/en/expertise/medicine-health/",
  "/expertises/pharmacologie/": "/en/expertise/pharmacology/",
  "/expertises/statistiques-ia/": "/en/expertise/statistics-ai/",
  "/contact/": "/en/contact/",
  "/contact/projet/": "/en/contact/project/",
  "/contact/candidature/": "/en/contact/application/",
  "/contact/partenariat/": "/en/contact/partnership/",
  "/newsletter/": "/en/newsletter/",
  "/mentions-legales/": "/en/legal/",
  "/confidentialite/": "/en/privacy/",
};

const enToFr: Record<string, string> = Object.fromEntries(
  Object.entries(frToEn).map(([fr, en]) => [en, fr]),
);

function withTrailingSlash(p: string): string {
  if (!p) return "/";
  const clean = p.split("?")[0].split("#")[0];
  return clean.endsWith("/") ? clean : `${clean}/`;
}

/** Équivalent anglais d'une route française, ou null si introuvable. */
export function enEquivalent(pathname: string): string | null {
  return frToEn[withTrailingSlash(pathname)] ?? null;
}

/** Équivalent français d'une route anglaise, ou null si introuvable. */
export function frEquivalent(pathname: string): string | null {
  return enToFr[withTrailingSlash(pathname)] ?? null;
}
