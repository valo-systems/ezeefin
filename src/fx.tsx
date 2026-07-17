import { ReactNode, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

/** Fade-and-rise on scroll into view. */
export function Reveal({ children, delay = 0, y = 26, className }: {
  children: ReactNode; delay?: number; y?: number; className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Headline that reveals word by word. `accent` words render in EzeeFin red italic. */
export function Words({ text, accent = [], as: Tag = 'h1', className }: {
  text: string; accent?: string[]; as?: 'h1' | 'h2'; className?: string
}) {
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            className={accent.includes(w.replace(/[.,]/g, '')) ? 'accent-word' : undefined}
            initial={false}
            animate={{ y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 * i, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Counts up when scrolled into view. */
export function CountUp({ to, suffix = '', duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) { setV(to); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - t0) / (duration * 1000), 1)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduce])
  return <span ref={ref}>{v}{suffix}</span>
}

/** Infinite horizontal marquee (pauses for reduced motion). */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.map((x, i) => <span key={i} className="marquee-item">{x}<i className="dot" /></span>)}
      </div>
    </div>
  )
}

/** Gentle hover-lift wrapper for cards. */
export function Lift({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25, ease: EASE } }}>
      {children}
    </motion.div>
  )
}
