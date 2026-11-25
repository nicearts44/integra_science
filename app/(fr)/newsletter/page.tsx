import NewsletterForm from "@/components/forms/NewsletterForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Lettre d'information",
  description: "Une lettre par mois. Aucun partage d'adresse.",
  path: "/newsletter/",
});

export default function NewsletterPage() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <h1 className="t-h1">Lettre d'information</h1>
        <p className="t-lead t-muted" style={{ marginTop: "var(--s4)" }}>
          Une lettre par mois. Aucun partage d'adresse.
        </p>

        <div style={{ maxWidth: "32rem", marginTop: "var(--s8)" }}>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
