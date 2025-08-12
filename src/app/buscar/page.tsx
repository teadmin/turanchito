'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchFilters } from '@/components/SearchFilters'
import { Button } from '@/components/ui/Button'
import { Grid, List, Filter, Loader2 } from 'lucide-react'
import { propertyService, Property } from '@/lib/supabase'

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

function SearchContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('created_at')
  
  const [filters, setFilters] = useState<SearchFiltersType>({
    city: searchParams.get('city') || undefined,
    property_type: searchParams.get('property_type') || undefined,
    transaction_type: searchParams.get('transaction_type') || undefined,
    price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
    price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    search: searchParams.get('search') || undefined,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchProperties(1)
  }, [filters])
  
  useEffect(() => {
    // Initialize filters from URL params on component mount
    const initialFilters: SearchFiltersType = {}
    
    searchParams.forEach((value, key) => {
      if (key === 'price_min' || key === 'price_max' || key === 'bedrooms') {
        initialFilters[key as keyof SearchFiltersType] = parseInt(value) as any
      } else if (value) {
        initialFilters[key as keyof SearchFiltersType] = value as any
      }
    })
    
    if (JSON.stringify(initialFilters) !== JSON.stringify(filters)) {
      setFilters(initialFilters)
    }
  }, [searchParams])

  const fetchProperties = async (page = 1) => {
    setLoading(true)
    try {
      const offset = (page - 1) * pageSize
      
      if (Object.keys(filters).some(key => filters[key as keyof SearchFiltersType] !== undefined)) {
        const { properties: searchResults, total: totalResults } = await propertyService.searchProperties(
          filters,
          pageSize,
          offset
        )
        setProperties(searchResults || [])
        setTotal(totalResults || 0)
      } else {
        const { properties: allProperties, total: totalResults } = await propertyService.getProperties(
          pageSize,
          offset
        )
        setProperties(allProperties || [])
        setTotal(totalResults || 0)
      }
      
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newFilters: SearchFiltersType) => {
    setFilters(newFilters)
    
    // Update URL with search parameters
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    const newUrl = `/buscar${params.toString() ? `?${params.toString()}` : ''}`
    window.history.pushState({}, '', newUrl)
  }
  
  const handlePageChange = (page: number) => {
    fetchProperties(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Buscar Propiedades en Venezuela
            </h1>
            <p className="text-xl text-blue-100">
              Encuentra tu propiedad ideal con nuestros filtros avanzados
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchFilters onSearch={handleSearch} initialFilters={filters} />
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {total} Propiedades Encontradas
              </h2>
              <p className="text-gray-600 mt-1">
                Mostrando {properties.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, total)} de {total} resultados
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
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-lg text-gray-600">Buscando propiedades...</span>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {Object.keys(filters).length === 0 
                  ? 'Usa los filtros para encontrar propiedades'
                  : 'No se encontraron propiedades'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {Object.keys(filters).length === 0
                  ? 'Aplica algunos filtros arriba para comenzar tu búsqueda.'
                  : 'Intenta ajustar los filtros para obtener más resultados.'
                }
              </p>
              <Button onClick={() => {
                setFilters({})
                window.history.pushState({}, '', '/buscar')
              }}>
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>}>
      <SearchContent />
    </Suspense>
  )
}