import { defineType } from "sanity";

/**
 * Types de documents partagés (CONTEXT_MVP.md § 3bis.3).
 * Ces schémas sont la seule chose que l'éditeur non-technicien voit dans le Studio.
 * Les champs correspondent un à un aux propriétés des modules `lib/content/*` :
 * le site rend le contenu Sanity quand il existe, sinon le contenu typé local.
 */

/* ---------------------------------------------------------------- gates */

const verifie = ({
  name: "verifie",
  title: "Contenu vérifié",
  description:
    "Deuxième publication gate. Tant que cette case n'est pas cochée, le contenu n'est jamais rendu sur le site — même s'il est publié ici.",
  type: "boolean",
  initialValue: false,
});

const anonymise = ({
  name: "anonymise",
  title: "Anonymisé",
  description:
    "Premier publication gate. Aucun nom de client, de patient, de structure ou de lieu identifiable ne doit subsister dans le texte.",
  type: "boolean",
  initialValue: false,
});

const accordClient = ({
  name: "accordClient",
  title: "Accord écrit du commanditaire",
  description: "Obligatoire pour toute référence publique. À archiver hors du Studio.",
  type: "boolean",
  initialValue: false,
});

const ordre = ({
  name: "ordre",
  title: "Ordre d'affichage",
  description: "Plus petit = plus haut dans la page.",
  type: "number",
  initialValue: 100,
});

/**
 * Annotation `link` — indispensable : `page.corpsFr` / `corpsEn` la déclarent
 * dans `marks.annotations`. Sanity ne fournit aucun type `link` par défaut ;
 * sans cette déclaration le Studio refuse tout le schéma (Unknown type: link).
 */
