import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { STAGES } from '../data'
import { CountUp, Lift, Marquee, Reveal, Words } from '../fx'
import { PageMeta, SectionHeading } from '../ui'

const GALLERY = [
  'vehicle-delivery-swift-04.jpg', 'vehicle-delivery-renault-kiger-01.jpg',
  'vehicle-delivery-mercedes-01.jpg', 'vehicle-delivery-ecosport-01.jpg',
  'vehicle-delivery-toyota-etios-01.jpg', 'vehicle-delivery-ertiga-02.jpg',
  'vehicle-delivery-audi-q3-bow-01.jpg', 'vehicle-delivery-toyota-01.jpg',
]

const BRANDS = ['TOYOTA', 'VOLKSWAGEN', 'SUZUKI', 'FORD', 'HYUNDAI', 'RENAULT', 'AUDI', 'MERCEDES-BENZ', 'GWM']

const REVIEWS = [
  {
    name: 'EzeeFin customer',
    initials: 'EC',
    detail: 'Google review · 2 years ago',
    quote: 'Ezeefin is one of the best in town. If you need to buy car contact ezeefin they will help you to get the right deal.',
  },
  {
    name: 'Njabulo Sithole',
    initials: 'NS',
    detail: 'Local Guide · 7 years ago',
    quote: 'Ezeefin has exceptionally excellent customer service',
  },
  {
    name: 'Xoliswa Sibiya',
    initials: 'XS',
    detail: 'Google review · 5 years ago',
    quote: 'Thanks to Des His team tor excellent service!!!',
  },
]

/** Animated miniature of the real progress tracker: the product, as the hero. */
function TrackerPreview() {
  const reduce = useReducedMotion()
  const shown = STAGES.slice(0, 6)
  const [idx, setIdx] = useState(2)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setIdx((i) => (i + 1) % (shown.length + 1)), 2200)
    return () => clearInterval(t)
  }, [reduce, shown.length])
  return (
    <div className="glass-card" aria-hidden>
      <div className="gc-head">
        <strong>EZ-2431 · Nomvula</strong>
        <span className="chip red" style={{ background: 'rgba(211,35,42,.18)', color: '#ff9ea2' }}>live tracker</span>
      </div>
      {shown.map((s, i) => (
        <div key={s.id} className={`gc-stage ${i < idx ? 'done' : i === idx ? 'now' : ''}`}>
          <span className="gc-dot">{i < idx ? '✓' : i + 1}</span>{s.label}
        </div>
      ))}
      <div className="gc-bar"><i style={{ width: `${Math.min(idx / shown.length, 1) * 100}%` }} /></div>
      <div className="gc-foot">Every customer gets one of these. No more chasing calls.</div>
    </div>
  )
}

