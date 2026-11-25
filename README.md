# INTEGRA SCIENCE — site

> **Prise en main complète (installation, CMS Sanity, Studio, tests, déploiement) :
> voir [`GUIDE.md`](./GUIDE.md).** Ce README-ci décrit l'architecture et les règles du code.

Refonte du site INTEGRA SCIENCE en **Next.js 15 (App Router) + TypeScript + React 19**, à partir des
maquettes validées et des spécifications du projet (`DESIGN.md`, `CONTEXT_MVP.md`, `COPYWRITING.md`).

## Démarrage

```powershell
npm.cmd install
npm.cmd run dev      # http://localhost:3000
npm.cmd run build    # build de production
```

Copier `.env.example` vers `.env.local` et renseigner les valeurs **avant mise en ligne**
(`CONTEXT_MVP.md` § 16.2 — ces champs sont des blocants).

## Architecture

| Chemin | Rôle |
|---|---|
| `app/` | Routes (pages serveur) + `api/` (contact, newsletter) |
| `components/layout/` | En-tête, pied de page, observateur de révélations |
| `components/sections/` | Hero interne, en-têtes de section, bande d'appel, citation |
| `components/interactive/` | Diagramme de flux, schéma de réseau, compteurs, onglets |
| `components/forms/` | Formulaire de contact (AJAX + repli POST), formulaire de lettre |
| `app/(fr)/` | Toutes les routes françaises (layout qui monte `<html lang="fr">`) |
| `app/[locale]/` | Miroir anglais `/en/…` (`generateStaticParams` = `en` uniquement) |
| `app/studio/` | Studio Sanity embarqué (`/studio/`) |
| `lib/content/` | **Couche de contenu typée** : pôles, prestations, étapes, vision, réseau, références, formulaires, paramètres |
| `lib/content/en/` | Traductions anglaises des mêmes modules (pôles, prestations, étapes, pages, accueil) |
| `lib/strings.ts` | Libellés d'interface fr/en (navigation, pied de page, boutons) |
| `lib/i18n.ts` | Table `frToEn` — correspondance exacte route ↔ route |
| `lib/sanity/` | Client GROQ serveur, requêtes typées, **gates `verifie && anonymise`** |
| `sanity/schemas/` | Les neuf types de documents du CMS |
| `sanity.config.ts` | Configuration du Studio (structure, singletons, Vision) |
| `lib/server/` | Sauvegarde des soumissions, limitation de débit, emails Brevo |
| `lib/seo.tsx` | Métadonnées et données structurées (JSON-LD) |
| `styles/` | `integra.css` et `integra-plus.css` = **copies non modifiées des maquettes** |
| `public/fig/` | Illustrations SVG en ligne (jamais de `fetch()` côté client) |
| `public/fonts/` | Phosphor auto-hébergé (polices de marque via `next/font`) |

### Règles de fidélité appliquées

1. **CSS des maquettes inchangé** — `styles/integra.css` et `styles/integra-plus.css` sont des copies
   verbatim ; le seul fichier d'habillage est `styles/app.css` (pont `next/font`, lettre
   d'information, états légaux).
2. **Aucun contenu inventé** — tout le texte vient des maquettes ou de `COPYWRITING.md`.
3. **Un champ vide ne rend rien** — coordonnées, réseaux, mentions légales : le bloc entier
   disparaît tant que la valeur n'existe pas (`lib/content/site.ts`).
4. **Aucun sur-titre au-dessus d'un H1**, aucun fil d'Ariane visible (JSON-LD uniquement).
5. **Thème clair/sombre** : script anti-flash inline dans `app/layout.tsx` (reprise exacte de la
   maquette), bascule via l'icône d'en-tête, mémorisée dans `integra-theme`.
6. **Illustrations React** : composant `<Figure />` qui inline le SVG au rendu serveur.

## Miroir anglais (`/en/`)

Le site est **bilingue par routes réelles**, pas par un sélecteur JavaScript :

- `/` ↔ `/en/`, `/vision/` ↔ `/en/vision/`, `/prestations/` ↔ `/en/services/`,
  `/methode/` ↔ `/en/method/`, `/reseau/` ↔ `/en/network/`,
  `/qualite-scientifique/` ↔ `/en/scientific-quality/`, `/cas-usage/` ↔ `/en/case-studies/`,
  `/actualites/` ↔ `/en/news/`, `/mentions-legales/` ↔ `/en/legal/`,
  `/confidentialite/` ↔ `/en/privacy/` ;
