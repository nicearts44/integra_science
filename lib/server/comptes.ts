/* ===================================================================
   COMPTES DU BACK-OFFICE
   -------------------------------------------------------------------
   Les comptes vivent dans `content/comptes.json` : écrit sur le disque en
   développement, commité dans le dépôt en production (donc conservé d'un
   déploiement à l'autre). Les mots de passe ne sont jamais stockés : seule
   une empreinte scrypt les représente.

   Rôles :
   · proprietaire — tout, y compris les comptes ;
   · editeur      — contenu, réseau, réglages, messages (lecture + export) ;
   · lecteur      — consultation seule, aucune écriture.
   =================================================================== */

import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import { ROLES, type Role } from "@/lib/admin/roles";
import { ecrireFichierJson, lireFichierJson } from "@/lib/server/editorial-store";

export { ROLES, roleValide, type Role } from "@/lib/admin/roles";

export type Compte = {
  id: string;
  email: string;
  nom: string;
  role: Role;
  actif: boolean;
  hash: string;
  cree: string;
  maj: string;
  dernierAcces?: string;
  /** Jeton de réinitialisation : empreinte SHA-256 + expiration (ms). */
  reinit?: { jeton: string; exp: number } | null;
};

/** Compte tel qu'exposé à l'interface : jamais l'empreinte du mot de passe. */
export type ComptePublic = Omit<Compte, "hash" | "reinit">;

type Base = { comptes: Compte[] };

const FICHIER = "comptes.json";
const DUREE_JETON = 60 * 60 * 1000; // 1 heure

/* --------------------------------------------------------- empreintes */

export function hacherMotDePasse(motDePasse: string): string {
  const sel = randomBytes(16).toString("hex");
  const cle = scryptSync(motDePasse.normalize("NFKC"), sel, 64).toString("hex");
  return `scrypt$${sel}$${cle}`;
}

export function verifierMotDePasse(compte: Compte, motDePasse: string): boolean {
  const [algo, sel, cle] = compte.hash.split("$");
  if (algo !== "scrypt" || !sel || !cle) return false;
  const attendu = Buffer.from(cle, "hex");
  const calcule = scryptSync(motDePasse.normalize("NFKC"), sel, attendu.length);
  return attendu.length === calcule.length && timingSafeEqual(attendu, calcule);
}

/** Version de session : change dès que le mot de passe change. */
export function versionSession(compte: Compte): string {
  return createHash("sha256").update(compte.hash).digest("hex").slice(0, 16);
}

export function empreinte(texte: string): string {
  return createHash("sha256").update(texte).digest("hex");
}

/* ------------------------------------------------------- validation */

