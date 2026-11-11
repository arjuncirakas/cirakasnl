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
  },
  {
    id: 'stream',
    name: 'STREAM',
    caption: 'Manufacturing request triage',
    desc: 'STREAM uses AI-assisted extraction and routing to prepare incoming requests for review. It connects information with operational context so people can focus on exceptions and decisions.',
    url: 'https://stream.cirakas.com/',
    logo: '/stream-logo.png',
  },
  {
    id: 'coat',
    name: 'COAT',
    caption: 'Coating Optimisation and Anomaly Tracking',
    desc: 'COAT brings paint thickness, environmental conditions and process data into one view. Teams can identify deviations, investigate anomalies and record the action taken through to resolution.',
    url: 'https://coat.cirakas.com/',
    logo: '/coat-logo.jpeg',
  },
  {
    id: 'qlms',
    name: 'QLMS',
    caption: 'Quote and Lead Management System',
    desc: 'QLMS brings incoming enquiries into a shared queue. AI extracts the request details, pricing is calculated from your rate cards, and your rules decide when a quotation needs human review.',
    url: 'https://qlms.cirakas.com/',
    logo: '/qlms-app-logo.png',
  },
  {
    id: 'dsm',
    name: 'DSM',
    caption: 'Digital Skill Management',
    desc: 'DSM brings skill catalogues, proficiency grades, certificates and role requirements into a shared workflow, for software teams and for manufacturing operators and stations.',
    url: 'https://dsm.cirakas.com/',
    logo: null,
  },
  {
    id: 'samt',
    name: 'SAMT',
    caption: 'Field sales execution',
    desc: 'SAMT connects the management console and agent workflow. Teams publish daily plans, capture visit evidence and turn outcomes into follow-ups and opportunities.',
    url: 'https://samt.cirakas.com/',
    logo: '/samt logo.png',
    logoAlt: 'SAMT logo (shown as FIELD on its product page)',
  },
]

const pad = (n) => String(n).padStart(2, '0')

const onMove = (e) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
  e.currentTarget.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
}
const onLeave = (e) => {
  e.currentTarget.style.setProperty('--mx', 0)
  e.currentTarget.style.setProperty('--my', 0)
}

export default function Products() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.pl-head > *', {
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
      })

      gsap.utils.toArray('.pl-row', section).forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' },
        })
        tl.from(row.querySelector('.pl-line'), { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power3.inOut' })
          .from(row.querySelectorAll('.pl-cat, .pl-vis, .pl-txt, .pl-go'), {
            y: 36, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
          }, 0.15)

        gsap.fromTo(row.querySelector('.pl-art'), { yPercent: -9 }, {
          yPercent: 9, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="pl" id="products" ref={sectionRef} aria-label="Products">
      <div className="pl-inner">
        <div className="pl-head">
          <span className="pl-eyebrow">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>
            Our Products
          </span>
          <h2>Products built to run your business.</h2>
          <p>Ready-to-deploy software for workflow, learning, operations and field teams, set up on your premises or hosted in an EU-region cloud.</p>
        </div>

        <div className="pl-list">
          {PRODUCTS.map((p, i) => (
            <a className="pl-row" key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" data-i={i}
               aria-label={`${p.name}: ${p.caption}. Opens in a new tab`}
               onMouseMove={onMove} onMouseLeave={onLeave}>
              <span className="pl-line" aria-hidden="true" />
              <span className="pl-cat"><em>{pad(i + 1)}</em><b>{p.caption}</b></span>
              <span className="pl-vis">
                <span className="pl-art" aria-hidden="true">
                  <span className="pl-art-in"><img src={`/products/fluid-${i + 1}.jpg`} alt="" loading="lazy" draggable="false" /></span>
                </span>
                <span className="pl-chip">
                  {p.logo ? <img src={p.logo} alt={p.logoAlt || `${p.name} logo`} /> : <em>{p.name}</em>}
                </span>
              </span>
              <span className="pl-txt">
                <h3>{p.name}</h3>
                <span className="pl-desc">{p.desc}</span>
                <span className="pl-pills"><span>On-premise</span><span>EU cloud</span></span>
              </span>
              <span className="pl-go" aria-hidden="true"><i>→</i></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
