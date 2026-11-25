/* ===================================================================
   EN — Method steps and page content. Translation of lib/content/steps.ts.
   =================================================================== */

import type { FlowStep } from "@/components/interactive/Flow";

export const flowStepsEn: FlowStep[] = [
  {
    key: "01",
    step: "Step 01",
    title: "Receipt of the request",
    short: "Receipt",
    text: "The request is reformulated in writing: the question asked, the data available, the decision expected, the deadline. A badly worded request produces an off-topic answer, whatever the quality of the work.",
    trace: "Request sheet, countersigned by the requester",
  },
  {
    key: "02",
    step: "Step 02",
    title: "Preliminary analysis",
    short: "Preliminary analysis",
    text: "The data are inspected before any commitment: completeness, consistency, quality, suitability to the question. This is the step where we say no — or not yet.",
    trace: "State of the data and reservations identified",
  },
  {
    key: "03",
    step: "Step 03",
    title: "Scientific framing",
    short: "Framing",
    text: "The pôles concerned define the method, the analysis plan and the deliverables. Nothing starts without a plan validated in writing: neither the schedule, nor the conditions, nor the scope changes afterwards without an amendment.",
    trace: "Validated mission plan, scope and limits",
  },
  {
    key: "04",
    step: "Step 04",
    title: "Execution of the analyses",
    short: "Execution",
    text: "Analyses are conducted with parameters retained, tool versions noted and an execution log. What is not written down cannot be defended.",
    trace: "Results, scripts, versions, execution log",
  },
  {
    key: "05",
    step: "Step 05",
    title: "Cross-scientific review",
    short: "Cross review",
    text: "A pôle that did not carry out the work reviews the results. Its role is to look for the error, not to validate. The reservations raised are written down and kept: a review that finds nothing is suspicious.",
    trace: "Review reservations and reasoned decision",
  },
  {
    key: "06",
    step: "Step 06",
    title: "Documented handover",
    short: "Handover",
    text: "The report sets out the results, the method, the limits and the conditions for resuming the work. It is delivered with its reproduction files, and presented in session if the mission provides for it.",
    trace: "Final report, reproduction files",
  },
];

/** Short version for the home page "steps" band. */
export const stepTracesEn = flowStepsEn.map((s) => ({
  n: s.step.replace("Step ", ""),
  title: s.title,
  trace: s.trace,
}));

/** "What you keep." — six documents delivered along the mission. */
export const tracesRemisesEn = [
  { icon: "ph-clipboard-text", title: "Request sheet", text: "The question as it was understood and accepted." },
  { icon: "ph-magnifying-glass", title: "State of the data", text: "What is available, what is missing, what limits the analysis." },
  { icon: "ph-compass", title: "Mission plan", text: "Method, scope, deliverables, schedule, conditions." },
  { icon: "ph-terminal", title: "Execution log", text: "Parameters, versions, technical decisions taken along the way." },
  { icon: "ph-users-three", title: "Review reservations", text: "What the reviewing pôle challenged, and why." },
  { icon: "ph-file-text", title: "Final report", text: "Results, limits, conditions for resuming, reproduction files." },
];

/** Same shape as `revueCroisee` in lib/content/steps.ts. */
export const revueCroiseeEn = {
  title: "Cross review is the only control that counts.",
  paragraphs: [
    "Whoever produced an analysis no longer sees their own errors: they followed a line of reasoning, they find it coherent, they repeat it. A review by the same pôle corrects nothing.",
    "In the network, review is entrusted to a pôle that did not carry out the work, and whose expertise overlaps the subject. Its role is not to validate but to look for the flaw: unsuitable method, unstated assumption, a conclusion that goes beyond the data.",
  ],
  bullets: [
    "The reviewing pôle is named at framing, not at the end",
    "Reservations are written down, dated and kept",
    "An unresolved reservation appears in the final report",
  ],
  figure: "review",
};

export const coutTraceEn = {
  title: "The cost of the record, and what it prevents.",
  sans: {
    label: "Without a method",
    items: [
      "The parameter used is no longer known",
      "The tool version was not noted",
      "The limits surface during review",
      "Resuming the work means redoing it",
    ],
  },
  avec: {
    label: "With the INTEGRA method",
    items: [
      "Parameters, versions and decisions recorded",
      "An execution log that allows the analysis to be re-run",
      "Reservations written down and owned",
      "Resuming the work means opening it",
    ],
  },
};
