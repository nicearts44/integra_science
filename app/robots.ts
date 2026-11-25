import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/content/site";

/**
 * robots.txt — CONTEXT_MVP § 10.6.
 * Tant que `NEXT_PUBLIC_SITE_URL` n'est pas renseignée, le site n'est pas
 * en production : tout est interdit aux robots. C'est aussi la protection
 * contre l'indexation d'un environnement de préproduction.
 */
export default function robots(): MetadataRoute.Robots {
  const base = baseUrl();
  const enLigne = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

  if (!enLigne) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/newsletter/confirmer", "/newsletter/desinscription"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
