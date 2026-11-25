# INTEGRA SCIENCE — Guide de prise en main

Ce document est **le mode d'emploi complet du projet** : comment il est construit, comment le
lancer, comment l'éditer sans coder, comment configurer le CMS Sanity, comment tester et comment
mettre en ligne. Il s'adresse à deux lecteurs à la fois :

- **la personne qui édite le site** (contenu, textes, images) → parties 4, 5 et 6 ;
- **la personne qui maintient le code** → toutes les parties.

> Règle de base du projet : **aucun contenu inventé**. Un champ vide ne produit aucun rendu.
> Aucune identité juridique, aucun chiffre, aucune référence ne doit être fabriqué pour
> « faire joli » : le site affiche un gabarit explicite à la place.

---

## Sommaire

1. [Ce qu'est ce projet](#1-ce-quest-ce-projet)
2. [Installation locale](#2-installation-locale)
3. [Architecture du code](#3-architecture-du-code)
4. [Où vit le contenu — et comment le modifier](#4-où-vit-le-contenu--et-comment-le-modifier)
5. [Le CMS Sanity : configuration pas à pas](#5-le-cms-sanity--configuration-pas-à-pas)
6. [Prendre en main le Studio](#6-prendre-en-main-le-studio)
7. [Le site bilingue fr / en](#7-le-site-bilingue-fr--en)
8. [Les règles de publication](#8-les-règles-de-publication)
9. [Tester le projet](#9-tester-le-projet)
10. [Déployer en production](#10-déployer-en-production)
11. [Dépannage](#11-dépannage)
12. [Checklist avant mise en ligne](#12-checklist-avant-mise-en-ligne)

---

## 1. Ce qu'est ce projet

Le site public d'INTEGRA SCIENCE, réseau d'expertise scientifique au service du vivant et de la
santé (biologie, bioinformatique, bio-imagerie, médecine et santé, pharmacologie, statistiques et
IA).

| | |
|---|---|
| **Framework** | Next.js 15 (App Router) + React 19 + TypeScript |
| **Rendu** | Statique (SSG) — les pages sont générées au build |
| **CMS** | Sanity (headless, Studio intégré sur `/studio/`) |
| **Langues** | Français (racine) et anglais (`/en/`) — routes réelles ; chaque texte existe une seule fois sous la forme `{ fr, en }` |
| **CSS** | `styles/integra.css` + `styles/integra-plus.css` = copies **non modifiées** des maquettes validées |
| **Hébergement** | Vercel (offre gratuite) ; alternative : tout serveur Node.js |
| **Coût** | 0 € (Vercel Hobby + Sanity gratuit + Brevo 300 mails/jour) |

### Les trois documents de référence

À la racine du projet (`F:/integra_science/`) :

| Fichier | Ce qu'il contient |
|---|---|
| `DESIGN.md` | Le système de design : palette, typographie, espacements, composants, contrastes calculés |
| `COPYWRITING.md` | La voix, les formules interdites, les textes de chaque section |
| `CONTEXT_MVP.md` | Le périmètre, l'architecture, la stack, le déploiement (§ 3 bis = stack retenue) |

En cas de doute sur un texte ou un choix visuel, **ces trois fichiers priment sur le code**.

---

## 2. Installation locale

### 2.1 Prérequis

| Outil | Version | Vérification |
|---|---|---|
| Node.js | 20 ou 22 (LTS) | `node -v` |
| npm | livré avec Node | `npm -v` |
| Git | quelconque | `git --version` |

Rien d'autre : pas de base de données, pas de PHP, pas de Docker.

### 2.2 Installation

```powershell
cd F:\integra_science\integra-science
npm.cmd install
```

> Sur Windows, utiliser `npm.cmd` (et non `npm`) dans PowerShell : la politique d'exécution bloque
> le script `npm.ps1`. C'est la seule particularité Windows du projet.

### 2.3 Variables d'environnement

```powershell
copy .env.example .env.local
```

Ouvrir `.env.local` et renseigner — **toutes sont optionnelles en local**, le site tourne sans :

```ini
# URL publique (blocante pour la mise en ligne)
NEXT_PUBLIC_SITE_URL=

# Emails des formulaires (Brevo)
BREVO_API_KEY=
BREVO_FROM_EMAIL=
CONTACT_DESTINATAIRE=

# CMS Sanity (voir partie 5)
# Studio : le préfixe NEXT_PUBLIC_ est obligatoire (variable lue par le navigateur)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
# Site (lecture serveur)
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_READ_TOKEN=
```

### 2.4 Lancer

```powershell
npm.cmd run dev          # http://localhost:3000 — rechargement à chaud
```

Autres commandes :

| Commande | Effet |
|---|---|
| `npm.cmd run dev` | Serveur de développement |
| `npm.cmd run build` | Build de production (à passer avant tout déploiement) |
| `npm.cmd run start` | Sert le build de production sur le port 3000 |
| `npm.cmd run lint` | Analyse statique |

---

## 3. Architecture du code

```
integra-science/
├── app/
│   ├── layout.tsx              # layout racine neutre + LocaleShell + <html>
│   ├── (fr)/                   # TOUTES les routes françaises
│   │   ├── layout.tsx          # monte <html lang="fr"> + Header/Footer FR
│   │   ├── page.tsx            # accueil
│   │   ├── vision/  expertises/  prestations/  methode/  reseau/
│   │   ├── qualite-scientifique/  references/  publications/
│   │   ├── cas-usage/  actualites/  contact/  newsletter/
│   │   └── mentions-legales/  confidentialite/
│   ├── [locale]/               # MIROIR ANGLAIS /en/…
│   │   ├── layout.tsx          # monte <html lang="en"> + Header/Footer EN
│   │   ├── page.tsx            # /en/
│   │   ├── vision/  expertise/[slug]/  services/  method/  network/
│   │   ├── scientific-quality/  references/  publications/
│   │   └── case-studies/  news/
│   ├── studio/[[...tool]]/     # Studio Sanity sur /studio/
│   ├── api/contact|newsletter/ # routes serveur (formulaires)
│   ├── sitemap.ts  robots.ts   # générés, bilingues avec hreflang
│   └── not-found.tsx
├── components/
│   ├── layout/                 # Header, Footer, RevealObserver
│   ├── sections/common.tsx     # PageHero, SecHead, CtaBand, Quote
│   ├── interactive/            # Flow, Network, Tabs, Accordion, Counters
│   ├── forms/                  # ContactForm, NewsletterForm
│   └── Figure.tsx              # SVG inline (jamais de fetch client)
├── lib/
│   ├── content/                # CONTENU FRANÇAIS (modules typés)
│   │   └── en/                 # CONTENU ANGLAIS (traduction miroir)
│   ├── sanity/                 # client GROQ + requêtes + gates
│   ├── server/                 # email Brevo, rate-limit, stockage fichiers
│   ├── strings.ts              # libellés d'interface fr/en
│   ├── i18n.ts                 # table de correspondance des routes fr ↔ en
│   └── seo.tsx                 # métadonnées + JSON-LD
├── sanity/schemas/index.ts     # LES 9 TYPES DE DOCUMENTS DU CMS
├── sanity.config.ts            # configuration du Studio
├── styles/                     # CSS des maquettes (ne pas modifier)
├── public/fig/                 # illustrations SVG
└── next.config.ts              # en-têtes de sécurité, cache
```

### Deux idées à retenir

1. **Deux layouts de langue, un seul document HTML.** `app/layout.tsx` ne rend que `children` ;
   `app/(fr)/layout.tsx` et `app/[locale]/layout.tsx` montent chacun `<html lang="…">` via
   `LocaleShell`. C'est ce qui donne un vrai `lang` par branche (bon pour le SEO et les lecteurs
   d'écran).
2. **Le CSS est intouchable.** `styles/integra.css` et `styles/integra-plus.css` sont des copies
   verbatim des maquettes validées. Tout habillage supplémentaire va dans `styles/app.css`.
   Si un rendu diffère des maquettes, le bug est dans le JSX, jamais dans le CSS.

---

## 4. Où vit le contenu — et comment le modifier

### 4.1 Le principe : deux modes, une seule vérité

Le site peut lire son contenu de deux endroits :

| Mode | Où | Qui l'utilise |
|---|---|---|
| **Sans CMS** (état actuel) | `lib/content/*.ts` (fr) et `lib/content/en/*.ts` (en) | le développeur |
| **Avec CMS** (Sanity configuré) | dataset Sanity | l'éditeur, sans coder |

**Sans Sanity, tout fonctionne** : c'est le mode de livraison actuel. Dès que les variables
`SANITY_*` sont renseignées, les pages qui interrogent le CMS (`lib/sanity/queries.ts`) reçoivent
les documents ; si un document manque, elles retombent sur le module local. Le CMS n'est donc
jamais une dépendance de rendu.

### 4.2 Modifier le contenu sans CMS (côté développeur)

| Fichier | Ce qu'il contient |
|---|---|
| `lib/content/poles.ts` | Les 6 pôles : titres, couvertures, capacités, profils, pôles liés, géométrie du schéma réseau |
| `lib/content/prestations.ts` | Les 4 prestations : situation, actions, livrables, conditions, périmètre exclu |
| `lib/content/steps.ts` | Les 6 étapes de la méthode et leurs 6 traces écrites |
| `lib/content/vision.ts` | Ruptures, bloc IA, publics, comparaison sans/avec cadre, principe |
| `lib/content/reseau.ts` | Fonctions du réseau, statut des pôles, engagements |
| `lib/content/references.ts` | Gabarits de publications / cas d'usage / actualités, règles de publication |
| `lib/content/site.ts` | Identité, coordonnées, mentions légales — **un champ vide ne rend rien** |
| `lib/content/forms.ts` | Libellés et options des formulaires |
| `lib/content/legal.ts` | Contenu des pages légales |
| `lib/content/en/*` | **Traduction anglaise** des mêmes modules (voir partie 7) |

Après une modification : `npm.cmd run dev` recharge tout seul.

### 4.3 Ce qu'il ne faut jamais faire

- Écrire une valeur par défaut inventée (`email: "contact@exemple.com"`) : laisser `""`.
- Toucher à `styles/*.css` (sauf `app.css`).
- Ajouter un fil d'Ariane visible ou un sur-titre au-dessus d'un H1.
- Publier un contenu non vérifié : voir partie 8.

---

## 5. Le CMS Sanity : configuration pas à pas

Sanity est un CMS **headless** : les contenus sont stockés chez Sanity, le site les lit via une API.
L'édition se fait dans un Studio web, accessible ici sur `/studio/`.

> **Pourquoi Sanity plutôt que Decap ou WordPress ?** `CONTEXT_MVP.md` § 3bis.2 : Studio React
> embarqué dans le site, schémas typés, aperçu en direct, pas de serveur à administrer. Decap
> (contenu dans Git) est documenté comme repli ; Payload est écarté (base de données persistante).

### 5.1 Créer le projet (5 minutes, gratuit)

1. Aller sur **https://sanity.io/manage** et se connecter (GitHub ou Google).
2. **Create project**.
   - Nom : `INTEGRA SCIENCE`
   - Dataset par défaut : `production`
3. Noter le **Project ID** affiché en haut du tableau de bord : une suite de 8 caractères
   (`a1b2c3d4`). C'est la valeur la plus importante.

### 5.2 Créer un token de lecture

1. Dans le projet : **API** → **Tokens** → **Add API token**.
2. Nom : `site-lecture`. Permission : **Viewer** (lecture seule).
3. Copier le token (il ne s'affiche qu'une fois) : `sk...`.

> Le token sert au build du site à lire le dataset. Il reste côté serveur, dans `.env.local` puis
> dans les variables Vercel. Il ne doit **jamais** être commité ni mis dans une variable
> `NEXT_PUBLIC_*`.

### 5.3 CORS (autoriser le Studio à écrire)

1. **API** → **CORS origins** → **Add CORS origin**.
2. Ajouter, pour chacun :
   - `http://localhost:3000` — cocher *Allow credentials*
   - `https://votre-domaine.com` — cocher *Allow credentials* (à faire après le déploiement)

Sans cette étape, le Studio s'ouvre mais refuse de se connecter.

### 5.4 Renseigner les variables

Dans `.env.local` :

```ini
NEXT_PUBLIC_SANITY_PROJECT_ID=a1b2c3d4
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_PROJECT_ID=a1b2c3d4
SANITY_DATASET=production
SANITY_READ_TOKEN=sk...
```

Les variables `NEXT_PUBLIC_SANITY_*` sont lues par le navigateur (Studio). Sans le préfixe
`NEXT_PUBLIC_`, Next.js ne les transmet pas et le Studio affiche « Invalid project id » :
les alias `SANITY_STUDIO_*` ne suffisent pas au Studio embarqué. Les variables `SANITY_*` restent
côté serveur (lecture du site) et ne sont jamais exposées au navigateur. Les deux paires portent
la même valeur de projet.

### 5.5 Activer le Studio

```powershell
npm.cmd run dev
```

Ouvrir **http://localhost:3000/studio/** :

- **Avant** configuration : une page d'attente rappelle les quatre étapes ci-dessus.
- **Après** configuration : le Studio s'ouvre, connexion avec le même compte que sanity.io/manage.

### 5.6 Le schéma est déjà écrit

Rien à créer dans l'interface : `sanity/schemas/index.ts` déclare les **9 types de documents** et
`sanity.config.ts` déclare le menu du Studio. Les champs sont déjà nommés en français et
documentés par une phrase d'aide.

Pour modifier un champ (en ajouter un, changer une option), on édite `sanity/schemas/index.ts` :
le Studio se met à jour au rechargement.

### 5.7 Importer le contenu actuel

Le contenu vit aujourd'hui dans `lib/content/*`. L'import initial vers Sanity est automatisé :

```bash
# 1. Aperçu : affiche les 10 documents, n'écrit rien
npm run sanity:import -- --dry-run

# 2. Écriture réelle dans le dataset
npm run sanity:import
```

`scripts/import-sanity.ts` lit les modules de contenu (`lib/content/poles.ts` et
`lib/content/prestations.ts` pour le français, `lib/content/en/*` pour l'anglais) et crée 10 documents
à `_id` fixes (`pole-biologie`, `prestation-analyse-omiques`…). Il passe par `createOrReplace` : le
relancer met à jour les documents existants sans créer de doublon. Les champs techniques (icônes,
slugs, clés, ordre) sont repris du français ; seuls les textes changent de langue.

L'écriture exige un token disposant du droit d'écriture, dans `.env.local` :

```dotenv
SANITY_WRITE_TOKEN=…
```

Un token de lecture seule ne suffit pas : Sanity répond 403. Le repli local reste actif pendant
toute la transition : on peut remplir le CMS progressivement, document par document.

---

## 6. Prendre en main le Studio

### 6.1 Se connecter

`http://localhost:3000/studio/` (ou `https://votre-domaine.com/studio/`). Connexion avec le compte
Sanity. Le Studio n'est **pas indexé** (`noindex`) et n'apparaît pas dans le `sitemap.xml`.

### 6.2 Le menu de gauche

```
Paramètres du site          ← un seul document (singleton)
──────────────────────────
Pages                       ← contenu éditorial par page
Pôles d'expertise           ← 6 fiches, triées par numéro
Prestations                 ← 4 fiches
Membres du réseau           ← fiches personnes
──────────────────────────
Publications                ← articles, communications, rapports
Cas d'usage                 ← situations anonymisées
Actualités                  ← fil daté
──────────────────────────
Abonnés newsletter          ← inscriptions
```

### 6.3 Les 9 types de documents

| Type | À quoi il sert | Champs notables |
|---|---|---|
| `parametresSite` | Nom, signature, accroche, coordonnées, identité légale | Rien ne s'affiche si vide |
| `page` | Titre, chapeau, corps riche, SEO, bandeau final | Un document par page |
| `pole` | Fiche d'un pôle d'expertise | `numero` (01–06), `capacites`, `polesLies` |
| `prestation` | Fiche d'une prestation | `situation`, `actions`, `livrables`, `conditions` |
| `membre` | Personne du réseau | `publie` — coché seulement avec accord écrit |
| `publication` | Article, communication, rapport | `verifie`, `anonymise`, `accordClient` |
| `casUsage` | Situation réelle anonymisée | `limites` **obligatoire** |
| `actualite` | Actualité datée | `date` obligatoire |
| `abonne` | Abonné à la lettre d'information | géré par le site |

### 6.4 Les trois gestes du quotidien

**Publier un texte existant** — ouvrir le document, corriger le champ, cliquer **Publish** (en bas
à droite). Tant qu'on ne clique pas, la modification reste un brouillon : le site ne la voit pas.

**Créer une actualité** — *Actualités* → **Create new** → titre, texte (2–3 phrases), catégorie,
date → cocher *Contenu vérifié* et *Anonymisé* → **Publish**.

**Prévisualiser** — le bouton **Vision** (en haut) permet d'écrire une requête GROQ et de voir
exactement ce que le site recevra. Utile pour vérifier qu'un document est bien filtré.

### 6.5 Les champs à ne jamais remplir « au hasard »

- **Identité légale** (`parametresSite` → *Identité légale*) : à remplir avec les vrais éléments
  juridiques seulement. Vide, le bloc n'apparaît pas.
- **Coordonnées** : une adresse inventée est pire que pas d'adresse.
- **Membres** : ne cocher `publie` qu'avec l'accord écrit de la personne.

### 6.6 Ce que le Studio ne fait pas

- Il ne modifie pas la mise en page ni les couleurs : c'est le code (`styles/`).
- Il ne crée pas de nouvelles pages : une page existe parce qu'une route existe dans `app/`.
  Pour une nouvelle page, il faut du code.
- Il n'envoie pas la newsletter : le site enregistre les abonnés, l'envoi se fait dans Brevo.

---

## 7. Le site bilingue fr / en

### 7.1 Le principe : deux routes, pas une traduction automatique

Le miroir anglais est fait de **vraies pages** (`/en/…`), pas d'un sélecteur JavaScript ni d'une
API de traduction. C'est la seule solution correcte pour le SEO (indexation séparée, hreflang) et
pour la lisibilité.

La correspondance est déclarée une seule fois dans `lib/i18n.ts` :

| Français | Anglais |
|---|---|
| `/` | `/en/` |
| `/vision/` | `/en/vision/` |
| `/expertises/` | `/en/expertise/` |
| `/expertises/biologie/` | `/en/expertise/biology/` |
| `/prestations/` | `/en/services/` |
| `/methode/` | `/en/method/` |
| `/reseau/` | `/en/network/` |
| `/qualite-scientifique/` | `/en/scientific-quality/` |
| `/references/` | `/en/references/` |
| `/cas-usage/` | `/en/case-studies/` |
| `/actualites/` | `/en/news/` |
| `/mentions-legales/` | `/en/legal/` |
| `/confidentialite/` | `/en/privacy/` |

Le sélecteur de langue de l'en-tête utilise cette table : il pointe toujours vers **la page
équivalente**, jamais vers l'accueil de l'autre langue (`CONTEXT_MVP.md` § 4.3).

### 7.2 Le fonctionnement — un texte, deux langues

Le bilinguisme n'est **pas** un miroir de fichiers. Un texte existe une seule fois, sous la forme
d'un champ à deux valeurs :

```ts
title: { fr: "Bio-imagerie", en: "Bio-imaging" }
```

Ce champ vit au même endroit que le reste de son contenu : dans un module `lib/content/*` tant que
le Studio n'est pas activé, puis dans **un seul document Sanity** ensuite. Il n'y a jamais deux
fichiers à maintenir en parallèle.

Les pages ne choisissent plus une langue en important un module : elles lisent la bonne valeur.

```ts
import { t } from "@/lib/locale";

<h3>{t(pole.title, "fr")}</h3>   // page française
<h3>{t(pole.title, "en")}</h3>   // page anglaise
```

**Règle de repli** : si l'anglais est vide, `t()` rend le français. Une page anglaise affiche donc
toujours quelque chose de juste, jamais un trou — et l'absence de traduction se voit tout de suite,
ce qui est le but.

### 7.3 La structure du contenu

| Fichier | Rôle |
|---|---|
| `lib/locale.ts` | Le cœur : `Locale`, `L`, `t()`, `translate()`, `localize()`. La liste `NON_TEXT_KEYS` dit ce qui **ne se traduit jamais** (icônes, slugs, numéros, clés, liens). |
| `lib/content/poles.ts`, `prestations.ts`, `steps.ts`, `reseau.ts`, `vision.ts`, `references.ts` | Les textes français, avec leurs clés stables. |
| `lib/content/en/*` | Les textes anglais **seuls** — aucune clé, aucun slug, aucun numéro n'y est recopié. |
| `lib/content/bilingue.ts` | Le point de passage unique : il fusionne les deux et exporte `poles`, `prestations`, `steps`, `roles`, `poleStatuses`, `vision`, `references` en bilingue. **C'est ce fichier que les pages importent.** |

Pourquoi une **clé stable** (`key`) sur chaque entrée : `slug` est un texte comme un autre (il se
traduit : `bio-imagerie` → `bio-imaging`). Pour retrouver un pôle, le lier à un autre, ou lui
donner une `key` React, il faut un identifiant qui ne bouge pas d'une langue à l'autre. C'est `key`.

### 7.4 Dans le Studio Sanity

Chaque champ texte est un objet à deux sous-champs, présentés ensemble dans la fiche :

```
Titre du pôle
├── Français   [ Biologie            ]
└── English    [ Biology             ]
```

Aucun bouton à chercher, aucune fiche à ouvrir en double : l'éditeur voit les deux langues
côte à côte et traduit au moment où il écrit.

Deux familles de champs, selon ce qu'ils portent :

- **`bilingue(...)`** — un texte (`string` ou `text`) : titre, résumé, chapeau, mention, note.
- **`bilingueList(...)`** — une liste d'entrées bilingues : capacités, livrables, profils, auteurs.
  Chaque entrée affiche sa langue française en titre et signale « fr seul » tant que l'anglais
  manque.

Les champs qui ne sont pas des textes restent simples : `slug`, `numero`, `icone`, `verifie`,
`anonymise`, `date`. Les traduire n'aurait pas de sens.

**Ce que l'éditeur doit retenir** : il n'y a pas de « version anglaise » du site à remplir. Il y a
des fiches, et dans chaque fiche, une case anglais. Vide, elle n'empêche rien : le site affiche le
français.

### 7.5 Ajouter un texte demain

1. Dans un module `lib/content/*` **ou** dans le Studio, écrire la valeur sous la forme
   `{ fr: "…", en: "…" }`.
2. La lire dans la page avec `t(champ, locale)`.
3. Rien d'autre : la même valeur sert les deux langues, le sélecteur de langue continue de pointer
   vers la page équivalente (`lib/i18n.ts`).

Pour une **nouvelle page entière**, il reste deux choses à déclarer à la main, et deux seulement :
la route (`app/(fr)/…` et `app/[locale]/…`) et sa correspondance dans `lib/i18n.ts`.

### 7.6 Ce qui ne change jamais d'une langue à l'autre

- Les **slugs internes** (clés de contenu) : `biologie`, `bioinformatique`… Seule l'URL change.
- Les **identifiants Sanity**.
- Les **classes CSS** et la structure des composants.

---

## 8. Les règles de publication

Deux barrières, dans cet ordre :

1. **Éditoriale, dans le Studio** — deux cases, décochées par défaut :
   - *Contenu vérifié* (`verifie`) : quelqu'un a relu et assume le contenu.
   - *Anonymisé* (`anonymise`) : aucun nom de client, de patient, de structure identifiable.
2. **Dans le code** — `estPubliable()` et `publies()` (`lib/sanity/client.ts`) filtrent chaque
   document en sortie de requête :

```ts
export function estPubliable(doc: { verifie?: boolean; anonymise?: boolean }): boolean {
  return doc.verifie === true && doc.anonymise === true;
}
```

**Effet** : un document non vérifié ou non anonymisé **ne peut pas** être rendu, même si une requête
GROQ est mal écrite. C'est volontaire : la sécurité ne repose pas sur la vigilance de l'éditeur.

Trois autres garde-fous :

- `accordClient` — trace de l'accord écrit du commanditaire (publications, cas d'usage).
- `publie` — une fiche membre n'apparaît qu'avec l'accord de la personne.
- `limites` — champ **obligatoire** de tout cas d'usage : « ce que cela ne prouve pas ».

---

## 9. Tester le projet

### 9.1 En local

```powershell
npm.cmd run dev
```

Puis vérifier à la main :

| À vérifier | Comment |
|---|---|
| Les 21 pages françaises | naviguer depuis l'accueil |
| Les 21 pages anglaises | `/en/` puis le sélecteur de langue |
| Le sélecteur de langue | il doit rester sur la même page, en changeant de langue |
| Le thème sombre | bouton dans l'en-tête, la préférence survit au rechargement |
| Les formulaires | `/contact/projet/` — sans Brevo, la demande est enregistrée dans `data/forms/` |
| La newsletter | `/newsletter/` — double opt-in, email de confirmation dans la console si Brevo absent |
| Le Studio | `/studio/` |

### 9.2 Vérifier un build de production

```powershell
npm.cmd run build
npm.cmd run start
```

Le build doit afficher `✓ Compiled successfully` et lister **42 routes**. Toute erreur de type
bloque le déploiement : c'est voulu.

### 9.3 Vérifier les routes en une commande

```powershell
$routes = @("/","/vision/","/expertises/","/prestations/","/methode/","/reseau/",
"/qualite-scientifique/","/references/","/publications/","/cas-usage/","/actualites/",
"/contact/","/mentions-legales/","/confidentialite/","/en/","/en/vision/","/en/expertise/",
"/en/services/","/en/method/","/en/network/","/en/scientific-quality/","/en/references/",
"/en/publications/","/en/case-studies/","/en/news/","/studio/")
$routes | ForEach-Object { "$_ -> " + (Invoke-WebRequest "http://localhost:3000$_" -UseBasicParsing).StatusCode }
```

Toutes doivent répondre `200`.

### 9.4 Vérifier le SEO

| Contrôle | Commande / outil |
|---|---|
| `lang` par branche | `curl http://localhost:3000/en/` → `<html lang="en"` |
| hreflang réciproque | `curl http://localhost:3000/vision/` → `hrefLang="en" href="…/en/vision/"` |
| Sitemap bilingue | `http://localhost:3000/sitemap.xml` — 40 URL avec alternatives |
| Robots | `http://localhost:3000/robots.txt` — **tout est bloqué** tant que `NEXT_PUBLIC_SITE_URL` est vide |
| Données structurées | validateur Schema.org (Organization, BreadcrumbList, Service) |

### 9.5 Vérifier l'accessibilité

- Navigation au clavier : Tab traverse le lien d'évitement, l'en-tête, le menu, le contenu.
- Contrastes : tous les couples texte/fond sont ≥ 4,5:1 (calculés dans `DESIGN.md`).
- Aucun fil d'Ariane visible, aucun sur-titre au-dessus d'un H1.

### 9.6 Tester les formulaires

1. `/contact/projet/` : remplir, envoyer. Sans Brevo : `data/forms/projet/*.json` doit apparaître.
2. Envoyer 4 fois d'affilée : la 4e réponse est `429` (limitation 3/heure/IP).
3. Piège à robots : remplir le champ caché `website` → la demande est ignorée silencieusement.

---

## 10. Déployer en production

### 10.1 Vercel (recommandé, gratuit)

1. Pousser le dépôt sur GitHub (depuis `F:\integra_science\integra-science`) :
   ```powershell
   git add -A
   git commit -m "Mise en production"
   git push
   ```
2. **https://vercel.com** → *Add New… Project* → importer le dépôt `nicearts44/integra_science`.
3. Réglages :
   - Framework preset : **Next.js** (détecté)
   - Root directory : `./` — le dépôt contient **le projet lui-même** (`package.json` à la racine du
dépôt). N'écris pas `integra-science` : ce dossier n'existe pas dans le dépôt, le build échouerait
sur un « No package.json found ».
   - Build command : `npm run build` (par défaut)
4. **Environment Variables** — ajouter, pour *Production* et *Preview* :
   ```
   NEXT_PUBLIC_SITE_URL   https://votre-domaine.com
   BREVO_API_KEY          xkeysib-…
   BREVO_FROM_EMAIL       contact@votre-domaine.com
   CONTACT_DESTINATAIRE   boite@votre-domaine.com
   SANITY_PROJECT_ID      a1b2c3d4
   SANITY_DATASET         production
   SANITY_READ_TOKEN      sk…
   NEXT_PUBLIC_SANITY_PROJECT_ID  a1b2c3d4
   NEXT_PUBLIC_SANITY_DATASET     production
   ```
   > Sur Vercel, `NEXT_PUBLIC_SANITY_*` doit aussi être présente : le Studio est compilé au build.
   > Sans le préfixe `NEXT_PUBLIC_`, la variable n'arrive pas au navigateur.
5. **Deploy**. Le premier build prend 2 à 4 minutes.
6. Ajouter le domaine : *Settings* → *Domains* → suivre les instructions DNS.
7. Retour dans Sanity → *CORS origins* : ajouter `https://votre-domaine.com` avec credentials.

### 10.2 Ce que le déploiement change

- `NEXT_PUBLIC_SITE_URL` étant défini, `robots.txt` autorise l'indexation et les URL canoniques
  pointent sur le vrai domaine. **Sans cette variable, le site reste invisible pour Google** —
  c'est un garde-fou volontaire.
- Les pages deviennent statiques servies par le CDN : pas de serveur à maintenir.

### 10.3 Après le premier déploiement

1. Soumettre `https://votre-domaine.com/sitemap.xml` dans **Google Search Console**.
2. Créer une surveillance **UptimeRobot** (gratuit) sur l'accueil, toutes les 15 minutes.
3. Tester l'envoi d'un formulaire réel.
4. Vérifier que `/studio/` fonctionne en production et qu'il reste `noindex`.

### 10.4 Hébergement alternatif (sans Vercel)

Le projet est un site Next.js standard :

```bash
npm ci
npm run build
npm run start        # écoute sur le port 3000
```

Derrière Nginx, avec HTTPS (Let's Encrypt). Les en-têtes de sécurité et le cache sont déjà
configurés dans `next.config.ts`.

> **Attention** : les soumissions de formulaires sont écrites sur disque (`data/`). Sur Vercel, le
> système de fichiers est éphémère — les fichiers disparaissent au redéploiement. Pour une
> conservation durable, brancher `DATA_DIR` sur un volume persistant, ou envoyer les soumissions
> dans Sanity / un service de stockage.

### 10.5 Sauvegarde du contenu

```bash
npx sanity dataset export production backup.tar.gz
```

À faire après chaque vague de publications. Le contenu du code (`lib/content/*`) est dans Git ;
le contenu du CMS, non — d'où cet export.

### 10.6 Le cycle quotidien : modifier → GitHub → Vercel

Une modification locale ne part **pas** toute seule sur GitHub, et un dépôt GitHub n'est **pas** un
site en ligne. Vercel reconstruit le site quand — et seulement quand — un commit arrive sur la
branche `main`.

**Prérequis, une seule fois** — dans *vercel.com* → projet → **Settings** → **Git** :

| Réglage | Valeur attendue |
|---|---|
| Connected Git Repository | `nicearts44/integra_science` |
| Production Branch | `main` |
| Root Directory | `./` |

---

#### 1. Se placer dans le dossier du projet

Le `package.json` est dans `integra-science`, pas à la racine `F:\integra_science` :

```powershell
cd F:\integra_science\integra-science
```

> C'est l'erreur la plus fréquente : `npm error path F:\integra_science\package.json` signifie
> simplement que la commande a été lancée un dossier trop haut.

#### 2. Récupérer la dernière version en ligne

À faire **avant** de commencer à modifier :

```powershell
cd F:\integra_science\integra-science
git pull --rebase
```

`Already up to date.` = rien n'a bougé depuis la dernière fois.

#### 3. Modifier, puis regarder le résultat en local

```powershell
npm run dev
```

Ouvrir `http://127.0.0.1:3000/`. `Ctrl + C` dans le terminal pour arrêter.

#### 4. Vérifier ce qui a changé

```powershell
git status     # liste des fichiers touchés
git diff       # le détail ligne par ligne (q pour quitter)
```

#### 5. Enregistrer la modification (commit)

```powershell
git add -A
git commit -m "Pôle Biologie : précision sur l'interprétation"
```

Le message décrit **pourquoi** la modification a été faite : il apparaît dans l'historique et
sur Vercel.

#### 6. Envoyer sur GitHub (push)

```powershell
git push
```

#### 7. Laisser Vercel reconstruire

1. *vercel.com* → projet → **Deployments** : une ligne *Building* apparaît dans les secondes qui
   suivent le push.
2. 2 à 4 minutes plus tard : *Ready*. L'URL de production sert le nouveau build.
3. Si *Error* : ouvrir le déploiement → **Building** (les logs). L'erreur est la même qu'un
   `npm run build` en local.

#### 8. Vérifier en ligne

Recharger le site avec `Ctrl + F5`. Si c'est bon, c'est terminé.

---

**Tout en une seule commande** (après les étapes 1 et 2) :

```powershell
git add -A; git commit -m "Description courte de la modification"; git push
```

**Demander à l'agent de le faire** : « commit et pousse mes modifications ». Le dépôt distant et
l'identité Git sont configurés sur cette machine, l'agent peut exécuter `git add / commit / push`
(il ne le fait que sur demande).

**Ce qui ne déclenche rien** :

| Situation | Effet |
|---|---|
| Fichier modifié, pas de commit | rien |
| Commit fait, pas de push | rien (le commit reste sur la machine) |
| Push sur une autre branche que `main` | Vercel produit une *Preview*, la production ne change pas |
| Push sur `main` | build de production automatique |

---

### 10.7 Résoudre un conflit Git

Un conflit n'arrive que dans un seul cas : **les mêmes lignes d'un même fichier ont été modifiées
à deux endroits** (toi en local, et une autre modification arrivée sur GitHub). Rien n'est perdu :
Git s'arrête et demande de choisir.

#### Cas 1 — le push est refusé

```
! [rejected]  main -> main (fetch first)
error: failed to push some refs
```

GitHub a un commit que tu n'as pas encore. On l'intègre, puis on renvoie :

```powershell
git pull --rebase
git push
```

Si `git pull --rebase` répond `Successfully rebased`, tout est réglé. Sinon, voir le cas 2.

#### Cas 2 — le pull s'arrête sur un conflit

```
CONFLICT (content): Merge conflict in lib/content/poles.ts
error: could not apply 4f2a1c9...
```

1. Voir les fichiers en conflit :

   ```powershell
   git status
   ```

   Section **Unmerged paths** (« both modified »).

2. Ouvrir le fichier. Git a inséré des marqueurs :

   ```
   <<<<<<< HEAD
   Le texte déjà en ligne
   =======
   Mon texte local
   >>>>>>> 4f2a1c9 (Pôle Biologie…)
   ```

3. Garder la bonne version — souvent **les deux**, réécrites proprement — puis **supprimer les trois
   marqueurs** (`<<<<<<<`, `=======`, `>>>>>>>`). Le fichier doit redevenir du code normal.

4. Marquer le fichier résolu et continuer :

   ```powershell
   git add lib/content/poles.ts
   git rebase --continue
   ```

   Répéter pour chaque fichier de la liste.

5. Envoyer :

   ```powershell
   git push
   ```

#### Choisir une version entière, sans éditer

```powershell
git checkout --ours   lib/content/poles.ts   # garder la version déjà en ligne
git checkout --theirs lib/content/poles.ts   # garder ma version locale
git add lib/content/poles.ts
git rebase --continue
```

#### Tout annuler et revenir à l'état d'avant

```powershell
git rebase --abort        # si le message parlait de « rebase »
git merge --abort         # si le message parlait de « merge »
```

#### Mettre ses modifications de côté avant un pull

```powershell
git stash        # range les modifications non enregistrées
git pull --rebase
git stash pop    # les remet en place (un conflit peut apparaître ici aussi)
```

#### Fichiers à risque dans ce projet

| Fichier | Réflexe |
|---|---|
| `lib/content/poles.ts`, `prestations.ts` | conflit de texte : fusionner les deux versions à la main, puis `npm run dev` pour relire |
| `package-lock.json` | ne pas éditer : `git checkout --theirs package-lock.json`, puis `npm install`, puis `git add package-lock.json` |
| `GUIDE.md`, `README.md` | fusionner les deux paragraphes |
| `next.config.ts`, `app/**`, `components/**` | relire le résultat : un demi-fichier cassera le build |
| `.env.local`, `node_modules/`, `.next/` | jamais versionnés, donc jamais en conflit |

#### Après tout conflit résolu

`npm run build` doit passer **avant** de pousser. Un build cassé en local = un déploiement Vercel
en échec, et le site reste sur la version précédente.

#### Retrouver ce qu'on a fait

```powershell
git log --oneline --graph -15   # les 15 derniers commits
git reflog                     # tout, y compris les opérations annulées
```

---

### 10.8 Reconstruire le site quand le contenu change dans Sanity

Le site est statique : une modification faite dans le Studio ne se voit **qu'après un nouveau
build**. Le branchement tient en deux réglages, à faire une seule fois.

#### 1. Créer un « Deploy Hook » sur Vercel

*vercel.com* → projet → **Settings** → **Git** → **Deploy Hooks** :

- Name : `sanity-content`
- Branch : `main`

→ **Create Hook**, puis **copier l'URL** (elle ressemble à
`https://api.vercel.com/v1/integrations/deploy/prj_xxxx/yyyy`).

> C'est un secret : ne pas la coller dans un fichier du dépôt.

#### 2. Appeler cette URL depuis Sanity

*sanity.io/manage* → projet → **API** → **Webhooks** → **Create webhook** :

| Champ | Valeur |
|---|---|
| Name | `vercel-rebuild` |
| URL | l'URL du Deploy Hook |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["pole", "prestation", "publication", "actualite", "parametresSite"]` |
| Projection | `{_id}` |

→ **Save**, puis **Send test** : Vercel doit afficher un déploiement supplémentaire.

#### 3. Vérifier

Publier un vrai document dans le Studio, attendre 2 à 4 minutes, recharger le site.

#### Limite à connaître aujourd'hui

Les pages **pôles** et **prestations** lisent encore les fichiers locaux (`lib/content/*.ts`), pas
Sanity. Un webhook Sanity redéploie donc bien le site, mais ne changera le texte de
`/expertises/biologie/` que le jour où ces pages seront branchées sur `getPoleSanity()`. Seuls les
**paramètres du site** (en-tête, pied de page, coordonnées) viennent déjà de Sanity.

#### Relancer un déploiement à la main

*Deployments* → ligne du dernier build → `⋯` → **Redeploy**. Un commit vide ne sert à rien.

---

### 10.9 Ce qu'il ne faut jamais mettre dans Git

Déjà couvert par `.gitignore` : `node_modules/`, `.next/`, `out/`, `build/`, `data/`, `.env`,
`.env.local`, `*.tsbuildinfo`, `.sanity-import/`, `start.log`.

Contrôle rapide :

```powershell
git status --ignored --short | Select-String "^!!"
```

Si un fichier interdit est **déjà suivi** (erreur passée), le retirer de l'index sans le supprimer
du disque :

```powershell
git rm --cached start.log
git commit -m "Retirer les journaux du dépôt"
git push
```

> Un secret déjà poussé reste dans l'historique : le seul vrai remède est de le **régénérer**
> (nouveau token Sanity, nouvelle clé Brevo) et de mettre à jour `.env.local` et Vercel.

### 10.10 Le back-office : gérer le site sans code

À partir d'ici, plus rien ne s'édite dans les fichiers à la main. Le site a son propre espace de
gestion, indépendant de Sanity.

**Adresse :** `/admin/` (exemple en local : `http://localhost:3000/admin/`). La page n'est ni
indexée ni liée depuis le site public.

**Le contenu vit dans `content/`**, un fichier JSON par famille : `publications.json`,
`cas-usage.json`, `actualites.json`, `reseau.json`, `reglages.json`. Ils sont versionnés avec le
code : l'historique complet des textes est dans Git.

#### Se connecter

1. Ouvrir `/admin/` : la page de connexion s'affiche.
2. Saisir le mot de passe (`ADMIN_PASSWORD`).
3. La session dure sept jours, un bouton « Se déconnecter » est en bas du menu.

En développement, si `ADMIN_PASSWORD` n'est pas défini, le mot de passe de repli est `integra`.
En production, sans `ADMIN_PASSWORD`, la connexion est fermée : c'est volontaire.

#### Les sections

| Section | Ce qu'on y fait |
|---|---|
| Publications | Articles, communications, rapports |
| Cas d'usage | Situation, question, travail fait, limites |
| Actualités | Le fil daté du réseau |
| Réseau | Membres, fonctions, engagements |
| Messages | Les trois formulaires reçus, export CSV |
| Newsletter | Abonnés et statuts, export CSV |
| Réglages | Coordonnées, réseaux, citation, mentions légales |

#### Écrire une référence, pas à pas

1. **+ Nouvelle entrée**. Un brouillon est créé.
2. Remplir le français ; l'anglais est facultatif (le site retombe sur le français).
3. Vérifier l'identifiant d'URL : « Régénérer l'identifiant depuis le titre » le recalcule.
4. Pour une publication ou un cas d'usage, cocher les deux cases : **Vérifié** et **Anonymisé**.
   Sans les deux, le site ne l'affiche pas, quel que soit le statut.
5. Passer le statut sur **Publié**.
6. **Enregistrer** (ou `Ctrl+S`).

Un bandeau en haut de la fiche dit toujours si l'entrée est visible ou pourquoi elle ne l'est pas.

#### Ce que fait « Enregistrer »

| Où | Ce qui se passe |
|---|---|
| En local | le fichier `content/*.json` est mis à jour, la page se recharge aussitôt |
| Sur Vercel, avec `ADMIN_GITHUB_TOKEN` | un commit est créé dans le dépôt ; Vercel reconstruit et publie (une à deux minutes) |
| Sur Vercel, sans token | l'enregistrement est refusé avec un message explicite |

#### Variables à définir sur l'hébergement

```text
ADMIN_PASSWORD=…           # obligatoire : mot de passe du back-office
ADMIN_SECRET=…             # recommandé : signe le cookie (sinon ADMIN_PASSWORD sert de secret)
ADMIN_GITHUB_TOKEN=…       # token fine-grained, Contents: Read and write, ce dépôt uniquement
ADMIN_GITHUB_REPO=nicearts44/integra_science
ADMIN_GITHUB_BRANCH=main
```

Après modification des variables, redéployer une fois pour qu'elles prennent effet.

#### Réseau : la règle de l'accord

Un membre n'apparaît sur `/reseau/` que si les trois conditions sont réunies : statut `Publié`,
case **Accord écrit** cochée, et un nom renseigné. Le pôle affiche alors le nom, la fonction et le
lien ; sans membre publié, il garde « Responsable de pôle · fonction à renseigner ».

#### Ce qui reste à brancher

Les sections *Messages* et *Newsletter* lisent le stockage fichier (`data/`). Sur Vercel, ce dossier
n'est pas persistant : il faut une base (`DATABASE_URL`) pour conserver durablement les messages et
les abonnés. Tant que ce n'est pas fait, l'email reste la source fiable pour les messages, et le
formulaire de newsletter n'est pas réparable.

#### Revenir en arrière

Chaque enregistrement sur GitHub est un commit :

```powershell
git log --oneline -- content/
git revert <sha>
git push
```

Le déploiement Vercel repart de la version précédente.

---

## 11. Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `npm` : « l'exécution de scripts est désactivée » | politique PowerShell | utiliser `npm.cmd` |
| `/studio/` affiche la page d'attente | `NEXT_PUBLIC_SANITY_PROJECT_ID` absente | renseigner `.env.local` puis redémarrer |
| Le Studio affiche « Invalid project id » | variable nommée `SANITY_STUDIO_*` au lieu de `NEXT_PUBLIC_SANITY_*` | renommer la variable puis reconstruire (`npm run build`) |
| Le Studio s'ouvre mais ne se connecte pas | CORS non configuré | ajouter l'origine dans Sanity → API → CORS |
| Une page affiche un gabarit vide | catalogue vide **et** c'est normal | les publications s'affichent après vérification |
| Un document n'apparaît pas sur le site | `verifie` ou `anonymise` décoché | cocher les deux, puis **Publish** |
| `robots.txt` interdit tout | `NEXT_PUBLIC_SITE_URL` vide | renseigner la variable |
| Formulaire : « enregistré » mais pas d'email | Brevo non configuré | renseigner `BREVO_API_KEY` et `CONTACT_DESTINATAIRE` |
| Le port 3000 est occupé | ancien serveur | `npx kill-port 3000` ou redémarrer la machine |
| `next build` échoue sur un type | contenu ou composant modifié | lire l'erreur : elle nomme le fichier et le champ |
| `npm error path F:\integra_science\package.json` | commande lancée à la racine au lieu de `integra-science` | `cd F:\integra_science\integra-science` |
| `git push` refusé (`fetch first`) | GitHub a des commits plus récents | `git pull --rebase` puis `git push` (§ 10.7) |
| `CONFLICT` au `git pull` | même fichier modifié à deux endroits | § 10.7 |
| `Author identity unknown` | identité Git non configurée | `git config user.name "nicearts44"` et `git config user.email "nicephoreagossou44@gmail.com"` |
| Vercel : « No package.json found » | Root Directory mal réglé | Settings → Build → Root Directory = `./` |
| Le site ne change pas après un `push` | mauvais dépôt ou mauvaise branche | Settings → Git : `nicearts44/integra_science`, branche `main` |
| Le site ne change pas après une publication Sanity | pas de Deploy Hook, ou page non branchée sur le CMS | § 10.8 |

---

## 12. Checklist avant mise en ligne

- [ ] `NEXT_PUBLIC_SITE_URL` renseignée (blocant)
- [ ] `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, `CONTACT_DESTINATAIRE` renseignées
- [ ] Identité juridique complétée (`lib/content/site.ts` ou `parametresSite`) — sinon bloc vide
- [ ] Projet Sanity créé, CORS configuré, Studio accessible
- [ ] `npm.cmd run build` passe sans erreur
- [ ] Les 42 routes répondent `200`
- [ ] Formulaire de contact testé de bout en bout (réception de l'email)
- [ ] Newsletter testée (confirmation + désinscription)
- [ ] `sitemap.xml` soumis à Google Search Console
- [ ] UptimeRobot actif
- [ ] Traductions anglaises relues par un anglophone du domaine
- [ ] `npx sanity dataset export` programmé

---

## Annexe — Repères techniques

| Élément | Valeur |
|---|---|
| Police des titres | Fraunces (`next/font`, auto-hébergée) |
| Police du texte | Instrument Sans |
| Police des données | JetBrains Mono |
| Palette | 60 % Lavender / 30 % Ink / 10 % Frozen Lake ; `#6B0504` réservé aux erreurs |
| Icônes | Phosphor (3 graisses, auto-hébergées) |
| Illustrations | unDraw recolorées via variables CSS (`public/fig/`) |
| Thème | clair/sombre, préférence dans `localStorage` (`integra-theme`) |
| Contraste minimum | 4,5:1 pour tout texte |
| URLs | toujours avec barre finale (`trailingSlash: true`) |

---

*Dernière mise à jour : voir l'historique Git. En cas de contradiction entre ce guide et
`CONTEXT_MVP.md`, c'est `CONTEXT_MVP.md` qui fait foi — et il faut corriger ce guide.*
