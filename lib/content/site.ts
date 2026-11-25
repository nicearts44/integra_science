/* ===================================================================
   Paramètres du site — CONTEXT_MVP § 12 / § 16.2.
   Règle d'or : un champ vide ne produit AUCUN rendu.
   Aucune valeur par défaut n'est affichée sur le site public.

   Les valeurs se saisissent dans le back-office (/admin/reglages) et
   vivent dans `content/reglages.json`. L'environnement ne sert plus
   qu'à l'URL publique et à l'envoi des emails, qui restent des secrets
   de déploiement.
   =================================================================== */

import { reglages } from "./editorial";

export type Locale = "fr" | "en";

/** Réglage saisi dans le back-office, ou chaîne vide. */
function r(cle: string): string {
  return reglages[cle] ?? "";
}

export const siteParams = {
  /** Blocant pour la mise en ligne (canonical, sitemap). */
  url_site: r("url_site") || process.env.NEXT_PUBLIC_SITE_URL || "",

  /** Contact — non affiché tant que vide. */
  adresse: r("adresse"),
  telephone: r("telephone"),
  email_contact: r("email_contact"),
  horaires: r("horaires"),

  /** Réseaux — icône non affichée tant que vide. */
  linkedin: r("linkedin"),
  x_twitter: r("x_twitter"),
  orcid: r("orcid"),
  researchgate: r("researchgate"),
  google_scholar: r("google_scholar"),

  /** Citation — attribution générique si vide. */
  citation_nom: r("citation_nom"),
  citation_fonction: r("citation_fonction"),

  /** Mentions légales — bloc non affiché tant que vide. */
  raison_sociale: r("raison_sociale"),
  forme_juridique: r("forme_juridique"),
  siret_ou_equivalent: r("siret_ou_equivalent"),
  directeur_publication: r("directeur_publication"),

  /** Blocants pour l'envoi des formulaires. */
  /** `EXPEDITEUR_EMAIL` est le nom documenté dans .env.example ; l'alias est accepté. */
  email_from: process.env.BREVO_FROM_EMAIL ?? process.env.EXPEDITEUR_EMAIL ?? "",
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
