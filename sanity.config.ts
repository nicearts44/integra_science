import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemas";

/**
 * Studio Sanity embarqué (CONTEXT_MVP.md § 3bis.2).
 *
 * ATTENTION : ce fichier est embarqué dans le bundle du navigateur. Next.js
 * n'y remplace que les variables préfixées NEXT_PUBLIC_* ; les noms
 * SANITY_STUDIO_* y valent `undefined` (c'est ce qui provoquait
 * « Invalid project id »). On lit donc d'abord NEXT_PUBLIC_SANITY_*, puis
 * l'alias SANITY_STUDIO_* (utile à la CLI Sanity et aux scripts serveur).
 *
 * L'identifiant de projet et le jeu de données sont publics : ce ne sont pas
 * des secrets. Le token de lecture, lui, reste côté serveur (lib/sanity/client.ts).
 *
 * Tant qu'aucun identifiant n'est fourni, /studio affiche une page d'attente au
 * lieu du Studio (voir app/studio/[[...tool]]/page.tsx) : le site fonctionne
 * sur lib/content/*.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID ?? "";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? "production";
export const apiVersion = "2025-01-01";

const SINGLETONS = ["parametresSite"];

export default defineConfig({
  name: "integra-science",
  title: "INTEGRA SCIENCE",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    // Un nom explicite par type évite les collisions internes du schéma.
    types: schemaTypes.map((type) => ({ ...type, name: type.name })),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenu du site")
          .items([
            S.listItem()
              .title("Paramètres du site")
              .id("parametresSite")
              .child(S.document().schemaType("parametresSite").documentId("parametresSite")),
            S.divider(),
            S.listItem()
              .title("Pages")
              .child(S.documentTypeList("page").title("Pages")),
            S.listItem()
              .title("Pôles d'expertise")
              .child(
                S.documentTypeList("pole")
                  .title("Pôles d'expertise")
                  .defaultOrdering([{ field: "numero", direction: "asc" }]),
              ),
            S.listItem()
              .title("Prestations")
              .child(S.documentTypeList("prestation").title("Prestations")),
            S.listItem()
              .title("Membres du réseau")
              .child(S.documentTypeList("membre").title("Membres du réseau")),
            S.divider(),
            S.listItem()
              .title("Publications")
              .child(S.documentTypeList("publication").title("Publications")),
            S.listItem()
              .title("Cas d'usage")
              .child(S.documentTypeList("casUsage").title("Cas d'usage")),
            S.listItem()
              .title("Actualités")
              .child(
                S.documentTypeList("actualite")
                  .title("Actualités")
                  .defaultOrdering([{ field: "date", direction: "desc" }]),
              ),
            S.divider(),
            S.listItem()
              .title("Abonnés newsletter")
              .child(S.documentTypeList("abonne").title("Abonnés newsletter")),
            // On masque les singletons de la liste automatique
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETONS.includes(item.getId() as string),
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
