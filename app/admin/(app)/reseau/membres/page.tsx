import ListEditor, { type AdminItem } from "@/components/admin/ListEditor";
import { getCollection } from "@/lib/admin/schema";
import { lireDoc } from "@/lib/server/editorial-store";

export const dynamic = "force-dynamic";

export default async function MembresPage() {
  const def = getCollection("membres");
  if (!def) return null;

  const doc = await lireDoc("reseau");
  const brut = doc.membres;
  const items = Array.isArray(brut) ? (brut as AdminItem[]) : [];

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Membres</h1>
          <p>{def.intro}</p>
        </div>
      </header>

      <ListEditor def={def} initial={items} />
    </>
  );
}
