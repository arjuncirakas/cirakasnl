import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Compliance.css'

gsap.registerPlugin(ScrollTrigger)

const FRAMEWORKS = ['GDPR', 'EU AI Act', 'NIS2', 'ISO 27001', 'EU Data Act', 'AIC4']

const Star = () => (
  <svg className="cp-star" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" fill="none" />
  </svg>
)

const Group = ({ hidden }) => (
  <div className="cp-group" aria-hidden={hidden || undefined}>
    {FRAMEWORKS.map((f, i) => (
      <span className="cp-item" key={f}>
        <span className={i % 2 ? 'cp-word cp-out' : 'cp-word'}>{f}</span>
        <Star />
      </span>
    ))}
  </div>
)

export default function Compliance() {
  const ref = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const loop = gsap.to(trackRef.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
      const marq = el.querySelector('.cp-marq')
      const slow = () => gsap.to(loop, { timeScale: 0, duration: 0.6, overwrite: true })
      const go = () => gsap.to(loop, { timeScale: 1, duration: 0.6, overwrite: true })
      marq.addEventListener('mouseenter', slow)
      marq.addEventListener('mouseleave', go)

      gsap.from('.cp-head > *', {
        y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
      })
      gsap.from('.cp-marq', {
        opacity: 0, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: '.cp-marq', start: 'top 90%', toggleActions: 'play none none none' },
      })

      return () => {
        marq.removeEventListener('mouseenter', slow)
        marq.removeEventListener('mouseleave', go)
      }
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
      </div>

      <div className="cp-marq" aria-label="Frameworks we build around: GDPR, EU AI Act, NIS2, ISO 27001, EU Data Act, AIC4">
        <div className="cp-track" ref={trackRef}>
          <Group />
          <Group hidden />
        </div>
      </div>
    </section>
  )
}
