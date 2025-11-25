/******************************************************
 * RUNE DRAWING ENGINE (F1–F6)
 * Pure SVG-based rune rendering for all 6 families
 ******************************************************/
const SVG_NS = "http://www.w3.org/2000/svg";

function strokeEl(shape, stroke = "#f5f5f5", width = 4) {
  const el = document.createElementNS(SVG_NS, shape.t);
  for (const [k, v] of Object.entries(shape)) {
    if (k === "t") continue;
    el.setAttribute(k, v);
  }
  el.setAttribute("fill", "none");
  el.setAttribute("stroke", stroke);
  el.setAttribute("stroke-width", width);
  el.setAttribute("stroke-linecap", "round");
  el.setAttribute("stroke-linejoin", "round");
  return el;
}

/* ---------- F1: Monolith ---------- */
const monolithDefs = {
  A: [
    { t: "circle", cx: 50, cy: 50, r: 26 },
    { t: "polyline", points: "50,26 30,70 70,70 50,26" }
  ],
  B: [
    { t: "polyline", points: "35,20 20,40 30,60 50,65 65,45 55,25 35,20" },
    { t: "polyline", points: "45,30 32,46 40,58 52,60 60,47 53,33 45,30" }
  ],
  C: [
    { t: "path", d: "M70 25 Q40 15 25 35 Q15 50 25 65 Q40 85 65 75 Q50 70 48 60" },
    { t: "circle", cx: 55, cy: 55, r: 4 }
  ],
  D: [
    { t: "rect", x: 25, y: 25, width: 50, height: 50, rx: 8, ry: 8 },
    { t: "path", d: "M25 25 L75 75" },
    { t: "path", d: "M35 35 L65 65" }
  ],
  E: [
    { t: "path", d: "M25 70 Q50 40 75 70" },
    { t: "path", d: "M30 60 Q50 35 70 60" },
    { t: "path", d: "M35 52 Q50 32 65 52" }
  ],
  F: [
    { t: "polyline", points: "40,20 55,30 40,40 55,50 40,60 55,70 40,80" },
    { t: "line", x1: 60, y1: 25, x2: 75, y2: 35 }
  ],
  G: [
    { t: "path", d: "M35 25 Q20 40 22 55 Q24 75 42 85 Q60 90 75 72 Q85 60 80 42 Q75 25 55 20 Q45 18 35 25 Z" },
    { t: "line", x1: 55, y1: 20, x2: 60, y2: 10 },
    { t: "line", x1: 60, y1: 10, x2: 70, y2: 8 }
  ],
  H: [
    { t: "path", d: "M45 20 Q40 40 45 60 Q50 80 45 90" },
    { t: "circle", cx: 62, cy: 50, r: 14 },
    { t: "line", x1: 62, y1: 36, x2: 62, y2: 64 }
  ],
  I: [
    { t: "polyline", points: "50,20 30,40 50,60 70,40 50,20" },
    { t: "path", d: "M50 60 Q48 72 40 80 Q35 85 33 90" }
  ],
  J: [
    { t: "polyline", points: "35,25 50,40 65,25" },
    { t: "polyline", points: "50,40 50,60 40,75" },
    { t: "polyline", points: "50,60 60,75" }
  ],
  K: [
    { t: "path", d: "M30 25 Q20 50 30 75 Q40 90 55 85 Q70 80 78 60 Q83 45 78 30 Q72 15 55 15 Q40 15 30 25" },
    { t: "line", x1: 50, y1: 25, x2: 50, y2: 75 }
  ],
  L: [
    { t: "circle", cx: 42, cy: 45, r: 18 },
    { t: "circle", cx: 58, cy: 55, r: 18 },
    { t: "line", x1: 30, y1: 70, x2: 70, y2: 30 }
  ],
  M: [
    { t: "polyline", points: "30,80 40,35 50,50 60,35 70,80" },
    { t: "polyline", points: "40,35 50,25 60,35" }
  ],
  N: [
    { t: "rect", x: 25, y: 25, width: 50, height: 40, rx: 6, ry: 6 },
    { t: "rect", x: 32, y: 32, width: 36, height: 26, rx: 4, ry: 4 },
    { t: "path", d: "M61 32 L68 18" }
  ],
  O: [
    { t: "path", d: "M20 50 Q35 25 50 25 Q65 25 80 50 Q65 75 50 75 Q35 75 20 50 Z" },
    { t: "circle", cx: 50, cy: 50, r: 10 },
    { t: "circle", cx: 50, cy: 50, r: 4 }
  ],
  P: [
    { t: "rect", x: 28, y: 25, width: 44, height: 40, rx: 4, ry: 4 },
    { t: "line", x1: 50, y1: 25, x2: 50, y2: 65 },
    { t: "path", d: "M28 65 L40 80 60 80 72 65" }
  ],
  Q: [
    { t: "circle", cx: 50, cy: 45, r: 22 },
    { t: "path", d: "M60 60 Q70 75 75 85" }
  ],
  R: [
    { t: "polyline", points: "50,20 35,40 50,60 65,40 50,20" },
    { t: "polyline", points: "35,40 32,65 50,80 68,65 65,40" }
  ],
  S: [
    { t: "path", d: "M70 22 Q48 18 40 30 Q32 40 40 48 Q50 58 42 68 Q34 78 25 78" },
    { t: "circle", cx: 72, cy: 30, r: 4 }
  ],
  T: [
    { t: "circle", cx: 50, cy: 50, r: 23 },
    { t: "line", x1: 32, y1: 39, x2: 68, y2: 61 },
    { t: "line", x1: 35, y1: 68, x2: 65, y2: 68 }
  ],
  U: [
    { t: "path", d: "M28 70 Q30 30 50 25 Q70 30 72 70" },
    { t: "path", d: "M38 62 Q50 50 62 62" }
  ],
  V: [
    { t: "line", x1: 50, y1: 22, x2: 50, y2: 78 },
    { t: "line", x1: 25, y1: 50, x2: 75, y2: 50 },
    { t: "line", x1: 32, y1: 32, x2: 68, y2: 68 },
    { t: "line", x1: 68, y1: 32, x2: 32, y2: 68 }
  ],
  W: [
    { t: "path", d: "M25 55 Q25 35 40 35 Q55 35 55 55 Q55 75 40 75 Q25 75 25 55 Z" },
    { t: "path", d: "M75 55 Q75 35 60 35 Q45 35 45 55 Q45 75 60 75 Q75 75 75 55 Z" }
  ],
  X: [
    { t: "path", d: "M30 30 Q50 20 55 25 Q60 30 55 40 Q50 50 35 60 Q25 68 22 78" },
    { t: "path", d: "M70 30 Q50 20 45 25 Q40 30 45 40 Q50 50 65 60 Q75 68 78 78" }
  ],
  Y: [
    { t: "circle", cx: 50, cy: 50, r: 20 },
    { t: "line", x1: 50, y1: 30, x2: 50, y2: 15 },
    { t: "line", x1: 35, y1: 60, x2: 25, y2: 75 },
    { t: "line", x1: 65, y1: 60, x2: 75, y2: 75 }
  ],
  Z: [
    { t: "rect", x: 28, y: 28, width: 44, height: 44, rx: 4, ry: 4 },
    { t: "path", d: "M28 72 L72 28" },
    { t: "circle", cx: 50, cy: 50, r: 4 }
  ]
};

