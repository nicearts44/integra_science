import Link from "next/link";

import { findByToken, majStatutAbonne } from "@/lib/server/store";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Confirmer votre inscription",
  description: "Confirmation de l'inscription à la lettre d'INTEGRA SCIENCE.",
  path: "/newsletter/confirmer/",
  index: false,
});

/** Double opt-in : un lien non utilisé sous 7 jours n'active rien (§ 8.9). */
const SEPT_JOURS_MS = 7 * 24 * 60 * 60 * 1000;

type Props = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function NewsletterConfirmerPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const jeton = typeof token === "string" ? token : "";

  const abonne = jeton ? await findByToken(jeton) : undefined;
  const age = abonne ? Date.now() - Date.parse(abonne.date_inscription) : Number.POSITIVE_INFINITY;
  const expire = !abonne || Number.isNaN(age) || age > SEPT_JOURS_MS;

  // Jamais de révélation d'état : un lien invalide et un lien expiré
  // affichent exactement le même message (§ 8.9).
  const valide = !!abonne && !expire && abonne.statut !== "desinscrit";

  if (valide && abonne) {
    await majStatutAbonne(abonne.token, "confirme", new Date().toISOString());
  }

  return (
    <section className="section">
      <div className="container container--narrow">
        {valide ? (
          <div className="success" role="status">
            <i className="ph ph-check-circle" aria-hidden="true"></i>
            <h1 className="t-h3">Inscription confirmée. Vous recevrez la prochaine lettre.</h1>
            <p>
              <Link className="link-arrow" href={`/newsletter/desinscription/?token=${encodeURIComponent(jeton)}`}>
                Se désinscrire <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </p>
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center" }}>
            <span className="card__icon" style={{ marginInline: "auto" }}>
              <i className="ph ph-warning-circle" aria-hidden="true"></i>
            </span>
            <h1 className="t-h3">Ce lien a expiré. Vous pouvez vous réinscrire.</h1>
            <p>
              <Link className="link-arrow" href="/newsletter/">
                S'inscrire <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
