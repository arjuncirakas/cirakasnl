import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './WhatWeDoTitle.css'

gsap.registerPlugin(ScrollTrigger)

const offerings = [
  {
    title: 'Ready to deploy\nproducts',
    detail:
      'InFLOW, STREAM, COAT, QLMS, DSM and FIELD — proven products your team can start using quickly.',
    image: '/wwd/products-laptop.jpg',
  },
  {
    title: 'On premise &\nEU cloud hosting',
    detail:
      'Run it on your own servers, or let us host it in an EU region cloud. You choose where your data lives.',
    image: '/wwd/hosting-arch.jpg',
  },
  {
    title: 'Built around\nyour team',
    detail:
      'We configure each product to fit your processes, then support and update it as you grow.',
    image: '/wwd/team-space.jpg',
  },
]

function AsteriskIcon() {
  return (
    <svg className="wwd-asterisk" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 4v56M8.5 18.5l47 27M8.5 45.5l47-27M4 32h56"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* each word sits in an overflow mask so it can slide up on reveal */
const Words = ({ text }) =>
  text.split(' ').map((w, i) => (
    <span key={i}>
      <span className="wt-w"><span>{w}</span></span>{' '}
    </span>
  ))

export default function WhatWeDo() {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(el)
        const st = (trigger, start = 'top 85%') => ({
          trigger,
          start,
          toggleActions: 'play none none none',
        })

        gsap.from(q('.wt-top > *'), {
          y: 14, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          clearProps: 'transform,opacity', scrollTrigger: st(q('.wt-top')[0], 'top 88%'),
        })
        gsap.from(q('.wt-w > span'), {
          yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.04,
          scrollTrigger: st(q('.wt-title')[0], 'top 84%'),
        })
        gsap.fromTo(q('.wt-soft'),
          { color: 'rgba(28, 20, 16, 0.25)' },
          {
            color: 'rgba(28, 20, 16, 0.55)', ease: 'none',
            scrollTrigger: { trigger: q('.wt-title')[0], start: 'top 70%', end: 'bottom 35%', scrub: true },
          },
        )
        gsap.from(q('.wt-bottom'), {
          opacity: 0, y: 24, duration: 0.9, ease: 'power3.out',
          clearProps: 'transform,opacity', scrollTrigger: st(q('.wt-bottom')[0], 'top 92%'),
        })

        /* offer cards — clip reveal + image settle + title rise */
        const gallery = q('.wwd-gallery')[0]
        const cards = q('.wwd-card')

        gsap.from(q('.wwd-gallery-label'), {
          opacity: 0, y: 28, duration: 1, ease: 'power3.out',
          scrollTrigger: st(gallery, 'top 88%'),
        })

        gsap.fromTo(cards,
          { clipPath: 'inset(18% 0 0 0 round 28px)', y: 64, opacity: 0.35 },
          {
            clipPath: 'inset(0% 0 0 0 round 28px)',
            y: 0,
            opacity: 1,
            duration: 1.35,
            stagger: 0.16,
            ease: 'power4.out',
            clearProps: 'clipPath,transform,opacity',
            scrollTrigger: st(gallery, 'top 80%'),
          },
        )

        gsap.fromTo(q('.wwd-card-image'),
          { scale: 1.28, filter: 'saturate(0.55) contrast(1.05) brightness(0.7)' },
          {
            scale: 1.04,
            filter: 'saturate(0.78) contrast(1.08) brightness(0.88)',
            duration: 1.7,
            stagger: 0.16,
            ease: 'power3.out',
            clearProps: 'transform,filter',
            scrollTrigger: st(gallery, 'top 80%'),
          },
        )

        gsap.from(q('.wwd-card-title span'), {
          y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.05,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: gallery, start: 'top 72%', toggleActions: 'play none none none' },
        })
      }, el)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="what-we-do" id="about" aria-labelledby="wwd-heading" ref={ref}>
      <div className="wwd-inner">
        <div className="wt-top">
          <AsteriskIcon />
          <div className="wt-label">
            <span>What we do</span>
            <span className="wt-rule" aria-hidden="true" />
          </div>
        </div>

        <h2 className="wt-title" id="wwd-heading">
          <span className="wt-row"><Words text="We build the software." /></span>
          <span className="wt-row">
            <Words text="We set it up" />
            <span className="wt-w"><span className="wt-pill" aria-hidden="true" /></span>
          </span>
          <span className="wt-row wt-soft"><Words text="on your servers or in the EU cloud." /></span>
        </h2>

        <div className="wt-bottom">
          <span className="wt-cap">Products + setup</span>
          <p className="wt-copy">
            Cirakas builds ready to use business products for workflow, learning,
            operations and field teams. We deploy them inside your company or host
            them in an EU region cloud, so your team gets working software fast and
            your data stays where you want it.
          </p>
        </div>

        <div className="wwd-gallery">
          <div className="wwd-gallery-label">
            <span>What We Offer</span>
            <span className="wwd-line" aria-hidden="true" />
          </div>

          <div className="wwd-cards">
            {offerings.map((item) => (
              <article key={item.title} className="wwd-card">
                <img src={item.image} alt="" className="wwd-card-image" />
                <div className="wwd-card-wash" aria-hidden="true" />
                <div className="wwd-card-content">
                  <h3 className="wwd-card-title">
                    {item.title.split('\n').map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p className="wwd-card-detail">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
