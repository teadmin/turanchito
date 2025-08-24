'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Property } from '@/lib/supabase'
import { Home, Plus, Search, Edit, Trash2, Eye, EyeOff, MapPin, Bed, Bath, Square } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function MisPropiedadesClient() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadUserProperties()
    }
  }, [user, loading, router])

  const loadUserProperties = async () => {
    try {
      setLoadingProperties(true)
      // TODO: Implement actual API call to get user's properties
      // For now, using mock data
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Casa en Las Mercedes, Caracas',
          description: 'Hermosa casa de 4 habitaciones con piscina y jardín privado. Ubicada en una de las mejores zonas de Caracas.',
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
          features: ['Piscina', 'Jardín', 'Garaje', 'Seguridad'],
          status: 'active' as const,
          featured: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Apartamento en El Rosal, Caracas',
          description: 'Moderno apartamento de 3 habitaciones con vista panorámica a la ciudad y excelente ubicación.',
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
          features: ['Vista panorámica', 'Balcón', 'Portería'],
          status: 'inactive' as const,
          featured: false,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]
      setProperties(mockProperties)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoadingProperties(false)
    }
  }

  const togglePropertyStatus = async (propertyId: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      // TODO: Implement actual API call to update property status
      
      setProperties(prev => 
        prev.map(property => 
          property.id === propertyId 
            ? { ...property, status: newStatus, updated_at: new Date().toISOString() }
            : property
        )
      )
    } catch (error) {
      console.error('Error updating property status:', error)
    }
  }

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      // TODO: Implement actual API call to delete property
      setProperties(prev => prev.filter(property => property.id !== propertyId))
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true
    return property.status === filter
  })

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString()}`
    }
    return `Bs. ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading || loadingProperties) {
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
              <Home className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">mis propiedades</h1>
              <p className="text-xl text-slate-600 mt-2">
                {properties.length > 0 ? `${properties.length} propiedades publicadas` : 'gestiona tus publicaciones'}
              </p>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 max-w-3xl mb-6">
            Gestiona todas tus propiedades desde tu panel personal. Edita información, 
            activa o desactiva anuncios, y mantén tus publicaciones siempre actualizadas.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#E1F574] text-slate-900 shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-[#F0F9A3]/30 border border-slate-200/60'
                }`}
              >
                Todas ({properties.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'active'
                    ? 'bg-[#E1F574] text-slate-900 shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-[#F0F9A3]/30 border border-slate-200/60'
                }`}
              >
                Activas ({properties.filter(p => p.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === 'inactive'
                    ? 'bg-[#E1F574] text-slate-900 shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-[#F0F9A3]/30 border border-slate-200/60'
                }`}
              >
                Inactivas ({properties.filter(p => p.status === 'inactive').length})
              </button>
            </div>

            <Link href="/publicar">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                publicar propiedad
              </Button>
            </Link>
          </div>
        </div>

        {/* Properties List */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                    <Home className="h-12 w-12 text-slate-500" />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      property.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {property.status === 'active' ? 'activa' : 'inactiva'}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {property.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#E1F574] text-slate-900 px-3 py-1 text-xs font-semibold rounded-full">
                        destacada
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                      {property.description}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-slate-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{property.city}, {property.state}</span>
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold text-[#4A90E2] mb-4">
                      {formatCurrency(property.price, property.currency)}
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-slate-600 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms} hab</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms} baños</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>{property.area_m2} m²</span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="text-xs text-slate-500 mb-4">
                      <div>Publicada: {formatDate(property.created_at)}</div>
                      <div>Actualizada: {formatDate(property.updated_at)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/propiedades/${property.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        ver anuncio
                      </Button>
                    </Link>

                    <Link href={`/publicar?edit=${property.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        editar
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => togglePropertyStatus(property.id, property.status === 'active' ? 'active' : 'inactive')}
                    >
                      {property.status === 'active' ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          desactivar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          activar
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 border-red-300/60 hover:bg-red-50/80 hover:border-red-400/60"
                      onClick={() => deleteProperty(property.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12 max-w-md mx-auto">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                <Home className="h-8 w-8 text-slate-600 mx-auto" />
              </div>
              
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                {filter === 'all' 
                  ? 'aún no tienes propiedades publicadas'
                  : filter === 'active'
                  ? 'no tienes propiedades activas'
                  : 'no tienes propiedades inactivas'
                }
              </h3>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                {filter === 'all'
                  ? 'Comienza publicando tu primera propiedad y llega a miles de compradores potenciales en toda Venezuela.'
                  : filter === 'active'
                  ? 'Todas tus propiedades están actualmente inactivas. Activa algunas para que sean visibles a los compradores.'
                  : 'Ninguna de tus propiedades está marcada como inactiva actualmente.'
                }
              </p>
              
              <div className="space-y-3">
                {filter === 'all' || filter === 'active' ? (
                  <Link href="/publicar">
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {filter === 'all' ? 'publicar mi primera propiedad' : 'publicar nueva propiedad'}
                    </Button>
                  </Link>
                ) : null}
                
                {filter !== 'all' && (
                  <>
                    <div className="text-sm text-slate-500">o</div>
                    <button
                      onClick={() => setFilter('all')}
                      className="inline-flex items-center justify-center px-6 py-3 border border-slate-300/60 bg-white/80 text-slate-700 font-medium rounded-xl hover:bg-slate-50/80 transition-colors"
                    >
                      ver todas las propiedades
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿necesitas ayuda?</h2>
          <p className="text-xl mb-6 text-slate-200">
            nuestro equipo está aquí para ayudarte a maximizar la visibilidad de tus propiedades
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto">
              <Button variant="outline" className="border-[#E1F574] text-[#E1F574] hover:bg-[#E1F574]/10">
                contactar soporte
              </Button>
            </Link>
            <a
              href="mailto:soporte@turanchito.com"
              className="px-8 py-3 bg-[#E1F574] text-slate-900 font-semibold rounded-xl hover:bg-[#D4ED4A] transition-colors shadow-lg"
            >
              enviar email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}