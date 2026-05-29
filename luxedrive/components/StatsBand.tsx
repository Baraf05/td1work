'use client'

import { motion } from 'framer-motion'

const stats = [
  {
    value: '2,500',
    valueSuffix: '+',
    label: 'VIP RIDES DELIVERED',
  },
  {
    value: '24',
    valueSuffix: '/7',
    label: 'AVAILABILITY',
  },
  {
    value: '98',
    valueSuffix: '%',
    label: 'CLIENT SATISFACTION',
  },
  {
    value: 'EN · AR · FR · RU',
    valueSuffix: '',
    label: 'LANGUAGES',
  },
]

export default function StatsBand() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4"
      style={{
        background: '#0A0A0B',
        borderTop: '0.5px solid rgba(201,169,110,0.12)',
        borderBottom: '0.5px solid rgba(201,169,110,0.12)',
      }}
      aria-label="Service highlights"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          className="flex flex-col items-center justify-center text-center py-8 px-4 gap-2"
          style={{
            borderRight: i < 3 ? '0.5px solid rgba(201,169,110,0.08)' : 'none',
          }}
        >
          <p
            className="font-serif font-normal leading-none"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 1.75rem)', color: '#F5F2EE' }}
          >
            {s.value}
            {s.valueSuffix && (
              <span style={{ color: '#C9A96E' }}>{s.valueSuffix}</span>
            )}
          </p>
          <p
            className="font-sans"
            style={{
              fontSize: '10px',
              letterSpacing: '0.14em',
              color: '#5A5855',
            }}
          >
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
