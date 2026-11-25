/* ===================================================================
   Libellés anglais des pages « réseau » et du contenu de page.
   Les clés (icônes, slugs, numéros) viennent du module français.
   =================================================================== */

/* ===================================================================
   EN — Vision, network, references. Translations of the FR modules.
   =================================================================== */

/* ------------------------------ Vision ---------------------------- */

export const rolesEn = [
  {
    icon: "ph-compass",
    title: "General coordination",
    text: "Receiving requests, framing, monitoring missions.",
    tag: "To be appointed",
  },
  {
    icon: "ph-seal-check",
    title: "Scientific coordination",
    text: "Scientific consistency of the network, arbitration of cross reviews.",
    tag: "To be confirmed",
  },
  {
    icon: "ph-tree-structure",
    title: "Pôle leads",
    text: "One lead per expertise pôle, appointed when the network is set up.",
    tag: "6 positions",
  },
  {
    icon: "ph-clipboard-text",
    title: "Mission leads",
    text: "Steering of each entrusted mission, one identified lead per mission.",
    tag: "Per mission",
  },
  {
    icon: "ph-users-three",
    title: "Experts and reviewers",
    text: "Carrying out and reviewing the work, chosen according to the subject.",
    tag: "Per subject",
  },
  {
    icon: "ph-handshake",
    title: "Partners",
    text: "Academic and institutional collaborations, within the framework of missions.",
    tag: "To be built",
  },
];

export const engagementsEn = [
  {
    icon: "ph-ruler",
    title: "Methodological rigour",
    text: "Justified methodological choices, retained parameters, explicit assumptions.",
  },
  {
    icon: "ph-git-branch",
    title: "Traceability",
    text: "Sources, steps, decisions, versions and scripts are recorded.",
  },
  {
    icon: "ph-eye",
    title: "Transparency about limits",
    text: "Reservations, uncertainties and conditions of use are stated.",
  },
  {
    icon: "ph-lock-key",
    title: "Confidentiality",
    text: "Limited access, data minimisation, compliance with applicable rules.",
  },
  {
    icon: "ph-medal",
    title: "Recognition",
    text: "Every contribution is identified and valued.",
  },
  {
    icon: "ph-flag",
    title: "Roadmap",
    text: "Step-by-step tracking: each pôle records its comments and validates its scope.",
  },
];

export const engagementsNoteEn =
  "These commitments describe our way of working. They constitute neither a certification, nor an accreditation, nor an official clinical validation.";

/**
 * Le statut des pôles ne porte plus que les libellés : le numéro, le titre et
 * le slug viennent du tableau `poles`, qui est la seule source de vérité.
 * La clé est le slug du pôle.
 */
export const poleStatusesEn: Record<string, { fonction: string; statut: string }> = {
  biologie: { fonction: "Pôle lead · role to be filled", statut: "Status to confirm" },
  bioinformatique: { fonction: "Pôle lead · role to be filled", statut: "Founding member" },
  "bio-imagerie": { fonction: "Pôle lead · role to be filled", statut: "Status to confirm" },
  "medecine-sante": { fonction: "Pôle lead · role to be filled", statut: "Status to confirm" },
  pharmacologie: { fonction: "Pôle lead · role to be filled", statut: "Status to confirm" },
  "statistiques-ia": { fonction: "Pôle lead · role to be filled", statut: "Status to confirm" },
};

/* ---------------------------- References -------------------------- */

