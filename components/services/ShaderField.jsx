'use client'
import { useEffect, useRef } from 'react'

/**
 * The masthead backdrop for the /services cluster: a WebGL field of light
 * dispersing through a warped lattice.
 *
 * Why hand-written rather than a shader library. The page's problem was
 * looking generated, and a stock MeshGradient is the single most recognisable
 * "AI landing page" component shipping right now - importing one would have
 * reproduced the exact failure. This is ~5kb of GLSL tuned to the amp palette
 * with no dependency, and it earns its place by being about something: the
 * page's argument is make the work, make it findable, so the backdrop is a
 * signal propagating through structure rather than a decorative blob.
 *
 * Three choices carry the look:
 *   - Domain-warped fBm, not a radial gradient. A gradient has no interior;
 *     warped noise has somewhere for the eye to go at 8% alpha.
 *   - Chromatic dispersion - the field is sampled at three slightly offset
 *     positions for R, G and B, so edges split into navy/periwinkle/violet
 *     the way light splits through glass. It is what stops this reading as
 *     coloured fog.
 *   - Ordered (Bayer) dither. Quantising to 12 steps through a 4x4 matrix
 *     resolves the field into a fine print-like grain rather than a smooth
 *     CSS-looking wash, and as a side effect kills the banding a large
 *     low-alpha gradient shows on an 8-bit display.
 *
 * Performance, on a page whose entire job is ranking:
 *   - The canvas is decorative and absolutely positioned, so it contributes
 *     nothing to LCP and cannot shift layout. The server HTML ships the
 *     static CSS washes underneath; if WebGL is missing or the context is
 *     lost, this returns without drawing and those remain the design.
 *   - DPR is capped at 1.5 and the drawing buffer at 1600px. Beyond that a
 *     full-screen fragment shader costs real milliseconds for detail nobody
 *     can see at 8% alpha.
 *   - It runs at ~30fps, not 60. The motion is a slow drift; the extra 30
 *     frames are invisible and halve the GPU cost.
 *   - An IntersectionObserver stops the loop entirely once the masthead is
 *     scrolled past, so the rest of the page costs nothing.
 *   - prefers-reduced-motion renders exactly one frame and never loops.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;

uniform vec2  uRes;
uniform float uTime;
uniform float uCell;       // grid pitch in device pixels
uniform vec2  uPointer;    // smoothed, in 0..1 of the canvas
uniform float uPointerAmt; // 0 while the pointer has never been over it

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

/* Two levels of domain warp. One looks like noise; two looks like a fluid,
   and that is the difference between texture and something happening. */
float field(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.030)),
                fbm(p + vec2(5.2, 1.3 - t * 0.024)));
  vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) - t * 0.018),
                fbm(p + 2.0 * q + vec2(8.3, 2.8) + t * 0.014));
  return fbm(p + 2.2 * r);
}

/* Distance to the nearest rule of a square grid, in pixels. */
float gridMask(vec2 px, float cell, float w) {
  vec2 g = abs(fract(px / cell - 0.5) - 0.5) * cell;
  return 1.0 - smoothstep(0.0, w, min(g.x, g.y));
}

/* 4x4 ordered dither, built from the recursive 2x2 rather than a lookup -
   dynamic indexing into a const array is not reliable across WebGL1 drivers. */
