/* ===================================================================
   CONTENU ÉDITORIAL — la source que lisent les pages publiques.
   -------------------------------------------------------------------
   Tout ce qui est éditable depuis /admin vit dans `content/*.json`.
   Ce module est le seul endroit qui sait :
     1. quelles entrées sont visibles (statut + les deux gates) ;
     2. comment un contenu bilingue est projeté vers une page.

   Règles conservées :
   · un texte n'existe qu'une fois, sous la forme `{ fr, en }` ;
   · un contenu ne s'affiche que s'il est publié, vérifié ET anonymisé ;
   · les catalogues vides laissent les pages afficher leurs gabarits.

   Aucun import Node ici : ce fichier part aussi dans le bundle client
   (via lib/content/site.ts, lu par le pied de page).
   =================================================================== */

import publicationsJson from "@/content/publications.json";
import casUsageJson from "@/content/cas-usage.json";
import actualitesJson from "@/content/actualites.json";
import reseauJson from "@/content/reseau.json";
import reglagesJson from "@/content/reglages.json";

export type Champ = { fr: string; en: string };
export type Statut = "brouillon" | "publie";
export type TypePublication = "Article" | "Communication" | "Rapport";

export const TYPES_PUBLICATION: TypePublication[] = ["Article", "Communication", "Rapport"];

/** Clés des six pôles + le cas « réseau » (hors pôle) pour les membres. */
export const POLES_CLES = [
  "biologie",
  "bioinformatique",
  "bio-imagerie",
  "medecine-sante",
  "pharmacologie",
  "statistiques-ia",
] as const;

/* ------------------------------------------------------- formes brutes */

export type EntreePublication = {
  id: string;
  slug: string;
  statut: Statut;
  verifie: boolean;
  anonymise: boolean;
  type: TypePublication;
  annee: string;
  url: string;
  title: Champ;
  resume: Champ;
  cadre: Champ;
  cree: string;
  maj: string;
};

export type EntreeCas = {
  id: string;
  slug: string;
  statut: Statut;
  verifie: boolean;
  anonymise: boolean;
  title: Champ;
  situation: Champ;
  question: Champ;
  fait: Champ;
  limites: Champ;
  duree: Champ;
  cree: string;
  maj: string;
};

export type EntreeActualite = {
  id: string;
  slug: string;
  statut: Statut;
  title: Champ;
  text: Champ;
  categorie: Champ;
  /** ISO 8601 (AAAA-MM-JJ). */
  date: string;
  cree: string;
  maj: string;
};

export type EntreeMembre = {
  id: string;
  nom: string;
  /** Clé de pôle (voir POLES_CLES) ou « reseau ». */
  pole: string;
  fonction: Champ;
  lien: string;
  /** Accord écrit de la personne : sans lui, rien ne s'affiche. */
  accord: boolean;
  statut: Statut;
  cree: string;
  maj: string;
};

export type EntreeRole = {
  id: string;
  icon: string;
  title: Champ;
  text: Champ;
  tag: Champ;
};

export type EntreeEngagement = {
  id: string;
  icon: string;
  title: Champ;
  text: Champ;
};

type DocListe<T> = { version?: number; items?: T[] };
type DocReseau = {
  version?: number;
  membres?: EntreeMembre[];
  roles?: EntreeRole[];
  engagements?: EntreeEngagement[];
};

const publications = (publicationsJson as unknown as DocListe<EntreePublication>).items ?? [];
const casUsage = (casUsageJson as unknown as DocListe<EntreeCas>).items ?? [];
const actualites = (actualitesJson as unknown as DocListe<EntreeActualite>).items ?? [];
const reseau = reseauJson as unknown as DocReseau;

/** Réglages du site : une chaîne vide ne produit aucun rendu. */
export const reglages: Record<string, string> = {
  ...(reglagesJson as unknown as Record<string, string>),
};

/* ------------------------------------------------------------ les gates */

