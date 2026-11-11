import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'info@cirakas.com'

export default function Contact() {
  const ref = useRef(null)
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
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ct-reveal', {
        y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none none' },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="ct" id="contact" ref={ref} aria-label="Contact">
      <div className="ct-wrap">
        <h2 className="ct-title ct-reveal">
          <span>Build the future with</span>
          Cirakas
        </h2>
        <p className="ct-lede ct-reveal">
          Ready-to-deploy software for the way your business runs.
        </p>

        <form className="ct-form ct-reveal" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="ct-name">Name</label>
          <input
            id="ct-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Enter your name"
            value={v.name}
            onChange={set('name')}
          />

          <label className="sr-only" htmlFor="ct-email">Work email</label>
          <input
            id="ct-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter work email"
            value={v.email}
            onChange={set('email')}
          />

          <label className="sr-only" htmlFor="ct-msg">Message</label>
          <textarea
            id="ct-msg"
            name="message"
            rows={3}
            required
            placeholder="Tell us what you need"
            value={v.message}
            onChange={set('message')}
          />

          <button type="submit" className="ct-send">
            Submit <span aria-hidden="true">→</span>
          </button>

          <p className="ct-status" role="status" data-show={sent}>
            {sent ? 'Thanks — your email app should open shortly.' : ''}
          </p>
        </form>
      </div>
    </section>
  )
}
