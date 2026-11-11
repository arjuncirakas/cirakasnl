import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import './DeployJourney.css'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const ACCENT = '#5ca1da'
const ACCENT_LIGHT = '#a5cbeb'
const INK = '#0f1b33'
const EDGE = 'rgba(15,27,51,0.55)'
const HAIR = 'rgba(15,27,51,0.14)'
const TOP = '#ffffff'
const SIDE_L = '#eff6fb'
const SIDE_R = '#deecf8'
const MUTED = '#dbeaf7'

const SCENES = [
  { step: 1, num: '01', title: 'Build', text: 'We design and develop your product around how your team works.' },
  { step: 2, num: '02', title: 'Verify', text: 'Every product ships tested, secured and ready to deploy.' },
  { step: 3, num: '03', title: 'Your choice', text: 'Run it inside your company or host it in an EU-region cloud.' },
  { step: 4, num: '04', title: 'On your premises', text: 'Installed on your own servers, fully under your control.' },
  { step: 4, num: '04', title: 'In the EU cloud', text: 'Hosted in Europe, managed by us, data stays in the region.' },
  { step: 5, num: '05', title: 'Built. Deployed. Running.', text: 'Live on your premises or in the EU cloud, ready for your team.' },
]

const SCENE_TIMES = [0, 2, 4, 5.5, 7.3, 8.8]
const DOT_TIMES = [0, 2, 4, 5.5, 8.8]
const TOTAL = 10

