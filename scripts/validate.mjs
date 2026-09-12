import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))/g)].map(match => match[1]);

for (const ref of refs) await access(resolve(root, ref), constants.R_OK);
for (const script of refs.filter(ref => ref.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', resolve(root, script)], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${script} failed syntax validation:\n${result.stderr}`);
}

const lore = await readFile(resolve(root, 'lore-pass.js'), 'utf8');
for (const required of ['Canon & Lore', 'Core Book', 'Deep Cuts', 'The Sneaks Campaign', 'Quellyn', 'Gray Cloaks', 'Wraiths', 'Grinders']) {
  if (!lore.includes(required)) throw new Error(`Missing required lore marker: ${required}`);
}

const canon = await readFile(resolve(root, 'canon-expansion.js'), 'utf8');
for (const faction of ['Covenant', 'Unity Commission', 'Rowan House', 'Ironworks Labor', 'Ragskulla']) {
  if (!canon.includes(faction)) throw new Error(`Missing Deep Cuts faction: ${faction}`);
}

console.log(`Validated ${refs.length} referenced assets and ${refs.filter(ref => ref.endsWith('.js')).length} scripts.`);
