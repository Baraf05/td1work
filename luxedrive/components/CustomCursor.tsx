'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable on touch devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx, ry = my
    let vx = 0, vy = 0
    const STIFFNESS = 0.12
    const DAMPING   = 0.82

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }

    let rafId: number
    const loop = () => {
      vx = vx * DAMPING + (mx - rx) * STIFFNESS
      vy = vy * DAMPING + (my - ry) * STIFFNESS
      rx += vx; ry += vy
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    const setCursorState = (state: 'default' | 'hover' | 'fleet' | 'cta') => {
      document.body.dataset.cursor = state
    }

    const bound = new WeakSet<Element>()
    const addHover = (el: Element) => {
      if (bound.has(el)) return
      bound.add(el)
      el.addEventListener('mouseenter', () => {
        const type = (el as HTMLElement).dataset.cursor
        if (type === 'fleet') setCursorState('fleet')
        else if (el.matches('a[href="#reservation"], button[type="submit"], .btn-gold')) setCursorState('cta')
        else setCursorState('hover')
      })
      el.addEventListener('mouseleave', () => setCursorState('default'))
    }

    document.querySelectorAll('a, button, [data-cursor]').forEach(addHover)

    // MutationObserver for dynamically added elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(addHover)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"   aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring"  aria-hidden="true">
        <div ref={labelRef} className="cursor-label" aria-hidden="true">VIEW</div>
      </div>
    </>
  )
}
