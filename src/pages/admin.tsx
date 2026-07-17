import { ReactNode, useMemo, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  adminOperationsRepo, customerAccountRepo, repo, STAGES,
} from '../data'
import type {
  Appointment, AuditEvent, CaseFile, CustomerProfile, DocRequest, Lead, Message,
  ProfileChangeRequest, StaffUser, TaskItem, VehicleOption,
} from '../data'
import {
  ActivityTimeline, JourneyTimeline, Metric, PageIntro, Panel, Readiness, StatusPill,
  TasksList, useRepository, VaultRow,
} from '../concierge-ui'
import { Logo, PageMeta } from '../ui'

function AdminLogin() {
  const navigate = useNavigate()
  return (
    <main className="auth-page staff">
      <PageMeta title="Staff sign-in" description="Secure EzeeFin operations workspace." />
      <div className="auth-visual"><Logo /><div><span className="eyebrow-light">EzeeFin operations</span><h1>Concierge service,<br /><span className="accent-word">operationally clear.</span></h1></div></div>
      <div className="auth-panel"><div className="auth-card">
        <span className="eyebrow-light">Authorised staff</span><h2>Staff sign-in</h2>
        <p className="muted">Production uses a strong password, secure staff session, and role-based access. This demonstration opens the manager workspace.</p>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/admin/work')}>Sign in as Des M. · Manager</button>
        <p className="small muted"><Link to="/">← Back to website</Link></p>
      </div></div>
    </main>
  )
}

const adminPrimary = [
  ['/admin/work', 'Work', '◆'],
  ['/admin/leads', 'Leads', '○'],
  ['/admin/customers', 'Customers', '◇'],
  ['/admin/cases', 'Cases', '▤'],
  ['/admin/documents', 'Documents', '▱'],
  ['/admin/messages', 'Messages', '◌'],
  ['/admin/calendar', 'Calendar', '□'],
  ['/admin/reports', 'Reports', '⌁'],
] as const

const adminGovernance = [
  ['/admin/staff', 'Staff'],
  ['/admin/audit', 'Audit'],
  ['/admin/settings', 'Settings'],
] as const

