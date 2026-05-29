import { getPool, decodeVehicle, imgUrl } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

async function getData() {
  const pool = getPool()
  const [featuredRows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM vehicles WHERE featured = 1 ORDER BY created_at DESC LIMIT 3'
  )
  const [countRows] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM vehicles')
  return {
    featured: featuredRows.map(r => decodeVehicle(r as Record<string, unknown>)),
    total: (countRows[0] as RowDataPacket).total as number,
  }
}

export default async function HomePage() {
  const { featured, total } = await getData()

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" aria-label="Présentation LUXEDRIVE">
        <div className="hero__bg">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
          <img
            className="hero__bg-img parallax"
            src="/assets/images/hero-bg.jpg"
            alt=""
            aria-hidden="true"
          />
          <div className="hero__bg-overlay" />
          <div className="hero__grain" aria-hidden="true" />
        </div>

        <div className="hero__content">
          <div className="hero__eyebrow anim-fade-in">Collection 2025</div>
          <h1 className="hero__title anim-fade-in anim-delay-1">
            L&apos;excellence<br />
            <em>automobile</em><br />
            redéfinie.
          </h1>
          <p className="hero__subtitle anim-fade-in anim-delay-2">
            Découvrez une sélection exclusive de véhicules de prestige. SUV, Berlines, Supercars — chaque modèle est une déclaration.
          </p>
          <div className="hero__cta-group anim-fade-in anim-delay-3">
            <a href="/catalog" className="btn btn--primary btn--lg glow-anim">
              Découvrir la collection
              <span className="btn__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </a>
            <a href="#featured" className="btn btn--outline btn--lg">Véhicules en vedette</a>
          </div>
        </div>

        <div className="hero__scroll" aria-hidden="true">
          <div className="hero__scroll-line" />
          <span>Défiler</span>
        </div>
      </section>

      {/* ── VÉHICULES EN VEDETTE ── */}
      <section className="section" id="featured" aria-labelledby="featured-title">
        <div className="container">
          <div className="text-center mb-7" data-reveal>
            <p className="section-subtitle">Sélection exclusive</p>
            <h2 className="section-title" id="featured-title">Véhicules en vedette</h2>
          </div>

          <div className="featured-grid" data-reveal-stagger>
            {featured.map((v: Record<string, unknown>) => {
              const images = v.images as string[]
              const specs = v.specs as Record<string, string>
              const image = images?.[0] ?? 'placeholder.jpg'
              const power = specs?.puissance ?? 'N/A'
              const speed = specs?.['0_100'] ?? 'N/A'
              return (
                <article key={String(v.id)} className="vehicle-card card-glow">
                  <div className="vehicle-card__image-wrap">
                    <img
                      src={imgUrl(image)}
                      alt={String(v.name)}
                      loading="lazy"
                      width={600}
                      height={375}
                    />
                    <span className="vehicle-card__badge">{String(v.category)}</span>
                    <div className="vehicle-card__overlay">
                      <a href={`/product/${v.id}`} className="btn btn--outline btn--sm">Voir le véhicule</a>
                      <button
                        className="btn btn--primary btn--sm"
                        data-add-cart={String(v.id)}
                        data-name={String(v.name)}
                        data-price={String(v.price)}
                        data-brand={String(v.brand)}
                        data-category={String(v.category)}
                        data-image={imgUrl(image)}
                        aria-label={`Ajouter ${v.name} au panier`}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                  <div className="vehicle-card__body">
                    <div className="vehicle-card__brand">{String(v.brand)}</div>
                    <h3 className="vehicle-card__name">{String(v.name)}</h3>
                    <div className="vehicle-card__specs">
                      <div className="vehicle-card__spec">
                        <span className="vehicle-card__spec-label">Puissance</span>
                        <span className="vehicle-card__spec-value">{power}</span>
                      </div>
                      <div className="vehicle-card__spec">
                        <span className="vehicle-card__spec-label">0–100</span>
                        <span className="vehicle-card__spec-value">{speed}</span>
                      </div>
                    </div>
                    <div className="vehicle-card__footer">
                      <span className="price-tag">
                        {Number(v.price).toLocaleString('fr-FR')} €
                      </span>
                      <a href={`/product/${v.id}`} className="btn btn--ghost btn--sm">Détails</a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="text-center" style={{ marginTop: '3rem' }} data-reveal>
            <a href="/catalog" className="btn btn--outline btn--lg">
              Voir toute la collection
              <span className="btn__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section className="section section--sm" aria-labelledby="categories-title">
        <div className="container">
          <div className="text-center mb-7" data-reveal>
            <p className="section-subtitle">Explorez par univers</p>
            <h2 className="section-title" id="categories-title">Nos catégories</h2>
          </div>

          <div className="categories-grid" data-reveal-stagger>
            {([
              ['SUV',      'Domination tout-terrain', 'linear-gradient(160deg,#1a1505,#0a0a0a)'],
              ['Berline',  'Prestige & confort',      'linear-gradient(160deg,#05101a,#0a0a0a)'],
              ['Supercar', 'Performance absolue',     'linear-gradient(160deg,#1a0505,#0a0a0a)'],
              ['Citadine', 'Luxe urbain',             'linear-gradient(160deg,#0a1205,#0a0a0a)'],
            ] as [string, string, string][]).map(([cat, desc, grad]) => (
              <a key={cat} href={`/catalog?category=${encodeURIComponent(cat)}`} className="category-card" aria-label={`Catégorie ${cat}`}>
                <div className="category-card__bg" style={{ background: grad }} />
                <div className="category-card__overlay" />
                <div className="category-card__content">
                  <div className="category-card__label">Catégorie</div>
                  <div className="category-card__name">{cat}</div>
                  <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '.75rem' }}>{desc}</p>
                  <div className="category-card__cta">Explorer →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATISTIQUES ── */}
      <section className="section section--sm" aria-label="Chiffres clés">
        <div className="container">
          <div className="stats-grid" data-reveal-stagger>
            {[
              { n: 12, suffix: '', label: 'Modèles exclusifs' },
              { n: 4,  suffix: '', label: 'Catégories premium' },
              { n: 48, suffix: 'h', label: 'Délai de livraison' },
              { n: 100, suffix: '%', label: 'Satisfaction client' },
            ].map(({ n, suffix, label }) => (
              <div key={label} className="stat-card">
                <div className="stat-card__number">
                  <span data-counter={n} data-counter-suffix={suffix}>{n}{suffix}</span>
                </div>
                <div className="stat-card__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI LUXEDRIVE ── */}
      <section className="section" aria-labelledby="why-title">
        <div className="container">
          <div className="text-center mb-7" data-reveal>
            <p className="section-subtitle">Notre engagement</p>
            <h2 className="section-title" id="why-title">Pourquoi LUXEDRIVE ?</h2>
          </div>

          <div className="why-grid" data-reveal-stagger>
            <div className="why-card">
              <div className="why-card__icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="why-card__title">Authenticité garantie</h3>
              <p className="why-card__text">Chaque véhicule est rigoureusement sélectionné et certifié par nos experts. Historique complet, inspection 250 points et garantie constructeur incluse.</p>
            </div>

            <div className="why-card">
              <div className="why-card__icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="why-card__title">Livraison en 48h</h3>
              <p className="why-card__text">Votre véhicule livré à votre domicile ou en concession partenaire en moins de 48 heures. Suivi en temps réel et accompagnement personnalisé à chaque étape.</p>
            </div>

            <div className="why-card">
              <div className="why-card__icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="2" /><path d="M6 12H4M20 12h-2" />
                </svg>
              </div>
              <h3 className="why-card__title">Paiement sécurisé</h3>
              <p className="why-card__text">Transactions cryptées, multiple modes de paiement et financement sur mesure disponible. Votre sécurité financière est notre priorité absolue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNIÈRE CTA ── */}
      <section className="section section--sm" aria-label="Appel à l'action">
        <div className="container">
          <div data-reveal style={{
            background: 'linear-gradient(135deg, #111111 0%, #161616 100%)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(2.5rem, 6vw, 5rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div aria-hidden="true" style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: 400, height: 200,
              background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <p className="section-subtitle" style={{ position: 'relative' }}>Commencez maintenant</p>
            <h2 className="section-title" style={{ position: 'relative', marginBottom: '1rem' }}>
              Votre prochain véhicule<br />vous attend.
            </h2>
            <p style={{ color: 'var(--color-white-60)', maxWidth: 500, margin: '0 auto 2.5rem', position: 'relative', lineHeight: 1.7 }}>
              Explorez notre catalogue de {total} véhicules premium et trouvez la voiture qui vous correspond.
            </p>
            <div className="flex-center gap-4" style={{ flexWrap: 'wrap', position: 'relative' }}>
              <a href="/catalog" className="btn btn--primary btn--lg glow-anim">
                Explorer la collection
                <span className="btn__icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </a>
              <a href="/login" className="btn btn--outline btn--lg">Créer un compte</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
