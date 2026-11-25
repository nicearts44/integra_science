import type { Metadata } from "next";

import AccountsPanel from "@/components/admin/AccountsPanel";
import { exigerCapacite } from "@/lib/server/admin-auth";
import { listerComptes, publicCompte } from "@/lib/server/comptes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Comptes" };

export default async function ComptesPage() {
  const moi = await exigerCapacite("comptes");
  const comptes = (await listerComptes()).map(publicCompte);

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Comptes et accès</h1>
          <p>
            Chaque personne qui gère le site a son propre compte et son propre mot de passe. Le rôle
            décide de ce qu&apos;elle peut faire : un lecteur consulte, un éditeur publie, un
            propriétaire gère aussi les accès.
          </p>
        </div>
      </header>

      <AccountsPanel initial={comptes} moiId={moi.id} />
    </>
  );
}
