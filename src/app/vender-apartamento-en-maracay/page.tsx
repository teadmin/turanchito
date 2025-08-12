import type { Metadata } from 'next'
import { generateMetaTitle, generateMetaDescription } from '@/lib/utils'
import { CityPropertyPage } from '@/components/CityPropertyPage'

const CITY = 'Maracay'
const PROPERTY_TYPE = 'apartment' as const
const TRANSACTION_TYPE = 'sale' as const

export const metadata: Metadata = {
  title: generateMetaTitle(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
  description: generateMetaDescription(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
  keywords: 'venta apartamentos maracay, apartamentos en venta maracay, propiedades maracay, bienes raices maracay, inmobiliaria maracay, apartamento maracay, vender apartamento maracay',
  openGraph: {
    title: generateMetaTitle(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
    description: generateMetaDescription(CITY, PROPERTY_TYPE, TRANSACTION_TYPE),
    type: 'website',
  },
  alternates: {
    canonical: 'https://inmobiliariave.com/vender-apartamento-en-maracay'
  }
}

export default function VenderApartamentoEnMaracayPage() {
  return (
    <CityPropertyPage 
      city={CITY}
      propertyType={PROPERTY_TYPE}
      transactionType={TRANSACTION_TYPE}
    />
  )
}