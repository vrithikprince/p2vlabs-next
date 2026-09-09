# vgpu — "Interactive Fluid" (vendored)

Upstream source for the fluid simulation in the `/services` process band.
Do not hand-edit these files; re-pull and re-diff instead.

| | |
|---|---|
| Package  | `vgpu` (vercel-labs/vgpu) |
| Example  | `fluid` — *Interactive Fluid* |
| Revision | `69160a127bc8c2b54c5963763469d55909a349857129d91b3bc76c10839222a9` |
| Aggregate sha256 | `7c0e7f7a91d49673a1cf1ca1596ac83aad2c161a22eedb734eda8b9f09da0635` |
| Pulled   | 2026-09-09, vgpu CLI 0.4.0 |

## How it was pulled

The documented command is:

```bash
npx vgpu examples pull fluid --out ./fluid
```

On Windows that fails with `VGPU-EXAMPLES-FILESYSTEM: Safe destination
storage is unsupported on win32` — `pull` cannot write, though the rest of
the CLI works. The files were therefore fetched with `vgpu examples cat`
against the same pinned revision and each one verified against the
per-file `sha256` in `vgpu examples show fluid`. Same bytes, same
revision, same integrity guarantee `pull` provides.

To re-pull on a non-Windows machine, the plain command above is correct.

## Files

| File | Bytes | State |
|---|---|---|
| `renderer.ts` | 2571 | unmodified |
| `pointer-input.ts` | 3306 | unmodified |
| `simulation.ts` | 6136 | **modified — colour only** |
| `fluid-common.wgsl` | 1057 | unmodified |
| `advect-velocity.wgsl` | 2088 | unmodified |
| `curl.wgsl` | 709 | unmodified |
| `vorticity.wgsl` | 1055 | unmodified |
| `divergence.wgsl` | 870 | unmodified |
| `pressure.wgsl` | 1215 | unmodified |
| `project.wgsl` | 1242 | unmodified |
| `advect-dye.wgsl` | 2176 | **modified — colour only** |
| `display.wgsl` | 1147 | unmodified |

Ten of the twelve files are byte-identical to the pinned revision. The two
that differ carry inline `// P2V:` comments and change **colour constants
only** — no solver, no dispatch, no lifecycle:

- `advect-dye.wgsl` — the two hardcoded idle emitter colours. Upstream pairs
  azure with hot magenta `vec4f(1.0, 0.08, 0.55, 1)`, which fought the navy
  band. Now periwinkle `#6980ff` and violet `#a273ff`.
- `simulation.ts` — `pointer_color`. Still derived from movement direction
  with blue held high exactly as upstream does; only the two endpoints of the
  sweep moved off cyan/magenta and onto the same two accents.

Advection, curl, vorticity, divergence, the pressure Jacobi iterations,
projection, the fixed timestep and every dispatch size are untouched.

To re-verify: `npx vgpu examples show fluid` prints per-file `sha256`; the ten
unmodified files still match.

## Not vendored

`index.tsx` (785 B) is upstream's standalone demo shell: a full-bleed black
page with a "move to stir" caption. `FluidBand.jsx` replaces it. Nothing
else in the example was dropped.

## Build wiring

- `.wgsl` imports are compiled by `@vgpu/wgsl/loader-webpack`, registered in
  `next.config.js` under the `webpack()` hook. Upstream's Next example uses
  the top-level `turbopack` key, which needs Next 15.5; this project is on
  14.2 and the loader is webpack-compatible.
- `types/wgsl.d.ts` declares the `*.wgsl` module shape and pulls in
  `@webgpu/types`.
- `tsconfig.json` exists only because this example is TypeScript; the rest of
  the app is `.jsx` and is not type-checked (`checkJs: false`).
