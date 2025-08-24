'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Profile, profileService } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { clearAuthTokens, isAuthError, handleAuthError } from '@/lib/auth-utils'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nombre: string, ciudad: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      // Skip Supabase auth setup for development
      console.warn('⚠️ Supabase not configured, skipping auth setup')
      setLoading(false)
      return
    }

    // Get initial session with error handling
    supabase.auth.getSession()
      .then(async ({ data: { session }, error }) => {
        if (error) {
          console.error('Error getting session:', error)
          // Handle auth errors and clear invalid tokens
          if (isAuthError(error)) {
            handleAuthError(error)
            await supabase.auth.signOut()
          }
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        setUser(session?.user ?? null)
        if (session?.user) {
          loadProfile()
        } else {
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error('Auth session error:', error)
        setUser(null)
        setProfile(null)
        setLoading(false)
      })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email)
        
        // Handle sign out or token refresh errors
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadProfile()
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
        // Use mock profile for development
        setProfile(null)
        setLoading(false)
        return
      }

      const profileData = await profileService.getProfile()
      setProfile(profileData)
    } catch (error: unknown) {
      console.error('Error loading profile:', error)
      
      // Handle auth errors
      if (isAuthError(error)) {
        console.log('Auth token expired, signing out...')
        handleAuthError(error)
        await supabase.auth.signOut()
        setUser(null)
      }
      
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      // Mock login for development
      console.warn('⚠️ Supabase not configured, using mock authentication')
      
      // Simulate a successful login
      if (email && password) {
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          user_metadata: {
            nombre: 'Usuario Demo',
            ciudad: 'Caracas'
          }
        } as any
        
        setUser(mockUser)
        setProfile({
          id: 'mock-user-id',
          nombre: 'Usuario Demo',
          email: email,
          ciudad: 'Caracas',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        
        return
      } else {
        throw new Error('Email y contraseña son requeridos')
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, nombre: string, ciudad: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          ciudad
        }
      }
    })

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      // Mock logout for development
      console.warn('⚠️ Supabase not configured, using mock logout')
      setUser(null)
      setProfile(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      const updatedProfile = await profileService.updateProfile(profileData)
      setProfile(updatedProfile)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}