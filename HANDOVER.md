# HANDOVER — session log (newest first)

Read this first each session. Master plan: `WEBSITE-PLAN.md`. Engineering brief: `CLAUDE.md`.

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
