import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { propertyService, Property } from '@/lib/supabase'
import { PropertyDetail } from '@/components/PropertyDetail'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for the property
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  let property: Property | null = null
  
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      // Return default metadata for development
      return {
        title: 'propiedad - turanchito',
        description: 'detalles de la propiedad'
      }
    }

    property = await propertyService.getPropertyById(resolvedParams.id)
  } catch (error) {
    console.error('Error fetching property for metadata:', error)
  }

  if (!property) {
    return {
      title: 'propiedad no encontrada - turanchito',
      description: 'la propiedad que buscas no existe'
    }
  }

  const price = property.currency === 'USD' 
    ? `$${property.price.toLocaleString()}` 
    : `Bs ${property.price.toLocaleString()}`

  return {
    title: `${property.title} - ${price} - turanchito`,
    description: property.description.slice(0, 160),
    keywords: `${property.property_type}, ${property.transaction_type}, ${property.city}, ${property.state}, propiedad venezuela`,
    openGraph: {
      title: property.title,
      description: property.description,
      url: `https://turanchito.com/propiedades/${property.id}`,
      images: property.images.length > 0 ? [
        {
          url: property.images[0],
          width: 800,
          height: 600,
          alt: property.title
        }
      ] : undefined,
      type: 'article',
      locale: 'es_VE'
    }
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const resolvedParams = await params
  let property: Property | null = null

  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      // Use mock property for development
      console.warn('⚠️ Supabase not configured, using mock property')
      property = {
        id: resolvedParams.id,
        title: 'hermosa casa en las mercedes',
        description: 'espectacular casa de 4 habitaciones con piscina, jardín y garaje para 2 carros. ubicada en la exclusiva zona de las mercedes, perfecta para familias que buscan comodidad y seguridad.',
        price: 350000,
        price_usd: 350000,
        currency: 'USD' as const,
        property_type: 'house' as const,
        transaction_type: 'sale' as const,
        bedrooms: 4,
        bathrooms: 3,
        area_m2: 280,
        city: 'caracas',
        state: 'distrito capital',
        address: 'las mercedes, caracas',
        latitude: 10.4806,
        longitude: -66.8564,
        images: [
          '/placeholder-house-1.jpg',
          '/placeholder-house-2.jpg',
          '/placeholder-house-3.jpg'
        ],
        features: ['piscina', 'jardín', 'garaje', 'seguridad 24h', 'aire acondicionado'],
        status: 'active' as const,
        featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    } else {
      property = await propertyService.getPropertyById(resolvedParams.id)
    }
  } catch (error) {
    console.error('Error fetching property:', error)
    
    // Fallback to mock property
    property = {
      id: resolvedParams.id,
      title: 'propiedad de ejemplo',
      description: 'esta es una propiedad de ejemplo para demostración.',
      price: 100000,
      price_usd: 100000,
      currency: 'USD' as const,
      property_type: 'house' as const,
      transaction_type: 'sale' as const,
      bedrooms: 3,
      bathrooms: 2,
      area_m2: 200,
      city: 'caracas',
      state: 'distrito capital',
      address: 'caracas, venezuela',
      latitude: 10.4806,
      longitude: -66.8564,
      images: ['/placeholder-house-1.jpg'],
      features: ['ejemplo'],
      status: 'active' as const,
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  if (!property) {
    notFound()
  }

  return <PropertyDetail property={property} />
}