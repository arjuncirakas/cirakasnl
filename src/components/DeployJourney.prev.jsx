import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import './DeployJourney.css'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const ACCENT = '#f26531'
const INK = '#1c1410'
const STROKE = 'rgba(28,20,16,0.85)'
const STROKE_SOFT = 'rgba(28,20,16,0.4)'
const TOP = '#ffffff'
const SIDE_L = '#f1efeb'
const SIDE_R = '#e6e3de'

const SCENES = [
  { step: 1, num: '01', title: 'Build', text: 'We design and develop your product around how your team works.' },
  { step: 2, num: '02', title: 'Package', text: 'Every product ships tested, secured and ready to deploy.' },
  { step: 3, num: '03', title: 'Your choice', text: 'Run it inside your company or host it in an EU-region cloud.' },
  { step: 4, num: '04', title: 'On your premises', text: 'Installed on your own servers, fully under your control.' },
  { step: 4, num: '04', title: 'In the EU cloud', text: 'Hosted in Europe, managed by us, data stays in the region.' },
  { step: 5, num: '05', title: 'Built. Deployed. Running.', text: 'Live on your premises or in the EU cloud, ready for your team.' },
]

const SCENE_TIMES = [0, 2, 4, 5.5, 7.3, 8.8]
const DOT_TIMES = [0, 2, 4, 5.5, 8.8]
const TOTAL = 10

/* 30° isometric */
const COS = Math.sqrt(3) / 2
const SIN = 0.5

function iso(x, y, z, ox = 0, oy = 0) {
  return [ox + (x - z) * COS, oy + y + (x + z) * SIN]
}

function pts(arr) {
  return arr.map((p) => p.join(',')).join(' ')
}

function box(ox, oy, w, d, h) {
  const hw = w / 2
  const hd = d / 2
  const B = {
    fl: iso(-hw, 0, hd, ox, oy),
    fr: iso(hw, 0, hd, ox, oy),
    br: iso(hw, 0, -hd, ox, oy),
    bl: iso(-hw, 0, -hd, ox, oy),
  }
  const T = {
    fl: iso(-hw, -h, hd, ox, oy),
    fr: iso(hw, -h, hd, ox, oy),
    br: iso(hw, -h, -hd, ox, oy),
    bl: iso(-hw, -h, -hd, ox, oy),
  }
  return {
    right: pts([B.fr, B.br, T.br, T.fr]),
    left: pts([B.fl, B.fr, T.fr, T.fl]),
    top: pts([T.fl, T.fr, T.br, T.bl]),
    front: `M${B.fl.join(' ')}L${B.fr.join(' ')}L${T.fr.join(' ')}`,
  }
}

const RACK = box(190, 430, 58, 48, 120)
const SLAB = box(610, 400, 110, 70, 14)

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
    if (ch === '#') {
      const [x, y] = iso((c - 11) * 4.5, 0, (r - 7) * 4.5, 610, 445)
      EU_DOTS.push([x, y])
    }
  })
})
const PIN = EU_DOTS[48] || [620, 448]

const PATH_L = 'M400 250 V290 L190 400'
const PATH_R = 'M400 250 V290 L610 400'

