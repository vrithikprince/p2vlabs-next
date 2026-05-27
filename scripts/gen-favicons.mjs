/**
 * Regenerate raster favicons from public/icons/icon.svg.
 *
 * Run from the repo root:  node scripts/gen-favicons.mjs
 *
 * Produces (in /public):
 *   - icon.png        512×512  (PWA / Android, also Google's raster source)
 *   - apple-icon.png  180×180  (iOS home screen)
 *   - favicon.ico     32+48px  (legacy + Google's traditional fallback path)
 *
 * sharp + png-to-ico are installed with --no-save; this script is a one-off
 * asset step, not part of the build.
 */
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = await readFile(join(root, 'public/icons/icon.svg'))

const render = (size) =>
  sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()

await writeFile(join(root, 'public/icon.png'),       await render(512))
await writeFile(join(root, 'public/apple-icon.png'), await render(180))

const ico = await pngToIco([await render(32), await render(48)])
await writeFile(join(root, 'public/favicon.ico'), ico)

console.log('favicons regenerated: icon.png (512), apple-icon.png (180), favicon.ico (32+48)')