function AdminShell({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const cases = useRepository(() => repo.getCases(), repo.subscribe)
  const customers = useRepository(() => adminOperationsRepo.getCustomers(), adminOperationsRepo.subscribe)
  const runSearch = () => {
    const query = search.trim().toLowerCase()
    const caseMatch = cases?.find((item) => `${item.reference} ${item.customer} ${item.vehicleNeed}`.toLowerCase().includes(query))
    const customerMatch = customers?.find((item) => `${item.displayName} ${item.mobile} ${item.email}`.toLowerCase().includes(query))
    if (caseMatch) navigate(`/admin/case/${caseMatch.id}/overview`)
    else if (customerMatch) navigate(`/admin/customer/${customerMatch.id}`)
  }
  return (
    <>
      <header className="workspace-header admin-workspace-header">
        <div className="workspace-header-inner">
          <Logo />
          <div className="global-search"><span aria-hidden>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, reference, mobile or vehicle…" onKeyDown={(event) => event.key === 'Enter' && runSearch()} /></div>
          <div className="workspace-account"><span className="avatar-link">DM</span><div className="staff-identity"><strong>Des M.</strong><small>Manager</small></div><Link to="/" className="workspace-exit">Exit</Link></div>
        </div>
      </header>
      <div className="workspace-shell admin-workspace">
        <aside className="workspace-sidebar admin-sidebar">
          <nav aria-label="Operations">{adminPrimary.map(([to, label, icon]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><span aria-hidden>{icon}</span>{label}</NavLink>)}</nav>
          <div className="sidebar-divider" />
          <nav aria-label="Administration">{adminGovernance.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><span aria-hidden>·</span>{label}</NavLink>)}</nav>
          <div className="sidebar-role"><span>Signed in as</span><strong>Manager</strong><small>All operational queues</small></div>
        </aside>
        <div className="workspace-content admin-content">{children}</div>
      </div>
      <nav className="workspace-mobile-nav admin-mobile-nav" aria-label="Operations">
        {[
          ['/admin/work', 'Work', '◆'], ['/admin/leads', 'Leads', '○'], ['/admin/cases', 'Cases', '▤'],
          ['/admin/messages', 'Messages', '◌'], ['/admin/customers', 'More', '•••'],
        ].map(([to, label, icon]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><span aria-hidden>{icon}</span><small>{label}</small></NavLink>)}
      </nav>
    </>
  )
}

function WorkDashboard() {
  const queues = useRepository(() => adminOperationsRepo.getQueues(), adminOperationsRepo.subscribe)
  const cases = useRepository(() => repo.getCases(), repo.subscribe)
  const leads = useRepository(() => repo.getLeads(), repo.subscribe)
  const appointments = useRepository(() => adminOperationsRepo.getAppointments(), adminOperationsRepo.subscribe)
  const audit = useRepository(() => adminOperationsRepo.getAudit(), adminOperationsRepo.subscribe)
  return (
    <main>
      <PageMeta title="Operations work queue" description="Priority EzeeFin customer and case actions." />
      <PageIntro eyebrow="Friday, 17 July" title={<>Good afternoon, <span className="accent-word">Des.</span></>}
        body="The work needing attention is ordered by customer impact and due time." />
      <div className="metric-grid">
        <Metric label="New leads" value={leads?.filter((item) => item.status === 'new').length || 0} detail="5 need a first response" tone="red" />
        <Metric label="Active cases" value={cases?.length || 0} detail="2 outside target time" />
        <Metric label="Profile reviews" value={queues?.find((item) => item.id === 'profile')?.count || 0} detail="Sensitive changes" />
        <Metric label="Today" value={appointments?.filter((item) => new Date(item.at).toDateString() === new Date().toDateString()).length || 0} detail="Appointments and checks" tone="dark" />
      </div>
      <div className="workspace-grid two-one admin-dashboard-grid">
        <Panel eyebrow="Priority queues" title="What needs action now">
          <div className="queue-grid">{(queues || []).map((queue) => <Link to={queue.route} key={queue.id} className={`queue-card ${queue.urgency}`}>
            <span>{queue.count}</span><div><strong>{queue.label}</strong><small>{queue.description}</small></div><b aria-hidden>→</b>
          </Link>)}</div>
        </Panel>
        <div className="stack">
          <Panel eyebrow="Today" title="Appointments">
            <AppointmentList appointments={(appointments || []).slice(0, 3)} />
            <Link to="/admin/calendar" className="quiet-link">Open calendar →</Link>
          </Panel>
          <Panel eyebrow="Live operations" title="Latest activity">
            <ActivityTimeline events={(audit || []).slice(0, 4)} />
            <Link to="/admin/audit" className="quiet-link">Full audit history →</Link>
          </Panel>
        </div>
      </div>
    </main>
  )
}

const journeyLabel = { find: 'Find a vehicle', found: 'Found a vehicle', fleet: 'Fleet' } as const

function Leads() {
  const leads = useRepository<Lead[]>(() => repo.getLeads(), repo.subscribe)
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const visible = (leads || []).filter((lead) => filter === 'all' || lead.status === filter)
  return (
    <main>
      <PageMeta title="Leads" description="Qualify, assign and convert EzeeFin enquiries." />
      <PageIntro eyebrow="Lead operations" title="Leads inbox" body={`${leads?.filter((item) => item.status === 'new').length || 0} new enquiries, newest first.`}
        action={<button className="btn btn-primary btn-sm">Add lead</button>} />
      <FilterBar value={filter} onChange={setFilter} options={['all', 'new', 'qualified', 'converted', 'closed']} />
      <div className="record-table">
        <div className="record-table-head"><span>Reference</span><span>Customer</span><span>Journey</span><span>Need</span><span>Location</span><span>Status</span></div>
        {visible.map((lead) => <button key={lead.id} className="record-table-row" onClick={() => lead.status === 'converted' ? navigate('/admin/case/c1/overview') : undefined}>
          <span data-label="Reference"><strong>{lead.reference}</strong></span><span data-label="Customer">{lead.name}</span><span data-label="Journey">{journeyLabel[lead.journey]}</span><span data-label="Need">{lead.summary}</span><span data-label="Location">{lead.city}</span><span data-label="Status"><StatusPill status={lead.status} /></span>
        </button>)}
      </div>
    </main>
  )
}

function Customers() {
  const customers = useRepository(() => adminOperationsRepo.getCustomers(), adminOperationsRepo.subscribe)
  return (
    <main>
      <PageMeta title="Customers" description="EzeeFin customer profiles and journey history." />
      <PageIntro eyebrow="Customer records" title="Customers" body="Reusable profiles, verified contact details, journey history, and current ownership." />
      <div className="customer-record-grid">{(customers || []).map((customer) => <Link to={`/admin/customer/${customer.id}`} key={customer.id} className="customer-record">
        <span className="avatar large">{customer.initials}</span><div><h3>{customer.displayName}</h3><p>{customer.mobile} · {customer.email}</p><small>Consultant: {customer.assignedConsultant}</small></div><Readiness profile={customer} compact /><b aria-hidden>→</b>
      </Link>)}</div>
    </main>
  )
}

function CustomerView() {
  const { id = 'customer-1' } = useParams()
  const customers = useRepository(() => adminOperationsRepo.getCustomers(), adminOperationsRepo.subscribe)
  const changes = useRepository(() => adminOperationsRepo.getProfileChanges(), adminOperationsRepo.subscribe)
  const vault = useRepository(() => customerAccountRepo.getVault(), customerAccountRepo.subscribe)
  const journeys = useRepository(() => customerAccountRepo.getJourneys(), customerAccountRepo.subscribe)
  const audit = useRepository(() => adminOperationsRepo.getAudit(), adminOperationsRepo.subscribe)
  const [revealed, setRevealed] = useState(false)
  const customer = customers?.find((item) => item.id === id)
  if (!customer) return <Loading />
  const reveal = async () => {
    setRevealed(true)
    await adminOperationsRepo.recordAudit({ actor: 'Des M.', action: 'Sensitive profile revealed', subject: customer.displayName, detail: 'Reason: customer profile review from 360° workspace.', tone: 'sensitive' })
  }
  return (
    <main>
      <Link to="/admin/customers" className="back-link">← Customers</Link>
      <PageMeta title={customer.displayName} description="Customer 360° operations view." />
      <section className="customer-360-header"><span className="avatar xlarge">{customer.initials}</span><div><span className="overline">Customer since {new Date(customer.customerSince).getFullYear()}</span><h1>{customer.displayName}</h1><p>{customer.mobile} · {customer.email} · Owner: {customer.assignedConsultant}</p></div><Readiness profile={customer} /><div className="action-menu"><button className="btn btn-primary btn-sm">Start new journey</button><button className="btn btn-quiet btn-sm">Message</button></div></section>
      <div className="workspace-grid two-one">
        <div className="stack">
          <Panel eyebrow="Finance Passport" title="Profile sections" action={!revealed ? <button className="btn btn-quiet btn-sm" onClick={reveal}>Reveal sensitive fields</button> : <StatusPill status="verified">Reveal audited</StatusPill>}>
            <div className="profile-review-grid">{customer.sections.map((section) => <article key={section.key}><div><strong>{section.label}</strong><small>Updated {new Date(section.updatedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</small></div><StatusPill status={section.status} />{Object.entries(section.fields).slice(0, 2).map(([label, value]) => <p key={label}><span>{label}</span><strong>{revealed || !['ID number', 'Net monthly income', 'Account number'].includes(label) ? value : '••••••••'}</strong></p>)}</article>)}</div>
          </Panel>
          <Panel eyebrow="Document vault" title="Freshness & verification">
            <div className="vault-list">{(vault || []).slice(0, 4).map((item) => <VaultRow key={item.id} item={item} />)}</div>
          </Panel>
        </div>
        <div className="stack">
          <Panel eyebrow="Journeys" title="Current and previous">
            <div className="customer-journeys">{(journeys || []).map((journey) => <Link to={journey.status === 'active' ? `/admin/case/${journey.id}/overview` : '#'} key={journey.id}><div><strong>{journey.reference}</strong><span>{journey.finalVehicle || journey.title}</span></div><StatusPill status={journey.status} /></Link>)}</div>
          </Panel>
          <Panel eyebrow="Pending changes" title={`${changes?.filter((item) => item.customerId === id && item.status === 'pending').length || 0} awaiting review`}>
            {(changes || []).filter((item) => item.customerId === id && item.status === 'pending').map((change) => <Link className="change-summary" to="/admin/profile-reviews" key={change.id}><div><strong>{change.field}</strong><small>{change.previousValue} → {change.proposedValue}</small></div><StatusPill status="pending" /></Link>)}
          </Panel>
          <Panel eyebrow="Activity" title="Customer record">
            <ActivityTimeline events={(audit || []).filter((event) => event.subject.includes(customer.displayName) || event.subject.includes('EZ-2431')).slice(0, 5)} />
          </Panel>
        </div>
      </div>
    </main>
  )
}

function ProfileReviews() {
  const changes = useRepository(() => adminOperationsRepo.getProfileChanges(), adminOperationsRepo.subscribe)
  const [selected, setSelected] = useState<ProfileChangeRequest | null>(null)
  return (
    <main>
      <PageMeta title="Profile reviews" description="Review sensitive customer profile corrections." />
      <PageIntro eyebrow="Operations queue" title="Profile changes" body="Compare the prior verified value with the customer’s proposed correction and supporting explanation." />
      <div className="review-list">{(changes || []).map((change) => <article key={change.id} className={selected?.id === change.id ? 'selected' : ''}>
        <button onClick={() => setSelected(change)}><div><span>{change.customer}</span><strong>{change.field}</strong><small>{change.section} · submitted {new Date(change.submittedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</small></div><StatusPill status={change.status} /></button>
        {selected?.id === change.id && <div className="review-detail"><div><span>Previous verified</span><strong>{change.previousValue}</strong></div><div><span>Proposed</span><strong>{change.proposedValue}</strong></div><blockquote>“{change.explanation}”</blockquote>
          <p className="legal-note">This decision is audited. Internal reasoning is never shown in the customer message.</p>
          {change.status === 'pending' && <div className="review-actions"><button className="btn btn-primary btn-sm" onClick={() => adminOperationsRepo.reviewProfileChange(change.id, 'approved')}>Approve change</button><button className="btn btn-quiet btn-sm" onClick={() => adminOperationsRepo.reviewProfileChange(change.id, 'clarification')}>Ask for clarification</button><button className="text-button danger" onClick={() => adminOperationsRepo.reviewProfileChange(change.id, 'rejected')}>Reject</button></div>}
        </div>}
      </article>)}</div>
    </main>
  )
}

function Cases() {
  const cases = useRepository<CaseFile[]>(() => repo.getCases(), repo.subscribe)
  const navigate = useNavigate()
  return (
    <main>
      <PageMeta title="Cases" description="Active EzeeFin customer journeys." />
      <PageIntro eyebrow="Journey operations" title="Active cases" body="One accountable owner, specialist assignments, clear next actions, and stage-age visibility." />
      <div className="case-card-grid">{(cases || []).map((caseFile, index) => <button key={caseFile.id} onClick={() => navigate(`/admin/case/${caseFile.id}/overview`)}>
        <div className="case-card-top"><span>{caseFile.reference}</span><StatusPill status={index === 1 ? 'attention' : 'pending'}>{STAGES.find((item) => item.id === caseFile.stage)?.label}</StatusPill></div>
        <h3>{caseFile.customer}</h3><p>{caseFile.vehicleNeed}</p><div className="case-card-meta"><span>Owner <strong>{caseFile.consultant}</strong></span><span>In stage <strong>{index === 1 ? '4 days' : '1 day'}</strong></span></div>
      </button>)}</div>
    </main>
  )
}

const caseTabs = ['overview', 'journey', 'profile', 'documents', 'vehicles', 'finance', 'cover', 'messages', 'activity'] as const

function CaseWorkspace() {
  const { id = 'c1', tab = 'overview' } = useParams()
  const caseFile = useRepository(() => repo.getCase(id), repo.subscribe, [id])
  const tasks = useRepository(() => repo.getTasks(id), repo.subscribe, [id])
  const docs = useRepository(() => repo.getDocs(id), repo.subscribe, [id])
  const options = useRepository(() => repo.getOptions(id), repo.subscribe, [id])
  const messages = useRepository(() => repo.getMessages(id), repo.subscribe, [id])
  const assignments = useRepository(() => adminOperationsRepo.getAssignments(id), adminOperationsRepo.subscribe, [id])
  const finance = useRepository(() => adminOperationsRepo.getFinance(id), adminOperationsRepo.subscribe, [id])
  const coverage = useRepository(() => adminOperationsRepo.getCoverage(id), adminOperationsRepo.subscribe, [id])
  const audit = useRepository(() => adminOperationsRepo.getAudit(), adminOperationsRepo.subscribe)
  const profile = useRepository(() => customerAccountRepo.getProfile(), customerAccountRepo.subscribe)
  const [transitionOpen, setTransitionOpen] = useState(false)
  if (!caseFile) return <Loading />
  const currentIndex = STAGES.findIndex((item) => item.id === caseFile.stage)
  const nextStage = STAGES[currentIndex + 1]
  return (
    <main className="case-workspace">
      <Link to="/admin/cases" className="back-link">← Cases</Link>
      <PageMeta title={`${caseFile.customer} · ${caseFile.reference}`} description="EzeeFin case operations workspace." />
      <section className="case-sticky-header">
        <div><span className="overline">{caseFile.reference} · Active personal journey</span><h1>{caseFile.customer}</h1><p>{caseFile.vehicleNeed} · {caseFile.budget}</p></div>
        <div className="case-owner"><span>Relationship owner</span><strong>{assignments?.find((item) => item.role === 'owner')?.staffName || caseFile.consultant}</strong></div>
        <div className="case-stage"><StatusPill status="pending">{STAGES[currentIndex]?.label}</StatusPill><small>1 day in stage</small></div>
        {nextStage && <button className="btn btn-primary btn-sm" onClick={() => setTransitionOpen(true)}>Move to {nextStage.label}</button>}
      </section>
      <nav className="case-tabs" aria-label="Case workspace">{caseTabs.map((item) => <NavLink key={item} to={`/admin/case/${id}/${item}`} className={tab === item ? 'active' : ''}>{item === 'cover' ? 'Cover & tracker' : item}</NavLink>)}</nav>

      {tab === 'overview' && <CaseOverview caseFile={caseFile} tasks={tasks || []} docs={docs || []} assignments={assignments || []} />}
      {tab === 'journey' && <Panel eyebrow="Customer-visible tracker" title={STAGES[currentIndex]?.label}><JourneyTimeline stage={caseFile.stage} /></Panel>}
      {tab === 'profile' && profile && <Panel eyebrow="Immutable journey snapshot" title="Finance Passport at submission"><div className="profile-review-grid">{profile.sections.map((section) => <article key={section.key}><div><strong>{section.label}</strong><small>Snapshot · consent v2026.1</small></div><StatusPill status={section.status} />{Object.entries(section.fields).slice(0, 2).map(([label, value]) => <p key={label}><span>{label}</span><strong>{['ID number', 'Net monthly income', 'Account number'].includes(label) ? '••••••••' : value}</strong></p>)}</article>)}</div></Panel>}
      {tab === 'documents' && <CaseDocuments caseId={id} docs={docs || []} />}
      {tab === 'vehicles' && <CaseVehicles options={options || []} />}
      {tab === 'finance' && <ProviderRecords title="Finance submissions" items={(finance || []).map((item) => ({ id: item.id, title: item.provider, detail: `${item.owner} · updated ${new Date(item.updatedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`, status: item.status }))} />}
      {tab === 'cover' && <ProviderRecords title="Insurance & tracker coordination" items={(coverage || []).map((item) => ({ id: item.id, title: `${item.kind === 'insurance' ? 'Insurance' : 'Tracker'} · ${item.provider}`, detail: `${item.owner}${item.monthlyAmount ? ` · R${item.monthlyAmount}/month` : ''}`, status: item.status }))} />}
      {tab === 'messages' && <StaffMessages caseId={id} messages={messages || []} />}
      {tab === 'activity' && <Panel eyebrow="Append-only history" title="Case activity"><ActivityTimeline events={(audit || []).filter((event) => event.subject.includes(caseFile.reference)).concat(caseFile.history.map((history, index) => ({ id: `history-${index}`, actor: history.by, action: 'Journey stage changed', subject: caseFile.reference, detail: STAGES.find((item) => item.id === history.stage)?.label || history.stage, at: history.at } as AuditEvent)))} /></Panel>}

      {transitionOpen && nextStage && <TransitionDialog caseFile={caseFile} nextLabel={nextStage.label} onClose={() => setTransitionOpen(false)} onConfirm={async () => { await repo.advanceStage(caseFile.id, 'Des M.'); await customerAccountRepo.updateJourneyStage(caseFile.id, nextStage.id); await adminOperationsRepo.recordAudit({ actor: 'Des M.', action: 'Journey stage changed', subject: caseFile.reference, detail: `${STAGES[currentIndex].label} → ${nextStage.label}. Customer WhatsApp preview confirmed.`, tone: 'success' }); setTransitionOpen(false) }} />}
    </main>
  )
}

function CaseOverview({ caseFile, tasks, docs, assignments }: { caseFile: CaseFile; tasks: TaskItem[]; docs: DocRequest[]; assignments: { role: string; staffName: string }[] }) {
  return <div className="workspace-grid two-one">
    <div className="stack">
      <Panel eyebrow="Next actions" title="Case tasks"><TasksList tasks={tasks} /></Panel>
      <Panel eyebrow="Documents" title={`${docs.filter((item) => item.status === 'uploaded').length} awaiting review`}><div className="simple-records">{docs.map((doc) => <div key={doc.id}><div><strong>{doc.label}</strong><small>{doc.fileName || 'No file yet'}</small></div><StatusPill status={doc.status} /></div>)}</div></Panel>
    </div>
    <div className="stack">
      <Panel eyebrow="Assignments" title="Accountability"><div className="assignment-list">{assignments.map((item) => <div key={item.role}><span>{item.role}</span><strong>{item.staffName}</strong></div>)}</div></Panel>
      <Panel eyebrow="Customer promise" title="Visible next step"><p className="panel-copy">{STAGES.find((item) => item.id === caseFile.stage)?.blurb}</p><Link to="/portal/home" className="quiet-link">Open customer view →</Link></Panel>
      <Panel eyebrow="Internal note" title="Not customer-visible"><textarea className="internal-note" placeholder="Add an operational note…" /><button className="btn btn-quiet btn-sm">Save note</button></Panel>
    </div>
  </div>
}

function CaseDocuments({ caseId, docs }: { caseId: string; docs: DocRequest[] }) {
  return <Panel eyebrow="Sensitive workspace" title="Document review"><div className="simple-records document-admin-list">{docs.map((doc) => <div key={doc.id}><div><strong>{doc.label}</strong><small>{doc.fileName || 'Requested from customer'}</small></div><StatusPill status={doc.status} />{doc.status === 'uploaded' && <span className="inline-actions"><button className="btn btn-primary btn-sm" onClick={() => repo.reviewDoc(caseId, doc.id, true)}>Verify</button><button className="btn btn-quiet btn-sm" onClick={() => repo.reviewDoc(caseId, doc.id, false)}>Reject</button></span>}</div>)}</div><p className="legal-note">Preview and download actions require a reason and are written to the audit log.</p></Panel>
}

function CaseVehicles({ options }: { options: VehicleOption[] }) {
  return <Panel eyebrow="Published to customer" title="Vehicle options" action={<button className="btn btn-primary btn-sm">Add vehicle option</button>}><div className="admin-option-list">{options.map((option) => <article key={option.id}><img src={option.image} alt="" /><div><strong>{option.title}</strong><span>{option.dealership} · R{option.price.toLocaleString('en-ZA')}</span><small>{option.notes}</small></div>{option.selected ? <StatusPill status="selected">Customer choice</StatusPill> : <StatusPill status="delivered">Published</StatusPill>}<button className="btn btn-quiet btn-sm">Edit</button></article>)}</div></Panel>
}

function ProviderRecords({ title, items }: { title: string; items: { id: string; title: string; detail: string; status: string }[] }) {
  return <Panel eyebrow="Provider coordination" title={title} action={<button className="btn btn-primary btn-sm">Add record</button>}><div className="provider-records">{items.length ? items.map((item) => <article key={item.id}><div><strong>{item.title}</strong><small>{item.detail}</small></div><StatusPill status={item.status} /><button className="btn btn-quiet btn-sm">Update</button></article>) : <p className="panel-copy">No provider records for this case yet.</p>}</div></Panel>
}

function StaffMessages({ caseId, messages }: { caseId: string; messages: Message[] }) {
  const [reply, setReply] = useState('')
  const send = async () => { if (reply.trim()) { await repo.sendMessage(caseId, 'staff', 'Des M.', reply.trim()); setReply('') } }
  return <section className="conversation-card staff-conversation"><header><span className="avatar">ND</span><div><strong>Nomvula Dlamini</strong><small>Customer conversation · internal notes remain separate</small></div><StatusPill status="active">Portal active</StatusPill></header><div className="conversation-thread">{messages.map((message) => <article key={message.id} className={`conversation-message ${message.from}`}><span>{message.body}</span><small>{message.author}</small></article>)}</div><div className="conversation-composer"><input value={reply} onChange={(event) => setReply(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder="Reply as Des M.…" /><button className="btn btn-primary btn-sm" onClick={send}>Send</button></div></section>
}

function TransitionDialog({ caseFile, nextLabel, onClose, onConfirm }: { caseFile: CaseFile; nextLabel: string; onClose: () => void; onConfirm: () => void }) {
  return <div className="dialog-backdrop" role="presentation"><section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="transition-title"><span className="eyebrow-light">Validated transition</span><h2 id="transition-title">Move to {nextLabel}?</h2><p>The customer tracker and notification will update together.</p><div className="prerequisite-list"><span>✓ Required customer tasks checked</span><span>✓ Document status reviewed</span><span>✓ Customer-visible wording is safe</span></div><label>Internal note (optional)<textarea placeholder="Reason or handover context…" /></label><div className="notification-preview"><span>WhatsApp preview</span><p>Hi {caseFile.customer.split(' ')[0]}, your EzeeFin journey has moved to <strong>{nextLabel}</strong>. Sign in to see what happens next.</p></div><div className="form-actions"><button className="btn btn-primary" onClick={onConfirm}>Publish update</button><button className="btn btn-quiet" onClick={onClose}>Cancel</button></div></section></div>
}

function DocumentsQueue() {
  const docs = useRepository(() => repo.getDocs('c1'), repo.subscribe)
  return <main><PageIntro eyebrow="Operations queue" title="Documents" body="Uploads waiting for verification, rejected items, and stale vault records." /><CaseDocuments caseId="c1" docs={docs || []} /></main>
}

function AdminMessages() {
  const messages = useRepository(() => repo.getMessages('c1'), repo.subscribe)
  return <main><PageIntro eyebrow="Unified inbox" title="Customer messages" body="Prioritised by response time and customer journey impact." /><div className="workspace-grid two-one"><Panel eyebrow="Waiting for response" title="4 conversations"><div className="inbox-list"><button className="active"><span className="avatar">ND</span><div><strong>Nomvula Dlamini</strong><p>Thank you! The automatic looks perfect…</p><small>EZ-2431 · 18 min ago</small></div><b>1</b></button><button><span className="avatar">AK</span><div><strong>Ayesha Khan</strong><p>Should I upload the newer statement?</p><small>EZ-2433 · 1 hour ago</small></div></button></div></Panel><StaffMessages caseId="c1" messages={messages || []} /></div></main>
}

function CalendarPage() {
  const appointments = useRepository(() => adminOperationsRepo.getAppointments(), adminOperationsRepo.subscribe)
  return <main><PageIntro eyebrow="Calls, checks and visits" title="Calendar" body="Customer appointments and operational commitments across the team." action={<button className="btn btn-primary btn-sm">New appointment</button>} /><Panel title="Upcoming"><AppointmentList appointments={appointments || []} detailed /></Panel></main>
}

function AppointmentList({ appointments, detailed = false }: { appointments: Appointment[]; detailed?: boolean }) {
  return <div className="appointment-list">{appointments.map((item) => <article key={item.id}><time><strong>{new Date(item.at).getDate()}</strong><span>{new Date(item.at).toLocaleDateString('en-ZA', { month: 'short' })}</span></time><div><strong>{item.title}</strong><span>{item.customer}{detailed ? ` · ${item.owner}` : ''}</span></div><StatusPill status={item.status} /></article>)}</div>
}

function Reports() {
  return <main><PageIntro eyebrow="Operational health" title="Reports" body="Service performance, journey flow, and customer adoption—without employee surveillance." /><div className="metric-grid"><Metric label="First response" value="42 min" detail="Median · last 30 days" tone="red" /><Metric label="Lead conversion" value="38%" detail="+4% from prior period" /><Metric label="Document turnaround" value="6.2 h" detail="Upload to verification" /><Metric label="Portal adoption" value="64%" detail="Active customers signed in" tone="dark" /></div><div className="workspace-grid equal"><Panel eyebrow="Pipeline" title="Cases by stage"><div className="bar-report">{STAGES.slice(0, 6).map((stage, index) => <div key={stage.id}><span>{stage.label}</span><i><b style={{ width: `${85 - index * 10}%` }} /></i><strong>{12 - index}</strong></div>)}</div></Panel><Panel eyebrow="Workload" title="Active cases by owner"><div className="bar-report">{[['Thandi M.', 12], ['Lebo K.', 18], ['Sindi P.', 9], ['Des M.', 4]].map(([name, count]) => <div key={name}><span>{name}</span><i><b style={{ width: `${Number(count) * 5}%` }} /></i><strong>{count}</strong></div>)}</div></Panel></div></main>
}

function StaffPage() {
  const staff = useRepository<StaffUser[]>(() => adminOperationsRepo.getStaff(), adminOperationsRepo.subscribe)
  return <main><PageIntro eyebrow="Role-based access" title="Staff" body="Four fixed roles keep customer access clear and auditable." action={<button className="btn btn-primary btn-sm">Invite staff member</button>} /><div className="staff-grid">{(staff || []).map((person) => <article key={person.id}><span className="avatar large">{person.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><h3>{person.name}</h3><p>{person.role.replace('-', ' ')}</p><small>{person.activeCases} active cases</small></div><StatusPill status={person.status} /></article>)}</div></main>
}

function AuditPage() {
  const audit = useRepository(() => adminOperationsRepo.getAudit(), adminOperationsRepo.subscribe)
  return <main><PageIntro eyebrow="Append-only governance" title="Audit history" body="Sensitive reveals, exports, decisions, stage changes, and customer-visible actions." /><Panel title="Latest events"><ActivityTimeline events={audit || []} /></Panel></main>
}

function Settings() {
  return <main><PageIntro eyebrow="System administration" title="Settings" body="Templates, consent versions, integrations, and operational defaults." /><div className="workspace-grid equal">{[['Notification templates', 'WhatsApp, SMS and email wording with version history.'], ['Consent versions', 'Published customer consent language and effective dates.'], ['Journey rules', 'Stage targets, transition prerequisites and customer wording.'], ['Integrations', 'Delivery providers and secure connection status.']].map(([title, body]) => <Panel key={title} title={title}><p className="panel-copy">{body}</p><button className="btn btn-quiet btn-sm">Manage</button></Panel>)}</div></main>
}

function FilterBar({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className="filter-bar">{options.map((option) => <button key={option} className={value === option ? 'active' : ''} onClick={() => onChange(option)}>{option}</button>)}</div>
}

function Loading() {
  return <main><div className="loading-state"><span /><p>Loading operations workspace…</p></div></main>
}

export default function Admin() {
  return (
    <Routes>
      <Route index element={<AdminLogin />} />
      <Route path="work" element={<AdminShell><WorkDashboard /></AdminShell>} />
      <Route path="leads" element={<AdminShell><Leads /></AdminShell>} />
      <Route path="customers" element={<AdminShell><Customers /></AdminShell>} />
      <Route path="customer/:id" element={<AdminShell><CustomerView /></AdminShell>} />
      <Route path="profile-reviews" element={<AdminShell><ProfileReviews /></AdminShell>} />
      <Route path="cases" element={<AdminShell><Cases /></AdminShell>} />
      <Route path="case/:id/:tab?" element={<AdminShell><CaseWorkspace /></AdminShell>} />
      <Route path="documents" element={<AdminShell><DocumentsQueue /></AdminShell>} />
      <Route path="messages" element={<AdminShell><AdminMessages /></AdminShell>} />
      <Route path="calendar" element={<AdminShell><CalendarPage /></AdminShell>} />
      <Route path="reports" element={<AdminShell><Reports /></AdminShell>} />
      <Route path="staff" element={<AdminShell><StaffPage /></AdminShell>} />
      <Route path="audit" element={<AdminShell><AuditPage /></AdminShell>} />
      <Route path="settings" element={<AdminShell><Settings /></AdminShell>} />
      <Route path="notifications" element={<Navigate to="/admin/work" replace />} />
      <Route path="*" element={<Navigate to="/admin/work" replace />} />
    </Routes>
  )
}
