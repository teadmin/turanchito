'use client'

import { useRouter } from 'next/navigation'
import { SearchFilters } from '@/components/SearchFilters'

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

  const handleSearch = (filters: Record<string, string | number>) => {
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