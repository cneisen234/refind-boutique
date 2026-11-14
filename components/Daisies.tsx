// The flier's corner bouquets, drawn flat rather than in imitation watercolor:
// white daisies with gold centers, a bud, olive leaves on their stems, and
// clouds of baby's breath. One corner piece, mirrored into any corner.

// Trig results can differ in the last digit between server and browser, which
// breaks hydration; round every computed coordinate.
const r2 = (v: number) => Math.round(v * 100) / 100;

// Deterministic jitter so the drawing looks hand-placed but renders identically.
function jitter(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return r2(x - Math.floor(x));
}

function Daisy({ x, y, r, rot = 0, seed = 1, tilt = 1 }: { x: number; y: number; r: number; rot?: number; seed?: number; tilt?: number }) {
  const n = 19;
  const base = r * 0.22;
  const petals = Array.from({ length: n }, (_, i) => {
    const len = r * (0.84 + jitter(seed + i) * 0.18);
    const w = r * (0.14 + jitter(seed * 3 + i) * 0.045);
    const L = len - base;
    const a = r2((360 / n) * i + (jitter(seed * 7 + i) - 0.5) * 8);
    const d = `M0 ${r2(-base)} C${r2(w)} ${r2(-base - L * 0.15)} ${r2(w * 1.05)} ${r2(-len + L * 0.3)} 0 ${r2(-len)} C${r2(-w * 1.05)} ${r2(-len + L * 0.3)} ${r2(-w)} ${r2(-base - L * 0.15)} 0 ${r2(-base)}Z`;
    return (
      <g key={i} transform={`rotate(${a})`}>
        <path d={d} fill="var(--petal)" stroke="#cfbb9b" strokeWidth="0.6" />
        <path d={`M0 ${r2(-base - L * 0.25)} L0 ${r2(-len + L * 0.35)}`} stroke="#e4d6c0" strokeWidth="0.5" />
      </g>
    );
  });
  const cr = r * 0.26;
  const seeds = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 16 + jitter(seed + i * 5);
    const rr = cr * (0.25 + jitter(seed * 11 + i) * 0.55);
    return <circle key={i} cx={r2(Math.cos(a) * rr)} cy={r2(Math.sin(a) * rr)} r={r2(cr * 0.08)} fill="#9a5c14" opacity="0.7" />;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1 ${tilt})`}>
      {petals}
      <circle r={r2(cr)} fill="var(--daisy)" />
      <circle r={r2(cr)} fill="none" stroke="#a8661a" strokeWidth="0.7" />
      <circle cx={r2(-cr * 0.25)} cy={r2(-cr * 0.3)} r={r2(cr * 0.45)} fill="#e7a945" opacity="0.55" />
      {seeds}
    </g>
  );
}

/** A closed daisy bud: a green cup with petal tips peeking out. */
function Bud({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-4.5 -2 C-4 -9 -1.5 -12 0 -13 C1.5 -12 4 -9 4.5 -2Z" fill="var(--petal)" stroke="#cfbb9b" strokeWidth="0.6" />
      <path d="M-5.5 -1.5 C-5 -6 -2.5 -7 0 -7 C2.5 -7 5 -6 5.5 -1.5 C3 1.5 -3 1.5 -5.5 -1.5Z" fill="var(--leaf)" />
    </g>
  );
}

/** A leaf on a short stalk: tip at (len, 0), base at the origin. */
function Leaf({ x, y, len, angle, w = 0.32 }: { x: number; y: number; len: number; angle: number; w?: number }) {
  const h = len * w;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0 C${r2(len * 0.25)} ${r2(-h)} ${r2(len * 0.7)} ${r2(-h * 0.85)} ${len} 0 C${r2(len * 0.7)} ${r2(h * 0.85)} ${r2(len * 0.25)} ${r2(h)} 0 0Z`} fill="var(--leaf)" />
      <path d={`M${r2(len * 0.04)} 0 Q${r2(len * 0.5)} ${r2(-h * 0.12)} ${r2(len * 0.9)} 0`} fill="none" stroke="#a49c7a" strokeWidth="0.55" />
    </g>
  );
}

// ---- Baby's breath: a branching stem ending in clouds of tiny florets --------
type Twig = { d: string; tips: [number, number][] };

