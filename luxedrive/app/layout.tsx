import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import SmoothScroll from '@/components/SmoothScroll'
import LoadSequence from '@/components/LoadSequence'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Elite Class — Private Chauffeur Dubai',
  description: 'Premium private chauffeur service in Dubai. VIP transport, artist transfers, multi-vehicle coordination, airport transfers, chauffeur Dubai, VIP transport Dubai, event transportation, Abu Dhabi transfer. Available 24/7.',
  keywords: ['chauffeur Dubai', 'VIP transport Dubai', 'private driver Dubai', 'artist transport Dubai', 'event transportation Dubai', 'multi-vehicle coordination', 'airport transfer Dubai', 'Abu Dhabi transfer', 'luxury chauffeur UAE'],
  openGraph: {
    title: 'Elite Class — Private Chauffeur Dubai',
    description: 'The ground standard for Dubai\'s most demanding guests. Private ground transportation. No exceptions.',
    type: 'website',
    locale: 'en_AE',
    // OG image slot — swap in real image when available
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Elite Class — Private Chauffeur Dubai' }],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://elite-class-mu.vercel.app/#business',
      name: 'Elite Class',
      description: 'Premium private chauffeur service in Dubai. VIP transport, artist transfers, multi-vehicle coordination.',
      url: 'https://elite-class-mu.vercel.app',
      telephone: '+971542370940',
      email: 'info@eliteclasslimo.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bayswater Tower, Office 1003',
        addressLocality: 'Business Bay',
        addressRegion: 'Dubai',
        addressCountry: 'AE',
      },
      openingHours: 'Mo-Su 00:00-24:00',
      priceRange: '$$$$',
      currenciesAccepted: 'AED, USD, EUR',
      areaServed: ['Dubai', 'Abu Dhabi', 'Sharjah', 'UAE'],
    },
    {
      '@type': 'Service',
      name: 'Private Chauffeur Service Dubai',
      provider: { '@id': 'https://elite-class-mu.vercel.app/#business' },
      serviceType: 'Chauffeur Service',
      areaServed: 'Dubai, UAE',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What areas do you cover?', acceptedAnswer: { '@type': 'Answer', text: 'We operate across Dubai and the wider UAE — Abu Dhabi, Sharjah, Ras Al Khaimah. Cross-border transfers to Oman are available with 24 hours notice.' } },
        { '@type': 'Question', name: 'How do I pay?', acceptedAnswer: { '@type': 'Answer', text: 'Payment is arranged directly — cash (AED, USD, EUR) or bank transfer before departure. No online payment is required.' } },
        { '@type': 'Question', name: 'Do chauffeurs wait at the airport?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Your chauffeur tracks your flight in real time and waits up to 60 minutes after landing at no extra charge.' } },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CustomCursor />
        <LoadSequence />
        <SmoothScroll>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <WhatsAppButton />
      </body>
    </html>
  )
}
