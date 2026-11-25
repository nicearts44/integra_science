import Link from "next/link";

import { compteurs } from "@/lib/content/editorial";
import { exigerAdmin } from "@/lib/server/admin-auth";
import { nombreComptes } from "@/lib/server/comptes";
import { modeEcriture, repoGithub } from "@/lib/server/editorial-store";

export const dynamic = "force-dynamic";

function Etat({ ok, texte }: { ok: boolean; texte: string }) {
  return (
    <tr>
      <td>
        <span className={`adm-pill ${ok ? "adm-pill--ok" : "adm-pill--warn"}`}>
          {ok ? "Prêt" : "À configurer"}
        </span>
      </td>
      <td>{texte}</td>
    </tr>
  );
}

export default async function DashboardPage() {
  const compte = await exigerAdmin();
  const c = compteurs();
  const mode = modeEcriture();
  const nbComptes = await nombreComptes();
  const comptes = nbComptes > 0;

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Tableau de bord</h1>
          <p>
            Tout ce qui se lit sur le site se gère ici. Les formulaires et la lettre
            d&apos;information restent consultables dans leurs sections, sans toucher au code.
          </p>
        </div>
        <Link className="adm-btn" href="/" target="_blank" rel="noreferrer">
          Ouvrir le site ↗
        </Link>
      </header>

      <div className="adm-grid-3" style={{ marginBottom: 18 }}>
        <div className="adm-stat">
          <div className="l">Publications</div>
          <div className="n">{c.publications}</div>
          <Link href="/admin/publications">Gérer →</Link>
        </div>
        <div className="adm-stat">
          <div className="l">Cas d&apos;usage</div>
          <div className="n">{c.casUsage}</div>
          <Link href="/admin/cas-usage">Gérer →</Link>
        </div>
        <div className="adm-stat">
          <div className="l">Actualités</div>
          <div className="n">{c.actualites}</div>
          <Link href="/admin/actualites">Gérer →</Link>
        </div>
        <div className="adm-stat">
          <div className="l">Membres</div>
          <div className="n">{c.membres}</div>
          <Link href="/admin/reseau/membres">Gérer →</Link>
        </div>
        <div className="adm-stat">
          <div className="l">En ligne</div>
          <div className="n">{c.publies}</div>
          <span className="help" style={{ fontSize: 12, color: "var(--adm-subtle)" }}>
            Contenus visibles sur le site public
          </span>
        </div>
        <div className="adm-stat">
          <div className="l">Accès</div>
          <div className="n">{nbComptes}</div>
          <span className="help" style={{ fontSize: 12, color: "var(--adm-subtle)" }}>
            {compte.role === "proprietaire" ? (
              <Link href="/admin/comptes">Gérer les comptes →</Link>
            ) : (
              "Comptes autorisés"
            )}
          </span>
        </div>
      </div>

      <div className="adm-grid-2">
        <section className="adm-panel">
          <div className="adm-panel-head">
            <h2>Comment un contenu arrive sur le site</h2>
          </div>
          <div className="adm-panel-body">
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10, fontSize: 14 }}>
              <li>
                Vous écrivez l&apos;entrée, en français et en anglais. Un brouillon ne s&apos;affiche
                jamais.
              </li>
              <li>
                Vous cochez <strong>Vérifié</strong> et <strong>Anonymisé</strong> pour les
                références : les deux sont exigés avant toute parution.
              </li>
              <li>Vous passez le statut sur « Publié ».</li>
              <li>
                Vous enregistrez. {mode === "github"
                  ? "Un commit est créé dans le dépôt et Vercel reconstruit le site."
                  : mode === "local"
                    ? "Le fichier content/ est mis à jour ; le site se recharge en local."
                    : "L'écriture n'est pas configurée sur cet environnement."}
              </li>
            </ol>
          </div>
        </section>

        <section className="adm-panel">
          <div className="adm-panel-head">
            <h2>État des branchements</h2>
          </div>
          <div className="adm-panel-body">
            <table className="adm-table">
              <tbody>
                <Etat
                  ok={comptes}
                  texte={
                    comptes
                      ? "Comptes du back-office (accès par adresse et mot de passe)"
                      : "Aucun compte : ouvrez /admin pour créer le compte propriétaire"
                  }
                />
                <Etat
                  ok={Boolean(process.env.ADMIN_SECRET)}
                  texte={
                    process.env.ADMIN_SECRET
                      ? "Clé de signature des sessions (ADMIN_SECRET)"
                      : "ADMIN_SECRET non défini : les sessions retombent sur ADMIN_PASSWORD"
                  }
                />
                <Etat ok={mode === "github"} texte={`Enregistrement : ${mode === "github" ? repoGithub() : mode === "local" ? "disque local" : "non configuré"}`} />
                <Etat ok={Boolean(process.env.BREVO_API_KEY && process.env.CONTACT_DESTINATAIRE)} texte="Envoi des emails (Brevo)" />
                <Etat ok={Boolean(process.env.DATABASE_URL)} texte="Base de données (formulaires et abonnés)" />
              </tbody>
            </table>
            <p className="help" style={{ marginBottom: 0, fontSize: 12.5, color: "var(--adm-subtle)" }}>
              Les messages et les abonnés ne sont conservés durablement qu&apos;avec une base de
              données. Sans elle, l&apos;hébergement les perd à chaque redéploiement.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
