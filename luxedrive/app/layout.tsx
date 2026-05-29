import type { Metadata } from 'next'
import './globals.css'
import LuxeInit from '@/components/LuxeInit'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'LUXEDRIVE — Collection exclusive de véhicules de luxe',
  description: 'LUXEDRIVE — Collection exclusive de véhicules de prestige. SUV, Berlines, Supercars — chaque modèle est une déclaration.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return (
    <html lang="fr">
      <body>
        <div id="cursor" aria-hidden="true" />
        <div id="toast-container" aria-live="polite" />

        <div id="loading-screen" role="status" aria-label="Chargement LUXEDRIVE">
          <div className="loading__logo">LUXEDRIVE</div>
          <div className="loading__bar-track">
            <div className="loading__bar-fill" />
          </div>
          <p className="loading__label">Chargement de la collection</p>
        </div>

        <nav id="navbar" role="navigation" aria-label="Navigation principale">
          <div className="nav__inner">
            <a href="/" className="nav__logo" aria-label="LUXEDRIVE — Accueil">LUXEDRIVE</a>
            <ul className="nav__links" role="list">
              <li><a href="/" className="nav__link">Accueil</a></li>
              <li><a href="/catalog" className="nav__link">Collection</a></li>
              <li><a href="/catalog?category=SUV" className="nav__link">SUV</a></li>
              <li><a href="/catalog?category=Supercar" className="nav__link">Supercars</a></li>
            </ul>
            <div className="nav__actions">
              <a href="/cart" className="nav__cart-btn" aria-label="Panier">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span className="nav__cart-count" id="nav-cart-count" aria-hidden="true">0</span>
              </a>
              {user ? (
                <a href="/account" className="nav__cta">
                  Mon compte
                  <span className="btn__icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                </a>
              ) : (
                <a href="/login" className="nav__cta">
                  Se connecter
                  <span className="btn__icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </a>
              )}
              <button className="nav__hamburger" id="hamburger-btn" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu">
                <span /><span /><span />
              </button>
            </div>
          </div>
        </nav>

        <div id="mobile-menu" role="dialog" aria-label="Menu mobile" aria-modal="true">
          <a href="/" className="mobile-menu__link">Accueil</a>
          <a href="/catalog" className="mobile-menu__link">Collection</a>
          <a href="/catalog?category=SUV" className="mobile-menu__link">SUV</a>
          <a href="/catalog?category=Supercar" className="mobile-menu__link">Supercars</a>
          <a href="/cart" className="mobile-menu__link">Panier</a>
          {user
            ? <a href="/account" className="mobile-menu__link">Mon compte</a>
            : <a href="/login" className="mobile-menu__link">Se connecter</a>}
        </div>

        <main id="main-content">
          {children}
        </main>

        <footer className="footer" role="contentinfo">
          <div className="container">
            <div className="footer__grid">
              <div>
                <div className="footer__logo">LUXEDRIVE</div>
                <p className="footer__tagline">L'excellence automobile accessible. Nous sélectionnons pour vous les véhicules les plus exclusifs, livrés avec discrétion et raffinement.</p>
                <div className="flex gap-3" style={{ marginTop: '1.5rem' }}>
                  {[
                    { label: 'Instagram', icon: <><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></> },
                    { label: 'LinkedIn', icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></> },
                  ].map(({ label, icon }) => (
                    <a key={label} href="#" aria-label={label} className="footer-social" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: 'rgba(255,255,255,0.4)', transition: 'all .3s ease' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{icon}</svg>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="footer__heading">Collection</h3>
                <ul className="footer__links">
                  <li><a href="/catalog?category=SUV" className="footer__link">SUV Premium</a></li>
                  <li><a href="/catalog?category=Berline" className="footer__link">Berlines de luxe</a></li>
                  <li><a href="/catalog?category=Supercar" className="footer__link">Supercars</a></li>
                  <li><a href="/catalog?category=Citadine" className="footer__link">Citadines premium</a></li>
                </ul>
              </div>
              <div>
                <h3 className="footer__heading">Services</h3>
                <ul className="footer__links">
                  <li><a href="#" className="footer__link">Livraison 48h</a></li>
                  <li><a href="#" className="footer__link">Financement</a></li>
                  <li><a href="#" className="footer__link">Garantie 2 ans</a></li>
                  <li><a href="#" className="footer__link">Service après-vente</a></li>
                </ul>
              </div>
              <div>
                <h3 className="footer__heading">Mon compte</h3>
                <ul className="footer__links">
                  {user ? (
                    <>
                      <li><a href="/account" className="footer__link">Mon espace</a></li>
                      <li><a href="/cart" className="footer__link">Mon panier</a></li>
                      <li><a href="/api/auth/logout" className="footer__link">Déconnexion</a></li>
                    </>
                  ) : (
                    <>
                      <li><a href="/login" className="footer__link">Connexion</a></li>
                      <li><a href="/login" className="footer__link">Créer un compte</a></li>
                      <li><a href="/cart" className="footer__link">Mon panier</a></li>
                    </>
                  )}
                  <li><a href="#" className="footer__link">Aide & Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="divider"><div className="divider__icon" /></div>
            <div className="footer__bottom">
              <span>© {new Date().getFullYear()} LUXEDRIVE. Tous droits réservés.</span>
              <div className="flex gap-5">
                <a href="#" className="footer__link">Mentions légales</a>
                <a href="#" className="footer__link">CGV</a>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '.05em' }}>
              Réalisé par <a href="mailto:barannfall@gmail.com" style={{ color: 'rgba(201,168,76,0.5)', textDecoration: 'none' }}>barannfall@gmail.com</a>
            </div>
          </div>
        </footer>

        <LuxeInit />
      </body>
    </html>
  )
}