- chaque pôle a son slug anglais : `/expertises/biologie/` ↔ `/en/expertise/biology/`,
  `bioinformatique` ↔ `bioinformatics`, `bio-imagerie` ↔ `bio-imaging`,
  `medecine-sante` ↔ `medicine-health`, `pharmacologie` ↔ `pharmacology`,
  `statistiques-ia` ↔ `statistics-ai`.

Règles tenues :

1. **Le sélecteur de langue pointe vers la page équivalente**, jamais vers l'accueil de l'autre
   langue (`frEquivalent` / `enEquivalent` dans `lib/i18n.ts`).
2. **hreflang réciproque** sur chaque page (`pageMeta` / `pageMetaEn`), et dans `sitemap.xml`
   (40 URL, chacune avec ses alternatives `fr` et `en`).
3. **`<html lang>` par branche** : `LocaleShell` monte le document entier, le layout racine ne
   rend que `children`.
4. Les traductions ne sont pas des calques : chaque phrase est réécrite en anglais, y compris les
   libellés d'interface (`lib/strings.ts`) et les titres SEO (`seoEn` dans `lib/seo.tsx`).

## CMS headless (Sanity) — édition sans code

Le contenu éditorial peut venir du CMS ; à défaut, le site rend les modules typés
`lib/content/*`. **Le CMS n'est jamais une dépendance de rendu** : sans variables
d'environnement, tout fonctionne.

**Neuf types de documents** (`sanity/schemas/index.ts`) :

| Type | Usage |
|---|---|
| `page` | Titre, chapeau, corps riche, SEO, bandeau final d'une page |
| `pole` | Les six pôles : couverture, capacités, profils, pôles partenaires |
| `prestation` | Les quatre prestations : situation, actions, livrables, conditions |
| `membre` | Fiches du réseau (affichées seulement si `publie` = vrai) |
| `publication` | Articles, communications, rapports |
| `casUsage` | Situation, question, ce qui a été fait, **ce que cela ne prouve pas** |
| `actualite` | Titre, texte, catégorie, date |
| `parametresSite` | Nom, signature, coordonnées, identité légale (singleton) |
| `abonne` | Abonnés de la lettre d'information |

**Deux barrières de publication** :

1. éditoriale, dans le Studio : deux cases `Contenu vérifié` et `Anonymisé`, décochées par défaut ;
2. **dans le code** : `estPubliable()` / `publies()` (`lib/sanity/client.ts`) filtrent chaque
   document en sortie de requête. Un document non vérifié ou non anonymisé ne peut pas être rendu,
   même si une requête GROQ est mal écrite.

**Activer le Studio** (gratuit) :

1. Créer un projet sur `sanity.io/manage`, noter le *project ID* et le *dataset*.
2. Créer un token de lecture (rôle *Viewer*).
3. Dans `.env.local` :

   ```ini
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_PROJECT_ID=xxxxxxxx
   SANITY_DATASET=production
   SANITY_READ_TOKEN=sk...
   ```

4. Redémarrer : `/studio/` devient le Studio. Tant que les variables manquent, `/studio/` affiche
   une page d'attente qui rappelle ces quatre étapes — jamais une erreur.

Le Studio est `noindex` (métadonnée) et n'est pas dans `sitemap.xml`.

## Formulaires

- `POST /api/contact` — trois parcours (`projet`, `candidature`, `partenariat`) :
  piège à robots (honeypot), vérification d'origine, limitation à 3 envois/heure/IP,
  sauvegarde disque systématique, puis deux emails via l'API Brevo (notification interne +
  accusé de réception). Si l'envoi échoue, la demande reste enregistrée (§ 8.5).
- `POST /api/newsletter` — **double opt-in** : enregistrement `en_attente` + jeton, email de
  confirmation (`/newsletter/confirmer/?token=`), désinscription en un clic
  (`/newsletter/desinscription?token=`). Les deux pages sont `noindex`.

## Gates de publication (résumé)

| Gate | Où | Effet |
|---|---|---|
| `verifie` | Studio + `estPubliable()` | Un contenu non vérifié n'est **jamais** rendu |
| `anonymise` | Studio + `estPubliable()` | Un contenu non anonymisé n'est **jamais** rendu |
| `accordClient` | Studio | Traçabilité de l'accord écrit du commanditaire |
| `publie` | Studio (`membre`) | Une fiche n'apparaît qu'avec l'accord de la personne |