function branch(x: number, y: number, angle: number, len: number, depth: number, seed: number, out: Twig) {
  const rad = (angle * Math.PI) / 180;
  const x2 = r2(x + Math.cos(rad) * len);
  const y2 = r2(y + Math.sin(rad) * len);
  out.d += `M${r2(x)} ${r2(y)} L${x2} ${y2}`;
  if (depth === 0) {
    out.tips.push([x2, y2]);
    return;
  }
  const kids = 2 + Math.round(jitter(seed) * 1);
  for (let k = 0; k < kids; k++) {
    const spread = (k - (kids - 1) / 2) * (24 + jitter(seed + k) * 12);
    branch(x2, y2, angle + spread, len * (0.5 + jitter(seed * 2 + k) * 0.14), depth - 1, (seed * 3 + k + 1) % 997, out);
  }
}

function BabysBreath({ x, y, angle, len, seed }: { x: number; y: number; angle: number; len: number; seed: number }) {
  const t: Twig = { d: "", tips: [] };
  branch(x, y, angle, len, 4, seed, t);
  // Each twig ends in a small cluster of florets, not a single dot.
  const florets: [number, number, number][] = [];
  t.tips.forEach(([fx, fy], i) => {
    const n = 3 + Math.round(jitter(seed + i * 3) * 2);
    for (let k = 0; k < n; k++) {
      const a = (Math.PI * 2 * k) / n + jitter(seed + i + k);
      const d = k === 0 ? 0 : 2.2 + jitter(seed * 5 + i + k) * 1.4;
      florets.push([r2(fx + Math.cos(a) * d), r2(fy + Math.sin(a) * d), r2(1.35 + jitter(seed + i * 7 + k) * 0.6)]);
    }
  });
  return (
    <g>
      <path d={t.d} fill="none" stroke="#a39c7f" strokeWidth="0.5" strokeLinecap="round" />
      {florets.map(([fx, fy, fr], i) => (
        <circle key={i} cx={fx} cy={fy} r={fr} fill="var(--petal)" stroke="#d6c4a6" strokeWidth="0.4" />
      ))}
      {florets.filter((_, i) => i % 4 === 0).map(([fx, fy], i) => (
        <circle key={`c${i}`} cx={fx} cy={fy} r={0.5} fill="var(--daisy)" opacity="0.8" />
      ))}
    </g>
  );
}

export function DaisySpray({
  corner = "tl",
  className = "",
}: {
  corner?: "tl" | "tr" | "bl" | "br";
  className?: string;
}) {
  const flip = {
    tl: "",
    tr: "scale(-1 1) translate(-260 0)",
    bl: "scale(1 -1) translate(0 -260)",
    br: "scale(-1 -1) translate(-260 -260)",
  }[corner];
  return (
    <svg viewBox="0 0 260 260" className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <g transform={flip}>
        {/* baby's breath clouds, behind everything */}
        <BabysBreath x={30} y={16} angle={-6} len={62} seed={4} />
        <BabysBreath x={22} y={32} angle={24} len={58} seed={9} />
        <BabysBreath x={16} y={42} angle={80} len={62} seed={15} />
        <BabysBreath x={50} y={62} angle={46} len={50} seed={21} />

        {/* stems, all gathered toward the corner */}
        <g fill="none" stroke="var(--leaf)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M-6 -6 C30 30 60 58 92 84" />
          <path d="M-6 -6 C40 12 92 28 146 42" />
          <path d="M-6 -6 C10 50 26 98 46 148" />
          <path d="M-6 -6 C50 40 120 76 176 102" />
          <path d="M-6 -6 C24 28 70 96 98 150" />
        </g>

        {/* leaves on the stems */}
        <Leaf x={28} y={23} len={30} angle={-28} />
        <Leaf x={36} y={30} len={27} angle={64} />
        <Leaf x={62} y={20} len={26} angle={-6} />
        <Leaf x={96} y={31} len={24} angle={-34} />
        <Leaf x={14} y={58} len={28} angle={118} />
        <Leaf x={22} y={78} len={24} angle={22} />
        <Leaf x={120} y={86} len={24} angle={-12} />
        <Leaf x={140} y={92} len={20} angle={56} />
        <Leaf x={70} y={110} len={22} angle={30} />
        <Leaf x={84} y={128} len={20} angle={98} />

        {/* buds */}
        <Bud x={176} y={102} rot={68} s={1.2} />
        <Bud x={98} y={150} rot={158} s={1.05} />

        {/* the daisies */}
        <Daisy x={146} y={42} r={26} rot={14} seed={5} tilt={0.92} />
        <Daisy x={46} y={150} r={27} rot={-10} seed={11} tilt={0.94} />
        <Daisy x={94} y={86} r={36} rot={6} seed={3} />
      </g>
    </svg>
  );
}
