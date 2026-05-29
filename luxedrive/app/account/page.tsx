import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getPool } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'
import AccountClient from './AccountClient'

async function getOrders(userId: number) {
  const pool = getPool()
  const [orders] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  )
  return orders as RowDataPacket[]
}

export default async function AccountPage() {
  const user = await getSession()
  if (!user) redirect('/login?redirect=/account')

  const orders = await getOrders(user.id)

  return <AccountClient user={user} orders={orders} />
}
