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
    tags: ['Workflows', 'Approvals'],
  },
  {
    id: 'stream',
    name: 'STREAM',
    caption: 'Manufacturing request triage',
    desc: 'STREAM uses AI-assisted extraction and routing to prepare incoming requests for review. It connects information with operational context so people can focus on exceptions and decisions.',
    url: 'https://stream.cirakas.com/',
    logo: '/stream-logo.png',
    tags: ['AI triage', 'Routing'],
  },
  {
    id: 'coat',
    name: 'COAT',
    caption: 'Coating Optimisation and Anomaly Tracking',
    desc: 'COAT brings paint thickness, environmental conditions and process data into one view. Teams can identify deviations, investigate anomalies and record the action taken through to resolution.',
    url: 'https://coat.cirakas.com/',
    logo: '/coat-logo.jpeg',
    tags: ['Quality', 'Anomalies'],
  },
  {
    id: 'qlms',
    name: 'QLMS',
    caption: 'Quote and Lead Management System',
    desc: 'QLMS brings incoming enquiries into a shared queue. AI extracts the request details, pricing is calculated from your rate cards, and your rules decide when a quotation needs human review.',
    url: 'https://qlms.cirakas.com/',
    logo: '/qlms-app-logo.png',
    tags: ['Quotes', 'Leads'],
  },
  {
    id: 'dsm',
    name: 'DSM',
    caption: 'Digital Skill Management',
    desc: 'DSM brings skill catalogues, proficiency grades, certificates and role requirements into a shared workflow, for software teams and for manufacturing operators and stations.',
    url: 'https://dsm.cirakas.com/',
    logo: null,
    tags: ['Skills', 'Certificates'],
  },
  {
    id: 'samt',
    name: 'FIELD',
    caption: 'Field sales execution',
    desc: 'FIELD connects the management console and agent workflow. Teams publish daily plans, capture visit evidence and turn outcomes into follow-ups and opportunities.',
    url: 'https://samt.cirakas.com/',
    logo: '/samt logo.png',
    logoAlt: 'FIELD logo',
    tags: ['Field sales', 'Visits'],
  },
]

const pad = (n) => String(n).padStart(2, '0')

export default function Products() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const head = section.querySelector('.pl-head')
        const q = gsap.utils.selector(head)

        gsap.set(q('.pl-eyebrow'), { opacity: 0, y: 16 })
        gsap.set(q('.pl-hline > span'), { yPercent: 115 })
        gsap.set(q('.pl-lede'), { opacity: 0, y: 22 })

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: head,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        })

        tl.to(q('.pl-eyebrow'), {
          opacity: 1, y: 0, duration: 0.85,
        }, 0)
          .to(q('.pl-hline > span'), {
            yPercent: 0, duration: 1.15, stagger: 0.12, ease: 'power4.out',
          }, 0.12)
          .to(q('.pl-lede'), {
            opacity: 1, y: 0, duration: 0.95, clearProps: 'transform,opacity',
          }, 0.35)
      }, section)

      return () => ctx.revert()
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
          <h2>
            <span className="pl-hline"><span>Products built to run your</span></span>
            <span className="pl-hline"><span>business.</span></span>
          </h2>
          <p className="pl-lede">
            Ready to deploy software for workflow, learning, operations and field teams, set up on your premises or hosted in an EU region cloud.
          </p>
        </div>

        <div className="pl-list">
          {PRODUCTS.map((p, i) => (
            <a className="pl-row" key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" data-i={i}
               aria-label={`${p.name}: ${p.caption}. Opens in a new tab`}>
              <span className="pl-line" aria-hidden="true" />
              <span className="pl-fill" aria-hidden="true">
                <img src={`/products/fluid-${i + 1}.jpg`} alt="" loading="lazy" draggable="false" />
              </span>
              <span className="pl-lead">
                <em className="pl-idx">{pad(i + 1)}</em>
                <span className="pl-logo">
                  {p.logo ? <img src={p.logo} alt={p.logoAlt || `${p.name} logo`} /> : <b>{p.name}</b>}
                </span>
              </span>
              <span className="pl-txt">
                <h3>{p.name}</h3>
                <span className="pl-desc">{p.desc}</span>
              </span>
              <span className="pl-pills" aria-hidden="true">
                {p.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </span>
              <span className="pl-go" aria-hidden="true">
                <svg className="pl-go-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
