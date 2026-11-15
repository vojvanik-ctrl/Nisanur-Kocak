/* Sea motion for Nisanur Koçak's portfolio: fish schools, a shark chase, an octopus, and a living water surface.
   Decorative only: aria-hidden layers, no pointer events, honours reduced motion and the pause button. */
(function (global) {
  'use strict';
  const doc = document;
  const reduced = global.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = true;
  let opts = null;
  const rand = (a, b) => a + Math.random() * (b - a);
  const off = () => !enabled || reduced.matches;

  /* ------------------------------------------------------------------ */
  /* Sea events, played one at a time in a repeating cycle:            */
  /* school → school → shark chase → school → octopus → (repeat)       */
  /* ------------------------------------------------------------------ */
  const SEQUENCE = ['school', 'school', 'chase', 'school', 'octopus'];
  const sea = { actors: [], raf: 0, timer: 0, last: -1e9, busy: null, step: 0, onDone: null, octo: null, octoAnim: null, octoSide: 1 };

  function sprite(src, w) {
    const img = new Image();
    img.src = src; img.alt = ''; img.draggable = false;
    img.style.width = w + 'px';
    img.style.opacity = '0';
    opts.fishLayer.appendChild(img);
    return img;
  }
  // Sprites face left. vx/vy is the current heading.
  function place(img, x, y, w, h, vx, vy, opacity, wiggle) {
    let rot = Math.atan2(vy, vx);
    const flip = vx > 0;
    if (!flip) rot -= Math.PI;
    if (rot > Math.PI) rot -= 2 * Math.PI;
    if (rot < -Math.PI) rot += 2 * Math.PI;
    rot += wiggle || 0;
    img.style.opacity = String(opacity);
    img.style.transform = 'translate3d(' + (x - w / 2).toFixed(1) + 'px,' + (y - h / 2).toFixed(1) + 'px,0) rotate(' + rot.toFixed(3) + 'rad)' + (flip ? ' scaleX(-1)' : '');
  }

  function loop(now) {
    sea.raf = 0;
    sea.actors = sea.actors.filter(a => {
      const alive = a.update(now);
      if (!alive) a.img.remove();
      return alive;
    });
    if (sea.actors.length) sea.raf = requestAnimationFrame(loop);
    else if (sea.busy && sea.busy !== 'octopus') finish();
  }
  function start(actors) {
    sea.actors.push(...actors);
    if (!sea.raf) sea.raf = requestAnimationFrame(loop);
  }
  function finish() {
    sea.busy = null;
    sea.last = performance.now();
    const done = sea.onDone; sea.onDone = null;
    if (done) done();
  }

  /* A calm school on a curving path */
  function school() {
    const W = global.innerWidth, H = global.innerHeight, mobile = W < 700;
    const n = mobile ? 8 : 14;
    const dir = Math.random() < 0.72 ? -1 : 1;
    const wavelength = rand(mobile ? 280 : 420, mobile ? 520 : 880);
    const amp = Math.min(rand(mobile ? 24 : 36, mobile ? 60 : 96), wavelength * 0.12);
    const t0 = performance.now(), duration = rand(mobile ? 5200 : 6600, mobile ? 6600 : 8600);
    const phase = rand(0, 6.28), baseY = H * rand(0.24, 0.76), span = W + 420, k = 6.2832 / wavelength;
    const actors = [];
    for (let i = 0; i < n; i++) {
      const w = mobile ? rand(30, 58) : rand(42, 92);
      const f = { w, h: w / 3, lag: rand(0, mobile ? 900 : 1300), offY: rand(-1, 1) * (mobile ? 38 : 64),
        wobA: rand(3, 9), wobF: rand(0.0025, 0.005), wobP: rand(0, 6.28), alpha: rand(0.55, 0.88) };
      f.img = sprite(opts.sprites[i % opts.sprites.length], w);
      f.update = now => {
        const p = (now - t0 - f.lag) / duration;
        if (p < 0) return true;
        if (p > 1) return false;
        const x = dir < 0 ? W + 210 - p * span : -210 + p * span;
        const vx = dir * span / duration;
        const y = baseY + f.offY + amp * Math.sin(k * x + phase) + f.wobA * Math.sin(now * f.wobF + f.wobP);
        const vy = amp * Math.cos(k * x + phase) * k * vx;
        const edge = Math.max(0, Math.min(1, p / 0.06, (1 - p) / 0.06));
        place(f.img, x, y, f.w, f.h, vx, vy, f.alpha * edge);
        return true;
      };
      actors.push(f);
    }
    start(actors);
  }

  /* A school cruises in, a shark appears from behind, the fish bolt and it gives chase */
  function chase() {
    const W = global.innerWidth, H = global.innerHeight, mobile = W < 700;
    const dir = Math.random() < 0.5 ? 1 : -1;            // +1: left → right
    const X = x => (dir > 0 ? x : W - x);                 // mirror for right → left
    const n = mobile ? 7 : 12;
    const t0 = performance.now();
    const cruise = W / (mobile ? 6500 : 9000);            // px per ms
    const flee = W / (mobile ? 1100 : 1500);
    const ramp = 450;
    const alarm = (W * 0.38 + 80) / cruise;               // when the school is ~40% across
    const sharkIn = alarm - 260;
    const baseY = H * rand(0.34, 0.66);
    const amp = mobile ? 22 : 34, k = 6.2832 / (mobile ? 360 : 620), phase = rand(0, 6.28);
    const dist = (t, a) => {
      if (t < a) return cruise * t;
      const d = t - a;
      return cruise * a + cruise * d + (flee - cruise) * (d < ramp ? d * d / (2 * ramp) : d - ramp / 2);
    };
    const speed = (t, a) => (t < a ? cruise : cruise + (flee - cruise) * Math.min(1, (t - a) / ramp));
    const actors = [];
    for (let i = 0; i < n; i++) {
      const w = mobile ? rand(30, 50) : rand(42, 80);
      const f = { w, h: w / 3, startX: -80 - rand(0, mobile ? 130 : 230), react: alarm + rand(0, 200),
        offY: rand(-1, 1) * (mobile ? 30 : 48), wobA: rand(3, 7), wobF: rand(0.003, 0.005), wobP: rand(0, 6.28), alpha: rand(0.6, 0.9) };
      f.img = sprite(opts.sprites[i % opts.sprites.length], w);
      f.update = now => {
        const t = now - t0;
        const x = f.startX + dist(t, f.react);
        if (x > W + 140) return false;
        const scatter = Math.max(0, Math.min(1, (t - f.react) / 700));
        const y = baseY + f.offY * (1 + 1.4 * scatter) + amp * Math.sin(k * x + phase) + f.wobA * Math.sin(t * f.wobF * (1 + 2 * scatter) + f.wobP);
        const vx = speed(t, f.react);
        const vy = amp * Math.cos(k * x + phase) * k * vx + scatter * f.offY * 0.0012;
        place(f.img, X(x), y, f.w, f.h, dir * vx, vy, Math.min(f.alpha, (x + 140) / 140 * f.alpha));
        return true;
      };
      actors.push(f);
    }
    const sw = mobile ? 168 : Math.max(230, Math.min(330, W * 0.21));
    const shark = { w: sw, h: sw * 253 / 760, img: sprite('assets/sea/shark.webp', sw) };
    const sv1 = W / (mobile ? 1800 : 2100), sv2 = W / (mobile ? 1350 : 1650);
    shark.update = now => {
      const t = now - t0 - sharkIn;
      if (t < 0) return true;
      const v = sv1 + (sv2 - sv1) * Math.min(1, Math.max(0, (t - 700) / 900));
      const extra = t < 700 ? 0 : t < 1600 ? (t - 700) * (t - 700) / 1800 : 450 + (t - 1600);
      const x = -sw / 2 - 10 + sv1 * t + (sv2 - sv1) * extra;
      if (x > W + sw) return false;
      const y = baseY + 10 + (mobile ? 10 : 18) * Math.sin(t * 0.0035);
      const vy = (mobile ? 10 : 18) * 0.0035 * Math.cos(t * 0.0035);
      place(shark.img, X(x), y, sw, shark.h, dir * v, vy, 0.96, 0.035 * Math.sin(t * 0.013));
      return true;
    };
    actors.push(shark);
    start(actors);
  }

  /* The octopus climbs in from a side edge, looks around with moving arms, then slips away */
  function octopus() {
    const W = global.innerWidth, H = global.innerHeight, mobile = W < 700;
    if (!sea.octo) {
      const box = doc.createElement('div');
      box.className = 'octo';
      box.innerHTML = '<div class="octo-rig">' +
        '<img class="octo-arm-left" src="assets/sea/octopus-arm-left.webp" alt="" draggable="false">' +
        '<img class="octo-arm-right" src="assets/sea/octopus-arm-right.webp" alt="" draggable="false">' +
        '<img class="octo-body" src="assets/sea/octopus-body.webp" alt="" draggable="false"></div>';
      opts.fishLayer.appendChild(box);
      sea.octo = box;
    }
    const box = sea.octo;
    const S = mobile ? 180 : Math.max(250, Math.min(360, W * 0.24));
    const side = sea.octoSide; sea.octoSide = -side;     // alternate right / left
    const cy = H * rand(mobile ? 0.5 : 0.42, mobile ? 0.7 : 0.66);
    const at = (inset, rot, dy) => {
      const cx = side > 0 ? W + S / 2 - inset : -S / 2 + inset;
      return 'translate(' + (cx - S / 2).toFixed(0) + 'px,' + (cy - S / 2 + (dy || 0)).toFixed(0) + 'px) rotate(' + (side > 0 ? -rot : rot) + 'deg)';
    };
    const peek = mobile ? 0.62 : 0.7;
    box.style.width = S + 'px';
    box.style.display = 'block';
    sea.octoAnim = box.animate([
      { transform: at(-S * 0.1, 78), opacity: 1, offset: 0 },
      { transform: at(S * peek, 70), offset: 0.16, easing: 'ease-in-out' },
      { transform: at(S * (peek + 0.08), 60, -14), offset: 0.34, easing: 'ease-in-out' },
      { transform: at(S * (peek - 0.04), 76, 10), offset: 0.52, easing: 'ease-in-out' },
      { transform: at(S * (peek + 0.06), 64, -8), offset: 0.7, easing: 'ease-in-out' },
      { transform: at(S * peek, 72), offset: 0.84, easing: 'ease-in' },
      { transform: at(-S * 0.1, 80), opacity: 1, offset: 1 }
    ], { duration: mobile ? 12500 : 15000, easing: 'ease-in-out', fill: 'both' });
    const end = () => { if (sea.octo) sea.octo.style.display = 'none'; sea.octoAnim = null; if (sea.busy === 'octopus') finish(); };
    sea.octoAnim.onfinish = end;
  }

  function run(name, onDone) {
    if (off() || doc.hidden || !opts || sea.busy) return false;
    sea.busy = name;
    sea.onDone = onDone || null;
    sea.last = performance.now();
    if (name === 'chase') chase();
    else if (name === 'octopus') octopus();
    else school();
    return true;
  }

  function clearSea() {
    clearTimeout(sea.timer);
    cancelAnimationFrame(sea.raf); sea.raf = 0;
    sea.actors.forEach(a => a.img.remove());
    sea.actors = [];
    if (sea.octoAnim) { sea.octoAnim.onfinish = null; sea.octoAnim.cancel(); sea.octoAnim = null; }
    if (sea.octo) sea.octo.style.display = 'none';
    sea.busy = null; sea.onDone = null;
  }

  function fire() {
    if (off()) return;
    if (doc.hidden || sea.busy) { sea.timer = setTimeout(fire, 3000); return; }
    const name = SEQUENCE[sea.step % SEQUENCE.length];
    sea.step++;
    run(name, () => scheduleNext(rand(12000, 18000)));
  }
  function scheduleNext(delay) {
    clearTimeout(sea.timer);
    if (off()) return;
    sea.timer = setTimeout(fire, delay);
  }

  /* ------------------------------------------------------------------ */
  /* Water surface: the whole screen is a low-res wave field.           */
  /* The pointer drags through it like a finger; it sleeps when calm.   */
  /* ------------------------------------------------------------------ */
  const water = { canvas: null, ctx: null, W: 0, H: 0, cell: 4, cur: null, prev: null, img: null, px: null, raf: 0, calm: 0, last: null };
  const DAMP = 0.962;

  function waterResize() {
    const c = water.canvas;
    if (!c) return;
    water.cell = global.innerWidth < 700 ? 4 : 3;
    water.W = Math.ceil(global.innerWidth / water.cell) + 2;
    water.H = Math.ceil(global.innerHeight / water.cell) + 2;
    c.width = water.W; c.height = water.H;
    water.ctx = c.getContext('2d');
    water.cur = new Float32Array(water.W * water.H);
    water.prev = new Float32Array(water.W * water.H);
    water.img = water.ctx.createImageData(water.W, water.H);
    water.px = new Uint32Array(water.img.data.buffer);
  }

  function disturb(x, y, amount, radius) {
    const { W, H, cell, cur } = water;
    const gx = x / cell + 1, gy = y / cell + 1;
    const r = Math.ceil(radius);
    for (let j = -r; j <= r; j++) {
      for (let i = -r; i <= r; i++) {
        const d2 = (i * i + j * j) / (radius * radius);
        if (d2 > 1) continue;
        const xi = Math.round(gx + i), yj = Math.round(gy + j);
        if (xi < 1 || yj < 1 || xi > W - 2 || yj > H - 2) continue;
        cur[yj * W + xi] += amount * (1 - d2);
      }
    }
  }

  function waterStep() {
    water.raf = 0;
    if (off() || doc.hidden) return clearWater();
    const { W, H, px } = water;
    let cur = water.cur, prev = water.prev;
    let visible = 0;
    for (let y = 1; y < H - 1; y++) {
      const row = y * W;
      for (let x = 1; x < W - 1; x++) {
        const i = row + x;
        prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - W] + cur[i + W]) * 0.5 - prev[i]) * DAMP;
      }
    }
    water.cur = prev; water.prev = cur; cur = water.cur;
    // Shade the slopes: lit side paper-white, shadow side navy ink.
    for (let y = 1; y < H - 1; y++) {
      const row = y * W;
      for (let x = 1; x < W - 1; x++) {
        const i = row + x;
        const s = (cur[i - 1] - cur[i + 1] + cur[i - W] - cur[i + W]) * 0.0056;
        if (s > 0.012) {
          const a = (s > 0.3 ? 0.3 : s) * 255 | 0;
          px[i] = (a << 24) | (247 << 16) | (253 << 8) | 255; visible++;
        } else if (s < -0.012) {
          const a = (s < -0.26 ? 0.26 : -s) * 0.7 * 255 | 0;
          px[i] = (a << 24) | (71 << 16) | (48 << 8) | 28; visible++;
        } else px[i] = 0;
      }
    }
    water.ctx.putImageData(water.img, 0, 0);
    // Sleep when the surface is calm again.
    if (visible === 0) water.calm++; else water.calm = 0;
    if (water.calm > 20) { clearWater(); return; }
    water.raf = requestAnimationFrame(waterStep);
  }

  function wake() { if (!water.raf && !off()) { water.calm = 0; water.raf = requestAnimationFrame(waterStep); } }

  function clearWater() {
    cancelAnimationFrame(water.raf); water.raf = 0;
    if (water.cur) { water.cur.fill(0); water.prev.fill(0); water.px.fill(0); water.ctx.putImageData(water.img, 0, 0); }
  }

  function trail(x, y) {
    if (off() || !water.cur) { water.last = null; return; }
    const now = performance.now();
    const last = water.last;
    water.last = { x, y, t: now };
    if (!last || now - last.t > 120) return;
    const dx = x - last.x, dy = y - last.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;
    const stepPx = water.cell * 1.5;
    const steps = Math.min(40, Math.ceil(dist / stepPx));
    const force = Math.min(1, dist / 34) * 60;       // faster finger, deeper wake
    for (let k = 1; k <= steps; k++) disturb(last.x + dx * k / steps, last.y + dy * k / steps, -force, 2.4);
    wake();
  }

  function drop(x, y, size) {
    if (off() || !water.cur) return;
    disturb(x, y, -(size || 420), 3.4);
    wake();
  }

  /* ------------------------------------------------------------------ */
  function sync() {
    doc.documentElement.classList.toggle('motion-off', off());
    doc.querySelectorAll('[data-motion-toggle]').forEach(b => {
      b.setAttribute('aria-pressed', String(!enabled));
      b.textContent = reduced.matches ? 'Motion off' : enabled ? 'Pause motion' : 'Play motion';
      b.disabled = reduced.matches;
    });
  }

  function setEnabled(value) {
    enabled = Boolean(value);
    if (off()) { clearSea(); clearWater(); }
    else scheduleNext(1200);
    sync();
  }

  function init(options) {
    opts = options;
    opts.sprites.forEach(src => { const i = new Image(); i.src = src; });
    doc.querySelectorAll('[data-motion-toggle]').forEach(b => b.addEventListener('click', () => setEnabled(!enabled)));
    reduced.addEventListener('change', () => setEnabled(enabled));
    doc.addEventListener('visibilitychange', () => {
      if (doc.hidden) { clearSea(); clearWater(); }
      else scheduleNext(rand(2500, 5000));
    });
    if (opts.waterCanvas) {
      water.canvas = opts.waterCanvas;
      waterResize();
      global.addEventListener('resize', () => { clearWater(); waterResize(); });
      global.addEventListener('pointermove', e => {
        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        (events.length ? events : [e]).forEach(ev => trail(ev.clientX, ev.clientY));
      }, { passive: true });
      global.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) trail(t.clientX, t.clientY); }, { passive: true });
      global.addEventListener('touchend', () => { water.last = null; }, { passive: true });
      global.addEventListener('pointerdown', e => { water.last = null; drop(e.clientX, e.clientY, e.pointerType === 'mouse' ? 290 : 240); }, { passive: true });
      doc.addEventListener('pointerleave', () => { water.last = null; });
    }
    sync();
    if (!off()) scheduleNext(1800);
  }

  global.Sea = {
    init,
    drop,
    setEnabled,
    /* call when the visible card or view changes */
    nudge() { if (!off() && !sea.busy && performance.now() - sea.last > 5000) run('school'); },
    play(name) { clearSea(); return run(name, () => scheduleNext(rand(12000, 18000))); },
    state: () => ({ enabled: !off(), event: sea.busy, actors: sea.actors.length, step: sea.step, water: Boolean(water.raf) })
  };
})(window);
