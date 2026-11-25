#!/usr/bin/env node
/* ===================================================================
   Lanceur de scripts/import-sanity.ts.

   Le script d'import est écrit en TypeScript et utilise l'alias `@/…`
   du projet : Node ne sait pas le charger tel quel. esbuild est déjà
   installé (dépendance de Sanity), il bundle le fichier en un module ESM
   temporaire, puis on l'exécute. Aucune dépendance supplémentaire.

     npm run sanity:import -- --dry-run
     npm run sanity:import
   =================================================================== */

import { build } from "esbuild";
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* Variables d'environnement du projet (Node ≥ 20.12). */
const envFile = path.join(root, ".env.local");
if (existsSync(envFile) && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(envFile);
}

function isFile(candidate) {
  try {
    return statSync(candidate).isFile();
  } catch {
    return false;
  }
}

/** Résout `@/lib/...` vers la racine du projet, extensions comprises. */
const aliasAt = {
  name: "alias-at",
  setup(build_) {
    build_.onResolve({ filter: /^@\// }, (args) => {
      const base = path.join(root, args.path.slice(2));
      for (const suffix of ["", ".ts", ".tsx", ".js", ".mjs", "/index.ts", "/index.tsx"]) {
        const candidate = base + suffix;
        if (isFile(candidate)) return { path: candidate };
      }
      return { path: base };
    });
  },
};

const outdir = path.join(root, ".sanity-import");
mkdirSync(outdir, { recursive: true });
const outfile = path.join(outdir, "import.mjs");

await build({
  entryPoints: [path.join(root, "scripts/import-sanity.ts")],
  outfile,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  /* Seul notre code est bundlé : les paquets restent résolus depuis
     node_modules au moment de l'exécution. Sans cela, esbuild embarque les
     dépendances CommonJS de Sanity dans un module ESM et casse leur
     `require` interne (« Dynamic require of "stream" is not supported »). */
  packages: "external",
  plugins: [aliasAt],
  logLevel: "warning",
});

await import(pathToFileURL(outfile).href);
