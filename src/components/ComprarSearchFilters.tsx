'use client'

import { useRouter } from 'next/navigation'
import { SearchFilters } from '@/components/SearchFilters'

interface ComprarSearchFiltersProps {
  initialFilters: {
    transaction_type: string
    city?: string
    state?: string
    property_type?: string
    min_price?: number
    max_price?: number
    bedrooms?: number
    bathrooms?: number
  }
}

export function ComprarSearchFilters({ initialFilters }: ComprarSearchFiltersProps) {
  const router = useRouter()

  const handleSearch = (newFilters: Record<string, string | number>) => {
    const params = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && key !== 'transaction_type') {
        params.append(key, value.toString())
      }
    })
    
    router.push(`/comprar?${params.toString()}`)
  }

  return (
    <SearchFilters 
      initialFilters={initialFilters}
      onSearch={handleSearch}
    />
  )
}