/* ===================================================================
   Les quatre prestations — COPYWRITING.md § 8 / CONTEXT_MVP § 7.4.
   =================================================================== */

export type Prestation = {
  slug: string;
  /** Clé stable, identique dans les deux langues (voir lib/content/poles.ts). */
  key: string;
  icon: string;
  title: string;
  chapeau: string;
  situation: string;
  actions: string[];
  livrables: string[];
  conditions: string;
  profils: string[];
  /** Résumé de l'accueil (carte avec livrable). */
  resume: string;
  livrableCourt: string;
  meta: { title: string; description: string };
};

export const prestations: Prestation[] = [
  {
    slug: "analyse-omiques",
    key: "analyse-omiques",
    icon: "ph-dna",
    title: "Analyse de données omiques",
    chapeau:
      "Des données de séquençage aux conclusions biologiques, avec les paramètres et les références qui permettent de les vérifier.",
    situation:
      "Vous disposez de données omiques séquençage, expression, protéines et vous devez en tirer une interprétation qui tienne. Le traitement technique n'est pas le point difficile : ce qui l'est, c'est de savoir ce que les résultats signifient, et sur quoi repose cette interprétation.",
    actions: [
      "Contrôle qualité et préparation des données",
      "Traitement et annotation selon les standards du type de données",
      "Analyse différentielle et exploration des résultats",
      "Interprétation biologique des résultats",
      "Discussion explicite des limites et des incertitudes",
    ],
    livrables: [
      "Un rapport d'analyse présentant les résultats et leur interprétation",
      "Les fichiers de résultats exploitables",
      "Les paramètres et les versions des outils utilisés",
      "Les références des bases de données et des annotations employées",
    ],
    conditions:
      "Le périmètre et les données sont convenus par écrit avant le démarrage. Les conclusions dépendent de la qualité des données fournies ; cette dépendance est documentée dans le rapport. Un rapport d'analyse biologique ne constitue pas une décision clinique.",
    profils: ["Bioinformaticiens", "Biologistes", "Statisticiens"],
    resume:
      "Traitement, contrôle qualité, annotation et interprétation de données de séquençage, d'expression et de protéines.",
    livrableCourt:
      "Rapport d'analyse, fichiers de résultats, paramètres, références des bases utilisées",
    meta: {
      title: "Analyse de données omiques",
      description:
        "Traitement, contrôle qualité, annotation et interprétation de données de séquençage, d'expression et de protéines.",
    },
  },
  {
    slug: "pipelines-reproductibles",
    key: "pipelines-reproductibles",
    icon: "ph-git-branch",
    title: "Pipelines et logiciels reproductibles",
    chapeau: "Une analyse qui ne peut pas être rejouée n'est pas une méthode. C'est un événement.",
    situation:
      "Vous avez une analyse qui fonctionne mais qui ne fonctionne que sur la machine de la personne qui l'a écrite, avec les versions logiciels qu'elle avait ce jour-là. Vous avez besoin qu'elle fonctionne encore dans deux ans, et qu'une autre personne puisse la reprendre.",
    actions: [
      "Conception de chaînes d'analyse structurées",
      "Automatisation des étapes récurrentes",
      "Versionnement du code et des environnements d'exécution",
      "Documentation des dépendances et des paramètres",
      "Rédaction des instructions de reprise",
    ],
    livrables: [
      "Les scripts et le workflow complet",
      "L'environnement d'exécution documenté",
      "La documentation technique",
      "Les instructions de reprise et de maintenance",
    ],
    conditions:
      "La maintenance au-delà de la mission est convenue séparément. Le périmètre fonctionnel est arrêté au cadrage ; toute extension fait l'objet d'un avenant.",
    profils: ["Bioinformaticiens", "Ingénieurs"],
    resume: "Conception, automatisation, documentation et versionnement de chaînes d'analyse.",
    livrableCourt: "Scripts, workflow, environnement d'exécution, documentation, instructions de reprise",
    meta: {
      title: "Pipelines et logiciels reproductibles",
      description:
        "Conception, automatisation, documentation et versionnement de chaînes d'analyse reproductibles.",
    },
  },
  {
    slug: "statistiques-appui-methodologique",
    key: "statistiques-appui-methodologique",
    icon: "ph-chart-scatter",
    title: "Statistiques et appui méthodologique",
    chapeau: "La bonne méthode, choisie pour la bonne raison, et documentée pour qu'on puisse la contester.",
    situation:
      "Vous devez concevoir une étude, dimensionner un échantillon, choisir un test ou défendre une analyse devant un comité de lecture. Le choix méthodologique engage la validité de tout le reste.",
    actions: [
      "Cadrage de la question d'analyse",
      "Choix et justification des méthodes",
      "Plans d'analyse et dimensionnement",
      "Production de figures et de visualisations",
      "Rédaction du rapport méthodologique",
    ],
    livrables: [
      "Un plan d'analyse écrit",
      "Les scripts d'analyse",
      "Les figures et visualisations",
      "Un rapport méthodologique justifiant les choix",
    ],
    conditions:
      "Les conclusions dépendent de la qualité des données. Les hypothèses retenues sont explicitées et documentées. L'appui méthodologique ne se substitue pas à la responsabilité scientifique du porteur d'étude.",
    profils: ["Statisticiens", "Bioinformaticiens", "Chercheurs"],
    resume: "Choix des méthodes, plan d'analyse, visualisation et interprétation statistique.",
    livrableCourt: "Plan d'analyse, scripts, figures, rapport méthodologique",
    meta: {
      title: "Statistiques et appui méthodologique",
      description: "Choix des méthodes, plan d'analyse, visualisation et interprétation statistique.",
    },
  },
  {
    slug: "evaluation-ia",
    key: "evaluation-ia",
    icon: "ph-robot",
    title: "Évaluation de résultats d'IA",
    chapeau: "Un résultat produit en quelques minutes mérite d'être vérifié avant d'être utilisé.",
    situation:
      "Une analyse, un texte ou une conclusion a été produit avec un système d'intelligence artificielle. Vous devez savoir ce qui est exact, ce qui est approximatif, ce qui est inventé — et quel niveau de confiance accorder à l'ensemble avant de l'utiliser.",
    actions: [
      "Reprise critique du matériel fourni",
      "Vérification des affirmations et des sources citées",
      "Repérage des erreurs et des éléments non étayés",
      "Évaluation de la robustesse des conclusions",
      "Formulation des réserves et du niveau de confiance",
    ],
    livrables: [
      "Un rapport d'évaluation",
      "La liste des erreurs et approximations repérées",
      "Les sources vérifiées et celles qui n'ont pas pu l'être",
      "Un niveau de confiance argumenté et les réserves associées",
    ],
    conditions:
      "Le périmètre et les documents sont convenus à l'avance. Le rapport constitue un avis d'expert : il ne vaut ni certification, ni homologation, ni décision clinique. Il porte sur le matériel fourni, pas sur les données d'origine non communiquées.",
    profils: ["Data scientists", "Bioinformaticiens", "Biologistes", "Statisticiens"],
    resume:
      "Reprise d'un travail produit avec une IA pour en vérifier l'exactitude, les sources et la robustesse.",
    livrableCourt:
      "Rapport d'évaluation : erreurs repérées, sources vérifiées, robustesse, niveau de confiance, réserves",
    meta: {
      title: "Évaluation de résultats d'IA",
      description:
        "Reprise d'un travail produit avec une IA pour en vérifier l'exactitude, les sources et la robustesse.",
    },
  },
];

