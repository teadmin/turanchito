'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Property } from '@/lib/supabase'
import { Heart, Search, Filter, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PropertyCard } from '@/components/PropertyCard'
import Link from 'next/link'

type SortOption = 'newest' | 'oldest' | 'price_low' | 'price_high' | 'location'
type FilterOption = 'all' | 'house' | 'apartment' | 'commercial' | 'land'

export function FavoritosClient() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadUserFavorites()
    }
  }, [user, loading, router])

  const loadUserFavorites = async () => {
    try {
      setLoadingFavorites(true)
      // TODO: Implement actual API call to get user's favorite properties
      // For now, using mock data
      const mockFavorites: (Property & { favorited_at: string })[] = [
        {
          id: '1',
          title: 'Casa en Las Mercedes, Caracas',
          description: 'Hermosa casa de 4 habitaciones con piscina y jardín privado. Excelente ubicación en zona residencial exclusiva.',
          price: 350000,
          price_usd: 350000,
          currency: 'USD' as const,
          property_type: 'house' as const,
          transaction_type: 'sale' as const,
          bedrooms: 4,
          bathrooms: 3,
          area_m2: 280,
          city: 'Caracas',
          state: 'Distrito Capital',
          address: 'Las Mercedes, Caracas',
          latitude: 10.4806,
          longitude: -66.8564,
          images: ['/placeholder-house-1.jpg'],
          features: ['Piscina', 'Jardín', 'Garaje', 'Seguridad 24h'],
          status: 'active' as const,
          featured: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          favorited_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Apartamento en El Rosal, Caracas',
          description: 'Moderno apartamento de 3 habitaciones con vista panorámica. Edificio con amenidades completas.',
          price: 180000,
          price_usd: 180000,
          currency: 'USD' as const,
          property_type: 'apartment' as const,
          transaction_type: 'sale' as const,
          bedrooms: 3,
          bathrooms: 2,
          area_m2: 120,
          city: 'Caracas',
          state: 'Distrito Capital',
          address: 'El Rosal, Caracas',
          latitude: 10.5,
          longitude: -66.85,
          images: ['/placeholder-apartment-1.jpg'],
          features: ['Vista panorámica', 'Balcón', 'Portería', 'Gimnasio'],
          status: 'active' as const,
          featured: false,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          favorited_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'Casa en La Floresta, Maracay',
          description: 'Espaciosa casa familiar con quincho y área verde. Perfecta para familias grandes.',
          price: 120000,
          price_usd: 120000,
          currency: 'USD' as const,
          property_type: 'house' as const,
          transaction_type: 'sale' as const,
          bedrooms: 3,
          bathrooms: 2,
          area_m2: 200,
          city: 'Maracay',
          state: 'Aragua',
          address: 'La Floresta, Maracay',
          latitude: 10.2353,
          longitude: -67.5944,
          images: ['/placeholder-house-2.jpg'],
          features: ['Quincho', 'Jardín amplio', 'Estacionamiento', 'Zona segura'],
          status: 'active' as const,
          featured: true,
          created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          favorited_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          title: 'Apartamento en Altamira, Caracas',
          description: 'Elegante apartamento en una de las mejores zonas de Caracas. Completamente renovado.',
          price: 220000,
          price_usd: 220000,
          currency: 'USD' as const,
          property_type: 'apartment' as const,
          transaction_type: 'sale' as const,
          bedrooms: 2,
          bathrooms: 2,
          area_m2: 90,
          city: 'Caracas',
          state: 'Distrito Capital',
          address: 'Altamira, Caracas',
          latitude: 10.4961,
          longitude: -66.8515,
          images: ['/placeholder-apartment-2.jpg'],
          features: ['Recién renovado', 'Terraza', 'Portería', 'Cerca del metro'],
          status: 'active' as const,
          featured: false,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          favorited_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      setFavorites(mockFavorites as Property[])
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoadingFavorites(false)
    }
  }

  const removeFromFavorites = async (propertyId: string) => {
    try {
      // TODO: Implement actual API call to remove from favorites
      setFavorites(prev => prev.filter(property => property.id !== propertyId))
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
  }

  const handleSort = (option: SortOption) => {
    setSortBy(option)
  }

  const handleFilter = (option: FilterOption) => {
    setFilterBy(option)
  }

  const getSortedAndFilteredFavorites = () => {
    let filtered = [...favorites]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.state.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query)
      )
    }

    // Apply property type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(property => property.property_type === filterBy)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date((a as Property & { favorited_at: string }).favorited_at).getTime() - new Date((b as Property & { favorited_at: string }).favorited_at).getTime()
        case 'oldest':
          return new Date((b as Property & { favorited_at: string }).favorited_at).getTime() - new Date((a as Property & { favorited_at: string }).favorited_at).getTime()
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'location':
          return a.city.localeCompare(b.city)
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredFavorites = getSortedAndFilteredFavorites()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      house: 'casas',
      apartment: 'apartamentos',
      commercial: 'comerciales',
      land: 'terrenos'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getPropertyTypeCounts = () => {
    const counts = favorites.reduce((acc, property) => {
      acc[property.property_type] = (acc[property.property_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      all: favorites.length,
      house: counts.house || 0,
      apartment: counts.apartment || 0,
      commercial: counts.commercial || 0,
      land: counts.land || 0
    }
  }

  const counts = getPropertyTypeCounts()

  if (loading || loadingFavorites) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#E1F574] rounded-xl p-3">
              <Heart className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">mis favoritos</h1>
              <p className="text-xl text-slate-600 mt-2">
                {favorites.length > 0 ? `${favorites.length} propiedades guardadas` : 'tus propiedades favoritas'}
              </p>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 max-w-3xl mb-6">
            Aquí tienes todas las propiedades que has marcado como favoritas. 
            Organiza y compara fácilmente los inmuebles que más te interesan.
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Search and Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 mb-8">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="buscar en tus favoritos..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-300/60 rounded-xl focus:ring-2 focus:ring-[#E1F574]/30 focus:border-[#E1F574]/60 bg-white/80 backdrop-blur-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                {/* Property Type Filters */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilter('all')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filterBy === 'all'
                        ? 'bg-[#E1F574] text-slate-900 shadow-lg'
                        : 'bg-white/80 text-slate-700 hover:bg-[#F0F9A3]/30 border border-slate-200/60'
                    }`}
                  >
                    todas ({counts.all})
                  </button>
                  <button
                    onClick={() => handleFilter('house')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filterBy === 'house'
                        ? 'bg-[#E1F574] text-slate-900 shadow-lg'
                        : 'bg-white/80 text-slate-700 hover:bg-[#F0F9A3]/30 border border-slate-200/60'
                    }`}
                  >
                    casas ({counts.house})
                  </button>
                  <button
                    onClick={() => handleFilter('apartment')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filterBy === 'apartment'
                        ? 'bg-[#E1F574] text-slate-900 shadow-lg'
                        : 'bg-white/80 text-slate-700 hover:bg-[#F0F9A3]/30 border border-slate-200/60'
                    }`}
                  >
                    apartamentos ({counts.apartment})
                  </button>
                  {counts.commercial > 0 && (
                    <button
                      onClick={() => handleFilter('commercial')}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        filterBy === 'commercial'
                          ? 'bg-[#E1F574] text-slate-900 shadow-lg'
                          : 'bg-white/80 text-slate-700 hover:bg-[#F0F9A3]/30 border border-slate-200/60'
                      }`}
                    >
                      comerciales ({counts.commercial})
                    </button>
                  )}
                  {counts.land > 0 && (
                    <button
                      onClick={() => handleFilter('land')}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        filterBy === 'land'
                          ? 'bg-[#E1F574] text-slate-900 shadow-lg'
                          : 'bg-white/80 text-slate-700 hover:bg-[#F0F9A3]/30 border border-slate-200/60'
                      }`}
                    >
                      terrenos ({counts.land})
                    </button>
                  )}
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-slate-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value as SortOption)}
                    className="px-4 py-2 border border-slate-300/60 rounded-xl focus:ring-2 focus:ring-[#E1F574]/30 focus:border-[#E1F574]/60 bg-white/80 backdrop-blur-sm text-slate-700 font-medium"
                  >
                    <option value="newest">más recientes</option>
                    <option value="oldest">más antiguos</option>
                    <option value="price_low">precio menor a mayor</option>
                    <option value="price_high">precio mayor a menor</option>
                    <option value="location">por ubicación</option>
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              {(searchQuery.trim() || filterBy !== 'all') && (
                <div className="mt-4 pt-4 border-t border-slate-200/60">
                  <p className="text-slate-600">
                    Mostrando {filteredFavorites.length} de {favorites.length} propiedades
                    {searchQuery.trim() && ` con "${searchQuery}"`}
                    {filterBy !== 'all' && ` en ${getPropertyTypeLabel(filterBy)}`}
                  </p>
                </div>
              )}
            </div>

            {/* Properties Grid */}
            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFavorites.map((property) => (
                  <div key={property.id} className="relative">
                    <PropertyCard 
                      property={property} 
                      showFavorite={true}
                      onFavoriteChange={(isFavorite) => {
                        if (!isFavorite) {
                          removeFromFavorites(property.id)
                        }
                      }}
                    />
                    {/* Favorited Date */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-white/90 backdrop-blur-sm text-slate-600 px-2 py-1 text-xs rounded-lg shadow-sm border border-slate-200/60">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate((property as Property & { favorited_at: string }).favorited_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No Results for Search/Filter */
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12 max-w-md mx-auto">
                  <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                    <Search className="h-8 w-8 text-slate-600 mx-auto" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                    no encontramos resultados
                  </h3>
                  
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {searchQuery.trim() 
                      ? `No hay propiedades que coincidan con "${searchQuery}"`
                      : `No tienes ${getPropertyTypeLabel(filterBy)} en tus favoritos`
                    }
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setFilterBy('all')
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#E1F574] text-slate-900 font-semibold rounded-xl hover:bg-[#D4ED4A] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      mostrar todos los favoritos
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">acciones rápidas</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/comprar">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    buscar más propiedades
                  </Button>
                </Link>
                <Link href="/buscar">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    búsqueda avanzada
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos? Esta acción no se puede deshacer.')) {
                      setFavorites([])
                    }
                  }}
                  className="px-4 py-2 text-sm border border-red-300/60 text-red-600 hover:bg-red-50/80 hover:border-red-400/60 rounded-xl transition-all"
                >
                  eliminar todos los favoritos
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12 max-w-md mx-auto">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                <Heart className="h-8 w-8 text-slate-600 mx-auto" />
              </div>
              
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                aún no tienes favoritos
              </h3>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Explora miles de propiedades y guarda las que más te interesen. 
                Podrás acceder a ellas fácilmente desde aquí.
              </p>
              
              <div className="space-y-3">
                <Link href="/comprar">
                  <Button className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    explorar propiedades
                  </Button>
                </Link>
                
                <div className="text-sm text-slate-500">o</div>
                
                <Link href="/buscar">
                  <Button variant="outline" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    búsqueda personalizada
                  </Button>
                </Link>
              </div>

              {/* Tips */}
              <div className="mt-8 text-left bg-slate-50/80 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm">💡 consejos:</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• haz clic en ♡ para guardar propiedades</li>
                  <li>• organiza por precio, ubicación o tipo</li>
                  <li>• compara fácilmente tus opciones favoritas</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {favorites.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">¿listo para dar el siguiente paso?</h2>
            <p className="text-xl mb-6 text-slate-200">
              conecta con los propietarios de tus propiedades favoritas y agenda una visita
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button variant="outline" className="border-[#E1F574] text-[#E1F574] hover:bg-[#E1F574]/10">
                  asesoría personalizada
                </Button>
              </Link>
              <a
                href="tel:+58-XXX-XXX-XXXX"
                className="px-8 py-3 bg-[#E1F574] text-slate-900 font-semibold rounded-xl hover:bg-[#D4ED4A] transition-colors shadow-lg"
              >
                llamar ahora
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}