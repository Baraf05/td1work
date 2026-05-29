'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'

export default function CtaStrip() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <section ref={ref} className="relative overflow-hidden h-[70vh] flex items-center">
      {/* parallax image */}
      <motion.div style={{ y: imgY }} className="absolute inset-[-10%] z-0">
        <Image
          src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=85"
          alt="Luxury SUV on the road"
          fill
          className="object-cover"
          style={{ filter: 'brightness(0.35) saturate(0.6)' }}
        />
      </motion.div>

      {/* gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0D0B09]/80 via-[#0D0B09]/40 to-transparent" />

      {/* content */}
      <div className="relative z-20 px-6 md:px-14 max-w-7xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-[11px] font-display font-semibold tracking-[0.25em] uppercase text-[#D4A84E] mb-5"
        >
          <span className="w-6 h-px bg-[#D4A84E]" />
          Ready to Begin?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-white leading-tight mb-8"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          Your Journey<br />
          <em className="text-[#D4A84E] not-italic">Awaits.</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#D4A84E] text-[#0D0B09] font-display font-bold text-sm tracking-wide hover:bg-[#E8C070] transition-all duration-300 cursor-none group"
          >
            Reserve Now
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href="tel:+18005928762"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/20 text-white font-display font-semibold text-sm tracking-wide hover:bg-white/8 hover:border-white/40 transition-all duration-300 cursor-none"
          >
            <Phone size={14} />
            Speak to Concierge
          </a>
        </motion.div>
      </div>
    </section>
  )
}
