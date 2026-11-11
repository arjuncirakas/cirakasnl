import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Compliance.css'

gsap.registerPlugin(ScrollTrigger)

const FRAMEWORKS = [
  { tag: 'Regulation', name: 'GDPR', title: 'General Data Protection Regulation', text: 'Personal data handled with consent, access controls and clear retention.' },
  { tag: 'Regulation', name: 'EU AI Act', title: 'Artificial Intelligence Act', text: 'Transparent, documented AI features with human oversight.' },
  { tag: 'Directive', name: 'NIS2', title: 'Network and Information Security Directive', text: 'Security controls and incident handling for critical operations.' },
  { tag: 'Standard', name: 'ISO 27001', title: 'Information Security Management', text: 'Practices built around ISO 27001 security controls.' },
  { tag: 'Regulation', name: 'EU Data Act', title: 'Data Act', text: 'Fair access to and portability of the data your systems generate.' },
  { tag: 'Criteria', name: 'AIC4', title: 'AI Cloud Service Compliance Criteria Catalogue', text: 'Cloud-based AI services built to BSI AIC4 criteria.' },
]

export default function Compliance() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.cp-head > *', {
        y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })

      const gtl = gsap.timeline({ scrollTrigger: { trigger: '.cp-grid', start: 'top 85%', toggleActions: 'play none none none' } })
      gtl.from('.cp-gline', { scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'power3.inOut' })
        .from('.cp-cell', { y: 36, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09 }, 0.15)

    })

    return () => mm.revert()
  }, [])

  return (
    <section className="cp" id="compliance" ref={ref} aria-label="Compliance">
      <div className="cp-inner">
        <div className="cp-head">
          <span className="cp-eyebrow">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>
            Compliance
          </span>
          <h2>Built for compliance from day one.</h2>
          <p>Run on your premises or in an EU-region cloud, with the controls auditors expect.</p>
        </div>

        <div className="cp-grid-wrap">
          <span className="cp-gline" aria-hidden="true" />
          <ul className="cp-grid">
            {FRAMEWORKS.map((f) => (
              <li className="cp-cell" key={f.name}>
                <span className="cp-tag">{f.tag}</span>
                <h3 className="cp-name">{f.name}</h3>
                <span className="cp-title">{f.title}</span>
                <p>{f.text}</p>
                <span className="cp-status">Aligned</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
