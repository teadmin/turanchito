export const defaultSEO = {
  titleTemplate: '%s | InmobiliariaVE',
  defaultTitle: 'InmobiliariaVE - Compra, Venta y Alquiler de Propiedades en Venezuela',
  description: 'La plataforma inmobiliaria líder en Venezuela. Encuentra casas, apartamentos y propiedades en venta y alquiler en Caracas, Maracay y todo el país.',
  canonical: 'https://inmobiliariave.com',
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://inmobiliariave.com',
    site_name: 'InmobiliariaVE',
    images: [
      {
        url: 'https://inmobiliariave.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InmobiliariaVE - Tu hogar en Venezuela',
      }
    ],
  },
  twitter: {
    handle: '@inmobiliariave',
    site: '@inmobiliariave',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'robots',
      content: 'index,follow',
    },
    {
      name: 'theme-color',
      content: '#2563eb',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-icon.png',
      sizes: '76x76'
    },
    {
      rel: 'manifest',
      href: '/manifest.json'
    }
  ],
}

export function generatePropertySEO(property: {
  title: string
  description: string
  price: number
  currency: string
  city: string
  property_type: string
  images?: string[]
}) {
  const formattedPrice = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: property.currency === 'USD' ? 'USD' : 'VES',
    minimumFractionDigits: 0,
  }).format(property.price)

  const propertyTypeMap: { [key: string]: string } = {
    house: 'Casa',
    apartment: 'Apartamento',
    commercial: 'Local Comercial',
    land: 'Terreno'
  }

  const typeLabel = propertyTypeMap[property.property_type] || 'Propiedad'

  return {
    title: `${typeLabel} en ${property.city} - ${formattedPrice} | InmobiliariaVE`,
    description: property.description.length > 160 
      ? property.description.substring(0, 157) + '...' 
      : property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images?.slice(0, 4).map(img => ({
        url: img,
        width: 800,
        height: 600,
        alt: property.title
      })) || []
    }
  }
}

export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'InmobiliariaVE',
    'description': 'La plataforma inmobiliaria líder en Venezuela',
    'url': 'https://inmobiliariave.com',
    'telephone': '+58-414-123-4567',
    'email': 'info@inmobiliariave.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Av. Francisco de Miranda',
      'addressLocality': 'Caracas',
      'addressRegion': 'Distrito Capital',
      'postalCode': '1060',
      'addressCountry': 'VE'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 10.4806,
      'longitude': -66.9036
    },
    'openingHours': 'Mo-Fr 08:00-18:00, Sa 09:00-14:00',
    'priceRange': '$$$',
    'areaServed': [
      {
        '@type': 'City',
        'name': 'Caracas'
      },
      {
        '@type': 'City',
        'name': 'Maracay'
      },
      {
        '@type': 'City',
        'name': 'Valencia'
      }
    ]
  }
}

export function generatePropertyStructuredData(property: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': property.title,
    'description': property.description,
    'image': property.images || [],
    'offers': {
      '@type': 'Offer',
      'price': property.price,
      'priceCurrency': property.currency,
      'availability': 'https://schema.org/InStock',
      'url': `https://inmobiliariave.com/propiedad/${property.id}`
    },
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'propertyType',
        'value': property.property_type
      },
      {
        '@type': 'PropertyValue',
        'name': 'location',
        'value': `${property.city}, ${property.state}`
      }
    ]
  }
}