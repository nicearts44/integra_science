import { listerSoumissions } from "@/lib/server/store";

export const dynamic = "force-dynamic";

const LIBELLES: Record<string, string> = {
  projet: "Projet",
  candidature: "Candidature",
  partenariat: "Partenariat",
};

const DATE = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

function dateLisible(valeur: string): string {
  const d = new Date(valeur);
  return Number.isNaN(d.getTime()) ? valeur : DATE.format(d);
}

const CLES_TECHNIQUES = new Set(["societe", "kind", "recu_le", "receivedAt", "ip", "origine"]);

export default async function MessagesPage() {
  const soumissions = await listerSoumissions();
  const baseConfiguree = Boolean(process.env.DATABASE_URL);

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Messages reçus</h1>
          <p>
            Les trois formulaires du site : projet, candidature et partenariat. Chaque envoi est
            aussi transmis par email à l&apos;adresse de contact.
          </p>
        </div>
        <a className="adm-btn" href="/api/admin/export?type=messages">
          Exporter en CSV
        </a>
      </header>

      {!baseConfiguree ? (
        <div className="adm-notice adm-notice--warn">
          Aucune base de données n&apos;est branchée : sur l&apos;hébergement, ces messages ne sont
          pas conservés durablement. En local, ils restent dans <code>data/</code>. L&apos;email
          reste la source fiable tant que la base n&apos;est pas en place.
        </div>
      ) : null}

      <div className="adm-panel">
        <div className="adm-table-wrap">
          {soumissions.length === 0 ? (
            <p className="adm-empty">Aucun message enregistré sur cet environnement.</p>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Reçu</th>
                  <th>Formulaire</th>
                  <th>De</th>
                  <th>Détail</th>
                </tr>
              </thead>
              <tbody>
                {soumissions.map((s) => {
                  const nom = String(s.donnees.nom ?? "—");
                  const email = String(s.donnees.email ?? "");
                  return (
                    <tr key={`${s.kind}/${s.fichier}`}>
                      <td className="mono">{dateLisible(s.date)}</td>
                      <td>{LIBELLES[s.kind] ?? s.kind}</td>
                      <td>
                        <strong>{nom}</strong>
                        {email ? (
                          <>
                            <br />
                            <a href={`mailto:${email}`}>{email}</a>
                          </>
                        ) : null}
                      </td>
                      <td>
                        <details>
                          <summary>Voir le message</summary>
                          <dl style={{ margin: "8px 0 0", display: "grid", gap: 6 }}>
                            {Object.entries(s.donnees)
                              .filter(([cle]) => !CLES_TECHNIQUES.has(cle))
                              .map(([cle, valeur]) => (
                                <div key={cle}>
                                  <dt
                                    style={{
                                      fontSize: 11,
                                      textTransform: "uppercase",
                                      letterSpacing: ".05em",
                                      color: "var(--adm-subtle)",
                                    }}
                                  >
                                    {cle.replace(/_/g, " ")}
                                  </dt>
                                  <dd style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                                    {String(valeur ?? "")}
                                  </dd>
                                </div>
                              ))}
                          </dl>
                        </details>
                      </td>
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
