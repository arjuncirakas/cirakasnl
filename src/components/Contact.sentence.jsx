import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
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
const PRODUCTS = ['InFLOW', 'STREAM', 'COAT', 'QLMS', 'DSM', 'SAMT', 'something else']
const DEPLOY = ['on our premises', 'in an EU-region cloud', 'somewhere, not sure yet']

/* a static word, animated as one token */
const Words = ({ text }) =>
  text.split(' ').map((w, i) => (
    <span key={i}>
      <span className="ct-w">{w}</span>{' '}
    </span>
  ))

/* inline text blank that grows with its content */
function Blank({ id, label, value, onChange, placeholder, type = 'text', required, multiline, autoComplete }) {
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <span className="ct-w ct-blank" data-filled={value ? 'true' : 'false'} data-value={value || placeholder}>
      <Tag
        id={id}
        aria-label={label}
        className="ct-in"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={multiline ? undefined : type}
        rows={multiline ? 1 : undefined}
        required={required}
        autoComplete={autoComplete}
        spellCheck={multiline ? true : false}
      />
    </span>
  )
}

/* inline custom dropdown (listbox pattern) */
function Pick({ id, label, value, onChange, options, placeholder }) {
  const uid = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const btn = useRef(null)
  const list = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = (e) => { if (root.current && !root.current.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  useEffect(() => { if (open && list.current) list.current.focus({ preventScroll: true }) }, [open])

  const openList = () => { setActive(Math.max(0, options.indexOf(value))); setOpen(true) }
  const close = (refocus = true) => { setOpen(false); if (refocus) btn.current?.focus() }
  const choose = (o) => { onChange(o); close() }

  const onBtnKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openList() }
  }
  const onListKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % options.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + options.length) % options.length) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(options[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'Tab') setOpen(false)
  }

  return (
    <span className="ct-w ct-pick" ref={root} data-filled={value ? 'true' : 'false'} data-open={open}>
      <button
        type="button" id={id} ref={btn} className="ct-in ct-pick-btn"
        aria-haspopup="listbox" aria-expanded={open} aria-controls={`${uid}-list`}
        aria-label={`${label}: ${value || 'not chosen'}`}
        onClick={() => (open ? close(false) : openList())} onKeyDown={onBtnKey}
      >
        <span className={value ? '' : 'ct-ph'}>{value || placeholder}</span>
        <svg viewBox="0 0 12 8" width="0.34em" height="0.22em" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <span
          id={`${uid}-list`} ref={list} role="listbox" tabIndex={-1} className="ct-pop" aria-label={label}
          aria-activedescendant={`${uid}-o${active}`} onKeyDown={onListKey}
        >
          {options.map((o, i) => (
            <span
              key={o} id={`${uid}-o${i}`} role="option" aria-selected={o === value} data-active={i === active}
              onPointerEnter={() => setActive(i)} onClick={() => choose(o)}
            >{o}</span>
          ))}
        </span>
      )}
    </span>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const btnRef = useRef(null)
  const [v, setV] = useState({ name: '', company: '', email: '', note: '' })
  const [product, setProduct] = useState('')
  const [deploy, setDeploy] = useState('')
  const [sent, setSent] = useState(false)
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = `Enquiry from ${v.name}${v.company ? ` (${v.company})` : ''}`
    const talk = product ? ` I'd like to talk about ${product}${deploy ? `, running ${deploy}` : ''}.` : deploy ? ` I'm interested in running Cirakas software ${deploy}.` : ''
    const lines = [`Hi Cirakas, I'm ${v.name}${v.company ? ` from ${v.company}` : ''}.${talk}`, '', `You can reach me at ${v.email}.`]
    if (v.note.trim()) lines.push('', v.note.trim())
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
    setSent(true)
  }

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ct-eyebrow', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' } })
      gsap.from('.ct-w', {
        y: 34, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.035, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.ct-sentence', start: 'top 82%', toggleActions: 'play none none none' },
      })
      gsap.from('.ct-bottom > *', {
        y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.ct-bottom', start: 'top 95%', toggleActions: 'play none none none' },
      })
      gsap.from('.ct-rule', {
        scaleX: 0, transformOrigin: 'left center', duration: 1.3, ease: 'power3.inOut',
        scrollTrigger: { trigger: '.ct-rule', start: 'top 95%', toggleActions: 'play none none none' },
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

        <form onSubmit={onSubmit}>
          <div className="ct-sentence">
            <Words text="Hi Cirakas, I’m" />
            <Blank id="ct-name" label="Your name" value={v.name} onChange={set('name')} placeholder="your name" required autoComplete="name" />{' '}
            <Words text="from" />
            <Blank id="ct-company" label="Your company" value={v.company} onChange={set('company')} placeholder="your company" autoComplete="organization" />
            <span className="ct-w ct-dot">.</span>{' '}
            <Words text="I’d like to talk about" />
            <Pick id="ct-product" label="Product" value={product} onChange={setProduct} options={PRODUCTS} placeholder="a product" />{' '}
            <Words text="running" />
            <Pick id="ct-deploy" label="Deployment" value={deploy} onChange={setDeploy} options={DEPLOY} placeholder="somewhere" />
            <span className="ct-w ct-dot">.</span>{' '}
            <Words text="You can reach me at" />
            <Blank id="ct-email" label="Your work email" value={v.email} onChange={set('email')} placeholder="work email" type="email" required autoComplete="email" />
            <span className="ct-w ct-dot">.</span>{' '}
            <Words text="A bit more:" />
            <Blank id="ct-note" label="Anything else we should know (optional)" value={v.note} onChange={set('note')} placeholder="anything else we should know" multiline />
          </div>

          <div className="ct-rule" aria-hidden="true" />

          <div className="ct-bottom">
            <div className="ct-send-wrap">
              <button type="submit" className="ct-send" ref={btnRef}>
                <span>Send it</span>
                <b aria-hidden="true">→</b>
              </button>
              <p role="status">
                {sent
                  ? `Thanks. Your email app should open with this message addressed to ${EMAIL}.`
                  : `Sending opens your email app with this message addressed to ${EMAIL}.`}
              </p>
            </div>
            <ul className="ct-alt">
              <li>or write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li>call <a href={PHONE_HREF}>{PHONE}</a></li>
              <li className="ct-social">
                {SOCIAL.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}
              </li>
            </ul>
          </div>
        </form>
      </div>
    </section>
  )
}
