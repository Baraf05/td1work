import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import type { RowDataPacket } from 'mysql2'

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { current_password, new_password } = await req.json() as {
    current_password: string
    new_password: string
  }

  if (!current_password || !new_password)
    return NextResponse.json({ error: 'Champs requis.' }, { status: 400 })

  if (new_password.length < 8)
    return NextResponse.json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' }, { status: 400 })

  const pool = getPool()
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT password FROM users WHERE id = ?', [user.id])
  const dbUser = rows[0] as RowDataPacket | undefined
  if (!dbUser) return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 })

  const ok = await bcrypt.compare(current_password, dbUser.password as string)
  if (!ok) return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 })

  const hash = await bcrypt.hash(new_password, 12)
  await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hash, user.id])

  return NextResponse.json({ ok: true })
}
