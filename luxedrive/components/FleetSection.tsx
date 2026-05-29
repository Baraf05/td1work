'use client'

import { motion } from 'framer-motion'
import { Users, Briefcase, Wifi, Car } from 'lucide-react'
import { vehicles, type Vehicle } from '@/lib/vehicles'

function VehicleCard({ v, index }: { v: Vehicle; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      tabIndex={0}
      aria-label={`${v.name} — ${v.type}`}
      className="group focus-visible:outline-none"
      style={{
        border: v.flagship ? '0.5px solid rgba(201,169,110,0.3)' : '0.5px solid rgba(201,169,110,0.06)',
        background: '#111113',
      }}
    >
      {/* Photo placeholder */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: '220px', background: '#111113' }}
        aria-label="Vehicle photo — coming soon"
      >
        <Car
          size={48}
          style={{ color: 'rgba(201,169,110,0.15)' }}
          aria-hidden="true"
        />
        {v.flagship && (
          <div
            className="absolute top-3 left-3 font-sans text-[9px] tracking-[0.15em] uppercase px-2 py-1"
            style={{ color: '#C9A96E', border: '0.5px solid rgba(201,169,110,0.3)' }}
          >
            Flagship
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Type badge */}
        <p
          className="font-sans mb-2"
          style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#C9A96E' }}
        >
          {v.type}
        </p>

        {/* Vehicle name */}
        <h3
          className="font-serif font-normal mb-4"
          style={{ fontSize: '20px', color: '#F5F2EE' }}
        >
          {v.name}
        </h3>

        {/* Specs row */}
        <div className="flex items-center gap-5 mb-5">
          <span className="flex items-center gap-1.5" style={{ fontSize: '12px', color: '#5A5855' }}>
            <Users size={13} aria-hidden="true" />
            {v.pax} pax
          </span>
          <span className="flex items-center gap-1.5" style={{ fontSize: '12px', color: '#5A5855' }}>
            <Briefcase size={13} aria-hidden="true" />
            {v.bags} bags
          </span>
          {v.wifi && (
            <span className="flex items-center gap-1.5" style={{ fontSize: '12px', color: '#5A5855' }}>
              <Wifi size={13} aria-hidden="true" />
              WiFi
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href="#reservation"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="inline-flex items-center gap-1.5 font-sans cursor-none transition-colors duration-200 hover:opacity-80"
          style={{ fontSize: '13px', color: '#C9A96E' }}
          aria-label={`View and reserve the ${v.name}`}
        >
          View &amp; reserve →
        </a>
      </div>
    </motion.article>
  )
}

export default function FleetSection() {
  return (
    <section id="fleet" className="py-24 px-6 md:px-14" style={{ background: '#0A0A0B' }}>
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
            The Fleet
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-normal leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F2EE' }}
          >
            Four cars.{' '}
            <em className="not-italic" style={{ color: '#C9A96E' }}>Carefully chosen.</em>
          </motion.h2>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(201,169,110,0.06)]">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.id} v={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
