/* ===================================================================
   Page « Notre vision » — COPYWRITING.md § 6 / maquette index.html
   (sections « Les données ont changé d'échelle » et « L'intelligence
   artificielle a déplacé la difficulté »).

   Aucun texte inventé : chaque chaîne provient de la maquette validée
   ou de COPYWRITING.md. Les blocs sont décrits en données, pas en JSX,
   pour rester substituables par un CMS (CONTEXT_MVP § 3bis.3).
   =================================================================== */

export type CardItem = { icon: string; title: string; text: string };

/** Les trois ruptures qui rendent le travail pluridisciplinaire nécessaire. */
export const ruptures: CardItem[] = [
  {
    icon: "ph-stack",
    title: "Des données plus volumineuses",
    text: "Séquençage, imagerie, protéomique : les volumes dépassent ce qu'un poste de travail peut traiter, et les formats changent à chaque technologie.",
  },
  {
    icon: "ph-share-network",
    title: "Des compétences dispersées",
    text: "La biologie, les statistiques et l'ingénierie des données vivent dans des services différents, avec des calendriers et des vocabulaires différents.",
  },
  {
    icon: "ph-seal-check",
    title: "Des résultats à défendre",
    text: "Un résultat doit tenir devant un comité de lecture, un financeur ou un partenaire. Cela suppose de savoir d'où il vient et ce qu'il ne prouve pas.",
  },
];

/** Second déplacement de la difficulté : l'IA produit, la vérification reste. */
export const iaBloc = {
  title: "L'intelligence artificielle a déplacé la difficulté une seconde fois.",
  text: "Elle permet de produire une analyse crédible en quelques minutes. Elle ne dit pas si cette analyse est juste. La vérification devient le travail principal, et elle demande des compétences que peu d'équipes réunissent.",
  bullets: [
    "Un biologiste et un statisticien ne reformulent pas la même demande.",
    "Une interprétation qui ne résiste pas à l'examen statistique est fragile.",
    "Chaque discipline connaît les limites de ses propres méthodes.",
  ],
  link: { href: "/expertises/", label: "Voir comment nous travaillons" },
};

/** Pour qui nous travaillons — maquette index.html, section « Vous avez des données… ». */
export const publics: CardItem[] = [
  {
    icon: "ph-flask",
    title: "Laboratoires et plateformes",
    text: "Vous produisez des données omiques ou d'imagerie et cherchez à en tirer une interprétation biologiquement solide.",
  },
  {
    icon: "ph-users-three",
    title: "Équipes de recherche",
    text: "Vous avez besoin d'un appui méthodologique ou statistique sur un protocole, une analyse ou une publication.",
  },
  {
    icon: "ph-hospital",
    title: "Établissements de santé",
    text: "Vous travaillez sur des données cliniques et cherchez un regard expert, dans le respect du cadre réglementaire.",
  },
  {
    icon: "ph-buildings",
    title: "Industries et partenaires",
    text: "Vous évaluez des résultats produits en interne ou par des outils automatisés avant de les utiliser.",
  },
];

/** La différence : sans cadre / avec cadre (maquette expertise.html, methode.html). */
export const sansCadre = [
  "On ne sait plus quel paramètre a été employé",
  "La version de l'outil n'est pas notée",
  "Les limites sont découvertes en relecture",
  "Reprendre le travail signifie le refaire",
];

export const avecCadre = [
  "Paramètres, versions et décisions sont consignés",
  "Le journal d'exécution permet de rejouer l'analyse",
  "Les réserves sont écrites et assumées",
  "Reprendre le travail signifie l'ouvrir",
];

/** Le principe qui tient toute la démarche (COPYWRITING.md § 6.4). */
export const principe = {
  text: "Un résultat scientifique ne doit pas seulement être produit. Il doit pouvoir être examiné, compris et justifié.",
  by: "Le principe qui tient toute la méthode",
};
