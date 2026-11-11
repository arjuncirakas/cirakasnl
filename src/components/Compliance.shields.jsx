import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Compliance.css'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    title: 'Full audit trail',
    text: 'Every action, user and response is logged and exportable.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h8l4 4v14H7z" /><path d="M15 3v4h4" /><path d="M10 12h6M10 16h6" />
      </svg>
    ),
  },
  {
    title: 'Role-based access',
    text: 'Permissions per team, with single sign-on ready when you need it.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M17 5.5a3 3 0 0 1 0 5.6M18.5 14.4c1.6.8 2.5 2.6 2.5 5.6" />
      </svg>
    ),
  },
  {
    title: 'Data stays where you choose',
    text: 'Run on-premise or in an EU-region cloud, whichever suits your team.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4" width="17" height="6.5" rx="2" /><rect x="3.5" y="13.5" width="17" height="6.5" rx="2" /><path d="M7.5 7.25h.01M7.5 16.75h.01" />
      </svg>
    ),
  },
]

const BADGES = [
  { label: 'GDPR', sub: 'Aligned' },
  { label: 'EU AI Act', sub: 'Ready' },
  { label: 'NIS2', sub: 'Ready' },
  { label: 'ISO 27001', sub: 'Aligned' },
  { label: 'EU Data Act', sub: 'Ready' },
  { label: 'AIC4', sub: 'Aligned' },
]

export default function Compliance() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.cp-left > *', {
        y: 32, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })
      gsap.from('.cp-feat', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.cp-feats', start: 'top 82%', toggleActions: 'play none none none' },
      })
      gsap.from('.cp-badge', {
        y: 48, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09,
        scrollTrigger: { trigger: '.cp-panel', start: 'top 82%', toggleActions: 'play none none none' },
      })
      gsap.from('.cp-cap', {
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5,
        scrollTrigger: { trigger: '.cp-panel', start: 'top 82%', toggleActions: 'play none none none' },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="cp" id="compliance" ref={ref} aria-label="Compliance">
      <div className="cp-inner">
        <div className="cp-top">
          <div className="cp-left">
            <span className="cp-eyebrow">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>
              Compliance
            </span>
            <h2>Built for compliance from day one.</h2>
            <p>Run on your premises or in an EU-region cloud, with the controls auditors expect.</p>
            <a className="cp-btn" href="#contact">
              Talk to us about compliance <i aria-hidden="true">↗</i>
            </a>
          </div>

          <ul className="cp-feats">
            {FEATURES.map((f) => (
              <li className="cp-feat" key={f.title}>
                <span className="cp-ico">{f.icon}</span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="cp-panel">
          <img className="cp-bg" src="/products/fluid-2.jpg" alt="" loading="lazy" draggable="false" />
          <ul className="cp-badges">
            {BADGES.map((b) => (
              <li className="cp-badge" key={b.label}>
                <svg className="cp-shield" viewBox="0 0 120 140" aria-hidden="true">
                  <path d="M60 5 L112 23 V68 C112 100 90 124 60 135 C30 124 8 100 8 68 V23 Z" />
                  <path className="cp-shine" d="M60 5 L112 23 V50 C88 40 34 40 8 50 V23 Z" />
                </svg>
                <span className="cp-bl">
                  <svg className="cp-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
                  <b>{b.label}</b>
                  <em>{b.sub}</em>
                </span>
              </li>
            ))}
          </ul>
          <p className="cp-cap">Designed to meet the frameworks your auditors ask about.</p>
        </div>
      </div>
    </section>
  )
}
