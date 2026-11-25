/* ===================================================================
   AUTHENTIFICATION DU BACK-OFFICE
   -------------------------------------------------------------------
   Un seul mot de passe (ADMIN_PASSWORD), un cookie signé HMAC.
   Pas de compte, pas de base : le back-office reste indépendant de
   toute infrastructure, il fonctionne même sans base de données.
   =================================================================== */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "integra_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function secret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "integra-dev-secret";
}

/** Le mot de passe est-il configuré ? En production, il est obligatoire. */
export function adminConfigure(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** En développement seulement, un mot de passe de repli évite de bloquer. */
function motDePasseAttendu(): string {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "integra");
}

export function motDePasseValide(saisie: string): boolean {
  const attendu = motDePasseAttendu();
  if (!attendu || !saisie) return false;
  const a = Buffer.from(saisie, "utf8");
  const b = Buffer.from(attendu, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function signerSession(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ADMIN_MAX_AGE * 1000 })).toString(
    "base64url",
  );
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function sessionValide(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const attendue = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(attendue, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function adminConnecte(): Promise<boolean> {
  const jar = await cookies();
  return sessionValide(jar.get(ADMIN_COOKIE)?.value);
}

/** Garde de page : redirige vers la connexion si la session a expiré. */
export async function exigerAdmin(): Promise<void> {
  if (!(await adminConnecte())) redirect("/admin/login");
}

/** Garde d'API : renvoie false plutôt que de rediriger. */
export async function apiAutorisee(req: Request): Promise<boolean> {
  if (!(await adminConnecte())) return false;
  return memeOrigine(req);
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
