import { NextResponse, type NextRequest } from "next/server";

import { refusApi, sessionCourante } from "@/lib/server/admin-auth";
import {
  compteParId,
  modifierCompte,
  publicCompte,
  roleValide,
  supprimerCompte,
} from "@/lib/server/comptes";

export const runtime = "nodejs";

type Contexte = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Contexte) {
  const refus = await refusApi(req, "comptes");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }

  const { id } = await ctx.params;
  const cible = await compteParId(id);
  if (!cible) {
    return NextResponse.json({ ok: false, error: "Compte introuvable." }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const role = roleValide(body.role);

  try {
    const maj = await modifierCompte(id, {
      ...(typeof body.nom === "string" ? { nom: body.nom } : {}),
      ...(typeof body.email === "string" ? { email: body.email } : {}),
      ...(role ? { role } : {}),
      ...(typeof body.actif === "boolean" ? { actif: body.actif } : {}),
      ...(typeof body.password === "string" && body.password ? { motDePasse: body.password } : {}),
    });
    const moi = await sessionCourante();
    return NextResponse.json({ ok: true, compte: publicCompte(maj), moi: maj.id === moi?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Modification impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}

export async function DELETE(req: NextRequest, ctx: Contexte) {
  const refus = await refusApi(req, "comptes");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }

  const { id } = await ctx.params;
  const moi = await sessionCourante();
  if (id === moi?.id) {
    return NextResponse.json(
      { ok: false, error: "Vous ne pouvez pas supprimer votre propre compte." },
      { status: 422 },
    );
  }

  try {
    await supprimerCompte(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Suppression impossible.";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}