## Contenu éditorial

Le contenu est stocké dans des tableaux typés sous `lib/content/`
(pôles, prestations, étapes, articles, publications, cas d'usage, mentions légales).
Les catalogues **actualités / publications / cas d'usage sont vides par défaut** : les pages
affichent l'état vide prévu par la spécification. Ajouter une entrée = ajouter un objet au
tableau ; les routes dynamiques, le RSS et le sitemap s'adaptent.

Cette couche est volontairement isolée : elle peut être remplacée par un CMS headless
(Sanity, Payload…) sans toucher aux composants de présentation.

## Périmètre livré

### Pages (toutes en 200, build statique vérifié)

| Route | Composant | Contenu |
|---|---|---|
| `/` | `app/page.tsx` | Accueil modulaire (hero, six pôles, prestations, méthode, citation, appel) |
| `/vision/` | `app/vision/page.tsx` | Trois ruptures, déplacement par l'IA, six pôles, publics, méthode en bref |
| `/expertises/` | `app/expertises/page.tsx` | Carte du réseau interactive, six pôles numérotés, flux, comparaison, chiffres |
| `/expertises/[slug]/` | `app/expertises/[slug]/page.tsx` | 6 fiches de pôle (SSG) |
| `/prestations/` | `app/prestations/page.tsx` | 4 onglets de prestation, livrables, périmètre exclu |
| `/methode/` | `app/methode/page.tsx` | Principe, parcours interactif, revue croisée, six traces, coût de la trace |
| `/reseau/` | `app/reseau/page.tsx` | Six fonctions, statut des responsables de pôle, engagements |
| `/qualite-scientifique/` | `app/qualite-scientifique/page.tsx` | Engagements vérifiables, ce que nous refusons de promettre |
| `/references/` | `app/references/page.tsx` | Deux gates, publications (onglets), cas d'usage, actualités |
| `/publications/` | `app/publications/page.tsx` | Catalogue filtrable (vide = gabarits) |
| `/cas-usage/` | `app/cas-usage/page.tsx` | Cas anonymisés (vide = gabarits) |
| `/actualites/` | `app/actualites/page.tsx` | Fil daté (vide = gabarits) |
| `/contact/` + 3 parcours | `app/contact/**` | Formulaire AJAX + repli POST, honeypot, limitation de débit |
| `/newsletter/` | `app/newsletter/**` | Double opt-in, confirmation, désinscription |
| `/mentions-legales/`, `/confidentialite/` | `app/*/page.tsx` | Pages légales, champs d'identification conditionnels |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | Générés depuis `lib/content/` |

### Contenus structurés (source unique de vérité)

| Fichier | Contenu |
|---|---|
| `lib/content/poles.ts` | 6 pôles + géométrie du schéma de réseau |
| `lib/content/prestations.ts` | 4 prestations + livrables + périmètre exclu |
| `lib/content/steps.ts` | 6 étapes + 6 traces + revue croisée + coût de la trace |
| `lib/content/vision.ts` | Ruptures, bloc IA, publics, comparaison, principe |
| `lib/content/reseau.ts` | 6 fonctions, statut des pôles, 6 engagements |
| `lib/content/references.ts` | Gates, catalogues vides, gabarits |
| `lib/content/site.ts` | Paramètres (identité, coordonnées, réseaux) — un champ vide ne rend rien |

### Gates de publication

`lib/content/references.ts` porte la règle du § 7.10 : un contenu n'est rendu que si
`verifie === true` **et** `anonymise === true` (`estPubliable()`). Les catalogues sont vides
aujourd'hui, donc les pages affichent leurs gabarits et leur état vide — jamais un fait inventé.

### Reste à faire avant mise en ligne

- `NEXT_PUBLIC_SITE_URL`, `BREVO_API_KEY`, `CONTACT_DESTINATAIRE` (blocants, cf. `.env.example`).
- Identité juridique dans `lib/content/site.ts` (mentions légales vides aujourd'hui).
- Créer le projet Sanity et renseigner les quatre variables (`SANITY_*`) : le Studio s'active seul.
- Faire relire les traductions anglaises par un anglophone natif du domaine (elles sont
  rédigées, pas encore validées par un tiers).
- Remplacer les gabarits de publications / cas d'usage / actualités par les premiers contenus
  vérifiés et anonymisés.
