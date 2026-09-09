/**
 * Ambient types for the vgpu fluid example.
 *
 * `*.wgsl` imports are turned into JS modules at build time by
 * @vgpu/wgsl/loader-webpack (wired in next.config.js), so TypeScript needs to
 * be told what the default export of a .wgsl file looks like. The upstream
 * Next example does this with a one-line reference in wgsl-env.d.ts; same
 * thing here, plus the WebGPU globals the renderer relies on.
 */
/// <reference types="@vgpu/wgsl/wgsl-types" />
/// <reference types="@webgpu/types" />
