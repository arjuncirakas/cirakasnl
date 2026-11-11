import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PRODUCTS = [
  ['InFLOW', 'https://inflow.cirakas.com/'],
  ['STREAM', 'https://stream.cirakas.com/'],
  ['COAT', 'https://coat.cirakas.com/'],
  ['QLMS', 'https://qlms.cirakas.com/'],
  ['DSM', 'https://dsm.cirakas.com/'],
  ['SAMT', 'https://samt.cirakas.com/'],
]
const COMPANY = [
  ['About', '#about'],
  ['How it works', '#how-it-works'],
  ['Compliance', '#compliance'],
  ['Team', '#team'],
  ['Contact', '#contact'],
]
const CONNECT = [
  ['Email', 'info@cirakas.com', 'mailto:info@cirakas.com'],
  ['Instagram', 'Instagram', 'https://www.instagram.com/cirakas'],
  ['Facebook', 'Facebook', 'https://www.facebook.com/profile.php?id=100088813496171'],
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
      gsap.from('.ft-col', {
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

            <nav className="ft-col" aria-label="Products">
              <h3>Products</h3>
              <ul>
                {PRODUCTS.map(([label, href]) => (
                  <li key={label}><a className="ft-link" href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>
                ))}
              </ul>
            </nav>

            <nav className="ft-col" aria-label="Company">
              <h3>Company</h3>
              <ul>
                {COMPANY.map(([label, href]) => (
                  <li key={label}><a className="ft-link" href={href} onClick={(e) => goHash(e, href)}>{label}</a></li>
                ))}
              </ul>
            </nav>

            <nav className="ft-col" aria-label="Connect">
              <h3>Connect</h3>
              <ul>
                {CONNECT.map(([label, text, href]) => (
                  <li key={label}>
                    <a className="ft-link" href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{text}</a>
                  </li>
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
