import Link from 'next/link'

const navLinks = [
  { label: 'Fleet',        href: '#fleet' },
  { label: 'Services',     href: '#services' },
  { label: 'Our Standard', href: '#our-standard' },
  { label: 'Reserve',      href: '#reservation' },
  { label: 'FAQ',          href: '#faq' },
]

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 px-6 md:px-14" style={{ background: '#0A0A0B', borderTop: '0.5px solid rgba(201,169,110,0.08)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Top 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Left — Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5 cursor-none" aria-label="Elite Class Dubai — home">
              <svg viewBox="0 0 32 22" fill="none" className="w-7 h-5" aria-hidden="true">
                <path d="M4 18 L16 4 L28 18" stroke="#C9A96E" strokeWidth="1" fill="none"/>
                <path d="M8 18 L16 8 L24 18" fill="rgba(201,169,110,0.1)" stroke="none"/>
                <line x1="1" y1="18" x2="31" y2="18" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4"/>
              </svg>
              <span className="font-serif font-normal text-sm tracking-[0.2em] uppercase" style={{ color: '#F5F2EE' }}>
                Elite Class
              </span>
            </Link>
            <p className="font-sans leading-relaxed mb-5" style={{ fontSize: '13px', color: '#5A5855' }}>
              Private chauffeur service. Licensed fleet. Available 24 hours.
            </p>
            <address className="not-italic font-sans leading-relaxed" style={{ fontSize: '12px', color: '#5A5855' }}>
              Bayswater Tower, Office 1003<br />
              Business Bay, Dubai — UAE
            </address>
          </div>

          {/* Centre — Navigation */}
          <div>
            <p className="font-sans mb-5" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#3A3836' }}>
              NAVIGATION
            </p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {navLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans transition-colors duration-200 cursor-none hover:text-[#A8A49E]"
                      style={{ fontSize: '13px', color: '#5A5855' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Secondary B2B entry — clearly muted vs. the dominant Reserve link above */}
            <Link
              href="#partners-access"
              className="inline-block mt-5 font-sans transition-colors duration-200 cursor-none hover:text-[#A8A49E]"
              style={{ fontSize: '12px', letterSpacing: '0.06em', color: '#3A3836' }}
            >
              Partner access &rarr;
            </Link>
          </div>

          {/* Right — Contact */}
          <div>
            <p className="font-sans mb-5" style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#3A3836' }}>
              CONTACT
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/971542370940"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans transition-colors duration-200 cursor-none"
                  style={{ fontSize: '13px', color: '#5A5855' }}
                  aria-label="WhatsApp: +971 54 237 0940"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#C9A96E', flexShrink: 0 }} aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +971 54 237 0940
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@eliteclasslimo.com"
                  className="font-sans transition-colors duration-200 cursor-none"
                  style={{ fontSize: '13px', color: '#5A5855' }}
                >
                  info@eliteclasslimo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(201,169,110,0.06)', marginBottom: '24px' }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans" style={{ fontSize: '12px', color: '#3A3836' }}>
            &copy; {new Date().getFullYear()} Elite Class Dubai. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span
              className="font-sans px-2 py-1"
              style={{
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: '#C9A96E',
                border: '0.5px solid rgba(201,169,110,0.2)',
              }}
              aria-label="Language: English"
            >
              EN
            </span>
          </div>
        </div>

        {/* Credentials strip */}
        {/* CLIENT TO CONFIRM: Replace placeholder text when RTA licence arrives */}
        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '0.5px solid rgba(201,169,110,0.04)' }}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { label: 'RTA Licensed', note: '— Licence # pending —', pending: true },
              { label: 'UAE Registered', note: '' },
              { label: 'NDA Available', note: '' },
            ].map(({ label, note, pending }) => (
              <div key={label} className="flex items-center gap-2 font-sans"
                style={{ fontSize: '11px', letterSpacing: '0.1em', color: pending ? '#3A3836' : '#5A5855', textTransform: 'uppercase' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: pending ? '#3A3836' : 'rgba(201,169,110,0.3)', display: 'inline-block', flexShrink: 0 }} aria-hidden="true" />
                {label}
                {note && <span style={{ color: '#2A2826', textTransform: 'none', letterSpacing: '0' }}>{note}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