function AsteriskIcon() {
  return (
    <svg className="dj-asterisk" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4v56M8.5 18.5l47 27M8.5 45.5l47-27M4 32h56" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  )
}

function Defs() {
  return (
    <defs>
      <filter id="dj-shadow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
      <filter id="dj-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="dj-fade" cx="50%" cy="48%" r="55%">
        <stop offset="0%" stopColor="#000" stopOpacity="1" />
        <stop offset="75%" stopColor="#000" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <mask id="dj-floor-mask">
        <rect width="800" height="600" fill="url(#dj-fade)" />
      </mask>
    </defs>
  )
}

function Floor() {
  const dots = []
  for (let x = -10; x <= 10; x += 1) {
    for (let z = -8; z <= 8; z += 1) {
      const [sx, sy] = iso(x * 26, 0, z * 26, 400, 470)
      dots.push(<circle key={`${x}-${z}`} cx={sx} cy={sy} r="1.2" fill={INK} fillOpacity="0.12" />)
    }
  }
  return (
    <g className="dj-floor" mask="url(#dj-floor-mask)">
      {dots}
    </g>
  )
}

function IsoBox({ faces, className = '' }) {
  return (
    <g className={className}>
      <polygon points={faces.right} fill={SIDE_R} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
      <polygon points={faces.left} fill={SIDE_L} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
      <polygon points={faces.top} fill={TOP} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
    </g>
  )
}

/** Full app window — scene 01 */
function AppWindow() {
  return (
    <g className="dj-window" style={{ transformOrigin: '400px 300px' }}>
      <ellipse className="dj-shadow" cx="400" cy="405" rx="120" ry="18" fill={INK} opacity="0.12" filter="url(#dj-shadow)" />

      {/* thickness / side */}
      <path d="M540 210 L552 218 V400 L540 392 Z" fill={SIDE_R} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" className="dj-win-side" opacity="0" />
      <path d="M260 210 L540 210 L552 218 L272 218 Z" fill={SIDE_L} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" className="dj-win-topedge" opacity="0" />

      <rect className="dj-win-face" x="260" y="210" width="280" height="190" rx="10" fill={TOP} stroke={STROKE} strokeWidth="1.25" opacity="0" />
      <path className="dj-draw dj-win-frame" pathLength="1" d="M270 220 H530 V390 H270 Z" fill="none" stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
      <path className="dj-draw dj-win-line" pathLength="1" d="M270 248 H530" fill="none" stroke={STROKE_SOFT} strokeWidth="0.75" />
      <path className="dj-draw dj-win-line" pathLength="1" d="M328 248 V390" fill="none" stroke={STROKE_SOFT} strokeWidth="0.75" />

      <circle className="dj-win-dot" cx="286" cy="234" r="3.5" fill={ACCENT} opacity="0" />
      <circle className="dj-win-dot" cx="299" cy="234" r="3.5" fill="#c9c3bb" opacity="0" />
      <circle className="dj-win-dot" cx="312" cy="234" r="3.5" fill="#c9c3bb" opacity="0" />

      <g className="dj-ui">
        <rect x="280" y="262" width="38" height="7" rx="3.5" fill={ACCENT} />
        <rect x="280" y="278" width="38" height="7" rx="3.5" fill="#d9d4cc" />
        <rect x="280" y="294" width="38" height="7" rx="3.5" fill="#d9d4cc" />
        <rect x="280" y="310" width="38" height="7" rx="3.5" fill="#d9d4cc" />
      </g>

      {[0, 1, 2].map((i) => (
        <g key={i} className="dj-ui">
          <rect x={340 + i * 62} y="260" width="54" height="42" rx="6" fill="#f7f6f3" stroke={STROKE_SOFT} strokeWidth="0.75" />
          <rect x={348 + i * 62} y="268" width="20" height="5" rx="2.5" fill={i === 0 ? ACCENT : '#b9b3ac'} />
          <rect x={348 + i * 62} y="282" width="36" height="6" rx="3" fill="#d9d4cc" />
        </g>
      ))}

      <g className="dj-ui">
        <rect x="340" y="312" width="178" height="68" rx="6" fill={TOP} stroke={STROKE_SOFT} strokeWidth="0.75" />
      </g>

      {[24, 36, 28, 48, 40].map((h, i) => (
        <rect
          key={i}
          className="dj-bar"
          x={352 + i * 30}
          y={370 - h}
          width="16"
          height={h}
          rx="3"
          fill={i === 4 ? ACCENT : INK}
          opacity={i === 4 ? 1 : 0.75}
        />
      ))}
    </g>
  )
}

/** Compact app tile — same visual language as the window, shrunk */
function AppTile({ className }) {
  return (
    <g className={className} style={{ transformOrigin: '0px 0px' }}>
      <g className="dj-tile-float" transform="translate(-48 -36)">
        <ellipse cx="48" cy="78" rx="40" ry="8" fill={INK} opacity="0.12" filter="url(#dj-shadow)" className="dj-tile-shadow" />
        {/* slight thickness */}
        <path d="M88 8 L96 13 V65 L88 60 Z" fill={SIDE_R} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
        <path d="M8 8 H88 L96 13 H16 Z" fill={SIDE_L} stroke={STROKE} strokeWidth="1.25" strokeLinejoin="round" />
        <rect x="8" y="8" width="80" height="52" rx="8" fill={TOP} stroke={STROKE} strokeWidth="1.25" />
        {/* header */}
        <line x1="8" y1="22" x2="88" y2="22" stroke={STROKE_SOFT} strokeWidth="0.75" />
        <circle cx="18" cy="15" r="2.4" fill={ACCENT} />
        <circle cx="26" cy="15" r="2.4" fill="#c9c3bb" />
        <circle cx="34" cy="15" r="2.4" fill="#c9c3bb" />
        {/* asterisk mark */}
        <g transform="translate(48 40)" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round">
          <path d="M0-10v20M-8.5-5l17 10M-8.5 5l17-10M-10 0h20" transform="scale(0.55)" />
        </g>
        {/* mini UI bars */}
        <rect x="14" y="28" width="22" height="4" rx="2" fill={ACCENT} opacity="0.9" />
        <rect x="14" y="36" width="18" height="3.5" rx="1.75" fill="#d9d4cc" />
        <rect x="14" y="43" width="16" height="3.5" rx="1.75" fill="#d9d4cc" />
        <rect x="42" y="28" width="36" height="26" rx="4" fill="#f7f6f3" stroke={STROKE_SOFT} strokeWidth="0.75" />
        <rect x="48" y="34" width="14" height="3" rx="1.5" fill="#b9b3ac" />
        <rect x="48" y="42" width="24" height="3" rx="1.5" fill="#d9d4cc" />
      </g>
    </g>
  )
}

function Pills() {
  return (
    <g className="dj-pills" opacity="0">
      {['TESTED', 'SECURED', 'READY'].map((label, i) => (
        <g key={label} className={`dj-pill dj-pill-${i}`} transform={`translate(520 ${230 + i * 40})`}>
          <rect width="118" height="30" rx="15" fill={TOP} stroke={STROKE_SOFT} strokeWidth="0.75" />
          <circle className={`dj-tick-dot dj-tick-dot-${i}`} cx="17" cy="15" r="6.5" fill="#eceae6" stroke={STROKE_SOFT} strokeWidth="0.75" />
          <path
            className={`dj-draw dj-tick-mark dj-tick-mark-${i}`}
            pathLength="1"
            d="M13.8 15.2l2.4 2.5 4.4-5.2"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="32" y="19.5" fontSize="11" fontWeight="700" letterSpacing="0.1em" fill={INK}>
            {label}
          </text>
        </g>
      ))}
    </g>
  )
}

function Premises() {
  const slots = [16, 38, 60, 82, 104]
  return (
    <g className="dj-dest dj-premises" opacity="0">
      <ellipse cx="190" cy="448" rx="70" ry="16" fill={INK} opacity="0.12" filter="url(#dj-shadow)" />
      {/* floor tile */}
      <polygon
        points={pts([iso(-70, 0, 55, 190, 430), iso(70, 0, 55, 190, 430), iso(70, 0, -55, 190, 430), iso(-70, 0, -55, 190, 430)])}
        fill={TOP}
        stroke={STROKE_SOFT}
        strokeWidth="0.75"
        opacity="0.7"
      />
      <IsoBox faces={RACK} />
      {slots.map((v, i) => {
        const a = iso(-18, -v, 20, 190, 430)
        const b = iso(18, -v, 20, 190, 430)
        const led = iso(-24, -v, 20, 190, 430)
        const vent = iso(10, -v + 4, 22, 190, 430)
        return (
          <g key={v}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={STROKE_SOFT} strokeWidth="0.75" />
            <line x1={vent[0]} y1={vent[1]} x2={vent[0] + 10} y2={vent[1] + 5} stroke={STROKE_SOFT} strokeWidth="0.75" />
            <circle className={`dj-led dj-led-${i}`} cx={led[0]} cy={led[1]} r="2.2" fill="#c9c3bb" />
          </g>
        )
      })}
      {/* dock status light (turns on when tile arrives) */}
      <circle className="dj-dock-led dj-dock-led-premises" cx={iso(0, -112, 0, 190, 430)[0]} cy={iso(0, -112, 0, 190, 430)[1]} r="3.5" fill="#c9c3bb" />
      <text className="dj-label dj-label-premises" x="190" y="520" textAnchor="middle">
        Your premises
      </text>
    </g>
  )
}

function CloudDest() {
  return (
    <g className="dj-dest dj-cloud" opacity="0">
      <ellipse cx="610" cy="422" rx="72" ry="15" fill={INK} opacity="0.12" filter="url(#dj-shadow)" />
      <IsoBox faces={SLAB} />
      {/* minimal cloud outline */}
      <path
        className="dj-cloud-outline"
        d="M570 340 H650 A22 22 0 0 0 650 298 A32 32 0 0 0 596 292 A28 28 0 0 0 570 340 Z"
        fill={TOP}
        stroke={STROKE}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <g className="dj-eu" opacity="0">
        {EU_DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.8" fill={INK} fillOpacity="0.25" />
        ))}
        <g className="dj-pin" opacity="0">
          <circle className="dj-pin-ring" cx={PIN[0]} cy={PIN[1]} r="8" fill="none" stroke={ACCENT} strokeWidth="1.25" opacity="0.6" />
          <circle cx={PIN[0]} cy={PIN[1]} r="3.5" fill={ACCENT} filter="url(#dj-glow)" />
        </g>
      </g>
      <circle className="dj-dock-led dj-dock-led-cloud" cx={iso(0, -20, 0, 610, 400)[0]} cy={iso(0, -20, 0, 610, 400)[1]} r="3.5" fill="#c9c3bb" />
      <text className="dj-label dj-label-cloud" x="610" y="520" textAnchor="middle">
        EU cloud region
      </text>
    </g>
  )
}

