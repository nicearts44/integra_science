import type { Metadata } from "next";

import { baseUrl, siteParams, citationName, citationRole } from "@/lib/content/site";

/** Titre et description exacts de COPYWRITING.md § 14.1. */
export const seo = {
  accueil: {
    title: "INTEGRA SCIENCE — Réseau d'expertise scientifique",
    description:
      "Un réseau qui réunit biologistes, bioinformaticiens, médecins et spécialistes des données autour d'une même problématique du vivant.",
  },
  vision: {
    title: "Notre vision",
    description:
      "Pourquoi les disciplines doivent travailler ensemble dès le cadrage : notre lecture des données du vivant et de la santé.",
  },
  expertises: {
    title: "Six pôles d'expertise",
    description:
      "Biologie, bioinformatique, bio-imagerie, médecine, pharmacologie, statistiques et IA : les compétences du réseau.",
  },
  prestations: {
    title: "Prestations",
    description:
      "Analyse de données omiques, pipelines reproductibles, appui méthodologique, évaluation de résultats d'IA.",
  },
  methode: {
    title: "Notre méthode",
    description: "Six étapes, six traces écrites : de la réception de la demande à la restitution documentée.",
  },
  reseau: {
    title: "Le réseau",
    description: "Une structure de coordination, six pôles d'expertise et des rôles définis pour chaque mission.",
  },
  qualite: {
    title: "Qualité scientifique",
    description:
      "Cinq engagements vérifiables : rigueur méthodologique, traçabilité, transparence, confidentialité, reconnaissance.",
  },
  contact: {
    title: "Proposer un projet",
    description: "Décrivez votre problématique. Premier échange sans engagement, sans donnée sensible.",
  },
  references: {
    title: "Publications et cas d'usage",
    description:
      "Ce qui a été vérifié : publications, cas d'usage anonymisés et actualités du réseau.",
  },
  publications: {
    title: "Publications",
    description:
      "Travaux scientifiques, communications et rapports rendus publics avec l'accord des parties.",
  },
  casUsage: {
    title: "Cas d'usage",
    description:
      "Des situations réelles, décrites sans les nommer : la question posée, ce qui a été fait, et ce que cela ne prouve pas.",
  },
  actualites: {
    title: "Actualités",
    description: "Ce qui bouge dans le réseau : arrivées, missions en cours, prises de position.",
  },
  introuvable: {
    title: "Page introuvable",
    description: "La page demandée n'existe pas ou a été déplacée.",
  },
} as const;

/** Titres et descriptions anglais — miroir de `seo`. */
export const seoEn = {
  accueil: {
    title: "INTEGRA SCIENCE — Scientific expertise network",
    description:
      "A network bringing together biologists, bioinformaticians, physicians and data specialists around a single problem in the life sciences.",
  },
  vision: {
    title: "Our vision",
    description:
      "Why disciplines must work together from the framing stage: our reading of life science and health data.",
  },
  expertises: {
    title: "Six expertises",
    description:
      "Biology, bioinformatics, bio-imaging, medicine, pharmacology, statistics and AI: the network's skills.",
  },
  prestations: {
    title: "Services",
    description:
      "Omics data analysis, reproducible pipelines, methodological support, evaluation of AI results.",
  },
  methode: {
    title: "Our method",
    description:
      "Six steps, six written records: from receipt of the request to the documented handover.",
  },
  reseau: {
    title: "The network",
    description:
      "A coordination structure, six expertise pôles and roles defined for every mission.",
  },
  qualite: {
    title: "Scientific quality",
    description:
      "Five verifiable commitments: methodological rigour, traceability, transparency, confidentiality, recognition.",
  },
  references: {
    title: "Publications and case studies",
    description: "What has been verified: publications, anonymised case studies and network news.",
  },
  publications: {
    title: "Publications",
    description: "Scientific work, communications and reports made public with the agreement of the parties.",
  },
  casUsage: {
    title: "Case studies",
    description:
      "Real situations, described without naming them: the question asked, what was done, and what it does not prove.",
  },
  actualites: {
    title: "News",
    description: "What is moving in the network: arrivals, missions under way, positions taken.",
  },
  contact: {
    title: "Submit a project",
    description: "Describe your problem. A first exchange, no commitment, no sensitive data.",
  },
} as const;

