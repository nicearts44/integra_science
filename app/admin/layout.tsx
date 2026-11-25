import type { Metadata } from "next";

import "@/styles/admin.css";

/**
 * Racine du back-office. Elle monte son propre <html>/<body> : aucun élément
 * du site public (en-tête, pied de page, scripts de révélation) ne s'applique
 * ici, et le back-office reste utilisable même si le site public change.
 */
export const metadata: Metadata = {
  title: { default: "Back-office — INTEGRA SCIENCE", template: "%s — Back-office" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="adm-body">{children}</body>
    </html>
  );
}
