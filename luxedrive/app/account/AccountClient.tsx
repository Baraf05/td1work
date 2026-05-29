'use client'

import { useState } from 'react'
import type { AuthUser } from '@/lib/auth'
import type { RowDataPacket } from 'mysql2'

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:    { label: 'En attente',  cls: 'badge--pending' },
  processing: { label: 'En cours',    cls: 'badge--processing' },
  shipped:    { label: 'Expédiée',    cls: 'badge--shipped' },
  delivered:  { label: 'Livrée',      cls: 'badge--delivered' },
  cancelled:  { label: 'Annulée',     cls: 'badge--cancelled' },
}

interface Props {
  user: AuthUser
  orders: RowDataPacket[]
}

export default function AccountClient({ user, orders }: Props) {
  const [tab, setTab]         = useState<'orders' | 'profile' | 'password'>('orders')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setMessage(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: fd.get('firstname'), last_name: fd.get('lastname'), email: fd.get('email') }),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' })
      } else {
        const d = await res.json() as { error?: string }
        setMessage({ type: 'error', text: d.error || 'Erreur lors de la mise à jour.' })
      }
    } catch { setMessage({ type: 'error', text: 'Erreur réseau.' }) }
    finally { setLoading(false) }
  }

  async function handlePasswordUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setMessage(null)
    const fd = new FormData(e.currentTarget)
    if (fd.get('new_password') !== fd.get('confirm_password')) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' }); setLoading(false); return
    }
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: fd.get('current_password'), new_password: fd.get('new_password') }),
      })
      const d = await res.json() as { ok?: boolean; error?: string }
      if (res.ok) {
        setMessage({ type: 'success', text: 'Mot de passe mis à jour.' })
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMessage({ type: 'error', text: d.error || 'Erreur lors du changement de mot de passe.' })
      }
    } catch { setMessage({ type: 'error', text: 'Erreur réseau.' }) }
    finally { setLoading(false) }
  }

  const initials = (user.first_name?.[0] || '').toUpperCase()

  return (
    <section className="section section--sm">
      <div className="container">

        {/* En-tête */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }} data-reveal>
          <div style={{ width: 64, height: 64, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-gold)', flexShrink: 0 }} aria-hidden="true">
            {initials}
          </div>
          <div>
            <p className="section-subtitle" style={{ marginBottom: '.25rem' }}>Espace personnel</p>
            <h1 className="section-title" style={{ fontSize: '1.8rem' }}>
              Bonjour, {user.first_name} !
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn--ghost btn--sm"
            style={{ marginLeft: 'auto', color: 'var(--color-error)', borderColor: 'rgba(232,80,80,0.3)' }}
          >
            Déconnexion
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div
            style={{
              padding: '.875rem 1rem',
              background: message.type === 'success' ? 'rgba(76,175,112,0.1)' : 'rgba(232,80,80,0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(76,175,112,0.3)' : 'rgba(232,80,80,0.3)'}`,
              borderRadius: 'var(--radius-md)',
              color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
              fontSize: '.85rem',
              marginBottom: '1.5rem',
            }}
            role={message.type === 'success' ? 'status' : 'alert'}
          >
            {message.text}
          </div>
        )}

        {/* Onglets */}
        <div>
          <div style={{ display: 'flex', gap: '.25rem', background: 'var(--color-bg-2)', borderRadius: 'var(--radius-full)', padding: 4, border: '1px solid var(--color-white-05)', marginBottom: '2.5rem', width: 'fit-content' }} role="tablist" aria-label="Sections du compte">
            {([['orders', 'Mes commandes'], ['profile', 'Mon profil'], ['password', 'Mot de passe']] as [string, string][]).map(([id, label]) => (
              <button
                key={id}
                className={`auth-toggle__btn${tab === id ? ' active' : ''}`}
                role="tab"
                aria-selected={tab === id}
                type="button"
                onClick={() => { setTab(id as typeof tab); setMessage(null) }}
                style={{ minWidth: 130 }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Commandes ── */}
          {tab === 'orders' && (
            orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-bg-2)', border: '1px solid var(--color-white-05)', borderRadius: 'var(--radius-lg)' }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" style={{ margin: '0 auto 1.5rem', display: 'block' }} aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <p style={{ color: 'var(--color-white-60)', marginBottom: '1.5rem' }}>Aucune commande pour le moment.</p>
                <a href="/catalog" className="btn btn--primary">Explorer la collection</a>
              </div>
            ) : (
              <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-white-05)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>N° commande</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      const s = STATUS_LABELS[order.status as string] || { label: String(order.status), cls: 'badge--pending' }
                      const date = new Date(order.created_at as string).toLocaleDateString('fr-FR')
                      return (
                        <tr key={order.id as number}>
                          <td>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-gold)' }}>
                              #{String(order.id as number).padStart(6, '0')}
                            </span>
                          </td>
                          <td style={{ color: 'var(--color-white-60)', fontSize: '.85rem' }}>{date}</td>
                          <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                          <td>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                              {Number(order.total).toLocaleString('fr-FR')} €
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ── Profil ── */}
          {tab === 'profile' && (
            <div style={{ maxWidth: 520 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1.5rem' }}>Informations personnelles</h2>
              <form onSubmit={handleProfileUpdate} noValidate>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="acc-firstname">Prénom <span className="required" aria-hidden="true">*</span></label>
                    <input type="text" id="acc-firstname" name="firstname" className="form-input" required defaultValue={user.first_name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="acc-lastname">Nom <span className="required" aria-hidden="true">*</span></label>
                    <input type="text" id="acc-lastname" name="lastname" className="form-input" required defaultValue={user.last_name} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="acc-email">Email <span className="required" aria-hidden="true">*</span></label>
                  <input type="email" id="acc-email" name="email" className="form-input" required defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rôle</label>
                  <div style={{ padding: '12px 18px', background: 'var(--color-bg-3)', border: '1px solid var(--color-white-10)', borderRadius: 'var(--radius-md)' }}>
                    <span className={`badge badge--${user.role}`}>{user.role}</span>
                  </div>
                </div>
                <button type="submit" className="btn btn--primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          )}

          {/* ── Mot de passe ── */}
          {tab === 'password' && (
            <div style={{ maxWidth: 420 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '1.5rem' }}>Changer de mot de passe</h2>
              <form onSubmit={handlePasswordUpdate} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="current-pwd">Mot de passe actuel <span className="required" aria-hidden="true">*</span></label>
                  <input type="password" id="current-pwd" name="current_password" className="form-input" required autoComplete="current-password" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="new-pwd">Nouveau mot de passe <span className="required" aria-hidden="true">*</span></label>
                  <input type="password" id="new-pwd" name="new_password" className="form-input" required autoComplete="new-password" placeholder="8 caractères minimum" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-pwd">Confirmer <span className="required" aria-hidden="true">*</span></label>
                  <input type="password" id="confirm-pwd" name="confirm_password" className="form-input" required autoComplete="new-password" />
                </div>
                <button type="submit" className="btn btn--primary" disabled={loading}>
                  {loading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
