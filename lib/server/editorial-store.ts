/* ===================================================================
   STOCKAGE DES FICHIERS DU BACK-OFFICE
   -------------------------------------------------------------------
   Deux modes, un seul contrat :

   · local  — écrit `content/<fichier>.json` sur le disque (développement) ;
   · GitHub — lit et écrit le même fichier dans le dépôt via l'API
     Contents. Un enregistrement = un commit = un redéploiement Vercel.

   Le site public, lui, ne lit jamais ce module : il importe les JSON
   directement (lib/content/editorial.ts). Le contenu affiché est donc
   toujours une version construite, jamais un fichier en cours d'écriture.

   Le même mécanisme sert au contenu éditorial (`content/*.json`) et aux
   comptes du back-office (`content/comptes.json`).
   =================================================================== */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { DocName } from "@/lib/admin/schema";

import publicationsJson from "@/content/publications.json";
import casUsageJson from "@/content/cas-usage.json";
import actualitesJson from "@/content/actualites.json";
import reseauJson from "@/content/reseau.json";
import reglagesJson from "@/content/reglages.json";

export type DocContenu = Record<string, unknown>;

const FICHIERS: Record<DocName, string> = {
  publications: "publications.json",
  "cas-usage": "cas-usage.json",
  actualites: "actualites.json",
  reseau: "reseau.json",
  reglages: "reglages.json",
};

/** Version embarquée dans le build : dernier recours en lecture. */
const EMBARQUE: Record<DocName, DocContenu> = {
  publications: publicationsJson as unknown as DocContenu,
  "cas-usage": casUsageJson as unknown as DocContenu,
  actualites: actualitesJson as unknown as DocContenu,
  reseau: reseauJson as unknown as DocContenu,
  reglages: reglagesJson as unknown as DocContenu,
};

export type ModeEcriture = "local" | "github" | "lecture-seule";

export function repoGithub(): string {
  return process.env.ADMIN_GITHUB_REPO || "nicearts44/integra_science";
}

function brancheGithub(): string {
  return process.env.ADMIN_GITHUB_BRANCH || "main";
}

function jetonGithub(): string {
  return process.env.ADMIN_GITHUB_TOKEN || "";
}

function deposeGithub(): boolean {
  return Boolean(jetonGithub());
}

function peutEcrireLocalement(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.ADMIN_LOCAL_WRITE === "true";
}

export function modeEcriture(): ModeEcriture {
  if (deposeGithub()) return "github";
  if (peutEcrireLocalement()) return "local";
  return "lecture-seule";
}

export function cheminLocal(nom: string): string {
  return path.join(process.cwd(), "content", nom);
}

/* ------------------------------------------------------------- lecture */

/**
 * Lit un fichier JSON du dossier `content/`. `defaut` est renvoyé quand le
 * fichier n'existe pas encore (premier démarrage, compte initial, etc.).
 */
export async function lireFichierJson<T>(nom: string, defaut: T): Promise<T> {
  if (modeEcriture() === "github") {
    try {
      return await lireGithub<T>(nom);
    } catch (err) {
      if ((err as { code?: number }).code === 404) return defaut;
      console.error(`[admin] lecture GitHub impossible pour ${nom}`, err);
      return defaut;
    }
  }

  const chemin = cheminLocal(nom);
  if (existsSync(chemin)) {
    try {
      return JSON.parse(readFileSync(chemin, "utf8")) as T;
    } catch (err) {
      console.error(`[admin] lecture locale impossible pour ${nom}`, err);
    }
  }
  return defaut;
}

async function lireGithub<T>(nom: string): Promise<T> {
  const url = `https://api.github.com/repos/${repoGithub()}/contents/content/${nom}?ref=${encodeURIComponent(brancheGithub())}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jetonGithub()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (res.status === 404) throw Object.assign(new Error("Fichier absent"), { code: 404 });
  if (!res.ok) throw new Error(`GitHub ${res.status} à la lecture`);
  const data = (await res.json()) as { content?: string };
  if (!data.content) throw new Error("Réponse GitHub sans contenu");
  const texte = Buffer.from(data.content, "base64").toString("utf8");
  return JSON.parse(texte) as T;
}

/* ------------------------------------------------------------ écriture */

export type ResultatEcriture = {
  mode: ModeEcriture;
  message: string;
  commit?: string;
};

export async function ecrireFichierJson(
  nom: string,
  contenu: unknown,
  message: string,
): Promise<ResultatEcriture> {
  const json = `${JSON.stringify(contenu, null, 2)}\n`;
  const mode = modeEcriture();

  if (mode === "github") {
    const sha = await shaGithub(nom);
    const url = `https://api.github.com/repos/${repoGithub()}/contents/content/${nom}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jetonGithub()}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        message: `${message}\n\nDepuis le back-office INTEGRA SCIENCE.`,
        content: Buffer.from(json, "utf8").toString("base64"),
        branch: brancheGithub(),
        ...(sha ? { sha } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`GitHub ${res.status} à l'écriture — ${detail.slice(0, 300)}`);
    }
    const data = (await res.json()) as { commit?: { sha?: string } };
    return {
      mode,
      message: "Enregistré dans le dépôt : le site sera reconstruit par Vercel.",
      commit: data.commit?.sha,
    };
  }

  if (mode === "local") {
    writeFileSync(cheminLocal(nom), json, "utf8");
    return { mode, message: "Enregistré sur le disque local (content/)." };
  }

  throw new Error(
    "Écriture impossible : définissez ADMIN_GITHUB_TOKEN sur l'hébergement, ou activez ADMIN_LOCAL_WRITE.",
  );
}

async function shaGithub(nom: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${repoGithub()}/contents/content/${nom}?ref=${encodeURIComponent(brancheGithub())}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jetonGithub()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${res.status} à la lecture du SHA`);
  const data = (await res.json()) as { sha?: string };
  return data.sha ?? null;
}

/* --------------------------------------------------- contenu éditorial */

export async function lireDoc(doc: DocName): Promise<DocContenu> {
  return lireFichierJson<DocContenu>(FICHIERS[doc], EMBARQUE[doc]);
}

export async function ecrireDoc(
  doc: DocName,
  contenu: DocContenu,
  message: string,
): Promise<ResultatEcriture> {
  return ecrireFichierJson(FICHIERS[doc], contenu, message);
}

/* ------------------------------------------------------------ contrôle */

/**
 * Validation minimale mais réelle : on refuse un document qui n'a pas la
 * bonne forme, plutôt que d'écrire un fichier que le site ne saurait pas lire.
 */
export function validerDoc(doc: DocName, contenu: unknown): string | null {
  if (!contenu || typeof contenu !== "object" || Array.isArray(contenu)) {
    return "Le document doit être un objet JSON.";
  }

  if (doc === "reglages") {
    for (const [cle, valeur] of Object.entries(contenu as Record<string, unknown>)) {
      if (typeof valeur !== "string") return `La valeur « ${cle} » doit être une chaîne.`;
    }
    return null;
  }

  const objet = contenu as Record<string, unknown>;
  const cles = doc === "reseau" ? ["membres", "roles", "engagements"] : ["items"];

  for (const cle of cles) {
    const liste = objet[cle];
    if (liste === undefined) continue;
    if (!Array.isArray(liste)) return `« ${cle} » doit être une liste.`;
    for (const item of liste) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return `Chaque entrée de « ${cle} » doit être un objet.`;
      }
      const entree = item as Record<string, unknown>;
      if (typeof entree.id !== "string" || !entree.id) {
        return `Une entrée de « ${cle} » n'a pas d'identifiant.`;
      }
    }
  }
  return null;
}
