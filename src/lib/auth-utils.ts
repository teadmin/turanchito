/**
 * Utility functions for handling authentication errors and token cleanup
 */

export function clearAuthTokens() {
  // Clear localStorage tokens that might be corrupted
  if (typeof window !== 'undefined') {
    try {
      // Clear Supabase tokens
      localStorage.removeItem('sb-' + (process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'localhost') + '-auth-token')
      
      // Clear any other auth-related localStorage items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') && (key.includes('auth') || key.includes('token'))) {
          localStorage.removeItem(key)
        }
      })
      
      console.log('🧹 Cleared authentication tokens from localStorage')
    } catch (error) {
      console.error('Error clearing auth tokens:', error)
    }
  }
}

export function isAuthError(error: unknown): boolean {
  const authError = error as { message?: string }
  if (!authError?.message) return false
  
  const authErrorMessages = [
    'refresh_token_not_found',
    'Invalid Refresh Token',
    'JWT expired',
    'invalid_token',
    'token_expired',
    'Refresh Token Not Found'
  ]
  
  return authErrorMessages.some(msg => 
    authError.message?.toLowerCase().includes(msg.toLowerCase())
  )
}

export function handleAuthError(error: unknown) {
  if (isAuthError(error)) {
    console.warn('🔐 Authentication error detected:', (error as { message?: string })?.message)
    clearAuthTokens()
    
    // Optionally redirect to login
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/registro' && currentPath !== '/') {
        console.log('↩️ Redirecting to login due to auth error')
        window.location.href = '/login'
      }
    }
  }
}