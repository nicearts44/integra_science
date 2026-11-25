/* ===================================================================
   Page « Le réseau » — maquette reseau.html / COPYWRITING.md § 10.
   Règle : aucun nom, aucune fonction, aucun lien professionnel n'est
   affiché tant que la personne n'a pas donné son accord. Les postes à
   pourvoir restent visibles : c'est un réseau en construction.
   =================================================================== */

import { poles } from "./poles";

export type Role = { key: string; icon: string; title: string; text: string; tag: string };

/** Les fonctions du réseau — le rôle est écrit avant d'être occupé. */
export const roles: Role[] = [
  {
    key: "01",
    icon: "ph-compass",
    title: "Coordination générale",
    text: "Accueil des demandes, cadrage, suivi des missions.",
    tag: "À identifier",
  },
  {
    key: "02",
    icon: "ph-seal-check",
    title: "Coordination scientifique",
    text: "Cohérence scientifique du réseau, arbitrage des revues croisées.",
    tag: "À confirmer",
  },
  {
    key: "03",
    icon: "ph-tree-structure",
    title: "Responsables de pôles",
    text: "Un responsable par pôle d'expertise, désigné lors de la constitution du réseau.",
    tag: "6 postes",
  },
  {
    key: "04",
    icon: "ph-clipboard-text",
    title: "Responsables de mission",
    text: "Pilotage de chaque mission confiée, un responsable identifié par mission.",
    tag: "Par mission",
  },
  {
    key: "05",
    icon: "ph-users-three",
    title: "Experts et relecteurs",
    text: "Réalisation et relecture des travaux, choisis selon les sujets.",
    tag: "Selon les sujets",
  },
  {
    key: "06",
    icon: "ph-handshake",
    title: "Partenaires",
    text: "Collaborations académiques et institutionnelles, dans le cadre des missions.",
    tag: "À construire",
  },
];

/** Engagements vérifiables — CONTEXT_MVP § 10.3 / COPYWRITING.md § 10.5. */
export const engagements = [
  {
    key: "01",
    icon: "ph-ruler",
    title: "Rigueur méthodologique",
    text: "Choix méthodologiques justifiés, paramètres conservés, hypothèses explicites.",
  },
  {
    key: "02",
    icon: "ph-git-branch",
    title: "Traçabilité",
    text: "Sources, étapes, décisions, versions et scripts sont consignés.",
  },
  {
    key: "03",
    icon: "ph-eye",
    title: "Transparence sur les limites",
    text: "Réserves, incertitudes et conditions d'usage sont indiquées.",
  },
  {
    key: "04",
    icon: "ph-lock-key",
    title: "Confidentialité",
    text: "Accès limité, minimisation des données, respect des règles applicables.",
  },
  {
    key: "05",
    icon: "ph-medal",
    title: "Reconnaissance",
    text: "Chaque contribution est identifiée et valorisée.",
  },
  {
    key: "06",
    icon: "ph-flag",
    title: "Feuille de route",
    text: "Suivi étape par étape : chaque pôle consigne ses commentaires et valide son périmètre.",
  },
];

/** Mention obligatoire sous les engagements — jamais supprimée. */
export const engagementsNote =
  "Ces engagements décrivent notre démarche de travail. Ils ne constituent ni certification, ni accréditation, ni validation clinique officielle.";

/**
 * Statut des responsables de pôle. `statut` reste « à confirmer » tant que
 * la personne n'a pas donné son accord écrit : le nom n'est alors pas rendu.
 */
export type PoleStatus = {
  /** Clé stable du pôle — fait le lien avec lib/content/poles.ts. */
  key: string;
  num: string;
  title: string;
  /** « Responsable de pôle · fonction à renseigner » tant que rien n'est publié. */
  fonction: string;
  statut: string;
};

/** Le statut des pôles se déduit du tableau `poles` : une seule vérité. */
export const poleStatuses: PoleStatus[] = poles.map((p) => ({
  key: p.key,
  num: p.num,
  title: p.title,
  fonction: "Responsable de pôle · fonction à renseigner",
  statut: p.key === "bioinformatique" ? "Membre fondateur" : "Statut à confirmer",
}));
