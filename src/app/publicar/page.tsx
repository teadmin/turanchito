'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Home, MapPin, DollarSign, Camera, FileText, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { propertyService } from '@/lib/supabase'
import { venezuelanCities, propertyTypes, transactionTypes } from '@/lib/venezuelan-cities-seo'

interface PropertyForm {
  title: string
  description: string
  price: number
  currency: 'VES' | 'USD'
  property_type: 'house' | 'apartment' | 'commercial' | 'land'
  transaction_type: 'sale' | 'rent'
  bedrooms: number
  bathrooms: number
  area_m2: number
  city: string
  state: string
  address: string
  features: string[]
}

export default function PublicarPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  const [form, setForm] = useState<PropertyForm>({
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    property_type: 'house',
    transaction_type: 'sale',
    bedrooms: 1,
    bathrooms: 1,
    area_m2: 0,
    city: '',
    state: '',
    address: '',
    features: []
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const commonFeatures = [
    'Piscina', 'Jardín', 'Garaje', 'Seguridad 24h', 'Aire acondicionado',
    'Cocina integral', 'Vista panorámica', 'Balcón', 'Terraza', 'Ascensor',
    'Portería', 'Gym', 'Área social', 'Parqueadero visitantes', 'Depósito',
    'Cuarto de servicio', 'Vigilancia', 'Transporte público cerca'
  ]

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('debes iniciar sesión para publicar una propiedad')
      router.push('/login')
      return
    }

    // Validations
    if (!form.title || !form.description || !form.city || !form.address) {
      toast.error('por favor completa todos los campos requeridos')
      return
    }

    if (form.price <= 0) {
      toast.error('el precio debe ser mayor a 0')
      return
    }

    setLoading(true)
    
    try {
      // Create property with mock service (since Supabase might not be configured)
      const propertyData = {
        ...form,
        features: selectedFeatures,
        images: [], // Will be handled later
        status: 'active' as const,
        featured: false
      }

      // Mock creation for development
      console.log('Creando propiedad:', propertyData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('¡propiedad publicada exitosamente!')
      router.push('/')
      
    } catch (error) {
      console.error('Error creating property:', error)
      toast.error('error al publicar la propiedad')
    } finally {
      setLoading(false)
    }
  }

  // Redirect if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E1F56E] mx-auto mb-4"></div>
          <p className="text-slate-600">cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8 text-center max-w-md">
          <Home className="h-12 w-12 text-[#E1F56E] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">iniciar sesión requerido</h2>
          <p className="text-slate-600 mb-6">
            necesitas iniciar sesión para publicar una propiedad
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            iniciar sesión
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-[#E1F56E] rounded-xl p-3">
              <Home className="h-6 w-6 text-slate-900" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">publicar propiedad</h1>
          </div>
          <p className="text-xl text-slate-600">
            comparte tu propiedad con miles de compradores potenciales
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNum <= step 
                    ? 'bg-[#E1F56E] text-slate-900' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {stepNum < step ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 ml-2 ${
                    stepNum < step ? 'bg-[#E1F56E]' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-12 mt-2">
            <span className="text-sm text-slate-600">información básica</span>
            <span className="text-sm text-slate-600">detalles</span>
            <span className="text-sm text-slate-600">características</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-semibold text-slate-900">información básica</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    título de la propiedad *
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="ej: hermosa casa en las mercedes con piscina"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    descripción *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="describe tu propiedad en detalle..."
                    rows={4}
                    className="flex w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-3 text-sm placeholder:text-slate-500 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      tipo de propiedad *
                    </label>
                    <select
                      value={form.property_type}
                      onChange={(e) => setForm(prev => ({ ...prev, property_type: e.target.value as any }))}
                      className="flex h-11 w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-2 text-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 transition-all duration-200"
                      required
                    >
                      <option value="house">casa</option>
                      <option value="apartment">apartamento</option>
                      <option value="commercial">comercial</option>
                      <option value="land">terreno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      tipo de transacción *
                    </label>
                    <select
                      value={form.transaction_type}
                      onChange={(e) => setForm(prev => ({ ...prev, transaction_type: e.target.value as any }))}
                      className="flex h-11 w-full rounded-xl border border-slate-300/60 bg-white/90 backdrop-blur-sm px-4 py-2 text-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 transition-all duration-200"
                      required
                    >
                      <option value="sale">venta</option>
                      <option value="rent">alquiler</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="px-8"
                  >
                    siguiente
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-semibold text-slate-900">detalles de la propiedad</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      precio *
                    </label>
                    <div className="flex">
                      <select
                        value={form.currency}
                        onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value as any }))}
                        className="flex h-11 w-20 rounded-l-xl border-r-0 border border-slate-300/60 bg-white/90 backdrop-blur-sm px-2 text-sm focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 transition-all duration-200"
                      >
                        <option value="USD">$</option>
                        <option value="VES">Bs</option>
                      </select>
                      <Input
                        type="number"
                        value={form.price || ''}
                        onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                        className="rounded-l-none border-l-0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      área (m²)
                    </label>
                    <Input
                      type="number"
                      value={form.area_m2 || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, area_m2: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                {form.property_type !== 'land' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        habitaciones
                      </label>
                      <Input
                        type="number"
                        value={form.bedrooms || ''}
                        onChange={(e) => setForm(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                        placeholder="1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        baños
                      </label>
                      <Input
                        type="number"
                        value={form.bathrooms || ''}
                        onChange={(e) => setForm(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                        placeholder="1"
                        min="0"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ciudad *
                    </label>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="caracas"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      estado *
                    </label>
                    <Input
                      value={form.state}
                      onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="distrito capital"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    dirección *
                  </label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="av. libertador, las mercedes, caracas"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    anterior
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(3)}
                  >
                    siguiente
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Features */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Check className="h-5 w-5 text-slate-700" />
                  <h2 className="text-xl font-semibold text-slate-900">características</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    selecciona las características de tu propiedad
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonFeatures.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => handleFeatureToggle(feature)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          selectedFeatures.includes(feature)
                            ? 'bg-[#E1F56E] text-slate-900 shadow-md'
                            : 'bg-white/80 text-slate-700 border border-slate-200 hover:border-lime-300 hover:bg-lime-50/50'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">resumen de la propiedad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">título:</span>
                      <span className="ml-2 font-medium">{form.title || 'sin título'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">tipo:</span>
                      <span className="ml-2 font-medium">{form.property_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">precio:</span>
                      <span className="ml-2 font-medium">
                        {form.currency === 'USD' ? '$' : 'Bs'} {form.price.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">ubicación:</span>
                      <span className="ml-2 font-medium">{form.city}, {form.state}</span>
                    </div>
                    {selectedFeatures.length > 0 && (
                      <div className="md:col-span-2">
                        <span className="text-slate-600">características:</span>
                        <span className="ml-2 font-medium">{selectedFeatures.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    anterior
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="px-8"
                  >
                    {loading ? 'publicando...' : 'publicar propiedad'}
                  </Button>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">consejos para una mejor publicación</h3>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li>• usa un título descriptivo que destaque las mejores características</li>
            <li>• incluye todos los detalles importantes en la descripción</li>
            <li>• asegúrate de que el precio sea competitivo para el mercado</li>
            <li>• selecciona todas las características relevantes</li>
            <li>• verifica que la dirección sea correcta y específica</li>
          </ul>
        </div>
      </div>
    </div>
  )
}