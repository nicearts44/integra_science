"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { Locale } from "@/lib/locale";

/* ===================================================================
   Formulaire de lettre d'information — CONTEXT_MVP § 8.9.
   - case de consentement jamais pré-cochée ;
   - bouton « S'inscrire » / "Subscribe" (jamais « Envoyer ») ;
   - envoi JSON vers POST /api/newsletter, avec repli POST classique
     si JavaScript est désactivé (le <form> garde action et method) ;
   - état de confirmation identique à ?inscription=envoye|existant ;
   - bilingue : tous les messages vivent ici, dans les deux langues.
   =================================================================== */

const MESSAGES = {
  fr: {
    invalid: "Une adresse email valide et votre accord sont nécessaires.",
    server: "L'envoi n'a pas abouti. Réessayez, ou écrivez-nous directement.",
    network: "La connexion a été interrompue. Vérifiez votre connexion et réessayez.",
    emailLabel: "Votre email",
    placeholder: "prenom.nom@exemple.org",
    consent:
      "J'accepte de recevoir la lettre d'INTEGRA SCIENCE. Je peux me désinscrire à tout moment.",
    submit: "S'inscrire",
    note: "Une lettre par mois. Aucun partage d'adresse.",
    confirmTitle: "Vérifiez votre boîte de réception.",
    confirmText:
      "Un email vient de vous être envoyé. Cliquez sur le lien qu'il contient pour confirmer votre inscription. Si vous ne le voyez pas, regardez dans vos indésirables.",
    redirect: "/newsletter/",
  },
  en: {
    invalid: "A valid email address and your consent are required.",
    server: "The message did not go through. Try again, or write to us directly.",
    network: "The connection was interrupted. Check your connection and try again.",
    emailLabel: "Your email",
    placeholder: "first.last@example.org",
    consent:
      "I agree to receive the INTEGRA SCIENCE newsletter. I can unsubscribe at any time.",
    submit: "Subscribe",
    note: "One newsletter a month. Your address is never shared.",
    confirmTitle: "Check your inbox.",
    confirmText:
      "An email has just been sent to you. Click the link it contains to confirm your subscription. If you cannot see it, check your spam folder.",
    redirect: "/en/newsletter/",
  },
} as const;

function FormBlock({
  locale,
  onSubmit,
  status = "",
  sending = false,
}: {
  locale: Locale;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  status?: string;
  sending?: boolean;
}) {
  const m = MESSAGES[locale];

  return (
    <form className="newsletter-form" action="/api/newsletter" method="post" onSubmit={onSubmit}>
      <input type="hidden" name="redirect" value={m.redirect} />

      <label className="field__label" htmlFor="nl-email">
        {m.emailLabel}
      </label>
      <input
        className="input"
        id="nl-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder={m.placeholder}
      />

      <label className="consent">
        <input type="checkbox" name="consentement" required />
        {m.consent}
      </label>

      <button className="btn btn--accent" type="submit" disabled={sending} data-loading={sending}>
        {m.submit}
      </button>

      {status && (
        <p className="form__status" role="status">
          {status}
        </p>
      )}

      <p className="form__note">{m.note}</p>
    </form>
  );
}

function Confirmation({ locale }: { locale: Locale }) {
  const m = MESSAGES[locale];

  return (
    <div className="success" role="status">
      <i className="ph ph-check-circle" aria-hidden="true"></i>
      <h2 className="t-h3">{m.confirmTitle}</h2>
      <p>{m.confirmText}</p>
    </div>
  );
}

function NewsletterSaisie({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const retour = params.get("inscription");
  const m = MESSAGES[locale];

  const [done, setDone] = useState(retour === "envoye" || retour === "existant");
  const [status, setStatus] = useState(retour === "erreur" ? m.invalid : "");
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim().toLowerCase();
    const consent = (form.elements.namedItem("consentement") as HTMLInputElement).checked;

    if (!email || !consent) {
      setStatus(m.invalid);
      return;
    }

    setSending(true);
    setStatus("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consentement: consent, redirect: m.redirect }),
      });
      if (!res.ok) {
        setStatus(m.server);
        return;
      }
      setDone(true);
    } catch {
      setStatus(m.network);
    } finally {
      setSending(false);
    }
  }

  if (done) return <Confirmation locale={locale} />;
  return <FormBlock locale={locale} onSubmit={submit} status={status} sending={sending} />;
}

/**
 * Composant réutilisable (pied de page, fin d'article, /newsletter/).
 * Le repli SSR conserve le formulaire fonctionnel sans JavaScript.
 */
export default function NewsletterForm({ locale = "fr" }: { locale?: Locale }) {
  return (
    <Suspense fallback={<FormBlock locale={locale} />}>
      <NewsletterSaisie locale={locale} />
    </Suspense>
  );
}
