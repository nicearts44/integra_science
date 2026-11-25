import type { MetadataRoute } from "next";

import { poles } from "@/lib/content/poles";
import { urlSlug } from "@/lib/content/en/poles";
import { baseUrl } from "@/lib/content/site";
import { frToEn } from "@/lib/i18n";

/**
 * Sitemap — CONTEXT_MVP § 10.3.
 * Les pages de référence sont incluses même vides : elles existent et
 * répondent. Les contenus non vérifiés ou non anonymisés ne le sont pas,
 * puisqu'ils ne sont pas publiés.
 *
 * Chaque URL déclare ses alternatives fr / en (hreflang) : Google ne déduit
 * pas les paires tout seul, et un miroir non déclaré se fait dédoublonner.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl();
  const now = new Date();

  const pages: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/vision/", priority: 0.8, changeFrequency: "yearly" },
    { path: "/expertises/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/prestations/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/methode/", priority: 0.8, changeFrequency: "yearly" },
    { path: "/reseau/", priority: 0.7, changeFrequency: "monthly" },
    { path: "/qualite-scientifique/", priority: 0.7, changeFrequency: "yearly" },
    { path: "/references/", priority: 0.8, changeFrequency: "weekly" },
    { path: "/publications/", priority: 0.6, changeFrequency: "weekly" },
    { path: "/cas-usage/", priority: 0.6, changeFrequency: "weekly" },
    { path: "/actualites/", priority: 0.6, changeFrequency: "weekly" },
    { path: "/contact/", priority: 0.7, changeFrequency: "yearly" },
    { path: "/contact/projet/", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact/candidature/", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact/partenariat/", priority: 0.5, changeFrequency: "yearly" },
    { path: "/newsletter/", priority: 0.4, changeFrequency: "yearly" },
    { path: "/mentions-legales/", priority: 0.2, changeFrequency: "yearly" },
    { path: "/confidentialite/", priority: 0.2, changeFrequency: "yearly" },
  ];

  const polePaths = poles.map((p) => `/expertises/${p.slug}/`);

  const all = [...pages.map((p) => p.path), ...polePaths];

  /** Paire d'URL fr / en pour une route française. */
  const pair = (frPath: string) => {
    const enPath = frToEn[frPath] ?? null;
    const languages: Record<string, string> = { fr: `${base}${frPath}` };
    if (enPath) languages.en = `${base}${enPath}`;
    return { languages };
  };

  const priorityOf = (path: string) =>
    pages.find((p) => p.path === path)?.priority ?? 0.7;
  const freqOf = (path: string) =>
    pages.find((p) => p.path === path)?.changeFrequency ?? ("yearly" as const);

  return all.map((frPath) => {
    const enPath = frToEn[frPath];
    return {
      url: `${base}${frPath}`,
      lastModified: now,
      changeFrequency: freqOf(frPath),
      priority: priorityOf(frPath),
      alternates: pair(frPath),
    };
  }).concat(
    // Les URL anglaises déclarent aussi la paire inverse.
    all
      .filter((frPath) => Boolean(frToEn[frPath]))
      .map((frPath) => {
        const enPath = frToEn[frPath]!;
        return {
          url: `${base}${enPath}`,
          lastModified: now,
          changeFrequency: freqOf(frPath),
          priority: priorityOf(frPath),
          alternates: pair(frPath),
        };
      }),
  );
}

/** Réexport utilitaire pour les tests de routes. */
export const enPolePaths = poles.map((p) => `/en/expertise/${urlSlug(p.slug)}/`);
