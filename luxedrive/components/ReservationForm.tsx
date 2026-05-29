'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

type FormData = {
  pickup: string
  dropoff: string
  date: string
  time: string
  vehicle: string
  passengers: string
  name: string
  phone: string
  extras: string
  email: string
}

type Errors = Partial<Record<keyof FormData, string>>

const REQUIRED: (keyof FormData)[] = ['pickup', 'dropoff', 'date', 'time', 'passengers', 'name', 'phone']

const FIELD_LABEL: Record<keyof FormData, string> = {
  pickup:     'PICKUP LOCATION',
  dropoff:    'DROP-OFF LOCATION',
  date:       'DATE',
  time:       'TIME',
  vehicle:    'VEHICLE',
  passengers: 'PASSENGERS',
  name:       'FULL NAME',
  phone:      'PHONE (WHATSAPP)',
  extras:     'FLIGHT NUMBER OR SPECIAL REQUEST',
  email:      'EMAIL',
}

const EMPTY: FormData = {
  pickup: '', dropoff: '', date: '', time: '',
  vehicle: '', passengers: '', name: '', phone: '', extras: '', email: '',
}

function buildWAMessage(f: FormData): string {
  return `🚘 *New vehicle request — Elite Class*
━━━━━━━━━━━━━━━━
👤 *Name:* ${f.name}
📞 *Phone:* ${f.phone}
━━━━━━━━━━━━━━━━
🗓 *Date:* ${f.date}
🕐 *Time:* ${f.time}
🚗 *Vehicle:* ${f.vehicle || 'No preference'}
👥 *Passengers:* ${f.passengers}
━━━━━━━━━━━━━━━━
📍 *Pickup:* ${f.pickup}
🏁 *Drop-off:* ${f.dropoff}
✈️ *Flight / Notes:* ${f.extras || 'None'}
━━━━━━━━━━━━━━━━
_Sent from eliteclasslimo.com_`
}

/* ── Accessible field wrapper ───────────────────────── */
function Field({
  id, label, required, error, children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-sans mb-2"
        style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855' }}
      >
        {label}
        {required && <span className="ml-0.5" style={{ color: '#C9A96E' }} aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 mt-1.5 font-sans"
          style={{ fontSize: '12px', color: '#C9A96E' }}
        >
          <AlertCircle size={11} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '0.5px solid rgba(201,169,110,0.12)',
  padding: '16px 20px',
  fontSize: '14px',
  color: '#F5F2EE',
  fontFamily: 'Inter, system-ui, sans-serif',
  outline: 'none',
  transition: 'background 0.2s, border-color 0.2s',
}

const inputError: React.CSSProperties = {
  borderBottom: '0.5px solid #C9A96E',
}

function StyledInput({
  id, value, onChange, type = 'text', placeholder, autoComplete, error,
  'aria-describedby': ariaDesc,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
  error?: boolean
  'aria-describedby'?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : ariaDesc}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        ...(error ? inputError : {}),
        background: focused ? 'rgba(201,169,110,0.03)' : 'transparent',
      }}
    />
  )
}

function StyledSelect({
  id, value, onChange, children, error,
  'aria-describedby': ariaDesc,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  error?: boolean
  'aria-describedby'?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : ariaDesc}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        ...(error ? inputError : {}),
        background: focused ? 'rgba(201,169,110,0.03)' : '#0A0A0B',
        appearance: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </select>
  )
}

