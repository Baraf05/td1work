'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SITE_CONFIG } from '@/lib/vehicles'

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    const duration = 1600
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      el.textContent = `${Math.round(ease * target)}${suffix}`
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, suffix])

  return <span ref={ref}>{0}{suffix}</span>
}

type Counter =
  | { target: number; suffix: string; label: string }
  | { label: string; display: string }

const counters: Counter[] = [
  { target: SITE_CONFIG.stats.transfers, suffix: SITE_CONFIG.stats.transfersSuffix, label: SITE_CONFIG.stats.transfersLabel },
  { label: SITE_CONFIG.stats.availabilityLabel, display: SITE_CONFIG.stats.availability },
  { target: SITE_CONFIG.stats.incidents, suffix: '', label: SITE_CONFIG.stats.incidentsLabel },
  { label: SITE_CONFIG.stats.languagesLabel, display: SITE_CONFIG.stats.languages },
]

export default function StatsBand() {
  return (
    <section
      className="py-20 px-6 md:px-14"
      style={{
        background: '#0A0A0B',
        borderTop: '0.5px solid rgba(201,169,110,0.08)',
        borderBottom: '0.5px solid rgba(201,169,110,0.08)',
      }}
      aria-label="Service highlights"
    >
      <div className="max-w-6xl mx-auto">

        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-16" style={{ background: 'rgba(201,169,110,0.04)' }}>
          {counters.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="flex flex-col items-center justify-center text-center py-10 px-4 gap-2"
              style={{ background: '#0A0A0B' }}
            >
              <p className="font-serif font-normal leading-none" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', color: '#F5F2EE' }}>
                {'target' in s
                  ? <AnimatedNumber target={s.target} suffix={s.suffix} />
                  : s.display}
              </p>
              <p className="font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', textTransform: 'uppercase' }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Case studies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-12" style={{ background: 'rgba(201,169,110,0.04)' }}>
          {SITE_CONFIG.caseStudies.map((c, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8"
              style={{ background: '#0A0A0B' }}
            >
              <p className="font-serif font-normal italic leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#A8A49E' }}>
                &ldquo;{c.text}&rdquo;
              </p>
            </motion.blockquote>
          ))}
        </div>

        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
          aria-label="Credentials"
        >
          {SITE_CONFIG.badges.map(badge => (
            <span
              key={badge}
              className="font-sans"
              style={{
                fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#A8A49E', padding: '7px 16px',
                border: '0.5px solid rgba(201,169,110,0.18)',
              }}
            >
              {badge}
            </span>
          ))}
          {SITE_CONFIG.licenceNumber && (
            <span className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#5A5855', padding: '7px 16px', border: '0.5px solid rgba(201,169,110,0.08)' }}>
              RTA Licence #{SITE_CONFIG.licenceNumber}
            </span>
          )}
        </motion.div>
      </div>
    </section>
  )
}
