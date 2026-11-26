import { readSubscribers } from "@/lib/server/store";

export const dynamic = "force-dynamic";

const DATE = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeZone: "Europe/Paris",
});

function dateLisible(valeur?: string): string {
  if (!valeur) return "—";
  const d = new Date(valeur);
  return Number.isNaN(d.getTime()) ? valeur : DATE.format(d);
}

const STATUTS: Record<string, { label: string; classe: string }> = {
  confirme: { label: "Confirmé", classe: "adm-pill adm-pill--ok" },
  en_attente: { label: "En attente", classe: "adm-pill adm-pill--warn" },
  desinscrit: { label: "Désinscrit", classe: "adm-pill" },
};

export default async function NewsletterPage() {
  const abonnes = await readSubscribers();
  const confirmes = abonnes.filter((a) => a.statut === "confirme");
  const enAttente = abonnes.filter((a) => a.statut === "en_attente");
  const desinscrits = abonnes.filter((a) => a.statut === "desinscrit");
  const baseConfiguree = Boolean(process.env.DATABASE_URL);

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Newsletter</h1>
          <p>
            Inscriptions à double opt-in : un abonné n&apos;est « confirmé » qu&apos;après avoir
            cliqué dans l&apos;email de confirmation.
          </p>
        </div>
        <a className="adm-btn" href="/api/admin/export?type=newsletter">
          Exporter en CSV
        </a>
      </header>

      {!baseConfiguree ? (
        <div className="adm-notice adm-notice--warn">
          Aucune base de données n&apos;est branchée : sur l&apos;hébergement, les abonnés ne sont
          pas conservés durablement. Tant que c&apos;est le cas, le formulaire de newsletter reste
          à réparer avant toute campagne d&apos;envoi.
        </div>
      ) : null}

      <div className="adm-grid-3" style={{ marginBottom: 18 }}>
        <div className="adm-stat">
          <div className="l">Confirmés</div>
          <div className="n">{confirmes.length}</div>
        </div>
        <div className="adm-stat">
          <div className="l">En attente</div>
          <div className="n">{enAttente.length}</div>
        </div>
        <div className="adm-stat">
          <div className="l">Désinscrits</div>
          <div className="n">{desinscrits.length}</div>
        </div>
      </div>

      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2>Abonnés</h2>
          <span className="help" style={{ fontSize: 12, color: "var(--adm-subtle)" }}>
            {abonnes.length} au total
          </span>
        </div>
        <div className="adm-table-wrap">
          {abonnes.length === 0 ? (
            <p className="adm-empty">Aucun abonné enregistré sur cet environnement.</p>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Inscription</th>
                  <th>Confirmation</th>
                </tr>
              </thead>
              <tbody>
                {[...confirmes, ...enAttente, ...desinscrits].map((a) => {
                  const statut = STATUTS[a.statut] ?? { label: a.statut, classe: "adm-pill" };
                  return (
                    <tr key={a.email}>
                      <td>{a.email}</td>
                      <td>{a.nom ?? "—"}</td>
                      <td>
                        <span className={statut.classe}>{statut.label}</span>
                      </td>
                      <td className="mono">{dateLisible(a.date_inscription)}</td>
                      <td className="mono">{dateLisible(a.date_confirmation)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
