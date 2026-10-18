// THE MAP DRAWING (PRODUCT.md "The map").
//
// Map A from the approved prototype (project files, framework/prototype.html),
// ported as is: a bird's-eye doodle of the palace seen from above the Seine,
// drawn in code from one schematic plan, not to scale. It draws the three
// wings, the Cour Carrée, the Pyramid, rue de Rivoli and the Seine to orient,
// and no rooms, no routes and no artworks.
//
// This file is the one swappable map drawing. It returns plain SVG and HTML
// strings plus each wing's box, built once at `next build`; the page never
// draws anything itself. To replace the drawing with a person's illustration,
// keep the contract below: one `<g class="wing" data-w="Denon" role="button"
// tabindex="0" aria-label=…>` per wing (with `.lift`, `.wash2`, `.w-focus`
// inside and `.wshadow` beside it), a `.bn[data-w]` banner per wing, the
// `.idle` loops, the `.pin`, and labels as HTML in `labels`. Classes are
// styled in src/app/map.css.
//
// Plan: north up, x east, y south. Sully is the square around the Cour Carrée
// (east). Richelieu runs along rue de Rivoli (north), Denon along the Seine
// (south), facing each other across the Cour Napoléon, where the Pyramid and
// its three small pyramids stand. Denon continues west as the Grande Galerie.
// The Arc du Carrousel and the Carrousel garden lie between the two west arms;
// the Tuileries beyond. The north-west arm is drawn as part of the palace but
// is not one of the museum's three wings, so it is not tappable and carries
// no label.

export type WingName = "Denon" | "Sully" | "Richelieu";
export const WING_NAMES: WingName[] = ["Denon", "Sully", "Richelieu"];

export type Box = { x0: number; y0: number; x1: number; y1: number };

export type MapDrawing = {
  /** Inner markup of the <svg>. */
  svg: string;
  /** HTML labels laid over the drawing, positioned in % of the view box. */
  labels: string;
  /** x, y, width, height. */
  viewBox: [number, number, number, number];
  /** Each wing's box in view-box units (with its banner), for the zoom. */
  boxes: Record<WingName, Box>;
};

/** What the drawing says about each wing: its spoken name and the "Floors −1 to 1" tag under its banner. */
export type WingText = Record<WingName, { ariaLabel: string; levels: string }>;

type Pt = [number, number];
type Block = {
  id: string; w?: WingName; x0: number; x1: number; y0: number; y1: number; hw: number; hr: number;
  inset?: number; dome?: number; arc?: number; glass?: number[][]; courts?: number[][];
};

const BLOCKS: Block[] = [
  { id: "sN", w: "Sully", x0: 246, x1: 346, y0: 14, y1: 34, hw: 9, hr: 6 },
  { id: "sE", w: "Sully", x0: 326, x1: 346, y0: 34, y1: 130, hw: 9, hr: 6 },
  { id: "sW", w: "Sully", x0: 246, x1: 266, y0: 34, y1: 130, hw: 9, hr: 6 },
  { id: "horloge", w: "Sully", x0: 243, x1: 267, y0: 70, y1: 94, hw: 12, hr: 14, dome: 1 },
  { id: "sS", w: "Sully", x0: 246, x1: 346, y0: 130, y1: 150, hw: 9, hr: 6 },
  { id: "rich", w: "Richelieu", x0: 126, x1: 246, y0: 14, y1: 52, hw: 9, hr: 6, inset: 6, glass: [[134, 164, 21, 45], [172, 196, 20, 32], [204, 238, 21, 45]] },
  { id: "rohan", x0: 48, x1: 126, y0: 14, y1: 30, hw: 8, hr: 5 },
  { id: "marsan", x0: 30, x1: 48, y0: 12, y1: 42, hw: 11, hr: 9, inset: 5 },
  { id: "den", w: "Denon", x0: 126, x1: 246, y0: 112, y1: 150, hw: 9, hr: 6, inset: 6, courts: [[146, 176, 119, 143], [198, 228, 119, 143]] },
  { id: "gg", w: "Denon", x0: 48, x1: 126, y0: 134, y1: 150, hw: 8, hr: 5 },
  { id: "flore", w: "Denon", x0: 30, x1: 48, y0: 122, y1: 152, hw: 11, hr: 9, inset: 5 },
];

// Oblique projection: a little shear and foreshortening, heights lift straight up.
const PX = { s: 0.2, c: 0.92, zf: 1, vb: [-3, -30, 366, 236] as [number, number, number, number] };