export function getPrestation(slug: string): Prestation | undefined {
  return prestations.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Contenus éditoriaux de la page /prestations/ — maquette prestations.html */
/* ------------------------------------------------------------------ */

/** « Un livrable n'est pas un PDF. » */
export const livrablesPage = [
  {
    icon: "ph-file-text",
    title: "Le rapport",
    text: "Résultats, méthode, limites, conditions d'usage. Écrit pour être lu par un scientifique extérieur au projet.",
  },
  {
    icon: "ph-code",
    title: "Les fichiers de reproduction",
    text: "Scripts, environnement d'exécution, versions d'outils, paramètres. Ce qui permet de rejouer l'analyse à l'identique.",
  },
  {
    icon: "ph-seal-check",
    title: "La trace de revue",
    text: "Les réserves formulées par le pôle relecteur et la décision motivée qui en découle. Conservée avec les résultats.",
  },
];

/** « Ce que nous ne faisons pas. » — le périmètre se dit au cadrage. */
export const perimetreExclu = {
  title: "Ce que nous ne faisons pas.",
  intro:
    "Un périmètre se définit autant par ce qu'il inclut que par ce qu'il exclut. Ces limites sont dites au cadrage, pas découvertes à la livraison.",
  items: [
    "Nous ne délivrons ni certification, ni accréditation, ni validation clinique officielle.",
    "Nous n'affirmons pas qu'un résultat est « fiable » : nous disons ce qu'il autorise à conclure.",
    "Nous n'acceptons pas de données sensibles avant qu'un cadre d'échange soit défini.",
    "Nous ne travaillons pas sans question formulée : une demande floue est reformulée avant d'être acceptée.",
  ],
  figure: "restitution",
};
