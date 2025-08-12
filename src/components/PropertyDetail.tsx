'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Share2, 
  Phone, 
  Mail,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Calendar,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Property } from '@/lib/supabase'
import { formatPrice, formatArea } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface PropertyDetailProps {
  property: Property
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const { user } = useAuth()

  const images = property.images.length > 0 ? property.images : ['/placeholder-house-1.jpg']

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('debes iniciar sesión para guardar favoritos')
      return
    }
    
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'eliminado de favoritos' : 'agregado a favoritos')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('enlace copiado al portapapeles')
    }
  }

  const handleContact = () => {
    setShowContactForm(true)
  }

  const propertyTypeLabel = {
    house: 'casa',
    apartment: 'apartamento',
    commercial: 'comercial',
    land: 'terreno'
  }[property.property_type] || property.property_type

  const transactionTypeLabel = {
    sale: 'venta',
    rent: 'alquiler'
  }[property.transaction_type] || property.transaction_type

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/comprar"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            volver a propiedades
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={images[currentImageIndex]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-house-1.jpg'
                  }}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorited 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-white/90 text-slate-700 hover:bg-white rounded-full transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
                          ? 'border-[#E1F56E]' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} - ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-house-1.jpg'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#E1F56E] text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {transactionTypeLabel}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    {propertyTypeLabel}
                  </span>
                  {property.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      destacada
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  {property.title}
                </h1>
                
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}</span>
                </div>

                <div className="text-4xl font-bold text-slate-900">
                  {formatPrice(property.price, property.currency)}
                  {property.transaction_type === 'rent' && (
                    <span className="text-lg font-normal text-slate-600">/mes</span>
                  )}
                </div>
              </div>

              {/* Property Stats */}
              {property.property_type !== 'land' && (
                <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-slate-50 rounded-xl">
                  {property.bedrooms && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Bed className="h-5 w-5 text-slate-600" />
                        <span className="text-2xl font-bold text-slate-900">{property.bedrooms}</span>
                      </div>
                      <p className="text-sm text-slate-600">habitaciones</p>
                    </div>
                  )}
                  
                  {property.bathrooms && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Bath className="h-5 w-5 text-slate-600" />
                        <span className="text-2xl font-bold text-slate-900">{property.bathrooms}</span>
                      </div>
                      <p className="text-sm text-slate-600">baños</p>
                    </div>
                  )}
                  
                  {property.area_m2 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Square className="h-5 w-5 text-slate-600" />
                        <span className="text-2xl font-bold text-slate-900">{formatArea(property.area_m2)}</span>
                      </div>
                      <p className="text-sm text-slate-600">área</p>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">descripción</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">características</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#E1F56E]" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Contact Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">contactar vendedor</h3>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleContact}
                  className="w-full justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  contactar ahora
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  enviar mensaje
                </Button>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#E1F56E] rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">agente turanchito</p>
                    <p className="text-sm text-slate-600">especialista en propiedades</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  respuesta garantizada en menos de 24 horas
                </p>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">detalles</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">id propiedad:</span>
                  <span className="text-slate-900 font-medium">{property.id.slice(0, 8)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">tipo:</span>
                  <span className="text-slate-900 font-medium">{propertyTypeLabel}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">transacción:</span>
                  <span className="text-slate-900 font-medium">{transactionTypeLabel}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">ciudad:</span>
                  <span className="text-slate-900 font-medium">{property.city}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">estado:</span>
                  <span className="text-slate-900 font-medium">{property.state}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">publicada:</span>
                  <span className="text-slate-900 font-medium">
                    {new Date(property.created_at).toLocaleDateString('es-VE')}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Properties CTA */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">¿buscas algo similar?</h3>
              <p className="text-slate-300 text-sm mb-4">
                encuentra más propiedades como esta en {property.city}
              </p>
              <Link href={`/comprar?city=${encodeURIComponent(property.city)}&property_type=${property.property_type}`}>
                <Button variant="outline" className="w-full bg-transparent border-white text-white hover:bg-white/10">
                  ver propiedades similares
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}