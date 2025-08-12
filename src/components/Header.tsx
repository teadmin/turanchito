'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Phone, Search, User, Heart, LogOut, Plus } from 'lucide-react'
import { Button } from './ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, profile, signOut, loading } = useAuth()

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Comprar', href: '/comprar' },
    { name: 'Alquilar', href: '/alquilar' },
    { name: 'Caracas', href: '/caracas' },
    { name: 'Maracay', href: '/maracay' },
    { name: 'Valencia', href: '/valencia' },
    { name: 'Contacto', href: '/contacto' }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Home className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Miranchito</h1>
              <p className="text-sm text-gray-600">Tu hogar en Venezuela</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/buscar">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </Link>
            
            {user ? (
              <>
                <Link href="/publicar">
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Publicar
                  </Button>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.nombre || 'Usuario'}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Mi Perfil
                      </Link>
                      <Link
                        href="/favoritos"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="h-4 w-4" />
                        Mis Favoritos
                      </Link>
                      <Link
                        href="/mis-propiedades"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Home className="h-4 w-4" />
                        Mis Propiedades
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link href="/buscar" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </Link>
                
                {user ? (
                  <>
                    <Link href="/publicar" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full justify-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Publicar
                      </Button>
                    </Link>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        ¡Hola, {profile?.nombre || 'Usuario'}!
                      </p>
                      <div className="flex flex-col space-y-2">
                        <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            Mi Perfil
                          </Button>
                        </Link>
                        <Link href="/favoritos" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Heart className="h-4 w-4 mr-2" />
                            Mis Favoritos
                          </Button>
                        </Link>
                        <Link href="/mis-propiedades" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Home className="h-4 w-4 mr-2" />
                            Mis Propiedades
                          </Button>
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut()
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full text-left"
                        >
                          <Button variant="outline" size="sm" className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50">
                            <LogOut className="h-4 w-4 mr-2" />
                            Cerrar Sesión
                          </Button>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-center">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/registro" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full justify-center">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}