import fr from './fr';
import en, { type Dict } from './en';
import type { ImageMetadata } from 'astro';

import dashboardFr from '../assets/screens/fr/dashboard.png';
import signupFr from '../assets/screens/fr/signup.png';
import pairingFr from '../assets/screens/fr/pairing.png';
import dashboardEn from '../assets/screens/en/dashboard.png';
import signupEn from '../assets/screens/en/signup.png';
import pairingEn from '../assets/screens/en/pairing.png';

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

const dicts: Record<Locale, Dict> = { fr, en };

/** Captures d'écran par langue : l'interface affichée suit la langue de la page. */
const screens: Record<Locale, Record<'dashboard' | 'signup' | 'pairing', ImageMetadata>> = {
  fr: { dashboard: dashboardFr, signup: signupFr, pairing: pairingFr },
  en: { dashboard: dashboardEn, signup: signupEn, pairing: pairingEn },
};

export const useTranslations = (locale: Locale) => dicts[locale];
export const useScreens = (locale: Locale) => screens[locale];

export const homePath = (locale: Locale) => (locale === defaultLocale ? '/' : `/${locale}/`);

export const links = {
  repo: 'https://github.com/CtrlAltBro/app',
  org: 'https://github.com/CtrlAltBro',
  license: 'https://github.com/CtrlAltBro/app/blob/dev/LICENSE.md',
};
