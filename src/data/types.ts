export type Stage =
  | 'received' | 'review' | 'sourcing' | 'options' | 'finance'
  | 'insurance' | 'delivery-prep' | 'delivered' | 'closed'

export const STAGES: { id: Stage; label: string; blurb: string }[] = [
  { id: 'received', label: 'Received', blurb: 'We have your request and a consultant has been assigned.' },
  { id: 'review', label: 'Under review', blurb: 'Your consultant is confirming the details with you.' },
  { id: 'sourcing', label: 'Sourcing options', blurb: 'We are engaging dealerships to find matching vehicles.' },
  { id: 'options', label: 'Options ready', blurb: 'Vehicle options are ready for you to compare.' },
  { id: 'finance', label: 'Finance in progress', blurb: 'Your application is with registered credit providers.' },
  { id: 'insurance', label: 'Insurance & tracker', blurb: 'We are coordinating your insurance and tracker quotations.' },
  { id: 'delivery-prep', label: 'Preparing delivery', blurb: 'Paperwork and delivery arrangements are being finalised.' },
  { id: 'delivered', label: 'Delivered', blurb: 'Enjoy your new vehicle!' },
]

export interface Lead {
  id: string
  reference: string
  journey: 'find' | 'found' | 'fleet'
  name: string
  phone: string
  city: string
  summary: string
  createdAt: string
  status: 'new' | 'qualified' | 'converted' | 'closed'
}

export interface VehicleOption {
  id: string
  caseId: string
  title: string
  year: number
  price: number
  estInstalment: number
  mileage: string
  dealership: string
  image: string
  notes: string
  selected?: boolean
}

export interface DocRequest {
  id: string
  caseId: string
  label: string
  status: 'requested' | 'uploaded' | 'verified' | 'rejected'
  fileName?: string
}

export interface TaskItem {
  id: string
  caseId: string
  label: string
  who: 'customer' | 'staff'
  done: boolean
}

export interface Message {
  id: string
  caseId: string
  from: 'customer' | 'staff'
  author: string
  body: string
  at: string
}

export interface CaseFile {
  id: string
  reference: string
  customer: string
  phone: string
  vehicleNeed: string
  budget: string
  stage: Stage
  consultant: string
  createdAt: string
  history: { stage: Stage; at: string; by: string }[]
}

export interface EnquiryPayload {
  journey: 'find' | 'found' | 'fleet'
  fields: Record<string, string>
}

export interface DataRepo {
  submitEnquiry(p: EnquiryPayload): Promise<{ reference: string }>
  getLeads(): Promise<Lead[]>
  getCase(id: string): Promise<CaseFile | undefined>
  getCases(): Promise<CaseFile[]>
  advanceStage(caseId: string, by: string): Promise<CaseFile>
  getOptions(caseId: string): Promise<VehicleOption[]>
  selectOption(caseId: string, optionId: string): Promise<void>
  getDocs(caseId: string): Promise<DocRequest[]>
  uploadDoc(caseId: string, docId: string, fileName: string): Promise<void>
  reviewDoc(caseId: string, docId: string, ok: boolean): Promise<void>
  getTasks(caseId: string): Promise<TaskItem[]>
  getMessages(caseId: string): Promise<Message[]>
  sendMessage(caseId: string, from: 'customer' | 'staff', author: string, body: string): Promise<void>
  subscribe(fn: () => void): () => void
}
