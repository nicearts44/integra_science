/* ===================================================================
   EN — Home page content.
   =================================================================== */

export const constatCardsEn = [
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

export const homeEn = {
  h1: (
    <>
      The problems of living systems are not solved within <em>a single discipline</em>.
    </>
  ),
  lead: "INTEGRA SCIENCE brings together biologists, bioinformaticians, physicians, pharmacologists and specialists in imaging and data. One point of contact, from framing the question to handing over the results.",
  primary: { href: "/en/contact/project/", label: "Submit a project" },
  secondary: { href: "#method", label: "Discover our method" },
  facts: [
    { value: "6", label: "expertise pôles" },
    { value: "4", label: "framed services" },
    { value: "6", label: "steps, 6 written records" },
  ],
  chips: ["Cross-scientific review", "Documented deliverables"],
  constatTitle: (
    <>
      The data have changed scale.
      <br />
      Not the organisations that process them.
    </>
  ),
  constatSub:
    "The difficulty is no longer producing the data, but knowing what it allows us to conclude.",
  polesTitle: "Six pôles. One and the same requirement of proof.",
  polesSub:
    "Each pôle is autonomous in its field and takes part in the others' missions. That crossing is what produces a defensible result.",
  polesLink: "Discover the pôle",
  bandCap: "Six disciplines, one requirement: that the result can be examined.",
  servicesTitle: "What we take on.",
  servicesSub:
    "Every mission is the subject of a written proposal stating the scope, the deliverables, the schedule and the conditions.",
  publicsTitle: "You have data, a question, and not all the skills to answer it.",
  stepsTitle: "Six steps. Six written records.",
  stepsSub:
    "From the first request to the final report, each step produces a document that shows what was decided, by whom, and why.",
  traceTitle: "Traceability is not an extra document. It is the deliverable.",
  traceText:
    "Parameters, tool versions, execution logs and review decisions are kept with the results. A report that cannot be resumed is a report that cannot be defended.",
  traceLink: { href: "/en/method/", label: "See the method in detail" },
  quote:
    "A scientific result must not only be produced. It must be examinable, understandable and justifiable.",
  quoteBy: "— Scientific coordination, INTEGRA SCIENCE",
  cta: {
    title: "A problem to frame?",
    text: "Describe the question, the context and the expected result. We reply with a first reading of the scope, the skills to mobilise and the conditions of the mission.",
    note: "No sensitive data in the first exchange · Framing before any mission",
    primary: { href: "/en/contact/project/", label: "Submit a project" },
    secondary: { href: "/en/contact/application/", label: "Join the network" },
  },
};
