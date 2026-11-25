/* ===================================================================
   Legal pages — English version of lib/content/legal.ts.

   Same structure, same rule: an empty field in siteParams means the
   line is not rendered, and no legal information is ever invented.
   =================================================================== */

import { siteParams } from "@/lib/content/site";
import type { LegalDoc } from "../legal";

function identificationLines(): string[] {
  const lines: string[] = [];
  if (siteParams.raison_sociale) lines.push(`Company name: ${siteParams.raison_sociale}`);
  if (siteParams.forme_juridique) lines.push(`Legal form: ${siteParams.forme_juridique}`);
  if (siteParams.siret_ou_equivalent) lines.push(`Registration: ${siteParams.siret_ou_equivalent}`);
  if (siteParams.directeur_publication)
    lines.push(`Publication director: ${siteParams.directeur_publication}`);
  return lines;
}

const IDENTIFICATION_PENDING =
  "The publisher's identifying details — company name, legal form, capital, registered office, registration number, publication director and host — will be entered here as soon as they are provided. None of this information is invented on this site.";

const identification = identificationLines();

export const mentionsLegalesEn: LegalDoc = {
  title: "Legal notice",
  lastUpdated: "2026-11-25",
  blocks: [
    {
      h2: "Site publisher",
      paragraphs: identification.length ? identification : [IDENTIFICATION_PENDING],
    },
    {
      h2: "Intellectual property",
      paragraphs: [
        "The texts, illustrations and graphic elements of this site are protected by copyright. Any reproduction or use, even partial, requires prior authorisation.",
      ],
    },
    {
      h2: "Contact",
      paragraphs: [
        "For any request relating to this site, please use the contact form.",
        ...(siteParams.email_contact ? [`Contact email: ${siteParams.email_contact}`] : []),
      ],
      link: { href: "/en/contact/", label: "Contact" },
    },
  ],
};

const controller = siteParams.raison_sociale
  ? [
      `Data controller: ${siteParams.raison_sociale}`,
      ...(siteParams.adresse ? [`Address: ${siteParams.adresse}`] : []),
      ...(siteParams.email_contact ? [`Contact email: ${siteParams.email_contact}`] : []),
    ]
  : [
      "The data controller, the legal basis retained for the contact form and the data protection officer's contact details will be specified as soon as the network's legal structure is settled. This page invents none of this information.",
    ];

export const confidentialiteEn: LegalDoc = {
  title: "Privacy policy",
  lastUpdated: "2026-11-25",
  blocks: [
    {
      h2: "What this site does not collect",
      paragraphs: [
        "No advertising cookie, no third-party analytics tool, no font loaded from a service that identifies you. The only setting stored is technical: it remembers your choice of light or dark theme, and it stays in your browser.",
      ],
    },
    {
      h2: "Contact form data",
      paragraphs: [],
      list: {
        intro: "When you use the contact form, we receive:",
        items: [
          "Your first and last name",
          "The name of your organisation, if you provide it",
          "Your email address",
          "The reason for your request",
          "The description you write",
          "Your IP address, used only to limit automated submissions",
        ],
        outro:
          "This data is used only to handle your request. It is never sold, never used for commercial purposes, and never passed to a third party not required for processing.",
      },
    },
    {
      h2: "The newsletter",
      paragraphs: [
        "The INTEGRA SCIENCE newsletter is sent by email to those who subscribe voluntarily. It appears once a month.",
        "Legal basis: your consent, collected through the subscription form's checkbox, which is never pre-ticked. You may withdraw it at any time.",
        "Confirmation: your address is first validated by a confirmation email. Without your click on the link it contains, the subscription is never activated.",
        "Retention: your address is kept until you unsubscribe.",
        "Processor: emails are sent by Brevo, which processes this address solely on our behalf.",
        "Right to withdraw: every newsletter contains an unsubscribe link usable in one click.",
      ],
    },
    {
      h2: "How long",
      paragraphs: [],
      list: {
        items: [
          "Request with no follow-up: the request and the exchanges are deleted after 24 months if no mission is engaged.",
          "Mission engaged: contractual elements are kept according to the applicable legal periods, specified in the mission agreement.",
        ],
      },
    },
    {
      h2: "Your rights",
      paragraphs: [],
      list: {
        intro: "You may request access to, rectification of, or deletion of your data at any time.",
        items: [
          "Receive a reply within 30 days",
          "Withdraw your consent at any time, without justification",
        ],
      },
      link: { href: "/en/contact/", label: "Contact" },
    },
    {
      h2: "Data controller",
      paragraphs: controller,
    },
  ],
};
