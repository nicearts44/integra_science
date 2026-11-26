import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

import { baseConfiguree, getSql, preparerBase } from "./db";

/**
 * Stockage des échanges (messages des formulaires, abonnés de la newsletter).
 *
 * · `DATABASE_URL` renseignée → Postgres (Neon), les données survivent aux
 *   déploiements ;
 * · sinon → fichiers JSON locaux sous `data/`, pour le développement.
 */
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

function ensure(dir: string) {
  mkdirSync(dir, { recursive: true });
  return dir;
}

/* ------------------------------------------------------- messages */

export type SoumissionListee = {
  kind: string;
  fichier: string;
  date: string;
  donnees: Record<string, unknown>;
};

export async function saveSubmission(
  kind: string,
  record: Record<string, unknown>,
): Promise<string> {
  const id = randomBytes(6).toString("hex");

  if (baseConfiguree()) {
    await preparerBase();
    const sql = getSql();
    await sql`
      insert into contact_submissions (id, kind, donnees)
      values (${id}, ${kind}, ${JSON.stringify(record)}::jsonb)
    `;
    return id;
  }

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const dir = ensure(path.join(DATA_DIR, "forms", kind));
  const file = path.join(dir, `${stamp}-${id}.json`);
  writeFileSync(file, JSON.stringify(record, null, 2), "utf8");
  return file;
}

/** Toutes les soumissions enregistrées, de la plus récente à la plus ancienne. */
export async function listerSoumissions(): Promise<SoumissionListee[]> {
  if (baseConfiguree()) {
    await preparerBase();
    const sql = getSql();
    const lignes = (await sql`
      select id, kind, donnees, recu_le
      from contact_submissions
      order by recu_le desc
    `) as Array<{ id: string; kind: string; donnees: Record<string, unknown>; recu_le: unknown }>;

    return lignes.map((ligne) => ({
      kind: ligne.kind,
      fichier: ligne.id,
      date: iso(ligne.recu_le) ?? ligne.id,
      donnees: ligne.donnees ?? {},
    }));
  }

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

/* ----------------------------------------------------- newsletter */

export type Subscriber = {
  email: string;
  nom?: string;
  interets?: string;
  statut: "en_attente" | "confirme" | "desinscrit";
  token: string;
  date_inscription: string;
  date_confirmation?: string;
};

type LigneAbonne = {
  email: string;
  nom: string | null;
  interets: string | null;
  statut: string;
  token: string;
  date_inscription: unknown;
  date_confirmation: unknown;
};

/** Horodatage renvoyé par le pilote (Date ou chaîne) → ISO, ou undefined. */
function iso(valeur: unknown): string | undefined {
  if (!valeur) return undefined;
  if (valeur instanceof Date) return valeur.toISOString();
  const date = new Date(String(valeur));
  return Number.isNaN(date.getTime()) ? String(valeur) : date.toISOString();
}

function versAbonne(ligne: LigneAbonne): Subscriber {
  return {
    email: ligne.email,
    ...(ligne.nom ? { nom: ligne.nom } : {}),
    ...(ligne.interets ? { interets: ligne.interets } : {}),
    statut: (ligne.statut as Subscriber["statut"]) ?? "en_attente",
    token: ligne.token,
    date_inscription: iso(ligne.date_inscription) ?? new Date().toISOString(),
    ...(ligne.date_confirmation ? { date_confirmation: iso(ligne.date_confirmation) } : {}),
  };
}

function subscribersFile(): string {
  return path.join(ensure(DATA_DIR), "newsletter.json");
}

export async function readSubscribers(): Promise<Subscriber[]> {
  if (baseConfiguree()) {
    await preparerBase();
    const sql = getSql();
    const lignes = (await sql`
      select email, nom, interets, statut, token, date_inscription, date_confirmation
      from newsletter_subscribers
      order by date_inscription desc
    `) as LigneAbonne[];
    return lignes.map(versAbonne);
  }

  const file = subscribersFile();
  if (!existsSync(file)) return [];
  try {
    return JSON.parse(readFileSync(file, "utf8")) as Subscriber[];
  } catch {
    return [];
  }
}

/** Inscription ou réinscription : conserve la date d'inscription d'origine. */
export async function enregistrerAbonne(abonne: Subscriber): Promise<void> {
  if (baseConfiguree()) {
    await preparerBase();
    const sql = getSql();
    await sql`
      insert into newsletter_subscribers (email, nom, interets, statut, token, date_inscription, date_confirmation)
      values (
        ${abonne.email},
        ${abonne.nom ?? null},
        ${abonne.interets ?? null},
        ${abonne.statut},
        ${abonne.token},
        ${abonne.date_inscription}::timestamptz,
        ${abonne.date_confirmation ?? null}::timestamptz
      )
      on conflict (email) do update set
        nom = excluded.nom,
        interets = excluded.interets,
        statut = excluded.statut,
        token = excluded.token,
        date_confirmation = excluded.date_confirmation
    `;
    return;
  }

  const liste = await readSubscribers();
  const existant = liste.find((s) => s.email === abonne.email);
  const suivante = existant
    ? liste.map((s) =>
        s.email === abonne.email ? { ...abonne, date_inscription: s.date_inscription } : s,
      )
    : [...liste, abonne];
  writeFileSync(subscribersFile(), JSON.stringify(suivante, null, 2), "utf8");
}

export async function majStatutAbonne(
  token: string,
  statut: Subscriber["statut"],
  dateConfirmation?: string,
): Promise<boolean> {
  if (baseConfiguree()) {
    await preparerBase();
    const sql = getSql();
    const lignes = (await sql`
      update newsletter_subscribers
      set statut = ${statut},
          date_confirmation = ${dateConfirmation ?? null}::timestamptz
      where token = ${token}
      returning email
    `) as Array<{ email: string }>;
    return lignes.length > 0;
  }

  const liste = await readSubscribers();
  const trouve = liste.some((s) => s.token === token);
  if (!trouve) return false;
  const suivante = liste.map((s) =>
    s.token === token
      ? {
          ...s,
          statut,
          ...(dateConfirmation ? { date_confirmation: dateConfirmation } : {}),
        }
      : s,
  );
  writeFileSync(subscribersFile(), JSON.stringify(suivante, null, 2), "utf8");
  return true;
}

export async function findByToken(token: string): Promise<Subscriber | undefined> {
  if (baseConfiguree()) {
    await preparerBase();
    const sql = getSql();
    const lignes = (await sql`
      select email, nom, interets, statut, token, date_inscription, date_confirmation
      from newsletter_subscribers
      where token = ${token}
      limit 1
    `) as LigneAbonne[];
    return lignes[0] ? versAbonne(lignes[0]) : undefined;
  }

  return (await readSubscribers()).find((s) => s.token === token);
}

export async function trouverParEmail(email: string): Promise<Subscriber | undefined> {
  if (baseConfiguree()) {
    await preparerBase();
    const sql = getSql();
    const lignes = (await sql`
      select email, nom, interets, statut, token, date_inscription, date_confirmation
      from newsletter_subscribers
      where email = ${email}
      limit 1
    `) as LigneAbonne[];
    return lignes[0] ? versAbonne(lignes[0]) : undefined;
  }

  return (await readSubscribers()).find((s) => s.email === email);
}
