import { NextResponse, type NextRequest } from "next/server";

import { refusApi } from "@/lib/server/admin-auth";
import { listerSoumissions, readSubscribers } from "@/lib/server/store";

export const runtime = "nodejs";

/** Échappement CSV : guillemets, retours ligne et séparateurs. */
function cellule(valeur: unknown): string {
  const texte = valeur === null || valeur === undefined ? "" : String(valeur);
  return `"${texte.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

function csv(lignes: Array<Array<unknown>>): string {
  return `\uFEFF${lignes.map((ligne) => ligne.map(cellule).join(",")).join("\r\n")}\r\n`;
}

export async function GET(req: NextRequest) {
  const refus = await refusApi(req, "lecture");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }

  const type = req.nextUrl.searchParams.get("type") ?? "newsletter";
  const date = new Date().toISOString().slice(0, 10);

  if (type === "newsletter") {
    const abonnes = readSubscribers();
    const contenu = csv([
      ["email", "nom", "interets", "statut", "date_inscription", "date_confirmation"],
      ...abonnes.map((a) => [
        a.email,
        a.nom ?? "",
        a.interets ?? "",
        a.statut,
        a.date_inscription,
        a.date_confirmation ?? "",
      ]),
    ]);
    return new NextResponse(contenu, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="newsletter-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  if (type === "messages") {
    const soumissions = listerSoumissions();
    const cles = new Set<string>();
    for (const s of soumissions) {
      for (const cle of Object.keys(s.donnees)) cles.add(cle);
    }
    const colonnes = ["kind", "fichier", "date", ...Array.from(cles).sort()];
    const contenu = csv([
      colonnes,
      ...soumissions.map((s) => [
        s.kind,
        s.fichier,
        s.date,
        ...Array.from(cles)
          .sort()
          .map((cle) => s.donnees[cle] ?? ""),
      ]),
    ]);
    return new NextResponse(contenu, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="messages-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json({ ok: false, error: "Type d'export inconnu." }, { status: 400 });
}