export function emailValide(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function motDePasseValide(motDePasse: string): string | null {
  if (motDePasse.length < 10) return "Le mot de passe doit faire au moins 10 caractères.";
  if (!/[a-zA-Z]/.test(motDePasse) || !/[0-9]/.test(motDePasse)) {
    return "Le mot de passe doit mêler lettres et chiffres.";
  }
  return null;
}

export function normaliserEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function publicCompte(compte: Compte): ComptePublic {
  const { hash: _hash, reinit: _reinit, ...reste } = compte;
  return reste;
}

/* ------------------------------------------------------------ lecture */

let cache: { base: Base; exp: number } | null = null;
const DUREE_CACHE = 5000;

async function base(): Promise<Base> {
  if (cache && cache.exp > Date.now()) return cache.base;
  const lue = await lireFichierJson<Base>(FICHIER, { comptes: [] });
  const propre: Base = { comptes: Array.isArray(lue?.comptes) ? lue.comptes : [] };
  cache = { base: propre, exp: Date.now() + DUREE_CACHE };
  return propre;
}

function viderCache() {
  cache = null;
}

async function enregistrer(contenu: Base, message: string): Promise<void> {
  await ecrireFichierJson(FICHIER, contenu, message);
  cache = { base: contenu, exp: Date.now() + DUREE_CACHE };
}

export async function listerComptes(): Promise<Compte[]> {
  const { comptes } = await base();
  return [...comptes].sort((a, b) => {
    const rang = (r: Role) => ROLES.indexOf(r);
    return rang(a.role) - rang(b.role) || a.email.localeCompare(b.email);
  });
}

export async function nombreComptes(): Promise<number> {
  return (await base()).comptes.length;
}

export async function compteParEmail(email: string): Promise<Compte | null> {
  const cible = normaliserEmail(email);
  return (await base()).comptes.find((c) => c.email === cible) ?? null;
}

export async function compteParId(id: string): Promise<Compte | null> {
  return (await base()).comptes.find((c) => c.id === id) ?? null;
}

export async function compteParJeton(jeton: string): Promise<Compte | null> {
  if (!jeton) return null;
  const empreinteJeton = empreinte(jeton);
  return (
    (await base()).comptes.find(
      (c) => c.reinit && c.reinit.jeton === empreinteJeton && c.reinit.exp > Date.now(),
    ) ?? null
  );
}

/* ----------------------------------------------------------- écriture */

export type NouveauCompte = {
  email: string;
  nom: string;
  role: Role;
  motDePasse: string;
};

export async function creerCompte(entree: NouveauCompte): Promise<Compte> {
  const email = normaliserEmail(entree.email);
  if (!emailValide(email)) throw new Error("Adresse électronique invalide.");
  const erreurMdp = motDePasseValide(entree.motDePasse);
  if (erreurMdp) throw new Error(erreurMdp);

  const { comptes } = await base();
  if (comptes.some((c) => c.email === email)) {
    throw new Error("Un compte utilise déjà cette adresse.");
  }

  const maintenant = new Date().toISOString();
  const compte: Compte = {
    id: randomUUID(),
    email,
    nom: entree.nom.trim() || email.split("@")[0],
    role: entree.role,
    actif: true,
    hash: hacherMotDePasse(entree.motDePasse),
    cree: maintenant,
    maj: maintenant,
  };

  await enregistrer({ comptes: [...comptes, compte] }, `Compte créé : ${compte.email}`);
  return compte;
}

export type ModifCompte = {
  nom?: string;
  role?: Role;
  actif?: boolean;
  motDePasse?: string;
  email?: string;
};

export async function modifierCompte(id: string, modif: ModifCompte): Promise<Compte> {
  const { comptes } = await base();
  const index = comptes.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Compte introuvable.");

  const avant = comptes[index];
  const apres: Compte = { ...avant, maj: new Date().toISOString() };

  if (modif.nom !== undefined) apres.nom = modif.nom.trim() || avant.nom;

  if (modif.email !== undefined) {
    const email = normaliserEmail(modif.email);
    if (!emailValide(email)) throw new Error("Adresse électronique invalide.");
    if (comptes.some((c) => c.id !== id && c.email === email)) {
      throw new Error("Un compte utilise déjà cette adresse.");
    }
    apres.email = email;
  }

  if (modif.role !== undefined && modif.role !== avant.role) {
    if (!ROLES.includes(modif.role)) throw new Error("Rôle inconnu.");
    if (avant.role === "proprietaire" && modif.role !== "proprietaire") {
      await garderUnProprietaire(comptes, "rétrograder ce propriétaire");
    }
    apres.role = modif.role;
  }

  if (modif.actif !== undefined && modif.actif !== avant.actif) {
    if (avant.role === "proprietaire" && !modif.actif) {
      await garderUnProprietaire(comptes, "désactiver ce propriétaire");
    }
    apres.actif = modif.actif;
  }

  if (modif.motDePasse !== undefined) {
    const erreurMdp = motDePasseValide(modif.motDePasse);
    if (erreurMdp) throw new Error(erreurMdp);
    apres.hash = hacherMotDePasse(modif.motDePasse);
    apres.reinit = null;
  }

  comptes[index] = apres;
  await enregistrer({ comptes }, `Compte modifié : ${apres.email}`);
  return apres;
}

export async function supprimerCompte(id: string): Promise<void> {
  const { comptes } = await base();
  const cible = comptes.find((c) => c.id === id);
  if (!cible) throw new Error("Compte introuvable.");
  if (cible.role === "proprietaire") {
    await garderUnProprietaire(comptes, "supprimer ce propriétaire");
  }
  await enregistrer(
    { comptes: comptes.filter((c) => c.id !== id) },
    `Compte supprimé : ${cible.email}`,
  );
}

async function garderUnProprietaire(comptes: Compte[], action: string) {
  const autres = comptes.filter((c) => c.role === "proprietaire" && c.actif).length;
  if (autres <= 1) {
    throw new Error(`Impossible de ${action} : il doit rester au moins un propriétaire actif.`);
  }
}

export async function marquerConnexion(id: string): Promise<void> {
  const { comptes } = await base();
  const index = comptes.findIndex((c) => c.id === id);
  if (index === -1) return;
  comptes[index] = { ...comptes[index], dernierAcces: new Date().toISOString() };
  try {
    await enregistrer({ comptes }, "Connexion au back-office");
  } catch (err) {
    // Un échec d'écriture ne doit pas empêcher la connexion.
    viderCache();
    console.error("[comptes] dernière connexion non enregistrée", err);
  }
}

/* -------------------------------------------- mot de passe oublié */

/** Crée un jeton de réinitialisation ; renvoie le jeton en clair (une seule fois). */
export async function demanderReinit(email: string): Promise<string | null> {
  const cible = await compteParEmail(email);
  if (!cible || !cible.actif) return null;

  const jeton = randomBytes(32).toString("base64url");
  const { comptes } = await base();
  const index = comptes.findIndex((c) => c.id === cible.id);
  comptes[index] = {
    ...comptes[index],
    reinit: { jeton: empreinte(jeton), exp: Date.now() + DUREE_JETON },
  };
  await enregistrer({ comptes }, `Demande de réinitialisation : ${cible.email}`);
  return jeton;
}

export async function appliquerReinit(jeton: string, motDePasse: string): Promise<Compte> {
  const cible = await compteParJeton(jeton);
  if (!cible) throw new Error("Ce lien est invalide ou a expiré. Demandez-en un nouveau.");
  const erreurMdp = motDePasseValide(motDePasse);
  if (erreurMdp) throw new Error(erreurMdp);

  const { comptes } = await base();
  const index = comptes.findIndex((c) => c.id === cible.id);
  comptes[index] = {
    ...comptes[index],
    hash: hacherMotDePasse(motDePasse),
    reinit: null,
    maj: new Date().toISOString(),
  };
  await enregistrer({ comptes }, `Mot de passe réinitialisé : ${cible.email}`);
  return comptes[index];
}

/* ------------------------------------------------ amorçage (premier compte) */

/**
 * Le tout premier compte est créé depuis /admin/installer. La clé
 * d'installation est ADMIN_PASSWORD : elle n'est jamais un mot de passe de
 * connexion, seulement le droit de créer le propriétaire initial.
 */
export function cleInstallationRequise(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function cleInstallationValide(saisie: string): boolean {
  const attendue = process.env.ADMIN_PASSWORD;
  if (!attendue) return true; // en développement, pas de clé : le premier arrivé crée son compte
  const a = Buffer.from(saisie ?? "", "utf8");
  const b = Buffer.from(attendue, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
