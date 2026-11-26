/* ===================================================================
   POSTGRES (NEON)
   -------------------------------------------------------------------
   Un seul point d'entrée pour la base : le pilote HTTP
   `@neondatabase/serverless`, adapté aux fonctions serverless (Vercel)
   — pas de pool de connexions à maintenir entre deux requêtes.

   Sans `DATABASE_URL`, `baseConfiguree()` vaut false et les appelants
   retombent sur le stockage fichier local (développement).
   =================================================================== */

import { neon } from "@neondatabase/serverless";

type ClientSql = ReturnType<typeof neon>;

let client: ClientSql | null = null;
let preparation: Promise<void> | null = null;

export function baseConfiguree(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql(): ClientSql {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL absente : la base n'est pas configurée.");
    client = neon(url);
  }
  return client;
}

/**
 * Crée les tables au premier usage. `IF NOT EXISTS` rend l'opération
 * inoffensive quand plusieurs instances démarrent en même temps.
 */
export function preparerBase(): Promise<void> {
  if (!preparation) {
    preparation = (async () => {
      const sql = getSql();
      await sql`
        create table if not exists contact_submissions (
          id text primary key,
          kind text not null,
          donnees jsonb not null,
          recu_le timestamptz not null default now()
        )
      `;
      await sql`
        create index if not exists contact_submissions_recu_le_idx
          on contact_submissions (recu_le desc)
      `;
      await sql`
        create table if not exists newsletter_subscribers (
          email text primary key,
          nom text,
          interets text,
          statut text not null default 'en_attente',
          token text not null unique,
          date_inscription timestamptz not null default now(),
          date_confirmation timestamptz
        )
      `;
    })().catch((err) => {
      // Un échec ne doit pas condamner l'instance : la prochaine requête réessaie.
      preparation = null;
      throw err;
    });
  }
  return preparation;
}
