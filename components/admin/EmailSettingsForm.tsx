"use client";

import { useState } from "react";

export type EmailInitial = {
  cle_definie: boolean;
  expediteur_email: string;
  expediteur_nom: string;
  destinataire: string;
};

/** Réglages → E-mail : clé Brevo, expéditeur, destinataire des formulaires. */
export default function EmailSettingsForm({
  initial,
  basePrete,
}: {
  initial: EmailInitial;
  basePrete: boolean;
}) {
  const [cle, setCle] = useState("");
  const [cleDefinie, setCleDefinie] = useState(initial.cle_definie);
  const [expediteurEmail, setExpediteurEmail] = useState(initial.expediteur_email);
  const [expediteurNom, setExpediteurNom] = useState(initial.expediteur_nom);
  const [destinataire, setDestinataire] = useState(initial.destinataire);
  const [test, setTest] = useState(initial.destinataire);
  const [etat, setEtat] = useState<{ type: "ok" | "erreur"; texte: string } | null>(null);
  const [enregistrement, setEnregistrement] = useState(false);
  const [envoiTest, setEnvoiTest] = useState(false);

  function message(type: "ok" | "erreur", texte: string) {
    setEtat({ type, texte });
  }

  async function sauvegarder() {
    setEnregistrement(true);
    setEtat(null);
    try {
      const res = await fetch("/api/admin/settings/email/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cle_api: cle,
          expediteur_email: expediteurEmail,
          expediteur_nom: expediteurNom,
          destinataire,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        cle_definie?: boolean;
      };
      if (!res.ok) {
        message("erreur", data.error ?? "Enregistrement refusé.");
      } else {
        setCle("");
        setCleDefinie(Boolean(data.cle_definie));
        message("ok", data.message ?? "Configuration enregistrée.");
      }
    } catch {
      message("erreur", "Connexion interrompue : rien n'a été enregistré.");
    } finally {
      setEnregistrement(false);
    }
  }

  async function envoyerTest() {
    setEnvoiTest(true);
    setEtat(null);
    try {
      const res = await fetch("/api/admin/settings/email/test/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: test }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!res.ok) message("erreur", data.error ?? "L'envoi de test a échoué.");
      else message("ok", data.message ?? "Message de test envoyé.");
    } catch {
      message("erreur", "Connexion interrompue : le test n'a pas abouti.");
    } finally {
      setEnvoiTest(false);
    }
  }

  return (
    <section className="adm-panel" style={{ marginBottom: 16 }}>
      <div className="adm-panel-head">
        <h2>E-mail (Brevo)</h2>
        <span className="adm-pill">{cleDefinie ? "Clé enregistrée" : "Non configuré"}</span>
      </div>
      <div className="adm-panel-body">
        <p className="help" style={{ marginTop: 0, marginBottom: 14 }}>
          La clé API reste côté serveur (base de données) : elle n&apos;est jamais affichée ni
          transmise au navigateur. Sans clé, les formulaires enregistrent la demande mais
          n&apos;envoient aucun email.
        </p>

        {etat ? <div className={`adm-notice adm-notice--${etat.type}`}>{etat.texte}</div> : null}

        {!basePrete ? (
          <div className="adm-notice adm-notice--warn">
            La base de données n&apos;est pas configurée : la configuration email ne peut pas être
            enregistrée.
          </div>
        ) : null}

        <div className="adm-grid-2">
          <div className="adm-field wide">
            <label htmlFor="email-cle">Clé API Brevo</label>
            <input
              id="email-cle"
              className="adm-input"
              type="password"
              autoComplete="off"
              placeholder={
                cleDefinie ? "•••••••••• (clé enregistrée — laisser vide pour la conserver)" : "xkeysib-…"
              }
              value={cle}
              onChange={(e) => setCle(e.target.value)}
            />
            <span className="help">
              Brevo → SMTP &amp; API → API keys → créer une clé (droits « Envoi d&apos;emails »).
            </span>
          </div>

          <div className="adm-field">
            <label htmlFor="email-exp">Adresse d&apos;expédition</label>
            <input
              id="email-exp"
              className="adm-input"
              type="email"
              placeholder="contact@integra.science"
              value={expediteurEmail}
              onChange={(e) => setExpediteurEmail(e.target.value)}
            />
            <span className="help">Doit être un expéditeur validé dans Brevo.</span>
          </div>

          <div className="adm-field">
            <label htmlFor="email-nom">Nom d&apos;expédition</label>
            <input
              id="email-nom"
              className="adm-input"
              type="text"
              placeholder="INTEGRA SCIENCE"
              value={expediteurNom}
              onChange={(e) => setExpediteurNom(e.target.value)}
            />
          </div>

          <div className="adm-field wide">
            <label htmlFor="email-dest">Destinataire des formulaires</label>
            <input
              id="email-dest"
              className="adm-input"
              type="email"
              placeholder="boite@integra.science"
              value={destinataire}
              onChange={(e) => setDestinataire(e.target.value)}
            />
            <span className="help">
              Adresse qui reçoit les demandes envoyées depuis le site. Vide = aucun envoi.
            </span>
          </div>
        </div>

        <div className="adm-actions">
          <button
            type="button"
            className="adm-btn adm-btn--primary"
            onClick={() => void sauvegarder()}
            disabled={enregistrement || !basePrete}
          >
            {enregistrement ? "Enregistrement…" : "Enregistrer la configuration"}
          </button>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--adm-line)", margin: "18px 0" }} />

        <div className="adm-grid-2">
          <div className="adm-field">
            <label htmlFor="email-test">Adresse de test</label>
            <input
              id="email-test"
              className="adm-input"
              type="email"
              placeholder="vous@exemple.org"
              value={test}
              onChange={(e) => setTest(e.target.value)}
            />
            <span className="help">Enregistrez d&apos;abord, puis envoyez un message de contrôle.</span>
          </div>
          <div className="adm-field" style={{ alignSelf: "end" }}>
            <button
              type="button"
              className="adm-btn"
              onClick={() => void envoyerTest()}
              disabled={envoiTest || !cleDefinie}
            >
              {envoiTest ? "Envoi…" : "Envoyer un test"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
