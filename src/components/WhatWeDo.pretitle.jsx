const offerings = [
  {
    title: 'Ready-to-deploy\nproducts',
    detail:
      'InFLOW, STREAM, COAT, QLMS, DSM and SAMT — proven products your team can start using quickly.',
    image: '/wwd/products-laptop.jpg',
  },
  {
    title: 'On-prem &\nEU cloud hosting',
    detail:
      'Run it on your own servers, or let us host it in an EU-region cloud. You choose where your data lives.',
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

export default function WhatWeDo() {
  return (
    <section className="what-we-do" id="about" aria-labelledby="wwd-heading">
      <div className="wwd-inner">
        <div className="wwd-top">
          <AsteriskIcon />
          <div className="wwd-approach">
            <span>What We Do</span>
            <span className="wwd-line" aria-hidden="true" />
          </div>
        </div>

        <div className="wwd-intro">
          <h2 id="wwd-heading">
            <span className="wwd-title-strong">We build the software. We set it up.</span>
            <span className="wwd-title-muted">On your servers or in the EU cloud.</span>
          </h2>

          <p className="wwd-copy">
            Cirakas builds ready-to-use business products for workflow, learning,
            operations and field teams. We deploy them inside your company or host
            them in an EU-region cloud, so your team gets working software fast and
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
