#!/usr/bin/env node
// The hero animation's FIVE failure modes that NO other gate in this repo can see. Each one
// ships silently broken if it regresses, and each is cheap to assert here. (Five tests, but
// SEVEN printed assertions — play-once runs across three phone viewports.)
//
//   1. REDUCED MOTION — must render the FINISHED dog, with no scrub and no rAF loop running.
//      (Not "less motion": a different render path. See HeroStage.astro divergence 4.)
//   2. JAVASCRIPT OFF — must still render the FINISHED dog, not a dull grey one with no fairy.
//      The brief requires the hero stay usable when the animation does not load; the markup is
//      authored finished and only ARMED backwards by JS, which is what makes this work.
//   3. VIEW-TRANSITION BACK-NAV — Base.astro mounts <ClientRouter>, and Astro runs a component
//      script at most ONCE PER SESSION. So navigating away from / and back must re-initialise
//      via astro:page-load, or the hero returns permanently dull and unscrubbed. The failure is
//      nothing running — not double-running.
//   4. PLAY-ONCE MUST NOT BURN OFF-SCREEN — below lg the stage sits below the fold, and the
//      animation must still be at p=0 when the visitor scrolls to it. This shipped broken once:
//      the play clock was armed by an observer on the TRACK, which below lg IS the whole hero
//      and is therefore intersecting at scrollY=0, so the 3.4s playthrough ran to completion
//      unseen and latched `played` — every phone visitor met a static, already-finished dog.
//      Nothing else catches this: the animation looks perfect if you scroll to it immediately.
//
// Usage: npx astro preview   (in another shell), then
//        node scripts/hero-resilience.mjs
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4321';
const problems = [];
const browser = await chromium.launch();

// The "before" layer at full opacity is the tell for a stage stuck at p=0.
//
// ⚠️ MISSING ≠ FINISHED. This helper used to return `null` for an absent layer, and `null < 0.05`
// is TRUE in JS — so simply RENAMING [data-before] made the reduced-motion test below pass with
// the layer gone. Proven against the live component 2026-08-09: removing the attribute left this
// gate reporting OK. Absence now returns NaN, because every NaN comparison is false in BOTH
// directions, so an absent layer fails "finished" AND fails "not yet played" — the only honest
// answer. `missing` names what actually went wrong so the failure message is not a riddle.
const readState = (page) =>
  page.evaluate(() => {
    const stage = document.querySelector('[data-hero-stage]');
    const before = document.querySelector('[data-before]');
    const fairy = document.querySelector('[data-fairy]');
    const fx = document.querySelector('[data-fx]');
    const after = document.querySelector('[data-after]');
    const missing = [
      ['[data-hero-stage]', stage],
      ['[data-before]', before],
      ['[data-fairy]', fairy],
      ['[data-fx]', fx],
      ['[data-after]', after],
    ]
      .filter(([, el]) => !el)
      .map(([sel]) => sel);
    return {
      missing,
      armed: stage?.hasAttribute('data-ft-armed') ?? false,
      inited: stage?.dataset.ftInit === '1',
      beforeOpacity: before ? +getComputedStyle(before).opacity : NaN,
      fairyOpacity: fairy ? +getComputedStyle(fairy).opacity : NaN,
      particles: fx ? fx.children.length : 0,
    };
  });

// Mean chroma (max channel − min channel) of the pack's box. This is the ONLY thing that can
// tell a working reveal from a broken one, and it exists because of a proven blind spot: if the
// armed p=0 mask rule is dropped, typo'd, or its selector renamed, the after-layer is fully
// revealed at p=0 — the pack starts in full colour and the entire transformation is invisible —
// while readState stays byte-identical (armed:true, inited:true, beforeOpacity:1, fairy:0).
// Measured on the live component (see the threshold note at the test itself for the current
// pair — an earlier v1-era reading of 24.65/76.45 is NOT comparable: the subject changed).
// Every other gate in
// this repo stayed green through that. Colour, not opacity, is the load-bearing signal.
const packChroma = async (page) => {
  const box = await page.locator('[data-dogs]').boundingBox();
  if (!box) return NaN;
  const shot = await page.screenshot({ clip: box });
  const sharp = (await import('sharp')).default;
  const { data } = await sharp(shot).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4 * 5) {
    const mx = Math.max(data[i], data[i + 1], data[i + 2]);
    const mn = Math.min(data[i], data[i + 1], data[i + 2]);
    sum += mx - mn;
    n++;
  }
  return sum / n;
};

