// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ⚠️ URL preservation IS the SEO migration — and this config is the OPPOSITE of the
// Main Website's (`format:'file'` + `trailingSlash:'never'`). Do NOT "fix" it to match:
// the legacy WordPress URLs are trailing-slash directories (/contact/, /services/teeth-cleaning/),
// so format:'directory' + trailingSlash:'always' reproduces every legacy URL with a direct 200
// on GitHub Pages. See CLAUDE.md "Divergences from Main Website".
//
// `site` is the FINAL production apex domain from day 1 (canonicals/sitemap must be
// production-correct even while the site is served on the noindexed preview subdomain
// preview.fairytailsdoggrooming.co.uk). Indexability is env-driven — see robots.txt.ts
// and Base.astro (PUBLIC_INDEXABLE) — never hardcode index/noindex here or in public/.
//
// Retired legacy URLs (/services-2/, /category/blog/, /author/grace/) are hand-authored
// meta-refresh + canonical + noindex stubs in public/ — NOT config `redirects`
// (Astro's generated redirect pages lack the noindex we need on a 200-status host).
export default defineConfig({
  site: 'https://fairytailsdoggrooming.co.uk',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
