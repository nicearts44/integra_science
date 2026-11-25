/* ===================================================================
   EN — The four services. Translation of lib/content/prestations.ts.
   =================================================================== */

import type { Prestation } from "@/lib/content/prestations";

export const prestationsEn: Prestation[] = [
  {
    slug: "analyse-omiques",
    key: "analyse-omiques",
    icon: "ph-dna",
    title: "Omics data analysis",
    chapeau:
      "From sequencing data to biological conclusions, with the parameters and references that make them verifiable.",
    situation:
      "You hold omics data — sequencing, expression, proteins — and you must draw an interpretation that holds. The technical processing is not the difficult part: what is difficult is knowing what the results mean, and what that interpretation rests on.",
    actions: [
      "Quality control and data preparation",
      "Processing and annotation according to the standards of the data type",
      "Differential analysis and exploration of results",
      "Biological interpretation of the results",
      "Explicit discussion of limits and uncertainties",
    ],
    livrables: [
      "An analysis report presenting the results and their interpretation",
      "The usable result files",
      "The parameters and tool versions used",
      "The references of the databases and annotations employed",
    ],
    conditions:
      "Scope and data are agreed in writing before work starts. Conclusions depend on the quality of the data supplied; that dependency is documented in the report. A biological analysis report is not a clinical decision.",
    profils: ["Bioinformaticians", "Biologists", "Statisticians"],
    resume:
      "Processing, quality control, annotation and interpretation of sequencing, expression and protein data.",
    livrableCourt:
      "Analysis report, result files, parameters, references of the databases used",
    meta: {
      title: "Omics data analysis",
      description:
        "Processing, quality control, annotation and interpretation of sequencing, expression and protein data.",
    },
  },
  {
    slug: "pipelines-reproductibles",
    key: "pipelines-reproductibles",
    icon: "ph-git-branch",
    title: "Reproducible pipelines and software",
    chapeau: "An analysis that cannot be re-run is not a method. It is an event.",
    situation:
      "You have an analysis that works — but only on the machine of the person who wrote it, with the software versions they had that day. You need it to still work in two years, and for someone else to be able to pick it up.",
    actions: [
      "Design of structured analysis pipelines",
      "Automation of recurring steps",
      "Versioning of code and execution environments",
      "Documentation of dependencies and parameters",
      "Writing of the handover instructions",
    ],
    livrables: [
      "The scripts and the complete workflow",
      "The documented execution environment",
      "The technical documentation",
      "The handover and maintenance instructions",
    ],
    conditions:
      "Maintenance beyond the mission is agreed separately. The functional scope is settled at framing; any extension is covered by an amendment.",
    profils: ["Bioinformaticians", "Engineers"],
    resume: "Design, automation, documentation and versioning of analysis pipelines.",
    livrableCourt:
      "Scripts, workflow, execution environment, documentation, handover instructions",
    meta: {
      title: "Reproducible pipelines and software",
      description:
        "Design, automation, documentation and versioning of reproducible analysis pipelines.",
    },
  },
  {
    slug: "statistiques-appui-methodologique",
    key: "statistiques-appui-methodologique",
    icon: "ph-chart-scatter",
    title: "Statistics and methodological support",
    chapeau:
      "The right method, chosen for the right reason, and documented so that it can be challenged.",
    situation:
      "You must design a study, size a sample, choose a test or defend an analysis before a review committee. The methodological choice commits the validity of everything else.",
    actions: [
      "Framing of the analysis question",
      "Choice and justification of methods",
      "Analysis plans and sizing",
      "Production of figures and visualisations",
      "Writing of the methodological report",
    ],
    livrables: [
      "A written analysis plan",
      "The analysis scripts",
      "The figures and visualisations",
      "A methodological report justifying the choices",
    ],
    conditions:
      "Conclusions depend on data quality. The assumptions retained are made explicit and documented. Methodological support does not replace the scientific responsibility of the study lead.",
    profils: ["Statisticians", "Bioinformaticians", "Researchers"],
    resume: "Choice of methods, analysis plan, visualisation and statistical interpretation.",
    livrableCourt: "Analysis plan, scripts, figures, methodological report",
    meta: {
      title: "Statistics and methodological support",
      description: "Choice of methods, analysis plan, visualisation and statistical interpretation.",
    },
  },
  {
    slug: "evaluation-ia",
    key: "evaluation-ia",
    icon: "ph-robot",
    title: "Evaluation of AI results",
    chapeau: "A result produced in a few minutes deserves to be verified before it is used.",
    situation:
      "An analysis, a text or a conclusion has been produced with an artificial intelligence system. You need to know what is exact, what is approximate, what is invented — and what level of confidence to place in the whole before using it.",
    actions: [
      "Critical review of the material supplied",
      "Verification of the claims and the sources cited",
      "Identification of errors and unsupported elements",
      "Evaluation of the robustness of the conclusions",
      "Formulation of the reservations and of the confidence level",
    ],
    livrables: [
      "An evaluation report",
      "The list of errors and approximations identified",
      "The sources verified and those that could not be",
      "An argued confidence level and the associated reservations",
    ],
    conditions:
      "Scope and documents are agreed in advance. The report is an expert opinion: it is neither a certification, nor an approval, nor a clinical decision. It covers the material supplied, not the original data not communicated.",
    profils: ["Data scientists", "Bioinformaticians", "Biologists", "Statisticians"],
    resume:
      "Review of a piece of work produced with AI to verify its accuracy, its sources and its robustness.",
    livrableCourt:
      "Evaluation report: errors identified, verified sources, robustness, confidence level, reservations",
    meta: {
      title: "Evaluation of AI results",
      description:
        "Review of a piece of work produced with AI to verify its accuracy, its sources and its robustness.",
    },
  },
];

export function getPrestationEn(slug: string): Prestation | undefined {
  return prestationsEn.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* /en/services/ — editorial blocks, mirror of livrablesPage and        */
/* perimetreExclu in lib/content/prestations.ts.                        */
/* ------------------------------------------------------------------ */

/** “A deliverable is not a PDF.” */
export const livrablesPageEn = [
  {
    icon: "ph-file-text",
    title: "The report",
    text: "Results, method, limits, conditions of use. Written to be read by a scientist outside the project.",
  },
  {
    icon: "ph-code",
    title: "The reproduction files",
    text: "Scripts, execution environment, tool versions, parameters. What allows the analysis to be re-run identically.",
  },
  {
    icon: "ph-seal-check",
    title: "The review record",
    text: "The reservations raised by the reviewing pôle and the reasoned decision that follows. Kept with the results.",
  },
];

/** “What we do not do.” — the scope is stated at framing. */
export const perimetreExcluEn = {
  title: "What we do not do.",
  intro:
    "A scope is defined as much by what it includes as by what it excludes. These limits are stated at framing, not discovered at delivery.",
  items: [
    "We provide neither certification, nor accreditation, nor official clinical validation.",
    "We do not claim that a result is “reliable”: we say what it allows us to conclude.",
    "We do not accept sensitive data before an exchange framework is defined.",
    "We do not work without a formulated question: a vague request is reformulated before it is accepted.",
  ],
  figure: "restitution",
};
