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
              ? 'py-2 bg-[#0A0A0B] shadow-[0_1px_0_rgba(201,169,110,0.08)]'
              : 'py-4 bg-transparent'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)' }}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0 cursor-none" aria-label="Elite Class Dubai — home">
            <motion.div
              className="flex items-center gap-2.5 origin-left will-change-transform"
              animate={{ scale: reduce ? 1 : scrolled ? 0.85 : 1 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <svg viewBox="0 0 32 22" fill="none" width="28" height="18" aria-hidden="true">
                <path d="M4 18 L16 4 L28 18" stroke="#C9A96E" strokeWidth="1" fill="none"/>
                <path d="M8 18 L16 8 L24 18" fill="rgba(201,169,110,0.1)" stroke="none"/>
                <line x1="1" y1="18" x2="31" y2="18" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4"/>
              </svg>
              <span className="font-serif font-normal text-sm tracking-[0.2em] text-[#F5F2EE] uppercase whitespace-nowrap">
                Elite Class
              </span>
            </motion.div>
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
                  className={`relative text-[11px] font-sans tracking-[0.15em] uppercase transition-colors duration-200 cursor-none focus-visible:outline-[#C9A96E] pb-1 ${
                    l.muted
                      ? active ? 'text-[#A8A49E]' : 'text-[#5A5855] hover:text-[#A8A49E]'
                      : active ? 'text-[#F5F2EE]' : 'text-[#A8A49E] hover:text-[#F5F2EE]'
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full will-change-transform"
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
              className="hidden md:inline-flex items-center gap-1.5 px-5 h-9 font-sans font-medium text-[11px] tracking-[0.12em] uppercase transition-all duration-300 cursor-none focus-visible:outline-[#C9A96E]"
              style={{ background: '#C9A96E', color: '#0A0A0B', borderRadius: 0 }}
            >
              Reserve
            </a>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 text-[#A8A49E] hover:text-[#F5F2EE] transition-colors cursor-none"
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
            className="fixed inset-x-0 top-14 z-40 bg-[#0A0A0B] border-b border-[rgba(201,169,110,0.08)] px-6 py-6 md:hidden"
          >
            <div className="flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleAnchor(e, l.id)}
                  className={`text-xs font-sans tracking-[0.15em] uppercase transition-colors ${
                    l.muted ? 'text-[#5A5855] hover:text-[#A8A49E]' : 'text-[#A8A49E] hover:text-[#F5F2EE]'
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <div className="h-px bg-[rgba(201,169,110,0.08)] my-1" />
              <a
                href="#reservation"
                onClick={handleReserve}
                className="inline-flex items-center justify-center h-11 font-sans font-medium text-xs tracking-[0.12em] uppercase"
                style={{ background: '#C9A96E', color: '#0A0A0B' }}
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
