import Link from "next/link";

import { legalDoc } from "@/lib/content/bilingue";
import { breadcrumbLd, JsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site INTEGRA SCIENCE : quelles données sont collectées, pourquoi, combien de temps.",
  path: "/confidentialite/",
});

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function ConfidentialitePage() {
  const doc = legalDoc("confidentialite", "fr");

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: doc.title, path: "/confidentialite/" },
        ])}
      />

      <section className="section">
        <div className="container container--narrow">
          <h1 className="t-h1">{doc.title}</h1>
          <p className="t-body-sm t-muted" style={{ marginTop: "var(--s3)" }}>
            Dernière mise à jour : {DATE_FORMAT.format(new Date(doc.lastUpdated))}
          </p>

          <div className="prose-legal" style={{ marginTop: "var(--s8)" }}>
            {doc.blocks.map((block) => (
              <div key={block.h2}>
                <h2>{block.h2}</h2>
                {block.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {block.list && (
                  <>
                    {block.list.intro && <p>{block.list.intro}</p>}
                    <ul>
                      {block.list.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {block.list.outro && <p>{block.list.outro}</p>}
                  </>
                )}
                {block.link && (
                  <p>
                    <Link href={block.link.href}>{block.link.label}</Link>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
