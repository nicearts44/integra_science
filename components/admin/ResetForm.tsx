"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

/** Consomme le lien reçu par courriel : nouveau mot de passe, session ouverte. */
export default function ResetForm({ token }: { token: string }) {
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function envoyer(event: FormEvent) {
    event.preventDefault();
    if (motDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch("/api/admin/reinitialiser/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: motDePasse }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErreur(data.error ?? "Réinitialisation impossible.");
        setEnvoi(false);
        return;
      }
      window.location.assign("/admin/");
    } catch {
      setErreur("Réinitialisation impossible. Vérifiez votre réseau.");
      setEnvoi(false);
    }
  }

  if (!token) {
    return (
      <div className="adm-notice adm-notice--warn">
        Ce lien est incomplet. <Link href="/admin/mot-de-passe/">Demandez-en un nouveau</Link>.
      </div>
    );
  }

  return (
    <form className="adm-login-form" onSubmit={envoyer}>
      {erreur ? <div className="adm-login-error">{erreur}</div> : null}

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="mdp">Nouveau mot de passe</label>
        <input
          id="mdp"
          className="adm-input"
          type="password"
          autoComplete="new-password"
          autoFocus
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <span className="help">10 caractères minimum, avec des lettres et des chiffres.</span>
      </div>

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="confirmation">Confirmer</label>
        <input
          id="confirmation"
          className="adm-input"
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="adm-btn adm-btn--primary" disabled={envoi}>
        {envoi ? "Enregistrement…" : "Choisir ce mot de passe"}
      </button>
    </form>
  );
}