export const lien = defineType({
  name: "link",
  title: "Lien",
  type: "object",
  fields: [
    ({
      name: "href",
      title: "Adresse",
      description: "URL absolue, ou chemin interne commençant par /.",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),
    ({
      name: "blank",
      title: "Ouvrir dans un nouvel onglet",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

/**
 * Identifiant d'URL — type `slug`, jamais une chaîne libre : Sanity génère
 * l'identifiant depuis le titre français, le nettoie et interdit les doublons
 * dans la requête (`slug.current`).
 */
function slugField(options: {
  description?: string;
  source?: (doc: Record<string, any>) => string;
} = {}) {
  return {
    name: "slug",
    title: "Identifiant d'URL",
    ...(options.description ? { description: options.description } : {}),
    type: "slug",
    options: {
      maxLength: 96,
      source:
        options.source ??
        ((doc: Record<string, any>) => doc?.titre?.fr ?? doc?.titre?.en ?? ""),
    },
    validation: (Rule: any) => Rule.required(),
  };
}

/* --------------------------------------------------------- fragments */

const seoFields = [
  {
    name: "seoTitre",
    title: "Titre SEO",
    description: "55–60 caractères. Laisser vide pour utiliser le titre principal.",
    type: "string",
  },
  {
    name: "seoDescription",
    title: "Description SEO",
    description: "150–160 caractères. Ce que la page apporte, pas un slogan.",
    type: "text",
    rows: 3,
  },
];

const ctaFields = [
  {
    name: "ctaTitre",
    title: "Titre du bandeau final",
    type: "string",
  },
  {
    name: "ctaTexte",
    title: "Texte du bandeau final",
    type: "text",
    rows: 3,
  },
  {
    name: "ctaNote",
    title: "Note sous le bandeau",
    description: "Une ligne de réassurance, séparée par des points médians.",
    type: "string",
  },
  {
    name: "ctaPrincipalLibelle",
    title: "Bouton principal — libellé",
    type: "string",
  },
  {
    name: "ctaPrincipalLien",
    title: "Bouton principal — lien",
    type: "string",
  },
  {
    name: "ctaSecondaireLibelle",
    title: "Bouton secondaire — libellé",
    type: "string",
  },
  {
    name: "ctaSecondaireLien",
    title: "Bouton secondaire — lien",
    type: "string",
  },
];


/* ------------------------------------------------------- bilingue */

/**
 * Champ bilingue — LA règle du projet (GUIDE.md § 7).
 *
 * Un texte n'existe qu'une fois, dans un seul champ, avec sa traduction
 * juste en dessous. L'éditeur ouvre une fiche et voit les deux langues
 * côte à côte : modifier le français n'oblige plus à retrouver le fichier
 * anglais correspondant.
 *
 * Le site lit `champ[locale]` ; si l'anglais est vide, il affiche le
 * français plutôt qu'un trou.
 */
function bilingue(
  name: string,
  title: string,
  options: {
    type?: "string" | "text";
    rows?: number;
    description?: string;
    required?: boolean;
    group?: string;
  } = {},
) {
  const { type = "string", rows, description, required, group } = options;
  /*
   * Sous-champs `fr` / `en` : le document stocke exactement la forme
   * `{ fr, en }` que lisent `lib/locale.ts` et `lib/sanity/queries.ts`, et
   * que `slugField()` attend pour générer l'identifiant depuis le titre
   * français. Sanity n'impose l'unicité des noms qu'à l'intérieur d'un même
   * objet : deux champs bilingues distincts peuvent donc porter `fr` et `en`.
   */
  const sub = (lang: "fr" | "en", label: string) =>
    ({
      name: lang,
      title: label,
      type,
      ...(type === "text" ? { rows: rows ?? 3 } : {}),
    });

  return {
    name,
    title,
    type: "object",
    ...(group ? { group } : {}),
    ...(description ? { description } : {}),
    options: { collapsible: true, collapsed: false },
    fields: [sub("fr", "Français"), sub("en", "English")],
    /* Un champ obligatoire l'est dans le Studio : le français est la langue
       de référence, sa présence conditionne la publication. */
    ...(required ? { validation: (Rule: any) => Rule.required() } : {}),
  };
}

/** Liste bilingue : chaque entrée porte ses deux langues. */
function bilingueList(
  name: string,
  title: string,
  options: { description?: string; type?: "string" | "text"; group?: string } = {},
) {
  const { description, type = "string", group } = options;
  /* Sous-champs `fr` / `en`, comme pour un champ bilingue simple. */
  const sub = (lang: "fr" | "en", label: string) => ({ name: lang, title: label, type });

  return {
    name,
    title,
    type: "array",
    ...(group ? { group } : {}),
    ...(description ? { description } : {}),
    of: [
      {
        type: "object",
        /* Nom unique : Sanity refuse deux objets de même nom dans le schéma. */
        name: `entree_${name}`,
        title: "Entrée",
        fields: [sub("fr", "Français"), sub("en", "English")],
        preview: {
          select: { fr: "fr", en: "en" },
          prepare: ({ fr, en }: { fr?: string; en?: string }) => ({
            title: fr || en || "—",
            subtitle: en ? "fr + en" : "fr seul",
          }),
        },
      },
    ],
  };
}

/** SEO bilingue : titre et description, dans les deux langues. */
const seoBilingue = [
  bilingue("seoTitre", "Titre SEO", { description: "55–60 caractères.", group: "seo" }),
  bilingue("seoDescription", "Description SEO", {
    type: "text",
    rows: 3,
    description: "150–160 caractères. Ce que la page apporte, pas un slogan.",
    group: "seo",
  }),
];

/** Bandeau final bilingue. */
const ctaBilingue = [
  bilingue("ctaTitre", "Titre du bandeau final", { group: "cta" }),
  bilingue("ctaTexte", "Texte du bandeau final", { type: "text", rows: 3, group: "cta" }),
  bilingue("ctaNote", "Note sous le bandeau", { group: "cta" }),
  bilingue("ctaPrincipalLibelle", "Bouton principal — libellé", { group: "cta" }),
  bilingue("ctaPrincipalLien", "Bouton principal — lien", { group: "cta" }),
  bilingue("ctaSecondaireLibelle", "Bouton secondaire — libellé", { group: "cta" }),
  bilingue("ctaSecondaireLien", "Bouton secondaire — lien", { group: "cta" }),
];

/* --------------------------------------------------------- documents */

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "contenu", title: "Contenu", default: true },
    { name: "seo", title: "SEO" },
    { name: "cta", title: "Bandeau final" },
  ],
  fields: [
    bilingue("titre", "Titre principal (H1)", {
      description: "Un seul par page. Aucun sur-titre au-dessus.",
      required: true,
      group: "contenu",
    }),
    ({
      ...slugField({
        description: "Doit correspondre à une route du site (vision, prestations, methode…).",
      }),
      group: "contenu",
    }),
    bilingue("chapeau", "Chapeau", {
      type: "text",
      rows: 4,
      description: "Le paragraphe sous le H1. 2 à 3 phrases, factuel.",
      group: "contenu",
    }),
    ({
      name: "corpsFr",
      title: "Corps de page — français",
      type: "array",
      group: "contenu",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Sous-titre", value: "h2" },
            { title: "Sous-sous-titre", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [{ type: "link", title: "Lien" }],
          },
        },
        {
          type: "image",
          name: "figureFr",
          title: "Figure",
          options: { hotspot: true },
        },
      ],
    }),
    ({
      name: "corpsEn",
      title: "Corps de page — English",
      type: "array",
      group: "contenu",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Subheading", value: "h2" },
            { title: "Sub-subheading", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [{ type: "link", title: "Link" }],
          },
        },
        {
          type: "image",
          name: "figureEn",
          title: "Figure",
          options: { hotspot: true },
        },
      ],
    }),
    ...seoBilingue,
    ...ctaBilingue,
  ],
  preview: {
    select: { fr: "titre.fr", en: "titre.en", slug: "slug.current" },
    prepare: ({ fr, en, slug }) => ({
      title: fr || en || "—",
      subtitle: `${slug ?? ""}${en ? "" : " · anglais manquant"}`,
    }),
  },
});

