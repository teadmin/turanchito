import type { Metadata } from 'next'
import { MapView } from '@/components/MapView'

export const metadata: Metadata = {
  title: 'Mapa de Propiedades - InmobiliariaVE | Explora por Ubicación',
  description: 'Explora todas las propiedades disponibles en Venezuela usando nuestro mapa interactivo. Encuentra casas y apartamentos por ubicación.',
  keywords: 'mapa propiedades venezuela, ubicación casas caracas, mapa inmobiliario venezuela, propiedades por zona',
  openGraph: {
    title: 'Mapa de Propiedades - InmobiliariaVE',
    description: 'Explora propiedades en Venezuela con nuestro mapa interactivo',
    type: 'website',
  },
  alternates: {
    canonical: 'https://inmobiliariave.com/mapa'
  }
}

export default function MapaPage() {
  return <MapView />
}