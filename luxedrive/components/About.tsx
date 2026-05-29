'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  { quote: 'The Ghost was delivered to my suite at The Ritz, perfectly detailed, with a personalised welcome note. This is how luxury should feel.', author: 'James R.', title: 'Private Equity Partner, London' },
  { quote: "I've used premium rental services across Monaco, Dubai, and Singapore. LuxeDrive surpasses them all. The Panamera was immaculate.", author: 'Sophia M.', title: 'Creative Director, New York' },
  { quote: 'When I needed a route change last-minute — handled without hesitation. That level of service is what keeps me coming back.', author: 'David K.', title: 'Tech Founder, San Francisco' },
  { quote: 'The chauffeur service for our client entertaining was flawless. Discreet, professional, and the vehicles were absolutely stunning.', author: 'Catherine L.', title: 'Managing Director, Chicago' },
]

export default function About() {
  const [cur, setCur] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} id="about" className="bg-[#F0EBE3] overflow-hidden">

      {/* ── brand story ── split layout ───────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-28 grid md:grid-cols-2 gap-16 items-center">

        {/* text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-[11px] font-display font-semibold tracking-[0.25em] uppercase text-gold mb-4"
          >
            <span className="w-6 h-px bg-gold" />
            Our Story
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-dark leading-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            A Legacy of<br />
            <em className="text-gold not-italic">Refined Taste</em>
          </motion.h2>

          <div className="space-y-4 text-sm font-sans text-mid leading-relaxed">
            {[
              'Founded in 2008 by automotive enthusiasts who believed the experience of a truly great car should be accessible to those who appreciate it most.',
              'Our collection is not assembled by algorithm or auction. Each vehicle is personally selected, maintained to manufacturer specification, and prepared to a concours standard.',
              'We do not merely rent automobiles. We curate experiences — ensuring every interaction, from reservation to final handover, exceeds your expectations.',
            ].map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.08 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* values */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {['Discretion', 'Excellence', 'Transparency'].map(v => (
              <div key={v} className="border border-border rounded-xl p-4 text-center">
                <p className="font-display font-semibold text-sm text-dark">{v}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* image with parallax */}
        <div className="relative h-[480px] md:h-[580px] overflow-hidden rounded-3xl">
          <motion.div style={{ y: imgY }} className="absolute inset-[-8%]">
            <Image
              src="https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1000&q=85"
              alt="Luxury automotive experience"
              fill
              className="object-cover"
              style={{ filter: 'saturate(0.82)' }}
            />
          </motion.div>
          {/* overlay label */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-4">
            <p className="text-[10px] font-display font-semibold tracking-widest uppercase text-mid mb-0.5">Our Guarantee</p>
            <p className="text-xs font-sans text-dark leading-relaxed">
              If your vehicle does not meet our standards, we replace it within 2 hours — or the rental is complimentary.
            </p>
          </div>
        </div>
      </div>

      {/* ── testimonials ──────────────────────────────── */}
      <div className="bg-[#0D0B09] py-24 px-6 md:px-14">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-[11px] font-display font-semibold tracking-[0.3em] uppercase text-[#D4A84E] mb-16"
          >
            Client Voices
          </motion.p>

          <div className="relative min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={cur}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <blockquote
                  className="font-display font-light text-white leading-snug mb-8 italic"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}
                >
                  &ldquo;{testimonials[cur].quote}&rdquo;
                </blockquote>
                <p className="font-display font-semibold text-sm text-white">{testimonials[cur].author}</p>
                <p className="text-xs font-sans text-white/40 mt-1 tracking-widest">{testimonials[cur].title}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="flex items-center justify-center gap-5 mt-12">
            <button
              onClick={() => setCur(i => (i === 0 ? testimonials.length - 1 : i - 1))}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all duration-300 cursor-none"
              aria-label="Previous"
            >
              <ChevronLeft size={15} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCur(i)}
                  className={`h-px rounded-full transition-all duration-300 cursor-none ${i === cur ? 'w-8 bg-[#D4A84E]' : 'w-4 bg-white/20'}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCur(i => (i === testimonials.length - 1 ? 0 : i + 1))}
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all duration-300 cursor-none"
              aria-label="Next"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
