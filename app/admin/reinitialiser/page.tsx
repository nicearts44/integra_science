import type { Metadata } from "next";

import ResetForm from "@/components/admin/ResetForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default async function ReinitialiserPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="adm-entry">
      <div className="adm-card">
        <h1>Nouveau mot de passe</h1>
        <p className="lede">
          Choisissez un mot de passe pour votre compte. Le lien ne fonctionne qu&apos;une fois et
          expire au bout d&apos;une heure.
        </p>

        <ResetForm token={typeof token === "string" ? token : ""} />
      </div>
    </main>
  );
}
