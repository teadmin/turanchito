import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto - InmobiliariaVE | Tu Experto en Bienes Raíces',
  description: 'Contáctanos para encontrar tu propiedad ideal en Venezuela. Atención personalizada, respuesta rápida y asesoría profesional en bienes raíces.',
  keywords: 'contacto inmobiliaria venezuela, asesoría bienes raices, consulta propiedades venezuela',
  openGraph: {
    title: 'Contacto - InmobiliariaVE',
    description: 'Contáctanos para encontrar tu propiedad ideal en Venezuela',
    type: 'website',
  },
  alternates: {
    canonical: 'https://inmobiliariave.com/contacto'
  }
}

export default function ContactoPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      details: ['+58 414-123-4567', '+58 212-987-6543'],
      description: 'Lun - Vie: 8:00 AM - 6:00 PM\nSáb: 9:00 AM - 2:00 PM'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@inmobiliariave.com', 'ventas@inmobiliariave.com'],
      description: 'Respuesta en menos de 2 horas\nTodos los días del año'
    },
    {
      icon: MapPin,
      title: 'Oficina Principal',
      details: ['Av. Francisco de Miranda', 'Torre Corp Banca, Piso 12'],
      description: 'Chacao, Caracas\nVenezuela 1060'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: ['+58 414-123-4567'],
      description: 'Chat en vivo disponible\n24/7 para emergencias'
    }
  ]

  const offices = [
    {
      city: 'Caracas',
      address: 'Av. Francisco de Miranda, Torre Corp Banca, Piso 12',
      phone: '+58 212-987-6543',
      hours: 'Lun - Vie: 8:00 AM - 6:00 PM'
    },
    {
      city: 'Maracay',
      address: 'Av. Bolívar Norte, Centro Comercial Maracay Plaza',
      phone: '+58 243-554-7890',
      hours: 'Lun - Vie: 8:00 AM - 5:00 PM'
    },
    {
      city: 'Valencia',
      address: 'Av. Universidad, C.C. Camoruco, Nivel 2',
      phone: '+58 241-678-9012',
      hours: 'Lun - Vie: 8:30 AM - 5:30 PM'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contacta con Nuestros Expertos
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Estamos aquí para ayudarte a encontrar la propiedad perfecta. 
              Nuestro equipo de profesionales te brindará atención personalizada.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  ¿Cómo podemos ayudarte?
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas. 
                  También puedes llamarnos directamente o visitarnos en nuestras oficinas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 p-3 rounded-lg">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 ml-4">
                        {item.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-blue-600 font-medium">
                          {detail}
                        </p>
                      ))}
                      <p className="text-gray-600 text-sm whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestras Oficinas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visítanos en cualquiera de nuestras oficinas en las principales ciudades de Venezuela
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {office.city}
                </h3>
                <p className="text-gray-600 mb-3">
                  {office.address}
                </p>
                <p className="text-blue-600 font-medium mb-2">
                  {office.phone}
                </p>
                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {office.hours}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas Ayuda Inmediata?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está disponible para atender tus consultas urgentes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+584141234567" 
              className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Llamar Ahora
            </a>
            <a 
              href="https://wa.me/584141234567" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}