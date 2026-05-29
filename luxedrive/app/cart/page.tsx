'use client'

import { useEffect, useState } from 'react'

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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCart(getCart())
    setMounted(true)
  }, [])

  function updateCart(newCart: CartItem[]) {
    saveCart(newCart)
    setCart([...newCart])
    const count = newCart.reduce((s, i) => s + i.quantity, 0)
    const el = document.getElementById('nav-cart-count')
    if (el) el.textContent = String(count)
  }

  function changeQty(idx: number, delta: number) {
    const c = [...cart]
    c[idx].quantity = Math.max(1, c[idx].quantity + delta)
    updateCart(c)
  }

  function removeItem(idx: number) {
    const c = cart.filter((_, i) => i !== idx)
    updateCart(c)
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const tva      = subtotal * 0.2
  const total    = subtotal

  if (!mounted) return null

  return (
    <section className="section section--sm">
      <div className="container">

        <div style={{ marginBottom: '2.5rem' }} data-reveal>
          <p className="section-subtitle">Votre sélection</p>
          <h1 className="section-title">
            Mon panier
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 400, color: 'var(--color-white-30)', marginLeft: '.75rem' }}>
              ({cart.length} article{cart.length > 1 ? 's' : ''})
            </span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" style={{ margin: '0 auto 2rem', display: 'block' }} aria-hidden="true">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-white)', marginBottom: '.75rem' }}>
              Votre panier est vide
            </h2>
            <p style={{ color: 'var(--color-white-60)', marginBottom: '2.5rem' }}>
              Découvrez notre collection de véhicules d&apos;exception.
            </p>
            <a href="/catalog" className="btn btn--primary btn--lg">
              Explorer la collection
              <span className="btn__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </a>
          </div>
        ) : (
          <div className="cart-layout">

            {/* ── Liste des articles ── */}
            <div>
              {cart.map((item, idx) => (
                <article key={`${item.vehicleId}-${idx}`} className="cart-item">
                  <img
                    className="cart-item__img"
                    src={item.image || '/assets/images/placeholder.jpg'}
                    alt={item.name}
                    width={120}
                    height={90}
                    loading="lazy"
                  />

                  <div style={{ flex: 1 }}>
                    <div className="cart-item__brand">{item.brand}</div>
                    <h2 className="cart-item__name">
                      <a href={`/product/${item.vehicleId}`} style={{ color: 'inherit', transition: 'color .2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
                      >
                        {item.name}
                      </a>
                    </h2>
                    <p style={{ fontSize: '.78rem', color: 'var(--color-white-30)', marginBottom: '.75rem' }}>{item.category}</p>

                    <div className="flex gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <div className="qty-control" role="group" aria-label="Quantité">
                        <button className="qty-control__btn" type="button" aria-label="Diminuer" onClick={() => changeQty(idx, -1)}>−</button>
                        <span className="qty-control__value" aria-live="polite">{item.quantity}</span>
                        <button className="qty-control__btn" type="button" aria-label="Augmenter" onClick={() => changeQty(idx, 1)}>+</button>
                      </div>
                      <button
                        className="btn btn--ghost btn--sm"
                        type="button"
                        onClick={() => removeItem(idx)}
                        aria-label={`Supprimer ${item.name}`}
                        style={{ color: 'var(--color-error)', borderColor: 'rgba(232,80,80,0.3)' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="price-tag" style={{ fontSize: '1.4rem' }}>
                      {(item.price * item.quantity).toLocaleString('fr-FR')} €
                    </div>
                    <div style={{ fontSize: '.72rem', color: 'var(--color-white-30)', marginTop: '.25rem' }}>
                      {item.price.toLocaleString('fr-FR')} € / unité
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ── Récapitulatif ── */}
            <aside className="cart-summary" aria-label="Récapitulatif de commande">
              <h2 className="cart-summary__title">Récapitulatif</h2>

              <div className="cart-summary__row">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="cart-summary__row">
                <span>Livraison</span>
                <span style={{ color: 'var(--color-success)' }}>Offerte</span>
              </div>
              <div className="cart-summary__row">
                <span>TVA (20%)</span>
                <span>{tva.toLocaleString('fr-FR')} €</span>
              </div>

              <div className="cart-summary__row cart-summary__row--total">
                <span>Total TTC</span>
                <span className="price-tag" aria-live="polite">{total.toLocaleString('fr-FR')} €</span>
              </div>

              <a href="/checkout" className="btn btn--primary btn--lg w-full" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
                Commander
                <span className="btn__icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </a>

              <a href="/catalog" className="btn btn--ghost w-full" style={{ marginTop: '.75rem', justifyContent: 'center' }}>
                Continuer mes achats
              </a>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', marginTop: '1.5rem', fontSize: '.7rem', color: 'var(--color-white-30)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Paiement 100% sécurisé
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
