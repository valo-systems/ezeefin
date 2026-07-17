import { ReactNode, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  adminOperationsRepo, customerAccountRepo, repo, STAGES,
} from '../data'
import type {
  CaseFile, DocumentVaultItem, Message, NotificationPreferences, ProfileSectionKey,
  TaskItem, VehicleOption,
} from '../data'
import {
  EmptyState, JourneyTimeline, PageIntro, Panel, Readiness, StatusPill,
  TasksList, useRepository, VaultRow,
} from '../concierge-ui'
import { Logo, PageMeta } from '../ui'

const CASE_ID = 'c1'

function PortalLogin() {
  const navigate = useNavigate()
  const [mobile, setMobile] = useState('060 000 0001')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('2431')
  return (
    <main className="auth-page">
      <PageMeta title="Customer portal" description="Your private EzeeFin concierge account." />
      <div className="auth-visual">
        <Logo />
        <div><span className="eyebrow-light">Your private concierge</span><h1>Everything moving.<br /><span className="accent-word">One clear view.</span></h1></div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <span className="eyebrow-light">Welcome back</span>
          <h2>{sent ? 'Enter your PIN' : 'Customer portal'}</h2>
          {!sent ? (
            <>
              <p className="muted">Use the verified mobile number linked to your EzeeFin account. We’ll send a once-off PIN.</p>
              <div className="field"><label>Mobile number</label><input value={mobile} inputMode="tel" onChange={(event) => setMobile(event.target.value)} /></div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSent(true)}>Send one-time PIN</button>
              <p className="small muted">Lost access? Your case reference or verified email can help your consultant restore it.</p>
            </>
          ) : (
            <>
              <p className="muted">For this demonstration, use <strong>2431</strong>. No message is sent.</p>
              <div className="field"><label>One-time PIN</label><input value={otp} inputMode="numeric" onChange={(event) => setOtp(event.target.value)} /></div>
              <button className="btn btn-primary" style={{ width: '100%' }} disabled={otp !== '2431'} onClick={() => navigate('/portal/home')}>Open my account</button>
              <button className="text-button" onClick={() => setSent(false)}>Use a different number</button>
            </>
          )}
          <p className="small muted"><Link to="/">← Back to website</Link></p>
        </div>
      </div>
    </main>
  )
}

const portalLinks = [
  ['/portal/home', 'Home', '⌂'],
  ['/portal/journey', 'Journey', '◉'],
  ['/portal/documents', 'Documents', '▤'],
  ['/portal/messages', 'Messages', '○'],
  ['/portal/account', 'Account', '◇'],
] as const

function PortalShell({ children }: { children: ReactNode }) {
  const profile = useRepository(() => customerAccountRepo.getProfile(), customerAccountRepo.subscribe)
  return (
    <>
      <header className="workspace-header">
        <div className="workspace-header-inner">
          <Logo />
          <div className="workspace-context"><span>Customer concierge</span><strong>{profile?.assignedConsultant || 'Your consultant'}</strong></div>
          <div className="workspace-account">
            <Link to="/portal/account" className="avatar-link" aria-label="Open account">{profile?.initials || 'ND'}</Link>
            <Link to="/" className="workspace-exit">Exit portal</Link>
          </div>
        </div>
      </header>
      <div className="workspace-shell customer-workspace">
        <aside className="workspace-sidebar">
          <div className="sidebar-account">
            <span className="avatar large">{profile?.initials || 'ND'}</span>
            <div><strong>{profile?.displayName || 'Customer'}</strong><small>Private account</small></div>
          </div>
          <nav aria-label="Customer portal">{portalLinks.map(([to, label, icon]) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
              <span aria-hidden>{icon}</span>{label}
            </NavLink>
          ))}</nav>
          <div className="sidebar-support"><span>Need help?</span><strong>0861 666 669</strong><small>Mon–Fri · 08:00–17:00</small></div>
        </aside>
        <div className="workspace-content">{children}</div>
      </div>
      <nav className="workspace-mobile-nav" aria-label="Customer portal">{portalLinks.map(([to, label, icon]) => (
        <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
          <span aria-hidden>{icon}</span><small>{label}</small>
        </NavLink>
      ))}</nav>
    </>
  )
}

