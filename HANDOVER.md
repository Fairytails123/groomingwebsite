# HANDOVER — session log (newest first)

Read this first each session. Master plan: `WEBSITE-PLAN.md`. Engineering brief: `CLAUDE.md`.

## ⏸️ CURRENT STATE (paused 2026-07-12 evening)

**Stages 0–2 are DONE and deployed.** Preview live at
**https://preview.fairytailsdoggrooming.co.uk** (HTTPS enforced, noindexed; old WordPress
untouched). Built + gated: shell, `/terms-and-conditions/`, `/contact/`, `/who-we-are/`,
3 redirect stubs, 404. verify-urls: 0 failures. Lighthouse 98–100/100/100 across the board.

**Waiting on the OWNER (blocks parts of Stage 3):**
1. Eyeball the 3 pages on the preview URL — phone AND desktop.
2. **Pickup pricing ruling** — old site contradicts itself: "free door-to-door for full
   grooms" (homepage/T&Cs/price-list) vs "£1 per journey" (/services/) vs "£5
   Bexhill/Battle/Rye" (/services-2/). Blocks the `/services/` hub page.
3. Who-we-are photo: the old page's image looks like the K9 Centre BARN, not the town
   salon — keep or replace?

**Next build work (Stage 3 — services cluster, inside-out):** the sub-pages NOT blocked by
the pickup ruling can go first: `/services/full-groom-price-list/` (PriceTable + JS filter
from pricing.json), `/services/haircut-lengths/`, `/services/teeth-cleaning/`,
`/services/doggy-massage/`, `/services/homeless-dogs/`, `/services/frequently-asked-questions/`;
the `/services/` hub LAST, after the ruling. Then Stage 4 (gallery + blog), Stage 5 (homepage).

**Also pending (needs a browser session with the owner):** GSC Domain property + DNS-TXT
verification and baseline export; GitHub account-level verified domain
(github.com/settings/pages → Add a domain → TXT via Hostinger MCP); Ahrefs baseline exports
→ `docs/seo-baseline/` (API is plan-blocked — web UI only).

**Housekeeping:** 2 TEST rows in the `grooming_enquiries` data table + 2 TEST emails at
info@ — safe to delete.

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
