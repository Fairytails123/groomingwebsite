#!/usr/bin/env node
// 📱 THE MOBILE GATE (CLAUDE.md) — no page ships without passing this.
// Owner rule 2026-07-16: every delivered page must be checked for RESPONSIVENESS,
// VISUALS and SPEED on a phone before shipping. Most of this salon's customers
// arrive on a phone; a page that is only correct at 1440px is not done.
//
// This enforces the mechanical half. The half a script cannot check is still on
// Claude: open shots/<slug>-390.png and LOOK at it (text collision, cramped
// spacing, CTA below the fold, an image cropped to nonsense).
//
// Speed is NOT measured here — run Lighthouse separately (`npx lighthouse <url>`
// already emulates a mid-range phone on throttled 4G by default, so a plain run
// IS the mobile number). This script covers layout + visuals, which Lighthouse
// does not check at all.
//
// Usage:
//   npx astro preview            # in another shell (or set BASE)
//   node scripts/mobile-check.mjs [path ...]   # defaults to every built page
import { chromium, devices } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4321';
// 390x844 = iPhone 12/13/14 class, the narrow end of what real customers use.
const VIEWPORT = { width: 390, height: 844 };
const MIN_TAP = 44; // WCAG 2.5.8 / Apple HIG minimum tap target, CSS px.

const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      '/',
      '/who-we-are/',
      '/contact/',
      '/terms-and-conditions/',
      '/services/',
      '/services/full-groom-price-list/',
      '/services/haircut-lengths/',
      '/services/teeth-cleaning/',
      '/services/doggy-massage/',
      '/services/homeless-dogs/',
      '/services/frequently-asked-questions/',
      '/gallery/',
    ];

const problems = [];
const warnings = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  ...devices['iPhone 13'],
  viewport: VIEWPORT,
  // Real phones are touch; hover-only affordances are a bug there.
  hasTouch: true,
  isMobile: true,
});

