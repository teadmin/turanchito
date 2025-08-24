export interface Property {
  id: string
  title: string
  description?: string
  price: number
  price_usd?: number
  currency: 'VES' | 'USD'
  property_type: 'house' | 'apartment' | 'commercial' | 'land'
  transaction_type: 'sale' | 'rent'
  bedrooms?: number
  bathrooms?: number
  area_m2?: number
  city: string
  state: string
  address: string
  latitude?: number
  longitude?: number
  images: string[]
  featured: boolean
  status?: 'active' | 'sold' | 'rented' | 'inactive'
  features?: string[]
  created_at?: string
  updated_at?: string
  user_id?: string
}

export interface SearchFilters {
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