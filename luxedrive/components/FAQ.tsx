'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'What areas do you cover?',
    a: 'We operate across Dubai and the wider UAE — Abu Dhabi, Sharjah, Ras Al Khaimah. Cross-border transfers to Oman are available with 24 hours\' notice.',
  },
  {
    q: 'How do I pay? When do I pay?',
    a: 'Payment is arranged directly — cash (AED, USD, EUR) or bank transfer before departure. No online payment is required.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Cancellations made more than 4 hours before pickup are fully refunded. Within 4 hours, 50% of the agreed rate applies.',
  },
  {
    q: 'Can you provide child seats?',
    a: 'Yes. Please specify the age and weight of the child in your request. Child seats are provided at no extra charge with advance notice.',
  },
  {
    q: 'Do chauffeurs wait at the airport?',
    a: 'Yes. Your chauffeur tracks your flight in real time and waits up to 60 minutes after landing at no extra charge.',
  },
  {
    q: 'Can I book for travel outside Dubai?',
    a: 'Yes — Abu Dhabi, Sharjah, and cross-border to Oman with notice. Contact us for bespoke itineraries.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section id="faq" className="py-24 px-6 md:px-14" style={{ background: '#111113' }}>
      <div className="max-w-3xl mx-auto">

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
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-normal leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F5F2EE' }}
          >
            Good to{' '}
            <em className="not-italic" style={{ color: '#C9A96E' }}>know.</em>
          </motion.h2>
        </div>

        {/* Accordion */}
        <div
          style={{ borderTop: '0.5px solid rgba(201,169,110,0.12)' }}
          role="list"
        >
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                role="listitem"
                style={{ borderBottom: '0.5px solid rgba(201,169,110,0.12)' }}
              >
                <button
                  id={`faqbtn${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-none group focus-visible:outline-[#C9A96E]"
                >
                  <h3
                    className="font-serif font-normal transition-colors duration-200"
                    style={{
                      fontSize: '18px',
                      color: isOpen ? '#C9A96E' : '#F5F2EE',
                    }}
                  >
                    {faq.q}
                  </h3>
                  <span
                    className="shrink-0 w-7 h-7 flex items-center justify-center transition-colors duration-200"
                    style={{
                      border: '0.5px solid rgba(201,169,110,0.2)',
                      color: '#C9A96E',
                    }}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq${i}`}
                      role="region"
                      aria-labelledby={`faqbtn${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p
                        className="font-sans leading-relaxed pb-6 pr-10"
                        style={{ fontSize: '14px', color: '#A8A49E' }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
