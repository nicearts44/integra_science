/* ===================================================================
   Les six pôles d'expertise — COPYWRITING.md § 7 / CONTEXT_MVP § 7.3.
   Aucun champ inventé : tout provient des textes validés.
   =================================================================== */

export type Pole = {
  slug: string;
  num: string;
  icon: string;
  /** H1 de la page détail = nom du pôle. */
  title: string;
  /** Chapeau du hero (une phrase). */
  chapeau: string;
  /** « Ce que couvre ce pôle » — carte de l'index. */
  couverture: string;
  /** Paragraphe de la page détail « Ce que couvre ce pôle ». */
  couvertureDetail: string;
  /** « Ce que nous en faisons » — 3 à 5 items. */
  capacites: string[];
  /** Profils mobilisés. */
  profils: string[];
  /** Résumé court utilisé sur l'accueil. */
  resume: string;
  /** Pôles partenaires (liens croisés). */
  polesLies: string[];
  /** Mention obligatoire (Médecine & santé). */
  mentionPerimetre?: string;
  /** Textes du schéma interactif du réseau. */
  net: { label: string; text: string; tags: string[] };
  /**
   * Clé stable de l'élément — identique dans les deux langues.
   * `slug` est traduit comme tout champ bilingue ; `key` ne l'est jamais :
   * c'est lui qu'on utilise pour retrouver un pôle, lier un pôle à un autre,
   * ou construire une URL.
   */
  key: string;
  meta: { title: string; description: string };
};

