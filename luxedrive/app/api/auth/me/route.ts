import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { first_name, last_name, email } = await req.json() as {
    first_name: string; last_name: string; email: string
  }
  if (!first_name || !last_name || !email)
    return NextResponse.json({ error: 'Champs requis.' }, { status: 400 })

  const pool = getPool()
  const [existing] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM users WHERE email = ? AND id != ?', [email, user.id]
  )
  if ((existing as RowDataPacket[]).length)
    return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 409 })

  await pool.execute(
    'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
    [first_name, last_name, email, user.id]
  )
  return NextResponse.json({ ok: true })
}
