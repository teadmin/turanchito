import Link from 'next/link'
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = {
    properties: {
      title: 'Propiedades',
      links: [
        { name: 'Casas en Venta Caracas', href: '/vender-casa-en-caracas' },
        { name: 'Apartamentos en Venta Caracas', href: '/vender-apartamento-en-caracas' },
        { name: 'Casas en Venta Maracay', href: '/vender-casa-en-maracay' },
        { name: 'Apartamentos en Venta Maracay', href: '/vender-apartamento-en-maracay' },
        { name: 'Propiedades en Alquiler', href: '/alquiler' },
        { name: 'Propiedades Destacadas', href: '/destacadas' }
      ]
    },
    cities: {
      title: 'Ciudades',
      links: [
        { name: 'Caracas', href: '/caracas' },
        { name: 'Maracay', href: '/maracay' },
        { name: 'Valencia', href: '/valencia' },
        { name: 'Maracaibo', href: '/maracaibo' },
        { name: 'Barquisimeto', href: '/barquisimeto' },
        { name: 'Todas las ciudades', href: '/ciudades' }
      ]
    },
    company: {
      title: 'Empresa',
      links: [
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Blog', href: '/blog' },
        { name: 'Consejos', href: '/consejos' },
        { name: 'Preguntas Frecuentes', href: '/faq' },
        { name: 'Política de Privacidad', href: '/privacidad' }
      ]
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-blue-600 rounded-lg p-2">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">InmobiliariaVE</h3>
                <p className="text-sm text-gray-300">Tu hogar en Venezuela</p>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 text-sm">
              La plataforma inmobiliaria líder en Venezuela. Conectamos compradores, 
              vendedores e inquilinos con las mejores propiedades del país.
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-sm">+58 414-123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3 text-blue-400" />
                <span className="text-sm">info@inmobiliariave.com</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="h-4 w-4 mr-3 text-blue-400 mt-1" />
                <span className="text-sm">Av. Francisco de Miranda<br />Caracas, Venezuela</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{footerSections.properties.title}</h4>
            <ul className="space-y-3">
              {footerSections.properties.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{footerSections.cities.title}</h4>
            <ul className="space-y-3">
              {footerSections.cities.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">{footerSections.company.title}</h4>
            <ul className="space-y-3 mb-6">
              {footerSections.company.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div>
              <h5 className="text-sm font-semibold mb-3 text-gray-300">Síguenos</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} InmobiliariaVE. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terminos" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Términos de Uso
              </Link>
              <Link href="/privacidad" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Privacidad
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}