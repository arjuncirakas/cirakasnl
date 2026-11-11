import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'info@cirakas.com'
const PHONE = '+91 7025216219'
const PHONE_HREF = 'tel:+917025216219'
const ADDRESS = ['TC VIII / 1590, Venchavodu,', 'Sreekaryam, Trivandrum,', 'Kerala 695017, India']
const SOCIAL = [
  ['Instagram', 'https://www.instagram.com/cirakas'],
  ['Facebook', 'https://www.facebook.com/profile.php?id=100088813496171'],
]

const INTERESTS = ['InFLOW', 'STREAM', 'COAT', 'QLMS', 'DSM', 'SAMT', 'Not sure yet']
const DEPLOY = ['On-premise', 'EU cloud']

export default function Contact() {
  const ref = useRef(null)
  const btnRef = useRef(null)
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' })
  const [interests, setInterests] = useState([])
  const [deploy, setDeploy] = useState('')
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggle = (v) => setInterests((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]))

  const jump = (e) => {
    e.preventDefault()
    const el = document.getElementById('ct-name')
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
  }

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
      gsap.from('.ct-eyebrow', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' } })
      gsap.from('.ct-line > span', {
        yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.14,
        scrollTrigger: { trigger: '.ct-title', start: 'top 85%', toggleActions: 'play none none none' },
      })
      gsap.from('.ct-rule', {
        scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: { trigger: '.ct-rule', start: 'top 92%', toggleActions: 'play none none none' },
      })
      gsap.from('.ct-aside > *', {
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.ct-grid', start: 'top 80%', toggleActions: 'play none none none' },
      })
      gsap.from('.ct-form > *', {
        y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09,
        scrollTrigger: { trigger: '.ct-form', start: 'top 85%', toggleActions: 'play none none none' },
      })

      const btn = btnRef.current
      const move = (e) => {
        const r = btn.getBoundingClientRect()
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power3.out' })
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
          <span className="ct-line">
            <span>
              Let&rsquo;s build
              <a className="ct-pill" href="#ct-name" onClick={jump} aria-label="Jump to the contact form">
                <b aria-hidden="true">↓</b>
              </a>
              what
            </span>
          </span>
          <span className="ct-line"><span>your business runs on.</span></span>
        </h2>

        <div className="ct-rule" aria-hidden="true" />

        <div className="ct-grid">
          <aside className="ct-aside">
            <span className="ct-label">Write to us</span>
            <a className="ct-mail" href={`mailto:${EMAIL}`}>
              <span className="ct-mail-text">{EMAIL}</span>
              <i aria-hidden="true">↗</i>
            </a>
            <p className="ct-lede">Tell us what you need. We&rsquo;ll show you how it runs on your premises or in an EU-region cloud.</p>

            <dl className="ct-facts">
              <div>
                <dt>Call</dt>
                <dd><a href={PHONE_HREF}>{PHONE}</a></dd>
              </div>
              <div>
                <dt>Visit</dt>
                <dd><address>{ADDRESS.map((l) => <span key={l}>{l}</span>)}</address></dd>
              </div>
              <div>
                <dt>Follow</dt>
                <dd className="ct-social">
                  {SOCIAL.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}
                </dd>
              </div>
            </dl>
          </aside>

          <form className="ct-form" onSubmit={onSubmit}>
            <div className="ct-row">
              <span className="ct-num" aria-hidden="true">01</span>
              <div className="ct-fw">
                <label htmlFor="ct-name">What&rsquo;s your name?</label>
                <input id="ct-name" name="name" required autoComplete="name" value={form.name} onChange={set('name')} />
              </div>
            </div>
            <div className="ct-row">
              <span className="ct-num" aria-hidden="true">02</span>
              <div className="ct-fw">
                <label htmlFor="ct-company">Company</label>
                <input id="ct-company" name="company" autoComplete="organization" value={form.company} onChange={set('company')} />
              </div>
            </div>
            <div className="ct-row">
              <span className="ct-num" aria-hidden="true">03</span>
              <div className="ct-fw">
                <label htmlFor="ct-email">Work email</label>
                <input id="ct-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} />
              </div>
            </div>

            <div className="ct-row">
              <span className="ct-num" aria-hidden="true">04</span>
              <fieldset className="ct-group">
                <legend>Which products interest you?</legend>
                <div className="ct-chips">
                  {INTERESTS.map((v) => (
                    <button type="button" key={v} className="ct-chip" aria-pressed={interests.includes(v)} onClick={() => toggle(v)}>{v}</button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="ct-row">
              <span className="ct-num" aria-hidden="true">05</span>
              <fieldset className="ct-group">
                <legend>Where should it run?</legend>
                <div className="ct-chips">
                  {DEPLOY.map((v) => (
                    <button type="button" key={v} className="ct-chip" aria-pressed={deploy === v} onClick={() => setDeploy(deploy === v ? '' : v)}>{v}</button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="ct-row">
              <span className="ct-num" aria-hidden="true">06</span>
              <div className="ct-fw">
                <label htmlFor="ct-msg">Tell us about your project</label>
                <textarea id="ct-msg" name="message" rows="3" required value={form.message} onChange={set('message')} />
              </div>
            </div>

            <div className="ct-submit">
              <button type="submit" className="ct-send" ref={btnRef}>
                <span>Send message</span>
                <b aria-hidden="true">→</b>
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
