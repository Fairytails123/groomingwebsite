// Harvest the live WordPress site into grooming-image-archive/ before anything can vanish.
// No deps — Node 22+ (fetch, fs). Idempotent: existing image files are skipped; HTML/meta always refreshed.
// Run: node scripts/harvest.mjs
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const SITE = 'https://fairytailsdoggrooming.co.uk';
const OUT = join(process.cwd(), 'grooming-image-archive');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 FairyTailsHarvest/1.0';

const PAGES = [
  '/', '/who-we-are/', '/services/', '/services/full-groom-price-list/',
  '/services/haircut-lengths/', '/services/teeth-cleaning/', '/services/doggy-massage/',
  '/services/homeless-dogs/', '/services/frequently-asked-questions/', '/gallery/',
  '/contact/', '/terms-and-conditions/', '/blog/', '/why-dog-grooming-is-important/',
  '/services-2/', '/category/blog/', '/author/grace/', '/feed/',
];
const SITE_FILES = ['/robots.txt', '/sitemap_index.xml', '/page-sitemap.xml', '/post-sitemap.xml', '/category-sitemap.xml', '/author-sitemap.xml'];

// Hosts we harvest images from. Everything else (gravatar, s.w.org emoji, socials) is ignored.
const IMAGE_HOSTS = new Set(['fairytailsdoggrooming.co.uk', 'www.fairytailsdoggrooming.co.uk', 'hrb.tqx.mybluehost.me', 'i0.wp.com', 'i1.wp.com', 'i2.wp.com', 'i3.wp.com']);
const IMG_EXT = /\.(jpe?g|png|gif|webp|svg|avif|ico)$/i;

const slugOf = (p) => p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '__');

async function get(url, { asBuffer = false, tries = 3 } = {}) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(45000) });
      if (!res.ok) { if (i === tries) return { ok: false, status: res.status }; }
      else return { ok: true, status: res.status, body: asBuffer ? Buffer.from(await res.arrayBuffer()) : await res.text(), finalUrl: res.url };
    } catch (e) { if (i === tries) return { ok: false, status: 0, error: String(e) }; }
    await new Promise(r => setTimeout(r, 1500 * i));
  }
}

function validImage(buf, url) {
  if (!buf || buf.length < 12) return false;
  const b = buf;
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return true;                    // JPEG
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return true;   // PNG
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return true;                    // GIF
  if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') return true;
  if (b.slice(4, 12).toString().includes('ftyp')) return true;                          // AVIF/HEIC
  if (b[0] === 0x00 && b[1] === 0x00 && b[2] === 0x01 && b[3] === 0x00) return true;   // ICO
  const head = b.slice(0, 256).toString().trimStart().toLowerCase();
  if (/\.svg/i.test(url) && (head.startsWith('<svg') || head.startsWith('<?xml'))) return true;
  return false;
}

