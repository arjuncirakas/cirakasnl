import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Products.css'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  {
    id: 'inflow',
    name: 'InFLOW',
    caption: 'Operational management',
    desc: 'InFLOW brings operational workflows together so teams can assign work, follow approvals and review what is happening across their operation.',
    url: 'https://inflow.cirakas.com/',
    logo: '/inflowlogo.png',
    shot: null,
    tone: 'dark',
  },
  {
    id: 'stream',
    name: 'STREAM',
    caption: 'Manufacturing request triage',
    desc: 'STREAM uses AI-assisted extraction and routing to prepare incoming requests for review. It connects information with operational context so people can focus on exceptions and decisions.',
    url: 'https://stream.cirakas.com/',
    logo: '/stream-logo.png',
    shot: '/products/stream.jpg',
    tone: 'light',
  },
  {
    id: 'coat',
    name: 'COAT',
    caption: 'Coating Optimisation and Anomaly Tracking',
    desc: 'COAT brings paint thickness, environmental conditions and process data into one view. Teams can identify deviations, investigate anomalies and record the action taken through to resolution.',
    url: 'https://coat.cirakas.com/',
    logo: '/coat-logo.jpeg',
    shot: '/products/coat.jpg',
    tone: 'dark',
  },
  {
    id: 'qlms',
    name: 'QLMS',
    caption: 'Quote and Lead Management System',
    desc: 'QLMS brings incoming enquiries into a shared queue. AI extracts the request details, pricing is calculated from your rate cards, and your rules decide when a quotation needs human review.',
    url: 'https://qlms.cirakas.com/',
    logo: '/qlms-app-logo.png',
    shot: '/products/qlms.jpg',
    tone: 'light',
  },
  {
    id: 'dsm',
    name: 'DSM',
    caption: 'Digital Skill Management',
    desc: 'DSM brings skill catalogues, proficiency grades, certificates and role requirements into a shared workflow, for software teams and for manufacturing operators and stations.',
    url: 'https://dsm.cirakas.com/',
    logo: null,
    shot: '/products/dsm.jpg',
    tone: 'dark',
  },
  {
    id: 'samt',
    name: 'SAMT',
    caption: 'Field sales execution',
    desc: 'SAMT connects the management console and agent workflow. Teams publish daily plans, capture visit evidence and turn outcomes into follow-ups and opportunities.',
    url: 'https://samt.cirakas.com/',
    logo: '/samt logo.png',
    logoAlt: 'SAMT logo (shown as FIELD on its product page)',
    shot: '/products/samt.jpg',
    tone: 'light',
  },
]

const TOTAL = PRODUCTS.length
const pad = (n) => String(n).padStart(2, '0')
const MARQUEE = PRODUCTS.map((p) => p.name.toUpperCase()).join(' / ') + ' / '

// resting pose of a card that is `d` places behind the front card
const pose = (d, j) => {
  const dd = Math.min(d, 2)
  const sgn = j % 2 ? 1 : -1
  return {
    x: 0,
    y: dd * 12,
    scale: 1 - dd * 0.04,
    rotation: sgn * (1.2 + dd * 1.1),
    opacity: d > 2 ? 0 : 1,
  }
}

export default function Products() {
  const sectionRef = useRef(null)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)
  const countRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const mm = gsap.matchMedia()

    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 899px)' },
      (context) => {
        const { motion, mobile } = context.conditions
        if (!motion) return

        const cards = gsap.utils.toArray('.pst-card', section)
        const n = cards.length
        const reach = mobile ? 0.55 : 1

        // marquee rows
        const loop = (el, from, to) =>
          gsap.fromTo(el, { xPercent: from }, { xPercent: to, duration: 34, ease: 'none', repeat: -1 })
        const t1 = loop(row1Ref.current, 0, -50)
        const t2 = loop(row2Ref.current, -50, 0)
        const kick = (target, back) => {
          ;[t1, t2].forEach((tw) => {
            gsap.killTweensOf(tw, 'timeScale')
            gsap
              .timeline()
              .to(tw, { timeScale: target, duration: 0.25, ease: 'power1.out' })
              .to(tw, { timeScale: back, duration: 1.4, ease: 'power2.out' })
          })
        }

        // initial deck
        cards.forEach((c, j) => gsap.set(c, { ...pose(j, j), zIndex: n - j }))

        let shown = -1
        const setActive = (idx) => {
          if (idx === shown) return
          shown = idx
          countRef.current.textContent = `${pad(Math.min(idx + 1, TOTAL))} / ${pad(TOTAL)}`
          cards.forEach((c, j) => c.classList.toggle('is-front', j === idx))
        }
        setActive(0)

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: mobile ? `+=${(n - 1) * 70}%` : `+=${(n - 1) * 100}%`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const dir = self.direction === 1 ? 1 : -1
              const v = Math.min(Math.abs(self.getVelocity()) / 260, 6)
              if (v > 0.4) kick(dir * (1 + v), dir)
            },
          },
          onUpdate: () => setActive(Math.min(Math.round(tl.time()), n - 1)),
        })

        for (let s = 0; s < n - 1; s += 1) {
          const dir = s % 2 === 0 ? 1 : -1
          tl.to(cards[s], {
            x: dir * 560 * reach,
            y: -260 * reach,
            rotation: dir * 26,
            opacity: 0,
            scale: 1.04,
            duration: 1,
          }, s)
          for (let j = s + 1; j < n; j += 1) {
            tl.to(cards[j], { ...pose(j - s - 1, j), duration: 1 }, s)
          }
        }
              },
    )

    return () => mm.revert()
  }, [])

  return (
    <section className="pst" id="products" ref={sectionRef} aria-label="Products">
      <div className="pst-top">
        <div className="pst-head">
          <span className="pst-eyebrow">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>
            Our Products
          </span>
          <p>Ready-to-deploy software for workflow, learning, operations and field teams, set up on your premises or hosted in an EU-region cloud.</p>
        </div>
        <span className="pst-count" ref={countRef}>01 / {pad(TOTAL)}</span>
      </div>

      <div className="pst-marq" aria-hidden="true">
        <div className="pst-row pst-row-a">
          <div className="pst-mtrack" ref={row1Ref}><span>{MARQUEE}</span><span>{MARQUEE}</span></div>
        </div>
        <div className="pst-row pst-row-b">
          <div className="pst-mtrack" ref={row2Ref}><span>{MARQUEE}</span><span>{MARQUEE}</span></div>
        </div>
      </div>

      <div className="pst-stage">
        <div className="pst-glow" aria-hidden="true" />
        {PRODUCTS.map((p, i) => (
          <article className={`pst-card${i === 0 ? ' is-front' : ''}`} key={p.id} data-product={p.id}>
            <div className="pst-in">
              <div className="pst-shot">
                {p.logo ? (
                  <img src={p.logo} alt={p.logoAlt || `${p.name} logo`} draggable="false" />
                ) : (
                  <span className="pst-word" aria-label={`${p.name} logo`}>{p.name}</span>
                )}
              </div>
              <div className="pst-row-meta">
                <span className="pst-idx">{pad(i + 1)}<b>/{pad(TOTAL)}</b></span>
              </div>
              <h3>{p.name}</h3>
              <span className="pst-cap">{p.caption}</span>
              <p>{p.desc}</p>
              <a className="pst-btn" href={p.url} target="_blank" rel="noopener noreferrer">
                View Product <i aria-hidden="true">↗</i>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
