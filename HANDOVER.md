# HANDOVER — session log (newest first)

Read this first each session. Master plan: `WEBSITE-PLAN.md`. Engineering brief: `CLAUDE.md`.

## ⏸️ CURRENT STATE (2026-07-16, after Stage 4b)

**Stages 0–4 DONE.** Preview:
**https://preview.fairytailsdoggrooming.co.uk** (HTTPS enforced, **still noindexed** — the old
WordPress site remains the indexed one and is untouched). **14 of 15 pages built.**
Remaining: `/` (Stage 5, homepage + whole-site pass, ships last).

All gates green: `verify-urls` 0 failures · `verify-stage3` 0 · `price-list-e2e` 0 ·
`mobile-check` 14/14 · Lighthouse 97–100 perf / 100 a11y / 100 SEO on every built page.

### 🔴 Blocking the switchover (owner decisions)

1. ~~**The live booking form sells a service the site says we don't offer.**~~ **RESOLVED
   2026-07-16 evening — owner ruled the FORM was right**: bath & brush pick-ups ARE offered,
   same £2/journey. Site updated in all three places + gate hardened (see WEBSITE-PLAN copy log).
2. **Eyeball the preview — phone AND desktop.** 14 real pages now.
3. **Check the gallery breeds** — alt text names breeds where they were unmistakable and
   deliberately doesn't where they weren't. Full list in WEBSITE-PLAN's open items.
4. **Who-we-are photo** — the old image looks like the K9 Centre BARN, not the town salon.
5. **"From £25"** only holds via de-shed breeds (cheapest clipped groom £30, crossbreed £35);
   **£25 puppy groom** exists only in the FAQ; **"day school" vs "day care"** on who-we-are.

### Next build work

**Stage 5 — homepage + whole-site pass** (hero/teasers/reviews/subscription band; dist-wide
link crawl, sitemap sanity, both-viewport sweep, full verify-urls). When the homepage is built,
do NOT carry over its harvested "free door to door service" claims (see the copy log —
pick-ups are £2/journey).

**Also pending (needs a browser session with the owner):** GSC Domain property + DNS-TXT
verification and baseline export; GitHub account-level verified domain
(github.com/settings/pages → Add a domain → TXT via Hostinger MCP); Ahrefs baseline exports
→ `docs/seo-baseline/` (API is plan-blocked — web UI only).

**Housekeeping:** 2 TEST rows in the `grooming_enquiries` data table + 2 TEST emails at
info@ — safe to delete.

### The rule that governs every page from here

📱 **THE MOBILE GATE** (owner rule, 2026-07-16, in CLAUDE.md): no page ships until it has been
checked on a phone for **responsiveness, visuals AND speed**. `npm run mobile-check` enforces the
mechanical half; the other half is on Claude — **open `shots/<slug>-390.png` and look at it.**

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
