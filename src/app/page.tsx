'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Star, ChevronRight, TrendingUp } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchFilters } from '@/components/SearchFilters'
import { ContactForm } from '@/components/ContactForm'
import { Button } from '@/components/ui/Button'
import { propertyService, Property } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { venezuelanCities } from '@/lib/venezuelan-cities-seo'
import { useAuth } from '@/contexts/AuthContext'

interface SearchFiltersType {
  search?: string
  city?: string
  state?: string
  property_type?: string
  transaction_type?: string
  price_min?: number
  price_max?: number
  bedrooms?: number
  currency?: 'VES' | 'USD'
}

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [recentProperties, setRecentProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const [featured, recent] = await Promise.all([
        propertyService.getFeaturedProperties(3),
        propertyService.getProperties(6, 0)
      ])

      setFeaturedProperties(featured || [])
      setRecentProperties(recent?.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (filters: SearchFiltersType) => {
    const searchParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, value.toString())
      }
    })
    
    window.location.href = `/buscar?${searchParams.toString()}`
  }

  // Get top Venezuelan cities for display
  const topCities = [
    { name: 'Caracas', slug: 'caracas', properties: '450+', image: '/api/placeholder/300/200' },
    { name: 'Maracay', slug: 'maracay', properties: '280+', image: '/api/placeholder/300/200' },
    { name: 'Valencia', slug: 'valencia', properties: '320+', image: '/api/placeholder/300/200' },
    { name: 'Maracaibo', slug: 'maracaibo', properties: '190+', image: '/api/placeholder/300/200' },
    { name: 'Barquisimeto', slug: 'barquisimeto', properties: '150+', image: '/api/placeholder/300/200' },
    { name: 'Barcelona', slug: 'barcelona-anzoategui', properties: '120+', image: '/api/placeholder/300/200' }
  ]

  const stats = [
    { label: 'Propiedades Activas', value: '1,200+' },
    { label: 'Clientes Satisfechos', value: '3,500+' },
    { label: 'Años de Experiencia', value: '15+' },
    { label: 'Ciudades Cubiertas', value: '25+' }
  ]

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra tu <span className="text-yellow-400">hogar ideal</span>
              <br />en Venezuela
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              La plataforma inmobiliaria líder en Venezuela. Conectamos sueños con realidades.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchFilters onSearch={handleSearch} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Message for Logged In Users */}
      {user && profile && (
        <section className="py-8 bg-gradient-to-r from-[#E1F56E]/20 to-lime-100/20 border-b border-lime-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-lg text-slate-700">
                ¡Hola <span className="font-semibold text-slate-900">{profile.nombre}</span>! 👋
              </p>
              <p className="text-slate-600 mt-1">
                bienvenido de vuelta a turanchito
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Propiedades Destacadas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras propiedades premium seleccionadas especialmente para ti
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/destacadas">
              <Button size="lg" className="flex items-center gap-2">
                Ver Todas las Destacadas
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explora por Ciudades
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra propiedades en las principales ciudades de Venezuela
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCities.slice(0, 6).map((city) => (
              <Link key={city.slug} href={`/${city.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64">
                    <Image
                      src={city.image}
                      alt={`Propiedades en ${city.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                    <p className="text-blue-200">{city.properties} propiedades</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Propiedades Recientes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Las últimas propiedades añadidas a nuestra plataforma
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/propiedades">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                Ver Todas las Propiedades
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Por qué elegir Turanchito?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 p-2 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Propiedades Verificadas</h3>
                    <p className="text-blue-100">Todas nuestras propiedades son verificadas y fotografiadas profesionalmente.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Precios Competitivos</h3>
                    <p className="text-blue-100">Ofrecemos los mejores precios del mercado con transparencia total.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cobertura Nacional</h3>
                    <p className="text-blue-100">Presencia en las principales ciudades de Venezuela.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <ContactForm className="bg-white/95 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Tienes una propiedad para vender?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Únete a miles de propietarios que confían en nosotros para vender sus propiedades
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/publicar">
              <Button size="lg" variant="secondary" className="bg-gray-900 hover:bg-gray-800">
                Publicar mi Propiedad
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="lg" variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                Obtener Asesoría Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
