"use client";

import { useState } from "react";

import type { SettingsGroup } from "@/lib/admin/schema";

/** Formulaire des réglages du site : un champ = une clé de content/reglages.json. */
export default function SettingsForm({
  groups,
  initial,
}: {
  groups: SettingsGroup[];
  initial: Record<string, string>;
}) {
  const [valeurs, setValeurs] = useState<Record<string, string>>(initial);
  const [etat, setEtat] = useState<{ type: "ok" | "erreur"; texte: string } | null>(null);
  const [enregistrement, setEnregistrement] = useState(false);

  function changer(cle: string, valeur: string) {
    setValeurs((v) => ({ ...v, [cle]: valeur }));
    setEtat(null);
  }

  async function sauvegarder() {
    setEnregistrement(true);
    setEtat(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: valeurs }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!res.ok) setEtat({ type: "erreur", texte: data.error ?? "Enregistrement refusé." });
      else setEtat({ type: "ok", texte: data.message ?? "Enregistré." });
    } catch {
      setEtat({ type: "erreur", texte: "Connexion interrompue : rien n'a été enregistré." });
    } finally {
      setEnregistrement(false);
    }
  }

  return (
    <div>
      {etat ? <div className={`adm-notice adm-notice--${etat.type}`}>{etat.texte}</div> : null}

      {groups.map((groupe) => (
        <section className="adm-panel" key={groupe.title} style={{ marginBottom: 16 }}>
          <div className="adm-panel-head">
            <h2>{groupe.title}</h2>
          </div>
          <div className="adm-panel-body">
            {groupe.intro ? (
              <p className="help" style={{ marginTop: 0, marginBottom: 14 }}>
                {groupe.intro}
              </p>
            ) : null}
            <div className="adm-grid-2">
              {groupe.fields.map((field) => (
                <div className={`adm-field${field.wide ? " wide" : ""}`} key={field.key}>
                  <label htmlFor={`set-${field.key}`}>{field.label}</label>
                  <input
                    id={`set-${field.key}`}
                    className="adm-input"
                    type={field.type === "url" ? "url" : "text"}
                    value={valeurs[field.key] ?? ""}
                    onChange={(e) => changer(field.key, e.target.value)}
                  />
                  {field.help ? <span className="help">{field.help}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="adm-actions">
        <button
          type="button"
          className="adm-btn adm-btn--primary"
          onClick={() => void sauvegarder()}
          disabled={enregistrement}
        >
          {enregistrement ? "Enregistrement…" : "Enregistrer les réglages"}
        </button>
      </div>
    </div>
  );
}
