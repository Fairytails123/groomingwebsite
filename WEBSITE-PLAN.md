# WEBSITE-PLAN — fairytailsdoggrooming.co.uk rebuild

Master plan. Strategy was: **build the whole site on the noindexed preview → DNS switchover
when roughly finished → polish indefinitely.**

✅ **THE SWITCHOVER IS DONE — 2026-08-08, 19:02 UTC.** `https://fairytailsdoggrooming.co.uk` is
PRODUCTION and serves this Astro site from GitHub Pages, HTTPS-enforced and **indexable**
(`INDEXABLE=true`). It is no longer WordPress and it is no longer a noindexed preview. We are now
in the "polish indefinitely" phase. Old WordPress stays up and untouched on Hostinger as instant
rollback until ≥30 days after the cutover (earliest 2026-09-07) — ⚠️ but do **not** cancel the
Hostinger "Business Web Hosting" plan to achieve that: fairytailsdoggrooming.co.uk is the MAIN
vhost on it and the Main Website `thefairytails.co.uk` is an ADDON on the SAME plan, so cancelling
it kills the Main Website. See `docs/SWITCHOVER-RUNBOOK.md` and HANDOVER.md 2026-08-08.

## Locked spec (owner interview, 2026-07-12)

1. **Stack**: Astro 6 + Tailwind v4, same as the Main Website; GitHub Pages hosting via Actions.
2. **Design**: sister-site branding (countryside editorial: Fraunces/Karla, cream/moss/pine/
   bark/honey + clay) adapted with a grooming-salon personality.
3. **Prices**: the breed-by-breed Full Groom list + `/services/` add-on prices are canonical.
   `/services-2/` was stale → retired with a redirect stub.
4. **Content**: improved/rewritten copy; every fact, price, FAQ, T&C preserved accurately;
   URLs identical to WordPress; owner signed off page by page on the preview (that preview is
   retired — see the switchover note at the top).
5. Contact form → n8n webhook (WPForms replaced). 6. Preview noindexed until cutover
   — ✅ satisfied and now SPENT: the cutover ran 2026-08-08 and production is INDEXABLE
   (`INDEXABLE=true`). **Never re-apply `noindex` or `Disallow: /` to the live site's real
   pages** (the three legacy redirect stubs keep theirs by design).

## URL manifest & build tracker

Source of truth for CI: `scripts/verify-urls.mjs` (flip `planned` → `built` there as pages ship,
and mirror the date here).

| URL | Status | Notes |
|---|---|---|
| `/` | **built** 2026-07-16 | Stage 5 — shipped LAST per the inside-out order |
| `/who-we-are/` | **built** 2026-07-12 | Stage 2 |
| `/contact/` | **built** 2026-07-12 | Stage 2 — form re-proven E2E on the LIVE domain 2026-08-08 (exec `396075`, row id 3, SMTP 250, owner confirmed the inbox) |
| `/terms-and-conditions/` | **built** 2026-07-12 | Stage 2 — legal copy verbatim |
| `/services/` | **built** 2026-07-16 | Stage 3 hub — add-ons/extras from pricing.json; Bruno video self-hosted |
| `/services/full-groom-price-list/` | **built** 2026-07-16 | Stage 3 — 105 rows + breed filter (progressive enhancement) |
| `/services/haircut-lengths/` | **built** 2026-07-16 | Stage 3 — 6 clip lengths w/ rescued photos |
| `/services/teeth-cleaning/` | **built** 2026-07-16 | Stage 3 — emmi-pet |
| `/services/doggy-massage/` | **built** 2026-07-16 | Stage 3 — 4 oils |
| `/services/homeless-dogs/` | **built** 2026-07-16 | Stage 3 |
| `/services/frequently-asked-questions/` | **built** 2026-07-16 | Stage 3 — 15 FAQs, `<details>` |
| `/gallery/` | **built** 2026-07-16 | Stage 4 — 5 before/after pairs (cropped out of the old composites) + 20-photo polaroid grid |
| `/blog/` | **built** 2026-07-16 | Stage 4b — one-post index (featured card + growth-ready grid) |
| `/why-dog-grooming-is-important/` | **built** 2026-07-16 | Stage 4b — ROOT-level slug via content collection; date only, no byline (owner ruling) |
| `/services-2/` → `/services/` | **stub built** 2026-07-12 | public/ meta-refresh+canonical+noindex |
| `/category/blog/` → `/blog/` | **stub built** 2026-07-12 | " |
| `/author/grace/` → `/who-we-are/` | **stub built** 2026-07-12 | " |
| `/feed/` | intentional 404 | Ahrefs backlink baseline captured 2026-08-08 (`docs/seo-baseline/`) — the keep-or-redirect decision is STILL OPEN |

## Build order (inside-out, homepage last — main-site-proven)

- **Stage 1 — Shell + pipeline** ✅ 2026-07-12: Base/Header/Footer/Consent/global.css,
  business.ts, 404, robots endpoint, stub homepage, Pages deploy, preview domain, noindex verified.
- **Stage 2 — Utility** ✅ 2026-07-12: terms-and-conditions, contact (form E2E PASS), who-we-are.
  Owner eyeball pending.
- **Stage 3 — Services cluster** ✅ 2026-07-16 (revenue/SEO core): all 7 pages built. Lighthouse
  95–100 perf / 100 a11y / 100 SEO across the cluster. Gated by `npm run verify-stage3` (static
  facts) + `npm run price-list-e2e` (browser: drives the filter, then re-loads with JS OFF and
  asserts all 105 rows are visible by computed style).
- **Stage 4 — Gallery + blog** ✅ 2026-07-16: gallery ✅ → blog index + the root-level post ✅ (Stage 4b).
- **Stage 5 — Homepage + whole-site pass** ✅ 2026-07-16: hero/teasers/reviews/subscription band
  shipped; whole-site pass run — dist-wide link crawl (82 internal URLs, 0 broken), sitemap
  sanity (14 canonical trailing-slash entries), full mobile-check 15/15, full verify-urls.
