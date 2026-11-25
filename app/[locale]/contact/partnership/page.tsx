import Link from "next/link";

import ContactForm from "@/components/forms/ContactForm";
import { PageHero, SecHead } from "@/components/sections/common";
import { forms } from "@/lib/content/forms";
import { t } from "@/lib/locale";
import { breadcrumbLd, JsonLd, pageMetaEn } from "@/lib/seo";

export const metadata = pageMetaEn({
  title: t(forms.partenariat.title, "en"),
  description: t(forms.partenariat.subtitle, "en"),
  path: "/en/contact/partnership/",
  frPath: "/contact/partenariat/",
});

export default function ContactPartnershipPage() {
  const config = forms.partenariat;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Contact", path: "/en/contact/" },
          { name: t(config.title, "en"), path: "/en/contact/partnership/" },
        ])}
      />

      <PageHero title={t(config.title, "en")} lead={t(config.subtitle, "en")} />

      <section className="section section--soft" id="form">
        <div className="container container--narrow">
          <SecHead title="Describe the partnership" />

          <div className="reveal">
            <ContactForm config={config} locale="en" />
          </div>

          <p className="reveal" style={{ marginTop: "var(--s6)" }}>
            <Link className="link-arrow" href="/en/contact/">
              Back to contact <i className="ph ph-arrow-right" aria-hidden="true"></i>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
