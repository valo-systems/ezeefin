import { Link } from 'react-router-dom'
import { useState } from 'react'
import { EditorialHero, PageMeta, SectionHeading } from '../ui'

export function About() {
  return (
    <main>
      <PageMeta title="About EzeeFin" description="The people and purpose behind a calmer, more transparent vehicle-buying journey." />
      <EditorialHero eyebrow="Our story" title={<>Built for the person<br /><span className="accent-word">buying the car.</span></>}
        lede="A vehicle purchase can involve dealerships, credit providers, insurers and tracker installers. EzeeFin exists so you do not have to coordinate all of them alone."
        image="/assets/vehicles/vehicle-delivery-kiger-anniversary-01.jpg" imageAlt="Real EzeeFin delivery day with a vehicle bow">
        <div className="editorial-actions"><Link to="/how-it-works" className="btn btn-primary btn-arrow">See how it works</Link></div>
      </EditorialHero>
      <section className="block alt">
        <div className="container story-grid">
          <div>
            <SectionHeading eyebrow="Why we exist" title="Less chasing. More certainty."
              body="Our team brings combined experience in vehicle and asset finance and works with franchised dealerships across South Africa." />
            <p>We believe the person buying the vehicle should have one point of contact, plain answers and a clear view of what is happening—from the first conversation to the moment the bow comes off the bonnet.</p>
            <p>EzeeFin coordinates and assists. We are not a bank, lender, credit provider, dealership, insurer or tracker company. That independence keeps our attention where it belongs: on helping you understand the journey and make your own decisions.</p>
            <div className="grid cols-3" style={{ marginTop: 40 }}>
              <div><span className="step-num">01</span><h3>Human</h3><p className="muted">One consultant who knows the context, not a trail of ticket numbers.</p></div>
              <div><span className="step-num">02</span><h3>Clear</h3><p className="muted">Plain language, visible progress and no pressure disguised as urgency.</p></div>
              <div><span className="step-num">03</span><h3>Accountable</h3><p className="muted">One team coordinating the details from brief to delivery.</p></div>
            </div>
          </div>
          <aside className="story-aside">
            <img src="/assets/hero/vehicle-showroom-fronx-01.jpg" alt="Vehicle awaiting a showroom handover" />
            <p className="story-quote">One point of contact should feel like a luxury. We think it should be the standard.</p>
          </aside>
        </div>
      </section>
      <section className="block"><div className="container proof-strip">
        <div><span className="eyebrow-light">Ready when you are</span><h2>Your next vehicle can start with one conversation.</h2></div>
        <div><p>Tell us what you are looking for. No documents and no commitment are needed today.</p><Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Start your request</Link></div>
      </div></section>
    </main>
  )
}

const FAQ: [string, string][] = [
  ['Does the service really cost me nothing?', 'Our coordination service is offered at no charge to you. Vehicle prices, finance costs, insurance premiums and tracker fees come from the relevant providers, and we will always tell you exactly what a decision costs before you make it.'],
  ['Is EzeeFin a bank or lender?', 'No. We assist with and coordinate your finance application, which is submitted to registered credit providers. They make the credit decision, not us.'],
  ['Do I have to take the insurance or tracker you arrange?', 'No. We coordinate quotations to save you time. You choose your providers freely.'],
  ['What documents will I need?', 'Typically ID, driver’s licence, latest payslip and three months of bank statements. Your consultant will request documents securely through your portal. We never ask for them through public web forms.'],
  ['How long does it take?', 'It varies with the vehicle, the dealership and the credit provider. Your progress tracker always shows the current stage, and your consultant will give you honest time estimates as things firm up.'],
  ['What happens if finance is not approved?', 'Your consultant will contact you personally to talk through the options. Nothing is final until you have spoken to a human.'],
  ['Can you help if I already found the car?', 'Yes. We can take over the finance application and paperwork for the vehicle you chose.'],
]

