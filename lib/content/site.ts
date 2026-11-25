/* ===================================================================
   Paramètres du site — CONTEXT_MVP § 12 / § 16.2.
   Règle d'or : un champ vide ne produit AUCUN rendu.
   Aucune valeur par défaut n'est affichée sur le site public.
   =================================================================== */

export type Locale = "fr" | "en";

export const siteParams = {
  /** Blocant pour la mise en ligne (canonical, sitemap). */
  url_site: process.env.NEXT_PUBLIC_SITE_URL ?? "",

  /** Contact — non affiché tant que vide. */
  adresse: "",
  telephone: "",
  email_contact: "",
  horaires: "",

  /** Réseaux — icône non affichée tant que vide. */
  linkedin: "",
  x_twitter: "",
  orcid: "",
  researchgate: "",
  google_scholar: "",

  /** Citation — attribution générique si vide. */
  citation_nom: "",
  citation_fonction: "",

  /** Mentions légales — bloc non affiché tant que vide. */
  raison_sociale: "",
  forme_juridique: "",
  siret_ou_equivalent: "",
  directeur_publication: "",

  /** Blocants pour l'envoi des formulaires. */
  email_from: process.env.BREVO_FROM_EMAIL ?? "",
  email_destinataire: process.env.CONTACT_DESTINATAIRE ?? "",
  } as Record<string, string>;

/** URL de base pour les métadonnées. Vide en production tant que non renseignée. */
export function baseUrl(): string {
  const raw = siteParams.url_site || process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!raw) return "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

/** Nom de citation pour les attributions : champ renseigné ou générique. */
export function citationName(): string {
  return siteParams.citation_nom || "Coordination scientifique";
}

export function citationRole(): string {
  return siteParams.citation_fonction || "INTEGRA SCIENCE";
}
