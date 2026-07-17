'use client'

const WORDS = ['DISCRETION', 'PUNCTUALITY', 'DUBAI', 'PRIVATE TRANSFERS', 'COORDINATION', 'AVAILABLE 24/7']
// Double for seamless loop
const ITEMS = [...WORDS, ...WORDS]

export default function Marquee() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: '#0A0A0B',
        borderTop: '0.5px solid rgba(201,169,110,0.08)',
        borderBottom: '0.5px solid rgba(201,169,110,0.08)',
        padding: '18px 0',
      }}
      aria-hidden="true"
    >
      <div
        className="marquee-track flex whitespace-nowrap w-max"
        style={{ animationDuration: '60s' }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {ITEMS.map((word, i) => (
          <span key={i} className="flex items-center gap-6 px-8">
            <span
              style={{
                display: 'inline-block', width: '3px', height: '3px',
                background: '#C9A96E', borderRadius: '50%', flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '10px', letterSpacing: '0.2em',
                color: 'rgba(201,169,110,0.4)', textTransform: 'uppercase',
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