function CustomerHome() {
  const profile = useRepository(() => customerAccountRepo.getProfile(), customerAccountRepo.subscribe)
  const journeys = useRepository(() => customerAccountRepo.getJourneys(), customerAccountRepo.subscribe)
  const vault = useRepository(() => customerAccountRepo.getVault(), customerAccountRepo.subscribe)
  const caseFile = useRepository(() => repo.getCase(CASE_ID), repo.subscribe)
  const tasks = useRepository(() => repo.getTasks(CASE_ID), repo.subscribe)
  const messages = useRepository(() => repo.getMessages(CASE_ID), repo.subscribe)
  const appointments = useRepository(() => adminOperationsRepo.getAppointments(), adminOperationsRepo.subscribe)
  if (!profile || !caseFile) return <PortalLoading />
  const openTasks = (tasks || []).filter((task) => !task.done && task.who === 'customer')
  const docsNeeded = (vault || []).filter((item) => ['requested', 'rejected', 'stale'].includes(item.status))
  const nextTask = openTasks[0]
  const visibleStage = journeys?.find((journey) => journey.id === CASE_ID)?.stage || caseFile.stage
  return (
    <main>
      <PageMeta title="Your concierge home" description="Your EzeeFin account and active vehicle journey." />
      <PageIntro eyebrow="Your private concierge" title={<>Good afternoon, <span className="accent-word">Nomvula.</span></>}
        body="Everything that needs your attention—and everything we’re handling—is in one calm view."
        action={<Link to="/portal/new-journey" className="btn btn-quiet btn-sm">Start another request</Link>} />

      <section className="customer-hero-card">
        <div>
          <span className="overline">{caseFile.reference} · Active journey</span>
          <h2>{caseFile.vehicleNeed}</h2>
          <div className="hero-meta"><span>Consultant <strong>{profile.assignedConsultant}</strong></span><span>Current stage <strong>{STAGES.find((item) => item.id === visibleStage)?.label}</strong></span></div>
          {nextTask ? <div className="next-action"><span>Next from you</span><strong>{nextTask.label}</strong><Link to={nextTask.label.includes('payslip') ? '/portal/documents' : '/portal/journey'}>Do it now →</Link></div>
            : <p className="all-clear">You’re up to date. We’ll let you know when the next step is ready.</p>}
        </div>
        <Readiness profile={profile} />
      </section>

      <div className="workspace-grid two-one">
        <Panel eyebrow="Journey" title="Where things stand" action={<Link to="/portal/journey" className="quiet-link">View journey →</Link>}>
          <JourneyTimeline stage={visibleStage} compact />
        </Panel>
        <div className="stack">
          <Panel eyebrow="Your attention" title={`${openTasks.length + docsNeeded.length} things to check`}>
            <div className="mini-actions">
              <Link to="/portal/journey"><strong>{openTasks.length}</strong><span>Open tasks</span></Link>
              <Link to="/portal/documents"><strong>{docsNeeded.length}</strong><span>Documents</span></Link>
              <Link to="/portal/messages"><strong>{Math.max((messages?.length || 0) - 1, 0)}</strong><span>New messages</span></Link>
            </div>
          </Panel>
          <Panel eyebrow="Next appointment" title={appointments?.find((item) => item.caseId === CASE_ID)?.title || 'Nothing booked'}>
            {appointments?.find((item) => item.caseId === CASE_ID) ? (
              <p className="panel-copy">{new Date(appointments.find((item) => item.caseId === CASE_ID)!.at).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} · {profile.assignedConsultant}</p>
            ) : <p className="panel-copy">Your consultant will arrange a time if a call or visit is needed.</p>}
          </Panel>
        </div>
      </div>

      {(journeys || []).filter((item) => item.status === 'completed').length > 0 && (
        <Panel eyebrow="Your history" title="Already handled">
          <div className="history-strip">{(journeys || []).filter((item) => item.status === 'completed').map((journey) => (
            <article key={journey.id}><span>Delivered</span><strong>{journey.finalVehicle}</strong><small>{journey.reference} · {new Date(journey.completedAt!).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</small></article>
          ))}</div>
        </Panel>
      )}
    </main>
  )
}

function Journey() {
  const caseFile = useRepository(() => repo.getCase(CASE_ID), repo.subscribe)
  const journeys = useRepository(() => customerAccountRepo.getJourneys(), customerAccountRepo.subscribe)
  const tasks = useRepository(() => repo.getTasks(CASE_ID), repo.subscribe)
  const options = useRepository(() => repo.getOptions(CASE_ID), repo.subscribe)
  const finance = useRepository(() => adminOperationsRepo.getFinance(CASE_ID), adminOperationsRepo.subscribe)
  const coverage = useRepository(() => adminOperationsRepo.getCoverage(CASE_ID), adminOperationsRepo.subscribe)
  if (!caseFile) return <PortalLoading />
  const selected = options?.find((option) => option.selected)
  const visibleStage = journeys?.find((journey) => journey.id === CASE_ID)?.stage || caseFile.stage
  return (
    <main>
      <PageMeta title="Your journey" description="Track every stage of your EzeeFin vehicle journey." />
      <PageIntro eyebrow={`${caseFile.reference} · Started ${new Date(caseFile.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`}
        title={<>Your active <span className="accent-word">journey.</span></>}
        body={caseFile.vehicleNeed} />
      <div className="workspace-grid journey-grid">
        <Panel eyebrow="Progress tracker" title={STAGES.find((item) => item.id === visibleStage)?.label || 'In progress'}>
          <JourneyTimeline stage={visibleStage} />
        </Panel>
        <div className="stack">
          <Panel eyebrow="Tasks" title="What happens next">
            {(tasks || []).length ? <TasksList tasks={tasks || []} /> : <EmptyState title="Nothing outstanding" body="We’re working on the next stage." />}
          </Panel>
          <Panel eyebrow="Finance coordination" title="Private, human follow-up">
            <div className="provider-list">{(finance || []).map((item) => (
              <div key={item.id}><div><strong>{item.provider}</strong><small>Coordinated by {item.owner}</small></div><StatusPill status={item.status} /></div>
            ))}</div>
            <p className="legal-note">EzeeFin coordinates applications with registered credit providers. Final decisions and terms come from the provider.</p>
          </Panel>
          <Panel eyebrow="Insurance & tracker" title="Cover coordination">
            <div className="provider-list">{(coverage || []).map((item) => (
              <div key={item.id}><div><strong>{item.kind === 'insurance' ? 'Insurance quotation' : 'Tracker quotation'}</strong><small>{item.provider}{item.monthlyAmount ? ` · R${item.monthlyAmount}/month` : ''}</small></div><StatusPill status={item.status} /></div>
            ))}</div>
          </Panel>
        </div>
      </div>

      <Panel eyebrow="Sourced for you" title="Vehicle options" action={selected && <StatusPill status="selected">Your choice saved</StatusPill>}>
        <p className="panel-copy">Indicative instalments are estimates only. Final terms are supplied by the registered credit provider.</p>
        <div className="vehicle-option-grid">{(options || []).map((option) => (
          <VehicleOptionCard key={option.id} option={option} onSelect={() => repo.selectOption(CASE_ID, option.id)} />
        ))}</div>
      </Panel>
    </main>
  )
}

function VehicleOptionCard({ option, onSelect }: { option: VehicleOption; onSelect: () => void }) {
  return (
    <article className={`vehicle-option ${option.selected ? 'selected' : ''}`}>
      <div className="vehicle-image"><img src={option.image} alt={option.title} />{option.selected && <span>Your selection</span>}</div>
      <div className="vehicle-copy"><span>{option.year} · {option.mileage}</span><h3>{option.title}</h3><p>{option.dealership}</p>
        <div className="vehicle-price"><strong>R{option.price.toLocaleString('en-ZA')}</strong><span>± R{option.estInstalment.toLocaleString('en-ZA')}/month</span></div>
        <p>{option.notes}</p><button className={option.selected ? 'btn btn-quiet btn-sm' : 'btn btn-primary btn-sm'} disabled={option.selected} onClick={onSelect}>{option.selected ? 'Selected ✓' : 'Choose this option'}</button>
      </div>
    </article>
  )
}

function Documents() {
  const vault = useRepository(() => customerAccountRepo.getVault(), customerAccountRepo.subscribe)
  const [busy, setBusy] = useState<string | null>(null)
  const simulateUpload = (item: DocumentVaultItem) => {
    setBusy(item.id)
    window.setTimeout(() => setBusy(null), 700)
  }
  const attention = (vault || []).filter((item) => ['requested', 'rejected', 'stale'].includes(item.status))
  const current = (vault || []).filter((item) => !['requested', 'rejected', 'stale'].includes(item.status))
  return (
    <main>
      <PageMeta title="Document vault" description="Your secure EzeeFin document requests and verified records." />
      <PageIntro eyebrow="Secure document vault" title={<>Documents, without the <span className="accent-word">chasing.</span></>}
        body="Upload only what your consultant requests. Fresh verified documents can be reused after you confirm." />
      {attention.length > 0 && <Panel eyebrow="Needs attention" title={`${attention.length} documents`}>
        <div className="vault-list">{attention.map((item) => <VaultRow key={item.id} item={item}
          action={<button className="btn btn-primary btn-sm" disabled={busy === item.id} onClick={() => simulateUpload(item)}>{busy === item.id ? 'Uploading…' : item.status === 'stale' ? 'Replace' : 'Upload'}</button>} />)}</div>
      </Panel>}
      <Panel eyebrow="Ready to reuse" title="Verified and being checked">
        <div className="vault-list">{current.map((item) => <VaultRow key={item.id} item={item} />)}</div>
        <p className="legal-note">Only authorised staff working on your journey can access these documents. Every view and download is recorded.</p>
      </Panel>
    </main>
  )
}

function Messages() {
  const messages = useRepository<Message[]>(() => repo.getMessages(CASE_ID), repo.subscribe)
  const [text, setText] = useState('')
  const send = async () => {
    if (!text.trim()) return
    await repo.sendMessage(CASE_ID, 'customer', 'Nomvula D.', text.trim())
    setText('')
  }
  return (
    <main className="messages-page">
      <PageMeta title="Messages" description="Private messages with your EzeeFin consultant." />
      <PageIntro eyebrow="Direct to your consultant" title={<>Your conversation with <span className="accent-word">Thandi.</span></>}
        body="Messages about this journey stay together, so nothing important disappears in a chat history." />
      <section className="conversation-card">
        <header><span className="avatar">TM</span><div><strong>Thandi M.</strong><small>Your EzeeFin consultant · Usually replies within one business day</small></div><StatusPill status="active">Available</StatusPill></header>
        <div className="conversation-thread">{(messages || []).map((message) => (
          <article key={message.id} className={`conversation-message ${message.from}`}>
            <span>{message.body}</span><small>{message.author} · {new Date(message.at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</small>
          </article>
        ))}</div>
        <div className="conversation-composer"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a message…" onKeyDown={(event) => event.key === 'Enter' && send()} /><button className="btn btn-primary btn-sm" onClick={send}>Send</button></div>
      </section>
    </main>
  )
}

function Account() {
  const profile = useRepository(() => customerAccountRepo.getProfile(), customerAccountRepo.subscribe)
  const journeys = useRepository(() => customerAccountRepo.getJourneys(), customerAccountRepo.subscribe)
  if (!profile) return <PortalLoading />
  return (
    <main>
      <PageMeta title="Your account" description="Your reusable EzeeFin Finance Passport and preferences." />
      <PageIntro eyebrow={`Customer since ${new Date(profile.customerSince).getFullYear()}`} title={<>Your reusable <span className="accent-word">Finance Passport.</span></>}
        body="Complete it once, keep it current, and confirm what may be reused for each new journey."
        action={<Readiness profile={profile} compact />} />
      <div className="profile-section-grid">{profile.sections.map((section) => (
        <Link to={`/portal/account/passport/${section.key}`} className="profile-section-card" key={section.key}>
          <div><span>{section.label}</span><small>{section.description}</small></div><StatusPill status={section.status} /><b aria-hidden>→</b>
        </Link>
      ))}</div>
      <div className="workspace-grid equal">
        <Panel eyebrow="Preferences" title="How we contact you" action={<Link to="/portal/account/notifications" className="quiet-link">Manage →</Link>}>
          <p className="panel-copy">WhatsApp is your primary channel. Document requests also use SMS and email.</p>
        </Panel>
        <Panel eyebrow="Privacy" title="Consent & your data" action={<Link to="/portal/account/privacy" className="quiet-link">Review →</Link>}>
          <p className="panel-copy">See what you agreed to, request a correction, or ask for a copy of your information.</p>
        </Panel>
        <Panel eyebrow="History" title={`${(journeys || []).length} vehicle journeys`} action={<Link to="/portal/account/history" className="quiet-link">View history →</Link>}>
          <p className="panel-copy">One active request and one completed delivery are linked to this account.</p>
        </Panel>
        <Panel eyebrow="Security" title="Passwordless access">
          <p className="panel-copy">Verified mobile ending 001 · Sensitive changes require a fresh one-time PIN.</p>
        </Panel>
      </div>
    </main>
  )
}

function PassportSection() {
  const { section: sectionKey = 'identity' } = useParams()
  const profile = useRepository(() => customerAccountRepo.getProfile(), customerAccountRepo.subscribe)
  const navigate = useNavigate()
  const section = profile?.sections.find((item) => item.key === sectionKey)
  const [draft, setDraft] = useState<Record<string, string> | null>(null)
  if (!profile || !section) return <PortalLoading />
  const values = draft || section.fields
  const save = async () => {
    await customerAccountRepo.updateSection(section.key, values)
    navigate('/portal/account')
  }
  return (
    <main className="narrow-workspace">
      <Link to="/portal/account" className="back-link">← Finance Passport</Link>
      <PageMeta title={section.label} description={`Review your ${section.label.toLowerCase()} profile details.`} />
      <PageIntro eyebrow={section.description} title={section.label} action={<StatusPill status={section.status} />} />
      {section.status === 'verified' && <div className="security-notice"><strong>Verified information</strong><p>Changes are saved as a pending correction. We’ll ask for a one-time PIN and your operations specialist will review supporting documents.</p></div>}
      <section className="concierge-form">{Object.entries(values).map(([label, value]) => (
        <div className="field" key={label}><label>{label}</label><input value={value} onChange={(event) => setDraft({ ...values, [label]: event.target.value })} /></div>
      ))}
        <div className="form-actions"><button className="btn btn-primary" onClick={save}>Save section</button><Link to="/portal/account" className="btn btn-quiet">Cancel</Link></div>
      </section>
    </main>
  )
}

function NotificationSettings() {
  const saved = useRepository(() => customerAccountRepo.getPreferences(), customerAccountRepo.subscribe)
  const [draft, setDraft] = useState<NotificationPreferences | null>(null)
  const navigate = useNavigate()
  if (!saved) return <PortalLoading />
  const prefs = draft || saved
  const groups = [
    ['journeyUpdates', 'Journey updates'], ['documentRequests', 'Document requests'], ['messages', 'Consultant messages'],
    ['appointments', 'Appointments'], ['marketing', 'Optional marketing'],
  ] as const
  return (
    <main className="narrow-workspace">
      <Link to="/portal/account" className="back-link">← Account</Link>
      <PageIntro eyebrow="Communication preferences" title="Choose how we contact you" body="Important portal notices remain visible even if a channel is switched off." />
      <section className="preference-table">
        <header><span>Notification</span><span>WhatsApp</span><span>SMS</span><span>Email</span></header>
        {groups.map(([key, label]) => <div key={key}><strong>{label}</strong>{(['whatsapp', 'sms', 'email'] as const).map((channel) => (
          <label key={channel}><input type="checkbox" checked={prefs[key][channel]} onChange={(event) => setDraft({ ...prefs, [key]: { ...prefs[key], [channel]: event.target.checked } })} /><span>{channel}</span></label>
        ))}</div>)}
      </section>
      <button className="btn btn-primary" onClick={async () => { await customerAccountRepo.updatePreferences(prefs); navigate('/portal/account') }}>Save preferences</button>
    </main>
  )
}

function PrivacyCentre() {
  const consents = useRepository(() => customerAccountRepo.getConsents(), customerAccountRepo.subscribe)
  return (
    <main>
      <Link to="/portal/account" className="back-link">← Account</Link>
      <PageIntro eyebrow="Privacy centre" title={<>Your information, <span className="accent-word">clearly handled.</span></>}
        body="Review consent records and request access, correction, or account closure. Requests are handled by a person." />
      <Panel eyebrow="Consent history" title="What you agreed to">
        <div className="consent-list">{(consents || []).map((consent) => <article key={consent.id}><span className={consent.granted ? 'consent-check on' : 'consent-check'}>{consent.granted ? '✓' : '—'}</span><div><strong>{consent.label}</strong><small>Version {consent.version} · {new Date(consent.recordedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}{consent.journeyReference ? ` · ${consent.journeyReference}` : ''}</small></div><StatusPill status={consent.granted ? 'verified' : 'neutral'}>{consent.granted ? 'Granted' : 'Not granted'}</StatusPill></article>)}</div>
      </Panel>
      <div className="workspace-grid equal">
        {[
          ['Request a copy', 'Receive a secure copy of the personal information linked to your account.'],
          ['Correct information', 'Ask us to correct information you cannot change directly.'],
          ['Close my account', 'Request account closure subject to legal retention requirements.'],
        ].map(([title, body]) => <Panel key={title} title={title}><p className="panel-copy">{body}</p><button className="btn btn-quiet btn-sm">Start request</button></Panel>)}
      </div>
    </main>
  )
}

function JourneyHistory() {
  const journeys = useRepository(() => customerAccountRepo.getJourneys(), customerAccountRepo.subscribe)
  return (
    <main>
      <Link to="/portal/account" className="back-link">← Account</Link>
      <PageIntro eyebrow="Journey history" title="Every vehicle journey" body="Active and completed requests stay connected to your account while retention rules permit." />
      <div className="journey-history-list">{(journeys || []).map((journey) => <article key={journey.id}>
        <div><span>{journey.reference}</span><h3>{journey.finalVehicle || journey.title}</h3><p>{journey.consultant} · Started {new Date(journey.startedAt).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })}</p></div>
        <StatusPill status={journey.status} />
      </article>)}</div>
    </main>
  )
}

function NewJourney() {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  return (
    <main className="narrow-workspace">
      <Link to="/portal/home" className="back-link">← Home</Link>
      <PageIntro eyebrow="Returning customer" title="Start another request" body="Your confirmed contact details and preferences will be prefilled. You choose what may be reused before anything is shared." />
      <Panel title="Ready to carry forward">
        <div className="reuse-list"><span>✓ Verified contact details</span><span>✓ Finance Passport profile</span><span>✓ Fresh identity documents</span><span>✓ Vehicle preferences</span></div>
      </Panel>
      <label className="consent-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>I confirm my profile is current and consent to EzeeFin creating a new journey snapshot.</span></label>
      <button className="btn btn-primary" disabled={!confirmed} onClick={() => navigate('/find-me-a-vehicle')}>Continue to guided request</button>
    </main>
  )
}

function PortalLoading() {
  return <main><div className="loading-state"><span /><p>Preparing your concierge account…</p></div></main>
}

export default function Portal() {
  return (
    <Routes>
      <Route index element={<PortalLogin />} />
      <Route path="home" element={<PortalShell><CustomerHome /></PortalShell>} />
      <Route path="journey" element={<PortalShell><Journey /></PortalShell>} />
      <Route path="documents" element={<PortalShell><Documents /></PortalShell>} />
      <Route path="messages" element={<PortalShell><Messages /></PortalShell>} />
      <Route path="account" element={<PortalShell><Account /></PortalShell>} />
      <Route path="account/passport/:section" element={<PortalShell><PassportSection /></PortalShell>} />
      <Route path="account/notifications" element={<PortalShell><NotificationSettings /></PortalShell>} />
      <Route path="account/privacy" element={<PortalShell><PrivacyCentre /></PortalShell>} />
      <Route path="account/history" element={<PortalShell><JourneyHistory /></PortalShell>} />
      <Route path="new-journey" element={<PortalShell><NewJourney /></PortalShell>} />
      <Route path="overview" element={<Navigate to="/portal/home" replace />} />
      <Route path="tasks" element={<Navigate to="/portal/journey" replace />} />
      <Route path="options" element={<Navigate to="/portal/journey" replace />} />
      <Route path="*" element={<Navigate to="/portal/home" replace />} />
    </Routes>
  )
}
