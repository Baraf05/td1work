import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import FleetSection from '@/components/FleetSection'
import Services from '@/components/Services'
import CoordinatedMovements from '@/components/CoordinatedMovements'
import Partners from '@/components/Partners'
import PartnerForm from '@/components/PartnerForm'
import OurStandard from '@/components/OurStandard'
import StatsBand from '@/components/StatsBand'
import ReservationForm from '@/components/ReservationForm'
import FAQ from '@/components/FAQ'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FleetSection />
      <Services />
      <CoordinatedMovements />
      <Partners />
      <PartnerForm />
      <OurStandard />
      <StatsBand />
      <ReservationForm />
      <FAQ />
    </>
  )
}
