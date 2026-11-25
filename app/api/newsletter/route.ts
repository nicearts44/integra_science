import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "node:crypto";

import { readSubscribers, writeSubscribers, type Subscriber } from "@/lib/server/store";
import { sendMail } from "@/lib/server/email";
import { baseUrl } from "@/lib/content/site";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Inscription à la lettre — premier maillon du double opt-in (§ 8.9).
 * 1. enregistrement « en_attente » + jeton unique
 * 2. email de confirmation contenant /newsletter/confirmer?token=…
 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  let email = "";
  let consentement = false;
  let nom = "";
  let redirect = "/newsletter/";

  if (isJson) {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    email = String(body.email ?? "").trim().toLowerCase();
    consentement = body.consentement === true || body.consentement === "true";
    nom = String(body.nom ?? "").trim();
    redirect = String(body.redirect ?? "/newsletter/");
  } else {
    const form = await req.formData();
    email = String(form.get("email") ?? "").trim().toLowerCase();
    consentement = form.get("consentement") === "on" || form.get("consentement") === "true";
    nom = String(form.get("nom") ?? "").trim();
    redirect = String(form.get("redirect") ?? "/newsletter/");
  }

  if (!EMAIL_RE.test(email) || !consentement) {
    if (isJson) {
      return NextResponse.json(
        { ok: false, message: "Une adresse email valide et votre accord sont nécessaires." },
        { status: 422 },
      );
    }
    return NextResponse.redirect(new URL(`${redirect}?inscription=erreur`, req.url), 303);
  }

  const list = readSubscribers();
  const existing = list.find((s) => s.email === email);

  if (existing?.statut === "confirme") {
    // Déjà inscrit : même retour, jamais de révélation d'état (§ 8.9).
    return finish(isJson, req, redirect, "existant");
  }

  const token = randomBytes(16).toString("hex");
  const record: Subscriber = {
    email,
    ...(nom ? { nom } : {}),
    statut: "en_attente",
    token,
    date_inscription: new Date().toISOString(),
  };

  const next = existing
    ? list.map((s) => (s.email === email ? { ...record, date_inscription: s.date_inscription } : s))
    : [...list, record];
  writeSubscribers(next);

  const confirmUrl = `${baseUrl()}/newsletter/confirmer/?token=${token}`;
  const sent = await sendMail({
    to: email,
    subject: "Confirmez votre inscription à la lettre d'INTEGRA SCIENCE",
    text: [
      "Bonjour,",
      "",
      "Vous vous êtes inscrit à la lettre d'INTEGRA SCIENCE.",
      "Cliquez sur le lien ci-dessous pour confirmer votre inscription :",
      confirmUrl,
      "",
      "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
      "Le lien expire au bout de sept jours.",
    ].join("\n"),
  });

  if (!sent) {
    console.error("[newsletter] envoi de l'email de confirmation impossible — enregistrement conservé");
  }

  return finish(isJson, req, redirect, "envoye");
}

function finish(isJson: boolean, req: NextRequest, redirect: string, code: string) {
  if (isJson) {
    return NextResponse.json({ ok: true, code }, { status: 200 });
  }
  return NextResponse.redirect(new URL(`${redirect}?inscription=${code}`, req.url), 303);
}