export const pageCopyEn = {
  vision: {
    h1: (
      <>
        The difficulty is no longer producing the data.
        <br />
        It is knowing what it <em>allows us to conclude</em>.
      </>
    ),
    lead: "Sequencing, imaging, proteomics: the volumes have changed scale, not the organisations that process them. We bring together the disciplines that must contradict each other before concluding.",
    primary: { href: "/en/expertise/", label: "See the six expertises" },
    secondary: { href: "/en/method/", label: "Understand the method" },
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
    publicsTitle:
      "You have data, a question, and not all the skills to answer it.",
    stepsTitle: "Six steps. Six written records.",
    stepsSub:
      "From the first request to the final report, each step produces a document that shows what was decided, by whom, and why.",
    traceTitle: "Traceability is not an extra document. It is the deliverable.",
    traceText:
      "Parameters, tool versions, execution logs and review decisions are kept with the results. A report that cannot be resumed is a report that cannot be defended.",
    traceLink: { href: "/en/method/", label: "See the method in detail" },
    compareTitle: "The difference is not speed. It is resumption.",
    compareSans: "A result without a framework",
    compareAvec: "A documented result",
    cta: {
      title: "A problem to frame?",
      text: "Describe the question, the data available and the decision expected. We reply with a first written reading of the problem, not a sales offer.",
      note: "No sensitive data in the first exchange · Written framing before any mission",
      primary: { href: "/en/contact/project/", label: "Submit a problem" },
      secondary: { href: "/en/expertise/", label: "See the six expertises" },
    },
  },

  services: {
    h1: (
      <>
        Four services.
        <br />
        Four <em>named deliverables</em>.
      </>
    ),
    lead: "Every mission is the subject of a written proposal stating the scope, the deliverables, the schedule and the conditions. Nothing starts before these four elements are settled.",
    primary: { href: "/en/contact/project/", label: "Submit a project" },
    secondary: { href: "#services", label: "See the four services" },
    tabLabels: {
      "analyse-omiques": "Omics data",
      "pipelines-reproductibles": "Reproducible pipelines",
      "statistiques-appui-methodologique": "Statistics and methodology",
      "evaluation-ia": "Evaluation of AI results",
    },
    what: "What we do",
    profils: "Profiles mobilised",
    deliverables: "Deliverables",
    conditions: "Conditions",
    link: { href: "/en/contact/project/", label: "Submit this type of mission" },
    livrablesTitle: "A deliverable is not a PDF.",
    livrablesSub:
      "Every mission hands over the whole of what makes the work understandable, verifiable and resumable. The report alone is never enough.",
    perimetreTitle: "What we do not do.",
    perimetreIntro:
      "A scope is defined as much by what it includes as by what it excludes. These limits are stated at framing, not discovered at delivery.",
    perimetre: [
      "We provide neither certification, nor accreditation, nor official clinical validation.",
      "We do not claim that a result is “reliable”: we say what it allows us to conclude.",
      "We do not accept sensitive data before an exchange framework is defined.",
      "We do not work without a formulated question: a vague request is reformulated before it is accepted.",
    ],
    cta: {
      title: "Describe the expected result, not only the data.",
      text: "Scope, deliverables and schedule are decided at framing. The more precise the request, the more precise the proposal.",
      note: "No sensitive data in the first exchange · Written framing before any mission",
      primary: { href: "/en/contact/project/", label: "Describe a project" },
      secondary: { href: "/en/method/", label: "See the method" },
    },
  },

  method: {
    h1: (
      <>
        Six steps.
        <br />
        Six <em>written records</em>.
      </>
    ),
    lead: "From receipt of the request to the final report, each step produces a document that shows what was decided, by whom, and why.",
    primary: { href: "#flow", label: "See a mission's path" },
    secondary: { href: "/en/contact/project/", label: "Submit a mission" },
    flowTitle: "A mission's path.",
    flowSub: "Select a step to see what is decided there and the written record that comes out of it.",
    tracesTitle: "What you keep.",
    tracesSub: "Six documents, handed over along the mission. They belong to the requester.",
    costTitle: "The cost of the record, and what it prevents.",
    note: "The method is identical whichever pôle carries out the mission.",
    noteLink: { href: "/en/scientific-quality/", label: "See the scientific quality commitments" },
    cta: {
      title: "A mission to frame?",
      text: "Framing is the step that decides everything else. It is done in writing, before the slightest analysis begins.",
      note: "No sensitive data in the first exchange · Written framing before any mission",
      primary: { href: "/en/contact/project/", label: "Submit a mission" },
      secondary: { href: "/en/services/", label: "See the services" },
    },
  },

  network: {
    h1: (
      <>
        A network,
        <br />
        not a <em>directory</em>.
      </>
    ),
    lead: "Every role is written down before it is filled. Open positions remain visible: that is the principle of a network being built, and the condition for nobody being displayed without their agreement.",
    primary: { href: "/en/contact/application/", label: "Join the network" },
    secondary: { href: "#roles", label: "See the functions" },
    rolesTitle: "Five functions. One rule: the role is written down.",
    rolesSub:
      "A function is shown as filled only once the person is officially identified. Open positions remain visible: that is the principle of a network being built.",
    membersTitle: "Members and experts.",
    membersSub:
      "One lead per pôle, with the other members of the pôle. No real profile is published without the person's agreement: no name, no role, no professional link.",
    emptyTitle: "Detailed profiles await agreements",
    emptyText:
      "Each person is published once they have agreed to their name, their role and their professional link. The profiles will appear here.",
    engTitle: "What we commit to.",
    cta: {
      title: "The network is open to those who arrive early.",
      text: "A founding member position, a multidisciplinary framework, and control over the use of your name. No exclusivity: you remain free in your other commitments.",
      note: "No profile published without written agreement · No name, role or link without validation",
      primary: { href: "/en/contact/application/", label: "Join the network" },
      secondary: { href: "/en/expertise/", label: "See the six expertises" },
    },
  },

  quality: {
    h1: (
      <>
        Five <em>verifiable</em>
        <br />
        commitments.
      </>
    ),
    lead: "A commitment that cannot be verified is not a commitment. These describe our way of working, and what a requester can demand of us at each step.",
    primary: { href: "/en/method/", label: "See the method" },
    secondary: { href: "/en/contact/", label: "Write to us" },
    engTitle: "What we commit to.",
    engSub: "Each commitment points to a written record produced during the mission.",
    refuseTitle: "What we refuse to promise.",
    refuseP1:
      "We provide neither certification, nor accreditation, nor official clinical validation. We do not claim that a result is “reliable”: we say what it allows us to conclude, and under what conditions.",
    refuseP2:
      "That limit is also a guarantee: it forces us to write down the reservations instead of keeping them quiet.",
    refuseLink: { href: "/en/services/", label: "See the scope of the services" },
    cta: {
      title: "A requirement of proof to set against a result?",
      text: "Describe the conclusion you are asked to accept and the elements supplied. We say what is missing for it to be defensible.",
      note: "No sensitive data in the first exchange · Written framing before any mission",
      primary: { href: "/en/contact/project/", label: "Submit a problem" },
      secondary: { href: "/en/network/", label: "See the network" },
    },
  },

  references: {
    h1: (
      <>
        Publications and case studies.
        <br />
        <em>What has been verified</em>.
      </>
    ),
    lead: "Every item published here is verified before publication, and anonymised when the requester does not wish to be named. Two non-negotiable rules: unverified content is not published, non-anonymised content is not published.",
    pubTitle: "Publications.",
    pubSub: "Scientific work, communications and reports made public with the agreement of the parties.",
    casTitle: "Case studies.",
    casSub:
      "A real situation, described without naming it: the question asked, what was done, what came out of it, and what it does not prove.",
    actusTitle: "News.",
    actusSub: "What is moving in the network: arrivals, missions under way, positions taken.",
    situation: "The situation.",
    question: "The question.",
    done: "What was done.",
    notProven: "What it does not prove.",
    anonymised: "Anonymised",
    gabarit: "Template",
    all: "All",
    articles: "Articles",
    communications: "Communications",
    reports: "Reports",
    emptyPubTitle: "No publication online at the moment",
    emptyPubText:
      "The cards above are templates: they show the shape the content will take, not real publications. They will be replaced as verifications and agreements come in.",
    emptyCasTitle: "No case study published at the moment",
    emptyCasText:
      "A case is published only once verified and anonymised. The two cards above show the expected shape.",
    emptyActusTitle: "The news feed is ready, waiting for its first entries",
    emptyActusText:
      "Each news item is simple editorial content: a title, two to three sentences, a category, a date. An RSS feed will be available from the first publication.",
    cta: {
      title: "Work that deserves to be told?",
      text: "A case study is published with your agreement, anonymised if you wish, and after review by a pôle that did not carry out the mission.",
      note: "Verification and anonymisation before any publication · No name without written agreement",
      primary: { href: "/en/contact/project/", label: "Write to us" },
      secondary: { href: "/en/method/", label: "See the method" },
    },
  },

  publications: {
    h1: (
      <>
        Verified
        <br />
        <em>publications</em>.
      </>
    ),
    lead: "Scientific work, communications and reports made public with the agreement of the parties. Nothing is published before it has been reviewed by a pôle that did not carry out the work.",
    primary: { href: "/en/references/", label: "See also the case studies" },
    title: "What has been published.",
    sub: "Filter by type of content. Verified entries replace the templates as publications appear.",
    gabarit: "Template",
    emptyPubTitle: "No publication online at the moment",
    emptyPubText:
      "The cards above are templates: they show the shape the content will take, not real publications. They will be replaced as verifications and agreements come in.",
    cta: {
      title: "Work that deserves to be published?",
      text: "A result is published with the requester's agreement, after cross review. The limits are written into the text, not implied.",
      note: "Verification and anonymisation before any publication · No name without written agreement",
      primary: { href: "/en/contact/project/", label: "Write to us" },
      secondary: { href: "/en/references/", label: "See the references" },
    },
  },

  casUsage: {
    h1: (
      <>
        A real situation,
        <br />
        described <em>without naming it</em>.
      </>
    ),
    lead: "The question asked, what was done, what came out of it, and what it does not prove. That last paragraph is what distinguishes a case study from an advertisement.",
    primary: { href: "/en/contact/project/", label: "Submit a problem" },
    secondary: { href: "/en/references/", label: "See also the publications" },
    title: "What was done, and what it does not prove.",
    sub: "Each case is published after verification and anonymisation. No element allows the requester to be re-identified.",
    gabarit: "Template",
    situation: "The situation.",
    question: "The question.",
    done: "What was done.",
    notProven: "What it does not prove.",
    anonymised: "Anonymised",
    emptyCasTitle: "No case study published at the moment",
    emptyCasText:
      "A case is published only once verified and anonymised. The two cards above show the expected shape.",
    cta: {
      title: "Your situation looks like one of these?",
      text: "Describe the question and the data available. We identify the pôles to mobilise and the first step to take.",
      note: "No sensitive data in the first exchange · Written framing before any mission",
      primary: { href: "/en/contact/project/", label: "Submit a problem" },
      secondary: { href: "/en/method/", label: "See the method" },
    },
  },

  actualites: {
    h1: (
      <>
        What is moving
        <br />
        in the <em>network</em>.
      </>
    ),
    lead: "Arrivals, missions under way, positions taken. A news item is simple content: a title, two to three sentences, a category, a date.",
    primary: { href: "/en/references/", label: "See the references" },
    secondary: { href: "/en/newsletter/", label: "Subscribe to the newsletter" },
    title: "The news feed.",
    sub: "Every entry is dated. No date is announced in advance: what is published has happened.",
    gabarit: "Template",
    emptyActusTitle: "The news feed is ready, waiting for its first entries",
    emptyActusText:
      "Each news item is simple editorial content: a title, two to three sentences, a category, a date. An RSS feed will be available from the first publication.",
    cta: {
      title: "Receive the news by email?",
      text: "The newsletter appears rarely, and only when there is something to say. One-click unsubscribe.",
      note: "Double opt-in · No data passed to a third party · One-click unsubscribe",
      primary: { href: "/en/newsletter/", label: "Subscribe to the newsletter" },
      secondary: { href: "/en/contact/", label: "Write to us" },
    },
  },
} as const;
