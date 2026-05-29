import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { signToken, cookieOpts, COOKIE_NAME } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import type { RowDataPacket } from 'mysql2'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password)
    return NextResponse.json({ error: 'Champs requis.' }, { status: 400 })

  const pool = getPool()
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
  )
  const user = rows[0] as RowDataPacket | undefined
  if (!user) return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 })

  const ok = await bcrypt.compare(password, user.password as string)
  if (!ok) return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 })

  const token = await signToken({ id: user.id as number, email: user.email as string, first_name: user.first_name as string, last_name: user.last_name as string, role: user.role as string })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, cookieOpts())
  return res
}
