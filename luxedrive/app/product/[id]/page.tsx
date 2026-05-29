import { notFound } from 'next/navigation'
import { getPool, decodeVehicle, imgUrl } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

async function getData(id: string) {
  const pool = getPool()
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM vehicles WHERE id = ?', [id])
  if (!rows.length) return null

  const vehicle = decodeVehicle(rows[0] as Record<string, unknown>)
  const [similar] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM vehicles WHERE category = ? AND id != ? ORDER BY RAND() LIMIT 3',
    [String(vehicle.category), id]
  )

  return {
    vehicle,
    similar: similar.map(r => decodeVehicle(r as Record<string, unknown>)),
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getData(id)
  if (!data) notFound()

  const { vehicle: v, similar } = data
  const images  = (v.images  as string[]) || ['placeholder.jpg']
  const colors  = (v.colors  as string[]) || []
  const specs   = (v.specs   as Record<string, string>) || {}
  const inStock = Number(v.stock) > 0

  const specLabels: Record<string, string> = {
    puissance:    'Puissance',
    couple:       'Couple',
    '0_100':      '0 à 100 km/h',
    vitesse_max:  'Vitesse max',
    moteur:       'Moteur',
    transmission: 'Transmission',
    places:       'Places',
    consommation: 'Consommation',
    longueur:     'Longueur',
    poids:        'Poids',
  }

  return (
    <section className="section section--sm">
      <div className="container">

        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: '2rem' }} data-reveal>
          <ol style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.75rem', color: 'var(--color-white-30)' }}>
            <li><a href="/" className="breadcrumb-link">Accueil</a></li>
            <li aria-hidden="true" style={{ color: 'var(--color-white-10)' }}>›</li>
            <li><a href="/catalog" className="breadcrumb-link">Collection</a></li>
            <li aria-hidden="true" style={{ color: 'var(--color-white-10)' }}>›</li>
            <li><a href={`/catalog?category=${encodeURIComponent(String(v.category))}`} className="breadcrumb-link">{String(v.category)}</a></li>
            <li aria-hidden="true" style={{ color: 'var(--color-white-10)' }}>›</li>
            <li style={{ color: 'var(--color-white-60)' }} aria-current="page">{String(v.name)}</li>
          </ol>
        </nav>

        {/* Layout produit */}
        <div className="product-layout">

          {/* ── Galerie ── */}
          <div className="product-gallery" data-reveal="left">
            <div className="product-gallery__main" id="main-gallery">
              <img
                id="main-gallery-img"
                src={imgUrl(images[0])}
                alt={String(v.name)}
                width={800}
                height={600}
              />
            </div>
            {images.length > 1 && (
              <div className="product-gallery__thumbs" role="list" aria-label="Vignettes">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-gallery__thumb${i === 0 ? ' active' : ''}`}
                    aria-label={`Image ${i + 1}`}
                    role="listitem"
                    type="button"
                  >
                    <img
                      src={imgUrl(img)}
                      alt={`Vue ${i + 1} — ${v.name}`}
                      loading="lazy"
                      width={200}
                      height={150}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Informations produit ── */}
          <div data-reveal="right">
            <div className="product-info__brand">{String(v.brand)}</div>
            <h1 className="product-info__name">{String(v.name)}</h1>

            <div className={`product-info__stock ${inStock ? 'product-info__stock--in' : 'product-info__stock--out'}`}>
              {inStock
                ? `En stock — ${v.stock} disponible${Number(v.stock) > 1 ? 's' : ''}`
                : 'Sur commande'}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span className="price-tag price-tag--large">
                {Number(v.price).toLocaleString('fr-FR')} €
              </span>
              <span style={{ fontSize: '.75rem', color: 'var(--color-white-30)', marginLeft: '.5rem' }}>TTC · Livraison incluse</span>
            </div>

            <p className="product-info__description">{String(v.description)}</p>

            {/* Couleurs */}
            {colors.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-white-60)', marginBottom: '.75rem' }}>
                  Couleur : <span id="selected-color" style={{ color: 'var(--color-white-90)' }}>{colors[0]}</span>
                </div>
                <div className="color-swatches" role="group" aria-label="Choisir une couleur">
                  {colors.map(color => (
                    <button
                      key={color}
                      className="color-swatch"
                      style={{ background: color }}
                      data-color-name={color}
                      aria-label={`Couleur ${color}`}
                      type="button"
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3" style={{ flexWrap: 'wrap', marginBottom: '2rem' }}>
              {inStock ? (
                <button
                  className="btn btn--primary btn--lg"
                  data-add-cart={String(v.id)}
                  data-name={String(v.name)}
                  data-price={String(v.price)}
                  data-brand={String(v.brand)}
                  data-category={String(v.category)}
                  data-image={imgUrl(images[0])}
                  aria-label={`Ajouter ${v.name} au panier`}
                  style={{ flex: 1, minWidth: 200 }}
                >
                  Ajouter au panier
                  <span className="btn__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </span>
                </button>
              ) : (
                <button className="btn btn--outline btn--lg" disabled style={{ flex: 1, minWidth: 200, opacity: 0.5 }}>
                  Sur commande
                </button>
              )}
              <a href="/catalog" className="btn btn--ghost btn--lg">← Retour</a>
            </div>

            {/* Garanties */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem' }}>
              {([
                ['Livraison 48h', 'M5 12h14M12 5l7 7-7 7'],
                ['Garantie 2 ans', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
                ['Paiement sécurisé', 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'],
              ] as [string, string][]).map(([label, d]) => (
                <div key={label} style={{ padding: '.75rem', background: 'var(--color-bg-2)', border: '1px solid var(--color-white-05)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" style={{ margin: '0 auto .4rem', display: 'block' }} aria-hidden="true">
                    <path d={d} />
                  </svg>
                  <div style={{ fontSize: '.65rem', color: 'var(--color-white-60)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Fiche technique ── */}
        {Object.keys(specs).length > 0 && (
          <div style={{ marginTop: '5rem' }} data-reveal>
            <div className="divider"><div className="divider__icon" /></div>
            <h2 className="section-title" style={{ marginBottom: '2rem', marginTop: '2rem' }}>Fiche technique</h2>
            <div className="product-specs" data-reveal-stagger>
              {Object.entries(specLabels).map(([key, label]) => {
                if (!specs[key]) return null
                return (
                  <div key={key} className="spec-item">
                    <div className="spec-item__label">{label}</div>
                    <div className="spec-item__value">{specs[key]}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Véhicules similaires ── */}
        {similar.length > 0 && (
          <div style={{ marginTop: '5rem' }} data-reveal>
            <div className="divider"><div className="divider__icon" /></div>
            <h2 className="section-title" style={{ margin: '2rem 0' }}>Vous aimerez aussi</h2>
            <div className="featured-grid" data-reveal-stagger>
              {similar.map((s: Record<string, unknown>) => {
                const simImages = (s.images as string[]) || []
                const simSpecs  = (s.specs  as Record<string, string>) || {}
                const simImg    = simImages[0] ?? 'placeholder.jpg'
                return (
                  <article key={String(s.id)} className="vehicle-card card-glow">
                    <div className="vehicle-card__image-wrap">
                      <img
                        src={imgUrl(simImg)}
                        alt={String(s.name)}
                        loading="lazy"
                        width={400}
                        height={250}
                      />
                      <span className="vehicle-card__badge">{String(s.category)}</span>
                      <div className="vehicle-card__overlay">
                        <a href={`/product/${s.id}`} className="btn btn--outline btn--sm">Voir</a>
                        <button
                          className="btn btn--primary btn--sm"
                          data-add-cart={String(s.id)}
                          data-name={String(s.name)}
                          data-price={String(s.price)}
                          data-brand={String(s.brand)}
                          data-category={String(s.category)}
                          data-image={imgUrl(simImg)}
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                    <div className="vehicle-card__body">
                      <div className="vehicle-card__brand">{String(s.brand)}</div>
                      <h3 className="vehicle-card__name">{String(s.name)}</h3>
                      <div className="vehicle-card__specs">
                        <div className="vehicle-card__spec">
                          <span className="vehicle-card__spec-label">Puissance</span>
                          <span className="vehicle-card__spec-value">{simSpecs.puissance ?? 'N/A'}</span>
                        </div>
                        <div className="vehicle-card__spec">
                          <span className="vehicle-card__spec-label">0–100</span>
                          <span className="vehicle-card__spec-value">{simSpecs['0_100'] ?? 'N/A'}</span>
                        </div>
                      </div>
                      <div className="vehicle-card__footer">
                        <span className="price-tag">{Number(s.price).toLocaleString('fr-FR')} €</span>
                        <a href={`/product/${s.id}`} className="btn btn--ghost btn--sm">Détails</a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
