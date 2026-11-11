import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Compliance.css'

gsap.registerPlugin(ScrollTrigger)

const FRAMEWORKS = [
  { code: 'GDPR', tag: 'Regulation', name: 'GDPR', title: 'General Data Protection Regulation', text: 'Personal data handled with consent, access controls and clear retention.' },
  { code: 'AI ACT', tag: 'Regulation', name: 'EU AI Act', title: 'Artificial Intelligence Act', text: 'Transparent, documented AI features with human oversight.' },
  { code: 'NIS2', tag: 'Directive', name: 'NIS2', title: 'Network and Information Security Directive', text: 'Security controls and incident handling for critical operations.' },
  { code: 'ISO', tag: 'Standard', name: 'ISO 27001', title: 'Information Security Management', text: 'Practices built around ISO 27001 security controls.' },
  { code: 'DATA ACT', tag: 'Regulation', name: 'EU Data Act', title: 'Data Act', text: 'Fair access to and portability of the data your systems generate.' },
  { code: 'AIC4', tag: 'Criteria', name: 'AIC4', title: 'AI Cloud Service Compliance Criteria Catalogue', text: 'Cloud-based AI services built to BSI AIC4 criteria.' },
]

const CONTROLS = [
  ['Encryption at rest & in transit', 'Security'],
  ['Role-based access control', 'Access'],
  ['Full audit trail', 'Audit'],
  ['Data residency you choose', 'Data'],
  ['Human oversight on AI decisions', 'AI'],
  ['Incident response & logging', 'Operations'],
  ['Data export & portability', 'Data'],
]

const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })

function Seal({ code, index }) {
  const uid = useId()
  const pid = `${uid}-ring-${index}`
  const big = code.length <= 5
  return (
    <svg className="cp-seal" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="57" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      <circle cx="60" cy="60" r="36" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      <defs><path id={pid} d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs>
      <g className="cp-ring">
        <text fontSize="7.2" fontWeight="700" letterSpacing="0.6" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">
          <textPath href={`#${pid}`} textLength="292" lengthAdjust="spacing">
            {`ALIGNED \u2022 ${code} \u2022 ALIGNED \u2022 ${code} \u2022 `}
          </textPath>
        </text>
      </g>
      <text x="60" y={big ? 66 : 64} textAnchor="middle" fontSize={big ? 17 : 11.5} fontWeight="700" letterSpacing="-0.3" fill="#fff">
        {code.includes(' ') ? <><tspan x="60" dy="-3">{code.split(' ')[0]}</tspan><tspan x="60" dy="13">{code.split(' ')[1]}</tspan></> : code}
      </text>
      <circle cx="60" cy="3" r="2.6" fill="#f26531" />
    </svg>
  )
}

