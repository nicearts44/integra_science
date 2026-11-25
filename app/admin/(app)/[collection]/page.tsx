import { notFound } from "next/navigation";

import ListEditor, { type AdminItem } from "@/components/admin/ListEditor";
import { getCollection } from "@/lib/admin/schema";
import { lireDoc } from "@/lib/server/editorial-store";

export const dynamic = "force-dynamic";

/** Trois collections partagent ce gabarit : publications, cas d'usage, actualités. */
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const def = getCollection(collection);
  if (!def) notFound();

  const doc = await lireDoc(def.doc);
  const brut = doc[def.pointer];
  const items = Array.isArray(brut) ? (brut as AdminItem[]) : [];

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>{def.plural}</h1>
          <p>{def.intro}</p>
        </div>
      </header>

      <ListEditor def={def} initial={items} />
    </>
  );
}
