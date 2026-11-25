import type { Metadata } from "next";

import { LocaleShell } from "@/app/layout";
import { getParametresSanity, pick } from "@/lib/sanity/queries";
import { baseUrl } from "@/lib/content/site";

/**
 * Métadonnées de la branche française.
 *
 * Elles ne sont plus figées dans le layout : elles passent par
 * `generateMetadata`, seul moyen de laisser le CMS (document `parametresSite`)
 * reprendre la main sur le nom, l'accroche et l'URL canonique.
 * Sans Sanity, on retombe exactement sur les valeurs ci-dessous.
 */
const frMetadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: "INTEGRA SCIENCE — Réseau d'expertise scientifique",
    template: "%s",
  },
  description:
    "Un réseau d'expertise scientifique au service du vivant et de la santé : biologie, bioinformatique, bio-imagerie, médecine et santé, pharmacologie, statistiques et IA.",
  openGraph: {
    siteName: "INTEGRA SCIENCE",
    locale: "fr_FR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export async function generateMetadata(): Promise<Metadata> {
  const p = await getParametresSanity();
  if (!p) return frMetadata;

  return {
    ...frMetadata,
    ...(p.urlSite ? { metadataBase: new URL(p.urlSite) } : {}),
    ...(pick(p.accroche, "fr") ? { description: pick(p.accroche, "fr") } : {}),
    openGraph: {
      ...frMetadata.openGraph,
      ...(pick(p.nom, "fr") ? { siteName: pick(p.nom, "fr") } : {}),
    },
  };
}

/**
 * Branche française — toutes les pages hors /en/.
 * Le <html lang="fr">, l'en-tête et le pied de page sont montés ici.
 */
export default function FrLayout({ children }: { children: React.ReactNode }) {
  return <LocaleShell locale="fr">{children}</LocaleShell>;
}
