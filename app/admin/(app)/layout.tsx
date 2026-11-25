import Link from "next/link";

import AdminNav, { type NavGroupe } from "@/components/admin/AdminNav";
import { LIBELLES_ROLE } from "@/lib/admin/roles";
import { exigerAdmin, peut } from "@/lib/server/admin-auth";
import { modeEcriture } from "@/lib/server/editorial-store";

export const dynamic = "force-dynamic";

const MODES = {
  github: "Enregistre dans le dépôt GitHub",
  local: "Enregistre sur le disque local",
  "lecture-seule": "Lecture seule : écriture non configurée",
} as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const compte = await exigerAdmin();
  const mode = modeEcriture();

  const groupes: NavGroupe[] = [
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

  if (peut(compte.role, "comptes")) {
    groupes.push({
      title: "Accès",
      links: [{ href: "/admin/comptes", label: "Comptes" }],
    });
  }

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

        <AdminNav groups={groupes} />

        <div className="adm-side-foot">
          <span>{MODES[mode]}</span>
          <Link href="/" target="_blank" rel="noreferrer">
            Voir le site ↗
          </Link>
        </div>
      </aside>

      <div className="adm-content">
        <div className="adm-topbar">
          <span className="adm-who">
            <strong>{compte.nom}</strong>
            <span>{LIBELLES_ROLE[compte.role]}</span>
          </span>
          <div className="adm-topbar-actions">
            <Link href="/admin/compte">Mon compte</Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit">Se déconnecter</button>
            </form>
          </div>
        </div>

        <main className="adm-main">
          {compte.role === "lecteur" ? (
            <div className="adm-notice adm-notice--info">
              Consultation seule : votre rôle ne permet pas d&apos;enregistrer de modification. Un
              propriétaire peut changer votre rôle depuis Comptes.
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
