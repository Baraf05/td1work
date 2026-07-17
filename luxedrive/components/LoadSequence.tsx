'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadSequence() {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const already = sessionStorage.getItem('ec_intro_done')
    if (already) return
    setVisible(true)
    sessionStorage.setItem('ec_intro_done', '1')
    // Phase timeline: hairline(400ms), wordmark(600ms), subtitle(900ms), fade(1800ms), done(2200ms)
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 500)
    const t3 = setTimeout(() => setPhase(3), 900)
    const t4 = setTimeout(() => setPhase(4), 1500)
    const t5 = setTimeout(() => { setVisible(false) }, 2200)
    return () => { [t1,t2,t3,t4,t5].forEach(clearTimeout) }
  }, [])

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        key="load"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setVisible(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#0A0A0B',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'default',
        }}
        aria-label="Loading Elite Class"
        role="status"
      >
        {/* Gold hairline sweep */}
        <motion.div
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={phase >= 1 ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.77, 0, 0.18, 1] }}
          style={{
            position: 'absolute', top: '50%', left: 0, right: 0, height: '0.5px',
            background: 'linear-gradient(90deg, transparent, #C9A96E 30%, #C9A96E 70%, transparent)',
            transform: 'translateY(-50%)',
          }}
        />

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            letterSpacing: '0.3em',
            color: '#F5F2EE',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Elite{' '}
          <span style={{ color: '#C9A96E' }}>Class</span>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={phase >= 3 ? { opacity: 1, letterSpacing: '0.25em' } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: 'rgba(201,169,110,0.6)',
            textTransform: 'uppercase',
            marginTop: '16px',
          }}
        >
          Premium Chauffeur · Dubai
        </motion.div>

        {/* Skip hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            position: 'absolute', bottom: '40px',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: '10px', letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase',
          }}
        >
          Tap anywhere to skip
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
