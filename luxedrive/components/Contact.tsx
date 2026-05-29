'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.trim())   e.email   = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <section id="contact" className="bg-[#F0EBE3] py-28 px-6 md:px-14">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-start">

        {/* left */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-[11px] font-display font-semibold tracking-[0.25em] uppercase text-gold mb-4"
          >
            <span className="w-6 h-px bg-gold" />
            Get in Touch
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-dark leading-tight mb-10"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            We Are Here<br />
            <em className="text-gold not-italic">For You</em>
          </motion.h2>

          <div className="space-y-6">
            {[
              { icon: Phone, label: 'Phone',   value: '+1 800 592 8762',          href: 'tel:+18005928762' },
              { icon: Mail,  label: 'Email',   value: 'reservations@luxedrive.com', href: 'mailto:reservations@luxedrive.com' },
              { icon: MapPin, label: 'Address', value: '432 Park Avenue, New York', href: '#' },
            ].map(({ icon: Icon, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-4 group cursor-none"
              >
                <div className="w-11 h-11 rounded-xl border border-border flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all duration-300">
                  <Icon size={15} className="text-mid group-hover:text-gold transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-[10px] font-display font-semibold tracking-widest uppercase text-mid mb-0.5">{label}</p>
                  <p className="text-sm font-sans text-dark group-hover:text-gold transition-colors duration-300">{value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center bg-white rounded-3xl p-16 border border-border"
            >
              <CheckCircle size={44} className="text-gold mb-5" />
              <h3 className="font-display font-bold text-2xl text-dark mb-2">Message Received</h3>
              <p className="text-sm font-sans text-mid">Your concierge will be in touch within two hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="bg-white rounded-3xl p-8 border border-border space-y-5">
              {[
                { id: 'name',  label: 'Full Name',  type: 'text',  placeholder: 'Your name',         key: 'name'  as const },
                { id: 'email', label: 'Email',       type: 'email', placeholder: 'you@example.com',   key: 'email' as const },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-[11px] font-display font-semibold tracking-[0.15em] uppercase text-mid mb-2">{f.label}</label>
                  <input
                    id={f.id}
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm(d => ({ ...d, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    aria-invalid={!!errors[f.key]}
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm font-sans text-dark placeholder:text-mid/50 outline-none transition-colors duration-200 ${errors[f.key] ? 'border-red-400 bg-red-50' : 'border-border bg-bg hover:border-mid focus:border-dark'}`}
                  />
                  {errors[f.key] && <p className="text-xs text-red-500 mt-1" role="alert">{errors[f.key]}</p>}
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-[11px] font-display font-semibold tracking-[0.15em] uppercase text-mid mb-2">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(d => ({ ...d, message: e.target.value }))}
                  placeholder="How can we assist you?"
                  aria-invalid={!!errors.message}
                  className={`w-full rounded-xl border px-4 py-3.5 text-sm font-sans text-dark placeholder:text-mid/50 outline-none resize-none transition-colors duration-200 ${errors.message ? 'border-red-400 bg-red-50' : 'border-border bg-bg hover:border-mid focus:border-dark'}`}
                />
                {errors.message && <p className="text-xs text-red-500 mt-1" role="alert">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : 'Send Message'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
