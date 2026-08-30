#!/usr/bin/env node
// Analytics release gate. This complements the deterministic source/HTML checks by reading the
// public GTM payload that browsers actually receive. Use --live after deployment to verify the
// public site has switched to the dedicated grooming container.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const SITE = 'https://fairytailsdoggrooming.co.uk/';
const GROOMING_GTM = 'GTM-TZWLLT4H';
const GROOMING_GA4 = 'G-TVNY7185K3';
const PROHIBITED_MAIN_SITE_GTM = 'GTM-W93L9XK5';
const PROHIBITED_MAIN_SITE_GA4 = 'G-TPBSKV29CJ';
const EVENT = 'enquiry_submitted';
const live = process.argv.includes('--live');

let failures = 0;
const ok = (message) => console.log(`  OK   ${message}`);
const bad = (message) => {
  failures++;
  console.log(`  FAIL ${message}`);
};
const check = (condition, message) => (condition ? ok(message) : bad(message));

console.log(`\n--- grooming analytics (${live ? 'live site' : 'built candidate'}) ---`);

let home = '';
if (live) {
  try {
    const response = await fetch(SITE, { headers: { 'cache-control': 'no-cache' } });
    check(response.ok, `homepage returns HTTP ${response.status}`);
    home = await response.text();
  } catch (error) {
    bad(`homepage can be read (${error.message})`);
  }
} else {
  const file = join(ROOT, 'dist', 'index.html');
  check(existsSync(file), 'dist/index.html exists');
  if (existsSync(file)) home = readFileSync(file, 'utf8');
}

if (home) {
  check(home.includes(GROOMING_GTM), `homepage loads ${GROOMING_GTM}`);
  check(!home.includes(PROHIBITED_MAIN_SITE_GTM), `homepage excludes ${PROHIBITED_MAIN_SITE_GTM}`);
}

let payload = '';
try {
  const response = await fetch(`https://www.googletagmanager.com/gtm.js?id=${GROOMING_GTM}`, {
    headers: { 'cache-control': 'no-cache' },
  });
  check(response.ok, `public ${GROOMING_GTM} payload returns HTTP ${response.status}`);
  payload = await response.text();
} catch (error) {
  bad(`public ${GROOMING_GTM} payload can be read (${error.message})`);
}

if (payload) {
  check(!payload.includes('"tags":[]'), 'public grooming container is not empty');
  check(payload.includes(GROOMING_GA4), `public grooming container targets ${GROOMING_GA4}`);
  check(payload.includes(EVENT), `public grooming container contains ${EVENT}`);
  check(!payload.includes(PROHIBITED_MAIN_SITE_GA4), `public grooming container excludes ${PROHIBITED_MAIN_SITE_GA4}`);
}

console.log(`\n${failures ? `FAIL — ${failures} analytics regression(s)` : 'PASS — grooming analytics isolation is green'}\n`);
process.exit(failures ? 1 : 0);
