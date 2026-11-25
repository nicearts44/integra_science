/* ===================================================================
   Notre vision — version anglaise.
   Les clés (icônes, liens) viennent du module français : ici, uniquement
   des textes. `translate()` dans lib/content/bilingue.ts recolle les deux.
   =================================================================== */

import type { CardItem } from "../vision";

export const rupturesEn: CardItem[] = [
  {
    icon: "ph-stack",
    title: "Larger volumes of data",
    text: "Sequencing, imaging, proteomics: volumes exceed what a workstation can process, and formats change with every technology.",
  },
  {
    icon: "ph-share-network",
    title: "Scattered skills",
    text: "Biology, statistics and data engineering live in different departments, with different calendars and different vocabularies.",
  },
  {
    icon: "ph-seal-check",
    title: "Results to defend",
    text: "A result has to hold before a review committee, a funder or a partner. That requires knowing where it comes from and what it does not prove.",
  },
];

export const iaBlocEn = {
  title: "Artificial intelligence has moved the difficulty a second time.",
  text: "It produces a credible analysis in minutes. It does not say whether that analysis is right. Verification becomes the main work, and it requires skills that few teams bring together.",
  bullets: [
    "A biologist and a statistician do not rephrase the same request.",
    "An interpretation that does not survive statistical examination is fragile.",
    "Each discipline knows the limits of its own methods.",
  ],
  link: { href: "/en/expertise/", label: "See how we work" },
};

export const publicsEn: CardItem[] = [
  {
    icon: "ph-flask",
    title: "Laboratories and core facilities",
    text: "You produce omics or imaging data and want to draw a biologically sound interpretation from it.",
  },
  {
    icon: "ph-users-three",
    title: "Research teams",
    text: "You need methodological or statistical support on a protocol, an analysis or a publication.",
  },
  {
    icon: "ph-hospital",
    title: "Healthcare institutions",
    text: "You work with clinical data and are looking for expert review, within the applicable regulatory framework.",
  },
  {
    icon: "ph-buildings",
    title: "Industry and partners",
    text: "You assess results produced in-house or by automated tools before using them.",
  },
];

export const sansCadreEn = [
  "Nobody knows which parameter was used",
  "The tool version is not recorded",
  "Limits are discovered at review",
  "Picking the work up again means redoing it",
];

export const avecCadreEn = [
  "Parameters, versions and decisions are recorded",
  "The execution log allows the analysis to be replayed",
  "Reservations are written down and owned",
  "Picking the work up again means opening it",
];

export const principeEn = {
  text: "A scientific result must not only be produced. It must be examinable, understandable and justifiable.",
  by: "The principle the whole method rests on",
};