function rnd(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const f1 = (n: number) => Math.round(n * 10) / 10;
const P = (x: number, y: number, z = 0): Pt => [f1(x + PX.s * (y - 82)), f1(PX.c * y - z * PX.zf)];
const pt = (p: Pt) => p[0] + " " + p[1];
// One wobbly edge. The wobble is seeded by the edge itself, so an edge shared by two faces is drawn identically.
function seg(a: Pt, b: Pt, j: number) {
  const fw = a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]);
  const p = fw ? a : b, q = fw ? b : a;
  const r = rnd(pt(p) + "|" + pt(q));
  const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
  const o = (r() - 0.5) * 2 * Math.min(j, 0.12 + len * 0.035);
  return ` Q${f1((a[0] + b[0]) / 2 - (dy / len) * o)} ${f1((a[1] + b[1]) / 2 + (dx / len) * o)} ${pt(b)}`;
}
function dedupe(pts: Pt[]) {
  return pts.filter((p, i) => { const q = pts[(i + pts.length - 1) % pts.length]; return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) > 0.15; });
}
function wpoly(pts: Pt[], j = 0.7) { pts = dedupe(pts); let d = "M" + pt(pts[0]); for (let i = 1; i <= pts.length; i++) d += seg(pts[i - 1], pts[i % pts.length], j); return d + "Z"; }
function wline(pts: Pt[], j = 0.7) { let d = "M" + pt(pts[0]); for (let i = 1; i < pts.length; i++) d += seg(pts[i - 1], pts[i], j); return d; }
function poly(pts: Pt[]) { pts = dedupe(pts); return "M" + pts.map(pt).join("L") + "Z"; }
function area(pts: Pt[]) { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return Math.abs(a / 2); }
function hull(pts: Pt[]): Pt[] {
  const s = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of s.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
const rect = (x0: number, x1: number, y0: number, y1: number, z = 0): Pt[] => [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)];
/** Draw-in classes: the first visit of a session plays them; later visits and reduced motion skip them (map.css). */
const an = (cls: string, d: number, dl: number, base = "") => ` class="${base ? base + " " : ""}${cls}" style="--d:${d}ms;--dl:${dl}ms"`;

// Faces of one building: walls seen from the south-west, then a hipped or mansard roof.
function faces(b: Block) {
  const { x0, x1, y0, y1, hw, hr } = b;
  const r = Math.min(b.inset ?? Infinity, (x1 - x0) / 2, (y1 - y0) / 2), zt = hw + hr;
  const A = P(x0, y0, hw), B = P(x1, y0, hw), C = P(x1, y1, hw), D = P(x0, y1, hw);
  const A2 = P(x0 + r, y0 + r, zt), B2 = P(x1 - r, y0 + r, zt), C2 = P(x1 - r, y1 - r, zt), D2 = P(x0 + r, y1 - r, zt);
  const g0 = P(x0, y0), g1 = P(x0, y1), g2 = P(x1, y1);
  return {
    wallW: [g0, g1, D, A], wallS: [g1, g2, C, D], roofN: [A, B, B2, A2], roofE: [B, C, C2, B2], roofW: [A, D, D2, A2],
    roofS: [D, C, C2, D2], top: [A2, B2, C2, D2], all: [g0, g1, g2, A, B, C, D, A2, B2, C2, D2], foot: [P(x0, y0), P(x1, y0), g2, g1],
  } as Record<string, Pt[]>;
}

type BlockOut = { svg: string; hull: Pt[]; foot: Pt[]; faces: Pt[][] };

