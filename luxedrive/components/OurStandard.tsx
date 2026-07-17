'use client'

import { motion } from 'framer-motion'
import { Clock, EyeOff, ShieldCheck, Star } from 'lucide-react'

const pillars = [
  { icon: Clock, title: 'Impeccable Punctuality', desc: 'Your time is non-negotiable. Every chauffeur operates to a ten-minute advance arrival standard, always.' },
  { icon: ShieldCheck, title: 'Prepared Without Exception', desc: 'Vehicle detailed, temperature set, route optimised — before you step in. Nothing is left to chance.' },
  { icon: Star, title: 'Present and Invisible', desc: 'Trained to be exactly as present as required. Attentive without being intrusive. That is the standard.' },
  { icon: EyeOff, title: 'Protocol, not Policy', desc: 'Every journey follows an established protocol. Not a checklist — a standard our drivers hold without prompting.' },
]

export default function OurStandard() {
  return (
    <section id="our-standard" className="py-24 px-6 md:px-14" style={{ background: '#0A0A0B' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-20 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-4"
          >
            <span className="w-6 h-px bg-[#C9A96E] opacity-50 shrink-0" aria-hidden="true" />
            Our Standard
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-normal leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F2EE' }}
          >
            The details others{' '}
            <em className="not-italic" style={{ color: '#C9A96E' }}>overlook.</em>
          </motion.h2>
        </div>

        {/* ── DISCRETION PILLAR — more negative space ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
          style={{
            padding: 'clamp(48px, 8vw, 96px) clamp(32px, 6vw, 80px)',
            border: '0.5px solid rgba(201,169,110,0.15)',
            background: '#0D0D0F',
          }}
          aria-labelledby="discretion-heading"
        >
          <p className="font-sans mb-8" style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C9A96E', textTransform: 'uppercase' }}>
            Discretion
          </p>
          <h3
            id="discretion-heading"
            className="font-serif font-normal leading-snug mb-12"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: '#F5F2EE', maxWidth: '560px' }}
          >
            No badges. No logos.
            <br />No photographs.
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl">
            {[
              'Non-disclosure agreements available on request.',
              'Client information is never shared, sold, or discussed.',
              'Drivers trained to be present — and invisible.',
              'Unmarked vehicles available for all operations.',
            ].map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                className="font-sans leading-relaxed"
                style={{ fontSize: '14px', color: '#A8A49E', paddingLeft: '16px', borderLeft: '1px solid rgba(201,169,110,0.15)' }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* 2×2 pillar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'rgba(201,169,110,0.04)' }}>
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-8"
                style={{ background: '#111113' }}
              >
                <div className="w-10 h-10 flex items-center justify-center mb-6" style={{ border: '0.5px solid rgba(201,169,110,0.2)' }} aria-hidden="true">
                  <Icon size={18} style={{ color: '#C9A96E' }} />
                </div>
                <h3 className="font-serif font-normal mb-3" style={{ fontSize: '20px', color: '#F5F2EE' }}>{p.title}</h3>
                <p className="font-sans leading-relaxed" style={{ fontSize: '14px', color: '#A8A49E' }}>{p.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