- **Homepage hero animation (v1)** ✅ 2026-07-17 — **SUPERSEDED 2026-08-09, see the next entry**:
  the scroll-scrubbed grooming transformation
  (desktop scrubs a 240vh sticky track; phone plays once when seen) merged to `main` after a
  full gate re-run on BOTH machines and a same-machine Lighthouse parity proof on x64
  (`main` median 99 vs `hero-animation` median 99, LCP 2.0→2.1s — the animation costs
  ~nothing). Judgement calls queued for the owner in Open items below.
- **Homepage hero animation v2 — REPLACED v1** ✅ 2026-08-09 (`b13b682`, `4a6c188`): the salon's
  own four dogs go desaturated → full colour behind a right-to-left reveal front (34 star
  particles, 9 landing glints, sheen sweep, 6px proud lift). The bow, the 6-star burst and
  `.ft-ground-core` are DELETED; the contact shadow is now an alpha-only stencil painted by CSS.
  The hero is **FULL-BLEED** (owner decision) — the stage spans the moss band with the copy
  overlaid on its naturally empty top-left, sized by `--ft-stage-h`; it was a two-column grid
  capping the stage at 594px and now gets 775–1682px. Dog 1 was swapped the same day for the
  owner's beagle (`beagle-cut.png`, rembg, composited in `hero-assets.mjs`, which now THROWS if
  that file is missing). Homepage reviews the same day: aggregate score block and caption removed,
  grid → carousel. Gates green (`hero-resilience` 7 assertions incl. a new reveal test; Lighthouse
  98/100/100/100, CLS 0); deployed live at the owner's instruction for his own bug testing.
  Full detail: HANDOVER 2026-08-09.
- **Switchover — DNS cutover to production** ✅ 2026-08-08: `fairytailsdoggrooming.co.uk` moved
  from WordPress to GitHub Pages at 19:02 UTC and was fully secure and verified by 19:17 UTC —
  cert `CN=fairytailsdoggrooming.co.uk` approved (apex AND www), `https_enforced`,
  http→301→https, www→301→apex, `protected_domain_state: verified`, `INDEXABLE=true`,
  `npm run verify-urls -- --live` 18 URLs / 0 failures, 0 noindex on real pages, canonicals→apex,
  all 3 legacy stubs 200. Zone = 13 record-sets; every mail record survived (verified from public
  DNS). Full account + the three runbook corrections learned by doing: HANDOVER.md 2026-08-08.

Per-page definition of done = the 6 quality gates in CLAUDE.md.

## "Ready for switchover" gate — ✅ **PASSED 2026-08-08 (kept as the historical record)**

**Outcome: the owner signed off ("Yes — signed off, ship it", 2026-08-08) and the flip ran the
same evening.** The boxes below are frozen as they stood at flip time; anything still `[ ]` did
not block the flip and has moved to the Polish backlog at the end of this file.

- [x] 15/15 pages `built` ✅ 2026-07-16 — the build is COMPLETE; `npm run verify-urls` 0 failures
- [x] Per-page fact diff vs harvest signed off (prices, phones, hours, T&Cs verbatim)
      ✅ closed 2026-08-08 by the owner's walkthrough sign-off, NOT by a line-by-line re-diff;
      `npm run verify-stage3` + `npm run price-list-e2e` remain the standing automated guard.
- [x] Breed table rows == 105 (47+10+48) vs harvest; 10-breed spot check re-run; add-ons correct
      — automated in `npm run verify-stage3`, which asserts it against the RENDERED table
- [x] 15 FAQs · 6 clip lengths · gallery = **5 before/after pairs + 20 photos** (the old
      "~25 gallery pairs" estimate in this doc was wrong — the real page was a 5-slide carousel
      plus a 20-photo tiled grid)
- [x] **`npm run verify-stage3` + `npm run price-list-e2e` green** (the second needs
      `npx astro preview` running) — these encode the 2026-07-16 owner rulings and the
      no-JS/crawler contract on the price list; a regression here is a silent revenue bug.
      Re-verified 2026-07-18 (full go-live recheck, x64): both 0 failures.
- [ ] Yoast titles/descriptions carried or deliberately improved (logged below)
      ⏳ Did not block the flip — **carried to the Polish backlog**. Known outstanding case: the
      /who-we-are/ doubled site-name title (see the 2026-07-12 copy-log entry).
