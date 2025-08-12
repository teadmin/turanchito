'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Phone, Search, User, Heart, LogOut, Plus } from 'lucide-react'
import { Button } from './ui/Button'
import { SiteSwitcher } from './SiteSwitcher'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, profile, signOut, loading } = useAuth()

  const navigation = [
    { name: 'Comprar', href: '/comprar' },
    { name: 'Alquilar', href: '/alquilar' },
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
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-[#E1F574] rounded-xl p-2.5 shadow-lg border border-[#D4ED4A]/30">
              <Home className="h-7 w-7 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">turanchito</h1>
              <p className="text-sm text-slate-600">tu hogar en venezuela</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E1F574] after:transition-all hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <SiteSwitcher />
            
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
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200"
                  >
                    <User className="h-5 w-5 text-slate-700" />
                    <span className="text-sm font-medium text-slate-700">
                      {profile?.nombre || 'Usuario'}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/60 py-2 z-50">
                      <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50/80 transition-colors rounded-lg mx-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Mi Perfil
                      </Link>
                      <Link
                        href="/favoritos"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50/80 transition-colors rounded-lg mx-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="h-4 w-4" />
                        Mis Favoritos
                      </Link>
                      <Link
                        href="/mis-propiedades"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50/80 transition-colors rounded-lg mx-2"
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
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-[#F0F9A3]/30 transition-all duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/60 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200/60">
                <div className="mb-2">
                  <SiteSwitcher />
                </div>
                
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
                    <div className="pt-2 border-t border-slate-200/60">
                      <p className="text-sm font-medium text-slate-700 mb-2">
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
                          <Button variant="outline" size="sm" className="w-full justify-start text-red-600 border-red-300/60 hover:bg-red-50/80 hover:border-red-400/60">
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