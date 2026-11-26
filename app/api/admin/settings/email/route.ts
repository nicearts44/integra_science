import { NextResponse, type NextRequest } from "next/server";

import { refusApi } from "@/lib/server/admin-auth";
import { ecrireParametresEmail, lireParametresEmail, type ParametresEmail } from "@/lib/server/parametres";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function PUT(req: NextRequest) {
  const refus = await refusApi(req, "ecriture");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 422 });
  }

  const texte = (cle: string) => (typeof body[cle] === "string" ? (body[cle] as string).trim() : "");

  const patch: Partial<ParametresEmail> = {
    expediteur_email: texte("expediteur_email"),
    expediteur_nom: texte("expediteur_nom") || "INTEGRA SCIENCE",
    destinataire: texte("destinataire"),
  };

  if (patch.expediteur_email && !EMAIL_RE.test(patch.expediteur_email)) {
    return NextResponse.json(
      { ok: false, error: "L'adresse d'expédition n'est pas valide." },
      { status: 422 },
    );
  }
  if (patch.destinataire && !EMAIL_RE.test(patch.destinataire)) {
    return NextResponse.json(
      { ok: false, error: "L'adresse du destinataire n'est pas valide." },
      { status: 422 },
    );
  }

  // La clé n'est jamais renvoyée au navigateur : vide = on conserve l'existante.
  const nouvelleCle = texte("cle_api");
  if (nouvelleCle) patch.cle_api = nouvelleCle;
  if (body.effacer_cle === true) patch.cle_api = "";

  try {
    await ecrireParametresEmail(patch);
    const apres = await lireParametresEmail();
    return NextResponse.json({
      ok: true,
      message: "Configuration email enregistrée.",
      cle_definie: Boolean(apres.cle_api),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Enregistrement impossible.";
    console.error("[admin] configuration email", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
