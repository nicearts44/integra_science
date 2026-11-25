import SettingsForm from "@/components/admin/SettingsForm";
import { settingsGroups, settingsKeys } from "@/lib/admin/schema";
import { modeEcriture } from "@/lib/server/editorial-store";
import { lireDoc } from "@/lib/server/editorial-store";

export const dynamic = "force-dynamic";

export default async function ReglagesPage() {
  const doc = await lireDoc("reglages");
  const initial: Record<string, string> = {};
  for (const cle of settingsKeys) {
    const valeur = doc[cle];
    initial[cle] = typeof valeur === "string" ? valeur : "";
  }

  const mode = modeEcriture();

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Réglages du site</h1>
          <p>
            Coordonnées, réseaux, citation et mentions légales. Un champ vide ne produit aucun
            rendu : rien n&apos;est inventé à votre place.
          </p>
        </div>
      </header>

      {mode === "lecture-seule" ? (
        <div className="adm-notice adm-notice--warn">
          L&apos;écriture n&apos;est pas configurée sur cet environnement : les modifications
          seront refusées. Renseignez <code>ADMIN_GITHUB_TOKEN</code> sur l&apos;hébergement.
        </div>
      ) : null}

      <SettingsForm groups={settingsGroups} initial={initial} />
    </>
  );
}