/* ---------- F2 – Veil Glyphs ---------- */
function veilDefs(letter) {
  const i = letter.charCodeAt(0) - 65;
  const segments = 3 + (i % 3);
  let x = 28 + (i % 6);
  let y = 24 + (i % 5);
  let d = `M${x} ${y}`;
  for (let s = 0; s < segments; s++) {
    const dx = 12 + ((i + s) % 5);
    const dy = (s % 2 === 0 ? 9 : -9) + ((i + s * 3) % 3 - 1);
    const cx = x + dx * 0.5;
    const cy = y + dy * 0.6 * (s % 2 === 0 ? 1 : -1);
    x = Math.max(20, Math.min(80, x + dx));
    y = Math.max(20, Math.min(80, y + dy));
    d += ` Q${cx} ${cy} ${x} ${y}`;
  }
  const shapes = [{ t: "path", d }];
  const hookCount = 1 + (i % 3);
  for (let h = 0; h < hookCount; h++) {
    const angle = ((i * 13 + h * 47) % 360) * Math.PI / 180;
    const len = 6 + ((i + h) % 4);
    const hx = 50 + Math.cos(angle) * (8 + (i % 6));
    const hy = 50 + Math.sin(angle) * (8 + (h * 3));
    const hx2 = hx + Math.cos(angle + Math.PI / 2) * len;
    const hy2 = hy + Math.sin(angle + Math.PI / 2) * len;
    shapes.push({ t: "line", x1: hx, y1: hy, x2: hx2, y2: hy2 });
  }
  return shapes;
}

