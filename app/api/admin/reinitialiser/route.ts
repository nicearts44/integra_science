import { NextResponse, type NextRequest } from "next/server";

import { memeOrigine, ouvrirSession } from "@/lib/server/admin-auth";
import { appliquerReinit } from "@/lib/server/comptes";

export const runtime = "nodejs";

/** Consomme un lien de réinitialisation : nouveau mot de passe, session ouverte. */
export async function POST(req: NextRequest) {
  if (!memeOrigine(req)) {
    return NextResponse.json({ ok: false, error: "Origine refusée." }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const jeton = typeof body.token === "string" ? body.token : "";
  const motDePasse = typeof body.password === "string" ? body.password : "";

  try {
    const compte = await appliquerReinit(jeton, motDePasse);
    return ouvrirSession(NextResponse.json({ ok: true, email: compte.email }), compte);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Réinitialisation impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}
