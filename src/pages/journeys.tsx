import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { repo } from '../data'
import { Choices, Field, PageMeta, ProgressDots } from '../ui'

type Fields = Record<string, string>
const phoneOk = (v: string) => /^0\d{9}$/.test(v.replace(/[\s-]/g, ''))

function useDraft(key: string) {
  const [fields, setFields] = useState<Fields>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(fields)) }, [fields, key])
  const set = (k: string, v: string) => setFields((f) => ({ ...f, [k]: v }))
  const clear = () => localStorage.removeItem(key)
  return { fields, set, clear }
}

function Confirmation({ reference, name }: { reference: string; name?: string }) {
  return (
    <div className="confirm-hero container">
      <span className="eyebrow-light">Request received</span>
      <h1>Got it{name ? `, ${name.split(' ')[0]}` : ''}.</h1>
      <p className="lede" style={{ margin: '0 auto' }}>Your personal concierge journey has started. Keep this reference number close.</p>
      <p className="ref">{reference}</p>
      <p className="muted" style={{ maxWidth: 460, margin: '12px auto' }}>
        A consultant will contact you within one business day. Keep your reference handy,
        because you'll use it to follow your progress in the customer portal.
      </p>
      <div className="grid cols-3" style={{ maxWidth: 780, margin: '36px auto' }}>
        <div className="card"><span className="step-num">1</span><strong>We review your brief</strong></div>
        <div className="card"><span className="step-num">2</span><strong>Your consultant calls</strong></div>
        <div className="card"><span className="step-num">3</span><strong>Your tracker goes live</strong></div>
      </div>
      <p>
        <Link className="btn btn-primary" to="/portal">Open the customer portal</Link>{' '}
        <Link className="btn btn-quiet" to="/">Back to home</Link>
      </p>
    </div>
  )
}

