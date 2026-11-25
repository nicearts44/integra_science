import { NextResponse, type NextRequest } from "next/server";

import { memeOrigine, ouvrirSession } from "@/lib/server/admin-auth";
import {
  compteParEmail,
  marquerConnexion,
  nombreComptes,
  verifierMotDePasse,
} from "@/lib/server/comptes";

export const runtime = "nodejs";

/** Limitation d'essais par IP (mémoire d'instance : suffisant contre le bourrage). */
const essais = new Map<string, number[]>();
const FENETRE = 10 * 60 * 1000;
const MAX_ESSAIS = 8;

function ipDe(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

function tropDessais(ip: string): boolean {
  const maintenant = Date.now();
  const liste = (essais.get(ip) ?? []).filter((t) => maintenant - t < FENETRE);
  essais.set(ip, liste);
  return liste.length >= MAX_ESSAIS;
}

function noterEssai(ip: string) {
  const liste = essais.get(ip) ?? [];
  liste.push(Date.now());
  essais.set(ip, liste);
}

export async function POST(req: NextRequest) {
  if (!memeOrigine(req)) {
    return NextResponse.json({ ok: false, error: "Origine refusée." }, { status: 403 });
  }

  const ip = ipDe(req);
  if (tropDessais(ip)) {
    return NextResponse.json(
      { ok: false, error: "Trop d'essais. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  if ((await nombreComptes()) === 0) {
    return NextResponse.json(
      { ok: false, error: "Aucun compte n'existe encore : créez le compte propriétaire.", installer: true },
      { status: 409 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  const email = typeof body.email === "string" ? body.email : "";
  const motDePasse = typeof body.password === "string" ? body.password : "";

  const compte = await compteParEmail(email);
  if (!compte || !compte.actif || !verifierMotDePasse(compte, motDePasse)) {
    noterEssai(ip);
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      { ok: false, error: "Adresse ou mot de passe incorrect." },
      { status: 401 },
    );
  }

  essais.delete(ip);
  await marquerConnexion(compte.id);
  return ouvrirSession(NextResponse.json({ ok: true, nom: compte.nom, role: compte.role }), compte);
}
