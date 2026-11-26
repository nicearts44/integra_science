import type { Metadata } from "next";

import ForgotForm from "@/components/admin/ForgotForm";
import { emailConfigured } from "@/lib/server/email";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default async function MotDePasseOubliePage() {
  const envoiPossible = await emailConfigured();

  return (
    <main className="adm-entry">
      <div className="adm-card">
        <h1>Mot de passe oublié</h1>
        <p className="lede">
          Indiquez l&apos;adresse de votre compte : un lien valable une heure permet d&apos;en
          choisir un nouveau.
        </p>

        <ForgotForm />

        {!envoiPossible ? (
          <p className="adm-hint">
            L&apos;envoi d&apos;emails n&apos;est pas configuré sur ce serveur (clé Brevo absente) :
            un propriétaire peut définir un mot de passe provisoire depuis la section Comptes, puis
            vous le changer vous-même.
          </p>
        ) : null}
      </div>
    </main>
  );
}
