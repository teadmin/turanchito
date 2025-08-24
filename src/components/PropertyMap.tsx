'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Property } from '@/types/property'

interface PropertyMapProps {
  properties: Property[]
  center?: [number, number]
  zoom?: number
  height?: string
  onPropertySelect?: (property: Property) => void
}

// Fix for default markers in Next.js
const iconPrototype = L.Icon.Default.prototype as unknown as Record<string, unknown>
delete iconPrototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export function PropertyMap({ 
  properties, 
  center = [10.4806, -66.9036], // Caracas coordinates
  zoom = 10,
  height = '400px',
  onPropertySelect 
}: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Ensure proper initialization
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [])

  const formatPrice = (price: number, currency: 'VES' | 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'VES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {properties.map((property) => (
          property.latitude && property.longitude && (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  if (onPropertySelect) {
                    onPropertySelect(property)
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="text-lg font-bold text-blue-600 mb-2">
                    {formatPrice(property.price, property.currency)}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    📍 {property.city}
                  </p>
                  <button
                    onClick={() => window.open(`/propiedad/${property.id}`, '_blank')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  )
}