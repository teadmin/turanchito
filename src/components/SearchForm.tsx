import { useState } from 'react'
import { Search, MapPin, Home, DollarSign } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
}

export interface SearchFilters {
  city?: string
  propertyType?: string
  transactionType?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
}

const venezuelanCities = [
  'Caracas', 'Maracaibo', 'Valencia', 'Maracay', 'Barquisimeto',
  'Ciudad Guayana', 'Maturín', 'Barcelona', 'Cumaná', 'Mérida',
  'San Cristóbal', 'Cabimas', 'Turmero', 'Punto Fijo', 'Los Teques'
]

const propertyTypes = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'land', label: 'Terreno' }
]

const transactionTypes = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' }
]

export function SearchForm({ onSearch, initialFilters = {} }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const updateFilter = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={filters.city || ''}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Todas las ciudades</option>
            {venezuelanCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={filters.propertyType || ''}
            onChange={(e) => updateFilter('propertyType', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Tipo de propiedad</option>
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={filters.transactionType || ''}
            onChange={(e) => updateFilter('transactionType', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Venta o Alquiler</option>
            {transactionTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <Button type="submit" className="flex items-center justify-center gap-2">
          <Search className="h-5 w-5" />
          Buscar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="number"
          placeholder="Precio mínimo (USD)"
          value={filters.minPrice || ''}
          onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
        />
        
        <Input
          type="number"
          placeholder="Precio máximo (USD)"
          value={filters.maxPrice || ''}
          onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
        />
        
        <select
          value={filters.bedrooms || ''}
          onChange={(e) => updateFilter('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">Habitaciones</option>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}+ habitaciones</option>
          ))}
        </select>
        
        <select
          value={filters.bathrooms || ''}
          onChange={(e) => updateFilter('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">Baños</option>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}+ baños</option>
          ))}
        </select>
      </div>
    </form>
  )
}