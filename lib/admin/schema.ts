/* ===================================================================
   SCHÉMA DU BACK-OFFICE
   -------------------------------------------------------------------
   Une seule définition par collection : elle pilote à la fois le
   formulaire d'édition (client) et les contrôles d'enregistrement
   (serveur). Ajouter un champ = l'ajouter ici, une fois.

   Aucun import Node : ce fichier est embarqué dans le bundle client.
   =================================================================== */

export type DocName = "publications" | "cas-usage" | "actualites" | "reseau" | "reglages";

export type FieldType =
  | "i18n-line"
  | "i18n-area"
  | "line"
  | "area"
  | "select"
  | "date"
  | "check"
  | "url";

export type AdminField = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  required?: boolean;
  wide?: boolean;
  rows?: number;
};

export type CollectionDef = {
  /** Document JSON écrit sur le disque / commité sur GitHub. */
  doc: DocName;
  /** Clé du document qui contient le tableau. */
  pointer: string;
  /** Chemin du back-office. */
  path: string;
  singular: string;
  plural: string;
  icon: string;
  intro: string;
  /** Champ affiché comme titre dans la liste. */
  titleField: string;
  /** Champ affiché en second dans la liste. */
  subtitleField?: string;
  /** Champs repris dans la ligne de métadonnées. */
  metaFields: string[];
  fields: AdminField[];
  /** Les deux cases vérifié / anonymisé sont-elles obligatoires ? */
  gates: boolean;
  hasStatut: boolean;
  /** Génère le slug depuis ce champ bilingue (facultatif). */
  slugFrom?: string;
};

export const collections: Record<string, CollectionDef> = {
  publications: {
    doc: "publications",
    pointer: "items",
    path: "/admin/publications",
    singular: "publication",
    plural: "Publications",
    icon: "ph-file-text",
    intro:
      "Articles, communications et rapports. Une entrée n'apparaît sur le site public qu'une fois publiée, vérifiée et anonymisée.",
    titleField: "title",
    subtitleField: "resume",
    metaFields: ["type", "annee", "cadre"],
    gates: true,
    hasStatut: true,
    slugFrom: "title",
    fields: [
      { key: "title", label: "Titre", type: "i18n-line", required: true, wide: true },
      { key: "type", label: "Nature", type: "select", options: ["Article", "Communication", "Rapport"] },
      { key: "annee", label: "Année", type: "line", help: "Quatre chiffres, ex. 2026." },
      { key: "cadre", label: "Revue / événement / périmètre", type: "i18n-line", wide: true },
      { key: "url", label: "Lien public", type: "url", help: "Facultatif. Lien vers la publication ou le rapport.", wide: true },
      { key: "resume", label: "Résumé", type: "i18n-area", rows: 5, wide: true },
      { key: "slug", label: "Identifiant d'URL", type: "line", help: "Généré depuis le titre, modifiable." },
    ],
  },

  "cas-usage": {
    doc: "cas-usage",
    pointer: "items",
    path: "/admin/cas-usage",
    singular: "cas d'usage",
    plural: "Cas d'usage",
    icon: "ph-briefcase",
    intro:
      "Une situation réelle, décrite sans la nommer. Le paragraphe « ce que cela ne prouve pas » est obligatoire : c'est lui qui distingue un cas d'usage d'une publicité.",
    titleField: "title",
    subtitleField: "situation",
    metaFields: ["duree"],
    gates: true,
    hasStatut: true,
    slugFrom: "title",
    fields: [
      { key: "title", label: "Intitulé", type: "i18n-line", required: true, wide: true },
      { key: "duree", label: "Durée", type: "i18n-line" },
      { key: "situation", label: "La situation", type: "i18n-area", rows: 4, required: true, wide: true },
      { key: "question", label: "La question", type: "i18n-area", rows: 4, required: true, wide: true },
      { key: "fait", label: "Ce qui a été fait", type: "i18n-area", rows: 4, required: true, wide: true },
      {
        key: "limites",
        label: "Ce que cela ne prouve pas",
        type: "i18n-area",
        rows: 4,
        required: true,
        wide: true,
        help: "Obligatoire. Les limites sont écrites, jamais sous-entendues.",
      },
      { key: "slug", label: "Identifiant d'URL", type: "line" },
    ],
  },

  actualites: {
    doc: "actualites",
    pointer: "items",
    path: "/admin/actualites",
    singular: "actualité",
    plural: "Actualités",
    icon: "ph-newspaper-clipping",
    intro:
      "Le fil du réseau : arrivées, missions, prises de position. Publier une actualité la fait apparaître immédiatement après le déploiement.",
    titleField: "title",
    subtitleField: "text",
    metaFields: ["categorie", "date"],
    gates: false,
    hasStatut: true,
    slugFrom: "title",
    fields: [
      { key: "title", label: "Titre", type: "i18n-line", required: true, wide: true },
      { key: "date", label: "Date", type: "date", required: true, help: "Une date réelle : rien ne s'annonce à l'avance." },
      { key: "categorie", label: "Catégorie", type: "i18n-line" },
      { key: "text", label: "Texte", type: "i18n-area", rows: 4, required: true, wide: true },
      { key: "slug", label: "Identifiant d'URL", type: "line" },
    ],
  },

  membres: {
    doc: "reseau",
    pointer: "membres",
    path: "/admin/reseau/membres",
    singular: "membre",
    plural: "Membres",
    icon: "ph-users-three",
    intro:
      "Aucun nom, aucune fonction, aucun lien ne s'affiche sans l'accord écrit de la personne. La case « accord écrit » est la seule chose qui ouvre la publication.",
    titleField: "nom",
    subtitleField: "fonction",
    metaFields: ["pole"],
    gates: false,
    hasStatut: true,
    fields: [
      { key: "nom", label: "Nom affiché", type: "line", required: true },
      { key: "pole", label: "Pôle", type: "select", options: [
        "biologie",
        "bioinformatique",
        "bio-imagerie",
        "medecine-sante",
        "pharmacologie",
        "statistiques-ia",
        "reseau",
      ] },
      { key: "fonction", label: "Fonction", type: "i18n-line", wide: true },
      { key: "lien", label: "Lien professionnel", type: "url", help: "ORCID, page institutionnelle, LinkedIn. Facultatif.", wide: true },
      {
        key: "accord",
        label: "Accord écrit obtenu (nom, fonction et lien)",
        type: "check",
        help: "Sans cette case cochée, le profil n'apparaît nulle part sur le site.",
        wide: true,
      },
    ],
  },

  roles: {
    doc: "reseau",
    pointer: "roles",
    path: "/admin/reseau/roles",
    singular: "fonction",
    plural: "Fonctions du réseau",
    icon: "ph-compass",
    intro:
      "Les fonctions affichées sur /reseau/. Tant que cette liste est vide, le site utilise ses textes par défaut.",
    titleField: "title",
    subtitleField: "text",
    metaFields: ["icon", "tag"],
    gates: false,
    hasStatut: false,
    fields: [
      { key: "title", label: "Fonction", type: "i18n-line", required: true, wide: true },
      { key: "text", label: "Description", type: "i18n-area", rows: 3 },
      { key: "tag", label: "Étiquette", type: "i18n-line", help: "Ex. « À identifier », « 6 postes »." },
      { key: "icon", label: "Icône", type: "line", help: "Classe Phosphor, ex. ph-compass." },
    ],
  },

  engagements: {
    doc: "reseau",
    pointer: "engagements",
    path: "/admin/reseau/engagements",
    singular: "engagement",
    plural: "Engagements",
    icon: "ph-seal-check",
    intro:
      "Les six engagements vérifiables affichés sur /reseau/. Vider cette liste rétablit les textes par défaut.",
    titleField: "title",
    subtitleField: "text",
    metaFields: ["icon"],
    gates: false,
    hasStatut: false,
    fields: [
      { key: "title", label: "Engagement", type: "i18n-line", required: true, wide: true },
      { key: "text", label: "Description", type: "i18n-area", rows: 3, wide: true },
      { key: "icon", label: "Icône", type: "line", help: "Classe Phosphor, ex. ph-ruler." },
    ],
  },
};

