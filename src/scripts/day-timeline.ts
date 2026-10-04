type DayEvent = { h: number; title: string; text: string };
type DayConfig = {
  locale: 'fr' | 'en';
  of: string;
  online: string;
  locked: string;
  events: DayEvent[];
};

// Minutes d'écran cumulées à certaines heures ; interpolées entre deux points.
const USED: [number, number][] = [
  [7, 0],
  [7.5, 15],
  [16.5, 15],
  [17.5, 75],
  [18.25, 95],
  [19.08, 110],
  [21, 150],
];
const MC_BLOCKED_AT = 17.5;
const BONUS_AT = 18.25;
const ALERT_AT = 19.08;
const LOCK_AT = 21;

const used = (h: number) => {
  for (let i = 1; i < USED.length; i++) {
    if (h <= USED[i][0]) {
      const [a, ua] = USED[i - 1];
      const [b, ub] = USED[i];
      return ua + ((ub - ua) * (h - a)) / (b - a);
    }
  }
  return USED[USED.length - 1][1];
};

const pad = (n: number) => String(n).padStart(2, '0');

const formatters = {
  fr: {
    clock: (H: number, M: number) => `${H} h ${pad(M)}`,
    dur: (m: number) => {
      m = Math.round(m);
      const H = Math.floor(m / 60),
        M = m % 60;
      return H ? (M ? `${H} h ${pad(M)}` : `${H} h`) : `${M} min`;
    },
  },
  en: {
    clock: (H: number, M: number) => `${((H + 11) % 12) + 1}:${pad(M)} ${H < 12 ? 'am' : 'pm'}`,
    dur: (m: number) => {
      m = Math.round(m);
      const H = Math.floor(m / 60),
        M = m % 60;
      return H ? (M ? `${H}h ${pad(M)}m` : `${H}h`) : `${M} min`;
    },
  },
};

const press = (el: Element | null) => {
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.classList.add('is-pressed');
  setTimeout(() => el.classList.remove('is-pressed'), 150);
};

export function initDayTimeline() {
  const root = document.querySelector<HTMLElement>('[data-day]');
  if (!root) return;
  const cfg = JSON.parse(root.dataset.day!) as DayConfig;
  const fmt = formatters[cfg.locale];
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;

  const el = {
    panel: $('[data-day-panel]'),
    story: $('.story'),
    clock: $('[data-day-clock]'),
    title: $('[data-day-title]'),
    text: $('[data-day-text]'),
    dot: $('[data-day-dot]'),
    status: $('[data-day-status]'),
    used: $('[data-day-used]'),
    bar: $('[data-day-bar]'),
    mcBlocked: $('[data-day-mc-blocked]'),
    mcOpen: $('[data-day-mc-open]'),
    bonus: $('[data-day-bonus]'),
    alert: $('[data-day-alert]'),
    progress: $('[data-day-progress]'),
    ticks: [...root.querySelectorAll<HTMLElement>('[data-day-tick]')],
  };

  let lastSnapped = -1;
  let lastEvent = 0;

  const reveal = (node: HTMLElement, show: boolean) => {
    if (node.hidden === !show) return;
    node.hidden = !show;
    if (show) {
      node.classList.remove('is-new');
      void node.offsetWidth;
      node.classList.add('is-new');
    }
  };

  const render = (hour: number) => {
    const snapped = Math.min(LOCK_AT, Math.floor(hour * 12 + 0.0001) / 12);
    if (snapped === lastSnapped) return;
    lastSnapped = snapped;

    const H = Math.floor(snapped),
      M = Math.round((snapped - H) * 60);
    let idx = 0;
    cfg.events.forEach((e, i) => {
      if (snapped >= e.h - 0.0001) idx = i;
    });
    const locked = snapped >= LOCK_AT;
    const bonus = snapped >= BONUS_AT;
    const limit = bonus ? 150 : 120;
    const u = used(snapped);

    el.clock.textContent = fmt.clock(H, M);
    if (idx !== lastEvent) {
      lastEvent = idx;
      el.story.classList.add('is-changing');
      setTimeout(() => {
        el.title.textContent = cfg.events[idx].title;
        el.text.textContent = cfg.events[idx].text;
        el.story.classList.remove('is-changing');
      }, 140);
    }

    el.used.textContent = `${fmt.dur(u)} ${cfg.of} ${fmt.dur(limit)}`;
    el.bar.style.width = Math.min(100, (u / limit) * 100).toFixed(1) + '%';

    const wasBlocked = !el.mcBlocked.hidden;
    el.mcBlocked.hidden = snapped < MC_BLOCKED_AT;
    el.mcOpen.hidden = snapped >= MC_BLOCKED_AT;
    if (!wasBlocked && !el.mcBlocked.hidden) press(el.mcBlocked);

    const hadBonus = !el.bonus.hidden;
    reveal(el.bonus, bonus);
    if (!hadBonus && bonus) setTimeout(() => press(el.bonus.querySelector('.cab-key')), 200);
    reveal(el.alert, snapped >= ALERT_AT);

    el.dot.classList.toggle('is-off', locked);
    el.status.classList.toggle('is-off', locked);
    el.status.textContent = locked ? cfg.locked : cfg.online;
    // À 21 h, le panneau passe en mode nuit, quel que soit le thème choisi.
    if (locked) el.panel.dataset.theme = 'dark';
    else delete el.panel.dataset.theme;

    el.progress.style.width = (((snapped - 7) / 14) * 100).toFixed(2) + '%';
    el.ticks.forEach((tick, i) =>
      tick.classList.toggle('is-past', snapped >= cfg.events[i].h - 0.0001),
    );
  };

  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const r = root.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (span > 0 ? span : 1)));
      render(7 + 14 * Math.min(1, p / 0.85));
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  render(7);
  onScroll();
}
