import { NextResponse, type NextRequest } from "next/server";

import { refusApi } from "@/lib/server/admin-auth";
import { sendMail } from "@/lib/server/email";
import { lireParametresEmail } from "@/lib/server/parametres";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Envoie un message de contrôle à l'adresse indiquée, avec la configuration enregistrée. */
export async function POST(req: NextRequest) {
  const refus = await refusApi(req, "ecriture");
  if (refus) {
    return NextResponse.json({ ok: false, error: refus.error }, { status: refus.status });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const to = typeof body.to === "string" ? body.to.trim() : "";

  if (!EMAIL_RE.test(to)) {
    return NextResponse.json({ ok: false, error: "Adresse de test invalide." }, { status: 422 });
  }

  const config = await lireParametresEmail();
  if (!config.cle_api) {
    return NextResponse.json(
      { ok: false, error: "Aucune clé API Brevo enregistrée : enregistrez-la d'abord." },
      { status: 422 },
    );
  }

  const envoye = await sendMail({
    to,
    subject: "INTEGRA SCIENCE — test de configuration email",
    text: [
      "Bonjour,",
      "",
      "Ce message confirme que l'envoi d'emails fonctionne depuis le back-office d'INTEGRA SCIENCE.",
      `Expéditeur : ${config.expediteur_nom} <${config.expediteur_email || "noreply@integra.science"}>`,
      "",
      "Aucune action n'est nécessaire.",
    ].join("\n"),
  });

  if (!envoye) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Brevo a refusé l'envoi. Vérifiez la clé API et que l'adresse d'expédition est bien validée dans Brevo.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: `Message de test envoyé à ${to}.` });
}
