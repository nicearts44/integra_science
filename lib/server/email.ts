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

export type MailResult =
  | { ok: true }
  | { ok: false; status: number; code: string; message: string };

/** Traduit le refus de Brevo en cause exploitable dans le back-office. */
function expliquer(status: number, code: string, brut: string): string {
  const texte = `${code} ${brut}`.toLowerCase();

  if (texte.includes("unrecognised ip") || texte.includes("authorised_ips")) {
    return (
      "Brevo refuse l'envoi depuis une adresse IP non autorisée : la clé API est restreinte par IP. " +
      "Sur Brevo : Security → Authorised IPs, désactivez la restriction (les IP de Vercel changent)."
    );
  }
  if (texte.includes("not enough credits") || texte.includes("credit")) {
    return "Crédits d'envoi épuisés sur le compte Brevo.";
  }
  if (status === 401 || texte.includes("key not found")) {
    return "Brevo refuse la clé API (clé invalide, révoquée ou expirée).";
  }
  if (texte.includes("sender") && (texte.includes("not valid") || texte.includes("invalid"))) {
    return (
      "L'adresse d'expédition n'est pas validée dans Brevo : ajoutez-la dans Senders, " +
      "Domaines & IP (ou authentifiez le domaine), puis réessayez."
    );
  }
  return brut
    ? `Brevo a refusé l'envoi (HTTP ${status}) : ${brut}`
    : `Brevo a refusé l'envoi (HTTP ${status}).`;
}

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
  const resultat = await sendMailDetail(mail);
  return resultat.ok;
}

/** Comme sendMail, mais renvoie la cause exacte du refus de Brevo. */
export async function sendMailDetail(mail: Mail): Promise<MailResult> {
  const config = await lireParametresEmail();
  if (!config.cle_api) {
    return { ok: false, status: 0, code: "config", message: "Aucune clé API Brevo enregistrée." };
  }

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
      const corps = await res.text().catch(() => "");
      console.error(`[email] Brevo ${res.status} — ${corps.slice(0, 300)}`);

      let code = "";
      let brut = corps;
      try {
        const json = JSON.parse(corps) as { code?: unknown; message?: unknown };
        if (typeof json.code === "string") code = json.code;
        if (typeof json.message === "string") brut = json.message;
      } catch {
        /* corps non JSON : on garde le texte brut */
      }

      return {
        ok: false,
        status: res.status,
        code,
        message: expliquer(res.status, code, brut.slice(0, 300)),
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] envoi impossible", err);
    return {
      ok: false,
      status: 0,
      code: "reseau",
      message: "Impossible de joindre Brevo depuis le serveur (réseau ou DNS).",
    };
  }
}
