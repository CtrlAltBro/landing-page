const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const PRESS_MS = 150;
const press = (key: Element, delay = 0) => {
  setTimeout(() => key.classList.add('is-pressed'), delay);
  setTimeout(() => key.classList.remove('is-pressed'), delay + PRESS_MS);
};

const cssMs = (name: string, fallback: number) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || fallback;

function logoIntro() {
  if (reduceMotion()) return;
  const step = cssMs('--logo-step', 170);
  document.querySelectorAll('[data-logo-intro]').forEach((logo) => {
    logo.querySelectorAll('.cab-key').forEach((key, i) => press(key, 450 + i * step));
  });
}

function installerDemo(root: HTMLElement) {
  const button = root.querySelector('[data-installer-button]');
  const label = root.querySelector<HTMLElement>('[data-installer-label]');
  const finish = () => {
    root.classList.add('is-done');
    if (label?.dataset.done) label.textContent = label.dataset.done;
  };
  if (reduceMotion()) return finish();
  if (button) press(button, 200);
  setTimeout(() => root.classList.add('is-running'), 380);
  setTimeout(finish, 2300);
}

function onView() {
  const targets = document.querySelectorAll<HTMLElement>(
    '[data-reveal], [data-press-on-view], [data-installer-demo]',
  );
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('is-visible');
        if (el.hasAttribute('data-press-on-view') && !reduceMotion()) press(el, 350);
        if (el.hasAttribute('data-installer-demo')) installerDemo(el);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  );
  targets.forEach((el) => io.observe(el));
}

function themeToggle() {
  const root = document.documentElement;
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  const sync = () => {
    const dark = root.dataset.theme === 'dark';
    buttons.forEach((b) => {
      b.textContent = (dark ? b.dataset.labelLight : b.dataset.labelDark) ?? b.textContent;
      b.setAttribute('aria-pressed', String(dark));
    });
  };
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (next === 'dark') root.dataset.theme = 'dark';
      else delete root.dataset.theme;
      try {
        localStorage.setItem('cab-theme', next);
      } catch {}
      sync();
    }),
  );
  sync();
}

themeToggle();
logoIntro();
onView();
