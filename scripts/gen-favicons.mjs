/**
 * Regenerate raster favicons from public/icons/icon.svg.
 *
 * Run from the repo root:  node scripts/gen-favicons.mjs
 *
 * Produces (in /public):
 *   - icon.png        512×512     (PWA / Android, also Google's raster source)
 *   - apple-icon.png  180×180     (iOS home screen)
 *   - favicon.ico     16+32+48px  (legacy + Google's traditional fallback path)
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
/* Separate artwork for the 16px slot. The full "P2V" mark holds down to about
   32px and turns to mush at 16 - three glyphs over sixteen device pixels is
   roughly five pixels each. An .ico can carry different images per size, so
   the tab-strip size gets a two glyph "P2" instead. */
const svgSmall = await readFile(join(root, 'public/icons/icon-16.svg'))

const render = (source, size) =>
  sharp(source, { density: 384 }).resize(size, size).png().toBuffer()

await writeFile(join(root, 'public/icon.png'),       await render(svg, 512))
await writeFile(join(root, 'public/apple-icon.png'), await render(svg, 180))

/* 16 is included explicitly now. The .ico previously shipped only 32+48, so
   anything asking for 16 downscaled the 32 and got a smear. */
const ico = await pngToIco([
  await render(svgSmall, 16),
  await render(svg,      32),
  await render(svg,      48),
])
await writeFile(join(root, 'public/favicon.ico'), ico)

console.log('favicons regenerated: icon.png (512), apple-icon.png (180), favicon.ico (16+32+48)')
