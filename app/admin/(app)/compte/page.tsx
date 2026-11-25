import type { Metadata } from "next";

import ProfileForm from "@/components/admin/ProfileForm";
import { exigerAdmin } from "@/lib/server/admin-auth";
import { DESCRIPTION_ROLE, LIBELLES_ROLE } from "@/lib/admin/roles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mon compte" };

export default async function MonComptePage() {
  const compte = await exigerAdmin();

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Mon compte</h1>
          <p>
            {compte.email} · {LIBELLES_ROLE[compte.role]} — {DESCRIPTION_ROLE[compte.role]}
          </p>
        </div>
      </header>

      <ProfileForm nomInitial={compte.nom} />
    </>
  );
}
