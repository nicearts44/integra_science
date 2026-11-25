import type { Metadata } from "next";
import Link from "next/link";

import { StudioClient } from "./StudioClient";

export const metadata: Metadata = {
  title: "Studio — INTEGRA SCIENCE",
  robots: { index: false, follow: false },
};

/* Mêmes variables que sanity.config.ts : le Studio ne peut lire que les
   NEXT_PUBLIC_*, l'alias SANITY_STUDIO_* reste accepté côté serveur. */
const configured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID,
);

export default function StudioPage() {
  if (!configured) return <StudioAttente />;
  return <StudioClient />;
}

/**
 * Écran d'attente tant que le projet Sanity n'existe pas.
 * Le site public continue de fonctionner sur lib/content/* : le Studio n'est
 * qu'une couche d'édition, jamais une dépendance de rendu.
 */
function StudioAttente() {
  return (
    <div className="container container--narrow" style={{ padding: "var(--s16) 0" }}>
      <h1 className="t-h2">Le Studio n&apos;est pas encore relié à un projet Sanity.</h1>
      <p className="t-body-sm t-muted" style={{ marginTop: "var(--s4)" }}>
        Le site public fonctionne sans lui : tout le contenu est dans{" "}
        <code>lib/content/</code>. Pour activer l&apos;édition sans code :
      </p>

      <ol className="bullets" style={{ marginTop: "var(--s6)" }}>
        <li>
          Créer un projet gratuit sur <code>sanity.io/manage</code> — noter le{" "}
          <strong>project ID</strong> et le nom du <strong>dataset</strong>.
        </li>
        <li>
          Les variables du Studio doivent être préfixées <code>NEXT_PUBLIC_</code> :
          elles sont lues dans le navigateur.
        </li>
        <li>
          Créer un token de lecture (rôle <em>Viewer</em>) et le garder hors du dépôt.
        </li>
        <li>
          Renseigner dans <code>.env.local</code> :
          <pre
            className="t-mono"
            style={{
              marginTop: "var(--s3)",
              padding: "var(--s4)",
              background: "var(--surface-2)",
              borderRadius: "var(--r2)",
              overflowX: "auto",
            }}
          >{`NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_PROJECT_ID=xxxxxxxx
SANITY_DATASET=production
SANITY_READ_TOKEN=sk...`}</pre>
        </li>
        <li>Redémarrer le serveur : cette page devient le Studio.</li>
      </ol>

      <p className="t-body-sm t-muted" style={{ marginTop: "var(--s8)" }}>
        Les schémas des neuf types de documents sont déjà écrits dans{" "}
        <code>sanity/schemas/index.ts</code>.
      </p>

      <p style={{ marginTop: "var(--s8)" }}>
        <Link className="link-arrow" href="/">
          Retour au site <i className="ph ph-arrow-right" aria-hidden="true"></i>
        </Link>
      </p>
    </div>
  );
}
