import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocaleShell } from "@/app/layout";
import { getParametresSanity, pick } from "@/lib/sanity/queries";
import { siteParams } from "@/lib/content/site";

const enMetadata: Metadata = {
  metadataBase: new URL(siteParams.url_site || "http://localhost:3000"),
  title: {
    default: "INTEGRA SCIENCE — Scientific expertise network",
    template: "%s",
  },
  description:
    "A network bringing together biologists, bioinformaticians, physicians and data specialists around a single problem in the life sciences.",
  openGraph: {
    siteName: "INTEGRA SCIENCE",
    locale: "en_GB",
    type: "website",
  },
  robots: { index: true, follow: true },
};

/**
 * Branche anglaise — /en/… uniquement.
 * Les routes françaises vivent dans app/(fr)/ ; le layout racine reste neutre
 * afin que les deux branches puissent monter leur propre <html lang>.
 *
 * Un layout dynamique ([locale]) ne peut pas vivre à côté d'un layout racine
 * qui rend <html> : il faut donc générer explicitement /en pour chaque locale
 * supportée (voir generateStaticParams + dynamicParams = false).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

/** Les paramètres du CMS passent devant le contenu local, quand ils existent. */
export async function generateMetadata(): Promise<Metadata> {
  const p = await getParametresSanity();
  if (!p) return enMetadata;

  return {
    ...enMetadata,
    ...(p.urlSite ? { metadataBase: new URL(p.urlSite) } : {}),
    ...(pick(p.accroche, "en") ? { description: pick(p.accroche, "en") } : {}),
    openGraph: {
      ...enMetadata.openGraph,
      ...(pick(p.nom, "en") ? { siteName: pick(p.nom, "en") } : {}),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <LocaleShell locale="en">{children}</LocaleShell>;
}
