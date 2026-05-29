import { NextRequest, NextResponse } from 'next/server'
import { getPool, decodeVehicle } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pool = getPool()

  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM vehicles WHERE id = ?', [id])
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const vehicle = decodeVehicle(rows[0] as Record<string, unknown>)

  const [similar] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM vehicles WHERE category = ? AND id != ? ORDER BY RAND() LIMIT 3',
    [String(vehicle.category), id]
  )

  return NextResponse.json({ vehicle, similar: similar.map(r => decodeVehicle(r as Record<string, unknown>)) })
}
