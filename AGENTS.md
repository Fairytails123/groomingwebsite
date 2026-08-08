# AGENTS.md — read `CLAUDE.md`

**This file deliberately does NOT duplicate the engineering brief. The brief is [`CLAUDE.md`](./CLAUDE.md). Read that.**

Until 2026-08-08 this file was a byte-for-byte copy of `CLAUDE.md` with two words changed
("Claude" → "Codex"). That copy silently went stale: after the site went live it still instructed
agents that the site was an unindexed preview, that `INDEXABLE` should be unset, and that the owner
reviews changes on a preview URL — every one of which had become false and dangerous. A duplicated
brief is a brief that will be wrong again. Hence the pointer.

Wherever `CLAUDE.md` says "Claude", read it as "you, the agent working on this repo". Nothing in it
is Claude-specific.

---

## 🔴 The one thing you must know before touching anything

**https://fairytailsdoggrooming.co.uk is LIVE PRODUCTION** (since 2026-08-08, 19:02 UTC), served
from GitHub Pages, HTTPS enforced. It is no longer WordPress, and it is **indexed by Google**.

**Every push to `main` reaches paying customers in about two minutes. There is no staging step.**

- **There is NO preview URL.** `preview.fairytailsdoggrooming.co.uk` is dead (404) — Pages serves
  the apex now. Preview locally: `npm run build && npx astro preview`.
- **Never unset the `INDEXABLE` repo Actions variable** and never put a `noindex` on a real page.
  Doing either de-indexes the live business site on the next deploy, via a green, silent run.
  (A *local* build being noindexed is correct and expected — not a bug to fix.)
- **Never call `DNS_deleteDNSRecordsV1` or `DNS_resetDNSRecordsV1`** on this domain's zone: the
  tool's schema takes `{domain}` only — no name, no type — so one call can wipe the entire zone.
- **Never run `npm run harvest`** without reading its header first: it is disarmed on purpose,
  because its target domain now serves the *new* site and running it would overwrite the
  irreplaceable archive of the old one.
- **Do not cancel the Hostinger "Business Web Hosting" plan.** It still holds the old WordPress
  site (the rollback, keep until T+30 = 2026-09-07), and the Main Website `thefairytails.co.uk`
  is an addon on the same order — cancelling it takes that site down too.

Full detail, plus the mobile gate, the quality gates, the hero animation rules and every hard-won
trap: **`CLAUDE.md`**. Current state and session history: **`HANDOVER.md`** (read it first each
session). What the cutover did and how to roll it back: **`docs/SWITCHOVER-RUNBOOK.md`**.