export const pole = defineType({
  name: "pole",
  title: "Pôle d'expertise",
  type: "document",
  fields: [
    ({
      name: "numero",
      title: "Numéro du pôle",
      description: "Deux chiffres : 01 à 06.",
      type: "string",
    }),
    ({
      ...slugField({
        description: "Français, sans accent : biologie, bioinformatique, bio-imagerie…",
      }),
    }),
    bilingue("titre", "Nom du pôle", { required: true }),
    bilingue("resume", "Résumé (une phrase)", { type: "text", rows: 2 }),
    bilingue("couverture", "Ce que couvre le pôle (index)", { type: "text", rows: 3 }),
    bilingue("couvertureDetail", "Détail de couverture (page du pôle)", {
      type: "text",
      rows: 5,
    }),
    bilingueList("capacites", "Capacités", {
      description: "Verbes d'action à l'infinitif. Trois à six entrées.",
    }),
    bilingueList("profils", "Profils mobilisés"),
    bilingue("mentionPerimetre", "Mention de périmètre", {
      type: "text",
      rows: 2,
      description: "À remplir si le pôle ne couvre qu'une partie de son domaine.",
    }),
    ({
      name: "polesLies",
      title: "Pôles partenaires",
      type: "array",
      of: [{ type: "string" }],
      description: "Slugs des pôles avec lesquels celui-ci travaille le plus souvent.",
    }),
    bilingue("chapeau", "Chapeau du hero (page du pôle)", { type: "text", rows: 3 }),
    ({
      name: "icone",
      title: "Icône Phosphor",
      description: "Nom de l'icône, ex. ph-dna. Laisser vide pour garder celle du site.",
      type: "string",
    }),
    ordre,
  ],
  orderings: [
    { title: "Numéro de pôle", name: "numeroAsc", by: [{ field: "numero", direction: "asc" }] },
  ],
  preview: {
    select: { fr: "titre.fr", en: "titre.en", num: "numero" },
    prepare: ({ fr, en, num }) => ({
      title: `${num ?? ""} · ${fr || en || "—"}`,
      subtitle: en ? undefined : "anglais manquant",
    }),
  },
});

