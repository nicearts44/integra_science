import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { adminConnecte } from "@/lib/server/admin-auth";
import { nombreComptes } from "@/lib/server/comptes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await adminConnecte()) redirect("/admin");

  const aucunCompte = (await nombreComptes()) === 0;

  return (
    <main className="adm-entry">
      <div className="adm-card">
        <h1>Back-office</h1>
        <p className="lede">
          Espace de gestion du réseau : références, actualités, membres et lettre d&apos;information.
        </p>

        <LoginForm installer={aucunCompte} />

        {aucunCompte ? (
          <p className="adm-hint">
            Aucun compte n&apos;existe encore :{" "}
            <Link href="/admin/installer/">créez le compte propriétaire</Link>.
          </p>
        ) : (
          <p className="adm-hint">
            Chaque personne accède avec son propre compte : un propriétaire peut en créer depuis la
            section Comptes, avec un rôle adapté (éditeur, lecteur).
          </p>
        )}
      </div>
    </main>
  );
}
