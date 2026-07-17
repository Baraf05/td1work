export const SITE_CONFIG = {
  stats: {
    transfers: 500,
    transfersSuffix: '+',
    transfersLabel: 'VIP TRANSFERS',
    availability: '24/7, 365',
    availabilityLabel: 'AVAILABILITY',
    incidents: 0,
    incidentsLabel: 'INCIDENTS',
    languages: 'EN · AR · FR · RU',
    languagesLabel: 'LANGUAGES',
  },
  caseStudies: [
    { text: 'Three-night artist residency — 8 vehicles, 47 transfers, zero delays.' },
    { text: 'Government delegation, 5 days — coordinated across three emirates.' },
  ],
  badges: ['RTA-licensed', 'NDA available', 'Airside protocol experience'],
  licenceNumber: '', // CLIENT TO FILL
  establishedYear: '', // CLIENT TO FILL
}

export const CATEGORIES = ['ALL', 'SEDANS', 'SUV', 'VANS & GROUPS', 'FLAGSHIP'] as const
export type VehicleCategory = (typeof CATEGORIES)[number]

export interface VehiclePricing {
  hourly: number
  halfDay: number
  fullDayDubai: number
  fullDayOutside: number
  extraHour: number
}

export interface FleetVehicle {
  id: string
  name: string
  category: VehicleCategory
  role: string
  pax: number
  bags: number
  wifi: boolean
  flagship?: boolean
  available: boolean
  pricing: VehiclePricing
  options: string[]
  gallery: string[]
  description: string
}

