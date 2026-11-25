"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AdminField, CollectionDef } from "@/lib/admin/schema";

type Champ = { fr: string; en: string };
export type AdminItem = Record<string, unknown>;

/* ------------------------------------------------------------ outils */

function estChamp(valeur: unknown): valeur is Champ {
  if (!valeur || typeof valeur !== "object" || Array.isArray(valeur)) return false;
  const cles = Object.keys(valeur as Record<string, unknown>);
  return cles.length > 0 && cles.every((c) => c === "fr" || c === "en");
}

/** Texte lisible d'une valeur, quelle que soit sa forme. */
export function texteDe(valeur: unknown): string {
  if (typeof valeur === "string") return valeur;
  if (typeof valeur === "number") return String(valeur);
  if (estChamp(valeur)) return valeur.fr || valeur.en || "";
  return "";
}

function slugifier(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function champVide(): Champ {
  return { fr: "", en: "" };
}

function valeurParDefaut(field: AdminField): unknown {
  if (field.type === "i18n-line" || field.type === "i18n-area") return champVide();
  if (field.type === "check") return false;
  if (field.type === "select") return field.options?.[0] ?? "";
  if (field.type === "date") return new Date().toISOString().slice(0, 10);
  return "";
}

export function itemVide(def: CollectionDef): AdminItem {
  const maintenant = new Date().toISOString();
  const item: AdminItem = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    cree: maintenant,
    maj: maintenant,
  };
  if (def.hasStatut) item.statut = "brouillon";
  if (def.gates) {
    item.verifie = false;
    item.anonymise = false;
  }
  for (const field of def.fields) item[field.key] = valeurParDefaut(field);
  return item;
}

/** Une entrée est-elle réellement affichée sur le site ? */
function visibilite(def: CollectionDef, item: AdminItem): { visible: boolean; raison: string } {
  if (def.hasStatut && item.statut !== "publie") {
    return { visible: false, raison: "Brouillon : rien n'est affiché sur le site." };
  }
  if (def.gates) {
    if (item.verifie !== true) {
      return { visible: false, raison: "Non vérifié : le site ne l'affiche pas." };
    }
    if (item.anonymise !== true) {
      return { visible: false, raison: "Non anonymisé : le site ne l'affiche pas." };
    }
  }
  if (def.fields.some((f) => f.key === "accord") && item.accord !== true) {
    return { visible: false, raison: "Accord écrit manquant : le profil n'est pas publié." };
  }
  return { visible: true, raison: "Visible sur le site dès le prochain déploiement." };
}

/* -------------------------------------------------------- contrôles */