// ── 1. Reduced motion ────────────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const s = await readState(page);
  // Finished = muted layer gone, fairy present. A missing element is a FAILURE, never a pass —
  // see the readState note.
  const ok = s.missing.length === 0 && s.beforeOpacity < 0.05 && s.fairyOpacity > 0.95;
  const why = s.missing.length ? ` MISSING ${s.missing.join(' ')}` : '';
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} reduced-motion — before=${s.beforeOpacity} fairy=${s.fairyOpacity} (want 0 / 1)${why}`);
  if (!ok)
    problems.push(
      s.missing.length
        ? `hero elements are missing from the DOM: ${s.missing.join(' ')} — a renamed selector silently disarms this whole gate`
        : `reduced-motion renders p=0, not the finished state (before=${s.beforeOpacity}, fairy=${s.fairyOpacity})`,
    );
  await ctx.close();
}

// ── 2. JavaScript off ────────────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const s = await page.evaluate(() => null).catch(() => null); // no JS: evaluate is unavailable
  // Assert via CSS/DOM through the accessibility of computed styles is impossible without JS,
  // so assert on the rendered pixels instead: the fairy must be visible in the hero.
  const fairyBox = await page.locator('.ft-fairy').boundingBox();
  const shot = await page.screenshot({ clip: fairyBox });
  const sharp = (await import('sharp')).default;
  const { data, info } = await sharp(shot).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let gold = 0;
  let total = 0;
  for (let i = 0; i < data.length; i += 4 * 7) {
    total++;
    if (data[i] > 120 && data[i] > data[i + 2] + 40) gold++;
  }
  const cover = (gold / total) * 100;
  const ok = cover > 5;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} javascript-off — fairy covers ${cover.toFixed(0)}% of her box (want >5%: she must be PRESENT)`);
  if (!ok) problems.push(`with JS off the fairy does not render (${cover.toFixed(0)}% coverage) — the hero is arming without anything to un-arm it`);
  await ctx.close();
}

// ── 3. View-transition back-nav ──────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const first = await readState(page);

  // Client-side navigate away and back, the way a visitor would.
  await page.click('a[href="/who-we-are/"]');
  await page.waitForURL('**/who-we-are/');
  await page.waitForTimeout(400);
  await page.goBack();
  await page.waitForURL((u) => u.pathname === '/');
  await page.waitForTimeout(800);

  const back = await readState(page);
  const ok = back.inited && back.particles === first.particles && back.particles > 0 && back.armed;
  console.log(
    `  ${ok ? 'OK  ' : 'FAIL'} back-nav — inited=${back.inited} armed=${back.armed} particles=${back.particles} (first load: ${first.particles})`,
  );
  if (!back.inited) problems.push('after back-nav the stage never re-initialised (astro:page-load path broken) — hero stays dull');
  else if (back.particles !== first.particles) problems.push(`after back-nav particle count is ${back.particles}, expected ${first.particles}`);
  else if (!back.armed) problems.push('after back-nav the stage is not armed — it will paint finished then snap backwards');
  await ctx.close();
}

// ── 4. Play-once plays when SEEN — never before ───────────────────────────────────────────
// The invariant is not "never play at the top": on a tall phone the stage is already well
// inside the first screen, and playing there is exactly right. It is "play iff visible". So the
// test measures the stage's actual visibility at scrollY=0 and asserts against that, rather
// than hard-coding an expectation per device.
const visibleFractionAtTop = (page) =>
  page.evaluate(() => {
    const r = document.querySelector('[data-hero-stage]').getBoundingClientRect();
    const shown = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    return r.height ? shown / r.height : 0;
  });

