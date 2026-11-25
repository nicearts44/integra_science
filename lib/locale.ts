/* Aucun import Node ici : ce module est lu aussi par des composants client. */

/**
 * LOCALISATION — un texte, deux langues, un seul endroit.
 *
 * Règle du projet (GUIDE.md § 7) : un contenu éditorial n'est jamais dupliqué
 * dans deux fichiers. Il est écrit une fois, sous la forme
 *
 *   { fr: "…", en: "…" }
 *
 * Les pages ne lisent jamais `champ.fr` directement : elles passent par
 * `t(champ, locale)` — qui retombe sur le français si l'anglais manque, et ne
 * rend jamais un trou.
 *
 * Ces mêmes formes `{ fr, en }` sont celles des schémas Sanity
 * (`sanity/schemas/index.ts`) : le contenu du CMS et le contenu local ont
 * exactement la même structure, donc les pages n'ont pas à savoir d'où il vient.
 */

export type Locale = "fr" | "en";

export type L = { fr: string; en: string };

export type LOpt = { fr?: string; en?: string };

/** Champs qui ne sont pas du texte : jamais traduits, toujours identiques. */
const NON_TEXT_KEYS = new Set([
  /**
   * `key` — clé stable d'une entrée, identique dans les deux langues.
   * Elle ne se traduit jamais : c'est elle qui relie une entrée française à
   * son équivalent anglais, et qui sert de `key` React.
   */
  "key",
  "slug",
  "num",
  "n",
  "icon",
  "href",
  "figure",
  "annee",
  "type",
  "duree",
  "id",
  "date",
  "value",
  "suffix",
  "tags",
]);

export type Bilingual<T> = {
  [K in keyof T]: T[K] extends string
    ? L
    : T[K] extends string | undefined
      ? LOpt
      : T[K] extends readonly (infer U)[]
        ? U extends string
          ? L[]
          : U extends object
            ? Bilingual<U>[]
            : T[K]
        : T[K] extends object
          ? Bilingual<T[K]>
          : T[K];
};

/* ------------------------------------------------------------ lecture */

/** Valeur lisible d'un champ bilingue. Repli sur le français si l'anglais manque. */
export function t(value: L | LOpt | undefined, locale: Locale): string {
  if (!value) return "";
  const v = value as LOpt;
  return (locale === "en" ? v.en || v.fr : v.fr || v.en) ?? "";
}

/** Liste lisible d'un champ bilingue. */
export function tList(value: Array<L | LOpt> | undefined, locale: Locale): string[] {
  if (!value) return [];
  return value.map((v) => t(v, locale)).filter((s) => s.length > 0);
}

/** Locale d'un tableau `[{fr, en}]` : renvoie la liste complète des champs. */
export function hasEn(value: L | LOpt | undefined): boolean {
  return Boolean(value && (value as LOpt).en);
}

/**
 * Un tableau `[{fr, en}]` remis à plat pour la locale : chaque élément garde
 * toutes ses clés, seules les chaînes sont remplacées par leur valeur.
 * C'est ce que consomment les composants (cartes, étapes, onglets).
 */
export function localize<T>(value: T, locale: Locale): Localized<T> {
  if (Array.isArray(value)) {
    return value.map((v) => localize(v, locale)) as unknown as Localized<T>;
  }
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    // Champ bilingue lui-même ? (objet à deux clés exactement : fr et/ou en)
    const keys = Object.keys(v);
    const isL =
      keys.length > 0 &&
      keys.every((k) => k === "fr" || k === "en") &&
      keys.some((k) => typeof v[k] === "string");
    if (isL) {
      return t(value as LOpt, locale) as unknown as Localized<T>;
    }
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      out[k] = localize(val, locale);
    }
    return out as Localized<T>;
  }
  return value as Localized<T>;
}

export type Localized<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Localized<U>[]
    : T extends object
      ? [T] extends [{ fr: string }]
        ? string
        : [T] extends [{ en: string }]
          ? string
          : { [K in keyof T]: Localized<T[K]> }
      : T;

/* ------------------------------------------------------- construction */

/**
 * Convertit un module local `{ clé: "texte français" }` en version bilingue,
 * en remplissant l'anglais depuis un dictionnaire plat de traductions.
 *
 *   translate(pole, enStrings)
 *
 * Une clé sans traduction garde son texte français côté anglais : mieux vaut
 * un texte à relire qu'un trou dans la page.
 */
export function translate<T>(source: T, en: unknown): Bilingual<T> {
  return translateNode(source, en) as Bilingual<T>;
}

function translateNode(source: unknown, en: unknown): unknown {
  if (Array.isArray(source)) {
    const enArr = Array.isArray(en) ? en : [];
    return source.map((item, i) => translateNode(item, enArr[i]));
  }

  if (source && typeof source === "object") {
    const enObj = (en && typeof en === "object" ? en : {}) as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
      if (typeof value === "string") {
        out[key] =
          NON_TEXT_KEYS.has(key) || !key
            ? { fr: value, en: value }
            : { fr: value, en: typeof enObj[key] === "string" ? (enObj[key] as string) : "" };
      } else if (typeof value === "boolean" || typeof value === "number" || value == null) {
        out[key] = value;
      } else {
        out[key] = translateNode(value, enObj[key]);
      }
    }
    return out;
  }

  return source;
}

/* ------------------------------------------------------- vocabulaire */

/**
 * Lexique de traduction pour un texte court et stable (libellés d'interface,
 * boutons). Le premier mot qui correspond gagne : on ordonne donc les entrées
 * de la plus longue à la plus courte, pour éviter « Voir » avant
 * « Voir les expertises ».
 */
export function makeDict(entries: Array<[string, string]>) {
  const sorted = [...entries].sort((a, b) => b[0].length - a[0].length);
  const exact = new Map(sorted);
  return (fr: string): string => {
    if (exact.has(fr)) return exact.get(fr)!;
    // Repli : première entrée dont le libellé français est préfixe du texte.
    for (const [from, to] of sorted) {
      if (fr.startsWith(from)) return to + fr.slice(from.length);
    }
    return "";
  };
}

/* --------------------------------------------------------------- JSON */

/** Charge un dictionnaire de traductions depuis `lib/content/en/<nom>.json`. */