export const poles: Pole[] = [
  {
    slug: "biologie",
    key: "biologie",
    num: "01",
    icon: "ph-dna",
    title: "Biologie",
    chapeau:
      "La biologie fournit le cadre dans lequel un résultat prend un sens. Sans elle, une donnée reste une mesure.",
    couverture: "Génétique, biologie moléculaire et cellulaire, génomique, microbiologie.",
    couvertureDetail:
      "Génétique, biologie moléculaire et cellulaire, génomique et microbiologie. Ce pôle apporte la lecture biologique des résultats : ce qu'ils signifient, ce qu'ils ne permettent pas de conclure, et ce qu'il faudrait de plus pour aller plus loin.",
    capacites: [
      "Interprétation biologique de résultats d'analyse",
      "Annotation et caractérisation de variants",
      "Lecture fonctionnelle de données d'expression",
      "Mise en perspective avec la littérature et les bases de référence",
      "Identification des limites biologiques d'une conclusion",
    ],
    profils: ["Biologistes", "Généticiens", "Chercheurs"],
    resume: "Génétique, biologie moléculaire et cellulaire, génomique, microbiologie.",
    polesLies: ["bioinformatique", "bio-imagerie", "medecine-sante", "pharmacologie"],
    net: {
      label: "Bio",
      text: "Génétique, biologie moléculaire et cellulaire, génomique, microbiologie. Le pôle qui dit ce qu'un résultat signifie pour le vivant.",
      tags: ["ADN", "Expression", "Microbiologie"],
    },
    meta: {
      title: "Pôle Biologie",
      description:
        "Génétique, biologie moléculaire et cellulaire, génomique, microbiologie : la lecture biologique des résultats.",
    },
  },
  {
    slug: "bioinformatique",
    key: "bioinformatique",
    num: "02",
    icon: "ph-tree-structure",
    title: "Bioinformatique",
    chapeau:
      "La bioinformatique rend les données exploitables, et l'exploitation reproductible. C'est la discipline qui transforme une analyse en procédure.",
    couverture: "Données omiques, chaînes d'analyse documentées, intégration multi-omiques.",
    couvertureDetail:
      "Données omiques — séquençage, génomique, transcriptomique, protéomique et leur intégration. Conception et maintenance de chaînes d'analyse documentées, versionnées et rejouables.",
    capacites: [
      "Traitement et contrôle qualité de données de séquençage",
      "Construction de pipelines documentés et versionnés",
      "Intégration de données multi-omiques",
      "Automatisation de chaînes d'analyse récurrentes",
      "Documentation des paramètres et des environnements d'exécution",
    ],
    profils: ["Bioinformaticiens", "Ingénieurs", "Data scientists"],
    resume: "Données omiques, chaînes d'analyse documentées, intégration multi-omiques.",
    polesLies: ["biologie", "statistiques-ia", "bio-imagerie"],
    net: {
      label: "Binf",
      text: "Données omiques, chaînes d'analyse documentées, intégration multi-omiques. Le pôle qui rend les volumes traitables et les traitements reproductibles.",
      tags: ["Pipelines", "Omiques", "Reproductibilité"],
    },
    meta: {
      title: "Pôle Bioinformatique",
      description:
        "Données omiques, chaînes d'analyse documentées, intégration multi-omiques : les analyses reproductibles.",
    },
  },
  {
    slug: "bio-imagerie",
    key: "bio-imagerie",
    num: "03",
    icon: "ph-microscope",
    title: "Bio-imagerie",
    chapeau: "L'image biologique est une mesure. La lire demande autant de méthode que de la produire.",
    couverture: "Acquisition, traitement et quantification d'images biologiques et médicales.",
    couvertureDetail:
      "Microscopie, imagerie cellulaire, segmentation et quantification. Extraction de mesures à partir d'images, avec la même exigence de traçabilité qu'une analyse de séquençage.",
    capacites: [
      "Segmentation et quantification d'images cellulaires",
      "Extraction et analyse de mesures issues de l'imagerie",
      "Appui méthodologique sur les protocoles d'acquisition",
      "Traitement assisté par apprentissage automatique",
      "Documentation des paramètres de traitement",
    ],
    profils: ["Spécialistes de l'imagerie", "Biologistes", "Ingénieurs"],
    resume: "Acquisition, traitement et quantification d'images biologiques et médicales.",
    polesLies: ["biologie", "bioinformatique", "medecine-sante", "statistiques-ia"],
    net: {
      label: "Img",
      text: "Acquisition, traitement et quantification d'images biologiques et médicales. Le pôle qui transforme une image en mesure.",
      tags: ["Imagerie", "Quantification"],
    },
    meta: {
      title: "Pôle Bio-imagerie",
      description:
        "Microscopie, imagerie cellulaire, segmentation et quantification d'images biologiques et médicales.",
    },
  },
  {
    slug: "medecine-sante",
    key: "medecine-sante",
    num: "04",
    icon: "ph-heartbeat",
    title: "Médecine & santé",
    chapeau:
      "Un résultat n'a de valeur clinique que s'il est interprété dans un cadre clinique et dans les limites de ce cadre.",
    couverture: "Lecture clinique des résultats, données de santé, cadre réglementaire.",
    couvertureDetail:
      "Génétique médicale, oncologie et expertise clinique, dans le périmètre autorisé. Ce pôle apporte la lecture médicale des résultats et la délimitation explicite de ce qui relève de l'avis d'expert.",
    capacites: [
      "Lecture clinique de résultats biologiques et génomiques",
      "Expertise en génétique médicale et oncologie",
      "Délimitation du périmètre d'interprétation",
      "Contribution à la discussion des implications",
    ],
    profils: ["Médecins", "Professionnels de santé habilités"],
    resume: "Lecture clinique des résultats, données de santé, cadre réglementaire.",
    polesLies: ["biologie", "bio-imagerie", "pharmacologie", "statistiques-ia"],
    mentionPerimetre:
      "INTEGRA SCIENCE produit des avis d'expert. Ces avis ne constituent ni une certification, ni une validation clinique officielle, ni une décision médicale.",
    net: {
      label: "Méd",
      text: "Lecture clinique des résultats, données de santé, cadre réglementaire. Le pôle qui replace un résultat dans une situation réelle.",
      tags: ["Clinique", "Données de santé", "Cadre"],
    },
    meta: {
      title: "Pôle Médecine & santé",
      description:
        "Lecture clinique des résultats, données de santé, cadre réglementaire : la lecture médicale des résultats.",
    },
  },
  {
    slug: "pharmacologie",
    key: "pharmacologie",
    num: "05",
    icon: "ph-flask",
    title: "Pharmacologie",
    chapeau:
      "Les données pharmaceutiques ont leurs propres exigences de méthode, de sécurité et de traçabilité.",
    couverture: "Mécanismes d'action, interactions, évaluation préclinique et clinique.",
    couvertureDetail:
      "Pharmacologie, données pharmaceutiques et recherche thérapeutique. Lecture des données issues du développement, de l'évaluation ou du suivi des produits de santé.",
    capacites: [
      "Analyse et interprétation de données pharmacologiques",
      "Appui méthodologique sur les protocoles d'évaluation",
      "Lecture critique de résultats de recherche thérapeutique",
      "Documentation des méthodes et des limites",
    ],
    profils: ["Pharmaciens", "Pharmacologues", "Chercheurs"],
    resume: "Mécanismes d'action, interactions, évaluation préclinique et clinique.",
    polesLies: ["biologie", "medecine-sante", "statistiques-ia"],
    net: {
      label: "Phar",
      text: "Mécanismes d'action, interactions, évaluation préclinique et clinique. Le pôle qui juge un effet, pas seulement une différence.",
      tags: ["Mécanismes", "Interactions", "Évaluation"],
    },
    meta: {
      title: "Pôle Pharmacologie",
      description:
        "Mécanismes d'action, interactions, évaluation préclinique et clinique : les données pharmaceutiques.",
    },
  },
  {
    slug: "statistiques-ia",
    key: "statistiques-ia",
    num: "06",
    icon: "ph-chart-line-up",
    title: "Statistiques & IA",
    chapeau:
      "Une méthode statistique mal choisie produit un résultat parfaitement inutile. Une méthode choisie et documentée produit un résultat défendable.",
    couverture: "Plan d'analyse, modélisation, évaluation critique des résultats produits par IA.",
    couvertureDetail:
      "Biostatistiques, modélisation, apprentissage automatique et profond. Ce pôle apporte la garantie méthodologique et l'évaluation critique des résultats produits par des systèmes automatisés.",
    capacites: [
      "Choix et justification des méthodes statistiques",
      "Plans d'analyse et calcul de puissance",
      "Modélisation et apprentissage automatique",
      "Évaluation critique de résultats produits par IA",
      "Documentation des hypothèses et des limites",
    ],
    profils: ["Statisticiens", "Data scientists", "Spécialistes de l'intelligence artificielle"],
    resume: "Plan d'analyse, modélisation, évaluation critique des résultats produits par IA.",
    polesLies: ["bioinformatique", "medecine-sante", "pharmacologie", "bio-imagerie"],
    net: {
      label: "Stat",
      text: "Plan d'analyse, modélisation, évaluation critique des résultats produits par IA. Le pôle qui dit ce qu'un chiffre autorise à conclure.",
      tags: ["Plan d'analyse", "Modélisation", "IA"],
    },
    meta: {
      title: "Pôle Statistiques & IA",
      description:
        "Biostatistiques, modélisation, apprentissage automatique et évaluation critique des résultats produits par IA.",
    },
  },
];