const Tick = () => (
  <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
    <path d="M2.2 6.4l2.5 2.5 5-5.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Compliance() {
  const ref = useRef(null)
  const [time, setTime] = useState(() => clock.format(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(clock.format(new Date())), 30000)
    return () => clearInterval(id)
  }, [])

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia(el)

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = (trigger, start) => ({ trigger, start, toggleActions: 'play none none none' })

      gsap.from('.cp-head > *', { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity', scrollTrigger: st(el, 'top 72%') })

      /* console: controls switch on one by one, bar fills to 7/7 */
      const count = el.querySelector('.cp-count')
      const label = el.querySelector('.cp-state')
      const n = CONTROLS.length
      count.textContent = `0/${n}`
      label.textContent = 'Running checks'
      const tick = { v: 0 }
      const ctl = gsap.timeline({ scrollTrigger: st('.cp-console', 'top 72%') })
      ctl.from('.cp-console', { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity' })
        .from('.cp-row', { x: -16, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 }, 0.3)
        .fromTo('.cp-wait', { opacity: 1 }, { opacity: 0, duration: 0.2, stagger: 0.42 }, 0.9)
        .fromTo('.cp-on', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', stagger: 0.42 }, 0.9)
        .fromTo('.cp-bar i', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.42 * (n - 1) + 0.3, ease: 'none' }, 0.9)
        .to(tick, { v: n, duration: 0.42 * (n - 1) + 0.3, ease: 'none', onUpdate: () => { count.textContent = `${Math.min(n, Math.round(tick.v + 0.49))}/${n}` } }, 0.9)
        .add(() => { count.textContent = `${n}/${n}`; label.textContent = 'All controls active' })

      gsap.from('.cp-card', { y: 48, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity', scrollTrigger: st('.cp-seals', 'top 80%') })
      gsap.from('.cp-foot > *', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity', scrollTrigger: st('.cp-foot', 'top 95%') })

      /* slowly rotating seal text; speeds up on hover */
      const cleanups = []
      el.querySelectorAll('.cp-card').forEach((card) => {
        const ring = card.querySelector('.cp-ring')
        const spin = gsap.to(ring, { rotation: 360, svgOrigin: '60 60', duration: 36, repeat: -1, ease: 'none' })
        const fast = () => gsap.to(spin, { timeScale: 5, duration: 0.5 })
        const slow = () => gsap.to(spin, { timeScale: 1, duration: 0.8 })
        card.addEventListener('pointerenter', fast)
        card.addEventListener('pointerleave', slow)
        card.addEventListener('focusin', fast)
        card.addEventListener('focusout', slow)
        cleanups.push(() => {
          card.removeEventListener('pointerenter', fast)
          card.removeEventListener('pointerleave', slow)
          card.removeEventListener('focusin', fast)
          card.removeEventListener('focusout', slow)
        })
      })
      return () => cleanups.forEach((fn) => fn())
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="cp" id="compliance" ref={ref} aria-label="Compliance">
      <div className="cp-panel">
        <div className="cp-head">
          <div className="cp-title">
            <span className="cp-eyebrow"><i aria-hidden="true" />Compliance &amp; security</span>
            <h2>Built for compliance from day one.</h2>
          </div>
          <div className="cp-side">
            <p>Run on your premises or in an EU-region cloud, with the controls auditors expect.</p>
            <span className="cp-chip"><i aria-hidden="true" />Audit-ready controls</span>
          </div>
        </div>

        <div className="cp-main">
          <div className="cp-console" role="group" aria-label="Controls report">
            <div className="cp-bartop">
              <span className="cp-dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="cp-file">controls.log</span>
              <span className="cp-time">{time} IST</span>
            </div>
            <ul className="cp-list">
              {CONTROLS.map(([label, tag], i) => (
                <li className="cp-row" key={label}>
                  <span className="cp-st" aria-hidden="true">
                    <span className="cp-wait">[ &middot;&middot; ]</span>
                    <span className="cp-on">[ <Tick /> ]</span>
                  </span>
                  <span className="cp-lab"><span className="cp-no">{String(i + 1).padStart(2, '0')}</span>{label}</span>
                  <span className="cp-tagm">{tag}</span>
                </li>
              ))}
            </ul>
            <div className="cp-sum">
              <div className="cp-sumrow"><span className="cp-state" role="status">All controls active</span><span className="cp-count">{CONTROLS.length}/{CONTROLS.length}</span></div>
              <div className="cp-bar" aria-hidden="true"><i /></div>
            </div>
          </div>

          <ul className="cp-seals">
            {FRAMEWORKS.map((f, i) => (
              <li className="cp-card" key={f.name} tabIndex={0}>
                <Seal code={f.code} index={i} />
                <span className="cp-ctag">{f.tag}</span>
                <h3>{f.name}</h3>
                <span className="cp-ctitle">{f.title}</span>
                <p>{f.text}</p>
                <span className="cp-status"><i aria-hidden="true" />Aligned</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="cp-foot">
          <p>Framework alignment reflects how our products are built and deployed. Details for your audit are available on request.</p>
          <a href="#contact" className="cp-link">Talk to us about compliance <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
    </section>
  )
}
