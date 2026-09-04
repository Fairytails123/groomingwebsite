# HANDOVER — session log (newest first)

Read this first each session. Master plan: `WEBSITE-PLAN.md`. Engineering brief: `CLAUDE.md`.

## Next session — start here

1. Read `AGENTS.md`, `CLAUDE.md` and `SEO.md` before taking any action. `SEO.md` contains the
   locked business facts, page-intent map, backlink ledger and verification contract.
2. Confirm the working directory is
   `C:\Users\FT Manager\OneDrive\Business\CODING\Dog Grooming website`. Inspect `git status`, the
   newest release entry and the live GitHub Pages workflow before editing; preserve all unrelated
   changes and timestamped backups.
3. Enforce absolute third-party separation. Grooming uses only GTM `GTM-TZWLLT4H`, GA4
   `G-TVNY7185K3` and `sc-domain:fairytailsdoggrooming.co.uk`. Never use or modify the separate
   `www.thefairytails.co.uk` assets for grooming. The main-site container is outside this project's
   mutation scope: version drift there is a read-only verification matter, never a rollback cue.
   Use `git grep` or explicitly exclude `*.backup-*` when inspecting current source. Pre-separation
   backups are recovery evidence only; never restore their tracking blocks wholesale.
4. The **2026-08-30 SEO release** backlink gate is **2 of 2 complete**: Waggy List and FreeIndex are
   public, crawlable and independently verified. Every future approved SEO work session starts a
   new 0-of-2 gate. Local Dog Groomers remains pending editorial publication; MuddyPup is a
   corrected pre-existing link and does not count as new.
5. Completed JotForm booking attribution is still unverified. At the 2026-08-30 GA4 Admin read-back,
   the stream status displayed `No stream data detected`. No `enquiry_submitted` receipt was
   independently observed; the status message is a snapshot, not negative proof of zero transport.
   Booking starts/completions and telephone/WhatsApp clicks have no implemented or independently
   verified event attribution in the grooming GTM/GA4 estate. Never report a click or enquiry as a
   completed booking.
6. Continue with the measured priorities in `SEO.md`: St Leonards indexing/performance, completed
   booking attribution in the grooming-only estate, citation correction and weekly Ahrefs/GSC review.

## 2026-09-04 (later) — subscription widened: optional £10/month teeth cleaning

Kam changed the Stripe subscription hours after the portal link shipped: teeth cleaning is now a
separate monthly subscription item, and portal QUANTITY updates were switched on so subscribers can
add or drop it themselves.

**That made two things shipped earlier the same day factually wrong**: the T&Cs told customers to
phone to change anything, and `business.ts` recorded quantity change as OFF. Both corrected here.
The lesson now lives in the `business.ts` comment itself — a comment describing external Dashboard
config is a DATED SNAPSHOT, and this one went stale within hours of being written.

### Stripe portal config, re-read live 2026-09-04
- Customers can change quantity of their plan: **ON** (was OFF)
- Eligible products: "Dog Grooming Subscription" £25/mo and **"Teeth Cleaning Optional Sub" £10/mo**
- Proration: **No charges or credits**
- Customers can switch plans: still OFF. Cancel subscriptions: still OFF (verified).

### Owner rulings 2026-09-04
- The £10/month add-on covers ONE ultrasonic emmi®-pet clean at each monthly groom.
- It is **not** covered by the 2-month minimum term — it can be added and dropped month to month.
- It is offered at sign-up on the payment link as well as in the billing portal.
- It is advertised on the site: subscription bands and T&Cs.

### Changed
- `scripts/extract-prices.mjs` — `subscription.optionalAddOn` added to the hardcoded subscription
  block, then `npm run extract-prices` regenerated `pricing.json`. ⚠️ `pricing.json` is GENERATED:
  the regenerated diff was checked to be the addition only, with no harvest churn.
- The three subscription bands — an "Optional: add teeth cleaning …" line beneath the sign-up small
  print, i.e. on the sign-up side of the hairline, not the existing-subscriber side.
- `terms-and-conditions.astro` — a paragraph covering the add-on, and the change/cancel sentence
  corrected: adding or removing teeth cleaning is self-service; only CANCELLING needs a call.
- `business.ts` — portal config snapshot refreshed, now carrying an explicit staleness warning.
- `SEO.md` — the add-on added to the confirmed facts and to the anti-regression contract.

### Flagged to the owner, not actioned
The pay-per-visit teeth cleaning in the price list is also £10. For a subscriber having one groom a
month, the monthly add-on therefore costs exactly the same as paying per visit. Raised in case a
subscriber discount was intended; no change made.

### Verification
Indexable build; `verify-urls` 19/19, `stage3`, `links`, `analytics`, `consent`,
`verify-seo -- --indexable`, `mobile-check` all green. No horizontal overflow at
390/1024/1280/1440. Subscription band and T&C section reviewed by eye at 390. UTF-8 verified at
byte level on the ® character (`0xC2 0xAE`, zero mojibake) — this repo has been bitten by
double-encoded UTF-8 before.

## 2026-09-04 — Stripe customer portal entry point (LOCAL CANDIDATE, not pushed)

Owner request: let subscription customers manage their own billing. Scope was narrowed by Kam
mid-session to **integrating the link** — Stripe hosts the portal itself, so nothing here builds
portal UI, accounts or authentication.

**Status: local working-tree candidate on `codex/seo-foundation-2026-08-09`. Not committed, not
pushed, not deployed.** A push to `main` is a live deploy in front of 17 paying subscribers, and
this is money-adjacent, so the merge is Kam's call.

### What changed (6 files)
- `src/data/business.ts` — new `subscription.portalUrl`
  (`https://billing.stripe.com/p/login/8x27sM5K57BR1IL94W9MY00`) with the operating notes beside it.
- The three subscription bands (`index.astro`, `services/index.astro`,
  `services/full-groom-price-list.astro`) — an existing-subscriber row beneath a hairline divider:
  a `btn btn-ghost-light` "Manage my subscription" plus one line explaining the email-link step.
  It is a SEPARATE row on purpose: putting the button inside the CTA row pushed the
  "£25 / 2-month minimum term" small print away from the sign-up CTA it describes. Caught by
  actually looking at the 1440px screenshot, not by any gate.
- `src/components/Footer.astro` — a 15th Explore link, and `grid-rows-7` → `grid-rows-8`.
  The row bump is load-bearing: at 7 rows a 15th link silently spills into a THIRD sub-column.
- `src/pages/terms-and-conditions.astro` — a new "Dog grooming subscription" section (owner
  instruction 2026-09-04): one appointment a month, £25, 2-month minimum term, and **unused
  subscription time cannot be refunded — book an appointment each month**.

### Why the T&C section was needed, not optional
That page has eighteen `<h2>` sections and not one covered the subscription. The only cancellation
wording a subscriber could read was the appointment clause "We do not charge any cancellation
fees" — appointment-scoped, but read cold it argued against the 2-month minimum term.

### Stripe portal configuration, read live 2026-09-04
Config `bpc_1UBwdLKxaWtXebCj4qyueId5` (Default), portal link **Active**, next-generation portal ON.
Enabled: invoice history; payment methods; customer information (name, email, billing address,
phone). Plan switching and quantity change OFF. Cancellation was ON (end of billing period) —
**owner ruled 2026-09-04 to switch it OFF** so the 2-month minimum stays enforceable. Redirect link
EMPTY, Terms/Privacy links unset, branding still Stripe blue `#2965ff` / accent `#0074d4`.
Those four Dashboard changes were approved but are **still outstanding** — the dashboard UI proved
too unstable to drive safely (a stray click surfaced a "Disable next generation portal experience,
applies to all portal configurations" modal, which was cancelled; config verified byte-identical
afterwards). They are hand-off steps for Kam.

### Open data issue in Stripe — owner action before publicising the link
`conroy870@hotmail.com` has FOUR customer records, two carrying an active £25 subscription:
- `cus_VAnVQ8cgicxCE4` "Sarah Griffiths" — Active, £25 due 30 Sept (created 31 Aug 10:54)
- `cus_VAnS05LusF703v` "Sarah Griffiths" — Active, £25 due 30 Sept (created 31 Aug 10:50)
- `cus_VAnLxWftaILDHr`, `cus_VAnDZHsEKsfUYe` "S L Griffiths" — no subscriptions
Stripe's login link opens only "the most recently created customer that has both that email and an
active subscription". She would reach the 10:54 record; the 10:50 one stays invisible while still
billing her. £50/month may be entirely correct (the plan is per dog), but the portal can only ever
show one of the two. Consolidate onto a single customer record first.

