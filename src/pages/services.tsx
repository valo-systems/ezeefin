import { Link } from 'react-router-dom'
import { STAGES } from '../data'
import { EditorialHero, PageMeta, SectionHeading } from '../ui'

const heroImage = '/assets/hero/vehicle-showroom-fronx-01.jpg'

export function HowItWorks() {
  return (
    <main>
      <PageMeta title="How it works" description="Follow the EzeeFin concierge journey from one simple request to vehicle delivery." />
      <EditorialHero eyebrow="The concierge journey" title={<>One request.<br /><span className="accent-word">Eight clear stages.</span></>}
        lede="From your first message to delivery day, one consultant coordinates the moving pieces while your personal tracker keeps the whole journey visible."
        image="/assets/vehicles/vehicle-delivery-mercedes-01.jpg" imageAlt="Vehicle prepared with a presentation bow for delivery">
        <div className="editorial-actions">
          <Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Start your request</Link>
          <Link to="/portal" className="btn btn-ghost">See the customer portal</Link>
        </div>
      </EditorialHero>

      <section className="block alt">
        <div className="container story-grid">
          <div>
            <SectionHeading eyebrow="Your progress" title="Nothing disappears into a black box."
              body="Each stage has a clear owner, a plain-language update and a next action when we need something from you." />
            <ul className="timeline">
              {STAGES.map((stage, index) => (
                <li key={stage.id} className={index === 0 ? 'current' : 'todo'}>
                  <span className="tl-dot">{index + 1}</span>
                  <div><strong>{stage.label}</strong><p className="muted" style={{ margin: '2px 0 0' }}>{stage.blurb}</p></div>
                </li>
              ))}
            </ul>
          </div>
          <aside className="story-aside">
            <div className="card">
              <span className="eyebrow-light">The EzeeFin promise</span>
              <h3>One accountable person, from brief to bow.</h3>
              <ul className="assurance-list">
                <li><i>01</i><span><strong>You decide.</strong><br /><span className="muted">Every vehicle, provider and cost remains your choice.</span></span></li>
                <li><i>02</i><span><strong>We translate.</strong><br /><span className="muted">Clear explanations instead of industry shorthand.</span></span></li>
                <li><i>03</i><span><strong>You can see it.</strong><br /><span className="muted">Your live tracker shows what has happened and what comes next.</span></span></li>
              </ul>
            </div>
            <p className="story-quote">“Car buying should feel considered, not chaotic.”</p>
          </aside>
        </div>
      </section>

      <section className="block">
        <div className="container proof-strip">
          <div><span className="eyebrow-light">Transparent from the start</span><h2>Our coordination service costs you R0.</h2></div>
          <div><p>Vehicle prices, finance terms, insurance premiums and tracker fees come directly from the relevant providers. We show you the decision; you choose what feels right.</p>
            <Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Begin the conversation</Link></div>
        </div>
      </section>
    </main>
  )
}

export function FinanceAssistance() {
  return (
    <main>
      <PageMeta title="Vehicle finance assistance" description="Careful preparation and coordination of your vehicle-finance application with registered credit providers." />
      <EditorialHero eyebrow="Finance assistance" title={<>Prepared carefully.<br /><span className="accent-word">Presented clearly.</span></>}
        lede="We prepare and coordinate your vehicle-finance application with registered credit providers, keep the paperwork moving and keep you informed. Approval always rests with the credit provider."
        image={heroImage} imageAlt="Premium vehicle presented in a modern showroom">
        <div className="editorial-actions">
          <Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Find me a vehicle</Link>
          <Link to="/found-a-vehicle" className="btn btn-ghost">I already found one</Link>
        </div>
      </EditorialHero>
      <section className="block alt">
        <div className="container">
          <SectionHeading eyebrow="A stronger application" title="The admin is ours. The decision is yours."
            body="Your consultant gathers what is needed, prepares the application accurately, coordinates submission and translates every response into a clear next step." />
          <div className="grid cols-3">
            <div className="card"><span className="step-num">1</span><h3>Prepare</h3><p className="muted">We confirm your budget, deposit and trade-in, then make sure the application is complete before it moves.</p></div>
            <div className="card"><span className="step-num">2</span><h3>Coordinate</h3><p className="muted">We manage document collection, submissions and follow-ups with registered credit providers.</p></div>
            <div className="card"><span className="step-num">3</span><h3>Explain</h3><p className="muted">You see the outcome and terms in plain language before choosing how to proceed.</p></div>
          </div>
          <div className="grid cols-2" style={{ marginTop: 30 }}>
            <div className="card"><span className="eyebrow-light">What you may need</span><h3>Only after your consultant confirms the request.</h3><p className="muted">Typically your ID, driver's licence, latest payslip and three months of bank statements. Public enquiry forms never ask for these documents.</p></div>
            <div className="card"><span className="eyebrow-light">Important to know</span><h3>No false promises.</h3><p className="muted">Finance is subject to approval by registered credit providers. EzeeFin does not guarantee approval, interest rates or timelines.</p></div>
          </div>
        </div>
      </section>
    </main>
  )
}

export function InsuranceTracker() {
  return (
    <main>
      <PageMeta title="Insurance and tracker coordination" description="Comparable insurance quotations and tracker installation coordinated around your vehicle delivery." />
      <EditorialHero eyebrow="Insurance & tracker" title={<>Covered, connected<br />and <span className="accent-word">ready for delivery.</span></>}
        lede="Most financed vehicles need comprehensive insurance and a tracking device. We coordinate the quotations and installation around the same journey, so delivery does not become another admin project."
        image="/assets/vehicles/vehicle-delivery-audi-q3-bow-01.jpg" imageAlt="Vehicle ready for a dealership handover">
        <div className="editorial-actions"><Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Start your request</Link></div>
      </EditorialHero>
      <section className="block alt">
        <div className="container">
          <SectionHeading eyebrow="Before the handover" title="Two more moving parts. One person coordinating them."
            body="You receive options from the relevant providers, understand what each one costs and choose before anything is confirmed." />
          <div className="grid cols-2">
            <div className="card"><span className="step-num">01</span><h3>Comparable insurance quotations</h3><p className="muted">We request quotations for you to compare. EzeeFin is not an insurer and does not provide financial advice; cover is chosen directly with the provider.</p></div>
            <div className="card"><span className="step-num">02</span><h3>Tracker installation coordination</h3><p className="muted">Where a tracking device is required, we coordinate the quote and installation timing so the vehicle can be delivered without an avoidable delay.</p></div>
          </div>
          <div className="proof-strip" style={{ marginTop: 32 }}>
            <div><span className="eyebrow-light">Your choice, always</span><h2>Clear options before commitment.</h2></div>
            <div><p>Premiums, device fees and provider terms are disclosed before you choose. Nothing is bundled without your approval.</p><Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Begin your request</Link></div>
          </div>
        </div>
      </section>
    </main>
  )
}
