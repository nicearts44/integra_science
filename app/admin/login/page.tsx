import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { adminConfigure, adminConnecte } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await adminConnecte()) redirect("/admin");

  const configure = adminConfigure();
  const devMode = !configure && process.env.NODE_ENV !== "production";

  return (
    <main className="adm-entry">
      <div className="adm-card">
        <h1>Back-office</h1>
        <p className="lede">
          Espace de gestion du réseau : références, actualités, membres et lettre d&apos;information.
        </p>

        {!configure && !devMode ? (
          <div className="adm-login-error">
            <code>ADMIN_PASSWORD</code> n&apos;est pas défini sur ce serveur : la connexion est
            fermée. Ajoutez la variable dans l&apos;hébergement, puis redéployez.
          </div>
        ) : (
          <LoginForm devMode={devMode} />
        )}

        <p className="adm-hint">
          Cette page n&apos;est ni indexée, ni liée depuis le site public.
        </p>
      </div>
    </main>
  );
}
