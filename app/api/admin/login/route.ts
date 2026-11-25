import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_COOKIE,
  ADMIN_MAX_AGE,
  adminConfigure,
  memeOrigine,
  motDePasseValide,
  signerSession,
} from "@/lib/server/admin-auth";

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

  if (!adminConfigure() && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD n'est pas défini sur ce serveur." },
      { status: 503 },
    );
  }

  const ip = ipDe(req);
  if (tropDessais(ip)) {
    return NextResponse.json(
      { ok: false, error: "Trop d'essais. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  const motDePasse = typeof body.password === "string" ? body.password : "";

  if (!motDePasseValide(motDePasse)) {
    noterEssai(ip);
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false, error: "Mot de passe incorrect." }, { status: 401 });
  }

  essais.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signerSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return res;
}
