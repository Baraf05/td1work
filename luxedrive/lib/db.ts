import mysql from 'mysql2/promise'

const g = global as typeof global & { _pool?: mysql.Pool }

export function getPool(): mysql.Pool {
  if (!g._pool) {
    g._pool = mysql.createPool({
      host:              process.env.DB_HOST     || 'mysql-brf.alwaysdata.net',
      database:          process.env.DB_NAME     || 'brf_luxedrive',
      user:              process.env.DB_USER     || 'brf',
      password:          process.env.DB_PASS     || 'Luxedrive2026!',
      waitForConnections: true,
      connectionLimit:   5,
      charset:           'utf8mb4',
    })
  }
  return g._pool
}

export function decodeVehicle(row: Record<string, unknown>) {
  for (const f of ['specs', 'images', 'colors']) {
    if (typeof row[f] === 'string') {
      try { row[f] = JSON.parse(row[f] as string) } catch { row[f] = [] }
    }
  }
  return row
}

export function imgUrl(img: string): string {
  if (!img) return '/assets/images/placeholder.jpg'
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return '/assets/images/' + img
}
