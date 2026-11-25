"use client";

import { useState, type FormEvent } from "react";

/**
 * Création du compte propriétaire, à la première ouverture du back-office.
 * La clé d'installation est la valeur ADMIN_PASSWORD du serveur : elle ne
 * sert qu'ici, jamais à se connecter.
 */
export default function InstallForm({ cleRequise }: { cleRequise: boolean }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [cle, setCle] = useState("");
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
      const res = await fetch("/api/admin/install/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, password: motDePasse, cle }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErreur(data.error ?? "Création impossible.");
        setEnvoi(false);
        return;
      }
      window.location.assign("/admin/");
    } catch {
      setErreur("Création impossible. Vérifiez votre réseau.");
      setEnvoi(false);
    }
  }

  return (
    <form className="adm-login-form" onSubmit={envoyer}>
      {erreur ? <div className="adm-login-error">{erreur}</div> : null}

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="nom">Votre nom</label>
        <input
          id="nom"
          className="adm-input"
          autoComplete="name"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nicéphore AGOSSOU"
          required
        />
      </div>

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="email">Adresse électronique</label>
        <input
          id="email"
          className="adm-input"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <span className="help">Elle servira à vous connecter et à recevoir les liens de secours.</span>
      </div>

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="mdp">Mot de passe</label>
        <input
          id="mdp"
          className="adm-input"
          type="password"
          autoComplete="new-password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <span className="help">10 caractères minimum, avec des lettres et des chiffres.</span>
      </div>

      <div className="adm-field" style={{ marginBottom: 0 }}>
        <label htmlFor="confirmation">Confirmer le mot de passe</label>
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

      {cleRequise ? (
        <div className="adm-field" style={{ marginBottom: 0 }}>
          <label htmlFor="cle">Clé d&apos;installation</label>
          <input
            id="cle"
            className="adm-input"
            type="password"
            autoComplete="off"
            value={cle}
            onChange={(e) => setCle(e.target.value)}
            required
          />
          <span className="help">
            La valeur de <code>ADMIN_PASSWORD</code> définie sur l&apos;hébergement. Elle empêche
            qu&apos;un inconnu s&apos;empare du premier compte.
          </span>
        </div>
      ) : null}

      <button type="submit" className="adm-btn adm-btn--primary" disabled={envoi}>
        {envoi ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
