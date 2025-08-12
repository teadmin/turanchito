import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PropertyCard } from '@/components/PropertyCard'
import { DynamicPageSearchFilters } from '@/components/DynamicPageSearchFilters'
import { 
  venezuelanCities, 
  propertyTypes, 
  transactionTypes, 
  generateAllSEOCombinations,
  generateSEOData 
} from '@/lib/venezuelan-cities-seo'
import { propertyService } from '@/lib/supabase'
import { Property } from '@/lib/supabase'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
  searchParams: Promise<{
    page?: string
  }>
}

// Generate static paths for all SEO combinations
export function generateStaticParams() {
  const combinations = generateAllSEOCombinations()
  const cityRoutes = venezuelanCities.map(city => ({ slug: [city.slug] }))
  
  return [
    ...combinations.map(combo => ({ slug: combo.slug.split('/') })),
    ...cityRoutes
  ]
}

// Generate dynamic metadata for each route
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  
  // Check if it's a city page
  const city = venezuelanCities.find(c => c.slug === slug)
  if (city) {
    return {
      title: `Propiedades en ${city.city}, ${city.state} - Miranchito`,
      description: `Encuentra las mejores propiedades en venta y alquiler en ${city.city}, ${city.state}. Casas, apartamentos y más en Miranchito, tu plataforma inmobiliaria de confianza.`,
      keywords: `propiedades ${city.city}, casas ${city.city}, apartamentos ${city.city}, inmuebles ${city.city}, bienes raíces ${city.state}`,
      openGraph: {
        title: `Propiedades en ${city.city} - Miranchito`,
        description: `Descubre las mejores propiedades en ${city.city}, ${city.state}`,
        url: `https://miranchito.com/${city.slug}`,
      }
    }
  }
  
  // Check if it's an SEO optimized page
  const combinations = generateAllSEOCombinations()
  const combo = combinations.find(c => c.slug === slug)
  
  if (combo) {
    return {
      title: combo.title,
      description: combo.description,
      keywords: combo.keywords,
      openGraph: {
        title: combo.title,
        description: combo.description,
        url: `https://miranchito.com/${combo.slug}`,
      }
    }
  }
  
  return {
    title: 'Página no encontrada - Miranchito',
    description: 'La página que buscas no existe.'
  }
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const slug = resolvedParams.slug.join('/')
  const currentPage = parseInt(resolvedSearchParams.page || '1')
  const pageSize = 20
  
  // Check if it's a city page
  const city = venezuelanCities.find(c => c.slug === slug)
  if (city) {
    try {
      const { properties, total } = await propertyService.getPropertiesByCity(
        city.city, 
        pageSize, 
        (currentPage - 1) * pageSize
      )
      
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Propiedades en {city.city}, {city.state}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Descubre {total} propiedades disponibles en {city.city}
              </p>
              
              <DynamicPageSearchFilters 
                initialFilters={{ city: city.city, state: city.state }}
              />
            </div>
            
            {properties && properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.map((property: Property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                
                {(total || 0) > pageSize && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      {Array.from({ length: Math.ceil((total || 0) / pageSize) }, (_, i) => (
                        <a
                          key={i + 1}
                          href={`/${slug}?page=${i + 1}`}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === i + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No hay propiedades disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  Actualmente no tenemos propiedades listadas en {city.city}.
                </p>
                <Link
                  href="/publicar"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Publica tu propiedad aquí
                </Link>
              </div>
            )}
          </div>
        </div>
      )
    } catch (error) {
      console.error('Error fetching properties:', error)
      notFound()
    }
  }
  
  // Check if it's an SEO optimized page
  const combinations = generateAllSEOCombinations()
  const combo = combinations.find(c => c.slug === slug)
  
  if (combo) {
    try {
      const { properties, total } = await propertyService.searchProperties(
        {
          city: combo.city,
          property_type: combo.propertyType,
          transaction_type: combo.transactionType,
        },
        pageSize,
        (currentPage - 1) * pageSize
      )
      
      const propertyTypeLabel = propertyTypes.find(p => p.type === combo.propertyType)?.label
      const transactionTypeLabel = transactionTypes.find(t => t.type === combo.transactionType)?.label
      
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {propertyTypeLabel} en {transactionTypeLabel} en {combo.city}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {total} {propertyTypeLabel?.toLowerCase()} disponibles para {transactionTypeLabel?.toLowerCase()} en {combo.city}, {combo.state}
              </p>
              
              <DynamicPageSearchFilters 
                initialFilters={{
                  city: combo.city,
                  property_type: combo.propertyType,
                  transaction_type: combo.transactionType
                }}
              />
            </div>
            
            {properties && properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.map((property: Property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                
                {(total || 0) > pageSize && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      {Array.from({ length: Math.ceil((total || 0) / pageSize) }, (_, i) => (
                        <a
                          key={i + 1}
                          href={`/${slug}?page=${i + 1}`}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === i + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No hay {propertyTypeLabel?.toLowerCase()} disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  Actualmente no tenemos {propertyTypeLabel?.toLowerCase()} en {transactionTypeLabel?.toLowerCase()} en {combo.city}.
                </p>
                <Link
                  href="/publicar"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Publica tu propiedad aquí
                </Link>
              </div>
            )}
            
            {/* SEO Content */}
            <div className="mt-12 bg-white rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {propertyTypeLabel} en {combo.city}: Tu próximo hogar te espera
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p>
                  {combo.city} es una excelente opción para encontrar tu {propertyTypeLabel?.toLowerCase()} ideal. 
                  En Miranchito tenemos una amplia selección de {propertyTypeLabel?.toLowerCase()}s en {transactionTypeLabel?.toLowerCase()} 
                  que se adaptan a diferentes presupuestos y necesidades.
                </p>
                <p>
                  Nuestras {propertyTypeLabel?.toLowerCase()}s en {combo.city} ofrecen las mejores comodidades y 
                  se encuentran en ubicaciones estratégicas. Ya sea que busques una propiedad para vivir 
                  o como inversión, tenemos opciones que te van a encantar.
                </p>
                <p>
                  Explora todas nuestras opciones de {propertyTypeLabel?.toLowerCase()}s en {combo.city} y 
                  encuentra la propiedad perfecta para ti. ¡Tu nuevo hogar está a solo un clic de distancia!
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    } catch (error) {
      console.error('Error fetching properties:', error)
      notFound()
    }
  }
  
  // If no match found, return 404
  notFound()
}