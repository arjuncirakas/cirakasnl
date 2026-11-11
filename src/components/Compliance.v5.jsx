import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Compliance.css'

gsap.registerPlugin(ScrollTrigger)

const FRAMEWORKS = [
  { code: ['GDPR'], name: 'GDPR', desc: 'Personal data handled with consent, access controls and clear retention.' },
  { code: ['AI', 'ACT'], name: 'EU AI Act', desc: 'Transparent, documented AI features with human oversight.' },
  { code: ['NIS2'], name: 'NIS2', desc: 'Security controls and incident handling for critical operations.' },
  { code: ['ISO'], name: 'ISO 27001', desc: 'Practices built around ISO 27001 security controls.' },
  { code: ['DATA', 'ACT'], name: 'EU Data Act', desc: 'Fair access to and portability of the data your systems generate.' },
  { code: ['AIC4'], name: 'AIC4', desc: 'Cloud-based AI services built to BSI AIC4 criteria.' },
]

const ICON = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

const COMMITMENTS = [
  {
    title: 'Encryption everywhere',
    desc: 'Data is encrypted in transit and at rest.',
    icon: (
      <svg viewBox="0 0 24 24" {...ICON}>
        <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
        <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
        <path d="M12 14.8v2" />
      </svg>
    ),
  },
  {
    title: 'Role-based access',
    desc: 'People see only what their role allows.',
    icon: (
      <svg viewBox="0 0 24 24" {...ICON}>
        <path d="M12 3.2 5 5.9v5.4c0 4.3 2.8 7.6 7 9.5 4.2-1.9 7-5.2 7-9.5V5.9L12 3.2Z" />
        <circle cx="12" cy="10" r="2" />
        <path d="M8.6 15.2c.7-1.5 1.9-2.2 3.4-2.2s2.7.7 3.4 2.2" />
      </svg>
    ),
  },
  {
    title: 'Full audit trail',
    desc: 'Every action is logged and traceable.',
    icon: (
      <svg viewBox="0 0 24 24" {...ICON}>
        <path d="M6.5 3.5h7.6l3.9 3.9v12.1a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
        <path d="M14 3.5V8h4" />
        <path d="M8.8 12.2h6.4M8.8 15.2h6.4M8.8 18h3.4" />
      </svg>
    ),
  },
  {
    title: 'Your choice of location',
    desc: 'Run on your premises or in an EU-region cloud.',
    icon: (
      <svg viewBox="0 0 24 24" {...ICON}>
        <rect x="3.5" y="4" width="17" height="6.5" rx="2" />
        <rect x="3.5" y="13.5" width="17" height="6.5" rx="2" />
        <path d="M7.2 7.25h.01M7.2 16.75h.01" />
        <path d="M11 7.25h5.5M11 16.75h5.5" />
      </svg>
    ),
  },
]

function Badge({ code }) {
  const two = code.length > 1
  return (
    <svg className="cm-badge" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 2.6 6.4 7.4v10.2c0 9 5.5 14.9 13.6 19.8 8.1-4.9 13.6-10.8 13.6-19.8V7.4L20 2.6Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M20 6.2 9.8 9.8v7.8c0 6.8 4 11.4 10.2 15.3 6.2-3.9 10.2-8.5 10.2-15.3V9.8L20 6.2Z"
        stroke="currentColor"
        strokeWidth=".6"
        strokeLinejoin="round"
        opacity=".35"
      />
      <text
        textAnchor="middle"
        fill="currentColor"
        fontFamily="'Plus Jakarta Sans', 'Segoe UI', sans-serif"
        fontWeight="700"
        fontSize={code[0].length > 3 ? 7.8 : 8.6}
        letterSpacing=".02em"
      >
        {code.map((line, i) => (
          <tspan key={line} x="20" y={two ? 17.6 + i * 8.4 : 21.4}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" opacity=".55" />
      <path d="m5.3 8.2 1.9 1.9 3.5-3.9" />
    </svg>
  )
}

export default function Compliance() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const rise = (targets, trigger, stagger = 0.07) =>
        gsap.from(targets, {
          y: 22,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger, start: 'top 85%', toggleActions: 'play none none none' },
        })
      rise(el.querySelectorAll('.cm-head > *'), el.querySelector('.cm-head'), 0.12)
      rise(el.querySelector('.cm-frame'), el.querySelector('.cm-frame'))
      rise(el.querySelectorAll('.cm-fw'), el.querySelector('.cm-frame'), 0.07)
      rise(el.querySelectorAll('.cm-item'), el.querySelector('.cm-items'), 0.09)
      rise(el.querySelector('.cm-note'), el.querySelector('.cm-note'))
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="compliance" className="cm" ref={root}>
      <div className="cm-inner">
        <header className="cm-head">
          <div className="cm-title">
            <span className="cm-eyebrow">
              <i aria-hidden="true" />
              Compliance &amp; security
            </span>
            <h2>Built for compliance from day one.</h2>
          </div>
          <div className="cm-side">
            <p>Run on your premises or in an EU-region cloud, with the controls auditors expect.</p>
            <a className="cm-link" href="#contact">
              Talk to us about compliance <span aria-hidden="true">→</span>
            </a>
          </div>
        </header>

        <div className="cm-frame">
          <ul className="cm-fws">
            {FRAMEWORKS.map((f) => (
              <li className="cm-fw" key={f.name}>
                <Badge code={f.code} />
                <h3>{f.name}</h3>
                <p>{f.desc}</p>
                <span className="cm-al">
                  <Check />
                  Aligned
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="cm-items">
          {COMMITMENTS.map((c) => (
            <li className="cm-item" key={c.title}>
              <span className="cm-ico">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </li>
          ))}
        </ul>

        <p className="cm-note">
          Framework alignment reflects how our products are built and deployed. Documentation for your audit is available on request.
        </p>
      </div>
    </section>
  )
}