function Rails() {
  return (
    <g className="dj-rails" opacity="0">
      <path className="dj-draw dj-rail dj-rail-l" pathLength="1" d={PATH_L} fill="none" stroke={ACCENT} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 6" />
      <path className="dj-draw dj-rail dj-rail-r" pathLength="1" d={PATH_R} fill="none" stroke={ACCENT} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 6" />
      <circle className="dj-pulse-dot dj-pulse-l" r="3.5" fill={ACCENT} filter="url(#dj-glow)" opacity="0" />
      <circle className="dj-pulse-dot dj-pulse-r" r="3.5" fill={ACCENT} filter="url(#dj-glow)" opacity="0" />
      <path id="dj-path-left" d={PATH_L} fill="none" stroke="none" />
      <path id="dj-path-right" d={PATH_R} fill="none" stroke="none" />
    </g>
  )
}

function LiveBadge() {
  return (
    <g className="dj-badge" opacity="0" style={{ transformOrigin: '400px 88px' }}>
      <rect x="352" y="72" width="96" height="32" rx="16" fill={TOP} stroke={ACCENT} strokeWidth="1.25" />
      <circle className="dj-badge-dot" cx="374" cy="88" r="4.5" fill={ACCENT} filter="url(#dj-glow)" />
      <text x="388" y="92.5" fontSize="12" fontWeight="700" letterSpacing="0.14em" fill={INK}>
        LIVE
      </text>
    </g>
  )
}

