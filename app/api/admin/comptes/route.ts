import { NextResponse, type NextRequest } from "next/server";

import { refusApi } from "@/lib/server/admin-auth";
import { creerCompte, listerComptes, publicCompte, roleValide } from "@/lib/server/comptes";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const refus = await refusApi(req, "comptes");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }
  const comptes = await listerComptes();
  return NextResponse.json({ ok: true, comptes: comptes.map(publicCompte) });
}

export async function POST(req: NextRequest) {
  const refus = await refusApi(req, "comptes");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const role = roleValide(body.role) ?? "editeur";

  try {
    const cree = await creerCompte({
      email: typeof body.email === "string" ? body.email : "",
      nom: typeof body.nom === "string" ? body.nom : "",
      role,
      motDePasse: typeof body.password === "string" ? body.password : "",
    });
    return NextResponse.json({ ok: true, compte: publicCompte(cree) }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Création impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}
