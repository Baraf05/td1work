import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { signToken, cookieOpts, COOKIE_NAME } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

export async function POST(req: NextRequest) {
  const { first_name, last_name, email, password } = await req.json()

  if (!first_name || !last_name || !email || !password)
    return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })

  if (password.length < 8)
    return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' }, { status: 400 })

  const pool = getPool()
  const [existing] = await pool.execute<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email])
  if ((existing as RowDataPacket[]).length)
    return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 409 })

  const hash = await bcrypt.hash(password, 12)
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, email, hash, 'customer']
  )

  const token = await signToken({ id: result.insertId, email, first_name, last_name, role: 'customer' })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, cookieOpts())
  return res
}