// i0.wp.com/<origin-host>/<path>?args  ->  candidate origin URLs (preferred) + CDN fallback.
// Also strips WordPress -WxH scaled suffixes to try for the original upload first.
function candidatesFor(rawUrl) {
  let u;
  try { u = new URL(rawUrl); } catch { return []; }
  const out = [];
  const push = (s) => { if (!out.includes(s)) out.push(s); };
  const stripSize = (p) => p.replace(/-\d{2,4}x\d{2,4}(\.[a-z]{3,4})$/i, '$1');
  if (/^i[0-3]\.wp\.com$/.test(u.hostname)) {
    const inner = 'https://' + u.pathname.replace(/^\//, '');
    try {
      const iu = new URL(inner);
      push(iu.origin + stripSize(iu.pathname));
      push(iu.origin + iu.pathname);
    } catch { /* ignore */ }
    push(u.origin + stripSize(u.pathname)); // CDN full-size fallbacks (no query = original size)
    push(u.origin + u.pathname);
  } else {
    push(u.origin + stripSize(u.pathname));
    push(u.origin + u.pathname);
  }
  return out;
}

function extractImageUrls(html) {
  const urls = new Set();
  const texts = [html, html.replace(/\\\//g, '/')]; // second pass catches JSON-escaped URLs (Smart Slider)
  for (const t of texts) {
    for (const m of t.matchAll(/https?:\/\/[^"'\s\\<>)+]+?\.(?:jpe?g|png|gif|webp|svg|avif|ico)(?:\?[^"'\s\\<>)]*)?/gi)) {
      try {
        const u = new URL(m[0]);
        const host = u.hostname;
        const innerHost = /^i[0-3]\.wp\.com$/.test(host) ? m[0].match(/i[0-3]\.wp\.com\/([^/]+)/)?.[1] : host;
        if (IMAGE_HOSTS.has(host) && (!innerHost || IMAGE_HOSTS.has(innerHost) || host === innerHost)) urls.add(m[0]);
      } catch { /* skip malformed */ }
    }
    // PROTOCOL-RELATIVE urls: src="//host/x.jpg", CSS url("//host/x.jpg").
    // The https?:// scan above cannot see these, and srcset-only handling missed
    // them too — which is how all 5 of the gallery's before/after slider images
    // (Smart Slider emits protocol-relative src AND a CSS --n2bgimage url())
    // were absent from the 2026-07-12 harvest while it still reported "failed: 0".
    // Found and back-filled 2026-07-16. The (?<!:) stops it re-matching https://.
    for (const m of t.matchAll(/(?<!:)\/\/[^"'\s\\<>)+]+?\.(?:jpe?g|png|gif|webp|svg|avif|ico)(?:\?[^"'\s\\<>)]*)?/gi)) {
      const abs = 'https:' + m[0];
      try {
        const u = new URL(abs);
        if (IMAGE_HOSTS.has(u.hostname) && IMG_EXT.test(u.pathname)) urls.add(abs);
      } catch { /* skip malformed */ }
    }
    // srcset entries (relative or protocol-relative)
    for (const m of t.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi)) {
      for (const part of m[1].split(',')) {
        const cand = part.trim().split(/\s+/)[0];
        if (!cand) continue;
        const abs = cand.startsWith('//') ? 'https:' + cand : cand.startsWith('/') ? SITE + cand : cand;
        try { const u = new URL(abs); if (IMAGE_HOSTS.has(u.hostname) && IMG_EXT.test(u.pathname)) urls.add(abs); } catch { /* skip */ }
      }
    }
  }
  return [...urls];
}

function extractMeta(html) {
  const pick = (re) => html.match(re)?.[1]?.trim() ?? null;
  const metas = {};
  for (const m of html.matchAll(/<meta\s+[^>]*?(?:name|property)\s*=\s*["']([^"']+)["'][^>]*?content\s*=\s*["']([^"']*)["'][^>]*>/gis)) metas[m[1].toLowerCase()] = m[2];
  for (const m of html.matchAll(/<meta\s+[^>]*?content\s*=\s*["']([^"']*)["'][^>]*?(?:name|property)\s*=\s*["']([^"']+)["'][^>]*>/gis)) metas[m[2].toLowerCase()] ??= m[1];
  return {
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    description: metas['description'] ?? null,
    canonical: pick(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ?? pick(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i),
    robots: metas['robots'] ?? null,
    og: Object.fromEntries(Object.entries(metas).filter(([k]) => k.startsWith('og:') || k.startsWith('twitter:') || k.startsWith('article:'))),
  };
}

function decodeEntities(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"').replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&pound;/g, '£');
}

function htmlToCopy(html) {
  let s = html.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript|template|svg|form)[\s\S]*?<\/\1>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/i, '');
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${'#'.repeat(+n)} ${t.replace(/<[^>]+>/g, ' ')}\n\n`);
  s = s.replace(/<li[^>]*>/gi, '\n- ').replace(/<\/(p|div|section|article|tr|table|ul|ol|blockquote|figure|header|footer)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<t[dh][^>]*>/gi, ' | ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = decodeEntities(s);
  return s.split('\n').map(l => l.replace(/[ \t]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function extractLinks(html, baseUrl) {
  const links = [];
  for (const m of html.matchAll(/<a\s+[^>]*href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    try {
      const href = new URL(m[1], baseUrl).href;
      const text = decodeEntities(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
      links.push({ href, text });
    } catch { /* skip */ }
  }
  return links;
}

// ---- main ----
const manifest = { startedAt: new Date().toISOString(), pages: [], images: { total: 0, downloaded: 0, skippedExisting: 0, failed: [], invalid: [], bluehostRescued: 0, bySource: {} } };
const imageIndex = existsSync(join(OUT, 'images-index.json')) ? JSON.parse(readFileSync(join(OUT, 'images-index.json'), 'utf8')) : {};
const seenImages = new Set(Object.keys(imageIndex));

mkdirSync(join(OUT, '_site'), { recursive: true });

for (const f of SITE_FILES) {
  const r = await get(SITE + f);
  if (r.ok) writeFileSync(join(OUT, '_site', f.replace(/^\//, '')), r.body);
  console.log(`[site] ${f} -> ${r.ok ? 'saved' : 'FAILED ' + r.status}`);
}

const allImageUrls = new Map(); // url -> firstSlug
for (const path of PAGES) {
  const slug = slugOf(path);
  const dir = join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  const r = await get(SITE + path);
  if (!r.ok) { console.log(`[page] ${path} FAILED ${r.status}`); manifest.pages.push({ path, slug, ok: false, status: r.status }); continue; }
  const html = r.body;
  writeFileSync(join(dir, 'page.html'), html);
  writeFileSync(join(dir, 'meta.json'), JSON.stringify(extractMeta(html), null, 2));
  writeFileSync(join(dir, 'links.json'), JSON.stringify(extractLinks(html, SITE + path), null, 2));
  writeFileSync(join(dir, 'copy.md'), htmlToCopy(html));
  const imgs = extractImageUrls(html);
  for (const u of imgs) if (!allImageUrls.has(u)) allImageUrls.set(u, slug);
  manifest.pages.push({ path, slug, ok: true, bytes: html.length, imageRefs: imgs.length });
  console.log(`[page] ${path} -> ${html.length}b, ${imgs.length} image refs`);
}

// Download images: dedupe by resolved candidate set, mirror path under <slug>/images/<host>/<path>
const queue = [...allImageUrls.entries()];
manifest.images.total = queue.length;
let active = 0, qi = 0;
await new Promise((resolve) => {
  const next = () => {
    if (qi >= queue.length && active === 0) return resolve();
    while (active < 5 && qi < queue.length) {
      const [rawUrl, slug] = queue[qi++];
      active++;
      (async () => {
        const cands = candidatesFor(rawUrl);
        let saved = false;
        for (const cand of cands) {
          const cu = new URL(cand);
          const rel = join('images', cu.hostname, ...cu.pathname.split('/').filter(Boolean));
          const dest = join(OUT, slug, rel);
          const key = cu.hostname + cu.pathname;
          if (seenImages.has(key) || existsSync(dest)) { manifest.images.skippedExisting++; saved = true; break; }
          const r = await get(cand, { asBuffer: true, tries: 2 });
          if (r.ok && validImage(r.body, cand)) {
            mkdirSync(dirname(dest), { recursive: true });
            writeFileSync(dest, r.body);
            seenImages.add(key);
            imageIndex[key] = { savedAt: join(slug, rel), from: cand, foundAs: rawUrl, bytes: r.body.length };
            manifest.images.downloaded++;
            manifest.images.bySource[cu.hostname] = (manifest.images.bySource[cu.hostname] || 0) + 1;
            if (cu.hostname === 'hrb.tqx.mybluehost.me') manifest.images.bluehostRescued++;
            saved = true;
            break;
          } else if (r.ok) {
            manifest.images.invalid.push({ url: cand, note: 'bad magic bytes' });
          }
        }
        if (!saved) manifest.images.failed.push({ url: rawUrl, tried: cands });
        active--; next();
      })();
    }
  };
  next();
});

writeFileSync(join(OUT, 'images-index.json'), JSON.stringify(imageIndex, null, 2));
const m = manifest.images;
const md = [
  '# HARVEST MANIFEST', '', `Harvested: ${manifest.startedAt}  Source: ${SITE}`, '',
  '## Pages', '', '| path | ok | bytes | image refs |', '|---|---|---|---|',
  ...manifest.pages.map(p => `| ${p.path} | ${p.ok ? 'yes' : 'FAILED ' + p.status} | ${p.bytes ?? ''} | ${p.imageRefs ?? ''} |`), '',
  '## Images', '',
  `- unique image URLs referenced: ${m.total}`,
  `- downloaded this run: ${m.downloaded}  (already present: ${m.skippedExisting})`,
  `- Bluehost-origin files rescued: ${m.bluehostRescued}`,
  `- by source host: ${JSON.stringify(m.bySource)}`,
  `- failed: ${m.failed.length}`, ...m.failed.map(f => `  - ${f.url}`),
  `- invalid (bad magic bytes): ${m.invalid.length}`, ...m.invalid.map(f => `  - ${f.url}`),
].join('\n');
writeFileSync(join(OUT, 'HARVEST-MANIFEST.md'), md);
console.log('\n' + md.split('## Images')[1]);
console.log('\nDone. Archive at', OUT);
