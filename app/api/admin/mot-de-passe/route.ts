import { NextResponse, type NextRequest } from "next/server";

import { emailConfigured, sendMail } from "@/lib/server/email";
import { compteParEmail, demanderReinit, normaliserEmail } from "@/lib/server/comptes";
import { memeOrigine } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

/** Une demande de lien par IP toutes les 15 minutes, cinq au maximum. */
const demandes = new Map<string, number[]>();
const FENETRE = 15 * 60 * 1000;
const MAX = 5;

function ipDe(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

function tropDeDemandes(ip: string): boolean {
  const maintenant = Date.now();
  const liste = (demandes.get(ip) ?? []).filter((t) => maintenant - t < FENETRE);
  demandes.set(ip, liste);
  return liste.length >= MAX;
}

function origine(req: NextRequest): string {
  const configure = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (configure) return configure;
  return req.nextUrl.origin;
}

/**
 * Mot de passe oublié : réponse toujours identique, que le compte existe ou
 * non — le formulaire ne doit pas servir à deviner qui a un compte.
 */
export async function POST(req: NextRequest) {
  if (!memeOrigine(req)) {
    return NextResponse.json({ ok: false, error: "Origine refusée." }, { status: 403 });
  }

  const ip = ipDe(req);
  if (tropDeDemandes(ip)) {
    return NextResponse.json(
      { ok: false, error: "Trop de demandes. Réessayez dans un quart d'heure." },
      { status: 429 },
    );
  }
  demandes.set(ip, [...(demandes.get(ip) ?? []), Date.now()]);

  const body = (await req.json().catch(() => ({}))) as { email?: unknown };
  const email = normaliserEmail(typeof body.email === "string" ? body.email : "");

  const compte = email ? await compteParEmail(email) : null;
  let envoye = false;

  if (compte && compte.actif) {
    try {
      const jeton = await demanderReinit(compte.email);
      if (jeton && (await emailConfigured())) {
        const lien = `${origine(req)}/admin/reinitialiser/?token=${encodeURIComponent(jeton)}`;
        envoye = await sendMail({
          to: compte.email,
          subject: "INTEGRA SCIENCE — réinitialisation de votre mot de passe",
          text: [
            `Bonjour ${compte.nom},`,
            "",
            "Une réinitialisation de mot de passe a été demandée pour votre compte du back-office.",
            "Ce lien est valable une heure et ne fonctionne qu'une fois :",
            lien,
            "",
            "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message :",
            "votre mot de passe actuel reste valable.",
          ].join("\n"),
        });
      }
    } catch (err) {
      console.error("[admin] demande de réinitialisation", err);
    }
  }

  return NextResponse.json({
    ok: true,
    envoye,
    message: envoye
      ? "Si un compte utilise cette adresse, un lien vient d'être envoyé. Il est valable une heure."
      : "Si un compte utilise cette adresse, le lien a été préparé. L'envoi d'emails n'est pas configuré sur ce serveur : demandez à un propriétaire de définir un mot de passe temporaire depuis Comptes.",
  });
}
