// Screenshots of a scene's painting in the game frame, on the three screens every scene is checked on.
//   node art-pilot/kit/shoot.mjs market east-asia
// The top bar shows the theme's first city (kit/themes.json).
// Reads scenes/<name>/painting-<theme>[-new].png and scene.json ({ role, paintings: { <theme>: { seat } } }, seat being the
// witness's x in the painting), writes scenes/<name>/shots/<theme>-{se,i15,xl}.png. Phones are shot at their real
// pixel density so the pixel font renders true.
import { existsSync, readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const kit = dirname(fileURLToPath(import.meta.url));
const [name, theme] = process.argv.slice(2);
const scene = resolve(kit, '../scenes', name);
const { role, paintings } = JSON.parse(readFileSync(`${scene}/scene.json`, 'utf8'));
const { seat } = paintings[theme];
// a candidate that has not been promoted yet is shot in preference, as checks.py checks it
const file = existsSync(`${scene}/painting-${theme}-new.png`) ? `painting-${theme}-new.png` : `painting-${theme}.png`;
const png = readFileSync(`${scene}/${file}`);
const iw = png.readUInt32BE(16), ih = png.readUInt32BE(20);
const cities = JSON.parse(readFileSync(`${kit}/themes.json`, 'utf8'))[theme];
const url = `file://${kit}/preview/wireframe.html?s=shop&skin=drawn&src=../../scenes/${name}/${file}`
  + `&iw=${iw}&ih=${ih}&seat=${seat}&role=${encodeURIComponent(role)}&fs=20&dfs=20&rs=12`
  + `&city=${encodeURIComponent(cities[0])}`;

mkdirSync(`${scene}/shots`, { recursive: true });
// Use whichever headless shell is installed, newest first, rather than the exact build this Playwright pins
const cache = `${homedir()}/Library/Caches/ms-playwright`;
const shell = (existsSync(cache) ? readdirSync(cache) : []).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => `${cache}/${d}/chrome-headless-shell-mac-arm64/chrome-headless-shell`).find(existsSync);
const b = await chromium.launch({ executablePath: shell, args: ['--allow-file-access-from-files'] });
for (const [screen, [w, h, dpr]] of Object.entries({ se: [375, 667, 2], i15: [393, 852, 3], xl: [1920, 1080, 1] })) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  p.on('pageerror', (e) => console.log(screen, e.message));
  await p.goto(url);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.screenshot({ path: `${scene}/shots/${theme}-${screen}.png` });
  await p.close();
}
await b.close();
console.log(`${scene}/shots`);
