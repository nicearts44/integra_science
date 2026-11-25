import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Illustrations en SVG inline (règle de fidélité : jamais de fetch() côté client).
 * Les fichiers sont lus une fois puis mis en cache.
 */
const cache = new Map<string, string>();

function load(name: string): string {
  const cached = cache.get(name);
  if (cached !== undefined) return cached;
  let svg = "";
  try {
    svg = readFileSync(path.join(process.cwd(), "public", "fig", `${name}.svg`), "utf8");
  } catch {
    svg = "";
  }
  cache.set(name, svg);
  return svg;
}

type Props = {
  /** Nom du fichier SVG dans /public/fig (sans extension). */
  name: string;
  /** Classes du conteneur (ex. « hero__figure », « figure reveal »). */
  wrapperClassName?: string;
  /** Figure décorative : aria-hidden. Sinon role="img" + alt. */
  decorative?: boolean;
  alt?: string;
};

export default function Figure({ name, wrapperClassName, decorative = true, alt }: Props) {
  const svg = load(name);
  if (!svg) return null;

  return (
    <div
      className={wrapperClassName}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : alt}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
