/* ===================================================================
   Contenu des pages légales — CONTEXT_MVP § 7.7 (blueprint `legal.yaml`
   : title, last_updated, content markdown).

   Source : sauvegarde des pages du prototype (mentions légales et
   confidentialité), re-adaptée au site Next.js :
   - aucune mention de plugin Grav, aucun lien mort ;
   - les champs d'identification viennent de lib/content/site.ts et la
     règle d'or s'applique : un champ vide = la ligne n'est pas rendue ;
   - les durées de rétention suivent CONTEXT_MVP § 8.7 (24 mois).
   =================================================================== */

import { siteParams } from "@/lib/content/site";

export type LegalList = {
  intro?: string;
  items: string[];
  outro?: string;
};

export type LegalBlock = {
  h2: string;
  /** Paragraphes de corps (vide si le bloc commence par une liste). */
  paragraphs: string[];
  list?: LegalList;
  /** Lien de bas de bloc (ex. formulaire de contact). */
  link?: { href: string; label: string };
};

export type LegalDoc = {
  title: string;
  /** Date ISO de dernière mise à jour (blueprint `last_updated`). */
  lastUpdated: string;
  blocks: LegalBlock[];
};

/* ------------------------------------------------------------------ */
/* Lignes d'identification — seulement si le champ est renseigné        */
/* ------------------------------------------------------------------ */

function identificationLines(): string[] {
  const lines: string[] = [];
  if (siteParams.raison_sociale) lines.push(`Raison sociale : ${siteParams.raison_sociale}`);
  if (siteParams.forme_juridique) lines.push(`Forme juridique : ${siteParams.forme_juridique}`);
  if (siteParams.siret_ou_equivalent) lines.push(`Immatriculation : ${siteParams.siret_ou_equivalent}`);
  if (siteParams.directeur_publication) lines.push(`Directeur de la publication : ${siteParams.directeur_publication}`);
  return lines;
}

/** Note honnête du prototype, conservée tant que rien n'est renseigné. */
const IDENTIFICATION_ATTENTE =
  "Les mentions d'identification de l'éditeur — dénomination, forme juridique, capital, siège social, immatriculation, directeur de la publication et hébergeur — seront inscrites ici dès qu'elles auront été fournies. Aucune de ces informations n'est inventée sur ce site.";

/* ------------------------------------------------------------------ */
/* Mentions légales                                                     */
/* ------------------------------------------------------------------ */

const identification = identificationLines();

export const mentionsLegales: LegalDoc = {
  title: "Mentions légales",
  lastUpdated: "2026-11-25",
  blocks: [
    {
      h2: "Éditeur du site",
      paragraphs: identification.length ? identification : [IDENTIFICATION_ATTENTE],
    },
    {
      h2: "Propriété intellectuelle",
      paragraphs: [
        "Les textes, illustrations et éléments graphiques de ce site sont protégés par le droit d'auteur. Toute reproduction ou utilisation, même partielle, nécessite une autorisation préalable.",
      ],
    },
    {
      h2: "Contact",
      paragraphs: [
        "Pour toute demande relative à ce site, utilisez le formulaire de contact.",
        ...(siteParams.email_contact ? [`Email de contact : ${siteParams.email_contact}`] : []),
      ],
      link: { href: "/contact/", label: "Contact" },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Politique de confidentialité                                         */
/* ------------------------------------------------------------------ */

const responsable = siteParams.raison_sociale
  ? [
      `Responsable du traitement : ${siteParams.raison_sociale}`,
      ...(siteParams.adresse ? [`Adresse : ${siteParams.adresse}`] : []),
      ...(siteParams.email_contact ? [`Email de contact : ${siteParams.email_contact}`] : []),
    ]
  : [
      "Le responsable de traitement, la base légale retenue pour le formulaire de contact et les coordonnées du délégué à la protection des données seront précisés dès que la structure juridique du réseau sera arrêtée. Cette page n'invente aucune de ces informations.",
    ];

export const confidentialite: LegalDoc = {
  title: "Politique de confidentialité",
  lastUpdated: "2026-11-25",
  blocks: [
    {
      h2: "Ce que ce site ne collecte pas",
      paragraphs: [
        "Aucun cookie publicitaire, aucun outil de mesure d'audience tiers, aucune police chargée depuis un service qui vous identifie. Le seul paramètre conservé est technique : il mémorise votre choix de thème clair ou sombre, et il reste dans votre navigateur.",
      ],
    },
    {
      h2: "Les données du formulaire de contact",
      paragraphs: [],
      list: {
        intro: "Lorsque vous utilisez le formulaire de contact, nous recevons :",
        items: [
          "Votre nom et prénom",
          "Le nom de votre structure, si vous le renseignez",
          "Votre adresse e-mail",
          "Le motif de votre demande",
          "La description que vous rédigez",
          "Votre adresse IP, utilisée uniquement pour limiter les envois automatiques",
        ],
        outro:
          "Ces données servent uniquement à traiter votre demande. Elles ne sont ni revendues, ni utilisées à des fins commerciales, ni transmises à un tiers non nécessaire au traitement.",
      },
    },
    {
      h2: "La lettre d'information",
      paragraphs: [
        "La lettre d'INTEGRA SCIENCE est envoyée par email à celles et ceux qui s'y inscrivent volontairement. Elle paraît une fois par mois.",
        "Base légale : votre consentement, recueilli par la case à cocher du formulaire d'inscription, qui n'est jamais pré-cochée. Vous pouvez le retirer à tout moment.",
        "Confirmation : votre adresse est d'abord validée par un email de confirmation. Sans votre clic sur le lien qu'il contient, l'inscription n'est jamais activée.",
        "Durée : votre adresse est conservée jusqu'à votre désinscription.",
        "Sous-traitant : les emails sont envoyés par Brevo, qui traite cette adresse uniquement pour notre compte.",
        "Droit de retrait : chaque lettre contient un lien de désinscription utilisable en un clic.",
      ],
    },
    {
      h2: "Combien de temps",
      paragraphs: [],
      list: {
        items: [
          "Demande sans suite : la demande et les échanges sont supprimés au bout de 24 mois si aucune mission n'est engagée.",
          "Mission engagée : les éléments contractuels sont conservés selon les durées légales applicables, précisées dans la convention de mission.",
        ],
      },
    },
    {
      h2: "Vos droits",
      paragraphs: [],
      list: {
        intro: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment.",
        items: [
          "Recevoir une réponse sous 30 jours",
          "Retirer votre consentement à tout moment, sans justification",
        ],
      },
      link: { href: "/contact/", label: "Contact" },
    },
    {
      h2: "Responsable du traitement",
      paragraphs: responsable,
    },
  ],
};
