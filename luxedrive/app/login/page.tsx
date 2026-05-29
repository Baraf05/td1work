'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const sp = useSearchParams()
  const redirect = sp.get('redirect') || '/account'
  const [mode, setMode]       = useState<'login' | 'register'>('login')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) { setError(data.error || 'Erreur de connexion.'); return }
      router.push(redirect)
      router.refresh()
    } catch { setError('Erreur réseau.') }
    finally { setLoading(false) }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    if (fd.get('password') !== fd.get('confirm')) {
      setError('Les mots de passe ne correspondent pas.'); setLoading(false); return
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: fd.get('firstname'), last_name: fd.get('lastname'), email: fd.get('email'), password: fd.get('password') }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) { setError(data.error || 'Erreur lors de la création du compte.'); return }
      router.push(redirect)
      router.refresh()
    } catch { setError('Erreur réseau.') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      {/* ── Visuel gauche ── */}
      <div className="auth-visual" aria-hidden="true">
        <div className="auth-visual__bg" style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#161616 100%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(ellipse,rgba(201,168,76,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '3rem' }}>
          <div className="auth-visual__logo">LUXEDRIVE</div>
          <p className="auth-visual__tagline">&ldquo;Le luxe n&apos;est pas une nécessité,<br />c&apos;est une philosophie.&rdquo;</p>
          <div style={{ marginTop: '3rem', display: 'grid', gap: '1.25rem' }}>
            {([
              ['Livraison en 48h', 'Partout en Europe'],
              ['Garantie 2 ans', 'Sur tous nos véhicules'],
              ['Service premium', 'Assistance 7j/7'],
            ] as [string, string][]).map(([title, sub]) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 12, textAlign: 'left' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-gold)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--color-white-90)' }}>{title}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--color-white-30)' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Formulaire ── */}
      <div className="auth-form-wrap">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '.25em', color: 'var(--color-gold)', marginBottom: '2rem' }}>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>LUXEDRIVE</a>
        </div>

        {error && (
          <div style={{ padding: '.875rem 1rem', background: 'rgba(232,80,80,0.1)', border: '1px solid rgba(232,80,80,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', fontSize: '.85rem', marginBottom: '1.5rem' }} role="alert">
            {error}
          </div>
        )}

        {/* Toggle */}
        <div className="auth-toggle" role="tablist" aria-label="Mode d'authentification">
          <button
            className={`auth-toggle__btn${mode === 'login' ? ' active' : ''}`}
            role="tab"
            aria-selected={mode === 'login'}
            aria-controls="login-panel"
            type="button"
            onClick={() => { setMode('login'); setError('') }}
          >
            Se connecter
          </button>
          <button
            className={`auth-toggle__btn${mode === 'register' ? ' active' : ''}`}
            role="tab"
            aria-selected={mode === 'register'}
            aria-controls="register-panel"
            type="button"
            onClick={() => { setMode('register'); setError('') }}
          >
            Créer un compte
          </button>
        </div>

        {/* ── Connexion ── */}
        {mode === 'login' && (
          <div id="login-panel" role="tabpanel">
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-white)', marginBottom: '.5rem' }}>Bon retour !</h1>
            <p style={{ color: 'var(--color-white-60)', fontSize: '.875rem', marginBottom: '2rem' }}>Connectez-vous pour accéder à votre espace.</p>

            <form onSubmit={handleLogin} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email <span className="required" aria-hidden="true">*</span></label>
                <input type="email" id="login-email" name="email" className="form-input" required autoComplete="email" placeholder="votre@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Mot de passe <span className="required" aria-hidden="true">*</span></label>
                <PasswordInput id="login-password" name="password" autoComplete="current-password" />
              </div>
              <button type="submit" className="btn btn--primary btn--lg w-full" style={{ justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
                {!loading && <span className="btn__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>}
              </button>
              <p style={{ fontSize: '.72rem', color: 'var(--color-white-30)', textAlign: 'center', marginTop: '1.25rem' }}>
                Compte de démo : <code style={{ color: 'var(--color-gold)' }}>admin@luxedrive.com</code> / <code style={{ color: 'var(--color-gold)' }}>password</code>
              </p>
            </form>
          </div>
        )}

        {/* ── Inscription ── */}
        {mode === 'register' && (
          <div id="register-panel" role="tabpanel">
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-white)', marginBottom: '.5rem' }}>Rejoignez LUXEDRIVE</h1>
            <p style={{ color: 'var(--color-white-60)', fontSize: '.875rem', marginBottom: '2rem' }}>Créez votre compte en quelques secondes.</p>

            <form onSubmit={handleRegister} noValidate>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-firstname">Prénom <span className="required" aria-hidden="true">*</span></label>
                  <input type="text" id="reg-firstname" name="firstname" className="form-input" required autoComplete="given-name" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-lastname">Nom <span className="required" aria-hidden="true">*</span></label>
                  <input type="text" id="reg-lastname" name="lastname" className="form-input" required autoComplete="family-name" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email <span className="required" aria-hidden="true">*</span></label>
                <input type="email" id="reg-email" name="email" className="form-input" required autoComplete="email" placeholder="votre@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Mot de passe <span className="required" aria-hidden="true">*</span></label>
                <PasswordInput id="reg-password" name="password" autoComplete="new-password" placeholder="8 caractères minimum" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirmer <span className="required" aria-hidden="true">*</span></label>
                <PasswordInput id="reg-confirm" name="confirm" autoComplete="new-password" />
              </div>
              <button type="submit" className="btn btn--primary btn--lg w-full" style={{ justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Création...' : 'Créer mon compte'}
                {!loading && <span className="btn__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function PasswordInput({ id, name, autoComplete, placeholder }: { id: string; name: string; autoComplete: string; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} id={id} name={name} className="form-input" required autoComplete={autoComplete} placeholder={placeholder || '••••••••'} />
      <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-white-30)', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Afficher/masquer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