- [x] Integrations clicked through: JotForm opens · Stripe loads (NEVER complete)
      · EnquiryForm→n8n→email E2E · WhatsApp/tel/reviews links · GTM only after consent
      *(2026-07-18 probe pass: JotForm 200 · Stripe 200 · Google reviews/maps links 200
      (browser UA — they 404 to bare curl, don't misread) · webhook live, spam gate proven
      (exec 126297: 11ms silent drop, no row/email) · consent-default precedes gtm.js in the
      HTML · wa.me/441424300668 site-wide.)*
      ✅ **Closed 2026-08-08 on the LIVE apex.** The human click-through is the owner's own
      walkthrough + sign-off ("Yes — signed off, ship it", HANDOVER.md); the preview URL is no
      longer served by Pages (404 — its DNS CNAME survives in the zone, but never test against
      it). The enquiry path is proven on every hop: n8n execution `396075`, success, 6/6 nodes,
      `grooming_enquiries` row id 3, SMTP `250` to info@thefairytails.co.uk, and the **owner
      confirmed the email arrived in the inbox**.
      ⚠️ Still-open hardening (was not a blocker): the workflow answers `{"ok":true}` BEFORE it
      writes the row and sends the email, and has no `errorWorkflow` — an SMTP failure would show
      the customer "thanks" while the enquiry evaporates. Top candidate for the next pass.
- [ ] Lighthouse ≥90 ×3 on every page · 1440/390 sweeps · reduced-motion sweep
      *(2026-07-18 x64 recheck: home 94/100/100/100 ×3 CLS 0 · contact 98 · price-list 97 ·
      gallery 99 · /services/ 88–95 bimodal over 6 runs — text-LCP font-swap race under
      post-gate-suite load, no content change since it gated 95; re-measure settled.)*
      ⚠️ **The `home` figure predates hero v2 (2026-08-09) and is no longer the baseline** — the
      full-bleed four-dog hero measured **98/100/100/100 with CLS 0**. Compare against that, not 94.
      ⏳ Not fully settled at flip time and deliberately not a blocker — **carried to the Polish
      backlog**, and now measurable against the LIVE apex rather than a local
      `PUBLIC_INDEXABLE=true` build, since production is indexable.
- [x] Sitemap = apex trailing-slash URLs; canonicals → apex; preview still noindex (curl)
      ✅ 2026-07-18: sitemap = the 14 apex URLs · canonical sweep all-apex (stub doubles are
      their targets, by design) · preview noindex meta + robots `Disallow: /` curl-verified.
      🔴 **The noindex half of this item INVERTED at go-live (2026-08-08) — never re-run it
      against production.** The live apex is INDEXABLE (repo Actions var `INDEXABLE=true`):
      robots.txt serves `User-agent: *` / `Disallow:` (empty) plus
      `Sitemap: https://fairytailsdoggrooming.co.uk/sitemap-index.xml`, and none of the 14
      sitemap pages carries a robots meta. Finding no noindex there is CORRECT, not a
      regression — re-introducing one would deindex the business.
      ⚠️ The three redirect stubs (`/services-2/`, `/category/blog/`, `/author/grace/`) DO
      still serve `<meta name="robots" content="noindex">`, deliberately, per the table above
      — that is not a leftover; never strip it. The sitemap/canonical half of this item is
      unchanged and still true.
- [x] **Owner walkthrough of the preview URL + explicit OK recorded in HANDOVER.md**
      ✅ 2026-08-08 — Kam: *"Yes — signed off, ship it."* Recorded in HANDOVER.md. He also ruled
      the flip happen that night rather than the runbook's Tuesday-07:00 slot.

~~Then execute `docs/SWITCHOVER-RUNBOOK.md`.~~ ✅ **EXECUTED 2026-08-08.**

**Live state since 19:02 UTC that day:** `https://fairytailsdoggrooming.co.uk` serves this site
from GitHub Pages — cert `CN=fairytailsdoggrooming.co.uk` approved (apex **and** www),
`https_enforced`, http→301→https, www→301→apex, `protected_domain_state: verified`,
`INDEXABLE=true`, `public/CNAME` = the apex, `npm run verify-urls -- --live` 18 URLs / 0 failures,
GSC `sc-domain` property verified with the sitemap submitted.

⚠️ **`preview.fairytailsdoggrooming.co.uk` is NO LONGER a preview.** Its CNAME still sits in the
DNS zone but Pages does not serve it (404) — the apex is the only live URL, and every push to
`main` deploys straight to production. (`npx astro preview`, the LOCAL dev server the gates run
against, is a completely different thing and is unaffected.)

🔴 **Never call `DNS_deleteDNSRecordsV1` or `DNS_resetDNSRecordsV1` on this zone.** The MCP
schema exposes only `{domain}` — no name, no type, despite its description claiming filters — so
it can delete the ENTIRE zone (MX×2, SPF + the GSC token, DKIM×3, DMARC, autodiscover,
autoconfig, the GitHub challenge TXT). Delete individual records in the Hostinger hPanel UI.

The runbook's remaining live sections are **post-flip monitoring** and **WordPress decommission
(earliest T+30 = 2026-09-07)** — plus the three corrections learned by doing (the stuck TLS cert,
`public/CNAME` NOT moving the Pages custom domain, the 600s per-path edge cache).

## Integration inventory

| What | Value |
|---|---|
| Booking (primary CTA) | JotForm `251190647924057` — pci.jotform.com (Acuity is DEAD) |
| Subscription | Stripe `buy.stripe.com/8x27sM5K57BR1IL94W9MY00` — £25/mo/dog, 2-mo min |
| Enquiry form | n8n `grooming-enquiry` (wf `TpQFGJy87KIKGflV`, table `mbWR9tHS4u95s605`) — emails **info@thefairytails.co.uk**; proven E2E on the LIVE domain 2026-08-08 (exec `396075`, row id 3, SMTP 250, owner confirmed the inbox) |
| Reviews | Google place `ChIJV3P8-VAb30cRHoBgRmxCYIM` — 4.9★/63 (snapshot 2026-07-12) |
| WhatsApp | wa.me/441424300668 — the salon line (owner ruling 2026-07-17; mobile 07842 116216 retired site-wide) |
| Analytics | GTM `GTM-W93L9XK5`, Consent Mode v2 default-denied |
| Email | ⚠️ **ZERO mailboxes exist on fairytailsdoggrooming.co.uk.** All five Hostinger mailboxes (`dogtraining@`, `info@`, `jadeheselden@`, `kamalsingh@`, `manager@`) are on **`thefairytails.co.uk`**, a different zone; the site publishes `info@thefairytails.co.uk`. This zone's MX×2/SPF/DKIM×3/DMARC/autodiscover/autoconfig are **VESTIGIAL — nothing consumes them** (owner ruling 2026-08-08: no mailbox is wanted here). ⚠️ The `@` TXT set holds TWO separate strings — the SPF record **and** the Google site-verification token — so never overwrite one with the other. |
| Live hosting | GitHub Pages on the apex `fairytailsdoggrooming.co.uk` (repo `Fairytails123/groomingwebsite`; every push to `main` deploys to PRODUCTION). ⚠️ The Pages custom domain moves only via `gh api repos/Fairytails123/groomingwebsite/pages -X PUT -f cname=…` (or GitHub Settings → Pages) — pushing `public/CNAME` does **not** move it. Domain registered at **Bluehost**, nameservers at **Hostinger**. |

## Open items

> **Carried forward from the 2026-08-08 go-live session at the owner's instruction.** None of
> these blocked the launch; all still need a ruling. The same list, with more context, is in
> HANDOVER.md's "NEXT SESSION STARTS HERE" block.

- [ ] 🔧 **HARDEN THE ENQUIRY FORM'S SILENT-LOSS PATH — top candidate.** The n8n workflow
      "Grooming Website Enquiry" (`TpQFGJy87KIKGflV`) responds `{"ok":true}` to the browser
      **before** it writes the `grooming_enquiries` row and **before** it sends the email, and it
      has no `errorWorkflow`. So an SMTP or data-table failure shows a real customer "Thanks,
      we'll be in touch" while the enquiry vanishes with no trace and no alert. Proven working
      end-to-end on 2026-08-08 (exec 396075, owner confirmed the email arrived) — but that proves
      the happy path only. Fix = move "Respond OK" after the write+email, and/or attach an error
      workflow. **Needs the owner's go-ahead because it changes live customer-facing behaviour.**
- [ ] **Blog-post canonical, now due.** `why-dog-grooming-is-important` exists on BOTH this domain
      and the Main Website (`thefairytails.co.uk`), currently self-canonical on each. The owner's
      ruling was "decide at polish" — the switchover is done, so we ARE in polish. Pick which URL
      is canonical.
- [ ] **The dead `preview` CNAME.** `preview.fairytailsdoggrooming.co.uk` → `fairytails123.github.io`
      is still in the DNS zone, but Pages serves the apex now so nothing answers it (404). Leave it
      (harmless, points at an account we control, cheap to reinstate a preview later) or delete it?
- [ ] **The vestigial mail records on this zone.** MX ×2 / SPF / DKIM ×3 / DMARC / autodiscover /
      autoconfig exist but **nothing consumes them** — there are zero mailboxes on this domain and
      the owner has ruled none is wanted. Leave indefinitely, or clean up?
      ⚠️ **If cleaning:** the `@` TXT set holds TWO strings and one is the
      **google-site-verification token** — deleting it un-verifies the GSC Domain property. SPF is
      also worth keeping purely to stop anyone spoofing mail as this domain.
- [ ] **Bluehost: confirm auto-renew, then transfer.** The domain is REGISTERED at Bluehost (only
      its nameservers point at Hostinger, which serves the zone) — so **that account lapsing takes
      the whole site down**, and auto-renew is unconfirmed. The owner intends to transfer the
      domain to Hostinger once the transfer lock clears; that is safe, because DNS already lives
      at Hostinger and a registrar transfer changes nothing so long as the nameservers stay on
      `*.dns-parking.com`. ⚠️ **Bluehost's DNS tab is a decoy — never edit records there.**
- [ ] **T+30 WordPress decommission — earliest 2026-09-07.** The old site is the rollback until
      then. ⚠️ When it does go: **delete the WordPress website only — do NOT cancel the Hostinger
      "Business Web Hosting" plan.** This domain is the plan's MAIN vhost and the Main Website
      `thefairytails.co.uk` is an ADDON on the same order (1009494758), so cancelling the plan
      would take the Main Website down too. Procedure: the runbook's decommission section.
- [ ] **`node_modules` junction** — unchanged Kam call. It is still a real directory inside
      OneDrive, so deps sync between two machines of different CPU architectures. Restoring the
      junction must be done on BOTH machines or neither.

- [x] ~~**WhatsApp number**~~ — RESOLVED 2026-07-17, owner interviewed: WhatsApp is attached
      to the **salon line 01424 300668** (wa.me/441424300668 everywhere) and the old mobile
      **07842 116216 is retired from the site entirely** (FAQ cancellation + catch-all numbers
      now the salon line; enquiry-form strings interpolate from business.ts). Footer keeps two
      rows (call + WhatsApp, same number) — owner confirmed, deliberate. ⚠ The harvest still
      carries the mobile; never copy it back.
- [x] ~~**Homepage Google-reviews block style**~~ — RESOLVED 2026-07-17, owner supplied the
      old widget's screenshot as the target: white band, avatar/name/gold-star cards, text
      clamped with More/Less expanders, G-logo link. Shipped same day; content contract with
      the n8n rotator unchanged (`reviews-snapshot.json`, verbatim excerpts).
      ⚠️ **AMENDED 2026-08-09 (owner rulings):** the aggregate score block (`4.9 ★★★★★ · 63
      reviews`) and the "Verbatim excerpts … refreshed weekly" caption were **REMOVED**, and the
      4-column grid became a **scroll-snap carousel with prev/next arrows**. The white cards,
      avatar/name/gold stars, More/Less expanders and rotator contract are unchanged. **Do not
      reinstate the aggregate block or the caption without asking.** If an `AggregateRating` is
      ever marked up, the rating MUST become visible on the page again (nothing in the repo emits
      it today — which is why removing the block was safe). The footer `ReviewsBadge` still shows
      "4.9 out of 5" / "From 63+ Google reviews" on every page — deliberately left alone; ask
      before widening. ⚠️ NOT changed: the rotator still caps at 4 and truncates to 240 chars, so
      "More" expands a fragment. Deliberately deferred — that workflow commits straight to `main`.
- [ ] **HERO ANIMATION JUDGEMENT CALLS NEED THE OWNER'S EYE** (on the preview homepage from
      2026-07-17 and on the LIVE homepage `https://fairytailsdoggrooming.co.uk/` since
      2026-08-08 — phone AND desktop). **Feedback round 1 applied 2026-07-17 (`efb9122`):
      the "Scroll to see the transformation" caption and the warm floor light-pool behind the
      dogs are removed — owner ruled the dogs must blend seamlessly into the band, nothing may
      highlight them off the page.** ⚠️ **THE SIX CALLS BELOW WERE WRITTEN FOR v1 AND FOUR NO LONGER EXIST.**
      The hero was replaced 2026-08-09 (v2, the four-dog pack); the bow, the 6-star burst and
      `.ft-ground-core` were DELETED. **Dead — do NOT resurrect them to satisfy a ruling:** the
      moss bow · the retoned red topknot band · the redrawn bow · the enlarged burst stars.
      **Still live and still open:** the wand-star position (re-derived on the v2 artwork to stage
      590,99 — the handoff's 606,138 lands on a transparent pixel) and the 240vh desktop track with
      no scroll-jack below lg.
      **New v2 calls that DO need his eye:** the full-bleed hero band with the copy overlaid; the
      beagle as dog 1; the scroll-snap reviews carousel; the removal of the aggregate rating block.
      ⚠️ Overruling is NOT "a small isolated edit" any more: `CONTOUR`, `GLINTS` and `ART_L` are
      MEASURED against the current artwork and must be re-measured if the pack changes.
- [ ] 🐛 **HOMEPAGE SCROLLS SIDEWAYS BETWEEN ~1024px AND ~1300px.**
      `documentElement.scrollWidth` = 1123 at a 1024px viewport, 1306 at 1280px.
      **PRE-EXISTING — not caused by hero v2, and deliberately NOT fixed in that pass** (identical
      numbers with and without the new hero). Same *phantom* signature as the reviews carousel's
      (a clipped scroller inflating the root's reported width, with nothing actually overflowing).
      ⚠️ **No gate sees it:** `mobile-check` renders only 390px and the quality gates' desktop
      check is 1440px — the bug lives exactly in the gap between the two widths we look at. Fix,
      then widen the gate to assert `scrollWidth <= innerWidth` at 1024 and 1280 too.
      Found 2026-08-09.
- [ ] **Decide the fate of `src/assets/pages/home/hero-dog.png`** (775KB, the v1 single puppy).
      Nothing imports it since hero v2, so it ships nothing — but `scripts/hero-assets.mjs` still
      re-emits it, and it is the only COMMITTED copy of that artwork (its source is gitignored).
      Either keep both (current state, deliberate) or delete the asset AND the script block
      together. ⚠️ Do NOT delete `beagle-cut.png` or anything else in the gitignored handoff
      folder — `hero-assets.mjs` throws without it and git cannot restore it.
- [x] ~~🔴 **THE LIVE BOOKING FORM SELLS A SERVICE THE SITE SAYS WE DON'T OFFER.**~~ —
      **RESOLVED 2026-07-16 (evening), owner ruling: the FORM was right.** Bath & Brush pick-ups
      **are offered, at the same £2 per journey**. All three site claims of the old restriction
      updated (T&Cs, /services/, FAQ), `bathBrushTidy.note` + `pickup.note` regenerated via
      `extract-prices.mjs`, and the retired wording added to `stage3-checks.mjs`'s banned list so
      it cannot creep back. See the copy log entry below.
- [x] ~~**Does the £2 per journey apply to a bus Bath & Brush too?**~~ — YES, same ruling: same
      rate, £2 per journey / £4 round trip.
- [x] ~~**Pickup price wording**~~ — RESOLVED 2026-07-16, see the copy log below.
- [x] ~~**"From £25" sets an expectation the price list can't meet.**~~ — RESOLVED 2026-07-16
      (evening interview): **owner ruled KEEP "From £25" as is.** It's accurate (five real £25
      de-shed rows) and the price list is a click away. The value now interpolates from
      `pricing.fullGroom.from` everywhere it appears (home meta, gallery CTA, services pages).
- [x] ~~**Puppy groom £25 exists ONLY in the FAQ**~~ — RESOLVED 2026-07-16 (evening interview):
      **stale offer, REMOVED.** The FAQ now says a puppy's first proper groom books as a normal
      full groom, priced by breed. The free puppy introduction stays. (FAQ ruling #5.)
- [x] ~~**/who-we-are/ "day school" vs "day care"**~~ — RESOLVED 2026-07-16 (evening interview):
      **both are real and different things.** The line now reads "training, day school and
      daycare", matching the K9 Centre site's own naming (Dog Day School is its flagship named
      service; daycare is distinct). Dropping the dead Adventure Dog shop stands.
- [x] ~~**`/blog/` 404s from the footer**~~ — RESOLVED 2026-07-16: `/blog/` and the root-level
      post are built; the footer link and the `/category/blog/` stub now land on a real page.
- [ ] **BREEDS ON /gallery/ NEED THE OWNER'S EYE.** Owner ruling 2026-07-16 was "use breeds, no
      names", accepting the risk that a guess could be wrong. Breeds are asserted in alt text ONLY
      where unmistakable; where it was a judgement call the alt text describes the coat instead.
      Asserted: Labradoodle (01), Cockapoo (03, 11, 18, 19), Poodle (05, 09), Shih Tzu (06, 20),
      Cocker Spaniel (07), Dachshund (08), French Bulldog (10), Jack Russell (12), Chihuahua ×2 (15),
      Bichon Frise (16), Afghan Hound (17). Deliberately NOT named: 02 ("wire-coated white terrier"),
      04 ("small white dog"), 13 ("long-coated tan and black collie"), 14 ("black and white
      short-coated dog"). Pairs: Cockapoo, wire-coated terrier, Poodle, collie, Afghan Hound.
      A wrong breed on a groomer's own site is embarrassing — please correct any.
- [ ] **Gallery photo resolution is capped by the source and cannot be improved.** The 5 before/after
      crops are only 242–309px (each was a ~400px photo inside a 1200×600 composite) and the grid
      photos are 480×480 originals. Display slots are deliberately small to stay sharp; `mobile-check`
      warns on 4 of them. Only new photography fixes this.
- [x] ~~GitHub **account-level verified domain**~~ — DONE 2026-08-08 via the GitHub web UI:
      fairytailsdoggrooming.co.uk shows **Verified** under github.com/settings/pages
      (TXT `_github-pages-challenge-Fairytails123` — still in the zone, never delete it), and the
      repo reports `protected_domain_state: verified`. Closes the domain-takeover hole.
- [x] ~~**GSC Domain property** + DNS TXT verification~~ — DONE 2026-08-08: the `sc-domain:`
      property for fairytailsdoggrooming.co.uk is **verified** (its
      `google-site-verification=…` TXT sits on `@` **alongside** SPF — SPF preserved
      byte-identical; never overwrite one with the other) and
      `https://fairytailsdoggrooming.co.uk/sitemap-index.xml` is **submitted**. ⚠️ A
      "Couldn't fetch" reading right after submission is Google's stale crawl state, not a fault —
      it retries. ⏳ Still open: ongoing performance baselining — note a freshly verified property
      starts with NO history, so the pre-flip organic picture is the Ahrefs export below, not a
      16-month GSC export.
- [x] ~~**Ahrefs baseline**~~ — CAPTURED PRE-FLIP 2026-08-08 →
      `docs/seo-baseline/ahrefs-pre-flip-2026-08-08.json`: DR 1.3, 183 live backlinks from 144
      referring domains, 5 organic keywords, ~51 organic visits/mo. The entire organic footprint
      was three URLs that all exist on the new site, so cutover risk was LOW; the backlink profile
      is almost entirely SEO spam, the only genuine dofollow referrer being design-matters.co.uk.
      ⚠️ **The old "API plan-blocked, web UI only" note was WRONG — the Ahrefs claude.ai MCP
      connector WORKS.** Use it rather than the web UI. ⏳ Still open: decide the `/feed/` +
      wp-content stub questions from that backlink report.
- [x] ~~Identify the external .co.uk registrar~~ — IDENTIFIED 2026-08-08: the domain is
      **registered at BLUEHOST** (renewal is billed there), but its **nameservers point to
      HOSTINGER** (`aster`/`helios.dns-parking.com`), which serves the live zone.
      🔴 **Bluehost's DNS tab is a DECOY — records edited there do nothing.** The only Bluehost
      setting that matters is the nameservers; every record edit belongs in Hostinger hPanel.
      ⏳ Still open: confirm auto-renew at Bluehost, and the owner's plan to transfer the domain
      to Hostinger once the transfer lock clears.
- [ ] The blog post exists on BOTH this domain and the Main Website — **owner confirmed
      2026-07-16: decide at polish.** Both copies ship self-canonical (exactly the old status
      quo). Note for the polish session: the Main Website's Base.astro computes canonicals
      generically — pointing its copy here needs a small per-post override prop there.
- [ ] Favicon .ico variant (PNG set shipped; .ico optional).
- [ ] /who-we-are/ photo: the old page's `Fairy-Tails.jpg` looks like the K9 Centre BARN, not
      the town salon — owner to confirm or supply a salon photo (alt text kept neutral meanwhile).
- [ ] ⚑ **Homepage choices made while the owner was away (2026-07-16 evening)** — eyeball and
      overrule freely: (a) hero polaroids = gallery dogs 01/16/19/17; (b) door-to-door photo =
      gallery dog-06 (Shih Tzu in bandana) because `pickup.jpg` is a map naming out-of-area
      towns; (c) ~~review excerpts dropped~~ → owner ruled them BACK IN (evening interview): a
      "Fresh from Google" block now renders 4 five-star excerpts from
      `src/data/reviews-snapshot.json`; (d) testimonial dog photos reused from the old homepage;
      (e) homepage share image = the /services/ group-of-dogs photo (the old one was a banned
      bubble composite).
- [x] ~~🔑 **WEEKLY REVIEW ROTATION**~~ — **LIVE 2026-07-16 (late night), end-to-end verified.**
      n8n "Grooming Reviews Rotator" (`sXavTjxM4hzZ8bTo`, Mon 06:30) fetches the newest reviews,
      keeps 4 five-star excerpts, commits `src/data/reviews-snapshot.json` only on change →
      Pages auto-deploys. First real rotation committed `2aff342` the same night — the homepage
      now shows reviews from that week. Credentials vaulted in `_SECRETS` (google-services.md,
      github.md); full state + the declined-card debugging story in HANDOVER.
- [ ] ⚑ **Replace `services/pickup.jpg`** (map naming Bexhill/Battle/Rye — not served) with a
      Hastings-centred map or a van/collection photo, at polish.

## Deliberate copy/SEO changes log

(Record every intentional deviation from the harvested Yoast titles/descriptions/copy here.)

- 2026-07-12 T&Cs: two unambiguous typo fixes only — "Dogs will be not be groomed" → "will not
  be"; "pet's need physical maintenance" → "pets need". Everything else verbatim.
- 2026-07-12 /contact/ meta description: old Yoast description referenced "near the Milking
  Parlour in Barley Lane" — that's the K9 CENTRE address, not the salon. Rewritten around
  15 Mount Pleasant Road + phone. (Old value preserved in grooming-image-archive/contact/meta.json.)
- 2026-07-12 /who-we-are/: copy tightened per locked spec (all facts kept); old title
  "The Fairy Tails Dog Grooming - The Fairy Tails Dog Grooming" kept as-is for now — candidate
  for improvement at polish (it's a doubled site-name, weak SEO).

### 2026-07-16 — /gallery/ (Stage 4)

1. **Carousel → grid.** The old page was a Smart Slider carousel of 5 before/after slides. A
   carousel shows 1 of 5 to anything that doesn't click, crawlers included, and these photos are the
   most persuasive content the business has. All 25 images now render in the HTML at t=0.
2. **The 5 before/after composites were cropped apart** (owner ruling): each was 1200×600 with the
   OLD brand baked into the pixels — cyan/blue background, soap bubbles, tilted white polaroid
   frames. `npm run gallery-crop` recovers the 10 bare photos and the page reframes them as
   Before | After pairs in the countryside system. Read that script's header before touching a crop:
   the bubbles are drawn OVER the photos, so some crops are deliberately asymmetric.
3. **Alt text names breeds only where unmistakable** — see the open item above for the full list and
   the four deliberately left unnamed.
4. ⚠️ **The harvest had MISSED all 5 before/after images.** They are referenced with
   protocol-relative URLs (`src="//host/…"`) and a CSS `background-image`, and `extractImageUrls`
   only matched `https?://` (protocol-relative was handled for `srcset` only). The harvest reported
   "failed: 0" while silently skipping them. Rescued at 1200×600 on 2026-07-16 and
   `scripts/harvest.mjs` fixed. Same near-miss class as the Bruno video.

### 2026-07-16 (evening, after the owner interview) — four rulings applied post-build

1. **"From £25" kept as is** (owner ruling) — now interpolated from `pricing.fullGroom.from`
   wherever it appears, never typed.
2. **£25 puppy groom REMOVED from the FAQ** (owner ruling: stale). The answer now points a
   puppy's first proper groom at the breed-priced full groom. Free puppy introduction unchanged.
3. **/who-we-are/: "training, day school and daycare"** (owner ruling: both are real, different
   things). Matches the K9 Centre site's own service naming.
4. **Homepage gains a "Fresh from Google" block** (owner ruling: excerpts back, rotated weekly).
   4 five-star excerpts render from `src/data/reviews-snapshot.json` (seeded from the 2026-07-12
   harvest of the old live widget — verbatim contiguous fragments, ellipses mark truncation).
   Weekly rotation via n8n is designed but blocked on two owner-created credentials (see the 🔑
   open item).

### 2026-07-16 (evening) — Stage 5: / (homepage), shipped last per the inside-out order

Section copy is verbatim from `grooming-image-archive/home/copy.md` except these logged
deviations (owner away from desk — decisions flagged ⚑ below are noted in Open items for review):

1. **The "Door-to-door service" section is rebuilt on the ruled facts.** The old body promised
   pick-up "at no extra cost" (banned wording). Its first sentence is kept verbatim; the facts
   now render from `pricing.json` `pickup` — £2/journey, £4 round trip, Hastings and St Leonards,
   full grooms + hand stripping + bath & brush (the evening ruling) — with a link to the FAQ
   windows.
2. **The 2-slide hero carousel → a static hero**, same three lines of copy ("Hastings Dog
   Groomers" / "Caring for your best friend" / "Dog Grooming to suit your needs", extended with
   the breed-pricing + Hastings facts). The old carousel showed the SAME slide twice — nothing
   is lost.
3. **The live Google-reviews widget is not carried over.** Static replacement: ReviewsBadge
   (4.9★/63 snapshot from business.ts) + a link out to the live Google reviews. ⚑ The widget's
   4 review excerpts (Mollie Taylor, Deborah-Marie Aldred, Samantha Lake, Tonita Shale) are NOT
   reproduced — a static copy of live reviews goes stale and reproduces third-party text. Owner
   may want a refreshed excerpt block at polish.
4. **The three site-authored testimonials are verbatim** (Sarah/Kadi/Laura, Hastings), with
   their real dog photos from the old page (Reg & Ter = Sarah's, Boo = Kadi's, Hugo = Laura's —
   association verified in the old markup).
5. **The "Review us" section (Facebook/Google buttons) is folded into** the reviews link under
   the testimonials + the footer's existing socials/review links — not a separate section.
6. **Old-brand imagery not carried**: the bubble composites, the 200px bubble service thumbs and
   the stock "dog on iPad" photo. Cards reuse the rescued real photos from /services/ and
   /gallery/.
7. **The five "specialist services at a glance" blurbs are verbatim** from the old homepage.
8. ⚠️ **`services/pickup.jpg` is a MAP whose legible labels are Bexhill, Battle and Rye** — the
   three towns the owner ruled we do NOT serve. The text gate bans those words but cannot read
   pixels. The homepage deliberately does not use it; it survives only as a 64px thumbnail on
   /services/ (labels illegible), with its alt corrected ("A map of the Hastings area" — it
   previously claimed to be a van). ⚑ Replace with a Hastings-centred map at polish.
9. Title and the (already-corrected) meta description carried from the Stage-1 stub — the
   harvested description's "free door to door service" stays banned.

### 2026-07-16 (evening) — Owner ruling: bath & brush pick-ups ARE offered, £2/journey

The blocking contradiction is settled: **the live JotForm was right and the site was wrong.**
Bath and brush appointments get bus pick-up/drop-off at the same rate as full grooms — £2 per
journey, £4 round trip. Changes (all fact edits, no layout):
1. `extract-prices.mjs` → `pricing.json`: `bathBrushTidy.note` now advertises the service
   ("Pick ups and drop offs are available for bath and brush appointments too — £2 per journey,
   the same as full grooms."); `pickup.note` now lists "full grooms, hand stripping and bath &
   brush appointments".
2. T&Cs: the harvested sentence "We do not offer pick ups/drop offs for bath and brush
   appointments" is **removed**; the eligibility sentence now names all three services
   (deviation #3 in the page's comment block).
3. /services/ add-ons intro and the FAQ pick-up answer: "full grooms and hand stripping only" →
   all three services named.
4. `stage3-checks.mjs`: the two retired wordings are now **banned patterns**, and a new check
   asserts both notes carry the bath & brush offer.

Owner rulings (locked via interview before the build): **date only, no author byline** (the old
post credited Grace Humbles); **hero = the K9 Centre site's 1600×1180 salon photo** (replacing the
old 650×433 end-of-post studio shot, alt=""); **both sites stay self-canonical for now** — the
cross-domain duplicate decision stays "at polish"; **more posts are planned**, so /blog/ is framed
as a growing tips section (new posts = markdown files in `src/content/blog/`).

1. **Post date = 17 April 2020, displayed without an author.** The old page's visible byline
   ("By Grace Humbles / November 6, 2022") carried a site-rebuild date: the body's own first line
   was a typed "17th April 2020", the WP auto-excerpt on /blog/ confirmed it as body text, and the
   Main Website's copy of this same post already uses 2020-04-17. The stray body line is dropped —
   it became the real `pubDate`.
2. **Four bold-paragraph section labels promoted to real H2s** ("Importance of Dog Grooming",
   "Dog grooming at home", "Puppies and grooming", "How often should I get my dog groomed?"). The
   old markup was `<p><strong>…</strong></p>` — zero headings in the whole article body.
3. **Two typo fixes** (same class as the T&Cs precedent): "brushing them to hard" → "too hard";
   "you can be confident pooch will leave" → "confident your pooch will leave". Everything else
   verbatim from the harvest, curly apostrophes included.
4. **/blog/ gains an H1 and a meta description** — the old index had NO H1 anywhere and a null
   Yoast description. The old card's excerpt was WP's broken auto-excerpt (it opened with the
   stray "17th April 2020"); the new card uses the post's own description (= its Yoast meta
   description, verbatim).
5. **og:type=article + article:published_time restored** on the post via a new optional
   `articlePublished` prop on Base.astro (the old Yoast emitted the same pair; og:type stays
   "website" everywhere else).
6. Titles verbatim: "Blog - The Fairy Tails Dog Grooming" and "Why dog grooming is important -
   The Fairy Tails Dog Grooming".

### 2026-07-16 — Stage 3 owner rulings (the old site contradicted itself; these settle it)

⚠️ **Never re-litigate these from the Yoast `article:modified_time` stamps.** The homepage,
`/services/`, `/services-2/` and the price list all carry stamps inside one 7-minute window
(16:47–16:53) on **the harvest date itself** — that is a migration re-save of the temporary
Bluehost origin, **not** four content edits. `/services-2/` appears 39s "newer" than `/services/`
purely as an artifact. Only the pre-2026 stamps (FAQ 2024, T&Cs 2023, who-we-are 2025-12,
contact 2025-07) carry real signal.

1. **Pick-up & drop-off = £2 PER JOURNEY** (£2 to collect + £2 to drop off = £4 round trip),
   **Hastings and St Leonards**, full grooms and hand stripping only. This value appears **nowhere**
   on the old site, which said four different things: homepage "at no extra cost", T&Cs "**Free**
   pick up/drop off service", /services/ "£1 per journey", /services-2/ "£5 Bexhill/Battle/Rye".
   **No out-of-area service** — Bexhill/Battle/Rye are not served at all.
   Changed: `pricing.json` `pickup` (now the SINGLE source — `business.ts`'s duplicate `pickup`
   object, which held a contradicting 5th variant, was **deleted**); T&Cs heading + body;
   /who-we-are/ (its "fee-paid" hedge existed only because this was unresolved); the homepage stub's
   meta description, which was shipping "With free door to door service in the Hastings area!".
2. **Pick-up TIME WINDOWS — a new third set**, replacing both published versions:
   morning collect **7:45–9:30** → home **12:45–13:30**; afternoon collect **12:45–13:45** → home
   **15:30–16:45**. (The FAQ published 8:30–9:45/16:15–17:30; the T&Cs published 8:15–9:30/16:30–17:45,
   whose 17:45 return was 15 min AFTER the 17:30 closing time.) Both pages now render them from
   `pricing.json` so they cannot drift apart again.
3. **Ear plucking — absolute "we never pluck"** (the FAQ's 2024 wording). The T&Cs' carve-out
   "unless there are loose hairs that gently come away from the ear when rubbed" is **removed**.
4. **Payment — invoicing is by prior arrangement only**, not a walk-up option. The T&Cs' flat "All
   charges are payable before you leave the salon" now carries that exception; the FAQ's bare
   "Invoice" bullet is reworded. (FAQ and T&Cs directly contradicted each other.)
5. **Adventure Dog shop link DROPPED** from the FAQ. `adventure-dog.co.uk` is a dead Shopify domain
   (`the-fairy-hut.myshopify.com`) — fails TLS, returns Shopify's 409 "domain not connected". The
   answer is kept and reworded with no outbound link.
6. **Hand stripping "£50+" → "£45+"**, and now DERIVED in `extract-prices.mjs` from the cheapest
   `(hand strip)` row rather than typed. £50 was never the floor — the same canonical price list has
   three hand-strip rows at £45 (Dachshund, Jack Russell, Lakeland Terrier).
7. **Subscription perk "Free pick ups and drop offs" → "Pick ups and drop offs included."** Same
   fact (it IS a real perk now pay-as-you-go is £2), but the word "free" sat on the same page as the
   £2 price and read as a contradiction.
8. **`bathBrushTidy.note`: "We do not offer ~~free~~ pick ups/drop offs for bath and brush"** — with
   nothing free anywhere, "free" implied free pick-ups exist elsewhere. Bath-and-brush gets no
   collection at any price.
9. **Tick removal £5 added to `extraCharges`.** It was the one charge the old site mentioned in T&Cs
   prose only, so it never reached the structured data.
10. **Price list title improved** (pre-authorised by the "carried or deliberately improved" rule):
    "The Fairy Tails Dog Grooming - The Fairy Tails Dog Grooming" → "Dog grooming price list - The
    Fairy Tails Dog Grooming". The old title was a doubled site name with zero keyword value on the
    site's highest commercial-intent page. Description kept verbatim.
11. **Price list section order changed** (no facts moved): the three breed tables are now contiguous,
    with bath/brush + subscription after them, so the breed filter runs over one uninterrupted block.
    The old page interleaved them.
12. **`business.ts` subscription comment corrected**: it described the cheaper visit as a "**Half
    Groom**", a term that exists nowhere in the harvest. Standardised on **"Bath, Brush & Tidy"**,
    which is what both the canonical /services/ page and the price-list table call it. (The price
    list also called it a "Maintenance Groom" — three names for one product.)
    ⚠️ **Corrected again the same day:** that comment ALSO claimed "**bus** pick-up" was a stray from
    the sister route-planner project. **That was wrong.** "Bus" is the salon's own word — the live
    JotForm asks for a "Full Groom or Hand Strip Appointment – with bus pick-up and/or drop-offs".
    It is merely absent from the *website*, which says "pick up and drop off".
    **Lesson: the harvest is the source of record for the OLD SITE, not for the BUSINESS.** "Not in
    the harvest" ≠ "not real". Check the booking form and the owner before calling a term foreign.

## Polish backlog (post-switchover, indefinite) — **ACTIVE since 2026-08-08**

Copy/photo upgrades · FAQPage JSON-LD + LocalBusiness schema · gallery `<dialog>` lightbox ·
subscription sign-up page (Stripe recurring product — separate project) · fresh blog posts ·
duplicate-post canonical decision · GA4 property · Ahrefs-driven keyword pages · refresh
reviews snapshot.

**Carried in from the switchover (2026-08-08):**

- **Harden the enquiry workflow** — it answers the browser `{"ok":true}` BEFORE it writes the
  data-table row and BEFORE it sends the email, and has no `errorWorkflow`, so an SMTP failure
  loses a real enquiry silently. Top candidate for the next pass.
- **Re-measure Lighthouse ≥90 ×3 on every page against the LIVE apex** (the `/services/` 88–95
  bimodal reading was never settled), plus the 1440/390 and reduced-motion sweeps.
- **Yoast title improvement** for /who-we-are/ (doubled site name — see the copy log).
- **Decide `/feed/` + the wp-content stub questions** from the captured Ahrefs backlink report.
- **Post-flip monitoring** at the runbook's intervals, then **WordPress decommission (earliest
  T+30 = 2026-09-07)** — re-verify the harvest archive first, because the images are gone
  forever after deletion. 🔴 **Delete only the WordPress site; do NOT cancel the Hostinger
  "Business Web Hosting" plan** — fairytailsdoggrooming.co.uk is the MAIN vhost on it and the
  Main Website `thefairytails.co.uk` is an ADDON on the SAME plan, so cancelling it kills the
  Main Website.