function setInitial(q) {
  gsap.set(q('.dj-draw'), { strokeDasharray: 1, strokeDashoffset: 1 })
  gsap.set(q('.dj-window'), { scale: 1, opacity: 1, transformOrigin: '400px 300px' })
  gsap.set(q('.dj-win-face, .dj-win-side, .dj-win-topedge, .dj-win-dot'), { opacity: 0 })
  gsap.set(q('.dj-ui'), { opacity: 0, y: 14 })
  gsap.set(q('.dj-bar'), { scaleY: 0, transformOrigin: '50% 100%' })
  gsap.set(q('.dj-tile-a'), { x: 400, y: 300, scale: 0, opacity: 0 })
  gsap.set(q('.dj-tile-b'), { x: 400, y: 250, scale: 1, opacity: 0 })
  gsap.set(q('.dj-pills, .dj-rails, .dj-badge, .dj-eu, .dj-pin, .dj-label, .dj-ring'), { opacity: 0 })
  gsap.set(q('.dj-pill'), { x: -8 })
  gsap.set(q('.dj-dest'), { opacity: 0 })
  gsap.set(q('.dj-pulse-dot'), { opacity: 0 })
  gsap.set(q('.dj-dock-led'), { fill: '#c9c3bb' })
  gsap.set(q('.dj-cta'), { opacity: 0, y: 12, visibility: 'hidden', pointerEvents: 'none' })
  gsap.set(q('.dj-ring'), { strokeDasharray: 1, strokeDashoffset: 1 })
}

