"use client";

import { useState, type FormEvent } from "react";

/** Formulaire de connexion : un mot de passe, aucun compte à créer. */
export default function LoginForm({ devMode }: { devMode: boolean }) {
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function envoyer(event: FormEvent) {
    event.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: motDePasse }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErreur(data.error ?? "Mot de passe refusé.");
        setEnvoi(false);
        return;
      }
      window.location.assign("/admin");
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau.");
      setEnvoi(false);
    }
  }

  return (
    <form className="adm-login-form" onSubmit={envoyer}>
      {erreur ? <div className="adm-login-error">{erreur}</div> : null}
      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="mdp">Mot de passe</label>
        <input
          id="mdp"
          className="adm-input"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="adm-btn adm-btn--primary" disabled={envoi}>
        {envoi ? "Connexion…" : "Entrer"}
      </button>
      {devMode ? (
        <p className="adm-hint">
          Développement : aucun mot de passe n&apos;est défini, le mot de passe de repli est{" "}
          <code>integra</code>. En production, renseignez <code>ADMIN_PASSWORD</code>.
        </p>
      ) : null}
    </form>
  );
}