/** Positions des nœuds et arêtes du schéma (maquette expertise.html). */
export const networkGeometry = {
  nodes: [
    { id: "bio", cx: 260, cy: 66 },
    { id: "binf", cx: 132, cy: 148 },
    { id: "img", cx: 388, cy: 148 },
    { id: "med", cx: 260, cy: 330 },
    { id: "pharma", cx: 118, cy: 286 },
    { id: "stat", cx: 402, cy: 286 },
  ],
  edges: [
    { id: "bio-binf", from: "bio", to: "binf", d: "M260 66 L132 148" },
    { id: "bio-img", from: "bio", to: "img", d: "M260 66 L388 148" },
    { id: "bio-pharma", from: "bio", to: "pharma", d: "M260 66 L118 286" },
    { id: "binf-stat", from: "binf", to: "stat", d: "M132 148 L402 286" },
    { id: "binf-img", from: "binf", to: "img", d: "M132 148 L388 148" },
    { id: "img-med", from: "img", to: "med", d: "M388 148 L260 330" },
    { id: "med-pharma", from: "med", to: "pharma", d: "M260 330 L118 286" },
    { id: "stat-med", from: "stat", to: "med", d: "M402 286 L260 330" },
    { id: "stat-img", from: "stat", to: "img", d: "M402 286 L388 148" },
    { id: "pharma-bio", from: "pharma", to: "bio", d: "M118 286 L260 66" },
    { id: "med-bio", from: "med", to: "bio", d: "M260 330 L260 66" },
  ],
};

export function getPole(slug: string): Pole | undefined {
  return poles.find((p) => p.slug === slug);
}
