/* ===================================================================
   SOURCE UNIQUE DU CONTENU BILINGUE
   -------------------------------------------------------------------
   Règle du projet (GUIDE.md § 7) : un texte n'existe qu'une fois.
   Il est écrit sous la forme `{ fr, en }` — dans un module local, puis,
   dès que le Studio est activé, dans un seul document Sanity. Il n'y a
   jamais deux fichiers à maintenir en parallèle.

   `t(champ, locale)` rend la bonne langue ; si l'anglais manque, le
   français est affiché plutôt qu'un trou. Les pages n'importent donc
   plus jamais un module « fr » ou « en » : elles importent ce fichier.

   Les champs techniques (icônes, slugs, numéros, clés) ne sont PAS
   traduits : voir NON_TEXT_KEYS dans lib/locale.ts.
   =================================================================== */

import { t, translate } from "@/lib/locale";
import type { L, LOpt, Locale } from "@/lib/locale";

import { coutTrace, flowSteps, revueCroisee, tracesRemises } from "./steps";
import { poles as polesFr } from "./poles";
import { livrablesPage, perimetreExclu, prestations as prestationsFr } from "./prestations";
import { confidentialite, mentionsLegales } from "./legal";
import type { LegalDoc } from "./legal";
import {
  roles as rolesFr,
  poleStatuses as poleStatusesFr,
  engagements as engagementsFr,
  engagementsNote,
} from "./reseau";
import * as visionFr from "./vision";
import * as referencesFr from "./references";

import { polesEn } from "./en/poles";
import { livrablesPageEn, perimetreExcluEn, prestationsEn } from "./en/prestations";
import { coutTraceEn, flowStepsEn, revueCroiseeEn, tracesRemisesEn } from "./en/steps";
import { confidentialiteEn, mentionsLegalesEn } from "./en/legal";
import { poleStatusesEn, rolesEn, engagementsEn, engagementsNoteEn } from "./en/pages";
import * as visionEn from "./en/vision";
import * as referencesEn from "./en/references";

/* ------------------------------------------------------------- outils */

/** Indexe une liste anglaise par sa clé stable. */
function byKey<T extends { key: string }>(list: T[]): Map<string, T> {
  return new Map(list.map((item) => [item.key, item]));
}

/**
 * Fusionne une liste française et sa traduction anglaise en une seule
 * liste bilingue. L'ordre, les icônes, les slugs et les clés viennent du
 * français ; seuls les textes reçoivent leur anglais.
 */
function mergeByKey<F extends { key: string }, E extends { key: string }>(
  fr: F[],
  en: E[],
): Array<F & Record<string, unknown>> {
  const index = byKey(en);
  return fr.map((item) => {
    const tr = index.get(item.key);
    return translate(item, tr) as F & Record<string, unknown>;
  });
}

/** Fusionne deux listes parallèles (même ordre, pas de clé) en bilingue. */
function mergeByIndex<F, E>(fr: F[], en: E[]): Array<F & Record<string, unknown>> {
  return fr.map((item, i) => translate(item, en[i]) as F & Record<string, unknown>);
}

/* ----------------------------------------------------------- projection */

/**
 * Contenu bilingue remis à plat : chaque `{ fr, en }` redevient une chaîne,
 * le reste de la structure est conservé. C'est le type que manipulent les
 * pages — elles ne voient jamais un couple de langues.
 */
export type Plat<T> = T extends string | number | boolean | null | undefined
  ? T
  : T extends readonly (infer U)[]
    ? Plat<U>[]
    : T extends object
      ? keyof T extends "fr" | "en"
        ? string
        : { [K in keyof T]: Plat<T[K]> }
      : T;

function aplatiNode(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) return value.map((item) => aplatiNode(item, locale));
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    const estBilingue = keys.length > 0 && keys.every((k) => k === "fr" || k === "en");
    if (estBilingue) return t(obj as LOpt, locale);
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = aplatiNode(v, locale);
    return out;
  }
  return value;
}

