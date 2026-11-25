import Link from "next/link";

import ContactForm from "@/components/forms/ContactForm";
import { PageHero, SecHead } from "@/components/sections/common";
import { forms } from "@/lib/content/forms";
import { t } from "@/lib/locale";
import { breadcrumbLd, JsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: forms.candidature.title.fr,
  description: forms.candidature.subtitle.fr,
  path: "/contact/candidature/",
});

export default function ContactCandidaturePage() {
  const config = forms.candidature;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact/" },
          { name: config.title.fr, path: "/contact/candidature/" },
        ])}
      />

      <PageHero title={t(config.title, "fr")} lead={t(config.subtitle, "fr")} />

      <section className="section section--soft" id="formulaire">
        <div className="container container--narrow">
          <SecHead title="Décrire la demande" />

          <div className="reveal">
            <ContactForm config={config} locale="fr" />
          </div>

          <p className="reveal" style={{ marginTop: "var(--s6)" }}>
            <Link className="link-arrow" href="/contact/">
              Retour au contact <i className="ph ph-arrow-right" aria-hidden="true"></i>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
