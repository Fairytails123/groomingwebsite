#!/usr/bin/env node
// Build-output link and asset integrity gate.
//
// This deliberately checks the generated site rather than source templates so it sees the exact
// Astro routes, hashed images, responsive srcsets and CSS assets that would be deployed. External
// destinations are outside this deterministic gate; targeted external journeys belong in their
// own checks because third-party redirects and bot defences are not stable build inputs.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const SITE = new URL('https://fairytailsdoggrooming.co.uk/');
const distFlag = process.argv.indexOf('--dist');
const DIST = resolve(
  distFlag >= 0 && process.argv[distFlag + 1]
    ? process.argv[distFlag + 1]
    : join(import.meta.dirname, '..', 'dist'),
);

if (!existsSync(DIST) || !statSync(DIST).isDirectory()) {
  console.error(`dist directory not found: ${DIST}\nRun \`npm run build\` first.`);
  process.exit(2);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function posix(path) {
  return path.split(sep).join('/');
}

function displayPath(path) {
  return posix(relative(DIST, path)) || '.';
}

function pagePath(file) {
  const rel = posix(relative(DIST, file));
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)));
}

function decodePathname(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function targetCandidates(pathname) {
  const decoded = decodePathname(pathname);
  const rel = decoded.replace(/^\/+/, '');
  if (decoded === '/') return [join(DIST, 'index.html')];

  const candidates = [];
  if (decoded === '/404/') candidates.push(join(DIST, '404.html'));
  if (decoded.endsWith('/')) {
    candidates.push(join(DIST, rel, 'index.html'));
  } else {
    candidates.push(join(DIST, rel));
    candidates.push(join(DIST, rel, 'index.html'));
    candidates.push(join(DIST, `${rel}.html`));
  }
  return candidates;
}

function existingTarget(pathname) {
  return targetCandidates(pathname).find((candidate) => {
    const resolved = resolve(candidate);
    return (
      (resolved === DIST || resolved.startsWith(`${DIST}${sep}`)) &&
      existsSync(resolved) &&
      statSync(resolved).isFile()
    );
  });
}

const files = walk(DIST);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const idsByHtml = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set();
  for (const match of html.matchAll(/\b(?:id|name)\s*=\s*(["'])(.*?)\1/gis)) {
    ids.add(decodeHtml(match[2]));
  }
  idsByHtml.set(resolve(file), ids);
}

const failures = new Set();
let references = 0;
let internalReferences = 0;

function fail(sourceFile, kind, raw, reason) {
  failures.add(`${displayPath(sourceFile)} :: ${kind}="${raw}" :: ${reason}`);
}

function checkReference(sourceFile, sourceUrl, kind, rawValue) {
  references++;
  const raw = decodeHtml(rawValue.trim());
  if (!raw || /^(?:data|blob|mailto|tel|sms|javascript):/i.test(raw)) return;
  if (kind === 'css-url' && raw.startsWith('#')) return;

  let url;
  try {
    url = new URL(raw, new URL(sourceUrl, SITE));
  } catch {
    fail(sourceFile, kind, rawValue, 'invalid URL');
    return;
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== SITE.origin) return;
  internalReferences++;

  const target = existingTarget(url.pathname);
  if (!target) {
    fail(sourceFile, kind, rawValue, `missing internal target ${url.pathname}`);
    return;
  }

  if (url.hash && target.endsWith('.html')) {
    let fragment = url.hash.slice(1);
    try {
      fragment = decodeURIComponent(fragment);
    } catch {
      // Keep the literal fragment so the failure identifies the malformed value.
    }
    const ids = idsByHtml.get(resolve(target));
    if (fragment && ids && !ids.has(fragment)) {
      fail(sourceFile, kind, rawValue, `missing fragment #${fragment} in ${url.pathname}`);
    }
  }
}

for (const file of files) {
  const extension = file.slice(file.lastIndexOf('.')).toLowerCase();
  if (!['.html', '.css', '.xml'].includes(extension)) continue;
  const content = readFileSync(file, 'utf8');
  const sourceUrl = extension === '.html' ? pagePath(file) : `/${posix(relative(DIST, file))}`;

  if (extension === '.html') {
    for (const match of content.matchAll(/\b(href|src|poster|srcset)\s*=\s*(["'])(.*?)\2/gis)) {
      const kind = match[1].toLowerCase();
      if (kind === 'srcset') {
        if (match[3].trim().startsWith('data:')) continue;
        for (const candidate of match[3].split(',')) {
          const url = candidate.trim().split(/\s+/)[0];
          if (url) checkReference(file, sourceUrl, kind, url);
        }
      } else {
        checkReference(file, sourceUrl, kind, match[3]);
      }
    }
  }

  if (extension === '.html' || extension === '.css') {
    for (const match of content.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gis)) {
      checkReference(file, sourceUrl, 'css-url', match[2]);
    }
  }

  if (extension === '.xml') {
    for (const match of content.matchAll(/<loc>(.*?)<\/loc>/gis)) {
      checkReference(file, sourceUrl, 'loc', match[1]);
    }
  }
}

console.log(
  `${files.length} generated files scanned; ${references} references inspected; ` +
    `${internalReferences} internal references resolved.`,
);

if (failures.size) {
  console.error(`\nFAIL — ${failures.size} broken internal link or asset reference(s):`);
  for (const failure of [...failures].sort()) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('PASS — generated internal links, fragments and assets resolve.');