for (const path of PAGES) {
  const page = await ctx.newPage();
  const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
  if (!res || res.status() !== 200) {
    problems.push(`${path} — did not load (status ${res ? res.status() : 'none'})`);
    await page.close();
    continue;
  }

  // Scroll the whole page, so loading="lazy" images actually fetch. Without this
  // every below-the-fold image reports "failed to load" — a false positive, since
  // the browser simply hadn't been asked for it yet.
  //
  // behavior:'instant' is REQUIRED: global.css sets `html { scroll-behavior:
  // smooth }`, which makes scrollTo() animate. The stepped loop then outruns the
  // animation and never truly reaches the bottom of a long page, so the last
  // images stay unloaded and get reported broken. (Exactly what happened on
  // /services/ — the longest page — while shorter pages passed.)
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForLoadState('networkidle');
  // Lazy decodes can still be in flight after the network settles.
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.decode ? i.decode().catch(() => {}) : null))));

  const report = await page.evaluate(
    ({ vw, minTap }) => {
      const out = { overflow: null, wide: [], hidden: [], images: [], lowRes: [], taps: [] };

      // --- RESPONSIVENESS: the body must never scroll sideways.
      const de = document.documentElement;
      if (de.scrollWidth > vw + 1) out.overflow = { scrollWidth: de.scrollWidth, viewport: vw };

      // Which elements actually stick out past the viewport? Ignore anything
      // inside a deliberate horizontal scroller (that pattern is allowed).
      const inScroller = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (s.overflowX === 'auto' || s.overflowX === 'scroll') return true;
        }
        return false;
      };
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || s.position === 'fixed') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > vw + 1 && !inScroller(el)) {
          out.wide.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className.toString() || '').split(' ').filter(Boolean).slice(0, 2).join('.'),
            right: Math.round(r.right),
          });
        }
      }

      // --- VISUALS: content readable at t=0, without scrolling or JS having run.
      for (const el of document.querySelectorAll('h1, h2, h3, p, td, li')) {
        const s = getComputedStyle(el);
        if (s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05) {
          if (el.closest('details:not([open])')) continue; // a closed accordion is fine
          out.hidden.push(el.tagName.toLowerCase() + ': ' + (el.textContent || '').trim().slice(0, 40));
        }
      }

      // --- VISUALS: images that are broken, overflowing, or too low-res to look sharp.
      //
      // ⚠️ Do NOT test this with img.naturalWidth. For a srcset with `w`
      // descriptors the spec makes naturalWidth DENSITY-CORRECTED: the browser
      // divides the real pixel width by the chosen density, so a correctly-served
      // image reports ~its CSS width and a naive `naturalWidth < css * dpr` test
      // flags every single image on the site. (It did. That was a bug in this
      // script, not in the pages — a 1200w candidate picked for a 390px slot at
      // 3x reports naturalWidth 390.)
      //
      // What actually matters is whether a big enough candidate EXISTS, so parse
      // the srcset and compare its largest `w` against a 2x target. 2x is the
      // industry norm for hidpi; demanding a full 3x asset is not a real standard.
      for (const img of document.querySelectorAll('img')) {
        const r = img.getBoundingClientRect();
        if (r.width === 0) continue;
        if (!img.complete || img.naturalWidth === 0) {
          out.images.push({ src: (img.currentSrc || img.src).split('/').pop(), issue: 'failed to load' });
          continue;
        }
        if (r.right > vw + 1) {
          out.images.push({ src: (img.currentSrc || img.src).split('/').pop(), issue: `overflows (right edge ${Math.round(r.right)}px)` });
        }
        const srcset = img.getAttribute('srcset') || '';
        const widths = [...srcset.matchAll(/(\d+)w/g)].map((m) => +m[1]);
        if (widths.length) {
          const maxW = Math.max(...widths);
          const want2x = r.width * 2;
          if (maxW < want2x * 0.9) {
            // WARNING, not a failure. Astro never upscales, so the largest
            // candidate is capped by the SOURCE file — and this site's sources are
            // the old WordPress originals, several of which are tiny (the clip
            // photos are 580x580, the add-on thumbs 300x300; no bigger version has
            // ever existed). Failing here would demand an image we cannot create.
            out.lowRes.push({
              src: (img.currentSrc || img.src).split('/').pop(),
              issue: `largest candidate ${maxW}w for a ${Math.round(r.width)}css slot (2x would want ~${Math.round(want2x)}w)`,
            });
          }
        }
      }

      // --- VISUALS: tap targets. Links inside a paragraph are exempt (inline text),
      // matching WCAG 2.5.8's exception for targets in a sentence.
      for (const el of document.querySelectorAll('a, button, summary, input, select')) {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden') continue;
        if (el.type === 'hidden' || el.tabIndex === -1) continue; // e.g. the spam honeypot
        let r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (el.tagName === 'A' && el.closest('p, li, figcaption, .post-body')) continue;

        // A checkbox/radio's real target is its LABEL — tapping the label toggles
        // the control — so measure that instead of the 20px box. Measuring the
        // input alone reports a false failure on every properly-labelled checkbox.
        if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) {
          const label = el.closest('label') || (el.id && document.querySelector(`label[for="${el.id}"]`));
          if (label) r = label.getBoundingClientRect();
        }

        if (r.height < minTap - 0.5 || r.width < minTap - 0.5) {
          out.taps.push({
            tag: el.tagName.toLowerCase() + (el.type ? `[${el.type}]` : ''),
            text: (el.textContent || el.closest('label')?.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 28),
            size: `${Math.round(r.width)}x${Math.round(r.height)}`,
          });
        }
      }
      return out;
    },
    { vw: VIEWPORT.width, minTap: MIN_TAP },
  );

  const issues = [];
  if (report.overflow) {
    issues.push(`HORIZONTAL SCROLL: body is ${report.overflow.scrollWidth}px wide at ${report.overflow.viewport}px`);
    for (const w of report.wide.slice(0, 4)) issues.push(`  ↳ <${w.tag}${w.cls ? '.' + w.cls : ''}> extends to ${w.right}px`);
  }
  for (const h of report.hidden.slice(0, 3)) issues.push(`HIDDEN AT t=0: ${h}`);
  for (const i of report.images.slice(0, 4)) issues.push(`IMAGE: ${i.issue} — ${i.src}`);
  for (const t of report.taps.slice(0, 4)) issues.push(`TAP TARGET ${t.size} (<${MIN_TAP}px): <${t.tag}> "${t.text}"`);

  if (issues.length) {
    console.log(`  FAIL ${path}`);
    for (const i of issues) console.log(`         ${i}`);
    problems.push(path);
  } else {
    console.log(`  OK   ${path}`);
  }
  for (const l of report.lowRes) {
    console.log(`         warn: low-res — ${l.issue} — ${l.src}`);
    warnings.push(`${path} — ${l.src}`);
  }
  await page.close();
}

await browser.close();

console.log('');
if (warnings.length) {
  console.log(`${warnings.length} low-res warning(s) — accepted where the harvested source is simply that small.`);
}
console.log(problems.length ? `❌ ${problems.length} page(s) FAIL the mobile gate.` : '✅ All pages pass the mobile gate.');
console.log('Reminder: this cannot judge whether it LOOKS right — open shots/<slug>-390.png too.');
process.exit(problems.length ? 1 : 0);