export const prestation = defineType({
  name: "prestation",
  title: "Prestation",
  type: "document",
  fields: [
    bilingue("titre", "Nom de la prestation", { required: true }),
    slugField(),
    bilingue("resume", "Résumé (carte)", { type: "text", rows: 2 }),
    bilingue("chapeau", "Chapeau (page prestations)", { type: "text", rows: 3 }),
    bilingue("situation", "Situation du demandeur", {
      type: "text",
      rows: 4,
      description: "Le cas concret dans lequel on fait appel à cette prestation.",
    }),
    bilingueList("actions", "Ce qui est fait"),
    bilingueList("livrables", "Livrables"),
    bilingue("livrableCourt", "Livrable principal (une ligne)", {
      description: "Affiché sur la carte d'accueil.",
    }),
    bilingue("conditions", "Conditions", { type: "text", rows: 3 }),
    bilingueList("profils", "Profils concernés"),
    ({
      name: "icone",
      title: "Icône Phosphor",
      description: "Nom de l'icône, ex. ph-dna.",
      type: "string",
    }),
    ordre,
  ],
  preview: {
    select: { fr: "titre.fr", en: "titre.en" },
    prepare: ({ fr, en }) => ({ title: fr || en || "—", subtitle: en ? undefined : "anglais manquant" }),
  },
});

export const membre = defineType({
  name: "membre",
  title: "Membre du réseau",
  type: "document",
  fields: [
    bilingue("nom", "Nom affiché", {
      description: "Nom complet, ou initiales si la personne préfère rester discrète.",
      required: true,
    }),
    ({
      name: "role",
      title: "Rôle dans le réseau",
      type: "string",
      options: {
        list: [
          { title: "Coordinateur de pôle", value: "coordinateur" },
          { title: "Expert associé", value: "expert" },
          { title: "Relecteur", value: "relecteur" },
          { title: "Appui méthodologique", value: "methode" },
        ],
      },
    }),
    ({
      name: "pole",
      title: "Pôle principal",
      type: "string",
      description: "Slug du pôle.",
    }),
    bilingue("specialite", "Spécialité"),
    bilingue("bio", "Présentation", {
      type: "text",
      rows: 5,
      description: "Trois à cinq lignes. Ce que la personne sait faire, pas son CV.",
    }),
    ({
      name: "photo",
      title: "Photo",
      description: "Portrait cadré serré, fond neutre, format carré.",
      type: "image",
      options: { hotspot: true },
    }),
    ({
      name: "publie",
      title: "Afficher sur le site",
      description:
        "Une fiche n'apparaît que si la personne a donné son accord écrit. Sans accord, laisser décoché.",
      type: "boolean",
      initialValue: false,
    }),
    ordre,
  ],
  preview: {
    select: { fr: "nom.fr", en: "nom.en", spec: "specialite.fr", media: "photo" },
    prepare: ({ fr, en, spec, media }) => ({
      title: fr || en || "—",
      subtitle: spec,
      media,
    }),
  },
});

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    bilingue("titre", "Titre", { required: true }),
    ({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["Article", "Communication", "Rapport"], layout: "radio" },
    }),
    bilingue("resume", "Résumé", { type: "text", rows: 4 }),
    bilingueList("auteurs", "Auteurs"),
    bilingue("cadre", "Cadre / revue"),
    ({
      name: "annee",
      title: "Année",
      description: "Quatre chiffres, ex. 2025.",
      type: "string",
    }),
    ({ name: "doi", title: "DOI ou lien permanent", type: "url" }),
    ({ name: "fichier", title: "Fichier PDF", type: "file" }),
    verifie,
    anonymise,
    accordClient,
    ({ name: "datePublication", title: "Date de mise en ligne", type: "date" }),
  ],
  preview: {
    select: { fr: "titre.fr", en: "titre.en", type: "type" },
    prepare: ({ fr, en, type }) => ({ title: fr || en || "—", subtitle: type }),
  },
});

