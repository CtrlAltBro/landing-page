import type fr from './fr';

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { readonly [K in keyof T]: Widen<T[K]> }
      : T;
export type Dict = Widen<typeof fr>;

const en: Dict = {
  lang: 'en',
  ogLocale: 'en_US',
  meta: {
    title: 'CtrlAltBro · Open source parental control for Windows PCs',
    description:
      'CtrlAltBro is an open source, self-hosted parental control for Windows PCs: screen time, schedules, apps and websites, all set from your dashboard. Your data stays at home.',
  },
  nav: {
    home: 'CtrlAltBro, back to top',
    links: [
      { href: '#journee', label: 'A day' },
      { href: '#contournements', label: 'Workarounds' },
      { href: '#donnees', label: 'Your data' },
      { href: '#installer', label: 'Install' },
    ],
    themeToDark: 'Dark mode',
    themeToLight: 'Light mode',
    themeAria: 'Switch theme',
    langAria: 'Language',
  },
  hero: {
    title: 'The PC has rules. Everyone knows them.',
    lead: 'CtrlAltBro is an open source parental control for Windows PCs that you host yourself. Screen time, schedules, websites: you set everything from the dashboard, and your kid sees what’s in place.',
    cta: 'Install CtrlAltBro',
    github: 'See the code on GitHub',
    windowTitle: 'CtrlAltBro · Dashboard',
    screenshotAlt:
      'The CtrlAltBro parent dashboard: screen time for the week, buttons to give extra time, send a message or lock the session.',
  },
  day: {
    title: 'A Tuesday with CtrlAltBro',
    pcName: 'Leo’s PC',
    online: 'Online',
    locked: 'Locked',
    screenTime: 'Screen time today',
    of: 'of',
    app: 'Minecraft',
    appLimit: '1 h / day',
    blocked: 'Blocked',
    web: 'Websites and search',
    webValue: 'SafeSearch on',
    bonus: 'Bonus granted at 6:15 pm',
    bonusKey: '+30 min',
    alert: 'PC clock changed',
    alertTime: '7:05 pm',
    axis: ['7 am', '11 am', '3 pm', '7 pm', '9 pm'],
    events: [
      {
        h: 7,
        title: 'The PC turns on.',
        text: 'On Tuesdays, the PC is allowed from 7 am to 9 pm, with 2 hours of screen time in total.',
      },
      {
        h: 7.5,
        title: 'A quick YouTube break before school.',
        text: 'Restricted Mode and SafeSearch, like every day. Nobody had to set anything.',
      },
      {
        h: 16.5,
        title: 'Back from school, Minecraft starts.',
        text: 'Today’s limit: 1 hour. The counter runs, and your kid can see it.',
      },
      {
        h: 17.5,
        title: 'Minecraft’s hour is up.',
        text: '“Time’s up” screen on Minecraft. The rest of the PC keeps working for homework.',
      },
      {
        h: 18.25,
        title: 'Homework done. You grant +30 min.',
        text: 'From your phone, without getting off the couch.',
      },
      {
        h: 19.08,
        title: 'Someone moved the PC clock forward.',
        text: 'CtrlAltBro keeps the real time. You get an alert, and the rule stays put.',
      },
      {
        h: 20.67,
        title: '20 minutes left.',
        text: 'The screen gives a heads-up, so there’s time to save and finish the game.',
      },
      {
        h: 21,
        title: '9 pm, the PC locks.',
        text: 'Nothing gets closed: the school project stays open, exactly where it was.',
      },
    ],
  },
  child: {
    title: 'What your kid sees',
    lead: 'No error message, no lecture. The screen says what’s happening, what’s still open, and when it’s back on.',
    lockKey: '9:00 pm',
    lockTitle: 'Time’s up. See you tomorrow!',
    lockText:
      'Your project is still open, exactly where you left it. The PC turns back on at 7 am.',
    lockCaption: 'At 9 pm, the PC locks. Apps are not closed.',
    blockKey: 'Fortnite',
    blockTitle: 'Not today.',
    blockText: 'Fortnite is blocked on this PC. If that’s a mistake, talk to your parents.',
    blockCaption: 'Blocked app: the rest of the PC works normally.',
  },
  tricks: {
    title: 'Tried to get around it? You’ll know.',
    lead: 'We know the playground tricks. The rule stays in place, and you get an alert in the dashboard.',
    items: [
      {
        attempt: 'Fortnite renamed to homework.exe',
        alert: 'Blocked app launched under another name.',
        detail: 'homework.exe is Fortnite.',
        time: 'Tue 5:42 pm',
      },
      {
        attempt: 'PC clock moved 3 hours ahead',
        alert: 'PC clock changed.',
        detail: 'CtrlAltBro keeps the server’s time.',
        time: 'Tue 7:05 pm',
      },
      {
        attempt: 'Rebooted into Safe Mode',
        alert: 'Started in Safe Mode.',
        detail: 'The rules apply there too.',
        time: 'Wed 4:20 pm',
      },
      {
        attempt: 'A portable copy on a USB stick',
        alert: 'Copy of a blocked app.',
        detail: 'Launched from E:\\Games.',
        time: 'Thu 6:11 pm',
      },
      {
        attempt: 'A fake program to fly under the radar',
        alert: 'Suspicious program blocked.',
        detail: 'It was impersonating an allowed app.',
        time: 'Fri 8:03 pm',
      },
    ],
  },
  data: {
    title: 'Your data stays at home.',
    lead: 'What your kid does on their PC is your business only. CtrlAltBro runs on your family’s server, and its code is public: anyone can check what it does.',
    link: 'Read the source code',
    faq: [
      { q: 'Where is the data?', a: 'On your server. Nowhere else.' },
      { q: 'Who can read it?', a: 'You, from the dashboard.' },
      { q: 'Any ads?', a: 'None.' },
      { q: 'Sold to anyone?', a: 'Never. There’s no one to sell it to: it never leaves home.' },
    ],
  },
  install: {
    title: 'Three steps, one code to paste.',
    steps: [
      {
        title: 'Create your account',
        text: 'On your CtrlAltBro server. That’s where the rules and history will live.',
        alt: 'CtrlAltBro parent sign-up screen: first name, email address and password.',
      },
      {
        title: 'Run the installer on your kid’s PC',
        text: 'With an administrator account. Your kid keeps their standard Windows account.',
      },
      {
        title: 'Paste the pairing code',
        text: 'The code shows up in the dashboard. Once pasted, the PC appears in your list.',
        alt: 'The dashboard shows an eight-character pairing code to enter in the installer.',
      },
    ],
    installer: {
      window: 'CtrlAltBro Setup',
      heading: 'Protect this PC',
      admin: 'Administrator session',
      adminValue: 'Dad',
      child: 'Kid’s account',
      childValue: 'Leo · standard',
      startup: 'Start with Windows',
      progress: 'Installing the service…',
      done: 'Service installed',
      button: 'Install',
    },
    download: 'Download the Windows installer',
    soon: 'Soon',
    soonNote: 'The installer is coming soon. In the meantime, the code is on GitHub.',
    requirements: 'Windows 10 and 11 · your kid’s PC uses a standard account',
  },
  footer: {
    tagline: 'Open source parental control for Windows.',
    github: 'GitHub',
    license: 'GPL-3.0 License',
  },
};

export default en;
