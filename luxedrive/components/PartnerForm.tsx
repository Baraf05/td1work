'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Check } from 'lucide-react'

type PartnerData = {
  company: string
  role: string
  property: string
  volume: string
  contact: string
  message: string
}

const EMPTY: PartnerData = {
  company: '', role: '', property: '', volume: '', contact: '', message: '',
}

const VOLUME_OPTIONS = ['<10 transfers/month', '10–50 transfers/month', '50+ transfers/month'] as const

function buildWAMessage(f: PartnerData): string {
  return `🤝 *Partner enquiry — Elite Class*\n━━━━━━━━━━━━━━━━\n🏢 *Company:* ${f.company}\n👤 *Role:* ${f.role}\n🏨 *Property / org:* ${f.property}\n📈 *Monthly volume:* ${f.volume || 'Not specified'}\n📞 *Contact:* ${f.contact}${f.message ? `\n📝 *Message:* ${f.message}` : ''}\n━━━━━━━━━━━━━━━━\n_Partner access request — eliteclasslimo.com_`
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '0.5px solid rgba(201,169,110,0.12)',
  padding: '14px 0', fontSize: '14px', color: '#F5F2EE',
  fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 0.2s',
}

function Field({ id, label, value, onChange, type = 'text', placeholder, required, error, autoComplete }: {
  id: string; label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean; error?: string; autoComplete?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="mb-6">
      <label htmlFor={id} style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', textTransform: 'uppercase', marginBottom: '8px' }}>
        {label}{required && <span style={{ color: '#C9A96E', marginLeft: '4px' }} aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      <input
        id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
        required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle, borderBottomColor: error ? '#C9A96E' : focused ? 'rgba(201,169,110,0.4)' : 'rgba(201,169,110,0.12)' }}
      />
      {error && <p id={`${id}-err`} role="alert" className="flex items-center gap-1.5 mt-1.5 font-sans" style={{ fontSize: '12px', color: '#C9A96E' }}><AlertCircle size={11} aria-hidden="true" />{error}</p>}
    </div>
  )
}

export default function PartnerForm() {
  const [form, setForm] = useState<PartnerData>(EMPTY)
  const [errors, setErrors] = useState<Partial<PartnerData>>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof PartnerData) => (v: string) => setForm(f => ({ ...f, [key]: v }))

  const validate = (): boolean => {
    const e: Partial<PartnerData> = {}
    if (!form.company.trim()) e.company = 'Required'
    if (!form.role.trim()) e.role = 'Required'
    if (!form.property.trim()) e.property = 'Required'
    if (!form.contact.trim()) e.contact = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setErrors({})
    const msg = buildWAMessage(form)
    window.open(`https://wa.me/971542370940?text=${encodeURIComponent(msg)}`, '_blank')
    setSubmitted(true)
  }

  return (
    <section id="partners-access" className="py-24 px-6 md:px-14" style={{ background: '#111113', borderTop: '0.5px solid rgba(201,169,110,0.06)' }} aria-labelledby="partner-form-title">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="eyebrow mb-4">
            <span className="w-6 h-px bg-[#C9A96E] opacity-50 shrink-0" aria-hidden="true" />
            Partner Access
          </motion.p>
          <motion.h2
            id="partner-form-title"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-normal leading-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: '#F5F2EE' }}
          >
            Open a{' '}<em className="not-italic" style={{ color: '#C9A96E' }}>partner account.</em>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.14 }} className="font-sans leading-relaxed" style={{ fontSize: '14px', color: '#A8A49E' }}>
            For hotels, venues and corporate concierge teams. Tell us a little about your requirement and our partnerships desk will take it from there.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="py-16 text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-6" style={{ border: '0.5px solid rgba(201,169,110,0.3)', color: '#C9A96E' }}>
                <Check size={20} />
              </div>
              <p className="font-serif font-normal mb-2" style={{ fontSize: '22px', color: '#F5F2EE' }}>Enquiry received.</p>
              <p className="font-sans" style={{ fontSize: '14px', color: '#A8A49E' }}>Our partnerships team will reach out within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <Field id="p-company" label="Company name" value={form.company} onChange={set('company')} required error={errors.company} autoComplete="organization" />
                <Field id="p-role" label="Your role" value={form.role} onChange={set('role')} required error={errors.role} autoComplete="organization-title" />
              </div>
              <Field id="p-property" label="Property / organization" value={form.property} onChange={set('property')} required error={errors.property} placeholder="e.g. The Ritz-Carlton, DXB Concierge" />

              <div className="mb-6">
                <label htmlFor="p-volume" style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Expected monthly volume
                </label>
                <select
                  id="p-volume" value={form.volume} onChange={e => set('volume')(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none', colorScheme: 'dark', cursor: 'pointer' }}
                >
                  <option value="">Select</option>
                  {VOLUME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <Field id="p-contact" label="Contact (phone, WhatsApp preferred)" value={form.contact} onChange={set('contact')} type="tel" placeholder="+971 5x xxx xxxx" required error={errors.contact} autoComplete="tel" />

              <div className="mb-6">
                <label htmlFor="p-message" style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', color: '#5A5855', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Message (optional)
                </label>
                <textarea
                  id="p-message" value={form.message} onChange={e => set('message')(e.target.value)} rows={3}
                  placeholder="Anything we should know about your requirement…"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="cursor-none font-sans font-medium transition-opacity hover:opacity-90" style={{ background: '#C9A96E', color: '#0A0A0B', padding: '14px 32px', fontSize: '13px', letterSpacing: '0.08em', border: 'none' }}>
                Request partner access via WhatsApp
              </button>
              <p className="font-sans mt-4" style={{ fontSize: '12px', color: '#3A3836' }}>
                Our partnerships team will reach out within 24 hours. Your details are never shared.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
