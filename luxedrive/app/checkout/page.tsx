'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CartItem {
  vehicleId: number
  name: string
  brand: string
  price: number
  image: string
  quantity: number
}

interface FormData {
  firstname: string; lastname: string; email: string; phone: string
  address: string; address2: string; city: string; zipcode: string; country: string
  card_number: string; card_expiry: string; card_cvv: string; card_name: string
}

function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('ld_cart') || '[]') } catch { return [] }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart]         = useState<CartItem[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [mounted, setMounted]   = useState(false)
  const [form, setForm]         = useState<FormData>({
    firstname: '', lastname: '', email: '', phone: '',
    address: '', address2: '', city: '', zipcode: '', country: 'France',
    card_number: '', card_expiry: '', card_cvv: '', card_name: '',
  })

  useEffect(() => {
    const c = getCart()
    if (!c.length) { router.replace('/cart'); return }
    setCart(c)
    setMounted(true)
    // Pre-fill from auth
    fetch('/api/auth/me').then(r => r.json()).then(({ user }) => {
      if (user) setForm(f => ({ ...f, firstname: user.first_name, lastname: user.last_name, email: user.email }))
    }).catch(() => {})
  }, [router])

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const required = ['firstname', 'lastname', 'email', 'address', 'city', 'zipcode', 'country'] as const
    for (const k of required) {
      if (!form[k]) { setError('Veuillez remplir tous les champs obligatoires.'); setLoading(false); return }
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ vehicleId: i.vehicleId, quantity: i.quantity, price: i.price })),
          shipping: { firstname: form.firstname, lastname: form.lastname, email: form.email, phone: form.phone, address: form.address, address2: form.address2, city: form.city, zipcode: form.zipcode, country: form.country },
          total: subtotal,
        }),
      })
      const data = await res.json() as { ok?: boolean; error?: string; orderId?: number }
      if (!res.ok) {
        if (res.status === 401) { router.push('/login?redirect=/checkout'); return }
        setError(data.error || 'Erreur lors de la commande.')
        return
      }
      localStorage.removeItem('ld_cart')
      const el = document.getElementById('nav-cart-count')
      if (el) el.textContent = '0'
      router.push(`/account?order=${data.orderId}`)
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <section className="section section--sm">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }} data-reveal>
          <p className="section-subtitle">Finalisation</p>
          <h1 className="section-title">Votre commande</h1>
        </div>

        {error && (
          <div style={{ padding: '1rem 1.25rem', background: 'rgba(232,80,80,0.1)', border: '1px solid rgba(232,80,80,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', marginBottom: '2rem' }} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr min(400px, 100%)', gap: '3rem', alignItems: 'start' }}>

            {/* ── Livraison + Paiement ── */}
            <div>
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-white)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-white-05)' }}>
                  <span style={{ color: 'var(--color-gold)', marginRight: '.5rem' }}>01</span> Adresse de livraison
                </h2>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstname">Prénom <span className="required" aria-hidden="true">*</span></label>
                    <input type="text" id="firstname" name="firstname" className="form-input" required autoComplete="given-name" value={form.firstname} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastname">Nom <span className="required" aria-hidden="true">*</span></label>
                    <input type="text" id="lastname" name="lastname" className="form-input" required autoComplete="family-name" value={form.lastname} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email <span className="required" aria-hidden="true">*</span></label>
                  <input type="email" id="email" name="email" className="form-input" required autoComplete="email" value={form.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Téléphone</label>
                  <input type="tel" id="phone" name="phone" className="form-input" autoComplete="tel" value={form.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Adresse <span className="required" aria-hidden="true">*</span></label>
                  <input type="text" id="address" name="address" className="form-input" required autoComplete="street-address" value={form.address} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address2">Complément d&apos;adresse</label>
                  <input type="text" id="address2" name="address2" className="form-input" autoComplete="address-line2" value={form.address2} onChange={handleChange} />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">Ville <span className="required" aria-hidden="true">*</span></label>
                    <input type="text" id="city" name="city" className="form-input" required autoComplete="address-level2" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="zipcode">Code postal <span className="required" aria-hidden="true">*</span></label>
                    <input type="text" id="zipcode" name="zipcode" className="form-input" required autoComplete="postal-code" maxLength={10} value={form.zipcode} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="country">Pays <span className="required" aria-hidden="true">*</span></label>
                  <select id="country" name="country" className="form-input" required autoComplete="country-name" value={form.country} onChange={handleChange}>
                    {['France', 'Belgique', 'Suisse', 'Luxembourg', 'Monaco', 'Canada'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Paiement fictif */}
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-white)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-white-05)' }}>
                  <span style={{ color: 'var(--color-gold)', marginRight: '.5rem' }}>02</span> Informations de paiement
                </h2>

                <div style={{ padding: '1rem', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '.78rem', color: 'var(--color-gold)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: '.4rem', verticalAlign: 'middle' }} aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Paiement de démonstration — aucune vraie transaction n&apos;est effectuée.
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="card-number">Numéro de carte</label>
                  <input type="text" id="card-number" name="card_number" className="form-input" placeholder="0000 0000 0000 0000" maxLength={19} inputMode="numeric" autoComplete="cc-number" value={form.card_number} onChange={handleChange} style={{ fontFamily: 'var(--font-display)', letterSpacing: '.1em', fontSize: '1.1rem' }} />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-expiry">Expiration</label>
                    <input type="text" id="card-expiry" name="card_expiry" className="form-input" placeholder="MM/AA" maxLength={5} inputMode="numeric" value={form.card_expiry} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-cvv">CVV</label>
                    <input type="text" id="card-cvv" name="card_cvv" className="form-input" placeholder="000" maxLength={3} inputMode="numeric" value={form.card_cvv} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="card-name">Nom sur la carte</label>
                  <input type="text" id="card-name" name="card_name" className="form-input" placeholder="JEAN DUPONT" autoComplete="cc-name" value={form.card_name} onChange={handleChange} style={{ textTransform: 'uppercase', letterSpacing: '.05em' }} />
                </div>
              </div>
            </div>

            {/* ── Récapitulatif ── */}
            <aside style={{ position: 'sticky', top: 'calc(var(--nav-height) + 1.5rem)' }} aria-label="Résumé commande">
              <div style={{ background: 'var(--color-bg-2)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-white)', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-white-05)' }}>
                  Votre commande
                </h3>

                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '.75rem', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-white-05)' }}>
                    <img
                      src={item.image || '/assets/images/placeholder.jpg'}
                      alt={item.name}
                      style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 6, background: 'var(--color-bg-3)' }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--color-white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '.68rem', color: 'var(--color-white-30)' }}>Qté : {item.quantity}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
                      {(item.price * item.quantity).toLocaleString('fr-FR')} €
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: 'var(--color-white-60)', marginBottom: '.6rem' }}>
                  <span>Sous-total</span><span>{subtotal.toLocaleString('fr-FR')} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: 'var(--color-white-60)', marginBottom: '.6rem' }}>
                  <span>Livraison</span><span style={{ color: 'var(--color-success)' }}>Offerte</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--color-white)', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-white-05)' }}>
                  <span>Total TTC</span>
                  <span className="price-tag" style={{ fontSize: '1.4rem' }}>{subtotal.toLocaleString('fr-FR')} €</span>
                </div>

                <button type="submit" className="btn btn--primary btn--lg w-full" style={{ marginTop: '1.5rem', justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Traitement...' : 'Confirmer la commande'}
                  {!loading && (
                    <span className="btn__icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  )}
                </button>

                <a href="/cart" className="btn btn--ghost w-full" style={{ marginTop: '.75rem', justifyContent: 'center' }}>
                  ← Modifier le panier
                </a>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </section>
  )
}
