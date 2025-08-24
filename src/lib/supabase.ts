import { createClient } from '@supabase/supabase-js'

// Verificar que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validación de variables de entorno
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [Supabase] Variables de entorno faltantes:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Presente' : '❌ Faltante')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Presente' : '❌ Faltante')
  
  // En desarrollo, mostrar instrucciones
  if (process.env.NODE_ENV === 'development') {
    console.error('📝 Para configurar Supabase:')
    console.error('   1. Crea un archivo .env.local en la raíz del proyecto')
    console.error('   2. Agrega las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.error('   3. Reinicia el servidor de desarrollo')
  }
  
  // En producción, lanzar error
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
  }
}

// Usar valores por defecto para desarrollo si no están configurados
const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'placeholder-key'

export const supabase = createClient(
  supabaseUrl || defaultUrl, 
  supabaseAnonKey || defaultKey
)

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          description: string
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
          features: string[]
          status: 'active' | 'sold' | 'inactive'
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
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
          images?: string[]
          features?: string[]
          status?: 'active' | 'sold' | 'inactive'
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          price_usd?: number
          currency?: 'VES' | 'USD'
          property_type?: 'house' | 'apartment' | 'commercial' | 'land'
          transaction_type?: 'sale' | 'rent'
          bedrooms?: number
          bathrooms?: number
          area_m2?: number
          city?: string
          state?: string
          address?: string
          latitude?: number
          longitude?: number
          images?: string[]
          features?: string[]
          status?: 'active' | 'sold' | 'inactive'
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          message: string
          property_id?: string
          property_interest: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          message: string
          property_id?: string
          property_interest: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          property_id?: string
          property_interest?: string
          created_at?: string
        }
      }
    }
    profiles: {
      Row: {
        id: string
        nombre: string
        email: string
        telefono?: string
        ciudad: string
        created_at: string
        updated_at: string
      }
      Insert: {
        id: string
        nombre: string
        email: string
        telefono?: string
        ciudad: string
        created_at?: string
        updated_at?: string
      }
      Update: {
        nombre?: string
        telefono?: string
        ciudad?: string
        updated_at?: string
      }
    }
    favorites: {
      Row: {
        id: number
        usuario_id: string
        property_id: string
        created_at: string
      }
      Insert: {
        usuario_id: string
        property_id: string
        created_at?: string
      }
      Update: {
        created_at?: string
      }
    }
  }
}

export type Property = Database['public']['Tables']['properties']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
// export type Profile = Database['public']['Tables']['profiles']['Row']
// export type Favorite = Database['public']['Tables']['favorites']['Row']

// Temporary types while schema is incomplete
export interface Profile {
  id: string
  nombre: string
  email: string
  ciudad: string
  created_at?: string
  updated_at?: string
}

export interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at?: string
}

// Property service
export const propertyService = {
  // Get all properties with pagination
  async getProperties(limit = 20, offset = 0) {
    const { data, error, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { properties: data, total: count }
  },

  // Get featured properties
  async getFeaturedProperties(limit = 8) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Get property by ID
  async getPropertyById(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error) throw error
    return data
  },

  // Search properties
  async searchProperties(query: {
    city?: string
    state?: string
    property_type?: string
    transaction_type?: string
    price_min?: number
    price_max?: number
    bedrooms?: number
    search?: string
  }, limit = 20, offset = 0) {
    let queryBuilder = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'active')

    if (query.city) {
      queryBuilder = queryBuilder.ilike('city', `%${query.city}%`)
    }
    if (query.state) {
      queryBuilder = queryBuilder.ilike('state', `%${query.state}%`)
    }
    if (query.property_type) {
      queryBuilder = queryBuilder.eq('property_type', query.property_type)
    }
    if (query.transaction_type) {
      queryBuilder = queryBuilder.eq('transaction_type', query.transaction_type)
    }
    if (query.price_min) {
      queryBuilder = queryBuilder.gte('price', query.price_min)
    }
    if (query.price_max) {
      queryBuilder = queryBuilder.lte('price', query.price_max)
    }
    if (query.bedrooms) {
      queryBuilder = queryBuilder.gte('bedrooms', query.bedrooms)
    }
    if (query.search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query.search}%,description.ilike.%${query.search}%,address.ilike.%${query.search}%`)
    }

    const { data, error, count } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { properties: data, total: count }
  },

  // Get properties by city
  async getPropertiesByCity(city: string, limit = 20, offset = 0) {
    const { data, error, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .ilike('city', `%${city}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { properties: data, total: count }
  }
}

// Lead service
export const leadService = {
  async createLead(leadData: Database['public']['Tables']['leads']['Insert']) {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Profile service
export const profileService = {
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data
  },

  async updateProfile(profileData: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Favorites service
export const favoriteService = {
  async addToFavorites(propertyId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        usuario_id: user.id,
        property_id: propertyId
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeFromFavorites(propertyId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('usuario_id', user.id)
      .eq('property_id', propertyId)

    if (error) throw error
    return { success: true }
  },

  async getFavoriteProperties() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        properties:property_id (*)
      `)
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async isFavorited(propertyId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('property_id', propertyId)
      .single()

    if (error) return false
    return !!data
  }
}