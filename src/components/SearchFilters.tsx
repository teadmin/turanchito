'use client'

import { useState } from 'react'
import { Search, MapPin, Home, DollarSign, SlidersHorizontal } from 'lucide-react'
import { venezuelanCities, propertyTypes, transactionTypes } from '@/lib/venezuelan-cities-seo'

interface SearchFilters {
  search?: string
  city?: string
  state?: string
  property_type?: string
  transaction_type?: string
  price_min?: number
  price_max?: number
  bedrooms?: number
  currency?: 'VES' | 'USD'
}

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
}

export function SearchFilters({ onSearch, initialFilters = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const clearFilters = () => {
    const clearedFilters = {}
    setFilters(clearedFilters)
    onSearch(clearedFilters)
  }

  const priceRanges = [
    { label: 'Hasta $50,000', min: 0, max: 50000 },
    { label: '$50,000 - $100,000', min: 50000, max: 100000 },
    { label: '$100,000 - $200,000', min: 100000, max: 200000 },
    { label: '$200,000 - $500,000', min: 200000, max: 500000 },
    { label: 'Más de $500,000', min: 500000, max: undefined }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Basic Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por ubicación, tipo de propiedad..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Operación
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.transaction_type || ''}
              onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
            >
              <option value="">Todas</option>
              {transactionTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Propiedad
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.property_type || ''}
              onChange={(e) => handleFilterChange('property_type', e.target.value)}
            >
              <option value="">Todas</option>
              {propertyTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">Todas las ciudades</option>
              {venezuelanCities.map((city) => (
                <option key={city.slug} value={city.city}>
                  {city.city}, {city.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habitaciones
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">Cualquier cantidad</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
            >
              Limpiar filtros
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.currency || ''}
                  onChange={(e) => handleFilterChange('currency', e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="USD">Dólares (USD)</option>
                  <option value="VES">Bolívares (VES)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio mínimo
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.price_min || ''}
                  onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio máximo
                </label>
                <input
                  type="number"
                  placeholder="Sin límite"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.price_max || ''}
                  onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Quick Price Ranges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rangos de precio populares
              </label>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      handleFilterChange('price_min', range.min)
                      handleFilterChange('price_max', range.max)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}