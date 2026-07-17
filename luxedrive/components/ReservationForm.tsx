'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Car, Check, ChevronRight, Plane } from 'lucide-react'
import { vehicles } from '@/lib/vehicles'

type Step = 1 | 2 | 3

const STEP_LABELS = ['Journey', 'Vehicle', 'Contact'] as const

type FormData = {
  pickup: string; dropoff: string; date: string; time: string; passengers: string
  vehicle: string; name: string; phone: string; email: string; extras: string
}

const EMPTY: FormData = {
  pickup: '', dropoff: '', date: '', time: '', passengers: '',
  vehicle: '', name: '', phone: '', email: '', extras: '',
}

function buildWAMessage(f: FormData): string {
  return `🚘 *New request — Elite Class*\n━━━━━━━━━━━━━━━━\n👤 *Name:* ${f.name}\n📞 *Phone:* ${f.phone}${f.email ? `\n📧 *Email:* ${f.email}` : ''}\n━━━━━━━━━━━━━━━━\n🗓 *Date:* ${f.date}\n🕐 *Time:* ${f.time}\n🚗 *Vehicle:* ${f.vehicle || 'No preference'}\n👥 *Passengers:* ${f.passengers}\n━━━━━━━━━━━━━━━━\n📍 *Pickup:* ${f.pickup}\n🏁 *Drop-off:* ${f.dropoff}${f.extras ? `\n✈️ *Notes:* ${f.extras}` : ''}\n━━━━━━━━━━━━━━━━\n_Sent from eliteclasslimo.com_`
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '0.5px solid rgba(201,169,110,0.12)',
  padding: '14px 0', fontSize: '14px', color: '#F5F2EE',
  fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 0.2s',
}

function StyledInput({ id, label, value, onChange, type='text', placeholder, required, error, autoComplete }: {
  id: string; label: string; value: string; onChange: (v:string) => void
  type?: string; placeholder?: string; required?: boolean; error?: string; autoComplete?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="mb-6">
      <label htmlFor={id} style={{ display:'block', fontSize:'10px', letterSpacing:'0.14em', color:'#5A5855', textTransform:'uppercase', marginBottom:'8px' }}>
        {label}{required && <span style={{ color:'#C9A96E', marginLeft:'4px' }} aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      <input
        id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
        required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle, borderBottomColor: error ? '#C9A96E' : focused ? 'rgba(201,169,110,0.4)' : 'rgba(201,169,110,0.12)' }}
      />
      {error && <p id={`${id}-err`} role="alert" className="flex items-center gap-1.5 mt-1.5 font-sans" style={{ fontSize:'12px', color:'#C9A96E' }}><AlertCircle size={11} aria-hidden="true"/>{error}</p>}
    </div>
  )
}

// Progress indicator
function Progress({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-0 mb-10" role="list" aria-label="Form progress">
      {STEP_LABELS.map((label, i) => {
        const n = (i + 1) as Step
        const done = step > n; const active = step === n
        return (
          <div key={label} className="flex items-center" role="listitem">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? '#C9A96E' : active ? 'rgba(201,169,110,0.15)' : 'transparent',
                  border: `0.5px solid ${done || active ? '#C9A96E' : 'rgba(255,255,255,0.08)'}`,
                  fontSize: '11px', color: done ? '#0A0A0B' : active ? '#C9A96E' : '#5A5855',
                  fontFamily: 'inherit', flexShrink: 0,
                }}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check size={11} /> : n}
              </div>
              <span style={{ fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color: active ? '#F5F2EE' : done ? '#C9A96E' : '#5A5855' }}>
                {label}
              </span>
            </div>
            {i < 2 && <div style={{ width: '32px', height: '0.5px', background: step > n ? '#C9A96E' : 'rgba(201,169,110,0.12)', margin: '0 12px', flexShrink: 0 }} aria-hidden="true" />}
          </div>
        )
      })}
    </div>
  )
}

