import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import './Menu.css'

const LINKS = [
  ['Home', '#top'],
  ['Products', '#products'],
  ['How it works', '#how-it-works'],
  ['Compliance', '#compliance'],
  ['Team', '#team'],
  ['Contact', '#contact'],
]
const CLOSED = 'inset(0% 0% 100% 0%)'
const OPEN = 'inset(0% 0% 0% 0%)'
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Arrow = () => (
  <svg className="mn-arrow" viewBox="0 0 24 24" width="0.5em" height="0.5em" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Menu({ icon }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const openBtn = useRef(null)
  const closeBtn = useRef(null)
  const tl = useRef(null)
  const prev = useRef(false)

  const close = useCallback(() => setOpen(false), [])

  /* open / close animation + scroll lock */
  useEffect(() => {
    if (prev.current === open) return
    prev.current = open
    const root = rootRef.current
    if (!root) return
    const q = gsap.utils.selector(root)
    const panel = q('.mn-panel')
    const edge = q('.mn-edge')
    const lines = q('.mn-line > span')
    const rise = q('.mn-rise')
    const html = document.documentElement
    tl.current?.kill()

    if (open) {
      html.style.overflow = 'hidden'
      gsap.set(root, { visibility: 'visible' })
      if (reduced()) {
        gsap.set([panel, edge], { clipPath: OPEN })
        gsap.set([lines, rise], { clearProps: 'all' })
        tl.current = gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.25, onComplete: () => closeBtn.current?.focus() })
        return
      }
      gsap.set(lines, { yPercent: 110 })
      gsap.set(rise, { y: 24, opacity: 0 })
      tl.current = gsap.timeline({ defaults: { ease: 'power4.inOut' }, onComplete: () => closeBtn.current?.focus() })
        .set(root, { opacity: 1 })
        .fromTo(edge, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.85 }, 0)
        .fromTo(panel, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.85 }, 0.09)
        .to(lines, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.07 }, 0.6)
        .to(rise, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 0.78)
    } else {
      html.style.overflow = ''
      openBtn.current?.focus({ preventScroll: true })
      const done = () => {
        gsap.set(root, { visibility: 'hidden' })
        gsap.set([panel, edge], { clipPath: CLOSED })
      }
      if (reduced()) {
        tl.current = gsap.to(root, { opacity: 0, duration: 0.2, onComplete: done })
        return
      }
      tl.current = gsap.timeline({ defaults: { ease: 'power4.inOut' }, onComplete: done })
        .to(rise, { y: -16, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
        .to(lines, { yPercent: -110, duration: 0.45, ease: 'power3.in', stagger: 0.03 }, 0)
        .to(panel, { clipPath: CLOSED, duration: 0.8 }, 0.18)
        .to(edge, { clipPath: CLOSED, duration: 0.8 }, 0.27)
    }
  }, [open])

  /* Esc to close + basic focus trap */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return }
      if (e.key !== 'Tab') return
      const f = rootRef.current?.querySelectorAll('a[href], button')
      if (!f || !f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => () => { document.documentElement.style.overflow = '' }, [])

  const go = (e, href) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    close()
    const behavior = reduced() ? 'auto' : 'smooth'
    setTimeout(() => {
      if (href === '#top') window.scrollTo({ top: 0, behavior })
      else document.querySelector(href)?.scrollIntoView({ behavior, block: 'start' })
    }, 120)
  }

  const overlay = (
    <div className="mn" ref={rootRef} data-open={open} aria-hidden={!open} inert={!open} role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="mn-edge" />
      <div className="mn-panel">
        <div className="mn-top">
          <a href="/" className="mn-logo" aria-label="Cirakas home" onClick={(e) => go(e, '#top')}>
            <img src="/logo-footer.png" alt="cirakas" />
          </a>
          <button type="button" className="mn-x" ref={closeBtn} aria-label="Close menu" onClick={close}>
            <i /><i /><i />
          </button>
        </div>

        <div className="mn-main">
          <nav className="mn-nav" aria-label="Menu">
            <div className="mn-eyebrow mn-rise"><span>Menu</span><span>({String(LINKS.length).padStart(2, '0')})</span></div>
            <ul>
              {LINKS.map(([label, href], i) => (
                <li key={href}>
                  <a href={href} className="mn-link" onClick={(e) => go(e, href)}>
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    <span className="mn-line"><span>{label}</span></span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <figure className="mn-card mn-rise">
            <div className="mn-card-img" />
            <figcaption>Ready-to-deploy software for the way your business runs.</figcaption>
          </figure>
        </div>

      </div>
    </div>
  )

  return (
    <>
      <button type="button" className="nav-menu" ref={openBtn} aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
        {icon}
      </button>
      {createPortal(overlay, document.body)}
    </>
  )
}
