'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react'
import { formatPrice, formatArea } from '@/lib/utils'
import { favoriteService } from '@/lib/supabase'
import type { Property } from '@/types/property'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface PropertyCardProps {
  property: Property
  showFavorite?: boolean
  onFavoriteChange?: (isFavorite: boolean) => void
}

export function PropertyCard({ property, showFavorite = true, onFavoriteChange }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const defaultImage = '/api/placeholder/400/300'
  const propertyImage = property.images?.[0] || defaultImage
  
  useEffect(() => {
    if (showFavorite) {
      checkFavoriteStatus()
    }
  }, [property.id, showFavorite])
  
  const checkFavoriteStatus = async () => {
    try {
      const favorited = await favoriteService.isFavorited(property.id)
      setIsFavorited(favorited)
    } catch (error) {
      // Silent fail - user might not be logged in
    }
  }
  
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading) return
    
    setLoading(true)
    try {
      if (isFavorited) {
        await favoriteService.removeFromFavorites(property.id)
        setIsFavorited(false)
        toast.success('Eliminado de favoritos')
        onFavoriteChange?.(false)
      } else {
        await favoriteService.addToFavorites(property.id)
        setIsFavorited(true)
        toast.success('Agregado a favoritos')
        onFavoriteChange?.(true)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('no autenticado')) {
        toast.error('Inicia sesión para guardar favoritos')
      } else {
        toast.error('Error al actualizar favoritos')
      }
    } finally {
      setLoading(false)
    }
  }
  
  const typeLabels = {
    house: 'Casa',
    apartment: 'Apartamento', 
    commercial: 'Comercial',
    land: 'Terreno'
  }
  
  const transactionLabels = {
    sale: 'Venta',
    rent: 'Alquiler'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <div className="relative h-64 w-full">
          <Image
            src={propertyImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {property.featured && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
            Destacada
          </div>
        )}
        
        {showFavorite && (
          <div 
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 cursor-pointer hover:bg-white transition-colors"
            onClick={handleFavoriteToggle}
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isFavorited 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              } ${loading ? 'opacity-50' : ''}`} 
            />
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {transactionLabels[property.transaction_type]}
          </span>
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {typeLabels[property.property_type]}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            <Link href={`/propiedades/${property.id}`}>
              {property.title}
            </Link>
          </h3>
          <div className="text-2xl font-bold text-blue-600 ml-2">
            {formatPrice(property.price, property.currency)}
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.city}, {property.state}</span>
        </div>
        
        {(property.bedrooms || property.bathrooms || property.area_m2) && (
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            )}
            {property.area_m2 && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatArea(property.area_m2)}</span>
              </div>
            )}
          </div>
        )}
        
        <Link href={`/propiedades/${property.id}`}>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Ver Detalles
          </button>
        </Link>
      </div>
    </div>
  )
}