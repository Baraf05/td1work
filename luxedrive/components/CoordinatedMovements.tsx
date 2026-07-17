'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Shield } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Convoy planning',
    desc: 'Routes, timings and contingencies mapped before wheels move. No detail left to the moment.',
  },
  {
    icon: Phone,
    title: 'Single point of contact',
    desc: 'One coordinator, reachable at every moment of the operation — from staging to final return.',
  },
  {
    icon: Shield,
    title: 'Security-aware protocol',
    desc: 'Trained drivers, unmarked vehicles on request, NDA available. Discretion is the default.',
  },
]

const WA_LINK = `https://wa.me/971542370940?text=${encodeURIComponent(
  "Hello Elite Class — I'd like to discuss a multi-vehicle / VIP operation."
)}`

export default function CoordinatedMovements() {
  return (
    <section
      id="coordinated-movements"
      className="py-24 px-6 md:px-14"
      style={{ background: '#111113', borderTop: '0.5px solid rgba(201,169,110,0.06)' }}
      aria-labelledby="coord-title"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="eyebrow mb-6"
            >
              <span className="w-6 h-px bg-[#C9A96E] opacity-50 shrink-0" aria-hidden="true" />
              Coordinated Movements
            </motion.p>

            <motion.h2
              id="coord-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-normal leading-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F5F2EE' }}
            >
              One arrival.{' '}
              <em className="not-italic" style={{ color: '#C9A96E' }}>Eight vehicles.</em>
              <br />Zero friction.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-sans leading-relaxed mb-10"
              style={{ fontSize: '15px', color: '#A8A49E', maxWidth: '420px' }}
            >
              For touring productions, delegations and private events, we plan and run multi-vehicle operations with a single point of contact — from the first airside pickup to the last hotel return.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22 }}
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 cursor-none font-sans font-medium transition-opacity duration-200 hover:opacity-80"
              style={{
                background: '#C9A96E', color: '#0A0A0B',
                padding: '14px 28px', fontSize: '13px', letterSpacing: '0.08em',
              }}
              aria-label="Speak to the VIP desk on WhatsApp"
            >
              Planning a high-profile visit? Speak to the VIP desk →
            </motion.a>
          </div>

          {/* Right — feature blocks */}
          <div className="space-y-0" style={{ borderTop: '0.5px solid rgba(201,169,110,0.10)' }}>
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-6 py-8"
                  style={{ borderBottom: '0.5px solid rgba(201,169,110,0.10)' }}
                >
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: '36px', height: '36px', border: '0.5px solid rgba(201,169,110,0.2)' }}
                    aria-hidden="true"
                  >
                    <Icon size={15} style={{ color: '#C9A96E' }} />
                  </div>
                  <div>
                    <h3 className="font-serif font-normal mb-2" style={{ fontSize: '17px', color: '#F5F2EE' }}>
                      {f.title}
                    </h3>
                    <p className="font-sans leading-relaxed" style={{ fontSize: '13px', color: '#A8A49E' }}>
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
