'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SITE_CONFIG } from '@/lib/vehicles'

const valueProps = [
  {
    n: '01',
    title: 'Direct account access',
    desc: 'Priority booking line, no public form friction, a dedicated coordinator who knows your property.',
  },
  {
    n: '02',
    title: 'Consolidated monthly billing',
    desc: 'One invoice, full trip history, no per-ride payment friction for you or your guests.',
  },
  {
    n: '03',
    title: 'SLA-backed reliability',
    desc: 'Guaranteed response times, real-time vehicle availability, backup vehicle on standby.',
  },
]

const fleetSignals = [
  { value: SITE_CONFIG.fleetScale.count, label: 'Vehicles in fleet' },
  { value: SITE_CONFIG.fleetScale.sameDay, label: 'Scale on demand' },
  { value: SITE_CONFIG.fleetScale.coverage, label: 'Coverage' },
]

export default function Partners() {
  const reduce = useReducedMotion()

  const scrollToPartnerForm = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('partners-access')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="partners"
      className="py-24 px-6 md:px-14"
      style={{ background: '#0A0A0B', borderTop: '0.5px solid rgba(201,169,110,0.06)' }}
      aria-labelledby="partners-title"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-6"
          >
            <span className="w-6 h-px bg-[#C9A96E] opacity-50 shrink-0" aria-hidden="true" />
            Partners
          </motion.p>

          <motion.h2
            id="partners-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-normal leading-tight mb-6"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F5F2EE' }}
          >
            The preferred transport partner for Dubai&rsquo;s{' '}
            <em className="not-italic" style={{ color: '#C9A96E' }}>leading hotels</em>{' '}
            and airport concierge teams.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-sans leading-relaxed"
            style={{ fontSize: '15px', color: '#A8A49E', maxWidth: '520px' }}
          >
            Elite Class operates as an extension of your guest services — on call, on brand, on time.
          </motion.p>
        </div>

        {/* Logo strip */}
        {/* CLIENT TO CONFIRM: partner logos + usage rights */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center mb-24"
          aria-label="Partner organisations"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex items-center justify-center will-change-transform"
              style={{
                width: '120px',
                height: '40px',
                margin: '0 auto',
                background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(201,169,110,0.08)',
                filter: 'grayscale(1) opacity(0.35)',
              }}
              aria-hidden="true"
            >
              <span className="font-sans" style={{ fontSize: '9px', letterSpacing: '0.14em', color: '#5A5855', textTransform: 'uppercase' }}>
                Partner {i + 1}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Value props — editorial numbered table */}
        <div style={{ borderTop: '0.5px solid rgba(201,169,110,0.15)' }}>
          {valueProps.map((v, i) => (
            <motion.div
              key={v.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_minmax(0,320px)_1fr] gap-x-6 md:gap-x-10 gap-y-2 items-baseline py-8"
              style={{ borderBottom: '0.5px solid rgba(201,169,110,0.15)' }}
            >
              <span className="font-serif" style={{ fontSize: '13px', color: '#C9A96E', letterSpacing: '0.1em' }}>
                {v.n}
              </span>
              <h3 className="font-serif font-normal" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#F5F2EE' }}>
                {v.title}
              </h3>
              <p className="col-start-2 md:col-start-3 font-sans leading-relaxed" style={{ fontSize: '14px', color: '#A8A49E' }}>
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Fleet-scale signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-16" style={{ background: 'rgba(201,169,110,0.04)' }}>
          {fleetSignals.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="p-8"
              style={{ background: '#0A0A0B' }}
            >
              <p className="font-serif font-normal mb-3 leading-snug" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', color: '#F5F2EE' }}>
                {f.value}
              </p>
              <p className="font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', textTransform: 'uppercase' }}>
                {f.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* B2B CTA bar — slim, secondary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5"
          style={{ border: '0.5px solid rgba(201,169,110,0.18)', background: '#111113' }}
        >
          <p className="font-sans" style={{ fontSize: '13px', color: '#A8A49E', letterSpacing: '0.02em' }}>
            Hotel, venue or corporate concierge?
          </p>
          <a
            href="#partners-access"
            onClick={scrollToPartnerForm}
            className="inline-flex items-center gap-2 cursor-none font-sans transition-colors duration-200 hover:text-[#F5F2EE] focus-visible:outline-[#C9A96E]"
            style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A96E' }}
          >
            Partner access &rarr;
          </a>
        </motion.div>
      </div>
    </section>
  )
}
