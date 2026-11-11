import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'info@cirakas.com'

const Arrow = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path d="M2 8h11M9 3.5L13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Contact() {
  const ref = useRef(null)
  const btnRef = useRef(null)
  const [v, setV] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setSent(false)
    setV((s) => ({ ...s, [k]: e.target.value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = `Enquiry from ${v.name}`
    const body = [`Name: ${v.name}`, `Email: ${v.email}`, '', v.message].join('\n')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = (trigger, start) => ({ trigger, start, toggleActions: 'play none none none' })
      gsap.from('.ct-eyebrow', { y: 14, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: st(el, 'top 78%') })
      gsap.from('.ct-line > span', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.14, scrollTrigger: st('.ct-title', 'top 86%') })
      gsap.from('.ct-reveal', {
        y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.2, clearProps: 'transform,opacity',
        scrollTrigger: st('.ct-title', 'top 80%'),
      })

      const btn = btnRef.current
      const move = (e) => {
        const r = btn.getBoundingClientRect()
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.06, y: (e.clientY - r.top - r.height / 2) * 0.2, duration: 0.4, ease: 'power3.out' })
      }
      const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' })
      btn.addEventListener('mousemove', move)
      btn.addEventListener('mouseleave', leave)
      return () => {
        btn.removeEventListener('mousemove', move)
        btn.removeEventListener('mouseleave', leave)
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="ct" id="contact" ref={ref} aria-label="Contact">
      <div className="ct-wrap">
        <span className="ct-eyebrow"><i aria-hidden="true" />Contact</span>

        <h2 className="ct-title">
          <span className="ct-line ct-sub"><span>Build the future with</span></span>
          <span className="ct-line ct-brand"><span>Cirakas</span></span>
        </h2>
        <p className="ct-lede ct-reveal">
          Ready-to-deploy software for the way your business runs.
        </p>

        <form className="ct-form ct-reveal" onSubmit={onSubmit}>
          <div className="ct-field">
            <label htmlFor="ct-name">Name</label>
            <input id="ct-name" name="name" required autoComplete="name" placeholder="Enter your name" value={v.name} onChange={set('name')} />
          </div>
          <div className="ct-field">
            <label htmlFor="ct-email">Work email</label>
            <input id="ct-email" name="email" type="email" required autoComplete="email" placeholder="Enter work email" value={v.email} onChange={set('email')} />
          </div>
          <div className="ct-field ct-wide">
            <label htmlFor="ct-msg">Message</label>
            <textarea id="ct-msg" name="message" rows={4} required placeholder="Tell us what you need" value={v.message} onChange={set('message')} />
          </div>

          <button type="submit" className="ct-send" ref={btnRef}>
            <span className="ct-send-label">Send message</span>
            <b aria-hidden="true"><Arrow /></b>
          </button>

          <p className="ct-status" role="status" data-show={sent}>
            {sent ? 'Thanks \u2014 your email app should open shortly.' : ''}
          </p>
        </form>

        <p className="ct-alt ct-reveal">
          Or email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>
    </section>
  )
}