float b2(float x, float y) { return mod(2.0 * x + 3.0 * y, 4.0); }
float bayer4(vec2 p) {
  float x = mod(p.x, 4.0), y = mod(p.y, 4.0);
  float lo = b2(mod(x, 2.0), mod(y, 2.0));
  float hi = b2(mod(floor(x / 2.0), 2.0), mod(floor(y / 2.0), 2.0));
  return (4.0 * lo + hi) / 16.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 1.5;

  /* The pointer bends the field toward itself. Nothing follows the cursor -
     the light just leans, which reads as a material rather than a widget. */
  vec2 pc = vec2(uPointer.x * aspect, uPointer.y) * 1.5;
  float prox = exp(-distance(p, pc) * 2.1);
  float pull = uPointerAmt * prox;
  vec2 pp = p + vec2(pull * 0.30, -pull * 0.20);

  /* Dispersion: three samples a hair apart become the three channels, so
     every edge fringes the way light splits through glass. */
  float d = 0.024 + pull * 0.030;
  float fr = field(pp + vec2( d,   0.0),     uTime);
  float fg = field(pp,                       uTime);
  float fb = field(pp + vec2(-d,   d * 0.6), uTime);

  vec3 navy = vec3(0.000, 0.102, 0.310);
  vec3 peri = vec3(0.412, 0.502, 1.000);
  vec3 viol = vec3(0.635, 0.451, 1.000);

  vec3 col = mix(peri, viol, smoothstep(0.30, 0.62, fg));
  col = mix(col, navy, smoothstep(0.58, 0.92, fg) * 0.75);
  col.r += (fr - fg) * 2.4;
  col.b += (fb - fg) * 2.4;
  col = clamp(col, 0.0, 1.0);

  /* Where the light actually is. Contrasting this is what turns fog into
     shapes - without the smoothstep the whole panel is one flat haze. */
  float energy = smoothstep(0.30, 0.74, fg);
  energy = max(energy, prox * uPointerAmt * 0.55);

  /* The drafting grid is drawn here rather than in CSS so the light can
     pass THROUGH it: rules stay a faint constant everywhere and brighten
     where the field is strong, with the intersections brightest. That is
     the page's own motif doing the work - structure being illuminated,
     which is the argument the page is making.
     Two pitches: the 68px sheet, plus a quarter pitch that only appears
     inside the lit areas, so detail resolves as the light arrives. */
  float g1 = gridMask(gl_FragCoord.xy, uCell,        1.05);
  float g2 = gridMask(gl_FragCoord.xy, uCell * 0.25, 0.85) * energy * 0.5;
  float grid = clamp(g1 + g2, 0.0, 1.0);

  /* Weighted to the right, away from the headline. The masthead has to stay
     a white editorial page that light happens to be falling across. */
  float m = mix(0.16, 1.0, smoothstep(0.12, 0.92, uv.x));
  m *= smoothstep(-0.10, 0.55, uv.y);
  m *= 1.0 - smoothstep(0.86, 1.06, uv.y);

  float aWash = 0.26 * energy;
  float aGrid = grid * (0.10 + 0.80 * energy);
  float a = max(aWash, aGrid) * m;
  a = clamp(a, 0.0, 0.62);

  /* Quantise through the dither so it resolves as grain, not as a wash. */
  a = floor(a * 16.0 + bayer4(gl_FragCoord.xy)) / 16.0;

  gl_FragColor = vec4(col, a);
}
`

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function ShaderField({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let gl
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        powerPreference: 'low-power',
      })
    } catch {
      return
    }
    // No WebGL: the CSS washes underneath are already the design.
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uPointer = gl.getUniformLocation(prog, 'uPointer')
    const uPointerAmt = gl.getUniformLocation(prog, 'uPointerAmt')
    const uCell = gl.getUniformLocation(prog, 'uCell')

    /* Tell the section the shader is live, so the static CSS grid - which
       is the no-WebGL fallback - fades out rather than double-printing at a
       different phase than the one drawn here. */
    const host0 = canvas.parentElement
    if (host0) host0.dataset.shader = 'on'

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.min(Math.round(r.width * dpr), 1600))
      const h = Math.max(1, Math.round(r.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uRes, canvas.width, canvas.height)
      /* The grid pitch has to match the CSS sheet's 68px in LAYOUT pixels,
         so it is scaled by the ratio the drawing buffer actually ended up
         at - not by devicePixelRatio, which diverges once the 1600px cap
         kicks in on a wide viewport. */
      const scale = r.width > 0 ? canvas.width / r.width : 1
      gl.uniform1f(uCell, 68 * scale)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Pointer is lerped toward the target; the raw value snaps and reads cheap.
    const target = { x: 0.72, y: 0.7, amt: 0 }
    const cur = { x: 0.72, y: 0.7, amt: 0 }
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width
      target.y = 1 - (e.clientY - r.top) / r.height
      target.amt = 1
    }
    const onLeave = () => { target.amt = 0 }
    const host = canvas.parentElement || canvas
    if (!reduced) {
      host.addEventListener('pointermove', onMove, { passive: true })
      host.addEventListener('pointerleave', onLeave, { passive: true })
    }

    const draw = (t) => {
      cur.x += (target.x - cur.x) * 0.06
      cur.y += (target.y - cur.y) * 0.06
      cur.amt += (target.amt - cur.amt) * 0.05
      gl.uniform1f(uTime, t)
      gl.uniform2f(uPointer, cur.x, cur.y)
      gl.uniform1f(uPointerAmt, cur.amt)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let raf = 0
    let running = false
    let last = 0
    const start = performance.now()
    const FRAME = 1000 / 30 // 30fps; the drift is slow and 60 is invisible here

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (now - last < FRAME) return
      last = now
      draw((now - start) / 1000)
    }
    const play = () => {
      if (running || reduced) return
      running = true
      last = 0
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    draw(0) // paint one frame immediately, reduced-motion included

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : stop()),
      { rootMargin: '120px' },
    )
    io.observe(canvas)

    const onVis = () => (document.hidden ? stop() : play())
    document.addEventListener('visibilitychange', onVis)

    const onLost = (e) => { e.preventDefault(); stop() }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('webglcontextlost', onLost)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  )
}