function blockSvg(b: Block, dl: number): BlockOut {
  const F = faces(b);
  let fills = "", inner = "", shade = "", win = "";
  const add = (pts: Pt[], cls: string) => { if (area(pts) < 0.6) return; fills += `<path class="${cls}" d="${poly(pts)}"/>`; inner += wpoly(pts, 0.5); };
  if (b.arc) { add(F.wallW, "f-aw"); add(F.wallS, "f-as"); add(F.top, "f-at"); }
  else {
    add(F.wallW, "f-ww"); add(F.wallS, "f-ws");
    if (b.dome) {
      const xm = (b.x0 + b.x1) / 2, ym = (b.y0 + b.y1) / 2, zt = b.hw + b.hr, M = P(xm, ym, zt);
      const ctl = (x: number, y: number) => P(x + (xm - x) * 0.2, y + (ym - y) * 0.2, b.hw + b.hr * 0.72);
      const cs: Pt[] = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]];
      const face = (i: number, j: number, cls: string) => {
        const e1 = P(cs[i][0], cs[i][1], b.hw), e2 = P(cs[j][0], cs[j][1], b.hw);
        const d = `M${pt(e1)} L${pt(e2)} Q${pt(ctl(...cs[j]))} ${pt(M)} Q${pt(ctl(...cs[i]))} ${pt(e1)}Z`;
        fills += `<path class="${cls}" d="${d}"/>`; inner += d;
      };
      face(0, 1, "f-rn"); face(1, 2, "f-re"); face(0, 3, "f-rw"); face(3, 2, "f-rs");
      const l = P(xm, ym, zt - 1);
      fills += `<path class="f-ww" d="M${l[0] - 2} ${l[1]} L${l[0] - 2} ${l[1] - 4} L${l[0] + 2} ${l[1] - 4} L${l[0] + 2} ${l[1]} Z"/><path class="f-rs" d="M${l[0] - 2.6} ${l[1] - 4} L${l[0]} ${l[1] - 7.5} L${l[0] + 2.6} ${l[1] - 4} Z"/>`;
      inner += `M${l[0] - 2} ${l[1]} L${l[0] - 2} ${l[1] - 4} L${l[0] + 2} ${l[1] - 4} L${l[0] + 2} ${l[1]} M${l[0] - 2.6} ${l[1] - 4} L${l[0]} ${l[1] - 7.5} L${l[0] + 2.6} ${l[1] - 4} Z`;
    } else {
      add(F.roofN, "f-rn"); add(F.roofE, "f-re"); add(F.roofW, "f-rw"); add(F.roofS, "f-rs"); add(F.top, "f-rt");
      if (area(F.roofN) > 0.6) shade += poly(F.roofN);
      if (area(F.roofE) > 0.6) shade += poly(F.roofE);
    }
  }
  // glazed courts (Richelieu) and open courts (Denon), set into the flat roof
  const zt = b.hw + b.hr;
  (b.glass || []).forEach((g) => {
    const q = rect(g[0], g[1], g[2], g[3], zt); fills += `<path class="f-gl" d="${poly(q)}"/>`; inner += wpoly(q, 0.4);
    const n = Math.max(2, Math.round((g[1] - g[0]) / 7));
    for (let i = 1; i < n; i++) { const x = g[0] + ((g[1] - g[0]) * i) / n; win += `M${pt(P(x, g[2], zt))}L${pt(P(x, g[3], zt))}`; }
  });
  (b.courts || []).forEach((g) => {
    const q = rect(g[0], g[1], g[2], g[3], zt); fills += `<path class="f-ct" d="${poly(q)}"/>`; inner += wpoly(q, 0.4);
    const q2 = [P(g[0], g[2], zt), P(g[1], g[2], zt), P(g[1], g[2] + 3, zt), P(g[0], g[2] + 3, zt)]; fills += `<path class="f-ws" d="${poly(q2)}" opacity=".8"/>`;
  });
  // windows: little ink ticks on the walls we can see
  if (!b.arc) {
    const z0 = b.hw * 0.28, z1 = b.hw * 0.62;
    for (let x = b.x0 + 3.2; x < b.x1 - 2; x += 4.6) win += `M${pt(P(x, b.y1, z0))}L${pt(P(x, b.y1, z1))}`;
    for (let y = b.y0 + 3.2; y < b.y1 - 2; y += 4.6) win += `M${pt(P(b.x0, y, z0))}L${pt(P(b.x0, y, z1))}`;
  }
  if (b.arc) {
    const op = (xa: number, xb: number, h: number) => { const a = P(xa, b.y1, 0), c = P(xb, b.y1, 0), t = P((xa + xb) / 2, b.y1, h + (xb - xa) * 0.55); return `M${pt(a)}L${a[0]} ${f1(a[1] - h)}Q${t[0]} ${t[1]} ${c[0]} ${f1(c[1] - h)}L${pt(c)}Z`; };
    fills += `<path class="f-ad" d="${op(109.4, 112.6, 4.2)}${op(105.4, 107.4, 2.8)}${op(114.6, 116.6, 2.8)}"/>`;
    const q = P(111, 82, b.hw);
    fills += `<path class="f-qd" d="M${q[0] - 3} ${q[1] + 0.5} Q${q[0] - 2.6} ${q[1] - 3.2} ${q[0]} ${q[1] - 4} Q${q[0] + 2.8} ${q[1] - 3} ${q[0] + 3} ${q[1] + 0.5} Z"/>`;
    inner += `M${q[0] - 3} ${q[1] + 0.5} Q${q[0] - 2.6} ${q[1] - 3.2} ${q[0]} ${q[1] - 4} Q${q[0] + 2.8} ${q[1] - 3} ${q[0] + 3} ${q[1] + 0.5}`;
  }
  // dormers along the sunny roof slopes
  if (!b.arc && !b.dome && b.x1 - b.x0 > b.y1 - b.y0) {
    const r = Math.min(b.inset ?? Infinity, (b.y1 - b.y0) / 2);
    let dm = "";
    for (let x = b.x0 + r + 4; x < b.x1 - r - 3; x += 7.5) {
      const c = P(x, b.y1 - r * 0.45, b.hw + b.hr * 0.45);
      dm += `M${f1(c[0] - 1.2)} ${f1(c[1] + 1.2)}L${f1(c[0] - 1.2)} ${f1(c[1] - 0.9)}L${c[0]} ${f1(c[1] - 2)}L${f1(c[0] + 1.2)} ${f1(c[1] - 0.9)}L${f1(c[0] + 1.2)} ${f1(c[1] + 1.2)}Z`;
    }
    if (dm) { fills += `<path class="f-dm" d="${dm}"/>`; win += dm; }
  }
  const H = hull(F.all);
  const out = `<g${an("m-fadein", 320, dl + 380)}><g transform="translate(.7 .55)">${fills}${shade ? `<path d="${shade}" fill="url(#m-hatch)"/>` : ""}</g>${win ? `<path d="${win}" class="ink-w"/>` : ""}</g>
    <path d="${inner}" class="ink-i m-draw" pathLength="1" style="--d:520ms;--dl:${dl + 160}ms"/>
    <path d="${wpoly(H, 0.8)}" class="ink-h m-draw" pathLength="1" style="--d:620ms;--dl:${dl}ms"/>`;
  return { svg: out, hull: H, foot: F.foot, faces: [F.wallW, F.wallS, F.top, F.roofN, F.roofE, F.roofW, F.roofS] };
}

