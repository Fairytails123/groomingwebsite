import type { APIRoute } from 'astro';

// Single source of truth for indexability (with the matching meta tag in
// Base.astro): PUBLIC_INDEXABLE is unset locally and on the preview deploy
// (→ Disallow all), and set to 'true' by the repo Actions variable INDEXABLE
// at switchover. There is deliberately NO static public/robots.txt.
export const GET: APIRoute = () => {
  const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
  const body = indexable
    ? 'User-agent: *\nDisallow:\n\nSitemap: https://fairytailsdoggrooming.co.uk/sitemap-index.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
