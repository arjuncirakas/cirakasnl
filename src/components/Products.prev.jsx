import { useLayoutEffect, useRef, useState } from 'react'
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
    logoAlt: 'InFLOW logo',
  },
  {
    id: 'stream',
    name: 'STREAM',
    caption: 'Manufacturing request triage',
    desc: 'STREAM uses AI-assisted extraction and routing to prepare incoming requests for review. It connects information with operational context so people can focus on exceptions and decisions.',
    url: 'https://stream.cirakas.com/',
    logo: '/stream-logo.png',
    logoAlt: 'STREAM logo',
  },
  {
    id: 'coat',
    name: 'COAT',
    caption: 'Coating Optimisation and Anomaly Tracking',
    desc: 'COAT brings paint thickness, environmental conditions and process data into one view. Teams can identify deviations, investigate anomalies and record the action taken through to resolution.',
    url: 'https://coat.cirakas.com/',
    logo: '/coat-logo.jpeg',
    logoAlt: 'COAT logo',
  },
  {
    id: 'qlms',
    name: 'QLMS',
    caption: 'Quote and Lead Management System',
    desc: 'QLMS brings incoming enquiries into a shared queue. AI extracts the request details, pricing is calculated from your rate cards, and your rules decide when a quotation needs human review.',
    url: 'https://qlms.cirakas.com/',
    logo: '/qlms-app-logo.png',
    logoAlt: 'QLMS logo',
  },
  {
    id: 'dsm',
    name: 'DSM',
    caption: 'Digital Skill Management',
    desc: 'DSM brings skill catalogues, proficiency grades, certificates and role requirements into a shared workflow, for software teams and for manufacturing operators and stations.',
    url: 'https://dsm.cirakas.com/',
    logo: null,
    logoAlt: '',
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

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function AsteriskIcon() {
  return (
    <svg className="pr-asterisk" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4v56M8.5 18.5l47 27M8.5 45.5l47-27M4 32h56" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Products() {
  const rootRef = useRef(null)
  const lastPointer = useRef('mouse')
  const [active, setActive] = useState(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      gsap.from('.pr-head-line', {
        yPercent: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.pr-header', start: 'top 85%', toggleActions: 'play none none none' },
      })
      gsap.from('.pr-intro, .pr-top', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.pr-header', start: 'top 85%', toggleActions: 'play none none none' },
      })
      gsap.from('.pr-row', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '.pr-list', start: 'top 88%', toggleActions: 'play none none none' },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const mouseOnly = (fn) => (e) => {
    if (e.pointerType === 'mouse') fn()
  }

  return (
    <section className="products" id="products" ref={rootRef} aria-labelledby="pr-heading">
      <div className="pr-inner">
        <div className="pr-top">
          <AsteriskIcon />
          <div className="pr-label">
            <span>Our Products</span>
            <span className="pr-line" aria-hidden="true" />
          </div>
        </div>

        <div className="pr-header">
          <h2 id="pr-heading">
            <span className="pr-head-clip"><span className="pr-head-line">Products built to</span></span>
            <span className="pr-head-clip"><span className="pr-head-line pr-muted">run your business.</span></span>
          </h2>
          <p className="pr-intro">
            Ready-to-deploy software for workflow, learning, operations and field teams, set up on your premises or hosted in an EU-region cloud.
          </p>
        </div>

        <ul className="pr-list" onPointerLeave={mouseOnly(() => setActive(null))}>
          {PRODUCTS.map((p, i) => {
            const open = active === i
            const dim = active !== null && !open
            return (
              <li
                key={p.id}
                className={`pr-row${open ? ' is-open' : ''}${dim ? ' is-dim' : ''}`}
                onPointerEnter={mouseOnly(() => setActive(i))}
                onFocus={(e) => {
                  if (e.target.matches(':focus-visible')) setActive(i)
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setActive((a) => (a === i ? null : a))
                }}
              >
                <div className="pr-main">
                  <button
                    type="button"
                    className="pr-trigger"
                    id={`pr-btn-${p.id}`}
                    aria-expanded={open}
                    aria-controls={`pr-panel-${p.id}`}
                    onPointerDown={(e) => {
                      lastPointer.current = e.pointerType
                    }}
                    onClick={() => {
                      if (lastPointer.current === 'mouse') setActive(i)
                      else setActive((a) => (a === i ? null : i))
                    }}
                  >
                    <span className="pr-index">[{String(i + 1).padStart(2, '0')}]</span>
                    <span className="pr-title">{p.name}</span>
                  </button>
                  <a className="pr-arrow" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Open the ${p.name} product page (opens in a new tab)`}>
                    <ArrowUpRight />
                  </a>
                </div>

                <div className="pr-panel" id={`pr-panel-${p.id}`} role="region" aria-labelledby={`pr-btn-${p.id}`} inert={!open}>
                  <div className="pr-panel-clip">
                    <div className="pr-panel-grid">
                      <p className="pr-caption">{p.caption}</p>
                      <div className="pr-cta-wrap">
                        <a className="pr-cta" href={p.url} target="_blank" rel="noopener noreferrer">
                          <span>Explore {p.name}</span>
                          <span className="pr-cta-arrow" aria-hidden="true">{'\u2197'}</span>
                        </a>
                        {p.logo && (
                          <span className="pr-logo">
                            <img src={p.logo} alt={p.logoAlt} loading="lazy" />
                          </span>
                        )}
                      </div>
                      <p className="pr-desc">{p.desc}</p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
