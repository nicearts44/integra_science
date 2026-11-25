/* ===================================================================
   Les six étapes de la méthode — maquettes methode.html / expertise.html
   et CONTEXT_MVP § 7.5.
   =================================================================== */

import type { FlowStep } from "@/components/interactive/Flow";

export const flowSteps: FlowStep[] = [
  {
    key: "01",
    step: "Étape 01",
    title: "Réception de la demande",
    short: "Réception",
    text: "La demande est reformulée par écrit : question posée, données disponibles, décision attendue, échéance. Une demande mal formulée produit une réponse hors sujet, quelle que soit la qualité du travail.",
    trace: "Fiche de demande, contresignée par le demandeur",
  },
  {
    key: "02",
    step: "Étape 02",
    title: "Analyse préliminaire",
    short: "Analyse préliminaire",
    text: "Les données sont inspectées avant tout engagement : complétude, cohérence, qualité, adéquation à la question. C'est l'étape où l'on dit non, ou pas encore.",
    trace: "État des données et réserves identifiées",
  },
  {
    key: "03",
    step: "Étape 03",
    title: "Cadrage scientifique",
    short: "Cadrage",
    text: "Les pôles concernés définissent la méthode, le plan d'analyse et les livrables. Rien ne commence sans un plan validé par écrit : ni le calendrier, ni les conditions, ni le périmètre ne bougent ensuite sans avenant.",
    trace: "Plan de mission validé, périmètre et limites",
  },
  {
    key: "04",
    step: "Étape 04",
    title: "Réalisation des analyses",
    short: "Réalisation",
    text: "Les analyses sont conduites avec des paramètres conservés, des versions d'outils notées et un journal d'exécution. Ce qui n'est pas noté ne pourra pas être défendu.",
    trace: "Résultats, scripts, versions, journal d'exécution",
  },
  {
    key: "05",
    step: "Étape 05",
    title: "Revue scientifique croisée",
    short: "Revue croisée",
    text: "Un pôle qui n'a pas réalisé le travail relit les résultats. Son rôle est de chercher l'erreur, pas de valider. Les réserves formulées sont écrites et conservées : une revue qui ne trouve rien est suspecte.",
    trace: "Réserves de revue et décision motivée",
  },
  {
    key: "06",
    step: "Étape 06",
    title: "Restitution documentée",
    short: "Restitution",
    text: "Le rapport expose les résultats, la méthode, les limites et les conditions de reprise. Il est remis avec ses fichiers de reproduction, et présenté en séance si la mission le prévoit.",
    trace: "Rapport final, fichiers de reproduction",
  },
];

/** Version courte affichée dans les bandeaux « steps » de l'accueil. */
export const stepTraces = flowSteps.map((s) => ({
  n: s.step.replace("Étape ", ""),
  title: s.title,
  trace: s.trace,
}));

/* ------------------------------------------------------------------ */
/* Page /methode/ — maquette methode.html                               */
/* ------------------------------------------------------------------ */

/** « Ce que vous gardez. » — six documents remis au fil de la mission. */
export const tracesRemises = [
  { key: "01", icon: "ph-clipboard-text", title: "Fiche de demande", text: "La question telle qu'elle a été comprise et acceptée." },
  { key: "02", icon: "ph-magnifying-glass", title: "État des données", text: "Ce qui est disponible, ce qui manque, ce qui limite l'analyse." },
  { key: "03", icon: "ph-compass", title: "Plan de mission", text: "Méthode, périmètre, livrables, calendrier, conditions." },
  { key: "04", icon: "ph-terminal", title: "Journal d'exécution", text: "Paramètres, versions, décisions techniques prises en cours de route." },
  { key: "05", icon: "ph-users-three", title: "Réserves de revue", text: "Ce que le pôle relecteur a contesté, et pourquoi." },
  { key: "06", icon: "ph-file-text", title: "Rapport final", text: "Résultats, limites, conditions de reprise, fichiers de reproduction." },
];

/** La revue croisée — le seul contrôle qui vaille. */
export const revueCroisee = {
  title: "La revue croisée est le seul contrôle qui vaille.",
  paragraphs: [
    "Celui qui a produit une analyse ne voit plus ses propres erreurs : il a suivi un raisonnement, il le trouve cohérent, il le répète. Une relecture par le même pôle ne corrige rien.",
    "Dans le réseau, la revue est confiée à un pôle qui n'a pas réalisé le travail, et dont la compétence recoupe le sujet. Son rôle n'est pas de valider mais de chercher la faille : méthode inadaptée, hypothèse non dite, conclusion qui dépasse les données.",
  ],
  bullets: [
    "Le pôle relecteur est nommé au cadrage, pas à la fin",
    "Les réserves sont écrites, datées et conservées",
    "Une réserve non levée apparaît dans le rapport final",
  ],
  figure: "review",
};

/** « Le coût de la trace, et ce qu'elle évite. » */
export const coutTrace = {
  title: "Le coût de la trace, et ce qu'elle évite.",
  sans: {
    label: "Sans méthode",
    items: [
      "Le paramètre employé n'est plus connu",
      "La version de l'outil n'est pas notée",
      "Les limites apparaissent en relecture",
      "Reprendre le travail signifie le refaire",
    ],
  },
  avec: {
    label: "Avec la méthode INTEGRA",
    items: [
      "Paramètres, versions et décisions consignés",
      "Journal d'exécution permettant de rejouer l'analyse",
      "Réserves écrites et assumées",
      "Reprendre le travail signifie l'ouvrir",
    ],
  },
};