export const vehicles: FleetVehicle[] = [
  // SEDANS (5)
  { id: 'lexus-es-300h', name: 'Lexus ES 300h', category: 'SEDANS', role: 'Executive Sedan', pax: 3, bags: 3, wifi: true, available: true, pricing: { hourly: 180, halfDay: 600, fullDayDubai: 950, fullDayOutside: 1200, extraHour: 150 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi'], gallery: [], description: 'Refined hybrid comfort. The considered choice for executive transfers through the city.' },
  { id: 'mercedes-e-class', name: 'Mercedes-Benz E-Class', category: 'SEDANS', role: 'Business Sedan', pax: 3, bags: 3, wifi: true, available: true, pricing: { hourly: 200, halfDay: 700, fullDayDubai: 1100, fullDayOutside: 1400, extraHour: 170 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi', 'Tinted windows'], gallery: [], description: 'German precision and quiet comfort for business appointments and private arrivals.' },
  { id: 'bmw-5-series', name: 'BMW 5 Series', category: 'SEDANS', role: 'Performance Sedan', pax: 3, bags: 3, wifi: true, available: true, pricing: { hourly: 210, halfDay: 720, fullDayDubai: 1150, fullDayOutside: 1450, extraHour: 175 }, options: ['Chilled water', 'Device chargers', 'WiFi', 'Tinted windows'], gallery: [], description: 'Precision engineering for those who prefer a more dynamic journey.' },
  { id: 'lexus-ls-500h', name: 'Lexus LS 500h', category: 'SEDANS', role: 'Prestige Sedan', pax: 3, bags: 3, wifi: true, available: true, pricing: { hourly: 280, halfDay: 950, fullDayDubai: 1500, fullDayOutside: 1900, extraHour: 230 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi', 'Tinted windows', 'Noise insulation'], gallery: [], description: 'Japanese prestige at its most refined. Silent, considered, and impeccably appointed.' },
  { id: 'mercedes-s-class', name: 'Mercedes-Benz S-Class', category: 'SEDANS', role: 'Premier Sedan', pax: 3, bags: 3, wifi: true, available: true, pricing: { hourly: 350, halfDay: 1200, fullDayDubai: 1900, fullDayOutside: 2400, extraHour: 290 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi', 'Tinted windows', 'Rear entertainment'], gallery: [], description: 'The definitive executive sedan. Presence without announcement.' },
  // SUV (6)
  { id: 'toyota-highlander', name: 'Toyota Highlander', category: 'SUV', role: 'Family SUV', pax: 6, bags: 4, wifi: true, available: true, pricing: { hourly: 200, halfDay: 680, fullDayDubai: 1050, fullDayOutside: 1350, extraHour: 170 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi'], gallery: [], description: 'Versatile and spacious — the considered choice for family and group transfers.' },
  { id: 'toyota-land-cruiser', name: 'Toyota Land Cruiser 300', category: 'SUV', role: 'Luxury SUV', pax: 6, bags: 5, wifi: true, available: true, pricing: { hourly: 280, halfDay: 950, fullDayDubai: 1500, fullDayOutside: 1900, extraHour: 230 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi', 'Tinted windows'], gallery: [], description: 'Commanding presence and absolute reliability — proven across every terrain.' },
  { id: 'lexus-lx-600', name: 'Lexus LX 600', category: 'SUV', role: 'Premium SUV', pax: 6, bags: 5, wifi: true, available: true, pricing: { hourly: 320, halfDay: 1100, fullDayDubai: 1750, fullDayOutside: 2200, extraHour: 260 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi', 'Tinted windows', 'Rear screens'], gallery: [], description: 'Lexus luxury at its most capable — a vehicle that arrives with quiet authority.' },
  { id: 'chevrolet-tahoe', name: 'Chevrolet Tahoe', category: 'SUV', role: 'Large SUV', pax: 7, bags: 5, wifi: true, available: true, pricing: { hourly: 240, halfDay: 820, fullDayDubai: 1300, fullDayOutside: 1650, extraHour: 200 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi'], gallery: [], description: 'American scale and reliability for larger groups and extended journeys.' },
  { id: 'nissan-patrol', name: 'Nissan Patrol Platinum', category: 'SUV', role: 'Prestige SUV', pax: 7, bags: 5, wifi: true, available: true, pricing: { hourly: 260, halfDay: 880, fullDayDubai: 1400, fullDayOutside: 1800, extraHour: 215 }, options: ['Chilled water', 'Device chargers', 'WiFi', 'Tinted windows'], gallery: [], description: 'An institution in the UAE. Recognised, reliable, and discreetly commanding.' },
  { id: 'range-rover-sport', name: 'Range Rover Sport', category: 'SUV', role: 'Performance SUV', pax: 5, bags: 4, wifi: true, available: true, pricing: { hourly: 340, halfDay: 1150, fullDayDubai: 1850, fullDayOutside: 2350, extraHour: 280 }, options: ['Chilled water', 'Device chargers', 'WiFi', 'Tinted windows'], gallery: [], description: 'Where composure meets capability. A vehicle that reads as considered in any setting.' },
  // VANS & GROUPS (5)
  { id: 'chevrolet-suburban', name: 'Chevrolet Suburban', category: 'VANS & GROUPS', role: 'Extended SUV', pax: 7, bags: 6, wifi: true, available: true, pricing: { hourly: 280, halfDay: 950, fullDayDubai: 1500, fullDayOutside: 1900, extraHour: 230 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi'], gallery: [], description: 'Maximum passenger capacity with full premium comfort — ideal for delegations.' },
  { id: 'gmc-yukon-xl', name: 'GMC Yukon XL', category: 'VANS & GROUPS', role: 'Extended SUV', pax: 7, bags: 7, wifi: true, available: true, pricing: { hourly: 290, halfDay: 980, fullDayDubai: 1550, fullDayOutside: 1950, extraHour: 240 }, options: ['Chilled water', 'Device chargers', 'WiFi'], gallery: [], description: 'Full-size American presence. Chosen for high-profile delegations requiring scale.' },
  { id: 'mercedes-v-class', name: 'Mercedes-Benz V-Class VIP', category: 'VANS & GROUPS', role: 'Luxury Van', pax: 6, bags: 8, wifi: true, available: true, pricing: { hourly: 350, halfDay: 1200, fullDayDubai: 1900, fullDayOutside: 2400, extraHour: 290 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi', 'Rear conference setup', 'Privacy screen'], gallery: [], description: 'A mobile meeting room. Fully configured for privacy, comfort, and executive productivity.' },
  { id: 'toyota-hiace-vip', name: 'Toyota HiAce VIP', category: 'VANS & GROUPS', role: 'Group Van', pax: 10, bags: 10, wifi: true, available: true, pricing: { hourly: 320, halfDay: 1100, fullDayDubai: 1750, fullDayOutside: 2200, extraHour: 260 }, options: ['Chilled water', 'WiFi', 'Air conditioning (independent rear)'], gallery: [], description: 'Elevated group transport for touring productions, sports teams and larger delegations.' },
  { id: 'toyota-coaster-vip', name: 'Toyota Coaster VIP', category: 'VANS & GROUPS', role: 'Luxury Coach', pax: 20, bags: 20, wifi: true, available: true, pricing: { hourly: 500, halfDay: 1800, fullDayDubai: 2800, fullDayOutside: 3500, extraHour: 400 }, options: ['Chilled water', 'WiFi', 'Reclining seats', 'Air conditioning'], gallery: [], description: 'Full-scale luxury coaching for large groups, production crews, and event convoys.' },
  // FLAGSHIP (4)
  { id: 'cadillac-escalade-esv', name: 'Cadillac Escalade ESV', category: 'FLAGSHIP', role: 'Flagship Extended SUV', pax: 6, bags: 6, wifi: true, flagship: true, available: true, pricing: { hourly: 420, halfDay: 1450, fullDayDubai: 2300, fullDayOutside: 2900, extraHour: 350 }, options: ['Chilled water', 'Device chargers', 'Child seat on request', 'WiFi', 'Tinted windows', 'Privacy screen', 'Rear entertainment'], gallery: [], description: 'The pinnacle of the fleet. Scale, presence, and quiet distinction in every journey.' },
  { id: 'mercedes-s580', name: 'Mercedes-Benz S 580', category: 'FLAGSHIP', role: 'Flagship Sedan', pax: 3, bags: 3, wifi: true, flagship: true, available: true, pricing: { hourly: 480, halfDay: 1650, fullDayDubai: 2600, fullDayOutside: 3300, extraHour: 400 }, options: ['Chilled water', 'Device chargers', 'WiFi', 'Tinted windows', 'Rear entertainment', 'Fragrance system', 'Massage seats'], gallery: [], description: 'The highest expression of German automotive excellence. Reserved for those who understand the difference.' },
  { id: 'lincoln-navigator', name: 'Lincoln Navigator Black Label', category: 'FLAGSHIP', role: 'Flagship SUV', pax: 6, bags: 5, wifi: true, flagship: true, available: true, pricing: { hourly: 440, halfDay: 1500, fullDayDubai: 2400, fullDayOutside: 3000, extraHour: 360 }, options: ['Chilled water', 'Device chargers', 'WiFi', 'Tinted windows', 'Privacy screen', 'Rear entertainment', 'Custom lighting'], gallery: [], description: 'American flagship luxury, configured with absolute discretion and full executive appointment.' },
  { id: 'range-rover-autobiography', name: 'Range Rover Autobiography', category: 'FLAGSHIP', role: 'Flagship Luxury SUV', pax: 4, bags: 4, wifi: true, flagship: true, available: true, pricing: { hourly: 520, halfDay: 1800, fullDayDubai: 2850, fullDayOutside: 3600, extraHour: 430 }, options: ['Chilled water', 'Device chargers', 'WiFi', 'Tinted windows', 'Privacy screen', 'Rear entertainment', 'Folding tables', 'Refrigerator'], gallery: [], description: 'The definitive statement vehicle. Chosen by those for whom nothing else will do.' },
]

export function getVehicle(id: string): FleetVehicle | undefined {
  return vehicles.find(v => v.id === id)
}
