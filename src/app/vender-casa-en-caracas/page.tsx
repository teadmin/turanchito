import type { Metadata } from 'next'
import { generateMetaTitle, generateMetaDescription } from '@/lib/utils'
import { CityPropertyPage } from '@/components/CityPropertyPage'

const CITY = 'Caracas'
const PROPERTY_TYPE = 'house' as const
const TRANSACTION_TYPE = 'sale' as const

export const metadata: Metadata = {
  title: generateMetaTitle(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
  description: generateMetaDescription(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
  keywords: 'venta casas caracas, casas en venta caracas, propiedades caracas, bienes raices caracas, inmobiliaria caracas, casa caracas, vender casa caracas',
  openGraph: {
    title: generateMetaTitle(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
    description: generateMetaDescription(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
    type: 'website',
  },
  alternates: {
    canonical: 'https://inmobiliariave.com/vender-casa-en-caracas'
  }
}

export default function VenderCasaEnCaracasPage() {
  return (
    <CityPropertyPage 
      city={CITY}
      propertyType={PROPERTY_TYPE}
      transactionType={TRANSACTION_TYPE}
    />
  )
}