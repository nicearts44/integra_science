import Link from "next/link";

import AdminNav from "@/components/admin/AdminNav";
import { exigerAdmin } from "@/lib/server/admin-auth";
import { modeEcriture } from "@/lib/server/editorial-store";

export const dynamic = "force-dynamic";

const groups = [
  {
    title: "Contenu",
    links: [
      { href: "/admin", label: "Tableau de bord" },
      { href: "/admin/publications", label: "Publications" },
      { href: "/admin/cas-usage", label: "Cas d'usage" },
      { href: "/admin/actualites", label: "Actualités" },
    ],
  },
  {
    title: "Réseau",
    links: [
      { href: "/admin/reseau/membres", label: "Membres" },
      { href: "/admin/reseau/roles", label: "Fonctions" },
      { href: "/admin/reseau/engagements", label: "Engagements" },
    ],
  },
  {
    title: "Échanges",
    links: [
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/newsletter", label: "Newsletter" },
    ],
  },
  {
    title: "Site",
    links: [{ href: "/admin/reglages", label: "Réglages" }],
  },
];

const MODES = {
  github: "Enregistre dans le dépôt GitHub",
  local: "Enregistre sur le disque local",
  "lecture-seule": "Lecture seule : écriture non configurée",
} as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await exigerAdmin();
  const mode = modeEcriture();

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-brand">
          <span className="adm-brand-mark">IS</span>
          <span className="adm-brand-text">
            <strong>INTEGRA SCIENCE</strong>
            <span>Back-office</span>
          </span>
        </div>

        <AdminNav groups={groups} />

        <div className="adm-side-foot">
          <span>{MODES[mode]}</span>
          <Link href="/" target="_blank" rel="noreferrer">
            Voir le site ↗
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit">Se déconnecter</button>
          </form>
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
}
