'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Filter, Grid, List, ChevronDown } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchForm, SearchFilters } from '@/components/SearchForm'
import { ContactForm } from '@/components/ContactForm'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'

interface Property {
  id: string
  title: string
  price: number
  currency: 'VES' | 'USD'
  property_type: 'house' | 'apartment' | 'commercial' | 'land'
  transaction_type: 'sale' | 'rent'
  bedrooms?: number
  bathrooms?: number
  area_m2?: number
  city: string
  state: string
  images: string[]
  featured: boolean
}

interface CityPropertyPageProps {
  city: string
  propertyType: 'house' | 'apartment' | 'commercial' | 'land'
  transactionType: 'sale' | 'rent'
}

const typeLabels = {
  house: 'Casas',
  apartment: 'Apartamentos',
  commercial: 'Locales Comerciales',
  land: 'Terrenos'
}

const transactionLabels = {
  sale: 'en Venta',
  rent: 'en Alquiler'
}

export function CityPropertyPage({ city, propertyType, transactionType }: CityPropertyPageProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('created_at')
  const [filters, setFilters] = useState<SearchFilters>({
    city,
    propertyType,
    transactionType
  })

  useEffect(() => {
    fetchProperties()
  }, [filters, sortBy])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')

      if (filters.city) query = query.eq('city', filters.city)
      if (filters.propertyType) query = query.eq('property_type', filters.propertyType)
      if (filters.transactionType) query = query.eq('transaction_type', filters.transactionType)
      if (filters.minPrice) query = query.gte('price', filters.minPrice)
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
      if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms)
      if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms)

      if (sortBy === 'price_asc') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price_desc') {
        query = query.order('price', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query.limit(50)

      if (error) throw error
      if (data) setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  const cityInfo = {
    Caracas: {
      description: 'La capital de Venezuela ofrece las mejores oportunidades inmobiliarias del país. Desde elegantes apartamentos en El Rosal hasta exclusivas casas en Country Club.',
      neighborhoods: ['Las Mercedes', 'El Rosal', 'Chacao', 'Altamira', 'La Castellana', 'Country Club'],
      stats: { avgPrice: '$85,000', properties: '450+', growth: '+12%' }
    },
    Maracay: {
      description: 'Conocida como la Ciudad Jardín, Maracay combina tranquilidad familiar con excelente conectividad. Ideal para familias que buscan calidad de vida.',
      neighborhoods: ['Base Aragua', 'La Soledad', 'San Jacinto', 'El Castaño', 'Los Leones', 'Girardot'],
      stats: { avgPrice: '$65,000', properties: '280+', growth: '+8%' }
    }
  }

  const currentCityInfo = cityInfo[city as keyof typeof cityInfo] || cityInfo.Caracas

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {typeLabels[propertyType]} {transactionLabels[transactionType]} en {city}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {currentCityInfo.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{currentCityInfo.stats.avgPrice}</div>
                <div className="text-blue-100">Precio Promedio</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{currentCityInfo.stats.properties}</div>
                <div className="text-blue-100">Propiedades Activas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{currentCityInfo.stats.growth}</div>
                <div className="text-blue-100">Crecimiento Anual</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchForm onSearch={handleSearch} initialFilters={filters} />
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {properties.length} {typeLabels[propertyType]} Encontradas en {city}
              </h2>
              <p className="text-gray-600 mt-1">
                Actualizado recientemente • Precios verificados
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Ordenar:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="created_at">Más Recientes</option>
                  <option value="price_asc">Precio: Menor a Mayor</option>
                  <option value="price_desc">Precio: Mayor a Menor</option>
                </select>
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-600 mb-6">
                Prueba ajustando los filtros de búsqueda
              </p>
              <Button onClick={() => setFilters({ city, propertyType, transactionType })}>
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Por qué invertir en {city}?
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  {city} es una de las ciudades con mayor crecimiento inmobiliario en Venezuela. 
                  La demanda de propiedades ha crecido consistentemente en los últimos años.
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Zonas Destacadas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentCityInfo.neighborhoods.map((neighborhood) => (
                      <span
                        key={neighborhood}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {neighborhood}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ContactForm 
                propertyTitle={`${typeLabels[propertyType]} en ${city}`}
                className="shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Explora Otras Opciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/vender-casa-en-caracas">
              <Button variant="outline" className="w-full">
                Casas en Caracas
              </Button>
            </Link>
            <Link href="/vender-apartamento-en-caracas">
              <Button variant="outline" className="w-full">
                Apartamentos en Caracas
              </Button>
            </Link>
            <Link href="/vender-casa-en-maracay">
              <Button variant="outline" className="w-full">
                Casas en Maracay
              </Button>
            </Link>
            <Link href="/vender-apartamento-en-maracay">
              <Button variant="outline" className="w-full">
                Apartamentos en Maracay
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}