function Wizard(props: {
  title: string; intro: string; draftKey: string
  journey: 'find' | 'found' | 'fleet'
  steps: { title: string; fields: (f: Fields, set: (k: string, v: string) => void) => JSX.Element; valid: (f: Fields) => string | null }[]
}) {
  const { fields, set, clear } = useDraft(props.draftKey)
  const [step, setStep] = useState(0)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [ref, setRef] = useState<string | null>(null)
  const hasDraft = useMemo(() => Object.keys(fields).length > 0, [])

  if (ref) return <Confirmation reference={ref} name={fields.name} />

  const s = props.steps[step]
  const last = step === props.steps.length - 1
  const context = {
    find: ['A considered search.', 'Tell us what would make the right vehicle feel right. We will coordinate the search from there.'],
    found: ['You found the car.', 'Now let one accountable consultant coordinate the application, paperwork and final moving parts.'],
    fleet: ['Built around your operation.', 'Describe the vehicles, quantities and timing. We will shape the conversation around the business need.'],
  }[props.journey]

  const next = async (e: FormEvent) => {
    e.preventDefault()
    const v = s.valid(fields)
    if (v) { setErr(v); return }
    setErr(null)
    if (!last) { setStep(step + 1); return }
    setBusy(true)
    try {
      const r = await repo.submitEnquiry({ journey: props.journey, fields })
      clear()
      setRef(r.reference)
    } catch {
      setErr("We couldn't send that just now. Don't worry, your answers are saved. Please try again, or WhatsApp us on 0861 666 669.")
    } finally { setBusy(false) }
  }

  return (
    <main className="journey-page">
      <PageMeta title={props.title} description={props.intro} />
      <aside className="journey-context">
        <div><span className="eyebrow-light">Personal concierge request</span><h2>{context[0]}</h2><p>{context[1]}</p></div>
        <div className="journey-trust"><span>No documents needed to begin</span><span>Your answers are saved on this device</span><span>One consultant owns the next step</span></div>
      </aside>
      <section className="journey-form-shell">
        <div className="journey-form">
          <h1>{props.title}</h1>
          <p className="lede">{props.intro}</p>
          {hasDraft && step === 0 && <div className="notice" style={{ marginBottom: 16 }}>Welcome back. We kept your earlier answers.</div>}
          <div className="wizard-meta"><span>Step {step + 1} of {props.steps.length}</span><span>About {Math.max(1, props.steps.length - step)} min left</span></div>
          <ProgressDots step={step} total={props.steps.length} />
          <form onSubmit={next} noValidate>
            <span className="eyebrow-light">Step {step + 1}</span>
            <h2 style={{ fontSize: 'clamp(1.55rem, 3vw, 2.2rem)' }}>{s.title}</h2>
            {s.fields(fields, set)}
            {err && <div className="err" role="alert">{err}</div>}
            <div className="wizard-nav">
              <button type="button" className="btn btn-quiet" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
              <button type="submit" className="btn btn-primary btn-arrow" disabled={busy}>
                {busy ? 'Sending…' : last ? 'Submit request' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

const contactStep = (extra?: JSX.Element) => ({
  title: 'How do we reach you?',
  fields: (f: Fields, set: (k: string, v: string) => void) => (
    <>
      <Field label="Full name">
        <input value={f.name || ''} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
      </Field>
      <Field label="Mobile number" hint="South African numbers have 10 digits, e.g. 082 000 0000">
        <input value={f.phone || ''} inputMode="numeric" onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
      </Field>
      <Field label="City / town">
        <input value={f.city || ''} onChange={(e) => set('city', e.target.value)} />
      </Field>
      <Field label="Preferred contact method">
        <Choices value={f.contactMethod || ''} options={['WhatsApp', 'Phone call', 'Email']} onChange={(v) => set('contactMethod', v)} />
      </Field>
      {extra}
      <div className="consent-box">
        <input type="checkbox" id="consent" checked={f.consent === 'yes'} onChange={(e) => set('consent', e.target.checked ? 'yes' : '')} />
        <label htmlFor="consent">
          I consent to EzeeFin contacting me about this request and processing the information I've
          provided for that purpose, as described in the <Link to="/privacy">privacy policy</Link>.
        </label>
      </div>
    </>
  ),
  valid: (f: Fields) => {
    if (!f.name?.trim()) return 'Please tell us your name.'
    if (!phoneOk(f.phone || '')) return 'That mobile number looks incomplete. South African numbers have 10 digits.'
    if (f.consent !== 'yes') return 'Please tick the consent box so we may contact you.'
    return null
  },
})

export function FindMeAVehicle() {
  return (
    <Wizard
      title="Find me a vehicle"
      intro="Four short steps, about two minutes. No documents needed today."
      draftKey="draft-find" journey="find"
      steps={[
        {
          title: 'The vehicle',
          fields: (f, set) => (
            <>
              <Field label="New or pre-owned?">
                <Choices value={f.condition || ''} options={['New', 'Pre-owned', 'Either']} onChange={(v) => set('condition', v)} />
              </Field>
              <Field label="What type of vehicle?">
                <Choices value={f.category || ''} options={['Hatchback', 'Sedan', 'SUV', 'Bakkie', 'Other']} onChange={(v) => set('category', v)} />
              </Field>
              <Field label="Make / model (if you have one in mind)" hint="Optional. 'Not sure yet' is a perfectly good answer">
                <input value={f.vehicle || ''} onChange={(e) => set('vehicle', e.target.value)} placeholder="e.g. Suzuki Swift" />
              </Field>
            </>
          ),
          valid: (f) => (!f.condition || !f.category ? 'Please choose a condition and a vehicle type.' : null),
        },
        {
          title: 'The money',
          fields: (f, set) => (
            <>
              <Field label="How would you like to think about it?">
                <Choices value={f.budgetType || ''} options={['Monthly instalment', 'Total budget']} onChange={(v) => set('budgetType', v)} />
              </Field>
              <Field label={f.budgetType === 'Total budget' ? 'Total budget (R)' : 'Comfortable monthly amount (R)'}>
                <input value={f.budget || ''} inputMode="numeric" onChange={(e) => set('budget', e.target.value)} placeholder={f.budgetType === 'Total budget' ? 'e.g. 250 000' : 'e.g. 3 500'} />
              </Field>
              <Field label="Deposit available (optional)">
                <input value={f.deposit || ''} inputMode="numeric" onChange={(e) => set('deposit', e.target.value)} placeholder="e.g. 15 000" />
              </Field>
              <Field label="Do you have a vehicle to trade in?">
                <Choices value={f.tradeIn || ''} options={['Yes', 'No']} onChange={(v) => set('tradeIn', v)} />
              </Field>
              {f.tradeIn === 'Yes' && (
                <Field label="Trade-in vehicle" hint="Make, model, year and rough mileage">
                  <input value={f.tradeInDetail || ''} onChange={(e) => set('tradeInDetail', e.target.value)} placeholder="e.g. 2018 Polo Vivo, 95 000 km" />
                </Field>
              )}
            </>
          ),
          valid: (f) => (!f.budget ? 'A rough number is enough. It helps us source realistically.' : null),
        },
        {
          title: 'Preferences (all optional)',
          fields: (f, set) => (
            <>
              <Field label="Transmission">
                <Choices value={f.transmission || ''} options={['Manual', 'Automatic', 'Either']} onChange={(v) => set('transmission', v)} />
              </Field>
              <Field label="When do you need it?">
                <Choices value={f.timing || ''} options={['As soon as possible', 'Within 3 months', 'Just exploring']} onChange={(v) => set('timing', v)} />
              </Field>
              <Field label="Anything else we should know?">
                <textarea rows={3} value={f.notes || ''} onChange={(e) => set('notes', e.target.value)} />
              </Field>
            </>
          ),
          valid: () => null,
        },
        contactStep(),
      ]}
    />
  )
}

export function FoundAVehicle() {
  return (
    <Wizard
      title="I already found a vehicle"
      intro="Great, tell us about it and we'll take the admin from here."
      draftKey="draft-found" journey="found"
      steps={[
        {
          title: 'The vehicle you found',
          fields: (f, set) => (
            <>
              <Field label="Make and model">
                <input value={f.vehicle || ''} onChange={(e) => set('vehicle', e.target.value)} placeholder="e.g. 2022 VW Polo 1.0 TSI" />
              </Field>
              <Field label="Asking price (R)">
                <input value={f.price || ''} inputMode="numeric" onChange={(e) => set('price', e.target.value)} />
              </Field>
              <Field label="Where is it?">
                <Choices value={f.sellerType || ''} options={['Dealership', 'Private seller']} onChange={(v) => set('sellerType', v)} />
              </Field>
              <Field label="Dealership / seller name">
                <input value={f.seller || ''} onChange={(e) => set('seller', e.target.value)} />
              </Field>
              <Field label="Link to the listing (optional)">
                <input value={f.url || ''} inputMode="url" onChange={(e) => set('url', e.target.value)} placeholder="https://…" />
              </Field>
            </>
          ),
          valid: (f) => (!f.vehicle || !f.sellerType ? 'Please give us the vehicle and where you found it.' : null),
        },
        {
          title: 'What do you need from us?',
          fields: (f, set) => (
            <>
              <Field label="Select everything that applies">
                <Choices value={f.need || ''} options={['Finance application', 'Finance + insurance + tracker', 'Just check the deal for me']} onChange={(v) => set('need', v)} />
              </Field>
              <Field label="Anything else?">
                <textarea rows={3} value={f.notes || ''} onChange={(e) => set('notes', e.target.value)} />
              </Field>
            </>
          ),
          valid: (f) => (!f.need ? 'Choose what you need so the right consultant picks this up.' : null),
        },
        contactStep(),
      ]}
    />
  )
}

export function Fleet() {
  return (
    <Wizard
      title="Fleet assistance"
      intro="Vehicles for your business, with one accountable coordination partner."
      draftKey="draft-fleet" journey="fleet"
      steps={[
        {
          title: 'Your company',
          fields: (f, set) => (
            <>
              <Field label="Company name">
                <input value={f.company || ''} onChange={(e) => set('company', e.target.value)} />
              </Field>
              <Field label="Your role">
                <input value={f.role || ''} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Operations manager" />
              </Field>
              <Field label="Operating region">
                <input value={f.region || ''} onChange={(e) => set('region', e.target.value)} placeholder="e.g. KZN, national…" />
              </Field>
            </>
          ),
          valid: (f) => (!f.company ? 'Please give us the company name.' : null),
        },
        {
          title: 'Your fleet need',
          fields: (f, set) => (
            <>
              <Field label="What vehicles do you need?" hint="Types and quantities, e.g. '6 × 1-ton panel vans, 2 × double cabs'">
                <textarea rows={3} value={f.need || ''} onChange={(e) => set('need', e.target.value)} />
              </Field>
              <Field label="Funding preference">
                <Choices value={f.funding || ''} options={['Purchase', 'Lease / rental', 'Not sure yet']} onChange={(v) => set('funding', v)} />
              </Field>
              <Field label="Timeline">
                <Choices value={f.timing || ''} options={['Urgent', 'This quarter', 'Planning ahead']} onChange={(v) => set('timing', v)} />
              </Field>
            </>
          ),
          valid: (f) => (!f.need ? 'A rough description of the vehicles is enough to start.' : null),
        },
        contactStep(),
      ]}
    />
  )
}