/** Métadonnées standard : titre avec suffixe, description, canonique. */
export function pageMeta({
  title,
  description,
  path = "/",
  index = true,
  image,
}: {
  title: string;
  description: string;
  path?: string;
  index?: boolean;
  image?: string;
}): Metadata {
  const full = title === seo.accueil.title ? title : `${title} — INTEGRA SCIENCE`;
  return {
    title: full,
    description,
    alternates: {
      canonical: path,
      languages: {
        fr: path,
        en: enFor(path),
      },
    },
    openGraph: {
      title: full,
      description,
      url: `${baseUrl()}${path}`,
      siteName: "INTEGRA SCIENCE",
      locale: "fr_FR",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/**
 * Métadonnées d'une page anglaise : titre sans suffixe français,
 * alternates fr ↔ en exacts, canonical anglais.
 */
export function pageMetaEn({
  title,
  description,
  path,
  frPath,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  frPath: string;
  index?: boolean;
}): Metadata {
  const full = title === seoEn.accueil.title ? title : `${title} — INTEGRA SCIENCE`;
  return {
    title: full,
    description,
    alternates: {
      canonical: path,
      languages: { fr: frPath, en: path },
    },
    openGraph: {
      title: full,
      description,
      url: `${baseUrl()}${path}`,
      siteName: "INTEGRA SCIENCE",
      locale: "en_GB",
      type: "website",
    },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/** Miroir anglais d'une route française (best-effort, hors référentiel complet). */
function enFor(path: string): string {
  const map: Record<string, string> = {
    "/": "/en/",
    "/vision/": "/en/vision/",
    "/expertises/": "/en/expertise/",
    "/prestations/": "/en/services/",
    "/methode/": "/en/method/",
    "/reseau/": "/en/network/",
    "/qualite-scientifique/": "/en/scientific-quality/",
    "/references/": "/en/references/",
    "/cas-usage/": "/en/case-studies/",
    "/publications/": "/en/publications/",
    "/actualites/": "/en/news/",
    "/expertises/biologie/": "/en/expertise/biology/",
    "/expertises/bioinformatique/": "/en/expertise/bioinformatics/",
    "/expertises/bio-imagerie/": "/en/expertise/bio-imaging/",
    "/expertises/medecine-sante/": "/en/expertise/medicine-health/",
    "/expertises/pharmacologie/": "/en/expertise/pharmacology/",
    "/expertises/statistiques-ia/": "/en/expertise/statistics-ai/",
    "/contact/": "/en/contact/",
    "/contact/projet/": "/en/contact/project/",
    "/contact/candidature/": "/en/contact/application/",
    "/contact/partenariat/": "/en/contact/partnership/",
    "/newsletter/": "/en/newsletter/",
    "/mentions-legales/": "/en/legal/",
    "/confidentialite/": "/en/privacy/",
  };
  return map[path] ?? "/en/";
}

/* ------------------------------------------------------------------ */
/* JSON-LD (CONTEXT_MVP § 10.4)                                        */
/* ------------------------------------------------------------------ */

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Organization — sur toutes les pages. sameAs omis si aucun réseau renseigné. */
export function organizationLd(description?: string) {
  const sameAs = [siteParams.linkedin, siteParams.x_twitter, siteParams.orcid, siteParams.researchgate, siteParams.google_scholar].filter(
    Boolean,
  );
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "INTEGRA SCIENCE",
    ...(description ? { description } : {}),
    url: `${baseUrl()}/`,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Fil d'Ariane JSON-LD — jamais affiché à l'écran. */
export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl()}${item.path}`,
    })),
  };
}

/** Service — pages de pôle et de prestation. */
export function serviceLd(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: "INTEGRA SCIENCE" },
    areaServed: "Bénin",
  };
}

/** Attribution de citation : champ renseigné ou générique (jamais inventé). */
export function citationAttribution(): string {
  const name = citationName();
  const role = citationRole();
  return role ? `${name}, ${role}` : name;
}
