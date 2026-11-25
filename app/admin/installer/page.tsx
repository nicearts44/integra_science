import type { Metadata } from "next";
import { redirect } from "next/navigation";

import InstallForm from "@/components/admin/InstallForm";
import { adminConnecte } from "@/lib/server/admin-auth";
import { cleInstallationRequise, nombreComptes } from "@/lib/server/comptes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Premier compte" };

/**
 * Première mise en service : on crée le compte propriétaire. La page se
 * ferme d'elle-même dès qu'un compte existe.
 */
export default async function InstallerPage() {
  if ((await nombreComptes()) > 0) {
    redirect((await adminConnecte()) ? "/admin" : "/admin/login");
  }

  return (
    <main className="adm-entry">
      <div className="adm-card" style={{ maxWidth: 480 }}>
        <h1>Créer le compte propriétaire</h1>
        <p className="lede">
          Ce premier compte administre tout : contenu, réseau, réglages et personnes autorisées.
          Vous pourrez ensuite inviter d&apos;autres comptes, avec un rôle plus limité.
        </p>

        <InstallForm cleRequise={cleInstallationRequise()} />

        <p className="adm-hint">
          Ensuite, la connexion se fait par adresse électronique et mot de passe, et un lien de
          secours permet de réinitialiser le mot de passe oublié.
        </p>
      </div>
    </main>
  );
}
