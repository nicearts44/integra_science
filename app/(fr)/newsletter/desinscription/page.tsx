import Link from "next/link";

import { findByToken, readSubscribers, writeSubscribers, type Subscriber } from "@/lib/server/store";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Se désinscrire de la lettre",
  description: "Désinscription de la lettre d'INTEGRA SCIENCE.",
  path: "/newsletter/desinscription/",
  index: false,
});

type Props = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function NewsletterDesinscriptionPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const jeton = typeof token === "string" ? token : "";

  const abonne = jeton ? findByToken(jeton) : undefined;

  // Désinscription en un clic, sans confirmation (§ 8.9) : un lien absent
  // ou purgé donne le même message neutre qu'un lien invalide.
  const valide = !!abonne;

  if (valide && abonne) {
    writeSubscribers(
      readSubscribers().map((s): Subscriber =>
        s.token === abonne.token ? { ...s, statut: "desinscrit" } : s,
      ),
    );
  }

  return (
    <section className="section">
      <div className="container container--narrow">
        {valide ? (
          <div className="success" role="status">
            <i className="ph ph-check-circle" aria-hidden="true"></i>
            <h1 className="t-h3">Désinscription enregistrée.</h1>
            <p>
              <Link className="link-arrow" href="/">
                Accueil <i className="ph ph-arrow-right" aria-hidden="true"></i>
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
