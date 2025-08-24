'use client'

import { useRouter } from 'next/navigation'
import { SearchFilters } from '@/components/SearchFilters'

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

interface DynamicPageSearchFiltersProps {
  initialFilters: {
    city?: string
    state?: string
    property_type?: string
    transaction_type?: string
  }
}

export function DynamicPageSearchFilters({ initialFilters }: DynamicPageSearchFiltersProps) {
  const router = useRouter()

  const handleSearch = (filters: SearchFilters) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString())
    })
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <SearchFilters 
      initialFilters={initialFilters}
      onSearch={handleSearch}
    />
  )
}