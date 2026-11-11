import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'info@cirakas.com'
const PHONE = '+91 7025216219'
const PHONE_HREF = 'tel:+917025216219'
const SOCIAL = [
  ['Instagram', 'https://www.instagram.com/cirakas'],
  ['Facebook', 'https://www.facebook.com/profile.php?id=100088813496171'],
]
const INTERESTS = ['InFLOW', 'STREAM', 'COAT', 'QLMS', 'DSM', 'SAMT', 'Something custom']
const DEPLOY = ['On-premise', 'EU cloud', 'Not sure yet']

const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })

const Arrow = () => (
  <svg className="ct-arrow" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
    <path d="M2 12L12 2M5 2h7v7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Check = () => (
  <svg className="ct-check" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
    <path d="M2.2 6.4l2.5 2.5 5-5.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Chip({ on, onClick, children }) {
  return (
    <button type="button" className="ct-chip" aria-pressed={on} onClick={onClick}>
      <span className="ct-chip-tick"><Check /></span>
      {children}
    </button>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const btnRef = useRef(null)
  const [v, setV] = useState({ name: '', company: '', email: '', message: '' })
  const [interests, setInterests] = useState([])
  const [deploy, setDeploy] = useState('')
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [time, setTime] = useState(() => clock.format(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(clock.format(new Date())), 15000)
    return () => clearInterval(id)
  }, [])

  const set = (k) => (e) => { setSent(false); setV((s) => ({ ...s, [k]: e.target.value })) }
  const toggle = (x) => setInterests((a) => (a.includes(x) ? a.filter((y) => y !== x) : [...a, x]))

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = `Enquiry from ${v.name}${v.company ? ` (${v.company})` : ''}`
    const lines = [`Name: ${v.name}`]
    if (v.company) lines.push(`Company: ${v.company}`)
    lines.push(`Email: ${v.email}`)
    if (interests.length) lines.push(`Interested in: ${interests.join(', ')}`)
    if (deploy) lines.push(`Where it should run: ${deploy}`)
    lines.push('', v.message)
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
    setSent(true)
  }

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia(el)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = (trigger, start = 'top 82%') => ({ trigger, start, toggleActions: 'play none none none' })
      gsap.from('.ct-eyebrow', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: st(el, 'top 80%') })
      gsap.from('.ct-line > span', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.14, scrollTrigger: st('.ct-title', 'top 86%') })
      gsap.from('.ct-lede', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.25, clearProps: 'transform,opacity', scrollTrigger: st('.ct-title', 'top 86%') })
      gsap.from('.ct-facts > div', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, clearProps: 'transform,opacity', scrollTrigger: st('.ct-facts', 'top 90%') })
      gsap.from('.ct-card', { y: 70, opacity: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: st('.ct-card', 'top 90%') })

      const btn = btnRef.current
      const move = (e) => {
        const r = btn.getBoundingClientRect()
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.2, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power3.out' })
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
        <div className="ct-left">
          <span className="ct-eyebrow"><i aria-hidden="true" />Contact</span>
          <h2 className="ct-title">
            <span className="ct-line"><span>Let&rsquo;s <em>build</em></span></span>
            <span className="ct-line"><span>something.</span></span>
          </h2>
          <p className="ct-lede">Tell us what you&rsquo;re working on &mdash; we reply within one business day.</p>

          <dl className="ct-facts">
            <div>
              <dt>Email</dt>
              <dd>
                <button type="button" className="ct-row" onClick={copyEmail} aria-label={`Copy ${EMAIL} to clipboard`}>
                  <span>{EMAIL}</span>
                  <Arrow />
                  <span className="ct-tip" data-show={copied} role="status">{copied ? 'Copied' : ''}</span>
                </button>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd><a className="ct-row" href={PHONE_HREF}><span>{PHONE}</span><Arrow /></a></dd>
            </div>
            <div>
              <dt>Office</dt>
              <dd className="ct-office">
                <span>Trivandrum, India</span>
                <time className="ct-time"><i aria-hidden="true" />{time} IST</time>
              </dd>
            </div>
            <div>
              <dt>Social</dt>
              <dd className="ct-social">
                {SOCIAL.map(([n, u]) => (
                  <a className="ct-row" key={n} href={u} target="_blank" rel="noopener noreferrer"><span>{n}</span><Arrow /></a>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <form className="ct-card" onSubmit={onSubmit}>
          <fieldset className="ct-step">
            <legend><b>01</b>What can we help with?</legend>
            <div className="ct-chips">
              {INTERESTS.map((x) => <Chip key={x} on={interests.includes(x)} onClick={() => toggle(x)}>{x}</Chip>)}
            </div>
          </fieldset>

          <fieldset className="ct-step">
            <legend><b>02</b>Where should it run?</legend>
            <div className="ct-chips">
              {DEPLOY.map((x) => <Chip key={x} on={deploy === x} onClick={() => setDeploy(deploy === x ? '' : x)}>{x}</Chip>)}
            </div>
          </fieldset>

          <fieldset className="ct-step">
            <legend><b>03</b>Tell us about you</legend>
            <div className="ct-fields">
              <div className="ct-field">
                <input id="ct-name" placeholder=" " required autoComplete="name" value={v.name} onChange={set('name')} />
                <label htmlFor="ct-name">Name</label>
              </div>
              <div className="ct-field">
                <input id="ct-company" placeholder=" " autoComplete="organization" value={v.company} onChange={set('company')} />
                <label htmlFor="ct-company">Company</label>
              </div>
              <div className="ct-field ct-wide">
                <input id="ct-email" type="email" placeholder=" " required autoComplete="email" value={v.email} onChange={set('email')} />
                <label htmlFor="ct-email">Work email</label>
              </div>
              <div className="ct-field ct-wide">
                <textarea id="ct-msg" rows="3" placeholder=" " required value={v.message} onChange={set('message')} />
                <label htmlFor="ct-msg">Message</label>
              </div>
            </div>
          </fieldset>

          <div className="ct-submit">
            <p className="ct-note">
              Sending opens your email app with this message addressed to {EMAIL}. Nothing is stored on this site.
            </p>
            <button type="submit" className="ct-send" ref={btnRef}>
              <span>Send message</span>
              <b aria-hidden="true"><Arrow /></b>
            </button>
          </div>
          <p className="ct-ok" data-show={sent} role="status">
            {sent ? <><Check />Thanks &mdash; your email app is open.</> : ''}
          </p>
        </form>
      </div>
    </section>
  )
}
