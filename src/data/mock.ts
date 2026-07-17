import type {
  CaseFile, DataRepo, DocRequest, EnquiryPayload, Lead, Message,
  Stage, TaskItem, VehicleOption,
} from './types'
import { STAGES } from './types'

// ---- All data below is synthetic. No real customer information. ----
const now = () => new Date().toISOString()
const day = (n: number) => new Date(Date.now() - n * 864e5).toISOString()
let seq = 100
const rid = () => `id-${seq++}`

const leads: Lead[] = [
  { id: 'l1', reference: 'EZ-2431', journey: 'find', name: 'Nomvula D.', phone: '060 000 0001', city: 'Pinetown', summary: 'Pre-owned hatchback, ~R3 500/m', createdAt: day(6), status: 'converted' },
  { id: 'l2', reference: 'EZ-2432', journey: 'find', name: 'Sipho M.', phone: '060 000 0002', city: 'Durban', summary: 'New bakkie, R450k budget', createdAt: day(5), status: 'qualified' },
  { id: 'l3', reference: 'EZ-2433', journey: 'found', name: 'Ayesha K.', phone: '060 000 0003', city: 'Umhlanga', summary: 'Found a 2022 Polo at a dealer, needs finance help', createdAt: day(4), status: 'qualified' },
  { id: 'l4', reference: 'EZ-2434', journey: 'fleet', name: 'Khanyile Logistics', phone: '060 000 0004', city: 'Pinetown', summary: '6 × 1-ton panel vans', createdAt: day(4), status: 'new' },
  { id: 'l5', reference: 'EZ-2435', journey: 'find', name: 'Thabo N.', phone: '060 000 0005', city: 'PMB', summary: 'First car, pre-owned, R2 800/m', createdAt: day(3), status: 'new' },
  { id: 'l6', reference: 'EZ-2436', journey: 'found', name: 'Lerato P.', phone: '060 000 0006', city: 'Durban North', summary: '2021 Kiger quoted at dealer, wants better structure', createdAt: day(3), status: 'new' },
  { id: 'l7', reference: 'EZ-2437', journey: 'find', name: 'Dev R.', phone: '060 000 0007', city: 'Westville', summary: 'SUV upgrade with trade-in', createdAt: day(2), status: 'new' },
  { id: 'l8', reference: 'EZ-2438', journey: 'fleet', name: 'Coastal Catering CC', phone: '060 000 0008', city: 'Ballito', summary: '3 refrigerated units, lease preferred', createdAt: day(2), status: 'new' },
  { id: 'l9', reference: 'EZ-2439', journey: 'find', name: 'Zanele G.', phone: '060 000 0009', city: 'Amanzimtoti', summary: 'Compact SUV, R5 000/m max', createdAt: day(1), status: 'new' },
  { id: 'l10', reference: 'EZ-2440', journey: 'found', name: 'Pieter V.', phone: '060 000 0010', city: 'Hillcrest', summary: 'Private-seller Fortuner, needs guidance', createdAt: day(1), status: 'new' },
  { id: 'l11', reference: 'EZ-2441', journey: 'find', name: 'Bongani S.', phone: '060 000 0011', city: 'Durban', summary: 'Pre-owned sedan, deposit saved', createdAt: day(0), status: 'new' },
  { id: 'l12', reference: 'EZ-2442', journey: 'find', name: 'Fatima E.', phone: '060 000 0012', city: 'Overport', summary: 'Automatic hatch for work commute', createdAt: day(0), status: 'new' },
]

const cases: CaseFile[] = [
  {
    id: 'c1', reference: 'EZ-2431', customer: 'Nomvula D.', phone: '060 000 0001',
    vehicleNeed: 'Pre-owned hatchback (Suzuki Swift or similar), automatic preferred',
    budget: 'R3 500/month · R15 000 deposit', stage: 'options', consultant: 'Consultant T.',
    createdAt: day(6),
    history: [
      { stage: 'received', at: day(6), by: 'system' },
      { stage: 'review', at: day(5), by: 'Consultant T.' },
      { stage: 'sourcing', at: day(4), by: 'Consultant T.' },
      { stage: 'options', at: day(1), by: 'Consultant T.' },
    ],
  },
  {
    id: 'c2', reference: 'EZ-2432', customer: 'Sipho M.', phone: '060 000 0002',
    vehicleNeed: 'New 1-ton bakkie, white, canopy required', budget: 'R450 000 cash + finance mix',
    stage: 'sourcing', consultant: 'Consultant K.', createdAt: day(5),
    history: [
      { stage: 'received', at: day(5), by: 'system' },
      { stage: 'review', at: day(4), by: 'Consultant K.' },
      { stage: 'sourcing', at: day(3), by: 'Consultant K.' },
    ],
  },
  {
    id: 'c3', reference: 'EZ-2433', customer: 'Ayesha K.', phone: '060 000 0003',
    vehicleNeed: '2022 VW Polo 1.0 TSI found at a Durban dealership', budget: 'R289 000 asking price',
    stage: 'finance', consultant: 'Consultant T.', createdAt: day(4),
    history: [
      { stage: 'received', at: day(4), by: 'system' },
      { stage: 'review', at: day(3), by: 'Consultant T.' },
      { stage: 'finance', at: day(1), by: 'Consultant T.' },
    ],
  },
]

