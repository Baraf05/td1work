'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Fleet',        href: '#fleet' },
  { label: 'Services',     href: '#services' },
  { label: 'Our Standard', href: '#our-standard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleReserve = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
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
          className={`flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-500 ${
            scrolled
              ? 'bg-[#0A0A0B] shadow-[0_1px_0_rgba(201,169,110,0.08)]'
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 cursor-none group" aria-label="Elite Class Dubai — home">
            <svg viewBox="0 0 32 22" fill="none" className="w-8 h-5" aria-hidden="true">
              <path d="M4 18 L16 4 L28 18" stroke="#C9A96E" strokeWidth="1" fill="none"/>
              <path d="M8 18 L16 8 L24 18" fill="rgba(201,169,110,0.1)" stroke="none"/>
              <line x1="1" y1="18" x2="31" y2="18" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4"/>
            </svg>
            <span className="font-serif font-normal text-sm tracking-[0.2em] text-[#F5F2EE] uppercase">
              Elite Class
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] font-sans tracking-[0.15em] uppercase text-[#A8A49E] hover:text-[#F5F2EE] transition-colors duration-200 cursor-none focus-visible:outline-[#C9A96E]"
              >
                {l.label}
              </Link>
            ))}
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
            className="fixed inset-x-0 top-16 z-40 bg-[#0A0A0B] border-b border-[rgba(201,169,110,0.08)] px-6 py-6 md:hidden"
          >
            <div className="flex flex-col gap-5">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs font-sans tracking-[0.15em] uppercase text-[#A8A49E] hover:text-[#F5F2EE] transition-colors"
                >
                  {l.label}
                </Link>
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
