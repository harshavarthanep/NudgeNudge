// Copies the web app (../../app) into a folder the desktop or phone app bundles.
// Usage: node ../shared/prepare-www.mjs www
import { cpSync, rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../app');
const out = resolve(process.cwd(), process.argv[2] || 'www');
rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });
const pkgPath = resolve(process.cwd(), 'package.json');
const version = process.env.APP_VERSION || (existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, 'utf8')).version : '');
const idx = resolve(out, 'index.html');
let html = readFileSync(idx, 'utf8');
html = html.replace('<script>\n\'use strict\';', '<script>window.NN_VERSION = ' + JSON.stringify(version) + ';</script>\n<script>\n\'use strict\';');
writeFileSync(idx, html);
console.log('Prepared ' + out + ' (version ' + version + ')');
