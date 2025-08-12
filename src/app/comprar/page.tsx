import { Metadata } from 'next'
import Link from 'next/link'
import { ComprarSearchFilters } from '@/components/ComprarSearchFilters'
import { PropertyCard } from '@/components/PropertyCard'
import { propertyService } from '@/lib/supabase'
import { Property } from '@/lib/supabase'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'comprar propiedades en venezuela - turanchito',
  description: 'encuentra casas, apartamentos y propiedades en venta en toda venezuela. busca por ubicación, precio y características. tu nuevo hogar te espera.',
  keywords: 'comprar casa venezuela, apartamentos en venta caracas, propiedades venta maracay, bienes raices venezuela, inmuebles venta',
  openGraph: {
    title: 'comprar propiedades - turanchito',
    description: 'descubre miles de propiedades en venta en venezuela',
    url: 'https://turanchito.com/comprar',
  }
}

interface SearchParams {
  city?: string
  state?: string
  property_type?: string
  min_price?: string
  max_price?: string
  bedrooms?: string
  bathrooms?: string
  page?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function ComprarPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page || '1')
  const pageSize = 24

  // Build filters from search params
  const filters: Record<string, string | number> = {
    transaction_type: 'sale'
  }

  if (resolvedSearchParams.city) filters.city = resolvedSearchParams.city
  if (resolvedSearchParams.state) filters.state = resolvedSearchParams.state
  if (resolvedSearchParams.property_type) filters.property_type = resolvedSearchParams.property_type
  if (resolvedSearchParams.min_price) filters.price_min = parseFloat(resolvedSearchParams.min_price)
  if (resolvedSearchParams.max_price) filters.price_max = parseFloat(resolvedSearchParams.max_price)
  if (resolvedSearchParams.bedrooms) filters.bedrooms = parseInt(resolvedSearchParams.bedrooms)
  if (resolvedSearchParams.bathrooms) filters.bathrooms = parseInt(resolvedSearchParams.bathrooms)

  let properties: Property[] = []
  let total = 0

  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      // Return mock data when Supabase is not configured
      console.warn('⚠️ Supabase not configured, using mock data')
      properties = generateMockProperties()
      total = properties.length
    } else {
      const result = await propertyService.searchProperties(
        filters,
        pageSize,
        (currentPage - 1) * pageSize
      )
      properties = result.properties || []
      total = result.total || 0
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
    // Fallback to mock data
    properties = generateMockProperties()
    total = properties.length
  }

// Mock data generator for development
function generateMockProperties(): Property[] {
  return [
    {
      id: '1',
      title: 'Casa en Las Mercedes, Caracas',
      description: 'Hermosa casa de 4 habitaciones con piscina y jardín',
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Apartamento en El Rosal, Caracas',
      description: 'Moderno apartamento de 3 habitaciones con vista panorámica',
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
      status: 'active' as const,
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Casa en La Floresta, Maracay',
      description: 'Espaciosa casa familiar con quincho y área verde',
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
      features: ['Quincho', 'Jardín', 'Estacionamiento'],
      status: 'active' as const,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]
}

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#E1F574] rounded-xl p-3">
              <Search className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                comprar propiedades
              </h1>
              <p className="text-xl text-slate-600 mt-2">
                {total > 0 ? `${total.toLocaleString()} propiedades encontradas` : 'Busca tu propiedad ideal'}
              </p>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 max-w-3xl">
            Encuentra la propiedad perfecta para comprar en Venezuela. Casas, apartamentos, 
            locales comerciales y terrenos en las mejores ubicaciones del país.
          </p>
        </div>

        {/* Search Filters */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">Filtros de búsqueda</h2>
          </div>
          
          <ComprarSearchFilters 
            initialFilters={{
              transaction_type: 'sale',
              city: resolvedSearchParams.city,
              state: resolvedSearchParams.state,
              property_type: resolvedSearchParams.property_type,
              min_price: resolvedSearchParams.min_price ? parseFloat(resolvedSearchParams.min_price) : undefined,
              max_price: resolvedSearchParams.max_price ? parseFloat(resolvedSearchParams.max_price) : undefined,
              bedrooms: resolvedSearchParams.bedrooms ? parseInt(resolvedSearchParams.bedrooms) : undefined,
              bathrooms: resolvedSearchParams.bathrooms ? parseInt(resolvedSearchParams.bathrooms) : undefined
            }}
          />
        </div>

        {/* Results */}
        {properties.length > 0 ? (
          <>
            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <p className="text-slate-700">
                  Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} de {total.toLocaleString()} resultados
                </p>
              </div>
              
              {totalPages > 1 && (
                <p className="text-slate-600">
                  Página {currentPage} de {totalPages}
                </p>
              )}
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {properties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} showFavorite={true} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  {currentPage > 1 && (
                    <a
                      href={`/comprar?${new URLSearchParams({ ...resolvedSearchParams, page: (currentPage - 1).toString() }).toString()}`}
                      className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-lime-50 hover:text-slate-900 border border-slate-200/60 hover:border-lime-300 transition-all shadow-sm"
                    >
                      Anterior
                    </a>
                  )}
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const startPage = Math.max(1, currentPage - 2)
                    const pageNum = startPage + i
                    
                    if (pageNum > totalPages) return null
                    
                    return (
                      <a
                        key={pageNum}
                        href={`/comprar?${new URLSearchParams({ ...resolvedSearchParams, page: pageNum.toString() }).toString()}`}
                        className={`px-4 py-2 rounded-xl transition-all shadow-sm ${
                          currentPage === pageNum
                            ? 'bg-[#E1F574] text-slate-900 shadow-lg font-semibold'
                            : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-lime-50 hover:text-slate-900 border border-slate-200/60 hover:border-lime-300'
                        }`}
                      >
                        {pageNum}
                      </a>
                    )
                  })}
                  
                  {/* Next Button */}
                  {currentPage < totalPages && (
                    <a
                      href={`/comprar?${new URLSearchParams({ ...resolvedSearchParams, page: (currentPage + 1).toString() }).toString()}`}
                      className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/60 hover:border-emerald-300 transition-all shadow-sm"
                    >
                      Siguiente
                    </a>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12 max-w-md mx-auto">
              <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                <Search className="h-8 w-8 text-slate-600 mx-auto" />
              </div>
              
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                No se encontraron propiedades
              </h3>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                No hay propiedades que coincidan con tus criterios de búsqueda. 
                Intenta ajustar los filtros o explora otras opciones.
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/comprar"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#E1F574] text-slate-900 font-semibold rounded-xl hover:bg-[#D4ED4A] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Ver todas las propiedades
                </Link>
                
                <div className="text-sm text-slate-500">
                  o
                </div>
                
                <Link
                  href="/publicar"
                  className="inline-flex items-center justify-center px-6 py-3 border border-lime-300 bg-lime-50 text-slate-800 font-medium rounded-xl hover:bg-lime-100 transition-colors"
                >
                  Publica tu propiedad
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-xl mb-6 text-slate-200">
            Regístrate para recibir alertas cuando nuevas propiedades coincidan con tus criterios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/registro"
              className="px-8 py-3 bg-[#E1F574] text-slate-900 font-semibold rounded-xl hover:bg-[#D4ED4A] transition-colors shadow-lg"
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/contacto"
              className="px-8 py-3 border-2 border-[#E1F574] text-[#E1F574] font-semibold rounded-xl hover:bg-[#E1F574]/10 transition-colors"
            >
              Contactar un asesor
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}