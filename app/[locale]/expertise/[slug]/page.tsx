import Link from "next/link";
import { notFound } from "next/navigation";

import Figure from "@/components/Figure";
import { SecHead, CtaBand } from "@/components/sections/common";
import { polesEn, toFrSlug, urlSlug } from "@/lib/content/en/poles";
import { pageMetaEn, breadcrumbLd, serviceLd, JsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return polesEn.map((p) => ({ slug: urlSlug(p.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pole = polesEn.find((p) => urlSlug(p.slug) === slug);
  if (!pole) return {};
  return pageMetaEn({
    title: pole.meta.title,
    description: pole.meta.description,
    path: `/en/expertise/${slug}/`,
    frPath: `/expertises/${pole.slug}/`,
  });
}

const figures: Record<string, string> = {
  biologie: "hero-genome",
  bioinformatique: "pipeline",
  "bio-imagerie": "data",
  "medecine-sante": "medical",
  pharmacologie: "proof",
  "statistiques-ia": "analytics",
};

export default async function PoleEnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pole = polesEn.find((p) => urlSlug(p.slug) === slug);
  if (!pole) notFound();

  const frSlug = toFrSlug(slug);
  const figure = figures[frSlug];
  const lies = polesEn.filter((p) => pole.polesLies.includes(p.slug));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/en/" },
            { name: "Expertise", path: "/en/expertise/" },
            { name: pole.title, path: `/en/expertise/${slug}/` },
          ]),
          serviceLd(pole.title, pole.chapeau),
        ]}
      />

      <section className="page-hero parity">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="page-hero__title t-h1">{pole.title}</h1>
              <p className="page-hero__lead t-lead">{pole.chapeau}</p>
              <div className="hero__actions">
                <Link className="btn btn--accent btn--on-dark" href="/en/contact/project/">
                  Submit a problem <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link className="btn btn--outline btn--on-dark" href="/en/expertise/">
                  See the six pôles
                </Link>
              </div>
            </div>
            {figure && (
              <div className="hero__visual">
                <Figure name={figure} wrapperClassName="hero__figure" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--2" style={{ gap: "var(--s10)", alignItems: "start" }}>
            <div className="stack-md">
              <h2 className="t-h2">What this pôle covers</h2>
              <p className="t-body-sm t-muted">{pole.couvertureDetail}</p>

              {pole.mentionPerimetre && (
                <p className="t-subtle t-body-sm">{pole.mentionPerimetre}</p>
              )}
            </div>

            <div className="stack-md">
              <h2 className="t-h2" style={{ fontSize: "var(--fs-h3)" }}>
                What we do with it
              </h2>
              <ul className="bullets">
                {pole.capacites.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>

              <h3 className="t-h4">Profiles mobilised</h3>
              <div className="tag-row">
                {pole.profils.map((p) => (
                  <span className="tag" key={p}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {lies.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SecHead
              title="Who this pôle works with"
              sub="No pôle works alone on a question that commits several disciplines."
            />
            <div className="grid grid--3">
              {lies.map((p) => (
                <Link className="pole reveal" href={`/en/expertise/${urlSlug(p.slug)}/`} key={p.slug}>
                  <div className="pole__top">
                    <span className="pole__icon">
                      <i className={`ph ${p.icon}`} aria-hidden="true"></i>
                    </span>
                    <span className="pole__n">{p.num}</span>
                  </div>
                  <h3 className="t-h3">{p.title}</h3>
                  <p className="card__text">{p.resume}</p>
                  <span className="pole__link">
                    See the pôle <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="A question that does not fit in a single pôle?"
        text="That is the most common case. Describe the question and the data available: we identify the pôles to mobilise and the first step to take."
        note="No sensitive data in the first exchange · Written framing before any mission"
        primary={{ href: "/en/contact/project/", label: "Submit a problem" }}
        secondary={{ href: "/en/method/", label: "See the method" }}
      />
    </>
  );
}