function buildTimeline(root, tl, cta) {
  const q = gsap.utils.selector(root)
  setInitial(q)

  // 01 BUILD
  tl.addLabel('build', 0)
    .to(q('.dj-win-frame'), { strokeDashoffset: 0, duration: 1.0, ease: 'power2.out' }, 'build')
    .to(q('.dj-win-line'), { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, 'build+=0.4')
    .to(q('.dj-win-face, .dj-win-side, .dj-win-topedge'), { opacity: 1, duration: 0.45, ease: 'power2.out' }, 'build+=0.55')
    .to(q('.dj-win-dot'), { opacity: 1, duration: 0.25, stagger: 0.06, ease: 'power2.out' }, 'build+=0.7')
    .to(q('.dj-ui'), { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, 'build+=0.85')
    .to(q('.dj-bar'), { scaleY: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, 'build+=1.15')

  // 02 PACKAGE — window → app tile
  tl.addLabel('package', 2)
    .to(q('.dj-ui, .dj-bar, .dj-win-dot, .dj-win-line'), { opacity: 0, duration: 0.35, ease: 'power2.in' }, 'package')
    .to(q('.dj-window'), { scale: 0.34, opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 'package+=0.1')
    .to(q('.dj-tile-a'), { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, 'package+=0.35')
    .to(q('.dj-ring'), { opacity: 1, strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, 'package+=0.75')
    .to(q('.dj-pills'), { opacity: 1, duration: 0.3, ease: 'power2.out' }, 'package+=0.8')
    .to(q('.dj-pill'), { x: 0, duration: 0.3, stagger: 0.22, ease: 'power2.out' }, 'package+=0.8')

  ;[0, 1, 2].forEach((i) => {
    tl.to(q(`.dj-tick-dot-${i}`), { fill: ACCENT, stroke: ACCENT, duration: 0.16, ease: 'power2.out' }, `package+=${1.05 + i * 0.28}`)
      .to(q(`.dj-tick-mark-${i}`), { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, `package+=${1.1 + i * 0.28}`)
  })

  // 03 YOUR CHOICE
  tl.addLabel('choice', 4)
    .to(q('.dj-pills, .dj-ring'), { opacity: 0, duration: 0.3, ease: 'power2.out' }, 'choice')
    .to(q('.dj-tile-a'), { y: 250, duration: 0.65, ease: 'power2.inOut' }, 'choice+=0.1')
    .to(q('.dj-rails'), { opacity: 1, duration: 0.15 }, 'choice+=0.45')
    .to(q('.dj-rail-l, .dj-rail-r'), { strokeDashoffset: 0, duration: 0.85, ease: 'power2.out' }, 'choice+=0.45')
    .to(q('.dj-dest'), { opacity: 1, duration: 0.55, ease: 'power2.out' }, 'choice+=0.55')
    .to(q('.dj-pulse-dot'), { opacity: 1, duration: 0.25 }, 'choice+=0.9')

  // 04a PREMISES — tile docks into rack
  tl.addLabel('premises', 5.5)
    .to(
      q('.dj-tile-a'),
      {
        duration: 1.15,
        ease: 'power2.inOut',
        motionPath: {
          path: '#dj-path-left',
          align: '#dj-path-left',
          alignOrigin: [0.5, 0.55],
        },
        scale: 0.55,
      },
      'premises',
    )
    .to(q('.dj-tile-a'), { scale: 0.4, opacity: 0, duration: 0.3, ease: 'power2.in' }, 'premises+=1.1')
    .to(q('.dj-led'), { fill: ACCENT, duration: 0.15, stagger: 0.06, ease: 'power2.out' }, 'premises+=1.15')
    .to(q('.dj-dock-led-premises'), { fill: ACCENT, duration: 0.2, ease: 'power2.out' }, 'premises+=1.2')
    .to(q('.dj-label-premises'), { opacity: 1, duration: 0.35, ease: 'power2.out' }, 'premises+=1.25')

  // 04b CLOUD — second tile lands on platform
  tl.addLabel('cloud', 7.3)
    .set(q('.dj-tile-b'), { x: 400, y: 250, scale: 1, opacity: 0 }, 'cloud')
    .to(q('.dj-tile-b'), { opacity: 1, duration: 0.22, ease: 'power2.out' }, 'cloud')
    .to(q('.dj-eu'), { opacity: 1, duration: 0.45, ease: 'power2.out' }, 'cloud')
    .to(
      q('.dj-tile-b'),
      {
        duration: 1.0,
        ease: 'power2.inOut',
        motionPath: {
          path: '#dj-path-right',
          align: '#dj-path-right',
          alignOrigin: [0.5, 0.55],
        },
        scale: 0.55,
      },
      'cloud+=0.2',
    )
    .to(q('.dj-tile-b'), { y: '-=18', scale: 0.45, opacity: 0, duration: 0.28, ease: 'power2.in' }, 'cloud+=1.1')
    .to(q('.dj-pin'), { opacity: 1, duration: 0.3, ease: 'power2.out' }, 'cloud+=1.1')
    .to(q('.dj-dock-led-cloud'), { fill: ACCENT, duration: 0.2, ease: 'power2.out' }, 'cloud+=1.15')
    .to(q('.dj-label-cloud'), { opacity: 1, duration: 0.35, ease: 'power2.out' }, 'cloud+=1.2')

  // 05 LIVE
  tl.addLabel('live', 8.8)
    .to(q('.dj-rail-l, .dj-rail-r'), { strokeDasharray: '1 0', duration: 0.45, ease: 'power2.out' }, 'live')
    .to(q('.dj-badge'), { opacity: 1, duration: 0.45, ease: 'power2.out' }, 'live+=0.2')
    .to(
      cta,
      {
        opacity: 1,
        y: 0,
        visibility: 'visible',
        pointerEvents: 'auto',
        duration: 0.45,
        ease: 'power2.out',
      },
      'live+=0.35',
    )
    .to({}, { duration: 0.001 }, TOTAL - 0.001)
}

function startIdle(root) {
  const q = gsap.utils.selector(root)
  gsap.to(q('.dj-tile-float'), {
    y: -3,
    duration: 2.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
  gsap.to(q('.dj-pulse-l'), {
    duration: 2.6,
    repeat: -1,
    ease: 'none',
    motionPath: { path: '#dj-path-left', align: '#dj-path-left', alignOrigin: [0.5, 0.5] },
  })
  gsap.to(q('.dj-pulse-r'), {
    duration: 2.6,
    repeat: -1,
    ease: 'none',
    delay: 1.3,
    motionPath: { path: '#dj-path-right', align: '#dj-path-right', alignOrigin: [0.5, 0.5] },
  })
  gsap.to(q('.dj-pin-ring'), {
    attr: { r: 16 },
    opacity: 0,
    duration: 1.6,
    repeat: -1,
    ease: 'power1.out',
  })
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
            <AsteriskIcon />
            <span>How it works</span>
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
          <svg viewBox="0 0 800 600" role="img" aria-label="A product is built, packaged, then delivered to your own servers or an EU-region cloud">
            <Defs />
            <Floor />

            <Premises />
            <CloudDest />
            <Rails />

            <AppWindow />

            <ellipse className="dj-ring" pathLength="1" cx="400" cy="348" rx="70" ry="28" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" opacity="0" />
            <Pills />

            <AppTile className="dj-tile-b" />
            <AppTile className="dj-tile-a" />

            <LiveBadge />
          </svg>
        </div>
      </div>
    </section>
  )
}