### Verification (local, this machine, indexable build)
`verify-urls` 19/19 · `verify-stage3` 0 failures · `verify-links` PASS · `verify-analytics` PASS ·
`verify-consent` PASS · `verify-seo -- --indexable` PASS · `mobile-check` PASS (11 pre-existing
low-res warnings only) · no horizontal overflow at 390/1024/1280/1440 — the 1024–1300 band matters
here because it is a known gate blind spot and the footer grid change lives exactly in it ·
subscription band, footer and T&C section reviewed by eye at 390 and 1440.

⚠️ `verify-consent` needs `BASE=http://localhost:4321` on this machine: `astro preview` binds IPv6
`::1` only, and the script defaults to `127.0.0.1`, which refuses the connection. Pre-existing and
unrelated to this change, but it will fail for the next session too.

## 2026-08-30 — Hastings SEO foundation, link integrity and grooming-only analytics

**Working branch:** `codex/seo-foundation-2026-08-09`, based on `8602d2d`.

**Experiment path:** none - Kam-approved live project edit.

**Actual working project:** `C:\Users\FT Manager\OneDrive\Business\CODING\Dog Grooming website`.

**Release state:** **LIVE PRODUCTION** from commit `593bbc7` on 2026-08-30. GitHub Pages workflow
`33330239079` completed successfully and the public read-back passed.

### Outcome and decisions

- Created a permanently separate grooming measurement estate: GTM account/container
  `Fairy Tails Dog Grooming` / `fairytailsdoggrooming.co.uk` (`GTM-TZWLLT4H`), dedicated GA4
  property/stream (`G-TVNY7185K3`, property `552100824`, stream `15528315552`) and a link only to
  `sc-domain:fairytailsdoggrooming.co.uk` in Search Console.
- Grooming GTM Version 2, `Grooming-only GA4 measurement`, is **Live and Latest**. It contains the
  Google tag on Initialization - All Pages and the exact custom event `enquiry_submitted`.
  Version 1, `Empty Container`, is historical and must never be restored. The current authenticated
  read-back on 2026-08-30 showed workspace 3 with zero pending changes; workspace 2 was the recorded
  workspace during the publication session.
- GA4 Admin has `enquiry_submitted` configured as a key event with no artificial value, but its
  2026-08-30 stream-status read-back said `No stream data detected`. No `enquiry_submitted` receipt
  was independently observed; that dated status is not negative proof of zero transport. Published
  GTM configuration is not evidence of GA4 receipt, and a key-event definition is not evidence that
  the event occurred. The website emits `enquiry_submitted` after the enquiry webhook returns a
  successful HTTP response; that does not prove the downstream n8n table write or email delivery
  and is not a completed booking.
- The 2026-08-30 read-only public payload for the separate main-site container reported Version 8
  and contained the main-site GA4 destination but no grooming measurement ID. Version 8's name,
  publisher, workspace provenance and differences from historical Versions 5–7 were not investigated
  and belong to a separately scoped main-site review. Those historical versions are not rollback
  instructions. Never restore, clean, synchronise or publish the main-site container during grooming
  work.
- Locked the separation rule into `CLAUDE.md`, `SEO.md`, `WEBSITE-PLAN.md`, the combined baseline,
  source data and user-level Codex instructions. Generated pages require `GTM-TZWLLT4H` and reject
  `GTM-W93L9XK5`.
- Repaired the retired Google-review destination with Google's supported place-search URL and added
  a deterministic generated-site checker covering internal page links, image/srcset/poster URLs,
  CSS assets, XML references and fragments. Final evidence: 201 generated files, 1,147 references,
  838 same-origin references resolved and **zero broken internal or image references**.
- Added malformed-consent recovery and manual analytics/public-payload and consent/network isolation
  checks. GitHub Pages gates cover production indexability, SEO, URLs, service facts and internal
  assets; the workflow does not run `verify-analytics` or `verify-consent`.
- Completed the honest St Leonards service-area page and Hastings local foundation without adding a
  fake location or mobile/in-home grooming claim. The two-link SEO session gate is complete through
  the independently verified Waggy List and FreeIndex profiles.

### Changed release files

`.github/workflows/deploy.yml`; `AGENTS.md`; `CLAUDE.md`; `HANDOVER.md`; `WEBSITE-PLAN.md`; `SEO.md`;
`package.json`; `scripts/analytics-checks.mjs`; `scripts/consent-checks.mjs`;
`scripts/link-checks.mjs`; `scripts/mobile-check.mjs`; `scripts/seo-checks.mjs`;
`scripts/shots.mjs`; `scripts/stage3-checks.mjs`; `scripts/verify-urls.mjs`;
`src/components/Footer.astro`; `src/components/LocalBusinessSchema.astro`;
`src/data/business.ts`; `src/layouts/Base.astro`; `src/pages/contact.astro`;
`src/pages/dog-groomers-st-leonards.astro`; `src/pages/gallery.astro`; `src/pages/index.astro`;
`src/pages/services/index.astro`; `src/pages/services/teeth-cleaning.astro`;
`src/pages/who-we-are.astro`; `docs/seo-baseline/ahrefs-programme-start-2026-08-09.json`;
`docs/seo-baseline/ahrefs-local-rank-tracker-2026-08-10.json`;
`docs/seo-baseline/ahrefs-gsc-programme-2026-08-30.json`; `lighthouse-seo-2026-08-30.json`.

Timestamped recovery copies exist beside every edited pre-existing file. Rollback before release is
to those copies; after release use a normal reverting commit, never history rewriting.

### Preserved invariants and verification

- One Hastings salon, current NAP, Hastings/St Leonards-only service area, salon-only grooming,
  £2-per-journey collection terms, price list, immediate booking-system confirmation and all existing
  primary journeys remain unchanged.
- Production/indexable build: 16 pages. `verify-seo -- --indexable`: 15 canonical pages and every
  metadata/schema/NAP/service-area/GTM isolation contract passed. `verify-urls`: 19/19;
  `verify-stage3`: zero failures; price-list E2E: all 105 rows; hero resilience and Chromium/WebKit
  mask checks: passed.
- `verify-links`: 201 files, 1,147 references, 838 resolved same-origin references, zero failures.
  Its adversarial incomplete-root check exited non-zero as required.
- Manual network-dependent `verify-analytics`: generated site uses only grooming GTM; public grooming payload is non-empty,
  contains the configuration for `G-TVNY7185K3` and `enquiry_submitted`, and excludes
  `G-TPBSKV29CJ`. This proves published configuration and isolation, not GA4 event receipt.
- Manual browser `verify-consent`: malformed storage recovery, essential-only and accept-all persistence/data-layer
  updates passed; browser requests used `GTM-TZWLLT4H` and `G-TVNY7185K3`, never the main-site IDs.
- Mobile gate: all 15 pages passed, with 11 accepted low-resolution source-image warnings only.
  St Leonards was visually reviewed at 390, 1024, 1280 and 1440 px with no layout regression.
- Fresh local Lighthouse: Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP
  1.5 s, LCP 2.2 s, CLS 0, TBT 10 ms and Speed Index 1.5 s.
- Completed cross-domain JotForm booking attribution remains untested and must not be claimed.
  Booking starts/completions and telephone/WhatsApp clicks have no implemented or independently
  verified event attribution in the grooming GTM/GA4 estate. Consent-denied traffic means analytics
  totals will not be exhaustive.

### Production deployment and live read-back

- Release commit: `593bbc74388d35eca36bbe51c321e5d0a8e4b78c`, pushed to `main`.
- GitHub Pages workflow `33330239079`: success. Its build job passed the exact-`true`
  `INDEXABLE` guard, Astro build, indexable SEO contracts, internal/image link gate, URL gate and
  service/collection-fact gate before the deployment job ran.
- All 15 canonical pages returned HTTP 200; the three compatibility stubs returned 200 and `/feed/`
  returned its intentional 404. `robots.txt` allows crawling and names the canonical sitemap.
