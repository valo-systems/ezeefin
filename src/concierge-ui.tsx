import { ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { STAGES } from './data'
import type {
  AuditEvent, CustomerProfile, DocumentVaultItem, ProfileSectionStatus,
  Stage, TaskItem,
} from './data'

export function useRepository<T>(load: () => Promise<T>, subscribe: (fn: () => void) => () => void, deps: unknown[] = []) {
  const [value, setValue] = useState<T>()
  useEffect(() => {
    let active = true
    const refresh = () => load().then((next) => { if (active) setValue(next) })
    refresh()
    const unsubscribe = subscribe(refresh)
    return () => { active = false; unsubscribe() }
  }, deps)
  return value
}

const statusLabels: Record<ProfileSectionStatus, string> = {
  'not-started': 'Not started',
  draft: 'Draft',
  ready: 'Ready to confirm',
  pending: 'Pending review',
  verified: 'Verified',
  attention: 'Needs attention',
  stale: 'Stale',
}

export function StatusPill({ status, children }: { status: string; children?: ReactNode }) {
  const tone =
    ['verified', 'approved', 'delivered', 'completed', 'active', 'selected'].includes(status) ? 'positive' :
      ['pending', 'uploaded', 'ready', 'quoted', 'sent', 'scheduled', 'today'].includes(status) ? 'pending' :
        ['rejected', 'failed', 'attention', 'stale', 'critical', 'not-proceeding'].includes(status) ? 'danger' : 'neutral'
  return <span className={`status-pill ${tone}`}>{children ?? statusLabels[status as ProfileSectionStatus] ?? status.replace(/-/g, ' ')}</span>
}

export function Panel({ eyebrow, title, action, children, className = '' }: {
  eyebrow?: string; title: ReactNode; action?: ReactNode; children: ReactNode; className?: string
}) {
  return (
    <section className={`concierge-panel ${className}`}>
      <header className="panel-heading">
        <div>{eyebrow && <span>{eyebrow}</span>}<h2>{title}</h2></div>
        {action}
      </header>
      {children}
    </section>
  )
}

export function Metric({ label, value, detail, tone = 'standard' }: {
  label: string; value: ReactNode; detail?: string; tone?: 'standard' | 'red' | 'dark'
}) {
  return <div className={`metric-card ${tone}`}><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>
}

export function Readiness({ profile, compact = false }: { profile: CustomerProfile; compact?: boolean }) {
  const ready = profile.sections.filter((section) => ['verified', 'pending', 'ready'].includes(section.status)).length
  const percent = Math.round((ready / profile.sections.length) * 100)
  return (
    <div className={`readiness ${compact ? 'compact' : ''}`}>
      <div className="readiness-ring" style={{ '--progress': `${percent * 3.6}deg` } as React.CSSProperties}>
        <span>{ready}<small>/{profile.sections.length}</small></span>
      </div>
      <div><strong>Finance Passport</strong><span>{ready} of {profile.sections.length} sections ready</span></div>
    </div>
  )
}

export function JourneyTimeline({ stage, compact = false }: { stage: Stage; compact?: boolean }) {
  const current = STAGES.findIndex((item) => item.id === stage)
  return (
    <ol className={`concierge-timeline ${compact ? 'compact' : ''}`}>
      {STAGES.map((item, index) => (
        <li key={item.id} className={index < current ? 'complete' : index === current ? 'current' : 'upcoming'}>
          <span>{index < current ? '✓' : index + 1}</span>
          <div><strong>{item.label}</strong>{(!compact || index === current) && <small>{item.blurb}</small>}</div>
        </li>
      ))}
    </ol>
  )
}

export function TasksList({ tasks }: { tasks: TaskItem[] }) {
  return <div className="domain-list">{tasks.map((task) => (
    <div className="domain-row" key={task.id}>
      <span className={`task-check ${task.done ? 'done' : ''}`}>{task.done ? '✓' : ''}</span>
      <div><strong>{task.label}</strong><small>{task.who === 'customer' ? 'Customer action' : 'EzeeFin action'}</small></div>
      <StatusPill status={task.done ? 'completed' : task.who === 'customer' ? 'attention' : 'pending'}>{task.done ? 'Done' : task.who === 'customer' ? 'You' : 'EzeeFin'}</StatusPill>
    </div>
  ))}</div>
}

export function VaultRow({ item, action }: { item: DocumentVaultItem; action?: ReactNode }) {
  const freshness = item.expiresAt ? new Date(item.expiresAt) < new Date() ? 'Expired' : `Fresh until ${new Date(item.expiresAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No expiry recorded'
  return (
    <article className="vault-row">
      <span className="file-mark" aria-hidden>↗</span>
      <div><strong>{item.type}</strong><span>{item.fileName || 'Document requested'}</span><small>{item.purpose} · {freshness}</small></div>
      <StatusPill status={item.status} />
      {action}
    </article>
  )
}

export function ActivityTimeline({ events }: { events: AuditEvent[] }) {
  return <div className="activity-list">{events.map((event) => (
    <article key={event.id}>
      <span className={`activity-dot ${event.tone || 'standard'}`} />
      <div><strong>{event.action}</strong><p>{event.detail}</p><small>{event.actor} · {new Date(event.at).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></div>
    </article>
  ))}</div>
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="concierge-empty"><span aria-hidden>✓</span><h3>{title}</h3><p>{body}</p>{action}</div>
}

export function PageIntro({ eyebrow, title, body, action }: {
  eyebrow?: string; title: ReactNode; body?: ReactNode; action?: ReactNode
}) {
  return <header className="portal-page-intro"><div>{eyebrow && <span>{eyebrow}</span>}<h1>{title}</h1>{body && <p>{body}</p>}</div>{action}</header>
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to} className="back-link">← {children}</Link>
}
