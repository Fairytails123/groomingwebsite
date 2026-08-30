#!/usr/bin/env node
// Consent Mode recovery and persistence checks. Expects the local preview on :4321.

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const KEY = 'ft-consent';
const GROOMING_GTM = 'GTM-TZWLLT4H';

let failures = 0;
const ok = (message) => console.log(`  OK   ${message}`);
const bad = (message) => {
  failures++;
  console.log(`  FAIL ${message}`);
};
const check = (condition, message) => (condition ? ok(message) : bad(message));

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });

  console.log('\n--- malformed consent recovery ---');
  const invalidStoredChoices = [
    ['broken JSON', '{broken-json'],
    ['null', 'null'],
    ['missing fields', '{}'],
    ['invalid state', '{"ad_storage":"denied","ad_user_data":"denied","ad_personalization":"denied","analytics_storage":"maybe"}'],
    ['unexpected field', '{"ad_storage":"denied","ad_user_data":"denied","ad_personalization":"denied","analytics_storage":"denied","unexpected":"denied"}'],
  ];
  for (const [description, storedValue] of invalidStoredChoices) {
    await page.evaluate(([key, value]) => localStorage.setItem(key, value), [KEY, storedValue]);
    await page.reload({ waitUntil: 'domcontentloaded' });
    check(
      (await page.evaluate(([key]) => localStorage.getItem(key), [KEY])) === null,
      `${description} stored consent is cleared`,
    );
    check(
      await page.getByRole('button', { name: 'Accept all' }).isVisible(),
      `${description} recovery reveals the consent choice`,
    );
  }
  const gtmSrc = await page.locator('script[src*="googletagmanager.com/gtm.js"]').getAttribute('src');
  check(gtmSrc?.includes(GROOMING_GTM), `recovered page loads ${GROOMING_GTM}`);

  console.log('\n--- essential-only persistence ---');
  await page.getByRole('button', { name: 'Essential only' }).click();
  const denied = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key)), [KEY]);
  check(denied.analytics_storage === 'denied', 'essential-only choice persists analytics_storage denied');
  const deniedUpdates = await page.evaluate(() =>
    window.dataLayer
      .map((item) => (Object.prototype.toString.call(item) === '[object Arguments]' ? Array.from(item) : item))
      .filter((item) => Array.isArray(item) && item[0] === 'consent' && item[1] === 'update'),
  );
  check(deniedUpdates.some((item) => item[2]?.analytics_storage === 'denied'), 'essential-only choice pushes a denied consent update');
  await page.reload({ waitUntil: 'domcontentloaded' });
  check(!(await page.getByRole('button', { name: 'Accept all' }).isVisible()), 'valid stored choice keeps the banner hidden');

  console.log('\n--- accept-all persistence ---');
  await page.evaluate(([key]) => localStorage.removeItem(key), [KEY]);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Accept all' }).click();
  const granted = await page.evaluate(([key]) => JSON.parse(localStorage.getItem(key)), [KEY]);
  check(granted.analytics_storage === 'granted', 'accept-all choice persists analytics_storage granted');
  const grantedUpdates = await page.evaluate(() =>
    window.dataLayer
      .map((item) => (Object.prototype.toString.call(item) === '[object Arguments]' ? Array.from(item) : item))
      .filter((item) => Array.isArray(item) && item[0] === 'consent' && item[1] === 'update'),
  );
  check(grantedUpdates.some((item) => item[2]?.analytics_storage === 'granted'), 'accept-all choice pushes a granted consent update');
  await page.waitForTimeout(1_000);
  check(requests.some((url) => url.includes(GROOMING_GTM)), `browser requests ${GROOMING_GTM}`);
  check(requests.some((url) => url.includes('G-TVNY7185K3')), 'browser measurement requests target G-TVNY7185K3');
  check(!requests.some((url) => url.includes('G-TPBSKV29CJ')), 'browser sends no measurement request to the main-site GA4 property');
} finally {
  await browser.close();
}

console.log(`\n${failures ? `FAIL — ${failures} consent regression(s)` : 'PASS — consent recovery and persistence are green'}\n`);
process.exit(failures ? 1 : 0);
