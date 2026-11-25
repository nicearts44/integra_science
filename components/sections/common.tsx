import Link from "next/link";
import Figure from "@/components/Figure";

/**
 * Hero interne — maquette : section.page-hero.parity
 * Aucun sur-titre au-dessus du H1 (règle v1.2 de COPYWRITING § 5.1).
 */
export function PageHero({
  title,
  lead,
  figure,
  primary,
  secondary,
}: {
  title: React.ReactNode;
  lead: React.ReactNode;
  figure?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="page-hero parity">
      <div className="container">
        <div className="hero__inner">
          <div>
            <h1 className="page-hero__title t-h1">{title}</h1>
            <p className="page-hero__lead t-lead">{lead}</p>
            {(primary || secondary) && (
              <div className="hero__actions">
                {primary && (
                  <Link className="btn btn--accent btn--on-dark" href={primary.href}>
                    {primary.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </Link>
                )}
                {secondary && (
                  <Link className="btn btn--outline btn--on-dark" href={secondary.href}>
                    {secondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>
          {figure && (
            <div className="hero__visual">
              <Figure name={figure} wrapperClassName="hero__figure" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** En-tête de section — maquette : div.sec-head (avec variante --split). */
export function SecHead({
  title,
  sub,
  split = false,
  id,
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  split?: boolean;
  id?: string;
}) {
  return (
    <div className={`sec-head${split ? " sec-head--split" : ""} reveal`} id={id}>
      {split ? (
        <>
          <div>
            <h2 className="sec-head__title t-h2">{title}</h2>
          </div>
          {sub && <p className="sec-head__sub t-lead">{sub}</p>}
        </>
      ) : (
        <>
          <h2 className="sec-head__title t-h2">{title}</h2>
          {sub && <p className="sec-head__sub t-lead">{sub}</p>}
        </>
      )}
    </div>
  );
}

/** Bande d'appel finale — maquette : div.cta-band. */
export function CtaBand({
  title,
  text,
  note,
  primary,
  secondary,
}: {
  title: React.ReactNode;
  text: React.ReactNode;
  note?: React.ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="section section--soft">
      <div className="container">
        <div className="cta-band reveal">
          <div className="cta-band__inner">
            <div>
              <h2 className="cta-band__title">{title}</h2>
              <p className="cta-band__text">{text}</p>
              {note && (
                <p className="cta-band__note">
                  <i className="ph ph-lock-key" aria-hidden="true"></i>
                  {note}
                </p>
              )}
            </div>
            {(primary || secondary) && (
              <div className="cta-band__actions">
                {primary && (
                  <Link className="btn btn--accent btn--on-dark" href={primary.href}>
                    {primary.label} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                  </Link>
                )}
                {secondary && (
                  <Link className="btn btn--outline btn--on-dark" href={secondary.href}>
                    {secondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Citation — maquette : figure.quote. */
export function Quote({
  text,
  by,
  align = "center",
}: {
  text: React.ReactNode;
  by: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <figure className={`quote reveal${align === "left" ? " quote--left" : ""}`} style={align === "left" ? { textAlign: "left" } : undefined}>
      <span className="quote__mark" aria-hidden="true">
        “
      </span>
      <blockquote className="quote__text">{text}</blockquote>
      <figcaption className="quote__by">{by}</figcaption>
    </figure>
  );
}
