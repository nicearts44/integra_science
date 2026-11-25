import { NextResponse, type NextRequest } from "next/server";

import type { DocName } from "@/lib/admin/schema";
import { apiAutorisee } from "@/lib/server/admin-auth";
import { ecrireDoc, lireDoc, validerDoc } from "@/lib/server/editorial-store";

export const runtime = "nodejs";

const DOCS: DocName[] = ["publications", "cas-usage", "actualites", "reseau"];

/** Clés de tableau autorisées, par document. */
const POINTEURS: Partial<Record<DocName, string[]>> = {
  publications: ["items"],
  "cas-usage": ["items"],
  actualites: ["items"],
  reseau: ["membres", "roles", "engagements"],
};

function estDoc(valeur: string): valeur is DocName {
  return (DOCS as string[]).includes(valeur);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ doc: string }> }) {
  if (!(await apiAutorisee(req))) {
    return NextResponse.json({ ok: false, error: "Session expirée. Reconnectez-vous." }, { status: 401 });
  }

  const { doc } = await ctx.params;
  if (!estDoc(doc)) {
    return NextResponse.json({ ok: false, error: "Document inconnu." }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as
    | { pointer?: unknown; value?: unknown }
    | null;
  const pointeur = typeof body?.pointer === "string" ? body.pointer : "";

  if (!(POINTEURS[doc] ?? []).includes(pointeur)) {
    return NextResponse.json(
      { ok: false, error: `Clé « ${pointeur || "(vide)"} » non autorisée pour ce document.` },
      { status: 422 },
    );
  }

  try {
    const actuel = await lireDoc(doc);
    const nouveau = { ...actuel, [pointeur]: body?.value };

    const erreur = validerDoc(doc, nouveau);
    if (erreur) {
      return NextResponse.json({ ok: false, error: erreur }, { status: 422 });
    }

    const resultat = await ecrireDoc(doc, nouveau, `admin: mise à jour de content/${doc}.json`);
    return NextResponse.json({
      ok: true,
      message: resultat.message,
      mode: resultat.mode,
      commit: resultat.commit,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Écriture impossible.";
    console.error("[admin] écriture du contenu", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
