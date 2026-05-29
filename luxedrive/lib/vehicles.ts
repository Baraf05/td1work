export interface Vehicle {
  id: string
  name: string
  type: string
  pax: number
  bags: number
  wifi: boolean
  flagship?: boolean
  description: string
}

export function getVehicle(id: string): Vehicle | undefined {
  return vehicles.find(v => v.id === id)
}

export const vehicles: Vehicle[] = [
  {
    id: 'lexus-es',
    name: 'Lexus ES 300h',
    type: 'EXECUTIVE SEDAN',
    pax: 3,
    bags: 3,
    wifi: true,
    description: 'Refined comfort for business transfers and executive travel through the city.',
  },
  {
    id: 'toyota-highlander',
    name: 'Toyota Highlander',
    type: 'PREMIUM SUV',
    pax: 6,
    bags: 4,
    wifi: true,
    description: 'Versatile and spacious — the considered choice for groups and family transfers.',
  },
  {
    id: 'chevrolet-suburban',
    name: 'Chevrolet Suburban',
    type: 'LARGE SUV',
    pax: 7,
    bags: 6,
    wifi: true,
    description: 'Maximum capacity with premium comfort, ideal for delegations and larger groups.',
  },
  {
    id: 'cadillac-escalade',
    name: 'Cadillac Escalade',
    type: 'FLAGSHIP SUV',
    pax: 6,
    bags: 5,
    wifi: true,
    flagship: true,
    description: 'The pinnacle of the fleet. Presence, space, and quiet distinction in every journey.',
  },
]
