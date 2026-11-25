/* ===================================================================
   EN — The six expertises (pôles). Translation of lib/content/poles.ts.
   Slugs stay stable (they are internal keys); only the URLs change.
   =================================================================== */

import type { Pole } from "@/lib/content/poles";

/** English slug per French slug — used by /en/expertise/[slug]/. */
export const enPoleSlugs: Record<string, string> = {
  biologie: "biology",
  bioinformatique: "bioinformatics",
  "bio-imagerie": "bio-imaging",
  "medecine-sante": "medicine-health",
  pharmacologie: "pharmacology",
  "statistiques-ia": "statistics-ai",
};

export const polesEn: Pole[] = [
  {
    slug: "biologie",
    key: "biologie",
    num: "01",
    icon: "ph-dna",
    title: "Biology",
    chapeau:
      "Biology provides the framework in which a result takes on meaning. Without it, a datum remains a measurement.",
    couverture: "Genetics, molecular and cellular biology, genomics, microbiology.",
    couvertureDetail:
      "Genetics, molecular and cellular biology, genomics and microbiology. This pôle provides the biological reading of results: what they mean, what they do not allow us to conclude, and what more would be needed to go further.",
    capacites: [
      "Biological interpretation of analysis results",
      "Variant annotation and characterisation",
      "Functional reading of expression data",
      "Contextualisation against the literature and reference databases",
      "Identification of the biological limits of a conclusion",
    ],
    profils: ["Biologists", "Geneticists", "Researchers"],
    resume: "Genetics, molecular and cellular biology, genomics, microbiology.",
    polesLies: ["bioinformatique", "bio-imagerie", "medecine-sante", "pharmacologie"],
    net: {
      label: "Bio",
      text: "Genetics, molecular and cellular biology, genomics, microbiology. The pôle that says what a result means for living systems.",
      tags: ["DNA", "Expression", "Microbiology"],
    },
    meta: {
      title: "Biology expertise",
      description:
        "Genetics, molecular and cellular biology, genomics, microbiology: the biological reading of results.",
    },
  },
  {
    slug: "bioinformatique",
    key: "bioinformatique",
    num: "02",
    icon: "ph-tree-structure",
    title: "Bioinformatics",
    chapeau:
      "Bioinformatics makes data usable, and its processing reproducible. It is the discipline that turns an analysis into a procedure.",
    couverture: "Omics data, documented analysis pipelines, multi-omics integration.",
    couvertureDetail:
      "Omics data — sequencing, genomics, transcriptomics, proteomics and their integration. Design and maintenance of documented, versioned and re-runnable analysis pipelines.",
    capacites: [
      "Processing and quality control of sequencing data",
      "Building documented and versioned pipelines",
      "Integration of multi-omics data",
      "Automation of recurring analysis chains",
      "Documentation of parameters and execution environments",
    ],
    profils: ["Bioinformaticians", "Engineers", "Data scientists"],
    resume: "Omics data, documented analysis pipelines, multi-omics integration.",
    polesLies: ["biologie", "statistiques-ia", "bio-imagerie"],
    net: {
      label: "Binf",
      text: "Omics data, documented analysis pipelines, multi-omics integration. The pôle that makes volumes tractable and processing reproducible.",
      tags: ["Pipelines", "Omics", "Reproducibility"],
    },
    meta: {
      title: "Bioinformatics expertise",
      description:
        "Omics data, documented analysis pipelines, multi-omics integration: reproducible analyses.",
    },
  },
  {
    slug: "bio-imagerie",
    key: "bio-imagerie",
    num: "03",
    icon: "ph-microscope",
    title: "Bio-imaging",
    chapeau: "A biological image is a measurement. Reading it demands as much method as producing it.",
    couverture: "Acquisition, processing and quantification of biological and medical images.",
    couvertureDetail:
      "Microscopy, cellular imaging, segmentation and quantification. Extracting measurements from images, with the same demand for traceability as a sequencing analysis.",
    capacites: [
      "Segmentation and quantification of cellular images",
      "Extraction and analysis of imaging-derived measurements",
      "Methodological support on acquisition protocols",
      "Machine-learning-assisted processing",
      "Documentation of processing parameters",
    ],
    profils: ["Imaging specialists", "Biologists", "Engineers"],
    resume: "Acquisition, processing and quantification of biological and medical images.",
    polesLies: ["biologie", "bioinformatique", "medecine-sante", "statistiques-ia"],
    net: {
      label: "Img",
      text: "Acquisition, processing and quantification of biological and medical images. The pôle that turns an image into a measurement.",
      tags: ["Imaging", "Quantification"],
    },
    meta: {
      title: "Bio-imaging expertise",
      description:
        "Microscopy, cellular imaging, segmentation and quantification of biological and medical images.",
    },
  },
  {
    slug: "medecine-sante",
    key: "medecine-sante",
    num: "04",
    icon: "ph-heartbeat",
    title: "Medicine & health",
    chapeau:
      "A result has clinical value only if it is read within a clinical framework — and within the limits of that framework.",
    couverture: "Clinical reading of results, health data, regulatory framework.",
    couvertureDetail:
      "Medical genetics, oncology and clinical expertise, within the permitted scope. This pôle provides the medical reading of results and the explicit delimitation of what counts as expert opinion.",
    capacites: [
      "Clinical reading of biological and genomic results",
      "Expertise in medical genetics and oncology",
      "Delimitation of the interpretation scope",
      "Contribution to discussing the implications",
    ],
    profils: ["Physicians", "Accredited health professionals"],
    resume: "Clinical reading of results, health data, regulatory framework.",
    polesLies: ["biologie", "bio-imagerie", "pharmacologie", "statistiques-ia"],
    mentionPerimetre:
      "INTEGRA SCIENCE produces expert opinions. These opinions constitute neither a certification, nor an official clinical validation, nor a medical decision.",
    net: {
      label: "Med",
      text: "Clinical reading of results, health data, regulatory framework. The pôle that puts a result back into a real situation.",
      tags: ["Clinical", "Health data", "Framework"],
    },
    meta: {
      title: "Medicine & health expertise",
      description:
        "Clinical reading of results, health data, regulatory framework: the medical reading of results.",
    },
  },
  {
    slug: "pharmacologie",
    key: "pharmacologie",
    num: "05",
    icon: "ph-flask",
    title: "Pharmacology",
    chapeau:
      "Pharmaceutical data carry their own requirements for method, safety and traceability.",
    couverture: "Mechanisms of action, interactions, preclinical and clinical evaluation.",
    couvertureDetail:
      "Pharmacology, pharmaceutical data and therapeutic research. Reading of data from development, evaluation or post-marketing surveillance of health products.",
    capacites: [
      "Analysis and interpretation of pharmacological data",
      "Methodological support on evaluation protocols",
      "Critical reading of therapeutic research results",
      "Documentation of methods and limits",
    ],
    profils: ["Pharmacists", "Pharmacologists", "Researchers"],
    resume: "Mechanisms of action, interactions, preclinical and clinical evaluation.",
    polesLies: ["biologie", "medecine-sante", "statistiques-ia"],
    net: {
      label: "Phar",
      text: "Mechanisms of action, interactions, preclinical and clinical evaluation. The pôle that judges an effect, not just a difference.",
      tags: ["Mechanisms", "Interactions", "Evaluation"],
    },
    meta: {
      title: "Pharmacology expertise",
      description:
        "Mechanisms of action, interactions, preclinical and clinical evaluation: pharmaceutical data.",
    },
  },
  {
    slug: "statistiques-ia",
    key: "statistiques-ia",
    num: "06",
    icon: "ph-chart-line-up",
    title: "Statistics & AI",
    chapeau:
      "A badly chosen statistical method produces a perfectly useless result. A method chosen and documented produces a defensible one.",
    couverture: "Analysis plan, modelling, critical evaluation of AI-produced results.",
    couvertureDetail:
      "Biostatistics, modelling, machine learning and deep learning. This pôle provides the methodological guarantee and the critical evaluation of results produced by automated systems.",
    capacites: [
      "Choice and justification of statistical methods",
      "Analysis plans and power calculation",
      "Modelling and machine learning",
      "Critical evaluation of AI-produced results",
      "Documentation of assumptions and limits",
    ],
    profils: ["Statisticians", "Data scientists", "Artificial intelligence specialists"],
    resume: "Analysis plan, modelling, critical evaluation of AI-produced results.",
    polesLies: ["bioinformatique", "medecine-sante", "pharmacologie", "bio-imagerie"],
    net: {
      label: "Stat",
      text: "Analysis plan, modelling, critical evaluation of AI-produced results. The pôle that says what a number allows us to conclude.",
      tags: ["Analysis plan", "Modelling", "AI"],
    },
    meta: {
      title: "Statistics & AI expertise",
      description:
        "Biostatistics, modelling, machine learning and critical evaluation of AI-produced results.",
    },
  },
];

/** English URL slug for a pôle, from its stable French slug. */
export function urlSlug(frSlug: string): string {
  return enPoleSlugs[frSlug] ?? frSlug;
}

export function getPoleEn(slug: string): Pole | undefined {
  return polesEn.find((p) => p.slug === slug);
}

/** English slug from a French slug, and back. */
export function toEnSlug(frSlug: string): string {
  return enPoleSlugs[frSlug] ?? frSlug;
}

export function toFrSlug(enSlug: string): string {
  const entry = Object.entries(enPoleSlugs).find(([, en]) => en === enSlug);
  return entry ? entry[0] : enSlug;
}