function Controle({
  field,
  valeur,
  onChange,
}: {
  field: AdminField;
  valeur: unknown;
  onChange: (valeur: unknown) => void;
}) {
  const id = `f-${field.key}`;

  if (field.type === "i18n-line" || field.type === "i18n-area") {
    const champ = estChamp(valeur) ? valeur : champVide();
    return (
      <div className={`adm-field${field.wide ? " wide" : ""}`}>
        <span className="adm-label">{field.label}</span>
        <div className="adm-i18n">
          {(["fr", "en"] as const).map((langue) => (
            <div className="lang" key={langue}>
              <span>{langue === "fr" ? "Français" : "English"}</span>
              {field.type === "i18n-area" ? (
                <textarea
                  className="adm-textarea"
                  rows={field.rows ?? 4}
                  value={champ[langue] ?? ""}
                  onChange={(e) => onChange({ ...champ, [langue]: e.target.value })}
                />
              ) : (
                <input
                  className="adm-input"
                  type="text"
                  value={champ[langue] ?? ""}
                  onChange={(e) => onChange({ ...champ, [langue]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
        {field.help ? <span className="help">{field.help}</span> : null}
        {champ.fr && !champ.en ? (
          <span className="help">Anglais vide : le site affichera le français.</span>
        ) : null}
      </div>
    );
  }

  if (field.type === "check") {
    const coche = valeur === true;
    return (
      <label className={`adm-gate${coche ? " is-on" : ""}`} htmlFor={id} style={{ marginBottom: 14 }}>
        <input
          id={id}
          type="checkbox"
          checked={coche}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          <strong>{field.label}</strong>
          {field.help ? <span>{field.help}</span> : null}
        </span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div className={`adm-field${field.wide ? " wide" : ""}`}>
        <label htmlFor={id}>{field.label}</label>
        <select
          id={id}
          className="adm-select"
          value={typeof valeur === "string" ? valeur : ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {field.help ? <span className="help">{field.help}</span> : null}
      </div>
    );
  }

  if (field.type === "area") {
    return (
      <div className={`adm-field${field.wide ? " wide" : ""}`}>
        <label htmlFor={id}>{field.label}</label>
        <textarea
          id={id}
          className="adm-textarea"
          rows={field.rows ?? 4}
          value={typeof valeur === "string" ? valeur : ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.help ? <span className="help">{field.help}</span> : null}
      </div>
    );
  }

  return (
    <div className={`adm-field${field.wide ? " wide" : ""}`}>
      <label htmlFor={id}>{field.label}</label>
      <input
        id={id}
        className="adm-input"
        type={field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
        value={typeof valeur === "string" ? valeur : ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.help ? <span className="help">{field.help}</span> : null}
    </div>
  );
}

/* ---------------------------------------------------------- éditeur */

export default function ListEditor({
  def,
  initial,
}: {
  def: CollectionDef;
  initial: AdminItem[];
}) {
  const [items, setItems] = useState<AdminItem[]>(initial);
  const [selection, setSelection] = useState<string | null>(
    initial[0] ? String(initial[0].id) : null,
  );
  const [recherche, setRecherche] = useState("");
  const [etat, setEtat] = useState<{ type: "ok" | "erreur" | "info"; texte: string } | null>(null);
  const [enregistrement, setEnregistrement] = useState(false);
  const [modifie, setModifie] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const courant = items.find((i) => i.id === selection) ?? null;

  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => texteDe(item[def.titleField]).toLowerCase().includes(q));
  }, [items, recherche, def.titleField]);

  const modifier = useCallback((id: string, changement: Partial<AdminItem>) => {
    setItems((liste) =>
      liste.map((item) =>
        item.id === id ? { ...item, ...changement, maj: new Date().toISOString() } : item,
      ),
    );
    setModifie(true);
    setEtat(null);
  }, []);

  const sauvegarder = useCallback(async () => {
    setEnregistrement(true);
    setEtat(null);

    // Contrôle des champs obligatoires quand l'entrée est publiée.
    for (const item of itemsRef.current) {
      const publie = !def.hasStatut || item.statut === "publie";
      if (!publie) continue;
      for (const field of def.fields) {
        if (!field.required) continue;
        if (!texteDe(item[field.key]).trim()) {
          setEtat({
            type: "erreur",
            texte: `« ${field.label} » est obligatoire pour publier : « ${texteDe(item[def.titleField]) || "sans titre"} ».`,
          });
          setSelection(String(item.id));
          setEnregistrement(false);
          return;
        }
      }
    }

    try {
      const res = await fetch(`/api/admin/content/${def.doc}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pointer: def.pointer, value: itemsRef.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!res.ok) {
        setEtat({ type: "erreur", texte: data.error ?? "Enregistrement refusé." });
      } else {
        setEtat({ type: "ok", texte: data.message ?? "Enregistré." });
        setModifie(false);
      }
    } catch {
      setEtat({ type: "erreur", texte: "Connexion interrompue : rien n'a été enregistré." });
    } finally {
      setEnregistrement(false);
    }
  }, [def]);

  useEffect(() => {
    function surTouche(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void sauvegarder();
      }
    }
    function avantFermeture(event: BeforeUnloadEvent) {
      if (!modifie) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("keydown", surTouche);
    window.addEventListener("beforeunload", avantFermeture);
    return () => {
      window.removeEventListener("keydown", surTouche);
      window.removeEventListener("beforeunload", avantFermeture);
    };
  }, [sauvegarder, modifie]);

  function ajouter() {
    const item = itemVide(def);
    setItems([item, ...items]);
    setSelection(String(item.id));
    setModifie(true);
    setEtat(null);
  }

  function dupliquer() {
    if (!courant) return;
    const copie: AdminItem = {
      ...JSON.parse(JSON.stringify(courant)),
      id: crypto.randomUUID(),
      maj: new Date().toISOString(),
    };
    if (def.hasStatut) copie.statut = "brouillon";
    if (def.gates) {
      copie.verifie = false;
      copie.anonymise = false;
    }
    if (typeof copie.slug === "string") copie.slug = `${copie.slug}-copie`;
    setItems([copie, ...items]);
    setSelection(String(copie.id));
    setModifie(true);
  }

  function supprimer() {
    if (!courant) return;
    const titre = texteDe(courant[def.titleField]);
    if (!window.confirm(`Supprimer définitivement « ${titre || "cette entrée"} » ?`)) return;
    const restants = items.filter((i) => i.id !== courant.id);
    setItems(restants);
    setSelection(restants[0] ? String(restants[0].id) : null);
    setModifie(true);
  }

  function genererSlug() {
    if (!courant || !def.slugFrom) return;
    const base = texteDe(courant[def.slugFrom]);
    if (!base) return;
    modifier(String(courant.id), { slug: slugifier(base) });
  }

  const etatVisibilite = courant ? visibilite(def, courant) : null;

  return (
    <div className="adm-split">
      {/* ------------------------------------------------ colonne liste */}
      <div className="adm-panel adm-list">
        <div className="adm-list-tools">
          <input
            className="adm-input"
            type="search"
            placeholder="Rechercher…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            aria-label="Rechercher dans la liste"
          />
          <div className="adm-actions" style={{ marginTop: 8 }}>
            <button type="button" className="adm-btn adm-btn--primary" onClick={ajouter}>
              + Nouvelle entrée
            </button>
          </div>
        </div>

        <div className="adm-items">
          {filtres.length === 0 ? (
            <p className="adm-empty">
              Aucune entrée.{recherche ? " Aucun résultat pour cette recherche." : ""}
            </p>
          ) : (
            filtres.map((item) => {
              const v = visibilite(def, item);
              return (
                <button
                  type="button"
                  key={String(item.id)}
                  className={`adm-item${item.id === selection ? " is-on" : ""}`}
                  onClick={() => setSelection(String(item.id))}
                >
                  <span className="adm-item-title">
                    {texteDe(item[def.titleField]) || "(sans titre)"}
                  </span>
                  {def.subtitleField ? (
                    <span className="adm-item-sub">{texteDe(item[def.subtitleField])}</span>
                  ) : null}
                  <span className="adm-item-flags">
                    {def.hasStatut ? (
                      <span className={`adm-pill${item.statut === "publie" ? " adm-pill--ok" : ""}`}>
                        {item.statut === "publie" ? "Publié" : "Brouillon"}
                      </span>
                    ) : null}
                    {def.gates ? (
                      <>
                        <span className={`adm-pill${item.verifie ? " adm-pill--ok" : " adm-pill--warn"}`}>
                          {item.verifie ? "Vérifié" : "À vérifier"}
                        </span>
                        <span className={`adm-pill${item.anonymise ? " adm-pill--ok" : " adm-pill--warn"}`}>
                          {item.anonymise ? "Anonymisé" : "À anonymiser"}
                        </span>
                      </>
                    ) : null}
                    {!v.visible ? null : <span className="adm-pill adm-pill--info">En ligne</span>}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ---------------------------------------------- colonne éditeur */}
      <div>
        {etat ? (
          <div className={`adm-notice adm-notice--${etat.type === "ok" ? "ok" : etat.type === "erreur" ? "erreur" : "info"}`}>
            {etat.texte}
          </div>
        ) : null}

        {!courant ? (
          <div className="adm-panel">
            <p className="adm-empty">
              Sélectionnez une entrée à gauche, ou créez la première avec « Nouvelle entrée ».
            </p>
          </div>
        ) : (
          <div className="adm-panel">
            <div className="adm-editor-head">
              <span className="t">
                {texteDe(courant[def.titleField]) || "Nouvelle entrée"}
                {modifie ? " ·" : ""}
              </span>
              <div className="adm-actions">
                <button type="button" className="adm-btn adm-btn--ghost" onClick={dupliquer}>
                  Dupliquer
                </button>
                <button type="button" className="adm-btn adm-btn--danger" onClick={supprimer}>
                  Supprimer
                </button>
              </div>
            </div>

            <div className="adm-editor-body">
              {etatVisibilite ? (
                <div
                  className={`adm-notice adm-notice--${etatVisibilite.visible ? "ok" : "warn"}`}
                >
                  {etatVisibilite.raison}
                </div>
              ) : null}

              {def.hasStatut ? (
                <div className="adm-status-row">
                  <div className="adm-field" style={{ marginBottom: 0 }}>
                    <label htmlFor="statut">Statut</label>
                    <select
                      id="statut"
                      className="adm-select"
                      value={String(courant.statut ?? "brouillon")}
                      onChange={(e) => modifier(String(courant.id), { statut: e.target.value })}
                    >
                      <option value="brouillon">Brouillon — invisible</option>
                      <option value="publie">Publié — visible si les conditions sont remplies</option>
                    </select>
                  </div>
                  <p className="help" style={{ fontSize: 12, color: "var(--adm-subtle)", maxWidth: "38ch" }}>
                    Enregistrer un brouillon ne change rien sur le site public.
                  </p>
                </div>
              ) : null}

              {def.gates ? (
                <div className="adm-gates">
                  <label className={`adm-gate${courant.verifie ? " is-on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={courant.verifie === true}
                      onChange={(e) => modifier(String(courant.id), { verifie: e.target.checked })}
                    />
                    <span>
                      <strong>Vérifié</strong>
                      <span>Relu par un pôle qui n&apos;a pas réalisé le travail.</span>
                    </span>
                  </label>
                  <label className={`adm-gate${courant.anonymise ? " is-on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={courant.anonymise === true}
                      onChange={(e) => modifier(String(courant.id), { anonymise: e.target.checked })}
                    />
                    <span>
                      <strong>Anonymisé</strong>
                      <span>Accord conservé, aucune donnée identifiante reprise.</span>
                    </span>
                  </label>
                </div>
              ) : null}

              <div className="adm-grid-2">
                {def.fields.map((field) => (
                  <Controle
                    key={field.key}
                    field={field}
                    valeur={courant[field.key] ?? valeurParDefaut(field)}
                    onChange={(valeur) => modifier(String(courant.id), { [field.key]: valeur })}
                  />
                ))}
              </div>

              {def.slugFrom ? (
                <div className="adm-actions" style={{ marginTop: 4 }}>
                  <button type="button" className="adm-btn adm-btn--ghost" onClick={genererSlug}>
                    Régénérer l&apos;identifiant depuis le titre
                  </button>
                </div>
              ) : null}
            </div>

            <div className="adm-editor-foot">
              <span className="help" style={{ fontSize: 12, color: "var(--adm-subtle)" }}>
                {modifie ? "Modifications non enregistrées." : "Tout est enregistré."}
              </span>
              <div className="adm-actions">
                <button
                  type="button"
                  className="adm-btn adm-btn--primary"
                  onClick={() => void sauvegarder()}
                  disabled={enregistrement}
                >
                  {enregistrement ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
