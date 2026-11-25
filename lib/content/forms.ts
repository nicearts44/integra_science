/* ===================================================================
   Configuration des trois formulaires — CONTEXT_MVP § 8.3 /
   COPYWRITING.md § 12.3 à 12.5.

   BILINGUE : tout ce qui se lit est un objet `{ fr, en }` ; les noms
   techniques (`name`, `kind`, `required`, `maxLength`) ne changent pas et
   ne sont jamais traduits. Les options d'un `select` sont envoyées dans la
   langue affichée : c'est ce texte qui arrive dans la boîte du réseau.
   =================================================================== */

import type { L, LOpt } from "@/lib/locale";

export type FieldKind = "text" | "email" | "select" | "textarea";

export type FormField = {
  name: string;
  kind: FieldKind;
  label: L;
  required: boolean;
  placeholder?: LOpt;
  options?: L[];
  /** Longueur minimale (textarea). */
  minLength?: number;
  /** Longueur maximale (textarea). */
  maxLength?: number;
  autocomplete?: string;
  hint?: LOpt;
};

export type FormConfig = {
  kind: "projet" | "candidature" | "partenariat";
  title: L;
  subtitle: L;
  fields: FormField[];
  submit: L;
  reassurance: L;
  warning?: L;
  success: L;
};

/** Libellés d'interface du formulaire : erreurs, sélection, états d'envoi. */
export const formUi = {
  selection: { fr: "Sélection", en: "Select" } as L,
  required: { fr: "Ce champ est requis.", en: "This field is required." } as L,
  email: { fr: "Saisissez une adresse email valide.", en: "Enter a valid email address." } as L,
  tooShort: {
    fr: "Décrivez votre problématique en quelques lignes (50 caractères minimum).",
    en: "Describe your problem in a few lines (50 characters minimum).",
  } as L,
  tooLong: {
    fr: "Limitez votre message à 2 000 caractères.",
    en: "Keep your message under 2,000 characters.",
  } as L,
  antiSpam: {
    fr: "La vérification a échoué. Rechargez la page et réessayez.",
    en: "Verification failed. Reload the page and try again.",
  } as L,
  invalidGroup: {
    fr: "Certains champs doivent être complétés.",
    en: "Some fields need to be filled in.",
  } as L,
  sending: { fr: "Envoi en cours…", en: "Sending…" } as L,
  server: {
    fr: "L'envoi n'a pas abouti. Réessayez, ou écrivez-nous directement.",
    en: "The message did not go through. Try again, or write to us directly.",
  } as L,
  network: {
    fr: "La connexion a été interrompue. Vérifiez votre connexion et réessayez.",
    en: "The connection was interrupted. Check your connection and try again.",
  } as L,
  defaultReassurance: {
    fr: "Vos informations servent uniquement à traiter votre demande.",
    en: "Your information is used only to handle your request.",
  } as L,
};

const domaines: L[] = [
  { fr: "Biologie", en: "Biology" },
  { fr: "Bioinformatique", en: "Bioinformatics" },
  { fr: "Bio-imagerie", en: "Bio-imaging" },
  { fr: "Médecine & santé", en: "Medicine & health" },
  { fr: "Pharmacologie", en: "Pharmacology" },
  { fr: "Statistiques & IA", en: "Statistics & AI" },
  { fr: "Plusieurs domaines / je ne sais pas", en: "Several fields / I don't know" },
];

