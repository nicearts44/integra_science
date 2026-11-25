import Link from "next/link";

import Figure from "@/components/Figure";
import { SecHead, Quote, CtaBand } from "@/components/sections/common";
import { poles, prestations, steps, vision } from "@/lib/content/bilingue";
import { polesEn, urlSlug } from "@/lib/content/en/poles";
import { prestationsEn } from "@/lib/content/en/prestations";
import { localize, t } from "@/lib/locale";
import { pageMetaEn, seoEn, breadcrumbLd, JsonLd } from "@/lib/seo";

export const metadata = pageMetaEn({
  title: seoEn.accueil.title,
  description: seoEn.accueil.description,
  path: "/en/",
  frPath: "/",
});

/**
 * Le contenu anglais de l'accueil est lu depuis les mêmes objets bilingues que
 * la page française : un texte n'existe qu'une fois. Seules les chaînes encore
 * propres à l'accueil (constat, chiffres) sont définies ici.
 */
const constatSource: {
  fr: Array<{ icon: string; title: string; text: string }>;
  en: Array<{ icon: string; title: string; text: string }>;
} = {
    fr: [
      {
        icon: "ph-stack",
        title: "Des données plus volumineuses",
        text: "Séquençage, imagerie, protéomique : les volumes dépassent ce qu'un poste de travail peut traiter, et les formats changent à chaque technologie.",
      },
      {
        icon: "ph-share-network",
        title: "Des compétences dispersées",
        text: "La biologie, les statistiques et l'ingénierie des données vivent dans des services différents, avec des calendriers et des vocabulaires différents.",
      },
      {
        icon: "ph-seal-check",
        title: "Des résultats à défendre",
        text: "Un résultat doit tenir devant un comité de lecture, un financeur ou un partenaire. Cela suppose de savoir d'où il vient et ce qu'il ne prouve pas.",
      },
    ],
    en: [
      {
        icon: "ph-stack",
        title: "Larger volumes of data",
        text: "Sequencing, imaging, proteomics: volumes exceed what a workstation can process, and formats change with every technology.",
      },
      {
        icon: "ph-share-network",
        title: "Scattered skills",
        text: "Biology, statistics and data engineering live in different departments, with different calendars and different vocabularies.",
      },
      {
        icon: "ph-seal-check",
        title: "Results to defend",
        text: "A result has to hold before a review committee, a funder or a partner. That requires knowing where it comes from and what it does not prove.",
      },
    ],
  };
/** Les deux langues sont écrites ici : on choisit simplement la bonne. */
const constatCards = constatSource.en;

