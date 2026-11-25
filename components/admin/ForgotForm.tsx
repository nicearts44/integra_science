"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

/** Demande d'un lien de réinitialisation. */
export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function envoyer(event: FormEvent) {
    event.preventDefault();
    setEnvoi(true);
    setErreur(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/mot-de-passe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setErreur(data.error ?? "Demande refusée.");
      } else {
        setMessage(data.message ?? "Demande enregistrée.");
      }
    } catch {
      setErreur("Demande impossible. Vérifiez votre réseau.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form className="adm-login-form" onSubmit={envoyer}>
      {erreur ? <div className="adm-login-error">{erreur}</div> : null}
      {message ? <div className="adm-notice adm-notice--info">{message}</div> : null}

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="email">Adresse de votre compte</label>
        <input
          id="email"
          className="adm-input"
          type="email"
          autoComplete="username"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="adm-btn adm-btn--primary" disabled={envoi}>
        {envoi ? "Envoi…" : "Recevoir un lien"}
      </button>

      <p className="adm-hint" style={{ marginTop: 0 }}>
        <Link href="/admin/login/">Revenir à la connexion</Link>
      </p>
    </form>
  );
}
