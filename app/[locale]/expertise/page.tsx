import Link from "next/link";

import Figure from "@/components/Figure";
import { SecHead, CtaBand } from "@/components/sections/common";
import Network, { type NetNode, type NetEdge } from "@/components/interactive/Network";
import Flow from "@/components/interactive/Flow";
import Counters from "@/components/interactive/Counters";
import { polesEn, urlSlug } from "@/lib/content/en/poles";
import { flowStepsEn } from "@/lib/content/en/steps";
import { networkGeometry } from "@/lib/content/poles";
import { sansCadreEn, avecCadreEn } from "@/lib/content/en/vision";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMetaEn({
  title: seoEn.expertises.title,
  description: seoEn.expertises.description,
  path: "/en/expertise/",
  frPath: "/expertises/",
});

const frToStable: Record<string, string> = {
  bio: "biologie",
  binf: "bioinformatique",
  img: "bio-imagerie",
  med: "medecine-sante",
  pharma: "pharmacologie",
  stat: "statistiques-ia",
};

const nodes: NetNode[] = networkGeometry.nodes.map((n) => {
  const stable = frToStable[n.id] ?? n.id;
  const pole = polesEn.find((p) => p.slug === stable);
  return {
    ...n,
    label: pole?.net.label ?? "",
    title: pole?.title ?? "",
    text: pole?.net.text ?? "",
    tags: pole?.net.tags ?? [],
  };
});

const edges: NetEdge[] = networkGeometry.edges;

export default function ExpertiseEnPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/en/" },
          { name: "Expertise", path: "/en/expertise/" },
        ])}
      />

      <section className="page-hero parity">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="page-hero__title t-h1">
                Six pôles that talk to each other,
                <br />
                one single <em>requirement of proof</em>.
              </h1>
              <p className="page-hero__lead t-lead">
                No pôle works alone on a question that commits several disciplines. Every mission
                mobilises the necessary skills, from framing, and makes them contradict each other
                before concluding.
              </p>
              <div className="hero__actions">
                <Link className="btn btn--accent btn--on-dark" href="/en/contact/project/">
                  Submit a problem <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link className="btn btn--outline btn--on-dark" href="#poles">
                  See the six pôles
                </Link>
              </div>
            </div>
            <div className="hero__visual">
              <Figure name="data" wrapperClassName="hero__figure" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead
            split
            title="The network, not the hierarchy."
            sub="Hover over a pôle to see who it works with. The line lights up when the two pôles cooperate on the same missions."
          />
          <Network nodes={nodes} edges={edges} />
        </div>
      </section>

      <section className="section section--soft" id="poles">
        <div className="container">
          <SecHead
            title="What each pôle covers."
            sub="Six domains, one same documentation standard. Each sheet details the capabilities, the profiles mobilised and the partner pôles."
          />

          <div className="grid grid--3">
            {polesEn.map((p) => (
              <Link className="pole reveal" href={`/en/expertise/${urlSlug(p.slug)}/`} key={p.slug}>
                <div className="pole__top">
                  <span className="pole__icon">
                    <i className={`ph ${p.icon}`} aria-hidden="true"></i>
                  </span>
                  <span className="pole__n">{p.num}</span>
                </div>
                <h3 className="t-h3">{p.title}</h3>
                <p className="card__text">{p.couverture}</p>
                <ul className="bullets">
                  {p.capacites.slice(0, 3).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <span className="pole__link">
                  See the pôle detail <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead
            split
            title="How a question becomes a defensible result."
            sub="Select a step to see what is decided there and the written record that comes out of it."
          />
          <Flow steps={flowStepsEn} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="fig-band reveal">
            <Figure name="medical" />
            <p className="fig-band__cap">
              A result enters a health decision only after being reviewed by another pôle.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SecHead title="The difference is not speed. It is resumption." />

          <div className="compare reveal">
            <div className="compare__col">
              <p className="compare__label">A result without a framework</p>
              <ul>
                {sansCadreEn.map((t) => (
                  <li key={t}>
                    <i className="ph ph-x-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="compare__col compare__col--after">
              <p className="compare__label">A documented result</p>
              <ul>
                {avecCadreEn.map((t) => (
                  <li key={t}>
                    <i className="ph ph-check-circle" aria-hidden="true"></i> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Counters
            items={[
              { value: 6, label: "expertise pôles that can be mobilised" },
              { value: 6, label: "steps, each with its written record" },
              { value: 4, label: "services framed by a named deliverable" },
            ]}
          />
        </div>
      </section>

      <CtaBand
        title="A question that does not fit in a single pôle?"
        text="That is the most common case. Describe the question and the data available: we identify the pôles to mobilise and the first step to take."
        note="No sensitive data in the first exchange · Written framing before any mission"
        primary={{ href: "/en/contact/project/", label: "Submit a problem" }}
        secondary={{ href: "/en/contact/application/", label: "Join the network" }}
      />
    </>
  );
}
