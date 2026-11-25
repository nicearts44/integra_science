import Link from "next/link";

import Figure from "@/components/Figure";
import { PageHero, SecHead, Quote } from "@/components/sections/common";
import { siteParams } from "@/lib/content/site";
import { breadcrumbLd, citationAttribution, JsonLd, pageMetaEn } from "@/lib/seo";

export const metadata = pageMetaEn({
  title: "Submit a project",
  description:
    "Describe your problem. A first exchange, no commitment, no sensitive data.",
  path: "/en/contact/",
  frPath: "/contact/",
});

/* Contact details — COPYWRITING § 12.6: an empty field renders no line. */
type Line = { icon: string; label: string; value: string; href?: string };

function contactLines(): Line[] {
  const lines: Line[] = [];
  if (siteParams.adresse)
    lines.push({ icon: "ph-map-pin", label: "Postal address", value: siteParams.adresse });
  if (siteParams.telephone) {
    lines.push({
      icon: "ph-phone",
      label: "Phone",
      value: siteParams.telephone,
      href: `tel:${siteParams.telephone.replace(/[^\d+]/g, "")}`,
    });
  }
  if (siteParams.email_contact) {
    lines.push({
      icon: "ph-envelope-simple",
      label: "Contact email",
      value: siteParams.email_contact,
      href: `mailto:${siteParams.email_contact}`,
    });
  }
  if (siteParams.horaires)
    lines.push({ icon: "ph-clock", label: "Opening hours", value: siteParams.horaires });
  return lines;
}

const paths = [
  {
    href: "/en/contact/project/",
    icon: "ph-flask",
    title: "Submit a project",
    text: "You have a scientific or medical problem to frame.",
    cta: "Reply within 3 working days",
  },
  {
    href: "/en/contact/application/",
    icon: "ph-users-three",
    title: "Join the network",
    text: "You would like to contribute to a multidisciplinary network.",
    cta: "First conversation",
  },
  {
    href: "/en/contact/partnership/",
    icon: "ph-buildings",
    title: "Institutional partnership",
    text: "You represent an institution, a laboratory or a partner.",
    cta: "Get in touch",
  },
];

const steps = [
  { term: "Acknowledgement", desc: "Within 2 working days" },
  { term: "First reading", desc: "Scope, skills, open questions" },
  { term: "Exchange", desc: "If the request calls for it" },
  { term: "Proposal", desc: "Written: deliverables, schedule, conditions" },
];

export default function ContactEnPage() {
  const lines = contactLines();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Contact", path: "/en/contact/" },
        ])}
      />

      <PageHero
        title="Tell us about your problem."
        lead="A first exchange is for understanding the question, the context and the expected result. It commits you to nothing, and requires no sensitive data."
        figure="contact"
        primary={{ href: "/en/contact/project/", label: "Write to the network" }}
        secondary={{ href: "/en/contact/application/", label: "Join the network" }}
      />

      <section className="section">
        <div className="container">
          <SecHead
            split
            title="Three ways to write to us."
            sub="Choose the path that matches your situation: the form and the reply time are not the same."
          />

          <div className="grid grid--3">
            {paths.map((p) => (
              <Link className="card reveal" href={p.href} key={p.href}>
                <span className="card__icon">
                  <i className={`ph ${p.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="card__text">{p.text}</p>
                <span className="link-arrow">
                  {p.cta} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="form">
        <div className="container">
          <div className="grid grid--2" style={{ gap: "var(--s12)", alignItems: "start" }}>
            <div className="reveal">
              <h2 className="t-h2" style={{ marginBottom: "var(--s4)" }}>
                Describe the request
              </h2>
              <p className="t-body-sm t-muted" style={{ marginBottom: "var(--s6)" }}>
                The more precise the description, the more useful the first reply. Fifty characters
                minimum: one sentence is enough.
              </p>

              <ul className="bullets">
                {paths.map((p) => (
                  <li key={p.href}>
                    <Link className="link-arrow" href={p.href}>
                      {p.title} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="reveal stack-md">
              <div className="card">
                <span className="card__icon">
                  <i className="ph ph-clock" aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">What happens next</h3>
                <ol className="spec-list">
                  {steps.map((s) => (
                    <li className="spec-list__row" key={s.term}>
                      <span className="spec-list__term">{s.term}</span>
                      <span className="spec-list__desc">{s.desc}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="card">
                <span className="card__icon">
                  <i className="ph ph-shield-check" aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">Confidentiality</h3>
                <p className="card__text">
                  The first exchange is for understanding the question, not for transferring data.
                  The exchange framework, the retention period and the recipients are defined before
                  any transmission.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" id="join">
        <div className="container">
          <div className="grid grid--2" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <Figure name="collaboration" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h2 className="t-h2">The network grows by co-optation, not by directory.</h2>
              <p className="t-body-sm t-muted">
                Every person is identified by a pôle, with an explicit role and recognition of their
                contribution. Nothing is published without their agreement: no name, no role, no
                professional link.
              </p>
              <ul className="bullets">
                <li>A founding member position, for those who arrive early</li>
                <li>A multidisciplinary framework for working on concrete projects</li>
                <li>Control over the use of your name and your contributions</li>
                <li>No exclusivity: you remain free in your other commitments</li>
              </ul>
              <Link className="link-arrow" href="/en/contact/project/">
                Write to the network <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container container--narrow">
          <Quote
            text="A well-posed request is worth more than a quick analysis."
            by={`— ${citationAttribution()}`}
          />
        </div>
      </section>

      {lines.length > 0 && (
        <section className="section">
          <div className="container">
            <SecHead title="Contact details" />
            <div
              className="reveal"
              style={{ display: "flex", flexDirection: "column", gap: "var(--s3)" }}
            >
              {lines.map((line) => (
                <p className="contact-line" key={line.label}>
                  <i className={`ph ${line.icon}`} aria-hidden="true"></i>
                  <span>
                    <strong>{line.label}: </strong>
                    {line.href ? <a href={line.href}>{line.value}</a> : line.value}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
