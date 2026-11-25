import Link from "next/link";

export const dynamic = "force-dynamic";

const cartes = [
  {
    href: "/admin/reseau/membres",
    titre: "Membres",
    texte:
      "Les personnes du réseau. Aucun nom n'est publié sans accord écrit : la case à cocher est la seule porte d'entrée.",
  },
  {
    href: "/admin/reseau/roles",
    titre: "Fonctions",
    texte:
      "Les fonctions affichées sur /reseau/, occupées ou à pourvoir. Une liste vide laisse les textes par défaut.",
  },
  {
    href: "/admin/reseau/engagements",
    titre: "Engagements",
    texte: "Les six engagements vérifiables affichés sous les fonctions.",
  },
];

export default function ReseauAdminPage() {
  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Réseau</h1>
          <p>
            Membres, fonctions et engagements. Une seule règle : le rôle est écrit avant d&apos;être
            occupé, et aucun profil ne paraît sans accord.
          </p>
        </div>
      </header>

      <div className="adm-grid-3">
        {cartes.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="adm-panel"
            style={{ padding: 18, display: "block", color: "inherit" }}
          >
            <h2 style={{ margin: "0 0 6px", fontSize: 16 }}>{c.titre}</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--adm-muted)" }}>{c.texte}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
