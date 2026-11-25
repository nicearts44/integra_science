import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";

import "../styles/integra.css";
import "../styles/integra-plus.css";
import "../styles/phosphor.css";
import "../styles/app.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/layout/RevealObserver";
import { siteParams, baseUrl } from "@/lib/content/site";
import { JsonLd, organizationLd, seo } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-jetbrains",
  display: "swap",
});

/* Thème : script anti-flash identique à la maquette (integra-v2.js v2).
   Exécuté avant le premier rendu pour éviter le clignotement blanc. */
export const fontClass = `${fraunces.variable} ${instrument.variable} ${jetbrains.variable}`;

const themeScript = `(function(){var t=null;try{t=localStorage.getItem('integra-theme');}catch(e){}if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);})();`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: "INTEGRA SCIENCE — Réseau d'expertise scientifique",
    template: "%s",
  },
  description:
    "Un réseau qui réunit biologistes, bioinformaticiens, médecins et spécialistes des données autour d'une même problématique du vivant.",
  openGraph: {
    siteName: "INTEGRA SCIENCE",
    locale: "fr_FR",
    type: "website",
  },
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/en/",
    },
  },
  robots: { index: true, follow: true },
  ...(siteParams.url_site ? {} : {}),
};

/**
 * Layout racine. Le groupe de routes « (fr) » et le segment « [locale] »
 * (anglais) montent tous deux <html>/<body> : Next.js ne permet qu'un seul
 * layout racine par route, donc celui-ci reste neutre et chaque branche
 * déclare son propre <html lang>. Voir app/(fr)/layout.tsx.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

/** Gabarit commun FR/EN : <html>, en-tête, pied de page, thème, JSON-LD. */
export function LocaleShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: "fr" | "en";
}) {
  return (
    <html lang={locale} className={fontClass} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {locale === "en" ? "Skip to content" : "Aller au contenu"}
        </a>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <RevealObserver />
        {/* Organization — CONTEXT_MVP § 10.4, sur toutes les pages */}
        <JsonLd data={organizationLd(seo.accueil.description)} />
      </body>
    </html>
  );
}
