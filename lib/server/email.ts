/**
 * Envoi d'emails via l'API Brevo (§ 8.5 — SMTP obligatoire en production).
 * Sans configuration, l'envoi échoue : la demande reste enregistrée et un
 * message neutre est renvoyé (« un échec SMTP ne doit jamais perdre une demande »).
 */
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

type Mail = { to: string; subject: string; text: string; replyTo?: string };

export function emailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.CONTACT_DESTINATAIRE);
}

export async function sendMail(mail: Mail): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.BREVO_FROM_EMAIL || "noreply@integra.science";
  if (!apiKey) return false;

  try {
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: "INTEGRA SCIENCE", email: from },
        to: [{ email: mail.to }],
        ...(mail.replyTo ? { replyTo: { email: mail.replyTo } } : {}),
        subject: mail.subject,
        textContent: mail.text,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[email] envoi impossible", err);
    return false;
  }
}