export default function Home() {
  const [sticky, setSticky] = useState(false)
  useEffect(() => {
    const f = () => setSticky(window.scrollY > 560)
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <main>
      <PageMeta title="Your next vehicle, handled" description="A personal vehicle-buying concierge coordinating sourcing, finance applications, insurance and trackers across South Africa." />
      {/* ---------- Aurora hero ---------- */}
      <section className="hero2">
        <img className="hero-photo" src="/assets/editorial/concierge-showroom-logo-v2.webp"
          alt="Premium graphite vehicle prepared for a personal showroom handover" />
        <div className="grain" />
        <div className="container inner2">
          <div>
            <span className="eyebrow">Vehicle-buying concierge · South Africa</span>
            <Words text="Your next vehicle, handled with heart." accent={['handled']} />
            <p className="lede2">
              Tell us once. We coordinate the dealerships, the finance application, the insurance
              and the tracker, while you watch it all come together in one place.
            </p>
            <div className="cta-row">
              <Link to="/find-me-a-vehicle" className="btn btn-primary btn-glow btn-arrow">Find me a vehicle</Link>
              <Link to="/found-a-vehicle" className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}>
                I already found one
              </Link>
            </div>
            <div className="hero-badges">
              <span>No charge to start</span>
              <span>One point of contact</span>
              <span>You decide at every step</span>
            </div>
          </div>
          <Reveal delay={0.35} y={34}><TrackerPreview /></Reveal>
        </div>
      </section>

      {/* ---------- Delivered brands marquee ---------- */}
      <Marquee items={BRANDS} />
      <p className="small muted" style={{ textAlign: 'center', margin: '10px 0 0' }}>
        Recent deliveries arranged through franchised dealerships include these marques.
      </p>

      {/* ---------- How it works ---------- */}
      <section className="block">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="How it works" title="One request. One point of contact."
              body={<>No more dealership marathons, repeated paperwork or juggling calls between banks,
                insurers and tracker installers. You describe the vehicle once, then EzeeFin coordinates the rest.</>} />
          </Reveal>
          <div className="grid cols-3" style={{ marginTop: 28 }}>
            {[
              ['Tell us what you need', 'Two minutes on your phone: the vehicle, your budget, how to reach you.'],
              ['We coordinate everything', 'Sourcing from dealerships, your finance application with registered credit providers, insurance and tracker quotations.'],
              ['Track it like a parcel', 'Your own progress tracker shows you exactly where things stand, so you never have to chase a call.'],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.12}>
                <Lift><div className="card">
                  <span className="step-num">{i + 1}</span>
                  <h3>{t}</h3>
                  <p className="muted">{d}</p>
                </div></Lift>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Stats band ---------- */}
      <section className="block alt">
        <div className="container">
          <Reveal>
            <div className="stats-band">
              <div><div className="stat-num"><CountUp to={1} /></div><div className="stat-label">point of contact, start to finish</div></div>
              <div><div className="stat-num"><CountUp to={8} /></div><div className="stat-label">journey stages you can track live</div></div>
              <div><div className="stat-num"><CountUp to={2} suffix=" min" /></div><div className="stat-label">to start your request on a phone</div></div>
              <div><div className="stat-num"><span className="red">R</span><CountUp to={0} /></div><div className="stat-label">to use our coordination service</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Deliveries ---------- */}
      <section className="block">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="Delivery days" title="The bow moment, every time."
              body="Real handover days, arranged through EzeeFin at franchised dealerships across South Africa." />
          </Reveal>
          <div className="gallery" style={{ marginTop: 20 }}>
            {GALLERY.map((g, i) => (
              <Reveal key={g} delay={(i % 4) * 0.08}>
                <img src={`/assets/vehicles/${g}`} loading="lazy"
                  alt="Vehicle delivery arranged through EzeeFin, with celebration bow at a dealership" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Customer reviews ---------- */}
      <section className="reviews-section" aria-labelledby="reviews-title">
        <div className="container reviews-layout">
          <Reveal>
            <div className="reviews-summary">
              <span className="eyebrow-light">Selected Google reviews</span>
              <h2 id="reviews-title">Service people <span className="accent-word">remember.</span></h2>
              <p className="reviews-intro">
                The real measure of a concierge service is how supported you feel along the way.
                These are words shared by EzeeFin customers on Google.
              </p>
              <div className="rating-lockup" aria-label="Rated 4.7 out of 5 from 6 Google reviews">
                <strong>4.7</strong>
                <div>
                  <div className="review-stars" aria-hidden="true">★★★★★</div>
                  <span>Based on 6 Google reviews</span>
                </div>
              </div>
              <Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Start your own journey</Link>
            </div>
          </Reveal>

          <div className="review-cards">
            {REVIEWS.map((review, i) => (
              <Reveal key={review.name} delay={i * 0.1}>
                <article className="review-card">
                  <div className="review-card-top">
                    <span className="review-stars" aria-label="5 out of 5 stars">★★★★★</span>
                    <span className="google-review-mark" aria-label="Google review">G</span>
                  </div>
                  <blockquote>“{review.quote}”</blockquote>
                  <footer className="review-person">
                    <span className="review-avatar" aria-hidden="true">{review.initials}</span>
                    <span>
                      <strong>{review.name}</strong>
                      <small>{review.detail}</small>
                    </span>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Audience cards ---------- */}
      <section className="block alt">
        <div className="container grid cols-3">
          {[
            ['First vehicle?', 'We explain every step in plain language and never rush you.', '/how-it-works', 'How it works'],
            ['Found your car already?', 'We handle the finance application and paperwork for the vehicle you chose.', '/found-a-vehicle', 'Get assistance'],
            ['Buying for a business?', 'Fleet sourcing and funding coordination with one accountable partner.', '/fleet', 'Fleet solutions'],
          ].map(([t, d, to, cta], i) => (
            <Reveal key={t} delay={i * 0.12}>
              <Lift><div className="card">
                <h3>{t}</h3>
                <p className="muted">{d}</p>
                <Link to={to} className="btn btn-quiet btn-sm">{cta}</Link>
              </div></Lift>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="block" style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Reveal>
            <Words as="h2" text="Ready when you are." accent={['you']} />
            <p style={{ color: '#b9bcc3' }}>Starting costs you nothing, and you stay in charge at every step.</p>
            <Link to="/find-me-a-vehicle" className="btn btn-primary btn-glow btn-arrow" style={{ marginTop: 8 }}>Start your request</Link>
          </Reveal>
        </div>
      </section>

      <div className={`sticky-cta ${sticky ? 'show' : ''}`}>
        <Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Start your request</Link>
      </div>
    </main>
  )
}
