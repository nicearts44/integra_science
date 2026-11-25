/* ===================================================================
   Références — version anglaise.
   Les catalogues restent vides tant qu'aucun contenu n'a passé les deux
   gates ; les gabarits montrent la forme attendue, jamais un fait.
   =================================================================== */

import type { Publication, CasUsage, Actualite } from "../references";

export const publicationsEn: Publication[] = [];
export const casUsageEn: CasUsage[] = [];
export const actualitesEn: Actualite[] = [];

export const gabaritsPublicationsEn = [
  {
    type: "Article" as const,
    title: "[Title of the publication]",
    resume:
      "[Two-sentence summary: the question asked, what the work shows. Use the wording of the final report, without amplifying it.]",
    cadre: "[Journal]",
    annee: "[YYYY]",
  },
  {
    type: "Communication" as const,
    title: "[Title of the communication]",
    resume:
      "[Conference, symposium, seminar: state the setting, the date and the authors in the order agreed with them.]",
    cadre: "[Event]",
    annee: "[YYYY]",
  },
  {
    type: "Rapport" as const,
    title: "[Title of the public report]",
    resume:
      "[Report made public with the requester's agreement. State the scope and the fact that it is anonymised.]",
    cadre: "[Scope]",
    annee: "[YYYY]",
  },
];

export const gabaritsCasEn = [
  {
    title: "[Case title — without naming the requester]",
    situation:
      "[Type of organisation, data volume, schedule constraint. No element that would allow re-identification.]",
    question: "[As accepted at the framing stage.]",
    fait: "[The useful steps, not the whole body of work.]",
    limites:
      "[The limits, explicitly. This paragraph is what separates a case study from an advertisement.]",
    duree: "[Duration]",
  },
  {
    title: "[Case title — without naming the requester]",
    situation: "[Context, available data, deadline.]",
    question: "[The question, reworded and accepted.]",
    fait: "[Method and key steps.]",
    limites: "[Limits, owned.]",
    duree: "[Duration]",
  },
];

export const gabaritsActualitesEn = [
  { title: "[News title]", text: "[Two or three sentences: the fact, what it changes, and for whom.]", categorie: "[Category]" },
  { title: "[News title]", text: "[Two or three sentences.]", categorie: "[Category]" },
  { title: "[News title]", text: "[Two or three sentences.]", categorie: "[Category]" },
];

export const conditionsEn = [
  {
    label: "Condition 1 — Verification",
    items: [
      { ok: true, text: "The results cited have been reviewed by a reviewing pôle" },
      { ok: true, text: "The figures are taken from the final report" },
      { ok: true, text: "The limits are written down, not implied" },
      { ok: false, text: "While verification is under way, nothing is displayed" },
    ],
  },
  {
    label: "Condition 2 — Anonymisation",
    items: [
      { ok: true, text: "The requester's agreement is kept on file" },
      { ok: true, text: "No identifying data is reproduced" },
      { ok: true, text: "The context is described without allowing re-identification" },
      { ok: false, text: "While the agreement is missing, nothing is displayed" },
    ],
  },
];
