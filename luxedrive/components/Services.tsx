'use client'

import { motion } from 'framer-motion'
import { Plane, Briefcase, Building2, CalendarCheck, Map, MessageSquare } from 'lucide-react'

const services = [
  {
    icon: Plane,
    title: 'Airport Transfers',
    desc: 'Meet-and-greet, real-time flight tracking. 60 minutes\' wait at no extra charge.',
  },
  {
    icon: Briefcase,
    title: 'Corporate Travel',
    desc: 'Executive transfers, account invoicing, and priority dispatch for business clients.',
  },
  {
    icon: Building2,
    title: 'Hotel to Hotel',
    desc: 'Seamless door-to-door service between hotels and private residences across Dubai.',
  },
  {
    icon: CalendarCheck,
    title: 'Event Transportation',
    desc: 'Discreet, punctual service for conferences, galas, and venue transfers.',
  },
  {
    icon: Map,
    title: 'Cross-Emirate',
    desc: 'Abu Dhabi, Sharjah, Ras Al Khaimah. Cross-border transfers to Oman with notice.',
  },
  {
    icon: MessageSquare,
    title: 'Custom Request',
    desc: 'Bespoke itineraries and special arrangements. One message, every detail handled.',
    cta: true,
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 md:px-14" style={{ background: '#111113' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-4"
          >
            <span className="w-6 h-px bg-[#C9A96E] opacity-50 shrink-0" aria-hidden="true" />
            What We Offer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-normal leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F2EE' }}
          >
            Five ways to{' '}
            <em className="not-italic" style={{ color: '#C9A96E' }}>travel.</em>
          </motion.h2>
        </div>

        {/* 3-column grid — 6 cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ borderTop: '0.5px solid rgba(201,169,110,0.12)' }}
        >
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="p-7 group"
                style={{
                  borderBottom: '0.5px solid rgba(201,169,110,0.12)',
                  borderRight: (i % 3 !== 2) ? '0.5px solid rgba(201,169,110,0.12)' : 'none',
                }}
              >
                <Icon
                  size={20}
                  className="mb-5"
                  style={{ color: '#C9A96E' }}
                  aria-hidden="true"
                />
                <h3
                  className="font-sans mb-2"
                  style={{ fontSize: '16px', color: '#F5F2EE', fontWeight: 400 }}
                >
                  {s.title}
                </h3>
                <p
                  className="font-sans leading-relaxed"
                  style={{
                    fontSize: '13px',
                    color: '#A8A49E',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {s.desc}
                </p>
                {s.cta && (
                  <a
                    href="https://wa.me/971542370940?text=Hello%20Elite%20Class%2C%20I%20have%20a%20custom%20request."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 font-sans transition-opacity duration-200 hover:opacity-70 cursor-none"
                    style={{ fontSize: '12px', color: '#C9A96E' }}
                  >
                    Message us →
                  </a>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
