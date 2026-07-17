# HANDOVER — session log (newest first)

Read this first each session. Master plan: `WEBSITE-PLAN.md`. Engineering brief: `CLAUDE.md`.

## 🖊 2026-07-17 (afternoon) — owner feedback rounds 2–4, all applied + live (`…29cf71b`)

Three more owner requests, each shipped and verified on the live preview:

1. **Hero: reviews badge removed** (`4.9 out of 5 / From 63+ Google reviews`) — the hero is
   copy + CTAs only now. The badge still renders in the footer on every page, and the review
   proof on the homepage moved to item 3's band. Structural check on dist: hero block contains
   neither string; footer keeps its.
2. **Phones: WhatsApp runs on the SALON line; the mobile is retired site-wide.** Interviewed
   to lock it down (the message was ambiguous — the site already showed the mobile as the
   WhatsApp): owner confirmed WhatsApp is attached to **01424 300668** and ruled the old
   mobile **07842 116216 off the site entirely**. All wa.me links → `wa.me/441424300668`;
   FAQ cancellation + catch-all numbers → salon line; EnquiryForm status strings now
   interpolate from business.ts (were hardcoded prose — exercised the changed failure string
   against a BLOCKED webhook: reads the salon number only, no real enquiry sent). dist +
   live-preview sweeps: **0 occurrences of 07842/447842 anywhere.** ⚠ The harvest still
   carries the mobile — never copy it back.