- `/dog-groomers-st-leonards/` returned 200 with the canonical URL, Hastings-salon wording, booking
  route and sitemap membership. Search Console initially reported `URL is unknown to Google`; its
  live eligibility test passed and `Indexing requested` confirmed addition to the priority crawl
  queue. Do not submit it repeatedly; monitor index coverage and query/page ownership after recrawl.
- The live homepage loads `GTM-TZWLLT4H` and excludes `GTM-W93L9XK5`. The public grooming payload
  contains only the dedicated `G-TVNY7185K3` destination and `enquiry_submitted`, excluding
  `G-TPBSKV29CJ`. The public main-site payload contains its own GA4 destination and no grooming ID.
- Live browser consent checks passed broken JSON, `null`, missing fields, invalid values, unexpected
  fields, essential-only and accept-all states. Measurement requests targeted only `G-TVNY7185K3`.

## 2026-08-10 — FreeIndex profile completed (EXTERNAL; manual review pending)

Kam privately created/authenticated the FreeIndex account and explicitly authorised completing the
listing. The free public profile is now 75% complete with every required field checked plus website,
one Full Groom service, opening hours and payment methods. It contains the truthful Hastings NAP,
Dog Grooming category, three unique salon/service/trust description sections, compliant service
tags, Mon–Fri 08:00–17:30 hours, weekends closed and a direct canonical-site website link. The
existing one photo/logo was retained. No review was created, no unsupported claim was added and the
Premium offer was declined.

Independent signed-out verification found HTTP 200, a self-canonical profile and a direct
`https://fairytailsdoggrooming.co.uk/` website anchor with no `rel` attribute. However, the page
currently emits `<meta name="robots" content="noindex">` and has no `Manually reviewed` date.
Established comparison profiles are indexable and show manual-review dates, so FreeIndex remains a
third-party moderation dependency. Backlink gate stays **1 of 2** until `noindex` is removed and the
public page is reverified. The next session must recheck this existing profile read-only and must not
create a second account/listing, resubmit it or purchase Premium to obtain the link. No source,
commit, push, deployment, payment, review or message was made.

Documentation recovery point for the anti-regression pass: `SEO.md.backup-20260810-170820` and
`HANDOVER.md.backup-20260810-170820`. A second pre-read-back handover copy exists at
`HANDOVER.md.backup-20260810-170945`.

## 2026-08-10 — Ahrefs local tracking and metadata hardening (LOCAL ONLY; backlinks pending)

**Working branch:** `codex/seo-foundation-2026-08-09` based on `8602d2d`.

**Experiment path:** none - Kam-approved live project edit.

**Actual working project:** `C:\Users\FT Manager\OneDrive\Business\CODING\Dog Grooming website`.
**Release state:** local candidate only. No commit, push, deployment, Search Console/Business Profile action, payment, outreach or production-data change was made.

### Outcome

- Ahrefs Rank Tracker project `10212777` now contains exactly 11 approved keyword/location pairs:
  eight for Hastings and three for Saint Leonards-on-sea. Eight mistakenly added national rows were
  removed and the final Ahrefs read-back showed `All 11`, with only the two approved localities.
  Ranks were still unprocessed; this is a tracking baseline, not a claimed ranking result.
- Added `docs/seo-baseline/ahrefs-local-rank-tracker-2026-08-10.json` with the locality set, current
  stale-data limitation, Ahrefs Site Explorer/Site Audit context and keyword-volume evidence.
- Rewrote the local candidate meta descriptions for contact (142 characters), gallery (142) and
  ultrasonic teeth cleaning (137). Tightened `scripts/seo-checks.mjs` from the permissive 50–200
  range to 100–165 characters. The prior who-we-are candidate is 158 characters.
- Ahrefs' 14 missing-alt warnings were reviewed and rejected as false positives: they are deliberate
  empty alternative text on decorative Header/Hero imagery and remain unchanged.
- The Good Dog Guide was removed from the qualifying-backlink route. Its website-link tiers are paid
  (£25/£50 per year) and its terms make outbound links nofollow. Its profile can be corrected later
  as a citation-only action, including the `Saloon` typo, but must not be purchased to satisfy this gate.
- FreeIndex was the approved next route (Ahrefs DR 81, about 4,866 UK traffic/1,880 keywords). The
  account and profile were subsequently completed on 2026-08-10; see the newer entry above. The
  public page remains `noindex` pending manual review, so the backlink gate remains **1 of 2**.

### Exact changed and added files in this continuation

`src/pages/contact.astro`; `src/pages/gallery.astro`; `src/pages/services/teeth-cleaning.astro`;
`scripts/seo-checks.mjs`; `docs/seo-baseline/ahrefs-local-rank-tracker-2026-08-10.json`; `SEO.md`;
`HANDOVER.md`; generated local evidence `lighthouse-seo-2026-08-10.json` and refreshed `shots/*.png`.

Timestamped `*.backup-20260810-134831` recovery copies exist for every edited pre-existing file.
Rollback is to those exact copies on this branch; never reset the dirty worktree or rewrite `main`.

### Fresh verification

- Ordinary local/noindex build: successful; `npm run verify-seo`, `npm run verify-urls` (19/19) and
  `npm run verify-stage3` passed.
- Production/indexable local build: successful; `npm run verify-seo -- --indexable`, URL and Stage 3
  suites passed; 15 canonical pages, sitemap, robots, JSON-LD, NAP and service-area honesty are green.
- `npm run price-list-e2e`: 0 failures, including all 105 rows with JavaScript on and off.
- `npm run hero-resilience` and `npm run hero-mask-support`: passed in the tested reduced-motion,
  JavaScript-off, back-navigation, WebKit and Chromium states.
- `npm run mobile-check`: all pages passed; 11 low-resolution warnings remain accepted because the
  harvested source photographs are physically smaller than ideal 2x candidates.
- Refreshed 390 px and 1440 px screenshots for every page. Contact, gallery and teeth-cleaning were
  visually inspected at both sizes with no layout regression found; cookie controls visible in the
  captures are expected first-visit state.
- Fresh mobile Lighthouse on the local homepage: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; LCP 2.2 s, CLS 0, TBT 70 ms, Speed Index/FCP 1.5 s.

## 2026-08-09 — Local SEO Phase 1 candidate (LOCAL ONLY; backlinks pending)

**Working branch:** `codex/seo-foundation-2026-08-09` based on `8602d2d`.

**Experiment path:** none - Kam-approved live project edit.

**Actual working project:** `C:\Users\FT Manager\OneDrive\Business\CODING\Dog Grooming website`.
**Release state:** local candidate only. No commit, push, deployment, production-data change, payment or outreach was made.

### Pause checkpoint — 2026-08-09 20:57 BST

Kam paused Phase 1 and approved a documentation-only anti-regression hardening pass. `CLAUDE.md`
now makes `SEO.md` mandatory reading for SEO-adjacent development; `SEO.md` contains the locked
business-fact, page-intent, verification and backlink contracts.

- Preserve this branch and all unrelated/local candidate changes. Do not restore individual files
  from `main`, delete the timestamped backups or start again from the pre-SEO baseline.
- The source candidate remains local and previously tested; it has not been committed, pushed,
  deployed or submitted for Search Console indexing. Every push to `main` is production, so none is
  implied by this pause.
- The backlink gate is **1 of 2 new qualifying links**: Waggy List counts; corrected MuddyPup does
  not because its link predated the session; Local Dog Groomers remains unpublished.
- **Superseded 2026-08-10:** do not resume at The Good Dog Guide; its website-link tiers are paid and
  its outbound links are nofollow. FreeIndex has since been registered and completed at the public
  URL in the newest entry, but remains `noindex` pending manual review. Recheck that existing profile
  read-only; Dog Owners Guide and DogPack require separate action-level approval if needed.
- Do not call Phase 1 complete until the second new link is public and verified, the final local
  candidate has passed the gates in `SEO.md`, and both this file and `SEO.md` record the result.
- Release still requires a separate, explicit scope covering commit, push and production
  deployment, followed by live robots/sitemap/canonical/schema/booking and Pages-workflow checks.

### Outcome

