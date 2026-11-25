import "server-only";

import { publies, safeFetch } from "./client";
import type { L, LOpt, Locale } from "@/lib/locale";

/* ------------------------------------------------------------------ types */

/**
 * Les documents Sanity sont bilingues : chaque champ texte est un objet
 * `{ fr, en }`, exactement comme les modules locaux (`lib/content/*`).
 * Le site n'a donc qu'un seul format à connaître, d'où qu'il vienne.
 */
export type SanityPole = {
  _id: string;
  numero: string;
  slug: string;
  titre: L;
  resume?: LOpt;
  couverture?: LOpt;
  couvertureDetail?: LOpt;
  capacites?: LOpt[];
  profils?: LOpt[];
  mentionPerimetre?: LOpt;
  polesLies?: string[];
};

export type SanityPrestation = {
  _id: string;
  slug: string;
  titre: L;
  resume?: LOpt;
  situation?: LOpt;
  actions?: LOpt[];
  livrables?: LOpt[];
  livrableCourt?: LOpt;
  conditions?: LOpt;
  profils?: LOpt[];
};

export type SanityPublication = {
  _id: string;
  titre: L;
  type: "Article" | "Communication" | "Rapport";
  resume?: LOpt;
  auteurs?: LOpt[];
  cadre?: LOpt;
  annee?: string;
  doi?: string;
  datePublication?: string;
  verifie?: boolean;
  anonymise?: boolean;
};

export type SanityCasUsage = {
  _id: string;
  titre: L;
  situation?: LOpt;
  question?: LOpt;
  fait?: LOpt;
  limites: L;
  duree?: LOpt;
  poles?: string[];
  datePublication?: string;
  verifie?: boolean;
  anonymise?: boolean;
};

export type SanityActualite = {
  _id: string;
  titre: L;
  texte?: LOpt;
  categorie?: string;
  date: string;
  verifie?: boolean;
  anonymise?: boolean;
};

export type SanityMembre = {
  _id: string;
  nom: L;
  role?: string;
  pole?: string;
  specialite?: LOpt;
  bio?: LOpt;
  photo?: { asset?: { url?: string } };
  publie?: boolean;
};

export type SanityParametres = {
  nom?: LOpt;
  signature?: LOpt;
  accroche?: LOpt;
  email?: string;
  telephone?: string;
  adresse?: LOpt;
  urlSite?: string;
  mentionsIdentite?: LOpt;
};

/* ------------------------------------------------------------- fragments */

const poleFields = `
  _id,
  numero,
  "slug": slug.current,
  titre,
  resume,
  couverture,
  couvertureDetail,
  capacites,
  profils,
  mentionPerimetre,
  polesLies
`;

const prestationFields = `
  _id,
  "slug": slug.current,
  titre,
  resume,
  situation,
  actions,
  livrables,
  livrableCourt,
  conditions,
  profils
`;

const gateFields = `verifie, anonymise`;

/* -------------------------------------------------------------- lectures */

export async function getPolesSanity(): Promise<SanityPole[] | null> {
  const data = await safeFetch<SanityPole[]>(
    `*[_type == "pole"] | order(numero asc) { ${poleFields} }`,
  );
  return data && data.length > 0 ? data : null;
}

export async function getPoleSanity(slug: string): Promise<SanityPole | null> {
  return safeFetch<SanityPole | null>(
    `*[_type == "pole" && slug.current == $slug][0] { ${poleFields} }`,
    { slug },
  );
}

export async function getPrestationsSanity(): Promise<SanityPrestation[] | null> {
  const data = await safeFetch<SanityPrestation[]>(
    `*[_type == "prestation"] | order(ordre asc, titre.fr asc) { ${prestationFields} }`,
  );
  return data && data.length > 0 ? data : null;
}

/** Publications : filtrées sur les deux gates, côté code. */
export async function getPublicationsSanity(): Promise<SanityPublication[] | null> {
  const data = await safeFetch<SanityPublication[]>(
    `*[_type == "publication"] | order(annee desc, datePublication desc) {
      _id, titre, type, resume, auteurs, cadre, annee, doi, datePublication, ${gateFields}
    }`,
  );
  if (!data) return null;
  const ok = publies(data);
  return ok.length > 0 ? ok : null;
}

/** Cas d'usage : filtrés sur les deux gates, côté code. */
export async function getCasUsageSanity(): Promise<SanityCasUsage[] | null> {
  const data = await safeFetch<SanityCasUsage[]>(
    `*[_type == "casUsage"] | order(datePublication desc) {
      _id, titre, situation, question, fait, limites, duree, poles, datePublication, ${gateFields}
    }`,
  );
  if (!data) return null;
  const ok = publies(data);
  return ok.length > 0 ? ok : null;
}

/** Actualités : filtrées sur les deux gates, côté code. */
export async function getActualitesSanity(): Promise<SanityActualite[] | null> {
  const data = await safeFetch<SanityActualite[]>(
    `*[_type == "actualite"] | order(date desc) { _id, titre, texte, categorie, date, ${gateFields} }`,
  );
  if (!data) return null;
  const ok = publies(data);
  return ok.length > 0 ? ok : null;
}

/** Membres : n'apparaissent que si `publie` est vrai (accord écrit). */
export async function getMembresSanity(): Promise<SanityMembre[] | null> {
  const data = await safeFetch<SanityMembre[]>(
    `*[_type == "membre" && publie == true] | order(ordre asc, nom.fr asc) {
      _id, nom, role, pole, specialite, bio, publie,
      "photo": photo { "asset": asset-> { url } }
    }`,
  );
  return data && data.length > 0 ? data : null;
}

export async function getParametresSanity(): Promise<SanityParametres | null> {
  return safeFetch<SanityParametres | null>(
    `*[_type == "parametresSite"][0] {
      nom, signature, accroche, email, telephone, adresse, urlSite, mentionsIdentite
    }`,
  );
}

/* ------------------------------------------------------- locales helpers */

/** Une valeur bilingue pour la locale demandée, sans jamais rendre un trou. */
export function pick(value: L | LOpt | undefined, locale: Locale): string {
  if (!value) return "";
  return (locale === "en" ? value.en || value.fr : value.fr || value.en) ?? "";
}

export function pickList(values: Array<L | LOpt> | undefined, locale: Locale): string[] {
  if (!values) return [];
  return values.map((v) => pick(v, locale)).filter(Boolean);
}
