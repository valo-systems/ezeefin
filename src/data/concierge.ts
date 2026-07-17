import type { Stage } from './types'

export type ProfileSectionKey = 'identity' | 'contact' | 'employment' | 'affordability' | 'banking' | 'vehicle'
export type ProfileSectionStatus = 'not-started' | 'draft' | 'ready' | 'pending' | 'verified' | 'attention' | 'stale'
export type VerificationState = 'unverified' | 'pending' | 'verified' | 'rejected'
export type StaffRole = 'consultant' | 'operations' | 'manager' | 'administrator'

export interface ProfileSection {
  key: ProfileSectionKey
  label: string
  description: string
  status: ProfileSectionStatus
  updatedAt: string
  fields: Record<string, string>
}

export interface CustomerProfile {
  id: string
  customerSince: string
  displayName: string
  initials: string
  mobile: string
  email: string
  mobileVerification: VerificationState
  emailVerification: VerificationState
  assignedConsultant: string
  sections: ProfileSection[]
  confirmedAt?: string
}

export interface ProfileDraft {
  customerId: string
  section: ProfileSectionKey
  fields: Record<string, string>
  savedAt: string
}

export interface ProfileSnapshot {
  id: string
  journeyId: string
  createdAt: string
  sectionValues: Record<ProfileSectionKey, Record<string, string>>
  consentVersion: string
}

export interface ProfileChangeRequest {
  id: string
  customerId: string
  customer: string
  section: ProfileSectionKey
  field: string
  previousValue: string
  proposedValue: string
  explanation: string
  status: 'pending' | 'approved' | 'rejected' | 'clarification'
  submittedAt: string
}

export interface DocumentVaultItem {
  id: string
  customerId: string
  type: string
  fileName: string
  status: 'requested' | 'uploaded' | 'verified' | 'rejected' | 'stale'
  uploadedAt?: string
  expiresAt?: string
  purpose: string
  usedBy: string[]
}

export interface CustomerJourneySummary {
  id: string
  reference: string
  title: string
  stage: Stage
  status: 'active' | 'completed' | 'closed'
  consultant: string
  startedAt: string
  completedAt?: string
  finalVehicle?: string
}

export interface ConsentRecord {
  id: string
  customerId: string
  label: string
  version: string
  granted: boolean
  recordedAt: string
  journeyReference?: string
}

export interface NotificationPreferences {
  primary: 'whatsapp' | 'sms' | 'email'
  journeyUpdates: { whatsapp: boolean; sms: boolean; email: boolean }
  documentRequests: { whatsapp: boolean; sms: boolean; email: boolean }
  messages: { whatsapp: boolean; sms: boolean; email: boolean }
  appointments: { whatsapp: boolean; sms: boolean; email: boolean }
  marketing: { whatsapp: boolean; sms: boolean; email: boolean }
}

export interface Assignment {
  id: string
  caseId: string
  role: 'owner' | 'documents' | 'finance' | 'cover'
  staffName: string
}

export interface InternalNote {
  id: string
  caseId: string
  author: string
  body: string
  createdAt: string
}

export interface Appointment {
  id: string
  caseId: string
  customer: string
  type: 'call' | 'document-check' | 'inspection' | 'dealership' | 'delivery'
  title: string
  at: string
  status: 'scheduled' | 'completed' | 'cancelled'
  owner: string
}

export interface Notification {
  id: string
  customer: string
  caseReference: string
  channel: 'whatsapp' | 'sms' | 'email'
  subject: string
  status: 'queued' | 'sent' | 'delivered' | 'failed'
  createdAt: string
}

export interface FinanceSubmission {
  id: string
  caseId: string
  provider: string
  status: 'preparing' | 'submitted' | 'information-required' | 'approved' | 'not-proceeding'
  owner: string
  updatedAt: string
  followUpAt?: string
}

export interface CoverageQuote {
  id: string
  caseId: string
  kind: 'insurance' | 'tracker'
  provider: string
  status: 'requested' | 'quoted' | 'selected' | 'expired'
  monthlyAmount?: number
  expiresAt?: string
  owner: string
}

export interface StaffUser {
  id: string
  name: string
  role: StaffRole
  status: 'active' | 'invited' | 'suspended'
  activeCases: number
}

export interface AuditEvent {
  id: string
  actor: string
  action: string
  subject: string
  detail: string
  at: string
  tone?: 'standard' | 'sensitive' | 'success'
}

export interface WorkQueue {
  id: string
  label: string
  count: number
  urgency: 'critical' | 'today' | 'normal'
  description: string
  route: string
}

