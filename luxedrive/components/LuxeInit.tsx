'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface CartItem {
  vehicleId: number
  name: string
  brand: string
  category: string
  price: number
  image: string
  quantity: number
}

function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('ld_cart') || '[]') } catch { return [] }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem('ld_cart', JSON.stringify(cart))
}

function updateCartCount() {
  const cart = getCart()
  const total = cart.reduce((s, i) => s + i.quantity, 0)
  const el = document.getElementById('nav-cart-count')
  if (el) el.textContent = String(total)
}

function showToast(msg: string) {
  const container = document.getElementById('toast-container')
  if (!container) return
  const toast = document.createElement('div')
  toast.className = 'toast show'
  toast.setAttribute('role', 'status')
  toast.textContent = msg
  container.appendChild(toast)
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400) }, 3000)
}

export default function LuxeInit() {
  const pathname = usePathname()

  useEffect(() => {
    // ── Custom cursor ──
    const cursor = document.getElementById('cursor')
    const onMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px'
        cursor.style.top  = e.clientY + 'px'
      }
    }
    const onDown = () => cursor?.classList.add('cursor--click')
    const onUp   = () => cursor?.classList.remove('cursor--click')
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)

    const hoverEls = document.querySelectorAll('a,button,[data-hover]')
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursor?.classList.add('cursor--hover'))
      el.addEventListener('mouseleave', () => cursor?.classList.remove('cursor--hover'))
    })

    // ── Loading screen ──
    const ls = document.getElementById('loading-screen')
    if (ls && !ls.classList.contains('hidden')) {
      const bar = ls.querySelector<HTMLElement>('.loading__bar-fill')
      if (bar) requestAnimationFrame(() => { bar.style.width = '100%' })
      setTimeout(() => ls.classList.add('hidden'), 2200)
    }

    // ── Navbar scroll ──
    const navbar = document.getElementById('navbar')
    const onScroll = () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // ── Mobile menu ──
    const hamburger = document.getElementById('hamburger-btn')
    const mobileMenu = document.getElementById('mobile-menu')
    const toggleMenu = () => {
      hamburger?.classList.toggle('open')
      mobileMenu?.classList.toggle('open')
      document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : ''
      hamburger?.setAttribute('aria-expanded', String(mobileMenu?.classList.contains('open')))
    }
    hamburger?.addEventListener('click', toggleMenu)
    mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger?.classList.remove('open')
      mobileMenu?.classList.remove('open')
      document.body.style.overflow = ''
    }))

    // ── Scroll reveal ──
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' })
    document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach(el => revealObs.observe(el))

    // ── Counter animation ──
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const target = parseInt(el.dataset.counter || '0')
        const suffix = el.dataset.counterSuffix || ''
        let current = 0
        const step = Math.ceil(target / 60)
        const timer = setInterval(() => {
          current = Math.min(current + step, target)
          el.textContent = current + suffix
          if (current >= target) clearInterval(timer)
        }, 16)
        counterObs.unobserve(el)
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el))

    // ── Hero parallax ──
    const parallax = document.querySelector<HTMLElement>('.parallax')
    const onParallax = () => {
      if (parallax) parallax.style.transform = `translateY(${window.scrollY * 0.25}px)`
    }
    if (parallax) window.addEventListener('scroll', onParallax, { passive: true })

    // ── Gallery thumbs ──
    const thumbs = document.querySelectorAll<HTMLButtonElement>('.product-gallery__thumb')
    const mainImg = document.getElementById('main-gallery-img') as HTMLImageElement | null
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'))
        thumb.classList.add('active')
        if (mainImg) {
          const img = thumb.querySelector('img')
          if (img) { mainImg.src = img.src; mainImg.alt = img.alt }
        }
      })
    })

    // ── Color swatches ──
    const swatches = document.querySelectorAll<HTMLButtonElement>('.color-swatch')
    const colorLabel = document.getElementById('selected-color')
    swatches.forEach(s => {
      s.addEventListener('click', () => {
        swatches.forEach(sw => sw.classList.remove('active'))
        s.classList.add('active')
        if (colorLabel) colorLabel.textContent = s.dataset.colorName || ''
      })
    })

    // ── Range slider ──
    const range = document.getElementById('price-max') as HTMLInputElement | null
    const rangeLabel = document.getElementById('price-max-label')
    if (range) {
      const updateRange = () => {
        const min = parseFloat(range.min)
        const max = parseFloat(range.max)
        const val = parseFloat(range.value)
        const pct = ((val - min) / (max - min)) * 100
        range.style.setProperty('--range-pct', pct + '%')
        if (rangeLabel) rangeLabel.textContent = new Intl.NumberFormat('fr-FR').format(val) + ' €'
      }
      range.addEventListener('input', updateRange)
      updateRange()
    }

    // ── Sort select auto-submit ──
    const sortSelect = document.getElementById('sort-select')
    sortSelect?.addEventListener('change', () => {
      (document.getElementById('filter-form') as HTMLFormElement)?.submit()
    })

    // ── Cart: init count ──
    updateCartCount()

    // ── Cart: add to cart ──
    const addCartBtns = document.querySelectorAll<HTMLButtonElement>('[data-add-cart]')
    const cartHandlers: Array<{ el: HTMLButtonElement; fn: () => void }> = []
    addCartBtns.forEach(btn => {
      const fn = () => {
        const vehicleId = parseInt(btn.dataset.addCart || '0')
        const name      = btn.dataset.name     || ''
        const price     = parseFloat(btn.dataset.price    || '0')
        const brand     = btn.dataset.brand    || ''
        const category  = btn.dataset.category || ''
        const image     = btn.dataset.image    || ''

        const cart = getCart()
        const existing = cart.find(i => i.vehicleId === vehicleId)
        if (existing) {
          existing.quantity++
        } else {
          cart.push({ vehicleId, name, brand, category, price, image, quantity: 1 })
        }
        saveCart(cart)
        updateCartCount()
        showToast(`${name} ajouté au panier`)
      }
      btn.addEventListener('click', fn)
      cartHandlers.push({ el: btn, fn })
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      window.removeEventListener('scroll', onScroll)
      if (parallax) window.removeEventListener('scroll', onParallax)
      hamburger?.removeEventListener('click', toggleMenu)
      revealObs.disconnect()
      counterObs.disconnect()
      cartHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
    }
  }, [pathname])

  return null
}