for (const [w, h] of [
  [390, 844],
  [375, 667],
  [360, 640],
]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const frac = await visibleFractionAtTop(page);
  // Sit at the top, WITHOUT scrolling, for longer than a full playthrough.
  await page.waitForTimeout(4200);
  const idle = await readState(page);
  const played = idle.beforeOpacity < 0.5;

  if (frac >= 0.35) {
    // On screen at load: it SHOULD have played, and the visitor saw it.
    const ok = idle.beforeOpacity < 0.05 && idle.fairyOpacity > 0.95;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} play-once ${w}x${h} — stage is ${Math.round(frac * 100)}% visible at load, so it plays there (before=${idle.beforeOpacity})`);
    if (!ok) problems.push(`${w}x${h}: stage is ${Math.round(frac * 100)}% visible at load but did not play (before=${idle.beforeOpacity})`);
    await ctx.close();
    continue;
  }

  // Below the fold: it must still be waiting.
  if (played) {
    problems.push(`${w}x${h}: played while only ${Math.round(frac * 100)}% visible — burned off-screen (before=${idle.beforeOpacity} without ever scrolling)`);
    console.log(`  FAIL play-once ${w}x${h} — burned off-screen at ${Math.round(frac * 100)}% visible`);
    await ctx.close();
    continue;
  }
  // ...and must run on arrival.
  await page.evaluate(() => document.querySelector('[data-hero-stage]').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(4200);
  const done = await readState(page);
  const ok = done.beforeOpacity < 0.05 && done.fairyOpacity > 0.95;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} play-once ${w}x${h} — ${Math.round(frac * 100)}% visible at load: waited, then played on arrival (before=${done.beforeOpacity})`);
  if (!ok) problems.push(`${w}x${h}: after scrolling to the stage it did not play through (before=${done.beforeOpacity}, fairy=${done.fairyOpacity})`);
  await ctx.close();
}

// ── 5. The reveal actually reveals ───────────────────────────────────────────────────────
// The transformation IS the hero. Every other test here reads opacity and element presence, and
// a stage whose reveal mask has been lost passes all of them while doing visibly nothing: the
// pack simply starts in full colour. This asserts on COLOUR at both ends of the desktop scrub,
// which is the only signal that distinguishes the two.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const seek = async (target) => {
    await page.evaluate((t) => {
      const track = document.querySelector('[data-hero-track]');
      const r = track.getBoundingClientRect();
      const top = window.scrollY + r.top;
      window.scrollTo({ top: top + t * (r.height - window.innerHeight), behavior: 'instant' });
    }, target);
    await page.waitForTimeout(1600); // the 0.16 damping needs time to settle
  };

  await seek(0);
  const cold = await packChroma(page);
  await seek(1);
  const warm = await packChroma(page);

  // The 1.4x threshold is placed between two MEASURED endpoints, not guessed. Verified on this
  // component at 1440x900 by injecting the actual bug (`[data-ft-armed] .ft-after{mask-image:none}`):
  //     healthy            p0 16.4 → p1 30.4 = 1.85x
  //     mask lost (broken) p0 30.2 → p1 30.4 = 1.01x
  // 1.4 sits ~39% above the broken case and ~24% below the healthy one, so it catches "the
  // reveal does nothing" without policing the exact before-filter grade — re-grading the muted
  // layer is a legitimate design change and must not fail this gate.
  const ok = Number.isFinite(cold) && Number.isFinite(warm) && warm > cold * 1.4;
  console.log(
    `  ${ok ? 'OK  ' : 'FAIL'} reveal — pack chroma ${cold.toFixed(1)} at p=0 → ${warm.toFixed(1)} at p=1 (want a 1.4x rise)`,
  );
  if (!ok)
    problems.push(
      `the reveal is not revealing: pack chroma ${cold.toFixed(1)} → ${warm.toFixed(1)}. The p=0 mask rule under [data-ft-armed] .ft-after is the usual cause — if it is dropped or its selector renamed, the pack starts in full colour and every other gate still passes.`,
    );
  await ctx.close();
}

await browser.close();
console.log('');
console.log(
  problems.length
    ? `❌ hero resilience FAILED:\n  - ${problems.join('\n  - ')}`
    : '✅ Hero survives reduced-motion, JS-off, back-nav, plays only when seen, and actually reveals.',
);
process.exit(problems.length ? 1 : 0);