/**
 * Projette un contenu bilingue dans une langue, à plat.
 *
 *   const { poles, prestations } = aplati({ poles, prestations }, "fr");
 *
 * Le français manquant retombe sur l'anglais et inversement : une page ne
 * rend jamais un trou.
 */
export function aplati<T>(value: T, locale: Locale): Plat<T> {
  return aplatiNode(value, locale) as Plat<T>;
}

/* -------------------------------------------------------------- pôles */

/**
 * Type bilingue d'une entrée de contenu : les textes deviennent `{ fr, en }`,
 * tout le reste (clés, icônes, slugs, numéros, booléens) reste tel quel.
 */
export type Bilingue<T> = {
  [K in keyof T]: K extends "key"
    ? T[K]
    : T[K] extends string
      ? L
      : T[K] extends string | undefined
        ? LOpt
        : T[K] extends readonly (infer U)[]
          ? U extends string
            ? L[]
            : T[K]
          : T[K];
};

export type Pole = Bilingue<(typeof polesFr)[number]>;
export type Prestation = Bilingue<(typeof prestationsFr)[number]>;
export type FlowStepBilingue = Bilingue<(typeof flowSteps)[number]>;

const poleEnIndex = new Map(polesEn.map((p) => [p.key, p]));

/** Les six pôles — un seul objet par pôle, les deux langues à l'intérieur. */
export const poles: Pole[] = polesFr.map((p) => {
  const en = poleEnIndex.get(p.key);
  return translate(p, en) as unknown as Pole;
});

/** Retrouve un pôle par sa clé stable (jamais par son slug, qui est traduit). */
export const poleByKey = new Map(poles.map((p) => [p.key, p]));

/** Retrouve un pôle par slug, dans l'une ou l'autre langue. */
export function poleBySlug(slug: string): Pole | undefined {
  return poles.find((p) => p.slug.fr === slug || p.slug.en === slug);
}

/* -------------------------------------------------------- prestations */

const prestationEnIndex = new Map(prestationsEn.map((p) => [p.key, p]));

export const prestations: Prestation[] = prestationsFr.map((p) => {
  const en = prestationEnIndex.get(p.key);
  return translate(p, en) as unknown as Prestation;
});

/* ------------------------------------------------------------ méthode */

const flowEnIndex = byKey(flowStepsEn);

export const steps = {
  flowSteps: flowSteps.map((s) => {
    const en = flowEnIndex.get(s.key);
    return translate(s, en) as unknown as FlowStepBilingue;
  }) as FlowStepBilingue[],
  tracesRemises: mergeByIndex(tracesRemises, tracesRemisesEn),
  engagements: mergeByIndex(engagementsFr, engagementsEn),
  engagementsNote: translate(engagementsNote, engagementsNoteEn) as unknown as {
    fr: string;
    en: string;
  },
};

/* -------------------------------------------------------------- réseau */

/** Les cinq fonctions du réseau, dans les deux langues. */
export type RoleBilingue = { key: string } & {
  icon: string;
  title: L;
  text: L;
  tag: L;
};

export const roles = (rolesFr as Array<Record<string, unknown>>).map((r, i) => {
  const en = rolesEn[i] as Record<string, unknown> | undefined;
  const tr = translate(r, en) as Record<string, unknown>;
  return {
    key: r.key as string,
    icon: r.icon as string,
    title: tr.title as L,
    text: tr.text as L,
    tag: tr.tag as L,
  };
}) as RoleBilingue[];

/**
 * État de chaque pôle. Dérivé des pôles eux-mêmes : le nom du pôle n'est
 * jamais recopié ici, seule la fonction occupée et son statut le sont.
 */
export const poleStatuses = poles.map((p) => {
  const fr = poleStatusesFr.find((s) => s.key === p.key);
  const en = poleStatusesEn[p.key];
  return {
    key: p.key,
    pole: p,
    fonction: translate(fr?.fonction, en?.fonction) as unknown as { fr: string; en: string },
    statut: translate(fr?.statut, en?.statut) as unknown as { fr: string; en: string },
  };
});

/* --------------------------------------------------------------- vision */

