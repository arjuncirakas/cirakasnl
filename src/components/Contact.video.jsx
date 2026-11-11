import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'info@cirakas.com'
const PHONE = '+91 7025216219'
const PHONE_HREF = 'tel:+917025216219'
const ADDRESS = ['TC VIII / 1590, Venchavodu,', 'Sreekaryam, Trivandrum,', 'Kerala 695017, India']

const INTERESTS = ['InFLOW', 'STREAM', 'COAT', 'QLMS', 'DSM', 'SAMT', 'Not sure yet']
const DEPLOY = ['On-premise', 'EU cloud']

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Contact() {
  const ref = useRef(null)
  const btnRef = useRef(null)
  const [reduce] = useState(prefersReduced)
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' })
  const [interests, setInterests] = useState([])
  const [deploy, setDeploy] = useState('')
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggle = (v) => setInterests((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]))

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = `Enquiry from ${form.name}${form.company ? ` (${form.company})` : ''}`
    const lines = [`Name: ${form.name}`]
    if (form.company) lines.push(`Company: ${form.company}`)
    lines.push(`Email: ${form.email}`)
    if (interests.length) lines.push(`Interested in: ${interests.join(', ')}`)
    if (deploy) lines.push(`Deployment: ${deploy}`)
    lines.push('', form.message)
    const body = lines.join('\n')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ct-eyebrow', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none none' } })
      gsap.from('.ct-line > span', {
        yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12,
        scrollTrigger: { trigger: '.ct-title', start: 'top 82%', toggleActions: 'play none none none' },
      })
      gsap.from('.ct-lede, .ct-mail, .ct-info > div', {
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.25,
        scrollTrigger: { trigger: '.ct-title', start: 'top 82%', toggleActions: 'play none none none' },
      })
      gsap.from('.ct-card', {
        y: 70, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ct-card', start: 'top 90%', toggleActions: 'play none none none' },
      })

      const btn = btnRef.current
      const move = (e) => {
        const r = btn.getBoundingClientRect()
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power3.out' })
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
      <div className="ct-stage">
        <div className="ct-bg" aria-hidden="true">
          {reduce ? (
            <img src="/products/fluid-1.jpg" alt="" />
          ) : (
            <video src="/hero-bg.mp4" poster="/products/fluid-1.jpg" autoPlay muted loop playsInline preload="auto" />
          )}
          <div className="ct-wash" />
        </div>

        <div className="ct-inner">
          <div className="ct-left">
            <span className="ct-eyebrow"><i aria-hidden="true" />Contact</span>
            <h2 className="ct-title">
              <span className="ct-line"><span>Let&rsquo;s build</span></span>
              <span className="ct-line"><span>what your</span></span>
              <span className="ct-line"><span><em>business</em> runs on.</span></span>
            </h2>
            <p className="ct-lede">Tell us what you need. We&rsquo;ll show you how it runs on your premises or in an EU-region cloud.</p>
            <a className="ct-mail" href={`mailto:${EMAIL}`}>{EMAIL}<i aria-hidden="true">↗</i></a>
            <div className="ct-info">
              <div>
                <span>Call</span>
                <a href={PHONE_HREF}>{PHONE}</a>
              </div>
              <div>
                <span>Visit</span>
                <address>{ADDRESS.map((l) => <span key={l}>{l}</span>)}</address>
              </div>
            </div>
          </div>

          <form className="ct-card" onSubmit={onSubmit}>
            <div className="ct-row2">
              <div className="ct-field">
                <input id="ct-name" name="name" placeholder=" " required autoComplete="name" value={form.name} onChange={set('name')} />
                <label htmlFor="ct-name">Name</label>
              </div>
              <div className="ct-field">
                <input id="ct-company" name="company" placeholder=" " autoComplete="organization" value={form.company} onChange={set('company')} />
                <label htmlFor="ct-company">Company</label>
              </div>
            </div>
            <div className="ct-field">
              <input id="ct-email" name="email" type="email" placeholder=" " required autoComplete="email" value={form.email} onChange={set('email')} />
              <label htmlFor="ct-email">Work email</label>
            </div>
            <div className="ct-field">
              <textarea id="ct-msg" name="message" rows="3" placeholder=" " required value={form.message} onChange={set('message')} />
              <label htmlFor="ct-msg">How can we help?</label>
            </div>

            <fieldset className="ct-group">
              <legend>I&rsquo;m interested in</legend>
              <div className="ct-chips">
                {INTERESTS.map((v) => (
                  <button type="button" key={v} className="ct-chip" aria-pressed={interests.includes(v)} onClick={() => toggle(v)}>{v}</button>
                ))}
              </div>
            </fieldset>

            <fieldset className="ct-group">
              <legend>Deployment</legend>
              <div className="ct-chips">
                {DEPLOY.map((v) => (
                  <button type="button" key={v} className="ct-chip" aria-pressed={deploy === v} onClick={() => setDeploy(deploy === v ? '' : v)}>{v}</button>
                ))}
              </div>
            </fieldset>

            <div className="ct-submit">
              <button type="submit" className="ct-send" ref={btnRef}>
                <span>Send message</span><i aria-hidden="true">→</i>
              </button>
              <p role="status">
                {sent
                  ? `Thanks. Your email app should open with this message addressed to ${EMAIL}.`
                  : `Submitting opens your email app with this message addressed to ${EMAIL}.`}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