export interface CustomerAccountRepo {
  getProfile(): Promise<CustomerProfile>
  updateSection(section: ProfileSectionKey, fields: Record<string, string>): Promise<void>
  confirmProfile(): Promise<void>
  getJourneys(): Promise<CustomerJourneySummary[]>
  updateJourneyStage(journeyId: string, stage: Stage): Promise<void>
  getVault(): Promise<DocumentVaultItem[]>
  getPreferences(): Promise<NotificationPreferences>
  updatePreferences(value: NotificationPreferences): Promise<void>
  getConsents(): Promise<ConsentRecord[]>
  subscribe(fn: () => void): () => void
}

export interface AdminOperationsRepo {
  getQueues(): Promise<WorkQueue[]>
  getCustomers(): Promise<CustomerProfile[]>
  getProfileChanges(): Promise<ProfileChangeRequest[]>
  reviewProfileChange(id: string, decision: 'approved' | 'rejected' | 'clarification'): Promise<void>
  getAssignments(caseId: string): Promise<Assignment[]>
  getAppointments(): Promise<Appointment[]>
  getNotifications(): Promise<Notification[]>
  getFinance(caseId: string): Promise<FinanceSubmission[]>
  getCoverage(caseId: string): Promise<CoverageQuote[]>
  getStaff(): Promise<StaffUser[]>
  getAudit(): Promise<AuditEvent[]>
  recordAudit(event: Omit<AuditEvent, 'id' | 'at'>): Promise<void>
  subscribe(fn: () => void): () => void
}

const day = (offset: number) => new Date(Date.now() + offset * 864e5).toISOString()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((fn) => fn())
const subscribe = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn) }

const profile: CustomerProfile = {
  id: 'customer-1',
  customerSince: '2022-04-18T09:00:00.000Z',
  displayName: 'Nomvula Dlamini',
  initials: 'ND',
  mobile: '060 ••• •001',
  email: 'nomvula.d@example.com',
  mobileVerification: 'verified',
  emailVerification: 'verified',
  assignedConsultant: 'Thandi M.',
  confirmedAt: day(-2),
  sections: [
    {
      key: 'identity', label: 'Identity', description: 'Legal identity and driver’s licence',
      status: 'verified', updatedAt: day(-3),
      fields: { 'Full legal name': 'Nomvula Dlamini', 'ID number': '••••••••••• 408', 'Date of birth': '14 August 1994', 'Residency': 'South African', 'Driver’s licence': 'Code B · expires Nov 2028' },
    },
    {
      key: 'contact', label: 'Contact & address', description: 'How we reach you and where you live',
      status: 'verified', updatedAt: day(-2),
      fields: { 'Mobile': '060 ••• •001', 'Email': 'nomvula.d@example.com', 'Residential area': 'Pinetown, KwaZulu-Natal', 'Preferred contact': 'WhatsApp' },
    },
    {
      key: 'employment', label: 'Employment & income', description: 'Current work and income details',
      status: 'pending', updatedAt: day(-1),
      fields: { 'Employment status': 'Full-time employed', 'Employer': 'Coastal Health Group', 'Occupation': 'Practice administrator', 'Start date': 'March 2021', 'Net monthly income': 'R24 500' },
    },
    {
      key: 'affordability', label: 'Affordability', description: 'Monthly commitments and contribution',
      status: 'draft', updatedAt: day(-1),
      fields: { 'Housing': 'R5 800 / month', 'Debt repayments': 'R1 950 / month', 'Dependants': '1', 'Deposit': 'R15 000', 'Trade-in': 'None' },
    },
    {
      key: 'banking', label: 'Banking summary', description: 'Account summary — no banking credentials',
      status: 'verified', updatedAt: day(-4),
      fields: { 'Account holder': 'Nomvula Dlamini', 'Bank': 'Example Bank', 'Account type': 'Cheque', 'Account number': '•••• 7362' },
    },
    {
      key: 'vehicle', label: 'Vehicle preferences', description: 'What you want us to source',
      status: 'verified', updatedAt: day(-2),
      fields: { 'Condition': 'Pre-owned', 'Body type': 'Hatchback', 'Transmission': 'Automatic preferred', 'Monthly target': 'Up to R3 500', 'Preferred makes': 'Suzuki, Toyota, Hyundai', 'Use': 'Daily commute' },
    },
  ],
}

const secondCustomer: CustomerProfile = {
  ...profile,
  id: 'customer-2', displayName: 'Ayesha Khan', initials: 'AK', mobile: '060 ••• •003',
  email: 'ayesha.k@example.com', assignedConsultant: 'Thandi M.', confirmedAt: undefined,
  sections: profile.sections.map((section, index) => ({ ...section, status: index < 3 ? 'verified' : 'draft' })),
}

