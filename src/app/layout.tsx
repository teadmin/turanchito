import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthDebugPanel } from '@/components/AuthDebugPanel'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'turanchito - compra, venta y alquiler de propiedades en venezuela',
  description: 'la plataforma inmobiliaria líder en venezuela. encuentra casas, apartamentos y propiedades en venta y alquiler en caracas, maracay, barinas y todo el país.',
  keywords: 'comprar casa caracas, comprar apartamento caracas, vender apartamento barinas, inmobiliaria venezuela, venta casas maracay, apartamentos valencia, propiedades venezuela, bienes raices caracas, casas en venta valencia, apartamentos alquiler maracay',
  authors: [{ name: 'turanchito' }],
  creator: 'turanchito',
  publisher: 'turanchito',
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://turanchito.com',
    title: 'turanchito - tu hogar en venezuela',
    description: 'encuentra la propiedad perfecta en venezuela. casas, apartamentos y más en las mejores ubicaciones del país.',
    siteName: 'turanchito'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'turanchito - tu hogar en venezuela',
    description: 'encuentra la propiedad perfecta en venezuela',
    creator: '@turanchito'
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://turanchito.com'
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
          <AuthDebugPanel />
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
