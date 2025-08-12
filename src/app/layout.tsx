import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Miranchito - Compra, Venta y Alquiler de Propiedades en Venezuela',
  description: 'La plataforma inmobiliaria líder en Venezuela. Encuentra casas, apartamentos y propiedades en venta y alquiler en Caracas, Maracay, Barinas y todo el país.',
  keywords: 'comprar casa caracas, comprar apartamento caracas, vender apartamento barinas, inmobiliaria venezuela, venta casas maracay, apartamentos valencia, propiedades venezuela, bienes raices caracas, casas en venta valencia, apartamentos alquiler maracay',
  authors: [{ name: 'Miranchito' }],
  creator: 'Miranchito',
  publisher: 'Miranchito',
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://miranchito.com',
    title: 'Miranchito - Tu hogar en Venezuela',
    description: 'Encuentra la propiedad perfecta en Venezuela. Casas, apartamentos y más en las mejores ubicaciones del país.',
    siteName: 'Miranchito'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miranchito - Tu hogar en Venezuela',
    description: 'Encuentra la propiedad perfecta en Venezuela',
    creator: '@miranchito'
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://miranchito.com'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
