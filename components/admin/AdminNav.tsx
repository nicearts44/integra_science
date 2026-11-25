"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLien = { href: string; label: string };
export type NavGroupe = { title: string; links: NavLien[] };

/** Navigation du back-office, avec l'état actif calculé sur l'URL exacte. */
export default function AdminNav({ groups }: { groups: NavGroupe[] }) {
  const chemin = usePathname() ?? "/admin";

  return (
    <nav className="adm-nav" aria-label="Sections du back-office">
      {groups.map((groupe) => (
        <div key={groupe.title} style={{ display: "contents" }}>
          <span className="adm-nav-group">{groupe.title}</span>
          {groupe.links.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className={chemin === lien.href ? "is-active" : undefined}
            >
              {lien.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
