import { NextRequest, NextResponse } from 'next/server'
import { getPool, decodeVehicle } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export async function GET(req: NextRequest) {
  const pool = getPool()
  const sp = req.nextUrl.searchParams
  const categories = sp.getAll('category')
  const brands     = sp.getAll('brand')
  const priceMax   = sp.get('price_max')
  const search     = sp.get('search')
  const sort       = sp.get('sort') || 'newest'
  const page       = Math.max(1, parseInt(sp.get('page') || '1'))
  const perPage    = 9

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
  const orderMap: Record<string, string> = { price_asc: 'price ASC', price_desc: 'price DESC', name_asc: 'name ASC', newest: 'created_at DESC' }
  const orderBy = orderMap[sort] || 'created_at DESC'

  const [countRows] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM vehicles ${wc}`, params)
  const total = (countRows[0] as RowDataPacket).total as number

  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM vehicles ${wc} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...params, perPage, (page - 1) * perPage]
  )

  const [priceRows] = await pool.execute<RowDataPacket[]>('SELECT MIN(price) as min_price, MAX(price) as max_price FROM vehicles')
  const [brandRows] = await pool.execute<RowDataPacket[]>('SELECT DISTINCT brand FROM vehicles ORDER BY brand ASC')

  return NextResponse.json({
    vehicles: rows.map(r => decodeVehicle(r as Record<string, unknown>)),
    total,
    page,
    totalPages: Math.ceil(total / perPage),
    priceRange: priceRows[0],
    brands: (brandRows as RowDataPacket[]).map(r => r.brand),
  })
}
