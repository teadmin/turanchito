import { Metadata } from 'next'
import { FavoritosClient } from '@/components/FavoritosClient'

export const metadata: Metadata = {
  title: 'mis favoritos - turanchito',
  description: 'guarda y organiza las propiedades que más te interesan en turanchito. accede rápidamente a tus inmuebles favoritos desde tu panel personal.',
  keywords: 'favoritos propiedades venezuela, propiedades guardadas, lista deseos inmobiliaria',
  robots: 'noindex, nofollow'
}

export default function FavoritosPage() {
  return <FavoritosClient />
}