- Added durable SEO memory in `SEO.md`, a dated Ahrefs baseline, and the project-level two-backlink session gate in `AGENTS.md`.
- Repositioned the homepage around Hastings dog grooming, immediate online confirmation and optional paid collection/return.
- Added an honest St Leonards service-area page. It says explicitly that grooming happens at the one Hastings salon and that this is not mobile or in-home grooming.
- Added current LocalBusiness/WebSite structured data, qualifications/insurance/experience/air-conditioning trust signals, and supporting internal links.
- Added an SEO regression suite and included the new canonical page in URL, mobile, screenshot and pickup-fact checks.

### Exact changed and added files

`AGENTS.md`; `CLAUDE.md`; `SEO.md`; `HANDOVER.md`; `package.json`; `docs/seo-baseline/ahrefs-programme-start-2026-08-09.json`; `scripts/mobile-check.mjs`; `scripts/seo-checks.mjs`; `scripts/shots.mjs`; `scripts/stage3-checks.mjs`; `scripts/verify-urls.mjs`; `src/components/Footer.astro`; `src/components/LocalBusinessSchema.astro`; `src/data/business.ts`; `src/pages/dog-groomers-st-leonards.astro`; `src/pages/index.astro`; `src/pages/services/index.astro`; `src/pages/who-we-are.astro`.

Timestamped `*.backup-20260809-*` recovery copies exist beside every edited pre-existing file. They are deliberately untracked and must be preserved until the candidate is accepted or restored.

### Preserved invariants

- `INDEXABLE` was not changed. The production-mode test build is indexable; ordinary local builds remain deliberately noindexed.
- Existing price, booking, services, pickup windows, one-Hastings-salon model, navigation, review display and hero behaviour remain intact.
- Collection remains £2 per journey / £4 return and only for full groom, hand stripping and bath and brush appointments.
- No `AggregateRating` was added to first-party structured data; no fake reviews, fake locations or mobile-grooming claims were introduced.

### Verification evidence

- `PUBLIC_INDEXABLE=true npm run build`: 16 pages built; production/indexable mode passed.
- `npm run verify-seo -- --indexable`: all 15 canonical pages, titles/descriptions/canonicals/H1/robots, exact sitemap, schema NAP/service areas, St Leonards honesty and retired-claim checks passed.
- `npm run verify-urls`: 19/19 passed. `npm run verify-stage3`: 0 failures.
- `npm run mobile-check`: every canonical page passed at 390px; 11 accepted pre-existing small-source-image warnings only.
- Screenshots visually reviewed at 390, 1024, 1280 and 1440px for homepage, St Leonards, services and who-we-are; no new clipping/overflow/layout regression found. The previously documented phantom root-width signature at 1024–1300 remains outside this SEO patch.
- `hero-resilience`: reduced motion, JS-off, back-nav, play-once viewports and reveal all passed. `hero-mask-support`: WebKit and Chromium passed.
- `price-list-e2e`: filter and all 105 JS/no-JS price rows passed. `git diff --check` and final status/diff review still required after this handover edit.
- Performance: no new Lighthouse run yet; production baseline remains 98/100/100/100 with CLS 0 from the prior 2026-08-09 release. Do not claim a fresh performance result until measured.

### Backlinks — mandatory Phase 1 item at 1 of 2

The required background agent attempted only free, genuine listings and made no unauthorised account or external change.

- Local Dog Groomers explicitly accepts free dog-groomer listing requests without signup. A truthful request was submitted at 15:46 BST through `https://localdoggroomers.co.uk/contact/`, including the current NAP, canonical URL, salon-only positioning and Hastings/St Leonards collection facts. The site returned `Your submission was successful.` This is pending editorial publication and **does not count as a backlink yet**.
- Waggy List is now live at `https://waggylist.co.uk/listing/the-fairy-tails-dog-grooming-2` and is **qualifying new backlink 1 of 2**. An independent public read-back found the correct full NAP, Hastings category/search discovery, a self-canonical `index,follow` profile, correct LocalBusiness JSON-LD and two direct links to `https://fairytailsdoggrooming.co.uk/` with `rel="noopener noreferrer"` only.
- MuddyPup's pre-existing profile at `https://www.muddypup.com/groomer/220d6b5e-ec98-4e7f-a434-28906daebdae` was claimed, corrected and published. It is self-canonical and `index,follow`, links directly to the canonical site with `rel="noopener noreferrer"` only, and now has the correct name, phone, TN34 3SB address data, salon/trust/service facts and collection terms. The retired Fairlight/Barley address, TN35 postcode and old mobile are absent from visible text and HTML. It does **not** count as a new backlink because the link predated this session. Known defect: its embedded OpenStreetMap marker and JSON-LD `geo` still use old coordinates `50.8710632, 0.6299924`, although Google/Apple map links query the correct Mount Pleasant Road address; opening hours are not publicly exposed. No support message was sent because outreach was not authorised.
- The Good Dog Guide has a public correct-NAP listing at `https://www.thegooddogguide.com/east-sussex/hastings/dog-grooming-groomers/the-fairy-tails/30416`, but it contains no external website link. **Superseded route decision 2026-08-10:** do not pursue it for this backlink gate because website-link tiers are paid and outbound links are nofollow.
- **Superseded status 2026-08-10:** FreeIndex now has a completed Fairy Tails profile at `https://www.freeindex.co.uk/profile(the-fairy-tails-dog-grooming)_865530.htm`. It is public with the correct direct followed link/NAP but remains `noindex` pending manual review. Never create a duplicate listing.
- MyPetGroomer has a stale unclaimed 100 Parker Road profile and is a later cleanup fallback, not a completed link.
- Ahrefs comparison confirms Dog Owners Guide (DR 37; about 2,793 UK traffic/901 keywords) and DogPack (DR 48; about 1,764 UK traffic/1,140 keywords) are stronger authenticated fallbacks than generic zero-traffic directories. Both need a real owner account/private authentication, so no account was fabricated. GoodHound, BizBranches and Firmlocator were rejected as too weak, broken or unable to guarantee a useful public link.
- Paw Pages has a citation-integrity defect: Ahrefs reports five live nofollow links to Fairy Tails from profile pages, including unrelated competitor profiles such as The Groom Room Hastings and Pawfect Pooch. Its real Fairy Tails profile and all of those links predate this session. Treat Paw Pages as a cleanup task, not a new backlink source, and correct the mislinked profiles later.

One new link is counted: Waggy List. The corrected MuddyPup citation is valuable but cannot satisfy the new-link quota because its backlink already existed. Local Dog Groomers is still unpublished. Phase 1 remains incomplete at **1 of 2** until one more new public page contains a crawlable, truthful link to the canonical homepage and is independently read back. **Current route decision superseding the original 2026-08-09 handoff:** recheck the existing FreeIndex profile for removal of `noindex`; do not duplicate or resubmit it. The Good Dog Guide is excluded. Dog Owners Guide and DogPack are the next evidence-backed options under separate action-level approval. Never ask Kam to paste passwords or email codes into chat.

### Rollback and production considerations

Rollback before commit is the timestamped backup set plus deletion of the new files listed above; branch baseline is `8602d2d`. If later released, use a normal reverting commit—never rewrite `main`. A release requires separate explicit permission to commit/push/deploy, then live checks of the new URL, robots, sitemap, JSON-LD, booking links and Pages workflow. Request Search Console indexing only after the live read-back succeeds.

## 2026-08-09 — Hero animation v2 (four-dog pack) + homepage reviews changes → LIVE

**Deployed to production at the owner's instruction, explicitly for live bug testing by him.**
Branch `hero-v2-pack-animation` → `main`. All gates green before the push (see below).

### What changed