export const forms: Record<FormConfig["kind"], FormConfig> = {
  projet: {
    kind: "projet",
    title: { fr: "Proposer un projet", en: "Submit a project" },
    subtitle: {
      fr: "Quelques informations suffisent pour un premier échange.",
      en: "A few details are enough for a first exchange.",
    },
    fields: [
      {
        name: "nom",
        kind: "text",
        label: { fr: "Nom et prénom", en: "Full name" },
        required: true,
        autocomplete: "name",
      },
      {
        name: "organisation",
        kind: "text",
        label: { fr: "Organisation (facultatif)", en: "Organisation (optional)" },
        required: false,
        placeholder: {
          fr: "Laboratoire, établissement, entreprise",
          en: "Laboratory, institution, company",
        },
        autocomplete: "organization",
      },
      {
        name: "email",
        kind: "email",
        label: { fr: "Email professionnel", en: "Professional email" },
        required: true,
        placeholder: { fr: "prenom.nom@institution.org", en: "first.last@institution.org" },
        autocomplete: "email",
      },
      {
        name: "domaine",
        kind: "select",
        label: { fr: "Domaine", en: "Field" },
        required: true,
        options: domaines,
      },
      {
        name: "type_besoin",
        kind: "select",
        label: { fr: "Type de besoin", en: "Type of need" },
        required: true,
        options: [
          { fr: "Analyse de données omiques", en: "Omics data analysis" },
          { fr: "Pipelines et logiciels reproductibles", en: "Reproducible pipelines and software" },
          {
            fr: "Statistiques et appui méthodologique",
            en: "Statistics and methodological support",
          },
          { fr: "Évaluation de résultats d'IA", en: "Evaluation of AI results" },
          { fr: "Autre", en: "Other" },
        ],
      },
      {
        name: "description",
        kind: "textarea",
        label: { fr: "Description de la problématique", en: "Description of the problem" },
        required: true,
        placeholder: {
          fr: "La question posée, le contexte, le résultat attendu",
          en: "The question asked, the context, the expected result",
        },
        minLength: 50,
        maxLength: 2000,
      },
      {
        name: "delai",
        kind: "text",
        label: { fr: "Délai souhaité (facultatif)", en: "Preferred timeline (optional)" },
        required: false,
      },
    ],
    submit: { fr: "Envoyer ma demande", en: "Send my request" },
    reassurance: {
      fr: "Vos informations servent uniquement à traiter votre demande. Elles ne sont ni revendues, ni transmises à des tiers.",
      en: "Your information is used only to handle your request. It is never sold or passed on to third parties.",
    },
    warning: {
      fr: "N'envoyez pas de données patients, de données génétiques identifiantes ni de pièces confidentielles par ce formulaire. Le premier échange sert à cadrer la demande ; les modalités de transfert sécurisé sont convenues ensuite.",
      en: "Do not send patient data, identifying genetic data or confidential documents through this form. The first exchange is for framing the request; secure transfer arrangements are agreed afterwards.",
    },
    success: {
      fr: "Votre demande a été transmise. Nous revenons vers vous avec une première lecture du périmètre.",
      en: "Your request has been sent. We will come back to you with a first reading of the scope.",
    },
  },
  candidature: {
    kind: "candidature",
    title: { fr: "Rejoindre le réseau", en: "Join the network" },
    subtitle: {
      fr: "Présentez votre domaine et vos méthodes de travail. Un premier échange d'environ trente minutes suivra.",
      en: "Present your field and how you work. A first conversation of about thirty minutes follows.",
    },
    fields: [
      {
        name: "nom",
        kind: "text",
        label: { fr: "Nom et prénom", en: "Full name" },
        required: true,
        autocomplete: "name",
      },
      {
        name: "email",
        kind: "email",
        label: { fr: "Email", en: "Email" },
        required: true,
        autocomplete: "email",
      },
      {
        name: "fonction",
        kind: "text",
        label: { fr: "Fonction et formation", en: "Role and training" },
        required: true,
      },
      {
        name: "domaines",
        kind: "textarea",
        label: { fr: "Domaines d'expertise et outils", en: "Fields of expertise and tools" },
        required: true,
        minLength: 50,
        maxLength: 2000,
      },
      {
        name: "publications",
        kind: "textarea",
        label: { fr: "Publications (liens) (facultatif)", en: "Publications (links) (optional)" },
        required: false,
        maxLength: 2000,
      },
      {
        name: "disponibilites",
        kind: "text",
        label: { fr: "Disponibilités (facultatif)", en: "Availability (optional)" },
        required: false,
      },
      {
        name: "motivation",
        kind: "textarea",
        label: { fr: "Motivation", en: "Motivation" },
        required: true,
        minLength: 50,
        maxLength: 2000,
      },
    ],
    submit: { fr: "Envoyer ma candidature", en: "Send my application" },
    reassurance: {
      fr: "Ces informations servent uniquement à étudier votre candidature. Votre profil n'est jamais publié sans votre accord écrit.",
      en: "This information is used only to review your application. Your profile is never published without your written agreement.",
    },
    success: {
      fr: "Votre candidature a été transmise. Nous vous recontacterons pour un premier échange.",
      en: "Your application has been sent. We will contact you for a first conversation.",
    },
  },
  partenariat: {
    kind: "partenariat",
    title: { fr: "Écrire au réseau", en: "Write to the network" },
    subtitle: {
      fr: "Partenariats académiques, institutionnels ou industriels.",
      en: "Academic, institutional or industrial partnerships.",
    },
    fields: [
      {
        name: "nom",
        kind: "text",
        label: { fr: "Nom et prénom", en: "Full name" },
        required: true,
        autocomplete: "name",
      },
      {
        name: "institution",
        kind: "text",
        label: { fr: "Institution", en: "Institution" },
        required: true,
        autocomplete: "organization",
      },
      {
        name: "fonction",
        kind: "text",
        label: { fr: "Fonction", en: "Role" },
        required: true,
      },
      {
        name: "email",
        kind: "email",
        label: { fr: "Email professionnel", en: "Professional email" },
        required: true,
        autocomplete: "email",
      },
      {
        name: "objet",
        kind: "text",
        label: { fr: "Objet du partenariat", en: "Subject of the partnership" },
        required: true,
      },
      {
        name: "message",
        kind: "textarea",
        label: { fr: "Message", en: "Message" },
        required: true,
        minLength: 50,
        maxLength: 2000,
      },
    ],
    submit: { fr: "Envoyer le message", en: "Send the message" },
    reassurance: { fr: "", en: "" },
    success: {
      fr: "Votre message a été transmis. Nous revenons vers vous prochainement.",
      en: "Your message has been sent. We will get back to you shortly.",
    },
  },
};
