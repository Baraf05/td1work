import { getPool, decodeVehicle, imgUrl } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

function getArr(sp: Record<string, string | string[] | undefined>, key: string): string[] {
  const val = sp[key]
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

async function getData(sp: Record<string, string | string[] | undefined>) {
  const categories = getArr(sp, 'category')
  const brands     = getArr(sp, 'brand')
  const priceMax   = sp.price_max as string | undefined
  const search     = sp.search as string | undefined
  const sort       = (sp.sort as string) || 'newest'
  const page       = Math.max(1, parseInt((sp.page as string) || '1'))
  const perPage    = 9

  const pool = getPool()
  const where: string[] = []
  const params: (string | number)[] = []

  if (categories.length) {
    where.push(`category IN (${categories.map(() => '?').join(',')})`)
    params.push(...categories)
  }
  if (brands.length) {
    where.push(`brand IN (${brands.map(() => '?').join(',')})`)
    params.push(...brands)
  }
  if (priceMax) { where.push('price <= ?'); params.push(parseFloat(priceMax)) }
  if (search) {
    where.push('(name LIKE ? OR brand LIKE ? OR description LIKE ?)')
    const t = `%${search}%`; params.push(t, t, t)
  }

  const wc = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const orderMap: Record<string, string> = {
    price_asc: 'price ASC', price_desc: 'price DESC',
    name_asc: 'name ASC', newest: 'created_at DESC',
  }
  const orderBy = orderMap[sort] || 'created_at DESC'

  const [countRows] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM vehicles ${wc}`, params)
  const total = (countRows[0] as RowDataPacket).total as number

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM vehicles ${wc} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...params, perPage, (page - 1) * perPage]
  )
  const [priceRows] = await pool.execute<RowDataPacket[]>(
    'SELECT MIN(price) as min_price, MAX(price) as max_price FROM vehicles'
  )
  const [brandRows] = await pool.execute<RowDataPacket[]>(
    'SELECT DISTINCT brand FROM vehicles ORDER BY brand ASC'
  )

  return {
    vehicles: rows.map(r => decodeVehicle(r as Record<string, unknown>)),
    total,
    page,
    totalPages: Math.ceil(total / perPage),
    priceRange: priceRows[0] as RowDataPacket,
    allBrands: (brandRows as RowDataPacket[]).map(r => r.brand as string),
    categories,
    selectedBrands: brands,
    priceMax: priceMax ? parseInt(priceMax) : undefined,
    search: search || '',
    sort,
  }
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const d = await getData(sp)

  function paginationUrl(p: number) {
    const q = new URLSearchParams()
    d.categories.forEach(c => q.append('category', c))
    d.selectedBrands.forEach(b => q.append('brand', b))
    if (d.priceMax) q.set('price_max', String(d.priceMax))
    if (d.search) q.set('search', d.search)
    if (d.sort !== 'newest') q.set('sort', d.sort)
    q.set('page', String(p))
    return '/catalog?' + q.toString()
  }

  return (
    <>
      {/* En-tête */}
      <div style={{ background: 'var(--color-bg-2)', borderBottom: '1px solid var(--color-white-05)', padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <p className="section-subtitle" data-reveal>Notre sélection</p>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }} data-reveal>
            <h1 className="section-title">Collection complète</h1>
            <p style={{ color: 'var(--color-white-60)', fontSize: '.9rem' }}>
              <strong className="text-gold">{d.total}</strong> véhicule{d.total > 1 ? 's' : ''} disponible{d.total > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Layout */}
      <section className="section section--sm">
        <div className="container">
          <div className="catalog-layout">

            {/* ── Sidebar filtres ── */}
            <aside className="sidebar" aria-label="Filtres">
              <form id="filter-form" method="GET" action="/catalog">
                <div className="sidebar__title">Filtrer</div>

                {/* Catégorie */}
                <div className="filter-group">
                  <div className="filter-group__label">Catégorie</div>
                  {(['SUV', 'Berline', 'Supercar', 'Citadine'] as string[]).map(cat => (
                    <label key={cat} className="filter-option">
                      <input
                        type="checkbox"
                        name="category"
                        value={cat}
                        defaultChecked={d.categories.includes(cat)}
                      />
                      <span className="filter-option__text">{cat}</span>
                    </label>
                  ))}
                </div>

                {/* Marque */}
                {d.allBrands.length > 0 && (
                  <div className="filter-group">
                    <div className="filter-group__label">Marque</div>
                    {d.allBrands.map(brand => (
                      <label key={brand} className="filter-option">
                        <input
                          type="checkbox"
                          name="brand"
                          value={brand}
                          defaultChecked={d.selectedBrands.includes(brand)}
                        />
                        <span className="filter-option__text">{brand}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Prix max */}
                <div className="filter-group">
                  <div className="filter-group__label">Budget maximum</div>
                  <div className="range-wrap">
                    <div className="range-labels">
                      <span>{Number(d.priceRange.min_price).toLocaleString('fr-FR')} €</span>
                      <span id="price-max-label">
                        {(d.priceMax ?? Number(d.priceRange.max_price)).toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <input
                      type="range"
                      id="price-max"
                      name="price_max"
                      min={String(Math.floor(Number(d.priceRange.min_price)))}
                      max={String(Math.ceil(Number(d.priceRange.max_price)))}
                      defaultValue={String(d.priceMax ?? Math.ceil(Number(d.priceRange.max_price)))}
                      step="5000"
                      aria-label="Budget maximum"
                    />
                  </div>
                </div>

                {/* Recherche texte */}
                <div className="filter-group">
                  <div className="filter-group__label">Recherche</div>
                  <input
                    type="text"
                    name="search"
                    className="form-input"
                    placeholder="Nom, marque..."
                    defaultValue={d.search}
                    style={{ padding: '10px 14px', fontSize: '.85rem' }}
                  />
                </div>

                <a href="/catalog" className="btn btn--ghost w-full" style={{ marginTop: '.5rem', fontSize: '.75rem', justifyContent: 'center' }}>
                  Réinitialiser les filtres
                </a>
              </form>
            </aside>

            {/* ── Grille véhicules ── */}
            <div>
              {/* Barre tri */}
              <div className="catalog-header">
                <p style={{ color: 'var(--color-white-60)', fontSize: '.85rem' }}>
                  <span className="text-gold font-bold">{d.total}</span> résultat{d.total > 1 ? 's' : ''}
                </p>
                <div className="flex gap-3" style={{ alignItems: 'center' }}>
                  <label htmlFor="sort-select" className="sr-only">Trier par</label>
                  <select
                    id="sort-select"
                    name="sort"
                    className="sort-select"
                    form="filter-form"
                    aria-label="Trier par"
                    defaultValue={d.sort}
                  >
                    <option value="newest">Plus récents</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="name_asc">Nom A–Z</option>
                  </select>
                </div>
              </div>

              {/* Grille */}
              <div className="catalog-grid" id="catalog-grid" data-reveal-stagger>
                {d.vehicles.length === 0 ? (
                  <p className="text-muted text-center" style={{ padding: '4rem', gridColumn: '1/-1' }}>
                    Aucun véhicule ne correspond à votre recherche.
                  </p>
                ) : (
                  d.vehicles.map((v: Record<string, unknown>) => {
                    const images = v.images as string[]
                    const specs  = v.specs as Record<string, string>
                    const image  = images?.[0] ?? 'placeholder.jpg'
                    const power  = specs?.puissance ?? 'N/A'
                    const speed  = specs?.['0_100']  ?? 'N/A'
                    const stock  = Number(v.stock)
                    return (
                      <article key={String(v.id)} className="vehicle-card card-glow">
                        <div className="vehicle-card__image-wrap">
                          <img
                            src={imgUrl(image)}
                            alt={String(v.name)}
                            loading="lazy"
                            width={400}
                            height={250}
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
                          <h2 className="vehicle-card__name">{String(v.name)}</h2>
                          <div className="vehicle-card__specs">
                            <div className="vehicle-card__spec">
                              <span className="vehicle-card__spec-label">Puissance</span>
                              <span className="vehicle-card__spec-value">{power}</span>
                            </div>
                            <div className="vehicle-card__spec">
                              <span className="vehicle-card__spec-label">0–100</span>
                              <span className="vehicle-card__spec-value">{speed}</span>
                            </div>
                            <div className="vehicle-card__spec">
                              <span className="vehicle-card__spec-label">Stock</span>
                              <span
                                className="vehicle-card__spec-value"
                                style={{ color: stock > 0 ? 'var(--color-success)' : 'var(--color-error)' }}
                              >
                                {stock > 0 ? `${stock} dispo` : 'Rupture'}
                              </span>
                            </div>
                          </div>
                          <div className="vehicle-card__footer">
                            <span className="price-tag">{Number(v.price).toLocaleString('fr-FR')} €</span>
                            <a href={`/product/${v.id}`} className="btn btn--ghost btn--sm">Détails</a>
                          </div>
                        </div>
                      </article>
                    )
                  })
                )}
              </div>

              {/* Pagination */}
              {d.totalPages > 1 && (
                <nav className="pagination" aria-label="Pagination">
                  {d.page > 1 && (
                    <a href={paginationUrl(d.page - 1)} className="pagination__btn" aria-label="Page précédente">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </a>
                  )}
                  {Array.from({ length: Math.min(5, d.totalPages) }, (_, i) => {
                    const p = Math.max(1, d.page - 2) + i
                    if (p > d.totalPages) return null
                    return (
                      <a
                        key={p}
                        href={paginationUrl(p)}
                        className={`pagination__btn${p === d.page ? ' active' : ''}`}
                        aria-label={`Page ${p}`}
                        aria-current={p === d.page ? 'page' : undefined}
                      >
                        {p}
                      </a>
                    )
                  })}
                  {d.page < d.totalPages && (
                    <a href={paginationUrl(d.page + 1)} className="pagination__btn" aria-label="Page suivante">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                    </a>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