1. **The hero animation was replaced.** v1 (single scruffy puppy, bow-pop payoff) → v2 (the
   salon's own four dogs, desaturated → full colour behind a right-to-left reveal front, 34 star
   particles arcing from the fairy's wand, 9 landing glints, sheen sweep, 6px proud lift). The
   bow, the 6-star burst and the ground-shadow ellipse are DELETED.
2. **The hero is now FULL-BLEED** (owner decision this session, chosen from three options). The
   stage spans the whole moss band with the copy laid over the composition's empty top-left. It
   was a two-column grid that capped the stage at 594px at every desktop width; it now gets
   775–1682px, so the pack renders 859px wide at 1440×900 instead of 500px.
3. **Homepage Google reviews** (owner asks, this session): the aggregate score block
   (`4.9 ★★★★★ · 63 reviews`) removed; the "Verbatim excerpts… refreshed weekly" caption
   removed; the card grid replaced with a **swipe/arrow carousel**.

### Follow-up the same session: dog 1 replaced (owner)

The handoff's leftmost dog — a wire terrier — read as **cut off**, and measurement confirmed it:
its feet stopped at row 440 while dogs 3 and 4 reach 489/490, i.e. its lower body was cropped in
the original composite. The owner supplied a photo of his beagle (in a Fairy Tails K9 Centre
bandana, matching dogs 3 and 4) to replace it.

- Background removed with **`rembg`** (`isnet-general-use` + alpha matting), trimmed to its alpha
  bbox → `beagle-cut.png`, which lives in the **gitignored handoff assets folder** with the other
  sources. ⚠️ `scripts/hero-assets.mjs` now **throws a hard error if that file is missing** — a
  regeneration without it would silently emit the pack with the old cropped terrier back in, and
  no gate would catch it.
- Sized to the staffie (a beagle is that build) and stood on the back row's ground line, so the
  pack keeps its small→large left-to-right reading. Composited in the SCRIPT, not by hand-editing
  an asset, so it is reproducible.
- ⚠️ **The swap moved the pack's top outline, so `CONTOUR`, `GLINTS` and `ART_L` were re-measured**
  — the old `[127,373]` ended up **47px inside the beagle's head** and `[186,391]`/`[64,379]` landed
  on empty stage, which would have rained stars into thin air and buried others in fur. New set
  verified at a mean 3.6px clearance above the fur. **Any future artwork change means re-measuring
  these three again — they are not portable constants.**

### Owner-visible caveats carried out of this session

- ✅ **RESOLVED later the same day — see §0.** This caveat originally read "the reviews carousel is
  built but the DATA cannot fill it yet": the rotator's `Build Snapshot` node capped the wall at
  four (`.slice(0, 4)`) and truncated every review to 240 chars before committing, so "More"
  expanded a fragment into a slightly longer fragment — a data bug, not a UI bug. It was
  deliberately deferred until the carousel shipped (that workflow commits straight to `main`).
  The owner approved accumulation the same day and the rewrite is live and verified.
- ⚠️ **Google's Places API returns at most FIVE reviews per request** — still true, and now the
  governing constraint on the wall. A one-shot fetch can never fill a scrolling wall like the
  owner's reference image; accumulation over weeks is the only route with the API we own.
  **The owner CONFIRMED the trade-off on 2026-08-09:** once accumulating, we can no longer
  re-verify that an older review still exists on Google, so one he later deletes will linger.
- The footer `ReviewsBadge` still shows "4.9 out of 5" and "From 63+ Google reviews" on EVERY page
  including the homepage. The owner asked only about the homepage review *section*, so the footer
  was deliberately left alone — ask before widening.

### Findings worth keeping (all measured, all in code comments)

- **The v2 artwork has NO matte** — un-matting it is actively wrong (it drives 66% of edge
  channels below zero). Its defect is a baked studio floor + cast shadow at partial alpha, 57% of
  which composites *lighter* than moss. **v1's chroma key would have deleted 47,351px of real
  dog** (dog 2's floor and its own chest are statistically identical). Separation is geometric.
- **The handoff's own coordinates are wrong in three places**: its emission origin and its visible
  wand star both land on fully transparent pixels (~25px from the real wand tip at stage 590,99);
  its reveal sweep leaves a 34px wedge of the right-hand dog in colour at p=0; and its particle
  maths puts 27 of 34 stars off the pack. All corrected.
- **A proven silent-pass hole was closed**: `hero-resilience.mjs` returned `null` for a missing
  layer and `null < 0.05` is TRUE in JS, so *renaming* `[data-before]` made the reduced-motion
  test pass with the layer gone. Absence now returns NaN and fails in both directions.
- **A new gate exists because the old ones could not see the bug**: if the p=0 reveal mask is lost,
  the pack starts in full colour, the whole animation is invisible, and every previous gate stayed
  green. `hero-resilience` now asserts pack chroma at p=0 vs p=1 — verified by injecting the real
  bug: healthy 1.85×, broken 1.01×.
- **Pre-existing, NOT introduced here and NOT fixed**: the homepage reports horizontal overflow at
  1024–1300px viewport widths (`documentElement.scrollWidth` 1123 at 1024px, 1306 at 1280px). Identical
  numbers with and without the new hero. It is the same *phantom* signature as the carousel hit —
  a clipped scroller inflating the root's reported width, with no element actually overflowing —
  and `mobile-check` only renders 390px so no gate sees that band. Worth its own ticket.

### Gates at deploy

`build` clean · `verify-urls` 18/18 · `mobile-check` all pages pass · `hero-resilience` 7/7
(incl. the new reveal assertion) · `hero-mask-support` WebKit + Chromium · Lighthouse on a
`PUBLIC_INDEXABLE=true` local build: **perf 98 / a11y 100 / best-practices 100 / SEO 100, CLS 0**.
Hero weight 49.1KB (v1) → **58,070 bytes shipped** (pack 45,592 + shadow 3,896 + fairy 8,582
= 56.7 KiB). Both viewports eyeballed at 1440 and 390.

## ▶︎ NEXT SESSION STARTS HERE (session closed 2026-08-09)

**The site is LIVE and healthy. The working tree is clean and everything is pushed (`4a6c188`).**
The build and switchover phases are over; this project is in **post-launch monitoring + polish**.

**What changed on 2026-08-09** (full detail in the entry at the top of this file): the reviews
rotator now accumulates and stores full review text (§0 — done and verified); the hero
animation was replaced with **v2 — the four-dog pack, full-bleed across the moss band** — dog 1
was then swapped again for the owner's beagle, and the homepage Google-reviews block lost its
aggregate score and caption and became a carousel. All deployed and live-verified, at the owner's
explicit instruction, **so that he can bug-test it live**. Expect feedback on it next session.

### 0. ✅ DONE — the rotator fix ran and is verified live (was the last thing in flight)

**Nothing is in flight.** The reviews rotator fix ran on 2026-08-09 (owner pressed Execute) and is
proven on production. Execution **407366** (manual, success, 1.2s) → commit **`df5b48d`**
*"Rotate homepage Google reviews (2026-08-09, 4 cards)"* → Pages run 31313210250 green in 36s.

What it changed, measured on the live file:

| review | before | after |
|---|---|---|
| Sharon Terrell | 238 chars, ellipsis | **510 chars, whole** |
| Mollie Taylor | 234 chars, ellipsis | **394 chars, whole** |
| stella dunn | 238 chars, ellipsis | **347 chars, whole** |
| Sarah Griffiths | 201, already whole | 201, unchanged |

Live-verified at 1440px: the card clamps to 91px, **"More" expands it to 273px = the full
scrollHeight**, and the button flips to "Less" with `aria-expanded="true"`. The whole review is
readable. That was the owner's actual complaint and it is fixed.

⚠️ **Better than predicted, for a reason worth knowing.** I expected the wall to DIP to ~2–4 cards,
because the new code drops any carried-over review still ending in an ellipsis (those are old
truncated copies that can never be repaired — Places only ever returns the newest five). It stayed
at 4 because **all four happened to still be inside Google's newest five**, so every one was
refreshed to full text instead of dropped. **Do not read that as "the drop rule never bites"** — it
will, the first time an old review falls out of the newest five before we have seen it whole.

The wall now GROWS: each Monday merges the newest five-star reviews in, deduped, newest first,
capped at 12. Entries carry `firstSeen`. It will sit at 4 until the salon gets a new five-star
review. ⚠️ Accepted trade-off: a review later deleted on Google will linger, because the API only
ever shows us the newest five.

### 1. The deferred checks — do these FIRST (owner deferred them from flip night)

⚠️ **Still outstanding as of 2026-08-09.** The HTTP-level ones were re-run today as the post-deploy
gate and were clean (`verify-urls --live` 18/18; robots.txt still allows and names the sitemap),
but **the GSC and Ahrefs items below were NOT done** — they still need a human with the consoles.

The flip was 2026-08-08 19:02 UTC. The +1h check was done and was clean; **+24h and +48h were
deliberately deferred to this session.** Run them now, in this order:

```bash
npm run verify-urls -- --live          # expect: 18 URLs, 0 failures
curl -sI https://fairytailsdoggrooming.co.uk/ | head -3        # expect 200, Server: GitHub.com
curl -s  https://fairytailsdoggrooming.co.uk/robots.txt        # MUST still allow + name the sitemap
echo | openssl s_client -connect fairytailsdoggrooming.co.uk:443 -servername fairytailsdoggrooming.co.uk 2>/dev/null | openssl x509 -noout -subject -dates
```
- **GSC**: the sitemap read **"Couldn't fetch"** when submitted ~25 min after the flip — that was
  Google's stale crawl state, and it retries by itself. **Check it has since succeeded**; if it is
  still failing 24h+ later, that IS a real problem (the sitemap is provably fetchable, including
  as Googlebot). Then check Coverage for crawl errors and watch `/services-2/` drop out while
  `/services/` is retained.
- **Rankings baseline to compare against**: `docs/seo-baseline/ahrefs-pre-flip-2026-08-08.json`.
  The one commercially valuable term is **"dog groomers hastings" (was position 2, ~22 visits/mo)**.
  Do not read a low DR as cutover damage — DR was already 1.3 before the flip.
- **Housekeeping still outstanding:** delete the "TEST - go-live check" email in
  info@thefairytails.co.uk, and `grooming_enquiries` (`mbWR9tHS4u95s605`) rows **1, 2 and 3** —
  all three are test rows.

### 2. Owner decisions waiting on a ruling (none blocking)

1. **The enquiry form's silent-loss path.** "Grooming Website Enquiry" (`TpQFGJy87KIKGflV`) answers
   the customer `{"ok":true}` **before** it writes the data-table row and sends the email, and has
   no `errorWorkflow`. An SMTP failure therefore shows a real customer "thanks" and loses the
   enquiry with no trace. **This is the top hardening candidate.** Owner asked about it 2026-08-08;
   not yet ruled on.
2. **Blog-post canonical.** `why-dog-grooming-is-important` exists on BOTH this domain and the Main
   Website, currently self-canonical on each. The owner's earlier ruling was "decide at polish" —
   we are now in polish.
3. **The dead `preview` CNAME** (→ fairytails123.github.io, nothing serves it) — leave it (harmless,
   cheap to reinstate a preview later) or delete it?
4. **The vestigial mail records** on this zone (MX ×2 / SPF / DKIM ×3 / DMARC / autodiscover /
   autoconfig — nothing consumes them) — leave or clean up? ⚠️ If cleaning: the `@` TXT set holds
   TWO strings and one of them is the **Google site-verification token** — removing it un-verifies
   the GSC property.
5. **Bluehost.** The domain is registered there and **auto-renew is unconfirmed** — that account
   lapsing takes the whole site down. The owner intends to transfer the domain to Hostinger once
   the transfer lock clears (safe: DNS already lives at Hostinger, so a registrar transfer changes
   nothing as long as the nameservers stay on `*.dns-parking.com`).
6. **`node_modules` junction** — still a real directory inside OneDrive, syncing between two
   machines of different CPU architectures. Unchanged Kam call; must be done on both machines or
   neither.
7. **The six hero judgement calls, the gallery breed alt text, and the who-we-are photo** remain
   open in WEBSITE-PLAN — the owner has been eyeballing and only flagging changes. ⚠️ Note those
   six calls were written for the **v1** hero; re-read them against v2 before treating any as live.
8. **The footer `ReviewsBadge` still shows "4.9 out of 5" and "From 63+ Google reviews" on EVERY
   page, including the homepage** (added 2026-08-09). The owner asked for the aggregate to come off
   the homepage review *section* and it did; the footer was deliberately left alone rather than
   widening the scope. He may want it gone there too — it can keep the "read them on Google" link
   without the numbers. Ask.
9. **Whether the reviews wall may accumulate** — see §0. Needed before the rotator's merge change.

### 3. What NOT to do (the traps that now have teeth)

- **Do not unset `INDEXABLE` or add a noindex to a real page** — it de-indexes the live business
  site via a GREEN deploy. A noindexed *local* build is correct, not a bug.
- **Do not run `npm run harvest`** — disarmed on purpose; it would overwrite the irreplaceable
  archive of the old site. Read its header.
- **Do not call `DNS_deleteDNSRecordsV1` / `DNS_resetDNSRecordsV1`** on this zone — no name/type
  filter; one call can wipe it.
- **Do not cancel the Hostinger "Business Web Hosting" plan** — it holds the rollback AND the Main
  Website as an addon. Earliest WordPress decommission: **T+30 = 2026-09-07**.
- **There is no preview URL.** Don't send the owner one; check locally.

**Added 2026-08-09 — the hero's own traps. Every one of these fails SILENTLY:**

- **Do not change the hero artwork without re-measuring `CONTOUR`, `GLINTS` and `ART_L`** in
  `HeroStage.astro`. They are measured off the pack image, not portable constants. Proven twice in
  one day: the handoff's values put stars 79px in mid-air off one dog's shoulder and 27px inside
  another's back; after dog 1 was swapped, `[127,373]` sat **47px inside the new dog's head** and
  two anchors landed on empty stage. Method and target clearance (~2–4px above the fur) are in the
  comment above the array.
- **Do not "clean up" `src/assets/pages/home/hero-dog.png`.** Nothing imports it, so it ships
  nothing — but it is the ONLY committed copy of the v1 puppy artwork (its source is gitignored).
- **Do not resurrect the bow, the 6-star burst or `.ft-ground-core` from git history.** They belong
  to v1 and exist in neither the v2 handoff nor the v2 artwork.
- **Do not change `.ft-stage { width: 100%; aspect-ratio: 760/620 }`** — index.astro's full-bleed
  hero puts the sizing on the wrapper and depends on the stage filling it. `height:100%` or a
  `max-width` here breaks the hero.
- **Do not raise the `64rem` term in `--ft-stage-h`** unless a higher-resolution pack photo
  arrives. It is an ASSET ceiling: the source is 963px wide, so uncapped a 2560px monitor upscales
  the photograph 47%.
- **Do not judge the hero artwork on a white background.** Both handoffs shipped defects that are
  invisible on white *by construction* and only appear on moss-900 (`#2c3823`). Composite it on the
  band before believing it is clean.
- **Do not re-run `scripts/hero-assets.mjs` on a machine without the gitignored handoff folder.**
  It throws if `beagle-cut.png` is missing — that guard is deliberate, because without it the
  script would silently regenerate the pack with the OLD cropped terrier and no gate would catch it.
- **Do not remove `contain: paint` from `.ft-rev-scroll`** in index.astro. Without it the review
  carousel's off-screen cards inflate `documentElement.scrollWidth` to 1124px at a 390px viewport
  and fail `mobile-check.mjs:93`, even though nothing actually scrolls sideways.
- **Do not hand-edit `src/data/reviews-snapshot.json`** — the n8n rotator owns it and overwrites it.
- **Do not reinstate the homepage's aggregate rating block or the "Verbatim excerpts" caption**
  without asking — both were removed by owner ruling on 2026-08-09. ⚠️ If an aggregate rating is
  ever marked up as `AggregateRating`, it MUST be visible on the page again; nothing in the repo
  emits it today, which is why removing the visible block was safe.

**Known, pre-existing, NOT introduced by the hero work and NOT fixed:** the homepage reports
horizontal overflow at **1024–1300px** viewport widths (`documentElement.scrollWidth` 1123 at
1024px, 1306 at 1280px) — identical with and without the new hero. It is the same *phantom* as the
carousel's (a clipped scroller inflating the root's reported width, with no element actually
overflowing), and `mobile-check` only renders 390px so no gate sees that band. Its own ticket.

## 🎉 2026-08-08 — **THE SWITCHOVER IS DONE. fairytailsdoggrooming.co.uk NOW SERVES THE NEW SITE.**

**Flipped 19:02 UTC, fully secure and verified by 19:17 UTC.** The old WordPress site is no longer
the live site (it is still up and untouched on Hostinger = instant rollback).

**Final live state:** `https://fairytailsdoggrooming.co.uk/` → 200 from `Server: GitHub.com` ·
cert `CN=fairytailsdoggrooming.co.uk`, state **approved**, covering **apex AND www** ·
`https_enforced: true` · http → 301 → https · www → 301 → apex ·
`protected_domain_state: verified` · **`npm run verify-urls --live`: 18 URLs, 0 failures** ·
robots.txt allows + names the sitemap · 0 noindex on all 8 spot-checked pages · canonicals→apex ·
all 3 legacy stubs 200 · 0 occurrences of the retired mobile.

**Zone after the flip = 13 record-sets, exactly as predicted** (12 − ALIAS + A + AAAA):
`@` A×4 185.199.108–111.153 (TTL 300) · `@` AAAA×4 2606:50c0:8000–8003::153 (TTL 300) ·
`www` CNAME → fairytails123.github.io. **Every mail record survived, verified from PUBLIC DNS,
not just the panel:** MX×2, SPF, DKIM×3, DMARC, autodiscover, autoconfig — plus the preview CNAME
and the GitHub challenge TXT. `thefairytails.co.uk` (where the real mailboxes are) untouched.

**ROLLBACK if ever needed:** surgical values in `docs/seo-baseline/dns-pre-flip-2026-08-08.json`.
Blunt fallback snapshot = **`170615272`** (2026-08-08T19:02:06Z, the pre-delete state).

### ⚠️ THE ONE THING THAT WENT WRONG — and the fix, because it will recur

**GitHub Pages would not provision the TLS certificate.** For ~14 minutes after the DNS flip,
`https_certificate.state` stayed `null` while the apex served GitHub's **`CN=*.github.io`**
wildcard — so every visitor on HTTPS got a full-page red
**`ERR_CERT_COMMON_NAME_INVALID` / "Your connection is not private"** interstitial. DNS was
provably correct throughout (all four A records at Google's resolver), so this was purely GitHub
failing to start provisioning.

- ❌ Waiting did not help (20 polls over 10 minutes, state never left `null`).
- ❌ Re-PUTting the SAME cname was a no-op — it does **not** re-trigger provisioning.
- ✅ **REMOVE the custom domain, then RE-ADD it.** `cert_state` went to `approved` within 20s and
  the correct cert was served ~40s later:
  ```
  gh api repos/Fairytails123/groomingwebsite/pages -X PUT -f cname=          # remove
  gh api repos/Fairytails123/groomingwebsite/pages -X PUT -f cname=fairytailsdoggrooming.co.uk
  gh api repos/Fairytails123/groomingwebsite/pages -X PUT -F https_enforced=true   # after approved
  ```
**Lesson: `cert_state: null` for more than ~10 minutes is STUCK, not slow. Don't wait it out —
remove and re-add.** Cost here: ~14 min of scary browser warnings on a live business site.

### ✅ The enquiry path is PROVEN END-TO-END on the live domain (first time ever)

Submitted one marked test through the live webhook at 19:27:55Z. **Execution `396075`, success,
4,252 ms, all 6 of 6 nodes green** — note the duration: the silent spam-drop path runs in ~11 ms,
so this was demonstrably the real path. `Log Enquiry` wrote **row id 3** to `grooming_enquiries`
(`mbWR9tHS4u95s605`) with every field intact, and `Email info@` returned a genuine SMTP
acceptance: `accepted: ["info@thefairytails.co.uk"]`, `rejected: []`,
`response: "250 865eca58-fd96-40fb-8d0b-30b79f25c570"`,
messageId `<33ee0484-e334-dd8d-4ccb-ecb24e3a8f0c@thefairytails.co.uk>`.

**✅ OWNER CONFIRMED (2026-08-08): the email arrived and the contact form works.** So the enquiry
path is proven on every hop — browser → webhook → spam gate → data table → SMTP → **inbox**.
Housekeeping: the "TEST - go-live check" email and `grooming_enquiries` rows 1–3 are all test
data and are safe to delete.

*Method note for next time:* SMTP `250` alone would NOT have been proof — it means the server
accepted the message, not that it is visible in a mailbox. Hostinger's relay logs do **not**
record info@ → info@ internal deliveries (checked both directions; latest logged inbound to info@
was 14:13Z, hours before the test), so the last hop is **unverifiable from tooling** and needs a
human to look in the inbox. Don't report that hop as proven from a 250 alone.

⚠️ **Known silent-loss path, unchanged and still worth fixing:** the workflow answers the browser
`{"ok":true}` BEFORE it writes the row and BEFORE it sends the email, and has no `errorWorkflow`.
So an SMTP failure after the flip means the customer sees "thanks" while the enquiry evaporates.
Not a go-live blocker; it is the top candidate for the next hardening pass.

### Two other things worth knowing next time

1. **Pushing `public/CNAME` does NOT move the Pages custom domain** (this deploy uses
   `actions/deploy-pages`). The domain only moved when set via the API. **Set the Pages custom
   domain BEFORE flipping DNS, not after as the runbook said** — otherwise the apex serves
   GitHub's "Site not found" 404 to real visitors during the gap. Verified by probing Pages with
   `curl --resolve fairytailsdoggrooming.co.uk:80:185.199.108.153` while DNS still pointed at
   WordPress — a free dress rehearsal that cost nothing and caught this.
2. **Pages edge-caches per path for 600s and ignores query strings.** Those pre-flight probes
   cached a 404 for `/` and `/robots.txt`; a `?cb=` cache-buster did **not** bypass it. Both
   cleared exactly on schedule. Probe a path you don't mind poisoning, or probe and then wait.
3. **Hostinger REFUSES to let `ALIAS` and `A` coexist** — the API returns
   `[DNS:4005] ... IN ALIAS must not be used with A on the same name`. So the "half-flipped site"
   split-brain the readiness sweep feared is impossible at this provider; the delete genuinely
   must precede the add, and the provider enforces it.

## 🚀 2026-08-08 — SWITCHOVER SESSION: owner sign-off given, pre-flip items being cleared

**✅ OWNER SIGN-OFF (Kam, 2026-08-08): "Yes — signed off, ship it."** The owner confirmed he has
walked the preview and is happy to go live. This satisfies GO/NO-GO item 1. He also ruled the
flip happens **tonight (Sat 2026-08-08)** rather than the runbook's Tuesday-07:00 slot, having
been shown the trade-off (weekend = lowest traffic + WordPress untouched for a ~10-min rollback,
against thinner weekend support if the Pages cert stalls).

**Pre-flip items completed this session:**
- ✅ **GitHub account-level verified domain — DONE.** `fairytailsdoggrooming.co.uk` now shows
  **Verified** under github.com/settings/pages. TXT `_github-pages-challenge-Fairytails123`
  = `0c2d3332ce660ad000844c10754ace` (TTL 300). This closes the domain-takeover hole: the apex
  can no longer be claimed by another GitHub account if the Pages custom domain is removed.
- ✅ **GSC Domain-property TXT added**: `google-site-verification=4CdrQhCczMtDz9Tu_eOoWq7rBam2P2C0z8MljC__j_I`
  on `@` (TTL 3600), added **alongside** the existing SPF — SPF preserved byte-identical.

### ⚠️ Four corrections to the runbook found BEFORE touching anything

1. **The runbook's email premise is WRONG — and the truth is safer.** It says "Email lives on
   this domain". It does not. **Zero mailboxes exist on `fairytailsdoggrooming.co.uk`.** All five
   Hostinger mailboxes (`dogtraining@`, `info@`, `jadeheselden@`, `kamalsingh@`, `manager@`) are
   on **`thefairytails.co.uk`**, a different zone this flip never touches, and the grooming site
   publishes `info@thefairytails.co.uk` as its contact address. The MX/SPF/DKIM×3/DMARC/
   autodiscover/autoconfig records in the grooming zone are **vestigial — nothing consumes them**.
   So the rollback trigger "ANY email failure" effectively cannot be caused by this flip. The
   records are still preserved byte-for-byte (free to keep; leaves the door open to real mailboxes).
   ⚠️ Side effect worth fixing separately: mail sent to `info@fairytailsdoggrooming.co.uk` today
   goes to a black hole — MX resolves to Hostinger but no mailbox exists to receive it.
2. **🔴 `DNS_deleteDNSRecordsV1` IS NOT SAFE AS THE RUNBOOK USES IT.** Step 3b says "delete ONLY
   name `@`, type `ALIAS`" — but the MCP tool's schema exposes **only a `domain` parameter**;
   there is no name/type filter, despite its description mentioning one. Calling it as written
   risks **deleting the entire zone**, taking MX, SPF and all three DKIM records with it. DO NOT
   CALL IT. Plan instead: apply the validated A/AAAA/www update, re-read the zone, and if the
   `@` ALIAS survives, remove that ONE record in the hPanel UI where it can be seen.
3. **The apex IP change since 07-18 is benign.** Public DNS now returns `2.57.91.149` /
   `88.222.222.87` instead of the recorded `195.200.9.43` / `91.108.103.58`. The **zone record is
   unchanged** — `@` is still `ALIAS → fairytailsdoggrooming.co.uk.cdn.hstgr.net.`; Hostinger's
   CDN simply rotated the IPs behind it. **The documented rollback values are still correct.**
4. **The blunt-rollback snapshot is characterised.** `ROLLBACK_SNAPSHOT_ID = 163366476`
   (2026-07-12). It predates the `preview` CNAME, so a full restore returns `@` ALIAS and `www`
   correctly and preserves every mail record, but **deletes the preview CNAME**. Surgical
   rollback remains preferred. `@` and `www` are both **TTL 300**, so flip and rollback each
   propagate in ~5–10 min.

**Also confirmed pre-flip:** no CAA record (DoH, twice) · dry-run of the GitHub Pages apex
payload returned `Request accepted` · old WordPress site serving 200 · local `main` == `origin/main`
at `5fb2404` · repo Actions var `INDEXABLE` still unset (correct pre-flip).

**⚠️ For the T+30 WordPress decommission — DO NOT cancel the Business Web Hosting plan.**
`fairytailsdoggrooming.co.uk` is the **main** vhost on that plan and **`thefairytails.co.uk` (the
Main Website) is an addon on the SAME plan** (order 1009494758). Cancelling it would take the Main
Website down too. The runbook told us to check this before cancelling anything — now answered.

## ✅ 2026-07-18 — FULL GO-LIVE RECHECK (x64): every machine-checkable gate re-run GREEN

Owner asked "is it all built and good to go live?" — re-proved it end to end instead of
trusting the log. **Build: complete. Deployed preview: correct. What blocks the flip is
unchanged — the owner-side checklist below, not engineering.**

**Local gates (all re-run today):** build 15 pages · verify-urls 18/18 on dist AND
`--preview` over HTTP (the runbook GO/NO-GO line) · verify-stage3 0 · price-list-e2e 0 ·
mobile-check 15/15 (only the 11 accepted low-res warns) · hero-resilience 6/6 ·
hero-mask-support WebKit+Chromium · shots + hero-shots regenerated and EYEBALLED
(home 390+1440 · contact/price-list/gallery/services 390 · hero p00/p85/p100 + phone-done).
**INDEXABLE mechanism proven both ways:** flagged build → 0 noindex, robots allow + sitemap
line; plain rebuild → noindex + `Disallow: /` restored.

**Lighthouse (INDEXABLE build, mobile default, this x64 baseline machine):** home
**94/100/100/100 ×3** (CLS 0.000) · contact 98 · price-list 97 · gallery 99 ·
**/services/ 88–95 over 6 runs, bimodal** — its LCP is a TEXT paragraph waiting on Karla
(TTFB 4ms; render-blocking = only the 9.6KB base CSS): under today's post-gate-suite
contention the font swap lands ~1s late on roughly alternate runs. No content change on that
page since it gated at 95 — treat as environment; re-measure settled before reading it as a
regression (the improvement lever remains font preload, deliberately queued for polish).

**Deployed preview (curl/API):** noindex meta + robots `Disallow: /` + canonicals→apex +
sitemap-index 200 · **0 hits for the retired mobile** · wa.me/441424300668 · deploy green at
HEAD `846f75c` · Pages https_enforced, cname=preview · repo Actions var INDEXABLE **unset**
(correct pre-flip) · DNS: preview CNAME→fairytails123.github.io · apex still Hostinger
(195.200.9.43 / 91.108.103.58) · **no CAA record** — checked via DNS-over-HTTPS; Windows
`Resolve-DnsName` cannot ask for CAA (runbook's command errors — use DoH on flip day).

**Integrations:** JotForm 200 · Stripe 200 (checkout NOT completed) · Google
reviews/writereview/maps 200 **with a browser UA — they 404 to bare curl; don't misread that
on flip day** · n8n "Grooming Website Enquiry" ACTIVE and probed via its own spam gate:
`{ok:true}`, exec 126297 ran 11ms = the silent-drop path, **no row, no email** (last real
E2E stays 07-12 exec 56956) · "Grooming Reviews Rotator" ACTIVE, first scheduled run
Mon 07-20 06:30 · n8n MCP verified → VPS · reviews-snapshot.json valid, 4 excerpts,
rotator contract untouched.

**Harvest re-verified (the runbook's insurance line):** images-index **143/143 present on
disk** · manifest failed:0 · Bruno video 20.6MB in place.

**One change, tooling only — `scripts/hero-shots.mjs` now waits for the dog artwork to
decode before the first frame.** The dog imgs are `loading="lazy"` + `fetchpriority="low"`
(deliberate: decoration must never outrank the H1's font), and headless Chromium's lazy
flush (~2.2s) lands AFTER networkidle+900ms — so p00 deterministically captured an **empty
stage** on this machine. It looks exactly like a broken hero; the live-DOM probe cleared the
site (all layers correctly styled, imgs `complete:false` was the tell, and the CSS
sheen-mask fetch of the same URL at 16ms proved the asset serves instantly). Site untouched.

**Still between here and DNS (all owner/browser-side, unchanged):** owner walkthrough +
explicit OK recorded here · the hero judgement calls + gallery breeds + who-we-are photo ·
GSC Domain property + baseline export · GitHub account-level verified domain · Ahrefs
baseline exports (`docs/seo-baseline/` still holds ONLY dns-pre-flip.json) · Hostinger
mailbox send/receive test on flip morning · then `docs/SWITCHOVER-RUNBOOK.md`.
**Do not flip DNS without the owner.**

**Session close (2026-07-18):** paused here at the owner's request. Recheck commit `18097cd`
plus this close-out pushed (both are docs/gate-script only — site output byte-identical, so
the deploy is a content no-op). Working tree clean, preview server stopped, local dist
rebuilt back to the noindex state, nothing in flight. Also fixed in the close-out:
`docs/SWITCHOVER-RUNBOOK.md`'s CAA check now uses DNS-over-HTTPS — Windows `Resolve-DnsName`
cannot query CAA and the runbook's original command simply errors (verified live today).
**Next session starts at the owner-side list above; the only optional engineering micro-task
queued is a settled-machine Lighthouse re-run of /services/ (bimodal 88–95 under load today,
font-swap on a text LCP, no content change since it gated 95).**

## ✅ CURRENT STATE (2026-07-17, session close) — build + hero DONE, owner actively reviewing

**Everything is on `main` and live on the noindexed preview
(https://preview.fairytailsdoggrooming.co.uk).** The hero animation is merged
(Lighthouse-parity proven on x64: median 99 vs 99), and the owner reviewed the preview the
same day and gave **five rulings, all applied + live + verified** (details in the two entries
below): scroll cue removed · the dog's floor light-pool removed (must blend into the band;
dark contact core stays) · reviews badge out of the hero · the Google-reviews band restyled
to the old widget's white look with More/Less expanders · **WhatsApp runs on the salon line
01424 300668 and the mobile 07842 116216 is retired site-wide** (footer deliberately keeps
two rows — call + WhatsApp, same number; owner confirmed twice).

**What remains is the switchover checklist only** (WEBSITE-PLAN "Ready for switchover" +
`docs/SWITCHOVER-RUNBOOK.md`): the owner's full walkthrough/sign-off (the six hero judgement
calls in WEBSITE-PLAN Open items stand unless overruled — the owner has been eyeballing and
only flagging changes), GSC/Ahrefs baselines + GitHub verified domain (browser session), the
`node_modules` junction decision (Kam call), then the DNS flip — **never without the owner.**

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

**Owner confirmed (same day): the footer's two rows are fine as they are** — "Salon line:
01424 300668" (tel:) above "WhatsApp: 01424 300668" (wa.me). Same number twice is DELIBERATE
(one taps to call, one opens WhatsApp) — do not "deduplicate" it.

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
