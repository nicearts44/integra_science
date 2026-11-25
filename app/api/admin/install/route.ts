import { NextResponse, type NextRequest } from "next/server";

import { memeOrigine, ouvrirSession } from "@/lib/server/admin-auth";
import {
  cleInstallationRequise,
  cleInstallationValide,
  creerCompte,
  nombreComptes,
} from "@/lib/server/comptes";

export const runtime = "nodejs";

/**
 * Création du tout premier compte (propriétaire). Fermée dès qu'un compte
 * existe. Si ADMIN_PASSWORD est défini, il sert de clé d'installation.
 */
export async function POST(req: NextRequest) {
  if (!memeOrigine(req)) {
    return NextResponse.json({ ok: false, error: "Origine refusée." }, { status: 403 });
  }

  if ((await nombreComptes()) > 0) {
    return NextResponse.json(
      { ok: false, error: "Un compte existe déjà. Connectez-vous." },
      { status: 409 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const cle = typeof body.cle === "string" ? body.cle : "";

  if (cleInstallationRequise() && !cleInstallationValide(cle)) {
    return NextResponse.json(
      { ok: false, error: "Clé d'installation incorrecte." },
      { status: 403 },
    );
  }

  try {
    const compte = await creerCompte({
      email: typeof body.email === "string" ? body.email : "",
      nom: typeof body.nom === "string" ? body.nom : "",
      role: "proprietaire",
      motDePasse: typeof body.password === "string" ? body.password : "",
    });
    return ouvrirSession(NextResponse.json({ ok: true }), compte);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Création impossible.";
    console.error("[admin] création du premier compte", err);
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}
