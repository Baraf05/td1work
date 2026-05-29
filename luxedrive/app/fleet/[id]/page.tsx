import { redirect } from 'next/navigation'
import { vehicles } from '@/lib/vehicles'

export function generateStaticParams() {
  return vehicles.map(v => ({ id: v.id }))
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  void id
  redirect('/#fleet')
}
