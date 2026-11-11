import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  ['InFLOW', 'https://inflow.cirakas.com/'],
  ['STREAM', 'https://stream.cirakas.com/'],
  ['COAT', 'https://coat.cirakas.com/'],
  ['QLMS', 'https://qlms.cirakas.com/'],
  ['DSM', 'https://dsm.cirakas.com/'],
  ['SAMT', 'https://samt.cirakas.com/'],
]
const COMPANY = [['Products', '#products'], ['Compliance', '#compliance'], ['Team', '#team'], ['Contact', '#contact']]
const SOCIAL = [
  ['Instagram', 'https://www.instagram.com/cirakas'],
  ['Facebook', 'https://www.facebook.com/profile.php?id=100088813496171'],
]
const WORD = 'CIRAKAS'.split('')

export default function Footer() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ft-top > *', {
        y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      })
      gsap.from('.ft-letter', {
        yPercent: 105, duration: 1.2, ease: 'power4.out', stagger: 0.07,
        scrollTrigger: { trigger: '.ft-word', start: 'top 95%', toggleActions: 'play none none none' },
      })
    })
    return () => mm.revert()
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <footer className="ft" ref={ref}>
      <div className="ft-inner">
        <div className="ft-top">
          <div className="ft-brand">
            <a href="#top" aria-label="Cirakas" onClick={(e) => { e.preventDefault(); toTop() }}>
              <img src="/logo-footer.png" alt="Cirakas" />
            </a>
            <p>Software products for the way your business runs.</p>
          </div>

          <nav className="ft-col" aria-label="Products">
            <h4>Products</h4>
            <ul>{PRODUCTS.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}</ul>
          </nav>

          <nav className="ft-col" aria-label="Company">
            <h4>Company</h4>
            <ul>{COMPANY.map(([n, u]) => <li key={n}><a href={u}>{n}</a></li>)}</ul>
          </nav>

          <div className="ft-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:info@cirakas.com">info@cirakas.com</a></li>
              <li><a href="tel:+917025216219">+91 7025216219</a></li>
              <li className="ft-addr">Sreekaryam, Trivandrum,<br />Kerala, India</li>
            </ul>
          </div>

          <nav className="ft-col" aria-label="Social">
            <h4>Follow</h4>
            <ul>{SOCIAL.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}</ul>
          </nav>
        </div>
      </div>

      <div className="ft-word" aria-hidden="true">
        {WORD.map((l, i) => <span className="ft-mask" key={i}><span className="ft-letter">{l}</span></span>)}
      </div>

      <div className="ft-inner">
        <div className="ft-bar">
          <span>&copy; 2026 Cirakas. All rights reserved.</span>
          <button type="button" onClick={toTop}>Back to top <i aria-hidden="true">↑</i></button>
        </div>
      </div>
    </footer>
  )
}
