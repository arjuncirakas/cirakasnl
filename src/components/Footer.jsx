import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const COMPANY = [
  ['About', '#about'],
  ['How it works', '#how-it-works'],
  ['Compliance', '#compliance'],
  ['Team', '#team'],
  ['Contact', '#contact'],
]
const ico = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const CONNECT = [
  [
    'Email', 'info@cirakas.com', 'mailto:info@cirakas.com',
    <svg key="m" viewBox="0 0 24 24" {...ico}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4.5 7.5 6.6 5a1.5 1.5 0 0 0 1.8 0l6.6-5" /></svg>,
  ],
  [
    'Instagram', 'Instagram', 'https://www.instagram.com/cirakas',
    <svg key="i" viewBox="0 0 24 24" {...ico}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.9" /><path d="M17.2 6.8h.01" /></svg>,
  ],
  [
    'Facebook', 'Facebook', 'https://www.facebook.com/profile.php?id=100088813496171',
    <svg key="f" viewBox="0 0 24 24" {...ico}><path d="M14.2 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.6-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.6v3h2.6V21" /></svg>,
  ],
]

export default function Footer() {
  const ref = useRef(null)
  const ctaRef = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ft-reveal', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.09, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
      })
      gsap.from('.ft-brand, .ft-col', {
        y: 26, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.ft-grid', start: 'top 94%', toggleActions: 'play none none none' },
      })

      const btn = ctaRef.current
      const move = (e) => {
        const r = btn.getBoundingClientRect()
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28, duration: 0.45, ease: 'power3.out' })
      }
      const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' })
      btn.addEventListener('mousemove', move)
      btn.addEventListener('mouseleave', leave)
      return () => {
        btn.removeEventListener('mousemove', move)
        btn.removeEventListener('mouseleave', leave)
      }
    })
    return () => mm.revert()
  }, [])

  const toTop = () => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })
  const toProducts = (e) => {
    const t = document.getElementById('products')
    if (!t) return
    e.preventDefault()
    t.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
  }

  const goHash = (e, href) => {
    const t = document.querySelector(href)
    if (!t) return
    e.preventDefault()
    t.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <footer className="ft" ref={ref}>
      <div className="ft-panel">
        <div className="ft-inner">
          <div className="ft-hero">
            <h2 className="ft-ask ft-reveal">
              Looking for the right product?
              <span>Let&rsquo;s talk.</span>
            </h2>
            <a className="ft-cta ft-reveal" href="#products" onClick={toProducts} ref={ctaRef} aria-label="See our products">
              <span className="ft-cta-bg" aria-hidden="true" />
              <span className="ft-cta-label">See our products</span>
              <b aria-hidden="true">→</b>
            </a>
          </div>

          <div className="ft-grid">
            <div className="ft-col ft-brand">
              <img className="ft-mark" src="/logo-footer.png" alt="Cirakas" />
              <p>Ready-to-deploy software for the way your business runs.</p>
            </div>

            <nav className="ft-col ft-connect" aria-label="Connect">
              <h3>Connect</h3>
              <ul>
                {CONNECT.map(([label, text, href, icon]) => (
                  <li key={label}>
                    <a className="ft-link ft-conn" href={href} aria-label={label === 'Email' ? undefined : label} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      <span className="ft-ico">{icon}</span>
                      <span className="ft-lt">{text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="ft-col ft-company" aria-label="Company">
              <h3>Company</h3>
              <ul>
                {COMPANY.map(([label, href]) => (
                  <li key={label}><a className="ft-link" href={href} onClick={(e) => goHash(e, href)}>{label}</a></li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="ft-bar">
            <span>&copy; 2026 Cirakas. All rights reserved.</span>
            <button type="button" onClick={toTop}>Back to top <i aria-hidden="true">↑</i></button>
          </div>
        </div>
      </div>
    </footer>
  )
}