export const vision = {
  ruptures: mergeByIndex(visionFr.ruptures, visionEn.rupturesEn) as unknown as Array<
    { icon: string } & { title: L; text: L }
  >,
  iaBloc: {
    title: { fr: visionFr.iaBloc.title, en: visionEn.iaBlocEn.title } as L,
    text: { fr: visionFr.iaBloc.text, en: visionEn.iaBlocEn.text } as L,
    bullets: visionFr.iaBloc.bullets.map(
      (b, i) => ({ fr: b, en: visionEn.iaBlocEn.bullets[i] ?? b }) as L,
    ),
    link: visionFr.iaBloc.link,
  },
  publics: mergeByIndex(visionFr.publics, visionEn.publicsEn) as unknown as Array<
    { icon: string } & { title: L; text: L }
  >,
  sansCadre: visionFr.sansCadre.map((s, i) => ({ fr: s, en: visionEn.sansCadreEn[i] ?? s }) as L),
  avecCadre: visionFr.avecCadre.map((s, i) => ({ fr: s, en: visionEn.avecCadreEn[i] ?? s }) as L),
  principe: {
    text: { fr: visionFr.principe.text, en: visionEn.principeEn.text } as L,
    by: { fr: visionFr.principe.by, en: visionEn.principeEn.by } as L,
  },
};

/* ----------------------------------------------------------- références */

export const references = {
  publications: mergeByIndex(referencesFr.publications, referencesEn.publicationsEn),
  casUsage: mergeByIndex(referencesFr.casUsage, referencesEn.casUsageEn),
  actualites: mergeByIndex(referencesFr.actualites, referencesEn.actualitesEn),
  gabaritsPublications: mergeByIndex(
    referencesFr.gabaritsPublications,
    referencesEn.gabaritsPublicationsEn,
  ),
  gabaritsCas: mergeByIndex(referencesFr.gabaritsCas, referencesEn.gabaritsCasEn),
  gabaritsActualites: mergeByIndex(
    referencesFr.gabaritsActualites,
    referencesEn.gabaritsActualitesEn,
  ),
  conditions: referencesFr.conditions.map((cond, i) => {
    const en = referencesEn.conditionsEn[i];
    return {
      label: { fr: cond.label, en: en?.label ?? cond.label } as L,
      items: mergeByIndex(cond.items, en?.items ?? []),
    };
  }),
};

/* ----------------------------------------------------- blocs éditoriaux */

/** Blocs de la page /prestations/ (et /en/services/). */
export const prestationsPage = {
  livrables: translate(livrablesPage, livrablesPageEn),
  perimetreExclu: translate(perimetreExclu, perimetreExcluEn),
};

/** Blocs propres à la page /methode/ (et /en/method/). */
export const methodePage = {
  revueCroisee: translate(revueCroisee, revueCroiseeEn),
  coutTrace: translate(coutTrace, coutTraceEn),
};

/**
 * Catalogues de références, déjà passés par les deux gates (vérifié et
 * anonymisé). Ils sont vides tant qu'aucun contenu réel n'a été validé : les
 * pages affichent alors leurs gabarits.
 */
export const catalogues = {
  publications: translate(referencesFr.publicationsPubliees(), referencesEn.publicationsEn),
  casUsage: translate(referencesFr.casPublies(), referencesEn.casUsageEn),
  actualites: translate(referencesFr.actualitesPubliees(), referencesEn.actualitesEn),
};

/**
 * Documents légaux : une structure complète par langue, dans un seul module.
 * Le contenu est trop structuré (titres, listes, liens) pour un `{ fr, en }`
 * par chaîne ; les deux versions vivent donc côte à côte ici.
 */
export function legalDoc(
  name: "mentionsLegales" | "confidentialite",
  locale: Locale,
): LegalDoc {
  if (name === "mentionsLegales") {
    return locale === "en" ? mentionsLegalesEn : mentionsLegales;
  }
  return locale === "en" ? confidentialiteEn : confidentialite;
}

/* ---------------------------------------------------------------- export */

export { engagementsNote };
export { networkGeometry } from "./poles";
