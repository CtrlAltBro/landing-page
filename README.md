# CtrlAltBro · landing page

Landing statique [Astro](https://astro.build) et documentation [Starlight](https://starlight.astro.build/) sous `/docs/`, dans un même build. La documentation inclut navigation responsive, recherche locale Pagefind et thèmes clair/sombre.

```bash
npm install
npm run dev      # http://localhost:4321
SITE_URL=https://votre-domaine.fr npm run build   # → dist/
```

`SITE_URL` active les URL absolues : canonical, hreflang, image Open Graph et `sitemap-index.xml`.

## Structure

- `src/content/docs/docs/` : documentation française en Markdown/MDX, publiée sous `/docs/` ; `src/content/docs/en/docs/` contient la version anglaise sous `/en/docs/`. Le second dossier `docs` définit le préfixe des routes Starlight.
- `src/content.config.ts` : schémas et loaders Starlight ; `src/content/i18n/fr.json` : libellés personnalisés.
- `src/styles/docs.css` et `src/components/docs/SiteTitle.astro` : identité visuelle de la documentation, avec les polices et le logo de la landing.
- `src/i18n/fr.ts`, `src/i18n/en.ts` : tous les textes. FR à la racine `/`, EN sous `/en/`.
- `src/assets/screens/{fr,en}/` : captures de l'app, choisies selon la langue et optimisées en WebP au build.
- `src/styles/tokens.css`, `src/styles/keys.css` : design system CtrlAltBro (copie fidèle de Claude Design).
- `public/fonts/` : Bricolage Grotesque et Figtree auto-hébergées (aucune requête vers Google).
- `src/scripts/` : animations en JS natif (logo, touches, apparitions, frise « Un mardi », démo de l'installeur, thème).

## Modifier la documentation

Ajoutez une page dans `src/content/docs/docs/` avec un frontmatter `title` et `description`, ajoutez sa traduction sous `src/content/docs/en/docs/` avec le même nom de fichier, puis ajoutez son slug à la sidebar dans `astro.config.mjs`. Les pages de la landing restent dans `src/pages/` (FR et EN) ; la documentation est disponible en français et en anglais, avec changement de langue sur la page correspondante.

La recherche est construite par Pagefind pendant `npm run build`. Testez-la avec `npm run preview`, pas seulement avec le serveur de développement. Le dossier `dist/` contient la landing et la documentation et se déploie en une seule fois sur un hébergement statique.

Le contenu distingue le déploiement disponible sur Cloudflare du self-host complet sur VPS/NAS, qui n'est pas encore fourni. Les commandes serveur ont été recoupées avec les sources mais n'ont pas été exécutées contre une instance de production neuve.

## À faire

- Lien de téléchargement de l'installeur Windows : bouton désactivé « Bientôt » dans `src/components/Install.astro`.
- Capture de l'installeur (étape 2) : remplacée pour l'instant par une maquette en HTML.