3. **Google-reviews band restyled to the OLD SITE's widget look** (owner supplied a
   screenshot): full-width WHITE band, business name + address + big `4.9 ★★★★★ 63 reviews`
   header, per-review cards with a coloured avatar initial + name + gold stars and the text in
   a bordered white bubble **clamped to 4 lines with a More/Less expander**, G-logo "See all
   our reviews on Google" link + "verbatim excerpts, refreshed weekly" provenance note.
   Content still renders VERBATIM from `reviews-snapshot.json` (the n8n rotator's contract is
   untouched — it keeps overwriting the same file weekly). Engineering notes: the clamp is
   JS-APPLIED (JS off = full text, no dead control — the price-list-filter precedent); a
   review short enough to fit gets no More at all (proven live: Sarah's card at 390 shows
   full text, the reference widget's own behaviour); the expander re-inits via
   `astro:page-load` (the HeroStage dedupe lesson); More buttons carry a 44×44 hit area via
   padding + negative margin because the mobile gate exempts only inline `<a>`, never buttons.

**Gates after all three:** build green · dist sweep 0 hits for the retired number ·
mobile-check 15/15 · hero-resilience 6/6 · expander + form-string Playwright checks green ·
reviews band eyeballed at 390 AND 1440 (crops, not just fullpage) · Lighthouse home
94–99 → median **99**, a11y/bp/seo 100/100/100 · live preview curl-verified (phones, band,
noindex all correct).

## 🖊 2026-07-17 (later) — owner feedback round 1 on the hero, applied + live (`efb9122`)

Two rulings from Kam after seeing the preview, both applied, deployed, and verified live:
1. **The "Scroll to see the transformation" caption is REMOVED** (markup, its armed-CSS block,
   and the fade line in `update()` — it was a desktop-only affordance and is now judged noise).
2. **The dog must blend seamlessly into the moss band — the warm floor light-pool is REMOVED.**
   `.ft-ground-pool` (the honey ellipse behind her paws) was the page's one real painted
   highlight and read as a spotlight lifting the dog off the page. The dark `.ft-ground-core`
   contact shadow STAYS — darker than the band, it seats her in it rather than popping her out.

**Investigated before cutting, so the right thing was removed:** the dog artwork and the fairy
stencil were both alpha-histogrammed — no baked-in glow in either (the two known "invisible on
white" defect classes are still fully fixed). And the suspected halo around the FAIRY does not
exist in rendered pixels: the moss measures byte-uniform (44,56,35) to within a few px of her
silhouette in both desktop and phone captures — it is simultaneous-contrast illusion, so her
subtle drop-shadow glow was left alone. Gates re-run green after the change: hero-resilience
6/6 · hero-mask-support · mobile-check 15/15 · hero-shots re-eyeballed (desktop p0/p100 +
phone) · Lighthouse home 94/94/99/99/99 → median **99** (the 94s were post-gate-suite machine
contention; identical distribution to pre-change). Live preview curl: 0 hits for the cue text,
0 for `ft-ground-pool`, contact core present.

## ✅ 2026-07-17 — HERO ANIMATION VERIFIED ON x64, MERGED TO `main`, LIVE ON THE PREVIEW

Picked up `origin/hero-animation` on the **x64 machine** per the entry below. Everything the
arm64 laptop could not settle is now settled.

**All gates green on this machine too** (after the documented x64 `npm install`; the lock churn
it caused was reverted, not committed): verify-urls 18 URLs/0 failures · hero-resilience 6/6 ·
hero-mask-support (WebKit + Chromium) · verify-stage3 0 · mobile-check 15/15 (only the accepted
low-res warns) · price-list-e2e 0 · hero-shots regenerated and **eyeballed** (p0 scruffy dog,
no halo, no torn-paper floor; p50 fairy + warming coat; p85 wipe mid-sweep reads clearly;
p100 groomed + moss bow; phone top/done states both correct).

**⚖️ The Lighthouse question is ANSWERED — the animation costs ~nothing, and the ≥90 gate
passes on the machine that set the 97–100 baseline** (`PUBLIC_INDEXABLE=true` build,
`npx lighthouse` mobile default, warm-up + settle before measuring, 3 runs each):
- `main`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: perf **94/99/99 → median 99** · LCP 2.0s · a11y/bp/seo 100/100/100
- `hero-animation`: perf **99/99/98 → median 99** · LCP 2.1s · a11y/bp/seo 100/100/100 · CLS 0.0001
So the arm64 laptop's 86–87 ceiling is **confirmed environmental** (it measured the same on
`main`), the lone 94 was the documented first-run settling artifact, and ~0.1s of LCP is the
entire measurable cost of the animation.

**Merged fast-forward to `main` (`10eb9f8..bf45e7d`) and pushed** — deploy run 29574217231
green. Live preview verified by curl: hero markup present (`data-ft-armed` ×2, the scroll cue,
both fingerprinted hero assets) and **noindex intact** — the old WordPress site remains the only
indexed one. **The owner can now eyeball the animation directly at
https://preview.fairytailsdoggrooming.co.uk — phone AND desktop, no local server needed.**

**Still open (all owner-side now):**
1. Owner eyeball of the hero on the preview URL + confirm/overrule the judgement calls listed
   in the entry below (moss bow, retoned red band, redrawn bow, bigger burst, wand-star move,
   240vh desktop track, lazy polaroids) — also queued in WEBSITE-PLAN Open items.
2. The `node_modules` junction decision (environment finding 1 below) — a Kam call, unchanged.
3. Then the switchover checklist (WEBSITE-PLAN "Ready for switchover" +
   `docs/SWITCHOVER-RUNBOOK.md`). **Do not flip DNS without the owner.**

## 🎬 2026-07-16/17 — HOMEPAGE HERO ANIMATION built (branch `hero-animation`, PUSHED, not merged)

The scroll-scrubbed grooming transformation from `Luxury dog grooming animation/` is integrated
into the homepage hero. The build is **complete and green**; what is left is the owner's eyes and
the merge. Full design rationale lives in `src/components/HeroStage.astro`'s frontmatter and
`CLAUDE.md`'s hero section — **read those before changing anything in the hero.**

> ### ▶︎ PICKING THIS UP ON THE OTHER MACHINE (Kam, 2026-07-17)
>
> The work is on **`origin/hero-animation`** — two commits on top of `main`: `d5b59f4` (the hero
> itself) and the docs commit on top of it. It is pushed, so use git — do NOT wait on OneDrive to
> sync `.git`, and do not trust a stale local copy of the branch:
>
> ```
> git fetch origin
> git checkout hero-animation      # or: git reset --hard origin/hero-animation if it looks odd
> npm install                      # that machine is x64 — it needs its own native binaries
> npm run build && npx astro preview
> npm run hero-resilience && npm run hero-mask-support && npm run mobile-check
> ```
>
> Pushing the branch does **not** deploy — `.github/workflows/deploy.yml` fires on `main` only.
> The preview URL therefore still shows `main`; the owner cannot eyeball this branch there yet.
>
> Verified by cloning `origin/hero-animation` fresh: all seven hero files arrive, and the
> `Luxury dog grooming animation/` handoff source is correctly **absent** (it is gitignored —
> bulky source stays out of the public repo). That folder reaches the other machine via
> **OneDrive, not git**, and you only need it if you re-run `npm run hero-assets`; the artwork it
> generates is already committed, so a normal build/preview does not touch it.
>
> **The single most useful thing that machine can do:** re-run Lighthouse on the homepage. This
> machine tops out at **87 on `main` itself**, so it cannot test the ≥90 gate either way — see
> environment finding 2. If the other machine reproduces the documented 97–100 on `main`, then
> measure `hero-animation` the same way and we finally know the animation's true cost. Use a
> `PUBLIC_INDEXABLE=true` build, `npx lighthouse`, median of 3, and **let the machine settle
> after the build first** — CLAUDE.md's own warning; a run competing with a starting preview
> reads low, and that is exactly how the first (misleading) numbers here were produced.
>
> **What's left, in order:**
> 1. Owner eyeballs it — phone AND desktop. Needs a local `astro preview`, or a decision to point
>    the Pages preview at this branch, or a merge to `main` (which deploys only to the noindexed
>    preview URL — safe; the old WordPress site is still the indexed one).
> 2. Confirm or overrule the judgement calls listed below (moss bow, retoned red band, the 240vh
>    desktop track, the wand-star move, the bigger burst).
> 3. Re-measure Lighthouse (above). Then merge.
> 4. Decide the `node_modules` junction question (environment finding 1) — a Kam call, not mine.

**Shape:** desktop ≥lg pins the hero for 240vh and scrubs the dog from scruffy → groomed (copy
left, stage right, CTA on screen throughout). Below lg there is **no scroll-jack** — the stage
plays once when scrolled into view. Owner's call from the brief; phone users are the majority.

**All gates green** (this machine, 2026-07-17): mobile-check 15/15 · verify-urls 0 ·
verify-stage3 0 · price-list-e2e 0 · CLS **0** · a11y/best-practices/SEO **100/100/100** · perf
**86–87, statistically identical to `main`** (see finding 2 — 87 is this machine's ceiling on
`main` too) · new: `hero-resilience` (reduced-motion, JS-off, back-nav, play-once-when-seen) and
`hero-mask-support` (WebKit) both pass. Eyeballed at 1920/1440/1280/1100/1024/1000/834/768/430 —
no overflow at any width, and the `lg` mode flip (sticky-scrub ⇄ play-once) is clean at 1024.

**What shipped** (12 files, +1410 lines): `src/components/HeroStage.astro` (the animation,
heavily commented), `scripts/hero-assets.mjs` (regenerates the artwork; output committed),
`scripts/hero-{shots,resilience,mask-support}.mjs` (new gates, wired into package.json),
`src/assets/pages/home/hero-{dog,fairy-stencil}.png`, plus the hero markup in `index.astro`,
`.gitignore` (ignores the handoff folder), `CLAUDE.md` and this file.

### ⚠️ Two environment findings that will bite the next session

1. **`node_modules` is NOT a junction, and it is syncing between the two machines.** CLAUDE.md
   says it is junctioned to `C:\dev\grooming-website-node_modules` — **that is stale**: `C:\dev\`
   did not exist, and `node_modules` is a real directory living inside OneDrive. So deps ARE
   syncing between machines, which is the exact thing the junction rule exists to prevent, and
   it has a consequence: the two machines have **different CPU architectures**.
   - This laptop's Node is **win32-arm64**; the synced `node_modules` had only **x64** natives,
     so `sharp` and `rollup` both failed to load and **`npx astro build` was broken before any of
     this work started** — nothing to do with the hero.
   - Fixed additively so both machines work: `npm install --no-save --include=optional
     @rollup/rollup-win32-arm64-msvc@4.62.2 @img/sharp-win32-arm64@0.34.5`. **`package.json` and
     `package-lock.json` are untouched** (verified) — the x64 binaries are still there.
   - ⚠️ `node_modules` was later fully reinstalled here (`npm install`) and now carries **both**
     architectures. Because it syncs, **the other machine may inherit an arm64-flavoured tree —
     just run `npm install` there** and it will re-resolve its own natives. (A stray `npm install`
     also rewrote the lock, stripping 111 lines of `libc`/`musl`/`glibc` constraints that gate
     which `sharp` Linux CI picks. That was reverted — do not commit that churn if it reappears.)
   - **Decide whether to restore the junction properly** — a Kam call, not something to change
     silently, and it needs doing on BOTH machines or not at all.
2. **⚠️ Lighthouse ≥90 does NOT pass on this machine — and it does not pass on `main` either.**
   Measured same-machine, median-of-3, `PUBLIC_INDEXABLE=true`, `main` via a clean `git worktree`:
   **`main` = perf 87 (runs 86/87/87, LCP 4.0s)** · **`hero-animation` = perf 86–87 (runs
   86/86/87, LCP 4.0–4.1s)**. Same distribution — the animation is **within measurement noise of
   `main`**, i.e. it costs ~nothing. But note the ceiling is 87, not 90, on `main` too, so the
   gap to the documented 97–100 is environmental and predates this work. Cause: **GTM ships
   313KB** (gtm.js 151KB + gtag 162KB) from a live CDN — 6× the whole animation — and the LCP
   element is the H1, which waits on the Fraunces webfont queued behind it. **Re-measure on the
   machine where 97–100 was recorded before treating 86 as a regression.** If the number ever
   needs to genuinely improve, the lever is preloading Fraunces (helps every page) — deliberately
   NOT done here, as it is out of this change's scope.
   *(Getting to parity took three things: one shared `getImage()` URL so the dog is a single
   41KB fetch, `fetchpriority="low"` so decoration never outranks the headline's font, and
   lazying the polaroid strip that this hero pushed below the fold.)*

### One bug worth knowing about (found by review, fixed, now gated)

**The mobile play-once was burning off-screen.** The play clock was armed by an
IntersectionObserver on the *track* — but below `lg` the 240vh collapses, so the track IS the
whole hero and is already intersecting at `scrollY=0`. The 3.4s playthrough therefore ran to
completion while the stage was ~5% visible, latched `played`, and every phone visitor arrived at
a static, already-finished dog: the animation never played at all. **The screenshots hid it** —
`hero-shots` scrolls the stage into view immediately, so it caught the tail of an animation that
had already been running since load. Fixed with a dedicated one-shot observer on the *stage*
(threshold 0.35); `hero-resilience` now asserts "plays iff visible" on 390×844 / 375×667 /
360×640, and that test was confirmed to fail against the old code before being accepted.

*Known and deliberate:* with **JS off on desktop** the 240vh track remains (the hero is correct
and finished, just with ~1.5 screens of extra scroll). Fixing it needs `:has()`, which combined
with the 3s disarm net would collapse the track *while the visitor is scrolling* — worse than the
scroll it saves. Reduced-motion, the far larger population, IS fixed (track drops to auto).

### Judgement calls the owner may want to overrule

- **The bow is MOSS, not honey.** Honey was measured against the topknot it lands on (#f8e1bb–
  #eebc7b — honey-300 territory) and would be invisible; moss is the only palette hue separating
  on both hue and lightness. Knot is honey-400.
- **The artwork's red topknot band is now moss.** It was the only red in the composition, the bow
  does not fully cover it, and green-bow-over-red-band read unmistakably as Christmas holly.
- **The bow is REDRAWN, not just recoloured.** The handoff's loops sweep upward from the knot
  with tails below and a big round knot: at the 33px it actually renders, that silhouette is a
  moth, and the round knot made it read as a green flower. Real bow loops sit horizontal, level
  with the knot. Rendered at 1:1 on the topknot's true colour to pick — the only honest way to
  judge a 33px mark. Tails dropped (two dark specks at that size = the insect reading).
- **The burst stars are bigger than the handoff's** (18 units, radius 12→56 vs 13 and 8→46). The
  handoff is authored for a 760px stage; ours is ~590px in the two-column grid, so its values
  landed at ~78% and put 7px stars *inside* her topknot fur — invisible, on the payoff frame.
- **The wand star was moved onto the wand tip.** The handoff parks it mid-skirt, nowhere near her
  wand, which reads as a stray dot; the shower's emission origin is the wand tip either way.
- **The "Fresh off the table" polaroids are now `loading="lazy"`** (were `eager`). They sat under
  a one-screen hero; they are now 2.4 screens down on desktop, so eager-loading ~85KB of them
  ahead of the fonts was costing LCP. This is the one edit outside the hero itself.

## ✅ CURRENT STATE (2026-07-16 night) — THE BUILD IS COMPLETE: 15/15 PAGES

**Stages 0–5 ALL DONE.** Preview:
**https://preview.fairytailsdoggrooming.co.uk** (HTTPS enforced, **still noindexed** — the old
WordPress site remains the indexed one and is untouched until the switchover runbook runs).

All gates green: `verify-urls` 0 failures · `verify-stage3` 0 · `price-list-e2e` 0 ·
`mobile-check` 15/15 · Lighthouse 97–100 perf / 100 a11y / 100 SEO on every page · dist-wide
link crawl 82 internal URLs 0 broken · sitemap = the 14 canonical URLs · reduced-motion clean.

**The homepage's Google-review excerpts self-refresh weekly** via the n8n "Grooming Reviews
Rotator" (live + end-to-end verified 2026-07-16 — see that entry below). Never hand-edit
`src/data/reviews-snapshot.json`; the workflow owns it.

**What remains is NOT build work — it's the switchover checklist** (WEBSITE-PLAN "Ready for
switchover" + docs/SWITCHOVER-RUNBOOK.md): owner walkthrough + sign-off, the ⚑ items below,
GSC/Ahrefs baselines, GitHub verified domain, then the DNS flip. **Do not flip DNS without the
owner.**

### Waiting on the owner (all non-blocking for build, all pre-switchover)

1. **Eyeball the preview — phone AND desktop.** All 15 pages are real now.
2. **Check the gallery breeds** — alt text names breeds where they were unmistakable and
   deliberately doesn't where they weren't. Full list in WEBSITE-PLAN's open items.
3. **Who-we-are photo** — the old image looks like the K9 Centre BARN, not the town salon.
4. **The ⚑ homepage choices** made while the owner was away (WEBSITE-PLAN open items).
5. **Browser session for baselines:** GSC Domain property + DNS-TXT verification and baseline
   export; GitHub account-level verified domain (github.com/settings/pages → Add a domain →
   TXT via Hostinger MCP); Ahrefs baseline exports → `docs/seo-baseline/` (API is plan-blocked
   — web UI only).

*(Resolved 2026-07-16 by owner rulings: bath & brush pick-ups ARE offered at £2/journey — the
form was right; "From £25" kept as is; the FAQ's £25 puppy groom removed as stale; who-we-are
says "training, day school and daycare". Details in WEBSITE-PLAN's copy log.)*

**Housekeeping:** 2 TEST rows in the `grooming_enquiries` data table + 2 TEST emails at
info@ — safe to delete.

### The rule that governs every page from here

📱 **THE MOBILE GATE** (owner rule, 2026-07-16, in CLAUDE.md): no page ships until it has been
checked on a phone for **responsiveness, visuals AND speed**. `npm run mobile-check` enforces the
mechanical half; the other half is on Claude — **open `shots/<slug>-390.png` and look at it.**

## 2026-07-16 (late night) — ✅ WEEKLY GOOGLE-REVIEWS ROTATION IS LIVE, END-TO-END VERIFIED

**n8n workflow "Grooming Reviews Rotator" (`sXavTjxM4hzZ8bTo`) is ACTIVE**: every Monday 06:30
London it fetches the salon's NEWEST Google reviews (legacy Place Details, `reviews_sort=newest`),
keeps up to four 5★ excerpts (240-char word-boundary trim + ellipsis), and — only if they differ
from the current file — commits `src/data/reviews-snapshot.json` to the repo, which auto-deploys
the homepage. Fail-closed: ANY error (or <2 usable 5★ reviews) = no commit, the site keeps its
current snapshot.

**Live proof (all 2026-07-16):** a real run committed `2aff342` ("Rotate homepage Google review
excerpts") → Pages deployed → the live homepage now shows a review from THIS WEEK (Sarah
Griffiths; Sharon Terrell's even praises the pick-up service). A second run under the fully
locked key returned `{skip:true, "reviews unchanged — no commit"}` — the idempotent path proven.
Mobile gate re-run green on the rotated content. The TMP test workflow is deleted.

**Credentials (both vaulted, both live-verified):**
- Google Maps key: project `key-reference-454223-c7` (k.singh3184@gmail.com), restricted to
  Places API + Places API (New) AND IP-locked to the VPS (187.124.214.24) — a non-VPS call is
  provably denied. Vault: `_SECRETS/google-services.md`; n8n credential `eS143hAYMhsF9CHu`.
- GitHub fine-grained PAT `n8n-grooming-reviews-rotator`: only `groomingwebsite`, Contents RW,
  no expiry (deliberate — scope-minimal instead). Vault: `_SECRETS/github.md`; n8n credential
  `hIufSEHQqW9OfTQx` (domain-locked to api.github.com).

**Debugging lesson banked:** every Google error for over an hour — legacy "must enable Billing",
(New) bare "caller does not have permission", even after `gcloud billing projects describe` said
billing was enabled — was ONE root cause wearing masks: **the bank had DECLINED the Visa on
Google's verification charge** (red banner + "Transaction declined" on billing → How you pay).
When a fresh Google billing account misbehaves inconsistently, check the PAYMENT state before
debugging keys, restrictions or propagation.

## 2026-07-16 (night, later) — owner interview round 2: four rulings applied

Owner answered the queued questions: **"From £25" kept** (now interpolates `fullGroom.from`
everywhere); **£25 puppy groom = stale, removed from the FAQ**; **who-we-are: "training, day
school and daycare"** (both real, different things — matches the K9 Centre's own naming);
**Google review excerpts back on the homepage, rotated weekly**. The "Fresh from Google" block
ships now with 4 five-star excerpts from `src/data/reviews-snapshot.json` (2026-07-12 harvest
snapshot, verbatim fragments).

**⏳ The weekly rotation is designed but blocked on two credentials only Kam can create** (the
auto-mode classifier also correctly refused to let a session invent n8n credential entries
unprompted): a Google Maps Platform key (Places API) and a fine-grained GitHub PAT (Contents RW,
`Fairytails123/groomingwebsite` only). Flow: n8n weekly schedule → Place Details
(`reviews_sort=newest`, place `ChIJV3P8-VAb30cRHoBgRmxCYIM`) → filter 5★, take 4, trim →
compare + PUT `src/data/reviews-snapshot.json` via GitHub contents API → Pages auto-deploys.
Gates already re-run green after these edits (verify-urls 0 · verify-stage3 0 · mobile-check on
the 3 changed pages · home Lighthouse 99/100/100/100 · 390px screenshot eyeballed).

## 2026-07-16 (night) — Stage 5 shipped: the homepage. 15/15 — build complete

**The owner's mid-session ruling landed first**: bath & brush pick-ups ARE offered at the same
£2/journey (the JotForm was right, the site was wrong). Applied across T&Cs//services//FAQ +
pricing.json regenerated + the retired wording added to stage3-checks' banned list. Committed
separately (`8cb08cd`→ ruling commit).

**Then the homepage** (owner away — ⚑ choices flagged in WEBSITE-PLAN open items for review):
- Hero = the old carousel's copy as a static header + Book/price-list CTAs + ReviewsBadge;
  polaroid strip of 4 gallery dogs; who-we-are teaser, the 5 "at a glance" services (blurbs
  verbatim), door-to-door band (facts from pricing.json incl. the new bath & brush eligibility),
  subscription band (mirrors /services/, 2-month term shown next to the CTA), 3 verbatim
  testimonials with their real dog photos (Reg & Ter/Boo/Hugo), final CTA. Full deviation list:
  WEBSITE-PLAN copy log Stage 5 entry.
- **⚠️ Near-miss caught by the eyeball half of the mobile gate:** the door-to-door section
  originally used `services/pickup.jpg` — which turns out to be a MAP whose legible labels are
  **Bexhill, Battle and Rye**, the exact towns the owner ruled we don't serve. The text gate
  bans those words but can't read pixels; at 286px wide it would have advertised the wrong
  coverage area on the money page. Swapped for a gallery dog; the /services/ 64px thumb keeps it
  (illegible) with its alt corrected — it had claimed to be "the salon van".
- **A11y catch:** ReviewsBadge inherits its "4.9 out of 5" text colour — fine in the cream
  footer, dark-on-dark in the moss hero (Lighthouse a11y 96). Fixed with `text-cream-100` on
  the hero wrapper → 100.
- **Whole-site pass:** dist-wide internal link crawl (82 URLs, 0 broken), sitemap sanity (14
  canonical trailing-slash entries, stubs/404 correctly absent), full mobile-check 15/15,
  verify-stage3 + price-list-e2e re-run green, reduced-motion clean (polaroids straighten).
- Lighthouse home: 99 perf / 100 a11y / 100 bp / 100 seo (mobile, prod-flagged build).

**Adversarial review before commit** (4 lenses → 7 raw findings → 5 confirmed, 2 refuted), all
5 fixed: (1) the meta description's "from £25" and (2) the pick-up eligibility list were
hardcoded prose — both now render from pricing.json (`pickup.eligible` is a new field; the
eligibility list is rendered by FIVE pages and changed twice today alone, so stage3-checks now
POSITIVELY asserts the current list on all five, not just bans retired wordings); (3) homepage
had no og:image (the old Yoast one did) — now a 1200×530 JPEG derivative of the group-of-dogs
photo; (4) Base.astro declared `summary_large_image` on pages with no image — now conditional,
fixing 11 pre-existing pages' contradictory card metadata; (5) the ⚑ owner-review items were
filed under the wrong WEBSITE-PLAN heading — moved to Open items. Also fixed in the same pass:
gallery's hardcoded "£25" now interpolates.

## 2026-07-16 (evening) — Stage 4b shipped: /blog/ + /why-dog-grooming-is-important/

**14 of 15 pages built — only the homepage remains.** Owner interview locked 4 rulings before the
build: **date only, NO author byline** (the old post credited Grace Humbles); **hero = the K9
Centre repo's 1600×1180 salon photo** (copied byte-exact, sha256-verified, replacing the old
650×433 studio shot); **both sites stay self-canonical** — the cross-domain duplicate decision
stays at polish; **more posts are planned** → /blog/ is a growing tips section (a new post =
one markdown file in `src/content/blog/`, everything else is generated).

**What the harvest investigation established** (full detail in WEBSITE-PLAN's copy log):
- The visible "November 6, 2022" byline was a site-rebuild artifact. The body's own first line
  was a typed "17th April 2020", WP's auto-excerpt on /blog/ proved it body text, and the Main
  Website's copy of the same post already used 2020-04-17. That date is now `pubDate`; the stray
  body line is dropped.
- The old article body had **zero headings** — its four section labels were
  `<p><strong>` paragraphs. Promoted to real H2s. The old /blog/ index had **no H1 and a null
  meta description**; both written new (logged).
- The post is word-identical on thefairytails.co.uk (its copy fixed 2 typos; ours now carries
  the same 2 fixes, logged like the T&Cs precedent).

**New infrastructure:** content collection populated (filename = ROOT-level legacy slug; new
`src/pages/[slug].astro` route renders it); `Base.astro` gained optional `articlePublished`
(og:type article + article:published_time, as old Yoast emitted) and og:image
width/height/type props; both new pages added to mobile-check/shots/verify-urls.

**Adversarial review before commit** (4 lenses → 7 raw findings → 3 confirmed, 4 refuted), all
3 fixed: an empty-collection guard in blog.astro (a verifier **watched the post .md transiently
vanish from src/content/blog/ mid-OneDrive-sync** — the guard turns a cryptic build TypeError
into a diagnosis); /blog/ was missing its og:image; both pages' og:image is now a **JPEG
derivative with explicit dimensions** (some scrapers render the first scrape imageless for a
bare WebP; old Yoast shipped dimensions too).

**Gates:** verify-urls 0 · mobile-check 14/14 (the 2 new pages add ZERO low-res warnings — the
salon photo choice) · Lighthouse blog 100/100/100/100, post 97/100/100/100 · verify-stage3 0 ·
price-list-e2e 0 · reduced-motion: 0 running animations, 0 hidden at t=0 · 1440+390 screenshots
eyeballed on both pages.

## 2026-07-16 (pause) — checked the LIVE booking form; two of my own claims were wrong

Read the JotForm (`251190647924057`) directly at the pause instead of trusting the harvest. Two
corrections, both mine:

1. **"Bus pick-up" is the salon's own word, not a stray.** Earlier today I removed it from
   `business.ts` claiming it belonged to the sister route-planner project, because a 15-page audit
   found it nowhere in the harvest. But the live form asks for a *"Full Groom or Hand Strip
   Appointment – with bus pick-up and/or drop-offs"*. **The harvest is the source of record for the
   OLD SITE, not for the BUSINESS.** "Not in the harvest" ≠ "not real" — check the booking form and
   the owner before calling a term foreign. Comment corrected.
2. **🔴 The form sells bath-and-brush WITH bus pick-up** — a question titled *"Bath and Brush
   Appointment – Bus pick-up and drop-offs"*, on a form updated 2026-07-15. Our site says the exact
   opposite in three places. Logged as the top open item; owner must rule before switchover.

Also corroborating: the form's *"Select pick-up, drop-off **or both** services"* question is
independent evidence for the **per-LEG** £2 pricing the owner ruled — the model was already in
their booking flow.

## 2026-07-16 (later still) — Stage 4a: /gallery/ shipped

5 before/after pairs + a 20-photo polaroid grid. Lighthouse 99/100/100/100, mobile gate green.
**The plan's "~25 gallery pairs" was wrong** — the real page was a 5-slide carousel plus a
20-photo tiled grid. Corrected in WEBSITE-PLAN.

**⚠️ THE HARVEST HAD MISSED ALL 5 BEFORE/AFTER IMAGES — and reported "failed: 0".** They use
protocol-relative URLs (`src="//host/…"`) plus a CSS `background-image`, and `extractImageUrls`
only matched `https?://` (protocol-relative was handled for `srcset` alone). Rescued at 1200×600
and `scripts/harvest.mjs` fixed. **Second time the "source of record" has had a hole in it** (the
Bruno video was the first). If anything else is ever missing, suspect the scanner before assuming
the old site didn't have it.

**The 5 before/afters were the OLD brand in pixels** — 1200×600 composites on cyan with soap
bubbles and tilted white frames. Owner ruling: crop the photos out and reframe. `npm run
gallery-crop` does it. Three things that cost real time and are documented in the script:
1. **The frame is a ~20px BORDER, not a filled rectangle** — a white-pixel histogram ("frame spans
   >25% of the row") found nothing on 6 of 10 photos. A first/last-white-pixel scan along the
   middle row finds the edges exactly.
2. **You cannot classify the background by its blue cast** — slide 2's background is dark navy
   (40,77,104) and slide 5's dark dog fur is (28,34,48). No threshold separates them.
3. **The bubbles are drawn ON TOP of the photos**, so some crops are deliberately ASYMMETRIC —
   a uniform inset can only clear a corner bubble by eating the dog.
Corner sampling is a hint, never a gate: it flagged a turquoise towel and the light salon wall,
and missed real bubbles in two photos. **The contact sheet + eyes decided every value.**

**⚠️ ONE LIGHTHOUSE RUN IS NOT EVIDENCE.** The gallery scored **88** (a gate failure) on the first
run and **99, 99, 99** on three more — the first run was competing with the build/preview startup.
Every individual metric had scored 95–100, which is what exposed it. Re-run before believing a
Lighthouse regression.

**Resolution ceiling, unfixable without new photography:** the before/after crops are 242–309px
(each was a ~400px photo inside a composite) and the grid photos are 480×480 originals. Display
slots are deliberately small to stay sharp; `mobile-check` warns on 4. Do not enlarge them.

## 2026-07-16 (later) — 📱 THE MOBILE GATE is now a hard rule

**Owner rule: no page ships until Claude has checked it on a phone for responsiveness, visuals
AND speed.** Written into CLAUDE.md as its own gate, with `npm run mobile-check` to enforce the
mechanical half (needs `npx astro preview` running). It fails on horizontal overflow at 390px,
content hidden at t=0, broken/overflowing images, and sub-44px tap targets. The half it CANNOT
check is on Claude: open `shots/<slug>-390.png` and actually look.

**Run against the pages already shipped, it found 4 real defects — all pre-existing since Stage 1,
all in shared components, so all 11 pages were affected:**
- Footer "Find us on Google Maps" (20px tall), "From 63+ Google reviews" (20px) and "Been in with
  your dog? Leave us a review" (**16px**) — the last two fail even WCAG 2.2 AA's 24px floor.
- ConsentBanner "Essential only"/"Accept all" at 38px — the one control every phone visitor must
  hit before they can read anything.
- `/services/` "Find out more" card links (20px); `/contact/` "Open in Google Maps" (20px) — on a
  contact page, on a phone, that link IS the page's job.
- The enquiry form's concern checkboxes: a 28px label target, legal but tight for a stack of 10.
All now `min-h-11` (44px). Layout is unchanged — centring 20px of text in a 44px box supplies the
same visual gap the old margin did, so the margins came off.

**⚠️ Three traps this script hit while being written — do not "simplify" them back out:**
1. **`img.naturalWidth` is DENSITY-CORRECTED.** For a `w`-descriptor srcset the browser divides
   the real width by the chosen density, so a *correctly served* image reports ≈its CSS width.
   The obvious `naturalWidth < css * dpr` test flags **every image on the site**. It did, and the
   images were fine all along. Parse the srcset's `w` candidates instead.
2. **`scrollTo()` must use `behavior:'instant'`.** global.css sets `scroll-behavior: smooth`, so a
   stepped scroll loop outruns the animation, never reaches the bottom of a long page, and reports
   the last lazy images as "failed to load" — only on the longest page, which looks like a real bug.
3. **A checkbox's tap target is its `<label>`, not the 20px box.** Measuring the input alone fails
   every properly-labelled checkbox on the site.

**Low-res warnings are expected and accepted** on /services/haircut-lengths/ (580w candidates for a
334px slot ≈ 1.7x). The harvested originals ARE 580×580 — no bigger version has ever existed — so
this warns rather than fails. Same story for the 300×300 add-on thumbs, which is why they're used
at 64px.

## 2026-07-16 — Stage 3 shipped: the whole services cluster (7 pages)

**Built:** `/services/` hub, `/services/full-groom-price-list/`, `/services/haircut-lengths/`,
`/services/teeth-cleaning/`, `/services/doggy-massage/`, `/services/homeless-dogs/`,
`/services/frequently-asked-questions/`. New components: `PriceTable.astro`, `Faq.astro`.

**The real story of this stage was the FACTS, not the pages.** A cross-page audit of the harvest
found the old site contradicting itself in ~9 places. Five owner rulings settled it (all recorded
in WEBSITE-PLAN's copy log — read that before touching any price):
- **Pick-up = £2 per journey** (£2 each leg, £4 round trip), **Hastings and St Leonards**, full
  grooms + hand stripping only, **no out-of-area**. The old site said *four* different things and
  this value matched none of them. `business.ts`'s duplicate `pickup` object (a contradicting 5th
  variant) is **deleted** — `pricing.json` is now the single source.
- **New pick-up time windows** (7:45–9:30 → 12:45–13:30 / 12:45–13:45 → 15:30–16:45), replacing
  two different published sets. Both pages render them from data now.
- **Ear plucking**: absolute "we never pluck". **Payment**: invoicing by prior arrangement only.
- **Adventure Dog shop link dropped** — the domain is dead (Shopify 409 / TLS failure).

**⚠️ TRAP FOR THE NEXT SESSION — do NOT settle price disputes with the Yoast modified_time
stamps.** The homepage, /services/, /services-2/ and the price list all carry stamps inside one
7-minute window on the harvest date — that's a migration re-save of the Bluehost origin, not four
edits. I initially misread it as a real edit session; it isn't. `/services-2/` looks 39s "newer"
than `/services/` as a pure artifact, which would "prove" the retired page's £5 nails over the
canonical £10. Only pre-2026 stamps carry signal.

**Also fixed:** the homepage stub was shipping a `<meta name="description">` advertising "**free**
door to door service" — live in dist, and it would have gone to Google at switchover.
Hand-stripping's advertised "£50+" floor was contradicted by three £45 rows in its own price
table; it's now **derived** from the table (`£45+`) so it can't drift again. Tick removal £5 (T&Cs
prose only) added to structured data.

**Bruno video rescued and shipped.** `/services/` embedded a self-hosted 20.6 MB MP4 on the
WordPress origin we're replacing — the Stage-0 harvest only took images, so it was days from
vanishing. Now at `public/media/brunos-groom.mp4`, `preload="none"` + a real poster frame, so it
costs nothing until played (/services/ still scores 95 perf). Poster extracted via
`npm run video-poster` — **there's no ffmpeg on this box**, so it decodes the frame in real Chrome
(Playwright's bundled Chromium has no H.264 and a file:// video won't load from about:blank —
both gotchas are documented in the script).

**New gates (wired into package.json):**
- `npm run verify-stage3` — static: asserts all 105 rows render, 0 hidden at t=0, a 10-breed spot
  check against the RENDERED table, and that no banned wording ("free pick", "£1 per journey",
  "£50+", stale windows, out-of-area towns) reappears on any built page.
- `npm run price-list-e2e` — browser: drives the breed filter, then reloads with **JS disabled**
  and asserts all 105 rows are visible **by computed style**. This is the guard against the
  reveal bug that cost the main site 71% of a page's clicks.

**Gates run:** verify-urls 0 failures · Lighthouse 95–100/100/100 on all 7 + the 2 amended pages ·
dual-viewport 1440/390 sweeps · reduced-motion pass **with a negative control** (motion suppressed
under `reduce`, still present under `no-preference` — colour/shadow fades deliberately left alone,
they aren't motion).

## 2026-07-12 (later) — Stage 2 shipped: T&Cs, Contact, Who-we-are

- **Three pages built and deployed** (verify-urls: 3 pages + 3 stubs now `built`, 0 failures).
  T&Cs verbatim (2 typo fixes logged); contact meta description corrected (old one carried the
  K9 Centre's Barley Lane address — logged in WEBSITE-PLAN).
- **Preview HTTPS live + enforced**: https://preview.fairytailsdoggrooming.co.uk (cert stalled
  ~50 min; fixed with the documented remove/re-add-domain re-trigger). http→301→https verified.
- **Gates run**: Lighthouse (mobile, prod-flagged local build) — home 98/100/100,
  T&Cs 100/100/100, contact 100/100/100, who-we-are 99/100/100 (perf/a11y/seo).
  Dual-viewport sweeps (1440 + 390, Playwright `scripts/shots.mjs` → `shots/`) — caught and
  fixed dark-on-dark header nav (backdrop now always-on; documented divergence in Header.astro).
  Mobile drawer open/close PASS. **On-page form E2E PASS** (`scripts/stage2-checks.mjs`:
  real POST from /contact/ → webhook 200 → row 2 in `grooming_enquiries` → email accepted).
  Reduced-motion: no scripted animation on these pages; Header carries the main site's
  prefers-reduced-motion rules.
- **Tooling added**: Playwright (devDep) + Chromium; `scripts/shots.mjs` (viewport gate),
  `scripts/stage2-checks.mjs`. Lighthouse runs via `npx lighthouse` with
  `CHROME_PATH=<playwright chromium>`.
- **PENDING owner eyeball** of the three pages on the preview URL + the pickup-price wording
  ruling + the who-we-are photo question (see WEBSITE-PLAN open items).
- Two TEST enquiries in `grooming_enquiries` + two TEST emails at info@ — safe to delete.

## 2026-07-12 — Stage 0 + Stage 1 shell shipped

**Done this session:**
- **Harvest complete** (`grooming-image-archive/`, gitignored): all 18 legacy URLs (pages,
  stub targets, /feed/), Yoast sitemaps + robots, per-page copy/meta/links, **180 images
  downloaded, 0 failures — 70 rescued from the temporary Bluehost origin** (`hrb.tqx.mybluehost.me`)
  that could vanish any day. `HARVEST-MANIFEST.md` has counts; magic-byte validated.
- **Repo live**: `Fairytails123/groomingwebsite` (public), Pages via Actions, deploys on push.
  First deploy green.
- **Preview domain live**: `preview.fairytailsdoggrooming.co.uk` (Pages custom domain +
  additive Hostinger CNAME — post-change zone diff verified: all email records byte-identical).
  Domain claimed on the repo BEFORE the DNS record existed (no takeover window). HTTP serves
  from GitHub; HTTPS cert provisioning in progress at session close — enforce HTTPS once issued.
- **Noindex verified on the deployed preview**: `<meta name="robots" content="noindex, nofollow">`
  + robots.txt `Disallow: /` (env-driven INDEXABLE mechanism — see CLAUDE.md).
- **Shell built** (Stage 1): Base/Header/Footer/ConsentBanner/EnquiryForm adapted from the
  Main Website design system; grooming `business.ts`; favicons generated from the rescued
  600px emblem (old wide logos are ≤220px — header uses emblem + text lockup instead).
- **pricing.json extracted by script** from the harvested price-list HTML: 47 breeds +
  10 crossbreeds + 48 de-shed = 105 rows + bath/brush sizes; 10-breed spot check all-OK;
  add-ons/extras transcribed verbatim from /services/. Owner ruling applied: breed list +
  /services/ add-ons canonical, /services-2/ retired.
- **n8n webhook live + E2E-verified**: workflow "Grooming Website Enquiry" (`TpQFGJy87KIKGflV`)
  on the VPS, path `grooming-enquiry`, cloned from the Main Website's enquiry workflow.
  Real POST → execution 56956: all 6 nodes success, SMTP accepted, row 1 in `grooming_enquiries`
  (`mbWR9tHS4u95s605`). Spam POST → silent ok, no row, no email. A TEST email landed in
  info@thefairytails.co.uk — safe to delete.
- **DNS pre-flip snapshot** committed: `docs/seo-baseline/dns-pre-flip.json` (the surgical
  rollback values for the switchover).
- Redirect stubs shipped: `/services-2/`, `/category/blog/`, `/author/grace/`. 404 page shipped.
- `verify-urls` gate: 0 failures, 13 planned.

**Next actions (in order):**
1. Enforce HTTPS on the preview domain once the cert lands
   (`gh api repos/Fairytails123/groomingwebsite/pages -X PUT -F https_enforced=true`), then
   confirm `https://preview.fairytailsdoggrooming.co.uk/` serves with noindex.
2. Browser-session tasks (need Chrome): GitHub account-level verified domain (anti-takeover
   TXT), GSC Domain property + TXT + baseline export, Ahrefs baseline exports → `docs/seo-baseline/`.
3. Stage 2 pages: `/terms-and-conditions/` → `/contact/` → `/who-we-are/`.
4. Owner question outstanding: pickup price wording (free vs £1/journey — see WEBSITE-PLAN open items).

**Watch-outs discovered:** gh CLI token lacks `workflow` scope — use plain `git push` for
anything touching `.github/workflows/`. PowerShell 5.1 sessions here sometimes inherit a
stale cwd — use absolute paths or `Set-Location` first.
