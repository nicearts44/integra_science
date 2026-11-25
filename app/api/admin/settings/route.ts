import { NextResponse, type NextRequest } from "next/server";

import { settingsKeys } from "@/lib/admin/schema";
import { refusApi } from "@/lib/server/admin-auth";
import { ecrireDoc } from "@/lib/server/editorial-store";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  const refus = await refusApi(req, "ecriture");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }

  const body = (await req.json().catch(() => null)) as { value?: unknown } | null;
  const valeur = body?.value;
  if (!valeur || typeof valeur !== "object" || Array.isArray(valeur)) {
    return NextResponse.json({ ok: false, error: "Réglages invalides." }, { status: 422 });
  }

  const entrees = valeur as Record<string, unknown>;
  const propre: Record<string, string> = {};
  for (const cle of settingsKeys) {
    const brut = entrees[cle];
    propre[cle] = typeof brut === "string" ? brut.trim() : "";
  }

  try {
    const resultat = await ecrireDoc("reglages", propre, "admin: mise à jour des réglages du site");
    return NextResponse.json({
      ok: true,
      message: resultat.message,
      mode: resultat.mode,
      commit: resultat.commit,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Écriture impossible.";
    console.error("[admin] écriture des réglages", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
