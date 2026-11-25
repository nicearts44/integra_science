/* ===================================================================
   AUTHENTIFICATION DU BACK-OFFICE
   -------------------------------------------------------------------
   Un compte (adresse + mot de passe) et un cookie signé HMAC qui porte
   l'identifiant du compte et la version de son mot de passe. Changer un
   mot de passe invalide donc immédiatement les sessions ouvertes.

   Trois rôles, trois capacités :
   · lecture   — voir le back-office ;
   · ecriture  — enregistrer du contenu, des réglages, des comptes du réseau ;
   · comptes   — gérer les personnes qui accèdent au back-office.
   =================================================================== */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

import { compteParId, versionSession, type Compte, type Role } from "@/lib/server/comptes";

export const ADMIN_COOKIE = "integra_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

export type Capacite = "lecture" | "ecriture" | "comptes";

const DROITS: Record<Role, Capacite[]> = {
  proprietaire: ["lecture", "ecriture", "comptes"],
  editeur: ["lecture", "ecriture"],
  lecteur: ["lecture"],
};

export function peut(role: Role, capacite: Capacite): boolean {
  return DROITS[role].includes(capacite);
}

function secret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "integra-dev-secret";
}

/* ---------------------------------------------------------- signature */

export function signerSession(compte: Compte): string {
  const payload = Buffer.from(
    JSON.stringify({
      uid: compte.id,
      v: versionSession(compte),
      exp: Date.now() + ADMIN_MAX_AGE * 1000,
    }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function lirePayload(token: string | undefined): { uid: string; v: string; exp: number } | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const attendue = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(attendue, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      uid?: unknown;
      v?: unknown;
      exp?: unknown;
    };
    if (typeof data.uid !== "string" || typeof data.v !== "string") return null;
    if (typeof data.exp !== "number" || data.exp <= Date.now()) return null;
    return { uid: data.uid, v: data.v, exp: data.exp };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------- session */

export async function sessionCourante(): Promise<Compte | null> {
  const jar = await cookies();
  const data = lirePayload(jar.get(ADMIN_COOKIE)?.value);
  if (!data) return null;

  const compte = await compteParId(data.uid);
  if (!compte || !compte.actif) return null;
  if (versionSession(compte) !== data.v) return null; // mot de passe changé ailleurs
  return compte;
}

export async function adminConnecte(): Promise<boolean> {
  return (await sessionCourante()) !== null;
}

/** Garde de page : redirige vers la connexion si la session a expiré. */
export async function exigerAdmin(): Promise<Compte> {
  const compte = await sessionCourante();
  if (!compte) redirect("/admin/login");
  return compte;
}

/** Garde de page pour une capacité précise (écriture, comptes…). */
export async function exigerCapacite(capacite: Capacite): Promise<Compte> {
  const compte = await exigerAdmin();
  if (!peut(compte.role, capacite)) redirect("/admin?refus=" + capacite);
  return compte;
}

/**
 * Garde d'API avec un motif clair : session absente, origine douteuse ou
 * rôle insuffisant donnent trois réponses différentes et exploitables.
 */
export async function refusApi(
  req: Request,
  capacite: Capacite = "ecriture",
): Promise<{ status: number; error: string } | null> {
  if (!memeOrigine(req)) return { status: 403, error: "Origine refusée." };
  const compte = await sessionCourante();
  if (!compte) return { status: 401, error: "Session expirée. Reconnectez-vous." };
  if (!peut(compte.role, capacite)) {
    return { status: 403, error: "Votre rôle ne permet pas cette action." };
  }
  return null;
}

/** Garde d'API : renvoie le compte autorisé, ou null. */
export async function apiAutorisee(
  req: Request,
  capacite: Capacite = "ecriture",
): Promise<Compte | null> {
  const compte = await sessionCourante();
  if (!compte) return null;
  if (!peut(compte.role, capacite)) return null;
  if (!memeOrigine(req)) return null;
  return compte;
}

/**
 * Les mutations n'acceptent que la même origine : le cookie SameSite=Lax
 * protège déjà l'essentiel, ce contrôle ferme la porte aux formulaires
 * postés depuis un autre site.
 */
export function memeOrigine(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // navigation directe / fetch same-origin sans Origin
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------- cookie */

export const OPTIONS_COOKIE = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_MAX_AGE,
};

/** Ouvre la session sur la réponse et renvoie la réponse telle quelle. */
export function ouvrirSession<T extends NextResponse>(res: T, compte: Compte): T {
  res.cookies.set(ADMIN_COOKIE, signerSession(compte), OPTIONS_COOKIE);
  return res;
}

export function fermerSession<T extends NextResponse>(res: T): T {
  res.cookies.set(ADMIN_COOKIE, "", { ...OPTIONS_COOKIE, maxAge: 0 });
  return res;
}
