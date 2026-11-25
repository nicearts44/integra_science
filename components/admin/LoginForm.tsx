"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

/** Connexion : adresse électronique + mot de passe du compte. */
export default function LoginForm({ installer }: { installer: boolean }) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function envoyer(event: FormEvent) {
    event.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: motDePasse }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        installer?: boolean;
      };
      if (!res.ok) {
        setErreur(data.error ?? "Connexion refusée.");
        setEnvoi(false);
        return;
      }
      window.location.assign("/admin/");
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau.");
      setEnvoi(false);
    }
  }

  return (
    <form className="adm-login-form" onSubmit={envoyer}>
      {erreur ? (
        <div className="adm-login-error">
          {erreur}
          {installer ? (
            <>
              {" "}
              <Link href="/admin/installer/">Créer le compte propriétaire</Link>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="email">Adresse électronique</label>
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

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="mdp">Mot de passe</label>
        <input
          id="mdp"
          className="adm-input"
          type="password"
          autoComplete="current-password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="adm-btn adm-btn--primary" disabled={envoi}>
        {envoi ? "Connexion…" : "Entrer"}
      </button>

      <p className="adm-hint" style={{ marginTop: 0 }}>
        <Link href="/admin/mot-de-passe/">Mot de passe oublié ?</Link>
      </p>
    </form>
  );
}