export function FAQs() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <main>
      <PageMeta title="Frequently asked questions" description="Clear answers about EzeeFin vehicle sourcing, finance coordination, insurance, trackers and costs." />
      <section className="block">
        <div className="container faq-layout">
          <aside className="faq-intro">
            <span className="eyebrow-light">Good questions</span>
            <h1>Before we begin.</h1>
            <p className="lede">The useful answers, without small print disguised as reassurance.</p>
            <p>Still unsure? <Link to="/contact"><strong>Ask us directly.</strong></Link><br />A real human answers.</p>
          </aside>
          <div className="faq-list">
            {FAQ.map(([question, answer], index) => (
              <div className="faq-item" key={question}>
                <button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}
                  aria-controls={`faq-answer-${index}`}>
                  <span>{question}</span><span aria-hidden>{open === index ? '−' : '+'}</span>
                </button>
                {open === index && <div id={`faq-answer-${index}`} className="faq-answer">{answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export function Contact() {
  return (
    <main>
      <PageMeta title="Contact EzeeFin" description="Speak to the EzeeFin concierge team by phone, email or WhatsApp." />
      <EditorialHero eyebrow="Talk to us" title={<>A real person.<br /><span className="accent-word">A clear next step.</span></>}
        lede="Whether you are ready to start or only need one question answered, our team will meet you where you are."
        image="/assets/vehicles/vehicle-delivery-swift-05.jpg" imageAlt="A real customer vehicle prepared for delivery">
        <div className="editorial-actions">
          <a className="btn btn-primary" href="https://wa.me/27615822619" rel="noopener noreferrer">WhatsApp us</a>
          <a className="btn btn-ghost" href="tel:0861666669">Call 0861 666 669</a>
        </div>
      </EditorialHero>
      <section className="block alt">
        <div className="container grid cols-2">
          <div className="card"><span className="eyebrow-light">Concierge desk</span><h2>Start with the channel that suits you.</h2>
            <p><strong>Phone</strong><br /><a href="tel:0861666669">0861 666 669</a></p>
            <p><strong>Email</strong><br /><a href="mailto:info@ezeefin.co.za">info@ezeefin.co.za</a></p>
            <p><strong>Office</strong><br />Pinetown, KwaZulu-Natal</p>
            <p className="small muted">Contact details are to be confirmed at launch.</p>
          </div>
          <div className="card"><span className="eyebrow-light">Complaints & support</span><h2>When something is not right, it gets an owner.</h2>
            <p className="muted">Email <strong>info@ezeefin.co.za</strong> with your reference number and “Complaint” in the subject line. Complaints are acknowledged within one business day and owned by a senior consultant until resolved.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export function Privacy() {
  return (
    <main>
      <PageMeta title="Privacy policy" description="How EzeeFin collects, uses and protects personal information under POPIA." />
      <section className="block"><div className="container legal-layout">
        <nav className="legal-nav" aria-label="On this page"><a href="#collect">What we collect</a><a href="#protect">Protection</a><a href="#rights">Your rights</a></nav>
        <article className="legal-copy"><span className="eyebrow-light">Legal</span><h1>Privacy policy</h1>
          <div className="notice">Draft for legal review before production publication (POPIA).</div>
          <h2 id="collect">What we collect and why</h2><p className="muted">We collect only what we need to coordinate your vehicle purchase: your contact details and vehicle requirements when you enquire; and, only after you engage with a consultant, the documents required by credit providers, insurers and tracker companies. Each collection point states its purpose and records your consent.</p>
          <h2 id="protect">How it is protected</h2><p className="muted">Data is transmitted over HTTPS, stored with access controls, and every access by staff is logged. Documents are never publicly accessible. We do not sell personal information.</p>
          <h2 id="rights">Your rights</h2><p className="muted">Under POPIA you may request access to, correction of, or deletion of your personal information, and you may withdraw consent. Contact our Information Officer at info@ezeefin.co.za.</p>
        </article>
      </div></section>
    </main>
  )
}

export function Terms() {
  return (
    <main>
      <PageMeta title="Terms of service" description="Terms governing the EzeeFin vehicle sourcing and coordination service." />
      <section className="block"><div className="container legal-layout">
        <nav className="legal-nav" aria-label="On this page"><a href="#service">Our service</a><a href="#providers">Third parties</a><a href="#advice">General information</a></nav>
        <article className="legal-copy"><span className="eyebrow-light">Legal</span><h1>Terms of service</h1>
          <div className="notice">Draft for legal review before production publication.</div>
          <h2 id="service">Our service</h2><p className="muted">EzeeFin provides vehicle sourcing, vehicle-finance application assistance and quotation coordination services.</p>
          <h2 id="providers">Third-party providers</h2><p className="muted">EzeeFin is not a bank, lender, credit provider, dealership, insurer or tracking company. Finance approval, pricing, insurance cover and tracker services are provided and decided by the relevant third-party providers.</p>
          <h2 id="advice">General information</h2><p className="muted">Information on this site is general in nature and does not constitute financial advice.</p>
        </article>
      </div></section>
    </main>
  )
}