export const collectionList = Object.values(collections);

export function getCollection(name: string): CollectionDef | null {
  return collections[name] ?? null;
}

/* ---------------------------------------------------------- réglages */

export type SettingsGroup = { title: string; intro?: string; fields: AdminField[] };

export const settingsGroups: SettingsGroup[] = [
  {
    title: "Site",
    intro: "Adresse publique du site, sans barre finale. Elle sert aux URL canoniques et au plan de site.",
    fields: [{ key: "url_site", label: "URL du site", type: "url", help: "Ex. https://integra.science" }],
  },
  {
    title: "Coordonnées",
    intro: "Un champ vide ne produit aucun rendu sur la page Contact.",
    fields: [
      { key: "adresse", label: "Adresse postale", type: "line", wide: true },
      { key: "telephone", label: "Téléphone", type: "line" },
      { key: "email_contact", label: "Email de contact", type: "line" },
      { key: "horaires", label: "Horaires", type: "line" },
    ],
  },
  {
    title: "Réseaux",
    intro: "Une icône n'apparaît dans le pied de page que si son lien est renseigné.",
    fields: [
      { key: "linkedin", label: "LinkedIn", type: "url" },
      { key: "x_twitter", label: "X / Twitter", type: "url" },
      { key: "orcid", label: "ORCID", type: "url" },
      { key: "researchgate", label: "ResearchGate", type: "url" },
      { key: "google_scholar", label: "Google Scholar", type: "url" },
    ],
  },
  {
    title: "Citation",
    fields: [
      { key: "citation_nom", label: "Nom de citation", type: "line" },
      { key: "citation_fonction", label: "Fonction de citation", type: "line" },
    ],
  },
  {
    title: "Mentions légales",
    intro: "Ces informations remplacent les blocs vides des mentions légales.",
    fields: [
      { key: "raison_sociale", label: "Raison sociale", type: "line" },
      { key: "forme_juridique", label: "Forme juridique", type: "line" },
      { key: "siret_ou_equivalent", label: "SIRET ou équivalent", type: "line" },
      { key: "directeur_publication", label: "Directeur de publication", type: "line" },
    ],
  },
];

export const settingsKeys = settingsGroups.flatMap((g) => g.fields.map((f) => f.key));
