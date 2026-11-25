import "server-only";

import { createClient, type SanityClient } from "next-sanity";

/**
 * Client Sanity côté serveur (lecture seule).
 *
 * Rien ici n'est obligatoire au fonctionnement du site : sans variables
 * d'environnement, `sanityClient` vaut `null` et toutes les pages retombent
 * sur les modules typés `lib/content/*`. C'est ce qui permet de livrer le site
 * avant même que le projet Sanity soit créé.
 */
export const projectId = process.env.SANITY_PROJECT_ID ?? "";
export const dataset = process.env.SANITY_DATASET ?? "production";
export const apiVersion = "2025-01-01";

const token = process.env.SANITY_READ_TOKEN ?? "";

export const isSanityConfigured = Boolean(projectId);

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Les pages sont statiques : on lit au build, pas à chaque requête.
      useCdn: false,
      token: token || undefined,
      perspective: "published",
    })
  : null;

/**
 * Deuxième barrière des publication gates.
 *
 * La première est éditoriale (les cases `verifie` / `anonymise` du Studio).
 * Celle-ci est dans le code : quoi qu'il arrive dans le dataset, un document
 * non vérifié ou non anonymisé ne sort jamais du client. Une requête GROQ
 * mal écrite ne peut donc pas publier du contenu non validé.
 */
export function estPubliable(doc: {
  verifie?: boolean;
  anonymise?: boolean;
}): boolean {
  return doc.verifie === true && doc.anonymise === true;
}

/** Filtre une liste de documents sur les deux gates. */
export function publies<T extends { verifie?: boolean; anonymise?: boolean }>(docs: T[]): T[] {
  return docs.filter(estPubliable);
}

/**
 * Exécute une requête GROQ, en renvoyant `null` en cas d'absence de
 * configuration ou d'erreur réseau : l'appelant décide du repli.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    console.error("[sanity] requête échouée, repli sur le contenu local", error);
    return null;
  }
}