const options: VehicleOption[] = [
  {
    id: 'o1', caseId: 'c1', title: 'Suzuki Swift 1.2 GL AMT', year: 2023, price: 219900,
    estInstalment: 3480, mileage: '18 400 km', dealership: 'Suzuki dealer, Durban',
    image: '/assets/vehicles/vehicle-delivery-swift-04.jpg',
    notes: 'Automatic, balance of service plan, one owner.',
  },
  {
    id: 'o2', caseId: 'c1', title: 'Suzuki Swift 1.2 GLX', year: 2022, price: 204500,
    estInstalment: 3260, mileage: '31 200 km', dealership: 'Suzuki dealer, Pinetown',
    image: '/assets/vehicles/vehicle-delivery-swift-01.jpg',
    notes: 'Manual, higher spec, full service history.',
  },
]

const docs: DocRequest[] = [
  { id: 'd1', caseId: 'c1', label: 'Certified copy of ID', status: 'verified' },
  { id: 'd2', caseId: 'c1', label: 'Latest payslip', status: 'requested' },
  { id: 'd3', caseId: 'c1', label: '3 months bank statements', status: 'requested' },
  { id: 'd4', caseId: 'c3', label: 'Certified copy of ID', status: 'verified' },
  { id: 'd5', caseId: 'c3', label: 'Latest payslip', status: 'uploaded', fileName: 'payslip-june.pdf' },
]

const tasks: TaskItem[] = [
  { id: 't1', caseId: 'c1', label: 'Upload your latest payslip', who: 'customer', done: false },
  { id: 't2', caseId: 'c1', label: 'Compare your two vehicle options and select one', who: 'customer', done: false },
  { id: 't3', caseId: 'c1', label: 'Confirm trade-in inspection slot', who: 'staff', done: true },
  { id: 't4', caseId: 'c2', label: 'Request quotes from 3 dealerships', who: 'staff', done: false },
]

const messages: Message[] = [
  { id: 'm1', caseId: 'c1', from: 'staff', author: 'Consultant T.', body: 'Hi Nomvula! Two Swift options are ready for you. Have a look and tell me which one feels right.', at: day(1) },
  { id: 'm2', caseId: 'c1', from: 'customer', author: 'Nomvula D.', body: 'Thank you! The automatic looks perfect. Uploading my payslip tonight.', at: day(0) },
]

// ---- tiny event bus so admin actions update the portal instantly ----
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((f) => f())

function nextStage(s: Stage): Stage {
  const order = STAGES.map((x) => x.id)
  const i = order.indexOf(s)
  return order[Math.min(i + 1, order.length - 1)] as Stage
}

export const mockRepo: DataRepo = {
  async submitEnquiry(p: EnquiryPayload) {
    const reference = `EZ-${2400 + Math.floor(Math.random() * 500)}`
    leads.unshift({
      id: rid(), reference, journey: p.journey,
      name: p.fields.name || 'New enquiry', phone: p.fields.phone || '',
      city: p.fields.city || p.fields.region || '',
      summary: p.fields.summary || p.fields.vehicle || p.fields.need || 'Website enquiry',
      createdAt: now(), status: 'new',
    })
    emit()
    return { reference }
  },
  async getLeads() { return [...leads] },
  async getCases() { return [...cases] },
  async getCase(id) { return cases.find((c) => c.id === id || c.reference === id) },
  async advanceStage(caseId, by) {
    const c = cases.find((x) => x.id === caseId)!
    c.stage = nextStage(c.stage)
    c.history.push({ stage: c.stage, at: now(), by })
    emit()
    return c
  },
  async getOptions(caseId) { return options.filter((o) => o.caseId === caseId) },
  async selectOption(caseId, optionId) {
    options.forEach((o) => { if (o.caseId === caseId) o.selected = o.id === optionId })
    const t = tasks.find((x) => x.caseId === caseId && x.label.startsWith('Compare'))
    if (t) t.done = true
    emit()
  },
  async getDocs(caseId) { return docs.filter((d) => d.caseId === caseId) },
  async uploadDoc(caseId, docId, fileName) {
    const d = docs.find((x) => x.id === docId)
    if (d) { d.status = 'uploaded'; d.fileName = fileName }
    const t = tasks.find((x) => x.caseId === caseId && x.label.includes('payslip'))
    if (t) t.done = true
    emit()
  },
  async reviewDoc(_caseId, docId, ok) {
    const d = docs.find((x) => x.id === docId)
    if (d) d.status = ok ? 'verified' : 'rejected'
    emit()
  },
  async getTasks(caseId) { return tasks.filter((t) => t.caseId === caseId) },
  async getMessages(caseId) { return messages.filter((m) => m.caseId === caseId) },
  async sendMessage(caseId, from, author, body) {
    messages.push({ id: rid(), caseId, from, author, body, at: now() })
    emit()
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) },
}