function crown(cx: number, cy: number, r: number, seed: string) {
  const R = rnd(seed), n = 7, off = R() * 6.283;
  const p: Pt[] = [];
  for (let i = 0; i < n; i++) { const a = off + (i / n) * 6.283, rr = r * (0.9 + R() * 0.14); p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.92]); }
  let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
  for (let i = 1; i <= n; i++) { const a = off + ((i - 0.5) / n) * 6.283, q = p[i % n]; d += ` Q${f1(cx + Math.cos(a) * r * 1.3)} ${f1(cy + Math.sin(a) * r * 1.2)} ${f1(q[0])} ${f1(q[1])}`; }
  return d + "Z";
}
function treeSvg(x: number, y: number, r: number, seed: string) {
  const b = P(x, y), cx = b[0], cy = b[1] - r - 2.2;
  const k = rnd(seed)() > 0.5 ? "f-l1" : "f-l2";
  return { trunk: `M${cx} ${b[1]}L${cx} ${f1(cy + r * 0.6)}`, svg: `<path class="${k} ink-t" d="${crown(cx, cy, r, seed)}"/><path class="f-l3" d="${crown(cx + r * 0.28, cy + r * 0.3, r * 0.55, seed + "s")}"/>` };
}
function trees(list: number[][], dl: number) {
  let t = "", c = "";
  list.forEach(([x, y, r]) => { const s = treeSvg(x, y, r, "t" + x + "," + y); t += s.trunk; c += s.svg; });
  return `<g class="m-pop" style="--dl:${dl}ms;transform-box:fill-box;transform-origin:50% 100%">${t ? `<path d="${t}" class="ink-tr"/>` : ""}${c}</g>`;
}
function pyramid(cx: number, cy: number, s: number, h: number, lattice: boolean) {
  const x0 = cx - s / 2, x1 = cx + s / 2, y0 = cy - s / 2, y1 = cy + s / 2;
  const a = P(x0, y0), b = P(x1, y0), c = P(x1, y1), d = P(x0, y1), M = P(cx, cy, h);
  let out = "", ink = "";
  ([[a, b, "f-pn"], [b, c, "f-pe"], [a, d, "f-pw"], [d, c, "f-ps"]] as [Pt, Pt, string][]).forEach(([p, q, cls]) => { out += `<path class="${cls}" d="${poly([p, q, M])}"/>`; });
  if (lattice) {
    for (const t of [0.25, 0.5, 0.75]) {
      const L = (u: Pt, v: Pt, k: number): Pt => [f1(u[0] + (v[0] - u[0]) * k), f1(u[1] + (v[1] - u[1]) * k)];
      ink += `M${pt(L(d, c, t))}L${pt(L(c, M, 1 - t))}M${pt(L(d, c, t))}L${pt(L(d, M, t))}`;
      ink += `M${pt(L(a, d, t))}L${pt(L(d, M, 1 - t))}M${pt(L(a, d, t))}L${pt(L(a, M, t))}`;
    }
  }
  return `${out}${ink ? `<path d="${ink}" class="ink-l"/>` : ""}<path d="${wpoly(hull([a, b, c, d, M]), 0.4) + `M${pt(d)}L${pt(M)}M${pt(c)}L${pt(M)}`}" class="ink-p"/>`;
}
function person(x: number, y: number, col: string) {
  const f = P(x, y);
  return `<path d="M${f[0]} ${f[1]}L${f[0]} ${f1(f[1] - 4.2)}" stroke="${col}" class="ppl-b"/><circle cx="${f[0]}" cy="${f1(f[1] - 5.8)}" r="1.45" class="ppl-h"/>`;
}
const PEOPLE = [[146, 62], [152, 100], [160, 70, 7], [154, 106], [214, 66], [210, 99], [220, 74], [228, 93, -6], [198, 106], [142, 98], [112, 100], [116, 62, 6], [282, 52], [310, 112], [300, 98, -5], [318, 60], [70, 157], [100, 158, 8], [214, 157], [270, 156], [40, 211], [150, 210, -7], [330, 211]];
const PCOL = ["#E8836B", "#F2C14E", "#72829C", "#1F1F1F", "#86A75D"];