/* ---------- F3 – Orbit ---------- */
const orbitDefs = {
  A: [
    { t: "circle", cx: 50, cy: 50, r: 22 },
    { t: "circle", cx: 50, cy: 50, r: 10 },
    { t: "circle", cx: 68, cy: 40, r: 3 },
    { t: "path", d: "M28 50 Q50 30 72 50" }
  ],
  B: [
    { t: "circle", cx: 50, cy: 50, r: 18 },
    { t: "circle", cx: 60, cy: 40, r: 8 },
    { t: "circle", cx: 38, cy: 60, r: 4 },
    { t: "path", d: "M32 40 Q50 70 68 40" }
  ],
  C: [
    { t: "circle", cx: 50, cy: 50, r: 20 },
    { t: "circle", cx: 50, cy: 50, r: 6 },
    { t: "circle", cx: 34, cy: 44, r: 3 },
    { t: "circle", cx: 66, cy: 56, r: 3 },
    { t: "path", d: "M30 58 Q50 30 70 42" }
  ],
  D: [
    { t: "circle", cx: 50, cy: 50, r: 19 },
    { t: "circle", cx: 62, cy: 54, r: 7 },
    { t: "circle", cx: 40, cy: 36, r: 3 },
    { t: "path", d: "M32 52 Q50 70 68 48" }
  ],
  E: [
    { t: "circle", cx: 50, cy: 48, r: 18 },
    { t: "circle", cx: 50, cy: 48, r: 8 },
    { t: "circle", cx: 36, cy: 60, r: 4 },
    { t: "path", d: "M34 38 Q50 30 66 38" }
  ],
  F: [
    { t: "circle", cx: 50, cy: 50, r: 21 },
    { t: "circle", cx: 60, cy: 50, r: 6 },
    { t: "circle", cx: 40, cy: 50, r: 6 },
    { t: "circle", cx: 50, cy: 34, r: 3 },
    { t: "path", d: "M30 60 Q50 72 70 60" }
  ],
  G: [
    { t: "circle", cx: 50, cy: 50, r: 20 },
    { t: "circle", cx: 56, cy: 60, r: 7 },
    { t: "circle", cx: 40, cy: 44, r: 4 },
    { t: "path", d: "M32 48 Q50 28 68 52" }
  ],
  H: [
    { t: "circle", cx: 48, cy: 50, r: 18 },
    { t: "circle", cx: 60, cy: 42, r: 10 },
    { t: "circle", cx: 40, cy: 60, r: 3 },
    { t: "path", d: "M34 44 Q50 70 70 54" }
  ],
  I: [
    { t: "circle", cx: 50, cy: 50, r: 17 },
    { t: "circle", cx: 50, cy: 50, r: 5 },
    { t: "circle", cx: 64, cy: 48, r: 3 },
    { t: "circle", cx: 42, cy: 64, r: 3 },
    { t: "path", d: "M32 40 Q50 32 68 44" }
  ],
  J: [
    { t: "circle", cx: 50, cy: 50, r: 19 },
    { t: "circle", cx: 44, cy: 40, r: 8 },
    { t: "circle", cx: 62, cy: 58, r: 4 },
    { t: "path", d: "M30 52 Q50 30 70 52" }
  ],
  K: [
    { t: "circle", cx: 50, cy: 50, r: 22 },
    { t: "circle", cx: 50, cy: 50, r: 9 },
    { t: "circle", cx: 36, cy: 46, r: 3 },
    { t: "circle", cx: 66, cy: 54, r: 3 },
    { t: "path", d: "M32 60 Q50 32 68 40" }
  ],
  L: [
    { t: "circle", cx: 50, cy: 50, r: 18 },
    { t: "circle", cx: 60, cy: 60, r: 6 },
    { t: "circle", cx: 40, cy: 40, r: 6 },
    { t: "path", d: "M32 50 Q50 70 68 50" }
  ],
  M: [
    { t: "circle", cx: 50, cy: 48, r: 20 },
    { t: "circle", cx: 50, cy: 48, r: 7 },
    { t: "circle", cx: 64, cy: 60, r: 3 },
    { t: "circle", cx: 36, cy: 36, r: 3 },
    { t: "path", d: "M30 56 Q50 30 70 40" }
  ],
  N: [
    { t: "circle", cx: 50, cy: 52, r: 19 },
    { t: "circle", cx: 42, cy: 44, r: 7 },
    { t: "circle", cx: 62, cy: 60, r: 4 },
    { t: "path", d: "M34 48 Q50 72 68 44" }
  ],
  O: [
    { t: "circle", cx: 50, cy: 50, r: 21 },
    { t: "circle", cx: 50, cy: 50, r: 11 },
    { t: "circle", cx: 34, cy: 50, r: 3 },
    { t: "circle", cx: 66, cy: 50, r: 3 },
    { t: "path", d: "M30 40 Q50 30 70 40" }
  ],
  P: [
    { t: "circle", cx: 50, cy: 52, r: 18 },
    { t: "circle", cx: 60, cy: 46, r: 8 },
    { t: "circle", cx: 40, cy: 62, r: 3 },
    { t: "path", d: "M32 46 Q50 30 66 60" }
  ],
  Q: [
    { t: "circle", cx: 50, cy: 50, r: 20 },
    { t: "circle", cx: 50, cy: 50, r: 8 },
    { t: "circle", cx: 64, cy: 44, r: 4 },
    { t: "path", d: "M40 60 L60 76" }
  ],
  R: [
    { t: "circle", cx: 50, cy: 50, r: 18 },
    { t: "circle", cx: 40, cy: 60, r: 7 },
    { t: "circle", cx: 60, cy: 40, r: 4 },
    { t: "path", d: "M32 52 Q50 30 70 52" }
  ],
  S: [
    { t: "circle", cx: 50, cy: 50, r: 22 },
    { t: "circle", cx: 50, cy: 50, r: 9 },
    { t: "circle", cx: 38, cy: 44, r: 3 },
    { t: "circle", cx: 64, cy: 58, r: 3 },
    { t: "path", d: "M30 58 Q50 32 70 46" }
  ],
  T: [
    { t: "circle", cx: 48, cy: 50, r: 19 },
    { t: "circle", cx: 60, cy: 54, r: 7 },
    { t: "circle", cx: 40, cy: 38, r: 4 },
    { t: "path", d: "M32 46 Q50 72 68 46" }
  ],
  U: [
    { t: "circle", cx: 50, cy: 48, r: 18 },
    { t: "circle", cx: 50, cy: 48, r: 6 },
    { t: "circle", cx: 64, cy: 54, r: 3 },
    { t: "circle", cx: 36, cy: 54, r: 3 },
    { t: "path", d: "M32 38 Q50 30 68 38" }
  ],
  V: [
    { t: "circle", cx: 50, cy: 50, r: 20 },
    { t: "circle", cx: 58, cy: 40, r: 8 },
    { t: "circle", cx: 42, cy: 60, r: 3 },
    { t: "path", d: "M30 52 Q50 70 70 52" }
  ],
  W: [
    { t: "circle", cx: 50, cy: 50, r: 21 },
    { t: "circle", cx: 50, cy: 50, r: 7 },
    { t: "circle", cx: 36, cy: 44, r: 3 },
    { t: "circle", cx: 64, cy: 44, r: 3 },
    { t: "circle", cx: 50, cy: 66, r: 3 },
    { t: "path", d: "M30 40 Q50 30 70 40" }
  ],
  X: [
    { t: "circle", cx: 50, cy: 50, r: 18 },
    { t: "circle", cx: 60, cy: 60, r: 6 },
    { t: "circle", cx: 40, cy: 40, r: 3 },
    { t: "circle", cx: 36, cy: 62, r: 3 },
    { t: "path", d: "M32 50 Q50 70 68 48" }
  ],
  Y: [
    { t: "circle", cx: 50, cy: 50, r: 19 },
    { t: "circle", cx: 50, cy: 50, r: 5 },
    { t: "circle", cx: 62, cy: 40, r: 4 },
    { t: "circle", cx: 38, cy: 60, r: 4 },
    { t: "path", d: "M30 56 Q50 30 70 44" }
  ],
  Z: [
    { t: "circle", cx: 50, cy: 50, r: 22 },
    { t: "circle", cx: 50, cy: 50, r: 9 },
    { t: "circle", cx: 36, cy: 50, r: 3 },
    { t: "circle", cx: 64, cy: 40, r: 3 },
    { t: "path", d: "M30 60 Q50 32 70 38" }
  ]
};

