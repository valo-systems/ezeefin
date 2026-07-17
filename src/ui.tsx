import { ReactNode, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { DATA_MODE } from './data'

export function DemoRibbon() {
  if (DATA_MODE !== 'mock') return null
  return (
    <div className="demo-ribbon" role="note">
      <strong>DEMONSTRATION</strong> · Sample data only. No real customer information is stored or sent.
    </div>
  )
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="EzeeFin home">
      <span className="wordmark"><span className="e">e</span><span>zeefin</span></span>
      <span className="strap">any car · any bank · any place</span>
    </Link>
  )
}

const NAV = [
  ['/how-it-works', 'How it works'],
  ['/fleet', 'Fleet'],
  ['/about', 'About'],
  ['/faqs', 'FAQs'],
  ['/contact', 'Contact'],
] as const

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const loc = useLocation()
  useEffect(() => {
    setOpen(false)
    setServicesOpen(false)
    setMoreOpen(false)
    setMobileServicesOpen(false)
  }, [loc.pathname])
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) setServicesOpen(false)
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 64)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        requestAnimationFrame(() => menuButtonRef.current?.focus())
        return
      }
      if (event.key !== 'Tab' || !drawerRef.current) return
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])
  const serviceActive = loc.pathname.startsWith('/services/')
  const moreActive = ['/faqs', '/contact', '/portal'].some((path) => loc.pathname.startsWith(path))
  const closeDrawer = () => {
    setOpen(false)
    requestAnimationFrame(() => menuButtonRef.current?.focus())
  }
  return (
    <header className={`site-header ${loc.pathname === '/' ? 'home-header' : ''} ${scrolled ? 'scrolled' : ''} ${open ? 'menu-open' : ''}`}>
      <div className="container bar">
        <Logo />
        <nav className="main" aria-label="Main">
          <NavLink to="/how-it-works" className={({ isActive }) => (isActive ? 'active' : '')}>How it works</NavLink>
          <div className="nav-disclosure" ref={servicesRef}
            onKeyDown={(event) => { if (event.key === 'Escape') setServicesOpen(false) }}>
            <button className={serviceActive ? 'active' : ''} aria-expanded={servicesOpen}
              aria-controls="desktop-services-menu"
              onClick={() => { setServicesOpen((value) => !value); setMoreOpen(false) }}>
              Services <span className="nav-chevron" aria-hidden>⌄</span>
            </button>
            {servicesOpen && (
              <div className="service-menu" id="desktop-services-menu">
                <span className="menu-kicker">Concierge services</span>
                <Link to="/services/finance-assistance">
                  <i aria-hidden>01</i>
                  <span><strong>Vehicle finance assistance</strong><small>Applications coordinated with registered credit providers.</small></span>
                  <b aria-hidden>→</b>
                </Link>
                <Link to="/services/insurance-and-tracker">
                  <i aria-hidden>02</i>
                  <span><strong>Insurance &amp; tracker</strong><small>Comparable quotations coordinated before delivery.</small></span>
                  <b aria-hidden>→</b>
                </Link>
              </div>
            )}
          </div>
          <NavLink to="/fleet" className={({ isActive }) => (isActive ? 'active' : '')}>Fleet</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
          <NavLink to="/faqs" className={({ isActive }) => `wide-nav-only ${isActive ? 'active' : ''}`}>FAQs</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `wide-nav-only ${isActive ? 'active' : ''}`}>Contact</NavLink>
          <div className="nav-disclosure compact-more" ref={moreRef}
            onKeyDown={(event) => { if (event.key === 'Escape') setMoreOpen(false) }}>
            <button className={moreActive ? 'active' : ''} aria-expanded={moreOpen}
              aria-controls="desktop-more-menu"
              onClick={() => { setMoreOpen((value) => !value); setServicesOpen(false) }}>
              More <span className="nav-chevron" aria-hidden>⌄</span>
            </button>
            {moreOpen && (
              <div className="more-menu" id="desktop-more-menu">
                <NavLink to="/faqs">FAQs <span aria-hidden>→</span></NavLink>
                <NavLink to="/contact">Contact <span aria-hidden>→</span></NavLink>
                <NavLink to="/portal">Customer portal <span aria-hidden>→</span></NavLink>
              </div>
            )}
          </div>
          <Link to="/portal" className="portal-link wide-nav-only">Portal</Link>
          <Link to="/find-me-a-vehicle" className="btn btn-primary btn-sm btn-arrow nav-cta">Start your request</Link>
        </nav>
        <button ref={menuButtonRef} className="hamburger" aria-expanded={open}
          aria-controls="mobile-navigation" aria-label="Open menu" onClick={() => setOpen(true)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div ref={drawerRef} className="mobile-menu open" id="mobile-navigation"
          role="dialog" aria-modal="true" aria-label="Main navigation">
          <div className="mobile-menu-head">
            <Logo />
            <button ref={closeButtonRef} className="menu-close" aria-label="Close menu" onClick={closeDrawer}>
              <span aria-hidden>×</span>
            </button>
          </div>
          <nav className="mobile-menu-grid" aria-label="Mobile">
            <NavLink to="/how-it-works">How it works <span aria-hidden>→</span></NavLink>
            <div className="mobile-services">
              <button aria-expanded={mobileServicesOpen} aria-controls="mobile-services-menu"
                onClick={() => setMobileServicesOpen((value) => !value)}>
                Services <span className="nav-chevron" aria-hidden>⌄</span>
              </button>
              {mobileServicesOpen && (
                <div className="mobile-services-list" id="mobile-services-menu">
                  <NavLink to="/services/finance-assistance">
                    <small>01</small><span>Vehicle finance assistance</span>
                  </NavLink>
                  <NavLink to="/services/insurance-and-tracker">
                    <small>02</small><span>Insurance &amp; tracker</span>
                  </NavLink>
                </div>
              )}
            </div>
            {NAV.slice(1).map(([to, label]) => (
              <NavLink key={to} to={to}>{label} <span aria-hidden>→</span></NavLink>
            ))}
            <NavLink to="/portal" className="mobile-portal">Customer portal <span aria-hidden>→</span></NavLink>
          </nav>
          <div className="mobile-menu-footer">
            <div>
              <span>Prefer to speak to someone?</span>
              <a href="tel:0861666669">0861 666 669</a>
            </div>
            <Link to="/find-me-a-vehicle" className="btn btn-primary btn-arrow">Start your request</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export function PageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} — EzeeFin`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [title, description])
  return null
}

export function EditorialHero(props: {
  eyebrow: string
  title: ReactNode
  lede: ReactNode
  image?: string
  imageAlt?: string
  children?: ReactNode
  tone?: 'light' | 'dark'
}) {
  return (
    <section className={`editorial-hero ${props.tone === 'dark' ? 'dark' : ''}`}>
      <div className="container editorial-hero-grid">
        <div className="editorial-copy">
          <span className="eyebrow-light">{props.eyebrow}</span>
          <h1>{props.title}</h1>
          <p className="lede">{props.lede}</p>
          {props.children}
        </div>
        {props.image && (
          <figure className="editorial-media">
            <img src={props.image} alt={props.imageAlt || ''} />
            <figcaption>Personal guidance. Clear choices. One accountable team.</figcaption>
          </figure>
        )}
      </div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, body, align = 'left' }: {
  eyebrow: string; title: ReactNode; body?: ReactNode; align?: 'left' | 'center'
}) {
  return (
    <div className={`section-heading ${align === 'center' ? 'center' : ''}`}>
      <span className="eyebrow-light">{eyebrow}</span>
      <h2>{title}</h2>
      {body && <p className="lede">{body}</p>}
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="container cols">
        <div className="footer-brand">
          <Logo />
          <p>
            Vehicle sourcing, vehicle-finance application assistance, and insurance &amp; tracker
            quotation coordination. EzeeFin is not a bank, lender, credit provider, dealership or insurer;
            finance is provided by registered credit providers subject to their approval.
          </p>
          <p className="small">Pinetown, KwaZulu-Natal<br />info@ezeefin.co.za · 0861 666 669</p>
        </div>
        <div>
          <p style={{ color: '#fff', fontWeight: 600 }}>Start</p>
          <p><Link to="/find-me-a-vehicle">Find me a vehicle</Link></p>
          <p><Link to="/found-a-vehicle">I already found a vehicle</Link></p>
          <p><Link to="/fleet">Fleet assistance</Link></p>
          <p><Link to="/portal">Customer portal</Link></p>
        </div>
        <div>
          <p style={{ color: '#fff', fontWeight: 600 }}>Legal</p>
          <p><Link to="/privacy">Privacy policy (POPIA)</Link></p>
          <p><Link to="/terms">Terms of service</Link></p>
          <p><Link to="/contact">Complaints &amp; support</Link></p>
          <p className="small" style={{ marginTop: 16 }}>© {new Date().getFullYear()} EzeeFin</p>
        </div>
      </div>
    </footer>
  )
}

export function Field(props: {
  label: string; children: ReactNode; error?: string; hint?: string
}) {
  return (
    <div className="field">
      <label>{props.label}</label>
      {props.children}
      {props.error && <div className="err" role="alert">{props.error}</div>}
      {!props.error && props.hint && <div className="hint">{props.hint}</div>}
    </div>
  )
}

export function Choices(props: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="choice-row" role="radiogroup">
      {props.options.map((o) => (
        <button type="button" key={o} role="radio" aria-checked={props.value === o}
          className={`choice ${props.value === o ? 'sel' : ''}`}
          onClick={() => props.onChange(o)}>{o}</button>
      ))}
    </div>
  )
}

export function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="progress-dots" aria-label={`Step ${step + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => <span key={i} className={i <= step ? 'on' : ''} />)}
    </div>
  )
}

export function Chip({ tone, children }: { tone: 'grey' | 'red' | 'green' | 'amber'; children: ReactNode }) {
  return <span className={`chip ${tone}`}>{children}</span>
}