export default function ReservationForm() {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const pickupRef = useRef<HTMLInputElement>(null)
  const dropoffRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormData) => (v: string) =>
    setForm(f => ({ ...f, [key]: v }))

  /* Google Places Autocomplete (requires NEXT_PUBLIC_GOOGLE_MAPS_KEY) */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const init = () => {
      const google = (window as Window & typeof globalThis & { google?: { maps?: { places?: { Autocomplete?: new (el: HTMLInputElement, opts: object) => { addListener: (event: string, cb: () => void) => void; getPlace: () => { formatted_address?: string; name?: string } } } } } }).google
      if (!google?.maps?.places?.Autocomplete) return
      const opts = { componentRestrictions: { country: 'ae' }, fields: ['formatted_address', 'name'] }
      if (pickupRef.current) {
        const ac = new google.maps.places.Autocomplete(pickupRef.current, opts)
        ac.addListener('place_changed', () => {
          const p = ac.getPlace()
          set('pickup')(p.formatted_address || p.name || '')
        })
      }
      if (dropoffRef.current) {
        const ac = new google.maps.places.Autocomplete(dropoffRef.current, opts)
        ac.addListener('place_changed', () => {
          const p = ac.getPlace()
          set('dropoff')(p.formatted_address || p.name || '')
        })
      }
    }
    if ((window as Window & typeof globalThis & { google?: unknown }).google) init()
    else window.addEventListener('load', init)
    return () => window.removeEventListener('load', init)
  }, [])

  const validate = (): Errors => {
    const e: Errors = {}
    for (const key of REQUIRED) {
      if (!form[key].trim()) e[key] = `${FIELD_LABEL[key]} is required`
    }
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      const firstKey = REQUIRED.find(k => errs[k])
      if (firstKey) document.getElementById(firstKey)?.focus()
      return
    }
    setErrors({})
    const msg = buildWAMessage(form)
    window.open(`https://wa.me/971542370940?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section id="reservation" className="py-24 px-6 md:px-14" style={{ background: '#0A0A0B' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-4"
          >
            <span className="w-6 h-px bg-[#C9A96E] opacity-50 shrink-0" aria-hidden="true" />
            Reservation
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-normal leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F2EE' }}
          >
            Reserve your{' '}
            <em className="not-italic" style={{ color: '#C9A96E' }}>transfer.</em>
          </motion.h2>
        </div>

        {/* Form grid */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          onSubmit={handleSubmit}
          noValidate
          aria-label="Vehicle reservation form"
          style={{ border: '0.5px solid rgba(201,169,110,0.15)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Pickup */}
            <Field id="pickup" label="PICKUP LOCATION" required error={errors.pickup}>
              <input
                ref={pickupRef}
                id="pickup"
                type="text"
                value={form.pickup}
                onChange={e => set('pickup')(e.target.value)}
                placeholder="e.g. Burj Al Arab"
                aria-invalid={!!errors.pickup}
                aria-describedby={errors.pickup ? 'pickup-error' : undefined}
                style={{
                  ...inputBase,
                  ...(errors.pickup ? inputError : {}),
                }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              />
              {errors.pickup && (
                <p id="pickup-error" role="alert" className="flex items-center gap-1.5 mt-1.5 font-sans" style={{ fontSize: '12px', color: '#C9A96E', padding: '0 20px' }}>
                  <AlertCircle size={11} aria-hidden="true" />{errors.pickup}
                </p>
              )}
            </Field>

            {/* Drop-off */}
            <Field id="dropoff" label="DROP-OFF LOCATION" required error={errors.dropoff}>
              <input
                ref={dropoffRef}
                id="dropoff"
                type="text"
                value={form.dropoff}
                onChange={e => set('dropoff')(e.target.value)}
                placeholder="e.g. DXB Terminal 3"
                aria-invalid={!!errors.dropoff}
                aria-describedby={errors.dropoff ? 'dropoff-error' : undefined}
                style={{
                  ...inputBase,
                  ...(errors.dropoff ? inputError : {}),
                }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              />
              {errors.dropoff && (
                <p id="dropoff-error" role="alert" className="flex items-center gap-1.5 mt-1.5 font-sans" style={{ fontSize: '12px', color: '#C9A96E', padding: '0 20px' }}>
                  <AlertCircle size={11} aria-hidden="true" />{errors.dropoff}
                </p>
              )}
            </Field>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block font-sans mb-2" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', padding: '16px 20px 0' }}>
                DATE <span style={{ color: '#C9A96E' }} aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id="date"
                type="date"
                lang="en"
                value={form.date}
                onChange={e => set('date')(e.target.value)}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? 'date-error' : undefined}
                style={{
                  ...inputBase,
                  ...(errors.date ? inputError : {}),
                  colorScheme: 'dark',
                }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              />
              {errors.date && (
                <p id="date-error" role="alert" className="flex items-center gap-1.5 font-sans" style={{ fontSize: '12px', color: '#C9A96E', padding: '4px 20px' }}>
                  <AlertCircle size={11} aria-hidden="true" />{errors.date}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', padding: '16px 20px 0' }}>
                TIME <span style={{ color: '#C9A96E' }} aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id="time"
                type="time"
                value={form.time}
                onChange={e => set('time')(e.target.value)}
                aria-invalid={!!errors.time}
                aria-describedby={errors.time ? 'time-error' : undefined}
                style={{
                  ...inputBase,
                  ...(errors.time ? inputError : {}),
                  colorScheme: 'dark',
                }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              />
              {errors.time && (
                <p id="time-error" role="alert" className="flex items-center gap-1.5 font-sans" style={{ fontSize: '12px', color: '#C9A96E', padding: '4px 20px' }}>
                  <AlertCircle size={11} aria-hidden="true" />{errors.time}
                </p>
              )}
            </div>

            {/* Vehicle */}
            <div>
              <label htmlFor="vehicle" className="block font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', padding: '16px 20px 0' }}>
                VEHICLE
              </label>
              <select
                id="vehicle"
                value={form.vehicle}
                onChange={e => set('vehicle')(e.target.value)}
                style={{ ...inputBase, colorScheme: 'dark', appearance: 'none', cursor: 'pointer', background: '#0A0A0B' }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = '#0A0A0B' }}
              >
                <option value="">No preference</option>
                <option value="Lexus ES 300h">Lexus ES 300h — Executive Sedan</option>
                <option value="Toyota Highlander">Toyota Highlander — Premium SUV</option>
                <option value="Chevrolet Suburban">Chevrolet Suburban — Large SUV</option>
                <option value="Cadillac Escalade">Cadillac Escalade — Flagship SUV</option>
              </select>
            </div>

            {/* Passengers */}
            <div>
              <label htmlFor="passengers" className="block font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', padding: '16px 20px 0' }}>
                PASSENGERS <span style={{ color: '#C9A96E' }} aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <select
                id="passengers"
                value={form.passengers}
                onChange={e => set('passengers')(e.target.value)}
                aria-invalid={!!errors.passengers}
                aria-describedby={errors.passengers ? 'passengers-error' : undefined}
                style={{
                  ...inputBase,
                  ...(errors.passengers ? inputError : {}),
                  colorScheme: 'dark',
                  appearance: 'none',
                  cursor: 'pointer',
                  background: '#0A0A0B',
                }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = '#0A0A0B' }}
              >
                <option value="">Select</option>
                {[1,2,3,4,5,6].map(n => <option key={n} value={String(n)}>{n}</option>)}
                <option value="7+">7+</option>
              </select>
              {errors.passengers && (
                <p id="passengers-error" role="alert" className="flex items-center gap-1.5 font-sans" style={{ fontSize: '12px', color: '#C9A96E', padding: '4px 20px' }}>
                  <AlertCircle size={11} aria-hidden="true" />{errors.passengers}
                </p>
              )}
            </div>

            {/* Full name */}
            <div>
              <label htmlFor="name" className="block font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', padding: '16px 20px 0' }}>
                FULL NAME <span style={{ color: '#C9A96E' }} aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={e => set('name')(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                style={{ ...inputBase, ...(errors.name ? inputError : {}) }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="flex items-center gap-1.5 font-sans" style={{ fontSize: '12px', color: '#C9A96E', padding: '4px 20px' }}>
                  <AlertCircle size={11} aria-hidden="true" />{errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', padding: '16px 20px 0' }}>
                PHONE (WHATSAPP) <span style={{ color: '#C9A96E' }} aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+971 5x xxx xxxx"
                value={form.phone}
                onChange={e => set('phone')(e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                style={{ ...inputBase, ...(errors.phone ? inputError : {}) }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              />
              {errors.phone && (
                <p id="phone-error" role="alert" className="flex items-center gap-1.5 font-sans" style={{ fontSize: '12px', color: '#C9A96E', padding: '4px 20px' }}>
                  <AlertCircle size={11} aria-hidden="true" />{errors.phone}
                </p>
              )}
            </div>

            {/* Extras — full width */}
            <div className="md:col-span-2">
              <label htmlFor="extras" className="block font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', padding: '16px 20px 0' }}>
                FLIGHT NUMBER OR SPECIAL REQUEST
                <span className="ml-2" style={{ color: '#3A3836' }}>(optional)</span>
              </label>
              <input
                id="extras"
                type="text"
                placeholder="e.g. EK 203 — or child seat, name board on arrival…"
                value={form.extras}
                onChange={e => set('extras')(e.target.value)}
                style={{ ...inputBase, borderBottom: '0.5px solid rgba(201,169,110,0.12)' }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              />
            </div>

            {/* Email — optional, full width */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block font-sans" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', padding: '16px 20px 0' }}>
                EMAIL
                <span className="ml-2" style={{ color: '#3A3836' }}>(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email')(e.target.value)}
                style={{ ...inputBase, borderBottom: 'none' }}
                onFocus={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                onBlur={e => { e.currentTarget.style.background = 'transparent' }}
              />
            </div>
          </div>

          {/* Submit row */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5"
            style={{ borderTop: '0.5px solid rgba(201,169,110,0.12)' }}
          >
            <button
              type="submit"
              className="cursor-none font-sans font-medium transition-all duration-200 hover:opacity-90 focus-visible:outline-[#F5F2EE]"
              style={{
                background: '#C9A96E',
                color: '#0A0A0B',
                border: 'none',
                borderRadius: 0,
                padding: '16px 36px',
                fontSize: '13px',
                letterSpacing: '0.08em',
              }}
            >
              Send Request via WhatsApp
            </button>
            <a
              href="https://wa.me/971542370940"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans transition-colors duration-200 cursor-none"
              style={{ fontSize: '13px', color: '#A8A49E' }}
              aria-label="Or message Elite Class directly on WhatsApp without pre-fill"
            >
              or message directly →
            </a>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
