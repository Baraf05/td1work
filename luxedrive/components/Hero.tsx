'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'

const WORD_VARIANTS = {
  hidden: { y: '105%', rotate: 2 },
  show:   { y: '0%',   rotate: 0 },
}
const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
}

function Word({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <span style={{ overflow: 'hidden', display: 'inline-block', verticalAlign: 'bottom' }}>
      <motion.span
        variants={WORD_VARIANTS}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'block', willChange: 'transform', ...style }}
      >
        {text}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY    = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['0%', '18%'])
  const textY   = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['0%', '8%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], shouldReduce ? [1, 1] : [1, 0])

  /* Respect prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches && videoRef.current) {
      videoRef.current.pause()
      setPlaying(false)
    }
  }, [])

  const toggleVideo = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else         { v.play();  setPlaying(true)  }
  }

  const scrollToReservation = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-[#0A0A0B] flex flex-col">

      {/* ── Video / poster background ──────────────────── */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          id="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&q=85"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4"  type="video/mp4"  />
        </video>
        {/* Brightness treatment on poster fallback */}
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,11,0.35)' }} />
      </motion.div>

      {/* ── Persistent directional overlay (WCAG 1.4.3) ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(10,10,11,0.75) 0%, rgba(10,10,11,0.4) 55%, rgba(10,10,11,0.15) 100%)',
        }}
      />
      {/* Bottom fade into next section */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0B] pointer-events-none" />

      {/* ── Video pause / play ─────────────────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        id="hero-pause"
        onClick={toggleVideo}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
        className="absolute top-20 right-5 md:right-10 z-30 w-9 h-9 flex items-center justify-center cursor-none transition-colors duration-200 hover:border-[rgba(201,169,110,0.5)]"
        style={{
          background: 'rgba(10,10,11,0.5)',
          border: '0.5px solid rgba(201,169,110,0.2)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {playing
          ? <Pause size={12} className="text-[#A8A49E]" />
          : <Play  size={12} className="text-[#A8A49E]" />}
      </motion.button>

      {/* ── Main content ───────────────────────────────── */}
      <motion.div
        style={{ y: textY, opacity: fadeOut }}
        className="relative z-20 flex flex-col justify-end flex-1 px-6 md:px-14 pb-20 pt-28 md:pt-36"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-7 h-px bg-[#C9A96E] opacity-60" aria-hidden="true" />
          <span
            className="font-sans text-[10px] tracking-[0.2em] uppercase"
            style={{ color: '#C9A96E' }}
          >
            Private Chauffeur · Dubai
          </span>
        </motion.div>

        {/* H1 word reveal */}
        <motion.h1
          variants={CONTAINER}
          initial="hidden"
          animate="show"
          className="font-serif font-normal text-[#F5F2EE] leading-[0.92] tracking-tight mb-10"
          style={{ fontSize: 'clamp(3.2rem, 9vw, 8rem)' }}
        >
          <div><Word text="The" />{' '}<Word text="ground" />{' '}<Word text="standard." /></div>
          <div>
            <Word text="For" />{' '}
            <Word text="Dubai's" style={{ color: '#C9A96E', fontStyle: 'italic' }} />{' '}
            <Word text="most" />
          </div>
          <div><Word text="demanding" />{' '}<Word text="guests." /></div>
        </motion.h1>

        {/* Subtitle + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 max-w-3xl"
        >
          <p className="text-sm font-sans text-[#A8A49E] leading-relaxed max-w-xs">
            Trusted by touring artists, executives, and the guests who prefer not to be recognised.
          </p>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="#reservation"
              onClick={scrollToReservation}
              className="btn-gold"
            >
              Reserve
            </a>
            <a
              href="https://wa.me/971542370940?text=Hello%20Elite%20Class%2C%20I%27d%20like%20to%20inquire%20about%20a%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-hero"
              aria-label="Contact Elite Class on WhatsApp"
            >
              {/* WhatsApp icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
