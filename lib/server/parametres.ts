/* ===================================================================
   RÉGLAGES SERVEUR (secrets d'intégration)
   -------------------------------------------------------------------
   Ce qui ne doit JAMAIS atterrir dans `content/*.json` (versionné dans
   le dépôt) ni dans le navigateur : la clé API Brevo et l'expéditeur.

   Stockage : table `app_settings` dans Postgres (Neon). En local sans
   base configurée, repli sur les variables d'environnement historiques.
   =================================================================== */

import { baseConfiguree, getSql, preparerBase } from "./db";

export type ParametresEmail = {
  cle_api: string;
  expediteur_email: string;
  expediteur_nom: string;
  destinataire: string;
};

const DEFAUT: ParametresEmail = {
  cle_api: "",
  expediteur_email: "",
  expediteur_nom: "INTEGRA SCIENCE",
  destinataire: "",
};

const PREFIXE = "email.";
const TTL_MS = 5000;

let cache: { valeur: ParametresEmail; expire: number } | null = null;
let table: Promise<void> | null = null;

function preparerTable(): Promise<void> {
  if (!table) {
    table = (async () => {
      await preparerBase();
      const sql = getSql();
      await sql`
        create table if not exists app_settings (
          cle text primary key,
          valeur text not null,
          maj timestamptz not null default now()
        )
      `;
    })().catch((err) => {
      table = null;
      throw err;
    });
  }
  return table;
}

function depuisEnv(): ParametresEmail {
  return {
    cle_api: process.env.BREVO_API_KEY ?? "",
    expediteur_email: process.env.BREVO_FROM_EMAIL ?? process.env.EXPEDITEUR_EMAIL ?? "",
    expediteur_nom: process.env.BREVO_FROM_NAME ?? "INTEGRA SCIENCE",
    destinataire: process.env.CONTACT_DESTINATAIRE ?? "",
  };
}

export async function lireParametresEmail(): Promise<ParametresEmail> {
  if (cache && cache.expire > Date.now()) return cache.valeur;

  let valeur: ParametresEmail;

  if (baseConfiguree()) {
    try {
      await preparerTable();
      const sql = getSql();
      const lignes = (await sql`
        select cle, valeur from app_settings where cle like ${`${PREFIXE}%`}
      `) as Array<{ cle: string; valeur: string }>;

      valeur = { ...DEFAUT };
      for (const ligne of lignes) {
        const cle = ligne.cle.slice(PREFIXE.length) as keyof ParametresEmail;
        if (cle in valeur) valeur[cle] = ligne.valeur;
      }
    } catch (err) {
      console.error("[parametres] lecture impossible, repli sur l'environnement", err);
      valeur = depuisEnv();
    }
  } else {
    valeur = depuisEnv();
  }

  cache = { valeur, expire: Date.now() + TTL_MS };
  return valeur;
}

/** Écrit les clés fournies ; une chaîne vide efface la valeur. */
export async function ecrireParametresEmail(patch: Partial<ParametresEmail>): Promise<void> {
  if (!baseConfiguree()) {
    throw new Error(
      "La base de données n'est pas configurée : impossible d'enregistrer la configuration email.",
    );
  }

  await preparerTable();
  const sql = getSql();

  for (const [cle, valeur] of Object.entries(patch)) {
    if (valeur === undefined) continue;
    const nom = `${PREFIXE}${cle}`;
    await sql`
      insert into app_settings (cle, valeur, maj)
      values (${nom}, ${valeur}, now())
      on conflict (cle) do update set valeur = excluded.valeur, maj = now()
    `;
  }

  cache = null;
}

/** Version publique (sans la clé) pour l'affichage dans le back-office. */
export function sansCle(p: ParametresEmail): Omit<ParametresEmail, "cle_api"> & { cle_definie: boolean } {
  return {
    cle_definie: Boolean(p.cle_api),
    expediteur_email: p.expediteur_email,
    expediteur_nom: p.expediteur_nom,
    destinataire: p.destinataire,
  };
}
