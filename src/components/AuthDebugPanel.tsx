'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { RefreshCw, Trash2, AlertCircle } from 'lucide-react'
import { clearAuthTokens } from '@/lib/auth-utils'
import { toast } from 'react-hot-toast'

export function AuthDebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const handleClearTokens = () => {
    try {
      clearAuthTokens()
      toast.success('tokens de autenticación limpiados')
      // Force reload to reset auth state
      window.location.reload()
    } catch (error) {
      toast.error('error al limpiar tokens')
      console.error(error)
    }
  }

  const handleForceLogout = () => {
    try {
      clearAuthTokens()
      localStorage.clear()
      sessionStorage.clear()
      toast.success('sesión completamente limpiada')
      window.location.href = '/'
    } catch (error) {
      toast.error('error al limpiar sesión')
      console.error(error)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
          title="Auth Debug Panel"
        >
          <AlertCircle className="h-4 w-4" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl border border-red-200 p-4 w-64">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h3 className="font-semibold text-sm">auth debug</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={handleClearTokens}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              limpiar tokens
            </Button>
            
            <Button
              onClick={handleForceLogout}
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              logout forzado
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            úsalo si tienes problemas de auth
          </p>
        </div>
      )}
    </div>
  )
}