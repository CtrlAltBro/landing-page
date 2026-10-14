import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  if (route.lang !== 'en') return;
  for (const entry of route.sidebar) {
    if (entry.type === 'link' && entry.href === '/') entry.href = '/en/';
  }
});