/* ---------- F4 – Labyrinth ---------- */
function labyrinthDefs(letter) {
  const i = letter.charCodeAt(0) - 65;
  const pts = [
    { x: 30, y: 30 },
    { x: 50, y: 25 },
    { x: 70, y: 30 },
    { x: 75, y: 50 },
    { x: 70, y: 70 },
    { x: 50, y: 75 },
    { x: 30, y: 70 },
    { x: 25, y: 50 },
    { x: 50, y: 50 }
  ];
  const steps = 4 + (i % 4);
  let idx = i % pts.length;
  let d = `M${pts[idx].x} ${pts[idx].y}`;
  for (let s = 0; s < steps; s++) {
    const stride = 1 + ((i + s * 2) % 3);
    idx = (idx + stride) % pts.length;
    const p = pts[idx];
    d += ` L${p.x} ${p.y}`;
  }
  if (i % 2 === 0) d += " Z";
  return [{ t: "path", d }];
}

/* ---------- F5 – Starburst ---------- */
function starburstDefs(letter) {
  const i = letter.charCodeAt(0) - 65;
  const cx = 50;
  const cy = 50;
  const rays = 4 + (i % 5);
  const shapes = [];
  const baseAngle = ((i * 19) % 360) * Math.PI / 180;
  for (let r = 0; r < rays; r++) {
    const offset = ((i + r * 7) % 15 - 7) * Math.PI / 180;
    const angle = baseAngle + r * (2 * Math.PI / rays) + offset;
    const innerLen = 8 + ((i + r) % 5);
    const outerLen = 22 + ((i * 2 + r) % 9);
    const x1 = cx + Math.cos(angle) * innerLen;
    const y1 = cy + Math.sin(angle) * innerLen;
    const x2 = cx + Math.cos(angle) * outerLen;
    const y2 = cy + Math.sin(angle) * outerLen;
    shapes.push({ t: "line", x1, y1, x2, y2 });
  }
  if (i % 2 === 1) {
    let polyPoints = "";
    for (let r = 0; r < rays; r++) {
      const angle = baseAngle + r * (2 * Math.PI / rays);
      const len = 20 + ((i + r) % 7);
      const x = cx + Math.cos(angle) * len;
      const y = cy + Math.sin(angle) * len;
      polyPoints += `${x},${y} `;
    }
    shapes.push({ t: "polyline", points: polyPoints.trim() + " Z" });
  }
  shapes.push({ t: "circle", cx, cy, r: 3 });
  return shapes;
}