const journeys: CustomerJourneySummary[] = [
  { id: 'c1', reference: 'EZ-2431', title: 'Automatic pre-owned hatchback', stage: 'options', status: 'active', consultant: 'Thandi M.', startedAt: day(-6) },
  { id: 'old-1', reference: 'EZ-1984', title: 'First vehicle purchase', stage: 'delivered', status: 'completed', consultant: 'Des M.', startedAt: '2022-04-18T09:00:00.000Z', completedAt: '2022-05-12T14:00:00.000Z', finalVehicle: '2020 Toyota Etios 1.5 Sprint' },
]

const vault: DocumentVaultItem[] = [
  { id: 'v1', customerId: 'customer-1', type: 'Identity', fileName: 'certified-id.pdf', status: 'verified', uploadedAt: day(-10), expiresAt: day(80), purpose: 'Identity verification', usedBy: ['EZ-2431'] },
  { id: 'v2', customerId: 'customer-1', type: 'Driver’s licence', fileName: 'drivers-licence.pdf', status: 'verified', uploadedAt: day(-10), expiresAt: day(420), purpose: 'Vehicle and insurance coordination', usedBy: ['EZ-2431'] },
  { id: 'v3', customerId: 'customer-1', type: 'Latest payslip', fileName: 'payslip-july.pdf', status: 'uploaded', uploadedAt: day(-1), purpose: 'Finance application assistance', usedBy: ['EZ-2431'] },
  { id: 'v4', customerId: 'customer-1', type: 'Bank statements', fileName: '', status: 'requested', purpose: 'Finance application assistance', usedBy: ['EZ-2431'] },
  { id: 'v5', customerId: 'customer-1', type: 'Proof of address', fileName: 'municipal-account.pdf', status: 'stale', uploadedAt: day(-120), expiresAt: day(-30), purpose: 'Address verification', usedBy: ['EZ-1984'] },
]

let preferences: NotificationPreferences = {
  primary: 'whatsapp',
  journeyUpdates: { whatsapp: true, sms: false, email: true },
  documentRequests: { whatsapp: true, sms: true, email: true },
  messages: { whatsapp: true, sms: false, email: false },
  appointments: { whatsapp: true, sms: true, email: true },
  marketing: { whatsapp: false, sms: false, email: false },
}

const consents: ConsentRecord[] = [
  { id: 'co1', customerId: 'customer-1', label: 'Vehicle sourcing and finance coordination', version: '2026.1', granted: true, recordedAt: day(-6), journeyReference: 'EZ-2431' },
  { id: 'co2', customerId: 'customer-1', label: 'Insurance and tracker quotation coordination', version: '2026.1', granted: true, recordedAt: day(-6), journeyReference: 'EZ-2431' },
  { id: 'co3', customerId: 'customer-1', label: 'Optional marketing communication', version: '2026.1', granted: false, recordedAt: day(-6) },
]

const profileChanges: ProfileChangeRequest[] = [
  { id: 'pc1', customerId: 'customer-1', customer: 'Nomvula Dlamini', section: 'employment', field: 'Net monthly income', previousValue: 'R22 800', proposedValue: 'R24 500', explanation: 'Annual salary adjustment reflected on my latest payslip.', status: 'pending', submittedAt: day(-1) },
  { id: 'pc2', customerId: 'customer-2', customer: 'Ayesha Khan', section: 'contact', field: 'Residential area', previousValue: 'Umhlanga', proposedValue: 'Durban North', explanation: 'Recently moved.', status: 'pending', submittedAt: day(-2) },
]

const assignments: Assignment[] = [
  { id: 'as1', caseId: 'c1', role: 'owner', staffName: 'Thandi M.' },
  { id: 'as2', caseId: 'c1', role: 'documents', staffName: 'Lebo K.' },
  { id: 'as3', caseId: 'c1', role: 'finance', staffName: 'Lebo K.' },
  { id: 'as4', caseId: 'c1', role: 'cover', staffName: 'Sindi P.' },
]

const appointments: Appointment[] = [
  { id: 'ap1', caseId: 'c1', customer: 'Nomvula Dlamini', type: 'call', title: 'Option comparison call', at: day(1), status: 'scheduled', owner: 'Thandi M.' },
  { id: 'ap2', caseId: 'c2', customer: 'Sipho Mthembu', type: 'dealership', title: 'Bakkie viewing', at: day(2), status: 'scheduled', owner: 'Consultant K.' },
  { id: 'ap3', caseId: 'c3', customer: 'Ayesha Khan', type: 'document-check', title: 'Finance document review', at: day(0), status: 'scheduled', owner: 'Lebo K.' },
]

