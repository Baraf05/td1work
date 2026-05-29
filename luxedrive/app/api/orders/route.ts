import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const pool = getPool()
  const [orders] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [user.id]
  )
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { items, shipping, total } = await req.json() as {
    items: { vehicleId: number; quantity: number; price: number }[]
    shipping: Record<string, string>
    total: number
  }

  if (!items?.length) return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })

  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const [result] = await conn.execute<ResultSetHeader>(
      'INSERT INTO orders (user_id, total, status, shipping_address) VALUES (?, ?, ?, ?)',
      [user.id, total, 'pending', JSON.stringify(shipping || {})]
    )
    const orderId = result.insertId

    for (const item of items) {
      await conn.execute(
        'INSERT INTO order_items (order_id, vehicle_id, quantity, price_at_order) VALUES (?, ?, ?, ?)',
        [orderId, item.vehicleId, item.quantity, item.price]
      )
      await conn.execute(
        'UPDATE vehicles SET stock = GREATEST(0, stock - ?) WHERE id = ?',
        [item.quantity, item.vehicleId]
      )
    }

    await conn.commit()
    return NextResponse.json({ ok: true, orderId })
  } catch (err) {
    await conn.rollback()
    console.error(err)
    return NextResponse.json({ error: 'Erreur lors de la commande.' }, { status: 500 })
  } finally {
    conn.release()
  }
}
