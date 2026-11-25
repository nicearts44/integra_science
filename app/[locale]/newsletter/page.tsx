import NewsletterForm from "@/components/forms/NewsletterForm";
import { pageMetaEn } from "@/lib/seo";

export const metadata = pageMetaEn({
  title: "Newsletter",
  description: "One newsletter a month. Your address is never shared.",
  path: "/en/newsletter/",
  frPath: "/newsletter/",
});

export default function NewsletterEnPage() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <h1 className="t-h1">Newsletter</h1>
        <p className="t-lead t-muted" style={{ marginTop: "var(--s4)" }}>
          One newsletter a month. Your address is never shared.
        </p>

        <div style={{ maxWidth: "32rem", marginTop: "var(--s8)" }}>
          <NewsletterForm locale="en" />
        </div>
      </div>
    </section>
  );
}