const notifications: Notification[] = [
  { id: 'n1', customer: 'Nomvula Dlamini', caseReference: 'EZ-2431', channel: 'whatsapp', subject: 'Two vehicle options are ready', status: 'delivered', createdAt: day(-1) },
  { id: 'n2', customer: 'Ayesha Khan', caseReference: 'EZ-2433', channel: 'email', subject: 'Additional document needed', status: 'failed', createdAt: day(-1) },
  { id: 'n3', customer: 'Sipho Mthembu', caseReference: 'EZ-2432', channel: 'sms', subject: 'Your request is being reviewed', status: 'sent', createdAt: day(-2) },
]

const finance: FinanceSubmission[] = [
  { id: 'f1', caseId: 'c1', provider: 'Registered credit provider A', status: 'preparing', owner: 'Lebo K.', updatedAt: day(-1), followUpAt: day(2) },
  { id: 'f2', caseId: 'c3', provider: 'Registered credit provider B', status: 'information-required', owner: 'Lebo K.', updatedAt: day(-1), followUpAt: day(0) },
]

const coverage: CoverageQuote[] = [
  { id: 'q1', caseId: 'c1', kind: 'insurance', provider: 'Insurance provider A', status: 'requested', owner: 'Sindi P.' },
  { id: 'q2', caseId: 'c1', kind: 'tracker', provider: 'Tracker provider A', status: 'quoted', monthlyAmount: 249, expiresAt: day(12), owner: 'Sindi P.' },
]

const staff: StaffUser[] = [
  { id: 's1', name: 'Thandi M.', role: 'consultant', status: 'active', activeCases: 12 },
  { id: 's2', name: 'Lebo K.', role: 'operations', status: 'active', activeCases: 18 },
  { id: 's3', name: 'Sindi P.', role: 'operations', status: 'active', activeCases: 9 },
  { id: 's4', name: 'Des M.', role: 'manager', status: 'active', activeCases: 4 },
  { id: 's5', name: 'System Administrator', role: 'administrator', status: 'active', activeCases: 0 },
]

const audit: AuditEvent[] = [
  { id: 'a1', actor: 'Nomvula Dlamini', action: 'Profile submitted', subject: 'Employment & income', detail: 'Income change sent for verification.', at: day(-1), tone: 'sensitive' },
  { id: 'a2', actor: 'Thandi M.', action: 'Vehicle options published', subject: 'EZ-2431', detail: 'Two dealership options made visible to customer.', at: day(-1), tone: 'success' },
  { id: 'a3', actor: 'Lebo K.', action: 'Sensitive value revealed', subject: 'EZ-2433', detail: 'Reason: verify supplied payslip against profile.', at: day(-1), tone: 'sensitive' },
  { id: 'a4', actor: 'System', action: 'Notification failed', subject: 'EZ-2433', detail: 'Email delivery failed; queued for retry.', at: day(-1) },
]

const queues = (): WorkQueue[] => [
  { id: 'new', label: 'New & unassigned leads', count: 5, urgency: 'today', description: 'First response still needed', route: '/admin/leads' },
  { id: 'profile', label: 'Profile changes', count: profileChanges.filter((item) => item.status === 'pending').length, urgency: 'critical', description: 'Sensitive changes awaiting review', route: '/admin/profile-reviews' },
  { id: 'documents', label: 'Documents to review', count: 3, urgency: 'today', description: 'Uploaded and ready for verification', route: '/admin/documents' },
  { id: 'messages', label: 'Customer replies', count: 4, urgency: 'today', description: 'Waiting for a staff response', route: '/admin/messages' },
  { id: 'stalled', label: 'Stalled cases', count: 2, urgency: 'critical', description: 'Outside the expected stage time', route: '/admin/cases' },
  { id: 'options', label: 'Options to publish', count: 3, urgency: 'normal', description: 'Sourced vehicles awaiting review', route: '/admin/cases' },
  { id: 'followups', label: 'Provider follow-ups', count: 6, urgency: 'today', description: 'Finance, insurance and tracker actions', route: '/admin/cases' },
  { id: 'appointments', label: 'Today’s appointments', count: 3, urgency: 'normal', description: 'Calls, checks and visits', route: '/admin/calendar' },
  { id: 'failed', label: 'Failed notifications', count: notifications.filter((item) => item.status === 'failed').length, urgency: 'critical', description: 'Needs another channel or retry', route: '/admin/notifications' },
]

