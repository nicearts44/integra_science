/* ===================================================================
   Import initial du contenu local vers Sanity — GUIDE.md § 5.7.

   Lit les 6 pôles et les 4 prestations dans les modules de contenu
   (`lib/content/poles.ts` + `lib/content/en/poles.ts`, idem prestations)
   et les écrit dans le dataset avec des `_id` fixes :

     pole-biologie, prestation-analyse-omiques, …

   Le script est idempotent : `createOrReplace` écrase le document existant
   au lieu d'en créer un doublon. On peut donc le relancer après chaque
   correction de texte.

   Exécution (voir scripts/import-sanity.mjs, qui bundle ce fichier) :

     npm run sanity:import -- --dry-run   # affiche les documents, n'écrit rien
     npm run sanity:import                # écrit dans le dataset
   =================================================================== */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { createClient } from "@sanity/client";

import { poles as polesFr } from "@/lib/content/poles";
import { polesEn } from "@/lib/content/en/poles";
import { prestations as prestationsFr } from "@/lib/content/prestations";
import { prestationsEn } from "@/lib/content/en/prestations";

type Doc = Record<string, unknown> & { _id: string; _type: string };

/** Entrée d'une liste bilingue (`bilingueList()` dans le schéma). */
type Entree = { _key: string; _type: string; fr: string; en: string };

/* ------------------------------------------------------------- outils */

/** Texte français + traduction anglaise → valeur bilingue du schéma. */
function bil(fr: string | undefined, en: string | undefined): { fr: string; en: string } | undefined {
  const valeur = { fr: fr ?? "", en: en ?? "" };
  return valeur.fr || valeur.en ? valeur : undefined;
}

/**
 * Liste bilingue → tableau d'entrées Sanity.
 * `type` doit correspondre au type d'objet déclaré par `bilingueList()`
 * dans `sanity/schemas/index.ts` (`entree_capacites`, `entree_profils`…).
 * Les deux listes sont parallèles : la traduction est à la même position.
 */
function liste(fr: string[] | undefined, en: string[] | undefined, type: string): Entree[] {
  return (fr ?? []).map((texte, index) => ({
    _key: `e${index}`,
    _type: type,
    fr: texte,
    en: en?.[index] ?? "",
  }));
}

/* --------------------------------------------------------- documents */

function poleDoc(pole: (typeof polesFr)[number], en: (typeof polesEn)[number] | undefined, index: number): Doc {
  return {
    _id: `pole-${pole.key}`,
    _type: "pole",
    numero: pole.num,
    slug: { _type: "slug", current: pole.slug },
    titre: bil(pole.title, en?.title),
    resume: bil(pole.resume, en?.resume),
    couverture: bil(pole.couverture, en?.couverture),
    couvertureDetail: bil(pole.couvertureDetail, en?.couvertureDetail),
    capacites: liste(pole.capacites, en?.capacites, "entree_capacites"),
    profils: liste(pole.profils, en?.profils, "entree_profils"),
    mentionPerimetre: bil(pole.mentionPerimetre, en?.mentionPerimetre),
    /* `polesLies` reste technique : ce sont des clés de pôle, pas du texte. */
    polesLies: pole.polesLies,
    chapeau: bil(pole.chapeau, en?.chapeau),
    icone: pole.icon,
    ordre: (index + 1) * 10,
  };
}

function prestationDoc(
  prestation: (typeof prestationsFr)[number],
  en: (typeof prestationsEn)[number] | undefined,
  index: number,
): Doc {
  return {
    _id: `prestation-${prestation.key}`,
    _type: "prestation",
    titre: bil(prestation.title, en?.title),
    slug: { _type: "slug", current: prestation.slug },
    resume: bil(prestation.resume, en?.resume),
    chapeau: bil(prestation.chapeau, en?.chapeau),
    situation: bil(prestation.situation, en?.situation),
    actions: liste(prestation.actions, en?.actions, "entree_actions"),
    livrables: liste(prestation.livrables, en?.livrables, "entree_livrables"),
    livrableCourt: bil(prestation.livrableCourt, en?.livrableCourt),
    conditions: bil(prestation.conditions, en?.conditions),
    profils: liste(prestation.profils, en?.profils, "entree_profils"),
    icone: prestation.icon,
    ordre: (index + 1) * 10,
  };
}

/** Les dix documents, prêts pour `createOrReplace`. */
export function buildDocs(): Doc[] {
  const polesIndex = new Map(polesEn.map((pole) => [pole.key, pole]));
  const prestationsIndex = new Map(prestationsEn.map((prestation) => [prestation.key, prestation]));

  return [
    ...polesFr.map((pole, index) => poleDoc(pole, polesIndex.get(pole.key), index)),
    ...prestationsFr.map((prestation, index) =>
      prestationDoc(prestation, prestationsIndex.get(prestation.key), index),
    ),
  ];
}

/* -------------------------------------------------------------- main */

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const ndjson = process.argv.includes("--ndjson");

  const projectId =
    process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
  const dataset = process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  /* L'écriture exige un token « editor » : un token de lecture seule est
     refusé par Sanity (403). */
  const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_READ_TOKEN ?? "";

  if (!projectId) {
    throw new Error("SANITY_PROJECT_ID manquant : renseignez .env.local (voir .env.example).");
  }

  const docs = buildDocs();
  console.log(
    `${docs.length} documents à importer :\n${docs.map((doc) => `  · ${doc._id}`).join("\n")}`,
  );

  if (dryRun) {
    console.log("\n--dry-run : rien n'a été écrit. Documents :\n");
    console.log(JSON.stringify(docs, null, 2));
    return;
  }

  /* Alternative sans token : le CLI Sanity, une fois connecté
     (`npx sanity login`), importe ce fichier avec ses propres droits. */
  if (ndjson) {
    const outdir = path.join(process.cwd(), ".sanity-import");
    mkdirSync(outdir, { recursive: true });
    const file = path.join(outdir, "import.ndjson");
    writeFileSync(file, docs.map((doc) => JSON.stringify(doc)).join("\n") + "\n", "utf8");
    console.log(
      `\n✓ ${docs.length} documents écrits dans ${path.relative(process.cwd(), file)}\n` +
        `  importer avec : npx sanity dataset import .sanity-import/import.ndjson production`,
    );
    return;
  }

  if (!token) {
    throw new Error(
      "SANITY_WRITE_TOKEN (ou SANITY_READ_TOKEN) manquant : l'import écrit dans le dataset.",
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    useCdn: false,
    token,
  });

  const transaction = docs.reduce(
    (tx, doc) => tx.createOrReplace(doc as never),
    client.transaction(),
  );

  const result = await transaction.commit({ visibility: "sync" });
  console.log(
    `\n✓ ${docs.length} documents écrits dans ${projectId}/${dataset} — transaction ${result.transactionId}`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`✗ import interrompu : ${message}`);
  process.exitCode = 1;
});
