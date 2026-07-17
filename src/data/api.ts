import type { DataRepo, EnquiryPayload } from './types'

const j = async (url: string, init?: RequestInit) => {
  const r = await fetch(`/api${url}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...init,
  })
  if (!r.ok) throw new Error(`API ${r.status}`)
  return r.json()
}

/** PHP/MySQL-backed implementation of the same contract used by mock mode.
 *  Endpoints match api/index.php. Auth flows (staff login, customer OTP)
 *  are handled by the PHP session layer. */
export const apiRepo: DataRepo = {
  submitEnquiry: (p: EnquiryPayload) =>
    j(p.journey === 'fleet' ? '/fleet-enquiries' : p.journey === 'find' ? '/vehicle-requests' : '/enquiries', {
      method: 'POST', body: JSON.stringify(p.fields),
    }),
  getLeads: () => j('/admin/leads'),
  getCases: () => j('/admin/applications'),
  getCase: (id) => j(`/applications/${id}`),
  advanceStage: (id) => j(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ action: 'advance' }) }),
  getOptions: (id) => j(`/applications/${id}/vehicle-options`),
  selectOption: (id, optionId) => j(`/applications/${id}/vehicle-options`, { method: 'PATCH', body: JSON.stringify({ optionId }) }),
  getDocs: (id) => j(`/applications/${id}/documents`),
  uploadDoc: (id, docId, fileName) => j(`/applications/${id}/documents`, { method: 'POST', body: JSON.stringify({ docId, fileName }) }),
  reviewDoc: (id, docId, ok) => j(`/applications/${id}/documents`, { method: 'PATCH', body: JSON.stringify({ docId, ok }) }),
  getTasks: (id) => j(`/applications/${id}/tasks`),
  getMessages: (id) => j(`/applications/${id}/messages`),
  sendMessage: (id, from, author, body) => j(`/applications/${id}/messages`, { method: 'POST', body: JSON.stringify({ from, author, body }) }),
  subscribe: () => () => {},
}