export const casUsage = defineType({
  name: "casUsage",
  title: "Cas d'usage",
  type: "document",
  fields: [
    bilingue("titre", "Titre", { required: true }),
    bilingue("situation", "La situation", {
      type: "text",
      rows: 4,
      description: "Le contexte, sans nommer le commanditaire.",
    }),
    bilingue("question", "La question posée", { type: "text", rows: 3 }),
    bilingue("fait", "Ce qui a été fait", { type: "text", rows: 4 }),
    bilingue("limites", "Ce que cela ne prouve pas", {
      type: "text",
      rows: 3,
      description:
        "Paragraphe obligatoire : ce qui distingue un cas d'usage d'une publicité.",
      required: true,
    }),
    bilingue("duree", "Durée"),
    ({
      name: "poles",
      title: "Pôles mobilisés",
      type: "array",
      of: [{ type: "string" }],
    }),
    verifie,
    anonymise,
    accordClient,
    ({ name: "datePublication", title: "Date de mise en ligne", type: "date" }),
  ],
  preview: {
    select: { fr: "titre.fr", en: "titre.en", duree: "duree.fr" },
    prepare: ({ fr, en, duree }) => ({ title: fr || en || "—", subtitle: duree }),
  },
});

export const actualite = defineType({
  name: "actualite",
  title: "Actualité",
  type: "document",
  fields: [
    bilingue("titre", "Titre", { required: true }),
    bilingue("texte", "Texte", { type: "text", rows: 5 }),
    ({
      name: "categorie",
      title: "Catégorie",
      type: "string",
      options: { list: ["Réseau", "Méthode", "Publication", "Mission"], layout: "radio" },
    }),
    ({
      name: "date",
      title: "Date",
      description: "Aucune date n'est annoncée à l'avance : ce qui est publié a eu lieu.",
      type: "date",
    }),
    verifie,
    anonymise,
  ],
  orderings: [
    { title: "Plus récentes d'abord", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { fr: "titre.fr", en: "titre.en", date: "date" },
    prepare: ({ fr, en, date }) => ({ title: fr || en || "—", subtitle: date }),
  },
});

export const parametresSite = defineType({
  name: "parametresSite",
  title: "Paramètres du site",
  type: "document",
  fields: [
    bilingue("nom", "Nom", { description: "Le même dans les deux langues, en principe." }),
    bilingue("signature", "Signature"),
    bilingue("accroche", "Accroche", { type: "text", rows: 2 }),
    ({
      name: "email",
      title: "Adresse e-mail publique",
      description: "Laisser vide tant que l'adresse n'est pas arrêtée : rien ne s'affiche.",
      type: "string",
    }),
    ({ name: "telephone", title: "Téléphone", type: "string" }),
    bilingue("adresse", "Adresse postale", { type: "text", rows: 3 }),
    ({ name: "urlSite", title: "URL du site", type: "url" }),
    bilingue("mentionsIdentite", "Identité légale (mentions légales)", {
      type: "text",
      rows: 6,
      description: "Statut, responsable de publication, hébergeur. Rien ne s'affiche si vide.",
    }),
  ],
  preview: { prepare: () => ({ title: "Paramètres du site" }) },
});

export const abonne = defineType({
  name: "abonne",
  title: "Abonné newsletter",
  type: "document",
  fields: [
    ({ name: "email", title: "E-mail", type: "string" }),
    ({
      name: "statut",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "En attente de confirmation", value: "pending" },
          { title: "Confirmé", value: "confirmed" },
          { title: "Désinscrit", value: "unsubscribed" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    ({ name: "dateInscription", title: "Date d'inscription", type: "datetime" }),
    ({ name: "dateConfirmation", title: "Date de confirmation", type: "datetime" }),
  ],
  preview: { select: { title: "email", subtitle: "statut" } },
});

/**
 * Les types intégrés de Sanity ne sont pas déclarés ici : le Studio les
 * ajoute lui-même. Seuls nos neuf types sont listés.
 */
export const schemaTypes = [
  lien,
  page,
  pole,
  prestation,
  membre,
  publication,
  casUsage,
  actualite,
  parametresSite,
  abonne,
];
