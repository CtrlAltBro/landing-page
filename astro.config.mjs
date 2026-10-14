// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [
    starlight({
      title: 'CtrlAltBro · Docs',
      description: 'Installer, héberger et comprendre CtrlAltBro.',
      defaultLocale: 'root',
      locales: { root: { label: 'Français', lang: 'fr' }, en: { label: 'English', lang: 'en' } },
      customCss: ['./src/styles/docs.css'],
      routeMiddleware: './src/docs-middleware.ts',
      components: { SiteTitle: './src/components/docs/SiteTitle.astro' },
      sidebar: [
        { label: 'Bienvenue', translations: { en: 'Welcome' }, slug: 'docs' },
        {
          label: 'Installer',
          translations: { en: 'Install' },
          items: [
            {
              label: 'Choisir son hébergement',
              translations: { en: 'Choose your hosting' },
              slug: 'docs/hebergement',
            },
            {
              label: 'Déployer sur Cloudflare',
              translations: { en: 'Deploy on Cloudflare' },
              slug: 'docs/cloudflare',
            },
            {
              label: 'Installer l’agent Windows',
              translations: { en: 'Install the Windows agent' },
              slug: 'docs/windows',
            },
          ],
        },
        {
          label: 'Comprendre',
          translations: { en: 'Understand' },
          items: [
            {
              label: 'Architecture et synchronisation',
              translations: { en: 'Architecture and sync' },
              slug: 'docs/architecture',
            },
            {
              label: 'Règles et limites',
              translations: { en: 'Rules and limits' },
              slug: 'docs/regles',
            },
          ],
        },
        {
          label: 'Administrer',
          translations: { en: 'Manage' },
          items: [
            {
              label: 'Configuration',
              translations: { en: 'Configuration' },
              slug: 'docs/configuration',
            },
            {
              label: 'Sauvegardes et mises à jour',
              translations: { en: 'Backups and updates' },
              slug: 'docs/maintenance',
            },
            { label: 'Dépannage', translations: { en: 'Troubleshooting' }, slug: 'docs/depannage' },
          ],
        },
        { label: 'Retour au site', translations: { en: 'Back to the website' }, link: '/' },
      ],
    }),
    ...(site
      ? [sitemap({ i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en-US' } } })]
      : []),
  ],
});
