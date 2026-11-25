"use client";

import { useState, type FormEvent } from "react";

/** Mon compte : nom affiché et changement de mot de passe. */
export default function ProfileForm({ nomInitial }: { nomInitial: string }) {
  const [nom, setNom] = useState(nomInitial);
  const [actuel, setActuel] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [retour, setRetour] = useState<{ ok: boolean; texte: string } | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function envoyer(event: FormEvent) {
    event.preventDefault();
    setRetour(null);
    if (nouveau && nouveau !== confirmation) {
      setRetour({ ok: false, texte: "Les deux mots de passe ne correspondent pas." });
      return;
    }
    setEnvoi(true);
    try {
      const res = await fetch("/api/admin/profil/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, actuel, password: nouveau || undefined }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setRetour({ ok: false, texte: data.error ?? "Enregistrement refusé." });
        return;
      }
      setActuel("");
      setNouveau("");
      setConfirmation("");
      setRetour({ ok: true, texte: "Enregistré." });
    } catch {
      setRetour({ ok: false, texte: "Enregistrement impossible : réseau indisponible." });
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form className="adm-panel" onSubmit={envoyer}>
      <div className="adm-panel-head">
        <h2>Mes informations</h2>
      </div>
      <div className="adm-panel-body">
        {retour ? (
          <div className={`adm-notice ${retour.ok ? "adm-notice--ok" : "adm-notice--erreur"}`}>
            {retour.texte}
          </div>
        ) : null}

        <div className="adm-field">
          <label htmlFor="nom">Nom affiché</label>
          <input
            id="nom"
            className="adm-input"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>

        <div className="adm-divider" />

        <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "var(--adm-muted)" }}>
          Laisser les trois champs vides pour ne pas changer de mot de passe.
        </p>

        <div className="adm-grid-3">
          <div className="adm-field">
            <label htmlFor="actuel">Mot de passe actuel</label>
            <input
              id="actuel"
              className="adm-input"
              type="password"
              autoComplete="current-password"
              value={actuel}
              onChange={(e) => setActuel(e.target.value)}
            />
          </div>
          <div className="adm-field">
            <label htmlFor="nouveau">Nouveau mot de passe</label>
            <input
              id="nouveau"
              className="adm-input"
              type="password"
              autoComplete="new-password"
              value={nouveau}
              onChange={(e) => setNouveau(e.target.value)}
            />
          </div>
          <div className="adm-field">
            <label htmlFor="confirmation">Confirmer</label>
            <input
              id="confirmation"
              className="adm-input"
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </div>
        </div>

        <div className="adm-actions">
          <button type="submit" className="adm-btn adm-btn--primary" disabled={envoi}>
            {envoi ? "Enregistrement…" : "Enregistrer"}
          </button>
          <span className="help">Changer de mot de passe ferme vos autres sessions.</span>
        </div>
      </div>
    </form>
  );
}
