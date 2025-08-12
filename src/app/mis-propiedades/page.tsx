import { Metadata } from 'next'
import { MisPropiedadesClient } from '@/components/MisPropiedadesClient'

export const metadata: Metadata = {
  title: 'mis propiedades - turanchito',
  description: 'gestiona todas tus propiedades publicadas en turanchito. edita, activa o desactiva tus anuncios desde tu panel personal.',
  keywords: 'mis propiedades venezuela, gestionar propiedades, editar anuncio inmobiliario, panel propietario',
  robots: 'noindex, nofollow'
}

export default function MisPropiedadesPage() {
  return <MisPropiedadesClient />
}