import { Star } from 'lucide-react'

const items = [
  'Rolls-Royce', 'Bentley', 'Ferrari', 'McLaren',
  'Lamborghini', 'Aston Martin', 'Porsche', 'Range Rover',
  'Rolls-Royce', 'Bentley', 'Ferrari', 'McLaren',
  'Lamborghini', 'Aston Martin', 'Porsche', 'Range Rover',
]

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-[#D8D0C6] bg-[#F0EBE3] py-5">
      <div className="marquee-track flex gap-0 whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-5 px-5">
            <Star size={10} className="text-[#B8882A] fill-[#B8882A] shrink-0" />
            <span className="font-display font-semibold text-sm tracking-widest uppercase text-dark/70">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
