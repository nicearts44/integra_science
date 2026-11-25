import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Stockage fichier (CONTEXT_MVP § 8.6 — sauvegarde des soumissions).
 * Sur un hébergement serveless, pointer DATA_DIR sur un volume persistant
 * (Vercel Blob, disque monté) ; le comportement du site n'est pas modifié.
 */
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

function ensure(dir: string) {
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function saveSubmission(kind: string, record: Record<string, unknown>): string {
  const id = randomBytes(6).toString("hex");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const dir = ensure(path.join(DATA_DIR, "forms", kind));
  const file = path.join(dir, `${stamp}-${id}.json`);
  writeFileSync(file, JSON.stringify(record, null, 2), "utf8");
  return file;
}

export type Subscriber = {
  email: string;
  nom?: string;
  interets?: string;
  statut: "en_attente" | "confirme" | "desinscrit";
  token: string;
  date_inscription: string;
  date_confirmation?: string;
};

function subscribersFile(): string {
  return path.join(ensure(DATA_DIR), "newsletter.json");
}

export function readSubscribers(): Subscriber[] {
  const file = subscribersFile();
  if (!existsSync(file)) return [];
  try {
    return JSON.parse(readFileSync(file, "utf8")) as Subscriber[];
  } catch {
    return [];
  }
}

export function writeSubscribers(list: Subscriber[]) {
  writeFileSync(subscribersFile(), JSON.stringify(list, null, 2), "utf8");
}

export function findByToken(token: string): Subscriber | undefined {
  return readSubscribers().find((s) => s.token === token);
}

/* ------------------------------------------------------------------ */
/* Lecture pour le back-office                                        */
/* ------------------------------------------------------------------ */

export type SoumissionListee = {
  kind: string;
  fichier: string;
  date: string;
  donnees: Record<string, unknown>;
};

/** Toutes les soumissions enregistrées, de la plus récente à la plus ancienne. */
export function listerSoumissions(): SoumissionListee[] {
  const base = path.join(DATA_DIR, "forms");
  if (!existsSync(base)) return [];

  const sorties: SoumissionListee[] = [];
  for (const kind of readdirSync(base)) {
    const dossier = path.join(base, kind);
    if (!statSync(dossier).isDirectory()) continue;
    for (const fichier of readdirSync(dossier)) {
      if (!fichier.endsWith(".json")) continue;
      try {
        const donnees = JSON.parse(readFileSync(path.join(dossier, fichier), "utf8")) as Record<
          string,
          unknown
        >;
        const recu = donnees.recu_le ?? donnees.date ?? donnees.receivedAt;
        sorties.push({
          kind,
          fichier,
          date: typeof recu === "string" ? recu : fichier.slice(0, 19),
          donnees,
        });
      } catch {
        /* fichier illisible : ignoré, il n'empêche pas de lire les autres */
      }
    }
  }

  return sorties.sort((a, b) => b.fichier.localeCompare(a.fichier));
}
