import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
      gsap.from('.ft-mark', {
        y: 48, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ft-fit', start: 'top 95%', toggleActions: 'play none none none' },
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

        </div>

        <div className="ft-fit">
          <img className="ft-mark" src="/logo-footer.png" alt="Cirakas" />
        </div>

        <div className="ft-inner">
          <div className="ft-bar">
            <span>&copy; 2026 Cirakas. All rights reserved.</span>
            <button type="button" onClick={toTop}>Back to top <i aria-hidden="true">↑</i></button>
          </div>
        </div>
      </div>
    </footer>
  )
}
