'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Map, Grid, Filter } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchForm, SearchFilters } from '@/components/SearchForm'
import { supabase } from '@/lib/supabase'

// Dynamic import to avoid SSR issues with Leaflet
const PropertyMap = dynamic(
  () => import('@/components/PropertyMap').then(mod => ({ default: mod.PropertyMap })),
  {
    ssr: false,
    loading: () => <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <Map className="h-12 w-12 text-gray-400" />
    </div>
  }
)

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
  address: string
  latitude?: number
  longitude?: number
  images: string[]
  featured: boolean
}

export function MapView() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({})

  useEffect(() => {
    fetchProperties()
  }, [filters])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)

      if (filters.city) query = query.eq('city', filters.city)
      if (filters.propertyType) query = query.eq('property_type', filters.propertyType)
      if (filters.transactionType) query = query.eq('transaction_type', filters.transactionType)
      if (filters.minPrice) query = query.gte('price', filters.minPrice)
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
      if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms)
      if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms)

      const { data, error } = await query.limit(100)

      if (error) throw error
      if (data) setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
  }

  const getMapCenter = (): [number, number] => {
    if (filters.city === 'Caracas') return [10.4806, -66.9036]
    if (filters.city === 'Maracay') return [10.2353, -67.5911]
    if (filters.city === 'Valencia') return [10.1621, -68.0077]
    return [10.4806, -66.9036] // Default to Caracas
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Explorar Propiedades en el Mapa
            </h1>
            <p className="text-xl text-blue-100">
              Visualiza todas las propiedades disponibles y encuentra la ubicación perfecta
            </p>
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {properties.length} Propiedades con Ubicación
              </h2>
              <p className="text-gray-600">
                Explora las propiedades en el mapa interactivo
              </p>
            </div>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 ${
                  viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                <Map className="h-4 w-4" />
                Mapa
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                <Grid className="h-4 w-4" />
                Lista
              </button>
            </div>
          </div>

          {loading ? (
            <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Cargando propiedades...</div>
            </div>
          ) : (
            <>
              {viewMode === 'map' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Suspense fallback={<div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />}>
                      <PropertyMap
                        properties={properties.filter(p => p.latitude && p.longitude).map(p => ({
                          id: p.id,
                          title: p.title,
                          price: p.price,
                          currency: p.currency,
                          latitude: p.latitude!,
                          longitude: p.longitude!,
                          city: p.city
                        }))}
                        center={getMapCenter()}
                        height="600px"
                        onPropertySelect={handlePropertySelect}
                      />
                    </Suspense>
                  </div>
                  
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 sticky top-0 bg-white py-2">
                      Propiedades Disponibles
                    </h3>
                    {properties.map((property) => (
                      <div
                        key={property.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedProperty?.id === property.id
                            ? 'ring-2 ring-blue-500 shadow-lg'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handlePropertySelect(property)}
                      >
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </>
          )}

          {properties.length === 0 && !loading && (
            <div className="text-center py-12">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron propiedades con ubicación
              </h3>
              <p className="text-gray-600 mb-6">
                Prueba ajustando los filtros de búsqueda
              </p>
              <Button onClick={() => setFilters({})}>
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}