export default function HomeEnPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/en/" }])} />

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div>
              <h1 className="hero__title">
                The problems of living systems are not solved within <em>a single discipline</em>.
              </h1>
              <p className="hero__lead">
                INTEGRA SCIENCE brings together biologists, bioinformaticians, physicians,
                pharmacologists and specialists in imaging and data. One point of contact, from
                framing the question to handing over the results.
              </p>
              <div className="hero__actions">
                <Link className="btn btn--accent btn--on-dark" href="/en/contact/project/">
                  Submit a project <i className="ph ph-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link className="btn btn--outline btn--on-dark" href="#method">
                  Discover our method
                </Link>
              </div>
              <div className="hero__facts">
                <div className="hero__fact">
                  <strong>6</strong>
                  <span>expertise pôles</span>
                </div>
                <div className="hero__fact">
                  <strong>4</strong>
                  <span>framed services</span>
                </div>
                <div className="hero__fact">
                  <strong>6</strong>
                  <span>steps, 6 written records</span>
                </div>
              </div>
            </div>

            <div className="hero__visual">
              <Figure name="hero-genome" wrapperClassName="hero__figure" />
              <div className="hero__badges">
                <span className="hero__chip">
                  <i className="ph ph-check-circle" aria-hidden="true"></i> Cross-scientific review
                </span>
                <span className="hero__chip">
                  <i className="ph ph-file-text" aria-hidden="true"></i> Documented deliverables
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE SHIFT ================= */}
      <section className="section section--tint">
        <div className="container">
          <SecHead
            split
            title={
              <>
                Data have changed scale.
                <br />
                Not the organisations that process them.
              </>
            }
            sub="The difficulty is no longer producing the data, but knowing what it allows us to conclude."
          />

          <div className="grid grid--3">
            {constatCards.map((c) => (
              <article className="card reveal" key={c.title}>
                <span className="card__icon">
                  <i className={`ph ${c.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{c.title}</h3>
                <p className="card__text">{c.text}</p>
              </article>
            ))}
          </div>

          <div className="grid grid--2 mt-12" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <Figure name="research" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h3
                className="t-h2"
                style={{ fontSize: "var(--fs-h3)", fontFamily: "var(--font-sans)", fontWeight: 600 }}
              >
                Artificial intelligence moved the difficulty a second time.
              </h3>
              <p className="t-body-sm t-muted">{vision.iaBloc.text.en}</p>
              <ul className="bullets">
                {vision.iaBloc.bullets.map((b) => (
                  <li key={b.fr}>{b.en}</li>
                ))}
              </ul>
              <Link className="link-arrow" href="/en/expertise/">
                See how we work <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SIX PÔLES ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            title="Six pôles. One same requirement of proof."
            sub="Each pôle is autonomous in its domain and takes part in the missions of the others. That crossing is what produces a defensible result."
          />

          <div className="grid grid--3">
            {polesEn.map((p) => (
              <Link
                className="pole reveal"
                href={`/en/expertise/${urlSlug(p.slug)}/`}
                key={p.slug}
              >
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

      {/* ================= BAND ================= */}
      <section className="section section--soft">
        <div className="container">
          <div className="fig-band reveal">
            <Figure name="convergence" />
            <p className="fig-band__cap">
              Six disciplines, one requirement: that the result can be examined.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="section">
        <div className="container">
          <SecHead
            split
            title="What we take on."
            sub="Each mission is the subject of a written proposal setting out the scope, the deliverables, the schedule and the conditions."
          />

          <div className="grid grid--2">
            {prestationsEn.map((p) => (
              <article className="card reveal" key={p.slug}>
                <span className="card__icon">
                  <i className={`ph ${p.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="card__text">{p.resume}</p>
                <div className="card__foot">
                  <div className="deliverable">
                    <span className="deliverable__label">
                      <i className="ph ph-package" aria-hidden="true"></i> Deliverable
                    </span>
                    {p.livrableCourt}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHO ================= */}
      <section className="section section--tint">
        <div className="container">
          <SecHead title="You have data, a question, and not all the skills to answer it." />
          <div className="grid grid--4">
            {localize(vision.publics, "en").map((c) => (
              <article className="card reveal" key={c.title}>
                <span className="card__icon">
                  <i className={`ph ${c.icon}`} aria-hidden="true"></i>
                </span>
                <h3 className="t-h4">{c.title}</h3>
                <p className="card__text">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= METHOD ================= */}
      <section className="section" id="method">
        <div className="container">
          <SecHead
            split
            title="Six steps. Six written records."
            sub="From the first request to the final report, each step produces a document that shows what was decided, by whom, and why."
          />

          <div className="steps reveal">
            {localize(steps.flowSteps, "en").map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="step__title">{s.title}</span>
                <span className="step__trace">
                  <i className="ph ph-file-text" aria-hidden="true"></i> {s.trace}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid--2 mt-12" style={{ alignItems: "center", gap: "var(--s12)" }}>
            <Figure name="pipeline" wrapperClassName="figure reveal" />
            <div className="reveal stack-md">
              <h3 className="t-h3">
                Traceability is not an extra document. It is the deliverable.
              </h3>
              <p className="t-body-sm t-muted">
                Parameters, tool versions, execution logs and review decisions are kept with the
                results. A report that cannot be picked up again is a report that cannot be defended.
              </p>
              <Link className="link-arrow" href="/en/method/">
                See the method in detail <i className="ph ph-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUOTE ================= */}
      <section className="section section--soft">
        <div className="container container--narrow">
          <Quote
            text={
              <>
                A scientific result must not only be produced.
                <br />
                It must be examinable, understandable and justifiable.
              </>
            }
            by="— Scientific coordination, INTEGRA SCIENCE"
          />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <CtaBand
        title="A problem to frame?"
        text={
          <>
            Describe the question, the context and the expected result. We answer with a first
            reading of the scope, the skills to mobilise and the conditions of the mission.
          </>
        }
        note="No sensitive data in the first exchange · Framing before any mission"
        primary={{ href: "/en/contact/project/", label: "Submit a project" }}
        secondary={{ href: "/en/contact/application/", label: "Join the network" }}
      />
    </>
  );
}
