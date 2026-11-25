import { NextResponse, type NextRequest } from "next/server";

import { forms, type FormConfig } from "@/lib/content/forms";
import { siteParams } from "@/lib/content/site";
import { saveSubmission } from "@/lib/server/store";
import { rateLimited } from "@/lib/server/rate-limit";
import { sendMail } from "@/lib/server/email";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

function validate(config: FormConfig, data: Record<string, string>): string[] {
  const errors: string[] = [];
  for (const field of config.fields) {
    const value = (data[field.name] ?? "").trim();
    if (field.required && value === "") errors.push(field.name);
    if (value && field.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      errors.push(field.name);
    }
    if (value && field.maxLength && value.length > field.maxLength) errors.push(field.name);
    if (value && field.minLength && value.length < field.minLength) errors.push(field.name);
  }
  return errors;
}

function renderBody(config: FormConfig, data: Record<string, string>): string {
  return [
    `Formulaire : ${config.title}`,
    "",
    ...config.fields.map((f) => `${f.label} : ${data[f.name] ?? ""}`),
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  let data: Record<string, string> = {};
  let kind = "";
  let redirect = "/contact/";

  if (isJson) {
    const body = await req.json().catch(() => ({}));
    data = { ...(body as Record<string, string>) };
    kind = String(data.kind ?? "");
    redirect = String(data.redirect ?? "/contact/");
  } else {
    const form = await req.formData();
    form.forEach((value, key) => {
      data[key] = typeof value === "string" ? value : "";
    });
    kind = String(data.kind ?? "");
    redirect = String(data.redirect ?? "/contact/");
  }

  const respond = (status: number, payload: Record<string, unknown>, redirectTo?: string) => {
    if (isJson) return NextResponse.json(payload, { status });
    if (redirectTo) return NextResponse.redirect(new URL(redirectTo, req.url), 303);
    return NextResponse.json(payload, { status });
  };

  const config = forms[kind as FormConfig["kind"]];
  if (!config) return respond(400, { ok: false, message: "Formulaire inconnu." });

  // Couche 1 — piège à robots : traitement silencieux, aucune trace.
  if ((data.societe ?? "").trim() !== "") {
    return respond(200, { ok: true, message: config.success }, `${redirect}?envoi=ok`);
  }

  // Couche 3 — limitation de débit.
  if (rateLimited(clientIp(req))) {
    return respond(429, { ok: false, message: "Trop de tentatives. Réessayez plus tard." });
  }

  const errors = validate(config, data);
  if (errors.length) {
    return respond(422, { ok: false, message: "Certains champs doivent être complétés.", fields: errors });
  }

  // Couche 2 — vérification d'origine : une soumission sans page d'origine
  // correspondante est rejetée (protection CSRF/bots sans script tiers).
  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("host");
    try {
      if (new URL(origin).host !== host) {
        return respond(403, { ok: false, message: "La vérification a échoué. Rechargez la page et réessayez." });
      }
    } catch {
      return respond(403, { ok: false, message: "La vérification a échoué. Rechargez la page et réessayez." });
    }
  }

  // Sauvegarde obligatoire, indépendamment de l'envoi email.
  try {
    saveSubmission(config.kind, {
      ...data,
      date: new Date().toISOString(),
      ip: clientIp(req),
      user_agent: req.headers.get("user-agent") ?? "",
      statut: "nouveau",
    });
  } catch (err) {
    console.error("[contact] sauvegarde impossible", err);
  }

  // Deux emails : notification interne + accusé de réception.
  if (siteParams.email_destinataire) {
    const body = renderBody(config, data);
    const sent = await Promise.all([
      sendMail({
        to: siteParams.email_destinataire,
        subject: `[INTEGRA] ${config.title} — ${data.nom ?? ""}`,
        text: body,
        replyTo: data.email,
      }),
      sendMail({
        to: data.email,
        subject: `[INTEGRA SCIENCE] Votre demande a bien été reçue`,
        text: `${config.success}\n\n${body}`,
      }),
    ]);
    if (!sent.every(Boolean)) {
      // La demande reste enregistrée : message neutre (§ 8.5).
      console.error("[contact] envoi email partiel ou échoué — demande enregistrée");
    }
  } else {
    console.error("[contact] CONTACT_DESTINATAIRE non configuré — demande enregistrée sans envoi");
  }

  return respond(200, { ok: true, message: config.success }, `${redirect}?envoi=ok`);
}