function ripples(seed: string, n: number, x0: number, x1: number, y0: number, y1: number) {
  const R = rnd(seed); let d = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), w = 4 + R() * 3.5, p = P(x, y);
    d += `M${p[0]} ${p[1]} q${f1(w / 2)} -1.8 ${f1(w)} 0 t${f1(w)} 0`;
  }
  return d;
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function buildLouvreMap(text: WingText): MapDrawing {
  const vb = PX.vb;
  const boxes = {} as Record<WingName, Box>;
  const grow = (wg: WingName, pts: Pt[]) => {
    const b = boxes[wg] || (boxes[wg] = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 });
    pts.forEach(([x, y]) => { b.x0 = Math.min(b.x0, x); b.y0 = Math.min(b.y0, y); b.x1 = Math.max(b.x1, x); b.y1 = Math.max(b.y1, y); });
  };

  /* ground */
  const G = (cls: string, pts: Pt[]) => `<path class="${cls}" d="${poly(pts)}"/>`;
  let ground = "";
  ground += G("g-paper", rect(-80, 440, -60, 260));
  ground += G("g-road", rect(-80, 440, -16, 3));
  ground += G("g-lawn", rect(-80, 27, 10, 156));
  ground += G("g-pave2", rect(48, 126, 30, 134));
  ground += G("g-lawn", rect(52, 98, 35, 78)) + G("g-lawn", rect(52, 98, 86, 129));
  ground += G("g-pave", rect(126, 246, 52, 112));
  ground += G("g-pave", rect(266, 326, 34, 130));
  ground += G("g-road", rect(-80, 440, 150, 162));
  ground += G("g-water", rect(-80, 440, 162, 202)) + `<path d="${poly(rect(-80, 440, 162, 202))}" fill="url(#m-water)"/>`;
  ground += G("g-road", rect(-80, 440, 202, 260));
  // Carrousel garden: yew hedges fanning out west from the arch
  let hedges = "";
  [[98, 40, 54, 40], [98, 52, 54, 46], [98, 66, 54, 62], [98, 74, 56, 76], [98, 90, 56, 88], [98, 98, 54, 102], [98, 112, 54, 116], [98, 124, 54, 124]].forEach(([xa, ya, xb, yb]) => { hedges += `M${pt(P(xa, ya))}L${pt(P(xb, yb))}`; });
  ground += `<path d="${hedges}" class="g-hedge"/>`;
  // basins around the Pyramid, and the Cour Carrée fountain
  const bas: Pt[][] = [[[158, 57], [170, 57], [158, 68]], [[210, 57], [198, 57], [210, 68]]];
  ground += bas.map((t) => `<path class="g-basin" d="${wpoly(t.map(([x, y]) => P(x, y)), 0.3)}"/>`).join("");
  const fc = P(296, 92);
  ground += `<ellipse cx="${fc[0]}" cy="${fc[1]}" rx="6" ry="${f1(6 * PX.c)}" class="g-basin"/>`;
  // edges in ink
  const edge = (pts: Pt[], d: number, dl: number, cls = "ink-g") => `<path d="${wline(pts, 0.6)}" class="${cls} m-draw" pathLength="1" style="--d:${d}ms;--dl:${dl}ms"/>`;
  const edges = edge([P(-80, 3), P(130, 3), P(440, 3)], 520, 0) + edge([P(-80, 162), P(120, 162), P(440, 162)], 600, 200, "ink-gw") + edge([P(-80, 202), P(140, 202), P(440, 202)], 600, 320, "ink-gw");

  /* water: ripples (two sets, out of phase), a boat and three bridges */
  let water = `<g class="idle shim"><path d="${ripples("ra", 18, -10, 380, 166, 199)}" class="rip-l"/></g><g class="idle shim2"><path d="${ripples("rb", 12, -10, 380, 166, 199)}" class="rip-d"/></g>`;
  const bridge = (xa: number, xb: number, cls: string, n: number) => {
    const deck = [P(xa, 160, 2.2), P(xb, 160, 2.2), P(xb, 204, 2.2), P(xa, 204, 2.2)];
    let arcs = ""; const st = 44 / n;
    for (let i = 0; i < n; i++) { const y = 160 + i * st, p = P(xa, y, 0), q = P(xa, y + st, 0), c = P(xa, y + st / 2, 2.2 + st * 0.18); arcs += `M${pt(p)}Q${c[0]} ${f1(c[1] - st * 0.3)} ${pt(q)}`; }
    const side = [P(xa, 160, 0), P(xa, 204, 0), P(xa, 204, 2.2), P(xa, 160, 2.2)];
    return `<path class="${cls}" d="${poly(side)}" opacity=".75"/><path class="${cls}" d="${poly(deck)}"/><path d="${wpoly(deck, 0.4)}${arcs}" class="ink-i"/>`;
  };
  const bp = P(330, 186);
  water += `<g class="idle boat"><g transform="translate(${bp[0]} ${bp[1]})"><path d="M-15 0 L13 0 Q16.5 -1 15.5 -3.2 L-16 -3.2 Q-16.5 -1.4 -15 0 Z" class="f-mat ink-i"/><path d="M-12 -3.2 L-10.6 -6.6 L10 -6.6 L12 -3.2 Z" class="f-gl ink-i"/><path d="M-7 -4 L-7 -5.8 M-3 -4 L-3 -5.8 M1 -4 L1 -5.8 M5 -4 L5 -5.8" class="ink-w"/></g></g>`;
  water += bridge(24, 32, "f-br", 5) + bridge(121, 129, "f-br", 4) + bridge(279, 284, "f-bi", 7);

  /* buildings by wing (each wing a button), back to front */
  const wingParts: Record<WingName, BlockOut[]> = { Sully: [], Richelieu: [], Denon: [] };
  const other: BlockOut[] = [];
  const order = ["sN", "sE", "sW", "horloge", "sS", "rich", "rohan", "marsan", "den", "gg", "flore"];
  const dlW: Record<WingName, number> = { Sully: 150, Richelieu: 290, Denon: 430 };
  order.forEach((id) => {
    const b = BLOCKS.find((x) => x.id === id)!;
    const r = blockSvg(b, b.w ? dlW[b.w] : 80);
    if (b.w) { wingParts[b.w].push(r); grow(b.w, r.hull); } else other.push(r);
  });
  const wingSvg = (wg: WingName) => {
    const parts = wingParts[wg];
    const facesD = parts.map((p) => p.faces.filter((f) => area(f) > 0.6).map(poly).join("")).join("");
    const foot = parts.map((p) => poly(p.foot.map(([x, y]) => [x + 2.5, y + 1.5] as Pt))).join("");
    const court = wg === "Sully" ? `<path d="${poly(rect(266, 326, 34, 130))}" fill="transparent"/>` : "";
    // An invisible margin of 3 units round each block, so the wing's narrowest side is still a 48 px target on a phone.
    const hit = parts.map((p) => poly(hull(p.hull.flatMap(([x, y]) => [[x - 3, y - 3], [x + 3, y - 3], [x + 3, y + 3], [x - 3, y + 3]] as Pt[])))).join("");
    return `<g class="wing" data-w="${wg}" role="button" tabindex="0" aria-label="${esc(text[wg].ariaLabel)}">
      <path class="wshadow" d="${foot}"/>
      <g class="lift"><path class="w-hit" d="${hit}"/>${court}${parts.map((p) => p.svg).join("")}<path class="wash2" d="${facesD}"/><path class="w-focus" d="${parts.map((p) => wpoly(p.hull, 0.8)).join("")}"/></g>
    </g>`;
  };

  /* Cour Napoléon: the Pyramid, its three small pyramids; the Arc du Carrousel */
  let court = "";
  court += pyramid(184, 61, 6, 5, false);
  court += pyramid(184, 82, 24, 20, true) + pyramid(206, 82, 6, 5, false) + pyramid(184, 103, 6, 5, false);
  const arcB = blockSvg({ id: "arc", arc: 1, x0: 104, x1: 118, y0: 79.5, y1: 84.5, hw: 10, hr: 0, inset: 0 }, 600);
  const apex = P(184, 82, 20), spk = P(180.5, 79, 11);

  /* trees */
  const tuil: number[][] = [];
  for (const x of [-16, -4, 8, 20]) for (let y = 18; y <= 150; y += 14) if (Math.abs(y - 81) > 8) tuil.push([x + (y % 28 ? 0 : 3), y, 5.4]);
  const carr: number[][] = [];
  for (const x of [56, 67, 78, 89]) { carr.push([x, 37.5, 4.6]); carr.push([x, 127, 4.6]); }
  const bank: number[][] = [];
  for (let x = -24; x < 400; x += 17) bank.push([x + ((x / 17) % 2 ? 4 : 0), 214, 5]);

  let people = "";
  PEOPLE.forEach(([x, y, wx], i) => {
    const s = person(x, y, PCOL[i % PCOL.length]);
    people += wx ? `<g class="idle walk" style="--wx:${wx}px;--wd:${7 + (i % 3) * 1.5}s">${s}</g>` : s;
  });

  /* labels: HTML laid over the drawing (scaled with it), so the zoom never has to re-lay out SVG text */
  let labels = "";
  const lab = (x: number, yc: number, html: string, o: { anchor?: string; cls?: string; w?: string; size?: number; align?: string; inner?: string } = {}) => {
    const tx = o.anchor === "start" ? "0" : o.anchor === "end" ? "-100%" : "-50%";
    const cls = o.cls || "mnote halo";
    labels += `<span class="ml ${cls}"${o.w ? ` data-w="${o.w}"` : ""} style="left:${f1(((x - vb[0]) / vb[2]) * 1000) / 10}%;top:${f1(((yc - vb[1]) / vb[3]) * 1000) / 10}%;--tx:${tx};--fs:${o.size || 10}${o.align ? ";text-align:" + o.align : ""}"><span${o.inner || ""}>${html}</span></span>`;
  };
  const L = { rivoli: P(104, -5), seine: P(204, 188), carree: P(296, 112), gg: P(88, 158.6), arc: P(111, 79.5, 15.5), tuil: P(0, 84), pyr: P(168, 84) };
  lab(L.rivoli[0], L.rivoli[1], "Rue de Rivoli");
  lab(L.seine[0], L.seine[1], "The Seine", { size: 10.5 });
  lab(L.carree[0], L.carree[1], "Cour Carrée", { inner: ' lang="fr"' });
  lab(L.gg[0], L.gg[1], "Grande Galerie", { size: 9.5 });
  lab(L.arc[0], L.arc[1] - 3.2, "Arc du Carrousel", { size: 9 });
  lab(L.tuil[0], L.tuil[1], "← Tuileries", { size: 9.5, anchor: "start" });
  lab(L.pyr[0], L.pyr[1] + 1.6, "Pyramid<br>entrance", { size: 9.5, anchor: "end", align: "right" });

  // wing names: hand-lettered banners
  const bannerAt: Record<WingName, Pt> = { Richelieu: P(186, 27, 15), Denon: P(186, 139, 15), Sully: P(304, 64) };
  const banners = WING_NAMES.map((wg, i) => {
    const [cx, cy] = bannerAt[wg];
    const pop = ` class="m-pop" style="--dl:${900 + i * 90}ms"`;
    lab(cx, cy + 15.5, esc(text[wg].levels), { size: 8.5, w: wg, cls: "mnote wsub" });
    lab(cx, cy, wg, { size: 15.5, w: wg, cls: "mhand bnt bnl", inner: pop });
    const w = wg.length * 8.2 + 14, h = 17.5, x0 = cx - w / 2, y0 = cy - h / 2;
    grow(wg, [[x0 - 10, y0], [x0 + w + 10, y0 + h + 22]]);
    const tail = (s: number) => {
      const xa = s < 0 ? x0 + 6 : x0 + w - 6, xb = xa + s * 16, ym = y0 + 5 + h / 2;
      return `<path class="tail" d="${wpoly([[xa, y0 + 5], [xb, y0 + 5], [xb - s * 5, ym], [xb, y0 + h + 5], [xa, y0 + h + 5]], 0.5)}"/><path class="fold" d="M${s < 0 ? x0 : x0 + w} ${y0 + h} L${xa} ${y0 + h + 5} L${xa} ${y0 + h} Z"/>`;
    };
    return `<g class="bn" data-w="${wg}" aria-hidden="true"><g class="lift2 m-pop" style="--dl:${900 + i * 90}ms">${tail(-1)}${tail(1)}<path class="body" d="${wpoly([[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], 0.7)}"/></g></g>`;
  }).join("");

  // north arrow, tilted to the drawing's north
  const nr = (-Math.atan2(PX.s, PX.c) * 180) / Math.PI;
  const compass = `<g transform="translate(350 -12) rotate(${f1(nr)})"><path d="M0 9 L0 -8 M-4 -3.5 L0 -8.5 L4 -3.5" class="ink-c"/><path d="M-2.6 -11 L-2.6 -17 L2.6 -11 L2.6 -17" class="ink-n"/></g>`;
  const pin = [apex[0], apex[1] - 2];
  const pinSvg = `<g class="pin" aria-hidden="true" transform="translate(${pin[0]} ${pin[1]})"><g class="m-pop" style="--dl:1100ms;transform-box:fill-box;transform-origin:50% 100%"><g class="m-float"><path d="M0 0 Q-6 -7.5 -5 -12.5 Q-3.7 -18 0 -18 Q3.7 -18 5 -12.5 Q6 -7.5 0 0 Z" fill="#2A3F8F" stroke="#1F1F1F" stroke-width="1.5"/><circle cx="0" cy="-12" r="2.2" fill="#FFFDF8"/></g></g></g>`;
  const sparkle = `<g transform="translate(${spk[0]} ${spk[1]})"><path class="idle spark" d="M0 -4.2 Q.7 -.7 4.2 0 Q.7 .7 0 4.2 Q-.7 .7 -4.2 0 Q-.7 -.7 0 -4.2Z"/></g>`;

  // a hand-torn edge round the whole drawing
  const edgeClip = (() => {
    const [x, y, w, h] = vb, r = 14, pts: Pt[] = [], R = rnd("edgeA");
    const corner = (cx: number, cy: number, a0: number) => { for (let i = 0; i <= 4; i++) { const a = a0 + (i / 4) * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    const side = (x0: number, y0: number, x1: number, y1: number) => { for (let i = 1; i < 8; i++) { const t = i / 8, j = (R() - 0.5) * 2.4; pts.push([x0 + (x1 - x0) * t + (y1 === y0 ? 0 : j), y0 + (y1 - y0) * t + (y1 === y0 ? j : 0)]); } };
    const i = 2;
    corner(x + w - i - r, y + i + r, -Math.PI / 2); side(x + w - i, y + i + r, x + w - i, y + h - i - r);
    corner(x + w - i - r, y + h - i - r, 0); side(x + w - i - r, y + h - i, x + i + r, y + h - i);
    corner(x + i + r, y + h - i - r, Math.PI / 2); side(x + i, y + h - i - r, x + i, y + i + r);
    corner(x + i + r, y + i + r, Math.PI); side(x + i + r, y + i, x + w - i - r, y + i);
    return `<clipPath id="m-edge"><path d="${wpoly(pts.map(([a, b]) => [f1(a), f1(b)] as Pt), 1)}"/></clipPath>`;
  })();

  const svg = `
    <defs>
      ${edgeClip}
      <pattern id="m-hatch" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)"><line x1="0" y1="0" x2="0" y2="3.4" stroke="#3F4C63" stroke-width=".7" opacity=".38"/></pattern>
      <pattern id="m-water" width="9" height="4.2" patternUnits="userSpaceOnUse"><path d="M0 1 L4.5 1.3 M5 3.2 L8.6 3" stroke="#FFFDF8" stroke-width=".7" opacity=".55" fill="none"/></pattern>
      <pattern id="m-wash" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="5" stroke="#F2C14E" stroke-width="2" opacity=".75"/></pattern>
    </defs>
    <g clip-path="url(#m-edge)">
      <g aria-hidden="true"${an("m-fadein", 260, 0, "scen")}>${ground}</g>
      <g aria-hidden="true" class="scen">${edges}</g>
      <g aria-hidden="true"${an("m-fadein", 400, 300, "scen deco")}>${water}</g>
      <g aria-hidden="true" class="scen deco">${trees(tuil, 760)}</g>
    </g>
    ${wingSvg("Sully")}${wingSvg("Richelieu")}
    <g aria-hidden="true" class="scen deco">${other.map((p) => p.svg).join("")}${trees(carr, 820)}</g>
    <g aria-hidden="true" class="scen deco"><g${an("m-pop", 240, 820)} style="transform-box:fill-box;transform-origin:50% 100%">${court}</g>${arcB.svg}</g>
    <g aria-hidden="true"${an("m-fadein", 400, 1150, "scen deco ppl")}>${people}</g>
    ${wingSvg("Denon")}
    <g aria-hidden="true" class="scen deco" clip-path="url(#m-edge)">${trees(bank, 900)}</g>
    <g aria-hidden="true"${an("m-fadein", 300, 850, "labels")}>${compass}${sparkle}</g>${pinSvg}
    <g class="banners">${banners}</g>`;

  return { svg, labels, viewBox: vb, boxes };
}