/** Publié, vérifié et anonymisé — les trois à la fois, sinon rien. */
export function estVisible(entree: {
  statut?: Statut;
  verifie?: boolean;
  anonymise?: boolean;
}): boolean {
  return entree.statut === "publie" && entree.verifie === true && entree.anonymise === true;
}

/* --------------------------------------------------------- projections */

export type PublicationAffichee = {
  slug: string;
  type: TypePublication;
  title: Champ;
  resume: Champ;
  cadre: Champ;
  annee: string;
  url?: string;
};

export function publicationsPubliees(): PublicationAffichee[] {
  return publications
    .filter(estVisible)
    .slice()
    .sort((a, b) => Number(b.annee) - Number(a.annee))
    .map((e) => ({
      slug: e.slug,
      type: e.type,
      title: e.title,
      resume: e.resume,
      cadre: e.cadre,
      annee: e.annee,
      ...(e.url ? { url: e.url } : {}),
    }));
}

export type CasAffiche = {
  slug: string;
  title: Champ;
  situation: Champ;
  question: Champ;
  fait: Champ;
  limites: Champ;
  duree: Champ;
};

export function casPublies(): CasAffiche[] {
  return casUsage.filter(estVisible).map((e) => ({
    slug: e.slug,
    title: e.title,
    situation: e.situation,
    question: e.question,
    fait: e.fait,
    limites: e.limites,
    duree: e.duree,
  }));
}

export type ActualiteAffichee = {
  slug: string;
  title: Champ;
  text: Champ;
  categorie: Champ;
  date: string;
};

/** Une actualité ne parle que du réseau : seul le statut la rend visible. */
export function actualitesPubliees(): ActualiteAffichee[] {
  return actualites
    .filter((e) => e.statut === "publie" && Boolean(e.date))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((e) => ({
      slug: e.slug,
      title: e.title,
      text: e.text,
      categorie: e.categorie,
      date: e.date,
    }));
}

export type MembreAffiche = {
  id: string;
  nom: string;
  pole: string;
  fonction: Champ;
  lien?: string;
};

/** Un profil n'apparaît qu'avec l'accord écrit de la personne. */
export function membresPublies(): MembreAffiche[] {
  return (reseau.membres ?? [])
    .filter((m) => m.statut === "publie" && m.accord === true && m.nom.trim().length > 0)
    .map((m) => ({
      id: m.id,
      nom: m.nom,
      pole: m.pole,
      fonction: m.fonction,
      ...(m.lien ? { lien: m.lien } : {}),
    }));
}

export function membresDuPole(cle: string): MembreAffiche[] {
  return membresPublies().filter((m) => m.pole === cle);
}

export type RoleAffiche = { key: string; icon: string; title: Champ; text: Champ; tag: Champ };

/** null = aucune saisie : la page garde ses fonctions statiques. */
export function rolesEditoriaux(): RoleAffiche[] | null {
  const items = reseau.roles ?? [];
  if (items.length === 0) return null;
  return items.map((r, i) => ({
    key: r.id || String(i + 1),
    icon: r.icon || "ph-circle",
    title: r.title,
    text: r.text,
    tag: r.tag ?? { fr: "", en: "" },
  }));
}

export type EngagementAffiche = { key: string; icon: string; title: Champ; text: Champ };

export function engagementsEditoriaux(): EngagementAffiche[] | null {
  const items = reseau.engagements ?? [];
  if (items.length === 0) return null;
  return items.map((e, i) => ({
    key: e.id || String(i + 1),
    icon: e.icon || "ph-circle",
    title: e.title,
    text: e.text,
  }));
}

/* ------------------------------------------------------------- lecture */

/** Nombre d'entrées par collection — utilisé par le tableau de bord. */
export function compteurs() {
  return {
    publications: publications.length,
    casUsage: casUsage.length,
    actualites: actualites.length,
    membres: reseau.membres?.length ?? 0,
    publies:
      publications.filter(estVisible).length +
      casUsage.filter(estVisible).length +
      actualites.filter((a) => a.statut === "publie").length,
  };
}