/* ---------- F6 – Constellation ---------- */
function constellationDefs(letter) {
  const i = letter.charCodeAt(0) - 65;
  const dotCount = 3 + (i % 4);
  const dots = [];
  const lines = [];
  const cx = 50;
  const cy = 50;
  let angleBase = (i * 21) % 360;
  const radius = 14 + (i % 8);
  for (let n = 0; n < dotCount; n++) {
    const a = (angleBase + n * (360 / dotCount)) * Math.PI / 180;
    const x = cx + Math.cos(a) * (radius + (n % 2 ? 6 : -4));
    const y = cy + Math.sin(a) * (radius + (n % 3 ? -5 : 5));
    dots.push({ x, y });
  }
  for (let n = 0; n < dots.length - 1; n++) {
    lines.push({
      t: "line",
      x1: dots[n].x,
      y1: dots[n].y,
      x2: dots[n + 1].x,
      y2: dots[n + 1].y
    });
  }
  const shapes = [];
  dots.forEach(d => {
    shapes.push({ t: "circle", cx: d.x, cy: d.y, r: 2.4 });
  });
  return shapes.concat(lines);
}

/**
 * Draw a rune symbol for a given letter and family
 * @param {string} letter - The letter (A-Z)
 * @param {string} familyId - The family ID (F1-F6)
 * @param {boolean} big - Whether to use the larger inline size
 * @returns {SVGElement} The SVG element containing the rune
 */
function drawRune(letter, familyId, big = false) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.classList.add(big ? "symbol-inline" : "symbol");

  const ch = letter.toUpperCase();
  if (ch < "A" || ch > "Z") return svg;

  let defs;
  switch (familyId) {
    case "F1": defs = monolithDefs[ch]; break;
    case "F2": defs = veilDefs(ch); break;
    case "F3": defs = orbitDefs[ch]; break;
    case "F4": defs = labyrinthDefs(ch); break;
    case "F5": defs = starburstDefs(ch); break;
    case "F6": defs = constellationDefs(ch); break;
    default: defs = monolithDefs[ch]; break;
  }

  const g = document.createElementNS(SVG_NS, "g");
  (defs || []).forEach(shape => g.appendChild(strokeEl(shape)));

  if (familyId === "F1") {
    const angle = (Math.random() - 0.5) * 4;
    svg.style.transform = `rotate(${angle}deg)`;
  } else if (familyId === "F2") {
    g.setAttribute("transform", "translate(50 50) scale(1.25) translate(-50 -50)");
  }

  svg.appendChild(g);
  return svg;
}

