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
    if (!el) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(el)
        const head = q('.cm-head')[0]
        const frame = q('.cm-frame')[0]

        gsap.set(q('.cm-eyebrow'), { opacity: 0, y: 14 })
        gsap.set(q('.cm-hline > span'), { yPercent: 115 })
        gsap.set(q('.cm-side'), { opacity: 0, y: 22 })
        gsap.set(frame, { opacity: 0, y: 48 })
        gsap.set(q('.cm-fw'), { opacity: 0, y: 28 })

        const headTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: head,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })

        headTl
          .to(q('.cm-eyebrow'), { opacity: 1, y: 0, duration: 0.8 }, 0)
          .to(q('.cm-hline > span'), {
            yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          }, 0.1)
          .to(q('.cm-side'), {
            opacity: 1, y: 0, duration: 0.95, clearProps: 'transform,opacity',
          }, 0.28)

        const cardsTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: frame,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        })

        cardsTl
          .to(frame, {
            opacity: 1, y: 0, duration: 1, clearProps: 'transform,opacity',
          }, 0)
          .to(q('.cm-fw'), {
            opacity: 1, y: 0, duration: 0.85, stagger: 0.08, clearProps: 'transform,opacity',
          }, 0.12)
          .from(q('.cm-badge'), {
            scale: 0.72, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
            clearProps: 'transform,opacity',
            transformOrigin: 'left center',
          }, 0.18)
      }, el)

      return () => ctx.revert()
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
            <h2>
              <span className="cm-hline"><span>Built for compliance</span></span>
              <span className="cm-hline"><span>from day one.</span></span>
            </h2>
          </div>
          <div className="cm-side">
            <p>Run on your premises or in an EU region cloud, with the controls auditors expect.</p>
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
      </div>
    </section>
  )
}
