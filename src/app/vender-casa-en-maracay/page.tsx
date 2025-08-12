import type { Metadata } from 'next'
import { generateMetaTitle, generateMetaDescription } from '@/lib/utils'
import { CityPropertyPage } from '@/components/CityPropertyPage'

const CITY = 'Maracay'
const PROPERTY_TYPE = 'house' as const
const TRANSACTION_TYPE = 'sale' as const

export const metadata: Metadata = {
  title: generateMetaTitle(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
  description: generateMetaDescription(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
  keywords: 'venta casas maracay, casas en venta maracay, propiedades maracay, bienes raices maracay, inmobiliaria maracay, casa maracay, vender casa maracay',
  openGraph: {
    title: generateMetaTitle(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
    description: generateMetaDescription(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
    type: 'website',
  },
  alternates: {
    canonical: 'https://inmobiliariave.com/vender-casa-en-maracay'
  }
}

export default function VenderCasaEnMaracayPage() {
  return (
    <CityPropertyPage 
      city={CITY}
      propertyType={PROPERTY_TYPE}
      transactionType={TRANSACTION_TYPE}
    />
  )
}