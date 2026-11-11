import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Team.css'

gsap.registerPlugin(ScrollTrigger)

const TEAM = [
  { name: 'Harish Nair', role: 'Director', photo: 'harish' },
  { name: 'Dr. Rajalekshmi S', role: 'Head of Projects & Operations', photo: 'raji' },
  { name: 'Minu S', role: 'AI QA Engineer', photo: 'minu' },
  { name: 'Jagan S Subramanian', role: 'AI Business Transformation Manager', photo: 'jagan' },
  { name: 'Amal Babu', role: 'AI Mobile Engineer', photo: 'amal' },
  { name: 'Gokul Suresh', role: 'Polymath Developer', photo: 'gokul' },
  { name: 'Arjun S S', role: 'Polymath Developer', photo: 'arjun' },
  { name: 'Harikrishnan M R', role: 'AI QA Engineer', photo: 'hari' },
  { name: 'Joel Baiju', role: 'Polymath Developer', photo: 'joel' },
  { name: 'Sahith S', role: 'Polymath Developer', photo: 'sahith' },
  { name: 'Deepu R Nair', role: 'Polymath Developer', photo: 'deepu' },
  { name: 'Akshay S L', role: 'Manager-HR & Admin', photo: 'akshay' },
  { name: 'Tsering Chospal', role: 'Employee Welfare Officer', photo: 'tsering' },
  { name: 'Amal S R', role: 'Secretary to the Director', photo: 'unni' },
]

const initials = (n) => n.replace(/^Dr\.\s*/, '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('')

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Team() {
  const ref = useRef(null)
  const [reduce] = useState(prefersReduced)
  const [broken, setBroken] = useState({})

  useLayoutEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.tm-head > *', {
        y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none none' },
      })
      gsap.from('.tm-card', {
        y: 70, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: { amount: 0.8, from: 'start' },
        scrollTrigger: { trigger: '.tm-grid', start: 'top 88%', toggleActions: 'play none none none' },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="tm" id="team" ref={ref} aria-label="Our team">
      <div className="tm-stage">
        <div className="tm-bg" aria-hidden="true">
          {reduce ? (
            <img src="/products/fluid-1.jpg" alt="" />
          ) : (
            <video src="/hero-bg.mp4" poster="/products/fluid-1.jpg" autoPlay muted loop playsInline preload="auto" />
          )}
          <div className="tm-wash" />
        </div>

        <div className="tm-inner">
          <div className="tm-head">
            <span className="tm-pill">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none" /></svg>
              Our Team
            </span>
            <h2>The people building your products.</h2>
            <p>Engineers, designers and specialists who build, ship and support every Cirakas product.</p>
          </div>

          <ul className="tm-grid">
            {TEAM.map((m) => (
              <li className="tm-card" key={m.name}>
                <div className="tm-photo">
                  {broken[m.photo] ? (
                    <span className="tm-initials">{initials(m.name)}</span>
                  ) : (
                    <img
                      src={`/team/${m.photo}.webp`} alt={`${m.name}, ${m.role}`} loading="lazy" draggable="false"
                      onError={() => setBroken((b) => ({ ...b, [m.photo]: true }))}
                    />
                  )}
                </div>
                <div className="tm-meta">
                  <h3>{m.name}</h3>
                  <p><i aria-hidden="true" />{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
