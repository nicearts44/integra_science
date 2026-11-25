import { NextResponse, type NextRequest } from "next/server";

import { ouvrirSession, refusApi, sessionCourante } from "@/lib/server/admin-auth";
import { modifierCompte, publicCompte, verifierMotDePasse } from "@/lib/server/comptes";

export const runtime = "nodejs";

/** Chacun gère son nom et son mot de passe ; le rôle reste l'affaire du propriétaire. */
export async function PATCH(req: NextRequest) {
  const refus = await refusApi(req, "lecture");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }

  const compte = await sessionCourante();
  if (!compte) {
    return NextResponse.json({ ok: false, error: "Session expirée." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const actuel = typeof body.actuel === "string" ? body.actuel : "";
  const nouveau = typeof body.password === "string" ? body.password : "";
  const nom = typeof body.nom === "string" ? body.nom : undefined;

  if (nouveau && !verifierMotDePasse(compte, actuel)) {
    return NextResponse.json(
      { ok: false, error: "Le mot de passe actuel est incorrect." },
      { status: 403 },
    );
  }

  try {
    const maj = await modifierCompte(compte.id, {
      ...(nom !== undefined ? { nom } : {}),
      ...(nouveau ? { motDePasse: nouveau } : {}),
    });
    // Le mot de passe a changé : la version de session change, on renouvelle le cookie.
    return ouvrirSession(NextResponse.json({ ok: true, compte: publicCompte(maj) }), maj);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Modification impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}
