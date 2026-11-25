"use client";

import { useState } from "react";

import {
  DESCRIPTION_ROLE,
  LIBELLES_ROLE,
  ROLES,
  type Role,
} from "@/lib/admin/roles";
import type { ComptePublic } from "@/lib/server/comptes";

function dateLisible(iso?: string): string {
  if (!iso) return "—";
  return `${iso.slice(0, 10)} à ${iso.slice(11, 16)}`;
}

type Retour = { ok: boolean; texte: string } | null;

export default function AccountsPanel({
  initial,
  moiId,
}: {
  initial: ComptePublic[];
  moiId: string;
}) {
  const [comptes, setComptes] = useState<ComptePublic[]>(initial);
  const [retour, setRetour] = useState<Retour>(null);
  const [occupe, setOccupe] = useState<string | null>(null);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editeur");
  const [motDePasse, setMotDePasse] = useState("");

  async function appeler(url: string, init: RequestInit, cle: string) {
    setOccupe(cle);
    setRetour(null);
    try {
      const res = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        compte?: ComptePublic;
        comptes?: ComptePublic[];
      };
      if (!res.ok) {
        setRetour({ ok: false, texte: data.error ?? "Action refusée." });
        return null;
      }
      if (data.comptes) setComptes(data.comptes);
      return data;
    } catch {
      setRetour({ ok: false, texte: "Action impossible : réseau indisponible." });
      return null;
    } finally {
      setOccupe(null);
    }
  }

  async function creer() {
    const data = await appeler(
      "/api/admin/comptes/",
      { method: "POST", body: JSON.stringify({ nom, email, role, password: motDePasse }) },
      "creation",
    );
    if (data?.compte) {
      setComptes((liste) => [...liste, data.compte as ComptePublic]);
      setNom("");
      setEmail("");
      setMotDePasse("");
      setRetour({
        ok: true,
        texte: `Compte créé. Transmettez le mot de passe à ${data.compte.email} — il ne sera plus affiché.`,
      });
    }
  }

  async function modifier(id: string, modif: Record<string, unknown>, texte: string) {
    const data = await appeler(
      `/api/admin/comptes/${id}/`,
      { method: "PATCH", body: JSON.stringify(modif) },
      id,
    );
    if (data?.compte) {
      setComptes((liste) =>
        liste.map((c) => (c.id === id ? (data.compte as ComptePublic) : c)),
      );
      setRetour({ ok: true, texte });
    }
  }

  async function definirMotDePasse(compte: ComptePublic) {
    const choisi = window.prompt(
      `Nouveau mot de passe pour ${compte.email}\n(10 caractères minimum, lettres et chiffres)`,
    );
    if (!choisi) return;
    await modifier(compte.id, { password: choisi }, `Mot de passe redéfini pour ${compte.email}.`);
  }

  async function supprimer(compte: ComptePublic) {
    if (!window.confirm(`Supprimer définitivement le compte ${compte.email} ?`)) return;
    const data = await appeler(`/api/admin/comptes/${compte.id}/`, { method: "DELETE" }, compte.id);
    if (data) {
      setComptes((liste) => liste.filter((c) => c.id !== compte.id));
      setRetour({ ok: true, texte: `Compte supprimé : ${compte.email}.` });
    }
  }

  return (
    <>
      {retour ? (
        <div className={`adm-notice ${retour.ok ? "adm-notice--ok" : "adm-notice--erreur"}`}>
          {retour.texte}
        </div>
      ) : null}

      <div className="adm-grid-3" style={{ marginBottom: 16 }}>
        {ROLES.map((r) => (
          <div className="adm-stat" key={r}>
            <div className="l">{LIBELLES_ROLE[r]}</div>
            <div className="n">{comptes.filter((c) => c.role === r).length}</div>
            <span style={{ fontSize: 12.5, color: "var(--adm-muted)" }}>{DESCRIPTION_ROLE[r]}</span>
          </div>
        ))}
      </div>

      <section className="adm-panel" style={{ marginBottom: 16 }}>
        <div className="adm-panel-head">
          <h2>Comptes autorisés</h2>
          <span className="adm-pill adm-pill--info">{comptes.length} au total</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Personne</th>
                <th>Rôle</th>
                <th>État</th>
                <th>Dernière connexion</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {comptes.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.nom}</strong>
                    <div className="mono">{c.email}</div>
                    {c.id === moiId ? <span className="adm-pill adm-pill--ok">Vous</span> : null}
                  </td>
                  <td>
                    <select
                      className="adm-select"
                      style={{ width: "auto", minWidth: 140 }}
                      value={c.role}
                      disabled={occupe === c.id}
                      onChange={(e) =>
                        modifier(
                          c.id,
                          { role: e.target.value },
                          `Rôle de ${c.email} : ${LIBELLES_ROLE[e.target.value as Role]}.`,
                        )
                      }
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {LIBELLES_ROLE[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span
                      className={`adm-pill ${c.actif ? "adm-pill--ok" : "adm-pill--danger"}`}
                    >
                      {c.actif ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{dateLisible(c.dernierAcces)}</td>
                  <td>
                    <div className="adm-actions">
                      <button
                        type="button"
                        className="adm-btn adm-btn--ghost"
                        disabled={occupe === c.id}
                        onClick={() => definirMotDePasse(c)}
                      >
                        Mot de passe
                      </button>
                      <button
                        type="button"
                        className="adm-btn adm-btn--ghost"
                        disabled={occupe === c.id || c.id === moiId}
                        onClick={() =>
                          modifier(
                            c.id,
                            { actif: !c.actif },
                            `${c.email} ${c.actif ? "suspendu" : "réactivé"}.`,
                          )
                        }
                      >
                        {c.actif ? "Suspendre" : "Réactiver"}
                      </button>
                      <button
                        type="button"
                        className="adm-btn adm-btn--danger"
                        disabled={occupe === c.id || c.id === moiId}
                        onClick={() => supprimer(c)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2>Inviter une personne</h2>
        </div>
        <div className="adm-panel-body">
          <div className="adm-grid-2">
            <div className="adm-field">
              <label htmlFor="n-nom">Nom</label>
              <input
                id="n-nom"
                className="adm-input"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Prénom Nom"
              />
            </div>
            <div className="adm-field">
              <label htmlFor="n-email">Adresse électronique</label>
              <input
                id="n-email"
                className="adm-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="adm-field">
              <label htmlFor="n-role">Rôle</label>
              <select
                id="n-role"
                className="adm-select"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {LIBELLES_ROLE[r]}
                  </option>
                ))}
              </select>
              <span className="help">{DESCRIPTION_ROLE[role]}</span>
            </div>
            <div className="adm-field">
              <label htmlFor="n-mdp">Mot de passe provisoire</label>
              <input
                id="n-mdp"
                className="adm-input"
                type="text"
                autoComplete="new-password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
              <span className="help">
                À transmettre vous-même ; la personne le changera depuis Mon compte.
              </span>
            </div>
          </div>

          <div className="adm-actions">
            <button
              type="button"
              className="adm-btn adm-btn--primary"
              disabled={occupe === "creation" || !email || !motDePasse}
              onClick={creer}
            >
              {occupe === "creation" ? "Création…" : "Créer le compte"}
            </button>
            <span className="help">
              Un courriel d&apos;invitation n&apos;est envoyé que si l&apos;envoi d&apos;emails est
              configuré ; sinon, transmettez le mot de passe vous-même.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
