/**
 * Envoi d'emails via l'API Brevo.
 *
 * La configuration (clé API, expéditeur, destinataire) se saisit dans le
 * back-office → Réglages → E-mail, et vit en base. Sans clé, l'envoi échoue :
 * la demande reste enregistrée et un message neutre est renvoyé
 * (« un échec SMTP ne doit jamais perdre une demande »).
 */
import { lireParametresEmail } from "./parametres";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

type Mail = { to: string; subject: string; text: string; replyTo?: string };

/** Vrai dès qu'une clé API est enregistrée : l'envoi est possible. */
export async function emailConfigured(): Promise<boolean> {
  const config = await lireParametresEmail();
  return Boolean(config.cle_api);
}

/** Destinataire des formulaires du site, ou chaîne vide. */
export async function destinataireFormulaires(): Promise<string> {
  const config = await lireParametresEmail();
  return config.destinataire;
}

export async function sendMail(mail: Mail): Promise<boolean> {
  const config = await lireParametresEmail();
  if (!config.cle_api) return false;

  const from = config.expediteur_email || "noreply@integra.science";
  const nom = config.expediteur_nom || "INTEGRA SCIENCE";

  try {
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.cle_api,
      },
      body: JSON.stringify({
        sender: { name: nom, email: from },
        to: [{ email: mail.to }],
        ...(mail.replyTo ? { replyTo: { email: mail.replyTo } } : {}),
        subject: mail.subject,
        textContent: mail.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[email] Brevo ${res.status} — ${detail.slice(0, 300)}`);
    }
    return res.ok;
  } catch (err) {
    console.error("[email] envoi impossible", err);
    return false;
  }
}