const conciergeStorageKey = 'ezeefin:concierge-platform:v1'

interface StoredConciergeState {
  profile: CustomerProfile
  profileChanges: ProfileChangeRequest[]
  journeys: CustomerJourneySummary[]
  preferences: NotificationPreferences
  audit: AuditEvent[]
}

function persistConciergeState() {
  if (typeof window === 'undefined') return
  const state: StoredConciergeState = {
    profile,
    profileChanges,
    journeys,
    preferences,
    audit,
  }
  window.localStorage.setItem(conciergeStorageKey, JSON.stringify(state))
}

function hydrateConciergeState() {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(conciergeStorageKey)
    if (!raw) return
    const stored = JSON.parse(raw) as StoredConciergeState
    if (stored.profile?.id === profile.id && Array.isArray(stored.profile.sections)) {
      Object.assign(profile, stored.profile)
    }
    if (Array.isArray(stored.profileChanges)) {
      profileChanges.splice(0, profileChanges.length, ...stored.profileChanges)
    }
    if (Array.isArray(stored.journeys)) {
      journeys.splice(0, journeys.length, ...stored.journeys)
    }
    if (stored.preferences) preferences = stored.preferences
    if (Array.isArray(stored.audit)) {
      audit.splice(0, audit.length, ...stored.audit)
    }
  } catch {
    window.localStorage.removeItem(conciergeStorageKey)
  }
}

hydrateConciergeState()

export const customerAccountRepo: CustomerAccountRepo = {
  async getProfile() { return { ...profile, sections: profile.sections.map((section) => ({ ...section, fields: { ...section.fields } })) } },
  async updateSection(section, fields) {
    const target = profile.sections.find((item) => item.key === section)
    if (target) { target.fields = { ...target.fields, ...fields }; target.status = target.status === 'verified' ? 'pending' : 'ready'; target.updatedAt = new Date().toISOString() }
    persistConciergeState()
    emit()
  },
  async confirmProfile() {
    profile.confirmedAt = new Date().toISOString()
    profile.sections.forEach((section) => { if (section.status === 'ready') section.status = 'pending' })
    persistConciergeState()
    emit()
  },
  async getJourneys() { return journeys.map((item) => ({ ...item })) },
  async updateJourneyStage(journeyId, stage) {
    const journey = journeys.find((item) => item.id === journeyId)
    if (journey) journey.stage = stage
    persistConciergeState()
    emit()
  },
  async getVault() { return vault.map((item) => ({ ...item, usedBy: [...item.usedBy] })) },
  async getPreferences() { return structuredClone(preferences) },
  async updatePreferences(value) { preferences = structuredClone(value); persistConciergeState(); emit() },
  async getConsents() { return consents.map((item) => ({ ...item })) },
  subscribe,
}

export const adminOperationsRepo: AdminOperationsRepo = {
  async getQueues() { return queues() },
  async getCustomers() { return [await customerAccountRepo.getProfile(), structuredClone(secondCustomer)] },
  async getProfileChanges() { return profileChanges.map((item) => ({ ...item })) },
  async reviewProfileChange(id, decision) {
    const change = profileChanges.find((item) => item.id === id)
    if (!change) return
    change.status = decision
    if (change.customerId === profile.id) {
      const section = profile.sections.find((item) => item.key === change.section)
      if (section) section.status = decision === 'approved' ? 'verified' : decision === 'rejected' ? 'attention' : 'pending'
    }
    audit.unshift({
      id: `audit-${Date.now()}`, actor: 'Lebo K.', action: `Profile change ${decision}`,
      subject: change.customer, detail: `${change.field}: ${change.proposedValue}`, at: new Date().toISOString(),
      tone: decision === 'approved' ? 'success' : 'sensitive',
    })
    persistConciergeState()
    emit()
  },
  async getAssignments(caseId) { return assignments.filter((item) => item.caseId === caseId).map((item) => ({ ...item })) },
  async getAppointments() { return appointments.map((item) => ({ ...item })) },
  async getNotifications() { return notifications.map((item) => ({ ...item })) },
  async getFinance(caseId) { return finance.filter((item) => item.caseId === caseId).map((item) => ({ ...item })) },
  async getCoverage(caseId) { return coverage.filter((item) => item.caseId === caseId).map((item) => ({ ...item })) },
  async getStaff() { return staff.map((item) => ({ ...item })) },
  async getAudit() { return audit.map((item) => ({ ...item })) },
  async recordAudit(event) {
    audit.unshift({ ...event, id: `audit-${Date.now()}`, at: new Date().toISOString() })
    persistConciergeState()
    emit()
  },
  subscribe,
}
