/* ===================================================================
   Références — publications, cas d'usage, actualités.
   CONTEXT_MVP § 7.8 à § 7.10.

   DEUX GATES, non négociables :
   1. `verifie`   — le contenu a été relu par un pôle relecteur ;
   2. `anonymise` — l'accord du demandeur est conservé et aucune donnée
      identifiante n'est reprise.
   Tant que l'une des deux est fausse, le contenu ne s'affiche pas.
   Les gabarits ci-dessous montrent la forme attendue, jamais un fait.
   =================================================================== */

export type Gate = { verifie: boolean; anonymise: boolean };

export type Publication = Gate & {
  slug: string;
  /** « Article » | « Communication » | « Rapport ». */
  type: "Article" | "Communication" | "Rapport";
  title: string;
  resume: string;
  /** Revue, congrès ou événement. */
  cadre: string;
  annee: string;
  url?: string;
};

export type CasUsage = Gate & {
  slug: string;
  title: string;
  situation: string;
  question: string;
  fait: string;
  limites: string;
  duree: string;
};

export type Actualite = {
  slug: string;
  title: string;
  text: string;
  categorie: string;
  /** ISO 8601 — jamais une date inventée. */
  date: string;
};

/* ------------------------------------------------------------------ */
/* Catalogues — vides par défaut (état vide prévu par la spec)          */
/* ------------------------------------------------------------------ */

export const publications: Publication[] = [];
export const casUsage: CasUsage[] = [];
export const actualites: Actualite[] = [];

/** Un contenu n'est publiable que s'il est vérifié ET anonymisé. */
export function estPubliable(item: Gate): boolean {
  return item.verifie === true && item.anonymise === true;
}

/** Publications publiables, triées de la plus récente à la plus ancienne. */
export function publicationsPubliees(): Publication[] {
  return publications
    .filter(estPubliable)
    .sort((a, b) => Number(b.annee) - Number(a.annee));
}

export function casPublies(): CasUsage[] {
  return casUsage.filter(estPubliable);
}

export function actualitesPubliees(): Actualite[] {
  return [...actualites].sort((a, b) => b.date.localeCompare(a.date));
}

/* ------------------------------------------------------------------ */
/* Gabarits — affichés uniquement quand le catalogue est vide           */
/* ------------------------------------------------------------------ */

export const gabaritsPublications = [
  {
    type: "Article" as const,
    title: "[Titre de la publication]",
    resume:
      "[Résumé en deux phrases : la question posée, ce que le travail montre. Reprendre la formulation du rapport final, sans l'amplifier.]",
    cadre: "[Revue]",
    annee: "[AAAA]",
  },
  {
    type: "Communication" as const,
    title: "[Titre de la communication]",
    resume:
      "[Congrès, colloque, séminaire : indiquer le cadre, la date et les auteurs dans l'ordre convenu avec eux.]",
    cadre: "[Événement]",
    annee: "[AAAA]",
  },
  {
    type: "Rapport" as const,
    title: "[Titre du rapport public]",
    resume:
      "[Rapport rendu public avec l'accord du demandeur. Préciser le périmètre et le fait qu'il est anonymisé.]",
    cadre: "[Périmètre]",
    annee: "[AAAA]",
  },
];

export const gabaritsCas = [
  {
    title: "[Intitulé du cas — sans nommer le demandeur]",
    situation:
      "[Type de structure, volume de données, contrainte de calendrier. Aucun élément permettant de ré-identifier.]",
    question: "[Formulée telle qu'elle a été acceptée au cadrage.]",
    fait: "[Les étapes utiles, pas la totalité du travail.]",
    limites:
      "[Les limites, explicites. C'est ce paragraphe qui distingue un cas d'usage d'une publicité.]",
    duree: "[Durée]",
  },
  {
    title: "[Intitulé du cas — sans nommer le demandeur]",
    situation: "[Contexte, données disponibles, échéance.]",
    question: "[La question reformulée et acceptée.]",
    fait: "[Méthode et étapes clés.]",
    limites: "[Limites assumées.]",
    duree: "[Durée]",
  },
];

export const gabaritsActualites = [
  { title: "[Titre de l'actualité]", text: "[Deux à trois phrases : le fait, ce qu'il change, et pour qui.]", categorie: "[Catégorie]" },
  { title: "[Titre de l'actualité]", text: "[Deux à trois phrases.]", categorie: "[Catégorie]" },
  { title: "[Titre de l'actualité]", text: "[Deux à trois phrases.]", categorie: "[Catégorie]" },
];

/** Les deux conditions, écrites à l'écran (maquette references.html). */
export const conditions = [
  {
    label: "Condition 1 — Vérification",
    items: [
      { ok: true, text: "Les résultats cités ont été relus par un pôle relecteur" },
      { ok: true, text: "Les chiffres sont repris du rapport final" },
      { ok: true, text: "Les limites sont écrites, pas sous-entendues" },
      { ok: false, text: "Tant que la vérification est en cours, rien ne s'affiche" },
    ],
  },
  {
    label: "Condition 2 — Anonymisation",
    items: [
      { ok: true, text: "L'accord du demandeur est conservé" },
      { ok: true, text: "Aucune donnée identifiante n'est reprise" },
      { ok: true, text: "Le contexte est décrit sans permettre la ré-identification" },
      { ok: false, text: "Tant que l'accord manque, rien ne s'affiche" },
    ],
  },
];
