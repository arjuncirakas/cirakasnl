import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import VideoBg from './VideoBg'

const icons = {
  menuThree: (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
      <path d="M1 1.5H17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M1 7H17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M1 12.5H17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  arrowRight: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H10M17 7V14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  dots: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="3.2" cy="3.2" r="1.55" fill="#111111" />
      <circle cx="12.8" cy="3.2" r="1.55" fill="#111111" />
      <circle cx="3.2" cy="12.8" r="1.55" fill="#111111" />
      <circle cx="12.8" cy="12.8" r="1.55" fill="#111111" />
    </svg>
  ),
  trend: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Products', href: '#products' },
  { label: 'Compliance', href: '#compliance' },
  { label: 'Team', href: '#team' },
]
const tags = ['AI-Native', 'Intelligent', 'Autonomous']

export default function Hero() {
  const root = useRef(null)
  const cursorRef = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(el.querySelectorAll('.h-anim, .h-line > span, .blue-rule, .hero-media'), {
        clearProps: 'all',
      })
      el.classList.add('is-ready')
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(el)
      const ctx = gsap.context(() => {
        gsap.set(q('.h-anim'), { opacity: 0, y: 28 })
        gsap.set(q('.h-nav'), { opacity: 0, y: -14 })
        gsap.set(q('.h-line > span'), { yPercent: 110 })
        gsap.set(q('.blue-rule'), { scaleX: 0, transformOrigin: 'left center' })
        gsap.set(q('.hero-media'), { scale: 1.1, opacity: 0.7 })
        gsap.set(q('.tag'), { opacity: 0, y: 14 })

        el.classList.add('is-ready')

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          delay: 0.08,
        })

        tl.to(q('.hero-media'), {
          scale: 1,
          opacity: 1,
          duration: 2.2,
          ease: 'power2.out',
        }, 0)
          .to(q('.h-nav'), {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.06,
            ease: 'power3.out',
          }, 0.18)
          .to(q('.h-eyebrow'), {
            opacity: 1,
            y: 0,
            duration: 1,
          }, 0.38)
          .to(q('.blue-rule'), {
            scaleX: 1,
            duration: 0.85,
            ease: 'power3.inOut',
          }, 0.55)
          .to(q('.h-line > span'), {
            yPercent: 0,
            duration: 1.15,
            stagger: 0.12,
            ease: 'power4.out',
          }, 0.48)
          .to(q('.h-card'), {
            opacity: 1,
            y: 0,
            duration: 1.05,
            stagger: 0.12,
            ease: 'power3.out',
          }, 0.72)
          .to(q('.tag'), {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: 'power3.out',
          }, 0.92)
      }, el)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  useLayoutEffect(() => {
    const el = root.current
    const tip = cursorRef.current
    if (!el || !tip) return

    const mm = gsap.matchMedia()

    mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const xTo = gsap.quickTo(tip, 'x', { duration: 0.22, ease: 'power3.out' })
      const yTo = gsap.quickTo(tip, 'y', { duration: 0.22, ease: 'power3.out' })

      gsap.set(tip, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.4 })

      const move = (e) => {
        const r = el.getBoundingClientRect()
        xTo(e.clientX - r.left)
        yTo(e.clientY - r.top)
      }

      const enter = () => {
        gsap.to(tip, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' })
      }

      const leave = () => {
        tip.dataset.hot = 'false'
        gsap.to(tip, { opacity: 0, scale: 0.4, duration: 0.25, ease: 'power2.in' })
      }

      const over = (e) => {
        const hot = !!e.target.closest('a, button, .stat-card, .tag')
        tip.dataset.hot = hot ? 'true' : 'false'
        gsap.to(tip, { scale: hot ? 1.65 : 1, duration: 0.28, ease: 'power3.out' })
      }

      el.addEventListener('pointerenter', enter)
      el.addEventListener('pointerleave', leave)
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerover', over)

      return () => {
        el.removeEventListener('pointerenter', enter)
        el.removeEventListener('pointerleave', leave)
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerover', over)
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <div className="hero-page" id="top" ref={root}>
      <section className="hero-shell">
        <div className="hero-media" aria-hidden="true">
          <VideoBg />
        </div>

        <div className="hero-tip" ref={cursorRef} aria-hidden="true" />

        <header className="hero-nav">
          <div className="brand-block h-nav">
            <a href="/" className="brand" aria-label="Cirakas home">
              <img src="/logo-footer.png" alt="cirakas" className="brand-logo" />
            </a>
          </div>

          <nav className="nav-links h-nav" aria-label="Primary">
            {navLinks.map(({ label, href }) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-actions h-nav">
            <a href="#contact" className="nav-cta">
              Contact Us
              <span className="nav-cta-arrow">{icons.arrowRight}</span>
            </a>
            <button type="button" className="nav-menu" aria-label="Open menu">
              {icons.menuThree}
            </button>
          </div>
        </header>

        <div className="hero-body">
          <div className="hero-copy">
            <div className="copy-left">
              <p className="eyebrow h-anim h-eyebrow">
                Built for your team.
                <br />
                <span className="impact-line">
                  Hosted your way.
                  <span className="blue-rule" aria-hidden="true" />
                </span>
              </p>
            </div>

            <div className="copy-right">
              <h1>
                <span className="headline-line h-line">
                  <span>We Build Products</span>
                </span>
                <span className="headline-line h-line">
                  <span>That Run Business</span>
                </span>
              </h1>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="stat-stack">
              <article className="stat-card light h-anim h-card">
                <div className="stat-top">
                  <span className="stat-icon plain">{icons.dots}</span>
                  <span>Our Products</span>
                </div>
                <div className="stat-main">
                  <p className="stat-value">6+</p>
                  <p className="stat-caption">Ready-to-deploy products</p>
                </div>
              </article>

              <article className="stat-card glass h-anim h-card">
                <div className="stat-top">
                  <span className="grow-label">Your Servers or EU Cloud</span>
                  <span className="stat-icon ghost">{icons.trend}</span>
                </div>
                <p className="stat-note">
                  Deploy on your premises or host in the EU region, your data stays with you.
                </p>
              </article>
            </div>

            <div className="tag-row">
              {tags.map((tag) => (
                <span key={tag} className="tag outline">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
