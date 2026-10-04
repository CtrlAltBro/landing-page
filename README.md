# CtrlAltBro · landing page

Site statique [Astro](https://astro.build), généré en HTML pur (aucun framework côté client) à partir du design « CtrlAltBro Landing » de Claude Design.

```bash
npm install
npm run dev      # http://localhost:4321
SITE_URL=https://votre-domaine.fr npm run build   # → dist/
```

`SITE_URL` active les URL absolues : canonical, hreflang, image Open Graph et `sitemap-index.xml`.

## Structure

- `src/i18n/fr.ts`, `src/i18n/en.ts` : tous les textes. FR à la racine `/`, EN sous `/en/`.
- `src/assets/screens/{fr,en}/` : captures de l'app, choisies selon la langue et optimisées en WebP au build.
- `src/styles/tokens.css`, `src/styles/keys.css` : design system CtrlAltBro (copie fidèle de Claude Design).
- `public/fonts/` : Bricolage Grotesque et Figtree auto-hébergées (aucune requête vers Google).
- `src/scripts/` : animations en JS natif (logo, touches, apparitions, frise « Un mardi », démo de l'installeur, thème).

## À faire

- Lien de téléchargement de l'installeur Windows : bouton désactivé « Bientôt » dans `src/components/Install.astro`.
- Capture de l'installeur (étape 2) : remplacée pour l'instant par une maquette en HTML.
