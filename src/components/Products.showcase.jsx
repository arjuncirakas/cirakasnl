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

export default function Products() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const countRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const mm = gsap.matchMedia()

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray('.prh-card', section)
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
      let shown = -1

      const update = (progress) => {
        gsap.set(barRef.current, { scaleX: progress })
        const mid = window.innerWidth / 2
        let best = 0
        let bestD = Infinity
        cards.forEach((c, i) => {
          const r = c.getBoundingClientRect()
          const d = Math.abs(r.left + r.width / 2 - mid)
          if (d < bestD) { bestD = d; best = i }
        })
        const idx = bestD > window.innerWidth * 0.3 ? 0 : best + 1
        if (idx !== shown) {
          shown = idx
          countRef.current.textContent = `${pad(idx)} / ${pad(TOTAL)}`
        }
      }

      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
        onUpdate() { update(this.progress()) },
      })

      gsap.from('.prh-intro [data-rv]', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.1,
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' },
      })

      cards.forEach((card) => {
        const img = card.querySelector('.prh-img')
        if (img) {
          gsap.fromTo(img, { xPercent: -5 }, {
            xPercent: 5, ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          })
        }
        gsap.fromTo(card, { scale: 0.92 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 92%', end: 'left 42%', scrub: true },
        })
        gsap.from(card.querySelectorAll('[data-rv]'), {
          y: 36, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 72%', toggleActions: 'play none none reverse' },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="prh" id="products" ref={sectionRef} aria-label="Products">
      <div className="prh-track" ref={trackRef}>
        <div className="prh-intro">
          <span className="prh-eyebrow" data-rv>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>
            Products
          </span>
          <h2 className="prh-title" data-rv>
            <span>PRODUCTS BUILT TO</span>
            <span className="prh-muted">RUN YOUR BUSINESS.</span>
          </h2>
          <p className="prh-lede" data-rv>
            Ready-to-deploy software for workflow, learning, operations and field teams, set up on your premises or hosted in an EU-region cloud.
          </p>
          <div className="prh-meta" data-rv>
            <span className="prh-count">{pad(TOTAL)} <em>Products</em></span>
            <span className="prh-hint">Scroll <i aria-hidden="true">→</i></span>
          </div>
        </div>

        {PRODUCTS.map((p, i) => (
          <article className={`prh-card prh-${p.tone}`} key={p.id} data-product={p.id}>
            <div className="prh-head" data-rv>
              <span className="prh-idx">{pad(i + 1)}<b>/{pad(TOTAL)}</b></span>
              {p.logo && (
                <span className="prh-chip">
                  <img src={p.logo} alt={p.logoAlt || `${p.name} logo`} loading="lazy" />
                </span>
              )}
            </div>

            <div className="prh-frame" data-rv>
              <div className="prh-bar" aria-hidden="true"><i /><i /><i /><span>{p.url.replace('https://', '').replace(/\/$/, '')}</span></div>
              <div className="prh-view">
                {p.shot ? (
                  <div className="prh-zoom">
                    <img className="prh-img" src={p.shot} alt={`${p.name} product screen`} loading="lazy" draggable="false" />
                  </div>
                ) : (
                  <div className="prh-ph">
                    <img src={p.logo} alt="" />
                    <span>{p.caption}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="prh-info">
              <div className="prh-name" data-rv>
                <h3>{p.name}</h3>
                <span>{p.caption}</span>
              </div>
              <div className="prh-copy" data-rv>
                <p>{p.desc}</p>
                <a className="prh-cta" href={p.url} target="_blank" rel="noopener noreferrer">
                  Explore {p.name} <i aria-hidden="true">↗</i>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="prh-dock" aria-hidden="true">
        <span className="prh-live" ref={countRef}>00 / {pad(TOTAL)}</span>
        <span className="prh-rail"><span className="prh-fill" ref={barRef} /></span>
      </div>
    </section>
  )
}