/* ---------- isometric helpers (true 30deg) ---------- */
const C30 = 0.866
const fmt = ([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`
const iso = (O, x, y, z = 0) => [O[0] + (x - y) * C30, O[1] + (x + y) * 0.5 - z]
const poly = (O, pts) => pts.map(([x, y, z]) => fmt(iso(O, x, y, z))).join(' ')

function boxFaces(O, x, y, z, w, d, h) {
  const x1 = x + w
  const y1 = y + d
  const z1 = z + h
  return {
    top: poly(O, [[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]]),
    left: poly(O, [[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]]),
    right: poly(O, [[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]]),
  }
}

function Box({ O, x, y, z, w, d, h, edgeClass, filter }) {
  const f = boxFaces(O, x, y, z, w, d, h)
  return (
    <g>
      <g filter={filter}>
        <polygon points={f.left} fill={SIDE_L} />
        <polygon points={f.right} fill={SIDE_R} />
        <polygon points={f.top} fill={TOP} />
      </g>
      <g className={edgeClass} fill="none" stroke={EDGE} strokeWidth="1.1" strokeLinejoin="round">
        <polygon points={f.left} />
        <polygon points={f.right} />
        <polygon points={f.top} />
      </g>
    </g>
  )
}

/* flat card standing on the y = const plane, with thickness behind it */
function slab(map, w, h, t) {
  const dx = t * C30
  const dy = t * 0.5
  const F = [[0, 0], [w, 0], [w, h], [0, h]].map(([u, v]) => map(u, v))
  const B = F.map(([x, y]) => [x + dx, y - dy])
  const P = (a) => a.map(fmt).join(' ')
  return { face: P(F), top: P([F[0], F[1], B[1], B[0]]), right: P([F[1], F[2], B[2], B[1]]) }
}


/* ---------- layout constants ---------- */
const HUB = [400, 320] // ground hub where the product starts its journey
const OFF = [175, 375] // office floor, back corner
const OF = 150
const OH = 165
const PLT = [625, 390] // cloud platform, back corner (ground level)
const PF = 120
const PZ = 50
const PATH_L = 'M400 320L175 450'
const PATH_R = 'M400 320L625 450'

const WIN = (u, v) => [292 + C30 * u, 110 + 0.5 * u + v]
const WIN_SLAB = slab(WIN, 250, 165, 8)
const TILE = (u, v) => [-48.5 + C30 * u, -72 + 0.5 * u + v]
const TILE_SLAB = slab(TILE, 112, 88, 6)

const EU_MAP = [
  '..........###...........',
  '.........#####.#........',
  '...##....####.###.......',
  '..###...#####..###......',
  '..##....####..#####.....',
  '.........###.#######....',
  '...#...######.######....',
  '..###.#########.#####...',
  '..##.###########.####...',
  '.#...##########..###....',
  '.###.#########...##.....',
  '.###.######.##..........',
  '.###..####...#..........',
  '.##...##.....#..........',
  '.......#................',
]
const EU_DOTS = []
EU_MAP.forEach((row, r) => {
  row.split('').forEach((ch, c) => {
    if (ch === '#') EU_DOTS.push([c * 7.5, r * 7.5])
  })
})

/* ---------- drawing pieces ---------- */
function Defs() {
  return (
    <defs>
      <filter id="dj-soft" x="-40%" y="-40%" width="180%" height="190%">
        <feDropShadow dx="0" dy="16" stdDeviation="13" floodColor={INK} floodOpacity="0.1" />
      </filter>
      <filter id="dj-glow" x="-300%" y="-300%" width="700%" height="700%">
        <feGaussianBlur stdDeviation="3.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="dj-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
  )
}

function AppWindow() {
  return (
    <g transform="translate(400 255)">
    <g className="dj-window">
    <g transform="translate(-400 -255)">
      <g className="dj-win-side">
        <polygon points={WIN_SLAB.top} fill={SIDE_L} stroke={EDGE} strokeWidth="1" strokeLinejoin="round" />
        <polygon points={WIN_SLAB.right} fill={SIDE_R} stroke={EDGE} strokeWidth="1" strokeLinejoin="round" />
      </g>
      <polygon className="dj-win-face" points={WIN_SLAB.face} fill={TOP} filter="url(#dj-soft)" />
      <g transform="translate(292 110) matrix(0.866 0.5 0 1 0 0)">
        <path className="dj-draw dj-win-frame" pathLength="1" d="M0 0H250V165H0Z" fill="none" stroke={EDGE} strokeWidth="1.2" strokeLinejoin="round" />
        <path className="dj-draw dj-win-line" pathLength="1" d="M0 26H250" fill="none" stroke={HAIR} strokeWidth="1" />
        <path className="dj-draw dj-win-line" pathLength="1" d="M58 26V165" fill="none" stroke={HAIR} strokeWidth="1" />
        <circle className="dj-win-dot" cx="14" cy="13" r="2.8" fill={ACCENT} />
        <circle className="dj-win-dot" cx="25" cy="13" r="2.8" fill={MUTED} />
        <circle className="dj-win-dot" cx="36" cy="13" r="2.8" fill={MUTED} />
        <rect className="dj-win-dot" x="198" y="10.5" width="38" height="5" rx="2.5" fill={MUTED} />

        <g className="dj-ui">
          <g transform="translate(19.5 36) scale(0.3)"><LayerPaths /></g>
          <rect x="14" y="68" width="30" height="5" rx="2.5" fill={ACCENT} />
          <rect x="14" y="84" width="30" height="5" rx="2.5" fill={MUTED} />
          <rect x="14" y="100" width="30" height="5" rx="2.5" fill={MUTED} />
          <rect x="14" y="116" width="30" height="5" rx="2.5" fill={MUTED} />
        </g>
        <g className="dj-ui">
          <rect x="74" y="38" width="72" height="6" rx="3" fill={INK} fillOpacity="0.85" />
          <rect x="74" y="50" width="112" height="4" rx="2" fill={MUTED} />
        </g>
        {[74, 132, 190].map((x, i) => (
          <g className="dj-ui" key={x}>
            <rect x={x} y="64" width="50" height="34" fill="#f7fafd" stroke={HAIR} strokeWidth="1" />
            <rect x={x + 8} y="73" width="16" height="4" rx="2" fill={i === 0 ? ACCENT : '#c1dbf1'} />
            <rect x={x + 8} y="83" width="32" height="6" rx="2" fill={INK} fillOpacity="0.8" />
          </g>
        ))}
        <g className="dj-ui">
          <rect x="74" y="108" width="166" height="48" fill="#f7fafd" stroke={HAIR} strokeWidth="1" />
        </g>
        {[12, 20, 15, 28, 22, 33, 26].map((h, i) => (
          <rect key={i} className="dj-bar" x={84 + i * 21.5} y={149 - h} width="10" height={h} fill={i === 6 ? ACCENT : INK} fillOpacity={i === 6 ? 1 : 0.8} />
        ))}
      </g>
    </g>
    </g>
    </g>
  )
}

function AppTile({ cls, shadow }) {
  return (
    <>
      <ellipse className={`dj-tsh ${shadow}`} cx={HUB[0]} cy={HUB[1] + 2} rx="58" ry="28" fill={INK} fillOpacity="0.14" filter="url(#dj-blur)" />
      <g className={cls}>
        <g className="dj-tile-float">
          <polygon points={TILE_SLAB.top} fill={SIDE_L} stroke={EDGE} strokeWidth="1" strokeLinejoin="round" />
          <polygon points={TILE_SLAB.right} fill={SIDE_R} stroke={EDGE} strokeWidth="1" strokeLinejoin="round" />
          <polygon points={TILE_SLAB.face} fill={TOP} filter="url(#dj-soft)" />
          <g transform="translate(-48.5 -72) matrix(0.866 0.5 0 1 0 0)">
            <path d="M0 0H112V88H0Z" fill="none" stroke={EDGE} strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M0 19H112" fill="none" stroke={HAIR} strokeWidth="1" />
            <circle cx="10" cy="9.5" r="2.4" fill={ACCENT} />
            <circle cx="19" cy="9.5" r="2.4" fill={MUTED} />
            <circle cx="28" cy="9.5" r="2.4" fill={MUTED} />
            <g transform="translate(38.7 27.5) scale(0.54)"><LayerPaths /></g>
            <rect x="16" y="68" width="80" height="4" rx="2" fill={SIDE_R} />
            <rect x="16" y="68" width="52" height="4" rx="2" fill={ACCENT} />
            <rect x="16" y="76" width="44" height="3.5" rx="1.75" fill={MUTED} />
          </g>
        </g>
      </g>
    </>
  )
}

function Pill({ x, y, label, index }) {
  return (
    <g className="dj-pill">
      <g transform={`translate(${x} ${y})`}>
        <rect width="118" height="30" rx="15" fill="#fff" stroke={HAIR} strokeWidth="1" filter="url(#dj-soft)" />
        <circle className={`dj-tick-dot-${index}`} cx="17" cy="15" r="6.5" fill="#eceae6" stroke="rgba(15,27,51,0.25)" strokeWidth="1" />
        <path className={`dj-draw dj-tick-mark-${index}`} pathLength="1" d="M13.8 15.2l2.4 2.5 4.4-5.2" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="32" y="19.3" fontSize="10.5" fontWeight="700" letterSpacing="0.14em" fill={INK}>
          {label}
        </text>
      </g>
    </g>
  )
}

function OfficeBase() {
  const wallA = poly(OFF, [[0, 0, 8], [0, OF, 8], [0, OF, OH], [0, 0, OH]])
  const wallB = poly(OFF, [[0, 0, 8], [OF, 0, 8], [OF, 0, OH], [0, 0, OH]])
  const roof = poly(OFF, [[0, 0, OH], [OF, 0, OH], [OF, OF, OH], [0, OF, OH]])
  const posts = [[0, 0], [OF, 0], [0, OF], [OF, OF]]
  return (
    <g className="dj-dest">
      <g fill="rgba(255,255,255,0.34)" stroke={HAIR} strokeWidth="1" strokeLinejoin="round">
        <polygon points={wallA} />
        <polygon points={wallB} />
      </g>
      <Box O={OFF} x={0} y={0} z={0} w={OF} d={OF} h={8} filter="url(#dj-soft)" />
      <g fill="none" stroke="rgba(15,27,51,0.07)" strokeWidth="1">
        {[50, 100].map((k) => (
          <g key={k}>
            <polyline points={poly(OFF, [[k, 0, 8], [k, OF, 8]])} />
            <polyline points={poly(OFF, [[0, k, 8], [OF, k, 8]])} />
          </g>
        ))}
      </g>
      <g fill="none" stroke="rgba(15,27,51,0.26)" strokeWidth="1" strokeLinejoin="round">
        <polygon points={roof} />
        {posts.map(([x, y]) => (
          <line key={`${x}-${y}`} x1={iso(OFF, x, y, 8)[0]} y1={iso(OFF, x, y, 8)[1]} x2={iso(OFF, x, y, OH)[0]} y2={iso(OFF, x, y, OH)[1]} />
        ))}
      </g>
    </g>
  )
}

const RX0 = 53
const RX1 = 97
const RACK_UNITS = [0, 1, 2, 3, 4]

function Rack() {
  return (
    <g className="dj-dest">
      <Box O={OFF} x={RX0} y={RX0} z={8} w={RX1 - RX0} d={RX1 - RX0} h={150} edgeClass="dj-live-edge" filter="url(#dj-soft)" />
      {RACK_UNITS.map((i) => {
        const z0 = 18 + i * 27
        const face = poly(OFF, [[RX1, RX0 + 4, z0], [RX1, RX1 - 4, z0], [RX1, RX1 - 4, z0 + 21], [RX1, RX0 + 4, z0 + 21]])
        const led = iso(OFF, RX1, RX0 + 10, z0 + 10.5)
        const v1 = iso(OFF, RX1, RX0 + 17, z0 + 8)
        const v2 = iso(OFF, RX1, RX1 - 9, z0 + 8)
        const v3 = iso(OFF, RX1, RX0 + 17, z0 + 13)
        const v4 = iso(OFF, RX1, RX1 - 9, z0 + 13)
        return (
          <g key={i}>
            <polygon points={face} fill="#f5f9fd" stroke="rgba(15,27,51,0.22)" strokeWidth="1" />
            {i === 2 && <polygon className="dj-slot" points={face} fill="rgba(92,161,218,0.14)" stroke={ACCENT} strokeWidth="1.2" />}
            <line x1={v1[0]} y1={v1[1]} x2={v2[0]} y2={v2[1]} stroke="rgba(15,27,51,0.2)" strokeWidth="1" />
            <line x1={v3[0]} y1={v3[1]} x2={v4[0]} y2={v4[1]} stroke="rgba(15,27,51,0.2)" strokeWidth="1" />
            <circle className="dj-led" cx={led[0]} cy={led[1]} r="2.2" fill="#c1dbf1" />
          </g>
        )
      })}
    </g>
  )
}

function Platform() {
  const inset = poly(PLT, [[18, 18, PZ + 10], [PF - 18, 18, PZ + 10], [PF - 18, PF - 18, PZ + 10], [18, PF - 18, PZ + 10]])
  const c = iso(PLT, PF / 2, PF / 2, PZ + 10)
  return (
    <g className="dj-dest">
      <ellipse cx="625" cy="462" rx="78" ry="34" fill={INK} fillOpacity="0.09" filter="url(#dj-blur)" />
      <Box O={PLT} x={0} y={0} z={PZ} w={PF} d={PF} h={10} edgeClass="dj-live-edge" filter="url(#dj-soft)" />
      <polygon points={inset} fill="none" stroke="rgba(15,27,51,0.16)" strokeWidth="1" strokeLinejoin="round" />
      {[0, 1, 2].map((i) => {
        const p = iso(PLT, 22 + i * 10, PF, PZ + 5)
        return <circle key={i} className="dj-led-plt" cx={p[0]} cy={p[1]} r="1.7" fill={i === 0 ? ACCENT : '#c1dbf1'} />
      })}
      <line x1={c[0]} y1={c[1] - 6} x2="625" y2="302" stroke="rgba(15,27,51,0.28)" strokeWidth="1" strokeDasharray="2 4" />
      <path
        className="dj-cloud dj-live-edge"
        d="M571 298A22 22 0 0 1 574 254A30 30 0 0 1 632 240A24 24 0 0 1 678 262A20 20 0 0 1 679 298Z"
        fill="#fff"
        stroke={EDGE}
        strokeWidth="1.2"
        strokeLinejoin="round"
        filter="url(#dj-soft)"
      />
      <g stroke="rgba(15,27,51,0.2)" strokeWidth="1" strokeLinecap="round">
        <line x1="602" y1="272" x2="648" y2="272" />
        <line x1="610" y1="282" x2="640" y2="282" />
      </g>
    </g>
  )
}

function EuMap() {
  return (
    <g className="dj-eu" transform="matrix(0.866 0.5 -0.866 0.5 593 441)">
      {EU_DOTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="rgba(15,27,51,0.3)" />
      ))}
      <g className="dj-pin">
        <circle className="dj-pin-ring" cx="82.5" cy="45" r="5" fill="none" stroke={ACCENT} strokeWidth="1.2" />
        <circle cx="82.5" cy="45" r="3.4" fill={ACCENT} filter="url(#dj-glow)" />
      </g>
    </g>
  )
}

function Rails() {
  return (
    <g>
      <g className="dj-hub">
        <ellipse cx={HUB[0]} cy={HUB[1]} rx="16" ry="9.2" fill="#fff" stroke={EDGE} strokeWidth="1" />
        <circle cx={HUB[0]} cy={HUB[1]} r="2.6" fill={ACCENT} />
      </g>
      <path className="dj-draw dj-rail" pathLength="1" d={PATH_L} fill="none" stroke="rgba(15,27,51,0.3)" strokeWidth="1.1" strokeLinecap="round" />
      <path className="dj-draw dj-rail" pathLength="1" d={PATH_R} fill="none" stroke="rgba(15,27,51,0.3)" strokeWidth="1.1" strokeLinecap="round" />
      <path className="dj-draw dj-rail-live" pathLength="1" d={PATH_L} fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" filter="url(#dj-glow)" />
      <path className="dj-draw dj-rail-live" pathLength="1" d={PATH_R} fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" filter="url(#dj-glow)" />
      <path id="dj-path-left" d={PATH_L} fill="none" stroke="none" />
      <path id="dj-path-right" d={PATH_R} fill="none" stroke="none" />
      <g className="dj-pulse dj-pulse-l">
        <circle r="8" fill={ACCENT} fillOpacity="0.18" />
        <circle r="2.8" fill={ACCENT} filter="url(#dj-glow)" />
      </g>
      <g className="dj-pulse dj-pulse-r">
        <circle r="8" fill={ACCENT} fillOpacity="0.18" />
        <circle r="2.8" fill={ACCENT} filter="url(#dj-glow)" />
      </g>
    </g>
  )
}

function Labels() {
  return (
    <g>
      <g className="dj-label">
        <text x="175" y="600" textAnchor="middle">Your premises</text>
      </g>
      <g className="dj-label">
        <text x="625" y="600" textAnchor="middle">EU cloud region</text>
      </g>
    </g>
  )
}

function LiveBadge() {
  return (
    <g className="dj-badge">
      <rect x="-58" y="-18" width="116" height="36" rx="18" fill="#fff" stroke={ACCENT} strokeWidth="1.2" filter="url(#dj-soft)" />
      <circle className="dj-badge-ring" cx="-32" cy="0" r="4.5" fill="none" stroke={ACCENT} strokeWidth="1.2" />
      <circle cx="-32" cy="0" r="4.5" fill={ACCENT} filter="url(#dj-glow)" />
      <text x="-18" y="4.5" fontSize="12" fontWeight="700" letterSpacing="0.16em" fill={INK}>
        LIVE
      </text>
    </g>
  )
}

/* layered mark: three stacked isometric layers */
function LayerPaths() {
  return (
    <>
      <path d="M6 45L32 58L58 45" fill="none" stroke={ACCENT_LIGHT} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 32L32 45L58 32" fill="none" stroke={ACCENT_LIGHT} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 5L58 18L32 31L6 18Z" fill={ACCENT} stroke={ACCENT} strokeWidth="4" strokeLinejoin="round" />
    </>
  )
}

function LayersIcon() {
  return (
    <svg className="dj-mark" viewBox="0 0 64 64" aria-hidden="true">
      <LayerPaths />
    </svg>
  )
}

/* ---------- timeline ---------- */
function setInitial(q) {
  gsap.set(q('.dj-draw'), { strokeDasharray: 1, strokeDashoffset: 1 })
  gsap.set(q('.dj-window'), { scale: 1, opacity: 1 })
  gsap.set(q('.dj-win-face, .dj-win-side, .dj-win-dot'), { opacity: 0 })
  gsap.set(q('.dj-ui'), { opacity: 0, y: 10 })
  gsap.set(q('.dj-bar'), { scaleY: 0, transformOrigin: '50% 100%' })
  gsap.set(q('.dj-tile-a'), { x: 400, y: 240, scale: 0.55, opacity: 0 })
  gsap.set(q('.dj-tile-b'), { x: 400, y: 225, scale: 0.6, opacity: 0 })
  gsap.set(q('.dj-tsh'), { opacity: 0 })
  gsap.set(q('.dj-pill'), { opacity: 0, x: -10 })
  gsap.set(q('.dj-ring-track, .dj-ring'), { opacity: 0 })
  gsap.set(q('.dj-hub, .dj-eu, .dj-pin, .dj-pulse, .dj-slot, .dj-label'), { opacity: 0 })
  gsap.set(q('.dj-dest'), { opacity: 0, y: 14 })
  gsap.set(q('.dj-badge'), { x: 400, y: 320, scale: 0.85, opacity: 0 })
}

function buildTimeline(root, tl, cta) {
  const q = gsap.utils.selector(root)
  setInitial(q)
  const tileA = q('.dj-tile-a')
  const tileB = q('.dj-tile-b')
  if (cta) gsap.set(cta, { opacity: 0, y: 12, visibility: 'hidden', pointerEvents: 'none' })

  // 01 BUILD
  tl.addLabel('build', 0)
    .to(q('.dj-win-frame'), { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 'build')
    .to(q('.dj-win-line'), { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 'build+=0.45')
    .to(q('.dj-win-face'), { opacity: 1, duration: 0.6, ease: 'power2.out' }, 'build+=0.55')
    .to(q('.dj-win-side'), { opacity: 1, duration: 0.6, ease: 'power2.out' }, 'build+=0.7')
    .to(q('.dj-win-dot'), { opacity: 1, duration: 0.25, stagger: 0.07, ease: 'power2.out' }, 'build+=0.85')
    .to(q('.dj-ui'), { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, 'build+=1.0')
    .to(q('.dj-bar'), { scaleY: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' }, 'build+=1.25')

  // 02 VERIFY
  tl.addLabel('package', 2)
    .to(q('.dj-window'), { scale: 0.42, opacity: 0, duration: 0.8, ease: 'power3.inOut' }, 'package')
    .to(tileA, { opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out' }, 'package+=0.5')
    .to(q('.dj-tsh-a'), { opacity: 1, duration: 0.6, ease: 'power2.out' }, 'package+=0.6')
    .to(q('.dj-ring-track'), { opacity: 1, duration: 0.4, ease: 'power2.out' }, 'package+=0.8')
    .to(q('.dj-pill'), { opacity: 1, x: 0, duration: 0.4, stagger: 0.28, ease: 'power3.out' }, 'package+=0.85')
    .to(q('.dj-ring'), { opacity: 1, strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 'package+=0.95')
  ;[0, 1, 2].forEach((i) => {
    tl.to(q(`.dj-tick-dot-${i}`), { fill: ACCENT, stroke: ACCENT, duration: 0.15, ease: 'power2.out' }, `package+=${1.2 + i * 0.3}`)
      .to(q(`.dj-tick-mark-${i}`), { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, `package+=${1.25 + i * 0.3}`)
  })

  // 03 YOUR CHOICE
  tl.addLabel('choice', 4)
    .to(q('.dj-pill, .dj-ring, .dj-ring-track'), { opacity: 0, duration: 0.4, ease: 'power2.in' }, 'choice')
    .to(tileA, { y: 225, duration: 0.7, ease: 'power3.inOut' }, 'choice+=0.1')
    .to(q('.dj-hub'), { opacity: 1, duration: 0.4, ease: 'power2.out' }, 'choice+=0.45')
    .to(q('.dj-rail'), { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 'choice+=0.6')
    .to(q('.dj-dest'), { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out' }, 'choice+=0.7')
    .to(q('.dj-label'), { opacity: 1, duration: 0.5, ease: 'power2.out' }, 'choice+=1.05')
    .to(q('.dj-pulse'), { opacity: 1, duration: 0.3, ease: 'power2.out' }, 'choice+=1.2')

  // 04a ON YOUR PREMISES
  tl.addLabel('premises', 5.5)
    .to(q('.dj-tsh-a'), { opacity: 0, duration: 0.4, ease: 'power2.in' }, 'premises')
    .to(tileA, { x: 192, y: 372, scale: 0.5, duration: 1.2, ease: 'power3.inOut' }, 'premises')
    .to(q('.dj-slot'), { opacity: 1, duration: 0.3, ease: 'power2.out' }, 'premises+=1.0')
    .to(tileA, { scale: 0.32, opacity: 0, duration: 0.3, ease: 'power2.in' }, 'premises+=1.1')
    .to(q('.dj-led'), { fill: ACCENT, duration: 0.2, stagger: 0.06, ease: 'power2.out' }, 'premises+=1.25')
    .to(tileB, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 'premises+=0.9')
    .to(q('.dj-tsh-b'), { opacity: 1, duration: 0.5, ease: 'power2.out' }, 'premises+=0.95')

  // 04b IN THE EU CLOUD
  tl.addLabel('cloud', 7.3)
    .to(q('.dj-eu'), { opacity: 1, duration: 0.7, ease: 'power2.out' }, 'cloud-=0.1')
    .to(q('.dj-tsh-b'), { opacity: 0, duration: 0.4, ease: 'power2.in' }, 'cloud')
    .to(tileB, { x: 625, y: 358, scale: 0.52, duration: 1.1, ease: 'power3.inOut' }, 'cloud')
    .to(q('.dj-pin'), { opacity: 1, duration: 0.4, ease: 'power2.out' }, 'cloud+=0.9')
    .to(tileB, { y: 364, scale: 0.3, opacity: 0, duration: 0.3, ease: 'power2.in' }, 'cloud+=1.1')
    .to(q('.dj-led-plt'), { fill: ACCENT, duration: 0.2, stagger: 0.06, ease: 'power2.out' }, 'cloud+=1.2')

  // 05 LIVE
  tl.addLabel('live', 8.8)
    .to(q('.dj-rail-live'), { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 'live')
    .to(q('.dj-live-edge'), { stroke: ACCENT, duration: 0.5, ease: 'power2.out' }, 'live')
    .to(q('.dj-hub'), { opacity: 0, duration: 0.3, ease: 'power2.in' }, 'live+=0.2')
    .to(q('.dj-badge'), { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 'live+=0.25')
    .to(cta, { opacity: 1, y: 0, visibility: 'visible', pointerEvents: 'auto', duration: 0.45, ease: 'power2.out' }, 'live+=0.4')
    .to({}, { duration: 0.001 }, TOTAL - 0.001)
}

function startIdle(root) {
  const q = gsap.utils.selector(root)
  gsap.to(q('.dj-tile-float'), { y: -4, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  const follow = (sel, path, delay) =>
    gsap.to(q(sel), {
      duration: 3.2,
      repeat: -1,
      delay,
      ease: 'power1.inOut',
      repeatDelay: 0.4,
      motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
    })
  follow('.dj-pulse-l', '#dj-path-left', 0)
  follow('.dj-pulse-r', '#dj-path-right', 1.8)
  gsap.to(q('.dj-pin-ring'), { attr: { r: 14 }, opacity: 0, duration: 1.8, repeat: -1, ease: 'power1.out' })
  gsap.to(q('.dj-badge-ring'), { attr: { r: 11 }, opacity: 0, duration: 1.8, repeat: -1, ease: 'power1.out' })
}

export default function DeployJourney() {
  const rootRef = useRef(null)
  const progressRef = useRef(null)
  const ctaRef = useRef(null)
  const [scene, setScene] = useState(0)

  useLayoutEffect(() => {
    const root = rootRef.current
    const cta = ctaRef.current
    if (!root) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const refresh = () => ScrollTrigger.refresh()

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        paused: reduceMotion,
        scrollTrigger: reduceMotion
          ? undefined
          : {
              trigger: root,
              start: 'top top',
              end: mobile ? '+=300%' : '+=500%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
      })

      buildTimeline(root, tl, cta)

      const update = () => {
        const t = tl.time()
        let idx = 0
        SCENE_TIMES.forEach((s, i) => {
          if (t >= s - 0.001) idx = i
        })
        setScene(idx)

        let frac = 0
        for (let j = 0; j < DOT_TIMES.length - 1; j += 1) {
          const a = DOT_TIMES[j]
          const b = DOT_TIMES[j + 1]
          if (t <= b || j === DOT_TIMES.length - 2) {
            frac = (j + Math.min(1, Math.max(0, (t - a) / (b - a)))) / (DOT_TIMES.length - 1)
            break
          }
        }
        frac = Math.min(1, Math.max(0, frac))
        if (progressRef.current) progressRef.current.style.setProperty('--dj-p', frac.toFixed(3))
        if (cta) cta.style.pointerEvents = t >= 9.15 ? 'auto' : 'none'
      }

      tl.eventCallback('onUpdate', update)

      if (reduceMotion) {
        tl.progress(1)
        gsap.set(cta, { opacity: 1, y: 0, visibility: 'visible', pointerEvents: 'auto' })
        update()
      } else {
        update()
        startIdle(root)
      }

      window.addEventListener('load', refresh)
      if (document.fonts?.ready) document.fonts.ready.then(refresh)
      requestAnimationFrame(() => requestAnimationFrame(refresh))
    }, root)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [])

  const active = SCENES[scene]
  const activeDot = active.step

  return (
    <section className="deploy-journey" id="how-it-works" ref={rootRef} aria-label="How a Cirakas product is built and deployed">
      <div className="dj-sticky">
        <ol className="dj-progress" ref={progressRef} aria-hidden="true">
          <span className="dj-progress-track" />
          <span className="dj-progress-fill" />
          {[1, 2, 3, 4, 5].map((n) => (
            <li key={n} className={`${n <= activeDot ? 'is-on' : ''}${n === activeDot ? ' is-active' : ''}`}>
              <i />
              <b>{`0${n}`}</b>
            </li>
          ))}
        </ol>

        <div className="dj-left">
          <div className="dj-tag">
            <LayersIcon />
            <span>How we operate</span>
          </div>

          <div className="dj-copy" aria-live="polite">
            {SCENES.map((s, i) => (
              <div key={s.title} className={`dj-scene${i === scene ? ' is-active' : ''}`}>
                <span className="dj-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>

          <a className="dj-cta" href="#products" ref={ctaRef}>
            <span>See Our Products</span>
            <span className="dj-cta-arrow">{'\u2197'}</span>
          </a>
        </div>

        <div className="dj-stage">
          <svg viewBox="20 70 760 570" role="img" aria-label="A product is built, verified, then delivered to your own servers or an EU-region cloud">
            <Defs />
            <EuMap />
            <OfficeBase />
            <Rails />
            <Rack />
            <Platform />
            <Labels />

            <AppWindow />

            <ellipse className="dj-ring-track" cx={HUB[0]} cy={HUB[1]} rx="104" ry="60" fill="none" stroke={HAIR} strokeWidth="1" />
            <ellipse className="dj-draw dj-ring" pathLength="1" cx={HUB[0]} cy={HUB[1]} rx="104" ry="60" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" filter="url(#dj-glow)" />
            <Pill x={528} y={218} label="TESTED" index={0} />
            <Pill x={528} y={258} label="SECURED" index={1} />
            <Pill x={528} y={298} label="READY" index={2} />

            <AppTile cls="dj-tile-b" shadow="dj-tsh-b" />
            <AppTile cls="dj-tile-a" shadow="dj-tsh-a" />
            <LiveBadge />
          </svg>
        </div>
      </div>
    </section>
  )
}
