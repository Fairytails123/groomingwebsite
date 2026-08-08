import type { APIRoute } from 'astro';

// Single source of truth for indexability (with the matching meta tag in
// Base.astro): PUBLIC_INDEXABLE is unset locally (→ Disallow all), and set to
// 'true' by the repo Actions variable INDEXABLE — which has been `true` since
// go-live 2026-08-08, so the LIVE site serves the allow form and must keep
// doing so. There is deliberately NO static public/robots.txt.
export const GET: APIRoute = () => {
  const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
  const body = indexable
    ? 'User-agent: *\nDisallow:\n\nSitemap: https://fairytailsdoggrooming.co.uk/sitemap-index.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
