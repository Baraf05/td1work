'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Car, Users, Briefcase, Wifi, X, ChevronRight, Check } from 'lucide-react'
import { vehicles, CATEGORIES, type FleetVehicle, type VehicleCategory } from '@/lib/vehicles'

// ── Currency config (extend when switcher is ready)
const CURRENCIES = {
  AED: { symbol: 'AED', rate: 1 },
  USD: { symbol: '$', rate: 0.272 },
  EUR: { symbol: '€', rate: 0.252 },
}
type Currency = keyof typeof CURRENCIES

function formatPrice(aed: number, currency: Currency) {
  const { symbol, rate } = CURRENCIES[currency]
  const val = Math.round(aed * rate)
  return `${symbol} ${val.toLocaleString()}`
}

// ── Detail Modal ─────────────────────────────────────────────────────
function VehicleDetailModal({
  vehicle,
  currency,
  onClose,
}: {
  vehicle: FleetVehicle
  currency: Currency
  onClose: () => void
}) {
  const scrollToReservation = () => {
    onClose()
    setTimeout(() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' }), 300)
  }

  const waLink = `https://wa.me/971542370940?text=${encodeURIComponent(
    `Hello Elite Class — I'd like to reserve the ${vehicle.name}.`
  )}`

  const priceRows = [
    { label: 'Hourly', value: vehicle.pricing.hourly },
    { label: 'Half day (4 h)', value: vehicle.pricing.halfDay },
    { label: 'Full day — Dubai (8 h)', value: vehicle.pricing.fullDayDubai },
    { label: 'Full day — outside Dubai', value: vehicle.pricing.fullDayOutside },
    { label: 'Extra hour', value: vehicle.pricing.extraHour },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${vehicle.name} details`}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full md:max-w-2xl md:rounded-none overflow-y-auto"
        style={{
          background: '#111113',
          border: '0.5px solid rgba(201,169,110,0.2)',
          maxHeight: '92vh',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 md:p-8"
          style={{ borderBottom: '0.5px solid rgba(201,169,110,0.12)' }}>
          <div>
            {vehicle.flagship && (
              <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#C9A96E', marginBottom: '6px', textTransform: 'uppercase' }}>
                Flagship
              </p>
            )}
            <h3 className="font-serif font-normal" style={{ fontSize: '24px', color: '#F5F2EE' }}>
              {vehicle.name}
            </h3>
            <p className="font-sans" style={{ fontSize: '12px', color: '#A8A49E', marginTop: '4px' }}>
              {vehicle.role}
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-none p-2 transition-colors duration-200 hover:text-[#F5F2EE]"
            style={{ color: '#5A5855' }}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Image placeholder */}
        <div
          className="flex items-center justify-center"
          style={{ background: '#0A0A0B', height: '200px' }}
          aria-label={`${vehicle.name} photo — coming soon`}
        >
          <Car size={48} style={{ color: 'rgba(201,169,110,0.12)' }} aria-hidden="true" />
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-8">

          {/* Specs row */}
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-sans" style={{ fontSize: '13px', color: '#A8A49E' }}>
              <Users size={14} aria-hidden="true" style={{ color: '#C9A96E' }} />
              {vehicle.pax} passengers
            </span>
            <span className="flex items-center gap-1.5 font-sans" style={{ fontSize: '13px', color: '#A8A49E' }}>
              <Briefcase size={14} aria-hidden="true" style={{ color: '#C9A96E' }} />
              {vehicle.bags} bags
            </span>
            {vehicle.wifi && (
              <span className="flex items-center gap-1.5 font-sans" style={{ fontSize: '13px', color: '#A8A49E' }}>
                <Wifi size={14} aria-hidden="true" style={{ color: '#C9A96E' }} />
                WiFi
              </span>
            )}
          </div>

          {/* Description */}
          <p className="font-sans leading-relaxed" style={{ fontSize: '14px', color: '#A8A49E' }}>
            {vehicle.description}
          </p>

          {/* Price table */}
          <div>
            <p className="font-sans mb-4" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#3A3836', textTransform: 'uppercase' }}>
              Rates
            </p>
            <div style={{ border: '0.5px solid rgba(201,169,110,0.12)' }}>
              {priceRows.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: i < priceRows.length - 1 ? '0.5px solid rgba(201,169,110,0.08)' : 'none' }}
                >
                  <span className="font-sans" style={{ fontSize: '13px', color: '#A8A49E' }}>{row.label}</span>
                  <span className="font-serif font-normal" style={{ fontSize: '16px', color: '#F5F2EE' }}>
                    {formatPrice(row.value, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          {vehicle.options.length > 0 && (
            <div>
              <p className="font-sans mb-4" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#3A3836', textTransform: 'uppercase' }}>
                Included
              </p>
              <div className="flex flex-wrap gap-2">
                {vehicle.options.map(opt => (
                  <span
                    key={opt}
                    className="flex items-center gap-1.5 font-sans"
                    style={{
                      fontSize: '12px', color: '#A8A49E',
                      padding: '4px 10px',
                      border: '0.5px solid rgba(201,169,110,0.15)',
                    }}
                  >
                    <Check size={10} style={{ color: '#C9A96E' }} aria-hidden="true" />
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={scrollToReservation}
              className="flex-1 cursor-none font-sans font-medium text-center transition-opacity duration-200 hover:opacity-90"
              style={{
                background: '#C9A96E', color: '#0A0A0B',
                padding: '15px 24px', fontSize: '13px', letterSpacing: '0.08em',
                border: 'none',
              }}
            >
              Reserve this vehicle
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 cursor-none font-sans font-medium transition-colors duration-200"
              style={{
                padding: '15px 24px', fontSize: '13px', letterSpacing: '0.08em',
                border: '0.5px solid rgba(201,169,110,0.3)',
                color: '#C9A96E',
              }}
            >
              WhatsApp inquiry
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Vehicle Card ──────────────────────────────────────────────────────
function VehicleCard({
  v, index, onSelect, currency,
}: {
  v: FleetVehicle; index: number; onSelect: (v: FleetVehicle) => void; currency: Currency
}) {
  const tiltRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce) return
    const el = tiltRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`
  }

  const handleMouseLeave = () => {
    const el = tiltRef.current
    if (el) el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={tiltRef}
        data-cursor="fleet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(v)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onSelect(v)}
        aria-label={`${v.name} — ${v.role}. View details`}
        style={{
          background: '#111113',
          border: v.flagship ? '0.5px solid rgba(201,169,110,0.25)' : '0.5px solid rgba(201,169,110,0.06)',
          cursor: 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          willChange: 'transform',
        }}
        className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]"
      >
        {/* Image area 16:10 */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{ aspectRatio: '16/10', background: '#0A0A0B' }}
          aria-label={`${v.name} photo placeholder`}
        >
          <Car size={40} style={{ color: 'rgba(201,169,110,0.1)' }} aria-hidden="true" />
          {v.flagship && (
            <div
              className="absolute top-3 left-3 font-sans"
              style={{ fontSize: '9px', letterSpacing: '0.18em', color: '#C9A96E', border: '0.5px solid rgba(201,169,110,0.3)', padding: '3px 8px', textTransform: 'uppercase' }}
            >
              Flagship
            </div>
          )}
          {!v.available && (
            <div
              className="absolute inset-0 flex items-center justify-center font-sans"
              style={{ background: 'rgba(10,10,11,0.7)', fontSize: '11px', letterSpacing: '0.2em', color: '#5A5855', textTransform: 'uppercase' }}
            >
              Unavailable
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="font-sans mb-1" style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#C9A96E', textTransform: 'uppercase' }}>
            {v.role}
          </p>
          <h3 className="font-serif font-normal mb-3" style={{ fontSize: '19px', color: '#F5F2EE' }}>
            {v.name}
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center gap-1 font-sans" style={{ fontSize: '12px', color: '#5A5855' }}>
              <Users size={12} aria-hidden="true" /> {v.pax}
            </span>
            <span className="flex items-center gap-1 font-sans" style={{ fontSize: '12px', color: '#5A5855' }}>
              <Briefcase size={12} aria-hidden="true" /> {v.bags}
            </span>
            {v.wifi && (
              <span className="flex items-center gap-1 font-sans" style={{ fontSize: '12px', color: '#5A5855' }}>
                <Wifi size={12} aria-hidden="true" /> WiFi
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-sans" style={{ fontSize: '12px', color: '#5A5855' }}>
              From{' '}
              <span className="font-serif" style={{ fontSize: '15px', color: '#C9A96E' }}>
                {formatPrice(v.pricing.halfDay, currency)}
              </span>
              {' '}/ half day
            </p>
            <button
              className="flex items-center gap-1 font-sans cursor-none transition-colors duration-200 hover:text-[#F5F2EE]"
              style={{ fontSize: '12px', color: '#C9A96E', background: 'none', border: 'none', padding: 0 }}
              aria-label={`View details for ${v.name}`}
            >
              View <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────────────────────
export default function FleetSection() {
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>('ALL')
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null)
  const [currency, setCurrency] = useState<Currency>('AED')

  const filtered = activeCategory === 'ALL'
    ? vehicles
    : vehicles.filter(v => v.category === activeCategory)

  return (
    <section id="fleet" className="py-24 px-6 md:px-14" style={{ background: '#0A0A0B' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div>
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
              Twenty vehicles.{' '}
              <em className="not-italic" style={{ color: '#C9A96E' }}>One standard.</em>
            </motion.h2>
          </div>

          {/* Currency switcher */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center"
            style={{ border: '0.5px solid rgba(201,169,110,0.15)' }}
            role="group"
            aria-label="Display currency"
          >
            {(Object.keys(CURRENCIES) as Currency[]).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                aria-pressed={currency === c}
                className="cursor-none font-sans transition-colors duration-200"
                style={{
                  fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                  padding: '7px 14px', border: 'none',
                  background: currency === c ? 'rgba(201,169,110,0.12)' : 'transparent',
                  color: currency === c ? '#C9A96E' : '#5A5855',
                  borderRight: c !== 'EUR' ? '0.5px solid rgba(201,169,110,0.15)' : 'none',
                }}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Category filter — sticky under Navbar */}
        <div
          className="flex items-center gap-0 mb-12 overflow-x-auto pb-1 -mx-6 md:-mx-14 px-6 md:px-14"
          role="tablist"
          aria-label="Vehicle categories"
          style={{
            borderBottom: '0.5px solid rgba(201,169,110,0.08)',
            position: 'sticky', top: '64px', zIndex: 40, background: '#0A0A0B',
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className="relative shrink-0 cursor-none font-sans transition-colors duration-200 focus-visible:outline-[#C9A96E]"
              style={{
                fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '12px 20px', border: 'none', background: 'none',
                color: activeCategory === cat ? '#F5F2EE' : '#5A5855',
              }}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="fleet-filter-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: '#C9A96E' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((v, i) => (
              <VehicleCard
                key={v.id}
                v={v}
                index={i}
                onSelect={setSelectedVehicle}
                currency={currency}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Reserve note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans mt-8 text-center"
          style={{ fontSize: '13px', color: '#3A3836' }}
        >
          All rates in AED. Additional vehicles available for multi-car operations — enquire via WhatsApp.
        </motion.p>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <VehicleDetailModal
            vehicle={selectedVehicle}
            currency={currency}
            onClose={() => setSelectedVehicle(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