export default function ReservationForm() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const pickupRef = useRef<HTMLInputElement>(null)
  const dropoffRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormData) => (v: string) => setForm(f => ({ ...f, [key]: v }))

  const isAirport = form.pickup.toLowerCase().includes('airport') || form.pickup.toLowerCase().includes('dxb') || form.pickup.toLowerCase().includes('dwc') || form.dropoff.toLowerCase().includes('airport') || form.dropoff.toLowerCase().includes('dxb') || form.dropoff.toLowerCase().includes('dwc')

  // Google Places init
  useEffect(() => {
    const g = (window as Window & typeof globalThis & { google?: { maps?: { places?: { Autocomplete?: new (el: HTMLInputElement, opts: object) => { addListener: (e:string, cb:()=>void)=>void; getPlace: ()=>{formatted_address?:string;name?:string} } } } } }).google
    if (!g?.maps?.places?.Autocomplete) return
    const opts = { componentRestrictions: { country: 'ae' }, fields: ['formatted_address','name'] }
    if (pickupRef.current) {
      const ac = new g.maps.places.Autocomplete(pickupRef.current, opts)
      ac.addListener('place_changed', () => { const p = ac.getPlace(); set('pickup')(p.formatted_address || p.name || '') })
    }
    if (dropoffRef.current) {
      const ac = new g.maps.places.Autocomplete(dropoffRef.current, opts)
      ac.addListener('place_changed', () => { const p = ac.getPlace(); set('dropoff')(p.formatted_address || p.name || '') })
    }
  }, [step])

  // Sticky bar on 60% scroll
  useEffect(() => {
    const fn = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setShowSticky(pct > 0.6)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const validateStep1 = (): boolean => {
    const e: Partial<FormData> = {}
    if (!form.pickup.trim()) e.pickup = 'Required'
    if (!form.dropoff.trim()) e.dropoff = 'Required'
    if (!form.date) e.date = 'Required'
    if (!form.time) e.time = 'Required'
    if (!form.passengers) e.passengers = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = (): boolean => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return
    setErrors({})
    setStep(s => (s < 3 ? (s + 1) as Step : s))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep3()) return
    setErrors({})
    const msg = buildWAMessage(form)
    window.open(`https://wa.me/971542370940?text=${encodeURIComponent(msg)}`, '_blank')
    setSubmitted(true)
  }

  const scrollToForm = () => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })

  // Summary
  const Summary = () => (
    <div style={{ border: '0.5px solid rgba(201,169,110,0.12)', padding: '20px' }}>
      <p className="font-sans mb-4" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#3A3836', textTransform: 'uppercase' }}>Request summary</p>
      {form.date && <p className="font-sans mb-1" style={{ fontSize: '13px', color: '#A8A49E' }}>{form.date}{form.time ? ` at ${form.time}` : ''}</p>}
      {form.pickup && <p className="font-sans mb-1" style={{ fontSize: '13px', color: '#A8A49E' }}>From: {form.pickup}</p>}
      {form.dropoff && <p className="font-sans mb-1" style={{ fontSize: '13px', color: '#A8A49E' }}>To: {form.dropoff}</p>}
      {form.passengers && <p className="font-sans mb-1" style={{ fontSize: '13px', color: '#A8A49E' }}>{form.passengers} passenger{form.passengers !== '1' ? 's' : ''}</p>}
      {form.vehicle && <p className="font-sans mt-3 pt-3 font-medium" style={{ fontSize: '13px', color: '#C9A96E', borderTop: '0.5px solid rgba(201,169,110,0.08)' }}>{form.vehicle}</p>}
    </div>
  )

  return (
    <>
      <section id="reservation" className="py-24 px-6 md:px-14" style={{ background: '#0A0A0B' }}>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }} className="eyebrow mb-4">
              <span className="w-6 h-px bg-[#C9A96E] opacity-50 shrink-0" aria-hidden="true" />
              Reservation
            </motion.p>
            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:0.08, ease:[0.16,1,0.3,1] }} className="font-serif font-normal leading-tight" style={{ fontSize:'clamp(2rem, 5vw, 3.5rem)', color:'#F5F2EE' }}>
              Reserve your{' '}<em className="not-italic" style={{ color:'#C9A96E' }}>transfer.</em>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

            {/* Form column */}
            <div>
              <Progress step={step} />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="done" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.4 }} className="py-16 text-center">
                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-6" style={{ border: '0.5px solid rgba(201,169,110,0.3)', color:'#C9A96E' }}>
                      <Check size={20} />
                    </div>
                    <p className="font-serif font-normal mb-2" style={{ fontSize:'22px', color:'#F5F2EE' }}>Request received.</p>
                    <p className="font-sans" style={{ fontSize:'14px', color:'#A8A49E' }}>We reply within minutes, 24/7.</p>
                    <a href="https://wa.me/971542370940" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 cursor-none font-sans transition-opacity hover:opacity-70" style={{ fontSize:'13px', color:'#C9A96E' }}>
                      Continue on WhatsApp →
                    </a>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div key="step1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                    <div>
                      <label htmlFor="pickup" style={{ display:'block', fontSize:'10px', letterSpacing:'0.14em', color:'#5A5855', textTransform:'uppercase', marginBottom:'8px' }}>
                        Pickup Location <span style={{ color:'#C9A96E' }} aria-hidden="true">*</span>
                      </label>
                      <input ref={pickupRef} id="pickup" type="text" value={form.pickup} onChange={e => set('pickup')(e.target.value)} placeholder="e.g. Burj Al Arab" aria-invalid={!!errors.pickup}
                        style={{ ...inputStyle, borderBottomColor: errors.pickup ? '#C9A96E' : 'rgba(201,169,110,0.12)' }} className="mb-1" />
                      {errors.pickup && <p role="alert" className="flex items-center gap-1.5 mb-5 font-sans" style={{ fontSize:'12px', color:'#C9A96E' }}><AlertCircle size={11} aria-hidden="true"/>{errors.pickup}</p>}
                      <div className="mb-6" />
                    </div>
                    <div>
                      <label htmlFor="dropoff" style={{ display:'block', fontSize:'10px', letterSpacing:'0.14em', color:'#5A5855', textTransform:'uppercase', marginBottom:'8px' }}>
                        Drop-off Location <span style={{ color:'#C9A96E' }} aria-hidden="true">*</span>
                      </label>
                      <input ref={dropoffRef} id="dropoff" type="text" value={form.dropoff} onChange={e => set('dropoff')(e.target.value)} placeholder="e.g. DXB Terminal 3" aria-invalid={!!errors.dropoff}
                        style={{ ...inputStyle, borderBottomColor: errors.dropoff ? '#C9A96E' : 'rgba(201,169,110,0.12)' }} className="mb-1" />
                      {errors.dropoff && <p role="alert" className="flex items-center gap-1.5 mb-5 font-sans" style={{ fontSize:'12px', color:'#C9A96E' }}><AlertCircle size={11} aria-hidden="true"/>{errors.dropoff}</p>}
                      <div className="mb-6" />
                    </div>
                    <div className="grid grid-cols-2 gap-8 mb-6">
                      <div>
                        <label htmlFor="date" style={{ display:'block', fontSize:'10px', letterSpacing:'0.14em', color:'#5A5855', textTransform:'uppercase', marginBottom:'8px' }}>Date <span style={{ color:'#C9A96E' }} aria-hidden="true">*</span></label>
                        <input id="date" type="date" lang="en" value={form.date} onChange={e => set('date')(e.target.value)} aria-invalid={!!errors.date} style={{ ...inputStyle, colorScheme:'dark', borderBottomColor: errors.date ? '#C9A96E' : 'rgba(201,169,110,0.12)' }} />
                        {errors.date && <p role="alert" className="mt-1 font-sans" style={{ fontSize:'12px', color:'#C9A96E' }}>{errors.date}</p>}
                      </div>
                      <div>
                        <label htmlFor="time" style={{ display:'block', fontSize:'10px', letterSpacing:'0.14em', color:'#5A5855', textTransform:'uppercase', marginBottom:'8px' }}>Time <span style={{ color:'#C9A96E' }} aria-hidden="true">*</span></label>
                        <input id="time" type="time" value={form.time} onChange={e => set('time')(e.target.value)} aria-invalid={!!errors.time} style={{ ...inputStyle, colorScheme:'dark', borderBottomColor: errors.time ? '#C9A96E' : 'rgba(201,169,110,0.12)' }} />
                        {errors.time && <p role="alert" className="mt-1 font-sans" style={{ fontSize:'12px', color:'#C9A96E' }}>{errors.time}</p>}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="passengers" style={{ display:'block', fontSize:'10px', letterSpacing:'0.14em', color:'#5A5855', textTransform:'uppercase', marginBottom:'8px' }}>Passengers <span style={{ color:'#C9A96E' }} aria-hidden="true">*</span></label>
                      <select id="passengers" value={form.passengers} onChange={e => set('passengers')(e.target.value)} aria-invalid={!!errors.passengers}
                        style={{ ...inputStyle, appearance:'none', colorScheme:'dark', background:'transparent', cursor:'pointer', borderBottomColor: errors.passengers ? '#C9A96E' : 'rgba(201,169,110,0.12)' }}>
                        <option value="">Select</option>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={String(n)}>{n}</option>)}
                        <option value="7+">7+</option>
                      </select>
                      {errors.passengers && <p role="alert" className="mt-1 font-sans" style={{ fontSize:'12px', color:'#C9A96E' }}>{errors.passengers}</p>}
                    </div>
                    <AnimatePresence>
                      {isAirport && (
                        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }} className="overflow-hidden mb-6">
                          <label htmlFor="flightno" style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'10px', letterSpacing:'0.14em', color:'#5A5855', textTransform:'uppercase', marginBottom:'8px' }}>
                            <Plane size={11} style={{ color:'#C9A96E' }} aria-hidden="true" />
                            Flight Number
                          </label>
                          <input id="flightno" type="text" value={form.extras} onChange={e => set('extras')(e.target.value)} placeholder="e.g. EK 203" style={{ ...inputStyle }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button onClick={nextStep} className="flex items-center gap-2 cursor-none font-sans font-medium transition-opacity hover:opacity-90" style={{ background:'#C9A96E', color:'#0A0A0B', padding:'14px 32px', fontSize:'13px', letterSpacing:'0.08em', border:'none' }}>
                      Next: Vehicle <ChevronRight size={14} />
                    </button>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div key="step2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                    <p className="font-sans mb-6" style={{ fontSize:'13px', color:'#A8A49E' }}>Select a vehicle or continue without preference.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {[{ id:'', name:'No preference', role:'Let us recommend' }, ...vehicles.slice(0,8)].map(v => (
                        <button
                          key={v.id}
                          onClick={() => set('vehicle')(v.name)}
                          className="flex items-center gap-3 text-left cursor-none transition-all duration-200 p-4"
                          style={{
                            border: form.vehicle === v.name ? '0.5px solid #C9A96E' : '0.5px solid rgba(201,169,110,0.1)',
                            background: form.vehicle === v.name ? 'rgba(201,169,110,0.06)' : '#111113',
                          }}
                          aria-pressed={form.vehicle === v.name}
                        >
                          <div className="flex items-center justify-center shrink-0" style={{ width:'36px', height:'36px', border: '0.5px solid rgba(201,169,110,0.1)', background:'#0A0A0B' }}>
                            <Car size={16} style={{ color: form.vehicle === v.name ? '#C9A96E' : '#3A3836' }} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-sans" style={{ fontSize:'13px', color: form.vehicle === v.name ? '#F5F2EE' : '#A8A49E' }}>{v.name}</p>
                            {'role' in v && <p className="font-sans" style={{ fontSize:'11px', color:'#5A5855' }}>{v.role}</p>}
                          </div>
                          {form.vehicle === v.name && <Check size={12} style={{ color:'#C9A96E', marginLeft:'auto', flexShrink:0 }} />}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setStep(1)} className="cursor-none font-sans transition-colors hover:text-[#F5F2EE]" style={{ fontSize:'13px', color:'#5A5855', background:'none', border:'none', padding:0 }}>← Back</button>
                      <button onClick={nextStep} className="flex items-center gap-2 cursor-none font-sans font-medium transition-opacity hover:opacity-90" style={{ background:'#C9A96E', color:'#0A0A0B', padding:'14px 32px', fontSize:'13px', letterSpacing:'0.08em', border:'none' }}>
                        Next: Contact <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="step3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }} onSubmit={handleSubmit} noValidate>
                    <StyledInput id="name" label="Full Name" value={form.name} onChange={set('name')} required error={errors.name} autoComplete="name" />
                    <StyledInput id="phone" label="Phone (WhatsApp)" value={form.phone} onChange={set('phone')} type="tel" placeholder="+971 5x xxx xxxx" required error={errors.phone} autoComplete="tel" />
                    <StyledInput id="email" label="Email (optional)" value={form.email} onChange={set('email')} type="email" placeholder="you@example.com" autoComplete="email" />
                    {!isAirport && <StyledInput id="extras" label="Special Request (optional)" value={form.extras} onChange={set('extras')} placeholder="Child seat, name board, specific route…" />}
                    <div className="flex items-center gap-4 mt-8">
                      <button type="button" onClick={() => setStep(2)} className="cursor-none font-sans transition-colors hover:text-[#F5F2EE]" style={{ fontSize:'13px', color:'#5A5855', background:'none', border:'none', padding:0 }}>← Back</button>
                      <button type="submit" className="cursor-none font-sans font-medium transition-opacity hover:opacity-90" style={{ background:'#C9A96E', color:'#0A0A0B', padding:'14px 32px', fontSize:'13px', letterSpacing:'0.08em', border:'none' }}>
                        Send request via WhatsApp
                      </button>
                    </div>
                    <p className="font-sans mt-4" style={{ fontSize:'12px', color:'#3A3836' }}>
                      We reply within minutes, 24/7. Your details are never shared.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Summary sidebar — desktop */}
            <div className="hidden lg:block">
              <div style={{ position: 'sticky', top: '100px' }}>
                <Summary />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <AnimatePresence>
        {showSticky && !submitted && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 inset-x-0 z-50 flex md:hidden"
            style={{ padding: '0 0 env(safe-area-inset-bottom)', background: '#0A0A0B', borderTop: '0.5px solid rgba(201,169,110,0.15)' }}
          >
            <button
              onClick={scrollToForm}
              className="flex-1 cursor-none font-sans font-medium"
              style={{ background:'#C9A96E', color:'#0A0A0B', padding:'16px', fontSize:'13px', letterSpacing:'0.08em', border:'none' }}
            >
              Reserve →
            </button>
            <a
              href="https://wa.me/971542370940"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center cursor-none"
              style={{ width:'60px', background:'#111113', borderLeft:'0.5px solid rgba(201,169,110,0.12)' }}
              aria-label="WhatsApp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A96E" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
