'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Fleet',        href: '#fleet',            id: 'fleet',            muted: false },
  { label: 'Services',     href: '#services',         id: 'services',         muted: false },
  { label: 'Our Standard', href: '#our-standard',     id: 'our-standard',     muted: false },
  { label: 'Partners',     href: '#partners-access',  id: 'partners-access',  muted: true  },
]

// All section IDs we want to observe for the active indicator
const OBSERVED_IDS = ['fleet', 'services', 'partners', 'partners-access', 'our-standard', 'reservation', 'faq']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const reduce = useReducedMotion()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Active-section tracking via IntersectionObserver
  useEffect(() => {
    const els = OBSERVED_IDS
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const visible = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio)
          else visible.delete(e.target.id)
        }
        let best = ''
        let bestRatio = 0
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) { bestRatio = ratio; best = id }
        }
        // Map the Partners marketing section to the muted "Partners" nav link
        if (best === 'partners') best = 'partners-access'
        if (best) setActiveId(best)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const handleReserve = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleAnchor = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <nav
          aria-label="Main navigation"
          className={`flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${
            scrolled
              ? 'py-3 border-b border-[rgba(255,255,255,0.06)]'
              : 'py-5 border-b border-transparent'
          }`}
          style={{
            transitionTimingFunction: 'ease',
            background: scrolled ? 'rgba(0,0,0,0.75)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          }}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0 cursor-none" aria-label="Elite Class Dubai — home">
            <div className="flex items-center gap-2.5">
              <span
                className="flex items-center justify-center shrink-0 font-display font-bold"
                style={{
                  width: '32px', height: '32px',
                  border: '1px solid rgba(201,169,110,0.4)',
                  fontSize: '12px', letterSpacing: '0.02em', color: '#C9A96E',
                }}
                aria-hidden="true"
              >
                EC
              </span>
              <span className="font-display font-bold text-[11px] tracking-widest text-white uppercase whitespace-nowrap">
                Elite Class
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => {
              const active = activeId === l.id
              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleAnchor(e, l.id)}
                  aria-current={active ? 'true' : undefined}
                  className={`relative font-display font-medium text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 cursor-none focus-visible:outline-[#C9A96E] pb-1.5 ${
                    l.muted
                      ? active ? 'text-white' : 'text-[rgba(255,255,255,0.3)] hover:text-white'
                      : active ? 'text-white' : 'text-[rgba(255,255,255,0.45)] hover:text-white'
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full will-change-transform"
                      style={{ width: '4px', height: '4px', background: '#C9A96E' }}
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </div>

          {/* Reserve CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#reservation"
              onClick={handleReserve}
              className="hidden md:inline-flex items-center gap-1.5 font-display font-semibold uppercase cursor-none focus-visible:outline-[#C9A96E]"
              style={{
                background: '#C9A96E', color: '#000000', borderRadius: '999px',
                padding: '10px 20px', fontSize: '12px', letterSpacing: '0.04em',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#D4B87A'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#C9A96E'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Reserve
            </a>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 text-[rgba(255,255,255,0.6)] hover:text-white transition-colors cursor-none"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 z-40 border-b border-[rgba(255,255,255,0.06)] px-6 py-6 md:hidden"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleAnchor(e, l.id)}
                  className={`font-display font-medium text-xs tracking-[0.12em] uppercase transition-colors ${
                    l.muted ? 'text-[rgba(255,255,255,0.3)] hover:text-white' : 'text-[rgba(255,255,255,0.45)] hover:text-white'
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <div className="h-px bg-[rgba(255,255,255,0.06)] my-1" />
              <a
                href="#reservation"
                onClick={handleReserve}
                className="inline-flex items-center justify-center h-11 font-display font-semibold text-xs tracking-[0.04em] uppercase"
                style={{ background: '#C9A96E', color: '#000000', borderRadius: '999px' }}
              >
                Reserve
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
